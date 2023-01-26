import { assertNever } from "@songbird/precedent-iso";
import crypto from "crypto";
import express from "express";
import { z } from "zod";

import { LOGGER } from "../logger";
import type { FormSubmissionService } from "../services/form-submission-service";
import { SETTINGS } from "../settings";

export class FormSubmissionRouter {
  constructor(private readonly formSubmissionService: FormSubmissionService) {}

  init() {
    const router = express.Router();

    router.get(
      "/form-config/:slug",
      async (req: express.Request, res: express.Response) => {
        const slug = req.params.slug;

        switch (slug) {
          case "check_insurance_coverage":
            res.send({
              data: SETTINGS.formsort.config.checkInsuranceCoverage,
            });
            break;
          case "submit_records":
            res.send({
              data: SETTINGS.formsort.config.submitRecords,
            });
            break;
          default:
            throw Error("unrecognized slug");
        }
      }
    );

    router.get(
      "/form-config/submit-records",
      validateSignatureMiddleware,
      async (_: express.Request, res: express.Response) => {
        res.send({
          data: SETTINGS.formsort.config.submitRecords,
        });
      }
    );

    router.post(
      "/post-onboarding",
      validateSignatureMiddleware,
      async (req: express.Request, res: express.Response) => {
        await this.formSubmissionService.insert(
          this.formSubmissionService.parse(req.body)
        );
        res.send("ok");
      }
    );

    router.post(
      "/onboarding-callback",
      validateSignatureMiddleware,
      async (req: express.Request, res: express.Response) => {
        const parsed = this.formSubmissionService.parse(req.body);
        const parsedAnswers = ZSignupAnswers.parse(parsed.answers);
        await this.formSubmissionService.insert(parsed, {
          email: parsedAnswers.email_address,
          applicationSlug: "signup",
        });

        res.send("ok");
      }
    );

    return router;
  }
}

const ZSignupAnswers = z.object({
  email_address: z.string(),
});

type SignatureValidResult = "valid" | "invalid" | "pass";
interface SignatureValidArguments {
  signature: string | undefined;
  signingKey: string | undefined;
  body: Buffer;
}

function validateSignature({
  signature,
  signingKey,
  body,
}: SignatureValidArguments): SignatureValidResult {
  if (signature === undefined || signingKey === undefined) {
    return "pass";
  }

  const hash = crypto
    .createHmac("sha256", signingKey)
    .update(body.toString(), "utf8")
    .digest("base64")
    .replace(/=+$/g, "")
    .replaceAll("/", "_")
    .replaceAll("+", "-");

  if (hash === signature) {
    return "valid";
  }
  LOGGER.warn(`The difference is ${hash} vs ${signature}`);
  return "invalid";
}

async function validateSignatureMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> {
  const validationResult = validateSignature({
    signingKey: SETTINGS.formsort.signingKey,
    signature: req.headers["x-formsort-signature"] as string | undefined,
    body: req.rawBody,
  });

  switch (validationResult) {
    case "valid":
    case "pass":
      next();
      break;
    case "invalid":
      {
        res.status(400).json({
          status: "ERROR",
          message: "Could not validate webhook result",
        });
        res.end();
      }
      break;
    default:
      assertNever(validationResult);
  }
}

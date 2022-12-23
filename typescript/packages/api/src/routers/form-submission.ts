import { assertNever } from "@songbird/precedent-iso";
import crypto from "crypto";
import express from "express";

import type { FormSubmissionService } from "../services/form-submission-service";
import { SETTINGS } from "../settings";

export class FormSubmissionRouter {
  constructor(private readonly svc: FormSubmissionService) {}

  init() {
    const router = express.Router();

    router.post(
      "/callback",
      async (req: express.Request, res: express.Response) => {
        const validationResult = validateSignature({
          signingKey: SETTINGS.formsort.signingKey,
          signature: req.headers["x-formsort-signature"] as string | undefined,
          body: req.rawBody,
        });

        switch (validationResult) {
          case "valid":
          case "pass":
            break;
          case "invalid":
            {
              res.status(400).json({
                status: "ERROR",
                message: "Could not validate webhook result",
              });
              res.end();
            }
            return;

          default:
            assertNever(validationResult);
        }

        try {
          await this.svc.insert({ raw: req.body });

          res.json({ status: "OK" });
        } catch (e: unknown) {
          console.error(e);
          res.status(400).json({
            status: "ERROR",
            message: (e as { message: string }).message,
          });
          res.end();
        }
      }
    );

    return router;
  }
}

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
  console.log(`The difference is ${hash} vs ${signature}`);
  return "invalid";
}

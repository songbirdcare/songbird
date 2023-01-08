import { assertNever } from "@songbird/precedent-iso";
import { z } from "zod";
import crypto from "crypto";
import express from "express";

import type { Auth0Service } from "../services/auth0/auth0-service";
import type { FormSubmissionService } from "../services/form-submission-service";
import type { UserService } from "../services/user-service";
import { SETTINGS } from "../settings";

export class FormSubmissionRouter {
  constructor(
    private readonly formSubmissionService: FormSubmissionService,
    private readonly auth0Service: Auth0Service,
    private readonly userService: UserService
  ) {}

  init() {
    const router = express.Router();

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
        console.log("Parsing form");
        const parsedForm = this.formSubmissionService.parse(req.body);

        const withEmail = ZFormWithEmail.parse(parsedForm.answers);
        const email = withEmail.email_address;

        await this.formSubmissionService.insert(parsedForm, { email });
        console.log("Creating Auth0 user");
        const { user } = await this.auth0Service.createUser(email);

        await this.userService.upsert({
          email,
          sub: user.sub,
          emailVerified: true,
        });

        if (user.connectionType === "auth0") {
          console.log(`Sending email to ${email}`);
          await this.auth0Service.sendPasswordReset(email);
        }
        res.json({ status: "OK" });
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
const ZFormWithEmail = z.object({
  email_address: z.string(),
});

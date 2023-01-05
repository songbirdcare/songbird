import { assertNever } from "@songbird/precedent-iso";
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

        console.log("Parsing form");
        const parsedForm = this.formSubmissionService.parse(req.body);
        console.log("Inserting form");
        const form = await this.formSubmissionService.insert(parsedForm);
        console.log("Creating Auth0 user");
        const { user } = await this.auth0Service.createUser(form.email);

        await this.userService.upsert({
          email: form.email,
          sub: user.sub,
          emailVerified: true,
        });

        if (user.connectionType === "auth0") {
          console.log(`Sending email to ${form.email}`);
          await this.auth0Service.sendPasswordReset(form.email);
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

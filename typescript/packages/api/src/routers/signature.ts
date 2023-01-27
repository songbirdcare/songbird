import express from "express";
import { z } from "zod";

import { LOGGER } from "../logger";
import type { SignatureSubmissionService } from "../services/signature-submission-service";

// I have no idea why but,
// docusign returns us signers object
// with single quotes
const REPLACE_SINGLE_QUOTES_REGEX =
  /('(?=(,\s*')))|('(?=:))|((?<=([:,]\s*))')|((?<={)')|('(?=}))/g;

export class SignatureRouter {
  constructor(private readonly svc: SignatureSubmissionService) {}

  init() {
    const router = express.Router();

    router.post(
      "/event",
      async (req: express.Request, res: express.Response) => {
        LOGGER.info("Signature event");
        const parsed = ZSignaturePayload.parse(req.body);
        const signers = parsed.recipients.signers;
        const withoutDoubleQuotes = signers.replace(
          REPLACE_SINGLE_QUOTES_REGEX,
          '"'
        );
        const parsedSigners = ZSigners.parse(JSON.parse(withoutDoubleQuotes));

        await this.svc.insert({
          raw: req.body,
          envelopeId: parsed.envelopeId,
          emailSubject: parsed.info.emailSubject,
          eventCreatedAt: parsed.info.createdDateTime,
          status: parsed.status,
          counterPartyEmail: tryGetCounterpartyEmail(parsedSigners),
        });

        res.send("ok");
      }
    );

    return router;
  }
}

// it does not seem like Docusign returns a good counterparty field
// here we do our best to guess a counterparty email
function tryGetCounterpartyEmail(signers: ZSigners): string | undefined {
  const nonSongbirdEmail = signers
    .map((row) => row.email)
    .find((row) => !row.endsWith("@songbirdcare.com"));

  if (nonSongbirdEmail) {
    return nonSongbirdEmail;
  }

  const nonTeamMember = signers.find((row) => {
    return (
      row.roleName === undefined || !row.roleName.startsWith("Family Team")
    );
  })?.email;

  if (nonTeamMember) {
    return nonTeamMember;
  }

  const lastSigner = signers.at(-1);
  return lastSigner?.email;
}

export const ZSignaturePayload = z.object({
  documentsFileUrl: z.string(),
  envelopeId: z.string(),
  id: z.string(),
  info: z.object({
    emailSubject: z.string(),
    createdDateTime: z.string(),
  }),
  recipients: z.object({
    signers: z.string(),
  }),
  status: z.string(),
});

export const ZSigners = z.array(
  z.object({
    email: z.string(),
    roleName: z.string().optional(),
  })
);

type ZSigners = z.infer<typeof ZSigners>;

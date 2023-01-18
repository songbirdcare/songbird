import { DatabasePool, sql } from "slonik";
import { z } from "zod";

export class PsqlSignatureSubmissionService
  implements SignatureSubmissionService
{
  constructor(private readonly pool: DatabasePool) {}

  async get({
    counterPartyEmail,
    emailSubjectStartsWith,
    status,
  }: GetSignatureSubmission): Promise<Signature | undefined> {
    return this.pool.connect(async (connection) => {
      const value = await connection.maybeOne(sql.type(ZSqlSignature)`
SELECT
    raw,
    envelope_id,
    email_subject,
    counterparty_email,
    status,
    event_created_at
FROM
    signature_submissions
WHERE
    status = ${status}
    AND LOWER(counterparty_email) = ${counterPartyEmail.toLowerCase()}
    AND email_subject LIKE ${"%" + emailSubjectStartsWith + "%"}
`);

      return value ? fromSQL(value) : undefined;
    });
  }

  async insert({
    raw,
    envelopeId,
    emailSubject,
    eventCreatedAt,
    counterPartyEmail,
    status,
  }: Signature): Promise<void> {
    await this.pool.connect(async (connection) =>
      connection.query(
        sql.unsafe`
INSERT INTO signature_submissions (raw, envelope_id, email_subject, event_created_at, counterparty_email, status)
    VALUES (${JSON.stringify(
      raw
    )}, ${envelopeId}, ${emailSubject}, ${eventCreatedAt}, ${
          counterPartyEmail ?? null
        }, ${status})
`
      )
    );
  }
}

export interface SignatureSubmissionService {
  get: (args: GetSignatureSubmission) => Promise<Signature | undefined>;
  insert: (form: Signature) => Promise<void>;
}

interface GetSignatureSubmission {
  counterPartyEmail: string;
  emailSubjectStartsWith: string;
  status: "sent" | "completed";
}

const ZSqlSignature = z.object({
  envelope_id: z.string(),
  email_subject: z.string(),
  counterparty_email: z.string().optional(),
  status: z.string(),
  event_created_at: z.string(),
  raw: z.string(),
});

type SqlSignature = z.infer<typeof ZSqlSignature>;

function fromSQL(args: SqlSignature): Signature {
  return {
    raw: args.raw as any,
    envelopeId: args.envelope_id,
    emailSubject: args.email_subject,
    eventCreatedAt: args.event_created_at,
    counterPartyEmail: args.counterparty_email,
    status: args.status,
  };
}

interface Signature {
  raw: Record<string, unknown>;
  envelopeId: string;
  emailSubject: string;
  eventCreatedAt: string;
  counterPartyEmail: string | undefined;
  // what are the other statuses?
  status: "sent" | "completed" | string;
}

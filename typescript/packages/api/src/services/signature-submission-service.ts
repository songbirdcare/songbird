import { DatabasePool, sql } from "slonik";

export class PsqlSignatureSubmissionService
  implements SignatureSubmissionService
{
  constructor(private readonly pool: DatabasePool) {}

  async exists({
    counterPartyEmail,
    emailSubjectStartsWith,
  }: Exists): Promise<boolean> {
    console.log("checking exists", counterPartyEmail, emailSubjectStartsWith);
    const value = await this.pool.connect(async (connection) =>
      connection.exists(sql.unsafe`
SELECT
    1
FROM
    signature_submissions
WHERE
    LOWER(counterparty_email) = ${counterPartyEmail.toLowerCase()}
    AND email_subject LIKE ${"%" + emailSubjectStartsWith + "%"}
`)
    );

    return value;
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
    )}, ${envelopeId}, ${emailSubject}, ${eventCreatedAt}, ${counterPartyEmail}, ${status})
`
      )
    );
  }
}

export interface SignatureSubmissionService {
  exists: (args: Exists) => Promise<boolean>;
  insert: (form: Signature) => Promise<void>;
}

interface Exists {
  counterPartyEmail: string;
  emailSubjectStartsWith: string;
}

interface Signature {
  raw: Record<string, unknown>;
  envelopeId: string;
  emailSubject: string;
  eventCreatedAt: string;
  counterPartyEmail: string;
  status: string;
}

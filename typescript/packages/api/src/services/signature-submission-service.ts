import { DatabasePool, sql } from "slonik";

export class PsqlSignatureSubmissionService
  implements SignatureSubmissionService
{
  constructor(private readonly pool: DatabasePool) {}

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
RETURNING
    id
`
      )
    );
  }
}

export interface SignatureSubmissionService {
  insert: (form: Signature) => Promise<void>;
}

interface Signature {
  raw: Record<string, unknown>;
  envelopeId: string;
  emailSubject: string;
  eventCreatedAt: string;
  counterPartyEmail: string;
  status: string;
}

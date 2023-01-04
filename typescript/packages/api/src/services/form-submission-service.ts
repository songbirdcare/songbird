import { DatabasePool, sql } from "slonik";
import { z } from "zod";

const EMAIL_KEY = "email_address";
export class PsqlFormSubmissionService implements FormSubmissionService {
  constructor(private readonly pool: DatabasePool) {}

  async insert({ raw }: InsertFormSubmissionArgs): Promise<Form> {
    const parsed = RawForm.parse(raw);
    const {
      answers,
      responder_uuid,
      flow_label,
      variant_label,
      variant_uuid,
      created_at,
      finalized,
    } = parsed;
    const email = answers[EMAIL_KEY] ?? null;

    const form = await this.pool.connect(async (connection) =>
      connection.one(
        sql.type(Form)`
INSERT INTO form_submissions (email, submission, flow_label, variant_label, variant_uuid, responder_uuid, form_created_at, finalized)
    VALUES (${email}, ${JSON.stringify(
          parsed
        )}, ${flow_label}, ${variant_label}, ${variant_uuid}, ${responder_uuid}, ${created_at}, ${finalized})
RETURNING (id)
`
      )
    );

    return form;
  }
}

export interface FormSubmissionService {
  insert: (args: InsertFormSubmissionArgs) => Promise<Form>;
}

export interface InsertFormSubmissionArgs {
  raw: Record<string, any>;
}

const Form = z.object({
  id: z.string(),
});

export type Form = z.infer<typeof Form>;

const RawForm = z.object({
  answers: z.record(z.string().min(1), z.any()),
  responder_uuid: z.string(),
  flow_label: z.string(),
  variant_label: z.string(),
  variant_uuid: z.string(),
  created_at: z.string(),
  finalized: z.boolean(),
});

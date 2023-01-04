import { DatabasePool, sql } from "slonik";
import { z } from "zod";

const EMAIL_KEY = "email_address";
export class PsqlFormSubmissionService implements FormSubmissionService {
  constructor(private readonly pool: DatabasePool) {}

  async insert({ raw }: InsertFormSubmissionArgs): Promise<Form> {
    const parsed = RawForm.parse(raw);
    const email = parsed.answers[EMAIL_KEY] ?? null;

    const form = await this.pool.connect(async (connection) =>
      connection.one(
        sql.type(Form)`
INSERT INTO form_submissions (email, submission)
    VALUES (${email}, ${JSON.stringify(parsed)})
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
});

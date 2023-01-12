import { DatabasePool, sql } from "slonik";
import { z } from "zod";

export class PsqlFormSubmissionService implements FormSubmissionService {
  constructor(private readonly pool: DatabasePool) {}

  async insert(
    raw: ParsedForm,
    { email }: OptionalArguments = {}
  ): Promise<Form> {
    const parsed = ZParsedForm.parse(raw);
    const {
      responder_uuid,
      flow_label,
      variant_label,
      variant_uuid,
      created_at,
      finalized,
    } = parsed;

    const form = await this.pool.connect(async (connection) =>
      connection.one(
        sql.type(ZForm)`
INSERT INTO form_submissions (email, submission, flow_label, variant_label, variant_uuid, responder_uuid, form_created_at, finalized)
    VALUES (${email ?? null}, ${JSON.stringify(
          parsed
        )}, ${flow_label}, ${variant_label}, ${variant_uuid}, ${responder_uuid}, ${created_at}, ${finalized})
RETURNING
    id
`
      )
    );

    return form;
  }

  parse = (raw: Record<string, unknown>): ParsedForm => ZParsedForm.parse(raw);
}

export interface FormSubmissionService {
  insert: (form: ParsedForm, opts?: OptionalArguments) => Promise<Form>;
  parse: (raw: Record<string, unknown>) => ParsedForm;
}

interface OptionalArguments {
  email?: string;
}

export interface InsertFormSubmissionArgs {
  raw: Record<string, unknown>;
}

const ZForm = z.object({
  id: z.string(),
});
type Form = z.infer<typeof ZForm>;
export type ParsedForm = z.infer<typeof ZParsedForm>;

const ZParsedForm = z.object({
  answers: z.record(z.string().min(1), z.any()),
  responder_uuid: z.string(),
  flow_label: z.string(),
  variant_label: z.string(),
  variant_uuid: z.string(),
  created_at: z.string(),
  finalized: z.boolean(),
});

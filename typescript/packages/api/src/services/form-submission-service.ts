import { DatabasePool, sql } from "slonik";
import { z } from "zod";

export class PsqlFormSubmissionService implements FormSubmissionService {
  constructor(private readonly pool: DatabasePool) {}

  getSignupForm = async (email: string): Promise<SignupForm | undefined> => {
    const form = await this.pool.connect(async (connection) => {
      const form = await connection.maybeOne(
        sql.type(
          ZSqlForm
        )`SELECT submission FROM form_submissions WHERE email = ${email} AND app_slug = 'signup'`
      );

      if (!form) {
        return undefined;
      }
      try {
        const { parent_last_name, parent_first_name, phone_number } =
          ZSignupAnswers.parse(form.submission["answers"]);

        return {
          firstName: parent_first_name,
          lastName: parent_last_name,
          phone: phone_number,
        };
      } catch (e) {
        if (e instanceof z.ZodError) {
          console.warn("Could not parse onboarding form");
          return undefined;
        }
        throw e;
      }
    });

    return form;
  };

  async insert(
    raw: ParsedForm,
    { email, applicationSlug }: OptionalArguments = {}
  ): Promise<void> {
    const parsed = ZParsedForm.parse(raw);
    const {
      responder_uuid,
      flow_label,
      variant_label,
      variant_uuid,
      created_at,
      finalized,
    } = parsed;

    await this.pool.connect(async (connection) =>
      connection.query(
        sql.unsafe`
INSERT INTO form_submissions (email, submission, flow_label, variant_label, variant_uuid, responder_uuid, form_created_at, finalized, app_slug)
    VALUES (${email ?? null}, ${JSON.stringify(
          parsed
        )}, ${flow_label}, ${variant_label}, ${variant_uuid}, ${responder_uuid}, ${created_at}, ${finalized}, ${
          applicationSlug ?? null
        })
`
      )
    );
  }

  parse = (raw: Record<string, unknown>): ParsedForm => ZParsedForm.parse(raw);
}

interface SignupForm {
  phone: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
}

const ZSignupAnswers = z.object({
  parent_last_name: z.string().optional(),
  email_address: z.string().optional(),
  phone_number: z.string().optional(),
  parent_first_name: z.string().optional(),
});

export interface FormSubmissionService {
  getSignupForm: (email: string) => Promise<SignupForm | undefined>;
  insert: (form: ParsedForm, opts?: OptionalArguments) => Promise<void>;
  parse: (raw: Record<string, unknown>) => ParsedForm;
}

interface OptionalArguments {
  email?: string;
  applicationSlug?: string;
}

export interface InsertFormSubmissionArgs {
  raw: Record<string, unknown>;
}

const ZSqlForm = z.object({
  id: z.string(),
  submission: z.record(z.string(), z.any()),
});

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

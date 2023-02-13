import { DatabasePool, sql } from "slonik";
import { z } from "zod";

import { LOGGER } from "../../logger";

export class PsqlFormSubmissionService implements FormSubmissionService {
  constructor(private readonly pool: DatabasePool) {}

  getSignupForm = async (email: string): Promise<SignupForm | undefined> => {
    const form = await this.pool.connect(async (connection) => {
      const form = await connection.maybeOne(
        sql.type(
          ZSqlForm
        )`SELECT submission FROM form_submissions WHERE email = ${email} AND app_slug = 'signup' LIMIT 1`
      );

      if (!form) {
        return undefined;
      }
      try {
        const parsed = ZSignupAnswers.parse(form.submission["answers"]);

        return {
          firstName: parsed.parent_first_name,
          lastName: parsed.parent_last_name,
          phone: parsed.phone_number,
          isQualified: parsed.is_qualified,
          isQualifiedWithoutDiagnosis: parsed.is_qualified_without_diagnosis,
          isParentLedQualified: parsed.is_parent_led_qualified,
          isQualifiedRegion: parsed.is_qualified_region,
          isQualifiedAge: parsed.is_qualified_age,
          isQualifiedInsurance: parsed.is_qualified_insurance,
        };
      } catch (e) {
        if (e instanceof z.ZodError) {
          LOGGER.warn("Could not parse onboarding form");
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

export interface SignupForm {
  phone: string;
  firstName: string;
  lastName: string;
  isQualified: boolean;
  isQualifiedWithoutDiagnosis: boolean;
  isParentLedQualified: boolean;
  isQualifiedRegion: boolean;
  isQualifiedAge: boolean;
  isQualifiedInsurance: boolean;
}

const ZSignupAnswers = z.object({
  parent_last_name: z.string(),
  email_address: z.string(),
  embedded_email: z.string().optional(),
  phone_number: z.string(),
  parent_first_name: z.string(),
  is_qualified: z.boolean(),
  is_qualified_without_diagnosis: z.boolean(),
  is_parent_led_qualified: z.boolean(),
  is_qualified_region: z.boolean(),
  is_qualified_age: z.boolean(),
  is_qualified_insurance: z.boolean(),
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

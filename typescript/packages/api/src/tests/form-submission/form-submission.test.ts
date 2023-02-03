import { createPool, sql } from "slonik";
import { updateQualifiedName } from "typescript";
import { expect, test, beforeEach } from "vitest";
import { PsqlFormSubmissionService } from "../../services/form-submission-service";
import { TEST_SETTINGS } from "../test-settings";
import { QUALIFIED, UNQUALIFIED } from "./dummy-data";

async function setup() {
  const pool = await createPool(TEST_SETTINGS.sqlUri);
  const formSubmissionService = new PsqlFormSubmissionService(pool);
  return {
    pool,
    formSubmissionService,
  };
}

beforeEach(async () => {
  const { pool, formSubmissionService } = await setup();

  await pool.query(sql.unsafe`TRUNCATE TABLE form_submissions`);

  await formSubmissionService.insert(QUALIFIED, {
    email: QUALIFIED["answers"]["email_address"],
    applicationSlug: "signup",
  });

  await formSubmissionService.insert(UNQUALIFIED, {
    email: UNQUALIFIED["answers"]["email_address"],
    applicationSlug: "signup",
  });
});

test("getSignupForm", async () => {
  const { formSubmissionService } = await setup();

  const qualified = await formSubmissionService.getSignupForm(
    QUALIFIED["answers"]["email_address"]
  );

  const unqualified = await formSubmissionService.getSignupForm(
    UNQUALIFIED["answers"]["email_address"]
  );

  expect(qualified?.isQualified).toEqual(true);
  expect(unqualified?.isQualified).toEqual(false);
});

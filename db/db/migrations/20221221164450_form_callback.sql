-- migrate:up
CREATE TABLE
  IF NOT EXISTS form_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
    email text,
    submission jsonb NOT NULL
  );

CREATE INDEX IF NOT EXISTS "email_form_submissions_index" ON "form_submissions" ("email");

-- migrate:down
DROP TABLE IF EXISTS form_submissions

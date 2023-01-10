-- migrate:up
CREATE TABLE
  IF NOT EXISTS signature_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
    envelope_id text NOT NULL,
    event_created_at TIMESTAMPTZ NOT NULL,
    raw jsonb not null,
    email_subject text not null,
    counterparty_email text not null,
    status text
  );

-- migrate:down
DROP TABLE IF EXISTS signature_submissions;

-- migrate:up
CREATE TABLE
  IF NOT EXISTS calendar_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
    event_created_at TIMESTAMPTZ,
    raw jsonb not null,
    event_type_name text not null,
    event_type_slug text,
    invitee_email text not null
  );

-- migrate:down
DROP TABLE IF EXISTS calendar_submissions;

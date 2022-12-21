-- migrate:up
CREATE TABLE
  IF NOT EXISTS sb_user (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
    sub text UNIQUE,
    email text UNIQUE NOT NULL
  );

CREATE UNIQUE INDEX IF NOT EXISTS "user_sub_idx" ON "sb_user" ("sub");

-- migrate:down
DROP INDEX IF EXISTS "user_sub_idx";

DROP TABLE IF EXISTS sb_user

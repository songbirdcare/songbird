-- migrate:up
ALTER TABLE sb_user
DROP CONSTRAINT IF EXISTS sb_user_email_key;

CREATE INDEX IF NOT EXISTS "user_email_idx" ON "sb_user" ("email");

ALTER TABLE sb_user
ADD COLUMN IF NOT EXISTS email_verified boolean DEFAULT False,
ADD COLUMN IF NOT EXISTS name text,
ADD COLUMN IF NOT EXISTS givenName text,
ADD COLUMN IF NOT EXISTS familyName text;

-- migrate:down
DROP INDEX IF EXISTS "user_email_idx";

ALTER TABLE sb_user
DROP COLUMN IF EXISTS email_verified,
DROP COLUMN IF EXISTS name,
DROP COLUMN IF EXISTS givenName,
DROP COLUMN IF EXISTS familyName;

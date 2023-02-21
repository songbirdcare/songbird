-- migrate:up
ALTER TABLE workflow
ADD COLUMN IF NOT EXISTS revision int4 CHECK (version > 0) NOT NULL DEFAULT 1;

-- migrate:down
ALTER TABLE workflow
DROP COLUMN IF EXISTS revision;

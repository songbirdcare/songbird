-- migrate:up
ALTER TABLE workflow
ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending' NOT NULL;

-- migrate:down
ALTER TABLE workflow
DROP COLUMN IF EXISTS status;

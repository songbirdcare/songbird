-- migrate:up
ALTER TABLE child
ADD COLUMN IF NOT EXISTS workflow_slug text DEFAULT 'onboarding' NOT NULL;

-- migrate:down
ALTER TABLE child
DROP COLUMN IF EXISTS workflow_slug;

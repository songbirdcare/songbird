-- migrate:up
ALTER TABLE form_submissions
ADD COLUMN IF NOT EXISTS app_slug text;

-- migrate:down
ALTER TABLE form_submissions
DROP COLUMN IF EXISTS app_slug;

-- migrate:up
ALTER TABLE child
ADD COLUMN IF NOT EXISTS qualification_status text DEFAULT NULL;

-- migrate:down
ALTER TABLE child
DROP COLUMN IF EXISTS qualification_status;

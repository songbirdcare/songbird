ALTER TABLE child
ADD COLUMN IF NOT EXISTS schedule jsonb;

-- migrate:down
ALTER TABLE child
DROP COLUMN IF EXISTS schedule;

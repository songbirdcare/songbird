-- migrate:up
ALTER TABLE sb_user
ADD COLUMN IF NOT EXISTS phone text;

-- migrate:down
ALTER TABLE sb_user
DROP COLUMN IF EXISTS phone;

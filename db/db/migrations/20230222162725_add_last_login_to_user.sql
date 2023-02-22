-- migrate:up
ALTER TABLE sb_user
ADD COLUMN IF NOT EXISTS last_login_date TIMESTAMPTZ;

-- migrate:down
ALTER TABLE sb_user
DROP COLUMN IF EXISTS last_login_date;

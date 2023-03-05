-- migrate:up
ALTER TABLE sb_user
ADD COLUMN IF NOT EXISTS role text DEFAULT 'user';

-- migrate:down
ALTER TABLE sb_user
DROP COLUMN IF EXISTS role;

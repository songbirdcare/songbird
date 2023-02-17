-- migrate:up
CREATE UNIQUE INDEX IF NOT EXISTS "child_user_id_idx" ON "child" ("sb_user_id");

-- migrate:down
DROP INDEX IF EXISTS "child_user_id_idx";

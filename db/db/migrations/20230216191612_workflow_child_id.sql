-- migrate:up
CREATE UNIQUE INDEX IF NOT EXISTS "workflow_user_id_child_id_slug_idx" ON "workflow" ("sb_user_id", "child_id", "workflow_slug");

-- migrate:down
DROP INDEX IF EXISTS "workflow_user_id_child_id_slug_idx";

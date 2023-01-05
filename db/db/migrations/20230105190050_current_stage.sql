-- migrate:up
ALTER TABLE workflow
ADD COLUMN IF NOT EXISTS current_stage_idx smallint CHECK (current_stage_idx >= 0) DEFAULT 0;

-- migrate:down
ALTER TABLE workflow
DROP COLUMN IF EXISTS current_stage_idx;

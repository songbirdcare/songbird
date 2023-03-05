-- migrate:up
ALTER TABLE form_submissions
ADD COLUMN IF NOT EXISTS responder_uuid text,
ADD COLUMN IF NOT EXISTS flow_label text NOT NULL,
ADD COLUMN IF NOT EXISTS variant_label text NOT NULL,
ADD COLUMN IF NOT EXISTS variant_uuid text NOT NULL,
ADD COLUMN IF NOT EXISTS finalized boolean NOT NULL,
ADD COLUMN IF NOT EXISTS form_created_at TIMESTAMPTZ NOT NULL;

-- migrate:down
ALTER TABLE form_submissions
DROP COLUMN IF EXISTS responder_uuid,
DROP COLUMN IF EXISTS flow_label,
DROP COLUMN IF EXISTS variant_label,
DROP COLUMN IF EXISTS variant_uuid,
DROP COLUMN IF EXISTS finalized,
DROP COLUMN IF EXISTS form_created_at;

-- migrate:up
ALTER TABLE child
ADD COLUMN IF NOT EXISTS assessor UUID REFERENCES providers (id) ON DELETE SET NULL;

-- migrate:down
ALTER TABLE child
DROP COLUMN IF EXISTS assessor;

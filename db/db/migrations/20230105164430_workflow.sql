-- migrate:up
CREATE TABLE
  IF NOT EXISTS workflow (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    sb_user_id UUID REFERENCES "sb_user" (id),
    child_id UUID REFERENCES "child" (id),
    workflow_slug text NOT NULL,
    version smallint CHECK (version > 0) NOT NULL,
    stages jsonb NOT NULL
  );

-- migrate:down
DROP TABLE IF EXISTS "workflow"

-- migrate:up
CREATE TABLE
  IF NOT EXISTS child (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    sb_user_id UUID REFERENCES "sb_user" (id)
  );

CREATE INDEX IF NOT EXISTS "child_fk_sb_user" ON "child" ("sb_user_id");

-- migrate:down
DROP TABLE IF EXISTS "child"

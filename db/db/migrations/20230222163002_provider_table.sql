-- migrate:up
CREATE TABLE
  IF NOT EXISTS providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
    first_name text NOT NULL,
    last_name text NOT NULL,
    role text NOT NULL,
    email text UNIQUE NOT NULL
  );

-- migrate:down
DROP TABLE IF EXISTS "providers";

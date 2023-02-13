-- migrate:up
UPDATE child
SET
  qualification_status = 'grandfathered-qualified'
WHERE
  qualification_status IS NULL;

-- migrate:down

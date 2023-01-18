-- migrate:up
ALTER TABLE signature_submissions
ALTER COLUMN counterparty_email
DROP NOT NULL;

-- migrate:down

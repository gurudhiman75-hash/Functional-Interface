-- Phone-first authentication support for canonical ExamTree student accounts.
-- Allows Firebase phone-auth users to provision before they add an email address.

ALTER TABLE identity.users
  ALTER COLUMN email DROP NOT NULL;

ALTER TABLE identity.users
  ADD COLUMN IF NOT EXISTS phone_number text;

CREATE UNIQUE INDEX IF NOT EXISTS identity_users_phone_number_unique
  ON identity.users (phone_number)
  WHERE phone_number IS NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'identity_users_phone_number_e164'
      AND conrelid = 'identity.users'::regclass
  ) THEN
    ALTER TABLE identity.users
      ADD CONSTRAINT identity_users_phone_number_e164
      CHECK (
        phone_number IS NULL
        OR phone_number ~ '^\+[1-9][0-9]{7,14}$'
      )
      NOT VALID;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'identity_users_contact_required'
      AND conrelid = 'identity.users'::regclass
  ) THEN
    ALTER TABLE identity.users
      ADD CONSTRAINT identity_users_contact_required
      CHECK (email IS NOT NULL OR phone_number IS NOT NULL)
      NOT VALID;
  END IF;
END
$$;

COMMENT ON COLUMN identity.users.phone_number IS
  'Verified E.164 phone number supplied by the authenticated identity provider.';

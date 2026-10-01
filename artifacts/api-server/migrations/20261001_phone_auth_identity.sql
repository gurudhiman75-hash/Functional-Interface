-- Phone-first authentication support for canonical ExamTree student accounts.
-- The canonical schema already has identity.users.phone with an active-row
-- uniqueness index. This migration allows phone-auth users to exist before
-- they add an email address and validates E.164 phone values.

ALTER TABLE identity.users
  ALTER COLUMN email DROP NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'identity_users_phone_e164'
      AND conrelid = 'identity.users'::regclass
  ) THEN
    ALTER TABLE identity.users
      ADD CONSTRAINT identity_users_phone_e164
      CHECK (
        phone IS NULL
        OR phone ~ '^\+[1-9][0-9]{7,14}$'
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
      CHECK (email IS NOT NULL OR phone IS NOT NULL)
      NOT VALID;
  END IF;
END
$$;

COMMENT ON COLUMN identity.users.phone IS
  'Verified E.164 phone number supplied by the authenticated identity provider.';

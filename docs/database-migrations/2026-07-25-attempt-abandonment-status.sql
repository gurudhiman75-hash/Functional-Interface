-- Canonical Attempt Administration: audited administrative abandonment
-- Apply to the production database before enabling the abandon-attempt action.
-- This migration preserves every score, response and result snapshot.

DO $$
DECLARE
  status_type_oid oid;
  status_type_name text;
BEGIN
  SELECT attribute.atttypid,
         format('%I.%I', namespace.nspname, type_name.typname)
    INTO status_type_oid, status_type_name
  FROM pg_attribute attribute
  JOIN pg_class relation ON relation.oid = attribute.attrelid
  JOIN pg_namespace relation_namespace ON relation_namespace.oid = relation.relnamespace
  JOIN pg_type type_name ON type_name.oid = attribute.atttypid
  JOIN pg_namespace namespace ON namespace.oid = type_name.typnamespace
  WHERE relation_namespace.nspname = 'learning'
    AND relation.relname = 'attempts'
    AND attribute.attname = 'status'
    AND attribute.attnum > 0
    AND NOT attribute.attisdropped;

  IF status_type_oid IS NULL THEN
    RAISE EXCEPTION 'learning.attempts.status was not found';
  END IF;

  IF (SELECT typtype FROM pg_type WHERE oid = status_type_oid) = 'e' THEN
    EXECUTE format('ALTER TYPE %s ADD VALUE IF NOT EXISTS %L', status_type_name, 'abandoned');
  END IF;
END $$;

COMMENT ON COLUMN learning.attempts.status IS
  'Canonical attempt lifecycle. Administrative abandonment closes only an in-progress attempt and never changes scoring or result_snapshot evidence.';

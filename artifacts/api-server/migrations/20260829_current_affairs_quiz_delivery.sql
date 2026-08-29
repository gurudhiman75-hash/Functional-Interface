CREATE TABLE IF NOT EXISTS content.current_affairs_quiz_deliveries (
  id UUID PRIMARY KEY,
  public_code TEXT NOT NULL UNIQUE,
  release_id UUID NOT NULL UNIQUE
    REFERENCES content.current_affairs_releases(id) ON DELETE RESTRICT,
  status TEXT NOT NULL CHECK (status IN ('published', 'revoked')),
  item_count INTEGER NOT NULL CHECK (item_count >= 1),
  source_fingerprint TEXT NOT NULL,
  publication_reason TEXT NOT NULL,
  published_by UUID NOT NULL REFERENCES identity.users(id) ON DELETE RESTRICT,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  revoked_by UUID REFERENCES identity.users(id) ON DELETE RESTRICT,
  revoked_at TIMESTAMPTZ,
  revocation_reason TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT current_affairs_quiz_delivery_code_format CHECK (
    public_code ~ '^CA-QZ-(D|W|M)-[0-9]{8}-[A-Z0-9_-]{2,24}-V[0-9]+$'
  ),
  CONSTRAINT current_affairs_quiz_delivery_fingerprint_format CHECK (
    source_fingerprint ~ '^[a-f0-9]{64}$'
  ),
  CONSTRAINT current_affairs_quiz_delivery_revocation_state CHECK (
    (status='published' AND revoked_by IS NULL AND revoked_at IS NULL AND revocation_reason IS NULL)
    OR
    (status='revoked' AND revoked_by IS NOT NULL AND revoked_at IS NOT NULL
      AND NULLIF(BTRIM(COALESCE(revocation_reason, '')), '') IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS current_affairs_quiz_deliveries_public_idx
  ON content.current_affairs_quiz_deliveries(status, published_at DESC, public_code);

CREATE TABLE IF NOT EXISTS content.current_affairs_quiz_delivery_items (
  id UUID PRIMARY KEY,
  quiz_delivery_id UUID NOT NULL
    REFERENCES content.current_affairs_quiz_deliveries(id) ON DELETE CASCADE,
  promotion_id UUID NOT NULL
    REFERENCES content.current_affairs_question_promotions(id) ON DELETE RESTRICT,
  generation_item_id UUID NOT NULL
    REFERENCES content.generation_run_items(id) ON DELETE RESTRICT,
  question_id UUID NOT NULL
    REFERENCES content.questions(id) ON DELETE RESTRICT,
  question_version_id UUID NOT NULL
    REFERENCES content.question_versions(id) ON DELETE RESTRICT,
  question_family TEXT NOT NULL CHECK (question_family IN ('CA-QL-001','CA-QL-002')),
  sort_order INTEGER NOT NULL CHECK (sort_order >= 1),
  english_payload JSONB NOT NULL,
  hindi_payload JSONB NOT NULL,
  punjabi_payload JSONB NOT NULL,
  source_payload_hash TEXT NOT NULL,
  hindi_payload_hash TEXT NOT NULL,
  punjabi_payload_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT current_affairs_quiz_delivery_item_en_object CHECK (jsonb_typeof(english_payload)='object'),
  CONSTRAINT current_affairs_quiz_delivery_item_hi_object CHECK (jsonb_typeof(hindi_payload)='object'),
  CONSTRAINT current_affairs_quiz_delivery_item_pa_object CHECK (jsonb_typeof(punjabi_payload)='object'),
  CONSTRAINT current_affairs_quiz_delivery_item_source_hash CHECK (source_payload_hash ~ '^[a-f0-9]{64}$'),
  CONSTRAINT current_affairs_quiz_delivery_item_hi_hash CHECK (hindi_payload_hash ~ '^[a-f0-9]{64}$'),
  CONSTRAINT current_affairs_quiz_delivery_item_pa_hash CHECK (punjabi_payload_hash ~ '^[a-f0-9]{64}$'),
  UNIQUE (quiz_delivery_id, sort_order),
  UNIQUE (quiz_delivery_id, generation_item_id),
  UNIQUE (quiz_delivery_id, promotion_id)
);

CREATE INDEX IF NOT EXISTS current_affairs_quiz_delivery_items_delivery_idx
  ON content.current_affairs_quiz_delivery_items(quiz_delivery_id, sort_order);

CREATE OR REPLACE FUNCTION content.guard_current_affairs_quiz_delivery_insert()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  release_row RECORD;
  expected_count INTEGER;
  active_promotion_count INTEGER;
BEGIN
  SELECT id, status, source_fingerprint
  INTO release_row
  FROM content.current_affairs_releases
  WHERE id=NEW.release_id;

  IF release_row.id IS NULL OR release_row.status <> 'approved' THEN
    RAISE EXCEPTION 'Current Affairs quiz delivery requires an active approved editorial release';
  END IF;
  IF release_row.source_fingerprint IS DISTINCT FROM NEW.source_fingerprint THEN
    RAISE EXCEPTION 'Current Affairs quiz delivery fingerprint does not match the approved release';
  END IF;

  SELECT count(*)::int INTO expected_count
  FROM content.current_affairs_release_question_items
  WHERE release_id=NEW.release_id;

  SELECT count(*)::int INTO active_promotion_count
  FROM content.current_affairs_question_promotions promotion
  JOIN content.current_affairs_release_question_items release_item
    ON release_item.release_id=NEW.release_id
   AND release_item.generation_item_id=promotion.generation_item_id
   AND release_item.source_generation_version_id=promotion.source_generation_version_id
   AND release_item.hindi_localization_id=promotion.hindi_source_localization_id
   AND release_item.punjabi_localization_id=promotion.punjabi_source_localization_id
  JOIN content.questions question ON question.id=promotion.question_id
  WHERE promotion.release_id=NEW.release_id
    AND promotion.status='active'
    AND question.status='approved'::question_status
    AND question.published_version_id IS NULL;

  IF expected_count < 1 OR NEW.item_count <> expected_count OR active_promotion_count <> expected_count THEN
    RAISE EXCEPTION 'Current Affairs quiz delivery requires every released question to have one active BANK_ONLY Question Bank promotion';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS current_affairs_quiz_delivery_insert_guard
  ON content.current_affairs_quiz_deliveries;
CREATE TRIGGER current_affairs_quiz_delivery_insert_guard
BEFORE INSERT ON content.current_affairs_quiz_deliveries
FOR EACH ROW
EXECUTE FUNCTION content.guard_current_affairs_quiz_delivery_insert();

CREATE OR REPLACE FUNCTION content.guard_current_affairs_quiz_delivery_item_insert()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  delivery_row RECORD;
  promotion_row RECORD;
BEGIN
  SELECT release_id, status INTO delivery_row
  FROM content.current_affairs_quiz_deliveries
  WHERE id=NEW.quiz_delivery_id;
  IF delivery_row.release_id IS NULL OR delivery_row.status <> 'published' THEN
    RAISE EXCEPTION 'Quiz delivery item requires an active published delivery';
  END IF;

  SELECT * INTO promotion_row
  FROM content.current_affairs_question_promotions
  WHERE id=NEW.promotion_id;
  IF promotion_row.id IS NULL OR promotion_row.status <> 'active'
     OR promotion_row.release_id IS DISTINCT FROM delivery_row.release_id
     OR promotion_row.generation_item_id IS DISTINCT FROM NEW.generation_item_id
     OR promotion_row.question_id IS DISTINCT FROM NEW.question_id
     OR promotion_row.question_version_id IS DISTINCT FROM NEW.question_version_id
     OR promotion_row.source_payload_hash IS DISTINCT FROM NEW.source_payload_hash
     OR promotion_row.hindi_payload_hash IS DISTINCT FROM NEW.hindi_payload_hash
     OR promotion_row.punjabi_payload_hash IS DISTINCT FROM NEW.punjabi_payload_hash THEN
    RAISE EXCEPTION 'Quiz delivery item is not an exact active CP015 promotion snapshot';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS current_affairs_quiz_delivery_item_insert_guard
  ON content.current_affairs_quiz_delivery_items;
CREATE TRIGGER current_affairs_quiz_delivery_item_insert_guard
BEFORE INSERT ON content.current_affairs_quiz_delivery_items
FOR EACH ROW
EXECUTE FUNCTION content.guard_current_affairs_quiz_delivery_item_insert();

CREATE OR REPLACE FUNCTION content.revoke_current_affairs_quiz_delivery_with_release()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF OLD.status='approved' AND NEW.status='revoked' THEN
    UPDATE content.current_affairs_quiz_deliveries
    SET status='revoked',
        revoked_by=NEW.revoked_by,
        revoked_at=COALESCE(NEW.revoked_at, now()),
        revocation_reason=COALESCE(NULLIF(BTRIM(NEW.revocation_reason), ''), 'Source Current Affairs release revoked'),
        updated_at=now()
    WHERE release_id=NEW.id AND status='published';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS current_affairs_release_quiz_delivery_revocation
  ON content.current_affairs_releases;
CREATE TRIGGER current_affairs_release_quiz_delivery_revocation
AFTER UPDATE OF status ON content.current_affairs_releases
FOR EACH ROW
EXECUTE FUNCTION content.revoke_current_affairs_quiz_delivery_with_release();

COMMENT ON TABLE content.current_affairs_quiz_deliveries IS
  'Explicit learner-visible Current Affairs quiz delivery release built only from one active CP014 editorial release whose complete question set has active CP015 BANK_ONLY promotions.';

COMMENT ON TABLE content.current_affairs_quiz_delivery_items IS
  'Immutable sanitized EN/HI/PA quiz question snapshots used for learner delivery and server-side grading; correct answers are never emitted by the learner GET endpoint.';

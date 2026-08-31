CREATE TABLE IF NOT EXISTS content.current_affairs_question_promotions (
  id UUID PRIMARY KEY,
  release_id UUID NOT NULL
    REFERENCES content.current_affairs_releases(id) ON DELETE RESTRICT,
  generation_item_id UUID NOT NULL
    REFERENCES content.generation_run_items(id) ON DELETE RESTRICT,
  source_generation_version_id UUID NOT NULL
    REFERENCES content.generation_item_versions(id) ON DELETE RESTRICT,
  hindi_source_localization_id UUID NOT NULL
    REFERENCES content.current_affairs_question_localizations(id) ON DELETE RESTRICT,
  punjabi_source_localization_id UUID NOT NULL
    REFERENCES content.current_affairs_question_localizations(id) ON DELETE RESTRICT,
  question_id UUID NOT NULL
    REFERENCES content.questions(id) ON DELETE RESTRICT,
  question_version_id UUID NOT NULL
    REFERENCES content.question_versions(id) ON DELETE RESTRICT,
  hindi_question_translation_id UUID NOT NULL
    REFERENCES content.question_translations(id) ON DELETE RESTRICT,
  punjabi_question_translation_id UUID NOT NULL
    REFERENCES content.question_translations(id) ON DELETE RESTRICT,
  source_payload_hash TEXT NOT NULL,
  hindi_payload_hash TEXT NOT NULL,
  punjabi_payload_hash TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked')),
  promoted_by UUID NOT NULL REFERENCES identity.users(id) ON DELETE RESTRICT,
  promoted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  revoked_by UUID REFERENCES identity.users(id) ON DELETE RESTRICT,
  revoked_at TIMESTAMPTZ,
  revocation_reason TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT current_affairs_question_promotion_source_hash_format
    CHECK (source_payload_hash ~ '^[a-f0-9]{64}$'),
  CONSTRAINT current_affairs_question_promotion_hi_hash_format
    CHECK (hindi_payload_hash ~ '^[a-f0-9]{64}$'),
  CONSTRAINT current_affairs_question_promotion_pa_hash_format
    CHECK (punjabi_payload_hash ~ '^[a-f0-9]{64}$'),
  CONSTRAINT current_affairs_question_promotion_revocation_state CHECK (
    (status='active' AND revoked_by IS NULL AND revoked_at IS NULL AND revocation_reason IS NULL)
    OR
    (status='revoked' AND revoked_by IS NOT NULL AND revoked_at IS NOT NULL
      AND NULLIF(BTRIM(COALESCE(revocation_reason, '')), '') IS NOT NULL)
  ),
  UNIQUE (generation_item_id),
  UNIQUE (question_id),
  UNIQUE (release_id, generation_item_id)
);

CREATE INDEX IF NOT EXISTS current_affairs_question_promotions_release_idx
  ON content.current_affairs_question_promotions(release_id, status, promoted_at DESC);

CREATE INDEX IF NOT EXISTS current_affairs_question_promotions_question_idx
  ON content.current_affairs_question_promotions(question_id, question_version_id, status);

CREATE OR REPLACE FUNCTION content.guard_current_affairs_question_promotion_insert()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  release_row RECORD;
  item_row RECORD;
  release_item_row RECORD;
  hi_row RECORD;
  pa_row RECORD;
  question_row RECORD;
BEGIN
  SELECT id, status, approved_at
  INTO release_row
  FROM content.current_affairs_releases
  WHERE id=NEW.release_id;

  IF release_row.id IS NULL OR release_row.status <> 'approved' THEN
    RAISE EXCEPTION 'Current Affairs question promotion requires an active approved release';
  END IF;

  SELECT
    i.id,
    i.status,
    i.accepted_question_id,
    i.accepted_question_version_id,
    v.id AS current_version_id
  INTO item_row
  FROM content.generation_run_items i
  JOIN content.generation_item_versions v
    ON v.generation_item_id=i.id
   AND v.version_number=i.current_version_number
  WHERE i.id=NEW.generation_item_id;

  IF item_row.id IS NULL OR item_row.status <> 'approved' THEN
    RAISE EXCEPTION 'Current Affairs promotion requires an approved generation item';
  END IF;
  IF item_row.current_version_id IS DISTINCT FROM NEW.source_generation_version_id THEN
    RAISE EXCEPTION 'Current Affairs promotion source generation version is stale';
  END IF;
  IF item_row.accepted_question_id IS DISTINCT FROM NEW.question_id
     OR item_row.accepted_question_version_id IS DISTINCT FROM NEW.question_version_id THEN
    RAISE EXCEPTION 'Current Affairs promotion must reference the generation item accepted Question Bank record';
  END IF;

  SELECT *
  INTO release_item_row
  FROM content.current_affairs_release_question_items
  WHERE release_id=NEW.release_id
    AND generation_item_id=NEW.generation_item_id
    AND source_generation_version_id=NEW.source_generation_version_id
    AND hindi_localization_id=NEW.hindi_source_localization_id
    AND punjabi_localization_id=NEW.punjabi_source_localization_id;

  IF release_item_row.release_id IS NULL THEN
    RAISE EXCEPTION 'Current Affairs promotion inputs are not the question snapshot approved by the release';
  END IF;

  SELECT id, generation_item_id, source_generation_version_id, language_code, status, updated_at
  INTO hi_row
  FROM content.current_affairs_question_localizations
  WHERE id=NEW.hindi_source_localization_id;
  SELECT id, generation_item_id, source_generation_version_id, language_code, status, updated_at
  INTO pa_row
  FROM content.current_affairs_question_localizations
  WHERE id=NEW.punjabi_source_localization_id;

  IF hi_row.id IS NULL OR hi_row.language_code <> 'hi' OR hi_row.status NOT IN ('ready','manual')
     OR hi_row.generation_item_id IS DISTINCT FROM NEW.generation_item_id
     OR hi_row.source_generation_version_id IS DISTINCT FROM NEW.source_generation_version_id
     OR hi_row.updated_at > release_row.approved_at THEN
    RAISE EXCEPTION 'Hindi Current Affairs release localization changed after release approval or is no longer eligible';
  END IF;
  IF pa_row.id IS NULL OR pa_row.language_code <> 'pa' OR pa_row.status NOT IN ('ready','manual')
     OR pa_row.generation_item_id IS DISTINCT FROM NEW.generation_item_id
     OR pa_row.source_generation_version_id IS DISTINCT FROM NEW.source_generation_version_id
     OR pa_row.updated_at > release_row.approved_at THEN
    RAISE EXCEPTION 'Punjabi Current Affairs release localization changed after release approval or is no longer eligible';
  END IF;

  SELECT id, status, approved_version_id, published_version_id
  INTO question_row
  FROM content.questions
  WHERE id=NEW.question_id AND deleted_at IS NULL;
  IF question_row.id IS NULL OR question_row.status <> 'approved'
     OR question_row.approved_version_id IS DISTINCT FROM NEW.question_version_id
     OR question_row.published_version_id IS NOT NULL THEN
    RAISE EXCEPTION 'Current Affairs promoted question must enter Question Bank as approved but unpublished';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS current_affairs_question_promotion_insert_guard
  ON content.current_affairs_question_promotions;
CREATE TRIGGER current_affairs_question_promotion_insert_guard
BEFORE INSERT ON content.current_affairs_question_promotions
FOR EACH ROW
EXECUTE FUNCTION content.guard_current_affairs_question_promotion_insert();

CREATE OR REPLACE FUNCTION content.guard_promoted_current_affairs_question_publication()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  lifecycle RECORD;
BEGIN
  IF NEW.status = 'published'
     AND EXISTS (
       SELECT 1 FROM content.current_affairs_question_promotions promotion
       WHERE promotion.question_id=NEW.id AND promotion.status='active'
     ) THEN
    SELECT
      COALESCE(v.answer_model->'generation'->>'questionBankAcceptanceMode', '') AS acceptance_mode,
      COALESCE((v.answer_model->'generation'->>'testEligible')::boolean, false) AS test_eligible,
      COALESCE((v.answer_model->'generation'->>'publiclyPublishable')::boolean, false) AS publicly_publishable
    INTO lifecycle
    FROM content.question_versions v
    WHERE v.id=NEW.approved_version_id;

    IF lifecycle.acceptance_mode = 'BANK_ONLY'
       OR lifecycle.test_eligible IS DISTINCT FROM true
       OR lifecycle.publicly_publishable IS DISTINCT FROM true THEN
      RAISE EXCEPTION 'Current Affairs Question Bank item remains BANK_ONLY and cannot be published or used in scored tests';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS promoted_current_affairs_question_publication_guard
  ON content.questions;
CREATE TRIGGER promoted_current_affairs_question_publication_guard
BEFORE UPDATE OF status, published_version_id ON content.questions
FOR EACH ROW
EXECUTE FUNCTION content.guard_promoted_current_affairs_question_publication();

CREATE OR REPLACE FUNCTION content.revoke_promoted_current_affairs_questions_with_release()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF OLD.status='approved' AND NEW.status='revoked' THEN
    UPDATE content.current_affairs_question_promotions
    SET status='revoked',
        revoked_by=NEW.revoked_by,
        revoked_at=COALESCE(NEW.revoked_at, now()),
        revocation_reason=COALESCE(NULLIF(BTRIM(NEW.revocation_reason), ''), 'Source Current Affairs release revoked'),
        updated_at=now()
    WHERE release_id=NEW.id AND status='active';

    UPDATE content.questions question
    SET status='archived'::question_status,
        published_version_id=NULL,
        published_at=NULL,
        published_by=NULL,
        lock_version=lock_version + 1,
        updated_at=now()
    WHERE question.id IN (
      SELECT promotion.question_id
      FROM content.current_affairs_question_promotions promotion
      WHERE promotion.release_id=NEW.id AND promotion.status='revoked'
    )
      AND question.deleted_at IS NULL
      AND question.status <> 'archived'::question_status;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS current_affairs_release_question_promotion_revocation
  ON content.current_affairs_releases;
CREATE TRIGGER current_affairs_release_question_promotion_revocation
AFTER UPDATE OF status ON content.current_affairs_releases
FOR EACH ROW
EXECUTE FUNCTION content.revoke_promoted_current_affairs_questions_with_release();

COMMENT ON TABLE content.current_affairs_question_promotions IS
  'Audited CP015 bridge from one CP014-approved Current Affairs release question snapshot into an approved, unpublished canonical Question Bank question and its approved Hindi/Punjabi translations.';

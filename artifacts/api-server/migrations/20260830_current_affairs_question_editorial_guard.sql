CREATE OR REPLACE FUNCTION content.guard_current_affairs_question_localization_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  locked_reason TEXT;
BEGIN
  SELECT CASE
    WHEN item.accepted_question_id IS NOT NULL THEN 'canonical Question Bank acceptance'
    WHEN EXISTS (
      SELECT 1
      FROM content.current_affairs_question_promotions promotion
      WHERE promotion.generation_item_id = NEW.generation_item_id
        AND promotion.status = 'active'
    ) THEN 'active Current Affairs Question Bank promotion'
    WHEN EXISTS (
      SELECT 1
      FROM content.current_affairs_release_question_items release_item
      JOIN content.current_affairs_releases release ON release.id = release_item.release_id
      WHERE release_item.generation_item_id = NEW.generation_item_id
        AND release.status = 'approved'
    ) THEN 'approved Current Affairs release snapshot'
    ELSE NULL
  END
  INTO locked_reason
  FROM content.generation_run_items item
  WHERE item.id = NEW.generation_item_id;

  IF locked_reason IS NOT NULL THEN
    RAISE EXCEPTION 'Current Affairs question localization is immutable after %', locked_reason
      USING ERRCODE = '23514';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS current_affairs_question_localization_mutation_guard
  ON content.current_affairs_question_localizations;

CREATE TRIGGER current_affairs_question_localization_mutation_guard
BEFORE INSERT OR UPDATE ON content.current_affairs_question_localizations
FOR EACH ROW
EXECUTE FUNCTION content.guard_current_affairs_question_localization_mutation();

CREATE OR REPLACE FUNCTION content.reset_current_affairs_question_review_after_localization()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE content.generation_run_items
  SET status = 'unreviewed',
      updated_at = now()
  WHERE id = NEW.generation_item_id
    AND status <> 'unreviewed';
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS current_affairs_question_localization_reapproval_required
  ON content.current_affairs_question_localizations;

CREATE TRIGGER current_affairs_question_localization_reapproval_required
AFTER INSERT OR UPDATE OF localized_payload, status, input_fingerprint, quality_snapshot
ON content.current_affairs_question_localizations
FOR EACH ROW
EXECUTE FUNCTION content.reset_current_affairs_question_review_after_localization();

COMMENT ON FUNCTION content.guard_current_affairs_question_localization_mutation() IS
  'CP024 fail-closed guard: CA question translations cannot change after bank acceptance, active promotion, or an approved release snapshot.';

COMMENT ON FUNCTION content.reset_current_affairs_question_review_after_localization() IS
  'CP024 re-review invariant: any mutable CA question localization change resets its English generation item to unreviewed so EN/HI/PA parity is approved again.';

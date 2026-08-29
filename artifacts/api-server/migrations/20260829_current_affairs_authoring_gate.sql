CREATE OR REPLACE FUNCTION content.guard_current_affairs_unwritten_verified_event()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.status = 'verified'
     AND COALESCE((NEW.metadata->>'autoPromoted')::boolean, false) = true
     AND NEW.learner_authoring_status NOT IN ('ready', 'manual') THEN
    UPDATE content.current_affairs_exam_scores
    SET include_recommended = false,
        reasons = COALESCE(reasons, '[]'::jsonb)
          || '["Held from automatic compilation until source-independent learner authoring passes"]'::jsonb,
        updated_at = now()
    WHERE event_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_current_affairs_unwritten_verified_event
  ON content.current_affairs_events;

CREATE TRIGGER trg_guard_current_affairs_unwritten_verified_event
AFTER INSERT OR UPDATE OF status, learner_authoring_status
ON content.current_affairs_events
FOR EACH ROW
EXECUTE FUNCTION content.guard_current_affairs_unwritten_verified_event();

UPDATE content.current_affairs_exam_scores score
SET include_recommended = false,
    reasons = COALESCE(score.reasons, '[]'::jsonb)
      || '["Held from automatic compilation until source-independent learner authoring passes"]'::jsonb,
    updated_at = now()
FROM content.current_affairs_events event
WHERE event.id = score.event_id
  AND event.status = 'verified'
  AND COALESCE((event.metadata->>'autoPromoted')::boolean, false) = true
  AND event.learner_authoring_status NOT IN ('ready', 'manual');

COMMENT ON FUNCTION content.guard_current_affairs_unwritten_verified_event() IS
  'Separates factual verification from learner-copy eligibility: auto-promoted verified events remain excluded from automated compilations until CP009 authoring is ready or manually approved.';

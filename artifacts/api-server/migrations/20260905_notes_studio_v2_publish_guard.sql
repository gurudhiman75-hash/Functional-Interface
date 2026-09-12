BEGIN;

CREATE OR REPLACE FUNCTION notes_studio_v2.guard_note_publish()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  target_note notes_studio_v2.notes%ROWTYPE;
  missing_language text;
BEGIN
  IF NEW.status <> 'published' OR OLD.status = 'published' THEN
    RETURN NEW;
  END IF;

  IF OLD.status <> 'in-review' THEN
    RAISE EXCEPTION 'Notes Studio v2 publish requires in-review status'
      USING ERRCODE = 'check_violation';
  END IF;

  IF jsonb_typeof(NEW.blocks_by_language) <> 'object' THEN
    RAISE EXCEPTION 'Notes Studio v2 publish requires localized note blocks'
      USING ERRCODE = 'check_violation';
  END IF;

  FOREACH missing_language IN ARRAY ARRAY['en', 'hi', 'pa']
  LOOP
    IF NOT (NEW.blocks_by_language ? missing_language)
       OR jsonb_typeof(NEW.blocks_by_language -> missing_language) <> 'array'
       OR jsonb_array_length(NEW.blocks_by_language -> missing_language) = 0 THEN
      RAISE EXCEPTION 'Notes Studio v2 publish requires non-empty % blocks', missing_language
        USING ERRCODE = 'check_violation';
    END IF;
  END LOOP;

  IF jsonb_typeof(NEW.generated_from_fact_ids) <> 'array'
     OR jsonb_array_length(NEW.generated_from_fact_ids) = 0 THEN
    RAISE EXCEPTION 'Notes Studio v2 publish requires generatedFromFactIds traceability'
      USING ERRCODE = 'check_violation';
  END IF;

  SELECT * INTO target_note
  FROM notes_studio_v2.notes
  WHERE id = NEW.note_id;

  IF EXISTS (
    SELECT 1
    FROM notes_studio_v2.contradiction_groups grp
    WHERE grp.period_id = target_note.period_id
      AND grp.status = 'open'
      AND (target_note.sub_category_id IS NULL OR grp.sub_category_id = target_note.sub_category_id)
  ) THEN
    RAISE EXCEPTION 'Notes Studio v2 publish blocked by unresolved contradictions'
      USING ERRCODE = 'check_violation';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM notes_studio_v2.note_figures figure
    WHERE figure.note_version_id = NEW.id
      AND figure.status = 'needed'
  ) THEN
    RAISE EXCEPTION 'Notes Studio v2 publish blocked by unresolved figure placeholders'
      USING ERRCODE = 'check_violation';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS notes_studio_v2_guard_note_publish ON notes_studio_v2.note_versions;

CREATE TRIGGER notes_studio_v2_guard_note_publish
BEFORE UPDATE OF status ON notes_studio_v2.note_versions
FOR EACH ROW
WHEN (NEW.status = 'published')
EXECUTE FUNCTION notes_studio_v2.guard_note_publish();

COMMIT;

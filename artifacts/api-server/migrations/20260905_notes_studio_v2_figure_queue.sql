BEGIN;

CREATE OR REPLACE FUNCTION notes_studio_v2.materialize_note_figures()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  language_entry record;
  block_entry record;
  block_index integer;
  placeholder_text text;
BEGIN
  FOR language_entry IN
    SELECT key AS language, value AS blocks
    FROM jsonb_each(COALESCE(NEW.blocks_by_language, '{}'::jsonb))
  LOOP
    block_index := 0;
    FOR block_entry IN
      SELECT value AS block
      FROM jsonb_array_elements(CASE
        WHEN jsonb_typeof(language_entry.blocks) = 'array' THEN language_entry.blocks
        ELSE '[]'::jsonb
      END)
    LOOP
      IF block_entry.block->>'type' = 'figure'
         AND NULLIF(block_entry.block->>'svgRef', '') IS NULL THEN
        placeholder_text := COALESCE(NULLIF(block_entry.block->>'placeholder', ''), 'Figure needed');
        INSERT INTO notes_studio_v2.note_figures (
          id,
          note_version_id,
          block_ref,
          placeholder_description,
          status
        ) VALUES (
          gen_random_uuid(),
          NEW.id,
          language_entry.language || ':' || block_index::text,
          placeholder_text,
          'needed'
        )
        ON CONFLICT (note_version_id, block_ref) DO NOTHING;
      END IF;
      block_index := block_index + 1;
    END LOOP;
  END LOOP;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS notes_studio_v2_materialize_note_figures ON notes_studio_v2.note_versions;

CREATE CONSTRAINT TRIGGER notes_studio_v2_materialize_note_figures
AFTER INSERT OR UPDATE ON notes_studio_v2.note_versions
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW
EXECUTE FUNCTION notes_studio_v2.materialize_note_figures();

COMMIT;

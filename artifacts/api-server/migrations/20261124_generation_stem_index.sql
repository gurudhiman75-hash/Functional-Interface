-- Lets the approval duplicate check look up a normalized question stem via an index
-- instead of scanning every generated question per approval.
CREATE INDEX IF NOT EXISTS generation_item_versions_norm_stem_idx
  ON content.generation_item_versions (
    (LOWER(REGEXP_REPLACE(TRIM(COALESCE(NULLIF(payload ->> 'text', ''), payload ->> 'stem', '')), '[[:space:][:punct:]]+', ' ', 'g')))
  );

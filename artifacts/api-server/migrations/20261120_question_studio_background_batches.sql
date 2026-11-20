ALTER TABLE content.generation_bulk_operations
  ADD COLUMN execution_mode text NOT NULL DEFAULT 'manual'
  CHECK (execution_mode IN ('manual', 'background'));

CREATE INDEX generation_bulk_background_created
  ON content.generation_bulk_operations (created_at, id)
  WHERE execution_mode = 'background';

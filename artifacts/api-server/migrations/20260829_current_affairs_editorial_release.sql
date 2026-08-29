CREATE TABLE IF NOT EXISTS content.current_affairs_releases (
  id UUID PRIMARY KEY,
  public_code TEXT NOT NULL UNIQUE,
  period_type TEXT NOT NULL CHECK (period_type IN ('daily', 'weekly', 'monthly')),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  exam_family_key TEXT NOT NULL CHECK (
    exam_family_key IN ('ssc', 'banking', 'punjab', 'railways', 'general')
  ),
  release_version INTEGER NOT NULL CHECK (release_version >= 1),
  status TEXT NOT NULL CHECK (status IN ('approved', 'revoked')),
  source_fingerprint TEXT NOT NULL,
  readiness_snapshot JSONB NOT NULL,
  approval_reason TEXT NOT NULL,
  approved_by UUID NOT NULL REFERENCES identity.users(id) ON DELETE RESTRICT,
  approved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  revoked_by UUID REFERENCES identity.users(id) ON DELETE RESTRICT,
  revoked_at TIMESTAMPTZ,
  revocation_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT current_affairs_release_period_order CHECK (period_end >= period_start),
  CONSTRAINT current_affairs_release_fingerprint_format CHECK (source_fingerprint ~ '^[a-f0-9]{64}$'),
  CONSTRAINT current_affairs_release_code_format CHECK (
    public_code ~ '^CA-RLS-(D|W|M)-[0-9]{8}-[A-Z0-9_-]{2,24}-V[0-9]+$'
  ),
  CONSTRAINT current_affairs_release_revocation_state CHECK (
    (status='approved' AND revoked_by IS NULL AND revoked_at IS NULL AND revocation_reason IS NULL)
    OR
    (status='revoked' AND revoked_by IS NOT NULL AND revoked_at IS NOT NULL AND NULLIF(BTRIM(COALESCE(revocation_reason, '')), '') IS NOT NULL)
  ),
  UNIQUE (period_type, period_start, period_end, exam_family_key, release_version)
);

CREATE UNIQUE INDEX IF NOT EXISTS current_affairs_releases_one_active_idx
  ON content.current_affairs_releases(period_type, period_start, period_end, exam_family_key)
  WHERE status='approved';

CREATE TABLE IF NOT EXISTS content.current_affairs_release_compilations (
  release_id UUID NOT NULL
    REFERENCES content.current_affairs_releases(id) ON DELETE CASCADE,
  compilation_id UUID NOT NULL
    REFERENCES content.current_affairs_compilations(id) ON DELETE RESTRICT,
  learning_resource_id UUID NOT NULL
    REFERENCES content.learning_resources(id) ON DELETE RESTRICT,
  language_code TEXT NOT NULL CHECK (language_code IN ('en', 'hi', 'pa')),
  event_manifest_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (release_id, language_code),
  UNIQUE (release_id, compilation_id),
  CONSTRAINT current_affairs_release_manifest_hash_format CHECK (event_manifest_hash ~ '^[a-f0-9]{64}$')
);

CREATE INDEX IF NOT EXISTS current_affairs_release_compilations_resource_idx
  ON content.current_affairs_release_compilations(learning_resource_id, release_id);

CREATE INDEX IF NOT EXISTS current_affairs_release_compilations_compilation_idx
  ON content.current_affairs_release_compilations(compilation_id, release_id);

CREATE TABLE IF NOT EXISTS content.current_affairs_release_question_items (
  release_id UUID NOT NULL
    REFERENCES content.current_affairs_releases(id) ON DELETE CASCADE,
  generation_item_id UUID NOT NULL
    REFERENCES content.generation_run_items(id) ON DELETE RESTRICT,
  source_generation_version_id UUID NOT NULL
    REFERENCES content.generation_item_versions(id) ON DELETE RESTRICT,
  hindi_localization_id UUID NOT NULL
    REFERENCES content.current_affairs_question_localizations(id) ON DELETE RESTRICT,
  punjabi_localization_id UUID NOT NULL
    REFERENCES content.current_affairs_question_localizations(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (release_id, generation_item_id),
  UNIQUE (release_id, source_generation_version_id)
);

CREATE INDEX IF NOT EXISTS current_affairs_release_question_items_source_idx
  ON content.current_affairs_release_question_items(source_generation_version_id, release_id);

CREATE OR REPLACE FUNCTION content.guard_current_affairs_learning_resource_release()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.status='published' AND OLD.status IS DISTINCT FROM 'published' THEN
    IF EXISTS (
      SELECT 1
      FROM content.current_affairs_compilations compilation
      WHERE compilation.learning_resource_id=NEW.id
    ) AND NOT EXISTS (
      SELECT 1
      FROM content.current_affairs_release_compilations link
      JOIN content.current_affairs_releases release ON release.id=link.release_id
      WHERE link.learning_resource_id=NEW.id
        AND release.status='approved'
    ) THEN
      RAISE EXCEPTION 'Current Affairs Studio resource requires an approved editorial release before publication';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_current_affairs_learning_resource_release
  ON content.learning_resources;
CREATE TRIGGER trg_guard_current_affairs_learning_resource_release
BEFORE UPDATE OF status ON content.learning_resources
FOR EACH ROW
EXECUTE FUNCTION content.guard_current_affairs_learning_resource_release();

CREATE OR REPLACE FUNCTION content.guard_current_affairs_compilation_release()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.status='published' AND OLD.status IS DISTINCT FROM 'published' THEN
    IF NOT EXISTS (
      SELECT 1
      FROM content.current_affairs_release_compilations link
      JOIN content.current_affairs_releases release ON release.id=link.release_id
      WHERE link.compilation_id=NEW.id
        AND release.status='approved'
    ) THEN
      RAISE EXCEPTION 'Current Affairs compilation requires an approved editorial release before publication';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_current_affairs_compilation_release
  ON content.current_affairs_compilations;
CREATE TRIGGER trg_guard_current_affairs_compilation_release
BEFORE UPDATE OF status ON content.current_affairs_compilations
FOR EACH ROW
EXECUTE FUNCTION content.guard_current_affairs_compilation_release();

COMMENT ON TABLE content.current_affairs_releases IS
  'Immutable editorial Current Affairs release decisions. Approval snapshots a complete EN/HI/PA note package and its reviewed multilingual quiz sidecars before learner visibility.';

COMMENT ON TABLE content.current_affairs_release_compilations IS
  'Frozen compilation/resource membership for an approved Current Affairs release.';

COMMENT ON TABLE content.current_affairs_release_question_items IS
  'Frozen English generation-item versions and Hindi/Punjabi parity-ready sidecars approved with a Current Affairs release. Canonical question promotion remains a later checkpoint.';

-- CP-042: canonical Daily Master Pack editorial approval authority.
-- Approval freezes the EN/HI/PA canonical artifact set, but deliberately does
-- not publish the linked learning_resources or grant learner visibility.

CREATE TABLE IF NOT EXISTS content.current_affairs_daily_master_pack_approvals (
  id UUID PRIMARY KEY,
  public_code TEXT NOT NULL UNIQUE,
  content_date DATE NOT NULL,
  approval_version INTEGER NOT NULL CHECK (approval_version >= 1),
  status TEXT NOT NULL CHECK (status IN ('approved','revoked')),
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
  CONSTRAINT current_affairs_master_pack_approval_fingerprint_format
    CHECK (source_fingerprint ~ '^[a-f0-9]{64}$'),
  CONSTRAINT current_affairs_master_pack_approval_code_format
    CHECK (public_code ~ '^CA-MPA-D-[0-9]{8}-V[0-9]+$'),
  CONSTRAINT current_affairs_master_pack_approval_revocation_state CHECK (
    (status='approved' AND revoked_by IS NULL AND revoked_at IS NULL AND revocation_reason IS NULL)
    OR
    (status='revoked' AND revoked_by IS NOT NULL AND revoked_at IS NOT NULL
      AND NULLIF(BTRIM(COALESCE(revocation_reason, '')), '') IS NOT NULL)
  ),
  UNIQUE (content_date, approval_version)
);

CREATE UNIQUE INDEX IF NOT EXISTS current_affairs_daily_master_pack_one_active_approval_idx
  ON content.current_affairs_daily_master_pack_approvals(content_date)
  WHERE status='approved';

CREATE TABLE IF NOT EXISTS content.current_affairs_daily_master_pack_approval_packs (
  approval_id UUID NOT NULL
    REFERENCES content.current_affairs_daily_master_pack_approvals(id) ON DELETE CASCADE,
  master_pack_id UUID NOT NULL
    REFERENCES content.current_affairs_daily_master_packs(id) ON DELETE RESTRICT,
  learning_resource_id UUID NOT NULL
    REFERENCES content.learning_resources(id) ON DELETE RESTRICT,
  language_code TEXT NOT NULL CHECK (language_code IN ('en','hi','pa')),
  payload_sha256 TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (approval_id, language_code),
  UNIQUE (approval_id, master_pack_id),
  CONSTRAINT current_affairs_master_pack_approval_payload_hash_format
    CHECK (payload_sha256 ~ '^[a-f0-9]{64}$')
);

CREATE INDEX IF NOT EXISTS current_affairs_master_pack_approval_pack_idx
  ON content.current_affairs_daily_master_pack_approval_packs(master_pack_id, approval_id);

-- CP-041 made deterministic PDF rendering available for all three canonical
-- languages. Upgrade only mutable existing rows; an approved row is immutable.
UPDATE content.current_affairs_daily_master_packs
SET render_targets='["web","text","pdf"]'::jsonb,
    updated_at=now()
WHERE language_code IN ('hi','pa')
  AND status IN ('draft','review')
  AND NOT (render_targets @> '["pdf"]'::jsonb);

CREATE OR REPLACE FUNCTION content.guard_current_affairs_master_pack_approval_status()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.status='approved' AND OLD.status IS DISTINCT FROM 'approved' THEN
    IF NOT EXISTS (
      SELECT 1
      FROM content.current_affairs_daily_master_pack_approval_packs link
      JOIN content.current_affairs_daily_master_pack_approvals approval
        ON approval.id=link.approval_id
      WHERE link.master_pack_id=NEW.id
        AND approval.status='approved'
    ) THEN
      RAISE EXCEPTION 'Canonical Daily Master Pack requires an active editorial approval record before status=approved';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_current_affairs_master_pack_approval_status
  ON content.current_affairs_daily_master_packs;
CREATE TRIGGER trg_guard_current_affairs_master_pack_approval_status
BEFORE UPDATE OF status ON content.current_affairs_daily_master_packs
FOR EACH ROW
EXECUTE FUNCTION content.guard_current_affairs_master_pack_approval_status();

CREATE OR REPLACE FUNCTION content.guard_current_affairs_master_pack_resource_publication()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.status='published' AND OLD.status IS DISTINCT FROM 'published' THEN
    IF EXISTS (
      SELECT 1
      FROM content.current_affairs_daily_master_packs pack
      WHERE pack.learning_resource_id=NEW.id
    ) THEN
      RAISE EXCEPTION 'Canonical Daily Master Pack learner publication requires a dedicated publication authority; editorial approval alone is not publication';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_current_affairs_master_pack_resource_publication
  ON content.learning_resources;
CREATE TRIGGER trg_guard_current_affairs_master_pack_resource_publication
BEFORE UPDATE OF status ON content.learning_resources
FOR EACH ROW
EXECUTE FUNCTION content.guard_current_affairs_master_pack_resource_publication();

COMMENT ON TABLE content.current_affairs_daily_master_pack_approvals IS
  'Immutable manual editorial decisions for the canonical EN/HI/PA Daily Master Pack set. Approval locks artifacts but does not publish learner resources.';

COMMENT ON TABLE content.current_affairs_daily_master_pack_approval_packs IS
  'Frozen language-level master-pack/resource payload hashes for a canonical Daily Master Pack editorial approval.';

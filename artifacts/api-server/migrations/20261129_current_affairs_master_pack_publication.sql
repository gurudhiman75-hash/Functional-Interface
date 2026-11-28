-- The dedicated learner-publication authority that CP-042 deferred.
-- A master-pack learning resource may become published only while an explicit,
-- audited publication record exists for an active editorial approval.

CREATE TABLE IF NOT EXISTS content.current_affairs_daily_master_pack_publications (
  id UUID PRIMARY KEY,
  approval_id UUID NOT NULL
    REFERENCES content.current_affairs_daily_master_pack_approvals(id) ON DELETE RESTRICT,
  published_by UUID NOT NULL REFERENCES identity.users(id) ON DELETE RESTRICT,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  withdrawn_by UUID REFERENCES identity.users(id) ON DELETE RESTRICT,
  withdrawn_at TIMESTAMPTZ,
  withdrawal_reason TEXT,
  CONSTRAINT current_affairs_master_pack_publication_withdrawal_state CHECK (
    (withdrawn_at IS NULL AND withdrawn_by IS NULL AND withdrawal_reason IS NULL)
    OR
    (withdrawn_at IS NOT NULL AND withdrawn_by IS NOT NULL
      AND NULLIF(BTRIM(COALESCE(withdrawal_reason, '')), '') IS NOT NULL)
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS current_affairs_master_pack_one_live_publication_idx
  ON content.current_affairs_daily_master_pack_publications(approval_id)
  WHERE withdrawn_at IS NULL;

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
    ) AND NOT EXISTS (
      SELECT 1
      FROM content.current_affairs_daily_master_pack_approval_packs link
      JOIN content.current_affairs_daily_master_pack_approvals approval
        ON approval.id=link.approval_id AND approval.status='approved'
      JOIN content.current_affairs_daily_master_pack_publications publication
        ON publication.approval_id=approval.id AND publication.withdrawn_at IS NULL
      JOIN content.current_affairs_daily_master_packs pack
        ON pack.id=link.master_pack_id AND pack.status='approved'
      WHERE link.learning_resource_id=NEW.id
    ) THEN
      RAISE EXCEPTION 'Canonical Daily Master Pack learner publication requires a dedicated publication authority; editorial approval alone is not publication';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- What was approved is what gets published: the generic resource editor must not
-- rewrite a pack while an editorial approval is active.
CREATE OR REPLACE FUNCTION content.guard_current_affairs_approved_pack_content()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF (NEW.title, NEW.summary, NEW.body_markdown, NEW.content_url, NEW.language_code, NEW.content_date)
       IS DISTINCT FROM
     (OLD.title, OLD.summary, OLD.body_markdown, OLD.content_url, OLD.language_code, OLD.content_date)
     AND EXISTS (
       SELECT 1
       FROM content.current_affairs_daily_master_pack_approval_packs link
       JOIN content.current_affairs_daily_master_pack_approvals approval
         ON approval.id=link.approval_id AND approval.status='approved'
       WHERE link.learning_resource_id=NEW.id
     ) THEN
    RAISE EXCEPTION 'This Current Affairs pack is approved and locked; reopen it for editing first';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_current_affairs_approved_pack_content
  ON content.learning_resources;
CREATE TRIGGER trg_guard_current_affairs_approved_pack_content
BEFORE UPDATE OF title, summary, body_markdown, content_url, language_code, content_date
ON content.learning_resources
FOR EACH ROW
EXECUTE FUNCTION content.guard_current_affairs_approved_pack_content();

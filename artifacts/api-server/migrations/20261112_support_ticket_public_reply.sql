-- Apply on production Neon before deploying student ticket tracking.
-- Keep administrator-only admin_note private; public_reply is the only student-facing reply.
ALTER TABLE platform.support_tickets ADD COLUMN IF NOT EXISTS public_reply text NOT NULL DEFAULT '';

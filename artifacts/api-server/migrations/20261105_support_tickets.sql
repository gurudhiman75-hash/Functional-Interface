-- Apply out of band before enabling EXAMTREE_SUPPORT_TICKETS_ENABLED.
-- Support messages contain personal data: restrict SQL access to API service identities.
CREATE TABLE IF NOT EXISTS platform.support_tickets (
  id uuid PRIMARY KEY,
  name varchar(120) NOT NULL,
  email varchar(254) NOT NULL,
  category varchar(100) NOT NULL,
  message text NOT NULL,
  status varchar(20) NOT NULL DEFAULT 'open',
  admin_note text NOT NULL DEFAULT '',
  sender_hash varchar(64) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT support_ticket_status_check CHECK (status IN ('open','in_progress','resolved','closed'))
);
CREATE INDEX IF NOT EXISTS support_tickets_created_idx ON platform.support_tickets (created_at DESC);
CREATE INDEX IF NOT EXISTS support_tickets_rate_idx ON platform.support_tickets (sender_hash,created_at DESC);
CREATE INDEX IF NOT EXISTS support_tickets_email_rate_idx ON platform.support_tickets (email,created_at DESC);

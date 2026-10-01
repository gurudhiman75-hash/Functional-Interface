CREATE TABLE IF NOT EXISTS platform.mobile_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  native_route text,
  render_mode text NOT NULL DEFAULT 'managed' CHECK (render_mode IN ('native','managed')),
  icon_name text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  show_app_bar boolean NOT NULL DEFAULT true,
  configuration jsonb NOT NULL DEFAULT '{"sections":[]}'::jsonb,
  sort_order integer NOT NULL DEFAULT 0,
  created_by text,
  updated_by text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO platform.mobile_pages (slug,title,description,native_route,render_mode,sort_order)
VALUES
 ('home','Home','Examtree mobile home','/home','native',10),
 ('learn','Learn','Canonical learning experience','/learn','native',20),
 ('exams','Exams','Canonical exams and tests catalogue','/exams','native',30),
 ('current-affairs','Current Affairs','Current affairs experience','/current-affairs','native',40),
 ('profile','Profile','Learner profile','/profile','native',50),
 ('store','Store','Preparation store','/store','native',60)
ON CONFLICT (slug) DO NOTHING;

CREATE INDEX IF NOT EXISTS mobile_pages_active_order_idx
  ON platform.mobile_pages (is_active, sort_order, updated_at DESC);

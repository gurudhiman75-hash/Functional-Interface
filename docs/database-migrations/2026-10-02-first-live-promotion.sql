BEGIN;

INSERT INTO platform.mobile_promotions (
  id,title,subtitle,cta_label,image_url,placement,destination_type,destination_value,campaign_kind,
  is_dismissible,frequency_cap_per_day,audience,is_active,start_at,end_at,sort_order,
  created_by,updated_by,created_at,updated_at
)
VALUES (
  '7f9e7e53-7b75-4dd8-8d79-6e32d8c90d01'::uuid,
  'New mock tests & learning content are live',
  'Explore the latest practice sets and learning content now available in Examtree.',
  'Explore now',
  '',
  'login_popup',
  'learn',
  '/learn',
  'internal',
  true,
  1,
  '{}'::jsonb,
  true,
  NULL,
  NULL,
  10,
  NULL,
  NULL,
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  title=EXCLUDED.title,
  subtitle=EXCLUDED.subtitle,
  cta_label=EXCLUDED.cta_label,
  placement=EXCLUDED.placement,
  destination_type=EXCLUDED.destination_type,
  destination_value=EXCLUDED.destination_value,
  campaign_kind=EXCLUDED.campaign_kind,
  is_dismissible=EXCLUDED.is_dismissible,
  frequency_cap_per_day=EXCLUDED.frequency_cap_per_day,
  audience=EXCLUDED.audience,
  is_active=EXCLUDED.is_active,
  sort_order=EXCLUDED.sort_order,
  updated_at=now();

COMMIT;

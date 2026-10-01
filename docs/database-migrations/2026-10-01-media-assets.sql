CREATE SCHEMA IF NOT EXISTS platform;

CREATE TABLE IF NOT EXISTS platform.media_assets (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  asset_type text NOT NULL,
  mime_type text NOT NULL,
  byte_size bigint NOT NULL CHECK (byte_size >= 0),
  width_px integer NULL CHECK (width_px IS NULL OR width_px > 0),
  height_px integer NULL CHECK (height_px IS NULL OR height_px > 0),
  storage_path text NOT NULL UNIQUE,
  download_url text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','archived')),
  created_by uuid NULL REFERENCES identity.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS media_assets_status_type_idx
  ON platform.media_assets (status, asset_type, created_at DESC);

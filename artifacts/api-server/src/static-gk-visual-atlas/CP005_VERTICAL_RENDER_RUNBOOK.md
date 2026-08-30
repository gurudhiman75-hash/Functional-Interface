# CP005 — Deterministic Vertical Silent Master

Status: first render-worker slice implemented on `feature/static-gk-visual-atlas-mvp`.

This slice converts a render-ready Static GK map scene into a reproducible 1080×1920 H.264 MP4. It intentionally does **not** add TTS, captions, music, or generative video. Those remain downstream layers after the visual master passes QA.

## Preconditions

Exactly one authoritative runtime geometry source must be configured:

```bash
export STATIC_GK_ATLAS_ADMIN_GEOMETRY_PATH=/approved/runtime/india-admin.geojson.gz
# or
export STATIC_GK_ATLAS_ADMIN_GEOMETRY_URL=https://approved-object-storage.example/india-admin.geojson.gz
```

The runtime loader validates the canonical geometry digest against the reviewed Survey of India ingest receipt before scene compilation. The renderer fails closed if the bundle is missing or invalid.

FFmpeg must be available as `ffmpeg`, or explicitly configured:

```bash
export STATIC_GK_ATLAS_FFMPEG_PATH=/usr/local/bin/ffmpeg
```

## Render the first visual

From `artifacts/api-server`:

```bash
node static-gk-atlas-tool.mjs render-vertical-video tropic ./tmp/static-gk-render
```

Standard Meridian uses the same worker:

```bash
node static-gk-atlas-tool.mjs render-vertical-video standard-meridian ./tmp/static-gk-render
```

Optional third argument sets FPS (1–60). Production default is 30 FPS.

```bash
node static-gk-atlas-tool.mjs render-vertical-video tropic ./tmp/static-gk-render 30
```

## Outputs

For `SGK-VIS-IND-GEO-001` the worker writes:

- `SGK-VIS-IND-GEO-001.silent-master.mp4`
- `SGK-VIS-IND-GEO-001.scene.json`
- `SGK-VIS-IND-GEO-001.render-plan.json`

The render plan records the exact frame count, FPS, duration, geometry ID, Survey of India product code, source archive digest, and canonical GeoJSON digest used for the master.

SVG frame intermediates are deleted after a successful FFmpeg assembly. Set `STATIC_GK_ATLAS_KEEP_FRAMES=1` to retain them for forensic/visual QA. Frames are always preserved when FFmpeg fails.

## Quality boundary

This is a **silent visual master**, not a publishable short. Publication remains blocked until CP005 adds and verifies:

1. English TTS aligned to fact-locked narration.
2. Captions/subtitles with narration parity.
3. Audio loudness/intelligibility checks.
4. Thumbnail generation.
5. Final MP4 QA receipt tying video checksum to scene + geometry digests.

The map itself remains deterministic. No AI/video model is allowed to redraw India, state boundaries, the Tropic line, the Standard Meridian, or Mirzapur geometry.

# CP005 — Deterministic Vertical Silent Master

Status: silent render worker + deterministic narration-window/caption-draft slice implemented on `feature/static-gk-visual-atlas-mvp`.

This slice converts a render-ready Static GK map scene into a reproducible 1080×1920 H.264 MP4. It also compiles fact-locked English narration into deterministic timing windows and draft subtitle artifacts. It intentionally does **not** synthesize audio yet: TTS remains a downstream operation that must fit inside these reviewed windows.

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
- `SGK-VIS-IND-GEO-001.narration-plan.json`
- `SGK-VIS-IND-GEO-001.captions.draft.vtt`
- `SGK-VIS-IND-GEO-001.captions.draft.srt`

The render plan records exact frame count, FPS, duration, geometry ID, Survey of India product code, source archive digest, and canonical GeoJSON digest used for the master.

The narration plan maps each locked narration beat to a non-overlapping visual window. It expands narration across adjacent shots that teach the same locked facts rather than assuming the single shot containing `narrationRef` is the whole speech duration. Windows above 210 required words/minute are flagged for editorial timing review.

The VTT/SRT files are **draft timing artifacts**. Final subtitle timings must be retimed to the measured TTS audio while remaining inside the approved narration windows.

SVG frame intermediates are deleted after successful FFmpeg assembly. Set `STATIC_GK_ATLAS_KEEP_FRAMES=1` to retain them for forensic/visual QA. Frames are always preserved when FFmpeg fails.

## Quality boundary

This is not yet a publishable short. Publication remains blocked until CP005 adds and verifies:

1. English TTS generated from the locked narration text only.
2. Measured audio durations constrained to approved narration windows.
3. Final caption timings with narration parity.
4. Audio loudness/intelligibility checks.
5. Thumbnail generation.
6. Final MP4 QA receipt tying video checksum to scene, narration and geometry digests.

The map itself remains deterministic. No AI/video model is allowed to redraw India, state boundaries, the Tropic line, the Standard Meridian, or Mirzapur geometry.

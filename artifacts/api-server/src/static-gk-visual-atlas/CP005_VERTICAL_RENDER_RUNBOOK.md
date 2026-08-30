# CP005 — Deterministic Vertical Master + Narration

Status: automated pre-publication pipeline implemented on `feature/static-gk-visual-atlas-mvp`.

The pipeline compiles fact-locked Static GK lessons into a reproducible 1080×1920 visual master, synthesizes separately checksummed English narration clips, validates measured WAV durations, places them at approved timeline offsets, normalizes voice delivery, muxes a narrated MP4, independently measures post-mux audio, extracts a deterministic thumbnail, and updates a checksum-bound QA receipt.

## 1. Render deterministic visuals

Configure exactly one authoritative runtime geometry source:

```bash
export STATIC_GK_ATLAS_ADMIN_GEOMETRY_PATH=/approved/runtime/india-admin.geojson.gz
# or
export STATIC_GK_ATLAS_ADMIN_GEOMETRY_URL=https://approved-object-storage.example/india-admin.geojson.gz
```

FFmpeg must be available as `ffmpeg`, or set `STATIC_GK_ATLAS_FFMPEG_PATH`.

From `artifacts/api-server`:

```bash
node static-gk-atlas-tool.mjs render-vertical-video tropic ./tmp/static-gk-render
```

## 2. Synthesize measured English narration

```bash
export STATIC_GK_ATLAS_TTS_MODEL=gpt-4o-mini-tts
export STATIC_GK_ATLAS_TTS_VOICE=marin
export STATIC_GK_ATLAS_TTS_SPEED=1
export STATIC_GK_ATLAS_TTS_INSTRUCTIONS='Clear, concise educational narration. Natural Indian-English pacing. Do not add words.'
export STATIC_GK_ATLAS_OPENAI_API_KEY=...
node static-gk-atlas-tool.mjs synthesize-narration tropic ./tmp/static-gk-render
```

`OPENAI_API_KEY` is accepted as a fallback. No external TTS call runs in CI. Narration over 210 WPM is rejected before API use; returned WAV clips must fit their approved visual windows and are SHA-256 bound into the TTS manifest.

## 3. Assemble the narrated master

```bash
node static-gk-atlas-tool.mjs assemble-narrated-master tropic ./tmp/static-gk-render
```

The assembler re-verifies every WAV checksum and duration, places each clip at its approved start offset, applies the CP005 voice target (`-16 LUFS`, `LRA 11`, `-1.5 dBTP`), preserves the deterministic H.264 visual stream, encodes AAC voice at 192 kbps, and emits `narrated-master.mp4` plus a provenance receipt.

## 4. Run automated post-mux QA

```bash
node static-gk-atlas-tool.mjs verify-narrated-master tropic ./tmp/static-gk-render
```

This independently analyzes the final MP4 audio using FFmpeg loudnorm measurement. It passes only when:

- integrated loudness is within ±1.5 LU of the -16 LUFS delivery target;
- measured true peak is at or below -1.0 dB;
- loudness range is at or below 12 LU.

It writes `<visualId>.audio-qa.json` even when the loudness gate fails. On success it extracts a 1080×1920 PNG thumbnail at the midpoint of the first concept shot (8 seconds for both current pilots), hashes both artifacts, and advances the QA receipt to `automated-qa-ready`.

## Complete pre-publication package

For `SGK-VIS-IND-GEO-001`:

- `SGK-VIS-IND-GEO-001.silent-master.mp4`
- `SGK-VIS-IND-GEO-001.narrated-master.mp4`
- `SGK-VIS-IND-GEO-001.thumbnail.png`
- `SGK-VIS-IND-GEO-001.scene.json`
- `SGK-VIS-IND-GEO-001.render-plan.json`
- `SGK-VIS-IND-GEO-001.narration-plan.json`
- `SGK-VIS-IND-GEO-001.tts-manifest.json`
- `SGK-VIS-IND-GEO-001.audio-qa.json`
- `SGK-VIS-IND-GEO-001.captions.draft.vtt/.srt`
- `SGK-VIS-IND-GEO-001.captions.measured.vtt/.srt`
- `SGK-VIS-IND-GEO-001.narration/*.wav`
- `SGK-VIS-IND-GEO-001.qa-receipt.json`

## Remaining publication gates

After `verify-narrated-master` succeeds, the receipt still deliberately has `publishReady: false`. Only these gates remain:

1. human narration intelligibility/pronunciation review;
2. final rendered-video visual/factual QA against locked facts and authoritative geometry;
3. explicit publish approval.

No generative model may redraw or reposition authoritative geography at any stage.

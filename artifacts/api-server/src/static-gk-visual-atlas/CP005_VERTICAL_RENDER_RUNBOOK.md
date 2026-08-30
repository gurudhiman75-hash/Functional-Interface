# CP005 — Deterministic Vertical Master + Narration

Status: end-to-end pre-publication master pipeline implemented on `feature/static-gk-visual-atlas-mvp`.

The pipeline now compiles fact-locked Static GK lessons into a reproducible 1080×1920 silent visual master, synthesizes separately checksummed English narration clips, validates their measured WAV durations, places them at approved timeline offsets, normalizes voice delivery, and muxes a narrated MP4 with a provenance/QA receipt.

## 1. Render the deterministic visual master

Configure exactly one authoritative runtime geometry source:

```bash
export STATIC_GK_ATLAS_ADMIN_GEOMETRY_PATH=/approved/runtime/india-admin.geojson.gz
# or
export STATIC_GK_ATLAS_ADMIN_GEOMETRY_URL=https://approved-object-storage.example/india-admin.geojson.gz
```

FFmpeg must be available as `ffmpeg`, or explicitly configured with `STATIC_GK_ATLAS_FFMPEG_PATH`.

From `artifacts/api-server`:

```bash
node static-gk-atlas-tool.mjs render-vertical-video tropic ./tmp/static-gk-render
```

This produces the 9:16 silent master, exact scene/render plans, deterministic draft captions and narration windows.

## 2. Synthesize measured English narration

Configuration is explicit so a model or voice cannot silently change an approved lesson:

```bash
export STATIC_GK_ATLAS_TTS_MODEL=gpt-4o-mini-tts
export STATIC_GK_ATLAS_TTS_VOICE=marin
export STATIC_GK_ATLAS_TTS_SPEED=1
export STATIC_GK_ATLAS_TTS_INSTRUCTIONS='Clear, concise educational narration. Natural Indian-English pacing. Do not add words.'
export STATIC_GK_ATLAS_OPENAI_API_KEY=...
```

`OPENAI_API_KEY` is accepted as a fallback. No external TTS call runs in CI.

```bash
node static-gk-atlas-tool.mjs synthesize-narration tropic ./tmp/static-gk-render
```

Before any request, narration above the 210-WPM editorial threshold is rejected. Each returned WAV is then measured and rejected from promotion if it exceeds its approved visual window. Successful synthesis writes checksummed WAV clips, a TTS manifest, and measured VTT/SRT captions.

## 3. Assemble the narrated master

```bash
node static-gk-atlas-tool.mjs assemble-narrated-master tropic ./tmp/static-gk-render
```

The assembler fails closed unless:

- the TTS manifest is `audio-ready`;
- every clip says `fitsWindow: true`;
- every WAV SHA-256 still matches its manifest;
- each WAV's measured duration still matches its recorded duration;
- TTS audio paths remain inside the render directory;
- the visual render plan is the canonical 1080×1920 master.

FFmpeg then delays each clip to its approved lesson offset, mixes the narration, applies the CP005 voice delivery normalization target (`-16 LUFS`, `LRA 11`, `-1.5 dBTP`), preserves the deterministic H.264 video stream, encodes AAC narration at 192 kbps, and trims the final file to the exact lesson duration.

## Outputs

For `SGK-VIS-IND-GEO-001`, the complete pre-publication package contains:

- `SGK-VIS-IND-GEO-001.silent-master.mp4`
- `SGK-VIS-IND-GEO-001.narrated-master.mp4`
- `SGK-VIS-IND-GEO-001.scene.json`
- `SGK-VIS-IND-GEO-001.render-plan.json`
- `SGK-VIS-IND-GEO-001.narration-plan.json`
- `SGK-VIS-IND-GEO-001.tts-manifest.json`
- `SGK-VIS-IND-GEO-001.captions.draft.vtt/.srt`
- `SGK-VIS-IND-GEO-001.captions.measured.vtt/.srt`
- `SGK-VIS-IND-GEO-001.narration/*.wav`
- `SGK-VIS-IND-GEO-001.qa-receipt.json`

The QA receipt binds the narrated video checksum to the silent master, geometry product/digests, TTS manifest, voice configuration and measured caption sidecar.

## Still blocked from publication

The `narrated-master-ready` receipt deliberately sets `publishReady: false`. Remaining gates are:

1. measured post-mux loudness/true-peak verification (the current FFmpeg stage normalizes but does not independently measure/certify output);
2. human pronunciation/intelligibility review;
3. full rendered-video visual QA against the fact lock and geometry;
4. thumbnail generation;
5. explicit publish approval.

No generative model may redraw or move authoritative geography at any stage.

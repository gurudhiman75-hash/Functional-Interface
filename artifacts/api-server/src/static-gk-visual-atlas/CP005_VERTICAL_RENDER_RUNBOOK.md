# CP005 — Deterministic Vertical Master + Narration

Status: silent render worker, deterministic narration/captions, and provider-backed English TTS gate implemented on `feature/static-gk-visual-atlas-mvp`.

The pipeline now produces a reproducible 1080×1920 H.264 silent master and can synthesize fact-locked English narration into separately checksummed WAV clips. TTS is downstream of locked educational copy and approved timing; it is not allowed to rewrite the lesson.

## Geometry/render prerequisites

Configure exactly one authoritative runtime geometry source:

```bash
export STATIC_GK_ATLAS_ADMIN_GEOMETRY_PATH=/approved/runtime/india-admin.geojson.gz
# or
export STATIC_GK_ATLAS_ADMIN_GEOMETRY_URL=https://approved-object-storage.example/india-admin.geojson.gz
```

FFmpeg must be available as `ffmpeg`, or explicitly configured:

```bash
export STATIC_GK_ATLAS_FFMPEG_PATH=/usr/local/bin/ffmpeg
```

Render a silent visual master from `artifacts/api-server`:

```bash
node static-gk-atlas-tool.mjs render-vertical-video tropic ./tmp/static-gk-render
node static-gk-atlas-tool.mjs render-vertical-video standard-meridian ./tmp/static-gk-render
```

## English narration prerequisites

The API server already carries the official OpenAI SDK. TTS configuration is deliberately explicit so model/voice changes cannot silently alter a previously approved lesson:

```bash
export STATIC_GK_ATLAS_TTS_MODEL=gpt-4o-mini-tts
export STATIC_GK_ATLAS_TTS_VOICE=marin
export STATIC_GK_ATLAS_TTS_SPEED=1
export STATIC_GK_ATLAS_TTS_INSTRUCTIONS='Clear, concise educational narration. Natural Indian-English pacing. Do not add words.'
export STATIC_GK_ATLAS_OPENAI_API_KEY=...
```

`OPENAI_API_KEY` is accepted as a fallback. Built-in voices are allow-listed in code. WAV is required because the worker measures the returned RIFF/WAVE duration before accepting a clip.

Synthesize narration:

```bash
node static-gk-atlas-tool.mjs synthesize-narration tropic ./tmp/static-gk-render
```

The command performs two independent timing gates:

1. Editorial speed QA rejects any locked narration window requiring more than 210 WPM before making an API call.
2. After synthesis, the returned WAV duration must fit inside the approved visual window. Oversized clips are retained with a `timing-rejected` manifest but are not promoted to measured captions.

No external TTS request runs in CI; tests cover configuration validation, narration timing and WAV duration parsing only.

## Outputs

The visual worker writes:

- `<visualId>.silent-master.mp4`
- `<visualId>.scene.json`
- `<visualId>.render-plan.json`
- `<visualId>.narration-plan.json`
- `<visualId>.captions.draft.vtt`
- `<visualId>.captions.draft.srt`

The narration worker adds:

- `<visualId>.narration/<narrationId>.wav`
- `<visualId>.tts-manifest.json`
- `<visualId>.captions.measured.vtt`
- `<visualId>.captions.measured.srt`

The TTS manifest records provider/model/voice/speed/instructions, each narration window, measured audio duration, audio SHA-256, sample rate/channels/bit depth, and whether the clip fit its approved timing window.

## Quality boundary

This is still pre-publication. Remaining CP005 work is:

1. assemble accepted narration WAV clips at their approved timeline offsets;
2. loudness/peak and intelligibility gates;
3. mux the audio master with the deterministic visual master;
4. burn or sidecar final captions as the product format requires;
5. generate thumbnail and final QA receipt with video/audio/scene/geometry checksums.

The geographic layer remains deterministic. No AI/video model may redraw India, state boundaries, the Tropic line, the Standard Meridian, Mirzapur, or any later river route.

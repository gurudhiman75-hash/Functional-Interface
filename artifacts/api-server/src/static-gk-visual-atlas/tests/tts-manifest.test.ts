import assert from "node:assert/strict";
import test from "node:test";

import { parseStaticGkTtsManifest } from "../audio/tts-manifest";

function fixture() {
  return {
    schemaVersion: "1.0",
    visualId: "SGK-VIS-IND-GEO-001",
    locale: "en-IN",
    status: "audio-ready",
    provider: "openai",
    model: "gpt-4o-mini-tts",
    voice: "marin",
    speed: 1,
    instructions: null,
    responseFormat: "wav",
    items: [{
      id: "SGK001-N01",
      text: "Which eight Indian states does the Tropic of Cancer cross?",
      factIds: ["SGK001-F02"],
      startMs: 0,
      approvedEndMs: 3_000,
      approvedWindowDurationMs: 3_000,
      measuredDurationMs: 2_200,
      fitsWindow: true,
      audioFile: "SGK-VIS-IND-GEO-001.narration/SGK001-N01.wav",
      audioSha256: "a".repeat(64),
      sampleRate: 24_000,
      channels: 1,
      bitsPerSample: 16,
    }],
  };
}

test("TTS manifest validator accepts checksum-bound audio-ready clips", () => {
  const parsed = parseStaticGkTtsManifest(fixture());
  assert.equal(parsed.status, "audio-ready");
  assert.equal(parsed.items[0].measuredDurationMs, 2_200);
});

test("TTS manifest validator rejects contradictory timing and malformed checksums", () => {
  const timing = fixture();
  timing.items[0].measuredDurationMs = 3_500;
  assert.throws(() => parseStaticGkTtsManifest(timing), /contradicts/);

  const checksum = fixture();
  checksum.items[0].audioSha256 = "not-a-digest";
  assert.throws(() => parseStaticGkTtsManifest(checksum), /SHA-256/);
});

import assert from "node:assert/strict";
import test from "node:test";

import { staticGkTtsConfigFromEnv } from "../audio/openai-tts-provider";

test("Static GK TTS requires explicit model and approved voice configuration", () => {
  assert.throws(
    () => staticGkTtsConfigFromEnv({ OPENAI_API_KEY: "test-key" }),
    /STATIC_GK_ATLAS_TTS_MODEL/,
  );
  assert.throws(
    () => staticGkTtsConfigFromEnv({
      OPENAI_API_KEY: "test-key",
      STATIC_GK_ATLAS_TTS_MODEL: "gpt-4o-mini-tts",
      STATIC_GK_ATLAS_TTS_VOICE: "unknown-voice",
    }),
    /must be one of/,
  );
});

test("Static GK TTS config accepts reproducible voice, speed and instructions", () => {
  const config = staticGkTtsConfigFromEnv({
    OPENAI_API_KEY: "test-key",
    STATIC_GK_ATLAS_TTS_MODEL: "gpt-4o-mini-tts",
    STATIC_GK_ATLAS_TTS_VOICE: "marin",
    STATIC_GK_ATLAS_TTS_SPEED: "1.05",
    STATIC_GK_ATLAS_TTS_INSTRUCTIONS: "Clear educational delivery.",
  });
  assert.equal(config.model, "gpt-4o-mini-tts");
  assert.equal(config.voice, "marin");
  assert.equal(config.speed, 1.05);
  assert.equal(config.instructions, "Clear educational delivery.");
  assert.equal(config.apiKey, "test-key");
});

test("Static GK TTS speed stays inside Speech API bounds", () => {
  const base = {
    OPENAI_API_KEY: "test-key",
    STATIC_GK_ATLAS_TTS_MODEL: "gpt-4o-mini-tts",
    STATIC_GK_ATLAS_TTS_VOICE: "cedar",
  };
  assert.throws(() => staticGkTtsConfigFromEnv({ ...base, STATIC_GK_ATLAS_TTS_SPEED: "0.2" }), /0.25/);
  assert.throws(() => staticGkTtsConfigFromEnv({ ...base, STATIC_GK_ATLAS_TTS_SPEED: "4.1" }), /0.25/);
});

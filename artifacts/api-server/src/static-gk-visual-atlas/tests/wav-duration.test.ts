import assert from "node:assert/strict";
import test from "node:test";

import { readWavAudioMetadata } from "../audio/wav-duration";

function makePcmWav(durationMs: number, sampleRate = 24_000, channels = 1, bitsPerSample = 16): Uint8Array {
  const bytesPerSample = bitsPerSample / 8;
  const blockAlign = channels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataBytes = Math.round((durationMs / 1000) * byteRate);
  const buffer = Buffer.alloc(44 + dataBytes);
  buffer.write("RIFF", 0, "ascii");
  buffer.writeUInt32LE(buffer.length - 8, 4);
  buffer.write("WAVE", 8, "ascii");
  buffer.write("fmt ", 12, "ascii");
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(channels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write("data", 36, "ascii");
  buffer.writeUInt32LE(dataBytes, 40);
  return new Uint8Array(buffer);
}

test("WAV metadata parser measures deterministic PCM duration", () => {
  const metadata = readWavAudioMetadata(makePcmWav(1_250));
  assert.equal(metadata.audioFormat, 1);
  assert.equal(metadata.channels, 1);
  assert.equal(metadata.sampleRate, 24_000);
  assert.equal(metadata.bitsPerSample, 16);
  assert.equal(metadata.durationMs, 1_250);
});

test("WAV metadata parser rejects non-WAVE and truncated chunks", () => {
  assert.throws(() => readWavAudioMetadata(new Uint8Array(44)), /RIFF\/WAVE/);
  const valid = Buffer.from(makePcmWav(100));
  valid.writeUInt32LE(valid.length * 2, 40);
  assert.throws(() => readWavAudioMetadata(new Uint8Array(valid)), /exceeds file bounds/);
});

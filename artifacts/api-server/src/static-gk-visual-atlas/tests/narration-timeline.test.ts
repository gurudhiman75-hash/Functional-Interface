import assert from "node:assert/strict";
import test from "node:test";

import {
  compileNarrationWindows,
  renderNarrationWindowsSrt,
  renderNarrationWindowsVtt,
} from "../audio/narration-timeline";
import { TROPIC_OF_CANCER_FACT_LOCK } from "../fact-packs/SGK-VIS-IND-GEO-001";
import { STANDARD_MERIDIAN_FACT_LOCK } from "../fact-packs/SGK-VIS-IND-GEO-002";
import { TROPIC_OF_CANCER_LESSON_MANIFEST } from "../lesson-manifests/SGK-VIS-IND-GEO-001.manifest";
import { STANDARD_MERIDIAN_LESSON_MANIFEST } from "../lesson-manifests/SGK-VIS-IND-GEO-002.manifest";

test("Tropic narration expands the state-sequence beat across all eight state shots", () => {
  const windows = compileNarrationWindows(TROPIC_OF_CANCER_LESSON_MANIFEST, TROPIC_OF_CANCER_FACT_LOCK);
  const sequence = windows.find((window) => window.id === "SGK001-N02");
  assert.ok(sequence);
  assert.equal(sequence.startMs, 10_000);
  assert.equal(sequence.endMs, 23_000);
  assert.equal(sequence.shotIds.length, 8);
  assert.equal(sequence.speedQa, "ok");

  const hook = windows.find((window) => window.id === "SGK001-N01");
  assert.ok(hook);
  assert.equal(hook.startMs, 0);
  assert.equal(hook.endMs, 3_000);
  assert.equal(hook.speedQa, "ok");
});

test("Standard Meridian narration claims the map-intro through Mirzapur teaching window without overlap", () => {
  const windows = compileNarrationWindows(STANDARD_MERIDIAN_LESSON_MANIFEST, STANDARD_MERIDIAN_FACT_LOCK);
  const hook = windows.find((window) => window.id === "SGK002-N01");
  assert.ok(hook);
  assert.equal(hook.speedQa, "ok");
  const concept = windows.find((window) => window.id === "SGK002-N02");
  assert.ok(concept);
  assert.equal(concept.startMs, 3_000);
  assert.equal(concept.endMs, 19_000);
  for (let index = 0; index + 1 < windows.length; index += 1) {
    assert.ok(windows[index].endMs <= windows[index + 1].startMs);
  }
});

test("draft subtitle exports remain deterministic and carry narration IDs/timestamps", () => {
  const windows = compileNarrationWindows(TROPIC_OF_CANCER_LESSON_MANIFEST, TROPIC_OF_CANCER_FACT_LOCK);
  const vtt = renderNarrationWindowsVtt(windows);
  const srt = renderNarrationWindowsSrt(windows);
  assert.match(vtt, /^WEBVTT/);
  assert.match(vtt, /SGK001-N02/);
  assert.match(vtt, /00:00:10\.000 --> 00:00:23\.000/);
  assert.match(srt, /00:00:10,000 --> 00:00:23,000/);
  assert.match(srt, /Gujarat, Rajasthan, Madhya Pradesh/);
});

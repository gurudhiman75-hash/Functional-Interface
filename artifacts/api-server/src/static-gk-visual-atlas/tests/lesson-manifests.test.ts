import assert from "node:assert/strict";
import test from "node:test";
import { TROPIC_OF_CANCER_FACT_LOCK } from "../fact-packs/SGK-VIS-IND-GEO-001";
import { STANDARD_MERIDIAN_FACT_LOCK } from "../fact-packs/SGK-VIS-IND-GEO-002";
import { TROPIC_OF_CANCER_LESSON_MANIFEST } from "../lesson-manifests/SGK-VIS-IND-GEO-001.manifest";
import { STANDARD_MERIDIAN_LESSON_MANIFEST } from "../lesson-manifests/SGK-VIS-IND-GEO-002.manifest";
import { compileLessonManifest } from "../lesson-manifests/compile";
import type { StaticGkLessonManifest } from "../lesson-manifests/types";

function cueAt(cues: ReturnType<typeof compileLessonManifest>, layer: string, timeMs: number) {
  return cues.find((cue) => cue.layer === layer && cue.startMs <= timeMs && timeMs < cue.endMs);
}

test("Tropic manifest is contiguous, fact-bound and compiles to the 35-second lesson", () => {
  const cues = compileLessonManifest(TROPIC_OF_CANCER_LESSON_MANIFEST, TROPIC_OF_CANCER_FACT_LOCK);
  assert.equal(TROPIC_OF_CANCER_LESSON_MANIFEST.durationMs, 35_000);
  assert.equal(TROPIC_OF_CANCER_LESSON_MANIFEST.shots.length, 14);
  assert.equal(cues.length, 14);
  assert.equal(cueAt(cues, "state-highlight", 10_500)?.targetRef, "state.GJ");
  assert.equal(cueAt(cues, "state-highlight", 21_000)?.targetRef, "state.MZ");
  assert.equal(cueAt(cues, "quiz", 32_000)?.action, "quiz");
});

test("Standard Meridian manifest is contiguous, fact-bound and compiles to the 33-second lesson", () => {
  const cues = compileLessonManifest(STANDARD_MERIDIAN_LESSON_MANIFEST, STANDARD_MERIDIAN_FACT_LOCK);
  assert.equal(STANDARD_MERIDIAN_LESSON_MANIFEST.durationMs, 33_000);
  assert.equal(STANDARD_MERIDIAN_LESSON_MANIFEST.shots.length, 8);
  assert.equal(cues.length, 8);
  assert.equal(cueAt(cues, "longitude-line", 7_000)?.targetRef, "line.standard-meridian");
  assert.equal(cueAt(cues, "district-highlight", 15_000)?.targetRef, "district.mirzapur");
  assert.equal(cueAt(cues, "quiz", 30_000)?.action, "quiz");
});

test("manifest compilation rejects a storyboard target absent from its fact pack", () => {
  const invalid = structuredClone(TROPIC_OF_CANCER_LESSON_MANIFEST) as StaticGkLessonManifest;
  invalid.shots[3].actions[0].targetRef = "state.NOT_REAL";
  assert.throws(
    () => compileLessonManifest(invalid, TROPIC_OF_CANCER_FACT_LOCK),
    /references unknown geo target state\.NOT_REAL/,
  );
});

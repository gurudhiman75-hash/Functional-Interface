import assert from "node:assert/strict";
import test from "node:test";

import { assertAiPlatePromptDoesNotContainLockedFacts, compileStaticGkAiShotPrompts } from "../ai-video/prompt-compiler";
import { buildRunwayGenerationBody } from "../ai-video/providers/runway";
import { getStaticGkAiShotPlan } from "../ai-video/shot-plans";

const LOCKED_FACT_TERMS = [
  "gujarat", "rajasthan", "madhya pradesh", "chhattisgarh", "jharkhand", "west bengal", "tripura", "mizoram",
  "mirzapur", "uttar pradesh", "23.5", "23½", "82°", "82.5", "+5:30",
];

test("AI shot plans provide five fixed cinematic plates for each renderable visual", () => {
  for (const visualId of ["SGK-VIS-IND-GEO-001", "SGK-VIS-IND-GEO-002"] as const) {
    const shots = getStaticGkAiShotPlan(visualId);
    assert.equal(shots.length, 5);
    assert.deepEqual(shots.map((shot) => shot.order), [1, 2, 3, 4, 5]);
    assert.ok(shots.every((shot) => shot.durationSeconds === 5));
    assert.ok(shots.every((shot) => shot.visualId === visualId));
  }
});

test("AI video prompts are cinematic plate prompts and do not contain locked fact labels", () => {
  for (const visualId of ["SGK-VIS-IND-GEO-001", "SGK-VIS-IND-GEO-002"] as const) {
    const prompts = compileStaticGkAiShotPrompts(getStaticGkAiShotPlan(visualId));
    for (const prompt of prompts) {
      const normalized = prompt.promptText.toLocaleLowerCase("en-IN");
      assert.match(normalized, /portrait 9:16/);
      assert.match(normalized, /no readable text/);
      assert.equal(prompt.promptSha256.length, 64);
      for (const term of LOCKED_FACT_TERMS) assert.equal(normalized.includes(term.toLocaleLowerCase("en-IN")), false, `${prompt.shotId} leaked ${term}`);
    }
  }
});

test("prompt guard rejects deterministic fact leakage", () => {
  assert.throws(() => assertAiPlatePromptDoesNotContainLockedFacts("cinematic map of Gujarat"), /leaked deterministic fact term/i);
});

test("Runway request is pinned to portrait Gen-4.5-compatible plate geometry", () => {
  assert.deepEqual(buildRunwayGenerationBody("Cinematic terrain"), {
    model: "gen4.5",
    promptText: "Cinematic terrain",
    ratio: "720:1280",
    duration: 5,
  });
});

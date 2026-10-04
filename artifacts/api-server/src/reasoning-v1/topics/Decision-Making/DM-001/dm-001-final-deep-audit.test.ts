import assert from "node:assert/strict";

import { reasoningV1QuestionStudioAdapter } from "../../../../question-studio/engines/reasoning-v1-adapter.ts";
import { DM_001_MANIFEST } from "./chapter-manifest.ts";
import { DM_001_QL_REGISTRY } from "./ql-registry.ts";
import { DM_001_SCENARIO_LIBRARY } from "./scenario-library.ts";
import { generateDm001QuestionStudioBatch } from "./question-studio-integration.ts";
import type { DmCheckpointId } from "./types.ts";

assert.equal(DM_001_MANIFEST.checkpointIds.length, 20);
assert.equal(DM_001_QL_REGISTRY.length, 60);
assert.equal(DM_001_SCENARIO_LIBRARY.length, 800);
assert.equal(new Set(DM_001_QL_REGISTRY.map((entry) => entry.qlId)).size, 60);

const expectedCheckpointCounts = new Map<DmCheckpointId, number>();
for (let cp = 1; cp <= 20; cp += 1) {
  const id = ("DM-CP-" + String(cp).padStart(3, "0")) as DmCheckpointId;
  expectedCheckpointCounts.set(id, cp <= 10 ? 25 : cp <= 16 ? 75 : 25);
}
for (const [checkpointId, expected] of expectedCheckpointCounts) {
  const scenarios = DM_001_SCENARIO_LIBRARY.filter((scenario) => scenario.checkpointId === checkpointId);
  assert.equal(scenarios.length, expected, checkpointId + ": unexpected scenario-authority count.");
  assert.ok(new Set(scenarios.map((scenario) => scenario.scenarioId)).size === expected);
}

for (const ql of DM_001_QL_REGISTRY) {
  const scenarios = DM_001_SCENARIO_LIBRARY.filter((scenario) => scenario.qlId === ql.qlId);
  assert.ok(scenarios.length >= 8, ql.qlId + ": insufficient scenario breadth.");
  assert.ok(scenarios.every((scenario) =>
    scenario.context.en.trim().length > 0 &&
    scenario.context.hi.trim().length > 0 &&
    scenario.context.pa.trim().length > 0
  ));
}

const bannedEnglish = [
  /the age limit is exceeded by no more than two years/i,
  /every other basic condition is met/i,
  /the rules send the case/i,
  /which result is supported by the information given/i,
  /which result follows after each condition is checked/i,
  /directions\s*:/i,
];

for (const ql of DM_001_QL_REGISTRY) {
  for (const language of ["en", "hi", "pa"] as const) {
    const batch = await generateDm001QuestionStudioBatch({
      packageId: "DM-001",
      patternId: ql.qlId,
      language,
      count: 1,
      seed: "dm-final-audit:" + ql.qlId + ":" + language,
    });
    assert.equal(batch.questions.length, 1);
    const question = batch.questions[0]!;
    assert.equal(question.qlId, ql.qlId);
    assert.equal(question.questionBankWritable, false);
    assert.equal(question.testEligible, false);
    assert.equal(question.mockTestEligible, false);
    assert.equal(question.publiclyPublishable, false);
    assert.ok(String(question.stem).length > 80);
    assert.ok(String(question.explanation).length > 60);
    const options = question.options as readonly string[];
    assert.equal(options.length, 4);
    assert.equal(new Set(options).size, 4);
    assert.ok(Number(question.correctIndex) >= 0 && Number(question.correctIndex) < 4);
    if (language === "en") {
      for (const pattern of bannedEnglish) assert.doesNotMatch(String(question.stem), pattern);
    } else if (language === "hi") {
      assert.match(String(question.stem), /[\u0900-\u097F]/u);
      assert.match(String(question.explanation), /[\u0900-\u097F]/u);
    } else {
      assert.match(String(question.stem), /[\u0A00-\u0A7F]/u);
      assert.match(String(question.explanation), /[\u0A00-\u0A7F]/u);
    }
  }
}

for (const language of ["en", "hi", "pa"] as const) {
  const mixed = await generateDm001QuestionStudioBatch({
    packageId: "DM-001",
    language,
    count: 20,
    seed: "dm-final-mixed-breadth:" + language,
  });
  const cps = mixed.questions.map((q) => String(q.checkpointId));
  assert.equal(new Set(cps).size, 20, language + ": 20-question mixed review must cover all 20 checkpoints.");
  for (let cp = 1; cp <= 20; cp += 1) {
    assert.ok(cps.includes("DM-CP-" + String(cp).padStart(3, "0")));
  }
  const answerModes = new Set(mixed.questions.map((q) => String(q.answerMode)));
  assert.ok(answerModes.has("ELIGIBILITY_OUTCOME"));
  assert.ok(answerModes.has("SITUATIONAL_ACTION"));
  assert.ok(answerModes.has("RANKED_CANDIDATE_SET"));
  assert.ok(
    answerModes.has("MULTI_PERSON_DECISION_SET") || answerModes.has("MIXED_DECISION_SET"),
    language + ": mixed review must expose set-based decision making.",
  );
}

const registered = reasoningV1QuestionStudioAdapter.listPackages().find((pkg) => pkg.packageId === "DM-001");
assert.ok(registered, "DM-001 must be registered in the current Reasoning V1 adapter.");
assert.equal(registered?.lifecycleStage, "REVIEW_ONLY");
assert.equal(registered?.questionBankWritable, false);
assert.equal(registered?.testEligible, false);

console.log(JSON.stringify({
  status: "PASS_DM_001_FINAL_DEEP_AUDIT",
  checkpointCount: 20,
  permanentQlCount: 60,
  scenarioAuthorityCount: 800,
  mixedBatchCheckpointCoverage: 20,
  languages: ["en", "hi", "pa"],
  lifecycle: "review-only",
}, null, 2));

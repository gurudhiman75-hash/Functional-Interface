import assert from "node:assert/strict";

import { RNK_001_CHAPTER_AUTHORITY } from "./manifest";
import { generateRnk001QuestionStudioBatch } from "./rnk-001-question-studio-integration-v2";

const bannedLearnerPatterns = [
  /admin metadata/iu,
  /option validation/iu,
  /learner fingerprint/iu,
  /runtime fingerprint/iu,
  /review metadata/iu,
  /use the smallest sufficient reasoning display for the task/iu,
  /exam speed shortcut/iu,
  /option analysis/iu,
];

let audited = 0;
const firstByQl = new Map<string, Record<string, any>>();

for (let round = 0; round < 3; round += 1) {
  const batch = await generateRnk001QuestionStudioBatch({
    packageId: "RNK-001",
    language: "en",
    count: 42,
    seed: `rnk-wave03-round-${round}`,
  });

  assert.equal(batch.questions.length, 42);
  assert.deepEqual(
    [...new Set((batch.questions as Array<Record<string, any>>).map((question) => question.qlId))].sort(),
    RNK_001_CHAPTER_AUTHORITY.permanentQlIds,
  );

  for (const raw of batch.questions as Array<Record<string, any>>) {
    audited += 1;
    firstByQl.set(String(raw.qlId), firstByQl.get(String(raw.qlId)) ?? raw);

    const explanation = String(raw.explanation ?? "").trim();
    assert.ok(explanation.length > 0, `${raw.qlId} must have a learner explanation`);
    assert.doesNotMatch(explanation, /^\s*\[/u);
    assert.doesNotMatch(explanation, /\["/u);
    assert.doesNotMatch(explanation, /"\]/u);

    for (const pattern of bannedLearnerPatterns) {
      assert.doesNotMatch(explanation, pattern, `${raw.qlId} leaked internal/editorial explanation text`);
    }

    assert.equal(raw.questionBankWritable, false);
    assert.equal(raw.testEligible, false);
    assert.equal(raw.mockTestEligible, false);
    assert.equal(raw.publiclyPublishable, false);
    assert.equal(raw.productionReleaseAuthorized, false);
  }
}

for (const qlId of [
  "RNK-QL-027",
  "RNK-QL-028",
  "RNK-QL-031",
  "RNK-QL-032",
  "RNK-QL-033",
  "RNK-QL-034",
  "RNK-QL-035",
] as const) {
  const question = firstByQl.get(qlId);
  assert.ok(question, `${qlId} must exist in the batched audit sample`);
  assert.doesNotMatch(String(question!.explanation), /admin|metadata|validation/iu);
  assert.ok(String(question!.explanation).split(/\n+/u).filter(Boolean).length >= 2);
}

console.log(JSON.stringify({
  verdict: "PASS_RNK_001_FINAL_AUDIT_WAVE_03_EXPLANATION_HYGIENE",
  qlCoverage: "RNK-QL-001..042",
  generatedEnglishInstancesAudited: audited,
  generationCalls: 3,
  bannedInternalEditorialLeakage: true,
  serializedArrayExplanationRejected: true,
  lifecycle: "REVIEW_ONLY",
}, null, 2));

import assert from "node:assert/strict";

import { reasoningV1QuestionStudioAdapter } from "../../question-studio/engines/reasoning-v1-adapter";

const cases = [
  { packageId: "OPS-001", difficulty: "Medium" as const },
  { packageId: "DIR-001", difficulty: "Medium" as const },
  { packageId: "CLK-001", difficulty: "Hard" as const },
] as const;

for (const item of cases) {
  const result = await reasoningV1QuestionStudioAdapter.generate({
    engineId: "reasoning-v1",
    packageId: item.packageId,
    language: "en",
    difficulty: item.difficulty,
    count: 10,
    seed: "live-adapter-proof-" + item.packageId,
  });

  assert.equal(result.questions.length, 10, item.packageId);
  const novel = result.questions.filter((question) => question.provenance === "CONTROLLED_NOVEL");
  assert.equal(novel.length, 2, item.packageId + ": adapter must surface the governed 20% novelty lane");
  assert.equal((result.generationContext?.noveltyMix as any)?.applied, true);
  assert.equal((result.generationContext?.noveltyMix as any)?.controlledNovelShare, 0.2);

  for (const question of novel) {
    assert.equal(question.questionStudioNoveltyMixActivated, true);
    assert.equal(question.humanReviewCompleted, true);
    assert.equal(question.reviewOnly, true);
    assert.equal(question.productionReleased, false);
    assert.equal(question.difficulty, item.difficulty);
    assert.equal(Array.isArray(question.parentQlIds), true);
    assert.ok(String(question.explanation ?? "").length > 40);
  }
}

const scoped = await reasoningV1QuestionStudioAdapter.generate({
  engineId: "reasoning-v1",
  packageId: "OPS-001",
  patternId: "OPS-QL-008",
  language: "en",
  difficulty: "Medium",
  count: 10,
  seed: "live-adapter-scoped-proof",
});
assert.equal(scoped.questions.some((question) => question.provenance === "CONTROLLED_NOVEL"), false);
assert.equal(
  (scoped.generationContext?.noveltyMix as any)?.blockedReason,
  "EXPLICIT_QL_OR_CP_SCOPE_PRESERVED",
);

console.log(JSON.stringify({
  status: "PASS_REASONING_NOVELTY_QUESTION_STUDIO_LIVE_ADAPTER_20261002",
  packages: cases.map((item) => item.packageId),
  controlledNovelShare: 0.2,
  explicitScopeProtected: true,
}, null, 2));

import assert from "node:assert/strict";

import { normalizeGeneratedQuestionPayload } from "../../../../../lib/admin-question-conversion";
import { analyzeGeneratedQuestionPayload } from "../../../../../lib/question-studio-quality";
import {
  OPS_001_REASONING_PACKAGE,
  generateQuestion,
  getOpsQlDifficulty,
  listReasoningV1Packages,
} from "../../../../../reasoning-v1/generation-engine";
import {
  OPS_001_ANALYTICS_DEFINITION,
  buildOpsAnalyticsDimensions,
} from "../analytics";
import {
  OPS_001_DELIVERY_POLICY,
  buildOpsInternalDeliveryPreview,
  buildOpsStudentPrompt,
  buildOpsStudentSolution,
} from "../delivery-adapter";
import { OPS_CHECKPOINT_RUNTIMES } from "../runtime";
import {
  OPS_CHECKPOINT_RANGES,
  OPS_QL_ENTRIES,
  OPS_QL_FREEZE_VERSION,
} from "../registry";

const LANGUAGES = ["en", "hi", "pa"] as const;

assert.equal(OPS_QL_ENTRIES.length, 31);
assert.equal(Object.keys(OPS_CHECKPOINT_RUNTIMES).length, 9);
assert.equal(OPS_001_REASONING_PACKAGE.qlCount, 31);
assert.equal(OPS_001_REASONING_PACKAGE.publiclyPublishable, false);
assert.equal(OPS_001_REASONING_PACKAGE.maturity, "FROZEN_INTERNAL");
assert.equal(OPS_001_DELIVERY_POLICY.publicationEnabled, false);
assert.equal(OPS_001_DELIVERY_POLICY.studentRouteRegistered, false);
assert.equal(OPS_001_ANALYTICS_DEFINITION.publiclyPublishable, false);
assert.deepEqual(listReasoningV1Packages(), [OPS_001_REASONING_PACKAGE]);

for (const [checkpointId, runtime] of Object.entries(OPS_CHECKPOINT_RUNTIMES)) {
  const range = OPS_CHECKPOINT_RANGES[checkpointId as keyof typeof OPS_CHECKPOINT_RANGES];
  assert.equal(runtime.qlCount, range.count);
  assert.deepEqual(runtime.qlRange, [range.first, range.last]);
  assert.equal(runtime.publiclyPublishable, false);
  assert.equal(runtime.maturity, "FROZEN_INTERNAL");
  assert.deepEqual(runtime.supportedLanguages, ["en", "hi", "pa"]);
}

let generatedCount = 0;
for (const entry of OPS_QL_ENTRIES) {
  const difficulty = getOpsQlDifficulty(entry.qlId);
  for (const language of LANGUAGES) {
    const seed = `ops-001-integration:${entry.qlId}:${language}`;
    const first = await generateQuestion({
      packageId: "OPS-001",
      questionLanguageId: entry.qlId,
      language,
      difficulty,
      seed,
      count: 1,
    });
    const second = await generateQuestion({
      packageId: "OPS-001",
      questionLanguageId: entry.qlId,
      language,
      difficulty,
      seed,
      count: 1,
    });

    assert.deepEqual(
      first.questions,
      second.questions,
      `${entry.qlId} ${language} previews must be deterministic.`,
    );
    assert.deepEqual(
      first.questionPackages,
      second.questionPackages,
      `${entry.qlId} ${language} packages must be deterministic.`,
    );
    assert.equal(first.questions.length, 1);
    assert.equal(first.questionPackages.length, 1);
    assert.equal(first.generationContext.generationDomain, "reasoning-v1");
    assert.equal(first.generationContext.publiclyPublishable, false);
    assert.equal(first.generationContext.publicationEnabled, false);
    assert.equal(first.generationContext.qlFreezeVersion, OPS_QL_FREEZE_VERSION);

    const preview = first.questions[0]!;
    assert.equal(preview.packageId, "OPS-001");
    assert.equal(preview.patternId, entry.qlId);
    assert.equal(preview.questionLanguageId, entry.qlId);
    assert.equal(preview.canonicalProblemId, entry.checkpointId);
    assert.equal(preview.section, "Reasoning");
    assert.equal(preview.subject, "Reasoning Ability");
    assert.equal(preview.generationBackend, "reasoning-v1");
    assert.equal(preview.publiclyPublishable, false);
    assert.equal(preview.metadata.publicationEnabled, false);
    assert.equal(preview.metadata.publiclyPublishable, false);
    assert.equal(preview.options.length, 4);
    assert.equal(new Set(preview.options).size, 4);
    assert.equal(preview.options[preview.correctIndex], preview.canonicalAnswer);
    assert.ok(preview.text.length > 0);
    assert.ok(preview.explanation.length >= 24);

    const quality = analyzeGeneratedQuestionPayload(preview);
    assert.equal(
      quality.blockerCount,
      0,
      `${entry.qlId} ${language} failed Question Studio quality: ${JSON.stringify(quality.issues)}`,
    );
    assert.equal(quality.readyForApproval, true);

    const normalized = normalizeGeneratedQuestionPayload(preview, {
      itemId: `item-${entry.qlId}-${language}`,
      generationRunCode: "GEN-OPS-INTEGRATION",
    });
    const generation = normalized.answerModel.generation as Record<string, unknown>;
    assert.equal(generation.packageId, "OPS-001");
    assert.equal(generation.generationDomain, "reasoning-v1");
    assert.equal(generation.qlId, entry.qlId);
    assert.equal(generation.checkpointId, entry.checkpointId);
    assert.equal(generation.candidateId, entry.candidateId);
    assert.equal(generation.qlFreezeVersion, OPS_QL_FREEZE_VERSION);
    assert.equal(generation.publiclyPublishable, false);
    assert.equal(generation.publicationEnabled, false);
    generatedCount += 1;
  }

  const prompt = buildOpsStudentPrompt({
    qlId: entry.qlId,
    seed: 17,
    language: "en",
  });
  const solution = buildOpsStudentSolution({
    qlId: entry.qlId,
    seed: 17,
    language: "en",
  });
  assert.equal("correctIndex" in prompt, false);
  assert.equal("answer" in prompt, false);
  assert.equal("explanation" in prompt, false);
  assert.equal(prompt.publication.publiclyPublishable, false);
  assert.ok(solution.correctIndex >= 0 && solution.correctIndex < 4);
  assert.ok(solution.explanation.length >= 24);

  const internal = buildOpsInternalDeliveryPreview({
    access: "internal-preview",
    qlId: entry.qlId,
    seed: 19,
    language: "hi",
  });
  assert.equal(internal.publiclyPublishable, false);
  assert.equal(internal.prompt.publication.publicationEnabled, false);

  const analytics = buildOpsAnalyticsDimensions({
    qlId: entry.qlId,
    language: "pa",
    difficulty,
    seed: "analytics-seed",
    generationSource: "question-studio",
  });
  assert.equal(analytics.qlId, entry.qlId);
  assert.equal(analytics.checkpointId, entry.checkpointId);
  assert.equal(analytics.qlFreezeVersion, OPS_QL_FREEZE_VERSION);
  assert.equal(analytics.publiclyPublishable, false);
}

assert.equal(generatedCount, 31 * 3);

const cpBatch = await generateQuestion({
  packageId: "OPS-001",
  canonicalProblemId: "OPS-CP-005",
  language: "pa",
  seed: "cp-batch",
  count: OPS_CHECKPOINT_RANGES["OPS-CP-005"].count,
});
assert.equal(cpBatch.questions.length, OPS_CHECKPOINT_RANGES["OPS-CP-005"].count);
for (const preview of cpBatch.questions) {
  assert.equal(preview.canonicalProblemId, "OPS-CP-005");
}

await assert.rejects(
  () => generateQuestion({ packageId: "OPS-002", count: 1 }),
  /supports OPS-001 only/u,
);

console.log("OPS-001 internal integration proof passed.", {
  qlCount: OPS_QL_ENTRIES.length,
  checkpointCount: Object.keys(OPS_CHECKPOINT_RUNTIMES).length,
  languages: LANGUAGES,
  generatedCount,
  publiclyPublishable: false,
});

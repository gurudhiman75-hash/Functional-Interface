import assert from "node:assert/strict";
import { generateQuestion, listQuantV4Packages } from "../../../../../generation-engine";
import {
  GEO_001_QUESTION_STUDIO_CP_IDS,
  GEO_001_QUESTION_STUDIO_QL_IDS,
  GEO_001_QUESTION_STUDIO_STANDARD_INTEGRATION_V1,
  inferGeo001QuestionStudioCpFromQl,
} from "../question-studio-standard-integration";
import { generateGeometryPermanentEnglishFrozenV1 } from "../permanent-review/geometry-permanent-english-freeze-v1";
import { generateGeometryPermanentMultilingualFrozenV1 } from "../permanent-review/geometry-permanent-multilingual-freeze-v1";
import { GEO_PERMANENT_MULTILINGUAL_FREEZE_PROOF_V1 } from "../permanent-review/geometry-permanent-multilingual-freeze-proof-v1";

assert.equal(GEO_PERMANENT_MULTILINGUAL_FREEZE_PROOF_V1.lifecycle.multilingualFreezeProven, true);
assert.equal(GEO_PERMANENT_MULTILINGUAL_FREEZE_PROOF_V1.lifecycle.questionStudioIntegrationAllowed, true);
assert.equal(GEO_001_QUESTION_STUDIO_QL_IDS.length, 75);
assert.equal(GEO_001_QUESTION_STUDIO_CP_IDS.length, 14);
assert.equal(GEO_001_QUESTION_STUDIO_STANDARD_INTEGRATION_V1.lifecycle.questionStudioDiscoverable, true);
assert.equal(GEO_001_QUESTION_STUDIO_STANDARD_INTEGRATION_V1.lifecycle.questionBankWritable, false);

const packages = listQuantV4Packages().filter((pkg) => pkg.packageId === "GEO-001");
assert.equal(packages.length, 1, "normal Quant registry must expose GEO-001 exactly once");
const packageCard = packages[0] as any;
assert.equal(packageCard.enabled, true);
assert.equal(packageCard.runtimeMode, "QUESTION_STUDIO_ACTIVE");
assert.equal(packageCard.questionStudioDiscoverable, true);
assert.equal(packageCard.lifecycleStage, "REVIEW_ONLY");
assert.equal(packageCard.reviewSurfaceRequired, true);
assert.equal(packageCard.manualApprovalRequired, true);
assert.equal(packageCard.questionBankStatus, "NOT_STORED");
assert.equal(packageCard.questionBankWritable, false);
assert.equal(packageCard.testEligibility, "INELIGIBLE");
assert.equal(packageCard.publiclyPublishable, false);
assert.deepEqual(packageCard.supportedLanguages, ["en", "hi", "pa"]);
assert.deepEqual(packageCard.cpIds, GEO_001_QUESTION_STUDIO_CP_IDS);
assert.deepEqual(packageCard.questionLanguageIds, GEO_001_QUESTION_STUDIO_QL_IDS);

function assertFrozenParity(question: any, language: "en" | "hi" | "pa") {
  assert.equal(question.packageId, "GEO-001");
  assert.equal(question.patternId, "GEO-001");
  assert.equal(question.topic, "Advanced Mathematics");
  assert.equal(question.subtopic, "Geometry");
  assert.equal(question.language, language);
  assert.equal(question.runtimeMode, "QUESTION_STUDIO_ACTIVE");
  assert.equal(question.reviewStatus, "FROZEN_MULTILINGUAL_CONTENT_AUTHORITY");
  assert.equal(question.questionStudioDiscoverable, true);
  assert.equal(question.questionBankStatus, "NOT_STORED");
  assert.equal(question.questionBankWritable, false);
  assert.equal(question.testEligibility, "INELIGIBLE");
  assert.equal(question.testEligible, false);
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options).size, 4);
  assert.equal(question.answer, question.options[question.correctIndex]);
  assert.equal(question.canonicalProblemId, inferGeo001QuestionStudioCpFromQl(question.qlId));

  const variantIndex = Number(question.metadata.variantIndex);
  const frozen = language === "en"
    ? generateGeometryPermanentEnglishFrozenV1(question.qlId, question.seed, variantIndex)
    : generateGeometryPermanentMultilingualFrozenV1(
        question.qlId,
        question.seed,
        language === "hi" ? "hi-IN" : "pa-IN",
        variantIndex,
      );
  assert.equal(question.text, frozen.question);
  assert.deepEqual(question.options, [...frozen.options]);
  assert.equal(question.correctIndex, frozen.correctIndex);
  assert.equal(question.answer, frozen.canonicalAnswer);
  assert.equal(question.explanation, frozen.explanation);
  assert.equal(question.stemSvg, frozen.stemSvg);
  assert.equal(question.canonicalGeometryFingerprint, frozen.canonicalGeometryFingerprint);
  assert.equal(question.diagramFingerprint, frozen.diagramFingerprint);
  if (frozen.stemSvg) {
    assert.deepEqual(question.stimulusSvgs, [frozen.stemSvg]);
    assert.equal(question.renderer, "svg");
  } else {
    assert.equal(question.stimulusSvgs, undefined);
    assert.equal(question.renderer, "text");
  }
}

let qlLanguageCoverageCount = 0;
let diagramBearingPreviewCount = 0;
for (const qlId of GEO_001_QUESTION_STUDIO_QL_IDS) {
  for (const language of ["en", "hi", "pa"] as const) {
    const result = await generateQuestion({
      packageId: "GEO-001" as never,
      questionLanguageId: qlId,
      language,
      count: 1,
      seed: `geo-qs-proof-${qlId.toLowerCase()}-${language}`,
    });
    assert.equal(result.questions.length, 1);
    const question = result.questions[0] as any;
    assert.equal(question.qlId, qlId);
    assertFrozenParity(question, language);
    if (question.stemSvg) diagramBearingPreviewCount += 1;
    qlLanguageCoverageCount += 1;
  }
}
assert.equal(qlLanguageCoverageCount, 225);
assert.ok(diagramBearingPreviewCount > 0);

for (const cpId of GEO_001_QUESTION_STUDIO_CP_IDS) {
  const result = await generateQuestion({
    packageId: "GEO-001" as never,
    canonicalProblemId: cpId,
    language: "en",
    count: 1,
    seed: `geo-qs-cp-proof-${cpId.toLowerCase()}`,
  });
  assert.equal((result.questions[0] as any).canonicalProblemId, cpId);
  assertFrozenParity(result.questions[0] as any, "en");
}

const mixed = await generateQuestion({
  packageId: "GEO-001" as never,
  language: "en",
  count: 75,
  seed: "geo-qs-proof-all-75",
});
assert.deepEqual(
  [...new Set(mixed.questions.map((question: any) => question.qlId))].sort(),
  [...GEO_001_QUESTION_STUDIO_QL_IDS].sort(),
);
assert.equal(mixed.generationContext.questionBankWritable, false);
assert.equal(mixed.generationContext.testEligible, false);
assert.equal(mixed.generationContext.publiclyPublishable, false);

const topicRoute = await generateQuestion({
  topic: "Advanced Mathematics",
  subtopic: "Geometry",
  language: "hi",
  count: 2,
  seed: "geo-qs-topic-selector-proof",
});
for (const question of topicRoute.questions as any[]) assertFrozenParity(question, "hi");

const mixedDifficultyProbe = await generateQuestion({
  packageId: "GEO-001" as never,
  language: "en",
  count: 12,
  seed: "geo-qs-mixed-difficulty-proof",
});
for (const question of mixedDifficultyProbe.questions as any[]) {
  const variantIndex = Number(question.metadata.variantIndex);
  const frozen = generateGeometryPermanentEnglishFrozenV1(question.qlId, question.seed, variantIndex);
  assert.equal(question.difficulty, frozen.difficulty);
  assert.equal(question.difficultyLabel, frozen.difficulty);
  assert.equal(question.proceduralLogic.sourceDifficulty, frozen.difficulty);
  assert.equal(question.proceduralLogic.difficultyRoutingMode, "FROZEN_SOURCE_MIXED");
}

for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
  const result = await generateQuestion({
    packageId: "GEO-001" as never,
    difficulty,
    language: "en",
    count: difficulty === "Hard" ? 1 : 8,
    seed: `geo-qs-explicit-difficulty-${difficulty.toLowerCase()}`,
  });
  assert.ok(result.questions.length >= 1);
  for (const question of result.questions as any[]) {
    assert.equal(question.difficulty, difficulty);
    assert.equal(question.difficultyLabel, difficulty);
    assert.equal(question.proceduralLogic.sourceDifficulty, difficulty);
    assert.equal(question.proceduralLogic.difficultyRoutingMode, "FROZEN_SOURCE_DIFFICULTY_MATCH");
  }
}

await assert.rejects(
  () => generateQuestion({
    packageId: "GEO-001" as never,
    questionLanguageId: "GEO-QL-001",
    difficulty: "Hard",
    count: 1,
    seed: "geo-qs-unreachable-hard-proof",
  }),
  /has no Hard Question Studio QLs|has no Hard Geometry variant/u,
);

await assert.rejects(
  () => generateQuestion({ packageId: "GEO-001" as never, questionLanguageId: "GEO-QL-999", count: 1 }),
  /Unknown question language/u,
);
await assert.rejects(
  () => generateQuestion({ packageId: "GEO-001" as never, canonicalProblemId: "GEO-CP-999", count: 1 }),
  /Unknown canonical problem/u,
);
await assert.rejects(
  () => generateQuestion({
    packageId: "GEO-001" as never,
    canonicalProblemId: "GEO-CP-001",
    questionLanguageId: "GEO-QL-075",
    count: 1,
  }),
  /belongs to/u,
);

console.log(JSON.stringify({
  status: "PASS_GEOMETRY_NORMAL_QUESTION_STUDIO_INTEGRATION_V1",
  packageId: "GEO-001",
  permanentQlCount: 75,
  cpCount: 14,
  languages: ["en", "hi", "pa"],
  qlLanguageCoverageCount,
  cpCoverageCount: 14,
  mixedBatchCoverageCount: mixed.questions.length,
  diagramBearingPreviewCount,
  questionStudioDiscoverable: true,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  sourceMultilingualFreezeArtifactId: GEO_PERMANENT_MULTILINGUAL_FREEZE_PROOF_V1.proof.artifactId,
  postProofNextGate: GEO_001_QUESTION_STUDIO_STANDARD_INTEGRATION_V1.postProofNextGate,
}, null, 2));

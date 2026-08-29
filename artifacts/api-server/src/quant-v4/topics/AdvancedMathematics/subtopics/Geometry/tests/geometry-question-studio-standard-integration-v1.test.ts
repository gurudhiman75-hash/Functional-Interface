import assert from "node:assert/strict";
import { generateQuestion, listQuantV4Packages } from "../../../..//../../../../generation-engine";
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
assert.equal(GEO_001_QUESTION_STUDIO_STANDARD_INTEGRATION_V1.lifecycle.testEligible, false);
assert.equal(GEO_001_QUESTION_STUDIO_STANDARD_INTEGRATION_V1.lifecycle.publiclyPublishable, false);

const packageMatches = listQuantV4Packages().filter((pkg) => pkg.packageId === "GEO-001");
assert.equal(packageMatches.length, 1, "normal Quant generation engine must expose GEO-001 exactly once");
const packageCard = packageMatches[0] as any;
assert.equal(packageCard.enabled, true);
assert.equal(packageCard.runtimeMode, "QUESTION_STUDIO_ACTIVE");
assert.equal(packageCard.questionStudioDiscoverable, true);
assert.equal(packageCard.questionBankStatus, "NOT_STORED");
assert.equal(packageCard.questionBankWritable, false);
assert.equal(packageCard.testEligibility, "INELIGIBLE");
assert.equal(packageCard.publiclyPublishable, false);
assert.deepEqual(packageCard.supportedLanguages, ["en", "hi", "pa"]);
assert.deepEqual(packageCard.cpIds, GEO_001_QUESTION_STUDIO_CP_IDS);
assert.deepEqual(packageCard.questionLanguageIds, GEO_001_QUESTION_STUDIO_QL_IDS);

function assertPreviewMatchesFrozen(question: any, language: "en" | "hi" | "pa") {
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
  assert.ok(question.correctIndex >= 0 && question.correctIndex < 4);
  assert.equal(question.answer, question.options[question.correctIndex]);
  assert.equal(question.canonicalProblemId, inferGeo001QuestionStudioCpFromQl(question.qlId));
  assert.equal(question.metadata.qlId, question.qlId);
  assert.equal(question.metadata.questionLanguageId, question.qlId);
  assert.equal(
    question.metadata.multilingualFreezeProofAuthorityId,
    GEO_PERMANENT_MULTILINGUAL_FREEZE_PROOF_V1.authorityId,
  );

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
  assert.equal(question.stem, frozen.question);
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
    assertPreviewMatchesFrozen(question, language);
    assert.equal(question.qlId, qlId);
    if (question.stemSvg) diagramBearingPreviewCount += 1;
    qlLanguageCoverageCount += 1;
  }
}
assert.equal(qlLanguageCoverageCount, 225);
assert.ok(diagramBearingPreviewCount > 0, "normal Question Studio proof must exercise Geometry diagrams");

let cpCoverageCount = 0;
for (const cpId of GEO_001_QUESTION_STUDIO_CP_IDS) {
  const result = await generateQuestion({
    packageId: "GEO-001" as never,
    canonicalProblemId: cpId,
    language: "en",
    count: 1,
    seed: `geo-qs-cp-proof-${cpId.toLowerCase()}`,
  });
  assert.equal(result.questions.length, 1);
  const question = result.questions[0] as any;
  assert.equal(question.canonicalProblemId, cpId);
  assertPreviewMatchesFrozen(question, "en");
  cpCoverageCount += 1;
}
assert.equal(cpCoverageCount, 14);

const mixed = await generateQuestion({
  packageId: "GEO-001" as never,
  language: "en",
  count: 75,
  seed: "geo-qs-proof-all-75",
});
assert.equal(mixed.questions.length, 75);
assert.deepEqual(
  [...new Set(mixed.questions.map((question: any) => question.qlId))].sort(),
  [...GEO_001_QUESTION_STUDIO_QL_IDS].sort(),
  "a 75-question mixed batch must cover every permanent Geometry QL exactly once",
);
assert.equal(mixed.generationContext.packageId, "GEO-001");
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
assert.equal(topicRoute.questions.length, 2);
for (const question of topicRoute.questions as any[]) assertPreviewMatchesFrozen(question, "hi");

await assert.rejects(
  () => generateQuestion({
    packageId: "GEO-001" as never,
    questionLanguageId: "GEO-QL-999",
    count: 1,
  }),
  /Unknown question language/u,
);
await assert.rejects(
  () => generateQuestion({
    packageId: "GEO-001" as never,
    canonicalProblemId: "GEO-CP-999",
    count: 1,
  }),
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
  permanentQlCount: GEO_001_QUESTION_STUDIO_QL_IDS.length,
  cpCount: GEO_001_QUESTION_STUDIO_CP_IDS.length,
  languages: ["en", "hi", "pa"],
  qlLanguageCoverageCount,
  cpCoverageCount,
  mixedBatchCoverageCount: mixed.questions.length,
  diagramBearingPreviewCount,
  questionStudioDiscoverable: true,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  sourceMultilingualFreezeArtifactId:
    GEO_PERMANENT_MULTILINGUAL_FREEZE_PROOF_V1.proof.artifactId,
  postProofNextGate:
    GEO_001_QUESTION_STUDIO_STANDARD_INTEGRATION_V1.postProofNextGate,
}, null, 2));

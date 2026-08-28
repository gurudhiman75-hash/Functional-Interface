import assert from "node:assert/strict";
import { GEO_SOLVE_MODE_FREEZE_PROOF_V1 } from "../permanent-review/geometry-solve-mode-freeze-proof-v1";
import {
  GEO_EXECUTABLE_TEMPORARY_PROTOTYPES_V1,
  GEO_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1,
  GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1,
  generateGeometryPermanentEnglishCandidateV1,
} from "../permanent-review/geometry-permanent-english-runtime-v1";

assert.equal(GEO_SOLVE_MODE_FREEZE_PROOF_V1.status, "PERMANENT_75_SOLVE_MODE_FAMILIES_PROVEN");
assert.equal(GEO_SOLVE_MODE_FREEZE_PROOF_V1.proof.headSha, "53317e88b88e2fec800e11d375eeae79e6dbbe7d");
assert.equal(GEO_SOLVE_MODE_FREEZE_PROOF_V1.proof.workflowRunId, 33155000056);
assert.equal(GEO_SOLVE_MODE_FREEZE_PROOF_V1.proof.workflowJobId, 98795564529);
assert.equal(GEO_SOLVE_MODE_FREEZE_PROOF_V1.proof.artifactId, 9679234386);
assert.equal(
  GEO_SOLVE_MODE_FREEZE_PROOF_V1.proof.artifactDigest,
  "sha256:56c81abad2fc5da23cb2850bded0f24afa5f0627142eae0a0989b824e30ad497",
);
assert.equal(GEO_SOLVE_MODE_FREEZE_PROOF_V1.lifecycle.englishRuntimeImplementationAllowed, true);

assert.equal(GEO_EXECUTABLE_TEMPORARY_PROTOTYPES_V1.length, 81);
assert.equal(GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1.length, 75);
assert.equal(GEO_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1.mappedVariantCount, 81);
assert.equal(GEO_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1.locale, "en-IN");

const qlIds = GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1.map((definition) => definition.qlId);
const expectedQlIds = Array.from({ length: 75 }, (_, index) => `GEO-QL-${String(index + 1).padStart(3, "0")}`);
assert.deepEqual(qlIds, expectedQlIds, "Geometry permanent English runtime must preserve the permanent QL order");
assert.equal(new Set(qlIds).size, 75);

const mappedPrototypeIds = GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1.flatMap((definition) => definition.prototypeIds);
assert.equal(mappedPrototypeIds.length, 81);
assert.equal(new Set(mappedPrototypeIds).size, 81, "Every executable Geometry prototype must map to exactly one permanent English QL");
assert.deepEqual(
  [...mappedPrototypeIds].sort(),
  [...GEO_EXECUTABLE_TEMPORARY_PROTOTYPES_V1.map((prototype) => prototype.temporaryPrototypeId)].sort(),
);

const deterministicReviewItems = GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1.flatMap((definition) =>
  definition.prototypeIds.map((_, variantIndex) =>
    generateGeometryPermanentEnglishCandidateV1(
      definition.qlId,
      `geo-en-review-${definition.qlId.toLowerCase()}-variant-${variantIndex}-${String.fromCharCode(97 + (variantIndex % 12))}`,
      variantIndex,
    ),
  ),
);
assert.equal(deterministicReviewItems.length, 81, "Review pack must contain one item for every mapped prototype variant");

function auditItem(item: ReturnType<typeof generateGeometryPermanentEnglishCandidateV1>) {
  assert.equal(item.language, "en-IN");
  assert.ok(item.question.trim().length >= 8, `${item.qlId}/${item.prototypeId}: stem is implausibly short`);
  assert.ok(item.question.length <= 700, `${item.qlId}/${item.prototypeId}: stem is too long for the permanent review contract`);
  assert.equal(item.options.length, 4);
  assert.equal(new Set(item.options).size, 4);
  assert.ok(item.correctIndex >= 0 && item.correctIndex < 4);
  assert.equal(item.options[item.correctIndex], item.canonicalAnswer);
  assert.ok(item.explanationLines.length >= 1, `${item.qlId}/${item.prototypeId}: explanation missing`);
  assert.ok(item.explanation.trim().length >= 12, `${item.qlId}/${item.prototypeId}: explanation is implausibly short`);
  assert.ok(item.explanation.length <= 1800, `${item.qlId}/${item.prototypeId}: explanation is too long/declutter gate failed`);
  assert.equal(item.rawPrototypeQuestion.validation.ok, true);
  assert.equal(item.englishImplementationFrozen, false);
  assert.equal(item.active, false);
  assert.equal(item.questionStudioDiscoverable, false);
  assert.equal(item.questionBankWritable, false);
  assert.equal(item.testEligible, false);
  assert.equal(item.publiclyPublishable, false);
  const visible = `${item.question}\n${item.options.join("\n")}\n${item.explanation}`;
  for (const leak of ["undefined", "[object Object]", "NaN"]) {
    assert.equal(visible.includes(leak), false, `${item.qlId}/${item.prototypeId}: rendered ${leak}`);
  }
  if (item.stemSvg !== null) {
    assert.match(item.stemSvg, /<svg[\s>]/, `${item.qlId}/${item.prototypeId}: stemSvg must contain SVG markup`);
  }
}

for (const item of deterministicReviewItems) auditItem(item);

const stressSuffixes = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l"] as const;
let stressSampleCount = 0;
for (const definition of GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1) {
  for (let variantIndex = 0; variantIndex < definition.prototypeIds.length; variantIndex += 1) {
    for (const suffix of stressSuffixes) {
      const item = generateGeometryPermanentEnglishCandidateV1(
        definition.qlId,
        `geo-en-stress-${definition.qlId.toLowerCase()}-${variantIndex}-${suffix}`,
        variantIndex,
      );
      auditItem(item);
      stressSampleCount += 1;
    }
  }
}
assert.equal(stressSampleCount, 972, "Geometry English runtime stress sample count drifted");

const lifecycle = GEO_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1.lifecycle;
assert.equal(lifecycle.solveModeFreezeProven, true);
assert.equal(lifecycle.englishRuntimeImplemented, true);
assert.equal(lifecycle.englishRuntimeProven, false);
assert.equal(lifecycle.englishFreezeAllowed, false);
assert.equal(lifecycle.englishImplementationFrozen, false);
assert.equal(lifecycle.localizationAllowed, false);
assert.equal(lifecycle.questionStudioActivationAllowed, false);
assert.equal(lifecycle.questionBankWriteAllowed, false);
assert.equal(lifecycle.testEligibilityAllowed, false);
assert.equal(lifecycle.publicPublicationAllowed, false);
assert.equal(lifecycle.prMergeAuthorized, false);
assert.equal(GEO_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1.postProofNextGate, "EXPLICIT_ENGLISH_ARTIFACT_APPROVAL");

console.log(JSON.stringify({
  status: "PASS_GEOMETRY_PERMANENT_ENGLISH_RUNTIME_REVIEW_V1",
  permanentQlCount: GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1.length,
  mappedPrototypeVariantCount: GEO_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1.mappedVariantCount,
  deterministicReviewSampleCount: deterministicReviewItems.length,
  stressSampleCount,
  locale: GEO_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1.locale,
  postProofNextGate: GEO_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1.postProofNextGate,
}, null, 2));

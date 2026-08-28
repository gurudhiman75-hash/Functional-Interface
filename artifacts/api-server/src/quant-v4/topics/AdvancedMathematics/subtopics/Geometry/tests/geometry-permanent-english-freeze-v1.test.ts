import assert from "node:assert/strict";
import {
  GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1,
  generateGeometryPermanentEnglishCandidateV1,
} from "../permanent-review/geometry-permanent-english-runtime-v1";
import { GEO_PERMANENT_ENGLISH_REVIEW_PROOF_V1 } from "../permanent-review/geometry-permanent-english-review-proof-v1";
import {
  GEO_PERMANENT_ENGLISH_FREEZE_AUTHORITY_V1,
  generateGeometryPermanentEnglishFrozenV1,
} from "../permanent-review/geometry-permanent-english-freeze-v1";

assert.equal(GEO_PERMANENT_ENGLISH_REVIEW_PROOF_V1.status, "PERMANENT_ENGLISH_REVIEW_PROVEN_AND_EXACT_ARTIFACT_APPROVED");
assert.equal(GEO_PERMANENT_ENGLISH_REVIEW_PROOF_V1.proof.workflowRunId, 33155481065);
assert.equal(GEO_PERMANENT_ENGLISH_REVIEW_PROOF_V1.proof.workflowJobId, 98797121604);
assert.equal(GEO_PERMANENT_ENGLISH_REVIEW_PROOF_V1.proof.artifactId, 9679418692);
assert.equal(
  GEO_PERMANENT_ENGLISH_REVIEW_PROOF_V1.proof.artifactDigest,
  "sha256:e59f80ea2e1a532a15bd2b9520acf98ceba368e788c9a2a8c044457a688e562b",
);
assert.equal(GEO_PERMANENT_ENGLISH_REVIEW_PROOF_V1.approval.approvedArtifactId, 9679418692);
assert.equal(GEO_PERMANENT_ENGLISH_REVIEW_PROOF_V1.lifecycle.englishFreezeAllowed, true);

assert.equal(GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1.length, 75);
assert.equal(GEO_PERMANENT_ENGLISH_FREEZE_AUTHORITY_V1.permanentQlCount, 75);
assert.equal(GEO_PERMANENT_ENGLISH_FREEZE_AUTHORITY_V1.mappedPrototypeVariantCount, 81);

function assertLearnerContentIdentical(
  reviewed: ReturnType<typeof generateGeometryPermanentEnglishCandidateV1>,
  frozen: ReturnType<typeof generateGeometryPermanentEnglishFrozenV1>,
) {
  assert.equal(frozen.qlId, reviewed.qlId);
  assert.equal(frozen.canonicalSolveModeFamilyId, reviewed.canonicalSolveModeFamilyId);
  assert.equal(frozen.prototypeId, reviewed.prototypeId);
  assert.equal(frozen.prototypeSolveMode, reviewed.prototypeSolveMode);
  assert.equal(frozen.variantIndex, reviewed.variantIndex);
  assert.equal(frozen.seed, reviewed.seed);
  assert.equal(frozen.language, reviewed.language);
  assert.equal(frozen.question, reviewed.question);
  assert.deepEqual(frozen.options, reviewed.options);
  assert.equal(frozen.correctIndex, reviewed.correctIndex);
  assert.equal(frozen.canonicalAnswer, reviewed.canonicalAnswer);
  assert.equal(frozen.explanation, reviewed.explanation);
  assert.deepEqual(frozen.explanationLines, reviewed.explanationLines);
  assert.deepEqual(frozen.theoremNames, reviewed.theoremNames);
  assert.equal(frozen.stemSvg, reviewed.stemSvg);
  assert.equal(frozen.canonicalGeometryFingerprint, reviewed.canonicalGeometryFingerprint);
  assert.equal(frozen.diagramFingerprint, reviewed.diagramFingerprint);
  assert.equal(frozen.freezeAuthorityId, "GEO-PERMANENT-ENGLISH-FREEZE-V1");
  assert.equal(frozen.approvedReviewArtifactId, 9679418692);
  assert.equal(frozen.englishImplementationFrozen, true);
  assert.equal(frozen.active, false);
  assert.equal(frozen.questionStudioDiscoverable, false);
  assert.equal(frozen.questionBankWritable, false);
  assert.equal(frozen.testEligible, false);
  assert.equal(frozen.publiclyPublishable, false);
}

let deterministicSampleCount = 0;
for (const definition of GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1) {
  for (let variantIndex = 0; variantIndex < definition.prototypeIds.length; variantIndex += 1) {
    const seed = `geo-en-review-${definition.qlId.toLowerCase()}-variant-${variantIndex}-${String.fromCharCode(97 + (variantIndex % 12))}`;
    assertLearnerContentIdentical(
      generateGeometryPermanentEnglishCandidateV1(definition.qlId, seed, variantIndex),
      generateGeometryPermanentEnglishFrozenV1(definition.qlId, seed, variantIndex),
    );
    deterministicSampleCount += 1;
  }
}
assert.equal(deterministicSampleCount, 81);

const stressSuffixes = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l"] as const;
let stressSampleCount = 0;
for (const definition of GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1) {
  for (let variantIndex = 0; variantIndex < definition.prototypeIds.length; variantIndex += 1) {
    for (const suffix of stressSuffixes) {
      const seed = `geo-en-freeze-stress-${definition.qlId.toLowerCase()}-${variantIndex}-${suffix}`;
      assertLearnerContentIdentical(
        generateGeometryPermanentEnglishCandidateV1(definition.qlId, seed, variantIndex),
        generateGeometryPermanentEnglishFrozenV1(definition.qlId, seed, variantIndex),
      );
      stressSampleCount += 1;
    }
  }
}
assert.equal(stressSampleCount, 972);

const lifecycle = GEO_PERMANENT_ENGLISH_FREEZE_AUTHORITY_V1.lifecycle;
assert.equal(lifecycle.englishRuntimeProven, true);
assert.equal(lifecycle.exactEnglishReviewArtifactApproved, true);
assert.equal(lifecycle.englishImplementationFrozen, true);
assert.equal(lifecycle.englishFreezeProven, false);
assert.equal(lifecycle.localizationAllowed, false);
assert.equal(lifecycle.questionStudioActivationAllowed, false);
assert.equal(lifecycle.questionBankWriteAllowed, false);
assert.equal(lifecycle.testEligibilityAllowed, false);
assert.equal(lifecycle.publicPublicationAllowed, false);
assert.equal(lifecycle.prMergeAuthorized, false);
assert.equal(GEO_PERMANENT_ENGLISH_FREEZE_AUTHORITY_V1.postProofNextGate, "HINDI_PUNJABI_LOCALIZATION_IMPLEMENTATION");

console.log(JSON.stringify({
  status: "PASS_GEOMETRY_PERMANENT_ENGLISH_FREEZE_V1",
  permanentQlCount: GEO_PERMANENT_ENGLISH_FREEZE_AUTHORITY_V1.permanentQlCount,
  mappedPrototypeVariantCount: GEO_PERMANENT_ENGLISH_FREEZE_AUTHORITY_V1.mappedPrototypeVariantCount,
  deterministicContentEqualitySamples: deterministicSampleCount,
  stressContentEqualitySamples: stressSampleCount,
  approvedReviewArtifactId: GEO_PERMANENT_ENGLISH_FREEZE_AUTHORITY_V1.approvedReviewArtifactId,
  approvedReviewArtifactDigest: GEO_PERMANENT_ENGLISH_FREEZE_AUTHORITY_V1.approvedReviewArtifactDigest,
  postProofNextGate: GEO_PERMANENT_ENGLISH_FREEZE_AUTHORITY_V1.postProofNextGate,
}, null, 2));

import assert from "node:assert/strict";
import { GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1 } from "../permanent-review/geometry-permanent-english-runtime-v1";
import { generateGeometryPermanentMultilingualReviewV2 } from "../permanent-review/geometry-permanent-multilingual-review-v2";
import { GEO_PERMANENT_MULTILINGUAL_REVIEW_PROOF_V2 } from "../permanent-review/geometry-permanent-multilingual-review-proof-v2";
import {
  GEO_PERMANENT_MULTILINGUAL_FREEZE_AUTHORITY_V1,
  generateGeometryPermanentMultilingualFrozenV1,
} from "../permanent-review/geometry-permanent-multilingual-freeze-v1";

assert.equal(GEO_PERMANENT_MULTILINGUAL_REVIEW_PROOF_V2.status, "HINDI_PUNJABI_V2_REVIEW_PROVEN_AND_EXACT_ARTIFACT_APPROVED");
assert.equal(GEO_PERMANENT_MULTILINGUAL_REVIEW_PROOF_V2.proof.workflowRunId, 33182824118);
assert.equal(GEO_PERMANENT_MULTILINGUAL_REVIEW_PROOF_V2.proof.workflowJobId, 98888110972);
assert.equal(GEO_PERMANENT_MULTILINGUAL_REVIEW_PROOF_V2.proof.artifactId, 9690420669);
assert.equal(
  GEO_PERMANENT_MULTILINGUAL_REVIEW_PROOF_V2.proof.artifactDigest,
  "sha256:090ef5809e9a9b3f49df6be8e073786347d8427012eecd16b960f742a97292b6",
);
assert.equal(GEO_PERMANENT_MULTILINGUAL_REVIEW_PROOF_V2.approval.approvedArtifactId, 9690420669);
assert.equal(GEO_PERMANENT_MULTILINGUAL_REVIEW_PROOF_V2.lifecycle.multilingualFreezeAllowed, true);

assert.equal(GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1.length, 75);
assert.equal(GEO_PERMANENT_MULTILINGUAL_FREEZE_AUTHORITY_V1.permanentQlCount, 75);
assert.equal(GEO_PERMANENT_MULTILINGUAL_FREEZE_AUTHORITY_V1.mappedPrototypeVariantCount, 81);
assert.deepEqual(GEO_PERMANENT_MULTILINGUAL_FREEZE_AUTHORITY_V1.locales, ["hi-IN", "pa-IN"]);

function assertLearnerContentIdentical(
  reviewed: ReturnType<typeof generateGeometryPermanentMultilingualReviewV2>,
  frozen: ReturnType<typeof generateGeometryPermanentMultilingualFrozenV1>,
) {
  assert.equal(frozen.qlId, reviewed.qlId);
  assert.equal(frozen.canonicalSolveModeFamilyId, reviewed.canonicalSolveModeFamilyId);
  assert.equal(frozen.prototypeId, reviewed.prototypeId);
  assert.equal(frozen.prototypeSolveMode, reviewed.prototypeSolveMode);
  assert.equal(frozen.variantIndex, reviewed.variantIndex);
  assert.equal(frozen.seed, reviewed.seed);
  assert.equal(frozen.locale, reviewed.locale);
  assert.equal(frozen.language, reviewed.language);
  assert.equal(frozen.englishQuestion, reviewed.englishQuestion);
  assert.deepEqual(frozen.englishOptions, reviewed.englishOptions);
  assert.equal(frozen.englishAnswer, reviewed.englishAnswer);
  assert.equal(frozen.englishExplanation, reviewed.englishExplanation);
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
  assert.equal(frozen.multilingualFreezeAuthorityId, "GEO-PERMANENT-MULTILINGUAL-FREEZE-V1");
  assert.equal(frozen.localizationReviewProofAuthorityId, "GEO-PERMANENT-MULTILINGUAL-REVIEW-PROOF-V2");
  assert.equal(frozen.approvedMultilingualReviewArtifactId, 9690420669);
  assert.equal(
    frozen.approvedMultilingualReviewArtifactDigest,
    "sha256:090ef5809e9a9b3f49df6be8e073786347d8427012eecd16b960f742a97292b6",
  );
  assert.equal(frozen.englishImplementationFrozen, true);
  assert.equal(frozen.multilingualImplementationFrozen, true);
  assert.equal(frozen.active, false);
  assert.equal(frozen.questionStudioDiscoverable, false);
  assert.equal(frozen.questionBankWritable, false);
  assert.equal(frozen.testEligible, false);
  assert.equal(frozen.publiclyPublishable, false);
}

let deterministicContentEqualitySamples = 0;
for (const definition of GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1) {
  for (let variantIndex = 0; variantIndex < definition.prototypeIds.length; variantIndex += 1) {
    for (const locale of GEO_PERMANENT_MULTILINGUAL_FREEZE_AUTHORITY_V1.locales) {
      const seed = `geo-ml-v2-review-${definition.qlId.toLowerCase()}-${variantIndex}-${locale}`;
      assertLearnerContentIdentical(
        generateGeometryPermanentMultilingualReviewV2(definition.qlId, seed, locale, variantIndex),
        generateGeometryPermanentMultilingualFrozenV1(definition.qlId, seed, locale, variantIndex),
      );
      deterministicContentEqualitySamples += 1;
    }
  }
}
assert.equal(deterministicContentEqualitySamples, 162);

const stressSuffixes = ["a", "b", "c", "d", "e", "f"] as const;
let stressContentEqualitySamples = 0;
for (const definition of GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1) {
  for (let variantIndex = 0; variantIndex < definition.prototypeIds.length; variantIndex += 1) {
    for (const locale of GEO_PERMANENT_MULTILINGUAL_FREEZE_AUTHORITY_V1.locales) {
      for (const suffix of stressSuffixes) {
        const seed = `geo-ml-v2-freeze-stress-${definition.qlId.toLowerCase()}-${variantIndex}-${locale}-${suffix}`;
        assertLearnerContentIdentical(
          generateGeometryPermanentMultilingualReviewV2(definition.qlId, seed, locale, variantIndex),
          generateGeometryPermanentMultilingualFrozenV1(definition.qlId, seed, locale, variantIndex),
        );
        stressContentEqualitySamples += 1;
      }
    }
  }
}
assert.equal(stressContentEqualitySamples, 972);

const lifecycle = GEO_PERMANENT_MULTILINGUAL_FREEZE_AUTHORITY_V1.lifecycle;
assert.equal(lifecycle.englishFreezeProven, true);
assert.equal(lifecycle.localizationV2Proven, true);
assert.equal(lifecycle.exactMultilingualV2ReviewArtifactApproved, true);
assert.equal(lifecycle.multilingualImplementationFrozen, true);
assert.equal(lifecycle.multilingualFreezeProven, false);
assert.equal(lifecycle.questionStudioActivationAllowed, false);
assert.equal(lifecycle.questionBankWriteAllowed, false);
assert.equal(lifecycle.testEligibilityAllowed, false);
assert.equal(lifecycle.publicPublicationAllowed, false);
assert.equal(lifecycle.prMergeAuthorized, false);
assert.equal(GEO_PERMANENT_MULTILINGUAL_FREEZE_AUTHORITY_V1.postProofNextGate, "QUESTION_STUDIO_INTEGRATION_IMPLEMENTATION");

console.log(JSON.stringify({
  status: "PASS_GEOMETRY_PERMANENT_MULTILINGUAL_FREEZE_V1",
  permanentQlCount: GEO_PERMANENT_MULTILINGUAL_FREEZE_AUTHORITY_V1.permanentQlCount,
  mappedPrototypeVariantCount: GEO_PERMANENT_MULTILINGUAL_FREEZE_AUTHORITY_V1.mappedPrototypeVariantCount,
  locales: GEO_PERMANENT_MULTILINGUAL_FREEZE_AUTHORITY_V1.locales,
  deterministicContentEqualitySamples,
  stressContentEqualitySamples,
  approvedReviewArtifactId: GEO_PERMANENT_MULTILINGUAL_FREEZE_AUTHORITY_V1.approvedReviewArtifactId,
  approvedReviewArtifactDigest: GEO_PERMANENT_MULTILINGUAL_FREEZE_AUTHORITY_V1.approvedReviewArtifactDigest,
  postProofNextGate: GEO_PERMANENT_MULTILINGUAL_FREEZE_AUTHORITY_V1.postProofNextGate,
}, null, 2));

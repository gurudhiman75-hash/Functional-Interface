import assert from "node:assert/strict";
import { GEO_PERMANENT_ENGLISH_FREEZE_PROOF_V1 } from "../permanent-review/geometry-permanent-english-freeze-proof-v1";
import { GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1 } from "../permanent-review/geometry-permanent-english-runtime-v1";
import {
  GEO_PERMANENT_MULTILINGUAL_REVIEW_AUTHORITY_V1,
  generateGeometryPermanentMultilingualReviewV1,
} from "../permanent-review/geometry-permanent-multilingual-review-v1";

assert.equal(GEO_PERMANENT_ENGLISH_FREEZE_PROOF_V1.status, "PERMANENT_ENGLISH_IMPLEMENTATION_PROVEN_FROZEN");
assert.equal(GEO_PERMANENT_ENGLISH_FREEZE_PROOF_V1.proof.workflowRunId, 33159181373);
assert.equal(GEO_PERMANENT_ENGLISH_FREEZE_PROOF_V1.proof.workflowJobId, 98809211590);
assert.equal(GEO_PERMANENT_ENGLISH_FREEZE_PROOF_V1.proof.artifactId, 9680899337);
assert.equal(
  GEO_PERMANENT_ENGLISH_FREEZE_PROOF_V1.proof.artifactDigest,
  "sha256:96b16c81e3ae365e69618711a0752e21fc4c81dc8f27730f31135b4504e274e7",
);
assert.equal(GEO_PERMANENT_ENGLISH_FREEZE_PROOF_V1.lifecycle.localizationAllowed, true);
assert.equal(GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1.length, 75);
assert.equal(GEO_PERMANENT_MULTILINGUAL_REVIEW_AUTHORITY_V1.mappedPrototypeVariantCount, 81);

const locales = GEO_PERMANENT_MULTILINGUAL_REVIEW_AUTHORITY_V1.locales;
assert.deepEqual(locales, ["hi-IN", "pa-IN"]);

function audit(item: ReturnType<typeof generateGeometryPermanentMultilingualReviewV1>) {
  assert.ok(item.question.trim().length >= 4);
  assert.equal(item.options.length, 4);
  assert.equal(new Set(item.options).size, 4);
  assert.ok(item.correctIndex >= 0 && item.correctIndex < 4);
  assert.equal(item.canonicalAnswer, item.options[item.correctIndex]);
  assert.ok(item.explanationLines.length >= 1);
  assert.ok(item.explanation.trim().length >= 4);
  assert.equal(item.englishImplementationFrozen, true);
  assert.equal(item.multilingualImplementationFrozen, false);
  assert.equal(item.active, false);
  assert.equal(item.questionStudioDiscoverable, false);
  assert.equal(item.questionBankWritable, false);
  assert.equal(item.testEligible, false);
  assert.equal(item.publiclyPublishable, false);
  assert.equal(item.stemSvg, item.rawPrototypeQuestion.stemSvg ?? null);
  if (item.locale === "hi-IN") {
    assert.equal(item.language, "hi");
    assert.match(`${item.question}\n${item.explanation}`, /[\u0900-\u097F]/, `${item.qlId}/${item.prototypeId}: Hindi script missing`);
  } else {
    assert.equal(item.language, "pa");
    assert.match(`${item.question}\n${item.explanation}`, /[\u0A00-\u0A7F]/, `${item.qlId}/${item.prototypeId}: Punjabi script missing`);
  }
  const visible = `${item.question}\n${item.options.join("\n")}\n${item.explanation}`;
  for (const leak of ["undefined", "[object Object]", "NaN"]) {
    assert.equal(visible.includes(leak), false, `${item.qlId}/${item.prototypeId}/${item.locale}: rendered ${leak}`);
  }
}

let deterministicReviewSampleCount = 0;
for (const definition of GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1) {
  for (let variantIndex = 0; variantIndex < definition.prototypeIds.length; variantIndex += 1) {
    for (const locale of locales) {
      const item = generateGeometryPermanentMultilingualReviewV1(
        definition.qlId,
        `geo-ml-review-${definition.qlId.toLowerCase()}-${variantIndex}-${locale}`,
        locale,
        variantIndex,
      );
      audit(item);
      deterministicReviewSampleCount += 1;
    }
  }
}
assert.equal(deterministicReviewSampleCount, 162);

const stressSuffixes = ["a", "b", "c", "d", "e", "f"] as const;
let stressSampleCount = 0;
for (const definition of GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1) {
  for (let variantIndex = 0; variantIndex < definition.prototypeIds.length; variantIndex += 1) {
    for (const locale of locales) {
      for (const suffix of stressSuffixes) {
        audit(generateGeometryPermanentMultilingualReviewV1(
          definition.qlId,
          `geo-ml-stress-${definition.qlId.toLowerCase()}-${variantIndex}-${locale}-${suffix}`,
          locale,
          variantIndex,
        ));
        stressSampleCount += 1;
      }
    }
  }
}
assert.equal(stressSampleCount, 972);

const lifecycle = GEO_PERMANENT_MULTILINGUAL_REVIEW_AUTHORITY_V1.lifecycle;
assert.equal(lifecycle.englishFreezeProven, true);
assert.equal(lifecycle.localizationAllowed, true);
assert.equal(lifecycle.localizationReviewImplemented, true);
assert.equal(lifecycle.localizationReviewProven, false);
assert.equal(lifecycle.multilingualImplementationFrozen, false);
assert.equal(lifecycle.multilingualFreezeAllowed, false);
assert.equal(lifecycle.questionStudioActivationAllowed, false);
assert.equal(lifecycle.questionBankWriteAllowed, false);
assert.equal(lifecycle.testEligibilityAllowed, false);
assert.equal(lifecycle.publicPublicationAllowed, false);
assert.equal(lifecycle.prMergeAuthorized, false);

console.log(JSON.stringify({
  status: "PASS_GEOMETRY_HINDI_PUNJABI_LOCALIZATION_REVIEW_V1",
  permanentQlCount: GEO_PERMANENT_MULTILINGUAL_REVIEW_AUTHORITY_V1.permanentQlCount,
  mappedPrototypeVariantCount: GEO_PERMANENT_MULTILINGUAL_REVIEW_AUTHORITY_V1.mappedPrototypeVariantCount,
  locales,
  deterministicReviewSampleCount,
  stressSampleCount,
  postProofNextGate: GEO_PERMANENT_MULTILINGUAL_REVIEW_AUTHORITY_V1.postProofNextGate,
}, null, 2));

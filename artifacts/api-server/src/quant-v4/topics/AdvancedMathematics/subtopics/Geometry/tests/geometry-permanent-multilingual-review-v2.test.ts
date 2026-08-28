import assert from "node:assert/strict";
import { GEO_PERMANENT_ENGLISH_FREEZE_PROOF_V1 } from "../permanent-review/geometry-permanent-english-freeze-proof-v1";
import {
  GEO_EXECUTABLE_TEMPORARY_PROTOTYPES_V1,
  GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1,
} from "../permanent-review/geometry-permanent-english-runtime-v1";
import {
  GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2,
} from "../permanent-review/geometry-localization-editorial-v2";
import {
  GEO_PERMANENT_MULTILINGUAL_REVIEW_AUTHORITY_V2,
  findGeometryLocalizationEnglishLeaksV2,
  generateGeometryPermanentMultilingualReviewV2,
} from "../permanent-review/geometry-permanent-multilingual-review-v2";

assert.equal(GEO_PERMANENT_ENGLISH_FREEZE_PROOF_V1.status, "PERMANENT_ENGLISH_IMPLEMENTATION_PROVEN_FROZEN");
assert.equal(GEO_PERMANENT_ENGLISH_FREEZE_PROOF_V1.proof.artifactId, 9680899337);
assert.equal(GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1.length, 75);
assert.equal(GEO_EXECUTABLE_TEMPORARY_PROTOTYPES_V1.length, 81);
assert.equal(GEO_PERMANENT_MULTILINGUAL_REVIEW_AUTHORITY_V2.templateAuthorityCount, 81);
assert.equal(GEO_PERMANENT_MULTILINGUAL_REVIEW_AUTHORITY_V2.mappedPrototypeVariantCount, 81);
assert.equal(GEO_PERMANENT_MULTILINGUAL_REVIEW_AUTHORITY_V2.rejectedPriorReviewArtifactId, 9681238482);

const executableIds = GEO_EXECUTABLE_TEMPORARY_PROTOTYPES_V1.map((prototype) => prototype.temporaryPrototypeId).sort();
const templateIds = Object.keys(GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2).sort();
assert.deepEqual(templateIds, executableIds, "V2 must contain exactly one human-editorial template authority for every executable Geometry prototype");

const locales = GEO_PERMANENT_MULTILINGUAL_REVIEW_AUTHORITY_V2.locales;
assert.deepEqual(locales, ["hi-IN", "pa-IN"]);

function audit(item: ReturnType<typeof generateGeometryPermanentMultilingualReviewV2>) {
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
  assert.equal(item.canonicalGeometryFingerprint, item.rawPrototypeQuestion.canonicalGeometryFingerprint ?? null);
  assert.equal(item.diagramFingerprint, item.rawPrototypeQuestion.diagramFingerprint ?? null);
  assert.equal(item.reviewStatus, "EXACT_V2_ARTIFACT_HUMAN_APPROVAL_REQUIRED");

  if (item.locale === "hi-IN") {
    assert.equal(item.language, "hi");
    assert.match(`${item.question}\n${item.explanation}`, /[\u0900-\u097F]/, `${item.qlId}/${item.prototypeId}: Hindi script missing`);
  } else {
    assert.equal(item.language, "pa");
    assert.match(`${item.question}\n${item.explanation}`, /[\u0A00-\u0A7F]/, `${item.qlId}/${item.prototypeId}: Punjabi script missing`);
  }

  const visible = `${item.question}\n${item.options.join("\n")}\n${item.explanation}`;
  assert.deepEqual(findGeometryLocalizationEnglishLeaksV2(visible), [], `${item.qlId}/${item.prototypeId}/${item.locale}: English prose leakage`);
  for (const leak of ["undefined", "[object Object]", "NaN"]) {
    assert.equal(visible.includes(leak), false, `${item.qlId}/${item.prototypeId}/${item.locale}: rendered ${leak}`);
  }
}

let deterministicReviewSampleCount = 0;
const deterministicErrors = new Map<string, string>();
for (const definition of GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1) {
  for (let variantIndex = 0; variantIndex < definition.prototypeIds.length; variantIndex += 1) {
    const prototypeId = definition.prototypeIds[variantIndex]!;
    for (const locale of locales) {
      try {
        audit(generateGeometryPermanentMultilingualReviewV2(
          definition.qlId,
          `geo-ml-v2-review-${definition.qlId.toLowerCase()}-${variantIndex}-${locale}`,
          locale,
          variantIndex,
        ));
        deterministicReviewSampleCount += 1;
      } catch (error) {
        const key = `${definition.qlId}/${prototypeId}`;
        if (!deterministicErrors.has(key)) {
          deterministicErrors.set(key, error instanceof Error ? error.message : String(error));
        }
      }
    }
  }
}

if (deterministicErrors.size) {
  console.error(JSON.stringify({
    status: "FAIL_GEOMETRY_HINDI_PUNJABI_V2_SOURCE_CONTRACT_DIAGNOSTIC",
    mismatchCount: deterministicErrors.size,
    mismatches: [...deterministicErrors.entries()].map(([key, message]) => ({ key, message })),
  }, null, 2));
  throw new Error(`Geometry V2 deterministic source-contract audit found ${deterministicErrors.size} mismatched prototype authorities.`);
}
assert.equal(deterministicReviewSampleCount, 162);

const stressSuffixes = ["a", "b", "c", "d", "e", "f"] as const;
let stressSampleCount = 0;
for (const definition of GEO_PERMANENT_ENGLISH_RUNTIME_DEFINITIONS_V1) {
  for (let variantIndex = 0; variantIndex < definition.prototypeIds.length; variantIndex += 1) {
    for (const locale of locales) {
      for (const suffix of stressSuffixes) {
        audit(generateGeometryPermanentMultilingualReviewV2(
          definition.qlId,
          `geo-ml-v2-stress-${definition.qlId.toLowerCase()}-${variantIndex}-${locale}-${suffix}`,
          locale,
          variantIndex,
        ));
        stressSampleCount += 1;
      }
    }
  }
}
assert.equal(stressSampleCount, 972);

const lifecycle = GEO_PERMANENT_MULTILINGUAL_REVIEW_AUTHORITY_V2.lifecycle;
assert.equal(lifecycle.englishFreezeProven, true);
assert.equal(lifecycle.localizationV1EditoriallyRejected, true);
assert.equal(lifecycle.localizationV2Implemented, true);
assert.equal(lifecycle.localizationV2Proven, false);
assert.equal(lifecycle.multilingualImplementationFrozen, false);
assert.equal(lifecycle.multilingualFreezeAllowed, false);
assert.equal(lifecycle.questionStudioActivationAllowed, false);
assert.equal(lifecycle.questionBankWriteAllowed, false);
assert.equal(lifecycle.testEligibilityAllowed, false);
assert.equal(lifecycle.publicPublicationAllowed, false);
assert.equal(lifecycle.prMergeAuthorized, false);

console.log(JSON.stringify({
  status: "PASS_GEOMETRY_HINDI_PUNJABI_HUMAN_EDITORIAL_REVIEW_V2",
  permanentQlCount: GEO_PERMANENT_MULTILINGUAL_REVIEW_AUTHORITY_V2.permanentQlCount,
  mappedPrototypeVariantCount: GEO_PERMANENT_MULTILINGUAL_REVIEW_AUTHORITY_V2.mappedPrototypeVariantCount,
  humanEditorialTemplateCount: GEO_PERMANENT_MULTILINGUAL_REVIEW_AUTHORITY_V2.templateAuthorityCount,
  locales,
  deterministicReviewSampleCount,
  stressSampleCount,
  rejectedPriorArtifactId: GEO_PERMANENT_MULTILINGUAL_REVIEW_AUTHORITY_V2.rejectedPriorReviewArtifactId,
  postProofNextGate: GEO_PERMANENT_MULTILINGUAL_REVIEW_AUTHORITY_V2.postProofNextGate,
}, null, 2));

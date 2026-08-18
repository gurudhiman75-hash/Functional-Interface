import {
  SEA001_MULTILINGUAL_FREEZE_APPROVAL_EVIDENCE,
  SEA001_MULTILINGUAL_FREEZE_APPROVED_AT,
  SEA001_MULTILINGUAL_FREEZE_APPROVED_BY,
  SEA001_MULTILINGUAL_FREEZE_AUTHORITY,
  SEA001_MULTILINGUAL_FREEZE_SOURCE_ARTIFACT_DIGEST,
  SEA001_MULTILINGUAL_FREEZE_SOURCE_ARTIFACT_ID,
  SEA001_MULTILINGUAL_FREEZE_SOURCE_IMPLEMENTATION_HEAD,
  assertSea001MultilingualFreezeKeepsDeliveryLocked,
  generateSea001ApprovedLocalizedReviewCorpus,
  generateSea001MultilingualFrozenReviewCorpus,
  sea001ApprovedLocalizedLearnerFingerprint,
  sea001ApprovedLocalizedSemanticFingerprint,
  sea001MultilingualFrozenLearnerFingerprint,
  sea001MultilingualFrozenSemanticFingerprint,
} from "./localization/multilingual-freeze.ts";
import {
  SEA001_LOCALIZATION_AUTHORITY,
  SEA001_TRANSLATION_TARGET_LOCALES,
} from "./localization/readiness.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

let localizedFrozenCaselets = 0;
let localizedFrozenChildren = 0;
const learnerFingerprints: Record<string, string> = {};
const semanticFingerprints: Record<string, string> = {};

for (const locale of SEA001_TRANSLATION_TARGET_LOCALES) {
  const source = generateSea001ApprovedLocalizedReviewCorpus(locale);
  const frozen = generateSea001MultilingualFrozenReviewCorpus(locale);

  assert(source.length === 100, `${locale}: expected 100 approved review caselets, got ${source.length}`);
  assert(frozen.length === 100, `${locale}: expected 100 frozen caselets, got ${frozen.length}`);

  const sourceLearnerFingerprint = sea001ApprovedLocalizedLearnerFingerprint(locale);
  const frozenLearnerFingerprint = sea001MultilingualFrozenLearnerFingerprint(locale);
  const sourceSemanticFingerprint = sea001ApprovedLocalizedSemanticFingerprint(locale);
  const frozenSemanticFingerprint = sea001MultilingualFrozenSemanticFingerprint(locale);

  assert(
    frozenLearnerFingerprint === sourceLearnerFingerprint,
    `${locale}: multilingual freeze changed the reviewed learner corpus`,
  );
  assert(
    frozenSemanticFingerprint === sourceSemanticFingerprint,
    `${locale}: multilingual freeze changed semantic parity projection`,
  );

  learnerFingerprints[locale] = sourceLearnerFingerprint;
  semanticFingerprints[locale] = sourceSemanticFingerprint;

  for (const caselet of frozen) {
    localizedFrozenCaselets += 1;
    localizedFrozenChildren += caselet.children.length;
    assert(caselet.localizationStatus === "MULTILINGUAL_FROZEN", `${caselet.caseletId}/${locale}: freeze status missing`);
    assert(caselet.humanLanguageReviewRequired === false, `${caselet.caseletId}/${locale}: human-review blocker not cleared`);
    assert(caselet.activeEditorialBlockers.length === 0, `${caselet.caseletId}/${locale}: editorial blocker remains`);
    assert(caselet.productDeliveryUnlocked === false, `${caselet.caseletId}/${locale}: product delivery unlocked`);
    assert(caselet.productionStagingApproved === false, `${caselet.caseletId}/${locale}: staging unlocked`);

    const proof = caselet.multilingualFreezeProof;
    assert(proof.authority === SEA001_MULTILINGUAL_FREEZE_AUTHORITY, `${caselet.caseletId}/${locale}: freeze authority mismatch`);
    assert(proof.approvedBy === SEA001_MULTILINGUAL_FREEZE_APPROVED_BY, `${caselet.caseletId}/${locale}: approver mismatch`);
    assert(proof.approvedAt === SEA001_MULTILINGUAL_FREEZE_APPROVED_AT, `${caselet.caseletId}/${locale}: approval date mismatch`);
    assert(proof.approvalEvidence === SEA001_MULTILINGUAL_FREEZE_APPROVAL_EVIDENCE, `${caselet.caseletId}/${locale}: approval evidence mismatch`);
    assert(proof.sourceAuthority === SEA001_LOCALIZATION_AUTHORITY, `${caselet.caseletId}/${locale}: source authority mismatch`);
    assert(proof.sourceImplementationHead === SEA001_MULTILINGUAL_FREEZE_SOURCE_IMPLEMENTATION_HEAD, `${caselet.caseletId}/${locale}: source head mismatch`);
    assert(proof.sourceArtifactId === SEA001_MULTILINGUAL_FREEZE_SOURCE_ARTIFACT_ID, `${caselet.caseletId}/${locale}: source artifact mismatch`);
    assert(proof.sourceArtifactDigest === SEA001_MULTILINGUAL_FREEZE_SOURCE_ARTIFACT_DIGEST, `${caselet.caseletId}/${locale}: source artifact digest mismatch`);
    assert(proof.learnerCorpusChanged === false, `${caselet.caseletId}/${locale}: learner corpus change claimed`);
    assert(proof.semanticParityPreserved === true, `${caselet.caseletId}/${locale}: semantic parity not preserved`);
    assert(proof.questionStudioUnlocked === false, `${caselet.caseletId}/${locale}: Question Studio unlocked`);
    assert(proof.questionBankUnlocked === false, `${caselet.caseletId}/${locale}: Question Bank unlocked`);
    assert(proof.mockTestUnlocked === false, `${caselet.caseletId}/${locale}: mock tests unlocked`);
    assert(proof.productionStagingUnlocked === false, `${caselet.caseletId}/${locale}: production staging unlocked`);
    assert(proof.publicDeliveryUnlocked === false, `${caselet.caseletId}/${locale}: public delivery unlocked`);
  }
}

assert(localizedFrozenCaselets === 200, `expected 200 frozen localized caselets, got ${localizedFrozenCaselets}`);
assert(localizedFrozenChildren === 800, `expected 800 frozen localized child questions, got ${localizedFrozenChildren}`);
assertSea001MultilingualFreezeKeepsDeliveryLocked();

console.log("PASS_SEA_001_MULTILINGUAL_FREEZE");
console.log("authority", SEA001_MULTILINGUAL_FREEZE_AUTHORITY);
console.log("approved by", SEA001_MULTILINGUAL_FREEZE_APPROVED_BY);
console.log("approved at", SEA001_MULTILINGUAL_FREEZE_APPROVED_AT);
console.log("approval evidence", SEA001_MULTILINGUAL_FREEZE_APPROVAL_EVIDENCE);
console.log("source implementation head", SEA001_MULTILINGUAL_FREEZE_SOURCE_IMPLEMENTATION_HEAD);
console.log("source artifact", SEA001_MULTILINGUAL_FREEZE_SOURCE_ARTIFACT_ID);
console.log("source artifact digest", SEA001_MULTILINGUAL_FREEZE_SOURCE_ARTIFACT_DIGEST);
console.log("frozen localized caselets", localizedFrozenCaselets);
console.log("frozen localized child questions", localizedFrozenChildren);
console.log("learner fingerprints", JSON.stringify(learnerFingerprints));
console.log("semantic fingerprints", JSON.stringify(semanticFingerprints));
console.log("Question Studio registered", false);
console.log("Question Bank writes", false);
console.log("mock-test eligibility", false);
console.log("production staging", false);
console.log("public delivery", false);

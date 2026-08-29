import {
  ALG_ENGLISH_V3_FREEZE_APPROVAL,
  ALG_ENGLISH_V3_FREEZE_ID,
  ALG_PERMANENT_ALLOCATION,
  auditAlgEnglishV3Freeze,
  generateAlgPermanentEnglishReviewV3,
  generateAlgPermanentEnglishV3Frozen,
  getAlgPermanentPrototypeIds,
} from "../permanent";

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? `${item}n` : item);
}

assert(ALG_ENGLISH_V3_FREEZE_APPROVAL.approvalAuthority === "EXPLICIT_PRODUCT_OWNER_ARTIFACT_APPROVAL", "Wrong Algebra English V3 freeze approval authority");
assert(ALG_ENGLISH_V3_FREEZE_APPROVAL.approvalDate === "2026-08-20", "Wrong Algebra English V3 freeze approval date");
assert(ALG_ENGLISH_V3_FREEZE_APPROVAL.approvalAuditCommentId === 5351598978, "Wrong Algebra English V3 approval audit comment");
assert(ALG_ENGLISH_V3_FREEZE_APPROVAL.approvedReviewAuthority === "ALG-EN-review-v3", "Wrong reviewed English authority");
assert(ALG_ENGLISH_V3_FREEZE_APPROVAL.approvedSourceHead === "3f96872bdcce0d7ef768aeb9118ef4c878a100df", "Wrong reviewed V3 source head");
assert(ALG_ENGLISH_V3_FREEZE_APPROVAL.permanentEnglishWorkflowRunId === 32327556264, "Wrong V3 workflow run evidence");
assert(ALG_ENGLISH_V3_FREEZE_APPROVAL.reviewedArtifactId === 9391935139, "Wrong reviewed artifact ID");
assert(ALG_ENGLISH_V3_FREEZE_APPROVAL.reviewedArtifactDigest === "sha256:01030cfc44dbb514037c41e1597288f3d1ad1efad32b34901db5ee0363af5d86", "Wrong reviewed artifact digest");
assert(ALG_ENGLISH_V3_FREEZE_APPROVAL.qlCount === 43, "English V3 freeze must cover 43 permanent QLs");
assert(ALG_ENGLISH_V3_FREEZE_APPROVAL.mappedVariantCount === 109, "English V3 freeze must cover 109 mapped variants");
assert(ALG_ENGLISH_V3_FREEZE_APPROVAL.stressSampleCount === 1308, "English V3 freeze must pin the 1,308 stress samples");
assert(ALG_ENGLISH_V3_FREEZE_APPROVAL.deterministicReviewSampleCount === 109, "English V3 freeze must pin 109 deterministic review coordinates");
assert(ALG_ENGLISH_V3_FREEZE_APPROVAL.editorialAuditSampleCount === 1417, "English V3 freeze must pin the 1,417-sample editorial audit");

const audit = auditAlgEnglishV3Freeze();
assert(audit.freezeId === ALG_ENGLISH_V3_FREEZE_ID, "V3 freeze audit ID mismatch");
assert(audit.reviewAuthority === "ALG-EN-review-v3", "V3 freeze review authority mismatch");
assert(audit.qlCount === 43 && audit.firstQlId === "ALG-QL-001" && audit.lastQlId === "ALG-QL-043", "Frozen V3 QL range mismatch");
assert(audit.englishFrozen, "English V3 implementation must be frozen");
assert(audit.multilingualLocked, "Multilingual implementation must remain locked after English V3 freeze");
assert(audit.downstreamLocked, "Downstream product lifecycle must remain locked after English V3 freeze");

let reviewed = 0;
let mappedVariants = 0;
for (const allocation of ALG_PERMANENT_ALLOCATION) {
  assert(allocation.permanentIdentityFrozen && allocation.semanticContractFrozen, `${allocation.qlId}: semantic identity must stay frozen`);
  assert(!allocation.englishImplementationFrozen, `${allocation.qlId}: source allocation must remain pre-English-freeze authority`);
  assert(!allocation.multilingualImplementationFrozen, `${allocation.qlId}: allocation must not imply multilingual freeze`);
  assert(!allocation.active && !allocation.questionStudioDiscoverable, `${allocation.qlId}: allocation leaked downstream lifecycle`);

  const variants = getAlgPermanentPrototypeIds(allocation.qlId);
  mappedVariants += variants.length;
  for (let variantIndex = 0; variantIndex < variants.length; variantIndex += 1) {
    for (let seed = 1; seed <= 12; seed += 1) {
      const source = generateAlgPermanentEnglishReviewV3(allocation.qlId, seed, variantIndex);
      const frozen = generateAlgPermanentEnglishV3Frozen(allocation.qlId, seed, variantIndex);
      const prefix = `${allocation.qlId}/${source.prototypeId}/seed-${seed}`;
      reviewed += 1;

      assert(frozen.qlId === source.qlId, `${prefix}: QL identity changed during V3 freeze`);
      assert(frozen.freezeKey === source.freezeKey, `${prefix}: freeze key changed during V3 freeze`);
      assert(frozen.packageId === source.packageId && frozen.cpId === source.cpId, `${prefix}: package/CP changed during V3 freeze`);
      assert(frozen.prototypeId === source.prototypeId && frozen.prototypeSolveMode === source.prototypeSolveMode, `${prefix}: prototype provenance changed during V3 freeze`);
      assert(frozen.variantIndex === source.variantIndex && frozen.seed === source.seed, `${prefix}: generation coordinates changed during V3 freeze`);
      assert(frozen.question === source.question, `${prefix}: approved learner question changed during V3 freeze`);
      assert(frozen.explanation === source.explanation, `${prefix}: approved learner explanation changed during V3 freeze`);
      assert(stable(frozen.canonicalAnswer) === stable(source.canonicalAnswer), `${prefix}: canonical answer changed during V3 freeze`);
      assert(stable(frozen.rawDiscoveryItem) === stable(source.rawDiscoveryItem), `${prefix}: raw solver state changed during V3 freeze`);

      assert(frozen.reviewCandidateId === "ALG-EN-review-v3", `${prefix}: reviewed V3 authority missing`);
      assert(frozen.freezeId === ALG_ENGLISH_V3_FREEZE_ID, `${prefix}: V3 freeze ID missing`);
      assert(frozen.approvedSourceHead === ALG_ENGLISH_V3_FREEZE_APPROVAL.approvedSourceHead, `${prefix}: approved source head mismatch`);
      assert(frozen.allocationStatus === "PRODUCT_OWNER_APPROVED_INACTIVE_ENGLISH_V3_IMPLEMENTATION", `${prefix}: wrong V3 allocation status`);
      assert(frozen.maturity === "ENGLISH_IMPLEMENTATION_FROZEN", `${prefix}: wrong V3 maturity`);
      assert(frozen.reviewStatus === "APPROVED_ENGLISH_V3_FROZEN", `${prefix}: wrong V3 review status`);
      assert(frozen.permanentIdentityFrozen && frozen.semanticContractFrozen, `${prefix}: semantic freeze lost`);
      assert(frozen.learnerContentFrozen && frozen.solverAuthorityFrozen && frozen.englishImplementationFrozen, `${prefix}: English V3 freeze fields missing`);
      assert(!frozen.multilingualImplementationFrozen, `${prefix}: multilingual freeze must remain false`);
      assert(!frozen.active && !frozen.questionStudioDiscoverable, `${prefix}: activation/Question Studio leaked`);
      assert(frozen.questionBankStatus === "NOT_STORED" && !frozen.questionBankWritable, `${prefix}: Question Bank leaked`);
      assert(frozen.testEligibility === "INELIGIBLE" && !frozen.testEligible, `${prefix}: test eligibility leaked`);
      assert(!frozen.publiclyPublishable, `${prefix}: public release leaked`);
    }
  }
}

assert(mappedVariants === 109, `Expected 109 frozen V3 mapped variants, found ${mappedVariants}`);
assert(reviewed === 1308, `Expected 1,308 frozen English V3 proof samples, reviewed ${reviewed}`);

console.log(`Algebra inactive English V3 freeze ${ALG_ENGLISH_V3_FREEZE_ID} passed for ${reviewed} samples across 43 QLs and ${mappedVariants} variants`);

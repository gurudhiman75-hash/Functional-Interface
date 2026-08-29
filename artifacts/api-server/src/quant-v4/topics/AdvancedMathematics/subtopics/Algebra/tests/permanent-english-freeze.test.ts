import {
  ALG_ENGLISH_FREEZE_APPROVAL,
  ALG_ENGLISH_FREEZE_ID,
  ALG_PERMANENT_ALLOCATION,
  auditAlgEnglishFreeze,
  generateAlgPermanentEnglishCandidate,
  generateAlgPermanentEnglishFrozen,
  getAlgPermanentPrototypeIds,
} from "../permanent";

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? `${item}n` : item);
}

assert(ALG_ENGLISH_FREEZE_APPROVAL.approvalAuthority === "EXPLICIT_PRODUCT_OWNER_CONTINUATION_AUTHORISED", "Wrong Algebra English freeze approval authority");
assert(ALG_ENGLISH_FREEZE_APPROVAL.approvalDate === "2026-08-19", "Wrong Algebra English freeze approval date");
assert(ALG_ENGLISH_FREEZE_APPROVAL.approvalAuditCommentId === 5336644520, "Wrong Algebra English freeze audit comment");
assert(ALG_ENGLISH_FREEZE_APPROVAL.approvedSourceHead === "7d68e7abc86aa4ac85917b20e61bc3b7af76d0b2", "Wrong reviewed source head");
assert(ALG_ENGLISH_FREEZE_APPROVAL.qlCount === 43, "English freeze must cover 43 permanent QLs");
assert(ALG_ENGLISH_FREEZE_APPROVAL.mappedVariantCount === 109, "English freeze must cover 109 mapped variants");
assert(ALG_ENGLISH_FREEZE_APPROVAL.editorialSampleCount === 1308, "English freeze must pin the 1,308-sample editorial gate");
assert(ALG_ENGLISH_FREEZE_APPROVAL.permanentAllocationWorkflowRunId === 32197939867, "Permanent allocation workflow evidence changed");
assert(ALG_ENGLISH_FREEZE_APPROVAL.permanentEnglishWorkflowRunId === 32197939749, "Permanent English workflow evidence changed");

const audit = auditAlgEnglishFreeze();
assert(audit.freezeId === ALG_ENGLISH_FREEZE_ID, "Freeze audit ID mismatch");
assert(audit.qlCount === 43 && audit.firstQlId === "ALG-QL-001" && audit.lastQlId === "ALG-QL-043", "Frozen QL range mismatch");
assert(audit.englishFrozen, "English implementation must be frozen");
assert(audit.multilingualLocked, "Multilingual implementation must remain locked");
assert(audit.downstreamLocked, "Downstream product lifecycle must remain locked");

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
      const candidate = generateAlgPermanentEnglishCandidate(allocation.qlId, seed, variantIndex);
      const frozen = generateAlgPermanentEnglishFrozen(allocation.qlId, seed, variantIndex);
      const prefix = `${allocation.qlId}/${candidate.prototypeId}/seed-${seed}`;
      reviewed += 1;

      assert(frozen.qlId === candidate.qlId, `${prefix}: QL identity changed during freeze`);
      assert(frozen.freezeKey === candidate.freezeKey, `${prefix}: freeze key changed during freeze`);
      assert(frozen.packageId === candidate.packageId && frozen.cpId === candidate.cpId, `${prefix}: package/CP changed during freeze`);
      assert(frozen.prototypeId === candidate.prototypeId && frozen.prototypeSolveMode === candidate.prototypeSolveMode, `${prefix}: prototype provenance changed during freeze`);
      assert(frozen.variantIndex === candidate.variantIndex && frozen.seed === candidate.seed, `${prefix}: generation coordinates changed during freeze`);
      assert(frozen.question === candidate.question, `${prefix}: learner question changed during freeze`);
      assert(frozen.explanation === candidate.explanation, `${prefix}: learner explanation changed during freeze`);
      assert(stable(frozen.canonicalAnswer) === stable(candidate.canonicalAnswer), `${prefix}: canonical answer changed during freeze`);
      assert(stable(frozen.rawDiscoveryItem) === stable(candidate.rawDiscoveryItem), `${prefix}: raw solver state changed during freeze`);

      assert(frozen.freezeId === ALG_ENGLISH_FREEZE_ID, `${prefix}: freeze ID missing`);
      assert(frozen.approvedSourceHead === ALG_ENGLISH_FREEZE_APPROVAL.approvedSourceHead, `${prefix}: approved source head mismatch`);
      assert(frozen.allocationStatus === "PRODUCT_OWNER_APPROVED_INACTIVE_ENGLISH_IMPLEMENTATION", `${prefix}: wrong allocation status`);
      assert(frozen.maturity === "ENGLISH_IMPLEMENTATION_FROZEN", `${prefix}: wrong maturity`);
      assert(frozen.reviewStatus === "APPROVED_ENGLISH_FROZEN", `${prefix}: wrong review status`);
      assert(frozen.permanentIdentityFrozen && frozen.semanticContractFrozen, `${prefix}: semantic freeze lost`);
      assert(frozen.learnerContentFrozen && frozen.solverAuthorityFrozen && frozen.englishImplementationFrozen, `${prefix}: English freeze fields missing`);
      assert(!frozen.multilingualImplementationFrozen, `${prefix}: multilingual freeze must remain false`);
      assert(!frozen.active && !frozen.questionStudioDiscoverable, `${prefix}: activation/Question Studio leaked`);
      assert(frozen.questionBankStatus === "NOT_STORED" && !frozen.questionBankWritable, `${prefix}: Question Bank leaked`);
      assert(frozen.testEligibility === "INELIGIBLE" && !frozen.testEligible, `${prefix}: test eligibility leaked`);
      assert(!frozen.publiclyPublishable, `${prefix}: public release leaked`);
    }
  }
}

assert(mappedVariants === 109, `Expected 109 frozen mapped variants, found ${mappedVariants}`);
assert(reviewed === 1308, `Expected 1,308 frozen English proof samples, reviewed ${reviewed}`);

console.log(`Algebra inactive English freeze ${ALG_ENGLISH_FREEZE_ID} passed for ${reviewed} samples across 43 QLs and ${mappedVariants} variants`);

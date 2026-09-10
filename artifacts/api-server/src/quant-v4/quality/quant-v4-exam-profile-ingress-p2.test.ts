import assert from "node:assert/strict";

import {
  QUANT_V4_EXAM_PROFILE_INGRESS_AUTHORITY,
  generateQuestion,
  getCurrentQuantV4ExamProfileContract,
  getCurrentQuantV4ExamProfileId,
  withQuantV4ExamProfileContext,
  type QuantV4GenerationRequest,
} from "../generation-engine";

const compileProbe: QuantV4GenerationRequest = {
  packageId: "PCT-001",
  examProfile: "PUNJAB_STATE",
  count: 1,
  seed: "quant-v4-profile-ingress:compile-probe",
};
assert.equal(compileProbe.examProfile, "PUNJAB_STATE");
assert.equal(getCurrentQuantV4ExamProfileId(), undefined);

const isolatedProfiles = await Promise.all([
  withQuantV4ExamProfileContext("PUNJAB_STATE", async () => {
    await new Promise((resolve) => setImmediate(resolve));
    return {
      id: getCurrentQuantV4ExamProfileId(),
      family: getCurrentQuantV4ExamProfileContract()?.family,
      optionCount: getCurrentQuantV4ExamProfileContract()?.optionCount,
    };
  }),
  withQuantV4ExamProfileContext("BANKING_PRELIMS", async () => {
    await new Promise((resolve) => setImmediate(resolve));
    return {
      id: getCurrentQuantV4ExamProfileId(),
      family: getCurrentQuantV4ExamProfileContract()?.family,
      optionCount: getCurrentQuantV4ExamProfileContract()?.optionCount,
    };
  }),
]);
assert.deepEqual(isolatedProfiles, [
  { id: "PUNJAB_STATE", family: "PUNJAB_STATE", optionCount: 4 },
  { id: "BANKING_PRELIMS", family: "BANKING", optionCount: 5 },
]);
assert.equal(getCurrentQuantV4ExamProfileId(), undefined, "Request-scoped profile context leaked after completion.");

const punjabCore = await generateQuestion({
  packageId: "PCT-001",
  examProfile: "PUNJAB_STATE",
  count: 2,
  seed: "quant-v4-profile-ingress:punjab-core",
});
assert.equal(punjabCore.generationContext.requestedExamProfile, "PUNJAB_STATE");
assert.equal(punjabCore.generationContext.requestedExamFamily, "PUNJAB_STATE");
assert.equal(punjabCore.generationContext.requestedDeliveryStyle, "PUNJAB_STATE_OBJECTIVE");
assert.equal(punjabCore.generationContext.expectedOptionCount, 4);
assert.equal(punjabCore.generationContext.downstreamContextAvailable, true);
assert.equal(punjabCore.generationContext.profileTransportAuthority, QUANT_V4_EXAM_PROFILE_INGRESS_AUTHORITY);
assert.equal(punjabCore.generationContext.profileTransportStatus, "INGRESS_ACCEPTED_DOWNSTREAM_PENDING");
assert.ok(punjabCore.generationContext.downstreamPendingCount > 0);
assert.ok(punjabCore.questions.every((question: any) => question.requestedExamProfile === "PUNJAB_STATE"));
assert.ok(punjabCore.questions.every((question: any) => question.expectedOptionCount === 4));
assert.ok(punjabCore.questions.every((question: any) => question.examProfileTransportStatus === "INGRESS_ACCEPTED_DOWNSTREAM_PENDING"));

const sscProbability = await generateQuestion({
  packageId: "PRB-001" as any,
  canonicalProblemId: "PRB-CP-001",
  examProfile: "SSC_CGL_CHSL",
  count: 2,
  seed: "quant-v4-profile-ingress:ssc-probability",
});
assert.equal(sscProbability.generationContext.requestedExamProfile, "SSC_CGL_CHSL");
assert.equal(sscProbability.generationContext.expectedOptionCount, 4);
assert.equal(sscProbability.generationContext.downstreamContextAvailable, true);
assert.equal(sscProbability.generationContext.profileTransportStatus, "APPLIED_DOWNSTREAM");
assert.ok(sscProbability.questions.every((question: any) => question.examProfile === "SSC_CGL_CHSL"));
assert.ok(sscProbability.questions.every((question: any) => question.examProfileTransportStatus === "APPLIED_DOWNSTREAM"));
assert.ok(sscProbability.questions.every((question: any) => question.options.length === 4));

const bankingProbability = await generateQuestion({
  packageId: "PRB-001" as any,
  canonicalProblemId: "PRB-CP-001",
  examProfile: "BANKING_PRELIMS",
  count: 2,
  seed: "quant-v4-profile-ingress:banking-probability",
});
assert.equal(bankingProbability.generationContext.requestedExamProfile, "BANKING_PRELIMS");
assert.equal(bankingProbability.generationContext.expectedOptionCount, 5);
assert.equal(bankingProbability.generationContext.downstreamContextAvailable, true);
assert.equal(bankingProbability.generationContext.profileTransportStatus, "APPLIED_DOWNSTREAM");
assert.ok(bankingProbability.questions.every((question: any) => question.options.length === 5));

let invalidRejected = false;
try {
  await generateQuestion({
    packageId: "PCT-001",
    examProfile: "NOT_A_REAL_PROFILE" as any,
    count: 1,
    seed: "quant-v4-profile-ingress:invalid",
  });
} catch (error) {
  invalidRejected = /Unknown Quant V4 exam profile/u.test(String(error));
}
assert.equal(invalidRejected, true, "Unknown shared exam profiles must fail closed at public ingress.");

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_EXAM_PROFILE_INGRESS_P2",
  authority: QUANT_V4_EXAM_PROFILE_INGRESS_AUTHORITY,
  requestScopedContextIsolation: isolatedProfiles,
  punjabCoreStatus: punjabCore.generationContext.profileTransportStatus,
  sscProbabilityStatus: sscProbability.generationContext.profileTransportStatus,
  bankingProbabilityStatus: bankingProbability.generationContext.profileTransportStatus,
}));

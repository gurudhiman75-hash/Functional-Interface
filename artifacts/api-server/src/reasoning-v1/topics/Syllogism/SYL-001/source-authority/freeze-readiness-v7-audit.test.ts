import assert from "node:assert/strict";
import { SYL_BANKING_CROSS_EXAM_CENSUS_V4 } from "./banking-cross-exam-census-v4";
import { SYL_FREEZE_READINESS_V6 } from "./freeze-readiness-v6";
import { SYL_FREEZE_REQUIREMENTS_V7, SYL_FREEZE_READINESS_V7 } from "./freeze-readiness-v7";

assert.equal(SYL_FREEZE_READINESS_V7.supersedes, SYL_FREEZE_READINESS_V6.authorityId);
assert.equal(SYL_FREEZE_READINESS_V7.status, "NOT_READY_FOR_PROFILE_OR_QL_FREEZE");
assert.equal(SYL_FREEZE_READINESS_V7.requirementCount, 11);
assert.deepEqual(SYL_FREEZE_READINESS_V7.counts, { MET: 5, PARTIAL: 4, BLOCKED: 2 });

const sourceProfileRequirement = SYL_FREEZE_REQUIREMENTS_V7.find((requirement) => requirement.requirementId === "SOURCE_PROFILE_FROZEN");
assert.ok(sourceProfileRequirement);
assert.equal(sourceProfileRequirement.status, "BLOCKED");
assert.ok(sourceProfileRequirement.evidence.includes(SYL_BANKING_CROSS_EXAM_CENSUS_V4.authorityId));
assert.ok(sourceProfileRequirement.evidence.includes("5 Banking exam series"));
assert.ok(sourceProfileRequirement.evidence.includes("33 structural question records"));
assert.ok(sourceProfileRequirement.evidence.includes("factorized weighting model"));
assert.ok(sourceProfileRequirement.unblockAction?.includes("conclusion-structure"));
assert.ok(sourceProfileRequirement.unblockAction?.includes("conclusion-semantic-feature"));
assert.ok(sourceProfileRequirement.unblockAction?.includes("premise-overlay"));

assert.equal(SYL_FREEZE_READINESS_V7.bankingCrossExamCensusAuthority, SYL_BANKING_CROSS_EXAM_CENSUS_V4.authorityId);
assert.equal(SYL_FREEZE_READINESS_V7.bankingCrossExamSeriesCount, 5);
assert.equal(SYL_FREEZE_READINESS_V7.bankingStructuralQuestionRecordsObserved, 33);
assert.equal(SYL_FREEZE_READINESS_V7.bankingCompleteOfficerLevelShiftCount, 1);
assert.equal(SYL_FREEZE_READINESS_V7.bankingFactorizedWeightModelRequired, true);
assert.equal(SYL_FREEZE_READINESS_V7.bankingMinimumIndependentWeightDimensions, 3);
assert.deepEqual(SYL_FREEZE_READINESS_V7.bankingWeightDimensions, [
  "CONCLUSION_STRUCTURE",
  "CONCLUSION_SEMANTIC_FEATURES",
  "PREMISE_VOCABULARY_OVERLAY",
]);
assert.equal(SYL_FREEZE_READINESS_V7.bankingLegacyProvisionalFamiliesMixIndependentDimensions, true);
assert.equal(SYL_FREEZE_READINESS_V7.bankingWeightModelArchitectureClarified, true);
assert.equal(SYL_FREEZE_READINESS_V7.bankingSystematicCrossSeriesWeightSampleComplete, false);
assert.equal(SYL_FREEZE_READINESS_V7.bankingKnownSourceConflictsRemain, true);
assert.equal(SYL_FREEZE_READINESS_V7.bankingExactWeightingFrozen, false);
assert.equal(SYL_FREEZE_READINESS_V7.exactPercentageWeightingPermitted, false);
assert.equal(SYL_FREEZE_READINESS_V7.currentProvisionalBankingMixChanged, false);
assert.equal(SYL_FREEZE_READINESS_V7.factorizedPlannerRedesignImplemented, false);
assert.equal(SYL_FREEZE_READINESS_V7.connectedToProductionGenerator, false);
assert.equal(SYL_FREEZE_READINESS_V7.connectedToProductionPlanner, false);
assert.equal(SYL_FREEZE_READINESS_V7.permanentQl019Created, false);
assert.equal(SYL_FREEZE_READINESS_V7.permanentQlFreezePermitted, false);
assert.equal(SYL_FREEZE_READINESS_V7.profileActivationPermitted, false);
assert.equal(SYL_FREEZE_READINESS_V7.generatorIntegrationPermitted, false);
assert.equal(SYL_FREEZE_READINESS_V7.questionStudioActivationPermitted, false);
assert.equal(SYL_FREEZE_READINESS_V7.questionBankWritePermitted, false);
assert.equal(SYL_FREEZE_READINESS_V7.testDeliveryPermitted, false);
assert.equal(SYL_FREEZE_READINESS_V7.publicPublishingPermitted, false);
assert.equal(SYL_FREEZE_READINESS_V7.difficultyActivationPermitted, false);
assert.equal(SYL_FREEZE_READINESS_V7.prMergeRecommended, false);

assert.ok(SYL_FREEZE_READINESS_V7.nextCriticalPath.some((entry) => entry.includes("factorized Banking census")));
assert.ok(SYL_FREEZE_READINESS_V7.nextCriticalPath.some((entry) => entry.includes("inactive factorized Banking planner candidate")));
assert.ok(SYL_FREEZE_READINESS_V7.nextCriticalPath.some((entry) => entry.includes("do not mutate")));

console.log(JSON.stringify({
  status: "PASS_SYL_001_FREEZE_READINESS_V7",
  decision: SYL_FREEZE_READINESS_V7.status,
  counts: SYL_FREEZE_READINESS_V7.counts,
  bankingCrossExamSeriesCount: SYL_FREEZE_READINESS_V7.bankingCrossExamSeriesCount,
  bankingStructuralQuestionRecordsObserved: SYL_FREEZE_READINESS_V7.bankingStructuralQuestionRecordsObserved,
  bankingCompleteOfficerLevelShiftCount: SYL_FREEZE_READINESS_V7.bankingCompleteOfficerLevelShiftCount,
  bankingFactorizedWeightModelRequired: SYL_FREEZE_READINESS_V7.bankingFactorizedWeightModelRequired,
  bankingMinimumIndependentWeightDimensions: SYL_FREEZE_READINESS_V7.bankingMinimumIndependentWeightDimensions,
  bankingWeightModelArchitectureClarified: SYL_FREEZE_READINESS_V7.bankingWeightModelArchitectureClarified,
  bankingSystematicCrossSeriesWeightSampleComplete: SYL_FREEZE_READINESS_V7.bankingSystematicCrossSeriesWeightSampleComplete,
  bankingExactWeightingFrozen: SYL_FREEZE_READINESS_V7.bankingExactWeightingFrozen,
  currentProvisionalBankingMixChanged: SYL_FREEZE_READINESS_V7.currentProvisionalBankingMixChanged,
  factorizedPlannerRedesignImplemented: SYL_FREEZE_READINESS_V7.factorizedPlannerRedesignImplemented,
  permanentQl019Created: SYL_FREEZE_READINESS_V7.permanentQl019Created,
  connectedToProductionPlanner: SYL_FREEZE_READINESS_V7.connectedToProductionPlanner,
  activationPermitted: SYL_FREEZE_READINESS_V7.profileActivationPermitted,
  prMergeRecommended: SYL_FREEZE_READINESS_V7.prMergeRecommended,
}, null, 2));

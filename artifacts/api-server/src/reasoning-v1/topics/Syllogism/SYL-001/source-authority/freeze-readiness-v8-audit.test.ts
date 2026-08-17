import assert from "node:assert/strict";
import { SYL_BANKING_CROSS_EXAM_CENSUS_V5 } from "./banking-cross-exam-census-v5";
import { SYL_FREEZE_READINESS_V7 } from "./freeze-readiness-v7";
import { SYL_FREEZE_REQUIREMENTS_V8, SYL_FREEZE_READINESS_V8 } from "./freeze-readiness-v8";

assert.equal(SYL_FREEZE_READINESS_V8.supersedes, SYL_FREEZE_READINESS_V7.authorityId);
assert.equal(SYL_FREEZE_READINESS_V8.status, "NOT_READY_FOR_PROFILE_OR_QL_FREEZE");
assert.equal(SYL_FREEZE_READINESS_V8.requirementCount, SYL_FREEZE_REQUIREMENTS_V8.length);
assert.deepEqual(SYL_FREEZE_READINESS_V8.counts, { MET: 5, PARTIAL: 4, BLOCKED: 2 });

const sourceProfileRequirement = SYL_FREEZE_REQUIREMENTS_V8.find((requirement) => requirement.requirementId === "SOURCE_PROFILE_FROZEN");
assert.ok(sourceProfileRequirement);
assert.equal(sourceProfileRequirement.status, "BLOCKED");
assert.ok(sourceProfileRequirement.evidence.includes(SYL_BANKING_CROSS_EXAM_CENSUS_V5.authorityId));
assert.ok(sourceProfileRequirement.evidence.includes("37 structural question records"));
assert.ok(sourceProfileRequirement.evidence.includes("2 complete, independently count-corroborated officer-level shifts"));
assert.ok(sourceProfileRequirement.evidence.includes("4 independent dimensions"));
assert.ok(sourceProfileRequirement.evidence.includes("Either/Or"));
assert.ok(sourceProfileRequirement.unblockAction?.includes("conclusion-set-relationship"));
assert.equal(sourceProfileRequirement.unblockAction?.includes("independently corroborate"), false);

assert.equal(SYL_FREEZE_READINESS_V8.bankingCrossExamCensusAuthority, SYL_BANKING_CROSS_EXAM_CENSUS_V5.authorityId);
assert.equal(SYL_FREEZE_READINESS_V8.bankingCrossExamSeriesCount, 5);
assert.equal(SYL_FREEZE_READINESS_V8.bankingStructuralQuestionRecordsObserved, 37);
assert.equal(SYL_FREEZE_READINESS_V8.bankingArchiveCompleteOfficerLevelShiftCount, 2);
assert.equal(SYL_FREEZE_READINESS_V8.bankingIndependentlyCountCorroboratedCompleteOfficerLevelShiftCount, 2);
assert.equal(SYL_FREEZE_READINESS_V8.bankingFactorizedWeightModelRequired, true);
assert.equal(SYL_FREEZE_READINESS_V8.bankingMinimumIndependentWeightDimensions, 4);
assert.deepEqual(SYL_FREEZE_READINESS_V8.bankingWeightDimensions, [
  "CONCLUSION_STRUCTURE",
  "CONCLUSION_SEMANTIC_FEATURES",
  "PREMISE_VOCABULARY_OVERLAY",
  "CONCLUSION_SET_RELATIONSHIP",
]);
assert.equal(SYL_FREEZE_READINESS_V8.bankingEitherOrIndependentConclusionSetRelationshipDimensionRequired, true);
assert.equal(SYL_FREEZE_READINESS_V8.bankingLegacyProvisionalFamiliesMixIndependentDimensions, true);
assert.equal(SYL_FREEZE_READINESS_V8.bankingWeightModelArchitectureClarified, true);
assert.equal(SYL_FREEZE_READINESS_V8.bankingSystematicCrossSeriesWeightSampleComplete, false);
assert.equal(SYL_FREEZE_READINESS_V8.bankingKnownSourceConflictsRemain, true);
assert.equal(SYL_FREEZE_READINESS_V8.bankingSingleCountSourceCompleteShiftNeedsIndependentCorroboration, false);
assert.equal(SYL_FREEZE_READINESS_V8.bankingExactWeightingFrozen, false);
assert.equal(SYL_FREEZE_READINESS_V8.exactPercentageWeightingPermitted, false);
assert.equal(SYL_FREEZE_READINESS_V8.currentProvisionalBankingMixChanged, false);
assert.equal(SYL_FREEZE_READINESS_V8.factorizedPlannerRedesignImplemented, false);
assert.equal(SYL_FREEZE_READINESS_V8.connectedToProductionGenerator, false);
assert.equal(SYL_FREEZE_READINESS_V8.connectedToProductionPlanner, false);
assert.equal(SYL_FREEZE_READINESS_V8.permanentQl019Created, false);
assert.equal(SYL_FREEZE_READINESS_V8.permanentQlFreezePermitted, false);
assert.equal(SYL_FREEZE_READINESS_V8.profileActivationPermitted, false);
assert.equal(SYL_FREEZE_READINESS_V8.generatorIntegrationPermitted, false);
assert.equal(SYL_FREEZE_READINESS_V8.questionStudioActivationPermitted, false);
assert.equal(SYL_FREEZE_READINESS_V8.questionBankWritePermitted, false);
assert.equal(SYL_FREEZE_READINESS_V8.testDeliveryPermitted, false);
assert.equal(SYL_FREEZE_READINESS_V8.publicPublishingPermitted, false);
assert.equal(SYL_FREEZE_READINESS_V8.difficultyActivationPermitted, false);
assert.equal(SYL_FREEZE_READINESS_V8.prMergeRecommended, false);

console.log(JSON.stringify({
  status: "PASS_SYL_001_FREEZE_READINESS_V8",
  decision: SYL_FREEZE_READINESS_V8.status,
  counts: SYL_FREEZE_READINESS_V8.counts,
  bankingCrossExamSeriesCount: SYL_FREEZE_READINESS_V8.bankingCrossExamSeriesCount,
  bankingStructuralQuestionRecordsObserved: SYL_FREEZE_READINESS_V8.bankingStructuralQuestionRecordsObserved,
  bankingArchiveCompleteOfficerLevelShiftCount: SYL_FREEZE_READINESS_V8.bankingArchiveCompleteOfficerLevelShiftCount,
  bankingIndependentlyCountCorroboratedCompleteOfficerLevelShiftCount: SYL_FREEZE_READINESS_V8.bankingIndependentlyCountCorroboratedCompleteOfficerLevelShiftCount,
  bankingMinimumIndependentWeightDimensions: SYL_FREEZE_READINESS_V8.bankingMinimumIndependentWeightDimensions,
  bankingWeightDimensions: SYL_FREEZE_READINESS_V8.bankingWeightDimensions,
  bankingSystematicCrossSeriesWeightSampleComplete: SYL_FREEZE_READINESS_V8.bankingSystematicCrossSeriesWeightSampleComplete,
  bankingKnownSourceConflictsRemain: SYL_FREEZE_READINESS_V8.bankingKnownSourceConflictsRemain,
  bankingSingleCountSourceCompleteShiftNeedsIndependentCorroboration: SYL_FREEZE_READINESS_V8.bankingSingleCountSourceCompleteShiftNeedsIndependentCorroboration,
  bankingExactWeightingFrozen: SYL_FREEZE_READINESS_V8.bankingExactWeightingFrozen,
  currentProvisionalBankingMixChanged: SYL_FREEZE_READINESS_V8.currentProvisionalBankingMixChanged,
  factorizedPlannerRedesignImplemented: SYL_FREEZE_READINESS_V8.factorizedPlannerRedesignImplemented,
  permanentQl019Created: SYL_FREEZE_READINESS_V8.permanentQl019Created,
  connectedToProductionPlanner: SYL_FREEZE_READINESS_V8.connectedToProductionPlanner,
  activationPermitted: SYL_FREEZE_READINESS_V8.profileActivationPermitted,
  prMergeRecommended: SYL_FREEZE_READINESS_V8.prMergeRecommended,
}, null, 2));

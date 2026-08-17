import assert from "node:assert/strict";
import { SYL_BANKING_CROSS_EXAM_CENSUS_V6 } from "./banking-cross-exam-census-v6";
import { SYL_FREEZE_READINESS_V8 } from "./freeze-readiness-v8";
import { SYL_FREEZE_REQUIREMENTS_V9, SYL_FREEZE_READINESS_V9 } from "./freeze-readiness-v9";

assert.equal(SYL_FREEZE_READINESS_V9.supersedes, SYL_FREEZE_READINESS_V8.authorityId);
assert.equal(SYL_FREEZE_READINESS_V9.status, "NOT_READY_FOR_PROFILE_OR_QL_FREEZE");
assert.equal(SYL_FREEZE_READINESS_V9.requirementCount, SYL_FREEZE_REQUIREMENTS_V9.length);
assert.deepEqual(SYL_FREEZE_READINESS_V9.counts, { MET: 5, PARTIAL: 4, BLOCKED: 2 });

const sourceProfileRequirement = SYL_FREEZE_REQUIREMENTS_V9.find((requirement) => requirement.requirementId === "SOURCE_PROFILE_FROZEN");
assert.ok(sourceProfileRequirement);
assert.equal(sourceProfileRequirement.status, "BLOCKED");
assert.ok(sourceProfileRequirement.evidence.includes(SYL_BANKING_CROSS_EXAM_CENSUS_V6.authorityId));
assert.ok(sourceProfileRequirement.evidence.includes("40 structural question records"));
assert.ok(sourceProfileRequirement.evidence.includes("multi-label"));
assert.ok(sourceProfileRequirement.evidence.includes("Only and Only-a-few"));
assert.ok(sourceProfileRequirement.evidence.includes("3-to-6 topic-count conflict"));
assert.ok(sourceProfileRequirement.unblockAction?.includes("four independent dimensions"));
assert.ok(sourceProfileRequirement.unblockAction?.includes("multi-label conclusion-semantic and premise-overlay features"));

assert.equal(SYL_FREEZE_READINESS_V9.bankingCrossExamCensusAuthority, SYL_BANKING_CROSS_EXAM_CENSUS_V6.authorityId);
assert.equal(SYL_FREEZE_READINESS_V9.bankingCrossExamSeriesCount, 5);
assert.equal(SYL_FREEZE_READINESS_V9.bankingStructuralQuestionRecordsObserved, 40);
assert.equal(SYL_FREEZE_READINESS_V9.bankingCompleteOfficerLevelShiftCount, 2);
assert.equal(SYL_FREEZE_READINESS_V9.bankingIndependentlyCountCorroboratedCompleteOfficerLevelShiftCount, 2);
assert.equal(SYL_FREEZE_READINESS_V9.bankingFactorizedWeightModelRequired, true);
assert.equal(SYL_FREEZE_READINESS_V9.bankingMinimumIndependentWeightDimensions, 4);
assert.deepEqual(SYL_FREEZE_READINESS_V9.bankingWeightDimensions, [
  "CONCLUSION_STRUCTURE",
  "CONCLUSION_SEMANTIC_FEATURES",
  "PREMISE_VOCABULARY_OVERLAY",
  "CONCLUSION_SET_RELATIONSHIP",
]);
assert.equal(SYL_FREEZE_READINESS_V9.bankingConclusionSemanticFeaturesRemainMultiLabel, true);
assert.equal(SYL_FREEZE_READINESS_V9.bankingPremiseVocabularyOverlayFeaturesRemainMultiLabel, true);
assert.equal(SYL_FREEZE_READINESS_V9.bankingPremiseOverlayMultiLabelCreatesAdditionalDimension, false);
assert.equal(SYL_FREEZE_READINESS_V9.bankingConclusionSetRelationshipIndependentDimensionRequired, true);
assert.equal(SYL_FREEZE_READINESS_V9.bankingWeightModelArchitectureClarified, true);
assert.equal(SYL_FREEZE_READINESS_V9.bankingSystematicCrossSeriesWeightSampleComplete, false);
assert.equal(SYL_FREEZE_READINESS_V9.bankingKnownSourceConflictsRemain, true);
assert.equal(SYL_FREEZE_READINESS_V9.bankingSbiPoNov1CountConflictRetained, true);
assert.equal(SYL_FREEZE_READINESS_V9.bankingExactWeightingFrozen, false);
assert.equal(SYL_FREEZE_READINESS_V9.exactPercentageWeightingPermitted, false);
assert.equal(SYL_FREEZE_READINESS_V9.currentProvisionalBankingMixChanged, false);
assert.equal(SYL_FREEZE_READINESS_V9.factorizedPlannerRedesignImplemented, false);
assert.equal(SYL_FREEZE_READINESS_V9.connectedToProductionGenerator, false);
assert.equal(SYL_FREEZE_READINESS_V9.connectedToProductionPlanner, false);
assert.equal(SYL_FREEZE_READINESS_V9.permanentQl019Created, false);
assert.equal(SYL_FREEZE_READINESS_V9.permanentQlFreezePermitted, false);
assert.equal(SYL_FREEZE_READINESS_V9.profileActivationPermitted, false);
assert.equal(SYL_FREEZE_READINESS_V9.generatorIntegrationPermitted, false);
assert.equal(SYL_FREEZE_READINESS_V9.questionStudioActivationPermitted, false);
assert.equal(SYL_FREEZE_READINESS_V9.questionBankWritePermitted, false);
assert.equal(SYL_FREEZE_READINESS_V9.testDeliveryPermitted, false);
assert.equal(SYL_FREEZE_READINESS_V9.publicPublishingPermitted, false);
assert.equal(SYL_FREEZE_READINESS_V9.difficultyActivationPermitted, false);
assert.equal(SYL_FREEZE_READINESS_V9.prMergeRecommended, false);

console.log(JSON.stringify({
  status: "PASS_SYL_001_FREEZE_READINESS_V9",
  decision: SYL_FREEZE_READINESS_V9.status,
  counts: SYL_FREEZE_READINESS_V9.counts,
  bankingCrossExamSeriesCount: SYL_FREEZE_READINESS_V9.bankingCrossExamSeriesCount,
  bankingStructuralQuestionRecordsObserved: SYL_FREEZE_READINESS_V9.bankingStructuralQuestionRecordsObserved,
  bankingCompleteOfficerLevelShiftCount: SYL_FREEZE_READINESS_V9.bankingCompleteOfficerLevelShiftCount,
  bankingIndependentlyCountCorroboratedCompleteOfficerLevelShiftCount: SYL_FREEZE_READINESS_V9.bankingIndependentlyCountCorroboratedCompleteOfficerLevelShiftCount,
  bankingMinimumIndependentWeightDimensions: SYL_FREEZE_READINESS_V9.bankingMinimumIndependentWeightDimensions,
  bankingConclusionSemanticFeaturesRemainMultiLabel: SYL_FREEZE_READINESS_V9.bankingConclusionSemanticFeaturesRemainMultiLabel,
  bankingPremiseVocabularyOverlayFeaturesRemainMultiLabel: SYL_FREEZE_READINESS_V9.bankingPremiseVocabularyOverlayFeaturesRemainMultiLabel,
  bankingSystematicCrossSeriesWeightSampleComplete: SYL_FREEZE_READINESS_V9.bankingSystematicCrossSeriesWeightSampleComplete,
  bankingKnownSourceConflictsRemain: SYL_FREEZE_READINESS_V9.bankingKnownSourceConflictsRemain,
  bankingExactWeightingFrozen: SYL_FREEZE_READINESS_V9.bankingExactWeightingFrozen,
  currentProvisionalBankingMixChanged: SYL_FREEZE_READINESS_V9.currentProvisionalBankingMixChanged,
  factorizedPlannerRedesignImplemented: SYL_FREEZE_READINESS_V9.factorizedPlannerRedesignImplemented,
  permanentQl019Created: SYL_FREEZE_READINESS_V9.permanentQl019Created,
  connectedToProductionPlanner: SYL_FREEZE_READINESS_V9.connectedToProductionPlanner,
  activationPermitted: SYL_FREEZE_READINESS_V9.profileActivationPermitted,
  prMergeRecommended: SYL_FREEZE_READINESS_V9.prMergeRecommended,
}, null, 2));

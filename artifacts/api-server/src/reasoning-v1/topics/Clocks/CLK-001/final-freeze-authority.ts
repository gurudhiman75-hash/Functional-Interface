import { CLOCK_EFFECTIVE_DISCOVERY_GATE_POLICY } from './runtime/discovery-gates-calibrated';
import { CLOCK_ITEM_DIFFICULTY_POLICY } from './runtime/difficulty-item';
import { CLOCK_MULTILINGUAL_RISK_POLICY } from './runtime/multilingual-risk';
import { CLOCK_SOURCE_SATURATION_POLICY } from './runtime/source-saturation';
import {
  CLK_001_PERMANENT_CONTRACTS,
  CLK_001_PERMANENT_FREEZE_VERSION,
  CLK_001_DESIGN_ONLY_REPRESENTATION_QL_IDS,
  CLK_001_EXTERNALLY_EVIDENCED_QL_IDS,
} from './permanent-contracts';

export const CLK_001_AUTHORING_COMPLETION_AUTHORITY_V1 = Object.freeze({
  authorityId: 'CLK-001-AUTHORING-COMPLETION-V1' as const,
  freezeVersion: CLK_001_PERMANENT_FREEZE_VERSION,
  chapterCode: 'CLK-001' as const,
  targetExams: Object.freeze(['SSC', 'BANKING', 'PUNJAB_STATE'] as const),
  permanentQlCount: CLK_001_PERMANENT_CONTRACTS.length,
  permanentQlRange: 'CLK-QL-001..023' as const,
  externallyEvidencedPermanentQlCount: CLK_001_EXTERNALLY_EVIDENCED_QL_IDS.length,
  designOnlyRepresentationQlIds: Object.freeze([...CLK_001_DESIGN_ONLY_REPRESENTATION_QL_IDS]),
  sourceEvidenceClaim: '22_EXTERNAL_OR_ADJACENT_SOURCE_AUTHORITIES__1_DESIGN_ONLY_REPRESENTATION_AUTHORITY' as const,
  sourceSaturationAcceptedForAuthoring: CLOCK_SOURCE_SATURATION_POLICY.sourceSaturationComplete,
  unresolvedSourceBackedHoldsResolved:
    CLOCK_EFFECTIVE_DISCOVERY_GATE_POLICY.unresolvedSourceBackedHoldsResolved,
  technicalDifficultyAuditComplete: CLOCK_ITEM_DIFFICULTY_POLICY.technicalAuditComplete,
  technicalDifficultyCorpusSize: CLOCK_ITEM_DIFFICULTY_POLICY.technicalCorpusSize,
  difficultyPolicy:
    'INSTANCE_MODEL_RETAINED__SEMANTIC_BASELINES_ACCEPTED_FOR_AUTHORING__NO_CLAIM_OF_EMPIRICAL_STUDENT_CALIBRATION' as const,
  multilingualRiskAuditComplete: CLOCK_MULTILINGUAL_RISK_POLICY.riskAuditComplete,
  localizationPolicy:
    'CURATED_ANCHOR_SURFACES_EN_HI_PA__SHARED_MATHEMATICS_AND_SEMANTIC_KEYS' as const,
  discoveryHistoryPreserved: true,
  advancedHeldCandidatesRemainExcluded: true,
  questionStudioAuthoringAuthorized: true,
  reviewRunPersistenceAuthorized: true,
  canonicalQuestionBankWriteAuthorizedByThisAuthority: false,
  mockTestReleaseAuthorizedByThisAuthority: false,
  publicReleaseAuthorizedByThisAuthority: false,
  automaticStudentPublication: false,
  manualEditorialApprovalStillRequiredPerGeneratedItem: true,
  status: 'IMPLEMENTATION_COMPLETE__QUESTION_STUDIO_REVIEW_ONLY' as const,
});

if (!CLK_001_AUTHORING_COMPLETION_AUTHORITY_V1.sourceSaturationAcceptedForAuthoring) {
  throw new Error('CLK-001 source saturation is not complete.');
}
if (!CLK_001_AUTHORING_COMPLETION_AUTHORITY_V1.unresolvedSourceBackedHoldsResolved) {
  throw new Error('CLK-001 still has an unresolved source-backed hold.');
}
if (!CLK_001_AUTHORING_COMPLETION_AUTHORITY_V1.technicalDifficultyAuditComplete) {
  throw new Error('CLK-001 technical difficulty audit is incomplete.');
}
if (!CLK_001_AUTHORING_COMPLETION_AUTHORITY_V1.multilingualRiskAuditComplete) {
  throw new Error('CLK-001 multilingual-risk audit is incomplete.');
}

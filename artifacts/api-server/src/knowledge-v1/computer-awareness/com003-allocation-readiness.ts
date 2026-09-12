import { auditCom003CandidateFactCorpus } from "./com003-candidate-fact-corpus";
import { auditCom003ControlledDistractorPools } from "./com003-controlled-distractor-pools";
import { auditCom003CorpusSaturation } from "./com003-corpus-saturation-audit";
import { auditCom003DistractorReadiness } from "./com003-distractor-readiness";
import { auditCom003EditorialFactReview } from "./com003-editorial-fact-review";
import { auditCom003MergeSplitOwnership } from "./com003-office-productivity-merge-split-audit";
import { auditCom003OfficeProductivityDiscovery } from "./com003-office-productivity-discovery";
import { auditCom003SourceAuthorityExtension } from "./com003-source-authority-extension";
import { auditCom003SourceManifest } from "./com003-source-manifest";

export function auditCom003AllocationReadiness() {
  const issues: string[] = [];
  const stages = {
    sourceManifest: auditCom003SourceManifest(),
    sourceAuthorityExtension: auditCom003SourceAuthorityExtension(),
    discovery: auditCom003OfficeProductivityDiscovery(),
    mergeSplit: auditCom003MergeSplitOwnership(),
    candidateCorpus: auditCom003CandidateFactCorpus(),
    corpusSaturation: auditCom003CorpusSaturation(),
    distractorReadiness: auditCom003DistractorReadiness(),
    controlledPools: auditCom003ControlledDistractorPools(),
    editorialReview: auditCom003EditorialFactReview(),
  };

  for (const [stage, result] of Object.entries(stages)) {
    if (!result.valid) issues.push(...result.issues.map((issue) => `${stage}:${issue}`));
  }

  if (stages.discovery.permanentQlCount !== 0) issues.push("DISCOVERY_PREMATURE_QL_ALLOCATION");
  if (stages.mergeSplit.permanentQlCount !== 0) issues.push("MERGE_SPLIT_PREMATURE_QL_ALLOCATION");
  if (!stages.corpusSaturation.corpusSaturated) issues.push("CORPUS_NOT_SATURATED");
  if (!stages.corpusSaturation.readyForEditorialFactReview) issues.push("CORPUS_NOT_EDITORIAL_READY");
  if (stages.distractorReadiness.sharedEngineChangeRequired) issues.push("UNEXPECTED_SHARED_ENGINE_CHANGE_REQUIREMENT");
  if (!stages.controlledPools.controlledPoolImplementationComplete) issues.push("CONTROLLED_POOLS_INCOMPLETE");
  if (stages.editorialReview.approvedCount !== 119) issues.push(`EDITORIAL_APPROVAL_COUNT_DRIFT:${stages.editorialReview.approvedCount}`);
  if (stages.editorialReview.targetTaskCount !== 19) issues.push(`EDITORIAL_TARGET_TASK_COVERAGE_DRIFT:${stages.editorialReview.targetTaskCount}`);
  if (stages.mergeSplit.provisionalTaskCount !== 19) issues.push(`PROVISIONAL_TASK_COUNT_DRIFT:${stages.mergeSplit.provisionalTaskCount}`);
  if (stages.mergeSplit.heldTaskCount !== 2) issues.push(`HELD_TASK_COUNT_DRIFT:${stages.mergeSplit.heldTaskCount}`);

  return {
    valid: issues.length === 0,
    chapterId: "COM-003" as const,
    candidateFactCount: stages.candidateCorpus.factCount,
    editoriallyApprovedFactCount: stages.editorialReview.approvedCount,
    targetFactCount: stages.editorialReview.targetFactCount,
    provisionalTaskCount: stages.mergeSplit.provisionalTaskCount,
    heldTaskCount: stages.mergeSplit.heldTaskCount,
    semanticDistractorTaskCount: stages.distractorReadiness.semanticTaskIds.length,
    controlledDistractorTaskCount: stages.distractorReadiness.controlledTaskIds.length,
    controlledPoolCount: stages.controlledPools.poolCount,
    permanentQlCount: 0,
    status: issues.length === 0 ? "READY_FOR_PERMANENT_ALLOCATION" as const : "BLOCKED" as const,
    contentFrozen: false,
    runtimeRegistered: false,
    productionReleased: false,
    issues,
  };
}

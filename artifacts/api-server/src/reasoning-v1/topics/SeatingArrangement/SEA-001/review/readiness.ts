import type { AuditCaselet } from "../saturation/corpus.ts";
import { runSea001GovernanceAudit } from "../saturation/governance-audit.ts";
import {
  auditSea001ManualReviewLedger,
  type Sea001ManualReviewEntry,
  type Sea001ManualReviewAudit,
} from "./manual-review.ts";

export interface Sea001AllocationReadiness {
  readonly technicalAndSourceGatesPassed: boolean;
  readonly nonManualGovernanceBlockerCount: number;
  readonly manualReview: Sea001ManualReviewAudit;
  readonly permanentAllocationEligible: boolean;
  readonly solveInventoryFreezeEligible: boolean;
  readonly queryMixFreezeEligible: boolean;
  readonly englishFreezeEligible: boolean;
  readonly activationEligible: false;
}

export function assessSea001AllocationReadiness(input: {
  readonly saturationCorpus: readonly AuditCaselet[];
  readonly reviewCorpus: readonly AuditCaselet[];
  readonly reviewLedger: readonly Sea001ManualReviewEntry[];
}): Sea001AllocationReadiness {
  const governance = runSea001GovernanceAudit(input.saturationCorpus);
  const manualReview = auditSea001ManualReviewLedger(input.reviewCorpus, input.reviewLedger);
  const nonManualGovernanceBlockerCount = governance.records.filter((record) =>
    record.disposition === "OPEN_GOVERNANCE" && record.id !== "GAP-SEA001-MANUAL-ENGLISH-REVIEW").length;
  const technicalAndSourceGatesPassed = governance.passedAutomatedGate
    && governance.technicalGapCount === 0
    && governance.sourceAudit.passed
    && governance.authorityDiscrepancyResolved
    && nonManualGovernanceBlockerCount === 0;
  const permanentAllocationEligible = technicalAndSourceGatesPassed && manualReview.freezeEligible;

  // Allocation eligibility is a prerequisite, not the allocation itself. The package continues
  // to report zero permanent QLs until a separately reviewed allocation commit is applied.
  return {
    technicalAndSourceGatesPassed,
    nonManualGovernanceBlockerCount,
    manualReview,
    permanentAllocationEligible,
    solveInventoryFreezeEligible: permanentAllocationEligible,
    queryMixFreezeEligible: permanentAllocationEligible,
    englishFreezeEligible: permanentAllocationEligible,
    activationEligible: false,
  };
}

export function assertSea001PermanentAllocationPrerequisites(
  readiness: Sea001AllocationReadiness,
): void {
  if (!readiness.permanentAllocationEligible) {
    throw new Error(
      `SEA-001 permanent allocation remains locked: automated=${readiness.technicalAndSourceGatesPassed}, manualReview=${readiness.manualReview.freezeEligible}, nonManualGovernance=${readiness.nonManualGovernanceBlockerCount}`,
    );
  }
}

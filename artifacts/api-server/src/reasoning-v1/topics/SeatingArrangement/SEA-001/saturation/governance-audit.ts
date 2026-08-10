import { SEA_001_AUTHORITY_DISCREPANCIES } from "../manifest.ts";
import type { AuditCaselet } from "./corpus.ts";
import {
  runSea001GapAudit,
  type GapAudit,
  type GapRecord,
} from "./authority-audits.ts";
import {
  runSea001ExternalSourceAudit,
  type Sea001SourceAuditResult,
} from "./source-audit.ts";

export interface Sea001GovernanceAudit extends GapAudit {
  readonly sourceAudit: Sea001SourceAuditResult;
  readonly authorityDiscrepancyResolved: boolean;
}

function replaceRecord(
  records: readonly GapRecord[],
  id: string,
  replacement: GapRecord,
): readonly GapRecord[] {
  let replaced = false;
  const output = records.map((record) => {
    if (record.id !== id) return record;
    replaced = true;
    return replacement;
  });
  if (!replaced) throw new Error(`Governance audit could not find gap record ${id}`);
  return output;
}

export function runSea001GovernanceAudit(
  corpus: readonly AuditCaselet[],
): Sea001GovernanceAudit {
  const technical = runSea001GapAudit(corpus);
  const sourceAudit = runSea001ExternalSourceAudit();
  const discrepancy = SEA_001_AUTHORITY_DISCREPANCIES.find((record) => record.id === "SEA-AUTH-DISC-001");
  const authorityDiscrepancyResolved = discrepancy?.status === "RESOLVED_BY_NAMED_INVENTORY_PRECEDENCE";

  let records = replaceRecord(technical.records, "GAP-SEA001-SOURCE-AUDIT", {
    id: "GAP-SEA001-SOURCE-AUDIT",
    disposition: sourceAudit.passed ? "COVERED" : "OPEN_GOVERNANCE",
    statement: sourceAudit.passed
      ? `External source audit covers ${sourceAudit.examFamiliesCovered.join(", ")} and all five SEA-001 checkpoints using ${sourceAudit.evidenceCount} verified evidence records. ${sourceAudit.limitation}`
      : `External source audit remains incomplete. Missing exam families: ${sourceAudit.missingExamFamilies.join(", ") || "none"}; missing checkpoints: ${sourceAudit.missingCheckpoints.join(", ") || "none"}; invalid records: ${sourceAudit.invalidEvidenceCount}.`,
  });

  records = replaceRecord(records, "GAP-CP001-AUTHORITY-COUNT", {
    id: "GAP-CP001-AUTHORITY-COUNT",
    disposition: authorityDiscrepancyResolved ? "COVERED" : "OPEN_GOVERNANCE",
    statement: authorityDiscrepancyResolved
      ? "The CP-001 five-vs-four roadmap discrepancy is resolved by explicit named-inventory precedence: SEA-PBA-001 through SEA-PBA-004 are retained and no unnamed fifth authority is invented."
      : "The CP-001 five-vs-four roadmap discrepancy remains unresolved.",
  });

  const technicalGapCount = records.filter((record) => record.disposition === "GENUINE_MISSING_IMPLEMENTATION").length;
  const openGovernanceCount = records.filter((record) => record.disposition === "OPEN_GOVERNANCE").length;

  return {
    ...technical,
    records,
    technicalGapCount,
    openGovernanceCount,
    passedAutomatedGate: technicalGapCount === 0 && sourceAudit.passed && authorityDiscrepancyResolved,
    eligibleForPermanentAllocation: technicalGapCount === 0 && openGovernanceCount === 0,
    sourceAudit,
    authorityDiscrepancyResolved,
  };
}

import { finalAuthorityByKey } from "../final-authority-registry";
import type { TsdCp003GeneratedQuestion } from "./runtime-types";
import { generateCp003ReviewRows } from "./runtime";
import {
  TSD_CP003_POST_OVERLAP_OWNERSHIP,
  type TsdCp003PostOverlapDisposition,
} from "./post-overlap-authority-registry";

export interface TsdCp003PostOverlapReviewRow extends TsdCp003GeneratedQuestion {
  readonly authorityKey: string;
  readonly authorityOwnerCheckpointId: "TSD-CP-001" | "TSD-CP-002" | "TSD-CP-003";
  readonly ownershipDisposition: TsdCp003PostOverlapDisposition;
  readonly contentCheckpointId: "TSD-CP-003";
}

const ownershipByMode = new Map(
  TSD_CP003_POST_OVERLAP_OWNERSHIP.map((entry) => [entry.solveMode, entry] as const),
);

function ownerCheckpoint(
  targetAuthority: string,
  disposition: TsdCp003PostOverlapDisposition,
): TsdCp003PostOverlapReviewRow["authorityOwnerCheckpointId"] {
  if (disposition !== "PRIOR_CHECKPOINT_REPRESENTATION") return "TSD-CP-003";
  const prior = finalAuthorityByKey(targetAuthority);
  return prior.checkpointId;
}

export function remapCp003ReviewRow(row: TsdCp003GeneratedQuestion): TsdCp003PostOverlapReviewRow {
  const ownership = ownershipByMode.get(row.solveMode);
  if (!ownership) throw new Error(`${row.solveMode}: post-overlap ownership is missing`);

  return Object.freeze({
    ...row,
    authorityKey: ownership.targetAuthority,
    authorityOwnerCheckpointId: ownerCheckpoint(ownership.targetAuthority, ownership.disposition),
    ownershipDisposition: ownership.disposition,
    contentCheckpointId: "TSD-CP-003" as const,
  });
}

export function generateCp003PostOverlapReviewRows(rowsPerDiscoveryAuthority = 3): readonly TsdCp003PostOverlapReviewRow[] {
  return Object.freeze(generateCp003ReviewRows(rowsPerDiscoveryAuthority).map(remapCp003ReviewRow));
}

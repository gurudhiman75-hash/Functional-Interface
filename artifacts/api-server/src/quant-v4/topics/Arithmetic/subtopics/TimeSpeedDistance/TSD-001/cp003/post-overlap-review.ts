import { finalAuthorityByKey } from "../final-authority-registry";
import { TSD_CP003_LEARNER_AUTHORITIES } from "./discovery-registry";
import type { TsdCp003GeneratedQuestion } from "./runtime-types";
import { generateCp003Candidate } from "./runtime";
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

function representationBucket(solveMode: string, representation: string): string {
  if (solveMode === "speedFromFixedRouteTimeDifference") {
    return representation.startsWith("KNOWN_OTHER_SPEED") ? "KNOWN_OTHER_SPEED" : "KNOWN_SPEED_RATIO";
  }
  return representation;
}

function requiredRepresentationDiversity(solveMode: string, rowsPerDiscoveryAuthority: number): number {
  const twoFormModes = new Set([
    "timeGainLossFromSpeedChange",
    "speedFromFixedRouteTimeDifference",
    "scheduledArrivalTimeFromActualSpeed",
    "requiredRemainingSpeedAfterPartialRoute",
    "totalTimeWithRegularStops",
    "lostTimeDurationFromScheduleRecovery",
    "startTimeShiftForSameArrival",
  ]);
  if (solveMode === "walkingRidingAllocation") return Math.min(3, rowsPerDiscoveryAuthority);
  if (twoFormModes.has(solveMode)) return Math.min(2, rowsPerDiscoveryAuthority);
  return 1;
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
  if (!Number.isInteger(rowsPerDiscoveryAuthority) || rowsPerDiscoveryAuthority < 1) {
    throw new Error("rowsPerDiscoveryAuthority must be a positive integer");
  }

  const rows: TsdCp003PostOverlapReviewRow[] = [];
  for (const authority of TSD_CP003_LEARNER_AUTHORITIES) {
    const ownership = ownershipByMode.get(authority.solveMode);
    if (!ownership) throw new Error(`${authority.solveMode}: post-overlap ownership is missing`);
    if (ownership.disposition === "REJECTED_AS_STANDALONE_LEARNER_AUTHORITY") continue;

    const selected: TsdCp003PostOverlapReviewRow[] = [];
    const stems = new Set<string>();
    const fingerprints = new Set<string>();
    const answers = new Set<string>();
    const representationBuckets = new Set<string>();
    const requiredBuckets = requiredRepresentationDiversity(authority.solveMode, rowsPerDiscoveryAuthority);

    for (let candidateIndex = 0; candidateIndex < 320 && selected.length < rowsPerDiscoveryAuthority; candidateIndex += 1) {
      const candidate = generateCp003Candidate(authority.provisionalId, `post-overlap-review:${authority.provisionalId}:${candidateIndex}`);
      const bucket = representationBucket(candidate.solveMode, candidate.representation);
      if (stems.has(candidate.stem) || fingerprints.has(candidate.mathematicalFingerprint) || answers.has(candidate.answerText)) continue;
      if (representationBuckets.size < requiredBuckets && representationBuckets.has(bucket)) continue;

      const mapped = remapCp003ReviewRow(candidate);
      selected.push(mapped);
      stems.add(candidate.stem);
      fingerprints.add(candidate.mathematicalFingerprint);
      answers.add(candidate.answerText);
      representationBuckets.add(bucket);
    }

    if (selected.length !== rowsPerDiscoveryAuthority) {
      throw new Error(`${authority.solveMode}: could not select ${rowsPerDiscoveryAuthority} rows with required stem, mathematical, answer and representation diversity from the deterministic review pool`);
    }
    if (representationBuckets.size < requiredBuckets) {
      throw new Error(`${authority.solveMode}: selected review rows reached only ${representationBuckets.size} material representations; required ${requiredBuckets}`);
    }
    rows.push(...selected);
  }

  return Object.freeze(rows);
}

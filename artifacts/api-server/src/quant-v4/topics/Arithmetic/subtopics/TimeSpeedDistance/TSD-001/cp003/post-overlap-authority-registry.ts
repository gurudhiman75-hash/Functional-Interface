import {
  TSD_FINAL_INTERNAL_AUTHORITIES,
  TSD_FINAL_LEARNER_AUTHORITIES,
} from "../final-authority-registry";
import {
  TSD_CP003_INTERNAL_AUTHORITIES,
  TSD_CP003_LEARNER_AUTHORITIES,
  type TsdCp003AnswerKind,
  type TsdCp003GoverningRule,
  type TsdCp003SourceCandidate,
} from "./discovery-registry";
import { TSD_CP003_CROSS_CHECKPOINT_OVERLAP_AUDIT } from "./cross-checkpoint-overlap-audit";

export type TsdCp003PostOverlapDisposition =
  | "NEW_CP003_AUTHORITY"
  | "MERGED_INTO_NEW_CP003_AUTHORITY"
  | "PRIOR_CHECKPOINT_REPRESENTATION"
  | "REJECTED_AS_STANDALONE_LEARNER_AUTHORITY";

export interface TsdCp003PostOverlapOwnership {
  readonly solveMode: string;
  readonly targetAuthority: string;
  readonly disposition: TsdCp003PostOverlapDisposition;
  readonly sourceCandidates: readonly TsdCp003SourceCandidate[];
  readonly permanentQlId: null;
  readonly englishFreezeStatus: "UNFROZEN";
}

export interface TsdCp003NewAuthorityCandidate {
  readonly authorityKey: string;
  readonly checkpointId: "TSD-CP-003";
  readonly learnerFacing: true;
  readonly answerKind: TsdCp003AnswerKind;
  readonly governingRule: TsdCp003GoverningRule;
  readonly underlyingSolveModes: readonly string[];
  readonly sourceCandidates: readonly TsdCp003SourceCandidate[];
  readonly implementationStatus: "POST_OVERLAP_CANDIDATE_RUNTIME_PROVEN";
  readonly permanentQlId: null;
  readonly englishFreezeStatus: "UNFROZEN";
}

const discoveryByMode = new Map(
  TSD_CP003_LEARNER_AUTHORITIES.map((entry) => [entry.solveMode, entry] as const),
);

export const TSD_CP003_POST_OVERLAP_OWNERSHIP: readonly TsdCp003PostOverlapOwnership[] = Object.freeze(
  TSD_CP003_CROSS_CHECKPOINT_OVERLAP_AUDIT.map((audit) => {
    const discovery = discoveryByMode.get(audit.solveMode);
    if (!discovery) throw new Error(`${audit.solveMode}: overlap audit has no learner discovery authority`);

    const disposition: TsdCp003PostOverlapDisposition = audit.decision === "KEEP_AS_NEW_CP003_AUTHORITY"
      ? "NEW_CP003_AUTHORITY"
      : audit.decision === "MERGE_INTO_CP003_AUTHORITY"
        ? "MERGED_INTO_NEW_CP003_AUTHORITY"
        : audit.decision === "ABSORB_AS_PRIOR_CHECKPOINT_REPRESENTATION"
          ? "PRIOR_CHECKPOINT_REPRESENTATION"
          : "REJECTED_AS_STANDALONE_LEARNER_AUTHORITY";

    return Object.freeze({
      solveMode: audit.solveMode,
      targetAuthority: audit.targetAuthority,
      disposition,
      sourceCandidates: Object.freeze([...discovery.sourceCandidates]),
      permanentQlId: null,
      englishFreezeStatus: "UNFROZEN" as const,
    });
  }),
);

const retainedAuditRows = TSD_CP003_CROSS_CHECKPOINT_OVERLAP_AUDIT.filter(
  (entry) => entry.decision === "KEEP_AS_NEW_CP003_AUTHORITY",
);

export const TSD_CP003_NEW_AUTHORITY_CANDIDATES: readonly TsdCp003NewAuthorityCandidate[] = Object.freeze(
  retainedAuditRows.map((retained) => {
    const base = discoveryByMode.get(retained.solveMode);
    if (!base) throw new Error(`${retained.solveMode}: retained CP-003 authority is missing from discovery registry`);

    const ownedModes = TSD_CP003_CROSS_CHECKPOINT_OVERLAP_AUDIT
      .filter((entry) =>
        entry.targetAuthority === retained.targetAuthority
        && (entry.decision === "KEEP_AS_NEW_CP003_AUTHORITY" || entry.decision === "MERGE_INTO_CP003_AUTHORITY"),
      )
      .map((entry) => entry.solveMode);

    const sourceCandidates = ownedModes.flatMap((mode) => {
      const entry = discoveryByMode.get(mode);
      if (!entry) throw new Error(`${mode}: merged CP-003 authority is missing from discovery registry`);
      if (entry.answerKind !== base.answerKind) {
        throw new Error(`${mode}: answer kind ${entry.answerKind} is incompatible with target ${retained.targetAuthority} (${base.answerKind})`);
      }
      return [...entry.sourceCandidates];
    });

    return Object.freeze({
      authorityKey: retained.targetAuthority,
      checkpointId: "TSD-CP-003" as const,
      learnerFacing: true as const,
      answerKind: base.answerKind,
      governingRule: base.governingRule,
      underlyingSolveModes: Object.freeze(ownedModes),
      sourceCandidates: Object.freeze([...new Set(sourceCandidates)]),
      implementationStatus: "POST_OVERLAP_CANDIDATE_RUNTIME_PROVEN" as const,
      permanentQlId: null,
      englishFreezeStatus: "UNFROZEN" as const,
    });
  }),
);

export const TSD_CP003_PRIOR_REPRESENTATIONS = Object.freeze(
  TSD_CP003_POST_OVERLAP_OWNERSHIP.filter((entry) => entry.disposition === "PRIOR_CHECKPOINT_REPRESENTATION"),
);

export const TSD_CP003_REJECTED_LEARNER_AUTHORITIES = Object.freeze(
  TSD_CP003_POST_OVERLAP_OWNERSHIP.filter((entry) => entry.disposition === "REJECTED_AS_STANDALONE_LEARNER_AUTHORITY"),
);

export const TSD_POST_CP003_CANDIDATE_COUNTS = Object.freeze({
  priorLearnerAuthorities: TSD_FINAL_LEARNER_AUTHORITIES.length,
  newCp003LearnerAuthorities: TSD_CP003_NEW_AUTHORITY_CANDIDATES.length,
  totalLearnerAuthorities: TSD_FINAL_LEARNER_AUTHORITIES.length + TSD_CP003_NEW_AUTHORITY_CANDIDATES.length,
  rejectedCp003LearnerAuthorities: TSD_CP003_REJECTED_LEARNER_AUTHORITIES.length,
  priorInternalAuthorities: TSD_FINAL_INTERNAL_AUTHORITIES.length,
  cp003InternalAuthorities: TSD_CP003_INTERNAL_AUTHORITIES.length,
  totalInternalAuthorities: TSD_FINAL_INTERNAL_AUTHORITIES.length + TSD_CP003_INTERNAL_AUTHORITIES.length,
  totalMathematicalAuthorities:
    TSD_FINAL_LEARNER_AUTHORITIES.length
    + TSD_CP003_NEW_AUTHORITY_CANDIDATES.length
    + TSD_FINAL_INTERNAL_AUTHORITIES.length
    + TSD_CP003_INTERNAL_AUTHORITIES.length,
});

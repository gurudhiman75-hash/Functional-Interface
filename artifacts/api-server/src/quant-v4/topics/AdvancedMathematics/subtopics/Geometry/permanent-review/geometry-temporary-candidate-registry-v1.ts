import { GEO_PHASE1_TEMPORARY_PROTOTYPES } from "../GEO-001/discovery/phase1-registry";
import { GEO_PHASE2_TEMPORARY_PROTOTYPES } from "../GEO-001/discovery/phase2-registry";
import { GEO_PHASE3_TEMPORARY_PROTOTYPES } from "../GEO-001/discovery/phase3-registry";
import { GEO_PHASE4_TEMPORARY_PROTOTYPES } from "../GEO-002/discovery/phase4-registry";
import { GEO_PHASE5_TEMPORARY_PROTOTYPES } from "../GEO-002/discovery/phase5-registry";
import { GEO_GAP_REMEDIATION_WAVE1_PROTOTYPES } from "../source-remediation/wave1-prototypes";
import { GEO_GAP_REMEDIATION_WAVE2_PROTOTYPES } from "../source-remediation/wave2-prototypes";
import { GEO_GAP_REMEDIATION_WAVE3_PROTOTYPES } from "../source-remediation/wave3-prototypes";
import { GEO_GAP_REMEDIATION_WAVE4_PROTOTYPES } from "../source-remediation/wave4-prototypes";
import { GEO_GAP_REMEDIATION_WAVE5_PROTOTYPES } from "../source-remediation/wave5-prototypes";
import { GEO_GAP_REMEDIATION_WAVE6_PROTOTYPES } from "../source-remediation/wave6-prototypes";
import { GEO_GAP_REMEDIATION_WAVE7_PROTOTYPES } from "../source-remediation/wave7-prototypes";
import { GEO_GAP_REMEDIATION_WAVE8_PROTOTYPES } from "../source-remediation/wave8-prototypes";
import { GEO_GAP_REMEDIATION_WAVE9_PROTOTYPES } from "../source-remediation/wave9-prototypes";
import { GEO_GAP_REMEDIATION_WAVE10_PROTOTYPES } from "../source-remediation/wave10-prototypes";
import { GEO_GAP_REMEDIATION_WAVE11_PROTOTYPES } from "../source-remediation/wave11-prototypes";
import { GEO_GAP_REMEDIATION_WAVE12_PROTOTYPES } from "../source-remediation/wave12-prototypes";
import { GEO_GAP_REMEDIATION_WAVE13_PROTOTYPES } from "../source-remediation/wave13-prototypes";

export type GeometryCandidateStage =
  | "BASELINE_PHASE_1"
  | "BASELINE_PHASE_2"
  | "BASELINE_PHASE_3"
  | "BASELINE_PHASE_4"
  | "BASELINE_PHASE_5"
  | `REMEDIATION_WAVE_${number}`;

export interface GeometryTemporaryCandidateIdentity {
  readonly temporaryPrototypeId: string;
  readonly cpId: string;
  readonly solveMode: string;
  readonly stage: GeometryCandidateStage;
}

type CandidateLike = {
  readonly temporaryPrototypeId: string;
  readonly cpId: string;
  readonly solveMode: string;
};

function register(stage: GeometryCandidateStage, candidates: readonly CandidateLike[]): readonly GeometryTemporaryCandidateIdentity[] {
  return Object.freeze(candidates.map((candidate) => Object.freeze({
    temporaryPrototypeId: candidate.temporaryPrototypeId,
    cpId: candidate.cpId,
    solveMode: candidate.solveMode,
    stage,
  })));
}

const stages = Object.freeze([
  ["BASELINE_PHASE_1", GEO_PHASE1_TEMPORARY_PROTOTYPES],
  ["BASELINE_PHASE_2", GEO_PHASE2_TEMPORARY_PROTOTYPES],
  ["BASELINE_PHASE_3", GEO_PHASE3_TEMPORARY_PROTOTYPES],
  ["BASELINE_PHASE_4", GEO_PHASE4_TEMPORARY_PROTOTYPES],
  ["BASELINE_PHASE_5", GEO_PHASE5_TEMPORARY_PROTOTYPES],
  ["REMEDIATION_WAVE_1", GEO_GAP_REMEDIATION_WAVE1_PROTOTYPES],
  ["REMEDIATION_WAVE_2", GEO_GAP_REMEDIATION_WAVE2_PROTOTYPES],
  ["REMEDIATION_WAVE_3", GEO_GAP_REMEDIATION_WAVE3_PROTOTYPES],
  ["REMEDIATION_WAVE_4", GEO_GAP_REMEDIATION_WAVE4_PROTOTYPES],
  ["REMEDIATION_WAVE_5", GEO_GAP_REMEDIATION_WAVE5_PROTOTYPES],
  ["REMEDIATION_WAVE_6", GEO_GAP_REMEDIATION_WAVE6_PROTOTYPES],
  ["REMEDIATION_WAVE_7", GEO_GAP_REMEDIATION_WAVE7_PROTOTYPES],
  ["REMEDIATION_WAVE_8", GEO_GAP_REMEDIATION_WAVE8_PROTOTYPES],
  ["REMEDIATION_WAVE_9", GEO_GAP_REMEDIATION_WAVE9_PROTOTYPES],
  ["REMEDIATION_WAVE_10", GEO_GAP_REMEDIATION_WAVE10_PROTOTYPES],
  ["REMEDIATION_WAVE_11", GEO_GAP_REMEDIATION_WAVE11_PROTOTYPES],
  ["REMEDIATION_WAVE_12", GEO_GAP_REMEDIATION_WAVE12_PROTOTYPES],
  ["REMEDIATION_WAVE_13", GEO_GAP_REMEDIATION_WAVE13_PROTOTYPES],
] satisfies readonly (readonly [GeometryCandidateStage, readonly CandidateLike[]])[]);

export const GEO_TEMPORARY_CANDIDATE_REGISTRY_V1: readonly GeometryTemporaryCandidateIdentity[] = Object.freeze(
  stages.flatMap(([stage, candidates]) => register(stage, candidates)),
);

export const GEO_TEMPORARY_CANDIDATE_STAGE_COUNTS_V1 = Object.freeze(
  Object.fromEntries(stages.map(([stage, candidates]) => [stage, candidates.length])) as Readonly<Record<GeometryCandidateStage, number>>,
);

export const GEO_TEMPORARY_CANDIDATE_IDS_V1 = Object.freeze(
  GEO_TEMPORARY_CANDIDATE_REGISTRY_V1.map((candidate) => candidate.temporaryPrototypeId),
);

export const GEO_TEMPORARY_CANDIDATES_BY_CP_V1 = Object.freeze(
  GEO_TEMPORARY_CANDIDATE_REGISTRY_V1.reduce<Record<string, GeometryTemporaryCandidateIdentity[]>>((acc, candidate) => {
    (acc[candidate.cpId] ??= []).push(candidate);
    return acc;
  }, {}),
);

export const GEO_TEMPORARY_CANDIDATE_REGISTRY_STATE_V1 = Object.freeze({
  registryVersion: 1,
  totalCandidates: GEO_TEMPORARY_CANDIDATE_REGISTRY_V1.length,
  expectedTotalCandidates: 81,
  baselineCandidateCount:
    GEO_PHASE1_TEMPORARY_PROTOTYPES.length
    + GEO_PHASE2_TEMPORARY_PROTOTYPES.length
    + GEO_PHASE3_TEMPORARY_PROTOTYPES.length
    + GEO_PHASE4_TEMPORARY_PROTOTYPES.length
    + GEO_PHASE5_TEMPORARY_PROTOTYPES.length,
  remediationWave1To7CandidateCount:
    GEO_GAP_REMEDIATION_WAVE1_PROTOTYPES.length
    + GEO_GAP_REMEDIATION_WAVE2_PROTOTYPES.length
    + GEO_GAP_REMEDIATION_WAVE3_PROTOTYPES.length
    + GEO_GAP_REMEDIATION_WAVE4_PROTOTYPES.length
    + GEO_GAP_REMEDIATION_WAVE5_PROTOTYPES.length
    + GEO_GAP_REMEDIATION_WAVE6_PROTOTYPES.length
    + GEO_GAP_REMEDIATION_WAVE7_PROTOTYPES.length,
  remediationWave8To13CandidateCount:
    GEO_GAP_REMEDIATION_WAVE8_PROTOTYPES.length
    + GEO_GAP_REMEDIATION_WAVE9_PROTOTYPES.length
    + GEO_GAP_REMEDIATION_WAVE10_PROTOTYPES.length
    + GEO_GAP_REMEDIATION_WAVE11_PROTOTYPES.length
    + GEO_GAP_REMEDIATION_WAVE12_PROTOTYPES.length
    + GEO_GAP_REMEDIATION_WAVE13_PROTOTYPES.length,
  permanentQlCount: 0,
  permanentAllocationAuthorized: false,
  solveModeFreezeAuthorized: false,
  questionStudioActivationAuthorized: false,
});

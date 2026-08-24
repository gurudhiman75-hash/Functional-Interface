import type { SriCandidateDescriptor, SriDiscoveryQuestion } from "./discovery-types";
import {
  SRI_PHASE1_POWER_CANDIDATES,
  generateSriPhase1PowerCandidate,
} from "./SRI-001/phase1-power-discovery";
import {
  SRI_PHASE2_POWER_RELATION_CANDIDATES,
  generateSriPhase2PowerRelationCandidate,
} from "./SRI-001/phase2-power-relations";
import {
  SRI_PHASE3_SURD_FOUNDATION_CANDIDATES,
  generateSriPhase3SurdFoundationCandidate,
} from "./SRI-002/phase3-surd-foundations";
import {
  SRI_PHASE4_SURD_ADVANCED_CANDIDATES,
  generateSriPhase4SurdAdvancedCandidate,
} from "./SRI-002/phase4-surd-advanced";

export const SRI_ALL_EXECUTABLE_DISCOVERY_CANDIDATES: readonly SriCandidateDescriptor[] = [
  ...SRI_PHASE1_POWER_CANDIDATES,
  ...SRI_PHASE2_POWER_RELATION_CANDIDATES,
  ...SRI_PHASE3_SURD_FOUNDATION_CANDIDATES,
  ...SRI_PHASE4_SURD_ADVANCED_CANDIDATES,
];

export function generateSriExecutableDiscoveryCandidate(candidateId: string, seed: string): SriDiscoveryQuestion {
  const checkpointNumber = Number(/^C(\d{3})-/.exec(candidateId)?.[1]);
  if (!Number.isInteger(checkpointNumber) || checkpointNumber < 1 || checkpointNumber > 12) {
    throw new Error(`Unknown SRI executable discovery candidate: ${candidateId}`);
  }
  if (checkpointNumber <= 3) return generateSriPhase1PowerCandidate(candidateId, seed);
  if (checkpointNumber <= 6) return generateSriPhase2PowerRelationCandidate(candidateId, seed);
  if (checkpointNumber <= 9) return generateSriPhase3SurdFoundationCandidate(candidateId, seed);
  return generateSriPhase4SurdAdvancedCandidate(candidateId, seed);
}

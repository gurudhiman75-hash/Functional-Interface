import { SRI_CP004_CANDIDATES, generateSriCp004Candidate } from "./cp004-discovery";
import { SRI_CP005_CANDIDATES, generateSriCp005Candidate } from "./cp005-discovery";
import { SRI_CP006_CANDIDATES, generateSriCp006Candidate } from "./cp006-discovery";
import type { SriCandidateDescriptor, SriDiscoveryQuestion } from "../discovery-types";

export const SRI_PHASE2_POWER_RELATION_CANDIDATES: readonly SriCandidateDescriptor[] = [
  ...SRI_CP004_CANDIDATES,
  ...SRI_CP005_CANDIDATES,
  ...SRI_CP006_CANDIDATES,
];

export function generateSriPhase2PowerRelationCandidate(candidateId: string, seed: string): SriDiscoveryQuestion {
  if (candidateId.startsWith("C004-")) return generateSriCp004Candidate(candidateId, seed);
  if (candidateId.startsWith("C005-")) return generateSriCp005Candidate(candidateId, seed);
  if (candidateId.startsWith("C006-")) return generateSriCp006Candidate(candidateId, seed);
  throw new Error(`Candidate ${candidateId} is not part of SRI Phase 2 power relations.`);
}

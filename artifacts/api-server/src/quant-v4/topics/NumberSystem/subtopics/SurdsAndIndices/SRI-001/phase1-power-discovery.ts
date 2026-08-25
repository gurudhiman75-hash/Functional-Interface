import { SRI_CP001_CANDIDATES, generateSriCp001Candidate } from "./cp001-discovery";
import { SRI_CP002_CANDIDATES, generateSriCp002Candidate } from "./cp002-discovery";
import { SRI_CP003_CANDIDATES, generateSriCp003Candidate } from "./cp003-discovery";
import type { SriCandidateDescriptor, SriDiscoveryQuestion } from "../discovery-types";

export const SRI_PHASE1_POWER_CANDIDATES: readonly SriCandidateDescriptor[] = [
  ...SRI_CP001_CANDIDATES,
  ...SRI_CP002_CANDIDATES,
  ...SRI_CP003_CANDIDATES,
];

export function generateSriPhase1PowerCandidate(candidateId: string, seed: string): SriDiscoveryQuestion {
  if (candidateId.startsWith("C001-")) return generateSriCp001Candidate(candidateId, seed);
  if (candidateId.startsWith("C002-")) return generateSriCp002Candidate(candidateId, seed);
  if (candidateId.startsWith("C003-")) return generateSriCp003Candidate(candidateId, seed);
  throw new Error(`Candidate ${candidateId} is not part of SRI Phase 1 power foundations.`);
}

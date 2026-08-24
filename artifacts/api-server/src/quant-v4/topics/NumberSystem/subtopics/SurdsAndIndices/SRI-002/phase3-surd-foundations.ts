import { SRI_CP007_CANDIDATES, generateSriCp007Candidate } from "./cp007-discovery";
import { SRI_CP008_CANDIDATES, generateSriCp008Candidate } from "./cp008-discovery";
import { SRI_CP009_CANDIDATES, generateSriCp009Candidate } from "./cp009-discovery";
import type { SriCandidateDescriptor, SriDiscoveryQuestion } from "../discovery-types";

export const SRI_PHASE3_SURD_FOUNDATION_CANDIDATES: readonly SriCandidateDescriptor[] = [
  ...SRI_CP007_CANDIDATES,
  ...SRI_CP008_CANDIDATES,
  ...SRI_CP009_CANDIDATES,
];

export function generateSriPhase3SurdFoundationCandidate(candidateId: string, seed: string): SriDiscoveryQuestion {
  if (candidateId.startsWith("C007-")) return generateSriCp007Candidate(candidateId, seed);
  if (candidateId.startsWith("C008-")) return generateSriCp008Candidate(candidateId, seed);
  if (candidateId.startsWith("C009-")) return generateSriCp009Candidate(candidateId, seed);
  throw new Error(`Candidate ${candidateId} is not part of SRI Phase 3 surd foundations.`);
}

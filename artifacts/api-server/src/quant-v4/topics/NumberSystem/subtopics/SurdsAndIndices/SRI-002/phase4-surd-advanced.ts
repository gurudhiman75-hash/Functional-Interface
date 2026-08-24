import { SRI_CP010_CANDIDATES, generateSriCp010Candidate } from "./cp010-discovery";
import { SRI_CP011_CANDIDATES, generateSriCp011Candidate } from "./cp011-discovery";
import { SRI_CP012_CANDIDATES, generateSriCp012Candidate } from "./cp012-discovery";
import type { SriCandidateDescriptor, SriDiscoveryQuestion } from "../discovery-types";

export const SRI_PHASE4_SURD_ADVANCED_CANDIDATES: readonly SriCandidateDescriptor[] = [
  ...SRI_CP010_CANDIDATES,
  ...SRI_CP011_CANDIDATES,
  ...SRI_CP012_CANDIDATES,
];

export function generateSriPhase4SurdAdvancedCandidate(candidateId: string, seed: string): SriDiscoveryQuestion {
  if (candidateId.startsWith("C010-")) return generateSriCp010Candidate(candidateId, seed);
  if (candidateId.startsWith("C011-")) return generateSriCp011Candidate(candidateId, seed);
  if (candidateId.startsWith("C012-")) return generateSriCp012Candidate(candidateId, seed);
  throw new Error(`Candidate ${candidateId} is not part of SRI Phase 4 advanced surds.`);
}

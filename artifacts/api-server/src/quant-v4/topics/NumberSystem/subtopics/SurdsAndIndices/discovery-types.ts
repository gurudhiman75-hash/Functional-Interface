import type { SriProofEvent } from "../../../../shared/surds-indices";

export type SriCheckpointId =
  | "SRI-CP-001" | "SRI-CP-002" | "SRI-CP-003" | "SRI-CP-004" | "SRI-CP-005" | "SRI-CP-006"
  | "SRI-CP-007" | "SRI-CP-008" | "SRI-CP-009" | "SRI-CP-010" | "SRI-CP-011" | "SRI-CP-012";

export interface SriCandidateAnswer {
  readonly text: string;
  readonly canonicalKey: string;
}

export interface SriCandidateOption extends SriCandidateAnswer {
  readonly misconceptionId: string | null;
}

export interface SriHumanExplanation {
  readonly given: string;
  readonly asked: string;
  readonly method: string;
  readonly working: readonly string[];
  readonly answer: string;
}

export interface SriDiscoveryQuestion {
  readonly status: "PROVISIONAL_DISCOVERY";
  readonly packageId: "SRI-001" | "SRI-002";
  readonly checkpointId: SriCheckpointId;
  readonly candidateId: string;
  readonly seed: string;
  readonly state: Readonly<Record<string, string | number | boolean>>;
  readonly stem: string;
  readonly answer: SriCandidateAnswer;
  readonly options: readonly [SriCandidateOption, SriCandidateOption, SriCandidateOption, SriCandidateOption];
  readonly correctIndex: 0 | 1 | 2 | 3;
  readonly explanation: SriHumanExplanation;
  readonly proofEvents: readonly SriProofEvent[];
  readonly verification: {
    readonly canonicalSolverKey: string;
    readonly independentVerifierKey: string;
    readonly solverVerifierAgree: boolean;
    readonly exactlyOneCorrectOption: boolean;
    readonly deterministic: true;
    readonly domainValid: boolean;
  };
}

export interface SriCandidateDescriptor {
  readonly candidateId: string;
  readonly checkpointId: SriCheckpointId;
  readonly title: string;
  readonly sourceDisposition: "KEEP" | "EXPAND" | "NEW" | "SOURCE_GATED";
}

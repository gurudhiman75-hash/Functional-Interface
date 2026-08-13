import type { ComparisonRelation } from "../foundation/types";
import type { IneCp006CodeMap } from "../INE-CP-006/types";

export type IneCp007PrototypeId =
  | "INE-CP007-PROT-MISSING-OPERATOR"
  | "INE-CP007-PROT-SELECT-EXPRESSION"
  | "INE-CP007-PROT-RECOVER-MAP"
  | "INE-CP007-PROT-CONSISTENT-MAP";

export type IneCp007AuthorityId =
  | "COMPLETE_MISSING_CODED_OPERATOR"
  | "SELECT_CODED_EXPRESSION_FOR_RELATION"
  | "RECOVER_MISSING_MAP_ENTRY"
  | "IDENTIFY_ONLY_CONSISTENT_CODE_MAP";

export type IneCp007TaskKind =
  | "MISSING_OPERATOR"
  | "SELECT_EXPRESSION"
  | "RECOVER_MAP"
  | "CONSISTENT_MAP";

export interface IneCp007Scenario {
  taskKind: IneCp007TaskKind;
  codeMap: IneCp006CodeMap;
  targetRelation: ComparisonRelation;
  evidence: readonly string[];
  codeKey: readonly string[];
  candidateRelations: readonly ComparisonRelation[];
}

export interface IneCp007Option {
  value: string;
  isCorrect: boolean;
  relation?: ComparisonRelation;
  errorLabel?: string;
}

export interface GeneratedIneCp007Question {
  recordId: string;
  packageId: "INE-001";
  checkpointId: "INE-CP-007";
  prototypeId: IneCp007PrototypeId;
  authorityId: IneCp007AuthorityId;
  permanentQlId: null;
  prototypeOnly: true;
  publiclyPublishable: false;
  questionStudioVisible: false;
  seed: number;
  locale: "en-IN";
  difficulty: "MEDIUM" | "HARD";
  stem: string;
  displayedCodeKey: readonly string[];
  displayedEvidence: readonly string[];
  options: readonly IneCp007Option[];
  correctIndex: number;
  explanation: string;
  structuredScenario: IneCp007Scenario;
  metadata: {
    runtimeVersion: "ine-cp007-prototype-v1";
    reviewStatus: "PENDING_MANUAL_REVIEW";
    deliveryProfile: "EXAM_PRACTICE_PROTOTYPE" | "GUIDED_DISCOVERY";
    examApplicability:
      | "BANKING_REGULATORY_PRACTICE_ONLY"
      | "GUIDED_CONCEPT_ONLY";
    localeReadiness: "ENGLISH_ONLY";
    releaseGate: "MANUAL_REVIEW_REQUIRED";
    contentHash: string;
    sourceLedgerIds: readonly string[];
    independentSolverAgreed: true;
  };
}

export interface IneCp007ValidationResult {
  valid: boolean;
  errors: readonly string[];
}

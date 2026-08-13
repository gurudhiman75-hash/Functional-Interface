import type {
  ComparisonConstraint,
  ComparisonRelation,
  ConclusionTruth,
} from "../foundation/types";

export type IneCp008PrototypeId =
  | "INE-CP008-PROT-SELECT-STATEMENT-SET"
  | "INE-CP008-PROT-CONTRADICTORY-ADDITION"
  | "INE-CP008-PROT-RECONSTRUCT-RELATION"
  | "INE-CP008-PROT-POSSIBLE-CONCLUSION";

export type IneCp008AuthorityId =
  | "SELECT_SET_ESTABLISHING_RELATION"
  | "IDENTIFY_CONTRADICTORY_ADDITION"
  | "RECONSTRUCT_MISSING_RELATION"
  | "SELECT_POSSIBLE_NOT_DEFINITE_CONCLUSION";

export type IneCp008TaskKind =
  | "SELECT_STATEMENT_SET"
  | "CONTRADICTORY_ADDITION"
  | "RECONSTRUCT_RELATION"
  | "POSSIBLE_CONCLUSION";

export interface IneCp008Option {
  value: string;
  isCorrect: boolean;
  errorLabel?: string;
  statementSet?: readonly ComparisonConstraint[];
  statement?: ComparisonConstraint;
  relation?: ComparisonRelation;
  conclusion?: ComparisonConstraint;
  conclusionTruth?: ConclusionTruth;
}

export interface IneCp008Scenario {
  taskKind: IneCp008TaskKind;
  topologyId: string;
  entityNames: Readonly<Record<string, string>>;
  baseStatements: readonly ComparisonConstraint[];
  targetConclusion?: ComparisonConstraint;
  query?: { leftId: string; rightId: string };
}

export interface GeneratedIneCp008Question {
  recordId: string;
  packageId: "INE-001";
  checkpointId: "INE-CP-008";
  prototypeId: IneCp008PrototypeId;
  authorityId: IneCp008AuthorityId;
  permanentQlId: null;
  prototypeOnly: true;
  publiclyPublishable: false;
  questionStudioVisible: false;
  seed: number;
  locale: "en-IN";
  difficulty: "HARD";
  stem: string;
  displayedStatements: readonly string[];
  options: readonly IneCp008Option[];
  correctIndex: number;
  explanation: string;
  structuredScenario: IneCp008Scenario;
  metadata: {
    runtimeVersion: "ine-cp008-prototype-v1";
    reviewStatus: "PENDING_MANUAL_REVIEW";
    deliveryProfile: "EXAM_PRACTICE_PROTOTYPE" | "GUIDED_ADVANCED_PROTOTYPE";
    examApplicability:
      | "BANKING_REGULATORY_PRACTICE_ONLY"
      | "GUIDED_CONCEPT_ONLY";
    localeReadiness: "ENGLISH_ONLY";
    releaseGate: "MANUAL_REVIEW_REQUIRED";
    topologyId: string;
    sourceLedgerIds: readonly string[];
    contentHash: string;
    independentSolverAgreed: true;
  };
}

export interface IneCp008ValidationResult {
  valid: boolean;
  errors: readonly string[];
}

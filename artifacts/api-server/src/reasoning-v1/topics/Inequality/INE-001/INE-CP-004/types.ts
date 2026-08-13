import type {
  AtomicOrder,
  ComparisonConstraint,
  ConclusionTruth,
} from "../foundation/types";
import type { IneCp001Explanation } from "../INE-CP-001/types";

export type IneCp004PrototypeId =
  | "INE-CP004-PROT-CLASSIFY-COMPLEMENTARY-PAIR"
  | "INE-CP004-PROT-IDENTIFY-COMPLEMENTARY-PAIR"
  | "INE-CP004-PROT-RESOLVE-EITHER-OR-CONCLUSIONS"
  | "INE-CP004-PROT-DEFINITE-PLUS-EITHER-OR";

export type IneCp004AuthorityId =
  | "CLASSIFY_COMPLEMENTARY_PAIR"
  | "IDENTIFY_COMPLEMENTARY_PAIR"
  | "RESOLVE_EITHER_OR_CONCLUSIONS"
  | "RESOLVE_DEFINITE_PLUS_EITHER_OR";

export type IneCp004TaskKind =
  | "CLASSIFY_PAIR"
  | "SELECT_PAIR"
  | "EVALUATE_TWO_CONCLUSIONS"
  | "EVALUATE_THREE_CONCLUSIONS";

export type IneCp004PairStatus =
  | "VALID_EITHER_OR"
  | "NOT_EXHAUSTIVE"
  | "NOT_EXCLUSIVE";

export type IneCp004PairResponse = IneCp004PairStatus | "CANNOT_DETERMINE";

export type IneCp004TwoConclusionMask =
  | "ONLY_I"
  | "ONLY_II"
  | "EITHER_I_OR_II"
  | "NEITHER"
  | "BOTH";

export type IneCp004ThreeConclusionMask =
  | "ONLY_I"
  | "EITHER_II_OR_III"
  | "I_AND_EITHER_II_OR_III"
  | "NONE";

export interface IneCp004ConclusionPair {
  first: ComparisonConstraint;
  second: ComparisonConstraint;
}

export interface IneCp004ComplementEvidence {
  sameCanonicalPair: boolean;
  consistent: boolean;
  validAtomicRelations: readonly AtomicOrder[];
  firstSatisfyingRelations: readonly AtomicOrder[];
  secondSatisfyingRelations: readonly AtomicOrder[];
  firstDefinitelyTrue: boolean;
  secondDefinitelyTrue: boolean;
  mutuallyExclusive: boolean;
  jointlyExhaustive: boolean;
  validEitherOr: boolean;
  status?: IneCp004PairStatus;
}

export interface IneCp004Scenario {
  scenarioId: string;
  topologyId: string;
  taskKind: IneCp004TaskKind;
  statements: readonly ComparisonConstraint[];
  conclusions: readonly ComparisonConstraint[];
  candidatePairs?: readonly IneCp004ConclusionPair[];
  expectedPairStatus?: IneCp004PairStatus;
  entityNames: Readonly<Record<string, string>>;
}

export interface IneCp004Option {
  value: string;
  isCorrect: boolean;
  errorLabel?: string;
  pairStatus?: IneCp004PairResponse;
  candidatePairIndex?: number;
  twoConclusionMask?: IneCp004TwoConclusionMask;
  threeConclusionMask?: IneCp004ThreeConclusionMask;
}

export interface GeneratedIneCp004Question {
  recordId: string;
  packageId: "INE-001";
  checkpointId: "INE-CP-004";
  prototypeId: IneCp004PrototypeId;
  authorityId: IneCp004AuthorityId;
  permanentQlId: null;
  prototypeOnly: true;
  publiclyPublishable: false;
  questionStudioVisible: false;
  seed: number;
  locale: "en-IN";
  difficulty: "MEDIUM" | "HARD";
  renderer: "STRUCTURED_TEXT";
  answerType:
    | "COMPLEMENTARY_PAIR_STATUS"
    | "COMPLEMENTARY_PAIR_SELECTION"
    | "TWO_CONCLUSION_MASK"
    | "THREE_CONCLUSION_MASK";
  stem: string;
  displayedStatements: readonly string[];
  displayedConclusions?: readonly string[];
  structuredScenario: IneCp004Scenario;
  options: readonly IneCp004Option[];
  correctIndex: number;
  explanation: IneCp001Explanation;
  solutions: { mock: string; learning: IneCp001Explanation };
  metadata: {
    runtimeVersion: "ine-cp004-prototype-v3";
    competency: "COMPLEMENTARY_EXHAUSTIVENESS_REASONING";
    reviewStatus: "CHECKPOINT_ACCEPTED";
    mockAssemblyPolicy: "MIX_WITH_CP003_NON_COMPLEMENTARY_OUTCOMES";
    deliveryProfile: "GUIDED_CONCEPT" | "BANKING_MOCK_PROTOTYPE";
    topologyId: string;
    structuralFingerprint: string;
    taskKind: IneCp004TaskKind;
    statementCount: number;
    conclusionCount: number;
    nodeCount: number;
    conclusionTruths: readonly ConclusionTruth[];
    complementaryEvidence: readonly IneCp004ComplementEvidence[];
    contentHash: string;
    independentSolverAgreed: true;
    graphConsistent: true;
    distractorErrorLabels: readonly string[];
    sourceLedgerIds: readonly string[];
  };
}

export interface IneCp004ValidationResult {
  valid: boolean;
  errors: readonly string[];
}

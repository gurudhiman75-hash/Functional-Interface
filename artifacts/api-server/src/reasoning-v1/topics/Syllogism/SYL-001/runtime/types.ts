import type {
  CanonicalConclusion,
  CanonicalModel,
  PrimitiveConstraint,
  ConclusionTruthProfile,
  InternalConclusionClass,
  SurfacePremise,
  SurfacePremiseForm,
  SylDifficulty,
  SylLocale,
  TermId,
} from "../foundation/types";

export type SylCheckpointId =
  | "SYL-CP-001"
  | "SYL-CP-002"
  | "SYL-CP-003"
  | "SYL-CP-004"
  | "SYL-CP-005"
  | "SYL-CP-006"
  | "SYL-CP-007";

export type SylQlId =
  | "SYL-QL-001"
  | "SYL-QL-002"
  | "SYL-QL-003"
  | "SYL-QL-004"
  | "SYL-QL-005"
  | "SYL-QL-006"
  | "SYL-QL-007"
  | "SYL-QL-008"
  | "SYL-QL-009"
  | "SYL-QL-010"
  | "SYL-QL-011"
  | "SYL-QL-012"
  | "SYL-QL-013"
  | "SYL-QL-014"
  | "SYL-QL-015"
  | "SYL-QL-016"
  | "SYL-QL-017"
  | "SYL-QL-018";

export type SylTaskKind =
  | "SELECT_DEFINITE_CONCLUSION"
  | "SELECT_NON_FOLLOWING_CONCLUSION"
  | "TWO_CONCLUSION_FOLLOW_MASK"
  | "THREE_CONCLUSION_FOLLOW_MASK"
  | "SELECT_GENUINE_POSSIBILITY"
  | "SELECT_IMPOSSIBLE_CONCLUSION"
  | "CLASSIFY_CONCLUSION_MODALITY"
  | "TWO_CONCLUSION_EITHER_OR"
  | "CLASSIFY_CONCLUSION_PAIR"
  | "ONLY_SELECT_DEFINITE_CONCLUSION"
  | "ONLY_TWO_CONCLUSION_MASK"
  | "ONLY_MODAL_CLASSIFICATION"
  | "FEW_SELECT_DEFINITE_CONCLUSION"
  | "FEW_MODAL_CLASSIFICATION"
  | "FEW_TWO_CONCLUSION_MASK"
  | "MIXED_TWO_CONCLUSION_MASK"
  | "MIXED_THREE_CONCLUSION_MASK"
  | "MIXED_MODAL_CLASSIFICATION";

export type SylScenarioGroup = "CORE" | "ONLY" | "FEW" | "MIXED";
export type SylTopology = "LINEAR" | "BRANCHING" | "CONVERGING" | "MIXED";

export interface SourcePatternAuthority {
  sourcePatternId: string;
  examProfile: "SSC" | "BANKING" | "PUNJAB" | "CROSS_EXAM";
  forms: readonly SurfacePremiseForm[];
  tasks: readonly string[];
  status: "VERIFIED";
  evidenceUrls: readonly string[];
  note: string;
}

export interface ScenarioPremiseSpec {
  form: SurfacePremiseForm;
  subject: TermId;
  predicate: TermId;
}

export interface SylScenarioSpec {
  scenarioId: string;
  group: SylScenarioGroup;
  sourcePatternId: string;
  topology: SylTopology;
  baseDifficulty: SylDifficulty;
  premises: readonly ScenarioPremiseSpec[];
}

export interface SylQlDefinition {
  qlId: SylQlId;
  checkpointId: SylCheckpointId;
  taskKind: SylTaskKind;
  scenarioGroup: SylScenarioGroup;
  optionCount: 3 | 4 | 5;
  renderer: "STATEMENT_OPTIONS" | "CONCLUSION_COMBINATION" | "MODAL_CLASSIFICATION" | "PAIR_CLASSIFICATION";
  sourcePatternIds: readonly string[];
  status: "IMPLEMENTED_MULTILINGUAL_REVIEW_RUNTIME";
  answerTemplateId:
    | "DIAGNOSTIC_THREE_OPTION_V1"
    | "SSC_FOUR_OPTION_V1"
    | "BANK_FOUR_OPTION_V1"
    | "BANK_FIVE_OPTION_V1"
    | "CROSS_EXAM_FOUR_OPTION_V1";
}

export interface CategoryTerm {
  termKey: string;
  labels: Readonly<Record<SylLocale, string>>;
  singularLabels: Readonly<Record<SylLocale, string>>;
  paGender: "M" | "F";
}

export interface EvaluatedConclusion {
  conclusion: CanonicalConclusion;
  profile: ConclusionTruthProfile;
  impactPremiseIds: readonly string[];
  verdictImpactPremiseIds: readonly string[];
}

export type PairSemanticStatus =
  | "ONLY_FIRST_FOLLOWS"
  | "ONLY_SECOND_FOLLOWS"
  | "BOTH_FOLLOW"
  | "NEITHER_FOLLOWS"
  | "EITHER_OR_FOLLOWS";

export type PairClassificationStatus =
  | "EITHER_OR"
  | "BOTH_FOLLOW"
  | "ONLY_FIRST_FOLLOWS"
  | "ONLY_SECOND_FOLLOWS"
  | "NO_COMPLEMENTARY_RELATION";

export type ModalAnswer =
  | "DEFINITELY_TRUE"
  | "POSSIBLY_TRUE_NOT_DEFINITE"
  | "IMPOSSIBLE"
  | "PREMISES_INCONSISTENT";

export interface ScenarioAnalysis {
  scenario: SylScenarioSpec;
  premises: readonly SurfacePremise[];
  termOrder: readonly TermId[];
  candidates: readonly EvaluatedConclusion[];
}

export interface GeneratedSylOption {
  optionId: string;
  semanticValue: string;
  text: string;
  isCorrect: boolean;
  errorLabel: string | null;
}

export interface SylConclusionReview {
  label: string;
  conclusion: CanonicalConclusion;
  rendered: string;
  classification: InternalConclusionClass;
  canBeTrue: boolean;
  canBeFalse: boolean;
  witnessModel: CanonicalModel | null;
  counterModel: CanonicalModel | null;
}

export type PedagogicalVerdict =
  | "DEFINITELY_FOLLOWS"
  | "IMPOSSIBLE"
  | "POSSIBILITY_ONLY";

export interface SylPremiseTeachingPoint {
  premiseId: string;
  statement: string;
  naturalRule: string;
  compactRule: string;
}

export interface SylConclusionTeachingStep {
  label: string;
  conclusion: string;
  verdict: PedagogicalVerdict;
  verdictLabel: string;
  reasoning: string;
  supportingPremiseIds: readonly string[];
}

export interface SylExplanationTierOne {
  heading: string;
  coreRule: string;
  premiseBreakdown: readonly SylPremiseTeachingPoint[];
}

export interface SylExplanationTierTwo {
  heading: string;
  conclusionSteps: readonly SylConclusionTeachingStep[];
  combinationSummary: string | null;
}

export interface SylExplanationTierThree {
  heading: string;
  shortcut: string;
  application: string;
}

export interface SylExplanationTierFour {
  heading: string;
  studentWarning: string;
  diagnosticTag: string;
}

export type SylDiagramRole =
  | "FORCED_FACTS"
  | "POSSIBILITY_COMPARISON"
  | "IMPOSSIBILITY_CONFLICT"
  | "EITHER_OR_ALTERNATIVES";

export type SylDiagramMode =
  | "RELATION_CARDS"
  | "FORCED_WITH_FOCUS"
  | "TRUE_FALSE_COMPARISON"
  | "FORCED_AND_TRUE_FALSE_COMPARISON"
  | "EITHER_OR_COMPARISON";

export interface SylExplanationTrace {
  schemaVersion: "syl-pedagogy-v2";
  tier1Concept: SylExplanationTierOne;
  tier2StepByStep: SylExplanationTierTwo;
  tier3Shortcut: SylExplanationTierThree;
  tier4Trap: SylExplanationTierFour;
  finalAnswer: string;
  diagramRole: SylDiagramRole;
  diagramMode: SylDiagramMode;
  diagramTitle: string;
  diagramCaption: string;
  overlappingVennSvg: string;
}

export interface GeneratedSylQuestion {
  packageId: "SYL-001";
  checkpointId: SylCheckpointId;
  qlId: SylQlId;
  permanentQlId: SylQlId;
  seed: number;
  locale: SylLocale;
  difficulty: SylDifficulty;
  renderer: SylQlDefinition["renderer"];
  answerType: "CONCLUSION_TEXT" | "FOLLOW_MASK" | "MODAL_LABEL" | "PAIR_STATUS";
  semanticsProfileId: "INDIAN_COMPETITIVE_EXAM_SYLLOGISM_V1";
  sourcePatternId: string;
  scenarioId: string;
  stem: string;
  structuredPrompt: {
    premises: readonly SurfacePremise[];
    conclusions: readonly CanonicalConclusion[];
    termKeysById: Readonly<Record<TermId, string>>;
    normalizedConstraints: readonly PrimitiveConstraint[];
  };
  reviewLogic: {
    conclusionEvaluations: readonly {
      conclusionId: string;
      classification: InternalConclusionClass;
      canBeTrue: boolean;
      canBeFalse: boolean;
      verdictImpactPremiseIds: readonly string[];
      modelImpactPremiseIds: readonly string[];
    }[];
  };
  statements: readonly string[];
  conclusions: readonly string[];
  options: readonly GeneratedSylOption[];
  correctIndex: number;
  explanation: SylExplanationTrace;
  metadata: {
    runtimeVersion: "syl-001-pedagogy-runtime-v2";
    taskKind: SylTaskKind;
    topology: SylTopology;
    premiseForms: readonly SurfacePremiseForm[];
    termKeys: readonly string[];
    selectedConclusionClasses: readonly InternalConclusionClass[];
    followMask: number | null;
    pairStatus: PairSemanticStatus | PairClassificationStatus | null;
    optionCount: 3 | 4 | 5;
    answerTemplateId: SylQlDefinition["answerTemplateId"];
    solverAgreementPassed: true;
    premiseRelevancePassed: true;
    ambiguityAuditPassed: true;
    deterministic: true;
    studentExplanationNaturalized: true;
    overlappingDiagramValidated: true;
    localePedagogyParityPassed: true;
    questionStudioVisible: false;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
  };
}

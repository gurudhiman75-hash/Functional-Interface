import type {
  MalDifficulty,
  MalReasoningGraph,
  MalTaskDirection,
} from "./types";
import type { MalCp002Context } from "./cp002-context-library";
import type {
  MalCp002AnswerSemantic,
  MalCp002ExecutablePrototypeId,
  MalCp002SolveResult,
  MalCp002VerificationResult,
} from "./cp002-types";
import type { MalCp002GeneratedParameters } from "./cp002-parameter-generator";

export type MalCp002MisconceptionId =
  | "CORRECT"
  | "UNCHANGED_COMPONENT_ALTERED"
  | "TARGET_QUANTITY_REPORTED"
  | "INITIAL_CHANGED_QUANTITY_REPORTED"
  | "ADJUSTMENT_DIRECTION_REVERSED"
  | "RATIO_REVERSED"
  | "RATIO_NOT_UPDATED"
  | "OPERATION_NOT_UNDONE"
  | "TOTAL_USED_AS_ONE_PART"
  | "EQUAL_SPLIT_ASSUMED"
  | "COMPONENTS_SWAPPED"
  | "PURE_REMOVAL_ASSUMED"
  | "REMOVED_SAMPLE_TREATED_AS_REPLACEMENT_COMPONENT"
  | "RETENTION_FACTOR_REVERSED"
  | "PLAUSIBLE_ARITHMETIC_SLIP";

export interface MalCp002OptionAudit {
  text: string;
  canonicalKey: string;
  misconceptionId: MalCp002MisconceptionId;
  isCorrect: boolean;
}

export interface MalCp002Explanation {
  layoutId: "MAL-CP002-EN-FORMULA-FIRST-DISCOVERY-V1";
  sectionTitles: {
    coreConcept: "📌 Core Concept & Formula";
    steps: "📝 Step-by-Step Solution";
    shortcut: "⚡ 10-Second Exam Shortcut";
    trap: "⚠️ Common Trap & Mistake Warning";
  };
  coreConcept: string;
  formula: string;
  steps: string[];
  verification: string;
  conclusion: string;
  examShortcut: string;
  commonTrap: string;
}

export interface MalCp002RatioAdjustmentDiagram {
  type: "RATIO_ADJUSTMENT";
  title: string;
  componentALabel: string;
  componentBLabel: string;
  quantityUnit: string;
  before: {
    componentA: string;
    componentB: string;
    ratio: string;
  };
  operation: {
    stage: "PURE_COMPONENT_CHANGE" | "HOMOGENEOUS_REMOVE_REFILL" | "PARTITION";
    label: string;
    changedComponentLabel?: string;
    quantity?: string;
  };
  after: {
    componentA: string;
    componentB: string;
    ratio: string;
  };
  targetRatio?: string;
}

export interface MalCp002GeneratedPrototype {
  archetypeId: "MAL-001";
  canonicalProblemId: "MAL-CP-002";
  prototypeId: MalCp002ExecutablePrototypeId;
  permanentQlId: null;
  questionLanguageId: string;
  language: "en";
  seed: string;
  context: MalCp002Context;
  difficulty: MalDifficulty;
  taskDirection: MalTaskDirection;
  answerSemantic: MalCp002AnswerSemantic;
  stem: string;
  parameters: MalCp002GeneratedParameters;
  solution: MalCp002SolveResult;
  answer: string;
  options: string[];
  optionAudit: MalCp002OptionAudit[];
  correctIndex: number;
  explanation: MalCp002Explanation;
  reasoningGraph: MalReasoningGraph;
  diagram: MalCp002RatioAdjustmentDiagram;
  mathematicalFingerprint: string;
  validation: MalCp002VerificationResult & {
    optionErrors: string[];
    authoringErrors: string[];
  };
  maturity: "DISCOVERY_PROTOTYPE";
  allocationStatus: "UNALLOCATED_OPEN_DISCOVERY";
  active: false;
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
  questionBankWritable: false;
  testEligible: false;
}

import type { Rational } from "./types";
import type {
  MalCp005AnswerSemantic,
  MalCp005DiscoveryPrototypeId,
  MalCp005OptionAudit,
  MalCp005SolveRequest,
  MalCp005SolveResult,
  MalCp005TaskDirection,
} from "./cp005-types";

export const MAL_CP005_EXAM_READY_V2_RUNTIME_ID =
  "MAL-CP005-EN-EXAM-READY-REVIEW-V2" as const;
export const MAL_CP005_EXAM_READY_V2_PRESENTATION_ID =
  "MAL-CP005-EN-SOLUTION-FIRST-PRESENTATION-V2" as const;
export const MAL_CP005_EXAM_READY_V2_ALLIGATION_ID =
  "MAL-CP005-EN-SELECTIVE-ALLIGATION-SVG-V2" as const;

export interface MalCp005AlligationVisualV2 {
  version: 1;
  kind: "cross";
  title: string;
  lower: { label: string; value: string; quantity?: string };
  higher: { label: string; value: string; quantity?: string };
  mean: { label: string; value: string };
  lowerPart: { label: string; value: string; expression: string };
  higherPart: { label: string; value: string; expression: string };
}

export interface MalCp005AlligationHelpV2 {
  methodId: typeof MAL_CP005_EXAM_READY_V2_ALLIGATION_ID;
  title: "Alternative method: Alligation cross";
  directive: string;
  visual: MalCp005AlligationVisualV2;
  ratioLabel: string;
  ratio: string;
  calculation: string;
  result: string;
}

export interface MalCp005NumberProvenanceV2 {
  stemFacts: string[];
  permittedAssumptions: string[];
  derivedFacts: string[];
  hiddenStateKeys: string[];
}

export interface MalCp005ExamReadyQuestionV2 {
  archetypeId: "MAL-001";
  canonicalProblemId: "MAL-CP-005";
  runtimeId: typeof MAL_CP005_EXAM_READY_V2_RUNTIME_ID;
  presentationId: typeof MAL_CP005_EXAM_READY_V2_PRESENTATION_ID;
  prototypeId: MalCp005DiscoveryPrototypeId;
  permanentQlId: null;
  questionLanguageId: string;
  questionId: string;
  language: "en";
  requestedSeed: string;
  selectedSeed: string;
  selectionAttempt: number;
  stateKey: string;
  siblingStateKey: string;
  difficulty: "Easy" | "Medium";
  taskDirection: MalCp005TaskDirection;
  answerSemantic: MalCp005AnswerSemantic;
  sourceEvidenceIds: readonly string[];
  sourceEvidenceStatus:
    "REFERENCE_AND_LEGACY_RECOVERED_PENDING_FIXTURE_NORMALIZATION";
  request: MalCp005SolveRequest;
  solution: MalCp005SolveResult;
  exactState: Record<string, Rational | string>;
  stem: string;
  answer: string;
  options: string[];
  correctIndex: number;
  optionAudit: MalCp005OptionAudit[];
  explanation: {
    layoutId: "MAL-CP005-EN-SOLUTION-FIRST-V2";
    visibleLines: string[];
    answerLine: string;
    optionalHelp: {
      commonMistake: string;
      verification?: string[];
      alternativeMethod?: MalCp005AlligationHelpV2;
    };
  };
  numberProvenance: MalCp005NumberProvenanceV2;
  validation: {
    ok: boolean;
    errors: string[];
    checks: Array<{ name: string; passed: boolean; message: string }>;
  };
  maturity: "EXAM_READY_REVIEW_CANDIDATE";
  allocationStatus: "UNALLOCATED_OPEN_DISCOVERY";
  reviewStatus: "PENDING_PRODUCT_REVIEW" | "PRODUCT_REVIEW_APPROVED";
  runtimeMode: "REVIEW_ONLY";
  active: false;
  publiclyPublishable: false;
  questionStudioDiscoverable: true;
  questionBankWritable: false;
  testEligible: false;
}

export interface MalCp005ExamSetSelectionResultV2 {
  accepted: MalCp005ExamReadyQuestionV2[];
  rejected: Array<{
    questionId: string;
    siblingStateKey: string;
    reason: "SIBLING_STATE_COLLISION";
  }>;
}

import type { MenCp009ApprovedEnglishView } from "../approved/types";

export const MEN_CP_009_MULTILINGUAL_DRAFT_AUTHORITY =
  "MEN-CP009-MULTILINGUAL-DRAFT-V1" as const;

export type MenCp009NativeLanguage = "hi" | "pa";

export interface MenCp009NativeOption {
  label: "A" | "B" | "C" | "D";
  display: string;
  isCorrect: boolean;
}

export interface MenCp009NativeDraftView {
  authority: typeof MEN_CP_009_MULTILINGUAL_DRAFT_AUTHORITY;
  sourceEnglishReleaseId: MenCp009ApprovedEnglishView["releaseId"];
  sourceEnglishAuthority: MenCp009ApprovedEnglishView["authority"];
  permanentQlId: string;
  familyId: string;
  solveMode: string;
  seed: string;
  difficulty: string;
  target: string;
  language: MenCp009NativeLanguage;
  stem: string;
  options: MenCp009NativeOption[];
  correctIndex: number;
  answer: string;
  explanationLines: string[];
  showDiagram: false;
  sourceValidationPassed: boolean;
  sourceVerificationPassed: boolean;
  parity: {
    valid: boolean;
    optionMathParity: boolean;
    answerMathParity: boolean;
    correctIndexParity: boolean;
    correctOptionParity: boolean;
  };
  reviewStatus: "PENDING_NATIVE_EDITORIAL";
  humanReviewStatus: "PENDING_HUMAN_REVIEW";
  active: false;
  questionStudioDiscoverable: false;
  questionBankStatus: "NOT_STORED";
  questionBankWritable: false;
  testEligibility: "INELIGIBLE";
  testEligible: false;
  publiclyPublishable: false;
}

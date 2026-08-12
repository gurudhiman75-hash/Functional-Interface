import type { MenCp009NativeV2Language } from "./editorial-v2";

export const MEN_CP_009_MULTILINGUAL_TEACHING_V2_AUTHORITY =
  "MEN-CP009-MULTILINGUAL-TEACHING-V2" as const;

export interface MenCp009NativeTeachingV2View {
  authority: typeof MEN_CP_009_MULTILINGUAL_TEACHING_V2_AUTHORITY;
  sourceMathReleaseId: "MEN-CP009-EN-V3-APPROVED";
  sourceLearnerCandidateAuthority: "MEN-CP009-STUDENT-VIEW-V4-TEACHING";
  permanentQlId: string;
  familyId: string;
  solveMode: string;
  seed: string;
  difficulty: string;
  target: string;
  language: MenCp009NativeV2Language;
  stem: string;
  options: Array<{ label: "A" | "B" | "C" | "D"; display: string; isCorrect: boolean }>;
  correctIndex: number;
  answer: string;
  explanationLines: string[];
  showDiagram: false;
  sourceValidationPassed: boolean;
  sourceVerificationPassed: boolean;
  parity: {
    valid: boolean;
    correctIndexParity: boolean;
    correctOptionParity: boolean;
    optionCountParity: boolean;
  };
  reviewStatus: "PENDING_EDITORIAL_REVIEW_V2";
  humanReviewStatus: "PENDING_HUMAN_REVIEW";
  active: false;
  questionStudioDiscoverable: false;
  questionBankStatus: "NOT_STORED";
  questionBankWritable: false;
  testEligibility: "INELIGIBLE";
  testEligible: false;
  publiclyPublishable: false;
}

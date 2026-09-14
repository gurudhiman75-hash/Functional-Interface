import { generateWfm001Question, WFM_001_CHECKPOINT_IDS, WFM_001_QL_IDS } from "./runtime";
import type { WfmDifficulty, WfmExamProfile, WfmGeneratedQuestion, WfmLanguage, WfmQlId } from "./types";

export interface WfmQuestionStudioRequest {
  readonly seed: number;
  readonly qlId?: WfmQlId;
  readonly difficulty?: WfmDifficulty;
  readonly language?: WfmLanguage;
  readonly examProfile?: WfmExamProfile;
}

function mod(value: number, base: number): number {
  return ((value % base) + base) % base;
}

function qlForSeed(seed: number): WfmQlId {
  return WFM_001_QL_IDS[mod(seed * 5 + 1, WFM_001_QL_IDS.length)];
}

function generate(request: WfmQuestionStudioRequest): WfmGeneratedQuestion {
  return generateWfm001Question({
    qlId: request.qlId ?? qlForSeed(request.seed),
    seed: request.seed,
    language: request.language,
    examProfile: request.examProfile,
    difficulty: request.difficulty,
  });
}

export const WFM_001_QUESTION_STUDIO_ADAPTER = Object.freeze({
  subject: "Reasoning" as const,
  family: "VERBAL_REASONING" as const,
  proposedTopicCode: "REAS-WFM" as const,
  chapterId: "WFM-001" as const,
  chapterTitle: "Word Formation" as const,
  runtimeVersion: "WFM-001-RUNTIME-V2-REVIEW" as const,
  checkpointIds: WFM_001_CHECKPOINT_IDS,
  qlIds: WFM_001_QL_IDS,
  supportedLanguages: ["en-IN", "hi-IN", "pa-IN"] as const,
  supportedExamProfiles: ["SSC_CGL_4", "PUNJAB_4"] as const,
  optionCount: 4 as const,
  lifecycle: "REVIEW_ONLY" as const,
  questionStudioVisible: false as const,
  questionBankStored: false as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  generate,
});

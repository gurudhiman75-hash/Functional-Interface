import { generateWfm001Question, WFM_001_QL_IDS } from "./runtime";
import type { WfmDifficulty, WfmExamProfile, WfmGeneratedQuestion, WfmLanguage, WfmQlId } from "./types";

export interface WfmQuestionStudioRequest {
  seed: number;
  qlId?: WfmQlId;
  difficulty?: WfmDifficulty;
  language?: WfmLanguage;
  examProfile?: WfmExamProfile;
}

function mod(value: number, base: number): number {
  return ((value % base) + base) % base;
}

function qlForSeed(seed: number): WfmQlId {
  return WFM_001_QL_IDS[mod(seed, WFM_001_QL_IDS.length)];
}

function generateMatching(request: WfmQuestionStudioRequest): WfmGeneratedQuestion {
  const qlId = request.qlId ?? qlForSeed(request.seed);
  if (!request.difficulty) {
    return generateWfm001Question({
      qlId,
      seed: request.seed,
      language: request.language,
      examProfile: request.examProfile,
    });
  }

  for (let offset = 0; offset < 12; offset += 1) {
    const seed = request.seed + offset;
    const question = generateWfm001Question({
      qlId,
      seed,
      language: request.language,
      examProfile: request.examProfile,
    });
    if (question.difficulty === request.difficulty) return question;
  }
  throw new Error(`WFM-001 could not satisfy requested difficulty ${request.difficulty}.`);
}

export const WFM_001_QUESTION_STUDIO_ADAPTER = {
  subject: "Reasoning",
  family: "SYMBOLIC_SEQUENCE",
  proposedTopicCode: "REAS-WFM",
  chapterId: "WFM-001",
  chapterTitle: "Word Formation",
  runtimeVersion: "WFM-001-RUNTIME-V1-REVIEW",
  checkpointIds: ["WFM-CP-001"] as const,
  qlIds: WFM_001_QL_IDS,
  supportedLanguages: ["en-IN", "hi-IN", "pa-IN"] as const,
  supportedExamProfiles: ["SSC_CGL_4", "PUNJAB_4"] as const,
  optionCount: 4 as const,
  lifecycle: "REVIEW_ONLY" as const,
  questionBankStored: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
  generate: generateMatching,
};

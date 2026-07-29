import { ALP_001_CHECKPOINTS, ALP_001_QLS, alp001QlsForCheckpoint } from "./ql-registry";
import { generateAlp001Question } from "./runtime";
import type { AlpCheckpointId, AlpLocale } from "./types";

export const ALP_001_QUESTION_STUDIO_REGISTRY = {
  subject: "Reasoning",
  family: "SYMBOLIC_SEQUENCE",
  topicCode: "REAS-ALP",
  chapterId: "ALP-001",
  chapterTitle: "Alphabet Test",
  runtimeVersion: "ALP-001-RUNTIME-V3",
  editorialSchema: "ALP-001-PEDAGOGY-V2",
  locales: ["en-IN", "hi-IN", "pa-IN"] as const,
  status: "CHAPTER_COMPLETE_REVIEW_CP001_CP010",
  qlCount: ALP_001_QLS.length,
  checkpoints: ALP_001_CHECKPOINTS,
  listQuestionLogics(checkpointId?: AlpCheckpointId) {
    return checkpointId ? alp001QlsForCheckpoint(checkpointId) : ALP_001_QLS;
  },
  generate(qlId: string, seed: number, locale: AlpLocale) {
    return generateAlp001Question(qlId, seed, locale);
  },
} as const;

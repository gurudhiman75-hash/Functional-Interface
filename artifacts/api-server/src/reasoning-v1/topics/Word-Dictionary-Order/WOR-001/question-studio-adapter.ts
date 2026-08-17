import { toWorStudentFacingQuestion } from "./editorial";
import type { GeneratedWorQuestion, WorCheckpointId, WorDifficulty, WorLocale } from "./foundation/types";
import { WOR_001_ALL_CHECKPOINTS, WOR_001_ALL_PROTOTYPES, worPrototypesForCheckpoint } from "./prototype-registry";
import { generateWor001Question } from "./runtime";

export type WorQuestionStudioGeneratedQuestion = Omit<GeneratedWorQuestion, "questionStudioVisible"> & {
  readonly questionStudioVisible: true;
};

export const WOR_001_QUESTION_STUDIO_ADAPTER = {
  subject: "Reasoning",
  family: "RELATIONAL_POSITIONAL",
  topicCode: "REAS-WOR",
  chapterId: "WOR-001",
  chapterTitle: "Word & Dictionary Order",
  runtimeVersion: "WOR-001-RUNTIME-V2-COMPOSITE",
  localeMode: "TRANSLATABLE",
  locales: ["en-IN", "hi-IN", "pa-IN"] as const,
  lifecycleStatus: "REVIEW_ONLY",
  // The original adapter stays dormant as a release surface. The registered
  // review package owns Question Studio visibility and downstream lifecycle locks.
  questionStudioVisible: false,
  questionStudioReviewVisible: true,
  publicReleaseEnabled: false,
  permanentQlCount: 0,
  checkpoints: WOR_001_ALL_CHECKPOINTS,
  controls: ["checkpoint", "prototype", "locale", "difficulty", "seed", "generate", "regenerate", "export-review"] as const,
  listPrototypes(checkpointId?: WorCheckpointId) {
    return checkpointId ? worPrototypesForCheckpoint(checkpointId) : WOR_001_ALL_PROTOTYPES;
  },
  generate(prototypeId: string, seed: number, locale: WorLocale, difficulty?: WorDifficulty): WorQuestionStudioGeneratedQuestion {
    const question = toWorStudentFacingQuestion(generateWor001Question(prototypeId, seed, locale, difficulty));
    return { ...question, questionStudioVisible: true };
  },
} as const;

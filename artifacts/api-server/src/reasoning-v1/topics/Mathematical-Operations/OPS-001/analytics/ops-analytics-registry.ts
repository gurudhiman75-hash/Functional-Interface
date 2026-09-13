import {
  OPS_CHECKPOINT_RANGES,
  OPS_QL_ENTRIES,
  OPS_QL_FREEZE_VERSION,
  getOpsQlEntry,
  type OpsQlId,
} from "../registry";

export const OPS_001_ANALYTICS_DEFINITION = {
  chapterId: "OPS-001",
  chapterName: "Mathematical Operations and Symbol Substitution",
  subject: "Reasoning Ability",
  section: "Reasoning",
  qlFreezeVersion: OPS_QL_FREEZE_VERSION,
  qlCount: OPS_QL_ENTRIES.length,
  checkpointCount: Object.keys(OPS_CHECKPOINT_RANGES).length,
  supportedLanguages: ["en", "hi", "pa"],
  eventNamespace: "reasoning.ops_001",
  publiclyPublishable: false,
  dimensions: [
    "chapterId",
    "qlId",
    "checkpointId",
    "candidateId",
    "solveMode",
    "taskKind",
    "answerSemantic",
    "language",
    "difficulty",
    "renderer",
    "seed",
    "generationSource",
    "qlFreezeVersion",
  ],
  events: {
    generated: "reasoning.ops_001.question.generated",
    previewed: "reasoning.ops_001.question.previewed",
    reviewed: "reasoning.ops_001.question.reviewed",
    converted: "reasoning.ops_001.question.converted",
    attempted: "reasoning.ops_001.question.attempted",
    answered: "reasoning.ops_001.question.answered",
    explanationViewed: "reasoning.ops_001.explanation.viewed",
  },
} as const;

export function buildOpsAnalyticsDimensions(input: {
  readonly qlId: OpsQlId;
  readonly language: "en" | "hi" | "pa";
  readonly difficulty: "Easy" | "Medium" | "Hard";
  readonly seed: string | number;
  readonly generationSource:
    | "question-studio"
    | "internal-preview"
    | "question-bank"
    | "student-runtime";
}) {
  const entry = getOpsQlEntry(input.qlId);
  return {
    chapterId: "OPS-001",
    qlId: entry.qlId,
    checkpointId: entry.checkpointId,
    candidateId: entry.candidateId,
    solveMode: entry.solveMode,
    answerSemantic: entry.answerSemantic,
    localeMode: entry.localeMode,
    language: input.language,
    difficulty: input.difficulty,
    seed: String(input.seed),
    generationSource: input.generationSource,
    qlFreezeVersion: OPS_QL_FREEZE_VERSION,
    publiclyPublishable: false,
  } as const;
}

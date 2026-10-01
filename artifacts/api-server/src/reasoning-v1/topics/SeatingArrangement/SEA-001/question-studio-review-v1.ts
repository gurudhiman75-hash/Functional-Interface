import { buildSea001EnglishReviewPackV1, type Sea001EnglishReviewPackItemV1 } from "./english-review-pack-v1.ts";
import {
  buildSea001LocalizationReviewPackV1,
  type Sea001LocalizedReviewItemV1,
} from "./localization-v1.ts";
import { SEA_001_MULTILINGUAL_FREEZE_V1 } from "./multilingual-freeze-v1.ts";
import { SEA_001_QLS, type Sea001QlId } from "./ql-registry.ts";

export const SEA_001_QUESTION_STUDIO_REVIEW_AUTHORITY = "SEA_001_QUESTION_STUDIO_REVIEW_V1" as const;
export const SEA_001_QUESTION_STUDIO_PACKAGE_ID = "SEA-001" as const;

export type Sea001QuestionStudioLanguage = "en" | "hi" | "pa";
export type Sea001QuestionStudioDifficulty = "Easy" | "Medium" | "Hard";

const DIFFICULTY_TO_RUNTIME: Record<Sea001QuestionStudioDifficulty, "EASY" | "MEDIUM" | "HARD"> = {
  Easy: "EASY",
  Medium: "MEDIUM",
  Hard: "HARD",
};

const RUNTIME_TO_DIFFICULTY: Record<"EASY" | "MEDIUM" | "HARD", Sea001QuestionStudioDifficulty> = {
  EASY: "Easy",
  MEDIUM: "Medium",
  HARD: "Hard",
};

const CHECKPOINT_IDS = ["SEA-CP-001", "SEA-CP-002", "SEA-CP-003", "SEA-CP-004", "SEA-CP-005"] as const;

export const SEA_001_QUESTION_STUDIO_REVIEW_PACKAGE = Object.freeze({
  packageId: SEA_001_QUESTION_STUDIO_PACKAGE_ID,
  chapterId: "SEA-001" as const,
  subject: "Reasoning Ability" as const,
  topic: "Reasoning" as const,
  subtopic: "Seating Arrangement" as const,
  label: "Seating Arrangement — SEA-001" as const,
  enabled: true as const,
  questionStudioVisible: true as const,
  questionStudioDiscoverable: true as const,
  questionStudioGenerationEnabled: true as const,
  cpIds: CHECKPOINT_IDS,
  canonicalProblems: SEA_001_QLS.map((ql) => Object.freeze({
    id: ql.qlId,
    label: ql.learnerContract,
    checkpoints: ql.checkpoints,
  })),
  permanentQlCount: 9 as const,
  permanentQlIds: SEA_001_QLS.map((ql) => ql.qlId),
  supportedLanguages: ["en", "hi", "pa"] as const,
  supportedDifficulties: ["Easy", "Medium", "Hard"] as const,
  runtimeMode: "FROZEN_MULTILINGUAL_REVIEW_POOL_V1" as const,
  reviewStatus: "MULTILINGUAL_FROZEN_REVIEW_ONLY" as const,
  multilingualChapterFrozen: true as const,
  integrationAuthority: SEA_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
  reviewOnly: true as const,
  manualApprovalRequired: true as const,
  questionBankStatus: "NOT_STORED" as const,
  questionBankWritable: false as const,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
  diagramPolicy: "EXPLANATION_ONLY" as const,
  frozenReviewPoolSizePerLanguage: 324 as const,
});

export interface PreviewSea001QuestionStudioInput {
  readonly language?: Sea001QuestionStudioLanguage;
  readonly difficulty?: Sea001QuestionStudioDifficulty;
  readonly seed?: string;
  readonly count?: number;
  readonly canonicalProblemId?: string;
  readonly cpId?: string;
  readonly questionLanguageId?: string;
}

type Sea001SourceItem = Sea001EnglishReviewPackItemV1 | Sea001LocalizedReviewItemV1;

function stableHash(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash >>> 0;
}

function sourcePack(language: Sea001QuestionStudioLanguage): readonly Sea001SourceItem[] {
  if (language === "hi") return buildSea001LocalizationReviewPackV1("hi-IN");
  if (language === "pa") return buildSea001LocalizationReviewPackV1("pa-IN");
  return buildSea001EnglishReviewPackV1();
}

function resolveQl(input: PreviewSea001QuestionStudioInput): Sea001QlId | undefined {
  const candidates = [input.canonicalProblemId, input.questionLanguageId]
    .map((value) => String(value ?? "").trim().toUpperCase())
    .filter(Boolean);
  const selected = candidates.find((value) => value.startsWith("SEA-QL-"));
  if (!selected) return undefined;
  if (!SEA_001_QLS.some((ql) => ql.qlId === selected)) {
    throw new Error(`Unsupported SEA-001 permanent QL '${selected}'.`);
  }
  return selected as Sea001QlId;
}

function assertCheckpoint(value: string | undefined): string | undefined {
  const checkpoint = String(value ?? "").trim().toUpperCase();
  if (!checkpoint) return undefined;
  if (!(CHECKPOINT_IDS as readonly string[]).includes(checkpoint)) {
    throw new Error(`Unsupported SEA-001 checkpoint '${checkpoint}'.`);
  }
  return checkpoint;
}

function selectItems(input: PreviewSea001QuestionStudioInput): {
  readonly selected: readonly Sea001SourceItem[];
  readonly poolSize: number;
  readonly requestedCount: number;
  readonly qlId?: Sea001QlId;
  readonly checkpointId?: string;
} {
  const language = input.language ?? "en";
  const difficulty = input.difficulty ? DIFFICULTY_TO_RUNTIME[input.difficulty] : undefined;
  const qlId = resolveQl(input);
  const checkpointId = assertCheckpoint(input.cpId);
  let candidates = sourcePack(language).filter((item) =>
    (!difficulty || item.difficulty === difficulty)
    && (!qlId || item.qlId === qlId)
    && (!checkpointId || item.checkpointId === checkpointId)
  );

  if (candidates.length === 0) {
    throw new Error("No frozen SEA-001 review items match the requested QL/checkpoint/difficulty filters.");
  }

  const seed = input.seed?.trim() || "sea-001-question-studio-review";
  candidates = [...candidates].sort((left, right) => {
    const a = stableHash(`${seed}:${left.itemId}`);
    const b = stableHash(`${seed}:${right.itemId}`);
    return a - b || left.itemId.localeCompare(right.itemId);
  });
  const requestedCount = Math.min(50, Math.max(1, Math.floor(input.count ?? 5)));
  return {
    selected: Object.freeze(candidates.slice(0, Math.min(requestedCount, candidates.length))),
    poolSize: candidates.length,
    requestedCount,
    qlId,
    checkpointId,
  };
}

export function previewSea001QuestionStudioReview(input: PreviewSea001QuestionStudioInput = {}) {
  const language = input.language ?? "en";
  if (!(["en", "hi", "pa"] as const).includes(language)) {
    throw new Error(`Unsupported SEA-001 language '${language}'.`);
  }
  if (input.difficulty && !(["Easy", "Medium", "Hard"] as const).includes(input.difficulty)) {
    throw new Error(`Unsupported SEA-001 difficulty '${input.difficulty}'.`);
  }

  const selection = selectItems(input);
  const questions = selection.selected.map((item, index) => {
    const optionsDistinct = new Set(item.options).size === item.options.length;
    const exactlyOneCorrect = Number.isInteger(item.correctIndex)
      && item.correctIndex >= 0
      && item.correctIndex < item.options.length;
    const questionId = `SEA-001:${item.itemId}:${language}`;
    return Object.freeze({
      packageId: SEA_001_QUESTION_STUDIO_PACKAGE_ID,
      chapterId: "SEA-001",
      checkpointId: item.checkpointId,
      blueprintAuthorityId: item.blueprintAuthorityId,
      qlId: item.qlId,
      permanentQlId: item.qlId,
      questionId,
      canonicalItemId: item.itemId,
      questionLanguageId: `${questionId}:${index}`,
      language,
      difficultyBand: RUNTIME_TO_DIFFICULTY[item.difficulty],
      stem: item.stem,
      displayStem: item.stem,
      options: item.options,
      correctIndex: item.correctIndex,
      answer: item.options[item.correctIndex],
      explanation: item.explanation,
      diagramPolicy: "EXPLANATION_ONLY",
      renderer: "STRUCTURED_TEXT",
      lifecycleStatus: "REVIEW_ONLY",
      reviewStatus: "MULTILINGUAL_FROZEN_REVIEW_ONLY",
      integrationAuthority: SEA_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
      multilingualChapterFrozen: true,
      questionStudioVisible: true,
      reviewOnly: true,
      manualApprovalRequired: true,
      questionBankStatus: "NOT_STORED",
      questionBankWritable: false,
      testEligibility: "INELIGIBLE",
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
      validation: Object.freeze({
        valid: optionsDistinct && exactlyOneCorrect,
        optionsDistinct,
        exactlyOneCorrect,
        localizationParityFrozen: true,
      }),
    });
  });

  return Object.freeze({
    questions: Object.freeze(questions),
    generationContext: Object.freeze({
      generationDomain: "reasoning-v1",
      packageId: SEA_001_QUESTION_STUDIO_PACKAGE_ID,
      chapterId: "SEA-001",
      runtimeMode: SEA_001_QUESTION_STUDIO_REVIEW_PACKAGE.runtimeMode,
      integrationAuthority: SEA_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
      multilingualFreezeAuthority: SEA_001_MULTILINGUAL_FREEZE_V1.authorityId,
      multilingualChapterFrozen: true,
      lifecycleStatus: "REVIEW_ONLY",
      requestedCount: selection.requestedCount,
      returnedCount: questions.length,
      uniqueFrozenPoolSizeForFilters: selection.poolSize,
      qlId: selection.qlId ?? null,
      checkpointId: selection.checkpointId ?? null,
      language,
      difficulty: input.difficulty ?? null,
      questionBankWritable: false,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
    }),
    integrationAuthority: SEA_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
    reviewOnly: true as const,
  });
}

export function isSea001QuestionStudioRequest(request: Readonly<Record<string, unknown>> = {}): boolean {
  const normalize = (value: unknown) => String(value ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const packageId = normalize(request.packageId ?? request.archetypeId);
  const topic = normalize(request.topic);
  const subtopic = normalize(request.subtopic);
  const canonicalProblemId = String(request.canonicalProblemId ?? request.questionLanguageId ?? "").trim().toUpperCase();
  const cpId = String(request.cpId ?? "").trim().toUpperCase();
  return packageId === "sea 001"
    || canonicalProblemId.startsWith("SEA-QL-")
    || cpId.startsWith("SEA-CP-")
    || subtopic === "seating arrangement"
    || subtopic === "seating arrangements"
    || (topic === "reasoning" && subtopic === "seating");
}

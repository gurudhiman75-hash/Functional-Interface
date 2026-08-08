import {
  SER_CP007_FROZEN_TEMPLATE_AUTHORITIES,
  type SerCp007FrozenTemplateAuthority,
} from "./topics/Series/SER-001/SER-CP-007-ENGLISH-FREEZE/ser-cp-007-english-freeze-authority";
import {
  generateSerCp007QuestionStudioReview,
  SER_CP007_QUESTION_STUDIO_REVIEW_STATUS,
  SER_CP007_QUESTION_STUDIO_RUNTIME_MODE,
} from "./topics/Series/SER-001/SER-CP-007-QUESTION-STUDIO-INTEGRATION/ser-cp-007-question-studio-runtime";
import {
  SER_CP007_PERMANENT_QL_IDS,
  type SerCp007PermanentQlId,
} from "./topics/Series/SER-001/SER-PERMANENT-QL-REGISTRY";

export const REASONING_V1_LANGUAGES = ["en", "hi", "pa"] as const;
export type ReasoningV1Language = (typeof REASONING_V1_LANGUAGES)[number];
export type ReasoningV1Difficulty = "Easy" | "Medium" | "Hard";

export type ReasoningV1GenerationRequest = Readonly<{
  packageId?: string;
  count?: number;
  language?: ReasoningV1Language;
  difficulty?: ReasoningV1Difficulty;
  seed?: string;
  runtimeMode?: string;
  canonicalProblemId?: string;
  cpId?: string;
  questionLanguageId?: string;
}>;

export class ReasoningV1RequestError extends Error {
  readonly statusCode = 400;

  constructor(message: string) {
    super(message);
    this.name = "ReasoningV1RequestError";
  }
}

const SER_001_PACKAGE = Object.freeze({
  id: "SER-001" as const,
  packageId: "SER-001" as const,
  type: "reasoning-v1" as const,
  section: "Reasoning" as const,
  domain: "reasoning" as const,
  generationDomain: "reasoning-v1" as const,
  topic: "Reasoning" as const,
  subtopic: "Series" as const,
  name: "SER-001 Series — Frozen Multilingual Review" as const,
  label: "Series — Frozen Multilingual Review" as const,
  cpIds: Object.freeze(["SER-CP-007"] as const),
  canonicalProblems: Object.freeze([
    Object.freeze({ id: "SER-CP-007" as const, label: "Series" as const }),
  ]),
  supportedDifficulties: Object.freeze(["easy", "medium", "hard"] as const),
  supportedLanguages: Object.freeze([...REASONING_V1_LANGUAGES]),
  enabled: true as const,
  active: true as const,
  questionStudioDiscoverable: true as const,
  runtimeMode: SER_CP007_QUESTION_STUDIO_RUNTIME_MODE,
  supportedRuntimeModes: Object.freeze([
    SER_CP007_QUESTION_STUDIO_RUNTIME_MODE,
  ]),
  reviewStatus: SER_CP007_QUESTION_STUDIO_REVIEW_STATUS,
  questionBankStatus: "NOT_STORED" as const,
  questionBankWritable: false as const,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
  permanentQlIds: Object.freeze([...SER_CP007_PERMANENT_QL_IDS]),
  frozenTemplateCount: SER_CP007_FROZEN_TEMPLATE_AUTHORITIES.length,
  runtimePolicies: Object.freeze({
    FROZEN_REVIEW: Object.freeze({
      reviewStatus: SER_CP007_QUESTION_STUDIO_REVIEW_STATUS,
      questionBankStatus: "NOT_STORED" as const,
      questionBankWritable: false as const,
      testEligibility: "INELIGIBLE" as const,
      testEligible: false as const,
      publiclyPublishable: false as const,
    }),
  }),
});

function hashSeed(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function positiveSeed(value: string): number {
  return (hashSeed(value) % 2_147_483_646) + 1;
}

function localeForLanguage(language: ReasoningV1Language) {
  if (language === "hi") return "hi-IN" as const;
  if (language === "pa") return "pa-IN" as const;
  return "en-IN" as const;
}

function normalizeDifficulty(value: string): ReasoningV1Difficulty | null {
  const normalized = value.trim().toLowerCase();
  if (normalized === "easy") return "Easy";
  if (normalized === "medium" || normalized === "moderate") return "Medium";
  if (normalized === "hard") return "Hard";
  return null;
}

function templatePool(questionLanguageId?: string) {
  if (!questionLanguageId) return SER_CP007_FROZEN_TEMPLATE_AUTHORITIES;
  if (!SER_CP007_PERMANENT_QL_IDS.includes(
    questionLanguageId as SerCp007PermanentQlId,
  )) {
    throw new ReasoningV1RequestError(
      `Unknown SER-001 question-language ID '${questionLanguageId}'.`,
    );
  }
  const pool = SER_CP007_FROZEN_TEMPLATE_AUTHORITIES.filter(
    (authority) => authority.permanentQlId === questionLanguageId,
  );
  if (pool.length === 0) {
    throw new ReasoningV1RequestError(
      `No frozen Series templates are allocated to ${questionLanguageId}.`,
    );
  }
  return pool;
}

function selectReviewProjection(
  pool: readonly SerCp007FrozenTemplateAuthority[],
  language: ReasoningV1Language,
  itemSeed: number,
  difficulty?: ReasoningV1Difficulty,
) {
  const locale = localeForLanguage(language);
  const start = itemSeed % pool.length;
  for (let offset = 0; offset < pool.length; offset += 1) {
    const authority = pool[(start + offset) % pool.length]!;
    const projection = generateSerCp007QuestionStudioReview({
      temporaryTemplateId: authority.temporaryTemplateId,
      seed: itemSeed + offset,
      locale,
    });
    if (!difficulty || normalizeDifficulty(projection.difficulty) === difficulty) {
      return projection;
    }
  }
  throw new ReasoningV1RequestError(
    `No SER-001 frozen review item matches ${difficulty} difficulty for the requested selection.`,
  );
}

export function listReasoningV1Packages() {
  return [SER_001_PACKAGE];
}

export async function generateReasoningV1Questions(
  request: ReasoningV1GenerationRequest,
) {
  const packageId = request.packageId ?? "SER-001";
  if (packageId !== "SER-001") {
    throw new ReasoningV1RequestError(
      `Unsupported Reasoning V1 package '${packageId}'.`,
    );
  }

  const runtimeMode = String(
    request.runtimeMode ?? SER_CP007_QUESTION_STUDIO_RUNTIME_MODE,
  ).trim().toUpperCase();
  if (runtimeMode !== SER_CP007_QUESTION_STUDIO_RUNTIME_MODE) {
    throw new ReasoningV1RequestError(
      `Unsupported SER-001 runtime mode '${runtimeMode}'.`,
    );
  }

  const canonicalProblemId = request.canonicalProblemId ?? request.cpId;
  if (canonicalProblemId && canonicalProblemId !== "SER-CP-007") {
    throw new ReasoningV1RequestError(
      `Unknown canonical problem '${canonicalProblemId}' for package SER-001.`,
    );
  }

  const language = request.language ?? "en";
  if (!REASONING_V1_LANGUAGES.includes(language)) {
    throw new ReasoningV1RequestError(
      `SER-001 does not support language '${String(language)}'.`,
    );
  }

  const count = Math.min(
    1000,
    Math.max(1, Math.floor(Number(request.count ?? 1) || 1)),
  );
  const batchSeed = request.seed?.trim() || "ser-001:frozen-review";
  const pool = templatePool(request.questionLanguageId);
  const questionPackages = [];

  for (let index = 0; index < count; index += 1) {
    const itemSeed = positiveSeed(`${batchSeed}:${language}:${index}`);
    questionPackages.push(
      selectReviewProjection(pool, language, itemSeed, request.difficulty),
    );
  }

  return Object.freeze({
    generationContext: Object.freeze({
      generationDomain: "reasoning-v1" as const,
      packageId: "SER-001" as const,
      canonicalProblemId: "SER-CP-007" as const,
      seed: batchSeed,
      runtimeMode: SER_CP007_QUESTION_STUDIO_RUNTIME_MODE,
      reviewStatus: SER_CP007_QUESTION_STUDIO_REVIEW_STATUS,
      questionBankStatus: "NOT_STORED" as const,
      questionBankWritable: false as const,
      testEligibility: "INELIGIBLE" as const,
      testEligible: false as const,
      publiclyPublishable: false as const,
      active: true as const,
      questionStudioDiscoverable: true as const,
      language,
      locale: localeForLanguage(language),
      requestedDifficulty: request.difficulty ?? null,
      questionLanguageId: request.questionLanguageId ?? null,
    }),
    questionPackages: Object.freeze(questionPackages),
    questions: Object.freeze(questionPackages),
  });
}

import { createHash } from "node:crypto";

import { generateSea002Cp008EnglishReviewCandidate } from "./production-review-v1.ts";
import { localizeSea002Cp008ReviewCandidate } from "./localization-v1.ts";
import {
  SEA002_CP008_PERMANENT_QL_IDS,
  SEA002_CP008_PERMANENT_QL_REGISTRY,
  type Sea002Cp008PermanentQlId,
} from "./permanent/registry.ts";
import {
  SEA002_CP008_PREFREEZE_AUTHORITY_V1,
  assertSea002Cp008PrefreezeBoundary,
} from "./review/prefreeze-authority-v1.ts";

export const SEA002_CP008_QS_PACKAGE_ID = "SEA-002" as const;
export const SEA002_CP008_QS_CHECKPOINT_ID = "SEA-CP-008" as const;
export const SEA002_CP008_QS_RELEASE_CANDIDATE_ID = "SEA-002-CP008-QS-PREFREEZE-V1" as const;
export const SEA002_CP008_QS_LANGUAGES = Object.freeze(["en", "hi", "pa"] as const);

export type Sea002Cp008QuestionStudioLanguage = (typeof SEA002_CP008_QS_LANGUAGES)[number];
export type Sea002Cp008QuestionStudioDifficulty = "Easy" | "Medium" | "Hard";

export type Sea002Cp008QuestionStudioRequest = Readonly<{
  packageId?: string;
  archetypeId?: string;
  patternId?: string;
  topic?: string;
  subtopic?: string;
  canonicalProblemId?: string;
  cpId?: string;
  questionLanguageId?: string;
  difficulty?: unknown;
  language?: string;
  seed?: string;
  count?: number;
}>;

function normalizeSelector(value: unknown): string {
  return String(value ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function normalizeLanguage(value: unknown): Sea002Cp008QuestionStudioLanguage {
  const language = String(value ?? "en").trim().toLowerCase();
  if (language === "en" || language === "hi" || language === "pa") return language;
  throw new Error(`SEA-CP-008 does not support Question Studio language ${language}.`);
}

function normalizeDifficulty(value: unknown): Sea002Cp008QuestionStudioDifficulty {
  const difficulty = String(value ?? "Medium").trim().toLowerCase();
  if (difficulty === "easy") return "Easy";
  if (difficulty === "medium" || difficulty === "moderate") return "Medium";
  if (difficulty === "hard") return "Hard";
  throw new Error(`SEA-CP-008 does not support difficulty ${String(value)}.`);
}

function isCp008Ql(value: unknown): value is Sea002Cp008PermanentQlId {
  return SEA002_CP008_PERMANENT_QL_IDS.includes(String(value ?? "") as Sea002Cp008PermanentQlId);
}

export function isSea002Cp008QuestionStudioRequest(request: Sea002Cp008QuestionStudioRequest): boolean {
  const checkpointId = String(request.canonicalProblemId ?? request.cpId ?? "");
  const patternId = normalizeSelector(request.patternId);
  const subtopic = normalizeSelector(request.subtopic);
  return checkpointId === SEA002_CP008_QS_CHECKPOINT_ID
    || isCp008Ql(request.questionLanguageId)
    || patternId.includes("sea cp 008")
    || subtopic === "square seating"
    || subtopic === "square table seating"
    || subtopic === "square seating arrangement";
}

function qlOrder(seed: string): readonly Sea002Cp008PermanentQlId[] {
  const value = createHash("sha256").update(`${seed}:ql-order`).digest().readUInt32BE(0);
  const offset = value % SEA002_CP008_PERMANENT_QL_IDS.length;
  return Object.freeze(Array.from({ length: SEA002_CP008_PERMANENT_QL_IDS.length }, (_, index) =>
    SEA002_CP008_PERMANENT_QL_IDS[(offset + index) % SEA002_CP008_PERMANENT_QL_IDS.length]!,
  ));
}

function variantForDifficulty(difficulty: Sea002Cp008QuestionStudioDifficulty, seed: string, index: number): number {
  const base = difficulty === "Easy" ? 0 : difficulty === "Medium" ? 2 : 4;
  const offset = (createHash("sha256").update(`${seed}:${index}:variant`).digest().readUInt32BE(0) + index) % 2;
  return base + offset;
}

function localeForLanguage(language: Sea002Cp008QuestionStudioLanguage): "en-IN" | "hi-IN" | "pa-IN" {
  return language === "en" ? "en-IN" : language === "hi" ? "hi-IN" : "pa-IN";
}

function normalizedQuestion(
  qlId: Sea002Cp008PermanentQlId,
  requestSeed: string,
  language: Sea002Cp008QuestionStudioLanguage,
  difficulty: Sea002Cp008QuestionStudioDifficulty,
  itemIndex: number,
) {
  assertSea002Cp008PrefreezeBoundary();
  const variantIndex = variantForDifficulty(difficulty, requestSeed, itemIndex);
  const english = generateSea002Cp008EnglishReviewCandidate(qlId, variantIndex);
  const localized = language === "en" ? null : localizeSea002Cp008ReviewCandidate(english, language);
  const stem = localized?.stem ?? english.stem;
  const question = localized?.question ?? english.question;
  const options = localized?.options ?? english.options;
  const answer = localized?.answer ?? english.answer;
  const explanation = localized?.explanation ?? english.explanation;
  const registry = SEA002_CP008_PERMANENT_QL_REGISTRY.find((entry) => entry.permanentQlId === qlId)!;
  const identity = createHash("sha256")
    .update(JSON.stringify({ qlId, requestSeed, language, difficulty, variantIndex, source: english.fingerprint }))
    .digest("hex")
    .slice(0, 20);

  return Object.freeze({
    text: `${stem}\n\n${question}`,
    stem: `${stem}\n\n${question}`,
    setupText: stem,
    childStem: question,
    options: Object.freeze([...options]),
    correct: english.correctOptionIndex,
    correctIndex: english.correctOptionIndex,
    answer,
    explanation,
    difficulty,
    difficultyLabel: difficulty,
    patternId: SEA002_CP008_QS_PACKAGE_ID,
    section: "Reasoning",
    topic: "Seating Arrangement",
    subtopic: "Square Seating",
    generationBackend: "reasoning-v1",
    debugSource: "reasoning-v1-sea-002-cp008-prefreeze-runtime",
    packageSource: "reasoning-v1-sea-002-cp008-prefreeze-runtime",
    packageId: SEA002_CP008_QS_PACKAGE_ID,
    canonicalProblemId: SEA002_CP008_QS_CHECKPOINT_ID,
    questionLanguageId: qlId,
    qlId,
    questionId: `SEA-CP008-${qlId.slice(-3)}-${language.toUpperCase()}-${identity}`,
    language,
    locale: localeForLanguage(language),
    authorityId: registry.authorityKey,
    authorityLabel: registry.authorityLabel,
    signatureId: registry.signatureId,
    taskKind: registry.authorityKey,
    sourceEnglishFingerprint: english.fingerprint,
    localizedFingerprint: localized?.localizedFingerprint ?? null,
    runtimeMode: "QUESTION_STUDIO_BLOCKED_PENDING_APPROVAL" as const,
    reviewStatus: "PREFREEZE_REVIEW_AUTHORITY" as const,
    questionStudioDiscoverable: false as const,
    sourceQuestionStudioRegistered: false as const,
    questionBankStatus: "NOT_STORED" as const,
    questionBankWritable: false as const,
    testEligibility: "INELIGIBLE" as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    productionStaging: false as const,
    publiclyPublishable: false as const,
    automaticStudentPublication: false as const,
    validation: Object.freeze({ ok: true as const, valid: true as const, errors: Object.freeze([] as string[]) }),
    traceability: Object.freeze({
      releaseCandidateId: SEA002_CP008_QS_RELEASE_CANDIDATE_ID,
      englishReviewFingerprint: SEA002_CP008_PREFREEZE_AUTHORITY_V1.english.reviewFingerprint,
      localizationReviewFingerprint: SEA002_CP008_PREFREEZE_AUTHORITY_V1.localization.reviewFingerprint,
      productOwnerApprovalStatus: SEA002_CP008_PREFREEZE_AUTHORITY_V1.productOwnerApprovalStatus,
      freezeStatus: SEA002_CP008_PREFREEZE_AUTHORITY_V1.freezeStatus,
    }),
  });
}

export function generateSea002Cp008QuestionStudioPreview(request: Sea002Cp008QuestionStudioRequest) {
  assertSea002Cp008PrefreezeBoundary();
  if (!isSea002Cp008QuestionStudioRequest(request)) {
    throw new Error("Request does not explicitly target SEA-CP-008 pre-integration.");
  }
  const language = normalizeLanguage(request.language);
  const difficulty = normalizeDifficulty(request.difficulty);
  const seed = String(request.seed ?? "sea-cp008-preview");
  const count = Math.max(1, Math.min(20, Math.floor(Number(request.count ?? 1)) || 1));
  const requestedQl = isCp008Ql(request.questionLanguageId) ? request.questionLanguageId : null;
  const order = requestedQl ? Object.freeze([requestedQl]) : qlOrder(seed);
  return Object.freeze(Array.from({ length: count }, (_, index) => {
    const qlId = order[index % order.length]!;
    return normalizedQuestion(qlId, `${seed}:${index}`, language, difficulty, index);
  }));
}

export function activateSea002Cp008QuestionStudio(): never {
  throw new Error("SEA-CP-008 Question Studio activation is blocked until explicit human approval and freeze are recorded.");
}

import { createHash } from "node:crypto";

import {
  isSea002Cp008QuestionStudioRequest,
  type Sea002Cp008QuestionStudioRequest,
} from "./question-studio-preintegration-v1.ts";
import { generateSea002Cp008EnglishReviewCandidateV2 } from "./production-review-v2.ts";
import { localizeSea002Cp008ReviewCandidateV2 } from "./localization-v2.ts";
import {
  SEA002_CP008_PERMANENT_QL_IDS,
  SEA002_CP008_PERMANENT_QL_REGISTRY,
  type Sea002Cp008PermanentQlId,
} from "./permanent/registry.ts";
import {
  SEA002_CP008_PREFREEZE_AUTHORITY_V2,
  assertSea002Cp008PrefreezeBoundaryV2,
} from "./review/prefreeze-authority-v2.ts";

export const SEA002_CP008_QS_RELEASE_CANDIDATE_V2 = "SEA-002-CP008-QS-PREFREEZE-V2" as const;
export type Sea002Cp008QuestionStudioLanguageV2 = "en" | "hi" | "pa";
export type Sea002Cp008QuestionStudioDifficultyV2 = "Easy" | "Medium" | "Hard";

function normalizeLanguage(value: unknown): Sea002Cp008QuestionStudioLanguageV2 {
  const language = String(value ?? "en").trim().toLowerCase();
  if (language === "en" || language === "hi" || language === "pa") return language;
  throw new Error(`SEA-CP-008 V2 does not support Question Studio language ${language}.`);
}

function normalizeDifficulty(value: unknown): Sea002Cp008QuestionStudioDifficultyV2 {
  const difficulty = String(value ?? "Medium").trim().toLowerCase();
  if (difficulty === "easy") return "Easy";
  if (difficulty === "medium" || difficulty === "moderate") return "Medium";
  if (difficulty === "hard") return "Hard";
  throw new Error(`SEA-CP-008 V2 does not support difficulty ${String(value)}.`);
}

function isQl(value: unknown): value is Sea002Cp008PermanentQlId {
  return SEA002_CP008_PERMANENT_QL_IDS.includes(String(value ?? "") as Sea002Cp008PermanentQlId);
}

function qlOrder(seed: string): readonly Sea002Cp008PermanentQlId[] {
  const offset = createHash("sha256").update(`${seed}:v2-ql-order`).digest().readUInt32BE(0) % SEA002_CP008_PERMANENT_QL_IDS.length;
  return Object.freeze(Array.from({ length: SEA002_CP008_PERMANENT_QL_IDS.length }, (_, index) =>
    SEA002_CP008_PERMANENT_QL_IDS[(offset + index) % SEA002_CP008_PERMANENT_QL_IDS.length]!,
  ));
}

function variantForDifficulty(difficulty: Sea002Cp008QuestionStudioDifficultyV2, seed: string, index: number): number {
  const base = difficulty === "Easy" ? 0 : difficulty === "Medium" ? 2 : 4;
  const offset = (createHash("sha256").update(`${seed}:${index}:v2-variant`).digest().readUInt32BE(0) + index) % 2;
  return base + offset;
}

function locale(language: Sea002Cp008QuestionStudioLanguageV2): "en-IN" | "hi-IN" | "pa-IN" {
  return language === "en" ? "en-IN" : language === "hi" ? "hi-IN" : "pa-IN";
}

function buildPreviewQuestion(
  qlId: Sea002Cp008PermanentQlId,
  seed: string,
  language: Sea002Cp008QuestionStudioLanguageV2,
  difficulty: Sea002Cp008QuestionStudioDifficultyV2,
  index: number,
) {
  assertSea002Cp008PrefreezeBoundaryV2();
  const variantIndex = variantForDifficulty(difficulty, seed, index);
  const english = generateSea002Cp008EnglishReviewCandidateV2(qlId, variantIndex);
  const localized = language === "en" ? null : localizeSea002Cp008ReviewCandidateV2(english, language);
  const setupText = localized?.stem ?? english.stem;
  const childStem = localized?.question ?? english.question;
  const options = localized?.options ?? english.options;
  const answer = localized?.answer ?? english.answer;
  const explanation = localized?.explanation ?? english.explanation;
  const registry = SEA002_CP008_PERMANENT_QL_REGISTRY.find((entry) => entry.permanentQlId === qlId)!;
  const id = createHash("sha256").update(JSON.stringify({ qlId, seed, language, difficulty, variantIndex, source: english.fingerprint })).digest("hex").slice(0, 20);
  return Object.freeze({
    text: `${setupText}\n\n${childStem}`,
    stem: `${setupText}\n\n${childStem}`,
    setupText,
    childStem,
    options: Object.freeze([...options]),
    correct: english.correctOptionIndex,
    correctIndex: english.correctOptionIndex,
    answer,
    explanation,
    difficulty,
    difficultyLabel: difficulty,
    patternId: "SEA-002" as const,
    section: "Reasoning" as const,
    topic: "Seating Arrangement" as const,
    subtopic: "Square Seating" as const,
    generationBackend: "reasoning-v1" as const,
    debugSource: "reasoning-v1-sea-002-cp008-prefreeze-v2-runtime" as const,
    packageSource: "reasoning-v1-sea-002-cp008-prefreeze-v2-runtime" as const,
    packageId: "SEA-002" as const,
    canonicalProblemId: "SEA-CP-008" as const,
    questionLanguageId: qlId,
    qlId,
    questionId: `SEA-CP008-${qlId.slice(-3)}-${language.toUpperCase()}-${id}`,
    language,
    locale: locale(language),
    authorityId: registry.authorityKey,
    authorityLabel: registry.authorityLabel,
    signatureId: registry.signatureId,
    taskKind: registry.authorityKey,
    variantIndex,
    sourceEnglishFingerprint: english.fingerprint,
    localizedFingerprint: localized?.localizedFingerprint ?? null,
    runtimeMode: "QUESTION_STUDIO_BLOCKED_PENDING_APPROVAL" as const,
    reviewStatus: "PREFREEZE_V2_REVIEW_AUTHORITY" as const,
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
      releaseCandidateId: SEA002_CP008_QS_RELEASE_CANDIDATE_V2,
      englishReviewFingerprint: SEA002_CP008_PREFREEZE_AUTHORITY_V2.english.reviewFingerprint,
      localizationReviewFingerprint: SEA002_CP008_PREFREEZE_AUTHORITY_V2.localization.reviewFingerprint,
      productOwnerApprovalStatus: SEA002_CP008_PREFREEZE_AUTHORITY_V2.productOwnerApprovalStatus,
      freezeStatus: SEA002_CP008_PREFREEZE_AUTHORITY_V2.freezeStatus,
    }),
  });
}

export function generateSea002Cp008QuestionStudioPreviewV2(request: Sea002Cp008QuestionStudioRequest) {
  assertSea002Cp008PrefreezeBoundaryV2();
  if (!isSea002Cp008QuestionStudioRequest(request)) throw new Error("Request does not explicitly target SEA-CP-008 V2 pre-integration.");
  const language = normalizeLanguage(request.language);
  const difficulty = normalizeDifficulty(request.difficulty);
  const seed = String(request.seed ?? "sea-cp008-v2-preview");
  const count = Math.max(1, Math.min(20, Math.floor(Number(request.count ?? 1)) || 1));
  const requestedQl = isQl(request.questionLanguageId) ? request.questionLanguageId : null;
  const order = requestedQl ? Object.freeze([requestedQl]) : qlOrder(seed);
  return Object.freeze(Array.from({ length: count }, (_, index) =>
    buildPreviewQuestion(order[index % order.length]!, `${seed}:${index}`, language, difficulty, index),
  ));
}

export function activateSea002Cp008QuestionStudioV2(): never {
  throw new Error("SEA-CP-008 V2 Question Studio activation is blocked until explicit human approval and freeze are recorded.");
}

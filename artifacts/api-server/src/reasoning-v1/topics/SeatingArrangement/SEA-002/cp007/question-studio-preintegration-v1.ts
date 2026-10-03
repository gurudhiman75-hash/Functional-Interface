import { createHash } from "node:crypto";

import { localizeSea002Cp007CandidateV2 } from "./localization/language-fidelity-polish-v2.ts";
import {
  SEA002_CP007_AUTHORITY_TO_PERMANENT_QL,
  SEA002_CP007_PERMANENT_QL_IDS,
  SEA002_CP007_PERMANENT_QL_REGISTRY,
  type Sea002Cp007PermanentQlId,
} from "./permanent/registry.ts";
import {
  generateSea002Cp007ProductionCaselet,
  type Sea002Cp007CandidateAuthorityKey,
} from "./production-caselet-v2.ts";
import { renderSea002Cp007TeacherExplanationV3 } from "./teacher-explanation-v3.ts";
import { SEA002_CP007_PREFREEZE_AUTHORITY_V1, assertSea002Cp007PrefreezeBoundary } from "./review/prefreeze-authority-v1.ts";

export const SEA002_CP007_QS_PACKAGE_ID = "SEA-002" as const;
export const SEA002_CP007_QS_CHECKPOINT_ID = "SEA-CP-007" as const;
export const SEA002_CP007_QS_RELEASE_CANDIDATE_ID = "SEA-002-CP007-QS-PREFREEZE-V1" as const;
export const SEA002_CP007_QS_LANGUAGES = Object.freeze(["en", "hi", "pa"] as const);

export type Sea002Cp007QuestionStudioLanguage = (typeof SEA002_CP007_QS_LANGUAGES)[number];
export type Sea002Cp007QuestionStudioDifficulty = "Easy" | "Medium" | "Hard";

export type Sea002Cp007QuestionStudioRequest = Readonly<{
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

function normalizeLanguage(value: unknown): Sea002Cp007QuestionStudioLanguage {
  const language = String(value ?? "en").trim().toLowerCase();
  if (language === "en" || language === "hi" || language === "pa") return language;
  throw new Error(`SEA-CP-007 does not support Question Studio language ${language}.`);
}

function normalizeDifficulty(value: unknown): Sea002Cp007QuestionStudioDifficulty {
  const difficulty = String(value ?? "Medium").trim().toLowerCase();
  if (difficulty === "easy") return "Easy";
  if (difficulty === "medium" || difficulty === "moderate") return "Medium";
  if (difficulty === "hard") return "Hard";
  throw new Error(`SEA-CP-007 does not support difficulty ${String(value)}.`);
}

function isCp007Ql(value: unknown): value is Sea002Cp007PermanentQlId {
  return SEA002_CP007_PERMANENT_QL_IDS.includes(String(value ?? "") as Sea002Cp007PermanentQlId);
}

export function isSea002Cp007QuestionStudioRequest(request: Sea002Cp007QuestionStudioRequest): boolean {
  const checkpointId = String(request.canonicalProblemId ?? request.cpId ?? "");
  const patternId = normalizeSelector(request.patternId);
  const subtopic = normalizeSelector(request.subtopic);
  return checkpointId === SEA002_CP007_QS_CHECKPOINT_ID
    || isCp007Ql(request.questionLanguageId)
    || patternId.includes("sea cp 007")
    || subtopic === "mixed facing parallel rows"
    || subtopic === "parallel rows mixed facing"
    || subtopic === "same direction parallel rows";
}

function authorityForQl(qlId: Sea002Cp007PermanentQlId): Sea002Cp007CandidateAuthorityKey {
  const entry = SEA002_CP007_PERMANENT_QL_REGISTRY.find((candidate) => candidate.permanentQlId === qlId);
  if (!entry) throw new Error(`${qlId} is not registered for SEA-CP-007.`);
  return entry.authorityKey;
}

function widthForDifficulty(difficulty: Sea002Cp007QuestionStudioDifficulty, authority: Sea002Cp007CandidateAuthorityKey): number {
  if (authority === "CP007-AUTH-04") return difficulty === "Easy" ? 4 : difficulty === "Medium" ? 5 : 6;
  return difficulty === "Easy" ? 3 : difficulty === "Medium" ? 4 : 6;
}

function qlOrder(seed: string): readonly Sea002Cp007PermanentQlId[] {
  const value = createHash("sha256").update(`${seed}:ql-order`).digest().readUInt32BE(0);
  const offset = value % SEA002_CP007_PERMANENT_QL_IDS.length;
  return Object.freeze(Array.from({ length: SEA002_CP007_PERMANENT_QL_IDS.length }, (_, index) =>
    SEA002_CP007_PERMANENT_QL_IDS[(offset + index) % SEA002_CP007_PERMANENT_QL_IDS.length]!,
  ));
}

function localeForLanguage(language: Sea002Cp007QuestionStudioLanguage): "en-IN" | "hi-IN" | "pa-IN" {
  return language === "en" ? "en-IN" : language === "hi" ? "hi-IN" : "pa-IN";
}

function normalizedQuestion(
  qlId: Sea002Cp007PermanentQlId,
  requestSeed: string,
  language: Sea002Cp007QuestionStudioLanguage,
  difficulty: Sea002Cp007QuestionStudioDifficulty,
) {
  assertSea002Cp007PrefreezeBoundary();
  const authority = authorityForQl(qlId);
  const width = widthForDifficulty(difficulty, authority);
  const caselet = generateSea002Cp007ProductionCaselet(`${requestSeed}:${qlId}`, width, authority);
  const localized = language === "en" ? null : localizeSea002Cp007CandidateV2(caselet, language === "hi" ? "hi-IN" : "pa-IN");
  const stem = localized?.stem ?? caselet.stem;
  const question = localized?.question ?? caselet.question;
  const options = localized?.options ?? caselet.options;
  const answer = localized?.answer ?? caselet.answer;
  const explanation = localized?.explanation ?? renderSea002Cp007TeacherExplanationV3(caselet);
  const identity = createHash("sha256")
    .update(JSON.stringify({ qlId, requestSeed, language, difficulty, caseletId: caselet.caseletId }))
    .digest("hex")
    .slice(0, 20);

  return Object.freeze({
    text: `${stem}\n\n${question}`,
    stem: `${stem}\n\n${question}`,
    setupText: stem,
    childStem: question,
    options: Object.freeze([...options]),
    correct: caselet.correctIndex,
    correctIndex: caselet.correctIndex,
    answer,
    explanation,
    difficulty,
    difficultyLabel: difficulty,
    patternId: SEA002_CP007_QS_PACKAGE_ID,
    section: "Reasoning",
    topic: "Seating Arrangement",
    subtopic: "Two Parallel Rows — Same Direction / Mixed Facing",
    generationBackend: "reasoning-v1",
    debugSource: "reasoning-v1-sea-002-cp007-prefreeze-runtime",
    packageSource: "reasoning-v1-sea-002-cp007-prefreeze-runtime",
    packageId: SEA002_CP007_QS_PACKAGE_ID,
    canonicalProblemId: SEA002_CP007_QS_CHECKPOINT_ID,
    questionLanguageId: qlId,
    qlId,
    questionId: `SEA-CP007-${qlId.slice(-3)}-${language.toUpperCase()}-${identity}`,
    caseletId: caselet.caseletId,
    language,
    locale: localeForLanguage(language),
    authorityId: authority,
    authorityLabel: SEA002_CP007_PERMANENT_QL_REGISTRY.find((entry) => entry.permanentQlId === qlId)!.authorityLabel,
    taskKind: authority,
    mathematicalFingerprint: caselet.mathematicalFingerprint,
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
      releaseCandidateId: SEA002_CP007_QS_RELEASE_CANDIDATE_ID,
      englishReviewFingerprint: SEA002_CP007_PREFREEZE_AUTHORITY_V1.english.reviewFingerprint,
      localizationReviewFingerprint: SEA002_CP007_PREFREEZE_AUTHORITY_V1.localization.reviewFingerprint,
      productOwnerApprovalStatus: SEA002_CP007_PREFREEZE_AUTHORITY_V1.productOwnerApprovalStatus,
      freezeStatus: SEA002_CP007_PREFREEZE_AUTHORITY_V1.freezeStatus,
      canonicalParityFingerprint: localized?.canonicalParityFingerprint ?? null,
    }),
  });
}

export function generateSea002Cp007QuestionStudioPreview(request: Sea002Cp007QuestionStudioRequest) {
  assertSea002Cp007PrefreezeBoundary();
  if (!isSea002Cp007QuestionStudioRequest(request)) {
    throw new Error("Request does not explicitly target SEA-CP-007 pre-integration.");
  }
  const language = normalizeLanguage(request.language);
  const difficulty = normalizeDifficulty(request.difficulty);
  const seed = String(request.seed ?? "sea-cp007-preview");
  const count = Math.max(1, Math.min(20, Math.floor(Number(request.count ?? 1)) || 1));
  const requestedQl = isCp007Ql(request.questionLanguageId) ? request.questionLanguageId : null;
  const order = requestedQl ? Object.freeze([requestedQl]) : qlOrder(seed);
  return Object.freeze(Array.from({ length: count }, (_, index) => {
    const qlId = order[index % order.length]!;
    return normalizedQuestion(qlId, `${seed}:${index}`, language, difficulty);
  }));
}

export function activateSea002Cp007QuestionStudio(): never {
  throw new Error("SEA-CP-007 Question Studio activation is blocked until explicit human approval and freeze are recorded.");
}

export const SEA002_CP007_QS_AUTHORITY_TO_QL = SEA002_CP007_AUTHORITY_TO_PERMANENT_QL;

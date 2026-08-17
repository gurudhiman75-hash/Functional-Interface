import { createHash } from "node:crypto";

import {
  runTmw001ChapterPipeline,
  type Tmw001ChapterLanguage,
} from "./foundation/chapter-localized-runtime";
import { TMW_001_FINAL_FREEZE_AUTHORITY } from "./foundation/final-freeze-authority";

export const TMW_001_QUESTION_STUDIO_PACKAGE_ID = "TMW-001" as const;
export const TMW_001_QUESTION_STUDIO_LANGUAGES = ["en", "hi", "pa"] as const;
export const TMW_001_QUESTION_STUDIO_CP_IDS = [
  "TMW-CP-001",
  "TMW-CP-002",
  "TMW-CP-003",
  "TMW-CP-004",
  "TMW-CP-005",
  "TMW-CP-006",
  "TMW-CP-007",
  "TMW-CP-008",
  "TMW-CP-009",
  "TMW-CP-010",
  "TMW-CP-011",
  "TMW-CP-012",
  "TMW-CP-013",
  "TMW-CP-014",
] as const;

export type Tmw001QuestionStudioCpId = typeof TMW_001_QUESTION_STUDIO_CP_IDS[number];
export type Tmw001QuestionStudioLanguage = typeof TMW_001_QUESTION_STUDIO_LANGUAGES[number];
export type Tmw001QuestionStudioDifficulty = "Easy" | "Medium" | "Hard";
export type Tmw001QuestionStudioQlId = `TMW-QL-${string}`;

export interface Tmw001QuestionStudioOptions {
  canonicalProblemId?: Tmw001QuestionStudioCpId;
  questionLanguageId?: string;
  difficulty?: Tmw001QuestionStudioDifficulty;
  language?: Tmw001QuestionStudioLanguage;
  seed?: string;
}

export interface Tmw001QuestionStudioQlDescriptor {
  qlId: Tmw001QuestionStudioQlId;
  checkpointId: Tmw001QuestionStudioCpId;
}

const CHECKPOINT_RANGES: ReadonlyArray<readonly [Tmw001QuestionStudioCpId, number, number]> = [
  ["TMW-CP-001", 1, 20],
  ["TMW-CP-002", 21, 34],
  ["TMW-CP-003", 35, 57],
  ["TMW-CP-004", 58, 81],
  ["TMW-CP-005", 82, 105],
  ["TMW-CP-006", 106, 127],
  ["TMW-CP-007", 128, 143],
  ["TMW-CP-008", 144, 156],
  ["TMW-CP-009", 157, 174],
  ["TMW-CP-010", 175, 192],
  ["TMW-CP-011", 193, 211],
  ["TMW-CP-012", 212, 215],
  ["TMW-CP-013", 216, 223],
  ["TMW-CP-014", 224, 228],
];

function ql(number: number): Tmw001QuestionStudioQlId {
  return `TMW-QL-${String(number).padStart(3, "0")}` as Tmw001QuestionStudioQlId;
}

export const TMW_001_QUESTION_STUDIO_QLS: readonly Tmw001QuestionStudioQlDescriptor[] = Object.freeze(
  CHECKPOINT_RANGES.flatMap(([checkpointId, start, end]) =>
    Array.from({ length: end - start + 1 }, (_, index) =>
      Object.freeze({ qlId: ql(start + index), checkpointId }),
    ),
  ),
);

if (TMW_001_QUESTION_STUDIO_QLS.length !== TMW_001_FINAL_FREEZE_AUTHORITY.qlCount) {
  throw new Error(`TMW Question Studio expected ${TMW_001_FINAL_FREEZE_AUTHORITY.qlCount} frozen QLs, found ${TMW_001_QUESTION_STUDIO_QLS.length}.`);
}

export function inferTmw001QuestionStudioCpFromQl(value: unknown): Tmw001QuestionStudioCpId | undefined {
  const qlId = String(value ?? "");
  return TMW_001_QUESTION_STUDIO_QLS.find((entry) => entry.qlId === qlId)?.checkpointId;
}

export function getTmw001QuestionStudioQlIds(checkpointId?: Tmw001QuestionStudioCpId) {
  return TMW_001_QUESTION_STUDIO_QLS
    .filter((entry) => !checkpointId || entry.checkpointId === checkpointId)
    .map((entry) => entry.qlId);
}

function seededHash(value: string) {
  const digest = createHash("sha256").update(value).digest();
  return digest.readUInt32BE(0);
}

function normalizeDifficulty(value: unknown): Tmw001QuestionStudioDifficulty {
  if (typeof value === "number" && Number.isFinite(value)) {
    if (value >= 6) return "Hard";
    if (value >= 3) return "Medium";
    return "Easy";
  }
  const text = String(value ?? "").trim().toLowerCase();
  if (text === "easy") return "Easy";
  if (text === "hard") return "Hard";
  return "Medium";
}

function visibleExplanation(question: any): string[] {
  if (question?.learnerExplanation) {
    return [
      question.learnerExplanation.method,
      ...(Array.isArray(question.learnerExplanation.solution) ? question.learnerExplanation.solution : []),
      question.learnerExplanation.answer,
    ].filter((line): line is string => typeof line === "string" && line.trim().length > 0);
  }
  const explanation = question?.explanation ?? {};
  return [
    explanation.opening,
    ...(Array.isArray(explanation.givens) ? explanation.givens : []),
    explanation.formula,
    ...(Array.isArray(explanation.steps) ? explanation.steps : []),
    ...(Array.isArray(explanation.shortcut?.steps) ? explanation.shortcut.steps : []),
    explanation.commonTrap?.explanation,
    explanation.conclusion,
  ].filter((line): line is string => typeof line === "string" && line.trim().length > 0);
}

function solvedAnswer(question: any): string {
  return String(
    question?.solution?.answerText
      ?? question?.answerText
      ?? question?.canonicalAnswer
      ?? question?.options?.[question?.correctIndex]
      ?? "",
  );
}

function normalizePackage(question: any, language: Tmw001QuestionStudioLanguage, seed: string) {
  const answer = solvedAnswer(question);
  const explanationLines = visibleExplanation(question);
  const difficultyBand = normalizeDifficulty(
    question?.difficulty ?? question?.difficultyBand ?? question?.difficultyLevel,
  );
  const originalValidation = question?.validation ?? {};
  const validationErrors = Array.isArray(originalValidation.errors)
    ? originalValidation.errors.map(String)
    : [];
  const validationOk = originalValidation.valid !== false
    && originalValidation.ok !== false
    && validationErrors.length === 0;
  const identity = createHash("sha256")
    .update(JSON.stringify({
      ql: question.questionLanguageId,
      language,
      seed,
      stem: question.stem,
      options: question.options,
      answer,
    }))
    .digest("hex")
    .slice(0, 20);

  return Object.freeze({
    packageId: TMW_001_QUESTION_STUDIO_PACKAGE_ID,
    canonicalProblemId: question.canonicalProblemId,
    questionLanguageId: question.questionLanguageId,
    explanationId: `${question.questionLanguageId}-EXP-${language.toUpperCase()}`,
    questionId: `TMW-${question.questionLanguageId.slice(-3)}-${language.toUpperCase()}-${identity}`,
    stem: String(question.stem),
    options: Object.freeze([...question.options].map(String)),
    correctIndex: Number(question.correctIndex),
    answer,
    difficultyBand,
    language,
    locale: language === "en" ? "en-IN" : language === "hi" ? "hi-IN" : "pa-IN",
    runtimeMode: "QUESTION_STUDIO_ACTIVE" as const,
    reviewStatus: "FROZEN_MULTILINGUAL_CONTENT_AUTHORITY" as const,
    questionBankStatus: "NOT_STORED" as const,
    testEligibility: "INELIGIBLE" as const,
    publiclyPublishable: false as const,
    explanation: Object.freeze({ lines: Object.freeze(explanationLines) }),
    learnerExplanation: question.learnerExplanation,
    learnerExplanationVersion: question.learnerExplanationVersion,
    representation: question.representation,
    presentationBlocks: question.presentationBlocks,
    caseletGroupId: question.caseletGroupId,
    caseletStimulus: question.caseletStimulus,
    solveMode: question.solveMode,
    validation: Object.freeze({
      ok: validationOk,
      valid: validationOk,
      errors: Object.freeze(validationErrors),
      source: originalValidation,
    }),
    traceability: Object.freeze({
      releaseId: "TMW-001-FROZEN-228-MULTILINGUAL-V1",
      sourceAuthorityHead: TMW_001_FINAL_FREEZE_AUTHORITY.sourceAuthorityHead,
      freezeStatus: TMW_001_FINAL_FREEZE_AUTHORITY.status,
      permanentQlId: question.questionLanguageId,
      checkpointId: question.canonicalProblemId,
      mathematicalFingerprint: question.mathematicalFingerprint,
      solveMode: question.solveMode,
      representation: question.representation,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    }),
  });
}

function generateDescriptor(
  descriptor: Tmw001QuestionStudioQlDescriptor,
  language: Tmw001QuestionStudioLanguage,
  seed: string,
) {
  const question = runTmw001ChapterPipeline({
    questionLanguageId: descriptor.qlId,
    language: language as Tmw001ChapterLanguage,
    seed,
  });
  if (question?.questionLanguageId !== descriptor.qlId) {
    throw new Error(`${descriptor.qlId}: frozen runtime identity drift.`);
  }
  if (question?.canonicalProblemId !== descriptor.checkpointId) {
    throw new Error(`${descriptor.qlId}: expected ${descriptor.checkpointId}, got ${String(question?.canonicalProblemId)}.`);
  }
  if (question?.publiclyPublishable !== false) {
    throw new Error(`${descriptor.qlId}: frozen publication lock is open.`);
  }
  return normalizePackage(question, language, seed);
}

export function runTmw001QuestionStudioPipeline(options: Tmw001QuestionStudioOptions = {}) {
  const language = options.language ?? "en";
  if (!TMW_001_QUESTION_STUDIO_LANGUAGES.includes(language)) {
    throw new Error(`TMW-001 does not support Question Studio language ${language}.`);
  }
  const explicitQl = options.questionLanguageId as Tmw001QuestionStudioQlId | undefined;
  const explicitDescriptor = explicitQl
    ? TMW_001_QUESTION_STUDIO_QLS.find((entry) => entry.qlId === explicitQl)
    : undefined;
  if (explicitQl && !explicitDescriptor) throw new Error(`Unknown frozen TMW QL '${explicitQl}'.`);

  const inferredCp = explicitDescriptor?.checkpointId;
  if (options.canonicalProblemId && inferredCp && options.canonicalProblemId !== inferredCp) {
    throw new Error(`${explicitQl} is owned by ${inferredCp}, not ${options.canonicalProblemId}.`);
  }
  if (options.canonicalProblemId && !TMW_001_QUESTION_STUDIO_CP_IDS.includes(options.canonicalProblemId)) {
    throw new Error(`Unknown canonical problem '${options.canonicalProblemId}' for package TMW-001.`);
  }

  const pool = explicitDescriptor
    ? [explicitDescriptor]
    : TMW_001_QUESTION_STUDIO_QLS.filter(
      (entry) => !options.canonicalProblemId || entry.checkpointId === options.canonicalProblemId,
    );
  if (!pool.length) throw new Error("No frozen TMW Question Studio QLs match the requested scope.");

  const baseSeed = options.seed?.trim() || `quant-v4:TMW-001:${options.canonicalProblemId ?? "mixed"}:${language}`;
  const offset = seededHash(`${baseSeed}:ql-offset`) % pool.length;
  const attempts = explicitDescriptor ? 80 : Math.max(600, pool.length * 16);

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const descriptor = pool[(offset + attempt) % pool.length]!;
    const seed = `${baseSeed}:${descriptor.checkpointId}:${descriptor.qlId}:${attempt}`;
    const pkg = generateDescriptor(descriptor, language, seed);
    if (!options.difficulty || pkg.difficultyBand === options.difficulty) return pkg;
  }

  const scope = explicitQl ?? options.canonicalProblemId ?? "full chapter";
  throw new Error(
    options.difficulty
      ? `Unable to generate ${options.difficulty} TMW-001 content from ${scope}.`
      : `Unable to generate TMW-001 content from ${scope}.`,
  );
}

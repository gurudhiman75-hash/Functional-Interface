import { createHash } from "node:crypto";

import {
  runTmw001ChapterPipeline,
  type Tmw001ChapterLanguage,
} from "./foundation/chapter-localized-runtime";
import { TMW_CP001_REGISTRY } from "./foundation/cp001-registry";
import { TMW_CP002_REGISTRY } from "./foundation/cp002-registry";
import { TMW_CP003_REGISTRY } from "./foundation/cp003-registry";
import { TMW_CP004_REGISTRY } from "./foundation/cp004-registry";
import { TMW_CP005_REGISTRY } from "./foundation/cp005-registry";
import { TMW_CP006_REGISTRY } from "./foundation/cp006-registry";
import { TMW_CP007_REGISTRY } from "./foundation/cp007-registry";
import { TMW_CP008_REGISTRY } from "./foundation/cp008-registry";
import { TMW_CP009_REGISTRY } from "./foundation/cp009-registry";
import { TMW_CP010_REGISTRY } from "./foundation/cp010-registry";
import { TMW_CP_011_REGISTRY } from "./foundation/cp011-registry";
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
  difficulty: Tmw001QuestionStudioDifficulty;
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

const LEGACY_FROZEN_REGISTRIES = [
  TMW_CP001_REGISTRY,
  TMW_CP002_REGISTRY,
  TMW_CP003_REGISTRY,
  TMW_CP004_REGISTRY,
  TMW_CP005_REGISTRY,
  TMW_CP006_REGISTRY,
  TMW_CP007_REGISTRY,
  TMW_CP008_REGISTRY,
  TMW_CP009_REGISTRY,
  TMW_CP010_REGISTRY,
  TMW_CP_011_REGISTRY,
] as const;

const EXTENSION_DIFFICULTIES: ReadonlyArray<readonly [Tmw001QuestionStudioQlId, Tmw001QuestionStudioDifficulty]> = [
  ["TMW-QL-212", "Medium"],
  ["TMW-QL-213", "Hard"],
  ["TMW-QL-214", "Hard"],
  ["TMW-QL-215", "Hard"],
  ["TMW-QL-216", "Medium"],
  ["TMW-QL-217", "Medium"],
  ["TMW-QL-218", "Hard"],
  ["TMW-QL-219", "Medium"],
  ["TMW-QL-220", "Medium"],
  ["TMW-QL-221", "Medium"],
  ["TMW-QL-222", "Hard"],
  ["TMW-QL-223", "Hard"],
  ["TMW-QL-224", "Medium"],
  ["TMW-QL-225", "Medium"],
  ["TMW-QL-226", "Hard"],
  ["TMW-QL-227", "Medium"],
  ["TMW-QL-228", "Hard"],
];

const FROZEN_DIFFICULTY_BY_QL = new Map<string, Tmw001QuestionStudioDifficulty>();
for (const registry of LEGACY_FROZEN_REGISTRIES) {
  for (const entry of registry) {
    const difficulty = entry.difficulty as Tmw001QuestionStudioDifficulty;
    if (!(["Easy", "Medium", "Hard"] as const).includes(difficulty)) {
      throw new Error(`${entry.qlId}: unsupported frozen difficulty ${String(entry.difficulty)}.`);
    }
    if (FROZEN_DIFFICULTY_BY_QL.has(entry.qlId)) {
      throw new Error(`${entry.qlId}: duplicate frozen difficulty registration.`);
    }
    FROZEN_DIFFICULTY_BY_QL.set(entry.qlId, difficulty);
  }
}
for (const [qlId, difficulty] of EXTENSION_DIFFICULTIES) {
  if (FROZEN_DIFFICULTY_BY_QL.has(qlId)) {
    throw new Error(`${qlId}: duplicate extension difficulty registration.`);
  }
  FROZEN_DIFFICULTY_BY_QL.set(qlId, difficulty);
}

function frozenDifficulty(qlId: Tmw001QuestionStudioQlId): Tmw001QuestionStudioDifficulty {
  const difficulty = FROZEN_DIFFICULTY_BY_QL.get(qlId);
  if (!difficulty) throw new Error(`${qlId}: frozen difficulty metadata is missing.`);
  return difficulty;
}

export const TMW_001_QUESTION_STUDIO_QLS: readonly Tmw001QuestionStudioQlDescriptor[] = Object.freeze(
  CHECKPOINT_RANGES.flatMap(([checkpointId, start, end]) =>
    Array.from({ length: end - start + 1 }, (_, index) => {
      const qlId = ql(start + index);
      return Object.freeze({ qlId, checkpointId, difficulty: frozenDifficulty(qlId) });
    }),
  ),
);

if (FROZEN_DIFFICULTY_BY_QL.size !== TMW_001_FINAL_FREEZE_AUTHORITY.qlCount) {
  throw new Error(`TMW Question Studio expected ${TMW_001_FINAL_FREEZE_AUTHORITY.qlCount} frozen difficulty records, found ${FROZEN_DIFFICULTY_BY_QL.size}.`);
}
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

function normalizePackage(
  question: any,
  language: Tmw001QuestionStudioLanguage,
  seed: string,
  difficultyBand: Tmw001QuestionStudioDifficulty,
) {
  const answer = solvedAnswer(question);
  const explanationLines = visibleExplanation(question);
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
      frozenDifficulty: difficultyBand,
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
  return normalizePackage(question, language, seed, descriptor.difficulty);
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
  if (explicitDescriptor && options.difficulty && explicitDescriptor.difficulty !== options.difficulty) {
    throw new Error(`${explicitDescriptor.qlId} is frozen as ${explicitDescriptor.difficulty}, not ${options.difficulty}.`);
  }

  const pool = explicitDescriptor
    ? [explicitDescriptor]
    : TMW_001_QUESTION_STUDIO_QLS.filter(
      (entry) =>
        (!options.canonicalProblemId || entry.checkpointId === options.canonicalProblemId)
        && (!options.difficulty || entry.difficulty === options.difficulty),
    );
  if (!pool.length) {
    const scope = options.canonicalProblemId ?? "full chapter";
    throw new Error(
      options.difficulty
        ? `No ${options.difficulty} frozen TMW-001 QLs are registered in ${scope}.`
        : `No frozen TMW-001 Question Studio QLs match ${scope}.`,
    );
  }

  const baseSeed = options.seed?.trim() || `quant-v4:TMW-001:${options.canonicalProblemId ?? "mixed"}:${language}`;
  const descriptor = pool[seededHash(`${baseSeed}:ql-offset`) % pool.length]!;
  const seed = `${baseSeed}:${descriptor.checkpointId}:${descriptor.qlId}`;
  return generateDescriptor(descriptor, language, seed);
}

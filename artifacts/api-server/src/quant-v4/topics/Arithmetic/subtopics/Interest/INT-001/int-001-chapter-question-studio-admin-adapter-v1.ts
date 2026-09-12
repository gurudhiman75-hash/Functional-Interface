import { createHash } from "node:crypto";

import { generateIntCp001QuestionStudioBatch, listIntCp001QuestionStudioPackages } from "./cp001-question-studio-integration-v1";
import { generateIntCp002QuestionStudioBatch, listIntCp002QuestionStudioPackages } from "./cp002-question-studio-integration-v1";
import { generateIntCp003QuestionStudioBatch, listIntCp003QuestionStudioPackages } from "./cp003-question-studio-integration-v1";
import { INT_CP004_QUESTION_STUDIO_REVIEW_PACKAGE, previewIntCp004QuestionStudioReview } from "./cp004-question-studio-review-adapter";
import { generateIntCp005QuestionStudioBatch, listIntCp005QuestionStudioPackages } from "./cp005-question-studio-integration-v1";
import { generateIntCp006QuestionStudioBatch, listIntCp006QuestionStudioPackages } from "./cp006-question-studio-integration-v1";
import { INT_CP007_QUESTION_STUDIO_REVIEW_PACKAGE, previewIntCp007QuestionStudioReview } from "./cp007-question-studio-review-adapter";
import { generateIntCp008QuestionStudioBatch, listIntCp008QuestionStudioPackages } from "./cp008-question-studio-integration-v1";
import { generateIntCp009QuestionStudioBatch, listIntCp009QuestionStudioPackages } from "./cp009-question-studio-integration-v2";
import { generateIntCp010QuestionStudioBatch, listIntCp010QuestionStudioPackages } from "./cp010-question-studio-integration-v1";
import { generateInt001Wave06QuestionStudioBatch } from "./int-001-wave06-question-studio-integration-v1";

export const INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_VERSION = "INT-001-CHAPTER-ADMIN-QS-v1" as const;
export const INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_PACKAGE_ID = "INT-001" as const;
export const INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_LANGUAGES = Object.freeze(["en", "hi", "pa"] as const);
export const INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_CHECKPOINTS = Object.freeze([
  "INT-CP-001", "INT-CP-002", "INT-CP-003", "INT-CP-004", "INT-CP-005",
  "INT-CP-006", "INT-CP-007", "INT-CP-008", "INT-CP-009", "INT-CP-010",
] as const);

export type Int001ChapterAdminLanguage = (typeof INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_LANGUAGES)[number];
export type Int001ChapterAdminCheckpoint = (typeof INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_CHECKPOINTS)[number];

export type Int001ChapterAdminRequest = Readonly<{
  checkpointId?: string;
  cpId?: string;
  qlId?: string;
  questionLanguageId?: string;
  language?: string;
  seed?: string;
  count?: number;
}>;

type Generator = (request: any) => Promise<any>;
type Surface = Readonly<{
  checkpointId: Int001ChapterAdminCheckpoint;
  label: string;
  qlIds: readonly string[];
  generate: (qlId: string, language: Int001ChapterAdminLanguage, seed: string) => Promise<any>;
}>;

function firstPackage(list: readonly any[]) {
  if (list.length !== 1) throw new Error("Interest Question Studio checkpoint must expose exactly one package descriptor.");
  return list[0];
}

function qlIdsOf(pkg: any): readonly string[] {
  const ids = pkg?.permanentQlIds ?? pkg?.qlIds;
  if (!Array.isArray(ids) || ids.length === 0) throw new Error("Interest Question Studio package is missing permanent QL ownership.");
  return Object.freeze(ids.map(String));
}

async function fromBatch(generator: Generator, qlId: string, language: Int001ChapterAdminLanguage, seed: string) {
  const result = await generator({ qlId, questionLanguageId: qlId, language, seed, count: 1 });
  if (result?.questions?.length !== 1) throw new Error(`${qlId}/${language}: expected one Interest Question Studio question.`);
  return result.questions[0];
}

function fromCp004(qlId: string, language: Int001ChapterAdminLanguage, seed: string) {
  const result = previewIntCp004QuestionStudioReview({ qlId: qlId as any, language, seed, count: 1 });
  if (result.questions.length !== 1) throw new Error(`${qlId}/${language}: expected one CP004 Question Studio question.`);
  return result.questions[0];
}

function fromCp007(qlId: string, language: Int001ChapterAdminLanguage, seed: string) {
  const result = previewIntCp007QuestionStudioReview({ qlId: qlId as any, language, seed, count: 1 });
  if (result.questions.length !== 1) throw new Error(`${qlId}/${language}: expected one CP007 Question Studio question.`);
  return result.questions[0];
}

const cp001 = firstPackage(listIntCp001QuestionStudioPackages());
const cp002 = firstPackage(listIntCp002QuestionStudioPackages());
const cp003 = firstPackage(listIntCp003QuestionStudioPackages());
const cp005 = firstPackage(listIntCp005QuestionStudioPackages());
const cp006 = firstPackage(listIntCp006QuestionStudioPackages());
const cp008 = firstPackage(listIntCp008QuestionStudioPackages());
const cp009 = firstPackage(listIntCp009QuestionStudioPackages());
const cp010 = firstPackage(listIntCp010QuestionStudioPackages());

const NEW_QL_OWNER = Object.freeze({
  "INT-QL-132": "INT-CP-010",
  "INT-QL-133": "INT-CP-010",
  "INT-QL-134": "INT-CP-007",
} satisfies Record<string, Int001ChapterAdminCheckpoint>);

const NEW_QLS = new Set(Object.keys(NEW_QL_OWNER));

const baseSurfaces: readonly Surface[] = Object.freeze([
  { checkpointId: "INT-CP-001", label: "Simple Interest Core", qlIds: qlIdsOf(cp001), generate: (q, l, s) => fromBatch(generateIntCp001QuestionStudioBatch, q, l, s) },
  { checkpointId: "INT-CP-002", label: "Simple Interest Ledgers & Applications", qlIds: qlIdsOf(cp002), generate: (q, l, s) => fromBatch(generateIntCp002QuestionStudioBatch, q, l, s) },
  { checkpointId: "INT-CP-003", label: "Compound Interest Core", qlIds: qlIdsOf(cp003), generate: (q, l, s) => fromBatch(generateIntCp003QuestionStudioBatch, q, l, s) },
  { checkpointId: "INT-CP-004", label: "Compound Interest Frequencies", qlIds: qlIdsOf(INT_CP004_QUESTION_STUDIO_REVIEW_PACKAGE), generate: async (q, l, s) => fromCp004(q, l, s) },
  { checkpointId: "INT-CP-005", label: "CI Growth, Difference & Inverses", qlIds: qlIdsOf(cp005), generate: (q, l, s) => fromBatch(generateIntCp005QuestionStudioBatch, q, l, s) },
  { checkpointId: "INT-CP-006", label: "Installments & Recurring Interest", qlIds: qlIdsOf(cp006), generate: (q, l, s) => fromBatch(generateIntCp006QuestionStudioBatch, q, l, s) },
  { checkpointId: "INT-CP-007", label: "Scheme Comparison & Borrow/Lend", qlIds: qlIdsOf(INT_CP007_QUESTION_STUDIO_REVIEW_PACKAGE), generate: async (q, l, s) => fromCp007(q, l, s) },
  { checkpointId: "INT-CP-008", label: "Present Value & Depreciation", qlIds: qlIdsOf(cp008), generate: (q, l, s) => fromBatch(generateIntCp008QuestionStudioBatch, q, l, s) },
  { checkpointId: "INT-CP-009", label: "Dated Cash Flows", qlIds: qlIdsOf(cp009), generate: (q, l, s) => fromBatch(generateIntCp009QuestionStudioBatch, q, l, s) },
  { checkpointId: "INT-CP-010", label: "Variable-Rate Loans & Sequential SI/CI", qlIds: qlIdsOf(cp010), generate: (q, l, s) => fromBatch(generateIntCp010QuestionStudioBatch, q, l, s) },
]);

function extendedQls(surface: Surface): readonly string[] {
  const additions = Object.entries(NEW_QL_OWNER)
    .filter(([, owner]) => owner === surface.checkpointId)
    .map(([qlId]) => qlId);
  return Object.freeze([...surface.qlIds, ...additions]);
}

const logicalSurfaces: readonly Surface[] = Object.freeze(baseSurfaces.map((surface) => Object.freeze({
  ...surface,
  qlIds: extendedQls(surface),
})));

const checkpointMap = new Map(logicalSurfaces.map((surface) => [surface.checkpointId, surface]));
const qlOwnerMap = new Map<string, Int001ChapterAdminCheckpoint>();
for (const surface of logicalSurfaces) {
  for (const qlId of surface.qlIds) {
    if (qlOwnerMap.has(qlId)) throw new Error(`${qlId}: duplicate logical Interest checkpoint ownership.`);
    qlOwnerMap.set(qlId, surface.checkpointId);
  }
}

function languageOf(value: unknown): Int001ChapterAdminLanguage {
  const language = String(value ?? "en").trim().toLowerCase();
  if ((INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_LANGUAGES as readonly string[]).includes(language)) return language as Int001ChapterAdminLanguage;
  throw new Error(`Interest does not support language '${language}'.`);
}

function checkpointOf(value: unknown): Int001ChapterAdminCheckpoint | undefined {
  const checkpointId = String(value ?? "").trim().toUpperCase();
  if (!checkpointId) return undefined;
  if (checkpointMap.has(checkpointId as Int001ChapterAdminCheckpoint)) return checkpointId as Int001ChapterAdminCheckpoint;
  throw new Error(`Unknown Interest checkpoint '${checkpointId}'.`);
}

function qlOf(value: unknown): string | undefined {
  const qlId = String(value ?? "").trim().toUpperCase();
  if (!qlId) return undefined;
  if (qlOwnerMap.has(qlId)) return qlId;
  throw new Error(`${qlId} is not a permanent Interest QL.`);
}

function stableScore(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function optionText(option: any): string {
  if (typeof option === "string") return option.trim();
  return String(option?.text ?? option?.display ?? option?.value ?? option?.label ?? "").trim();
}

function explanationLines(question: any): readonly string[] {
  const candidates: unknown[] = [];
  const explanation = question?.packageExplanation ?? question?.richExplanation ?? question?.explanation;
  if (typeof explanation === "string") candidates.push(...explanation.split(/\n+/u));
  if (Array.isArray(explanation)) candidates.push(...explanation);
  if (explanation && typeof explanation === "object") {
    if (Array.isArray(explanation.lines)) candidates.push(...explanation.lines);
    if (Array.isArray(explanation.steps)) candidates.push(...explanation.steps);
    if (Array.isArray(explanation.workedSteps)) candidates.push(...explanation.workedSteps);
    candidates.push(explanation.conclusion, explanation.finalAnswer, explanation.shortcut, explanation.examShortcut);
  }
  const lines = candidates.map((line) => String(line ?? "").trim()).filter(Boolean);
  return Object.freeze([...new Set(lines)]);
}

async function sourceQuestion(qlId: string, language: Int001ChapterAdminLanguage, seed: string) {
  const owner = qlOwnerMap.get(qlId);
  if (!owner) throw new Error(`${qlId}: missing Interest checkpoint owner.`);
  if (NEW_QLS.has(qlId)) {
    return fromBatch(generateInt001Wave06QuestionStudioBatch, qlId, language, seed);
  }
  const surface = checkpointMap.get(owner)!;
  return surface.generate(qlId, language, seed);
}

function normalizeQuestion(source: any, checkpointId: Int001ChapterAdminCheckpoint, qlId: string, language: Int001ChapterAdminLanguage, requestSeed: string) {
  const stem = String(source?.stem ?? source?.text ?? "").trim();
  const options = Object.freeze((source?.options ?? []).map(optionText));
  const correctIndex = Number(source?.correctIndex ?? source?.correct);
  const answer = String(source?.answer ?? source?.correctAnswer ?? source?.canonicalAnswer?.display ?? source?.canonicalAnswer?.value ?? options[correctIndex] ?? "").trim();
  const lines = explanationLines(source);
  if (stem.length < 10) throw new Error(`${qlId}/${language}: learner stem is empty or too thin.`);
  if (options.length !== 4 || options.some((option) => !option) || new Set(options).size !== 4) throw new Error(`${qlId}/${language}: expected four unique options.`);
  if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex > 3 || options[correctIndex] !== answer) throw new Error(`${qlId}/${language}: answer ownership is invalid.`);
  if (!lines.length) throw new Error(`${qlId}/${language}: learner explanation is missing.`);
  if (source?.questionBankWritable === true || source?.testEligible === true || source?.mockTestEligible === true || source?.publiclyPublishable === true) {
    throw new Error(`${qlId}/${language}: downstream lifecycle boundary is unexpectedly open.`);
  }
  const sourceCanonicalProblemId = String(source?.canonicalProblemId ?? source?.parameters?.checkpointId ?? checkpointId);
  const integrationAuthority = String(source?.integrationAuthority ?? source?.generationContext?.integrationAuthority ?? INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_VERSION);
  const questionId = String(source?.questionId ?? `${checkpointId}:${qlId}:${language}:${stableScore(requestSeed).slice(0, 16)}`);
  const locale = String(source?.locale ?? (language === "en" ? "en-IN" : language === "hi" ? "hi-IN" : "pa-IN"));
  const difficultyBand = String(source?.difficultyBand ?? source?.difficultyLabel ?? source?.difficulty ?? "Medium");
  return Object.freeze({
    packageId: INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_PACKAGE_ID,
    chapterId: INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_PACKAGE_ID,
    checkpointId,
    canonicalProblemId: checkpointId,
    sourceCanonicalProblemId,
    qlId,
    permanentQlId: qlId,
    questionId,
    canonicalItemId: String(source?.canonicalItemId ?? `${qlId}:${requestSeed}`),
    questionLanguageId: `${qlId}:${language}`,
    language,
    locale,
    difficultyBand,
    stem,
    options,
    correctIndex,
    answer,
    explanationLines: lines,
    runtimeMode: String(source?.runtimeMode ?? "QUESTION_STUDIO_ACTIVE"),
    reviewStatus: String(source?.reviewStatus ?? "FROZEN_MULTILINGUAL_CONTENT_AUTHORITY"),
    integrationAuthority,
    chapterIntegrationAuthority: INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_VERSION,
    seed: String(source?.seed ?? source?.requestSeed ?? source?.parameters?.seed ?? requestSeed),
    questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY" as const,
    questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED" as const,
    questionBankStatus: "NOT_STORED" as const,
    questionBankWritable: false as const,
    testEligibility: "INELIGIBLE" as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    automaticStudentPublication: false as const,
    manualApprovalRequired: true as const,
    traceability: Object.freeze({
      ...(source?.traceability ?? {}),
      permanentQlId: qlId,
      logicalCheckpointId: checkpointId,
      sourceCanonicalProblemId,
      chapterIntegrationAuthority: INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_VERSION,
    }),
  });
}

export const INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_PACKAGE = Object.freeze({
  id: INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_PACKAGE_ID,
  packageId: INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_PACKAGE_ID,
  chapterId: INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_PACKAGE_ID,
  name: "INT-001 Interest — Complete Trilingual Question Studio",
  label: "Interest · 133 permanent QLs · EN/HI/PA",
  subject: "Quantitative Aptitude",
  topic: "Arithmetic",
  subtopic: "Interest",
  generationDomain: "quant-v4",
  supportedLanguages: INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_LANGUAGES,
  permanentQlIds: Object.freeze([...qlOwnerMap.keys()].sort()),
  permanentQlCount: qlOwnerMap.size,
  checkpointCount: logicalSurfaces.length,
  checkpoints: Object.freeze(logicalSurfaces.map((surface) => Object.freeze({
    checkpointId: surface.checkpointId,
    label: surface.label,
    qlIds: surface.qlIds,
    permanentQlCount: surface.qlIds.length,
  }))),
  runtimeMode: "QUESTION_STUDIO_ACTIVE" as const,
  reviewOnly: true as const,
  questionStudioDiscoverable: true as const,
  questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY" as const,
  questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED" as const,
  persistenceAllowed: true as const,
  databaseWriteEnabled: true as const,
  questionBankStatus: "NOT_STORED" as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
  integrationAuthority: INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_VERSION,
});

export function listInt001ChapterAdminQuestionStudioCheckpoints() {
  return INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_PACKAGE.checkpoints;
}

export function ownerOfInt001PermanentQl(qlId: string) {
  return qlOwnerMap.get(String(qlId).toUpperCase()) ?? null;
}

export async function generateInt001ChapterAdminQuestionStudioBatch(request: Int001ChapterAdminRequest = {}) {
  const language = languageOf(request.language);
  const checkpointId = checkpointOf(request.checkpointId ?? request.cpId);
  const explicitQl = qlOf(request.qlId ?? request.questionLanguageId);
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const batchSeed = String(request.seed ?? "").trim() || `question-studio:INT-001:${checkpointId ?? "chapter"}:${language}:${Date.now()}`;

  if (explicitQl && checkpointId && qlOwnerMap.get(explicitQl) !== checkpointId) {
    throw new Error(`${explicitQl} belongs to ${qlOwnerMap.get(explicitQl)}, not ${checkpointId}.`);
  }

  const pool = explicitQl
    ? [explicitQl]
    : checkpointId
      ? [...checkpointMap.get(checkpointId)!.qlIds]
      : [...INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_PACKAGE.permanentQlIds];
  if (!pool.length) throw new Error("No Interest QLs match the requested filters.");
  const ordered = [...pool].sort((left, right) => stableScore(`${batchSeed}:${left}`).localeCompare(stableScore(`${batchSeed}:${right}`)) || left.localeCompare(right));
  const questions = [];
  for (let index = 0; index < count; index += 1) {
    const qlId = ordered[index % ordered.length]!;
    const owner = qlOwnerMap.get(qlId)!;
    const itemSeed = `${batchSeed}:${qlId}:${index}`;
    const source = await sourceQuestion(qlId, language, itemSeed);
    questions.push(normalizeQuestion(source, owner, qlId, language, itemSeed));
  }
  const result = Object.freeze({
    ok: true as const,
    packageId: INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_PACKAGE_ID,
    chapterId: INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_PACKAGE_ID,
    checkpointId: checkpointId ?? null,
    language,
    count,
    seed: batchSeed,
    integrationAuthority: INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_VERSION,
    questions: Object.freeze(questions),
  });
  JSON.stringify(result);
  return result;
}

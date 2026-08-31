import { createHash } from "node:crypto";
import { INT_CP003_QL_IDS, type IntCp003QlId } from "./cp003-exam-model";
import { generateIntCp003EnglishFrozenQuestion } from "./cp003-english-frozen-runtime";
import { generateIntCp003HiPaV3FrozenQuestion } from "./cp003-localized-v3-frozen";
import { retrofitInterestDirectCalculationLines } from "./interest-direct-calculation-explanation-policy-v1";

export const INT_CP003_QUESTION_STUDIO_INTEGRATION_VERSION = "INT-CP-003-QS-v1" as const;
export const INT_CP003_QUESTION_STUDIO_PACKAGE_ID = "INT-001" as const;
export const INT_CP003_QUESTION_STUDIO_CP_ID = "INT-CP-003" as const;
export const INT_CP003_QUESTION_STUDIO_LANGUAGES = Object.freeze(["en", "hi", "pa"] as const);
export type IntCp003QuestionStudioLanguage = (typeof INT_CP003_QUESTION_STUDIO_LANGUAGES)[number];

export type IntCp003QuestionStudioRequest = Readonly<{
  questionLanguageId?: string;
  qlId?: string;
  language?: string;
  seed?: string;
  count?: number;
}>;

function stableIndex(text: string, length: number) {
  return createHash("sha256").update(text).digest().readUInt32BE(0) % length;
}

function languageOf(value: unknown): IntCp003QuestionStudioLanguage {
  const language = String(value ?? "en").trim().toLowerCase();
  if (language === "en" || language === "hi" || language === "pa") return language;
  throw new Error(`INT-CP-003 does not support language '${language}'.`);
}

function qlOf(value: unknown): IntCp003QlId | undefined {
  const qlId = String(value ?? "").trim().toUpperCase();
  if (!qlId) return undefined;
  if ((INT_CP003_QL_IDS as readonly string[]).includes(qlId)) return qlId as IntCp003QlId;
  throw new Error(`${qlId} is not owned by INT-CP-003.`);
}

function optionText(option: any) {
  return typeof option === "string" ? option : String(option?.text ?? option?.value ?? "");
}

function toJsonSafe(value: unknown): any {
  if (typeof value === "bigint") return value.toString();
  if (Array.isArray(value)) return value.map(toJsonSafe);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key, nested]) => [key, toJsonSafe(nested)]));
  return value;
}

function sourceFor(qlId: IntCp003QlId, seed: string, language: IntCp003QuestionStudioLanguage) {
  if (language === "en") return generateIntCp003EnglishFrozenQuestion(qlId, seed);
  return generateIntCp003HiPaV3FrozenQuestion(qlId, seed, language === "hi" ? "hi-IN" : "pa-IN");
}

function normalize(source: any, qlId: IntCp003QlId, language: IntCp003QuestionStudioLanguage, requestSeed: string) {
  const options = Object.freeze((source.options ?? []).map(optionText));
  const correctIndex = Number(source.correctIndex);
  if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= options.length) throw new Error(`${qlId}: invalid correctIndex`);
  const answer = String(source.correctAnswer ?? options[correctIndex]);
  if (answer !== options[correctIndex]) throw new Error(`${qlId}: frozen answer no longer binds to correct option`);
  if (!source.learnerContentFrozen || !source.permanentIdentityFrozen) throw new Error(`${qlId}: source is not frozen`);
  const lifecycle = source.lifecycle ?? {};
  if (lifecycle.questionStudioDiscoverable || lifecycle.questionBankStatus !== "NOT_STORED" || lifecycle.testEligibility !== "INELIGIBLE" || lifecycle.publiclyPublishable) {
    throw new Error(`${qlId}: frozen source delivery boundary drifted`);
  }
  const stem = String(source.presentation?.markdown ?? source.presentation?.prompt ?? "");
  if (!stem) throw new Error(`${qlId}: empty frozen stem`);
  const rawExplanationLines = [source.explanation?.keyIdea, ...(source.explanation?.steps ?? []), source.explanation?.finalAnswer].filter(Boolean).map(String);
  const explanationLines = retrofitInterestDirectCalculationLines({ qlId, language, lines: rawExplanationLines, answer });
  const identity = createHash("sha256").update(`${qlId}:${language}:${requestSeed}`).digest("hex").slice(0, 20);
  const normalized = Object.freeze({
    packageId: INT_CP003_QUESTION_STUDIO_PACKAGE_ID,
    canonicalProblemId: INT_CP003_QUESTION_STUDIO_CP_ID,
    questionLanguageId: qlId,
    qlId,
    questionId: `INT-CP003-${qlId.slice(-3)}-${language.toUpperCase()}-${identity}`,
    stem,
    options,
    correctIndex,
    answer,
    difficultyBand: String(source.difficulty ?? "Medium"),
    language,
    locale: language === "en" ? "en-IN" : language === "hi" ? "hi-IN" : "pa-IN",
    explanation: Object.freeze({ lines: explanationLines }),
    explanationPresentationPolicy: "INT-001-DIRECT-CALCULATION-EXPLANATION-POLICY-v1" as const,
    runtimeMode: "QUESTION_STUDIO_ACTIVE" as const,
    reviewStatus: "FROZEN_MULTILINGUAL_CONTENT_AUTHORITY" as const,
    questionStudioDiscoverable: true as const,
    questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY" as const,
    questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED" as const,
    questionBankStatus: "NOT_STORED" as const,
    questionBankWritable: false as const,
    testEligibility: "INELIGIBLE" as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    automaticStudentPublication: false as const,
    solveContract: String(source.solveContract ?? source.frozenRegistry?.solveContract ?? ""),
    requestSeed,
    freezeId: String(source.freezeId ?? ""),
    integrationAuthority: INT_CP003_QUESTION_STUDIO_INTEGRATION_VERSION,
    traceability: Object.freeze({
      permanentQlId: qlId,
      sourceFreezeId: String(source.freezeId ?? ""),
      permanentIdentityFrozen: true as const,
      learnerContentFrozen: true as const,
      questionStudioDiscoverable: true as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
    }),
    hiddenState: toJsonSafe(source.mathematicalState ?? {}),
  });
  JSON.stringify(normalized);
  return normalized;
}

function preview(pkg: ReturnType<typeof normalize>, index: number, count: number) {
  return Object.freeze({
    text: pkg.stem,
    stem: pkg.stem,
    options: pkg.options,
    correct: pkg.correctIndex,
    correctIndex: pkg.correctIndex,
    answer: pkg.answer,
    canonicalAnswer: Object.freeze({ kind: "symbolic", value: pkg.answer, display: pkg.answer, rendered: pkg.answer, rounding: "exact" }),
    explanation: pkg.explanation.lines.join("\n\n"),
    packageExplanation: pkg.explanation,
    difficulty: pkg.difficultyBand,
    difficultyLabel: pkg.difficultyBand,
    patternId: INT_CP003_QUESTION_STUDIO_PACKAGE_ID,
    section: "Quant",
    topic: "Arithmetic",
    subtopic: "Interest",
    generationBackend: "quant-v4",
    debugSource: "quant-v4-int-cp003-frozen-multilingual-runtime",
    packageSource: "quant-v4-int-cp003-frozen-multilingual-runtime",
    packageId: pkg.packageId,
    canonicalProblemId: pkg.canonicalProblemId,
    questionLanguageId: pkg.questionLanguageId,
    qlId: pkg.qlId,
    questionId: pkg.questionId,
    seed: pkg.requestSeed,
    language: pkg.language,
    locale: pkg.locale,
    runtimeMode: pkg.runtimeMode,
    reviewStatus: pkg.reviewStatus,
    questionStudioDiscoverable: true as const,
    questionBankStatus: pkg.questionBankStatus,
    questionBankWritable: false as const,
    testEligibility: pkg.testEligibility,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    automaticStudentPublication: false as const,
    solveMode: pkg.solveContract,
    validation: Object.freeze({ ok: true as const, valid: true as const, errors: Object.freeze([] as string[]) }),
    traceability: pkg.traceability,
    proceduralLogic: pkg.hiddenState,
    logic: pkg.hiddenState,
    questionIndex: index + 1,
    questionCount: count,
    integrationAuthority: pkg.integrationAuthority,
    explanationPresentationPolicy: pkg.explanationPresentationPolicy,
  });
}

export function listIntCp003QuestionStudioPackages() {
  return [Object.freeze({
    id: INT_CP003_QUESTION_STUDIO_PACKAGE_ID,
    packageId: INT_CP003_QUESTION_STUDIO_PACKAGE_ID,
    type: "quant-v4",
    section: "Quant",
    domain: "quant",
    subject: "Quantitative Aptitude",
    topic: "Arithmetic",
    subtopic: "Interest",
    name: "INT-001 Interest — Compound Interest Core",
    label: "Interest — Compound Interest Core",
    cpIds: Object.freeze([INT_CP003_QUESTION_STUDIO_CP_ID]),
    permanentQlCount: INT_CP003_QL_IDS.length,
    permanentQlIds: Object.freeze([...INT_CP003_QL_IDS]),
    supportedLanguages: INT_CP003_QUESTION_STUDIO_LANGUAGES,
    enabled: true,
    runtimeMode: "QUESTION_STUDIO_ACTIVE",
    reviewStatus: "FROZEN_MULTILINGUAL_CONTENT_AUTHORITY",
    questionStudioDiscoverable: true,
    questionBankWritable: false,
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
    integrationVersion: INT_CP003_QUESTION_STUDIO_INTEGRATION_VERSION,
  })];
}

export async function generateIntCp003QuestionStudioBatch(request: IntCp003QuestionStudioRequest = {}) {
  const language = languageOf(request.language);
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const explicitQl = qlOf(request.questionLanguageId ?? request.qlId);
  const batchSeed = String(request.seed ?? "").trim() || `question-studio:INT-CP-003:${language}:${Date.now()}`;
  const pool = explicitQl ? [explicitQl] : [...INT_CP003_QL_IDS];
  const offset = stableIndex(`${batchSeed}:offset`, pool.length);
  const questionPackages = [];
  const questions = [];
  for (let index = 0; index < count; index += 1) {
    const qlId = pool[(offset + index) % pool.length]!;
    const itemSeed = `${batchSeed}:${qlId}:${index}`;
    const pkg = normalize(sourceFor(qlId, itemSeed, language), qlId, language, itemSeed);
    questionPackages.push(pkg);
    questions.push(preview(pkg, index, count));
  }
  const result = Object.freeze({ ok: true as const, packageId: INT_CP003_QUESTION_STUDIO_PACKAGE_ID, canonicalProblemId: INT_CP003_QUESTION_STUDIO_CP_ID, language, count, integrationVersion: INT_CP003_QUESTION_STUDIO_INTEGRATION_VERSION, questionPackages: Object.freeze(questionPackages), questions: Object.freeze(questions) });
  JSON.stringify(result);
  return result;
}

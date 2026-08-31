import { createHash } from "node:crypto";
import { INT_CP009_PERMANENT_ALLOCATION, INT_CP009_PERMANENT_QL_IDS, type IntCp009PermanentQlId } from "./cp009-permanent-allocation-v1";
import { generateIntCp009Frozen, INT_CP009_RELEASE_ID } from "./cp009-final-freeze-v1";
import type { IntCp009Language } from "./cp009-localization-v1";
import { retrofitInterestDirectCalculationLines } from "./interest-direct-calculation-explanation-policy-v1";

export const INT_CP009_QUESTION_STUDIO_PACKAGE_ID = "INT-001" as const;
export const INT_CP009_QUESTION_STUDIO_CP_ID = "INT-CP-009" as const;
export const INT_CP009_QUESTION_STUDIO_LANGUAGES = Object.freeze(["en", "hi", "pa"] as const);

export type IntCp009QuestionStudioRequest = Readonly<{
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

function normalize(value: unknown) {
  return String(value ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function isQl(value: unknown): value is IntCp009PermanentQlId {
  return INT_CP009_PERMANENT_QL_IDS.includes(String(value ?? "") as IntCp009PermanentQlId);
}

export function isIntCp009QuestionStudioRequest(request: IntCp009QuestionStudioRequest) {
  const packageId = normalize(request.packageId ?? request.archetypeId);
  const patternId = normalize(request.patternId);
  const topic = normalize(request.topic);
  const subtopic = normalize(request.subtopic);
  const cpId = String(request.canonicalProblemId ?? request.cpId ?? "");
  return cpId === INT_CP009_QUESTION_STUDIO_CP_ID
    || isQl(request.questionLanguageId)
    || patternId.includes("int cp 009")
    || ((packageId === "int 001" || topic === "arithmetic") && (subtopic === "interest" || subtopic === "simple compound interest") && cpId === INT_CP009_QUESTION_STUDIO_CP_ID);
}

function normalizeLanguage(value: unknown): IntCp009Language {
  const language = String(value ?? "en").trim().toLowerCase();
  if (language === "en" || language === "hi" || language === "pa") return language;
  throw new Error(`INT-CP-009 does not support language ${language}.`);
}

function normalizeDifficulty(value: unknown): "Medium" | "Hard" | undefined {
  const text = String(value ?? "").trim().toLowerCase();
  if (!text) return undefined;
  if (text === "medium" || text === "moderate") return "Medium";
  if (text === "hard") return "Hard";
  if (text === "easy") return undefined;
  return undefined;
}

function stableSeed(text: string) {
  return createHash("sha256").update(text).digest().readUInt32BE(0);
}

function authorityForQl(qlId: IntCp009PermanentQlId) {
  const authority = INT_CP009_PERMANENT_ALLOCATION.find((entry) => entry.qlId === qlId);
  if (!authority) throw new Error(`Unknown CP009 QL ${qlId}.`);
  return authority;
}

function normalizePackage(pkg: any, language: IntCp009Language, requestSeed: string) {
  const answer = pkg.correctAnswer;
  if (pkg.options[pkg.correctIndex]?.text !== answer) throw new Error(`${pkg.permanentQlId}: frozen option binding drift.`);
  if (!pkg.lifecycle.learnerContentFrozen || pkg.lifecycle.questionBankWritable || pkg.lifecycle.testEligible || pkg.lifecycle.publiclyPublishable) {
    throw new Error(`${pkg.permanentQlId}: invalid frozen lifecycle for Question Studio.`);
  }
  const identity = createHash("sha256")
    .update(JSON.stringify({ qlId: pkg.permanentQlId, language, requestSeed, freeze: pkg.freezeFingerprint }))
    .digest("hex").slice(0, 20);
  const rawExplanationLines = [pkg.explanation.keyIdea, ...pkg.explanation.steps, pkg.explanation.finalAnswer];
  const explanationLines = retrofitInterestDirectCalculationLines({
    qlId: pkg.permanentQlId,
    language,
    lines: rawExplanationLines,
    answer,
  });
  return Object.freeze({
    packageId: INT_CP009_QUESTION_STUDIO_PACKAGE_ID,
    canonicalProblemId: INT_CP009_QUESTION_STUDIO_CP_ID,
    questionLanguageId: pkg.permanentQlId,
    explanationId: `${pkg.permanentQlId}-EXP-${language.toUpperCase()}`,
    questionId: `INT-CP009-${pkg.permanentQlId.slice(-3)}-${language.toUpperCase()}-${identity}`,
    stem: pkg.stem,
    options: Object.freeze(pkg.options.map((option: any) => option.text)),
    optionMetadata: Object.freeze(pkg.options.map((option: any) => Object.freeze({
      isCorrect: option.text === answer,
      kind: option.kind ?? option.misconceptionId ?? "DISTRACTOR",
    }))),
    correctIndex: pkg.correctIndex,
    answer,
    difficultyBand: pkg.difficultyBand,
    language,
    locale: language === "en" ? "en-IN" : language === "hi" ? "hi-IN" : "pa-IN",
    explanation: Object.freeze({ lines: explanationLines }),
    explanationPresentationPolicy: "INT-001-DIRECT-CALCULATION-EXPLANATION-POLICY-v1" as const,
    runtimeMode: "QUESTION_STUDIO_ACTIVE" as const,
    reviewStatus: "FROZEN_MULTILINGUAL_CONTENT_AUTHORITY" as const,
    questionStudioDiscoverable: true as const,
    questionBankStatus: "NOT_STORED" as const,
    questionBankWritable: false as const,
    testEligibility: "INELIGIBLE" as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    automaticStudentPublication: false as const,
    authorityId: pkg.authorityId,
    solveContract: pkg.solveContract,
    sourcePrototypeId: pkg.sourcePrototypeId,
    answerSemantic: pkg.answerSemantic,
    mathematicalFingerprint: pkg.mathematicalFingerprint,
    sourceSeed: pkg.sourceSeed,
    requestSeed,
    traceability: Object.freeze({
      releaseId: INT_CP009_RELEASE_ID,
      permanentQlId: pkg.permanentQlId,
      authorityId: pkg.authorityId,
      sourcePrototypeId: pkg.sourcePrototypeId,
      sourceVariantCount: pkg.sourceVariantCount,
      freezeFingerprint: pkg.freezeFingerprint,
      englishContentFrozen: true as const,
      localizationFrozen: true as const,
      questionStudioDiscoverable: true as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      publiclyPublishable: false as const,
    }),
    hiddenState: pkg.mathematicalState,
  });
}

function preview(pkg: ReturnType<typeof normalizePackage>, index: number, count: number) {
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
    patternId: INT_CP009_QUESTION_STUDIO_PACKAGE_ID,
    section: "Quant",
    topic: "Arithmetic",
    subtopic: "Interest",
    generationBackend: "quant-v4",
    debugSource: "quant-v4-int-cp009-frozen-multilingual-runtime",
    packageSource: "quant-v4-int-cp009-frozen-multilingual-runtime",
    packageId: pkg.packageId,
    canonicalProblemId: pkg.canonicalProblemId,
    questionLanguageId: pkg.questionLanguageId,
    explanationId: pkg.explanationId,
    qlId: pkg.questionLanguageId,
    questionId: pkg.questionId,
    seed: pkg.requestSeed,
    language: pkg.language,
    locale: pkg.locale,
    runtimeMode: pkg.runtimeMode,
    reviewStatus: pkg.reviewStatus,
    questionStudioDiscoverable: true,
    questionBankStatus: pkg.questionBankStatus,
    questionBankWritable: false,
    testEligibility: pkg.testEligibility,
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
    authorityId: pkg.authorityId,
    solveMode: pkg.solveContract,
    taskKind: pkg.sourcePrototypeId,
    answerSemantic: pkg.answerSemantic,
    optionMetadata: pkg.optionMetadata,
    validation: Object.freeze({ ok: true, valid: true, errors: Object.freeze([] as string[]) }),
    semanticMetadata: pkg.traceability,
    traceability: pkg.traceability,
    proceduralLogic: pkg.hiddenState,
    logic: pkg.hiddenState,
    mathematicalFingerprint: pkg.mathematicalFingerprint,
    questionIndex: index + 1,
    questionCount: count,
    explanationPresentationPolicy: pkg.explanationPresentationPolicy,
  });
}

export function listIntCp009QuestionStudioPackages() {
  return [Object.freeze({
    id: INT_CP009_QUESTION_STUDIO_PACKAGE_ID,
    packageId: INT_CP009_QUESTION_STUDIO_PACKAGE_ID,
    type: "quant-v4",
    section: "Quant",
    domain: "quant",
    subject: "Quantitative Aptitude",
    topic: "Arithmetic",
    subtopic: "Interest",
    name: "INT-001 Interest — Heterogeneous Dated Cash Flows",
    label: "Interest — Heterogeneous Dated Cash Flows",
    generationDomain: "quant-v4",
    cpIds: Object.freeze([INT_CP009_QUESTION_STUDIO_CP_ID]),
    canonicalProblems: Object.freeze([Object.freeze({ id: INT_CP009_QUESTION_STUDIO_CP_ID, label: "Unequal dated deposits, repayments and balances" })]),
    permanentQlCount: INT_CP009_PERMANENT_QL_IDS.length,
    permanentQlIds: INT_CP009_PERMANENT_QL_IDS,
    supportedDifficulties: Object.freeze(["Medium", "Hard"]),
    supportedLanguages: INT_CP009_QUESTION_STUDIO_LANGUAGES,
    enabled: true,
    runtimeMode: "QUESTION_STUDIO_ACTIVE",
    reviewStatus: "FROZEN_MULTILINGUAL_CONTENT_AUTHORITY",
    questionBankStatus: "NOT_STORED",
    questionBankWritable: false,
    testEligibility: "INELIGIBLE",
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
    releaseId: INT_CP009_RELEASE_ID,
  })];
}

export async function generateIntCp009QuestionStudioBatch(request: IntCp009QuestionStudioRequest = {}) {
  const language = normalizeLanguage(request.language);
  const difficulty = normalizeDifficulty(request.difficulty);
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const explicitQl = request.questionLanguageId ? String(request.questionLanguageId) : undefined;
  if (explicitQl && !isQl(explicitQl)) throw new Error(`${explicitQl} is not owned by INT-CP-009.`);
  const explicitCp = request.canonicalProblemId ?? request.cpId;
  if (explicitCp && explicitCp !== INT_CP009_QUESTION_STUDIO_CP_ID) throw new Error(`INT-CP-009 cannot serve ${explicitCp}.`);

  const batchSeed = request.seed?.trim() || `question-studio:INT-001:INT-CP-009:${language}:${Date.now()}:${Math.random().toString(36).slice(2)}`;
  const eligible = INT_CP009_PERMANENT_QL_IDS.filter((qlId) => !difficulty || authorityForQl(qlId).baselineDifficulty === difficulty);
  if (explicitQl && difficulty && authorityForQl(explicitQl as IntCp009PermanentQlId).baselineDifficulty !== difficulty) {
    throw new Error(`${explicitQl} is ${authorityForQl(explicitQl as IntCp009PermanentQlId).baselineDifficulty}, not ${difficulty}.`);
  }
  const pool = explicitQl ? [explicitQl as IntCp009PermanentQlId] : eligible;
  if (pool.length === 0) throw new Error(`No INT-CP-009 QL supports requested difficulty ${String(difficulty)}.`);
  const offset = stableSeed(`${batchSeed}:ql-offset`) % pool.length;
  const questionPackages = [];
  const questions = [];
  for (let index = 0; index < count; index += 1) {
    const qlId = pool[(offset + index) % pool.length]!;
    const itemSeed = `${batchSeed}:${qlId}:${index}`;
    const frozen = generateIntCp009Frozen(qlId, stableSeed(itemSeed), language);
    const normalized = normalizePackage(frozen, language, itemSeed);
    questionPackages.push(normalized);
    questions.push(preview(normalized, index, count));
  }
  return Object.freeze({
    ok: true as const,
    packageId: INT_CP009_QUESTION_STUDIO_PACKAGE_ID,
    canonicalProblemId: INT_CP009_QUESTION_STUDIO_CP_ID,
    language,
    count,
    releaseId: INT_CP009_RELEASE_ID,
    questionPackages: Object.freeze(questionPackages),
    questions: Object.freeze(questions),
  });
}

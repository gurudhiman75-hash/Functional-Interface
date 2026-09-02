import { createHash } from "node:crypto";
import {
  INT_CP010_FINAL_AUTHORITIES,
  INT_CP010_FINAL_REGISTRY_VERSION,
  generateIntCp010PermanentEnglish,
  generateIntCp010PermanentLocalized,
  type IntCp010PermanentQlId,
} from "./cp010-final-registry-v1";
import { retrofitInterestDirectCalculationLines } from "./interest-direct-calculation-explanation-policy-v1";

export const INT_CP010_QUESTION_STUDIO_INTEGRATION_VERSION = "INT-CP-010-QS-v1-json-safe" as const;
export const INT_CP010_QUESTION_STUDIO_PACKAGE_ID = "INT-001" as const;
export const INT_CP010_QUESTION_STUDIO_CP_ID = "INT-CP-010" as const;
export const INT_CP010_QUESTION_STUDIO_LANGUAGES = Object.freeze(["en", "hi", "pa"] as const);
export type IntCp010QuestionStudioLanguage = (typeof INT_CP010_QUESTION_STUDIO_LANGUAGES)[number];

export type IntCp010QuestionStudioRequest = Readonly<{
  packageId?: string;
  canonicalProblemId?: string;
  cpId?: string;
  questionLanguageId?: string;
  language?: string;
  seed?: string;
  count?: number;
}>;

const QL_IDS = Object.freeze(INT_CP010_FINAL_AUTHORITIES.map((entry) => entry.permanentQlId));

function toJsonSafe(value: unknown): any {
  if (typeof value === "bigint") return value.toString();
  if (Array.isArray(value)) return Object.freeze(value.map(toJsonSafe));
  if (value && typeof value === "object") {
    return Object.freeze(Object.fromEntries(
      Reflect.ownKeys(value as object)
        .filter((key): key is string => typeof key === "string")
        .map((key) => [key, toJsonSafe((value as Record<string, unknown>)[key])]),
    ));
  }
  return value;
}

function stableSeed(text: string) {
  return createHash("sha256").update(text).digest().readUInt32BE(0);
}

function languageOf(value: unknown): IntCp010QuestionStudioLanguage {
  const language = String(value ?? "en").trim().toLowerCase();
  if (language === "en" || language === "hi" || language === "pa") return language;
  throw new Error(`INT-CP-010 does not support language '${language}'.`);
}

function isQl(value: unknown): value is IntCp010PermanentQlId {
  return QL_IDS.includes(String(value ?? "") as IntCp010PermanentQlId);
}

function authorityFor(qlId: IntCp010PermanentQlId) {
  const authority = INT_CP010_FINAL_AUTHORITIES.find((entry) => entry.permanentQlId === qlId);
  if (!authority) throw new Error(`Unknown INT-CP-010 QL '${qlId}'.`);
  return authority;
}

function optionText(option: any) {
  return typeof option === "string" ? option : String(option?.text ?? option?.value ?? "");
}

function normalizeFrozen(source: any, qlId: IntCp010PermanentQlId, language: IntCp010QuestionStudioLanguage, requestSeed: string) {
  const options = source.options.map(optionText);
  const correctIndex = Number(source.correctIndex);
  if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= options.length) throw new Error(`${qlId}: invalid correctIndex`);
  const answer = optionText(source.options[correctIndex]);
  if (!answer) throw new Error(`${qlId}: correct option rendered empty`);
  const lifecycle = source.lifecycle ?? {};
  if (lifecycle.questionBankWritable || lifecycle.testEligible || lifecycle.mockTestEligible || lifecycle.publiclyPublishable) {
    throw new Error(`${qlId}: downstream lifecycle lock drift`);
  }
  const authority = authorityFor(qlId);
  const identity = createHash("sha256").update(`${qlId}:${language}:${requestSeed}:${INT_CP010_FINAL_REGISTRY_VERSION}`).digest("hex").slice(0, 20);
  const explanation = source.explanation ?? {};
  const rawLines = [explanation.keyIdea, ...(explanation.steps ?? []), explanation.finalAnswer].filter(Boolean).map(String);
  const lines = retrofitInterestDirectCalculationLines({ qlId, language, lines: rawLines, answer });
  const safeHidden = toJsonSafe(source.mathematicalState ?? source.hiddenState ?? {});
  const normalized = Object.freeze({
    packageId: INT_CP010_QUESTION_STUDIO_PACKAGE_ID,
    canonicalProblemId: INT_CP010_QUESTION_STUDIO_CP_ID,
    questionLanguageId: qlId,
    qlId,
    questionId: `INT-CP010-${qlId.slice(-3)}-${language.toUpperCase()}-${identity}`,
    stem: String(source.stem),
    options: Object.freeze(options),
    correctIndex,
    answer,
    difficultyBand: String(source.difficultyBand ?? source.baselineDifficulty ?? "Hard"),
    language,
    locale: language === "en" ? "en-IN" : language === "hi" ? "hi-IN" : "pa-IN",
    explanation: Object.freeze({ lines }),
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
    authorityId: authority.authorityId,
    sourcePrototypeId: authority.sourcePrototypeId,
    solveContract: authority.solveContract,
    requestSeed,
    integrationAuthority: INT_CP010_QUESTION_STUDIO_INTEGRATION_VERSION,
    traceability: Object.freeze({
      finalRegistryVersion: INT_CP010_FINAL_REGISTRY_VERSION,
      permanentQlId: qlId,
      authorityId: authority.authorityId,
      sourcePrototypeId: authority.sourcePrototypeId,
      questionStudioDiscoverable: true as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
    }),
    hiddenState: safeHidden,
  });
  JSON.stringify(normalized);
  return normalized;
}

function preview(pkg: ReturnType<typeof normalizeFrozen>, index: number, count: number) {
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
    patternId: INT_CP010_QUESTION_STUDIO_PACKAGE_ID,
    section: "Quant",
    topic: "Arithmetic",
    subtopic: "Interest",
    generationBackend: "quant-v4",
    debugSource: "quant-v4-int-cp010-frozen-multilingual-runtime",
    packageSource: "quant-v4-int-cp010-frozen-multilingual-runtime",
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
    authorityId: pkg.authorityId,
    solveMode: pkg.solveContract,
    taskKind: pkg.sourcePrototypeId,
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

export function listIntCp010QuestionStudioPackages() {
  return [Object.freeze({
    id: INT_CP010_QUESTION_STUDIO_PACKAGE_ID,
    packageId: INT_CP010_QUESTION_STUDIO_PACKAGE_ID,
    type: "quant-v4",
    section: "Quant",
    domain: "quant",
    subject: "Quantitative Aptitude",
    topic: "Arithmetic",
    subtopic: "Interest",
    name: "INT-001 Interest — Variable-Rate Reducing-Balance Loans",
    label: "Interest — Variable-Rate Reducing-Balance Loans",
    generationDomain: "quant-v4",
    cpIds: Object.freeze([INT_CP010_QUESTION_STUDIO_CP_ID]),
    permanentQlCount: QL_IDS.length,
    permanentQlIds: QL_IDS,
    supportedLanguages: INT_CP010_QUESTION_STUDIO_LANGUAGES,
    enabled: true,
    runtimeMode: "QUESTION_STUDIO_ACTIVE",
    reviewStatus: "FROZEN_MULTILINGUAL_CONTENT_AUTHORITY",
    questionBankWritable: false,
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
    integrationVersion: INT_CP010_QUESTION_STUDIO_INTEGRATION_VERSION,
  })];
}

export async function generateIntCp010QuestionStudioBatch(request: IntCp010QuestionStudioRequest = {}) {
  const language = languageOf(request.language);
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const explicitQl = request.questionLanguageId ? String(request.questionLanguageId) : undefined;
  if (explicitQl && !isQl(explicitQl)) throw new Error(`${explicitQl} is not owned by INT-CP-010.`);
  const explicitCp = request.canonicalProblemId ?? request.cpId;
  if (explicitCp && explicitCp !== INT_CP010_QUESTION_STUDIO_CP_ID) throw new Error(`INT-CP-010 cannot serve ${explicitCp}.`);
  const batchSeed = request.seed?.trim() || `question-studio:INT-001:INT-CP-010:${language}:${Date.now()}:${Math.random().toString(36).slice(2)}`;
  const pool = explicitQl ? [explicitQl as IntCp010PermanentQlId] : QL_IDS;
  const offset = stableSeed(`${batchSeed}:offset`) % pool.length;
  const questionPackages = [];
  const questions = [];
  for (let index = 0; index < count; index += 1) {
    const qlId = pool[(offset + index) % pool.length]!;
    const itemSeed = `${batchSeed}:${qlId}:${index}`;
    const numericSeed = stableSeed(itemSeed);
    const frozen = language === "en"
      ? generateIntCp010PermanentEnglish(qlId, numericSeed)
      : generateIntCp010PermanentLocalized(qlId, numericSeed, language);
    const normalized = normalizeFrozen(frozen, qlId, language, itemSeed);
    questionPackages.push(normalized);
    questions.push(preview(normalized, index, count));
  }
  const result = Object.freeze({
    ok: true as const,
    packageId: INT_CP010_QUESTION_STUDIO_PACKAGE_ID,
    canonicalProblemId: INT_CP010_QUESTION_STUDIO_CP_ID,
    language,
    count,
    integrationVersion: INT_CP010_QUESTION_STUDIO_INTEGRATION_VERSION,
    questionPackages: Object.freeze(questionPackages),
    questions: Object.freeze(questions),
  });
  JSON.stringify(result);
  return result;
}

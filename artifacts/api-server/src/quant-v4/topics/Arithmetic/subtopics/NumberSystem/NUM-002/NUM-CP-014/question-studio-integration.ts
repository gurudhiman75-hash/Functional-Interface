import { createHash } from "node:crypto";
import { NUM_CP014_PERMANENT_ALLOCATION, type NumCp014PermanentQlId } from "./permanent-allocation.ts";
import { generateNumCp014Permanent } from "./permanent-runtime.ts";
import { generateNumCp014LocalizedV2 } from "./localization/runtime-v2.ts";

export const NUM_CP014_QUESTION_STUDIO_PACKAGE_ID = "NUM-002" as const;
export const NUM_CP014_QUESTION_STUDIO_CHECKPOINT_ID = "NUM-CP-014" as const;
export const NUM_CP014_QUESTION_STUDIO_LANGUAGES = ["en", "hi", "pa"] as const;
export const NUM_CP014_QUESTION_STUDIO_QL_IDS = Object.freeze(NUM_CP014_PERMANENT_ALLOCATION.map((entry) => entry.qlId));
export type NumCp014QuestionStudioLanguage = typeof NUM_CP014_QUESTION_STUDIO_LANGUAGES[number];

export type NumCp014QuestionStudioRequest = Readonly<{
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

const RELEASE_ID = "NUM-CP-014-QS-MULTILINGUAL-FROZEN-V1" as const;
const EXPLANATION_STANDARD = "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1" as const;

function normalizeSelector(value: unknown) {
  return String(value ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}
function isCp014Ql(value: unknown): value is NumCp014PermanentQlId {
  return NUM_CP014_QUESTION_STUDIO_QL_IDS.includes(String(value ?? "") as NumCp014PermanentQlId);
}
export function isNumCp014QuestionStudioRequest(request: NumCp014QuestionStudioRequest) {
  const patternId = normalizeSelector(request.patternId);
  const checkpointId = String(request.canonicalProblemId ?? request.cpId ?? "");
  return patternId.includes("num cp 014") || checkpointId === NUM_CP014_QUESTION_STUDIO_CHECKPOINT_ID || isCp014Ql(request.questionLanguageId);
}
function normalizeLanguage(value: unknown): NumCp014QuestionStudioLanguage {
  const language = String(value ?? "en").trim().toLowerCase();
  if (language === "en" || language === "hi" || language === "pa") return language;
  throw new Error(`NUM-CP-014 does not support Question Studio language ${language}.`);
}
function normalizeDifficulty(value: unknown) {
  const valueText = String(value ?? "").trim().toLowerCase();
  if (!valueText || valueText === "hard") return "Hard" as const;
  if (valueText === "medium" || valueText === "moderate" || valueText === "easy") {
    throw new Error("NUM-CP-014 synthesis authorities are currently frozen at Hard difficulty only.");
  }
  throw new Error(`Unsupported NUM-CP-014 difficulty ${valueText}.`);
}
function stablePositiveSeed(value: string) {
  const digest = createHash("sha256").update(value).digest();
  return (digest.readUInt32BE(0) % 2_000_000_000) + 1;
}
function generateAuthority(qlId: NumCp014PermanentQlId, seed: number, language: NumCp014QuestionStudioLanguage) {
  return language === "en" ? generateNumCp014Permanent(qlId, seed) : generateNumCp014LocalizedV2(qlId, seed, language);
}
function buildExplanation(pkg: ReturnType<typeof generateAuthority>, language: NumCp014QuestionStudioLanguage) {
  const answerLabel = language === "hi" ? "उत्तर" : language === "pa" ? "ਉੱਤਰ" : "Answer";
  const derivation = [...pkg.explanation.fullDerivation];
  const shortcut = [...pkg.explanation.examShortcut];
  return Object.freeze({
    standard: EXPLANATION_STANDARD,
    coreConcept: pkg.explanation.coreConcept,
    strategy: pkg.explanation.strategy,
    steps: pkg.explanation.steps,
    fullDerivation: Object.freeze(derivation),
    examShortcut: Object.freeze(shortcut),
    finalAnswer: pkg.explanation.finalAnswer,
    lines: Object.freeze([
      ...derivation,
      language === "hi" ? "परीक्षा की तेज़ विधि:" : language === "pa" ? "ਪਰੀਖਿਆ ਦਾ ਤੇਜ਼ ਤਰੀਕਾ:" : "Exam shortcut:",
      ...shortcut,
      `${answerLabel}: ${pkg.explanation.finalAnswer}`,
    ]),
  });
}
function normalizedPackage(pkg: ReturnType<typeof generateAuthority>, language: NumCp014QuestionStudioLanguage, seedText: string) {
  const valid = pkg.canonicalAnswer === pkg.verifierAnswer
    && pkg.options[pkg.correctIndex]?.isCorrect === true
    && pkg.options[pkg.correctIndex]?.value === pkg.canonicalAnswer;
  if (!valid) throw new Error(`${pkg.permanentQlId}: frozen CP014 answer binding drift.`);
  if (pkg.lifecycle.questionBankWritable || pkg.lifecycle.testEligible || pkg.lifecycle.mockTestEligible || pkg.lifecycle.publiclyPublishable || pkg.lifecycle.automaticStudentPublication) {
    throw new Error(`${pkg.permanentQlId}: downstream CP014 lifecycle lock opened unexpectedly.`);
  }
  const identity = createHash("sha256").update(JSON.stringify({ ql: pkg.permanentQlId, language, seed: pkg.seed, stem: pkg.stem, answer: pkg.canonicalAnswer })).digest("hex").slice(0, 20);
  const explanation = buildExplanation(pkg, language);
  return Object.freeze({
    packageId: NUM_CP014_QUESTION_STUDIO_PACKAGE_ID,
    canonicalProblemId: NUM_CP014_QUESTION_STUDIO_CHECKPOINT_ID,
    questionLanguageId: pkg.permanentQlId,
    explanationId: `${pkg.permanentQlId}-EXP-${language.toUpperCase()}`,
    questionId: `NUM-CP014-${pkg.permanentQlId.slice(-3)}-${language.toUpperCase()}-${identity}`,
    stem: pkg.stem,
    options: Object.freeze(pkg.options.map((option) => option.value)),
    optionMetadata: Object.freeze(pkg.options.map((option) => Object.freeze({ isCorrect: option.isCorrect, misconceptionId: option.misconceptionId }))),
    correctIndex: pkg.correctIndex,
    answer: pkg.canonicalAnswer,
    verifierAnswer: pkg.verifierAnswer,
    difficultyBand: "Hard" as const,
    language,
    locale: language === "en" ? "en-IN" : language === "hi" ? "hi-IN" : "pa-IN",
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
    explanation,
    explanationStandard: EXPLANATION_STANDARD,
    authorityId: pkg.authorityId,
    authorityLabel: pkg.authorityLabel,
    taskKind: pkg.taskKind,
    representation: pkg.representation,
    representationPayload: pkg.representationPayload,
    answerSemantic: pkg.answerSemantic,
    sourceAnswerSemantic: pkg.sourceAnswerSemantic,
    sourcePrototypeId: pkg.sourcePrototypeId,
    hiddenState: pkg.hiddenState,
    componentEngines: pkg.componentEngines,
    ablation: pkg.ablation,
    permanentSeed: pkg.seed,
    sourceSeed: pkg.sourceSeed,
    requestSeed: seedText,
    mathematicalFingerprint: pkg.mathematicalFingerprint,
    validation: Object.freeze({ ok: true as const, valid: true as const, errors: Object.freeze([] as string[]) }),
    traceability: Object.freeze({
      releaseId: RELEASE_ID,
      packageId: "NUM-002",
      checkpointId: "NUM-CP-014",
      permanentQlId: pkg.permanentQlId,
      permanentSeed: pkg.seed,
      sourceSeed: pkg.sourceSeed,
      authorityId: pkg.authorityId,
      sourcePrototypeId: pkg.sourcePrototypeId,
      sourceAncestry: pkg.sourceAncestry,
      prototypeAncestry: pkg.prototypeAncestry,
      mathematicalFingerprint: pkg.mathematicalFingerprint,
      ablation: pkg.ablation,
      explanationStandard: EXPLANATION_STANDARD,
      questionStudioDiscoverable: true as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
    }),
  });
}
function toPreview(pkg: ReturnType<typeof normalizedPackage>, index: number, count: number) {
  const canonicalAnswer = Object.freeze({ kind: "symbolic", value: pkg.answer, display: pkg.answer, rendered: pkg.answer, rounding: "exact" });
  return Object.freeze({
    text: pkg.stem,
    stem: pkg.stem,
    options: pkg.options,
    correct: pkg.correctIndex,
    correctIndex: pkg.correctIndex,
    answer: pkg.answer,
    canonicalAnswer,
    explanation: pkg.explanation.lines.join("\n\n"),
    packageExplanation: pkg.explanation,
    explanationStandard: pkg.explanationStandard,
    difficulty: pkg.difficultyBand,
    difficultyLabel: pkg.difficultyBand,
    patternId: "NUM-002",
    section: "Quant",
    topic: "Arithmetic",
    subtopic: "Number System",
    generationBackend: "quant-v4",
    debugSource: "quant-v4-num-cp014-frozen-multilingual-runtime",
    packageSource: "quant-v4-num-cp014-frozen-multilingual-runtime",
    packageId: "NUM-002",
    canonicalProblemId: "NUM-CP-014",
    questionLanguageId: pkg.questionLanguageId,
    qlId: pkg.questionLanguageId,
    questionId: pkg.questionId,
    seed: pkg.requestSeed,
    permanentSeed: pkg.permanentSeed,
    sourceSeed: pkg.sourceSeed,
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
    authorityLabel: pkg.authorityLabel,
    taskKind: pkg.taskKind,
    representation: pkg.representation,
    representationPayload: pkg.representationPayload,
    answerSemantic: pkg.answerSemantic,
    sourceAnswerSemantic: pkg.sourceAnswerSemantic,
    sourcePrototypeId: pkg.sourcePrototypeId,
    componentEngines: pkg.componentEngines,
    ablation: pkg.ablation,
    optionMetadata: pkg.optionMetadata,
    validation: pkg.validation,
    semanticMetadata: pkg.traceability,
    traceability: pkg.traceability,
    proceduralLogic: pkg.hiddenState,
    logic: pkg.hiddenState,
    mathematicalFingerprint: pkg.mathematicalFingerprint,
    questionIndex: index + 1,
    questionCount: count,
  });
}

export function listNumCp014QuestionStudioPackages() {
  return [Object.freeze({
    id: "NUM-002", packageId: "NUM-002", type: "quant-v4", section: "Quant", domain: "quant", subject: "Quantitative Aptitude",
    topic: "Arithmetic", subtopic: "Number System",
    name: "NUM-002 Number System — Mixed Inverse, Optimisation and Number-Theory Synthesis",
    label: "Number System — Mixed Inverse, Optimisation and Number-Theory Synthesis",
    generationDomain: "quant-v4",
    cpIds: Object.freeze(["NUM-CP-014"]),
    canonicalProblems: Object.freeze([Object.freeze({ id: "NUM-CP-014", label: "Mixed inverse, optimisation and Number-Theory synthesis" })]),
    permanentQlCount: NUM_CP014_QUESTION_STUDIO_QL_IDS.length,
    permanentQlIds: NUM_CP014_QUESTION_STUDIO_QL_IDS,
    supportedDifficulties: Object.freeze(["Hard"]),
    supportedLanguages: NUM_CP014_QUESTION_STUDIO_LANGUAGES,
    enabled: true,
    runtimeMode: "QUESTION_STUDIO_ACTIVE",
    supportedRuntimeModes: Object.freeze(["QUESTION_STUDIO_ACTIVE"]),
    reviewStatus: "FROZEN_MULTILINGUAL_CONTENT_AUTHORITY",
    explanationStandard: EXPLANATION_STANDARD,
    questionBankStatus: "NOT_STORED", questionBankWritable: false,
    testEligibility: "INELIGIBLE", testEligible: false, mockTestEligible: false,
    publiclyPublishable: false, automaticStudentPublication: false,
    releaseId: RELEASE_ID,
  })];
}

export async function generateNumCp014QuestionStudioBatch(request: NumCp014QuestionStudioRequest = {}) {
  const language = normalizeLanguage(request.language);
  normalizeDifficulty(request.difficulty);
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const explicitQl = String(request.questionLanguageId ?? "") || undefined;
  if (explicitQl && !isCp014Ql(explicitQl)) throw new Error(`${explicitQl} is not owned by NUM-CP-014.`);
  const explicitCp = String(request.canonicalProblemId ?? request.cpId ?? "") || undefined;
  if (explicitCp && explicitCp !== "NUM-CP-014") throw new Error(`NUM-CP-014 cannot serve canonical problem ${explicitCp}.`);
  const batchSeed = request.seed?.trim() || `question-studio:NUM-002:NUM-CP-014:${language}:${Date.now()}:${Math.random().toString(36).slice(2)}`;
  const qlOffset = stablePositiveSeed(`${batchSeed}:ql-offset`) % NUM_CP014_QUESTION_STUDIO_QL_IDS.length;
  const questionPackages = [];
  const questions = [];
  for (let index = 0; index < count; index += 1) {
    const qlId = explicitQl as NumCp014PermanentQlId || NUM_CP014_QUESTION_STUDIO_QL_IDS[(qlOffset + index) % NUM_CP014_QUESTION_STUDIO_QL_IDS.length]!;
    const itemSeedText = `${batchSeed}:${qlId}:${index}`;
    const pkg = generateAuthority(qlId, stablePositiveSeed(itemSeedText), language);
    const normalized = normalizedPackage(pkg, language, itemSeedText);
    questionPackages.push(normalized);
    questions.push(toPreview(normalized, index, count));
  }
  return Object.freeze({
    generationContext: Object.freeze({
      generationDomain: "quant-v4", packageId: "NUM-002", chapterId: "NUM-CP-014", canonicalProblemId: "NUM-CP-014",
      seed: batchSeed, timestamp: Date.now(), runtimeMode: "QUESTION_STUDIO_ACTIVE", reviewStatus: "FROZEN_MULTILINGUAL_CONTENT_AUTHORITY",
      lifecycleStatus: "QUESTION_STUDIO_ACTIVE_SOURCE_ONLY", permanentQlCount: NUM_CP014_QUESTION_STUDIO_QL_IDS.length,
      explanationStandard: EXPLANATION_STANDARD, questionBankStatus: "NOT_STORED", questionBankWritable: false,
      testEligibility: "INELIGIBLE", testEligible: false, mockTestEligible: false, publiclyPublishable: false,
      automaticStudentPublication: false, releaseId: RELEASE_ID, language, explicitQl: explicitQl ?? null, difficulty: "Hard",
    }),
    questionPackages: Object.freeze(questionPackages),
    questions: Object.freeze(questions),
  });
}

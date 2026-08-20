import { TSD_CP005_APPROVED_ENGLISH_FROZEN_78Q, TSD_CP005_ENGLISH_FREEZE_ID } from "./cp005/english-approved-freeze-v13";
import {
  TSD_CP005_APPROVED_NATIVE_FROZEN_V5_156Q,
  TSD_CP005_HI_PA_FREEZE_ID,
  TSD_CP005_HI_PA_APPROVED_SOURCE_HEAD,
} from "./cp005/localization/native-approved-freeze-v5";

export const TSD_001_QUESTION_STUDIO_PACKAGE_ID = "TSD-001" as const;
export const TSD_001_QUESTION_STUDIO_CP_IDS = ["TSD-CP-005"] as const;
export const TSD_001_QUESTION_STUDIO_LANGUAGES = ["en", "hi", "pa"] as const;
export const TSD_001_QUESTION_STUDIO_RUNTIME_MODE = "QUESTION_STUDIO_REVIEW_ACTIVE" as const;
export const TSD_001_QUESTION_STUDIO_REVIEW_STATUS = "FROZEN_MULTILINGUAL_REVIEW_SURFACE" as const;

export type Tsd001QuestionStudioLanguage = typeof TSD_001_QUESTION_STUDIO_LANGUAGES[number];
export type Tsd001QuestionStudioDifficulty = "Easy" | "Medium" | "Hard";
export type Tsd001QuestionStudioQlId = `TSD-QL-${string}`;
type TsdCp005EnglishFrozenRow = (typeof TSD_CP005_APPROVED_ENGLISH_FROZEN_78Q)[number];

export interface Tsd001QuestionStudioRequest {
  packageId?: string;
  archetypeId?: string;
  patternId?: string;
  topic?: string;
  subtopic?: string;
  canonicalProblemId?: string;
  cpId?: string;
  questionLanguageId?: string;
  difficulty?: string | number;
  language?: Tsd001QuestionStudioLanguage;
  seed?: string;
  count?: number;
}

function difficultyOf(value: string): Tsd001QuestionStudioDifficulty {
  if (value === "EASY") return "Easy";
  if (value === "HARD") return "Hard";
  return "Medium";
}

function normalizeDifficulty(value: unknown): Tsd001QuestionStudioDifficulty | undefined {
  const text = String(value ?? "").trim().toLowerCase();
  if (text === "easy") return "Easy";
  if (text === "medium" || text === "moderate") return "Medium";
  if (text === "hard") return "Hard";
  if (typeof value === "number" && Number.isFinite(value)) {
    if (value >= 6) return "Hard";
    if (value >= 3) return "Medium";
    return "Easy";
  }
  return undefined;
}

function normalizeSelector(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function toJsonSafe(value: unknown): unknown {
  if (typeof value === "bigint") return value.toString();
  if (Array.isArray(value)) return value.map(toJsonSafe);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, toJsonSafe(item)]),
    );
  }
  return value;
}

export function isTsd001QuestionStudioRequest(request: Tsd001QuestionStudioRequest): boolean {
  const packageId = normalizeSelector(request.packageId ?? request.archetypeId);
  const patternId = normalizeSelector(request.patternId);
  const topic = normalizeSelector(request.topic);
  const subtopic = normalizeSelector(request.subtopic);
  const selectors = new Set([
    "time speed distance",
    "time speed and distance",
    "time speed distance tsd",
    "tsd",
  ]);
  return packageId === "tsd 001"
    || patternId.includes("tsd 001")
    || selectors.has(topic)
    || selectors.has(subtopic)
    || (topic === "arithmetic" && selectors.has(subtopic));
}

const ENGLISH_BY_QL = new Map<string, readonly TsdCp005EnglishFrozenRow[]>();
for (const row of TSD_CP005_APPROVED_ENGLISH_FROZEN_78Q) {
  const bucket = ENGLISH_BY_QL.get(row.permanentQlId) ?? [];
  ENGLISH_BY_QL.set(row.permanentQlId, Object.freeze([...bucket, row]));
}

const QL_IDS = Object.freeze([...ENGLISH_BY_QL.keys()].sort()) as readonly Tsd001QuestionStudioQlId[];
if (QL_IDS.length !== 13 || QL_IDS[0] !== "TSD-QL-058" || QL_IDS[12] !== "TSD-QL-070") {
  throw new Error("TSD-001 Question Studio adapter lost frozen CP005 QL coverage.");
}

export const TSD_001_QUESTION_STUDIO_PACKAGE = Object.freeze({
  id: TSD_001_QUESTION_STUDIO_PACKAGE_ID,
  packageId: TSD_001_QUESTION_STUDIO_PACKAGE_ID,
  type: "quant-v4",
  section: "Quant",
  domain: "quant",
  topic: "Arithmetic",
  subtopic: "Time, Speed & Distance",
  name: "TSD-001 Time, Speed & Distance",
  label: "Time, Speed & Distance",
  generationDomain: "quant-v4",
  cpIds: [...TSD_001_QUESTION_STUDIO_CP_IDS],
  canonicalProblems: TSD_001_QUESTION_STUDIO_CP_IDS.map((id) => ({ id, label: id })),
  supportedDifficulties: ["easy", "medium", "hard"],
  supportedLanguages: [...TSD_001_QUESTION_STUDIO_LANGUAGES],
  enabled: true,
  runtimeMode: TSD_001_QUESTION_STUDIO_RUNTIME_MODE,
  supportedRuntimeModes: [TSD_001_QUESTION_STUDIO_RUNTIME_MODE],
  reviewStatus: TSD_001_QUESTION_STUDIO_REVIEW_STATUS,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
  questionStudioReviewOnly: true,
  frozenQlRange: "TSD-QL-058..TSD-QL-070",
  uniqueFrozenQuestionsPerLanguage: 78,
});

function rowsFor(language: Tsd001QuestionStudioLanguage, qlId: string) {
  if (language === "en") return ENGLISH_BY_QL.get(qlId) ?? [];
  return TSD_CP005_APPROVED_NATIVE_FROZEN_V5_156Q.filter(
    (row) => row.source.permanentQlId === qlId && row.presentation.language === language,
  );
}

function normalizeRow(row: any, language: Tsd001QuestionStudioLanguage, itemSeed: string) {
  const source = language === "en" ? row : row.source;
  const presentation = language === "en" ? row : row.presentation;
  const difficultyBand = difficultyOf(source.difficulty);
  const explanation = presentation.explanation;
  const explanationLines = Object.freeze([
    explanation.method,
    ...explanation.steps,
    explanation.shortcut,
    explanation.finalAnswer,
  ].filter((line): line is string => typeof line === "string" && line.trim().length > 0));
  const identity = hash([
    source.permanentQlId,
    language,
    source.seed,
    itemSeed,
    presentation.stem,
  ].join("|")).toString(16).padStart(8, "0");
  const questionId = `TSD-${source.permanentQlId.slice(-3)}-${language.toUpperCase()}-${identity}`;
  const locale = language === "en" ? "en-IN" : language === "hi" ? "hi-IN" : "pa-IN";
  const answer = String(presentation.answerText);
  const validationErrors = Array.isArray(source.validation?.errors)
    ? source.validation.errors.map(String)
    : [];
  const validationOk = source.validation?.valid !== false && validationErrors.length === 0;
  const safeSourceInput = Object.freeze(toJsonSafe(source.input) as Record<string, unknown>);
  const safeSourceValidation = Object.freeze(toJsonSafe(source.validation) as Record<string, unknown>);
  const safeRepresentation = toJsonSafe(source.representation);
  const traceability = Object.freeze({
    releaseId: "TSD-CP005-MULTILINGUAL-FROZEN-STUDIO-REVIEW-V1",
    englishFreezeId: TSD_CP005_ENGLISH_FREEZE_ID,
    nativeFreezeId: TSD_CP005_HI_PA_FREEZE_ID,
    nativeApprovedSourceHead: TSD_CP005_HI_PA_APPROVED_SOURCE_HEAD,
    permanentQlId: source.permanentQlId,
    checkpointId: "TSD-CP-005",
    solveMode: source.solveMode,
    mathematicalFingerprint: source.mathematicalFingerprint,
    frozenSourceSeed: source.seed,
    sourceQuestionStudioEnabled: false,
    adapterQuestionStudioAccess: true,
    questionStudioReviewOnly: true,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
  });

  const questionPackage = Object.freeze({
    packageId: TSD_001_QUESTION_STUDIO_PACKAGE_ID,
    canonicalProblemId: "TSD-CP-005" as const,
    questionLanguageId: source.permanentQlId,
    explanationId: `${source.permanentQlId}-EXP-${language.toUpperCase()}`,
    questionId,
    stem: String(presentation.stem),
    options: Object.freeze([...presentation.options].map(String)),
    correctIndex: Number(presentation.correctIndex),
    answer,
    difficultyBand,
    language,
    locale,
    runtimeMode: TSD_001_QUESTION_STUDIO_RUNTIME_MODE,
    reviewStatus: TSD_001_QUESTION_STUDIO_REVIEW_STATUS,
    questionBankStatus: "NOT_STORED" as const,
    testEligibility: "INELIGIBLE" as const,
    publiclyPublishable: false as const,
    questionStudioReviewOnly: true as const,
    explanation: Object.freeze({ lines: explanationLines }),
    solveMode: source.solveMode,
    representation: safeRepresentation,
    validation: Object.freeze({ ok: validationOk, valid: validationOk, errors: Object.freeze(validationErrors), source: safeSourceValidation }),
    traceability,
  });

  const canonicalAnswer = Object.freeze({
    kind: "symbolic",
    value: answer,
    display: answer,
    rendered: answer,
    rounding: "exact",
  });

  const question = Object.freeze({
    text: questionPackage.stem,
    stem: questionPackage.stem,
    options: [...questionPackage.options],
    correct: questionPackage.correctIndex,
    correctIndex: questionPackage.correctIndex,
    explanation: explanationLines.join("\n\n"),
    packageExplanation: questionPackage.explanation,
    difficulty: difficultyBand,
    difficultyLabel: difficultyBand,
    patternId: TSD_001_QUESTION_STUDIO_PACKAGE_ID,
    section: "Quant",
    topic: "Arithmetic",
    subtopic: "Time, Speed & Distance",
    generationBackend: "quant-v4",
    debugSource: "tsd-cp005-frozen-review-adapter",
    semanticMetadata: traceability,
    traceability,
    validation: questionPackage.validation,
    questionId,
    seed: itemSeed,
    answer,
    canonicalAnswer,
    runtimeMode: questionPackage.runtimeMode,
    reviewStatus: questionPackage.reviewStatus,
    questionBankStatus: questionPackage.questionBankStatus,
    testEligibility: questionPackage.testEligibility,
    publiclyPublishable: questionPackage.publiclyPublishable,
    packageSource: "frozen-multilingual-review-authority",
    packageId: TSD_001_QUESTION_STUDIO_PACKAGE_ID,
    taskKind: source.solveMode,
    language,
    metadata: Object.freeze({
      language,
      locale,
      packageId: TSD_001_QUESTION_STUDIO_PACKAGE_ID,
      canonicalProblemId: "TSD-CP-005",
      questionLanguageId: source.permanentQlId,
      explanationId: questionPackage.explanationId,
      runtimeMode: questionPackage.runtimeMode,
      reviewStatus: questionPackage.reviewStatus,
      questionBankStatus: questionPackage.questionBankStatus,
      testEligibility: questionPackage.testEligibility,
      publiclyPublishable: false,
      releaseId: traceability.releaseId,
    }),
    canonicalProblemId: "TSD-CP-005",
    questionLanguageId: source.permanentQlId,
    explanationId: questionPackage.explanationId,
    proceduralLogic: safeSourceInput,
    logic: safeSourceInput,
  });

  return Object.freeze({ questionPackage, question });
}

export function generateTsd001QuestionStudioBatch(request: Tsd001QuestionStudioRequest = {}) {
  const language = request.language ?? "en";
  if (!TSD_001_QUESTION_STUDIO_LANGUAGES.includes(language)) {
    throw new Error(`TSD-001 does not support Question Studio language '${String(language)}'.`);
  }
  const cpId = request.canonicalProblemId ?? request.cpId;
  if (cpId && cpId !== "TSD-CP-005") {
    throw new Error(`TSD-001 Question Studio currently exposes frozen TSD-CP-005 only, not '${cpId}'.`);
  }

  const explicitQl = request.questionLanguageId as Tsd001QuestionStudioQlId | undefined;
  if (explicitQl && !QL_IDS.includes(explicitQl)) {
    throw new Error(`Unknown frozen CP005 Question Language '${explicitQl}'.`);
  }
  const difficulty = normalizeDifficulty(request.difficulty);
  const eligibleQls = QL_IDS.filter((qlId) => {
    if (explicitQl && qlId !== explicitQl) return false;
    const source = (ENGLISH_BY_QL.get(qlId) ?? [])[0];
    return source && (!difficulty || difficultyOf(source.difficulty) === difficulty);
  });
  if (!eligibleQls.length) throw new Error("No frozen CP005 Question Studio rows match the requested filters.");

  const count = Math.min(1000, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const batchSeed = request.seed ?? `tsd-cp005-studio:${Date.now()}`;
  const results: Array<{ questionPackage: any; question: any }> = [];
  for (let index = 0; index < count; index += 1) {
    const qlId = eligibleQls[hash(`${batchSeed}:ql:${index}`) % eligibleQls.length]!;
    const variants = rowsFor(language, qlId);
    if (variants.length !== 6) throw new Error(`${qlId}/${language}: expected six frozen review variants, found ${variants.length}.`);
    const itemSeed = `${batchSeed}:${qlId}:${index}`;
    const row = variants[hash(`${itemSeed}:variant`) % variants.length]!;
    results.push(normalizeRow(row, language, itemSeed));
  }

  return Object.freeze({
    generationContext: Object.freeze({
      generationDomain: "quant-v4",
      packageId: TSD_001_QUESTION_STUDIO_PACKAGE_ID,
      checkpointId: "TSD-CP-005",
      seed: batchSeed,
      timestamp: Date.now(),
      runtimeMode: TSD_001_QUESTION_STUDIO_RUNTIME_MODE,
      reviewStatus: TSD_001_QUESTION_STUDIO_REVIEW_STATUS,
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
      questionStudioReviewOnly: true,
      uniqueFrozenSurfacePerLanguage: 78,
    }),
    questionPackages: Object.freeze(results.map((item) => item.questionPackage)),
    questions: Object.freeze(results.map((item) => item.question)),
  });
}

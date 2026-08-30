import { createHash } from "node:crypto";

import {
  BTD_PERMANENT_QL_REGISTRY,
  type BtdPermanentQlId,
} from "../BTD-CP-002/btd-cp002-permanent-ql-registry-v1";
import {
  BTD_CP005_ENGLISH_FREEZE_MANIFEST_V1,
  BTD_CP005_ENGLISH_FREEZE_VERSION,
} from "../BTD-CP-005/btd-cp005-english-freeze-v1";
import {
  BTD_CP006_QUESTION_STUDIO_PACKAGE,
  btdCp006DifficultyForQl,
  buildBtdCp006QuestionStudioPreview,
  isBtdCp006QuestionStudioRequest,
  type BtdCp006Difficulty,
  type BtdCp006QuestionStudioRequest,
} from "../BTD-CP-006/btd-cp006-question-studio-review-v1";
import {
  BTD_CP009_HI_PA_FREEZE_BOUNDARY,
  BTD_CP009_HI_PA_FREEZE_MANIFEST_V1,
  BTD_CP009_HI_PA_FREEZE_VERSION,
  buildBtdFrozenHiPaQuestionV1,
} from "../BTD-CP-009/btd-cp009-hi-pa-freeze-v1";

export const BTD_CP010_QUESTION_STUDIO_VERSION = "BTD-001-CP010-MULTILINGUAL-QUESTION-STUDIO-v1" as const;
export const BTD_CP010_LANGUAGES = ["en", "hi", "pa"] as const;
export type BtdCp010Language = typeof BTD_CP010_LANGUAGES[number];
export type BtdCp010QuestionStudioRequest = BtdCp006QuestionStudioRequest;

export const BTD_CP010_QUESTION_STUDIO_BOUNDARY = Object.freeze({
  status: "QUESTION_STUDIO_MULTILINGUAL_REVIEW_ONLY" as const,
  activationAuthorized: true as const,
  frozenEnglishAuthorityRequired: true as const,
  frozenHiPaAuthorityRequired: true as const,
  questionStudioDiscoverable: true as const,
  questionStudioGenerationEnabled: true as const,
  questionBankStatus: "NOT_STORED" as const,
  questionBankWritable: false as const,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
  contentMutationAuthorized: false as const,
});

export const BTD_CP010_QUESTION_STUDIO_PACKAGE = Object.freeze({
  ...BTD_CP006_QUESTION_STUDIO_PACKAGE,
  supportedLanguages: BTD_CP010_LANGUAGES,
  runtimeMode: BTD_CP010_QUESTION_STUDIO_BOUNDARY.status,
  reviewStatus: "FROZEN_EN_HI_PA_CONTENT_AUTHORITY" as const,
  contentFreezeStatus: "FROZEN_EN_HI_PA" as const,
  freezeVersion: BTD_CP009_HI_PA_FREEZE_VERSION,
  frozenChapterFingerprint: BTD_CP009_HI_PA_FREEZE_MANIFEST_V1.chapterFingerprint,
  freezeVersions: Object.freeze({
    en: BTD_CP005_ENGLISH_FREEZE_VERSION,
    hi: BTD_CP009_HI_PA_FREEZE_VERSION,
    pa: BTD_CP009_HI_PA_FREEZE_VERSION,
  }),
  frozenChapterFingerprints: Object.freeze({
    en: BTD_CP005_ENGLISH_FREEZE_MANIFEST_V1.chapterFingerprint,
    hi: BTD_CP009_HI_PA_FREEZE_MANIFEST_V1.chapterFingerprint,
    pa: BTD_CP009_HI_PA_FREEZE_MANIFEST_V1.chapterFingerprint,
  }),
  questionStudioDiscoverable: true,
  questionStudioGenerationEnabled: true,
  questionBankStatus: "NOT_STORED",
  questionBankWritable: false,
  testEligibility: "INELIGIBLE",
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
  automaticStudentPublication: false,
});

function normalizeLanguage(value: unknown): BtdCp010Language {
  const text = String(value ?? "en").trim().toLowerCase();
  if (["en", "en-in", "english"].includes(text)) return "en";
  if (["hi", "hi-in", "hindi"].includes(text)) return "hi";
  if (["pa", "pa-in", "punjabi", "panjabi", "pb"].includes(text)) return "pa";
  throw Object.assign(new Error(`Unsupported BTD-001 Question Studio language '${String(value)}'.`), { statusCode: 400 });
}

function normalizeDifficulty(value: unknown): BtdCp006Difficulty | null {
  const text = String(value ?? "").trim().toLowerCase();
  if (!text || text === "mixed" || text === "all") return null;
  if (text === "easy") return "Easy";
  if (text === "medium" || text === "moderate") return "Medium";
  if (text === "hard") return "Hard";
  throw Object.assign(new Error(`Unsupported BTD-001 Question Studio difficulty '${String(value)}'.`), { statusCode: 400 });
}

function isQlId(value: unknown): value is BtdPermanentQlId {
  const text = String(value ?? "").trim().toUpperCase();
  return BTD_PERMANENT_QL_REGISTRY.some((entry) => entry.qlId === text);
}

function requestedQlIds(request: BtdCp010QuestionStudioRequest) {
  const explicitQl = String(request.questionLanguageId ?? "").trim().toUpperCase();
  if (explicitQl) {
    if (isQlId(explicitQl)) return [explicitQl];
    throw Object.assign(new Error(`Unknown BTD-001 question language id '${explicitQl}'.`), { statusCode: 400 });
  }
  const selector = String(request.canonicalProblemId ?? request.cpId ?? "").trim().toUpperCase();
  if (!selector) return BTD_PERMANENT_QL_REGISTRY.map((entry) => entry.qlId);
  if (isQlId(selector)) return [selector];
  if (selector === "BTD-CP-001" || selector === "BTD-CP-002") {
    return BTD_PERMANENT_QL_REGISTRY.filter((entry) => entry.origin === selector).map((entry) => entry.qlId);
  }
  throw Object.assign(new Error(`Unknown BTD-001 canonical problem or CP '${selector}'.`), { statusCode: 400 });
}

function stableIndex(seed: string, size: number) {
  return createHash("sha256").update(seed).digest().readUInt32BE(0) % size;
}
function stableOrder<T>(items: readonly T[], seed: string) {
  return [...items].sort((left, right) => {
    const a = createHash("sha256").update(`${seed}:${String(left)}`).digest("hex");
    const b = createHash("sha256").update(`${seed}:${String(right)}`).digest("hex");
    return a.localeCompare(b);
  });
}

function assertHiPaFrozenAuthorityAvailable() {
  if (!BTD_CP009_HI_PA_FREEZE_BOUNDARY.multilingualFreezeApproved || !BTD_CP009_HI_PA_FREEZE_BOUNDARY.multilingualFrozen) {
    throw new Error("BTD-001 multilingual Question Studio requires the CP009 frozen Hindi/Punjabi authority.");
  }
  if (
    BTD_CP009_HI_PA_FREEZE_BOUNDARY.questionStudioDiscoverable
    || BTD_CP009_HI_PA_FREEZE_BOUNDARY.questionStudioGenerationEnabled
    || BTD_CP009_HI_PA_FREEZE_BOUNDARY.questionBankWritable
    || BTD_CP009_HI_PA_FREEZE_BOUNDARY.testEligible
    || BTD_CP009_HI_PA_FREEZE_BOUNDARY.mockTestEligible
    || BTD_CP009_HI_PA_FREEZE_BOUNDARY.publiclyPublishable
  ) {
    throw new Error("BTD-001 CP009 source crossed its pre-Studio lifecycle boundary.");
  }
}

export function isBtdCp010QuestionStudioRequest(request: BtdCp010QuestionStudioRequest = {}) {
  return isBtdCp006QuestionStudioRequest(request);
}

function localizedExplanationLines(source: ReturnType<typeof buildBtdFrozenHiPaQuestionV1>, language: "hi" | "pa") {
  const label = language === "hi"
    ? { given: "दिया गया", asked: "पूछा गया", method: "विधि", answer: "उत्तर" }
    : { given: "ਦਿੱਤਾ ਗਿਆ", asked: "ਪੁੱਛਿਆ ਗਿਆ", method: "ਵਿਧੀ", answer: "ਉੱਤਰ" };
  return Object.freeze([
    `${label.given}: ${source.explanation.whatGiven}`,
    `${label.asked}: ${source.explanation.whatAsked}`,
    `${label.method}: ${source.explanation.keyIdea}`,
    ...source.explanation.steps,
    `${label.answer}: ${source.explanation.finalAnswer}`,
  ]);
}

function buildLocalizedPreview(qlId: BtdPermanentQlId, seed: string, language: "hi" | "pa", index: number, count: number) {
  assertHiPaFrozenAuthorityAvailable();
  const allocation = BTD_PERMANENT_QL_REGISTRY.find((entry) => entry.qlId === qlId);
  if (!allocation) throw new Error(`${qlId}: missing BTD permanent allocation.`);
  const source = buildBtdFrozenHiPaQuestionV1(qlId, seed, language);
  const difficulty = btdCp006DifficultyForQl(qlId);
  const options = Object.freeze(source.options.map((option: any) => option.text));
  const lines = localizedExplanationLines(source, language);
  const languageTag = language.toUpperCase();
  const questionId = `BTD-${qlId.slice(-3)}-${languageTag}-${createHash("sha256").update(`${qlId}:${language}:${seed}:${source.contentFingerprint}`).digest("hex").slice(0, 20)}`;

  return Object.freeze({
    id: questionId,
    questionId,
    text: source.presentation.stem,
    stem: source.presentation.stem,
    options,
    correct: source.correctIndex,
    correctIndex: source.correctIndex,
    answer: source.correctAnswer,
    canonicalAnswer: Object.freeze({ kind: "display", value: source.correctAnswer, display: source.correctAnswer, rendered: source.correctAnswer, rounding: "source-authority" }),
    answerModel: Object.freeze({ kind: "single_choice", options, correctOptionIndex: source.correctIndex }),
    explanation: lines.join("\n\n"),
    packageExplanation: source.explanation,
    explanationStandard: "BTD-HUMAN-WORKED-SOLUTION-v1",
    section: "Quant",
    subject: "Quantitative Aptitude",
    topic: "Arithmetic",
    subtopic: "Banker's Discount & True Discount",
    difficulty,
    difficultyLabel: difficulty,
    packageId: "BTD-001",
    patternId: "BTD-001",
    canonicalProblemId: allocation.origin,
    cpId: allocation.origin,
    questionLanguageId: qlId,
    qlId,
    qlTitle: allocation.title,
    semanticSignature: allocation.semanticSignature,
    answerSemantic: allocation.answerSemantic,
    language,
    locale: language === "hi" ? "hi-IN" as const : "pa-IN" as const,
    seed,
    checkpointId: "BTD-CP-010" as const,
    runtimeMode: BTD_CP010_QUESTION_STUDIO_BOUNDARY.status,
    reviewStatus: "FROZEN_EN_HI_PA_CONTENT_AUTHORITY" as const,
    activationAuthorized: true as const,
    questionStudioDiscoverable: true as const,
    questionStudioGenerationEnabled: true as const,
    questionBankStatus: "NOT_STORED" as const,
    questionBankWritable: false as const,
    testEligibility: "INELIGIBLE" as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    automaticStudentPublication: false as const,
    contentMutationAuthorized: false as const,
    multilingualFrozen: true as const,
    freezeVersion: BTD_CP009_HI_PA_FREEZE_VERSION,
    frozenContentFingerprint: source.contentFingerprint,
    frozenChapterFingerprint: BTD_CP009_HI_PA_FREEZE_MANIFEST_V1.chapterFingerprint,
    optionMetadata: Object.freeze(source.options.map((option: any) => Object.freeze({ isCorrect: option.isCorrect, misconceptionId: option.misconceptionId }))),
    generationMetadata: Object.freeze({ questionIndex: index + 1, questionCount: count, qlId, cpId: allocation.origin, seed, language, difficulty, freezeVersion: BTD_CP009_HI_PA_FREEZE_VERSION, frozenContentFingerprint: source.contentFingerprint, multilingualFrozen: true, questionStudioDiscoverable: true, questionBankWritable: false, testEligible: false, mockTestEligible: false, publiclyPublishable: false }),
  });
}

export function buildBtdCp010QuestionStudioPreview(qlId: BtdPermanentQlId, seed: string, language: BtdCp010Language = "en", index = 0, count = 1) {
  if (language === "en") {
    const english = buildBtdCp006QuestionStudioPreview(qlId, seed, index, count);
    return Object.freeze({
      ...english,
      checkpointId: "BTD-CP-010" as const,
      runtimeMode: BTD_CP010_QUESTION_STUDIO_BOUNDARY.status,
      reviewStatus: "FROZEN_EN_HI_PA_CONTENT_AUTHORITY" as const,
      multilingualFrozen: true as const,
      generationMetadata: Object.freeze({ ...english.generationMetadata, checkpointId: "BTD-CP-010", multilingualFrozen: true }),
    });
  }
  return buildLocalizedPreview(qlId, seed, language, index, count);
}

export function generateBtdCp010QuestionStudioBatch(request: BtdCp010QuestionStudioRequest = {}) {
  const language = normalizeLanguage(request.language);
  if (language !== "en") assertHiPaFrozenAuthorityAvailable();
  const difficulty = normalizeDifficulty(request.difficulty);
  const count = Math.min(1000, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const batchSeed = String(request.seed ?? `btd-cp010:${Date.now()}`);
  const selected = requestedQlIds(request).filter((qlId) => !difficulty || btdCp006DifficultyForQl(qlId) === difficulty);
  if (!selected.length) throw Object.assign(new Error("No frozen BTD-001 QL matches the requested scope and difficulty."), { statusCode: 400 });
  const order = stableOrder(selected, `${batchSeed}:${language}:ql-order`);
  const offset = stableIndex(`${batchSeed}:${language}:offset`, order.length);
  const questions = Object.freeze(Array.from({ length: count }, (_, index) => {
    const qlId = order[(offset + index) % order.length]!;
    return buildBtdCp010QuestionStudioPreview(qlId, `${batchSeed}:${language}:${qlId}:${index}`, language, index, count);
  }));
  const freezeVersion = language === "en" ? BTD_CP005_ENGLISH_FREEZE_VERSION : BTD_CP009_HI_PA_FREEZE_VERSION;
  const frozenChapterFingerprint = language === "en" ? BTD_CP005_ENGLISH_FREEZE_MANIFEST_V1.chapterFingerprint : BTD_CP009_HI_PA_FREEZE_MANIFEST_V1.chapterFingerprint;
  return Object.freeze({
    generationContext: Object.freeze({ generationDomain: "quant-v4", packageId: "BTD-001", chapterId: "BTD-001", checkpointId: "BTD-CP-010", seed: batchSeed, language, runtimeMode: BTD_CP010_QUESTION_STUDIO_BOUNDARY.status, reviewStatus: "FROZEN_EN_HI_PA_CONTENT_AUTHORITY", supportedLanguages: BTD_CP010_LANGUAGES, questionStudioDiscoverable: true, questionStudioGenerationEnabled: true, questionBankStatus: "NOT_STORED", questionBankWritable: false, testEligibility: "INELIGIBLE", testEligible: false, mockTestEligible: false, publiclyPublishable: false, automaticStudentPublication: false, contentMutationAuthorized: false, multilingualFrozen: true, freezeVersion, frozenChapterFingerprint }),
    questions,
    questionPackages: questions,
  });
}

export function listBtdCp010QuestionStudioPackages() {
  return Object.freeze([BTD_CP010_QUESTION_STUDIO_PACKAGE]);
}

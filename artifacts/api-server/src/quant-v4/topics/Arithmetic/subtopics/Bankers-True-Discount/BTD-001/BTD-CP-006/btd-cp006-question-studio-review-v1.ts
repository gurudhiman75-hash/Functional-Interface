import { createHash } from "node:crypto";
import {
  BTD_PERMANENT_QL_REGISTRY,
  type BtdPermanentQlId,
} from "../BTD-CP-002/btd-cp002-permanent-ql-registry-v1";
import {
  BTD_CP005_ENGLISH_FREEZE_BOUNDARY,
  BTD_CP005_ENGLISH_FREEZE_MANIFEST_V1,
  BTD_CP005_ENGLISH_FREEZE_VERSION,
  buildBtdFrozenEnglishQuestionV1,
} from "../BTD-CP-005/btd-cp005-english-freeze-v1";

export const BTD_CP006_QUESTION_STUDIO_VERSION = "BTD-001-CP006-QUESTION-STUDIO-REVIEW-v1" as const;
export const BTD_CP006_LANGUAGES = ["en"] as const;
export const BTD_CP006_DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
export type BtdCp006Difficulty = typeof BTD_CP006_DIFFICULTIES[number];

export type BtdCp006QuestionStudioRequest = Readonly<{
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

const EASY_QLS = new Set(["BTD-QL-001", "BTD-QL-002", "BTD-QL-003", "BTD-QL-004"]);
const HARD_QLS = new Set(["BTD-QL-009", "BTD-QL-011", "BTD-QL-018"]);

export function btdCp006DifficultyForQl(qlId: BtdPermanentQlId): BtdCp006Difficulty {
  if (EASY_QLS.has(qlId)) return "Easy";
  if (HARD_QLS.has(qlId)) return "Hard";
  return "Medium";
}

export const BTD_CP006_QUESTION_STUDIO_BOUNDARY = Object.freeze({
  status: "QUESTION_STUDIO_REVIEW_ONLY" as const,
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
});

export const BTD_CP006_QUESTION_STUDIO_PACKAGE = Object.freeze({
  id: "BTD-001",
  packageId: "BTD-001",
  type: "quant-v4",
  section: "Quant",
  domain: "quant",
  subject: "Quantitative Aptitude",
  topic: "Arithmetic",
  subtopic: "Banker's Discount & True Discount",
  name: "BTD-001 Banker's Discount, True Discount & Banker's Gain",
  label: "Banker's Discount & True Discount",
  generationDomain: "quant-v4",
  canonicalProblems: Object.freeze([
    Object.freeze({ id: "BTD-CP-001", label: "Core Banker’s/True Discount Relations" }),
    Object.freeze({ id: "BTD-CP-002", label: "Inverse & Multi-Relation Systems" }),
  ]),
  cpIds: Object.freeze(["BTD-CP-001", "BTD-CP-002"]),
  permanentQlCount: BTD_PERMANENT_QL_REGISTRY.length,
  permanentQlIds: Object.freeze(BTD_PERMANENT_QL_REGISTRY.map((entry) => entry.qlId)),
  supportedLanguages: BTD_CP006_LANGUAGES,
  supportedDifficulties: BTD_CP006_DIFFICULTIES,
  enabled: true,
  runtimeMode: BTD_CP006_QUESTION_STUDIO_BOUNDARY.status,
  reviewStatus: "FROZEN_ENGLISH_CONTENT_AUTHORITY",
  contentFreezeStatus: BTD_CP005_ENGLISH_FREEZE_BOUNDARY.contentFreezeStatus,
  freezeVersion: BTD_CP005_ENGLISH_FREEZE_VERSION,
  frozenChapterFingerprint: BTD_CP005_ENGLISH_FREEZE_MANIFEST_V1.chapterFingerprint,
  activationAuthorized: true,
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

function normalizeSelector(value: unknown) {
  return String(value ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/gu, " ").trim();
}
function isQlId(value: unknown): value is BtdPermanentQlId {
  const text = String(value ?? "").trim().toUpperCase();
  return BTD_PERMANENT_QL_REGISTRY.some((entry) => entry.qlId === text);
}
function normalizeLanguage(value: unknown) {
  const text = String(value ?? "en").trim().toLowerCase();
  if (["en", "en-in", "english"].includes(text)) return "en" as const;
  throw Object.assign(new Error(`BTD-001 Question Studio currently supports frozen English only; '${String(value)}' is not activated.`), { statusCode: 400 });
}
function normalizeDifficulty(value: unknown): BtdCp006Difficulty | null {
  const text = String(value ?? "").trim().toLowerCase();
  if (!text || text === "mixed" || text === "all") return null;
  if (text === "easy") return "Easy";
  if (text === "medium" || text === "moderate") return "Medium";
  if (text === "hard") return "Hard";
  throw Object.assign(new Error(`Unsupported BTD-001 Question Studio difficulty '${String(value)}'.`), { statusCode: 400 });
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

function assertFrozenAuthorityAvailable() {
  if (!BTD_CP005_ENGLISH_FREEZE_BOUNDARY.contentFrozen || !BTD_CP005_ENGLISH_FREEZE_BOUNDARY.productionAuthorityFrozen) {
    throw new Error("BTD-001 Question Studio requires the CP005 frozen English authority.");
  }
  if (
    BTD_CP005_ENGLISH_FREEZE_BOUNDARY.questionStudioDiscoverable
    || BTD_CP005_ENGLISH_FREEZE_BOUNDARY.questionBankWritable
    || BTD_CP005_ENGLISH_FREEZE_BOUNDARY.testEligible
    || BTD_CP005_ENGLISH_FREEZE_BOUNDARY.mockTestEligible
    || BTD_CP005_ENGLISH_FREEZE_BOUNDARY.publiclyPublishable
  ) {
    throw new Error("BTD-001 CP005 source crossed its pre-Question-Studio lifecycle boundary.");
  }
}

export function isBtdCp006QuestionStudioRequest(request: BtdCp006QuestionStudioRequest = {}) {
  const explicit = String(request.packageId ?? request.archetypeId ?? "").trim().toUpperCase();
  if (explicit === "BTD-001" || explicit === "BTD") return true;
  const pattern = String(request.patternId ?? "").trim().toUpperCase();
  if (pattern === "BTD-001" || pattern === "BTD") return true;
  if (isQlId(request.questionLanguageId)) return true;
  const cp = String(request.canonicalProblemId ?? request.cpId ?? "").trim().toUpperCase();
  if (cp === "BTD-CP-001" || cp === "BTD-CP-002") return true;
  const subtopic = normalizeSelector(request.subtopic);
  return subtopic.includes("banker s discount")
    || subtopic.includes("bankers discount")
    || subtopic.includes("true discount")
    || subtopic.includes("banker s gain")
    || subtopic.includes("bankers gain");
}

function requestedQlIds(request: BtdCp006QuestionStudioRequest) {
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

function explanationLines(source: ReturnType<typeof buildBtdFrozenEnglishQuestionV1>) {
  return Object.freeze([
    `Given: ${source.explanation.whatGiven}`,
    `Asked: ${source.explanation.whatAsked}`,
    `Method: ${source.explanation.keyIdea}`,
    ...source.explanation.steps,
    `Answer: ${source.explanation.finalAnswer}`,
  ]);
}

export function buildBtdCp006QuestionStudioPreview(qlId: BtdPermanentQlId, seed: string, index = 0, count = 1) {
  assertFrozenAuthorityAvailable();
  const allocation = BTD_PERMANENT_QL_REGISTRY.find((entry) => entry.qlId === qlId);
  if (!allocation) throw new Error(`${qlId}: missing BTD permanent allocation.`);
  const source = buildBtdFrozenEnglishQuestionV1(qlId, seed);
  const difficulty = btdCp006DifficultyForQl(qlId);
  const lines = explanationLines(source);
  const questionId = `BTD-${qlId.slice(-3)}-EN-${createHash("sha256").update(`${qlId}:${seed}:${source.contentFingerprint}`).digest("hex").slice(0, 20)}`;
  const options = Object.freeze(source.options.map((option) => option.text));

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
    language: "en" as const,
    locale: "en-IN" as const,
    seed,
    runtimeMode: BTD_CP006_QUESTION_STUDIO_BOUNDARY.status,
    reviewStatus: "FROZEN_ENGLISH_CONTENT_AUTHORITY" as const,
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
    freezeVersion: BTD_CP005_ENGLISH_FREEZE_VERSION,
    frozenContentFingerprint: source.contentFingerprint,
    frozenChapterFingerprint: BTD_CP005_ENGLISH_FREEZE_MANIFEST_V1.chapterFingerprint,
    optionMetadata: Object.freeze(source.options.map((option) => Object.freeze({ isCorrect: option.isCorrect, misconceptionId: option.misconceptionId }))),
    generationMetadata: Object.freeze({ questionIndex: index + 1, questionCount: count, qlId, cpId: allocation.origin, seed, language: "en", difficulty, freezeVersion: BTD_CP005_ENGLISH_FREEZE_VERSION, frozenContentFingerprint: source.contentFingerprint, questionStudioDiscoverable: true, questionBankWritable: false, testEligible: false, mockTestEligible: false, publiclyPublishable: false }),
  });
}

export function generateBtdCp006QuestionStudioBatch(request: BtdCp006QuestionStudioRequest = {}) {
  assertFrozenAuthorityAvailable();
  const language = normalizeLanguage(request.language);
  const difficulty = normalizeDifficulty(request.difficulty);
  const count = Math.min(1000, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const batchSeed = String(request.seed ?? `btd-cp006:${Date.now()}`);
  const selected = requestedQlIds(request).filter((qlId) => !difficulty || btdCp006DifficultyForQl(qlId) === difficulty);
  if (!selected.length) throw Object.assign(new Error("No frozen BTD-001 QL matches the requested scope and difficulty."), { statusCode: 400 });
  const order = stableOrder(selected, `${batchSeed}:ql-order`);
  const offset = stableIndex(`${batchSeed}:offset`, order.length);
  const questions = Object.freeze(Array.from({ length: count }, (_, index) => {
    const qlId = order[(offset + index) % order.length]!;
    return buildBtdCp006QuestionStudioPreview(qlId, `${batchSeed}:${language}:${qlId}:${index}`, index, count);
  }));
  return Object.freeze({
    generationContext: Object.freeze({ generationDomain: "quant-v4", packageId: "BTD-001", chapterId: "BTD-001", checkpointId: "BTD-CP-006", seed: batchSeed, runtimeMode: BTD_CP006_QUESTION_STUDIO_BOUNDARY.status, reviewStatus: "FROZEN_ENGLISH_CONTENT_AUTHORITY", supportedLanguages: BTD_CP006_LANGUAGES, questionStudioDiscoverable: true, questionStudioGenerationEnabled: true, questionBankStatus: "NOT_STORED", questionBankWritable: false, testEligibility: "INELIGIBLE", testEligible: false, mockTestEligible: false, publiclyPublishable: false, automaticStudentPublication: false, freezeVersion: BTD_CP005_ENGLISH_FREEZE_VERSION, frozenChapterFingerprint: BTD_CP005_ENGLISH_FREEZE_MANIFEST_V1.chapterFingerprint }),
    questions,
    questionPackages: questions,
  });
}

export function listBtdCp006QuestionStudioPackages() {
  return Object.freeze([BTD_CP006_QUESTION_STUDIO_PACKAGE]);
}

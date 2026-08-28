import {
  TRG_001_AUTHORITY_ALIGNED_IDS,
  authorityFamilyForTrg001Ql,
} from "./production-authority-runtime";
import {
  generateHumanApprovedTrg001Question,
  TRG_001_FREEZE,
  TRG_001_HUMAN_APPROVAL,
} from "./production-human-approved-runtime";

export type Trg001QuestionStudioLanguage = "en";

export const TRG_001_QUESTION_STUDIO_LANGUAGES = ["en"] as const;
export const TRG_001_QUESTION_STUDIO_CP_IDS = [
  "TRG-CP-001",
  "TRG-CP-002",
  "TRG-CP-003",
  "TRG-CP-004",
  "TRG-CP-005",
  "TRG-CP-006",
] as const;

export const TRG_001_INTERNAL_ACTIVATION = Object.freeze({
  status: "APPROVED_INTERNAL_ENGLISH" as const,
  runtimeMode: "RELEASED" as const,
  activationAuthorized: true,
  questionStudioDiscoverable: true,
  questionBankStatus: "WRITABLE" as const,
  questionBankWritable: true,
  testEligibility: "ELIGIBLE" as const,
  testEligible: true,
  mockTestEligible: true,
  publiclyPublishable: false,
  publicReleaseAuthorized: false,
  automaticStudentPublication: false,
  localizationStatus: "ENGLISH_ONLY" as const,
  contentMutationAuthorized: false,
  frozenContentFingerprint: TRG_001_FREEZE.approvedContentFingerprint,
});

export const TRG_001_QUESTION_STUDIO_PACKAGE = Object.freeze({
  id: "TRG-001",
  packageId: "TRG-001",
  type: "quant-v4",
  section: "Quant",
  domain: "quant",
  subject: "Quantitative Aptitude",
  topic: "Advanced Mathematics",
  subtopic: "Trigonometry — Ratios, Values & Identities",
  name: "TRG-001 Trigonometry Fundamentals, Standard Values & Identities",
  label: "Trigonometry — Ratios, Values & Identities",
  generationDomain: "quant-v4",
  canonicalProblems: TRG_001_QUESTION_STUDIO_CP_IDS.map((cpId) => ({ id: cpId, label: cpId })),
  cpIds: [...TRG_001_QUESTION_STUDIO_CP_IDS],
  permanentQlCount: 144,
  permanentQlIds: [...TRG_001_AUTHORITY_ALIGNED_IDS],
  supportedDifficulties: ["Easy", "Medium", "Hard"],
  supportedLanguages: [...TRG_001_QUESTION_STUDIO_LANGUAGES],
  enabled: true,
  runtimeMode: TRG_001_INTERNAL_ACTIVATION.runtimeMode,
  reviewStatus: "HUMAN_APPROVED",
  humanReviewStatus: "APPROVED_144_OF_144_ENGLISH",
  multilingualFreezeGranted: false,
  activationAuthorized: TRG_001_INTERNAL_ACTIVATION.activationAuthorized,
  questionStudioDiscoverable: TRG_001_INTERNAL_ACTIVATION.questionStudioDiscoverable,
  questionBankStatus: TRG_001_INTERNAL_ACTIVATION.questionBankStatus,
  questionBankWritable: TRG_001_INTERNAL_ACTIVATION.questionBankWritable,
  testEligibility: TRG_001_INTERNAL_ACTIVATION.testEligibility,
  testEligible: TRG_001_INTERNAL_ACTIVATION.testEligible,
  mockTestEligible: TRG_001_INTERNAL_ACTIVATION.mockTestEligible,
  publiclyPublishable: false,
  publicReleaseAuthorized: false,
  automaticStudentPublication: false,
  freezeStatus: TRG_001_FREEZE.status,
  localizationStatus: TRG_001_INTERNAL_ACTIVATION.localizationStatus,
  approvedContentFingerprint: TRG_001_HUMAN_APPROVAL.approvedContentFingerprint,
} as const);

export type Trg001QuestionStudioRequest = {
  packageId?: string;
  archetypeId?: string;
  patternId?: string;
  topic?: string;
  subtopic?: string;
  canonicalProblemId?: string;
  cpId?: string;
  difficulty?: string | number;
  language?: string;
  questionLanguageId?: string;
  seed?: string;
  count?: number;
};

function normalizeText(value: unknown) {
  return String(value ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function normalizeLanguage(value: unknown): Trg001QuestionStudioLanguage {
  const language = String(value ?? "en").trim().toLowerCase();
  if (["en", "en-in", "en-us", "english"].includes(language)) return "en";
  throw Object.assign(
    new Error(`TRG-001 frozen authority is English-only in Question Studio; '${String(value)}' is not activated.`),
    { statusCode: 400 },
  );
}

function cpForQlId(qlId: string) {
  const number = Number(qlId.slice(-3));
  if (number <= 24) return "TRG-CP-001";
  if (number <= 48) return "TRG-CP-002";
  if (number <= 72) return "TRG-CP-003";
  if (number <= 96) return "TRG-CP-004";
  if (number <= 120) return "TRG-CP-005";
  return "TRG-CP-006";
}

function difficultyMatches(actual: string, requested: unknown) {
  if (requested == null || requested === "") return true;
  if (typeof requested === "number" && Number.isFinite(requested)) {
    const band = requested >= 6 ? "hard" : requested >= 3 ? "medium" : "easy";
    return actual.toLowerCase() === band;
  }
  const normalized = String(requested).trim().toLowerCase();
  return actual.toLowerCase() === (normalized === "moderate" ? "medium" : normalized);
}

function stableHash(value: string) {
  let result = 2166136261;
  for (const character of value) {
    result ^= character.charCodeAt(0);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function shuffled<T>(items: readonly T[], seed: string) {
  const result = [...items];
  let state = stableHash(seed) || 1;
  for (let index = result.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const swapIndex = state % (index + 1);
    [result[index], result[swapIndex]] = [result[swapIndex]!, result[index]!];
  }
  return result;
}

export function isTrg001QuestionStudioRequest(request: Trg001QuestionStudioRequest) {
  const explicit = String(request.packageId ?? request.archetypeId ?? "").toUpperCase();
  const pattern = String(request.patternId ?? "").toUpperCase();
  if (explicit === "TRG-001" || pattern === "TRG-001" || pattern.includes("TRG-001")) return true;

  const subtopic = normalizeText(request.subtopic);
  return subtopic.includes("trigonometry ratios")
    || subtopic.includes("trigonometry identities")
    || subtopic.includes("trigonometry fundamentals")
    || subtopic.includes("standard values identities");
}

function requestedQlIds(request: Trg001QuestionStudioRequest) {
  const qlId = String(request.questionLanguageId ?? "").trim().toUpperCase();
  if (qlId) {
    if (TRG_001_AUTHORITY_ALIGNED_IDS.includes(qlId)) return [qlId];
    throw Object.assign(new Error(`Unknown TRG-001 question language id '${qlId}'.`), { statusCode: 400 });
  }

  const selector = String(request.canonicalProblemId ?? request.cpId ?? "").trim().toUpperCase();
  if (!selector) return TRG_001_AUTHORITY_ALIGNED_IDS;
  if (TRG_001_AUTHORITY_ALIGNED_IDS.includes(selector)) return [selector];
  if ((TRG_001_QUESTION_STUDIO_CP_IDS as readonly string[]).includes(selector)) {
    return TRG_001_AUTHORITY_ALIGNED_IDS.filter((qlId) => cpForQlId(qlId) === selector);
  }
  throw Object.assign(new Error(`Unknown TRG-001 canonical problem or CP '${selector}'.`), { statusCode: 400 });
}

function explanationText(question: any) {
  const explanation = question.explanation ?? {};
  return [
    explanation.keyRule ? `Core rule: ${explanation.keyRule}` : "",
    ...(explanation.steps ?? []).map((step: any) => `${String(step.title ?? "Step")}: ${String(step.body ?? "")}`),
    explanation.shortcut ? `Shortcut: ${explanation.shortcut}` : "",
    (explanation.traps ?? []).length ? `Common trap: ${(explanation.traps ?? []).join(" ")}` : "",
  ].filter(Boolean).join("\n\n");
}

function optionDisplay(option: any) {
  return String(option?.display ?? option?.text ?? option?.value ?? option?.label ?? option);
}

function questionStudioPreview(qlId: string, seed: string, index: number, count: number) {
  const source: any = generateHumanApprovedTrg001Question(qlId, seed);
  const cpId = cpForQlId(qlId);
  const options = (source.options ?? []).map(optionDisplay);
  const family = authorityFamilyForTrg001Ql(qlId);
  const explanation = explanationText(source);

  return Object.freeze({
    id: `${qlId}:en:${seed}`,
    questionId: `${qlId}:en:${seed}`,
    text: source.stem,
    stem: source.stem,
    options,
    correct: source.correctIndex,
    correctIndex: source.correctIndex,
    answer: source.answer,
    canonicalAnswer: source.exactAnswer,
    answerModel: Object.freeze({
      kind: "single_choice",
      options,
      correctOptionIndex: source.correctIndex,
    }),
    explanation,
    packageExplanation: source.explanation,
    section: "Quant",
    subject: "Quantitative Aptitude",
    topic: "Advanced Mathematics",
    subtopic: "Trigonometry — Ratios, Values & Identities",
    difficulty: source.difficulty,
    difficultyLabel: source.difficulty,
    packageId: "TRG-001",
    language: "en",
    seed,
    patternId: "TRG-001",
    runtimeMode: TRG_001_INTERNAL_ACTIVATION.runtimeMode,
    reviewStatus: "HUMAN_APPROVED",
    humanReviewStatus: "APPROVED",
    multilingualFreezeGranted: false,
    activationAuthorized: true,
    questionStudioDiscoverable: true,
    questionBankStatus: "WRITABLE",
    questionBankWritable: true,
    testEligibility: "ELIGIBLE",
    testEligible: true,
    mockTestEligible: true,
    publiclyPublishable: false,
    publicReleaseAuthorized: false,
    automaticStudentPublication: false,
    freezeStatus: "FROZEN",
    localizationStatus: "ENGLISH_ONLY",
    canonicalProblemId: cpId,
    cpId,
    questionLanguageId: qlId,
    explanationId: `${qlId}-EXP-EN`,
    taskKind: source.solveMode,
    proceduralLogic: Object.freeze({
      generationSystem: "quant-v4",
      packageId: "TRG-001",
      cpId,
      qlId,
      family,
      solveMode: String(source.solveMode ?? ""),
      target: String(source.target ?? ""),
      seed,
      approvedContentFingerprint: TRG_001_HUMAN_APPROVAL.approvedContentFingerprint,
      freezeFingerprint: TRG_001_FREEZE.approvedContentFingerprint,
      humanReviewStatus: "APPROVED",
      activationAuthorized: true,
      publicReleaseAuthorized: false,
      contentMutationAuthorized: false,
    }),
    motifs: ["TRG-001", cpId, qlId, family],
    languages: ["en"],
    generationMetadata: Object.freeze({
      packageId: "TRG-001",
      cpId,
      qlId,
      questionIndex: index + 1,
      questionCount: count,
      seed,
      language: "en",
      reviewStatus: "HUMAN_APPROVED",
      humanReviewStatus: "APPROVED",
      activationAuthorized: true,
      questionStudioDiscoverable: true,
      questionBankStatus: "WRITABLE",
      testEligibility: "ELIGIBLE",
      publiclyPublishable: false,
      publicReleaseAuthorized: false,
      automaticStudentPublication: false,
      localizationStatus: "ENGLISH_ONLY",
      approvedContentFingerprint: TRG_001_HUMAN_APPROVAL.approvedContentFingerprint,
      freezeFingerprint: TRG_001_FREEZE.approvedContentFingerprint,
    }),
  });
}

export function generateApprovedTrg001QuestionStudioQuestion(qlId: string, seed: string) {
  return questionStudioPreview(qlId, seed, 0, 1);
}

export function generateTrg001QuestionStudioBatch(request: Trg001QuestionStudioRequest = {}) {
  if (TRG_001_HUMAN_APPROVAL.status !== "APPROVED" || TRG_001_FREEZE.status !== "FROZEN") {
    throw new Error("TRG-001 Question Studio activation requires the frozen human-approved 144-QL authority.");
  }
  if (!TRG_001_INTERNAL_ACTIVATION.activationAuthorized) {
    throw new Error("TRG-001 internal Question Studio activation is not authorized.");
  }

  const language = normalizeLanguage(request.language);
  const count = Math.min(1000, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const batchSeed = request.seed ?? `trg-001-question-studio:${Date.now()}:${Math.random().toString(36).slice(2)}`;
  const pool = requestedQlIds(request);
  const difficultyPool = pool.filter((qlId, index) => {
    const probe: any = generateHumanApprovedTrg001Question(qlId, `${batchSeed}:difficulty:${index}`);
    return difficultyMatches(String(probe.difficulty ?? ""), request.difficulty);
  });
  if (!difficultyPool.length) {
    throw Object.assign(new Error("No frozen TRG-001 QL matches the requested difficulty in the selected scope."), { statusCode: 400 });
  }

  const order = shuffled(difficultyPool, `${batchSeed}:ql-order`);
  const questions: any[] = [];
  const questionPackages: any[] = [];
  for (let index = 0; index < count; index += 1) {
    const qlId = order[index % order.length]!;
    const seed = `${batchSeed}:${language}:${qlId}:${index}`;
    const preview = questionStudioPreview(qlId, seed, index, count);
    questions.push(preview);
    questionPackages.push(Object.freeze({
      packageId: "TRG-001",
      cpId: preview.cpId,
      qlId,
      seed,
      language,
      stem: preview.stem,
      options: preview.options,
      correctIndex: preview.correctIndex,
      answer: preview.answer,
      difficulty: preview.difficulty,
      explanation: preview.packageExplanation,
      answerModel: preview.answerModel,
      runtimeMode: preview.runtimeMode,
      reviewStatus: preview.reviewStatus,
      humanReviewStatus: preview.humanReviewStatus,
      activationAuthorized: true,
      questionStudioDiscoverable: true,
      questionBankStatus: "WRITABLE",
      questionBankWritable: true,
      testEligibility: "ELIGIBLE",
      testEligible: true,
      mockTestEligible: true,
      publiclyPublishable: false,
      publicReleaseAuthorized: false,
      automaticStudentPublication: false,
      localizationStatus: "ENGLISH_ONLY",
      freezeStatus: "FROZEN",
    }));
  }

  return Object.freeze({
    generationContext: Object.freeze({
      generationDomain: "quant-v4",
      packageId: "TRG-001",
      seed: batchSeed,
      timestamp: Date.now(),
      runtimeMode: TRG_001_INTERNAL_ACTIVATION.runtimeMode,
      reviewStatus: "HUMAN_APPROVED",
      humanReviewStatus: "APPROVED_144_OF_144_ENGLISH",
      humanReviewed: 144,
      supportedLanguages: ["en"],
      multilingualFreezeGranted: false,
      activationAuthorized: true,
      questionStudioDiscoverable: true,
      questionBankStatus: "WRITABLE",
      questionBankWritable: true,
      testEligibility: "ELIGIBLE",
      testEligible: true,
      mockTestEligible: true,
      publiclyPublishable: false,
      publicReleaseAuthorized: false,
      automaticStudentPublication: false,
      freezeStatus: "FROZEN",
      localizationStatus: "ENGLISH_ONLY",
      approvedContentFingerprint: TRG_001_HUMAN_APPROVAL.approvedContentFingerprint,
      freezeFingerprint: TRG_001_FREEZE.approvedContentFingerprint,
      contentMutationAuthorized: false,
    }),
    questionPackages: Object.freeze(questionPackages),
    questions: Object.freeze(questions),
  });
}

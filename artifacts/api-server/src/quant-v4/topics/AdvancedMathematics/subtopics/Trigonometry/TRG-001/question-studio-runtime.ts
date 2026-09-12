import {
  TRG_001_AUTHORITY_ALIGNED_IDS,
  authorityFamilyForTrg001Ql,
} from "./production-authority-runtime";
import { generatePostFreezeRemediatedTrg001Question } from "./production-post-freeze-remediation-v1";
import { generateLocalizedTrg001QuestionNativeReviewFinal6 } from "./localization-native-v5-pedagogic-review-final6";
import { TRG_001_POST_FINAL5_FREEZE_V1 } from "./post-final5-freeze-v1";
import { TRG_001_POST_FINAL5_QUESTION_STUDIO_ACTIVATION_V1 } from "./post-final5-question-studio-activation-v1";

export type Trg001QuestionStudioLanguage = "en" | "hi" | "pa";

export const TRG_001_QUESTION_STUDIO_LANGUAGES = ["en", "hi", "pa"] as const;
export const TRG_001_QUESTION_STUDIO_CP_IDS = [
  "TRG-CP-001",
  "TRG-CP-002",
  "TRG-CP-003",
  "TRG-CP-004",
  "TRG-CP-005",
  "TRG-CP-006",
] as const;

const ACTIVATION = TRG_001_POST_FINAL5_QUESTION_STUDIO_ACTIVATION_V1;
const FREEZE = TRG_001_POST_FINAL5_FREEZE_V1;
const FREEZE_BINDING_FINGERPRINT = ACTIVATION.authority.evidenceArtifactDigest;

export const TRG_001_INTERNAL_ACTIVATION = Object.freeze({
  status: ACTIVATION.status,
  runtimeMode: "INTERNAL_REVIEW" as const,
  activationAuthorized: true as const,
  questionStudioDiscoverable: ACTIVATION.execution.questionStudioDiscoverable,
  questionBankStatus: "LOCKED" as const,
  questionBankWritable: ACTIVATION.execution.questionBankWritable,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false as const,
  testBuilderEligible: ACTIVATION.execution.testBuilderEligible,
  mockTestEligible: ACTIVATION.execution.mockTestEligible,
  publiclyPublishable: ACTIVATION.execution.publiclyPublishable,
  publicReleaseAuthorized: ACTIVATION.execution.publicReleaseAuthorized,
  automaticStudentPublication: ACTIVATION.execution.automaticStudentPublication,
  localizationStatus: "MULTILINGUAL_FROZEN_ACTIVE" as const,
  multilingualFreezeGranted: true as const,
  contentMutationAuthorized: ACTIVATION.execution.contentMutationAuthorized,
  frozenContentFingerprint: FREEZE_BINDING_FINGERPRINT,
  frozenContentFingerprintKind: "POST_FINAL5_EVIDENCE_ARTIFACT_DIGEST" as const,
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
  enabled: ACTIVATION.execution.questionStudioEnabled,
  runtimeMode: TRG_001_INTERNAL_ACTIVATION.runtimeMode,
  reviewStatus: "HUMAN_APPROVED_POST_FINAL5",
  humanReviewStatus: "APPROVED_144_ENGLISH_288_LOCALIZED_SURFACES",
  multilingualFreezeGranted: true,
  activationAuthorized: true,
  questionStudioDiscoverable: TRG_001_INTERNAL_ACTIVATION.questionStudioDiscoverable,
  questionBankStatus: TRG_001_INTERNAL_ACTIVATION.questionBankStatus,
  questionBankWritable: TRG_001_INTERNAL_ACTIVATION.questionBankWritable,
  testEligibility: TRG_001_INTERNAL_ACTIVATION.testEligibility,
  testEligible: TRG_001_INTERNAL_ACTIVATION.testEligible,
  testBuilderEligible: TRG_001_INTERNAL_ACTIVATION.testBuilderEligible,
  mockTestEligible: TRG_001_INTERNAL_ACTIVATION.mockTestEligible,
  publiclyPublishable: false,
  publicReleaseAuthorized: false,
  automaticStudentPublication: false,
  freezeStatus: FREEZE.status,
  freezeVersion: FREEZE.version,
  localizationStatus: TRG_001_INTERNAL_ACTIVATION.localizationStatus,
  englishRemediationVersion: ACTIVATION.authority.englishRemediationVersion,
  localizationVersion: ACTIVATION.authority.localizationVersion,
  reviewedSourceHead: ACTIVATION.authority.reviewedSourceHead,
  approvedContentFingerprint: FREEZE_BINDING_FINGERPRINT,
  approvedContentFingerprintKind: "POST_FINAL5_EVIDENCE_ARTIFACT_DIGEST",
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
  if (["hi", "hi-in", "hindi"].includes(language)) return "hi";
  if (["pa", "pa-in", "punjabi", "panjabi"].includes(language)) return "pa";
  throw Object.assign(
    new Error(`TRG-001 Question Studio supports en, hi and pa; '${String(value)}' is not activated.`),
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
    return TRG_001_AUTHORITY_ALIGNED_IDS.filter((candidateQlId) => cpForQlId(candidateQlId) === selector);
  }
  throw Object.assign(new Error(`Unknown TRG-001 canonical problem or CP '${selector}'.`), { statusCode: 400 });
}

function sourceQuestion(qlId: string, seed: string, language: Trg001QuestionStudioLanguage) {
  if (language === "hi") return generateLocalizedTrg001QuestionNativeReviewFinal6(qlId, seed, "hi-IN");
  if (language === "pa") return generateLocalizedTrg001QuestionNativeReviewFinal6(qlId, seed, "pa-IN");
  return generatePostFreezeRemediatedTrg001Question(qlId, seed);
}

function explanationText(question: any, language: Trg001QuestionStudioLanguage) {
  const explanation = question.explanation ?? {};
  const labels = language === "hi"
    ? { rule: "मुख्य नियम", step: "चरण", shortcut: "शॉर्टकट", trap: "सामान्य गलती" }
    : language === "pa"
      ? { rule: "ਮੁੱਖ ਨਿਯਮ", step: "ਕਦਮ", shortcut: "ਸ਼ਾਰਟਕੱਟ", trap: "ਆਮ ਗਲਤੀ" }
      : { rule: "Core rule", step: "Step", shortcut: "Shortcut", trap: "Common trap" };

  return [
    explanation.keyRule ? `${labels.rule}: ${explanation.keyRule}` : "",
    ...(explanation.steps ?? []).map((step: any) => `${String(step.title ?? labels.step)}: ${String(step.body ?? "")}`),
    explanation.shortcut ? `${labels.shortcut}: ${explanation.shortcut}` : "",
    (explanation.traps ?? []).length ? `${labels.trap}: ${(explanation.traps ?? []).join(" ")}` : "",
  ].filter(Boolean).join("\n\n");
}

function optionDisplay(option: any) {
  return String(option?.display ?? option?.text ?? option?.value ?? option?.label ?? option);
}

function questionStudioPreview(
  qlId: string,
  seed: string,
  index: number,
  count: number,
  language: Trg001QuestionStudioLanguage,
) {
  const source: any = sourceQuestion(qlId, seed, language);
  const cpId = cpForQlId(qlId);
  const options = (source.options ?? []).map(optionDisplay);
  const family = authorityFamilyForTrg001Ql(qlId);
  const explanation = explanationText(source, language);
  const localizedAnswer = source.localizedAnswerDisplay ?? options[source.correctIndex] ?? source.answer;

  return Object.freeze({
    id: `${qlId}:${language}:${seed}`,
    questionId: `${qlId}:${language}:${seed}`,
    text: source.stem,
    stem: source.stem,
    options,
    correct: source.correctIndex,
    correctIndex: source.correctIndex,
    answer: language === "en" ? source.answer : localizedAnswer,
    canonicalAnswer: source.exactAnswer ?? source.answer,
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
    language,
    locale: ACTIVATION.localeMap[language],
    seed,
    patternId: "TRG-001",
    runtimeMode: TRG_001_INTERNAL_ACTIVATION.runtimeMode,
    reviewStatus: "HUMAN_APPROVED_POST_FINAL5",
    sourceReviewStatus: source.reviewStatus,
    humanReviewStatus: "APPROVED",
    multilingualFreezeGranted: true,
    activationAuthorized: true,
    questionStudioDiscoverable: true,
    questionBankStatus: "LOCKED",
    questionBankWritable: false,
    testEligibility: "INELIGIBLE",
    testEligible: false,
    testBuilderEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    publicReleaseAuthorized: false,
    automaticStudentPublication: false,
    freezeStatus: FREEZE.status,
    freezeVersion: FREEZE.version,
    localizationStatus: TRG_001_INTERNAL_ACTIVATION.localizationStatus,
    canonicalProblemId: cpId,
    cpId,
    questionLanguageId: qlId,
    explanationId: `${qlId}-EXP-${language.toUpperCase()}`,
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
      language,
      locale: ACTIVATION.localeMap[language],
      freezeVersion: FREEZE.version,
      freezeFingerprint: FREEZE_BINDING_FINGERPRINT,
      freezeFingerprintKind: "POST_FINAL5_EVIDENCE_ARTIFACT_DIGEST",
      englishRemediationVersion: ACTIVATION.authority.englishRemediationVersion,
      localizationVersion: ACTIVATION.authority.localizationVersion,
      reviewedSourceHead: ACTIVATION.authority.reviewedSourceHead,
      humanReviewStatus: "APPROVED",
      activationAuthorized: true,
      questionStudioEnabled: true,
      questionBankWritable: false,
      testBuilderEligible: false,
      publicReleaseAuthorized: false,
      contentMutationAuthorized: false,
    }),
    motifs: ["TRG-001", cpId, qlId, family],
    languages: [language],
    generationMetadata: Object.freeze({
      packageId: "TRG-001",
      cpId,
      qlId,
      questionIndex: index + 1,
      questionCount: count,
      seed,
      language,
      locale: ACTIVATION.localeMap[language],
      reviewStatus: "HUMAN_APPROVED_POST_FINAL5",
      humanReviewStatus: "APPROVED",
      multilingualFreezeGranted: true,
      activationAuthorized: true,
      questionStudioDiscoverable: true,
      questionBankStatus: "LOCKED",
      questionBankWritable: false,
      testEligibility: "INELIGIBLE",
      testEligible: false,
      testBuilderEligible: false,
      publiclyPublishable: false,
      publicReleaseAuthorized: false,
      automaticStudentPublication: false,
      localizationStatus: TRG_001_INTERNAL_ACTIVATION.localizationStatus,
      freezeVersion: FREEZE.version,
      freezeFingerprint: FREEZE_BINDING_FINGERPRINT,
      freezeFingerprintKind: "POST_FINAL5_EVIDENCE_ARTIFACT_DIGEST",
    }),
  });
}

export function generateApprovedTrg001QuestionStudioQuestion(
  qlId: string,
  seed: string,
  language: Trg001QuestionStudioLanguage = "en",
) {
  return questionStudioPreview(qlId, seed, 0, 1, normalizeLanguage(language));
}

export function generateTrg001QuestionStudioBatch(request: Trg001QuestionStudioRequest = {}) {
  if (FREEZE.status !== "FROZEN"
    || !FREEZE.execution.newEnglishFreezeGranted
    || !FREEZE.execution.multilingualFreezeGranted) {
    throw new Error("TRG-001 Question Studio activation requires the frozen post-Final5 English and multilingual authority.");
  }
  if (!ACTIVATION.execution.questionStudioActivationExecuted || !ACTIVATION.execution.questionStudioEnabled) {
    throw new Error("TRG-001 post-Final5 Question Studio activation is not executed.");
  }

  const language = normalizeLanguage(request.language);
  const count = Math.min(1000, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const batchSeed = request.seed ?? `trg-001-question-studio:${Date.now()}:${Math.random().toString(36).slice(2)}`;
  const pool = requestedQlIds(request);
  const difficultyPool = pool.filter((qlId, index) => {
    const probe: any = generatePostFreezeRemediatedTrg001Question(qlId, `${batchSeed}:difficulty:${index}`);
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
    const preview = questionStudioPreview(qlId, seed, index, count, language);
    questions.push(preview);
    questionPackages.push(Object.freeze({
      packageId: "TRG-001",
      cpId: preview.cpId,
      qlId,
      seed,
      language,
      locale: preview.locale,
      stem: preview.stem,
      options: preview.options,
      correctIndex: preview.correctIndex,
      answer: preview.answer,
      canonicalAnswer: preview.canonicalAnswer,
      difficulty: preview.difficulty,
      explanation: preview.packageExplanation,
      answerModel: preview.answerModel,
      runtimeMode: preview.runtimeMode,
      reviewStatus: preview.reviewStatus,
      humanReviewStatus: preview.humanReviewStatus,
      multilingualFreezeGranted: true,
      activationAuthorized: true,
      questionStudioDiscoverable: true,
      questionBankStatus: "LOCKED",
      questionBankWritable: false,
      testEligibility: "INELIGIBLE",
      testEligible: false,
      testBuilderEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      publicReleaseAuthorized: false,
      automaticStudentPublication: false,
      localizationStatus: TRG_001_INTERNAL_ACTIVATION.localizationStatus,
      freezeStatus: FREEZE.status,
      freezeVersion: FREEZE.version,
    }));
  }

  return Object.freeze({
    generationContext: Object.freeze({
      generationDomain: "quant-v4",
      packageId: "TRG-001",
      seed: batchSeed,
      timestamp: Date.now(),
      runtimeMode: TRG_001_INTERNAL_ACTIVATION.runtimeMode,
      reviewStatus: "HUMAN_APPROVED_POST_FINAL5",
      humanReviewStatus: "APPROVED_144_ENGLISH_288_LOCALIZED_SURFACES",
      humanReviewedEnglishQls: 144,
      humanReviewedLocalizedSurfaces: 288,
      supportedLanguages: [...TRG_001_QUESTION_STUDIO_LANGUAGES],
      requestedLanguage: language,
      requestedLocale: ACTIVATION.localeMap[language],
      multilingualFreezeGranted: true,
      activationAuthorized: true,
      questionStudioDiscoverable: true,
      internalReviewRunsWritable: true,
      questionBankStatus: "LOCKED",
      questionBankWritable: false,
      testEligibility: "INELIGIBLE",
      testEligible: false,
      testBuilderEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      publicReleaseAuthorized: false,
      automaticStudentPublication: false,
      freezeStatus: FREEZE.status,
      freezeVersion: FREEZE.version,
      localizationStatus: TRG_001_INTERNAL_ACTIVATION.localizationStatus,
      englishRemediationVersion: ACTIVATION.authority.englishRemediationVersion,
      localizationVersion: ACTIVATION.authority.localizationVersion,
      reviewedSourceHead: ACTIVATION.authority.reviewedSourceHead,
      freezeFingerprint: FREEZE_BINDING_FINGERPRINT,
      freezeFingerprintKind: "POST_FINAL5_EVIDENCE_ARTIFACT_DIGEST",
      contentMutationAuthorized: false,
    }),
    questionPackages: Object.freeze(questionPackages),
    questions: Object.freeze(questions),
  });
}

import { createHash, randomUUID } from "node:crypto";

import {
  SRI_PERMANENT_ALLOCATION_V1,
  getSriPermanentAllocationByQlId,
  type SriPermanentAllocationEntryV1,
  type SriPermanentPackageId,
  type SriPermanentQlId,
} from "./permanent-allocation-v1";
import { generateSriPermanentEnglishQuestionV1 } from "./permanent-runtime-v1";
import {
  generateSriPermanentMultilingualFrozenQuestionV1,
  SRI_PERMANENT_MULTILINGUAL_FREEZE_APPROVAL_V1,
} from "./permanent-multilingual-freeze-v1";
import { SRI_CHAPTER_MANIFEST, assertSriReleaseLocks } from "./chapter-manifest";
import type { SriCheckpointId, SriDiscoveryQuestion, SriHumanExplanation } from "./discovery-types";

export const SRI_QUESTION_STUDIO_RELEASE_ID_V1 = "SRI-QS-MULTILINGUAL-FROZEN-V1" as const;
export const SRI_QUESTION_STUDIO_LANGUAGES_V1 = ["en", "hi", "pa"] as const;
export const SRI_QUESTION_STUDIO_DIFFICULTIES_V1 = ["Easy", "Medium", "Hard"] as const;
export const SRI_QUESTION_STUDIO_DIFFICULTY_POLICY_V1 = "SRI-QS-CHECKPOINT-DIFFICULTY-V1" as const;

export type SriQuestionStudioLanguageV1 = typeof SRI_QUESTION_STUDIO_LANGUAGES_V1[number];
export type SriQuestionStudioDifficultyV1 = typeof SRI_QUESTION_STUDIO_DIFFICULTIES_V1[number];

export type SriQuestionStudioRequestV1 = Readonly<{
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

const PACKAGE_LABELS: Readonly<Record<SriPermanentPackageId, string>> = Object.freeze({
  "SRI-001": "Indices, Exponents & Power Structure",
  "SRI-002": "Surds, Radicals & Rationalisation",
});

const PACKAGE_CHECKPOINTS: Readonly<Record<SriPermanentPackageId, readonly SriCheckpointId[]>> = Object.freeze({
  "SRI-001": Object.freeze(["SRI-CP-001", "SRI-CP-002", "SRI-CP-003", "SRI-CP-004", "SRI-CP-005", "SRI-CP-006"]),
  "SRI-002": Object.freeze(["SRI-CP-007", "SRI-CP-008", "SRI-CP-009", "SRI-CP-010", "SRI-CP-011", "SRI-CP-012"]),
});

/**
 * Difficulty is a Question Studio routing policy only. It does not mutate or
 * reinterpret the frozen SRI content authority. The permanent QL/checkpoint
 * remains the source of truth and the mapping merely groups checkpoints for
 * Studio filtering.
 */
const DIFFICULTY_BY_CHECKPOINT: Readonly<Record<SriCheckpointId, SriQuestionStudioDifficultyV1>> = Object.freeze({
  "SRI-CP-001": "Easy",
  "SRI-CP-002": "Easy",
  "SRI-CP-003": "Medium",
  "SRI-CP-004": "Medium",
  "SRI-CP-005": "Hard",
  "SRI-CP-006": "Medium",
  "SRI-CP-007": "Easy",
  "SRI-CP-008": "Medium",
  "SRI-CP-009": "Medium",
  "SRI-CP-010": "Hard",
  "SRI-CP-011": "Hard",
  "SRI-CP-012": "Medium",
});

function normalizeSelector(value: unknown) {
  return String(value ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function isSriPackageId(value: unknown): value is SriPermanentPackageId {
  return value === "SRI-001" || value === "SRI-002";
}

function isSriQlId(value: unknown): value is SriPermanentQlId {
  const text = String(value ?? "");
  return /^SRI-(001|002)-QL-\d{3}$/.test(text)
    && SRI_PERMANENT_ALLOCATION_V1.some((entry) => entry.qlId === text);
}

function isSriCheckpointId(value: unknown): value is SriCheckpointId {
  const text = String(value ?? "");
  return /^SRI-CP-0(0[1-9]|1[0-2])$/.test(text);
}

export function isSriQuestionStudioRequestV1(request: SriQuestionStudioRequestV1) {
  if (isSriPackageId(request.packageId)) return true;
  if (isSriQlId(request.questionLanguageId)) return true;
  if (isSriCheckpointId(request.canonicalProblemId ?? request.cpId)) return true;

  const pattern = normalizeSelector(request.patternId ?? request.archetypeId);
  if (pattern === "sri" || pattern.startsWith("sri ") || pattern.includes("surds") || pattern.includes("indices")) return true;

  const topic = normalizeSelector(request.topic);
  const subtopic = normalizeSelector(request.subtopic);
  return (topic.includes("number system") || topic.includes("quant"))
    && (subtopic.includes("surd") || subtopic.includes("indice") || subtopic.includes("index") || subtopic.includes("radical"));
}

function normalizeLanguage(value: unknown): SriQuestionStudioLanguageV1 {
  const language = String(value ?? "en").trim().toLowerCase();
  if (language === "en" || language === "hi" || language === "pa") return language;
  throw new Error(`SRI Question Studio does not support language ${language}.`);
}

function normalizeDifficulty(value: unknown): SriQuestionStudioDifficultyV1 | null {
  const text = String(value ?? "").trim().toLowerCase();
  if (!text || text === "mixed" || text === "all") return null;
  if (text === "easy") return "Easy";
  if (text === "medium" || text === "moderate") return "Medium";
  if (text === "hard") return "Hard";
  throw new Error(`Unsupported SRI Question Studio difficulty ${text}.`);
}

function stableOffset(value: string, modulo: number) {
  const digest = createHash("sha256").update(value).digest();
  return digest.readUInt32BE(0) % modulo;
}

function localeForLanguage(language: SriQuestionStudioLanguageV1) {
  return language === "en" ? "en-IN" as const : language === "hi" ? "hi-IN" as const : "pa-IN" as const;
}

function assertFrozenAuthorityAvailable() {
  assertSriReleaseLocks();
  if (!SRI_CHAPTER_MANIFEST.lifecycle.englishFrozen || !SRI_CHAPTER_MANIFEST.lifecycle.multilingualFrozen) {
    throw new Error("SRI Question Studio requires the approved English and multilingual frozen authorities.");
  }
  if (!SRI_PERMANENT_MULTILINGUAL_FREEZE_APPROVAL_V1.multilingualFrozen) {
    throw new Error("SRI Question Studio requires explicit multilingual freeze approval.");
  }
  if (
    SRI_CHAPTER_MANIFEST.lifecycle.questionBankWritesEnabled
    || SRI_CHAPTER_MANIFEST.lifecycle.testEligibilityEnabled
    || SRI_CHAPTER_MANIFEST.lifecycle.publicPublicationEnabled
  ) {
    throw new Error("SRI downstream release locks opened unexpectedly before Question Studio activation.");
  }
}

function generateFrozenAuthority(
  qlId: SriPermanentQlId,
  externalSeed: string,
  language: SriQuestionStudioLanguageV1,
) {
  if (language === "en") return generateSriPermanentEnglishQuestionV1(qlId, externalSeed);
  return generateSriPermanentMultilingualFrozenQuestionV1(qlId, externalSeed, language === "hi" ? "hi-IN" : "pa-IN");
}

function buildExplanation(explanation: SriHumanExplanation, language: SriQuestionStudioLanguageV1) {
  const labels = language === "hi"
    ? { given: "दिया है", asked: "पूछा गया है", method: "विधि", answer: "उत्तर" }
    : language === "pa"
      ? { given: "ਦਿੱਤਾ ਹੈ", asked: "ਪੁੱਛਿਆ ਹੈ", method: "ਵਿਧੀ", answer: "ਉੱਤਰ" }
      : { given: "Given", asked: "Asked", method: "Method", answer: "Answer" };
  const lines = [
    `${labels.given}: ${explanation.given}`,
    `${labels.asked}: ${explanation.asked}`,
    `${labels.method}: ${explanation.method}`,
    ...explanation.working,
    `${labels.answer}: ${explanation.answer}`,
  ];
  return Object.freeze({
    standard: "SRI-HUMAN-WORKED-SOLUTION-V1" as const,
    given: explanation.given,
    asked: explanation.asked,
    method: explanation.method,
    working: Object.freeze([...explanation.working]),
    answer: explanation.answer,
    lines: Object.freeze(lines),
  });
}

function normalizeFrozenQuestion(
  authority: ReturnType<typeof generateFrozenAuthority>,
  allocation: SriPermanentAllocationEntryV1,
  language: SriQuestionStudioLanguageV1,
  requestSeed: string,
  difficulty: SriQuestionStudioDifficultyV1,
) {
  const question = authority.question as SriDiscoveryQuestion;
  if (
    authority.lifecycle.questionStudioDiscoverable
    || authority.lifecycle.questionStudioGenerationEnabled
    || authority.lifecycle.questionBankWritable
    || authority.lifecycle.testEligible
    || authority.lifecycle.publiclyPublishable
  ) {
    throw new Error(`${allocation.qlId}: frozen authority crossed its pre-Question-Studio lifecycle boundary.`);
  }
  if (!question.verification.solverVerifierAgree || !question.verification.exactlyOneCorrectOption || !question.verification.domainValid) {
    throw new Error(`${allocation.qlId}: frozen SRI source failed answer/domain verification.`);
  }
  if (question.options[question.correctIndex]?.canonicalKey !== question.answer.canonicalKey) {
    throw new Error(`${allocation.qlId}: frozen SRI correct-option binding drift.`);
  }

  const explanation = buildExplanation(question.explanation, language);
  const identity = createHash("sha256").update(JSON.stringify({
    qlId: allocation.qlId,
    locale: localeForLanguage(language),
    seed: authority.sourceSeed,
    stem: question.stem,
    answer: question.answer.canonicalKey,
  })).digest("hex").slice(0, 20);

  return Object.freeze({
    packageId: allocation.packageId,
    canonicalProblemId: allocation.checkpointId,
    questionLanguageId: allocation.qlId,
    qlId: allocation.qlId,
    qlTitle: allocation.title,
    permanentSolveModeId: authority.permanentSolveModeId,
    retainedGroupId: allocation.retainedGroupId,
    questionId: `SRI-${allocation.qlId.slice(4)}-${language.toUpperCase()}-${identity}`,
    stem: question.stem,
    options: Object.freeze(question.options.map((option) => option.text)),
    optionMetadata: Object.freeze(question.options.map((option) => Object.freeze({
      canonicalKey: option.canonicalKey,
      misconceptionId: option.misconceptionId,
      isCorrect: option.canonicalKey === question.answer.canonicalKey,
    }))),
    correctIndex: question.correctIndex,
    answer: question.answer.text,
    canonicalAnswerKey: question.answer.canonicalKey,
    difficultyBand: difficulty,
    difficultyPolicy: SRI_QUESTION_STUDIO_DIFFICULTY_POLICY_V1,
    language,
    locale: localeForLanguage(language),
    runtimeMode: "QUESTION_STUDIO_ACTIVE" as const,
    reviewStatus: "FROZEN_MULTILINGUAL_CONTENT_AUTHORITY" as const,
    questionStudioDiscoverable: true as const,
    questionStudioGenerationEnabled: true as const,
    questionBankStatus: "NOT_STORED" as const,
    questionBankWritable: false as const,
    testEligibility: "INELIGIBLE" as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    automaticStudentPublication: false as const,
    explanation,
    explanationStandard: explanation.standard,
    proofEvents: question.proofEvents,
    verification: question.verification,
    state: question.state,
    sourceCandidateId: authority.sourceCandidateId,
    sourceCheckpointId: authority.sourceCheckpointId,
    permanentCheckpointId: authority.checkpointId,
    sourceSeed: authority.sourceSeed,
    requestSeed,
    englishFingerprint: authority.englishFingerprint,
    validation: Object.freeze({ ok: true as const, valid: true as const, errors: Object.freeze([] as string[]) }),
    traceability: Object.freeze({
      releaseId: SRI_QUESTION_STUDIO_RELEASE_ID_V1,
      localizationFreezeId: language === "en" ? null : "SRI-ML-V1-FROZEN",
      approvedLocalizationArtifactId: SRI_PERMANENT_MULTILINGUAL_FREEZE_APPROVAL_V1.approvedArtifactId,
      approvedLocalizationArtifactDigest: SRI_PERMANENT_MULTILINGUAL_FREEZE_APPROVAL_V1.approvedArtifactDigest,
      packageId: allocation.packageId,
      checkpointId: allocation.checkpointId,
      permanentQlId: allocation.qlId,
      permanentSolveModeId: authority.permanentSolveModeId,
      retainedGroupId: allocation.retainedGroupId,
      sourceCandidateId: authority.sourceCandidateId,
      sourceCheckpointId: authority.sourceCheckpointId,
      sourceSeed: authority.sourceSeed,
      englishFingerprint: authority.englishFingerprint,
      difficultyPolicy: SRI_QUESTION_STUDIO_DIFFICULTY_POLICY_V1,
      questionStudioDiscoverable: true as const,
      questionStudioGenerationEnabled: true as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
    }),
  });
}

function toPreview(pkg: ReturnType<typeof normalizeFrozenQuestion>, index: number, count: number) {
  const canonicalAnswer = Object.freeze({
    kind: "symbolic",
    value: pkg.answer,
    display: pkg.answer,
    rendered: pkg.answer,
    key: pkg.canonicalAnswerKey,
    rounding: "exact",
  });
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
    difficultyPolicy: pkg.difficultyPolicy,
    patternId: pkg.packageId,
    section: "Quant",
    subject: "Quantitative Aptitude",
    topic: "Number System",
    subtopic: "Surds & Indices",
    generationBackend: "quant-v4",
    debugSource: "quant-v4-sri-frozen-multilingual-runtime",
    packageSource: "quant-v4-sri-frozen-multilingual-runtime",
    packageId: pkg.packageId,
    canonicalProblemId: pkg.canonicalProblemId,
    questionLanguageId: pkg.questionLanguageId,
    qlId: pkg.qlId,
    qlTitle: pkg.qlTitle,
    questionId: pkg.questionId,
    seed: pkg.requestSeed,
    sourceSeed: pkg.sourceSeed,
    language: pkg.language,
    locale: pkg.locale,
    runtimeMode: pkg.runtimeMode,
    reviewStatus: pkg.reviewStatus,
    questionStudioDiscoverable: true,
    questionStudioGenerationEnabled: true,
    questionBankStatus: pkg.questionBankStatus,
    questionBankWritable: false,
    testEligibility: pkg.testEligibility,
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
    optionMetadata: pkg.optionMetadata,
    validation: pkg.validation,
    semanticMetadata: pkg.traceability,
    traceability: pkg.traceability,
    proceduralLogic: pkg.state,
    logic: pkg.state,
    proofEvents: pkg.proofEvents,
    verification: pkg.verification,
    englishFingerprint: pkg.englishFingerprint,
    questionIndex: index + 1,
    questionCount: count,
  });
}

function canonicalProblemsForPackage(packageId: SriPermanentPackageId) {
  return PACKAGE_CHECKPOINTS[packageId].map((checkpointId) => Object.freeze({
    id: checkpointId,
    label: checkpointId,
    difficulty: DIFFICULTY_BY_CHECKPOINT[checkpointId],
  }));
}

export function listSriQuestionStudioPackagesV1() {
  assertFrozenAuthorityAvailable();
  return (["SRI-001", "SRI-002"] as const).map((packageId) => {
    const permanentQlIds = SRI_PERMANENT_ALLOCATION_V1.filter((entry) => entry.packageId === packageId).map((entry) => entry.qlId);
    return Object.freeze({
      id: packageId,
      packageId,
      type: "quant-v4",
      section: "Quant",
      domain: "quant",
      subject: "Quantitative Aptitude",
      topic: "Number System",
      subtopic: "Surds & Indices",
      name: `${packageId} ${PACKAGE_LABELS[packageId]}`,
      label: PACKAGE_LABELS[packageId],
      generationDomain: "quant-v4",
      cpIds: PACKAGE_CHECKPOINTS[packageId],
      canonicalProblems: Object.freeze(canonicalProblemsForPackage(packageId)),
      permanentQlCount: permanentQlIds.length,
      permanentQlIds: Object.freeze(permanentQlIds),
      supportedDifficulties: SRI_QUESTION_STUDIO_DIFFICULTIES_V1,
      supportedLanguages: SRI_QUESTION_STUDIO_LANGUAGES_V1,
      enabled: true,
      runtimeMode: "QUESTION_STUDIO_ACTIVE",
      supportedRuntimeModes: Object.freeze(["QUESTION_STUDIO_ACTIVE"]),
      reviewStatus: "FROZEN_MULTILINGUAL_CONTENT_AUTHORITY",
      explanationStandard: "SRI-HUMAN-WORKED-SOLUTION-V1",
      difficultyPolicy: SRI_QUESTION_STUDIO_DIFFICULTY_POLICY_V1,
      questionStudioDiscoverable: true,
      questionStudioGenerationEnabled: true,
      questionBankStatus: "NOT_STORED",
      questionBankWritable: false,
      testEligibility: "INELIGIBLE",
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
      releaseId: SRI_QUESTION_STUDIO_RELEASE_ID_V1,
      localizationFreezeId: "SRI-ML-V1-FROZEN",
      approvedLocalizationArtifactId: SRI_PERMANENT_MULTILINGUAL_FREEZE_APPROVAL_V1.approvedArtifactId,
    });
  });
}

function eligibleAllocations(request: SriQuestionStudioRequestV1, difficulty: SriQuestionStudioDifficultyV1 | null) {
  const packageId = String(request.packageId ?? "").trim();
  const checkpointId = String(request.canonicalProblemId ?? request.cpId ?? "").trim();
  const explicitQl = String(request.questionLanguageId ?? "").trim();

  if (packageId && !isSriPackageId(packageId)) throw new Error(`${packageId} is not an SRI Question Studio package.`);
  if (checkpointId && !isSriCheckpointId(checkpointId)) throw new Error(`${checkpointId} is not an SRI checkpoint.`);
  if (explicitQl && !isSriQlId(explicitQl)) throw new Error(`${explicitQl} is not a permanent SRI QL.`);

  if (explicitQl) {
    const allocation = getSriPermanentAllocationByQlId(explicitQl);
    if (packageId && allocation.packageId !== packageId) throw new Error(`${explicitQl} is not owned by ${packageId}.`);
    if (checkpointId && allocation.checkpointId !== checkpointId) throw new Error(`${explicitQl} is not owned by ${checkpointId}.`);
    const qlDifficulty = DIFFICULTY_BY_CHECKPOINT[allocation.checkpointId];
    if (difficulty && qlDifficulty !== difficulty) throw new Error(`${explicitQl} is routed as ${qlDifficulty}, not ${difficulty}.`);
    return [allocation];
  }

  const matches = SRI_PERMANENT_ALLOCATION_V1.filter((entry) =>
    (!packageId || entry.packageId === packageId)
    && (!checkpointId || entry.checkpointId === checkpointId)
    && (!difficulty || DIFFICULTY_BY_CHECKPOINT[entry.checkpointId] === difficulty));
  if (matches.length === 0) throw new Error("No permanent SRI QLs match the requested Question Studio filters.");
  return matches;
}

export async function generateSriQuestionStudioBatchV1(request: SriQuestionStudioRequestV1 = {}) {
  assertFrozenAuthorityAvailable();
  const language = normalizeLanguage(request.language);
  const requestedDifficulty = normalizeDifficulty(request.difficulty);
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const allocations = eligibleAllocations(request, requestedDifficulty);
  const batchSeed = request.seed?.trim() || `question-studio:SRI:${language}:${randomUUID()}`;
  const offset = stableOffset(`${batchSeed}:ql-offset`, allocations.length);
  const questionPackages = [];
  const questions = [];

  for (let index = 0; index < count; index += 1) {
    const allocation = allocations[(offset + index) % allocations.length]!;
    const itemSeed = `${batchSeed}:${allocation.qlId}:${index}`;
    const difficulty = DIFFICULTY_BY_CHECKPOINT[allocation.checkpointId];
    const authority = generateFrozenAuthority(allocation.qlId, itemSeed, language);
    const normalized = normalizeFrozenQuestion(authority, allocation, language, itemSeed, difficulty);
    questionPackages.push(normalized);
    questions.push(toPreview(normalized, index, count));
  }

  const packagesUsed = [...new Set(questionPackages.map((item) => item.packageId))];
  const checkpointsUsed = [...new Set(questionPackages.map((item) => item.canonicalProblemId))];
  return Object.freeze({
    generationContext: Object.freeze({
      generationDomain: "quant-v4",
      packageId: packagesUsed.length === 1 ? packagesUsed[0] : "SRI",
      chapterId: "SRI",
      canonicalProblemId: checkpointsUsed.length === 1 ? checkpointsUsed[0] : null,
      seed: batchSeed,
      timestamp: Date.now(),
      runtimeMode: "QUESTION_STUDIO_ACTIVE",
      reviewStatus: "FROZEN_MULTILINGUAL_CONTENT_AUTHORITY",
      lifecycleStatus: "QUESTION_STUDIO_ACTIVE_SOURCE_ONLY",
      permanentQlCount: SRI_PERMANENT_ALLOCATION_V1.length,
      explanationStandard: "SRI-HUMAN-WORKED-SOLUTION-V1",
      difficultyPolicy: SRI_QUESTION_STUDIO_DIFFICULTY_POLICY_V1,
      questionStudioDiscoverable: true,
      questionStudioGenerationEnabled: true,
      questionBankStatus: "NOT_STORED",
      questionBankWritable: false,
      testEligibility: "INELIGIBLE",
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
      releaseId: SRI_QUESTION_STUDIO_RELEASE_ID_V1,
      localizationFreezeId: "SRI-ML-V1-FROZEN",
      approvedLocalizationArtifactId: SRI_PERMANENT_MULTILINGUAL_FREEZE_APPROVAL_V1.approvedArtifactId,
      language,
      locale: localeForLanguage(language),
      requestedDifficulty,
      packageFilter: request.packageId ?? null,
      checkpointFilter: request.canonicalProblemId ?? request.cpId ?? null,
      explicitQl: request.questionLanguageId ?? null,
    }),
    questionPackages: Object.freeze(questionPackages),
    questions: Object.freeze(questions),
  });
}

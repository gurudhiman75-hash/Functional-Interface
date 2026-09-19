import { hashSeed } from "../DI-001/exact";
import {
  DI008_PERMANENT_OWNERSHIP,
  DI008_PERMANENT_QLS,
  DI008_PERMANENT_RELEASE_ID,
  getDi008PermanentQl,
  type Di008PermanentQlDescriptor,
} from "./permanent-ql-registry";
import { generateDi008PermanentQuestion } from "./permanent-question-generator";
import type { Di008V2Difficulty, Di008V2ExamProfile } from "./arithmetic-v2-types";

export const DI008_QUESTION_STUDIO_CANONICAL_PROBLEM_ID = "DI-CP-008" as const;
export const DI008_QUESTION_STUDIO_RUNTIME_MODE = "DI008_PERMANENT_ENGLISH_REVIEW_P1" as const;

export type Di008QuestionStudioRequest = Readonly<{
  packageId?: string;
  archetypeId?: string;
  patternId?: string;
  topic?: string;
  subtopic?: string;
  canonicalProblemId?: string;
  cpId?: string;
  difficulty?: unknown;
  language?: string;
  questionLanguageId?: string;
  seed?: string;
  count?: number;
  examProfile?: string;
}>;

function normalizeSelector(value: unknown) {
  return String(value ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function isDi008QuestionStudioRequest(request: Di008QuestionStudioRequest) {
  const packageId = normalizeSelector(request.packageId ?? request.archetypeId);
  const patternId = normalizeSelector(request.patternId);
  const topic = normalizeSelector(request.topic);
  const subtopic = normalizeSelector(request.subtopic);
  const qlId = String(request.questionLanguageId ?? "").trim().toUpperCase();
  const cpId = String(request.canonicalProblemId ?? request.cpId ?? "").trim().toUpperCase();
  return packageId === "di 008"
    || patternId === "di 008"
    || Boolean(getDi008PermanentQl(qlId))
    || cpId === DI008_QUESTION_STUDIO_CANONICAL_PROBLEM_ID
    || (topic === "data interpretation" && ["arithmetic di", "arithmetic data interpretation", "business arithmetic", "arithmetic table"].includes(subtopic));
}

function normalizeDifficulty(value: unknown): Di008V2Difficulty | undefined {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (normalized === "easy") return "Easy";
  if (normalized === "medium" || normalized === "moderate") return "Medium";
  if (normalized === "hard") return "Hard";
  return undefined;
}

function normalizeProfile(value: unknown): Di008V2ExamProfile {
  const normalized = normalizeSelector(value);
  if (!normalized) return "BANKING_PRELIMS";
  if (normalized.includes("mains")) return "BANKING_MAINS";
  if (normalized.includes("bank") || normalized.includes("ibps") || normalized.includes("sbi") || normalized.includes("rrb")) return "BANKING_PRELIMS";
  throw new Error(`DI-008 supports Banking Prelims and Banking Mains only in the permanent English review checkpoint; received '${String(value ?? "")}'.`);
}

function stableOrder(items: readonly Di008PermanentQlDescriptor[], seed: string) {
  return [...items]
    .map((descriptor) => ({ descriptor, rank: hashSeed(`${seed}:${descriptor.qlId}`) }))
    .sort((left, right) => left.rank - right.rank || left.descriptor.qlId.localeCompare(right.descriptor.qlId))
    .map(({ descriptor }) => descriptor);
}

function eligibleDescriptors(profile: Di008V2ExamProfile, difficulty?: Di008V2Difficulty) {
  const filtered = DI008_PERMANENT_QLS.filter(
    (descriptor) => descriptor.supportedProfiles.includes(profile) && (!difficulty || descriptor.difficulty === difficulty),
  );
  if (!filtered.length) throw new Error(`DI-008 has no permanent English review QL for ${profile}${difficulty ? ` at ${difficulty} difficulty` : ""}.`);
  return filtered;
}

function resolveExplicitQl(request: Di008QuestionStudioRequest, profile: Di008V2ExamProfile, difficulty?: Di008V2Difficulty) {
  const qlId = String(request.questionLanguageId ?? "").trim().toUpperCase();
  if (!qlId) return undefined;
  const descriptor = getDi008PermanentQl(qlId);
  if (!descriptor) throw new Error(`Unknown DI-008 permanent QL '${qlId}'.`);
  if (!descriptor.supportedProfiles.includes(profile)) throw new Error(`${descriptor.qlId} is not supported for ${profile}.`);
  if (difficulty && descriptor.difficulty !== difficulty) throw new Error(`${descriptor.qlId} is ${descriptor.difficulty}, not requested ${difficulty}.`);
  return descriptor;
}

function explanationText(explanation: { keyIdea: string; steps: readonly string[] }) {
  return [explanation.keyIdea, ...explanation.steps].join("\n\n");
}

function toQuestionStudioPreview(
  source: ReturnType<typeof generateDi008PermanentQuestion>,
  descriptor: Di008PermanentQlDescriptor,
  context: { seed: string; index: number; count: number },
) {
  const question = source.question;
  return {
    text: question.stem,
    stem: question.stem,
    stimulus: source.stimulus,
    options: [...question.options],
    optionMetadata: question.optionMetadata.map((option) => ({ ...option })),
    correct: question.correctIndex,
    correctIndex: question.correctIndex,
    answer: question.answer,
    canonicalAnswer: { kind: "symbolic" as const, value: question.answer, display: question.answer, rendered: question.answer, rounding: "exact" as const },
    explanation: explanationText(question.explanation),
    richExplanation: question.explanation,
    difficulty: question.difficulty,
    difficultyLabel: question.difficulty,
    patternId: "DI-008",
    section: "Quant",
    topic: "Data Interpretation",
    subtopic: "Arithmetic DI",
    generationBackend: "quant-v4",
    debugSource: "quant-v4-di008-permanent-english-review",
    questionId: `${question.questionId}:${descriptor.qlId}`,
    sourceQuestionId: question.questionId,
    seed: context.seed,
    sourceSeed: source.sourceSeed,
    examProfile: source.examProfile,
    packageId: "DI-008" as const,
    canonicalProblemId: DI008_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
    questionLanguageId: descriptor.qlId,
    permanentQlId: descriptor.qlId,
    qlId: descriptor.qlId,
    semanticContract: descriptor.semanticContract,
    taskKind: descriptor.taskKind,
    runtimeMode: DI008_QUESTION_STUDIO_RUNTIME_MODE,
    reviewStatus: "ENGLISH_REVIEW_APPROVED" as const,
    releaseId: DI008_PERMANENT_RELEASE_ID,
    questionBankStatus: "NOT_STORED" as const,
    questionBankWritable: false as const,
    questionBankEligible: false as const,
    testEligibility: "INELIGIBLE" as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    automaticStudentPublication: false as const,
    productionReleaseAuthorized: false as const,
    reviewOnly: true as const,
    manualApprovalRequired: true as const,
    releaseFreezeStatus: "PERMANENT_ENGLISH_CONTROLLED_REVIEW" as const,
    language: "en" as const,
    validation: source.validation,
    traceability: {
      ...source.traceability,
      contractStatus: "PERMANENT_REVIEW_QL" as const,
      permanentQlId: descriptor.qlId,
      releaseId: DI008_PERMANENT_RELEASE_ID,
      questionStudioDiscoverable: true as const,
      questionStudioMode: "CONTROLLED_REVIEW" as const,
    },
    metadata: {
      packageId: "DI-008",
      canonicalProblemId: DI008_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
      questionLanguageId: descriptor.qlId,
      permanentQlId: descriptor.qlId,
      releaseId: DI008_PERMANENT_RELEASE_ID,
      taskKind: descriptor.taskKind,
      examProfile: source.examProfile,
      runtimeMode: DI008_QUESTION_STUDIO_RUNTIME_MODE,
      reviewStatus: "ENGLISH_REVIEW_APPROVED",
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
      automaticStudentPublication: false,
    },
    questionIndex: context.index + 1,
    questionCount: context.count,
  };
}

export async function generateDi008QuestionStudioBatch(request: Di008QuestionStudioRequest = {}) {
  const cpId = String(request.canonicalProblemId ?? request.cpId ?? "").trim().toUpperCase();
  if (cpId && cpId !== DI008_QUESTION_STUDIO_CANONICAL_PROBLEM_ID) throw new Error(`Unknown canonical problem '${cpId}' for package DI-008.`);
  const language = String(request.language ?? "en").trim().toLowerCase();
  if (language !== "en") throw new Error("DI-008 Hindi/Punjabi localization is still a review candidate and is not yet enabled in Question Studio.");

  const profile = normalizeProfile(request.examProfile);
  const difficulty = normalizeDifficulty(request.difficulty);
  const explicit = resolveExplicitQl(request, profile, difficulty);
  const count = Math.min(1000, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const batchSeed = String(request.seed ?? "").trim() || `quant-v4:DI-008:${profile}:${difficulty ?? "mixed"}:${Date.now()}`;
  const pool = explicit ? [explicit] : stableOrder(eligibleDescriptors(profile, difficulty), `${batchSeed}:ql-order`);
  const questionPackages: ReturnType<typeof generateDi008PermanentQuestion>[] = [];
  const questions: any[] = [];

  for (let index = 0; index < count; index += 1) {
    if (index > 0 && index % 100 === 0) await new Promise((resolve) => setImmediate(resolve));
    const descriptor = pool[index % pool.length]!;
    const seed = `${batchSeed}:${descriptor.qlId}:${index}`;
    const source = generateDi008PermanentQuestion({ seed, examProfile: profile, taskKind: descriptor.taskKind });
    if (source.question.kind !== descriptor.taskKind || source.question.difficulty !== descriptor.difficulty) {
      throw new Error(`${descriptor.qlId} semantic ownership drifted from its approved DI-008 V2 contract.`);
    }
    questionPackages.push(source);
    questions.push(toQuestionStudioPreview(source, descriptor, { seed, index, count }));
  }

  return {
    generationContext: {
      generationDomain: "quant-v4" as const,
      chapterId: "DataInterpretation" as const,
      packageId: "DI-008" as const,
      canonicalProblemId: DI008_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
      seed: batchSeed,
      timestamp: Date.now(),
      language: "en" as const,
      examProfile: profile,
      runtimeMode: DI008_QUESTION_STUDIO_RUNTIME_MODE,
      reviewStatus: "ENGLISH_REVIEW_APPROVED" as const,
      releaseId: DI008_PERMANENT_RELEASE_ID,
      permanentQlCount: DI008_PERMANENT_QLS.length,
      questionStudioDiscoverable: true as const,
      questionStudioMode: "CONTROLLED_REVIEW" as const,
      questionBankStatus: "NOT_STORED" as const,
      questionBankWritable: false as const,
      testEligibility: "INELIGIBLE" as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
      productionReleaseAuthorized: false as const,
      manualApprovalRequired: true as const,
    },
    questionPackages,
    questions,
  };
}

export function di008QuestionStudioPackageCard() {
  return {
    id: "DI-008",
    packageId: "DI-008",
    type: "quant-v4",
    section: "Quant",
    domain: "quant",
    topic: "Data Interpretation",
    subtopic: "Arithmetic DI",
    name: "DI-008 Arithmetic Data Interpretation",
    label: "Arithmetic Data Interpretation",
    generationDomain: "quant-v4",
    cpIds: [DI008_QUESTION_STUDIO_CANONICAL_PROBLEM_ID],
    canonicalProblems: [{ id: DI008_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, label: "Arithmetic Data Interpretation" }],
    permanentQlIds: DI008_PERMANENT_QLS.map((descriptor) => descriptor.qlId),
    permanentQlCount: DI008_PERMANENT_QLS.length,
    qls: DI008_PERMANENT_QLS.map((descriptor) => ({ id: descriptor.qlId, label: descriptor.label, difficulty: descriptor.difficulty, taskKind: descriptor.taskKind })),
    supportedDifficulties: ["easy", "medium", "hard"],
    supportedLanguages: ["en"],
    supportedExamProfiles: ["BANKING_PRELIMS", "BANKING_MAINS"],
    enabled: true,
    runtimeMode: DI008_QUESTION_STUDIO_RUNTIME_MODE,
    supportedRuntimeModes: [DI008_QUESTION_STUDIO_RUNTIME_MODE],
    reviewStatus: "ENGLISH_REVIEW_APPROVED",
    releaseId: DI008_PERMANENT_RELEASE_ID,
    questionStudioDiscoverable: DI008_PERMANENT_OWNERSHIP.lifecycle.questionStudioDiscoverable,
    questionStudioMode: DI008_PERMANENT_OWNERSHIP.lifecycle.questionStudioMode,
    questionBankStatus: "NOT_STORED",
    questionBankWritable: false,
    testEligibility: "INELIGIBLE",
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
    productionReleaseAuthorized: false,
    manualApprovalRequired: true,
    localizationStatus: "HI_PA_REVIEW_CANDIDATE",
  };
}

import { hashSeed } from "../DI-001/exact";
import { renderDiHistogramSvg } from "../visuals/histogram-svg";
import {
  DI009_PERMANENT_OWNERSHIP,
  DI009_PERMANENT_QLS,
  DI009_PERMANENT_RELEASE_ID,
  getDi009PermanentQl,
  type Di009PermanentQlDescriptor,
} from "./permanent-ql-registry";
import { generateDi009PermanentQuestion } from "./permanent-question-generator";
import type { Di009Difficulty, Di009ExamProfile } from "./types";

export const DI009_QUESTION_STUDIO_CANONICAL_PROBLEM_ID = "DI-CP-009" as const;
export const DI009_QUESTION_STUDIO_RUNTIME_MODE = "DI009_PERMANENT_ENGLISH_REVIEW_P1" as const;

export type Di009QuestionStudioRequest = Readonly<{
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

export function isDi009QuestionStudioRequest(request: Di009QuestionStudioRequest) {
  const packageId = normalizeSelector(request.packageId ?? request.archetypeId);
  const patternId = normalizeSelector(request.patternId);
  const topic = normalizeSelector(request.topic);
  const subtopic = normalizeSelector(request.subtopic);
  const qlId = String(request.questionLanguageId ?? "").trim().toUpperCase();
  const cpId = String(request.canonicalProblemId ?? request.cpId ?? "").trim().toUpperCase();
  return packageId === "di 009"
    || patternId === "di 009"
    || Boolean(getDi009PermanentQl(qlId))
    || cpId === DI009_QUESTION_STUDIO_CANONICAL_PROBLEM_ID
    || ((topic === "data interpretation" || topic === "statistics") && subtopic === "histogram");
}

function normalizeDifficulty(value: unknown): Di009Difficulty | undefined {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (normalized === "easy") return "Easy";
  if (normalized === "medium" || normalized === "moderate") return "Medium";
  if (normalized === "hard") return "Hard";
  return undefined;
}

function normalizeProfile(value: unknown): Di009ExamProfile {
  const normalized = normalizeSelector(value);
  if (!normalized || normalized === "ssc cgl" || normalized === "ssc cgl tier i" || normalized === "ssc cgl tier 1" || normalized.includes("chsl") || normalized.includes("mts")) return "SSC_CGL_TIER_I";
  if (normalized === "ssc cgl tier ii" || normalized === "ssc cgl tier 2") return "SSC_CGL_TIER_II";
  throw new Error(`DI-009 does not support exam profile '${String(value ?? "")}' in the permanent English review checkpoint.`);
}

function stableOrder(items: readonly Di009PermanentQlDescriptor[], seed: string) {
  return [...items]
    .map((descriptor) => ({ descriptor, rank: hashSeed(`${seed}:${descriptor.qlId}`) }))
    .sort((left, right) => left.rank - right.rank || left.descriptor.qlId.localeCompare(right.descriptor.qlId))
    .map(({ descriptor }) => descriptor);
}

function eligibleDescriptors(profile: Di009ExamProfile, difficulty?: Di009Difficulty) {
  const filtered = DI009_PERMANENT_QLS.filter((descriptor) => descriptor.supportedProfiles.includes(profile) && (!difficulty || descriptor.difficulty === difficulty));
  if (!filtered.length) throw new Error(`DI-009 has no permanent English review QL for ${profile}${difficulty ? ` at ${difficulty} difficulty` : ""}.`);
  return filtered;
}

function resolveExplicitQl(request: Di009QuestionStudioRequest, profile: Di009ExamProfile, difficulty?: Di009Difficulty) {
  const qlId = String(request.questionLanguageId ?? "").trim().toUpperCase();
  if (!qlId) return undefined;
  const descriptor = getDi009PermanentQl(qlId);
  if (!descriptor) throw new Error(`Unknown DI-009 permanent QL '${qlId}'.`);
  if (!descriptor.supportedProfiles.includes(profile)) throw new Error(`${descriptor.qlId} is not supported for ${profile}.`);
  if (difficulty && descriptor.difficulty !== difficulty) throw new Error(`${descriptor.qlId} is ${descriptor.difficulty}, not requested ${difficulty}.`);
  return descriptor;
}

function explanationText(explanation: { keyIdea: string; steps: readonly string[] }) {
  return [explanation.keyIdea, ...explanation.steps].join("\n\n");
}

function toQuestionStudioPreview(
  source: ReturnType<typeof generateDi009PermanentQuestion>,
  descriptor: Di009PermanentQlDescriptor,
  context: { seed: string; index: number; count: number },
) {
  const question = source.question;
  const stimulusSvg = renderDiHistogramSvg(source.stimulus);
  return {
    text: question.stem,
    stem: question.stem,
    stimulusSvgs: [stimulusSvg],
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
    patternId: "DI-009",
    section: "Quant",
    topic: "Data Interpretation",
    subtopic: "Histogram",
    generationBackend: "quant-v4",
    debugSource: "quant-v4-di009-permanent-english-review",
    questionId: `${question.questionId}:${descriptor.qlId}`,
    sourceQuestionId: question.questionId,
    seed: context.seed,
    examProfile: source.examProfile,
    packageId: "DI-009" as const,
    canonicalProblemId: DI009_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
    questionLanguageId: descriptor.qlId,
    permanentQlId: descriptor.qlId,
    qlId: descriptor.qlId,
    semanticContract: descriptor.semanticContract,
    taskKind: descriptor.taskKind,
    runtimeMode: DI009_QUESTION_STUDIO_RUNTIME_MODE,
    reviewStatus: "ENGLISH_REVIEW_APPROVED" as const,
    releaseId: DI009_PERMANENT_RELEASE_ID,
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
    traceability: {
      ...source.traceability,
      contractStatus: "PERMANENT_REVIEW_QL" as const,
      permanentQlId: descriptor.qlId,
      releaseId: DI009_PERMANENT_RELEASE_ID,
      questionStudioDiscoverable: true as const,
      questionStudioMode: "CONTROLLED_REVIEW" as const,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
    },
    metadata: {
      packageId: "DI-009",
      canonicalProblemId: DI009_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
      questionLanguageId: descriptor.qlId,
      permanentQlId: descriptor.qlId,
      releaseId: DI009_PERMANENT_RELEASE_ID,
      taskKind: descriptor.taskKind,
      examProfile: source.examProfile,
      runtimeMode: DI009_QUESTION_STUDIO_RUNTIME_MODE,
      reviewStatus: "ENGLISH_REVIEW_APPROVED",
      presentationAuthority: "DATA_INTERPRETATION_SHARED_VISUALS",
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
      automaticStudentPublication: false,
    },
    questionIndex: context.index + 1,
    questionCount: context.count,
  };
}

export async function generateDi009QuestionStudioBatch(request: Di009QuestionStudioRequest = {}) {
  const cpId = String(request.canonicalProblemId ?? request.cpId ?? "").trim().toUpperCase();
  if (cpId && cpId !== DI009_QUESTION_STUDIO_CANONICAL_PROBLEM_ID) throw new Error(`Unknown canonical problem '${cpId}' for package DI-009.`);
  const language = String(request.language ?? "en").trim().toLowerCase();
  if (language !== "en") throw new Error("DI-009 Hindi/Punjabi localization is a review candidate and is not yet enabled in Question Studio.");
  const profile = normalizeProfile(request.examProfile);
  const difficulty = normalizeDifficulty(request.difficulty);
  const explicit = resolveExplicitQl(request, profile, difficulty);
  const count = Math.min(1000, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const batchSeed = String(request.seed ?? "").trim() || `quant-v4:DI-009:${profile}:${difficulty ?? "mixed"}:${Date.now()}`;
  const pool = explicit ? [explicit] : stableOrder(eligibleDescriptors(profile, difficulty), `${batchSeed}:ql-order`);
  const questionPackages: ReturnType<typeof generateDi009PermanentQuestion>[] = [];
  const questions: any[] = [];

  for (let index = 0; index < count; index += 1) {
    if (index > 0 && index % 100 === 0) await new Promise((resolve) => setImmediate(resolve));
    const descriptor = pool[index % pool.length]!;
    const seed = `${batchSeed}:${descriptor.qlId}:${index}`;
    const source = generateDi009PermanentQuestion({ seed, examProfile: profile, taskKind: descriptor.taskKind });
    if (source.question.kind !== descriptor.taskKind || source.question.difficulty !== descriptor.difficulty) throw new Error(`${descriptor.qlId} semantic ownership drifted from its certified DI-009 contract.`);
    questionPackages.push(source);
    questions.push(toQuestionStudioPreview(source, descriptor, { seed, index, count }));
  }

  return {
    generationContext: {
      generationDomain: "quant-v4" as const,
      chapterId: "DataInterpretation" as const,
      packageId: "DI-009" as const,
      canonicalProblemId: DI009_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
      seed: batchSeed,
      timestamp: Date.now(),
      language: "en" as const,
      examProfile: profile,
      runtimeMode: DI009_QUESTION_STUDIO_RUNTIME_MODE,
      reviewStatus: "ENGLISH_REVIEW_APPROVED" as const,
      releaseId: DI009_PERMANENT_RELEASE_ID,
      permanentQlCount: DI009_PERMANENT_QLS.length,
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

export function di009QuestionStudioPackageCard() {
  return {
    id: "DI-009",
    packageId: "DI-009",
    type: "quant-v4",
    section: "Quant",
    domain: "quant",
    topic: "Data Interpretation",
    subtopic: "Histogram",
    name: "DI-009 Histogram",
    label: "Histogram",
    generationDomain: "quant-v4",
    cpIds: [DI009_QUESTION_STUDIO_CANONICAL_PROBLEM_ID],
    canonicalProblems: [{ id: DI009_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, label: "Histogram" }],
    permanentQlIds: DI009_PERMANENT_QLS.map((descriptor) => descriptor.qlId),
    permanentQlCount: DI009_PERMANENT_QLS.length,
    qls: DI009_PERMANENT_QLS.map((descriptor) => ({ id: descriptor.qlId, label: descriptor.label, difficulty: descriptor.difficulty, taskKind: descriptor.taskKind })),
    supportedDifficulties: ["easy", "medium", "hard"],
    supportedLanguages: ["en"],
    supportedExamProfiles: ["SSC_CGL_TIER_I", "SSC_CGL_TIER_II"],
    enabled: true,
    runtimeMode: DI009_QUESTION_STUDIO_RUNTIME_MODE,
    supportedRuntimeModes: [DI009_QUESTION_STUDIO_RUNTIME_MODE],
    reviewStatus: "ENGLISH_REVIEW_APPROVED",
    releaseId: DI009_PERMANENT_RELEASE_ID,
    questionStudioDiscoverable: DI009_PERMANENT_OWNERSHIP.lifecycle.questionStudioDiscoverable,
    questionStudioMode: DI009_PERMANENT_OWNERSHIP.lifecycle.questionStudioMode,
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

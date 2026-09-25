import { hashSeed } from "../DI-001/exact";
import { renderDiFrequencyPolygonSvg } from "../visuals/frequency-polygon-svg";
import {
  DI010_PERMANENT_OWNERSHIP,
  DI010_PERMANENT_QLS,
  DI010_PERMANENT_RELEASE_ID,
  getDi010PermanentQl,
  type Di010PermanentQlDescriptor,
} from "./permanent-ql-registry";
import { generateDi010PermanentQuestion } from "./permanent-question-generator";
import type { Di010Difficulty, Di010ExamProfile } from "./types";

export const DI010_QUESTION_STUDIO_CANONICAL_PROBLEM_ID = "DI-CP-010" as const;
export const DI010_QUESTION_STUDIO_RUNTIME_MODE = "DI010_PERMANENT_ENGLISH_REVIEW_P2" as const;

export type Di010QuestionStudioRequest = Readonly<{
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

export function isDi010QuestionStudioRequest(request: Di010QuestionStudioRequest) {
  const packageId = normalizeSelector(request.packageId ?? request.archetypeId);
  const patternId = normalizeSelector(request.patternId);
  const topic = normalizeSelector(request.topic);
  const subtopic = normalizeSelector(request.subtopic);
  const qlId = String(request.questionLanguageId ?? "").trim().toUpperCase();
  const cpId = String(request.canonicalProblemId ?? request.cpId ?? "").trim().toUpperCase();
  return packageId === "di 010"
    || patternId === "di 010"
    || Boolean(getDi010PermanentQl(qlId))
    || cpId === DI010_QUESTION_STUDIO_CANONICAL_PROBLEM_ID
    || ((topic === "data interpretation" || topic === "statistics") && (subtopic === "frequency polygon" || subtopic === "frequency polygons"));
}

function normalizeDifficulty(value: unknown): Di010Difficulty | undefined {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (normalized === "easy") return "Easy";
  if (normalized === "medium" || normalized === "moderate") return "Medium";
  if (normalized === "hard") return "Hard";
  return undefined;
}

function normalizeProfile(value: unknown): Di010ExamProfile {
  const normalized = normalizeSelector(value);
  if (!normalized || normalized === "ssc cgl" || normalized === "ssc cgl tier i" || normalized === "ssc cgl tier 1" || normalized.includes("chsl") || normalized.includes("mts") || normalized.includes("punjab")) return "SSC_CGL_TIER_I";
  if (normalized === "ssc cgl tier ii" || normalized === "ssc cgl tier 2") return "SSC_CGL_TIER_II";
  throw new Error(`DI-010 does not support exam profile '${String(value ?? "")}' in the permanent English review checkpoint.`);
}

function stableOrder(items: readonly Di010PermanentQlDescriptor[], seed: string) {
  return [...items].map((descriptor) => ({ descriptor, rank: hashSeed(`${seed}:${descriptor.qlId}`) })).sort((left, right) => left.rank - right.rank || left.descriptor.qlId.localeCompare(right.descriptor.qlId)).map(({ descriptor }) => descriptor);
}

function eligibleDescriptors(profile: Di010ExamProfile, difficulty?: Di010Difficulty) {
  const filtered = DI010_PERMANENT_QLS.filter((descriptor) => descriptor.supportedProfiles.includes(profile) && (!difficulty || descriptor.difficulty === difficulty));
  if (!filtered.length) throw new Error(`DI-010 has no permanent English review QL for ${profile}${difficulty ? ` at ${difficulty} difficulty` : ""}.`);
  return filtered;
}

function resolveExplicitQl(request: Di010QuestionStudioRequest, profile: Di010ExamProfile, difficulty?: Di010Difficulty) {
  const qlId = String(request.questionLanguageId ?? "").trim().toUpperCase();
  if (!qlId) return undefined;
  const descriptor = getDi010PermanentQl(qlId);
  if (!descriptor) throw new Error(`Unknown DI-010 permanent QL '${qlId}'.`);
  if (!descriptor.supportedProfiles.includes(profile)) throw new Error(`${descriptor.qlId} is not supported for ${profile}.`);
  if (difficulty && descriptor.difficulty !== difficulty) throw new Error(`${descriptor.qlId} is ${descriptor.difficulty}, not requested ${difficulty}.`);
  return descriptor;
}

function explanationText(explanation: { keyIdea: string; steps: readonly string[] }) {
  return [explanation.keyIdea, ...explanation.steps].join("\n\n");
}

function toQuestionStudioPreview(source: ReturnType<typeof generateDi010PermanentQuestion>, descriptor: Di010PermanentQlDescriptor, context: { seed: string; index: number; count: number }) {
  const question = source.question;
  const stimulusSvg = renderDiFrequencyPolygonSvg(source.stimulus);
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
    patternId: "DI-010",
    section: "Quant",
    topic: "Data Interpretation",
    subtopic: "Frequency Polygon",
    generationBackend: "quant-v4",
    debugSource: "quant-v4-di010-permanent-english-review",
    questionId: `${question.questionId}:${descriptor.qlId}`,
    sourceQuestionId: question.questionId,
    seed: context.seed,
    examProfile: source.examProfile,
    packageId: "DI-010" as const,
    canonicalProblemId: DI010_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
    questionLanguageId: descriptor.qlId,
    permanentQlId: descriptor.qlId,
    qlId: descriptor.qlId,
    semanticContract: descriptor.semanticContract,
    taskKind: descriptor.taskKind,
    runtimeMode: DI010_QUESTION_STUDIO_RUNTIME_MODE,
    reviewStatus: "ENGLISH_REVIEW_APPROVED" as const,
    releaseId: DI010_PERMANENT_RELEASE_ID,
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
      releaseId: DI010_PERMANENT_RELEASE_ID,
      questionStudioDiscoverable: true as const,
      questionStudioMode: "CONTROLLED_REVIEW" as const,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
    },
    metadata: {
      packageId: "DI-010",
      canonicalProblemId: DI010_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
      questionLanguageId: descriptor.qlId,
      permanentQlId: descriptor.qlId,
      releaseId: DI010_PERMANENT_RELEASE_ID,
      taskKind: descriptor.taskKind,
      examProfile: source.examProfile,
      runtimeMode: DI010_QUESTION_STUDIO_RUNTIME_MODE,
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

export async function generateDi010QuestionStudioBatch(request: Di010QuestionStudioRequest = {}) {
  const cpId = String(request.canonicalProblemId ?? request.cpId ?? "").trim().toUpperCase();
  if (cpId && cpId !== DI010_QUESTION_STUDIO_CANONICAL_PROBLEM_ID) throw new Error(`Unknown canonical problem '${cpId}' for package DI-010.`);
  const language = String(request.language ?? "en").trim().toLowerCase();
  if (language !== "en") throw new Error("DI-010 permanent Question Studio review is English-only; localization has not started.");
  const profile = normalizeProfile(request.examProfile);
  const difficulty = normalizeDifficulty(request.difficulty);
  const explicit = resolveExplicitQl(request, profile, difficulty);
  const count = Math.min(1000, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const batchSeed = String(request.seed ?? "").trim() || `quant-v4:DI-010:${profile}:${difficulty ?? "mixed"}:${Date.now()}`;
  const pool = explicit ? [explicit] : stableOrder(eligibleDescriptors(profile, difficulty), `${batchSeed}:ql-order`);
  const questionPackages: ReturnType<typeof generateDi010PermanentQuestion>[] = [];
  const questions: any[] = [];

  for (let index = 0; index < count; index += 1) {
    if (index > 0 && index % 100 === 0) await new Promise((resolve) => setImmediate(resolve));
    const descriptor = pool[index % pool.length]!;
    const seed = `${batchSeed}:${descriptor.qlId}:${index}`;
    const source = generateDi010PermanentQuestion({ seed, examProfile: profile, taskKind: descriptor.taskKind });
    if (source.question.kind !== descriptor.taskKind || source.question.difficulty !== descriptor.difficulty) throw new Error(`${descriptor.qlId} semantic ownership drifted from its certified DI-010 contract.`);
    questionPackages.push(source);
    questions.push(toQuestionStudioPreview(source, descriptor, { seed, index, count }));
  }

  return {
    generationContext: {
      generationDomain: "quant-v4" as const,
      chapterId: "DataInterpretation" as const,
      packageId: "DI-010" as const,
      canonicalProblemId: DI010_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
      seed: batchSeed,
      timestamp: Date.now(),
      language: "en" as const,
      examProfile: profile,
      runtimeMode: DI010_QUESTION_STUDIO_RUNTIME_MODE,
      reviewStatus: "ENGLISH_REVIEW_APPROVED" as const,
      releaseId: DI010_PERMANENT_RELEASE_ID,
      permanentQlCount: DI010_PERMANENT_QLS.length,
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

export function di010QuestionStudioPackageCard() {
  return {
    id: "DI-010",
    packageId: "DI-010",
    type: "quant-v4",
    section: "Quant",
    domain: "quant",
    topic: "Data Interpretation",
    subtopic: "Frequency Polygon",
    name: "DI-010 Frequency Polygon",
    label: "Frequency Polygon",
    generationDomain: "quant-v4",
    cpIds: [DI010_QUESTION_STUDIO_CANONICAL_PROBLEM_ID],
    canonicalProblems: [{ id: DI010_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, label: "Frequency Polygon" }],
    permanentQlIds: DI010_PERMANENT_QLS.map((descriptor) => descriptor.qlId),
    permanentQlCount: DI010_PERMANENT_QLS.length,
    qls: DI010_PERMANENT_QLS.map((descriptor) => ({ id: descriptor.qlId, label: descriptor.label, difficulty: descriptor.difficulty, taskKind: descriptor.taskKind })),
    supportedDifficulties: ["easy", "medium", "hard"],
    supportedLanguages: ["en"],
    supportedExamProfiles: ["SSC_CGL_TIER_I", "SSC_CGL_TIER_II"],
    enabled: true,
    runtimeMode: DI010_QUESTION_STUDIO_RUNTIME_MODE,
    supportedRuntimeModes: [DI010_QUESTION_STUDIO_RUNTIME_MODE],
    reviewStatus: "ENGLISH_REVIEW_APPROVED",
    releaseId: DI010_PERMANENT_RELEASE_ID,
    questionStudioDiscoverable: DI010_PERMANENT_OWNERSHIP.lifecycle.questionStudioDiscoverable,
    questionStudioMode: DI010_PERMANENT_OWNERSHIP.lifecycle.questionStudioMode,
    questionBankStatus: "NOT_STORED",
    questionBankWritable: false,
    testEligibility: "INELIGIBLE",
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
    productionReleaseAuthorized: false,
    manualApprovalRequired: true,
    localizationStatus: "NOT_STARTED",
  };
}

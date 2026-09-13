import { hashSeed } from "../shared/exact";
import { generateStat002Question } from "./standard-deviation";
import {
  getStat002PermanentQl,
  STAT002_PERMANENT_OWNERSHIP,
  STAT002_PERMANENT_QLS,
  STAT002_PERMANENT_RELEASE_ID,
  type Stat002PermanentQlDescriptor,
} from "./permanent-ql-registry";
import type { Stat002Difficulty, Stat002ExamProfile } from "./types";

export const STAT002_QUESTION_STUDIO_CANONICAL_PROBLEM_ID = "STAT-CP-002" as const;
export const STAT002_QUESTION_STUDIO_RUNTIME_MODE = "STAT002_PERMANENT_ENGLISH_REVIEW_P1" as const;

export type Stat002QuestionStudioRequest = Readonly<{
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

export function isStat002QuestionStudioRequest(request: Stat002QuestionStudioRequest) {
  const packageId = normalizeSelector(request.packageId ?? request.archetypeId);
  const patternId = normalizeSelector(request.patternId);
  const topic = normalizeSelector(request.topic);
  const subtopic = normalizeSelector(request.subtopic);
  const qlId = String(request.questionLanguageId ?? "").trim().toUpperCase();
  const cpId = String(request.canonicalProblemId ?? request.cpId ?? "").trim().toUpperCase();
  return packageId === "stat 002"
    || patternId === "stat 002"
    || Boolean(getStat002PermanentQl(qlId))
    || cpId === STAT002_QUESTION_STUDIO_CANONICAL_PROBLEM_ID
    || (topic === "statistics" && subtopic === "standard deviation");
}

function normalizeDifficulty(value: unknown): Stat002Difficulty | undefined {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (normalized === "easy") return "Easy";
  if (normalized === "medium" || normalized === "moderate") return "Medium";
  if (normalized === "hard") return "Hard";
  return undefined;
}

function normalizeProfile(value: unknown): Stat002ExamProfile {
  const profile = String(value ?? "").trim().toUpperCase();
  if (profile === "SSC_CGL_JSO") return "SSC_CGL_JSO";
  if (!profile || profile === "SSC_CGL_TIER_II" || profile === "SSC_CGL_TIER_2" || profile === "SSC_CGL_CHSL" || profile === "GENERIC_PRACTICE") return "SSC_CGL_TIER_II";
  throw new Error(`STAT-002 does not support exam profile '${String(value ?? "")}' in controlled English review.`);
}

function stableOrder(items: readonly Stat002PermanentQlDescriptor[], seed: string) {
  return [...items]
    .map((descriptor) => ({ descriptor, rank: hashSeed(`${seed}:${descriptor.qlId}`) }))
    .sort((left, right) => left.rank - right.rank || left.descriptor.qlId.localeCompare(right.descriptor.qlId))
    .map(({ descriptor }) => descriptor);
}

function eligibleDescriptors(profile: Stat002ExamProfile, difficulty?: Stat002Difficulty) {
  const filtered = STAT002_PERMANENT_QLS.filter((descriptor) => descriptor.supportedProfiles.includes(profile) && (!difficulty || descriptor.difficulty === difficulty));
  if (!filtered.length) throw new Error(`STAT-002 has no permanent English review QL for ${profile}${difficulty ? ` at ${difficulty} difficulty` : ""}.`);
  return filtered;
}

function resolveExplicitQl(request: Stat002QuestionStudioRequest, profile: Stat002ExamProfile, difficulty?: Stat002Difficulty) {
  const qlId = String(request.questionLanguageId ?? "").trim().toUpperCase();
  if (!qlId) return undefined;
  const descriptor = getStat002PermanentQl(qlId);
  if (!descriptor) throw new Error(`Unknown STAT-002 permanent QL '${qlId}'.`);
  if (!descriptor.supportedProfiles.includes(profile)) throw new Error(`${descriptor.qlId} is not supported for ${profile}.`);
  if (difficulty && descriptor.difficulty !== difficulty) throw new Error(`${descriptor.qlId} is ${descriptor.difficulty}, not requested ${difficulty}.`);
  return descriptor;
}

function explanationText(explanation: { keyIdea: string; steps: readonly string[] }) {
  return [explanation.keyIdea, ...explanation.steps].join("\n\n");
}

function toQuestionStudioPreview(source: ReturnType<typeof generateStat002Question>, descriptor: Stat002PermanentQlDescriptor, context: { seed: string; index: number; count: number }) {
  return {
    text: source.stem,
    stem: source.stem,
    options: [...source.options],
    optionMetadata: source.optionMetadata.map((option) => ({ ...option })),
    correct: source.correctIndex,
    correctIndex: source.correctIndex,
    answer: source.answer,
    canonicalAnswer: { kind: "symbolic" as const, value: source.answer, display: source.answer, rendered: source.answer, rounding: "exact" as const },
    explanation: explanationText(source.explanation),
    richExplanation: source.explanation,
    difficulty: source.difficulty,
    difficultyLabel: source.difficulty,
    patternId: "STAT-002",
    section: "Quant",
    topic: "Statistics",
    subtopic: "Standard Deviation",
    generationBackend: "quant-v4",
    debugSource: "quant-v4-stat002-permanent-english-review",
    questionId: `${source.questionId}:${descriptor.qlId}`,
    sourceQuestionId: source.questionId,
    seed: context.seed,
    examProfile: source.examProfile,
    packageId: "STAT-002" as const,
    canonicalProblemId: STAT002_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
    questionLanguageId: descriptor.qlId,
    permanentQlId: descriptor.qlId,
    semanticContract: descriptor.semanticContract,
    solveMode: source.solveMode,
    state: source.state,
    runtimeMode: STAT002_QUESTION_STUDIO_RUNTIME_MODE,
    reviewStatus: "ENGLISH_REVIEW_APPROVED" as const,
    releaseId: STAT002_PERMANENT_RELEASE_ID,
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
    releaseFreezeStatus: "PERMANENT_ENGLISH_REVIEW_APPROVED" as const,
    language: "en" as const,
    validation: source.validation,
    traceability: {
      ...source.traceability,
      contractStatus: "PERMANENT_REVIEW_QL" as const,
      permanentQlId: descriptor.qlId,
      releaseId: STAT002_PERMANENT_RELEASE_ID,
      questionStudioDiscoverable: true as const,
      questionStudioMode: "CONTROLLED_REVIEW" as const,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
      productionReleaseAuthorized: false as const,
    },
    metadata: {
      packageId: "STAT-002",
      canonicalProblemId: STAT002_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
      questionLanguageId: descriptor.qlId,
      permanentQlId: descriptor.qlId,
      releaseId: STAT002_PERMANENT_RELEASE_ID,
      sourceContractId: source.contractId,
      solveMode: source.solveMode,
      examProfile: source.examProfile,
      runtimeMode: STAT002_QUESTION_STUDIO_RUNTIME_MODE,
      reviewStatus: "ENGLISH_REVIEW_APPROVED",
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
      automaticStudentPublication: false,
      productionReleaseAuthorized: false,
    },
    questionIndex: context.index + 1,
    questionCount: context.count,
  };
}

export async function generateStat002QuestionStudioBatch(request: Stat002QuestionStudioRequest = {}) {
  const cpId = String(request.canonicalProblemId ?? request.cpId ?? "").trim().toUpperCase();
  if (cpId && cpId !== STAT002_QUESTION_STUDIO_CANONICAL_PROBLEM_ID) throw new Error(`Unknown canonical problem '${cpId}' for package STAT-002.`);
  const language = String(request.language ?? "en").trim().toLowerCase();
  if (language !== "en") throw new Error("STAT-002 controlled Question Studio review is English-only; localization has not started.");
  const profile = normalizeProfile(request.examProfile);
  const difficulty = normalizeDifficulty(request.difficulty);
  const explicit = resolveExplicitQl(request, profile, difficulty);
  const count = Math.min(1000, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const batchSeed = String(request.seed ?? "").trim() || `quant-v4:STAT-002:${profile}:${difficulty ?? "mixed"}:${Date.now()}`;
  const pool = explicit ? [explicit] : stableOrder(eligibleDescriptors(profile, difficulty), `${batchSeed}:ql-order`);
  const questionPackages: ReturnType<typeof generateStat002Question>[] = [];
  const questions: any[] = [];

  for (let index = 0; index < count; index += 1) {
    if (index > 0 && index % 100 === 0) await new Promise((resolve) => setImmediate(resolve));
    const descriptor = pool[index % pool.length]!;
    const seed = `${batchSeed}:${descriptor.qlId}:${index}`;
    const source = generateStat002Question({ seed, examProfile: profile, contractId: descriptor.contractId });
    if (source.solveMode !== descriptor.solveMode || source.difficulty !== descriptor.difficulty) throw new Error(`${descriptor.qlId} semantic ownership drifted from its certified Phase 0 contract.`);
    questionPackages.push(source);
    questions.push(toQuestionStudioPreview(source, descriptor, { seed, index, count }));
  }

  return {
    generationContext: {
      generationDomain: "quant-v4" as const,
      chapterId: "Statistics" as const,
      packageId: "STAT-002" as const,
      canonicalProblemId: STAT002_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
      seed: batchSeed,
      timestamp: Date.now(),
      language: "en" as const,
      examProfile: profile,
      runtimeMode: STAT002_QUESTION_STUDIO_RUNTIME_MODE,
      reviewStatus: "ENGLISH_REVIEW_APPROVED" as const,
      releaseId: STAT002_PERMANENT_RELEASE_ID,
      permanentQlCount: STAT002_PERMANENT_QLS.length,
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

export function stat002QuestionStudioPackageCard() {
  return {
    id: "STAT-002",
    packageId: "STAT-002",
    type: "quant-v4",
    section: "Quant",
    domain: "quant",
    topic: "Statistics",
    subtopic: "Standard Deviation",
    name: "STAT-002 Standard Deviation",
    label: "Standard Deviation",
    generationDomain: "quant-v4",
    cpIds: [STAT002_QUESTION_STUDIO_CANONICAL_PROBLEM_ID],
    canonicalProblems: [{ id: STAT002_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, label: "Standard Deviation" }],
    permanentQlIds: STAT002_PERMANENT_QLS.map((descriptor) => descriptor.qlId),
    permanentQlCount: STAT002_PERMANENT_QLS.length,
    qls: STAT002_PERMANENT_QLS.map((descriptor) => ({ id: descriptor.qlId, label: descriptor.label, difficulty: descriptor.difficulty, solveMode: descriptor.solveMode })),
    supportedDifficulties: ["easy", "medium", "hard"],
    supportedLanguages: ["en"],
    supportedExamProfiles: ["SSC_CGL_TIER_II", "SSC_CGL_JSO"],
    enabled: true,
    runtimeMode: STAT002_QUESTION_STUDIO_RUNTIME_MODE,
    supportedRuntimeModes: [STAT002_QUESTION_STUDIO_RUNTIME_MODE],
    reviewStatus: "ENGLISH_REVIEW_APPROVED",
    releaseId: STAT002_PERMANENT_RELEASE_ID,
    questionStudioDiscoverable: STAT002_PERMANENT_OWNERSHIP.lifecycle.questionStudioDiscoverable,
    questionStudioMode: STAT002_PERMANENT_OWNERSHIP.lifecycle.questionStudioMode,
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

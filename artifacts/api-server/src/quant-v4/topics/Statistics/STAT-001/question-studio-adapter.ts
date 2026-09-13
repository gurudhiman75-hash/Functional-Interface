import { hashSeed } from "../shared/exact";
import { generateStat001Question } from "./stat-001-api";
import { renderStat001EnglishReviewStem } from "./english-editorial-surface";
import {
  getStat001PermanentQl,
  STAT001_PERMANENT_OWNERSHIP,
  STAT001_PERMANENT_QLS,
  STAT001_PERMANENT_RELEASE_ID,
  type Stat001PermanentQlDescriptor,
} from "./permanent-ql-registry";
import type { Sta001Difficulty, Sta001ExamProfile } from "./types";

export const STAT001_QUESTION_STUDIO_CANONICAL_PROBLEM_ID = "STAT-CP-001" as const;
export const STAT001_QUESTION_STUDIO_RUNTIME_MODE = "STAT001_PERMANENT_ENGLISH_REVIEW_P2" as const;

export type Stat001QuestionStudioRequest = Readonly<{
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

export function isStat001QuestionStudioRequest(request: Stat001QuestionStudioRequest) {
  const packageId = normalizeSelector(request.packageId ?? request.archetypeId);
  const patternId = normalizeSelector(request.patternId);
  const topic = normalizeSelector(request.topic);
  const subtopic = normalizeSelector(request.subtopic);
  const qlId = String(request.questionLanguageId ?? "").trim().toUpperCase();
  const cpId = String(request.canonicalProblemId ?? request.cpId ?? "").trim().toUpperCase();
  return packageId === "stat 001"
    || patternId === "stat 001"
    || patternId.includes("stat ql")
    || qlId.startsWith("STAT-QL-")
    || cpId === STAT001_QUESTION_STUDIO_CANONICAL_PROBLEM_ID
    || (topic === "statistics" && (!subtopic || subtopic === "measures of central tendency" || subtopic === "central tendency"));
}

function normalizeDifficulty(value: unknown): Sta001Difficulty | undefined {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (normalized === "easy") return "Easy";
  if (normalized === "medium" || normalized === "moderate") return "Medium";
  if (normalized === "hard") return "Hard";
  return undefined;
}

function normalizeProfile(value: unknown): Sta001ExamProfile {
  const profile = String(value ?? "").trim().toUpperCase();
  if (profile === "SSC_CGL_JSO") return "SSC_CGL_JSO";
  if (!profile || profile === "SSC_CGL_TIER_II" || profile === "SSC_CGL_TIER_2" || profile === "SSC_CGL_CHSL" || profile === "GENERIC_PRACTICE") return "SSC_CGL_TIER_II";
  throw new Error(`STAT-001 does not support exam profile '${String(value ?? "")}' in the permanent English review checkpoint.`);
}

function stableOrder(items: readonly Stat001PermanentQlDescriptor[], seed: string) {
  return [...items]
    .map((descriptor) => ({ descriptor, rank: hashSeed(`${seed}:${descriptor.qlId}`) }))
    .sort((left, right) => left.rank - right.rank || left.descriptor.qlId.localeCompare(right.descriptor.qlId))
    .map(({ descriptor }) => descriptor);
}

function eligibleDescriptors(profile: Sta001ExamProfile, difficulty?: Sta001Difficulty) {
  const filtered = STAT001_PERMANENT_QLS.filter((descriptor) => descriptor.supportedProfiles.includes(profile) && (!difficulty || descriptor.difficulty === difficulty));
  if (!filtered.length) throw new Error(`STAT-001 has no permanent English review QL for ${profile}${difficulty ? ` at ${difficulty} difficulty` : ""}.`);
  return filtered;
}

function resolveExplicitQl(request: Stat001QuestionStudioRequest, profile: Sta001ExamProfile, difficulty?: Sta001Difficulty) {
  const qlId = String(request.questionLanguageId ?? "").trim().toUpperCase();
  if (!qlId) return undefined;
  const descriptor = getStat001PermanentQl(qlId);
  if (!descriptor) throw new Error(`Unknown STAT-001 permanent QL '${qlId}'.`);
  if (!descriptor.supportedProfiles.includes(profile)) throw new Error(`${descriptor.qlId} is not supported for ${profile}.`);
  if (difficulty && descriptor.difficulty !== difficulty) throw new Error(`${descriptor.qlId} is ${descriptor.difficulty}, not requested ${difficulty}.`);
  return descriptor;
}

function explanationText(explanation: { keyIdea: string; steps: readonly string[]; shortcut: string; trap: string }) {
  return [explanation.keyIdea, ...explanation.steps].join("\n\n");
}

function toQuestionStudioPreview(source: ReturnType<typeof generateStat001Question>, descriptor: Stat001PermanentQlDescriptor, context: { seed: string; index: number; count: number }) {
  const stem = renderStat001EnglishReviewStem(source, descriptor.qlId);
  return {
    text: stem,
    stem,
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
    patternId: "STAT-001",
    section: "Quant",
    topic: "Statistics",
    subtopic: "Measures of Central Tendency",
    generationBackend: "quant-v4",
    debugSource: "quant-v4-stat001-permanent-english-review",
    questionId: `${source.questionId}:${descriptor.qlId}`,
    sourceQuestionId: source.questionId,
    seed: context.seed,
    examProfile: source.examProfile,
    packageId: "STAT-001" as const,
    canonicalProblemId: STAT001_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
    questionLanguageId: descriptor.qlId,
    permanentQlId: descriptor.qlId,
    semanticContract: descriptor.semanticContract,
    solveMode: source.solveMode,
    state: source.state,
    runtimeMode: STAT001_QUESTION_STUDIO_RUNTIME_MODE,
    reviewStatus: "ENGLISH_REVIEW_READY" as const,
    releaseId: STAT001_PERMANENT_RELEASE_ID,
    questionBankStatus: "NOT_STORED" as const,
    questionBankWritable: false as const,
    questionBankEligible: false as const,
    testEligibility: "INELIGIBLE" as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    automaticStudentPublication: false as const,
    reviewOnly: true as const,
    manualApprovalRequired: true as const,
    releaseFreezeStatus: "PERMANENT_ENGLISH_REVIEW_PENDING" as const,
    language: "en" as const,
    validation: source.validation,
    traceability: {
      ...source.traceability,
      contractStatus: "PERMANENT_REVIEW_QL" as const,
      permanentQlId: descriptor.qlId,
      releaseId: STAT001_PERMANENT_RELEASE_ID,
      questionStudioDiscoverable: true as const,
      questionStudioMode: "CONTROLLED_REVIEW" as const,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
    },
    metadata: {
      packageId: "STAT-001",
      canonicalProblemId: STAT001_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
      questionLanguageId: descriptor.qlId,
      permanentQlId: descriptor.qlId,
      releaseId: STAT001_PERMANENT_RELEASE_ID,
      sourceContractId: source.contractId,
      solveMode: source.solveMode,
      examProfile: source.examProfile,
      runtimeMode: STAT001_QUESTION_STUDIO_RUNTIME_MODE,
      reviewStatus: "ENGLISH_REVIEW_READY",
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
      automaticStudentPublication: false,
    },
    questionIndex: context.index + 1,
    questionCount: context.count,
  };
}

export async function generateStat001QuestionStudioBatch(request: Stat001QuestionStudioRequest = {}) {
  const cpId = String(request.canonicalProblemId ?? request.cpId ?? "").trim().toUpperCase();
  if (cpId && cpId !== STAT001_QUESTION_STUDIO_CANONICAL_PROBLEM_ID) throw new Error(`Unknown canonical problem '${cpId}' for package STAT-001.`);
  const language = String(request.language ?? "en").trim().toLowerCase();
  if (language !== "en") throw new Error("STAT-001 permanent Question Studio review is English-only; localization has not started.");
  const profile = normalizeProfile(request.examProfile);
  const difficulty = normalizeDifficulty(request.difficulty);
  const explicit = resolveExplicitQl(request, profile, difficulty);
  const count = Math.min(1000, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const batchSeed = String(request.seed ?? "").trim() || `quant-v4:STAT-001:${profile}:${difficulty ?? "mixed"}:${Date.now()}`;
  const pool = explicit ? [explicit] : stableOrder(eligibleDescriptors(profile, difficulty), `${batchSeed}:ql-order`);
  const questionPackages: ReturnType<typeof generateStat001Question>[] = [];
  const questions: any[] = [];

  for (let index = 0; index < count; index += 1) {
    if (index > 0 && index % 100 === 0) await new Promise((resolve) => setImmediate(resolve));
    const descriptor = pool[index % pool.length]!;
    const seed = `${batchSeed}:${descriptor.qlId}:${index}`;
    const source = generateStat001Question({ seed, examProfile: profile, contractId: descriptor.contractId });
    if (source.solveMode !== descriptor.solveMode || source.difficulty !== descriptor.difficulty) throw new Error(`${descriptor.qlId} semantic ownership drifted from its certified Phase 0 contract.`);
    questionPackages.push(source);
    questions.push(toQuestionStudioPreview(source, descriptor, { seed, index, count }));
  }

  return {
    generationContext: {
      generationDomain: "quant-v4" as const,
      chapterId: "Statistics" as const,
      packageId: "STAT-001" as const,
      canonicalProblemId: STAT001_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
      seed: batchSeed,
      timestamp: Date.now(),
      language: "en" as const,
      examProfile: profile,
      runtimeMode: STAT001_QUESTION_STUDIO_RUNTIME_MODE,
      reviewStatus: "ENGLISH_REVIEW_READY" as const,
      releaseId: STAT001_PERMANENT_RELEASE_ID,
      permanentQlCount: STAT001_PERMANENT_QLS.length,
      questionStudioDiscoverable: true as const,
      questionStudioMode: "CONTROLLED_REVIEW" as const,
      questionBankStatus: "NOT_STORED" as const,
      questionBankWritable: false as const,
      testEligibility: "INELIGIBLE" as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
      manualApprovalRequired: true as const,
    },
    questionPackages,
    questions,
  };
}

export function stat001QuestionStudioPackageCard() {
  return {
    id: "STAT-001",
    packageId: "STAT-001",
    type: "quant-v4",
    section: "Quant",
    domain: "quant",
    topic: "Statistics",
    subtopic: "Measures of Central Tendency",
    name: "STAT-001 Measures of Central Tendency",
    label: "Measures of Central Tendency",
    generationDomain: "quant-v4",
    cpIds: [STAT001_QUESTION_STUDIO_CANONICAL_PROBLEM_ID],
    canonicalProblems: [{ id: STAT001_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, label: "Measures of Central Tendency" }],
    permanentQlIds: STAT001_PERMANENT_QLS.map((descriptor) => descriptor.qlId),
    permanentQlCount: STAT001_PERMANENT_QLS.length,
    qls: STAT001_PERMANENT_QLS.map((descriptor) => ({ id: descriptor.qlId, label: descriptor.label, difficulty: descriptor.difficulty, solveMode: descriptor.solveMode })),
    supportedDifficulties: ["easy", "medium", "hard"],
    supportedLanguages: ["en"],
    supportedExamProfiles: ["SSC_CGL_TIER_II", "SSC_CGL_JSO"],
    enabled: true,
    runtimeMode: STAT001_QUESTION_STUDIO_RUNTIME_MODE,
    supportedRuntimeModes: [STAT001_QUESTION_STUDIO_RUNTIME_MODE],
    reviewStatus: "ENGLISH_REVIEW_READY",
    releaseId: STAT001_PERMANENT_RELEASE_ID,
    questionStudioDiscoverable: STAT001_PERMANENT_OWNERSHIP.lifecycle.questionStudioDiscoverable,
    questionStudioMode: STAT001_PERMANENT_OWNERSHIP.lifecycle.questionStudioMode,
    questionBankStatus: "NOT_STORED",
    questionBankWritable: false,
    testEligibility: "INELIGIBLE",
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
    localizationStatus: "NOT_STARTED",
  };
}

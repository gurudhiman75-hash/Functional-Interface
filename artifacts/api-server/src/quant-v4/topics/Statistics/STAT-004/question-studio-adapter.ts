import { hashSeed } from "../shared/exact";
import { generateStat004Question, stat004ContractIds } from "./data-foundations";
import { STAT004_PERMANENT_OWNERSHIP, STAT004_PERMANENT_QLS, getStat004PermanentQl, type Stat004PermanentQlDescriptor } from "./permanent-ql-registry";
import type { Stat004ContractId, Stat004Difficulty, Stat004ExamProfile } from "./types";

export const STAT004_QUESTION_STUDIO_CANONICAL_PROBLEM_ID = "STAT-CP-004" as const;
export const STAT004_QUESTION_STUDIO_RUNTIME_MODE = "STAT004_PERMANENT_ENGLISH_REVIEW_P0" as const;

export type Stat004QuestionStudioRequest = Readonly<{
  packageId?: string; archetypeId?: string; patternId?: string; topic?: string; subtopic?: string;
  canonicalProblemId?: string; cpId?: string; difficulty?: unknown; language?: string;
  questionLanguageId?: string; seed?: string; count?: number; examProfile?: string;
}>;

function norm(value: unknown) { return String(value ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim(); }

export function isStat004QuestionStudioRequest(request: Stat004QuestionStudioRequest) {
  const pkg = norm(request.packageId ?? request.archetypeId);
  const pattern = norm(request.patternId);
  const topic = norm(request.topic);
  const subtopic = norm(request.subtopic);
  const cp = String(request.canonicalProblemId ?? request.cpId ?? "").trim().toUpperCase();
  const ql = String(request.questionLanguageId ?? "").trim().toUpperCase();
  return pkg === "stat 004" || pattern === "stat 004" || cp === STAT004_QUESTION_STUDIO_CANONICAL_PROBLEM_ID
    || Boolean(getStat004PermanentQl(ql))
    || (topic === "statistics" && (subtopic === "data foundations" || subtopic === "data collection classification and tabulation"));
}

function profileOf(value: unknown): Stat004ExamProfile {
  const profile = String(value ?? "").trim().toUpperCase();
  if (profile === "SSC_CGL_JSO") return "SSC_CGL_JSO";
  if (!profile || ["SSC_CGL_TIER_II", "SSC_CGL_TIER_2", "SSC_CGL_CHSL", "GENERIC_PRACTICE"].includes(profile)) return "SSC_CGL_TIER_II";
  throw new Error(`STAT-004 does not support exam profile '${String(value ?? "")}' in controlled English review.`);
}

function difficultyOf(value: unknown): Stat004Difficulty | undefined {
  const valueNorm = String(value ?? "").trim().toLowerCase();
  if (valueNorm === "easy") return "Easy";
  if (valueNorm === "medium" || valueNorm === "moderate") return "Medium";
  if (valueNorm === "hard") return "Hard";
  return undefined;
}

function descriptors(profile: Stat004ExamProfile, difficulty?: Stat004Difficulty): Stat004PermanentQlDescriptor[] {
  return STAT004_PERMANENT_QLS.filter((item) => item.supportedProfiles.includes(profile) && (!difficulty || item.difficulty === difficulty));
}

function ordered(items: readonly Stat004PermanentQlDescriptor[], seed: string) {
  return [...items].map((item) => ({ item, rank: hashSeed(`${seed}:${item.qlId}`) }))
    .sort((a, b) => a.rank - b.rank || a.item.qlId.localeCompare(b.item.qlId)).map(({ item }) => item);
}

function toPreview(source: ReturnType<typeof generateStat004Question>, descriptor: Stat004PermanentQlDescriptor, index: number, count: number) {
  return {
    text: source.stem, stem: source.stem, options: [...source.options], correct: source.correctIndex,
    correctIndex: source.correctIndex, answer: source.answer,
    canonicalAnswer: { kind: "symbolic" as const, value: source.answer, display: source.answer, rendered: source.answer, rounding: "exact" as const },
    explanation: source.explanation, difficulty: source.difficulty, difficultyLabel: source.difficulty,
    patternId: "STAT-004", section: "Quant", topic: "Statistics", subtopic: "Data Foundations",
    generationBackend: "quant-v4", debugSource: "quant-v4-stat004-permanent-english-review",
    questionId: source.questionId, sourceQuestionId: source.questionId, seed: source.seed,
    examProfile: source.examProfile, packageId: "STAT-004", canonicalProblemId: STAT004_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
    questionLanguageId: descriptor.qlId, permanentQlId: descriptor.qlId, semanticContract: descriptor.semanticContract,
    runtimeMode: STAT004_QUESTION_STUDIO_RUNTIME_MODE, reviewStatus: "ENGLISH_REVIEW_APPROVED",
    releaseId: STAT004_PERMANENT_OWNERSHIP.releaseId, questionBankStatus: "NOT_STORED", questionBankWritable: false,
    questionBankEligible: false, testEligibility: "INELIGIBLE", testEligible: false, mockTestEligible: false,
    publiclyPublishable: false, automaticStudentPublication: false, productionReleaseAuthorized: false,
    reviewOnly: true, manualApprovalRequired: true, language: "en", questionIndex: index + 1, questionCount: count,
    metadata: { packageId: "STAT-004", canonicalProblemId: STAT004_QUESTION_STUDIO_CANONICAL_PROBLEM_ID,
      questionLanguageId: descriptor.qlId, permanentQlId: descriptor.qlId, releaseId: STAT004_PERMANENT_OWNERSHIP.releaseId,
      runtimeMode: STAT004_QUESTION_STUDIO_RUNTIME_MODE, reviewStatus: "ENGLISH_REVIEW_APPROVED",
      questionBankStatus: "NOT_STORED", testEligibility: "INELIGIBLE", publiclyPublishable: false,
      automaticStudentPublication: false, productionReleaseAuthorized: false },
  };
}

export async function generateStat004QuestionStudioBatch(request: Stat004QuestionStudioRequest = {}) {
  const cp = String(request.canonicalProblemId ?? request.cpId ?? "").trim().toUpperCase();
  if (cp && cp !== STAT004_QUESTION_STUDIO_CANONICAL_PROBLEM_ID) throw new Error(`Unknown canonical problem '${cp}' for package STAT-004.`);
  const language = String(request.language ?? "en").trim().toLowerCase();
  if (language !== "en") throw new Error("STAT-004 controlled Question Studio review is English-only; localization has not started.");
  const profile = profileOf(request.examProfile);
  const difficulty = difficultyOf(request.difficulty);
  const ql = String(request.questionLanguageId ?? "").trim().toUpperCase();
  const explicit = ql ? getStat004PermanentQl(ql) : undefined;
  if (ql && !explicit) throw new Error(`Unknown STAT-004 permanent QL '${ql}'.`);
  if (explicit && !explicit.supportedProfiles.includes(profile)) throw new Error(`${explicit.qlId} is not supported for ${profile}.`);
  if (explicit && difficulty && explicit.difficulty !== difficulty) throw new Error(`${explicit.qlId} is ${explicit.difficulty}, not requested ${difficulty}.`);
  const count = Math.min(1000, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const batchSeed = String(request.seed ?? "").trim() || `quant-v4:STAT-004:${profile}:${difficulty ?? "mixed"}:${Date.now()}`;
  const pool = explicit ? [explicit] : ordered(descriptors(profile, difficulty), `${batchSeed}:ql-order`);
  if (!pool.length) throw new Error(`STAT-004 has no permanent English review QLs for ${profile}${difficulty ? ` at ${difficulty}` : ""}.`);
  const questionPackages: ReturnType<typeof generateStat004Question>[] = [];
  const questions: ReturnType<typeof toPreview>[] = [];
  for (let index = 0; index < count; index += 1) {
    if (index > 0 && index % 100 === 0) await new Promise((resolve) => setTimeout(resolve, 0));
    const owner = pool[index % pool.length]!;
    const seed = `${batchSeed}:${owner.qlId}:${index}`;
    const source = generateStat004Question({ seed, examProfile: profile, contractId: owner.contractId as Stat004ContractId });
    if (source.difficulty !== owner.difficulty) throw new Error(`${owner.qlId} difficulty drifted from its permanent contract.`);
    questionPackages.push(source);
    questions.push(toPreview(source, owner, index, count));
  }
  return {
    generationContext: { generationDomain: "quant-v4", chapterId: "Statistics", packageId: "STAT-004",
      canonicalProblemId: STAT004_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, seed: batchSeed, timestamp: Date.now(), language: "en",
      examProfile: profile, runtimeMode: STAT004_QUESTION_STUDIO_RUNTIME_MODE, reviewStatus: "ENGLISH_REVIEW_APPROVED",
      releaseId: STAT004_PERMANENT_OWNERSHIP.releaseId, permanentQlCount: STAT004_PERMANENT_QLS.length,
      questionStudioDiscoverable: true, questionStudioMode: "CONTROLLED_REVIEW", questionBankStatus: "NOT_STORED",
      questionBankWritable: false, testEligibility: "INELIGIBLE", testEligible: false, mockTestEligible: false,
      publiclyPublishable: false, automaticStudentPublication: false, productionReleaseAuthorized: false, manualApprovalRequired: true },
    questionPackages, questions,
  };
}

export function stat004QuestionStudioPackageCard() {
  return { id: "STAT-004", packageId: "STAT-004", type: "quant-v4", section: "Quant", domain: "quant", topic: "Statistics",
    subtopic: "Data Foundations", name: "STAT-004 Data Foundations", label: "Data Collection, Classification & Tabulation",
    generationDomain: "quant-v4", cpIds: [STAT004_QUESTION_STUDIO_CANONICAL_PROBLEM_ID],
    canonicalProblems: [{ id: STAT004_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, label: "Data Collection, Classification & Tabulation" }],
    permanentQlIds: STAT004_PERMANENT_QLS.map((item) => item.qlId), permanentQlCount: STAT004_PERMANENT_QLS.length,
    qls: STAT004_PERMANENT_QLS.map((item) => ({ id: item.qlId, label: item.label, difficulty: item.difficulty })),
    supportedDifficulties: ["easy", "medium", "hard"], supportedLanguages: ["en"], supportedExamProfiles: ["SSC_CGL_TIER_II", "SSC_CGL_JSO"],
    enabled: true, runtimeMode: STAT004_QUESTION_STUDIO_RUNTIME_MODE, supportedRuntimeModes: [STAT004_QUESTION_STUDIO_RUNTIME_MODE],
    reviewStatus: "ENGLISH_REVIEW_APPROVED", releaseId: STAT004_PERMANENT_OWNERSHIP.releaseId,
    questionStudioDiscoverable: true, questionStudioMode: "CONTROLLED_REVIEW", questionBankStatus: "NOT_STORED", questionBankWritable: false,
    testEligibility: "INELIGIBLE", testEligible: false, mockTestEligible: false, publiclyPublishable: false,
    automaticStudentPublication: false, productionReleaseAuthorized: false, manualApprovalRequired: true, localizationStatus: "NOT_STARTED" };
}

export function stat004PermanentContracts() { return stat004ContractIds(); }

import { deterministicShuffle } from "../../knowledge-v1/deterministic";
import cp011En from "../../knowledge-v1/world-history-cp011-en-v1.json";
import cp011Hi from "../../knowledge-v1/world-history-cp011-hi-v1.json";
import cp011Pa from "../../knowledge-v1/world-history-cp011-pa-v1.json";
import cp012En from "../../knowledge-v1/world-history-cp012-en-v1.json";
import cp012Hi from "../../knowledge-v1/world-history-cp012-hi-v1.json";
import cp012Pa from "../../knowledge-v1/world-history-cp012-pa-v1.json";
import cp013En from "../../knowledge-v1/world-history-cp013-en-v1.json";
import cp013Hi from "../../knowledge-v1/world-history-cp013-hi-v1.json";
import cp013Pa from "../../knowledge-v1/world-history-cp013-pa-v1.json";
import cp014En from "../../knowledge-v1/world-history-cp014-en-v1.json";
import cp014Hi from "../../knowledge-v1/world-history-cp014-hi-v1.json";
import cp014Pa from "../../knowledge-v1/world-history-cp014-pa-v1.json";
import type {
  QuestionStudioEngineAdapter,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioLanguage,
  QuestionStudioPackageDefinition,
} from "../engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";

export const WHI_001_CP011_014_RUNTIME_MODE_V1 = "review-only" as const;
export const WHI_001_CP011_014_REGISTRATION_AUTHORITY_V1 = "WHI-001-CP011-CP014-APPROVED-TRILINGUAL-REVIEW-V1" as const;

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
const languages: readonly QuestionStudioLanguage[] = ["en", "hi", "pa"];
const locales: Readonly<Record<QuestionStudioLanguage, string>> = { en: "en-IN", hi: "hi-IN", pa: "pa-IN" };
const difficulties = ["Easy", "Medium", "Hard"] as const;

type Checkpoint = {
  cp: "011" | "012" | "013" | "014";
  title: string;
  en: unknown;
  hi: unknown;
  pa: unknown;
};
type RawQuestion = {
  questionId: string;
  englishQuestionId: string;
  checkpointId: string;
  factId: string;
  language: string;
  difficulty: string;
  questionFamily: string;
  stem: string;
  options: Array<{ key: string; text: string }>;
  correctOption: string;
  explanation: string;
  sourceIds: string[];
  reviewOnly: boolean;
  runtimeRegistered: boolean;
};
type Question = {
  questionId: string;
  englishQuestionId: string;
  cpId: string;
  language: QuestionStudioLanguage;
  difficulty: "Easy" | "Medium" | "Hard";
  questionFamily: string;
  stem: string;
  options: string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  sourceIds: string[];
  factId: string;
};

const checkpointSpecs: readonly Checkpoint[] = [
  { cp: "011", title: "United Nations and Post-war Institutions", en: cp011En, hi: cp011Hi, pa: cp011Pa },
  { cp: "012", title: "Decolonization in Asia and the Middle East", en: cp012En, hi: cp012Hi, pa: cp012Pa },
  { cp: "013", title: "Decolonization in Africa", en: cp013En, hi: cp013Hi, pa: cp013Pa },
  { cp: "014", title: "Cold War: Rivalry, Alliances, and Crises", en: cp014En, hi: cp014Hi, pa: cp014Pa },
];
const packageId = (cp: string) => `WHI-001-CP${cp}`;
const cpId = (cp: string) => `WHI-001-CP${cp}`;
const packageByCp = new Map(checkpointSpecs.map((spec) => [spec.cp, spec]));

function normalizeCorpus(rows: readonly RawQuestion[], cp: string, language: QuestionStudioLanguage): readonly Question[] {
  const normalized = rows.map((q) => {
    const correctIndex = q.options.findIndex((option) => option.key === q.correctOption);
    const options = q.options.map((option) => option.text);
    if (correctIndex < 0) throw new Error(`${q.questionId}: missing keyed answer`);
    if (q.reviewOnly !== true || q.runtimeRegistered !== false) throw new Error(`${q.questionId}: expected review-only source lifecycle`);
    return Object.freeze({
      questionId: q.questionId,
      englishQuestionId: q.englishQuestionId,
      cpId: q.checkpointId,
      language,
      difficulty: (q.difficulty[0]!.toUpperCase() + q.difficulty.slice(1).toLowerCase()) as Question["difficulty"],
      questionFamily: q.questionFamily,
      stem: q.stem,
      options,
      correctIndex,
      canonicalAnswer: options[correctIndex]!,
      explanation: q.explanation,
      sourceIds: [...q.sourceIds],
      factId: q.factId,
    });
  });
  if (normalized.length !== 60) throw new Error(`${packageId(cp)} ${language} corpus must contain 60 items`);
  if (new Set(normalized.map((q) => q.questionId)).size !== normalized.length) throw new Error(`${packageId(cp)} ${language} has duplicate question IDs`);
  for (const q of normalized) {
    if (q.cpId !== cpId(cp) || q.language !== language || q.options.length !== 4 || new Set(q.options).size !== 4 || !q.sourceIds.length) {
      throw new Error(`${q.questionId}: invalid checkpoint, language, choices, or source provenance`);
    }
    if (!difficulties.includes(q.difficulty) || q.options[q.correctIndex] !== q.canonicalAnswer) throw new Error(`${q.questionId}: invalid difficulty or keyed answer`);
  }
  return Object.freeze(normalized);
}

type CheckpointCorpus = Readonly<Record<QuestionStudioLanguage, readonly Question[]>>;
const corpusByCp = new Map<string, CheckpointCorpus>();
for (const spec of checkpointSpecs) {
  const corpus: CheckpointCorpus = Object.freeze({
    en: normalizeCorpus(spec.en as RawQuestion[], spec.cp, "en"),
    hi: normalizeCorpus(spec.hi as RawQuestion[], spec.cp, "hi"),
    pa: normalizeCorpus(spec.pa as RawQuestion[], spec.cp, "pa"),
  });
  const english = corpus.en;
  for (const language of ["hi", "pa"] as const) {
    for (let index = 0; index < english.length; index += 1) {
      const source = english[index]!;
      const localized = corpus[language][index]!;
      if (localized.englishQuestionId !== source.questionId || localized.factId !== source.factId || localized.correctIndex !== source.correctIndex || localized.difficulty !== source.difficulty || localized.sourceIds.join("|") !== source.sourceIds.join("|")) {
        throw new Error(`${localized.questionId}: identity, fact, source, answer-position, or difficulty parity mismatch`);
      }
    }
  }
  corpusByCp.set(spec.cp, corpus);
}

function makePackage(spec: Checkpoint): QuestionStudioPackageDefinition {
  return {
    engineId: "knowledge-v1",
    packageId: packageId(spec.cp),
    subject: "Static GK",
    topic: "World History",
    subtopic: spec.title,
    label: `Static GK · World History · ${spec.title}`,
    enabled: true,
    cpIds: [cpId(spec.cp)],
    supportedLanguages: [...languages],
    supportedDifficulties: [...difficulties],
    difficultyFilterSupported: true,
    runtimeMode: WHI_001_CP011_014_RUNTIME_MODE_V1,
    supportedRuntimeModes: [WHI_001_CP011_014_RUNTIME_MODE_V1],
    lifecycleId: lifecycle.lifecycleId,
    lifecycleStage: lifecycle.stage,
    reviewSurfaceRequired: lifecycle.reviewSurfaceRequired,
    manualApprovalRequired: lifecycle.manualApprovalRequired,
    questionBankStatus: lifecycle.questionBankStatus,
    questionBankWritable: lifecycle.questionBankWritable,
    testEligibility: lifecycle.testEligibility,
    testEligible: lifecycle.testEligible,
    mockTestEligible: lifecycle.mockTestEligible,
    publiclyPublishable: lifecycle.publiclyPublishable,
    automaticStudentPublication: lifecycle.automaticStudentPublication,
    productionReleaseAuthorized: lifecycle.productionReleaseAuthorized,
    metadata: {
      ...lifecycle,
      registrationAuthorityId: WHI_001_CP011_014_REGISTRATION_AUTHORITY_V1,
      authoringReviewApproved: true,
      localizationStatus: "APPROVED_FOR_REVIEW",
      reviewOnly: true,
      runtimeRegistered: false,
      immutableCorpus: true,
      questionCountPerLanguage: 60,
      supportedDifficulties: [...difficulties],
      correctIndexAndDifficultyParityRequired: true,
      permanentQlIdsAllocated: false,
      studentPublicationAuthorized: false,
    },
  };
}

const packageDefinitions = new Map(checkpointSpecs.map((spec) => [spec.cp, makePackage(spec)]));
function normalizeLanguage(value: QuestionStudioGenerationRequest["language"]): QuestionStudioLanguage {
  if (!value) return "en";
  if (languages.includes(value)) return value;
  throw new Error(`WHI-001-CP011-CP014 does not support language ${String(value)}`);
}
function normalizeDifficulty(value: QuestionStudioGenerationRequest["difficulty"]): "Mixed" | Question["difficulty"] {
  if (!value || value === "Mixed") return "Mixed";
  if (difficulties.includes(value as Question["difficulty"])) return value as Question["difficulty"];
  throw new Error("WHI-001-CP011-CP014 difficulty must be Easy, Medium, Hard, or Mixed");
}
function normalizeCount(value: number | undefined): number {
  const count = value ?? 5;
  if (!Number.isInteger(count) || count < 1 || count > 50) throw new Error("WHI-001-CP011-CP014 review batches require count between 1 and 50");
  return count;
}
function selectors(request: QuestionStudioGenerationRequest): string[] {
  return [request.packageId, request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => String(value ?? "").trim().toUpperCase()).filter(Boolean);
}
function checkpointForSelector(value: string): string | undefined {
  const packageMatch = value.match(/^WHI-001-CP(011|012|013|014)$/);
  const questionMatch = value.match(/^WHI-CP(011|012|013|014)-Q\d{3}(?:-(?:HI|PA))?$/);
  return packageMatch?.[1] ?? questionMatch?.[1];
}
function questionForSelector(cp: string, values: readonly string[]): string | undefined {
  const ids = values.map((value) => value.match(/^(WHI-CP\d{3}-Q\d{3})(?:-(?:HI|PA))?$/)?.[1]).filter((value): value is string => Boolean(value));
  if (new Set(ids).size > 1) throw new Error(`Conflicting ${packageId(cp)} question selectors`);
  return ids[0];
}
export function isWhi011014QuestionStudioRequestV1(request: QuestionStudioGenerationRequest): boolean {
  const values = selectors(request);
  if (values.some((value) => checkpointForSelector(value))) return true;
  const topic = String(request.topic ?? "").trim().toLowerCase();
  const subtopic = String(request.subtopic ?? "").trim().toLowerCase();
  return topic === "world history" && checkpointSpecs.some((spec) => subtopic === spec.title.toLowerCase());
}

export const knowledgeV1Whi011014QuestionStudioAdapterV1: QuestionStudioEngineAdapter = {
  engineId: "knowledge-v1",
  listPackages() { return checkpointSpecs.map((spec) => packageDefinitions.get(spec.cp)!); },
  async generate(request: QuestionStudioGenerationRequest): Promise<QuestionStudioGenerationResult> {
    const values = selectors(request);
    const requestedPackage = String(request.packageId ?? "").trim().toUpperCase();
    const knownPackage = checkpointSpecs.find((spec) => packageId(spec.cp) === requestedPackage);
    const matchedCps = [...new Set(values.map(checkpointForSelector).filter((value): value is string => Boolean(value)))];
    if (matchedCps.length > 1) throw new Error("Conflicting WHI-001-CP011-CP014 checkpoint selectors");
    const titleSpec = checkpointSpecs.find((spec) => String(request.topic ?? "").trim().toLowerCase() === "world history" && String(request.subtopic ?? "").trim().toLowerCase() === spec.title.toLowerCase());
    const cp = knownPackage?.cp ?? matchedCps[0] ?? titleSpec?.cp;
    if (!cp) throw new Error(`WHI-001-CP011-CP014 adapter cannot resolve package ${requestedPackage || "(missing)"}`);
    if (requestedPackage && requestedPackage !== packageId(cp)) throw new Error(`WHI-001-CP011-CP014 adapter cannot generate package ${requestedPackage}`);
    if (request.runtimeMode && request.runtimeMode !== WHI_001_CP011_014_RUNTIME_MODE_V1) throw new Error("WHI-001-CP011-CP014 only supports review-only runtime");
    const language = normalizeLanguage(request.language);
    const difficulty = normalizeDifficulty(request.difficulty);
    const count = normalizeCount(request.count);
    const questionId = questionForSelector(cp, values);
    const candidates = corpusByCp.get(cp)![language].filter((q) =>
      (!questionId || q.englishQuestionId.toUpperCase() === questionId) &&
      (difficulty === "Mixed" || q.difficulty === difficulty),
    );
    if (!candidates.length) throw new Error(`${packageId(cp)} selectors produced no ${difficulty} questions`);
    if (count > candidates.length) throw new Error(`${packageId(cp)} cannot fill ${count} questions from ${candidates.length} candidates without repeats`);
    const seed = request.seed?.trim() || `whi-001-cp${cp}-review-v1`;
    const selected = deterministicShuffle(candidates, `${seed}:${language}:${difficulty}:${questionId ?? "ALL"}`).slice(0, count);
    const spec = packageByCp.get(cp)!;
    const questions = selected.map((q) => ({
      ...lifecycle,
      id: q.questionId,
      questionId: q.questionId,
      sourceQuestionId: q.englishQuestionId,
      packageId: packageId(cp),
      patternId: q.questionFamily,
      cpId: q.cpId,
      subject: "Static GK",
      topic: "World History",
      subtopic: spec.title,
      language,
      locale: locales[language],
      stem: q.stem,
      text: q.stem,
      options: [...q.options],
      correctIndex: q.correctIndex,
      correct: q.correctIndex,
      canonicalAnswer: q.canonicalAnswer,
      answer: q.canonicalAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      difficultyLabel: q.difficulty,
      questionFamily: q.questionFamily,
      factId: q.factId,
      sourceIds: [...q.sourceIds],
      registrationStatus: "REGISTERED_REVIEW_ONLY",
      registrationAuthorityId: WHI_001_CP011_014_REGISTRATION_AUTHORITY_V1,
      authoringReviewApproved: true,
      localizationStatus: "APPROVED_FOR_REVIEW",
      reviewOnly: true,
      runtimeRegistered: false,
      readOnly: true,
      productionReleased: false,
    }));
    return { questions, generationContext: {
      ...lifecycle,
      engineId: "knowledge-v1",
      packageId: packageId(cp),
      runtimeMode: WHI_001_CP011_014_RUNTIME_MODE_V1,
      registrationStatus: "REGISTERED_REVIEW_ONLY",
      registrationAuthorityId: WHI_001_CP011_014_REGISTRATION_AUTHORITY_V1,
      authoringReviewApproved: true,
      localizationStatus: "APPROVED_FOR_REVIEW",
      language,
      locale: locales[language],
      difficulty,
      cpId: cpId(cp),
      seed,
      requestedCount: count,
      candidateCount: candidates.length,
      corpusQuestionCount: corpusByCp.get(cp)![language].length,
      studentPublicationAuthorized: false,
    } };
  },
};

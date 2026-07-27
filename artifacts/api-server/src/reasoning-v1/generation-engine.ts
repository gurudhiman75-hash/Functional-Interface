import { randomUUID } from "node:crypto";

import {
  OPS_CHECKPOINT_RANGES,
  OPS_QL_ENTRIES,
  OPS_QL_FREEZE_VERSION,
  generateFrozenOpsQuestion,
  generateLocalizedFrozenOpsQuestion,
  getOpsQlEntry,
  type OpsCheckpointId,
  type OpsQlId,
} from "./topics/Mathematical-Operations/OPS-001/registry";

export type ReasoningV1Language = "en" | "hi" | "pa";
export type ReasoningV1Difficulty = "Easy" | "Medium" | "Hard";
export type ReasoningV1PackageId = "OPS-001";

export interface ReasoningV1GenerationRequest {
  readonly packageId?: ReasoningV1PackageId | string;
  readonly archetypeId?: ReasoningV1PackageId | string;
  readonly patternId?: string;
  readonly domain?: string;
  readonly topic?: string;
  readonly subtopic?: string;
  readonly canonicalProblemId?: string;
  readonly checkpointId?: string;
  readonly cpId?: string;
  readonly questionLanguageId?: string;
  readonly qlId?: string;
  readonly difficulty?: ReasoningV1Difficulty | string | number;
  readonly language?: ReasoningV1Language;
  readonly seed?: string;
  readonly count?: number;
}

export interface ReasoningV1PackageDefinition {
  readonly id: ReasoningV1PackageId;
  readonly packageId: ReasoningV1PackageId;
  readonly type: "reasoning-v1";
  readonly section: "Reasoning";
  readonly domain: "reasoning";
  readonly topic: "Mathematical Operations";
  readonly subtopic: "Symbol Substitution";
  readonly name: string;
  readonly label: string;
  readonly generationDomain: "reasoning-v1";
  readonly cpIds: readonly OpsCheckpointId[];
  readonly canonicalProblems: readonly {
    readonly id: OpsCheckpointId;
    readonly label: string;
    readonly qlRange: readonly [OpsQlId, OpsQlId];
    readonly qlCount: number;
  }[];
  readonly supportedDifficulties: readonly ["easy", "medium", "hard"];
  readonly supportedLanguages: readonly ["en", "hi", "pa"];
  readonly enabled: true;
  readonly maturity: "FROZEN_INTERNAL";
  readonly publiclyPublishable: false;
  readonly qlCount: 31;
  readonly qlFreezeVersion: typeof OPS_QL_FREEZE_VERSION;
}

const DIFFICULTY_BY_QL: Readonly<Record<OpsQlId, ReasoningV1Difficulty>> = {
  "OPS-QL-001": "Easy",
  "OPS-QL-002": "Medium",
  "OPS-QL-003": "Easy",
  "OPS-QL-004": "Easy",
  "OPS-QL-005": "Medium",
  "OPS-QL-006": "Medium",
  "OPS-QL-007": "Medium",
  "OPS-QL-008": "Easy",
  "OPS-QL-009": "Easy",
  "OPS-QL-010": "Medium",
  "OPS-QL-011": "Medium",
  "OPS-QL-012": "Easy",
  "OPS-QL-013": "Hard",
  "OPS-QL-014": "Medium",
  "OPS-QL-015": "Hard",
  "OPS-QL-016": "Hard",
  "OPS-QL-017": "Medium",
  "OPS-QL-018": "Medium",
  "OPS-QL-019": "Easy",
  "OPS-QL-020": "Medium",
  "OPS-QL-021": "Medium",
  "OPS-QL-022": "Easy",
  "OPS-QL-023": "Medium",
  "OPS-QL-024": "Hard",
  "OPS-QL-025": "Hard",
  "OPS-QL-026": "Medium",
  "OPS-QL-027": "Hard",
  "OPS-QL-028": "Medium",
  "OPS-QL-029": "Hard",
  "OPS-QL-030": "Easy",
  "OPS-QL-031": "Hard",
};

const CHECKPOINT_LABELS: Readonly<Record<OpsCheckpointId, string>> = {
  "OPS-CP-001": "Supplied arithmetic-sign mappings",
  "OPS-CP-002": "Arbitrary and word operation tokens",
  "OPS-CP-003": "Mixed arithmetic and relation mappings",
  "OPS-CP-004": "Missing and inserted operators",
  "OPS-CP-005": "Operator interchange",
  "OPS-CP-006": "Complete whole-number interchange",
  "OPS-CP-007": "Global digit-identity interchange",
  "OPS-CP-008": "Compound operator/value transformations",
  "OPS-CP-009": "Hidden operator mappings",
};

const OPS_CHECKPOINT_IDS = Object.keys(OPS_CHECKPOINT_RANGES) as OpsCheckpointId[];

export const OPS_001_REASONING_PACKAGE: ReasoningV1PackageDefinition = {
  id: "OPS-001",
  packageId: "OPS-001",
  type: "reasoning-v1",
  section: "Reasoning",
  domain: "reasoning",
  topic: "Mathematical Operations",
  subtopic: "Symbol Substitution",
  name: "OPS-001 Mathematical Operations and Symbol Substitution",
  label: "Mathematical Operations and Symbol Substitution",
  generationDomain: "reasoning-v1",
  cpIds: OPS_CHECKPOINT_IDS,
  canonicalProblems: OPS_CHECKPOINT_IDS.map((checkpointId) => {
    const range = OPS_CHECKPOINT_RANGES[checkpointId];
    return {
      id: checkpointId,
      label: CHECKPOINT_LABELS[checkpointId],
      qlRange: [range.first, range.last],
      qlCount: range.count,
    };
  }),
  supportedDifficulties: ["easy", "medium", "hard"],
  supportedLanguages: ["en", "hi", "pa"],
  enabled: true,
  maturity: "FROZEN_INTERNAL",
  publiclyPublishable: false,
  qlCount: 31,
  qlFreezeVersion: OPS_QL_FREEZE_VERSION,
};

class ReasoningV1RequestError extends Error {
  readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = "ReasoningV1RequestError";
    this.statusCode = statusCode;
  }
}

function normalizeSelector(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function isOps001Request(request: ReasoningV1GenerationRequest): boolean {
  const packageId = normalizeSelector(request.packageId ?? request.archetypeId);
  const patternId = normalizeSelector(request.patternId);
  const topic = normalizeSelector(request.topic);
  const subtopic = normalizeSelector(request.subtopic);
  return (
    packageId === "ops 001" ||
    patternId.includes("ops 001") ||
    patternId.includes("ops ql") ||
    (topic === "mathematical operations" && (!subtopic || subtopic === "symbol substitution"))
  );
}

function normalizeDifficulty(value: unknown): ReasoningV1Difficulty | undefined {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (normalized === "easy") return "Easy";
  if (normalized === "medium" || normalized === "moderate") return "Medium";
  if (normalized === "hard") return "Hard";
  if (typeof value === "number" && Number.isFinite(value)) {
    if (value >= 6) return "Hard";
    if (value >= 3) return "Medium";
    return "Easy";
  }
  return undefined;
}

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function shuffled<T>(items: readonly T[], seed: string): T[] {
  const result = [...items];
  let state = hash(seed) || 1;
  for (let index = result.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const swapIndex = state % (index + 1);
    [result[index], result[swapIndex]] = [result[swapIndex]!, result[index]!];
  }
  return result;
}

function asQlId(value: unknown): OpsQlId | undefined {
  const text = String(value ?? "").trim().toUpperCase();
  return OPS_QL_ENTRIES.some((entry) => entry.qlId === text)
    ? text as OpsQlId
    : undefined;
}

function asCheckpointId(value: unknown): OpsCheckpointId | undefined {
  const text = String(value ?? "").trim().toUpperCase();
  return OPS_CHECKPOINT_IDS.includes(text as OpsCheckpointId)
    ? text as OpsCheckpointId
    : undefined;
}

function resolveQlPool(request: ReasoningV1GenerationRequest): OpsQlId[] {
  const explicitQl = asQlId(
    request.questionLanguageId ?? request.qlId ??
      (String(request.patternId ?? "").toUpperCase().startsWith("OPS-QL-")
        ? request.patternId
        : undefined),
  );
  if (explicitQl) return [explicitQl];

  const explicitCheckpoint = asCheckpointId(
    request.canonicalProblemId ?? request.checkpointId ?? request.cpId ??
      (String(request.patternId ?? "").toUpperCase().startsWith("OPS-CP-")
        ? request.patternId
        : undefined),
  );

  const difficulty = normalizeDifficulty(request.difficulty);
  const candidates = OPS_QL_ENTRIES.filter((entry) =>
    (!explicitCheckpoint || entry.checkpointId === explicitCheckpoint) &&
    (!difficulty || DIFFICULTY_BY_QL[entry.qlId] === difficulty),
  ).map((entry) => entry.qlId);

  if (candidates.length > 0) return candidates;
  if (explicitCheckpoint && difficulty) {
    throw new ReasoningV1RequestError(
      `${explicitCheckpoint} has no OPS-001 QL assigned to ${difficulty} difficulty.`,
    );
  }
  throw new ReasoningV1RequestError("No frozen OPS-001 QLs match the request.");
}

function generateByLanguage(
  qlId: OpsQlId,
  seed: number,
  language: ReasoningV1Language,
) {
  if (language === "en") return generateFrozenOpsQuestion(qlId, seed);
  return generateLocalizedFrozenOpsQuestion(
    qlId,
    seed,
    language === "hi" ? "hi-IN" : "pa-IN",
  );
}

function explanationText(question: ReturnType<typeof generateByLanguage>): string {
  const blocks = [question.explanation.ruleStatement];
  for (const step of question.explanation.steps) {
    const transformation = step.result
      ? `${step.expression} → ${step.result}`
      : step.expression;
    blocks.push(`${step.label}:\n${transformation}`);
  }
  blocks.push(question.explanation.conclusion);
  return blocks.filter(Boolean).join("\n\n");
}

export function toReasoningQuestionStudioPreview(
  question: ReturnType<typeof generateByLanguage>,
  context: {
    readonly difficulty: ReasoningV1Difficulty;
    readonly language: ReasoningV1Language;
    readonly seed: string;
    readonly questionIndex: number;
    readonly questionCount: number;
  },
) {
  const entry = getOpsQlEntry(question.qlId);
  const options = question.options.map((option) => option.value);
  const questionId = `OPS-001:${question.qlId}:${question.seed}`;
  return {
    text: question.stem,
    stem: question.stem,
    options,
    correct: question.correctIndex,
    correctIndex: question.correctIndex,
    explanation: explanationText(question),
    packageExplanation: question.explanation,
    difficulty: context.difficulty,
    difficultyLabel: context.difficulty,
    patternId: question.qlId,
    section: "Reasoning",
    subject: "Reasoning Ability",
    topic: OPS_001_REASONING_PACKAGE.topic,
    subtopic: OPS_001_REASONING_PACKAGE.subtopic,
    generationBackend: "reasoning-v1",
    debugSource: "ops-001-frozen-ql-runtime",
    reasoningGraph: {
      solveMode: question.solveMode,
      ambiguityPoolId: entry.ambiguityPoolId,
      explanationStrategyId: entry.explanationStrategyId,
    },
    semanticMetadata: {
      qlId: question.qlId,
      checkpointId: question.checkpointId,
      candidateId: question.candidateId,
      solveMode: question.solveMode,
      answerSemantic: entry.answerSemantic,
      sourceFamilyIds: entry.sourceFamilyIds,
    },
    traceability: {
      packageId: "OPS-001",
      qlId: question.qlId,
      checkpointId: question.checkpointId,
      candidateId: question.candidateId,
      qlFreezeVersion: question.qlFreezeVersion,
      solverRoute: question.proof.solverRoute,
      semanticFingerprint: question.proof.semanticFingerprint,
    },
    validation: {
      unique: question.proof.unique,
      eligibleCandidateCount: question.proof.eligibleCandidateCount,
      survivingCandidateCount: question.proof.survivingCandidateCount,
      teachingTraceVerified: question.metadata.teachingTraceVerified === true,
    },
    questionId,
    seed: context.seed,
    answer: question.answer,
    canonicalAnswer: options[question.correctIndex],
    packageSource: "ops-001-frozen-ql-runtime",
    packageId: "OPS-001",
    taskKind: question.taskKind,
    scenarioId: question.candidateId,
    language: context.language,
    metadata: {
      language: context.language,
      packageId: "OPS-001",
      canonicalProblemId: question.checkpointId,
      checkpointId: question.checkpointId,
      questionLanguageId: question.qlId,
      qlId: question.qlId,
      candidateId: question.candidateId,
      qlFreezeVersion: question.qlFreezeVersion,
      taskKind: question.taskKind,
      solveMode: question.solveMode,
      difficulty: context.difficulty,
      publicationEnabled: false,
      publiclyPublishable: false,
    },
    questionIndex: context.questionIndex,
    questionCount: context.questionCount,
    canonicalProblemId: question.checkpointId,
    questionLanguageId: question.qlId,
    explanationId: entry.explanationStrategyId,
    proceduralLogic: {
      solveMode: question.solveMode,
      renderer: question.renderer,
      localeMode: entry.localeMode,
    },
    logic: {
      qlId: question.qlId,
      checkpointId: question.checkpointId,
      candidateId: question.candidateId,
    },
    debugMetadata: {
      generationDomain: "reasoning-v1",
      selectedPattern: question.qlId,
      selectedArchetype: "OPS-001",
      selectedMotif: question.checkpointId,
      qlFreezeVersion: OPS_QL_FREEZE_VERSION,
      publicationEnabled: false,
    },
    publiclyPublishable: false,
  };
}

export function listReasoningV1Packages(): ReasoningV1PackageDefinition[] {
  return [OPS_001_REASONING_PACKAGE];
}

export async function generateQuestion(
  request: ReasoningV1GenerationRequest = {},
) {
  if (
    request.packageId || request.archetypeId || request.patternId ||
    request.topic || request.subtopic
  ) {
    if (!isOps001Request(request)) {
      throw new ReasoningV1RequestError("The Reasoning V1 engine currently supports OPS-001 only.");
    }
  }

  const language = request.language ?? "en";
  if (!["en", "hi", "pa"].includes(language)) {
    throw new ReasoningV1RequestError(`OPS-001 does not support language '${language}'.`);
  }
  const count = Math.min(1000, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const qlPool = resolveQlPool(request);
  const difficulty = normalizeDifficulty(request.difficulty);
  const batchSeed = request.seed ?? `reasoning-v1:OPS-001:${randomUUID()}`;
  const qlOrder = shuffled(qlPool, `${batchSeed}:ql-order`);
  const questionPackages = [];
  const questions = [];

  for (let index = 0; index < count; index += 1) {
    if (index > 0 && index % 100 === 0) {
      await new Promise((resolve) => setImmediate(resolve));
    }
    const qlId = qlOrder[index % qlOrder.length]!;
    const itemSeed = `${batchSeed}:${qlId}:${index}`;
    const numericSeed = hash(itemSeed);
    const question = generateByLanguage(qlId, numericSeed, language);
    const resolvedDifficulty = difficulty ?? DIFFICULTY_BY_QL[qlId];
    const preview = toReasoningQuestionStudioPreview(question, {
      difficulty: resolvedDifficulty,
      language,
      seed: itemSeed,
      questionIndex: index + 1,
      questionCount: count,
    });
    questionPackages.push({
      archetypeId: "OPS-001",
      packageId: "OPS-001",
      canonicalProblemId: question.checkpointId,
      questionLanguageId: question.qlId,
      questionId: preview.questionId,
      language,
      difficultyBand: resolvedDifficulty,
      stem: question.stem,
      options: preview.options,
      correctIndex: question.correctIndex,
      answer: question.answer,
      explanation: question.explanation,
      traceability: preview.traceability,
      validation: preview.validation,
      frozenQuestion: question,
      publiclyPublishable: false,
    });
    questions.push(preview);
  }

  return {
    generationContext: {
      generationDomain: "reasoning-v1",
      packageId: "OPS-001",
      qlFreezeVersion: OPS_QL_FREEZE_VERSION,
      seed: batchSeed,
      timestamp: Date.now(),
      publiclyPublishable: false,
      publicationEnabled: false,
    },
    questionPackages,
    questions,
  };
}

export const getOpsQlDifficulty = (qlId: OpsQlId): ReasoningV1Difficulty =>
  DIFFICULTY_BY_QL[qlId];

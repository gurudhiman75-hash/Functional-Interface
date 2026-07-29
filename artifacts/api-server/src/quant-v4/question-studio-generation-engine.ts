import {
  generateQuestion as generateBaseQuestion,
  listQuantV4Packages as listBasePackages,
  toQuestionStudioPreview,
  type QuantV4Difficulty,
  type QuantV4GenerationRequest,
  type QuantV4Language,
} from "./generation-engine";
import {
  AVG_001_QUESTION_STUDIO_CP_IDS,
  runAvg001QuestionStudioPipeline,
  type Avg001QuestionStudioCpId,
} from "./topics/Arithmetic/subtopics/Average/AVG-001/question-studio-adapter";
import {
  MAL_001_QUESTION_STUDIO_CP_IDS,
  runMal001QuestionStudioPipeline,
  type Mal001QuestionStudioCpId,
} from "./topics/Arithmetic/subtopics/MixtureAndAlligation/MAL-001/question-studio-adapter";

export type QuestionStudioQuantV4PackageId =
  | NonNullable<QuantV4GenerationRequest["packageId"]>
  | "AVG-001"
  | "MAL-001";

export type QuestionStudioQuantV4GenerationRequest = Omit<
  QuantV4GenerationRequest,
  "packageId" | "archetypeId"
> & {
  packageId?: QuestionStudioQuantV4PackageId;
  archetypeId?: QuestionStudioQuantV4PackageId;
};

const AVG_PACKAGE_DEFINITION = {
  packageId: "AVG-001",
  topic: "Arithmetic",
  subtopic: "Average",
  label: "Average",
  cpIds: AVG_001_QUESTION_STUDIO_CP_IDS,
  supportedLanguages: ["en"] as const,
};

const MAL_PACKAGE_DEFINITION = {
  packageId: "MAL-001",
  topic: "Arithmetic",
  subtopic: "Mixture & Alligation",
  label: "Mixture & Alligation — Standard Blends",
  cpIds: MAL_001_QUESTION_STUDIO_CP_IDS,
  supportedLanguages: ["en"] as const,
};

function normalizeSelector(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function isAverageRequest(request: QuestionStudioQuantV4GenerationRequest) {
  const packageId = normalizeSelector(request.packageId ?? request.archetypeId);
  const patternId = normalizeSelector(request.patternId);
  const topic = normalizeSelector(request.topic);
  const subtopic = normalizeSelector(request.subtopic);
  return (
    packageId === "avg 001" ||
    patternId.includes("avg 001") ||
    (topic === "average" && !subtopic) ||
    (topic === "arithmetic" && subtopic === "average")
  );
}

function isMixtureAndAlligationRequest(
  request: QuestionStudioQuantV4GenerationRequest,
) {
  const packageId = normalizeSelector(request.packageId ?? request.archetypeId);
  const patternId = normalizeSelector(request.patternId);
  const topic = normalizeSelector(request.topic);
  const subtopic = normalizeSelector(request.subtopic);
  const mixtureSelector = new Set([
    "mixture alligation",
    "mixtures alligations",
    "mixture and alligation",
    "mixtures and alligations",
    "mixture",
    "alligation",
  ]);
  return (
    packageId === "mal 001" ||
    patternId.includes("mal 001") ||
    (mixtureSelector.has(topic) && !subtopic) ||
    (topic === "arithmetic" && mixtureSelector.has(subtopic))
  );
}

function normalizeDifficulty(value: unknown): QuantV4Difficulty | undefined {
  const text = String(value ?? "").toLowerCase();
  if (text === "easy") return "Easy";
  if (text === "medium" || text === "moderate") return "Medium";
  if (text === "hard") return "Hard";
  if (typeof value === "number" && Number.isFinite(value)) {
    if (value >= 6) return "Hard";
    if (value >= 3) return "Medium";
    return "Easy";
  }
  return undefined;
}

function seededHash(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function packageCard(
  definition: typeof AVG_PACKAGE_DEFINITION | typeof MAL_PACKAGE_DEFINITION,
) {
  return {
    id: definition.packageId,
    packageId: definition.packageId,
    type: "quant-v4",
    section: "Quant",
    domain: "quant",
    topic: definition.topic,
    subtopic: definition.subtopic,
    name: `${definition.packageId} ${definition.label}`,
    label: definition.label,
    generationDomain: "quant-v4",
    cpIds: [...definition.cpIds],
    canonicalProblems: definition.cpIds.map((cpId) => ({
      id: cpId,
      label: cpId,
    })),
    supportedDifficulties: ["easy", "medium", "hard"],
    supportedLanguages: ["en"],
    enabled: true,
    runtimeMode: definition.packageId === "MAL-001" ? "RELEASED" : undefined,
    reviewStatus:
      definition.packageId === "MAL-001"
        ? "APPROVED_EDITORIAL_ENGLISH"
        : undefined,
    questionBankStatus:
      definition.packageId === "MAL-001" ? "WRITABLE" : undefined,
    testEligibility:
      definition.packageId === "MAL-001" ? "ELIGIBLE" : undefined,
    publiclyPublishable: definition.packageId === "MAL-001" ? true : undefined,
  };
}

export function listQuantV4Packages() {
  const existing = listBasePackages();
  const additions = [];
  if (!existing.some((pkg: any) => pkg.packageId === "AVG-001")) {
    additions.push(packageCard(AVG_PACKAGE_DEFINITION));
  }
  if (!existing.some((pkg: any) => pkg.packageId === "MAL-001")) {
    additions.push(packageCard(MAL_PACKAGE_DEFINITION));
  }
  return [...existing, ...additions].sort((left: any, right: any) =>
    String(left.packageId).localeCompare(String(right.packageId)),
  );
}

function toMalQuestionStudioPreview(
  pkg: any,
  context: {
    questionIndex: number;
    questionCount: number;
    seed: string;
  },
) {
  const traceability = pkg.traceability ?? {};
  const parameters = pkg.parameters ?? {};
  const explanationLines = Array.isArray(pkg.explanation?.lines)
    ? pkg.explanation.lines.map((line: unknown) => String(line ?? ""))
    : [];
  const taskKind = traceability.taskDirection ?? parameters.taskDirection;
  const canonicalAnswer = {
    kind: "symbolic",
    value: pkg.answer,
    display: pkg.answer,
    rendered: pkg.answer,
    rounding: "exact",
  };

  return {
    text: pkg.stem,
    options: [...pkg.options],
    correct: pkg.correctIndex,
    correctIndex: pkg.correctIndex,
    explanation: explanationLines.join("\n\n"),
    packageExplanation: pkg.explanation,
    difficulty: pkg.difficultyBand,
    difficultyLabel: pkg.difficultyBand,
    patternId: "MAL-001",
    section: "Quant",
    topic: MAL_PACKAGE_DEFINITION.topic,
    subtopic: MAL_PACKAGE_DEFINITION.subtopic,
    generationBackend: "quant-v4",
    debugSource: "quant-v4-package-runtime",
    reasoningGraph: pkg.reasoningGraph,
    semanticMetadata: traceability,
    traceability,
    validation: pkg.validation,
    questionId: pkg.questionId,
    seed: context.seed,
    answer: pkg.answer,
    canonicalAnswer,
    runtimeMode: pkg.runtimeMode,
    reviewStatus: pkg.reviewStatus,
    questionBankStatus: pkg.questionBankStatus,
    testEligibility: pkg.testEligibility,
    publiclyPublishable: pkg.publiclyPublishable,
    packageSource: "quant-v4-package-runtime",
    packageId: "MAL-001",
    taskKind,
    scenarioId: undefined,
    language: pkg.language,
    metadata: {
      language: pkg.language,
      packageId: "MAL-001",
      canonicalProblemId: pkg.canonicalProblemId,
      questionLanguageId: pkg.questionLanguageId,
      explanationId: pkg.explanationId,
      taskKind,
      scenarioId: undefined,
      runtimeMode: pkg.runtimeMode,
      reviewStatus: pkg.reviewStatus,
      questionBankStatus: pkg.questionBankStatus,
      testEligibility: pkg.testEligibility,
      publiclyPublishable: pkg.publiclyPublishable,
      releaseId: traceability.releaseId,
    },
    questionIndex: context.questionIndex,
    questionCount: context.questionCount,
    canonicalProblemId: pkg.canonicalProblemId,
    questionLanguageId: pkg.questionLanguageId,
    explanationId: pkg.explanationId,
    proceduralLogic: parameters,
    logic: parameters,
    debugMetadata: {
      generationDomain: "quant-v4",
      selectedPattern: "MAL-001",
      selectedArchetype: "MAL-001",
      selectedMotif: pkg.canonicalProblemId,
      canonicalProblemId: pkg.canonicalProblemId,
      questionLanguageId: pkg.questionLanguageId,
      explanationId: pkg.explanationId,
      taskKind,
      scenarioId: undefined,
      questionIndex: context.questionIndex,
      questionCount: context.questionCount,
      questionId: pkg.questionId,
      packageSource: "quant-v4-package-runtime",
      seed: context.seed,
      reasoningGraph: pkg.reasoningGraph,
      semanticMetadata: traceability,
      validatorReports: pkg.validation,
      releaseId: traceability.releaseId,
    },
  };
}

async function generateAverageQuestion(
  request: QuestionStudioQuantV4GenerationRequest,
) {
  const language = (request.language ?? "en") as QuantV4Language;
  if (language !== "en") {
    throw new Error("AVG-001 supports English generation only in Question Studio.");
  }

  const count = Math.min(
    1000,
    Math.max(1, Math.floor(Number(request.count ?? 1) || 1)),
  );
  const difficulty = normalizeDifficulty(request.difficulty);
  const explicitCp = request.canonicalProblemId ?? request.cpId;
  if (
    explicitCp &&
    !AVG_001_QUESTION_STUDIO_CP_IDS.includes(
      explicitCp as Avg001QuestionStudioCpId,
    )
  ) {
    throw new Error(`Unknown canonical problem '${explicitCp}' for package AVG-001`);
  }

  const batchSeed =
    request.seed ??
    `quant-v4:AVG-001:${explicitCp ?? "mixed"}:${Date.now()}:${Math.random()
      .toString(36)
      .slice(2)}`;
  const cpOffset =
    seededHash(`${batchSeed}:cp-offset`) %
    AVG_001_QUESTION_STUDIO_CP_IDS.length;
  const questionPackages = [];
  const questions = [];

  for (let index = 0; index < count; index += 1) {
    if (index > 0 && index % 100 === 0) {
      await new Promise((resolve) => setImmediate(resolve));
    }
    const cpId = (explicitCp ??
      AVG_001_QUESTION_STUDIO_CP_IDS[
        (cpOffset + index) % AVG_001_QUESTION_STUDIO_CP_IDS.length
      ]) as Avg001QuestionStudioCpId;
    const seed = `${batchSeed}:${cpId}:${index}`;
    const pkg = runAvg001QuestionStudioPipeline(cpId, {
      difficulty,
      language: "en",
      questionLanguageId: request.questionLanguageId,
      seed,
    });
    questionPackages.push(pkg);
    questions.push(
      toQuestionStudioPreview(pkg, {
        packageDefinition: AVG_PACKAGE_DEFINITION,
        questionIndex: index + 1,
        questionCount: count,
        seed,
      }),
    );
  }

  return {
    generationContext: {
      generationDomain: "quant-v4",
      seed: batchSeed,
      timestamp: Date.now(),
    },
    questionPackages,
    questions,
  };
}

async function generateMixtureAndAlligationQuestion(
  request: QuestionStudioQuantV4GenerationRequest,
) {
  const language = (request.language ?? "en") as QuantV4Language;
  if (language !== "en") {
    throw new Error("MAL-001 supports English generation only in Question Studio.");
  }

  const count = Math.min(
    1000,
    Math.max(1, Math.floor(Number(request.count ?? 1) || 1)),
  );
  const difficulty = normalizeDifficulty(request.difficulty);
  const explicitCp = request.canonicalProblemId ?? request.cpId;
  if (
    explicitCp &&
    !MAL_001_QUESTION_STUDIO_CP_IDS.includes(
      explicitCp as Mal001QuestionStudioCpId,
    )
  ) {
    throw new Error(`Unknown canonical problem '${explicitCp}' for package MAL-001`);
  }

  const cpId = (explicitCp ??
    MAL_001_QUESTION_STUDIO_CP_IDS[0]) as Mal001QuestionStudioCpId;
  const batchSeed =
    request.seed ??
    `quant-v4:MAL-001:${cpId}:${Date.now()}:${Math.random()
      .toString(36)
      .slice(2)}`;
  const questionPackages = [];
  const questions = [];

  for (let index = 0; index < count; index += 1) {
    if (index > 0 && index % 100 === 0) {
      await new Promise((resolve) => setImmediate(resolve));
    }
    const seed = `${batchSeed}:${cpId}:${index}`;
    const pkg = runMal001QuestionStudioPipeline(cpId, {
      difficulty,
      language: "en",
      questionLanguageId: request.questionLanguageId,
      seed,
    });
    questionPackages.push(pkg);
    questions.push(
      toMalQuestionStudioPreview(pkg, {
        questionIndex: index + 1,
        questionCount: count,
        seed,
      }),
    );
  }

  return {
    generationContext: {
      generationDomain: "quant-v4",
      seed: batchSeed,
      timestamp: Date.now(),
      runtimeMode: "RELEASED",
      reviewStatus: "APPROVED_EDITORIAL_ENGLISH",
      questionBankStatus: "WRITABLE",
      testEligibility: "ELIGIBLE",
      publiclyPublishable: true,
      releaseId: "MAL-CP001-EN-v1",
    },
    questionPackages,
    questions,
  };
}

export async function generateQuestion(
  request: QuestionStudioQuantV4GenerationRequest = {},
) {
  if (isMixtureAndAlligationRequest(request)) {
    return generateMixtureAndAlligationQuestion(request);
  }
  if (isAverageRequest(request)) {
    return generateAverageQuestion(request);
  }
  return generateBaseQuestion(request as QuantV4GenerationRequest);
}

export type {
  QuantV4Difficulty,
  QuantV4Language,
};

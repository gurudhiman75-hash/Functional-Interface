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
  AVG_001_QUESTION_STUDIO_LANGUAGES,
  runAvg001QuestionStudioPipeline,
  type Avg001QuestionStudioCpId,
} from "./topics/Arithmetic/subtopics/Average/AVG-001/question-studio-adapter";
import {
  MAL_001_QUESTION_STUDIO_CP_IDS,
  runMal001QuestionStudioPipeline,
  type Mal001QuestionStudioCpId,
} from "./topics/Arithmetic/subtopics/MixtureAndAlligation/MAL-001/question-studio-adapter";
import {
  NUM_001_QUESTION_STUDIO_CP_IDS,
  NUM_001_QUESTION_STUDIO_LANGUAGES,
  runNum001QuestionStudioPipeline,
  type Num001QuestionStudioCpId,
} from "./topics/Arithmetic/subtopics/NumberSystem/NUM-001/question-studio-adapter";
import {
  SAP_QUESTION_STUDIO_CP_IDS,
  inferSapQuestionStudioCpFromQl,
  runSapQuestionStudioPipeline,
  type SapQuestionStudioCpId,
} from "./topics/Arithmetic/subtopics/SimplificationAndApproximation/question-studio-adapter";
import {
  localizeSapQuestionPackage,
} from "./topics/Arithmetic/subtopics/SimplificationAndApproximation/localization/runtime";
import {
  SAP_LOCALIZED_LANGUAGES,
  type SapTranslationLanguage,
} from "./topics/Arithmetic/subtopics/SimplificationAndApproximation/localization/types";

export type QuestionStudioQuantV4PackageId =
  | NonNullable<QuantV4GenerationRequest["packageId"]>
  | "AVG-001"
  | "MAL-001"
  | "NUM-001"
  | "SAP";

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
  supportedLanguages: AVG_001_QUESTION_STUDIO_LANGUAGES,
};

const MAL_PACKAGE_DEFINITION = {
  packageId: "MAL-001",
  topic: "Arithmetic",
  subtopic: "Mixture & Alligation",
  label: "Mixture & Alligation",
  cpIds: MAL_001_QUESTION_STUDIO_CP_IDS,
  supportedLanguages: ["en"] as const,
};

const NUM_PACKAGE_DEFINITION = {
  packageId: "NUM-001",
  topic: "Arithmetic",
  subtopic: "Number System",
  label: "Number System",
  cpIds: NUM_001_QUESTION_STUDIO_CP_IDS,
  supportedLanguages: NUM_001_QUESTION_STUDIO_LANGUAGES,
};

const SAP_PACKAGE_DEFINITION = {
  packageId: "SAP",
  topic: "Arithmetic",
  subtopic: "Simplification & Approximation",
  label: "Simplification & Approximation",
  cpIds: SAP_QUESTION_STUDIO_CP_IDS,
  supportedLanguages: SAP_LOCALIZED_LANGUAGES,
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

function isNumberSystemRequest(
  request: QuestionStudioQuantV4GenerationRequest,
) {
  const packageId = normalizeSelector(request.packageId ?? request.archetypeId);
  const patternId = normalizeSelector(request.patternId);
  const topic = normalizeSelector(request.topic);
  const subtopic = normalizeSelector(request.subtopic);
  const selectors = new Set(["number system", "numbers", "number theory"]);
  return (
    packageId === "num 001" ||
    patternId.includes("num 001") ||
    (selectors.has(topic) && !subtopic) ||
    (topic === "arithmetic" && selectors.has(subtopic))
  );
}

function isSimplificationRequest(
  request: QuestionStudioQuantV4GenerationRequest,
) {
  const packageId = normalizeSelector(request.packageId ?? request.archetypeId);
  const patternId = normalizeSelector(request.patternId);
  const topic = normalizeSelector(request.topic);
  const subtopic = normalizeSelector(request.subtopic);
  const selectors = new Set([
    "simplification approximation",
    "simplification and approximation",
    "simplification",
    "approximation",
  ]);
  return (
    packageId === "sap" ||
    patternId === "sap" ||
    patternId.includes("sap ql") ||
    (selectors.has(topic) && !subtopic) ||
    (topic === "arithmetic" && selectors.has(subtopic))
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
  const average = definition.packageId === "AVG-001";
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
    supportedLanguages: [...definition.supportedLanguages],
    enabled: true,
    runtimeMode: "RELEASED",
    reviewStatus: average
      ? "APPROVED_MULTILINGUAL"
      : "APPROVED_EDITORIAL_ENGLISH",
    questionBankStatus: "WRITABLE",
    testEligibility: "ELIGIBLE",
    publiclyPublishable: true,
  };
}

function numberSystemPackageCard() {
  return {
    id: NUM_PACKAGE_DEFINITION.packageId,
    packageId: NUM_PACKAGE_DEFINITION.packageId,
    type: "quant-v4",
    section: "Quant",
    domain: "quant",
    topic: NUM_PACKAGE_DEFINITION.topic,
    subtopic: NUM_PACKAGE_DEFINITION.subtopic,
    name: `${NUM_PACKAGE_DEFINITION.packageId} ${NUM_PACKAGE_DEFINITION.label}`,
    label: NUM_PACKAGE_DEFINITION.label,
    generationDomain: "quant-v4",
    cpIds: [...NUM_PACKAGE_DEFINITION.cpIds],
    canonicalProblems: NUM_PACKAGE_DEFINITION.cpIds.map((cpId) => ({
      id: cpId,
      label: cpId,
    })),
    supportedDifficulties: ["easy", "medium", "hard"],
    supportedLanguages: [...NUM_PACKAGE_DEFINITION.supportedLanguages],
    enabled: true,
    runtimeMode: "QUESTION_STUDIO_ACTIVE",
    supportedRuntimeModes: ["QUESTION_STUDIO_ACTIVE"],
    reviewStatus: "APPROVED_EDITORIAL_ENGLISH_V3",
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
  };
}

function simplificationPackageCard() {
  return {
    id: SAP_PACKAGE_DEFINITION.packageId,
    packageId: SAP_PACKAGE_DEFINITION.packageId,
    type: "quant-v4",
    section: "Quant",
    domain: "quant",
    topic: SAP_PACKAGE_DEFINITION.topic,
    subtopic: SAP_PACKAGE_DEFINITION.subtopic,
    name: `${SAP_PACKAGE_DEFINITION.packageId} ${SAP_PACKAGE_DEFINITION.label}`,
    label: SAP_PACKAGE_DEFINITION.label,
    generationDomain: "quant-v4",
    cpIds: [...SAP_PACKAGE_DEFINITION.cpIds],
    canonicalProblems: SAP_PACKAGE_DEFINITION.cpIds.map((cpId) => ({
      id: cpId,
      label: cpId,
    })),
    supportedDifficulties: ["easy", "medium", "hard"],
    supportedLanguages: [...SAP_PACKAGE_DEFINITION.supportedLanguages],
    enabled: true,
    runtimeMode: "QUESTION_STUDIO_ACTIVE",
    supportedRuntimeModes: ["QUESTION_STUDIO_ACTIVE"],
    reviewStatus: "LOCALIZATION_CONTENT_APPROVED_REVIEW_READY",
    questionBankStatus: "WRITABLE",
    questionBankWritable: true,
    testEligibility: "ELIGIBLE",
    publiclyPublishable: true,
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
  if (!existing.some((pkg: any) => pkg.packageId === "NUM-001")) {
    additions.push(numberSystemPackageCard());
  }
  if (!existing.some((pkg: any) => pkg.packageId === "SAP")) {
    additions.push(simplificationPackageCard());
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

function toNumQuestionStudioPreview(
  pkg: any,
  context: {
    questionIndex: number;
    questionCount: number;
    seed: string;
  },
) {
  const traceability = pkg.traceability ?? {};
  const hiddenState = pkg.hiddenState ?? {};
  const explanationLines = Array.isArray(pkg.explanation?.lines)
    ? pkg.explanation.lines.map((line: unknown) => String(line ?? ""))
    : [];
  const taskKind = traceability.taskDirection ?? hiddenState.kind ?? hiddenState.mode;
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
    patternId: "NUM-001",
    section: "Quant",
    topic: NUM_PACKAGE_DEFINITION.topic,
    subtopic: NUM_PACKAGE_DEFINITION.subtopic,
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
    packageId: "NUM-001",
    taskKind,
    scenarioId: undefined,
    language: pkg.language,
    metadata: {
      language: pkg.language,
      packageId: "NUM-001",
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
    proceduralLogic: hiddenState,
    logic: hiddenState,
    debugMetadata: {
      generationDomain: "quant-v4",
      selectedPattern: "NUM-001",
      selectedArchetype: "NUM-001",
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

function toSapQuestionStudioPreview(
  pkg: any,
  context: {
    questionIndex: number;
    questionCount: number;
    seed: string;
  },
) {
  const traceability = pkg.traceability ?? {};
  const explanationLines = Array.isArray(pkg.explanation?.lines)
    ? pkg.explanation.lines.map((line: unknown) => String(line ?? ""))
    : [];
  const taskKind = traceability.sourceIdentity ?? traceability.permanentQlId;
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
    patternId: "SAP",
    section: "Quant",
    topic: SAP_PACKAGE_DEFINITION.topic,
    subtopic: SAP_PACKAGE_DEFINITION.subtopic,
    generationBackend: "quant-v4",
    debugSource: "quant-v4-package-runtime",
    semanticMetadata: traceability,
    traceability,
    validation: pkg.validation,
    localizationValidation: pkg.localizationValidation,
    questionId: pkg.questionId,
    seed: context.seed,
    answer: pkg.answer,
    canonicalAnswer,
    runtimeMode: pkg.runtimeMode,
    reviewStatus: pkg.reviewStatus,
    questionBankStatus: pkg.questionBankStatus,
    questionBankWritable: pkg.questionBankWritable,
    testEligibility: pkg.testEligibility,
    testEligible: pkg.testEligible,
    publiclyPublishable: pkg.publiclyPublishable,
    packageSource: "quant-v4-package-runtime",
    packageId: "SAP",
    taskKind,
    scenarioId: undefined,
    language: pkg.language,
    metadata: {
      language: pkg.language,
      packageId: "SAP",
      canonicalProblemId: pkg.canonicalProblemId,
      questionLanguageId: pkg.questionLanguageId,
      explanationId: pkg.explanationId,
      taskKind,
      scenarioId: undefined,
      runtimeMode: pkg.runtimeMode,
      reviewStatus: pkg.reviewStatus,
      questionBankStatus: pkg.questionBankStatus,
      questionBankWritable: pkg.questionBankWritable,
      testEligibility: pkg.testEligibility,
      testEligible: pkg.testEligible,
      publiclyPublishable: pkg.publiclyPublishable,
      releaseId: traceability.releaseId,
      localizationVersion: traceability.localizationVersion,
    },
    questionIndex: context.questionIndex,
    questionCount: context.questionCount,
    canonicalProblemId: pkg.canonicalProblemId,
    questionLanguageId: pkg.questionLanguageId,
    explanationId: pkg.explanationId,
    proceduralLogic: {},
    logic: {},
    debugMetadata: {
      generationDomain: "quant-v4",
      selectedPattern: "SAP",
      selectedArchetype: "SAP",
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
      semanticMetadata: traceability,
      validatorReports: pkg.validation,
      localizationValidation: pkg.localizationValidation,
      releaseId: traceability.releaseId,
    },
  };
}

async function generateAverageQuestion(
  request: QuestionStudioQuantV4GenerationRequest,
) {
  const language = (request.language ?? "en") as QuantV4Language;
  if (
    !AVG_001_QUESTION_STUDIO_LANGUAGES.includes(
      language as "en" | "hi" | "pa",
    )
  ) {
    throw new Error(
      `AVG-001 does not support Question Studio language ${language}.`,
    );
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
    throw new Error(
      `Unknown canonical problem '${explicitCp}' for package AVG-001`,
    );
  }

  const batchSeed =
    request.seed ??
    `quant-v4:AVG-001:${language}:${explicitCp ?? "mixed"}:${Date.now()}:${Math.random()
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
      language,
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

  const first = questionPackages[0] as any;
  return {
    generationContext: {
      generationDomain: "quant-v4",
      seed: batchSeed,
      timestamp: Date.now(),
      runtimeMode: "RELEASED",
      reviewStatus:
        language === "en"
          ? "APPROVED_EDITORIAL_ENGLISH_V2"
          : "APPROVED_LOCALIZED",
      questionBankStatus: "WRITABLE",
      testEligibility: "ELIGIBLE",
      publiclyPublishable: true,
      releaseId: first?.traceability?.releaseId,
      language,
    },
    questionPackages,
    questions,
  };
}

function inferMalCpFromQl(value: unknown): Mal001QuestionStudioCpId | undefined {
  const match = /^MAL-QL-(\d{3})$/u.exec(String(value ?? ""));
  if (!match) return undefined;
  const number = Number(match[1]);
  if (number >= 1 && number <= 11) return "MAL-CP-001";
  if (number >= 12 && number <= 28) return "MAL-CP-002";
  return undefined;
}

async function generateMixtureAndAlligationQuestion(
  request: QuestionStudioQuantV4GenerationRequest,
) {
  const language = (request.language ?? "en") as QuantV4Language;
  if (language !== "en") {
    throw new Error(
      "MAL-001 supports English generation only in Question Studio.",
    );
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
    throw new Error(
      `Unknown canonical problem '${explicitCp}' for package MAL-001`,
    );
  }

  const inferredCp = inferMalCpFromQl(request.questionLanguageId);
  const fixedCp = (explicitCp ?? inferredCp) as
    | Mal001QuestionStudioCpId
    | undefined;
  const batchSeed =
    request.seed ??
    `quant-v4:MAL-001:${fixedCp ?? "mixed"}:${Date.now()}:${Math.random()
      .toString(36)
      .slice(2)}`;
  const cpOffset =
    seededHash(`${batchSeed}:cp-offset`) %
    MAL_001_QUESTION_STUDIO_CP_IDS.length;
  const questionPackages = [];
  const questions = [];

  for (let index = 0; index < count; index += 1) {
    if (index > 0 && index % 100 === 0) {
      await new Promise((resolve) => setImmediate(resolve));
    }
    const cpId = (fixedCp ??
      MAL_001_QUESTION_STUDIO_CP_IDS[
        (cpOffset + index) % MAL_001_QUESTION_STUDIO_CP_IDS.length
      ]) as Mal001QuestionStudioCpId;
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

  const first = questionPackages[0] as any;
  return {
    generationContext: {
      generationDomain: "quant-v4",
      seed: batchSeed,
      timestamp: Date.now(),
      runtimeMode: "RELEASED",
      reviewStatus: first?.reviewStatus ?? "APPROVED_EDITORIAL_ENGLISH",
      questionBankStatus: "WRITABLE",
      testEligibility: "ELIGIBLE",
      publiclyPublishable: true,
      releaseId: first?.traceability?.releaseId,
      language: "en",
      canonicalProblemId: fixedCp ?? "MIXED",
    },
    questionPackages,
    questions,
  };
}

function inferNumCpFromQl(value: unknown): Num001QuestionStudioCpId | undefined {
  const match = /^NUM-QL-(\d{3})$/u.exec(String(value ?? ""));
  if (!match) return undefined;
  const number = Number(match[1]);
  if (number >= 1 && number <= 17) return "NUM-CP-003";
  if (number >= 18 && number <= 45) return "NUM-CP-004";
  return undefined;
}

async function generateNumberSystemQuestion(
  request: QuestionStudioQuantV4GenerationRequest,
) {
  const language = (request.language ?? "en") as QuantV4Language;
  if (language !== "en") {
    throw new Error(
      "NUM-001 supports English generation only in Question Studio.",
    );
  }

  const count = Math.min(
    1000,
    Math.max(1, Math.floor(Number(request.count ?? 1) || 1)),
  );
  const difficulty = normalizeDifficulty(request.difficulty);
  const explicitCp = request.canonicalProblemId ?? request.cpId;
  if (
    explicitCp &&
    !NUM_001_QUESTION_STUDIO_CP_IDS.includes(
      explicitCp as Num001QuestionStudioCpId,
    )
  ) {
    throw new Error(
      `Unknown canonical problem '${explicitCp}' for package NUM-001`,
    );
  }

  const inferredCp = inferNumCpFromQl(request.questionLanguageId);
  const fixedCp = (explicitCp ?? inferredCp) as
    | Num001QuestionStudioCpId
    | undefined;
  const batchSeed =
    request.seed ??
    `quant-v4:NUM-001:${fixedCp ?? "mixed"}:${Date.now()}:${Math.random()
      .toString(36)
      .slice(2)}`;
  const cpOffset =
    seededHash(`${batchSeed}:cp-offset`) %
    NUM_001_QUESTION_STUDIO_CP_IDS.length;
  const questionPackages = [];
  const questions = [];

  for (let index = 0; index < count; index += 1) {
    if (index > 0 && index % 100 === 0) {
      await new Promise((resolve) => setImmediate(resolve));
    }
    const cpId = (fixedCp ??
      NUM_001_QUESTION_STUDIO_CP_IDS[
        (cpOffset + index) % NUM_001_QUESTION_STUDIO_CP_IDS.length
      ]) as Num001QuestionStudioCpId;
    const seed = `${batchSeed}:${cpId}:${index}`;
    const pkg = runNum001QuestionStudioPipeline(cpId, {
      difficulty,
      language: "en",
      questionLanguageId: request.questionLanguageId,
      seed,
    });
    questionPackages.push(pkg);
    questions.push(
      toNumQuestionStudioPreview(pkg, {
        questionIndex: index + 1,
        questionCount: count,
        seed,
      }),
    );
  }

  const first = questionPackages[0] as any;
  return {
    generationContext: {
      generationDomain: "quant-v4",
      seed: batchSeed,
      timestamp: Date.now(),
      runtimeMode: "QUESTION_STUDIO_ACTIVE",
      reviewStatus: "APPROVED_EDITORIAL_ENGLISH_V3",
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
      releaseId: first?.traceability?.releaseId,
      language: "en",
      canonicalProblemId: fixedCp ?? "MIXED",
    },
    questionPackages,
    questions,
  };
}

async function generateSimplificationQuestion(
  request: QuestionStudioQuantV4GenerationRequest,
) {
  const language = (request.language ?? "en") as QuantV4Language;
  if (!SAP_LOCALIZED_LANGUAGES.includes(language as "en" | "hi" | "pa")) {
    throw new Error(`SAP does not support Question Studio language ${language}.`);
  }

  const count = Math.min(
    1000,
    Math.max(1, Math.floor(Number(request.count ?? 1) || 1)),
  );
  const difficulty = normalizeDifficulty(request.difficulty);
  const explicitCp = request.canonicalProblemId ?? request.cpId;
  if (
    explicitCp &&
    !SAP_QUESTION_STUDIO_CP_IDS.includes(explicitCp as SapQuestionStudioCpId)
  ) {
    throw new Error(`Unknown canonical problem '${explicitCp}' for package SAP`);
  }

  const inferredCp = inferSapQuestionStudioCpFromQl(request.questionLanguageId);
  if (explicitCp && inferredCp && explicitCp !== inferredCp) {
    throw new Error(`${String(request.questionLanguageId)} is owned by ${inferredCp}, not ${explicitCp}.`);
  }
  const fixedCp = (explicitCp ?? inferredCp) as SapQuestionStudioCpId | undefined;
  const batchSeed =
    request.seed ??
    `quant-v4:SAP:${language}:${fixedCp ?? "mixed"}:${Date.now()}:${Math.random()
      .toString(36)
      .slice(2)}`;
  const cpOffset =
    seededHash(`${batchSeed}:cp-offset`) % SAP_QUESTION_STUDIO_CP_IDS.length;
  const questionPackages = [];
  const questions = [];

  for (let index = 0; index < count; index += 1) {
    if (index > 0 && index % 100 === 0) {
      await new Promise((resolve) => setImmediate(resolve));
    }
    const cpId = (fixedCp ??
      SAP_QUESTION_STUDIO_CP_IDS[
        (cpOffset + index) % SAP_QUESTION_STUDIO_CP_IDS.length
      ]) as SapQuestionStudioCpId;
    const seed = `${batchSeed}:${cpId}:${index}`;
    const englishPackage = runSapQuestionStudioPipeline(cpId, {
      difficulty,
      language: "en",
      questionLanguageId: request.questionLanguageId,
      seed,
    });
    const pkg = language === "en"
      ? englishPackage
      : localizeSapQuestionPackage(englishPackage, language as SapTranslationLanguage);
    questionPackages.push(pkg);
    questions.push(
      toSapQuestionStudioPreview(pkg, {
        questionIndex: index + 1,
        questionCount: count,
        seed,
      }),
    );
  }

  const first = questionPackages[0] as any;
  return {
    generationContext: {
      generationDomain: "quant-v4",
      seed: batchSeed,
      timestamp: Date.now(),
      runtimeMode: "QUESTION_STUDIO_ACTIVE",
      reviewStatus: "LOCALIZATION_CONTENT_APPROVED_REVIEW_READY",
      questionBankStatus: "WRITABLE",
      questionBankWritable: true,
      testEligibility: "ELIGIBLE",
      publiclyPublishable: true,
      releaseId: first?.traceability?.releaseId,
      language,
      localizationVersion: first?.traceability?.localizationVersion,
      canonicalProblemId: fixedCp ?? "MIXED",
    },
    questionPackages,
    questions,
  };
}

export async function generateQuestion(
  request: QuestionStudioQuantV4GenerationRequest = {},
) {
  if (isSimplificationRequest(request)) {
    return generateSimplificationQuestion(request);
  }
  if (isNumberSystemRequest(request)) {
    return generateNumberSystemQuestion(request);
  }
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

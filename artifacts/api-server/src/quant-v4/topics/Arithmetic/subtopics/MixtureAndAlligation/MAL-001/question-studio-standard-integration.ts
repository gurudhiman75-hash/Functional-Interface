import {
  MAL_001_QUESTION_STUDIO_CP_IDS,
  MAL_001_QUESTION_STUDIO_LANGUAGES,
  listMal001QuestionStudioCpIdsForDifficulty,
  runMal001QuestionStudioPipeline,
  type Mal001QuestionStudioCpId,
  type Mal001QuestionStudioLanguage,
} from "./question-studio-adapter";

export type Mal001StandardQuestionStudioRequest = {
  packageId?: unknown;
  archetypeId?: unknown;
  patternId?: unknown;
  topic?: unknown;
  subtopic?: unknown;
  canonicalProblemId?: unknown;
  cpId?: unknown;
  questionLanguageId?: unknown;
  difficulty?: unknown;
  language?: unknown;
  count?: unknown;
  seed?: string;
};

type Difficulty = "Easy" | "Medium" | "Hard";

const MAL_PACKAGE_DEFINITION = Object.freeze({
  packageId: "MAL-001" as const,
  topic: "Arithmetic" as const,
  subtopic: "Mixture & Alligation" as const,
  label: "Mixture & Alligation" as const,
  cpIds: MAL_001_QUESTION_STUDIO_CP_IDS,
  supportedLanguages: MAL_001_QUESTION_STUDIO_LANGUAGES,
});

function normalizeSelector(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function normalizeDifficulty(value: unknown): Difficulty | undefined {
  const text = String(value ?? "").trim().toLowerCase();
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

function normalizeLanguage(value: unknown): Mal001QuestionStudioLanguage {
  const language = String(value ?? "en").trim().toLowerCase();
  if (!MAL_001_QUESTION_STUDIO_LANGUAGES.includes(language as Mal001QuestionStudioLanguage)) {
    throw new Error(`MAL-001 does not support Question Studio language ${language}.`);
  }
  return language as Mal001QuestionStudioLanguage;
}

function seededHash(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function inferCpFromQl(value: unknown): Mal001QuestionStudioCpId | undefined {
  const match = /^MAL-QL-(\d{3})$/u.exec(String(value ?? ""));
  if (!match) return undefined;
  const number = Number(match[1]);
  if (number >= 1 && number <= 11) return "MAL-CP-001";
  if (number >= 12 && number <= 28) return "MAL-CP-002";
  if (number >= 29 && number <= 37) return "MAL-CP-003";
  if (number >= 38 && number <= 47) return "MAL-CP-004";
  if (number >= 48 && number <= 60) return "MAL-CP-005";
  if (number >= 61 && number <= 67) return "MAL-CP-006";
  return undefined;
}

export function isMal001StandardQuestionStudioRequest(
  request: Mal001StandardQuestionStudioRequest,
): boolean {
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

export function listMal001StandardQuestionStudioPackages() {
  return [
    {
      id: MAL_PACKAGE_DEFINITION.packageId,
      packageId: MAL_PACKAGE_DEFINITION.packageId,
      type: "quant-v4",
      section: "Quant",
      domain: "quant",
      topic: MAL_PACKAGE_DEFINITION.topic,
      subtopic: MAL_PACKAGE_DEFINITION.subtopic,
      name: `${MAL_PACKAGE_DEFINITION.packageId} ${MAL_PACKAGE_DEFINITION.label}`,
      label: MAL_PACKAGE_DEFINITION.label,
      generationDomain: "quant-v4",
      cpIds: [...MAL_PACKAGE_DEFINITION.cpIds],
      canonicalProblems: MAL_PACKAGE_DEFINITION.cpIds.map((cpId) => ({
        id: cpId,
        label: cpId,
      })),
      supportedDifficulties: ["easy", "medium", "hard"],
      supportedLanguages: [...MAL_PACKAGE_DEFINITION.supportedLanguages],
      enabled: true,
      runtimeMode: "QUESTION_STUDIO_ACTIVE",
      supportedRuntimeModes: ["QUESTION_STUDIO_ACTIVE"],
      reviewStatus: "APPROVED_MULTILINGUAL_QUESTION_STUDIO",
      questionBankStatus: "NOT_STORED",
      questionBankWritable: false,
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
    },
  ];
}

function toQuestionStudioPreview(
  pkg: any,
  context: { questionIndex: number; questionCount: number; seed: string },
) {
  const traceability = pkg.traceability ?? {};
  const parameters = pkg.parameters ?? {};
  const explanationLines = Array.isArray(pkg.explanation?.lines)
    ? pkg.explanation.lines.map((line: unknown) => String(line ?? ""))
    : Array.isArray(pkg.explanation?.visibleLines)
      ? [
          ...pkg.explanation.visibleLines.map((line: unknown) => String(line ?? "")),
          String(pkg.explanation?.answerLine ?? ""),
        ].filter(Boolean)
      : [];
  const difficulty = pkg.difficultyBand ?? pkg.difficulty;
  const taskKind =
    traceability.taskDirection ??
    traceability.solveModeId ??
    parameters.taskDirection ??
    parameters.permanentSolveModeId;
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
    difficulty,
    difficultyLabel: difficulty,
    patternId: "MAL-001",
    section: "Quant",
    topic: MAL_PACKAGE_DEFINITION.topic,
    subtopic: MAL_PACKAGE_DEFINITION.subtopic,
    generationBackend: "quant-v4",
    debugSource: "mal-001-question-studio-standard-runtime",
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
    questionBankWritable: pkg.questionBankWritable,
    testEligibility: pkg.testEligibility,
    testEligible: pkg.testEligible,
    publiclyPublishable: pkg.publiclyPublishable,
    questionStudioDiscoverable: pkg.questionStudioDiscoverable,
    packageSource: "mal-001-question-studio-standard-runtime",
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
      runtimeMode: pkg.runtimeMode,
      reviewStatus: pkg.reviewStatus,
      questionBankStatus: pkg.questionBankStatus,
      questionBankWritable: pkg.questionBankWritable,
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
      questionIndex: context.questionIndex,
      questionCount: context.questionCount,
      questionId: pkg.questionId,
      packageSource: "mal-001-question-studio-standard-runtime",
      seed: context.seed,
      reasoningGraph: pkg.reasoningGraph,
      semanticMetadata: traceability,
      validatorReports: pkg.validation,
      releaseId: traceability.releaseId,
    },
  };
}

export async function generateMal001StandardQuestionStudioBatch(
  request: Mal001StandardQuestionStudioRequest = {},
) {
  const language = normalizeLanguage(request.language);
  const count = Math.min(
    1000,
    Math.max(1, Math.floor(Number(request.count ?? 1) || 1)),
  );
  const difficulty = normalizeDifficulty(request.difficulty);
  const explicitCpRaw = String(request.canonicalProblemId ?? request.cpId ?? "").trim();
  const explicitCp = explicitCpRaw || undefined;
  if (
    explicitCp &&
    !MAL_001_QUESTION_STUDIO_CP_IDS.includes(
      explicitCp as Mal001QuestionStudioCpId,
    )
  ) {
    throw new Error(`Unknown canonical problem '${explicitCp}' for package MAL-001.`);
  }

  const inferredCp = inferCpFromQl(request.questionLanguageId);
  if (explicitCp && inferredCp && explicitCp !== inferredCp) {
    throw new Error(
      `${String(request.questionLanguageId)} belongs to ${inferredCp}, not ${explicitCp}.`,
    );
  }
  const fixedCp = (explicitCp ?? inferredCp) as
    | Mal001QuestionStudioCpId
    | undefined;
  const eligibleCpIds = fixedCp
    ? [fixedCp]
    : [...listMal001QuestionStudioCpIdsForDifficulty(difficulty)];
  if (eligibleCpIds.length === 0) {
    throw new Error(
      `MAL-001 has no Question Studio QLs${difficulty ? ` for ${difficulty}` : ""}.`,
    );
  }

  const batchSeed =
    request.seed ??
    `quant-v4:MAL-001:${language}:${fixedCp ?? "mixed"}:${Date.now()}:${Math.random()
      .toString(36)
      .slice(2)}`;
  const cpOffset = seededHash(`${batchSeed}:cp-offset`) % eligibleCpIds.length;
  const questionPackages: any[] = [];
  const questions: any[] = [];

  for (let index = 0; index < count; index += 1) {
    if (index > 0 && index % 100 === 0) {
      await new Promise((resolve) => setImmediate(resolve));
    }
    const cpId = eligibleCpIds[(cpOffset + index) % eligibleCpIds.length]!;
    const seed = `${batchSeed}:${cpId}:${index}`;
    const pkg = runMal001QuestionStudioPipeline(cpId, {
      difficulty,
      language,
      questionLanguageId:
        request.questionLanguageId === undefined
          ? undefined
          : String(request.questionLanguageId),
      seed,
    });
    questionPackages.push(pkg);
    questions.push(
      toQuestionStudioPreview(pkg, {
        questionIndex: index + 1,
        questionCount: count,
        seed,
      }),
    );
  }

  const first = questionPackages[0];
  return {
    generationContext: {
      generationDomain: "quant-v4",
      seed: batchSeed,
      timestamp: Date.now(),
      runtimeMode: "QUESTION_STUDIO_ACTIVE",
      reviewStatus:
        language === "en"
          ? "APPROVED_EDITORIAL_ENGLISH_V3"
          : "APPROVED_MULTILINGUAL_QUESTION_STUDIO",
      questionBankStatus: "NOT_STORED",
      questionBankWritable: false,
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
      releaseId: first?.traceability?.releaseId,
      language,
      packageId: "MAL-001",
      canonicalProblemId: fixedCp ?? "MIXED",
      mathematicalAuthorityLanguage: "en",
      lifecyclePolicy: "QUESTION_STUDIO_ONLY_MULTILINGUAL",
    },
    questionPackages,
    questions,
  };
}

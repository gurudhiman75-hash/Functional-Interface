import {
  generateQuestion as generateBaseQuestion,
  listQuantV4Packages as listBasePackages,
  type QuestionStudioQuantV4GenerationRequest,
} from "./question-studio-generation-engine";
import {
  NUM_CP001_QUESTION_STUDIO_REVIEW_RELEASE,
  getNumCp001QuestionStudioReviewQlIds,
  runNumCp001QuestionStudioReview,
  type NumCp001QuestionStudioReviewDifficulty,
  type NumCp001QuestionStudioReviewLanguage,
} from "./topics/Arithmetic/subtopics/NumberSystem/NUM-001/NUM-CP-001/question-studio-review-release";
import {
  TMW_001_QUESTION_STUDIO_CP_IDS,
  TMW_001_QUESTION_STUDIO_LANGUAGES,
  inferTmw001QuestionStudioCpFromQl,
  runTmw001QuestionStudioPipeline,
  type Tmw001QuestionStudioCpId,
  type Tmw001QuestionStudioDifficulty,
  type Tmw001QuestionStudioLanguage,
} from "./topics/Arithmetic/subtopics/TimeAndWork/TMW-001/question-studio-adapter";

type QuestionStudioReviewPackageId = NonNullable<QuestionStudioQuantV4GenerationRequest["packageId"]> | "TMW-001";

export type QuestionStudioReviewGenerationRequest = Omit<
  QuestionStudioQuantV4GenerationRequest,
  "packageId" | "archetypeId"
> & {
  packageId?: QuestionStudioReviewPackageId;
  archetypeId?: QuestionStudioReviewPackageId;
};

function normalizeSelector(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function isNumberSystemRequest(request: QuestionStudioReviewGenerationRequest) {
  const packageId = normalizeSelector(request.packageId ?? request.archetypeId);
  const patternId = normalizeSelector(request.patternId);
  const topic = normalizeSelector(request.topic);
  const subtopic = normalizeSelector(request.subtopic);
  const selectors = new Set(["number system", "numbers", "number theory"]);
  return (
    packageId === "num 001"
    || patternId.includes("num 001")
    || (selectors.has(topic) && !subtopic)
    || (topic === "arithmetic" && selectors.has(subtopic))
  );
}

function isTimeAndWorkRequest(request: QuestionStudioReviewGenerationRequest) {
  const packageId = normalizeSelector(request.packageId ?? request.archetypeId);
  const patternId = normalizeSelector(request.patternId);
  const topic = normalizeSelector(request.topic);
  const subtopic = normalizeSelector(request.subtopic);
  const selectors = new Set([
    "time work",
    "time and work",
    "work and time",
    "pipes cisterns",
    "pipes and cisterns",
  ]);
  return (
    packageId === "tmw 001"
    || patternId.includes("tmw 001")
    || (selectors.has(topic) && !subtopic)
    || (topic === "arithmetic" && selectors.has(subtopic))
  );
}

function inferNumCpFromQl(value: unknown): "NUM-CP-001" | "NUM-CP-003" | "NUM-CP-004" | undefined {
  const match = /^NUM-QL-(\d{3})$/u.exec(String(value ?? ""));
  if (!match) return undefined;
  const number = Number(match[1]);
  if (number >= 1 && number <= 17) return "NUM-CP-003";
  if (number >= 18 && number <= 45) return "NUM-CP-004";
  if (number >= 124 && number <= 144) return "NUM-CP-001";
  return undefined;
}

function normalizeDifficulty(value: unknown): NumCp001QuestionStudioReviewDifficulty | undefined {
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

function cp001Preview(
  pkg: any,
  context: { questionIndex: number; questionCount: number; seed: string },
) {
  const traceability = pkg.traceability ?? {};
  const hiddenState = pkg.hiddenState ?? {};
  const explanationLines = Array.isArray(pkg.explanation?.lines)
    ? pkg.explanation.lines.map((line: unknown) => String(line ?? ""))
    : [];
  const taskKind = traceability.runtimePrototypeId ?? hiddenState.kind ?? hiddenState.mode;
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
    topic: "Arithmetic",
    subtopic: "Number System",
    generationBackend: "quant-v4",
    debugSource: "quant-v4-cp001-guarded-review-runtime",
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
    packageSource: "quant-v4-cp001-guarded-review-runtime",
    packageId: "NUM-001",
    taskKind,
    scenarioId: undefined,
    language: pkg.language,
    metadata: {
      language: pkg.language,
      packageId: "NUM-001",
      canonicalProblemId: "NUM-CP-001",
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
    canonicalProblemId: "NUM-CP-001",
    questionLanguageId: pkg.questionLanguageId,
    explanationId: pkg.explanationId,
    proceduralLogic: hiddenState,
    logic: hiddenState,
    debugMetadata: {
      generationDomain: "quant-v4",
      selectedPattern: "NUM-001",
      selectedArchetype: "NUM-001",
      selectedMotif: "NUM-CP-001",
      canonicalProblemId: "NUM-CP-001",
      questionLanguageId: pkg.questionLanguageId,
      explanationId: pkg.explanationId,
      taskKind,
      scenarioId: undefined,
      questionIndex: context.questionIndex,
      questionCount: context.questionCount,
      questionId: pkg.questionId,
      packageSource: "quant-v4-cp001-guarded-review-runtime",
      seed: context.seed,
      semanticMetadata: traceability,
      validatorReports: pkg.validation,
      releaseId: traceability.releaseId,
    },
  };
}

function tmwPreview(
  pkg: any,
  context: { questionIndex: number; questionCount: number; seed: string },
) {
  const traceability = pkg.traceability ?? {};
  const explanationLines = Array.isArray(pkg.explanation?.lines)
    ? pkg.explanation.lines.map((line: unknown) => String(line ?? ""))
    : [];
  const taskKind = pkg.solveMode ?? traceability.solveMode ?? traceability.permanentQlId;
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
    learnerExplanation: pkg.learnerExplanation,
    learnerExplanationVersion: pkg.learnerExplanationVersion,
    presentationBlocks: pkg.presentationBlocks,
    representation: pkg.representation,
    caseletGroupId: pkg.caseletGroupId,
    caseletStimulus: pkg.caseletStimulus,
    difficulty: pkg.difficultyBand,
    difficultyLabel: pkg.difficultyBand,
    patternId: "TMW-001",
    section: "Quant",
    topic: "Arithmetic",
    subtopic: "Time & Work",
    generationBackend: "quant-v4",
    debugSource: "quant-v4-frozen-tmw-runtime",
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
    packageSource: "quant-v4-frozen-tmw-runtime",
    packageId: "TMW-001",
    taskKind,
    scenarioId: undefined,
    language: pkg.language,
    metadata: {
      language: pkg.language,
      packageId: "TMW-001",
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
      freezeStatus: traceability.freezeStatus,
      sourceAuthorityHead: traceability.sourceAuthorityHead,
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
      selectedPattern: "TMW-001",
      selectedArchetype: "TMW-001",
      selectedMotif: pkg.canonicalProblemId,
      canonicalProblemId: pkg.canonicalProblemId,
      questionLanguageId: pkg.questionLanguageId,
      explanationId: pkg.explanationId,
      taskKind,
      scenarioId: undefined,
      questionIndex: context.questionIndex,
      questionCount: context.questionCount,
      questionId: pkg.questionId,
      packageSource: "quant-v4-frozen-tmw-runtime",
      seed: context.seed,
      semanticMetadata: traceability,
      validatorReports: pkg.validation,
      releaseId: traceability.releaseId,
    },
  };
}

async function generateCp001Review(request: QuestionStudioReviewGenerationRequest) {
  const language = (request.language ?? "en") as NumCp001QuestionStudioReviewLanguage;
  if (!NUM_CP001_QUESTION_STUDIO_REVIEW_RELEASE.languages.includes(language)) {
    throw new Error(`NUM-CP-001 does not support Question Studio review language ${language}.`);
  }
  const count = Math.min(1000, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const difficulty = normalizeDifficulty(request.difficulty);
  const qlIds = getNumCp001QuestionStudioReviewQlIds();
  const explicitQl = String(request.questionLanguageId ?? "") || undefined;
  if (explicitQl && !qlIds.includes(explicitQl as any)) {
    throw new Error(`${explicitQl} is not owned by NUM-CP-001.`);
  }
  const batchSeed = request.seed
    ?? `quant-v4:NUM-001:NUM-CP-001:${language}:${Date.now()}:${Math.random().toString(36).slice(2)}`;
  const qlOffset = seededHash(`${batchSeed}:ql-offset`) % qlIds.length;
  const questionPackages = [];
  const questions = [];

  for (let index = 0; index < count; index += 1) {
    if (index > 0 && index % 100 === 0) await new Promise((resolve) => setImmediate(resolve));
    const questionLanguageId = (explicitQl ?? qlIds[(qlOffset + index) % qlIds.length]!) as any;
    const seed = `${batchSeed}:NUM-CP-001:${questionLanguageId}:${index}`;
    const pkg = runNumCp001QuestionStudioReview({
      questionLanguageId,
      difficulty,
      language,
      seed,
    });
    questionPackages.push(pkg);
    questions.push(cp001Preview(pkg, {
      questionIndex: index + 1,
      questionCount: count,
      seed,
    }));
  }

  return {
    generationContext: {
      generationDomain: "quant-v4",
      seed: batchSeed,
      timestamp: Date.now(),
      runtimeMode: "QUESTION_STUDIO_ACTIVE",
      reviewStatus: "APPROVED_MULTILINGUAL_CONTROLLED_REVIEW",
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
      releaseId: NUM_CP001_QUESTION_STUDIO_REVIEW_RELEASE.releaseId,
      language,
      canonicalProblemId: "NUM-CP-001",
    },
    questionPackages,
    questions,
  };
}

async function generateTmwReview(request: QuestionStudioReviewGenerationRequest) {
  const language = String(request.language ?? "en") as Tmw001QuestionStudioLanguage;
  if (!TMW_001_QUESTION_STUDIO_LANGUAGES.includes(language)) {
    throw new Error(`TMW-001 does not support Question Studio language ${language}.`);
  }
  const count = Math.min(1000, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const difficulty = normalizeDifficulty(request.difficulty) as Tmw001QuestionStudioDifficulty | undefined;
  const explicitCp = String(request.canonicalProblemId ?? request.cpId ?? "") || undefined;
  if (explicitCp && !TMW_001_QUESTION_STUDIO_CP_IDS.includes(explicitCp as Tmw001QuestionStudioCpId)) {
    throw new Error(`Unknown canonical problem '${explicitCp}' for package TMW-001.`);
  }
  const inferredCp = inferTmw001QuestionStudioCpFromQl(request.questionLanguageId);
  if (explicitCp && inferredCp && explicitCp !== inferredCp) {
    throw new Error(`${String(request.questionLanguageId)} is owned by ${inferredCp}, not ${explicitCp}.`);
  }
  const fixedCp = (explicitCp ?? inferredCp) as Tmw001QuestionStudioCpId | undefined;
  const explicitQl = String(request.questionLanguageId ?? "") || undefined;
  const batchSeed = request.seed
    ?? `quant-v4:TMW-001:${fixedCp ?? "mixed"}:${language}:${Date.now()}:${Math.random().toString(36).slice(2)}`;
  const questionPackages = [];
  const questions = [];

  for (let index = 0; index < count; index += 1) {
    if (index > 0 && index % 100 === 0) await new Promise((resolve) => setImmediate(resolve));
    const seed = `${batchSeed}:${fixedCp ?? "mixed"}:${index}`;
    const pkg = runTmw001QuestionStudioPipeline({
      canonicalProblemId: fixedCp,
      questionLanguageId: explicitQl,
      difficulty,
      language,
      seed,
    });
    questionPackages.push(pkg);
    questions.push(tmwPreview(pkg, {
      questionIndex: index + 1,
      questionCount: count,
      seed,
    }));
  }

  return {
    generationContext: {
      generationDomain: "quant-v4",
      seed: batchSeed,
      timestamp: Date.now(),
      runtimeMode: "QUESTION_STUDIO_ACTIVE",
      reviewStatus: "FROZEN_MULTILINGUAL_CONTENT_AUTHORITY",
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
      releaseId: "TMW-001-FROZEN-228-MULTILINGUAL-V1",
      language,
      canonicalProblemId: fixedCp ?? "MIXED",
    },
    questionPackages,
    questions,
  };
}

export function listQuantV4Packages() {
  const packages = listBasePackages().map((pkg: any) => {
    if (pkg.packageId !== "NUM-001") return pkg;
    const cpIds = [...new Set([...(pkg.cpIds ?? []), "NUM-CP-001"])];
    const canonicalProblems = Array.isArray(pkg.canonicalProblems)
      ? [...pkg.canonicalProblems]
      : [];
    if (!canonicalProblems.some((entry: any) => entry?.id === "NUM-CP-001")) {
      canonicalProblems.push({ id: "NUM-CP-001", label: "NUM-CP-001" });
    }
    return {
      ...pkg,
      cpIds,
      canonicalProblems,
      supportedLanguages: ["en", "hi", "pa"],
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
    };
  });

  if (!packages.some((pkg: any) => pkg.packageId === "TMW-001")) {
    packages.push({
      id: "TMW-001",
      packageId: "TMW-001",
      type: "quant-v4",
      section: "Quant",
      domain: "quant",
      topic: "Arithmetic",
      subtopic: "Time & Work",
      name: "TMW-001 Time & Work",
      label: "Time & Work",
      generationDomain: "quant-v4",
      cpIds: [...TMW_001_QUESTION_STUDIO_CP_IDS],
      canonicalProblems: TMW_001_QUESTION_STUDIO_CP_IDS.map((cpId) => ({ id: cpId, label: cpId })),
      supportedDifficulties: ["easy", "medium", "hard"],
      supportedLanguages: [...TMW_001_QUESTION_STUDIO_LANGUAGES],
      enabled: true,
      runtimeMode: "QUESTION_STUDIO_ACTIVE",
      supportedRuntimeModes: ["QUESTION_STUDIO_ACTIVE"],
      reviewStatus: "FROZEN_MULTILINGUAL_CONTENT_AUTHORITY",
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
    } as any);
  }

  return packages.sort((left: any, right: any) =>
    String(left.packageId).localeCompare(String(right.packageId)),
  );
}

export async function generateQuestion(request: QuestionStudioReviewGenerationRequest = {}) {
  if (isTimeAndWorkRequest(request)) return generateTmwReview(request);
  if (!isNumberSystemRequest(request)) {
    return generateBaseQuestion(request as QuestionStudioQuantV4GenerationRequest);
  }

  const language = String(request.language ?? "en") as NumCp001QuestionStudioReviewLanguage;
  const explicitCp = String(request.canonicalProblemId ?? request.cpId ?? "") || undefined;
  const inferredCp = inferNumCpFromQl(request.questionLanguageId);

  if (explicitCp && inferredCp && explicitCp !== inferredCp) {
    throw new Error(`${String(request.questionLanguageId)} is owned by ${inferredCp}, not ${explicitCp}.`);
  }

  const cp001Target = explicitCp === "NUM-CP-001"
    || inferredCp === "NUM-CP-001"
    || (language !== "en" && !explicitCp && !inferredCp);

  if (cp001Target) return generateCp001Review(request);

  if (language !== "en") {
    throw new Error(
      "NUM-001 supports Hindi/Punjabi Question Studio review only for NUM-CP-001; NUM-CP-003 and NUM-CP-004 remain English-only.",
    );
  }

  return generateBaseQuestion(request as QuestionStudioQuantV4GenerationRequest);
}

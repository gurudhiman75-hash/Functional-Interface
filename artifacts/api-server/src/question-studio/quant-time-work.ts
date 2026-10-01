import {
  applyQuantV4ExamProfileDelivery,
  withQuantV4ExamProfileContext,
  type QuantV4GenerationRequest,
} from "../quant-v4/generation-engine";
import {
  TMW_001_QUESTION_STUDIO_CP_IDS,
  TMW_001_QUESTION_STUDIO_LANGUAGES,
  inferTmw001QuestionStudioCpFromQl,
  runTmw001QuestionStudioPipeline,
  type Tmw001QuestionStudioCpId,
  type Tmw001QuestionStudioDifficulty,
  type Tmw001QuestionStudioLanguage,
} from "../quant-v4/topics/Arithmetic/subtopics/TimeAndWork/TMW-001/question-studio-adapter";
import { TMW_001_FINAL_FREEZE_AUTHORITY } from "../quant-v4/topics/Arithmetic/subtopics/TimeAndWork/TMW-001/foundation/final-freeze-authority";
import type {
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioPackageDefinition,
} from "./engine-types";

function normalizeSelector(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function normalizeDifficulty(value: unknown): Tmw001QuestionStudioDifficulty | undefined {
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

export function isTmw001EngineRequest(request: QuestionStudioGenerationRequest): boolean {
  const packageId = normalizeSelector(request.packageId);
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
    questionBankWritable: false,
    testEligibility: pkg.testEligibility,
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: pkg.publiclyPublishable,
    publicReleaseAuthorized: false,
    automaticStudentPublication: false,
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
      questionBankWritable: false,
      testEligibility: pkg.testEligibility,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: pkg.publiclyPublishable,
      publicReleaseAuthorized: false,
      automaticStudentPublication: false,
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

async function generateRawTmwBatch(
  request: QuestionStudioGenerationRequest,
): Promise<QuestionStudioGenerationResult> {
  const language = String(request.language ?? "en") as Tmw001QuestionStudioLanguage;
  if (!TMW_001_QUESTION_STUDIO_LANGUAGES.includes(language)) {
    throw new Error(`TMW-001 does not support Question Studio language ${language}.`);
  }

  const count = Math.min(1000, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const difficulty = normalizeDifficulty(request.difficulty);
  const explicitCp = String(request.canonicalProblemId ?? "") || undefined;

  if (
    explicitCp
    && !TMW_001_QUESTION_STUDIO_CP_IDS.includes(explicitCp as Tmw001QuestionStudioCpId)
  ) {
    throw new Error(`Unknown canonical problem '${explicitCp}' for package TMW-001.`);
  }

  const inferredCp = inferTmw001QuestionStudioCpFromQl(request.questionLanguageId);
  if (explicitCp && inferredCp && explicitCp !== inferredCp) {
    throw new Error(
      `${String(request.questionLanguageId)} is owned by ${inferredCp}, not ${explicitCp}.`,
    );
  }

  const fixedCp = (explicitCp ?? inferredCp) as Tmw001QuestionStudioCpId | undefined;
  const explicitQl = String(request.questionLanguageId ?? "") || undefined;
  const batchSeed = request.seed
    ?? `quant-v4:TMW-001:${fixedCp ?? "mixed"}:${language}:${Date.now()}`;

  const questionPackages: any[] = [];
  const questions: any[] = [];

  for (let index = 0; index < count; index += 1) {
    if (index > 0 && index % 100 === 0) {
      await new Promise((resolve) => setImmediate(resolve));
    }

    const seed = `${batchSeed}:${fixedCp ?? "mixed"}:${index}`;
    const pkg = runTmw001QuestionStudioPipeline({
      canonicalProblemId: fixedCp,
      questionLanguageId: explicitQl,
      difficulty,
      language,
      seed,
    });

    questionPackages.push(pkg);
    questions.push(
      tmwPreview(pkg, {
        questionIndex: index + 1,
        questionCount: count,
        seed,
      }),
    );
  }

  return {
    generationContext: {
      generationDomain: "quant-v4",
      engineId: "quant-v4",
      seed: batchSeed,
      timestamp: Date.now(),
      runtimeMode: "QUESTION_STUDIO_ACTIVE",
      reviewStatus: TMW_001_FINAL_FREEZE_AUTHORITY.status,
      questionBankStatus: "NOT_STORED",
      questionBankWritable: false,
      testEligibility: "INELIGIBLE",
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      publicReleaseAuthorized: false,
      automaticStudentPublication: false,
      releaseId: "TMW-001-FROZEN-228-MULTILINGUAL-V1",
      sourceAuthorityHead: TMW_001_FINAL_FREEZE_AUTHORITY.sourceAuthorityHead,
      language,
      canonicalProblemId: fixedCp ?? "MIXED",
    },
    questionPackages,
    questions,
  };
}

export function tmw001EnginePackage(): QuestionStudioPackageDefinition {
  return {
    engineId: "quant-v4",
    packageId: "TMW-001",
    subject: "Quantitative Aptitude",
    topic: "Arithmetic",
    subtopic: "Time & Work",
    label: "Time & Work",
    enabled: true,
    cpIds: [...TMW_001_QUESTION_STUDIO_CP_IDS],
    supportedLanguages: [...TMW_001_QUESTION_STUDIO_LANGUAGES],
    supportedDifficulties: ["Easy", "Medium", "Hard"],
    runtimeMode: "QUESTION_STUDIO_ACTIVE",
    supportedRuntimeModes: ["QUESTION_STUDIO_ACTIVE"],
    lifecycleStage: "REVIEW_ONLY",
    reviewSurfaceRequired: true,
    manualApprovalRequired: true,
    questionBankStatus: "NOT_STORED",
    questionBankWritable: false,
    testEligibility: "INELIGIBLE",
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
    productionReleaseAuthorized: false,
    metadata: {
      freezeStatus: TMW_001_FINAL_FREEZE_AUTHORITY.status,
      sourceAuthorityHead: TMW_001_FINAL_FREEZE_AUTHORITY.sourceAuthorityHead,
      qlCount: TMW_001_FINAL_FREEZE_AUTHORITY.qlCount,
      checkpointCount: TMW_001_FINAL_FREEZE_AUTHORITY.checkpointCount,
      auditedPackages: TMW_001_FINAL_FREEZE_AUTHORITY.auditedPackages,
    },
  };
}

export async function generateTmw001EngineBatch(
  request: QuestionStudioGenerationRequest,
): Promise<QuestionStudioGenerationResult | null> {
  if (!isTmw001EngineRequest(request)) return null;

  const generate = () => generateRawTmwBatch(request);
  if (!request.examProfile) return generate();

  return withQuantV4ExamProfileContext(request.examProfile as any, async () => {
    const result = await generate();
    return applyQuantV4ExamProfileDelivery(
      result,
      request as unknown as QuantV4GenerationRequest,
    ) as unknown as QuestionStudioGenerationResult;
  });
}

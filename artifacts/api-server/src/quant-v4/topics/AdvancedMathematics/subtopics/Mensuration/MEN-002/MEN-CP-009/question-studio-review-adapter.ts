import { MEN_CP_009_FROZEN_QLS_V2 } from "./coverage-v2/registry";
import { generateMenCp009QuestionV2 } from "./coverage-v2/runtime";
import { buildMenCp009StudentViewV4Final } from "./coverage-v2/student-view-v4-final";
import { generateMenCp009NativeTeachingV2 } from "./native/runtime-v2";

export const MEN_CP009_QUESTION_STUDIO_PACKAGE_ID = "MEN-002" as const;
export const MEN_CP009_QUESTION_STUDIO_CHECKPOINT_ID = "MEN-CP-009" as const;
export const MEN_CP009_QUESTION_STUDIO_FREEZE_ID =
  "MEN-CP009-TEACHING-V4-MULTILINGUAL-v1-frozen" as const;
export const MEN_CP009_QUESTION_STUDIO_APPROVED_HEAD =
  "26b6d2b8fb4effa33f1e89ba7b555817e5132888" as const;
export const MEN_CP009_QUESTION_STUDIO_ARTIFACT_DIGEST =
  "sha256:599164b47c282aa99218822d3685f8d4cf316b11b258f655b8e057f58febedfc" as const;
export const MEN_CP009_QUESTION_STUDIO_LANGUAGES = ["en", "hi", "pa"] as const;
export const MEN_CP009_QUESTION_STUDIO_DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
export const MEN_CP009_QUESTION_STUDIO_RUNTIME_MODE =
  "MEN-CP-009-MULTILINGUAL-TEACHING-FROZEN-REVIEW-v1" as const;
export const MEN_CP009_QUESTION_STUDIO_REVIEW_STATUS =
  "APPROVED_MULTILINGUAL_TEACHING_FROZEN" as const;

export type MenCp009QuestionStudioLanguage =
  (typeof MEN_CP009_QUESTION_STUDIO_LANGUAGES)[number];
export type MenCp009QuestionStudioDifficulty =
  (typeof MEN_CP009_QUESTION_STUDIO_DIFFICULTIES)[number];
export type MenCp009QuestionStudioQlId =
  (typeof MEN_CP_009_FROZEN_QLS_V2)[number]["qlId"];

export interface MenCp009QuestionStudioReviewRequest {
  language?: MenCp009QuestionStudioLanguage;
  qlId?: MenCp009QuestionStudioQlId;
  difficulty?: MenCp009QuestionStudioDifficulty;
  seed?: string;
  count?: number;
}

export const MEN_CP009_QUESTION_STUDIO_REVIEW_PACKAGE = Object.freeze({
  id: MEN_CP009_QUESTION_STUDIO_PACKAGE_ID,
  packageId: MEN_CP009_QUESTION_STUDIO_PACKAGE_ID,
  type: "quant-v4",
  section: "Quantitative Aptitude",
  domain: "quant",
  topic: "Advanced Mathematics",
  subtopic: "Mensuration",
  chapterId: MEN_CP009_QUESTION_STUDIO_PACKAGE_ID,
  checkpointId: MEN_CP009_QUESTION_STUDIO_CHECKPOINT_ID,
  name: "MEN-002 Mensuration — CP-009 Spheres & Hemispheres",
  label: "Mensuration · CP-009 · 28 Approved QLs",
  generationDomain: "quant-v4",
  qlIds: MEN_CP_009_FROZEN_QLS_V2.map((row) => row.qlId),
  supportedDifficulties: [...MEN_CP009_QUESTION_STUDIO_DIFFICULTIES],
  supportedLanguages: [...MEN_CP009_QUESTION_STUDIO_LANGUAGES],
  enabled: true,
  reviewOnly: true,
  reviewPreviewAvailable: true,
  runtimeMode: MEN_CP009_QUESTION_STUDIO_RUNTIME_MODE,
  reviewStatus: MEN_CP009_QUESTION_STUDIO_REVIEW_STATUS,
  questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY",
  questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED",
  questionBankStatus: "NOT_STORED",
  questionBankWritable: false,
  testEligibility: "INELIGIBLE",
  testEligible: false,
  publiclyPublishable: false,
  mockTestEligible: false,
  persistenceAllowed: true,
  databaseWriteEnabled: true,
  questionStudioVisible: true,
  questionStudioDiscoverable: true,
  questionBankEligible: false,
  manualApprovalRequired: true,
  automaticStudentPublication: false,
  integrationAuthority: MEN_CP009_QUESTION_STUDIO_FREEZE_ID,
  frozenQlCount: MEN_CP_009_FROZEN_QLS_V2.length,
  approvedReviewPayloadCount: 330,
  approvedReviewPayloadCountByLanguage: { en: 110, hi: 110, pa: 110 },
  approvedSourceHead: MEN_CP009_QUESTION_STUDIO_APPROVED_HEAD,
  approvedArtifactDigest: MEN_CP009_QUESTION_STUDIO_ARTIFACT_DIGEST,
  bulkSyncSupported: false,
} as const);

function hashSeed(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function stableQlOrder(qlIds: readonly MenCp009QuestionStudioQlId[], seed: string) {
  return [...qlIds]
    .map((qlId) => ({ qlId, score: hashSeed(`${seed}:${qlId}`) }))
    .sort((left, right) => left.score - right.score || left.qlId.localeCompare(right.qlId))
    .map(({ qlId }) => qlId);
}

function localeForLanguage(language: MenCp009QuestionStudioLanguage) {
  return language === "hi" ? "hi-IN" as const : language === "pa" ? "pa-IN" as const : "en-IN" as const;
}

function sourceView(qlId: MenCp009QuestionStudioQlId, seed: string, language: MenCp009QuestionStudioLanguage) {
  const raw = generateMenCp009QuestionV2(qlId, seed);
  if (language === "en") {
    const view = buildMenCp009StudentViewV4Final(raw);
    return {
      permanentQlId: view.permanentQlId,
      familyId: view.familyId,
      solveMode: view.solveMode,
      seed: view.seed,
      difficulty: view.difficulty as MenCp009QuestionStudioDifficulty,
      target: view.target,
      stem: view.stem,
      options: view.options,
      correctIndex: view.correctIndex,
      answer: view.answer,
      explanationLines: view.explanationLines,
      sourceValidationPassed: view.sourceValidationPassed,
      sourceVerificationPassed: view.sourceVerificationPassed,
      sourceLifecycleLocked: view.lifecycleStatus === "REVIEW_CANDIDATE_NOT_APPROVED",
    } as const;
  }

  const native = generateMenCp009NativeTeachingV2(qlId, seed, language);
  return {
    permanentQlId: native.permanentQlId,
    familyId: native.familyId,
    solveMode: native.solveMode,
    seed: native.seed,
    difficulty: native.difficulty as MenCp009QuestionStudioDifficulty,
    target: native.target,
    stem: native.stem,
    options: native.options,
    correctIndex: native.correctIndex,
    answer: native.answer,
    explanationLines: native.explanationLines,
    sourceValidationPassed: native.sourceValidationPassed,
    sourceVerificationPassed: native.sourceVerificationPassed,
    sourceLifecycleLocked:
      !native.active &&
      !native.questionStudioDiscoverable &&
      native.questionBankStatus === "NOT_STORED" &&
      native.testEligibility === "INELIGIBLE" &&
      !native.publiclyPublishable,
  } as const;
}

function assertApprovedFrozenSource(
  source: ReturnType<typeof sourceView>,
  language: MenCp009QuestionStudioLanguage,
) {
  if (source.options.length !== 4 || new Set(source.options.map((option) => option.display)).size !== 4) {
    throw new Error(`${source.permanentQlId}: approved CP-009 review source must have four distinct options.`);
  }
  if (source.options.filter((option) => option.isCorrect).length !== 1) {
    throw new Error(`${source.permanentQlId}: approved CP-009 review source must have exactly one correct option.`);
  }
  if (!source.options[source.correctIndex]?.isCorrect) {
    throw new Error(`${source.permanentQlId}: approved CP-009 correct-index ownership changed.`);
  }
  if (!source.sourceValidationPassed || !source.sourceVerificationPassed) {
    throw new Error(`${source.permanentQlId}: approved CP-009 source validation/verification failed.`);
  }
  if (!source.sourceLifecycleLocked) {
    throw new Error(`${source.permanentQlId}: source lifecycle must stay inactive below the Question Studio adapter.`);
  }
  if (source.explanationLines.length < 4 || source.explanationLines.length > 5) {
    throw new Error(`${source.permanentQlId}: teaching explanation must retain 4-5 connected steps.`);
  }
  if (!source.explanationLines.some((line) => /[=×÷]|√|∛/u.test(line))) {
    throw new Error(`${source.permanentQlId}: teaching explanation lost visible working.`);
  }
  if (language === "pa") {
    const learnerText = [source.stem, ...source.options.map((option) => option.display), source.answer, ...source.explanationLines].join("\n");
    if (learnerText.includes("ਸਤਹ")) {
      throw new Error(`${source.permanentQlId}: rejected Punjabi spelling 'ਸਤਹ' leaked into approved learner content.`);
    }
  }
}

function toReviewPreview(
  source: ReturnType<typeof sourceView>,
  language: MenCp009QuestionStudioLanguage,
) {
  assertApprovedFrozenSource(source, language);
  const locale = localeForLanguage(language);
  const questionId = [MEN_CP009_QUESTION_STUDIO_CHECKPOINT_ID, source.permanentQlId, locale, source.seed].join(":");
  const explanationId = `${questionId}:EXPLANATION`;

  return Object.freeze({
    archetypeId: MEN_CP009_QUESTION_STUDIO_PACKAGE_ID,
    packageId: MEN_CP009_QUESTION_STUDIO_PACKAGE_ID,
    canonicalProblemId: MEN_CP009_QUESTION_STUDIO_CHECKPOINT_ID,
    qlId: source.permanentQlId,
    questionId,
    canonicalItemId: `${source.permanentQlId}:${source.seed}`,
    questionLanguageId: questionId,
    explanationId,
    language,
    locale,
    difficultyBand: source.difficulty,
    useMode: "GENERATED_MULTILINGUAL_APPROVED_FROZEN_QL" as const,
    sharedPrompt: "",
    stem: source.stem,
    options: source.options.map((option) => option.display),
    optionDetails: source.options.map((option) => Object.freeze({
      label: option.label,
      text: option.display,
      studentExplanation: "",
      isCorrect: option.isCorrect,
      semanticKey: `option-${option.label}`,
    })),
    correctIndex: source.correctIndex,
    answer: source.answer,
    decodedStatements: [] as string[],
    explanation: Object.freeze({
      explanationId,
      whatAsked: source.stem,
      steps: [...source.explanationLines],
      conclusion: source.explanationLines.at(-1) ?? source.answer,
      shortcut: "",
      commonTrap: "",
      optionAnalysis: [] as unknown[],
      familyTree: null,
      diagramProof: null,
    }),
    reasoningGraph: null,
    renderer: Object.freeze({
      kind: "text-math" as const,
      renderingContract: "plain-unicode-math-v1" as const,
      textFallbackAvailable: true as const,
    }),
    runtimeMode: MEN_CP009_QUESTION_STUDIO_RUNTIME_MODE,
    reviewStatus: MEN_CP009_QUESTION_STUDIO_REVIEW_STATUS,
    questionBankStatus: "NOT_STORED" as const,
    questionBankWritable: false as const,
    testEligibility: "INELIGIBLE" as const,
    testEligible: false as const,
    publiclyPublishable: false as const,
    mockTestEligible: false as const,
    manualApprovalRequired: true as const,
    automaticStudentPublication: false as const,
    integrationAuthority: MEN_CP009_QUESTION_STUDIO_FREEZE_ID,
    parameters: Object.freeze({
      chapterId: MEN_CP009_QUESTION_STUDIO_PACKAGE_ID,
      checkpointId: MEN_CP009_QUESTION_STUDIO_CHECKPOINT_ID,
      qlId: source.permanentQlId,
      seed: source.seed,
      familyId: source.familyId,
      solveMode: source.solveMode,
      target: source.target,
      runtimeMode: MEN_CP009_QUESTION_STUDIO_RUNTIME_MODE,
      reviewStatus: MEN_CP009_QUESTION_STUDIO_REVIEW_STATUS,
      integrationAuthority: MEN_CP009_QUESTION_STUDIO_FREEZE_ID,
      questionBankStatus: "NOT_STORED",
      questionBankWritable: false,
      testEligibility: "INELIGIBLE",
      testEligible: false,
      publiclyPublishable: false,
      persistenceAllowed: true,
    }),
    traceability: Object.freeze({
      freezeId: MEN_CP009_QUESTION_STUDIO_FREEZE_ID,
      approvedReviewedHead: MEN_CP009_QUESTION_STUDIO_APPROVED_HEAD,
      artifactDigest: MEN_CP009_QUESTION_STUDIO_ARTIFACT_DIGEST,
      artifactId: 9166092324,
      workflowRunId: 31660721576,
      canonicalQlId: source.permanentQlId,
      language,
    }),
    safety: Object.freeze({
      reviewOnly: true as const,
      questionStudioVisible: true as const,
      questionStudioDiscoverable: true as const,
      persistenceAllowed: true as const,
      questionBankWritable: false as const,
      questionBankEligible: false as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
    }),
    validation: Object.freeze({
      valid: true as const,
      frozenAuthority: true as const,
      fourDistinctOptions: true as const,
      exactlyOneCorrect: true as const,
      teachingStepsPresent: true as const,
      completeCalculation: true as const,
      sourceValidationPassed: true as const,
      sourceVerificationPassed: true as const,
      sourceLifecycleLocked: true as const,
      punjabiSurfaceOrthographyLocked: language !== "pa" || true,
    }),
  });
}

export function previewMenCp009QuestionStudioReview(
  request: MenCp009QuestionStudioReviewRequest = {},
) {
  const language = request.language ?? "en";
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const seed = request.seed?.trim() || [
    MEN_CP009_QUESTION_STUDIO_CHECKPOINT_ID,
    language,
    request.qlId ?? "all-qls",
    request.difficulty ?? "all-difficulties",
  ].join(":");

  const qlIds = MEN_CP_009_FROZEN_QLS_V2.map((row) => row.qlId) as MenCp009QuestionStudioQlId[];
  const eligibleQls = qlIds.filter((qlId) => {
    if (request.qlId && qlId !== request.qlId) return false;
    if (!request.difficulty) return true;
    return sourceView(qlId, `${seed}:difficulty:${qlId}`, "en").difficulty === request.difficulty;
  });
  if (!eligibleQls.length) throw new Error("No approved MEN-CP-009 QLs match the requested filters.");

  const orderedQls = stableQlOrder(eligibleQls, seed);
  const questions: ReturnType<typeof toReviewPreview>[] = [];
  const rounds = Math.max(2, Math.ceil(count / orderedQls.length) + 1);

  for (let round = 0; round < rounds && questions.length < count; round += 1) {
    for (const qlId of orderedQls) {
      const source = sourceView(qlId, `${seed}:${round}:${qlId}`, language);
      if (request.difficulty && source.difficulty !== request.difficulty) continue;
      questions.push(toReviewPreview(source, language));
      if (questions.length >= count) break;
    }
  }

  if (questions.length !== count) {
    throw new Error(`Unable to produce the requested ${count} MEN-CP-009 review question(s).`);
  }

  return Object.freeze({
    generationContext: Object.freeze({
      generationDomain: "quant-v4" as const,
      packageId: MEN_CP009_QUESTION_STUDIO_PACKAGE_ID,
      checkpointId: MEN_CP009_QUESTION_STUDIO_CHECKPOINT_ID,
      seed,
      language,
      locale: localeForLanguage(language),
      runtimeMode: MEN_CP009_QUESTION_STUDIO_RUNTIME_MODE,
      reviewStatus: MEN_CP009_QUESTION_STUDIO_REVIEW_STATUS,
      integrationAuthority: MEN_CP009_QUESTION_STUDIO_FREEZE_ID,
      questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY" as const,
      questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED" as const,
      questionBankStatus: "NOT_STORED" as const,
      questionBankWritable: false as const,
      testEligibility: "INELIGIBLE" as const,
      testEligible: false as const,
      publiclyPublishable: false as const,
      persistenceAllowed: true as const,
      reviewOnly: true as const,
    }),
    questions: Object.freeze(questions),
  });
}

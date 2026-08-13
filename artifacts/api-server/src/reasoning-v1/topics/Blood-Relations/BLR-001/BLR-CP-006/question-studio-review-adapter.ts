import { BLR_CP006_FREEZE_VERSION, type GeneratedBlrCp006Question } from "./cp006-model";
import {
  BLR_CP006_MULTILINGUAL_FREEZE_AUTHORITY,
  generateBlrCp006MultilingualFrozenBank,
  type GeneratedBlrCp006MultilingualFrozenQuestion,
} from "./cp006-multilingual-frozen";
import { generateBlrCp006FrozenBank } from "./cp006-runtime";

export const BLR_CP006_QUESTION_STUDIO_PACKAGE_ID =
  "REASONING_V1_BLR_001_CP_006" as const;
export const BLR_CP006_QUESTION_STUDIO_RUNTIME_MODE =
  "MULTILINGUAL_FROZEN_REVIEW" as const;
export const BLR_CP006_QUESTION_STUDIO_INTEGRATION_STATUS =
  "QUESTION_STUDIO_GENERATION_READY" as const;

export const BLR_CP006_QUESTION_STUDIO_LANGUAGES = ["en", "hi", "pa"] as const;
export const BLR_CP006_QUESTION_STUDIO_QL_IDS = [
  "BLR-QL-026",
  "BLR-QL-027",
  "BLR-QL-028",
  "BLR-QL-029",
  "BLR-QL-030",
] as const;

export type BlrCp006QuestionStudioLanguage =
  (typeof BLR_CP006_QUESTION_STUDIO_LANGUAGES)[number];
export type BlrCp006QuestionStudioQlId =
  (typeof BLR_CP006_QUESTION_STUDIO_QL_IDS)[number];
export type BlrCp006QuestionStudioDifficulty = "Easy" | "Medium" | "Hard";

type FrozenQuestion = GeneratedBlrCp006Question | GeneratedBlrCp006MultilingualFrozenQuestion;

export type BlrCp006QuestionStudioReviewRequest = Readonly<{
  language?: BlrCp006QuestionStudioLanguage;
  qlId?: BlrCp006QuestionStudioQlId;
  difficulty?: BlrCp006QuestionStudioDifficulty;
  canonicalItemId?: string;
  questionLanguageId?: string;
  seed?: string;
  count?: number;
}>;

export const BLR_CP006_QUESTION_STUDIO_REVIEW_PACKAGE = Object.freeze({
  id: BLR_CP006_QUESTION_STUDIO_PACKAGE_ID,
  packageId: BLR_CP006_QUESTION_STUDIO_PACKAGE_ID,
  type: "reasoning-v1",
  section: "Reasoning",
  domain: "reasoning",
  topic: "Blood Relations",
  subtopic: "Coded Blood Relations",
  chapterId: "BLR-001",
  checkpointId: "BLR-CP-006",
  name: "BLR-CP-006 Coded Relation Decoding — Multilingual Frozen",
  label: "Coded Relation Decoding — Multilingual Frozen",
  generationDomain: "reasoning-v1",
  qlIds: [...BLR_CP006_QUESTION_STUDIO_QL_IDS],
  supportedDifficulties: ["Easy", "Medium", "Hard"],
  supportedLanguages: [...BLR_CP006_QUESTION_STUDIO_LANGUAGES],
  frozenRecordCount: 456,
  enabled: false,
  reviewPreviewAvailable: true,
  runtimeMode: BLR_CP006_QUESTION_STUDIO_RUNTIME_MODE,
  supportedRuntimeModes: [BLR_CP006_QUESTION_STUDIO_RUNTIME_MODE],
  integrationStatus: BLR_CP006_QUESTION_STUDIO_INTEGRATION_STATUS,
  corpusAuthority: BLR_CP006_MULTILINGUAL_FREEZE_AUTHORITY,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  persistenceAllowed: false,
  publiclyPublishable: false,
  questionStudioVisible: false,
  questionBankEligible: false,
  mockTestEligible: false,
} as const);

function bankFor(language: BlrCp006QuestionStudioLanguage): readonly FrozenQuestion[] {
  if (language === "en") return generateBlrCp006FrozenBank();
  return generateBlrCp006MultilingualFrozenBank(language === "hi" ? "hi-IN" : "pa-IN");
}

function shortLanguage(question: FrozenQuestion): BlrCp006QuestionStudioLanguage {
  if (question.locale === "en-IN") return "en";
  if (question.locale === "hi-IN") return "hi";
  return "pa";
}

function canonicalItemId(question: FrozenQuestion) {
  return "canonicalItemId" in question ? question.canonicalItemId : question.itemId;
}

function questionLanguageId(question: FrozenQuestion) {
  return "questionLanguageId" in question
    ? question.questionLanguageId
    : `${question.itemId}:en-IN`;
}

function recordAuthority(question: FrozenQuestion) {
  return question.locale === "en-IN"
    ? BLR_CP006_FREEZE_VERSION
    : BLR_CP006_MULTILINGUAL_FREEZE_AUTHORITY;
}

function studioDifficulty(question: FrozenQuestion): BlrCp006QuestionStudioDifficulty {
  const value = String(question.metadata.difficulty).toUpperCase();
  if (value === "EASY") return "Easy";
  if (value === "HARD") return "Hard";
  return "Medium";
}

function hashSeed(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function stableOrder<T>(items: readonly T[], seed: string): T[] {
  return [...items]
    .map((item, index) => ({ item, score: hashSeed(`${seed}:${index}`) }))
    .sort((left, right) => left.score - right.score)
    .map(({ item }) => item);
}

function matchingQuestions(request: BlrCp006QuestionStudioReviewRequest) {
  const language = request.language ?? "en";
  const source = bankFor(language);

  if (request.canonicalItemId || request.questionLanguageId) {
    const forced = source.find((question) =>
      request.canonicalItemId
        ? canonicalItemId(question) === request.canonicalItemId
        : questionLanguageId(question) === request.questionLanguageId,
    );
    if (!forced) {
      throw new Error(
        `Unknown BLR-CP-006 frozen question selector for language '${language}'.`,
      );
    }
    if (request.qlId && forced.qlId !== request.qlId) {
      throw new Error(`${canonicalItemId(forced)} belongs to ${forced.qlId}, not ${request.qlId}.`);
    }
    if (request.difficulty && studioDifficulty(forced) !== request.difficulty) {
      throw new Error(
        `${canonicalItemId(forced)} is ${studioDifficulty(forced)}, not ${request.difficulty}.`,
      );
    }
    return [forced] as const;
  }

  const eligible = source.filter((question) =>
    (!request.qlId || question.qlId === request.qlId) &&
    (!request.difficulty || studioDifficulty(question) === request.difficulty),
  );
  if (!eligible.length) {
    throw new Error("No BLR-CP-006 frozen questions match the Question Studio filters.");
  }
  return eligible;
}

export function toBlrCp006QuestionStudioReviewPreview(question: FrozenQuestion) {
  const language = shortLanguage(question);
  const canonicalId = canonicalItemId(question);
  const languageId = questionLanguageId(question);
  const explanationId = `${languageId}:EXPLANATION`;
  const optionAnalysis = question.explanation.optionAnalysis;
  const validationChecks = [
    {
      name: "frozen-authority",
      passed:
        recordAuthority(question) === BLR_CP006_FREEZE_VERSION ||
        recordAuthority(question) === BLR_CP006_MULTILINGUAL_FREEZE_AUTHORITY,
      message: "Question Studio source is a frozen CP-006 learner-facing authority.",
    },
    {
      name: "single-reviewed-answer",
      passed:
        question.options.length === 4 &&
        question.correctIndex >= 0 &&
        question.correctIndex < question.options.length &&
        question.options.filter((option) => option.isCorrect).length === 1 &&
        question.options[question.correctIndex]?.isCorrect === true,
      message: "Preview retains four options and exactly one reviewed answer.",
    },
    {
      name: "source-release-lock",
      passed:
        question.reviewOnly === true &&
        question.publiclyPublishable === false &&
        question.questionStudioVisible === false &&
        question.questionBankEligible === false &&
        question.mockTestEligible === false,
      message: "The frozen source record remains unchanged; activation occurs only through Question Studio routing.",
    },
  ] as const;

  return {
    archetypeId: BLR_CP006_QUESTION_STUDIO_PACKAGE_ID,
    packageId: BLR_CP006_QUESTION_STUDIO_PACKAGE_ID,
    canonicalProblemId: "BLR-CP-006",
    qlId: question.qlId,
    questionId: `${languageId}:question-studio-review`,
    canonicalItemId: canonicalId,
    questionLanguageId: languageId,
    explanationId,
    language,
    locale: question.locale,
    difficultyBand: studioDifficulty(question),
    useMode: "PRACTICE",
    sharedPrompt: question.sharedPrompt,
    stem: question.stem,
    options: question.options.map((option) => option.text),
    optionDetails: question.options.map((option, index) => ({
      label: ["A", "B", "C", "D"][index],
      text: option.text,
      studentExplanation: optionAnalysis[index]?.explanation ?? "",
      isCorrect: option.isCorrect,
      semanticKey: option.semanticKey,
    })),
    correctIndex: question.correctIndex,
    answer: question.answer,
    decodedStatements: question.decodedStatements,
    explanation: {
      explanationId,
      steps: [
        ...question.explanation.coreConcept,
        ...question.explanation.decodingAudit,
        ...question.explanation.graphAudit,
      ],
      conclusion: question.explanation.conclusion,
      shortcut: question.explanation.examShortcut,
      commonTrap: question.explanation.commonTraps.join(" "),
      optionAnalysis: question.explanation.optionAnalysis,
      familyTree: question.explanation.familyTree,
      diagramProof: {
        codeKey: question.codeKey,
        codedStatements: question.codedStatements,
        decodedStatements: question.decodedStatements,
        graphAudit: question.explanation.graphAudit,
      },
    },
    reasoningGraph: question.graph,
    renderer: {
      kind: "RELATION_GRAPH",
      familyTreeAvailable: true,
      diagramProofAvailable: true,
      textFallbackAvailable: true,
    },
    parameters: {
      chapterId: "BLR-001",
      checkpointId: "BLR-CP-006",
      qlId: question.qlId,
      seed: String(question.seed),
      runtimeMode: BLR_CP006_QUESTION_STUDIO_RUNTIME_MODE,
      reviewStatus: "MULTILINGUAL_FROZEN",
      recordAuthority: recordAuthority(question),
      corpusAuthority: BLR_CP006_MULTILINGUAL_FREEZE_AUTHORITY,
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
      persistenceAllowed: false,
    },
    traceability: {
      itemId: question.itemId,
      canonicalItemId: canonicalId,
      sourcePrototypeId: question.sourcePrototypeId,
      scenarioId: question.scenarioId,
      topologyId: question.topologyId,
      semanticFingerprint: question.metadata.semanticFingerprint,
      solveAuthority: question.solveAuthority,
      recordAuthority: recordAuthority(question),
    },
    safety: {
      integrationStatus: BLR_CP006_QUESTION_STUDIO_INTEGRATION_STATUS,
      reviewOnly: true,
      questionStudioVisible: false,
      persistenceAllowed: false,
      questionBankEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
    },
    validation: {
      valid: validationChecks.every((check) => check.passed),
      checks: validationChecks,
    },
  } as const;
}

export function listBlrCp006QuestionStudioReviewEntries() {
  return BLR_CP006_QUESTION_STUDIO_LANGUAGES.flatMap((language) =>
    bankFor(language).map(toBlrCp006QuestionStudioReviewPreview),
  );
}

export function previewBlrCp006QuestionStudioReview(
  request: BlrCp006QuestionStudioReviewRequest = {},
) {
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const language = request.language ?? "en";
  const eligible = matchingQuestions({ ...request, language });
  const seed = request.seed ?? [
    BLR_CP006_QUESTION_STUDIO_PACKAGE_ID,
    language,
    request.qlId ?? "all-qls",
    request.difficulty ?? "all-difficulties",
    request.canonicalItemId ?? request.questionLanguageId ?? "mixed",
  ].join(":");
  const ordered = stableOrder(eligible, seed);
  const selected = Array.from({ length: count }, (_, index) =>
    ordered[index % ordered.length]!,
  );

  return {
    generationContext: {
      generationDomain: "reasoning-v1",
      packageId: BLR_CP006_QUESTION_STUDIO_PACKAGE_ID,
      seed,
      runtimeMode: BLR_CP006_QUESTION_STUDIO_RUNTIME_MODE,
      integrationStatus: BLR_CP006_QUESTION_STUDIO_INTEGRATION_STATUS,
      reviewStatus: "MULTILINGUAL_FROZEN",
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
      persistenceAllowed: false,
    },
    questions: selected.map(toBlrCp006QuestionStudioReviewPreview),
  } as const;
}

export function assertBlrCp006QuestionStudioPersistenceAllowed(): never {
  throw new Error(
    "BLR-CP-006 frozen-source adapter does not persist directly; Question Studio routing owns generation-run persistence.",
  );
}

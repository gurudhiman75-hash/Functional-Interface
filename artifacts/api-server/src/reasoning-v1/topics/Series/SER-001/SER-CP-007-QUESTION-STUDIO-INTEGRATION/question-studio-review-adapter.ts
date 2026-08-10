import {
  SER_CP007_FROZEN_TEMPLATE_AUTHORITIES,
  type SerCp007FrozenTemplateAuthority,
} from "../SER-CP-007-ENGLISH-FREEZE/ser-cp-007-english-freeze-authority";
import {
  SER_CP007_PERMANENT_QL_IDS,
  type SerCp007PermanentQlId,
} from "../SER-PERMANENT-QL-REGISTRY";
import {
  generateSerCp007QuestionStudioReview,
  SER_CP007_QUESTION_STUDIO_REVIEW_STATUS,
  SER_CP007_QUESTION_STUDIO_RUNTIME_AUTHORITY,
  SER_CP007_QUESTION_STUDIO_RUNTIME_MODE,
} from "./ser-cp-007-question-studio-runtime";

export const SER_001_PACKAGE_ID = "SER-001" as const;
export const SER_001_QUESTION_STUDIO_LANGUAGES = ["en", "hi", "pa"] as const;
export const SER_001_QUESTION_STUDIO_DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;

export type Ser001QuestionStudioLanguage =
  (typeof SER_001_QUESTION_STUDIO_LANGUAGES)[number];
export type Ser001QuestionStudioDifficulty =
  (typeof SER_001_QUESTION_STUDIO_DIFFICULTIES)[number];

export type Ser001QuestionStudioReviewRequest = Readonly<{
  language?: Ser001QuestionStudioLanguage;
  qlId?: SerCp007PermanentQlId;
  difficulty?: Ser001QuestionStudioDifficulty;
  seed?: string;
  count?: number;
}>;

export const SER_001_QUESTION_STUDIO_REVIEW_PACKAGE = Object.freeze({
  id: SER_001_PACKAGE_ID,
  packageId: SER_001_PACKAGE_ID,
  type: "reasoning-v1",
  section: "Reasoning",
  domain: "reasoning",
  topic: "Reasoning",
  subtopic: "Series",
  chapterId: "SER-001",
  checkpointId: "SER-CP-007",
  name: "SER-001 Series — Multilingual Frozen Review",
  label: "Series — 140 Frozen Templates",
  generationDomain: "reasoning-v1",
  qlIds: [...SER_CP007_PERMANENT_QL_IDS],
  supportedDifficulties: [...SER_001_QUESTION_STUDIO_DIFFICULTIES],
  supportedLanguages: [...SER_001_QUESTION_STUDIO_LANGUAGES],
  enabled: true,
  reviewOnly: true,
  reviewPreviewAvailable: true,
  runtimeMode: SER_CP007_QUESTION_STUDIO_RUNTIME_MODE,
  reviewStatus: SER_CP007_QUESTION_STUDIO_REVIEW_STATUS,
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
  integrationAuthority: SER_CP007_QUESTION_STUDIO_RUNTIME_AUTHORITY,
  frozenTemplateCount: SER_CP007_FROZEN_TEMPLATE_AUTHORITIES.length,
  multilingualProofPayloadCount:
    SER_CP007_FROZEN_TEMPLATE_AUTHORITIES.length * SER_001_QUESTION_STUDIO_LANGUAGES.length,
  bulkSyncSupported: false,
} as const);

function localeForLanguage(language: Ser001QuestionStudioLanguage) {
  if (language === "hi") return "hi-IN" as const;
  if (language === "pa") return "pa-IN" as const;
  return "en-IN" as const;
}

function studioDifficulty(value: string): Ser001QuestionStudioDifficulty {
  const normalized = value.trim().toLowerCase();
  if (normalized === "easy") return "Easy";
  if (normalized === "hard") return "Hard";
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

function positiveSeed(value: string) {
  return (hashSeed(value) % 2_147_483_646) + 1;
}

function stableAuthorityOrder(
  authorities: readonly SerCp007FrozenTemplateAuthority[],
  seed: string,
) {
  return [...authorities]
    .map((authority) => ({
      authority,
      score: hashSeed(`${seed}:${authority.temporaryTemplateId}`),
    }))
    .sort((left, right) =>
      left.score - right.score ||
      left.authority.temporaryTemplateId.localeCompare(right.authority.temporaryTemplateId),
    )
    .map(({ authority }) => authority);
}

function toReviewPreview(
  source: ReturnType<typeof generateSerCp007QuestionStudioReview>,
) {
  const difficultyBand = studioDifficulty(source.difficultyLabel);
  const explanationId = `${source.questionId}:EXPLANATION`;

  return {
    archetypeId: SER_001_PACKAGE_ID,
    packageId: SER_001_PACKAGE_ID,
    canonicalProblemId: source.canonicalProblemId,
    qlId: source.permanentQlId,
    questionId: source.questionId,
    canonicalItemId: `${source.temporaryTemplateId}:${source.seed}`,
    questionLanguageId: source.questionId,
    explanationId,
    language: source.language,
    locale: source.locale,
    difficultyBand,
    useMode: "GENERATED_FROZEN_TEMPLATE",
    sharedPrompt: "",
    stem: source.stem,
    options: [...source.options],
    optionDetails: source.options.map((option, optionIndex) => ({
      label: ["A", "B", "C", "D"][optionIndex] ?? String(optionIndex + 1),
      text: option,
      studentExplanation: "",
      isCorrect: optionIndex === source.correctIndex,
      semanticKey: `option-${optionIndex + 1}`,
    })),
    correctIndex: source.correctIndex,
    answer: source.answer,
    decodedStatements: [] as string[],
    explanation: {
      explanationId,
      steps: [source.explanation],
      conclusion: source.answer,
      shortcut: "",
      commonTrap: "",
      optionAnalysis: [] as unknown[],
      familyTree: null,
      diagramProof: null,
    },
    reasoningGraph: null,
    renderer: {
      kind: source.learnerRenderer,
      renderingContract: source.renderingContract,
      textFallbackAvailable: true,
    },
    runtimeMode: source.runtimeMode,
    reviewStatus: source.reviewStatus,
    questionBankStatus: source.questionBankStatus,
    questionBankWritable: source.questionBankWritable,
    testEligibility: source.testEligibility,
    testEligible: source.testEligible,
    publiclyPublishable: source.publiclyPublishable,
    mockTestEligible: false as const,
    manualApprovalRequired: true as const,
    automaticStudentPublication: false as const,
    integrationAuthority: source.integrationAuthority,
    parameters: {
      chapterId: SER_001_PACKAGE_ID,
      checkpointId: source.canonicalProblemId,
      qlId: source.permanentQlId,
      temporaryTemplateId: source.temporaryTemplateId,
      seed: String(source.seed),
      runtimeMode: source.runtimeMode,
      reviewStatus: source.reviewStatus,
      integrationAuthority: source.integrationAuthority,
      questionBankStatus: source.questionBankStatus,
      questionBankWritable: source.questionBankWritable,
      testEligibility: source.testEligibility,
      testEligible: source.testEligible,
      publiclyPublishable: source.publiclyPublishable,
      persistenceAllowed: true as const,
    },
    traceability: source.traceability,
    safety: {
      reviewOnly: true as const,
      questionStudioVisible: true as const,
      persistenceAllowed: true as const,
      questionBankWritable: false as const,
      questionBankEligible: false as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
    },
    validation: source.validation,
  } as const;
}

export function previewSer001QuestionStudioReview(
  request: Ser001QuestionStudioReviewRequest = {},
) {
  const language = request.language ?? "en";
  const locale = localeForLanguage(language);
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const seed = request.seed?.trim() || [
    SER_001_PACKAGE_ID,
    language,
    request.qlId ?? "all-qls",
    request.difficulty ?? "all-difficulties",
  ].join(":");

  const eligibleAuthorities = SER_CP007_FROZEN_TEMPLATE_AUTHORITIES.filter(
    (authority) => !request.qlId || authority.permanentQlId === request.qlId,
  );
  if (!eligibleAuthorities.length) {
    throw new Error(`No frozen Series templates match QL '${request.qlId ?? "unknown"}'.`);
  }

  const orderedAuthorities = stableAuthorityOrder(eligibleAuthorities, seed);
  const questions: ReturnType<typeof toReviewPreview>[] = [];
  const maxRounds = Math.max(12, Math.ceil(count / orderedAuthorities.length) * 8);

  for (let round = 0; round < maxRounds && questions.length < count; round += 1) {
    for (const authority of orderedAuthorities) {
      const numericSeed = positiveSeed(`${seed}:${round}:${authority.temporaryTemplateId}`);
      const generated = generateSerCp007QuestionStudioReview({
        temporaryTemplateId: authority.temporaryTemplateId,
        seed: numericSeed,
        locale,
      });
      if (request.difficulty && studioDifficulty(generated.difficultyLabel) !== request.difficulty) {
        continue;
      }
      questions.push(toReviewPreview(generated));
      if (questions.length >= count) break;
    }
  }

  if (!questions.length) {
    throw new Error(
      `No frozen Series questions match difficulty '${request.difficulty ?? "requested"}' for the selected QL.`,
    );
  }

  return {
    generationContext: {
      generationDomain: "reasoning-v1" as const,
      packageId: SER_001_PACKAGE_ID,
      seed,
      language,
      locale,
      runtimeMode: SER_CP007_QUESTION_STUDIO_RUNTIME_MODE,
      reviewStatus: SER_CP007_QUESTION_STUDIO_REVIEW_STATUS,
      integrationAuthority: SER_CP007_QUESTION_STUDIO_RUNTIME_AUTHORITY,
      questionBankStatus: "NOT_STORED" as const,
      questionBankWritable: false as const,
      testEligibility: "INELIGIBLE" as const,
      testEligible: false as const,
      publiclyPublishable: false as const,
      persistenceAllowed: true as const,
      reviewOnly: true as const,
    },
    questions,
  } as const;
}

export type QuestionStudioEngineId =
  | "quant-v4"
  | "language-v1"
  | "knowledge-v1";

export type QuestionStudioDifficulty = "Easy" | "Medium" | "Hard";
export type QuestionStudioLanguage = "en" | "hi" | "pa";
export type QuestionStudioLifecycleStage = "REVIEW_ONLY" | "BANK_ONLY";

export type QuestionStudioPackageDefinition = {
  engineId: QuestionStudioEngineId;
  packageId: string;
  subject?: string;
  topic: string;
  subtopic: string;
  label: string;
  enabled: boolean;
  cpIds: string[];
  supportedLanguages: QuestionStudioLanguage[];
  supportedDifficulties?: QuestionStudioDifficulty[];
  difficultyFilterSupported?: boolean;
  runtimeMode?: string;
  supportedRuntimeModes?: string[];
  dynamicCandidateCpIds?: string[];
  lifecycleId?: string;
  lifecycleStage?: QuestionStudioLifecycleStage;
  reviewSurfaceRequired?: boolean;
  manualApprovalRequired?: boolean;
  questionBankStatus?: string;
  questionBankWritable?: boolean;
  questionBankAcceptanceMode?: "BANK_ONLY" | "FULL_RELEASE";
  questionBankAcceptanceAuthority?: string | null;
  testEligibility?: string;
  testEligible?: boolean;
  mockTestEligible?: boolean;
  publiclyPublishable?: boolean;
  automaticStudentPublication?: boolean;
  productionReleaseAuthorized?: boolean;
  metadata?: Record<string, unknown>;
};

export type QuestionStudioGenerationRequest = {
  engineId?: QuestionStudioEngineId;
  exam?: string;
  subject?: string;
  difficulty?: QuestionStudioDifficulty | "Mixed" | string;
  count?: number;
  packageId?: string;
  patternId?: string;
  topic?: string;
  subtopic?: string;
  language?: QuestionStudioLanguage;
  seed?: string;
  runtimeMode?: string;
  canonicalProblemId?: string;
  questionLanguageId?: string;
};

export type QuestionStudioGeneratedQuestion = Record<string, unknown> & {
  questionId?: string;
  text?: string;
  stem?: string;
  options?: unknown[];
  correct?: number;
  correctIndex?: number;
  explanation?: string;
  difficulty?: string;
  difficultyLabel?: string;
  packageId?: string;
  patternId?: string;
  qlId?: string;
  language?: string;
};

export type QuestionStudioGenerationResult = {
  questions: QuestionStudioGeneratedQuestion[];
  generationContext?: Record<string, unknown>;
  [key: string]: unknown;
};

export interface QuestionStudioEngineAdapter {
  readonly engineId: QuestionStudioEngineId;
  listPackages(): QuestionStudioPackageDefinition[];
  generate(
    request: QuestionStudioGenerationRequest,
  ): Promise<QuestionStudioGenerationResult>;
}

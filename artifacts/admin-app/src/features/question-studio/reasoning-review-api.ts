import { adminRequest } from '@/lib/admin-request';

export type ReasoningReviewLanguage = 'en' | 'hi' | 'pa';
export type ReasoningReviewDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface ReasoningReviewPackage {
  packageId: string;
  label: string;
  topic: string;
  subtopic: string;
  qlIds: string[];
  supportedLanguages: ReasoningReviewLanguage[];
  supportedDifficulties: ReasoningReviewDifficulty[];
  runtimeMode: string;
  reviewOnly: true;
  adminReviewVisible: true;
  persistenceAllowed: false;
  databaseWriteEnabled: false;
  questionBankEligible: false;
  mockTestEligible: false;
  publiclyPublishable: false;
}

export interface ReasoningReviewPackagesResponse {
  generationSystem: 'reasoning-v1';
  activationMode: 'ADMIN_READ_ONLY';
  packages: ReasoningReviewPackage[];
  maxPreviewSize: number;
  databaseWriteEnabled: false;
  persistenceAllowed: false;
}

export interface ReasoningReviewOptionDetail {
  label: string;
  text: string;
  studentExplanation: string;
  isCorrect: boolean;
  semanticKey: string;
}

export interface ReasoningReviewQuestion {
  questionId: string;
  canonicalItemId: string;
  questionLanguageId: string;
  qlId: string;
  language: ReasoningReviewLanguage;
  locale: string;
  difficultyBand: ReasoningReviewDifficulty;
  useMode: string;
  sharedPrompt: string;
  stem: string;
  options: string[];
  optionDetails: ReasoningReviewOptionDetail[];
  correctIndex: number;
  answer: string;
  decodedStatements: string[];
  explanation: {
    steps: string[];
    conclusion: string;
    shortcut: string;
    commonTrap: string;
    optionAnalysis: unknown;
    familyTree: unknown;
    diagramProof: unknown;
  };
  reasoningGraph: unknown;
  traceability: Record<string, unknown>;
  safety: {
    reviewOnly: true;
    questionStudioVisible: false;
    persistenceAllowed: false;
    questionBankEligible: false;
    mockTestEligible: false;
    publiclyPublishable: false;
  };
  validation: {
    valid: boolean;
    checks: Array<{ name: string; passed: boolean; message: string }>;
  };
}

export interface ReasoningReviewPreviewResponse {
  generationContext: Record<string, unknown>;
  questions: ReasoningReviewQuestion[];
  activation: {
    mode: 'ADMIN_READ_ONLY';
    databaseWriteEnabled: false;
    persistenceAllowed: false;
    questionBankEligible: false;
    mockTestEligible: false;
    publiclyPublishable: false;
  };
}

export interface ReasoningReviewPreviewInput {
  packageId: string;
  language: ReasoningReviewLanguage;
  qlId?: string;
  difficulty?: ReasoningReviewDifficulty;
  count: number;
  seed?: string;
}

export function getReasoningReviewPackages() {
  return adminRequest<ReasoningReviewPackagesResponse>(
    '/admin/question-studio/reasoning-review/packages',
    undefined,
    { fallbackMessage: 'Unable to load Reasoning review packages.' },
  );
}

export function previewReasoningReview(input: ReasoningReviewPreviewInput) {
  const params = new URLSearchParams({
    packageId: input.packageId,
    language: input.language,
    count: String(input.count),
  });
  if (input.qlId) params.set('qlId', input.qlId);
  if (input.difficulty) params.set('difficulty', input.difficulty);
  if (input.seed?.trim()) params.set('seed', input.seed.trim());

  return adminRequest<ReasoningReviewPreviewResponse>(
    `/admin/question-studio/reasoning-review/preview?${params.toString()}`,
    undefined,
    { fallbackMessage: 'Unable to preview frozen Reasoning questions.' },
  );
}

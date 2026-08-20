import { adminRequest } from '@/lib/admin-request';

export type InterestCp007ReviewLanguage = 'en' | 'hi' | 'pa';
export type InterestCp007ReviewDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface InterestCp007ReviewQuestion {
  questionId: string;
  canonicalItemId: string;
  questionLanguageId: string;
  qlId: string;
  language: InterestCp007ReviewLanguage;
  locale: string;
  difficultyBand: InterestCp007ReviewDifficulty;
  stem: string;
  options: string[];
  optionDetails: Array<{
    label: string;
    text: string;
    studentExplanation: string;
    isCorrect: boolean;
    semanticKey: string;
  }>;
  correctIndex: number;
  answer: string;
  explanation: {
    explanationId: string;
    whatAsked: string;
    keyIdea: string;
    steps: string[];
    conclusion: string;
    shortcut: string;
    commonTrap: string;
  };
  renderer: {
    kind: string;
    renderingContract: string;
    textFallbackAvailable: boolean;
  };
  runtimeMode: string;
  reviewStatus: string;
  integrationAuthority: string;
  sourceFreezeId: string;
  sourceApprovalAuthority: string;
  validation: {
    valid: boolean;
    frozenAuthority: boolean;
    learnerPayloadPreserved: boolean;
    latexPreserved: boolean;
    sourceLifecycleLocked: boolean;
    blockedCiDefinitionAbsent: boolean;
    deprecatedPunjabiCiAbsent: boolean;
  };
}

export interface InterestCp007ReviewPackage {
  packageId: 'INT-001';
  checkpointId: 'INT-CP-007';
  label: string;
  topic: string;
  subtopic: string;
  qlIds: string[];
  supportedLanguages: InterestCp007ReviewLanguage[];
  supportedDifficulties: InterestCp007ReviewDifficulty[];
  runtimeMode: string;
  reviewStatus: string;
  questionStudioRegistrationStatus: 'REGISTERED_REVIEW_ONLY';
  questionStudioStagingStatus: 'REVIEW_QUEUE_ENABLED';
  integrationAuthority: string;
  englishFreezeId: string;
  localizedFreezeId: string;
  frozenQlCount: number;
  reviewOnly: true;
  questionBankStatus: 'NOT_STORED';
  questionBankWritable: false;
  testEligible: false;
  publiclyPublishable: false;
  bulkSyncSupported: false;
}

export interface InterestCp007ReviewInput {
  language: InterestCp007ReviewLanguage;
  qlId?: string;
  difficulty?: InterestCp007ReviewDifficulty;
  count: number;
  seed?: string;
}

export interface InterestCp007ReviewStatus {
  packageId: 'INT-001';
  checkpointId: 'INT-CP-007';
  permanentQlCount: number;
  generationItemCount: number;
  approvedItemCount: number;
  questionBankCount: number;
  integrationAuthority: string;
  questionStudioRegistrationStatus: 'REGISTERED_REVIEW_ONLY';
  questionStudioStagingStatus: 'REVIEW_QUEUE_ENABLED';
  reviewOnly: true;
  questionBankWritable: false;
  testEligible: false;
  publiclyPublishable: false;
  automaticStudentPublication: false;
}

export interface InterestCp007ReviewRunResult {
  id: string | null;
  publicCode: string | null;
  status: string;
  itemCount: number;
  generationSystem: 'quant-v4';
  packageId: 'INT-001';
  checkpointId: 'INT-CP-007';
  reviewOnly: true;
  questionBankWritable: false;
  testEligible: false;
  publiclyPublishable: false;
}

function paramsFor(input: InterestCp007ReviewInput) {
  const params = new URLSearchParams({
    language: input.language,
    count: String(input.count),
  });
  if (input.qlId) params.set('qlId', input.qlId);
  if (input.difficulty) params.set('difficulty', input.difficulty);
  if (input.seed?.trim()) params.set('seed', input.seed.trim());
  return params;
}

export function getInterestCp007ReviewPackage() {
  return adminRequest<{
    generationSystem: 'quant-v4';
    activationMode: 'REVIEW_ONLY';
    package: InterestCp007ReviewPackage;
    maxBatchSize: number;
    permanentQlCount: number;
    supportedLanguages: InterestCp007ReviewLanguage[];
    databaseWriteEnabled: true;
    persistenceAllowed: true;
    questionStudioRegistrationStatus: 'REGISTERED_REVIEW_ONLY';
    questionStudioStagingStatus: 'REVIEW_QUEUE_ENABLED';
    questionBankWriteEnabled: false;
    testEligible: false;
    publiclyPublishable: false;
    bulkSyncSupported: false;
  }>(
    '/admin/question-studio/quant/interest/cp007/package',
    undefined,
    { fallbackMessage: 'Unable to load the Interest CP-007 review package.' },
  );
}

export function previewInterestCp007Review(input: InterestCp007ReviewInput) {
  return adminRequest<{
    questions: InterestCp007ReviewQuestion[];
    productionEligible: false;
    reviewOnly: true;
    integrationAuthority: string;
  }>(
    `/admin/question-studio/quant/interest/cp007/preview?${paramsFor(input).toString()}`,
    undefined,
    { fallbackMessage: 'Unable to preview Interest CP-007 questions.' },
  );
}

export function createInterestCp007ReviewRun(input: InterestCp007ReviewInput) {
  return adminRequest<InterestCp007ReviewRunResult>(
    '/admin/question-studio/quant/interest/cp007/runs',
    { method: 'POST', body: JSON.stringify(input) },
    { fallbackMessage: 'Unable to create the Interest CP-007 review run.' },
  );
}

export function getInterestCp007ReviewStatus() {
  return adminRequest<InterestCp007ReviewStatus>(
    '/admin/question-studio/quant/interest/cp007/status',
    undefined,
    { fallbackMessage: 'Unable to load Interest CP-007 review status.' },
  );
}

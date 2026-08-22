import { adminRequest } from '@/lib/admin-request';

export type DsfReviewLanguage = 'en';
export type DsfReviewDifficulty = 'Easy' | 'Medium' | 'Hard';
export type DsfReviewDomain = 'NUMBER_SYSTEM' | 'RATIO_PROPORTION' | 'PERCENTAGE' | 'ALGEBRA';
export type DsfReviewAnswerProfile = 'GENERIC_DS_STANDARD_5_EN';
export type DsfReviewSemanticClass =
  | 'STATEMENT_I_ONLY'
  | 'STATEMENT_II_ONLY'
  | 'EACH_STATEMENT_ALONE'
  | 'BOTH_TOGETHER_ONLY'
  | 'INSUFFICIENT_EVEN_TOGETHER';

export interface DsfReviewDomainDefinition {
  id: DsfReviewDomain;
  label: string;
  sourceChapterId: string;
  solveModes: string[];
}

export interface DsfReviewQuestion {
  packageId: 'DSF-001';
  sourceCheckpointId: 'DSF-CP-001';
  integrationCheckpointId: 'DSF-CP-002';
  qlId: 'DSF-QL-001';
  questionId: string;
  language: DsfReviewLanguage;
  locale: 'en-IN';
  answerProfile: DsfReviewAnswerProfile;
  domain: DsfReviewDomain;
  domainLabel: string;
  sourceChapterId: string;
  solveModeId: string;
  targetKind: string;
  difficulty: DsfReviewDifficulty;
  seed: number;
  stem: string;
  questionPrompt: string;
  statements: [
    { id: 'I'; text: string },
    { id: 'II'; text: string },
  ];
  options: Array<{
    key: 'A' | 'B' | 'C' | 'D' | 'E';
    value: string;
    semanticClass: DsfReviewSemanticClass;
    isCorrect: boolean;
  }>;
  correctIndex: number;
  canonicalAnswer: DsfReviewSemanticClass;
  explanation: {
    askedTarget: string;
    statementI: string;
    statementII: string;
    together?: string;
    conclusion: string;
    steps: string[];
  };
  sourceGenerationIdentity: string;
  integrationAuthority: string;
  sourceFreezeAuthority: string;
  validation: {
    valid: true;
    sourceFrozen: true;
    sourceValidated: true;
    exactlyOneCorrect: true;
    standardFiveOptionContract: true;
    qlIdentityPreserved: true;
    questionBankLocked: true;
    testMockLocked: true;
    publicationLocked: true;
  };
  lifecycle: {
    questionStudioDiscoverable: true;
    persistenceAllowed: true;
    reviewOnly: true;
    questionBankStatus: 'NOT_STORED';
    questionBankWritable: false;
    testEligibility: 'INELIGIBLE';
    testEligible: false;
    mockTestEligible: false;
    publiclyPublishable: false;
    manualApprovalRequired: true;
    automaticStudentPublication: false;
  };
}

export interface DsfReviewPackage {
  packageId: 'DATA_SUFFICIENCY';
  label: string;
  integrationAuthority: string;
  sourceFreezeAuthority: string;
  sourceCheckpointId: 'DSF-CP-001';
  integrationCheckpointId: 'DSF-CP-002';
  permanentQlIds: ['DSF-QL-001'];
  nextAvailableQlId: 'DSF-QL-002';
  domains: DsfReviewDomainDefinition[];
  solveModeCount: 8;
  supportedSemanticClasses: DsfReviewSemanticClass[];
  supportedDifficulties: DsfReviewDifficulty[];
  supportedLanguages: DsfReviewLanguage[];
  supportedAnswerProfiles: DsfReviewAnswerProfile[];
  defaultAnswerProfile: DsfReviewAnswerProfile;
  examSpecificAnswerProfilesImplemented: false;
  runtimeMode: string;
  reviewStatus: string;
  questionStudioDiscoverable: true;
  persistenceAllowed: true;
  reviewOnly: true;
  questionBankStatus: 'NOT_STORED';
  questionBankWritable: false;
  testEligibility: 'INELIGIBLE';
  testEligible: false;
  mockTestEligible: false;
  publiclyPublishable: false;
}

export interface DsfReviewInput {
  language?: DsfReviewLanguage;
  answerProfile?: DsfReviewAnswerProfile;
  domain?: DsfReviewDomain;
  solveMode?: string;
  semanticClass?: DsfReviewSemanticClass;
  difficulty?: DsfReviewDifficulty;
  count: number;
  seed?: string;
}

export interface DsfReviewStatus {
  chapter: 'Data Sufficiency';
  permanentQlCount: number;
  domainCount: number;
  solveModeCount: number;
  generationItemCount: number;
  approvedItemCount: number;
  questionBankCount: number;
  integrationAuthority: string;
  sourceFreezeAuthority: string;
  supportedLanguages: DsfReviewLanguage[];
  supportedAnswerProfiles: DsfReviewAnswerProfile[];
  examSpecificAnswerProfilesImplemented: false;
  questionStudioDiscoverable: true;
  persistenceAllowed: true;
  reviewOnly: true;
  questionBankWritable: false;
  testEligible: false;
  mockTestEligible: false;
  publiclyPublishable: false;
}

function paramsFor(input: DsfReviewInput) {
  const params = new URLSearchParams({
    language: input.language ?? 'en',
    answerProfile: input.answerProfile ?? 'GENERIC_DS_STANDARD_5_EN',
    count: String(input.count),
  });
  if (input.domain) params.set('domain', input.domain);
  if (input.solveMode) params.set('solveMode', input.solveMode);
  if (input.semanticClass) params.set('semanticClass', input.semanticClass);
  if (input.difficulty) params.set('difficulty', input.difficulty);
  if (input.seed?.trim()) params.set('seed', input.seed.trim());
  return params;
}

export function getDsfReviewPackage() {
  return adminRequest<{
    generationSystem: 'reasoning-v1';
    activationMode: 'QUESTION_STUDIO_CONNECTED';
    package: DsfReviewPackage;
    maxBatchSize: number;
    reviewOnly: true;
    questionBankWriteEnabled: false;
  }>('/admin/question-studio/reasoning/data-sufficiency/package', undefined, {
    fallbackMessage: 'Unable to load the Data Sufficiency Question Studio package.',
  });
}

export function previewDsfReview(input: DsfReviewInput) {
  return adminRequest<{
    questionCount: number;
    questions: DsfReviewQuestion[];
    productionEligible: false;
    reviewOnly: true;
    questionBankWritable: false;
    testEligible: false;
    mockTestEligible: false;
    publiclyPublishable: false;
  }>(`/admin/question-studio/reasoning/data-sufficiency/preview?${paramsFor(input).toString()}`, undefined, {
    fallbackMessage: 'Unable to preview Data Sufficiency questions.',
  });
}

export function createDsfReviewRun(input: DsfReviewInput) {
  return adminRequest<{
    id: string;
    publicCode: string;
    status: 'review';
    itemCount: number;
    generationSystem: 'reasoning-v1';
    chapter: 'Data Sufficiency';
    language: DsfReviewLanguage;
    answerProfile: DsfReviewAnswerProfile;
    reviewOnly: true;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
  }>('/admin/question-studio/reasoning/data-sufficiency/runs', {
    method: 'POST',
    body: JSON.stringify({
      ...input,
      language: input.language ?? 'en',
      answerProfile: input.answerProfile ?? 'GENERIC_DS_STANDARD_5_EN',
    }),
  }, { fallbackMessage: 'Unable to create a Data Sufficiency Question Studio review run.' });
}

export function getDsfReviewStatus() {
  return adminRequest<DsfReviewStatus>(
    '/admin/question-studio/reasoning/data-sufficiency/status',
    undefined,
    { fallbackMessage: 'Unable to load Data Sufficiency Question Studio status.' },
  );
}

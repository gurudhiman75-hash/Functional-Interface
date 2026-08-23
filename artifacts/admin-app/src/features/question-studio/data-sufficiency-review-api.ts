import { adminRequest } from '@/lib/admin-request';

export type DsfReviewLanguage = 'en';
export type DsfReviewDifficulty = 'Easy' | 'Medium' | 'Hard';
export type DsfReviewDomain = 'NUMBER_SYSTEM' | 'RATIO_PROPORTION' | 'PERCENTAGE' | 'ALGEBRA';
export type DsfReviewAnswerProfile =
  | 'GENERIC_DS_STANDARD_5_EN'
  | 'BANKING_STANDARD_5_EN'
  | 'BANKING_BOB_2015_5_EN'
  | 'SSC_CGL_TIER2_2023_4_EN'
  | 'SSC_CGL_TIER2_2024_4_EN';
export type DsfReviewExamFamily = 'GENERIC' | 'BANKING' | 'SSC';
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

export interface DsfReviewAnswerProfileDefinition {
  id: DsfReviewAnswerProfile;
  label: string;
  examFamily: DsfReviewExamFamily;
  optionCount: 4 | 5;
  semanticOrder: DsfReviewSemanticClass[];
  representedSemanticClasses: DsfReviewSemanticClass[];
  omittedSemanticClasses: DsfReviewSemanticClass[];
  evidenceLevel: string;
  sourcePatternIds: string[];
  evidenceNote: string;
  enabledInQuestionStudio: true;
  studentPublicationEligible: false;
}

export interface DsfReviewQuestion {
  packageId: 'DSF-001';
  sourceCheckpointId: 'DSF-CP-001';
  integrationCheckpointId: 'DSF-CP-002';
  profileCheckpointId: 'DSF-CP-003';
  qlId: 'DSF-QL-001';
  questionId: string;
  sourceQuestionId: string;
  language: DsfReviewLanguage;
  locale: 'en-IN';
  answerProfile: DsfReviewAnswerProfile;
  examFamily: DsfReviewExamFamily;
  profileEvidenceLevel: string;
  profileSourcePatternIds: string[];
  profileRepresentedSemanticClasses: DsfReviewSemanticClass[];
  profileOmittedSemanticClasses: DsfReviewSemanticClass[];
  domain: DsfReviewDomain;
  domainLabel: string;
  sourceChapterId: string;
  solveModeId: string;
  targetKind: string;
  difficulty: DsfReviewDifficulty;
  seed: number;
  stem: string;
  questionPrompt: string;
  statements: [{ id: 'I'; text: string }, { id: 'II'; text: string }];
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
  deliveryProfileAuthority: string;
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
    profileRepresentable: true;
    semanticTruthPreserved: true;
    optionOrderMatchesProfile: true;
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
  profileCheckpointId: 'DSF-CP-003';
  profileDeliveryAuthority: string;
  questionBankAcceptanceCheckpointId: 'DSF-CP-004';
  questionBankAcceptanceAuthority: string;
  testReleaseCheckpointId: 'DSF-CP-005';
  testReleaseAuthority: string;
  mockTestReleaseCheckpointId: 'DSF-CP-006';
  mockTestReleaseAuthority: string;
  permanentQlIds: ['DSF-QL-001'];
  nextAvailableQlId: 'DSF-QL-002';
  domains: DsfReviewDomainDefinition[];
  solveModeCount: 8;
  supportedSemanticClasses: DsfReviewSemanticClass[];
  supportedDifficulties: DsfReviewDifficulty[];
  supportedLanguages: DsfReviewLanguage[];
  supportedAnswerProfiles: DsfReviewAnswerProfile[];
  answerProfiles: DsfReviewAnswerProfileDefinition[];
  defaultAnswerProfile: DsfReviewAnswerProfile;
  examSpecificAnswerProfilesImplemented: true;
  supportedExamFamilies: ['BANKING', 'SSC'];
  disabledExamFamilies: Array<{ examFamily: 'PUNJAB_STATE'; reason: string }>;
  runtimeMode: string;
  reviewStatus: string;
  questionStudioDiscoverable: true;
  persistenceAllowed: true;
  reviewOnly: false;
  manualApprovalRequired: true;
  questionBankStatus: 'READY_FOR_STORAGE';
  questionBankWritable: true;
  questionBankAcceptanceMode: 'FULL_RELEASE';
  testEligibility: 'ELIGIBLE';
  testEligible: true;
  mockTestEligible: true;
  publiclyPublishable: true;
  automaticStudentPublication: false;
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
  cp004GenerationItemCount: number;
  cp005GenerationItemCount: number;
  cp006GenerationItemCount: number;
  approvedItemCount: number;
  questionBankCount: number;
  integrationAuthority: string;
  deliveryProfileAuthority: string;
  questionBankAcceptanceCheckpointId: 'DSF-CP-004';
  questionBankAcceptanceAuthority: string;
  testReleaseCheckpointId: 'DSF-CP-005';
  testReleaseAuthority: string;
  mockTestReleaseCheckpointId: 'DSF-CP-006';
  mockTestReleaseAuthority: string;
  sourceFreezeAuthority: string;
  supportedLanguages: DsfReviewLanguage[];
  supportedAnswerProfiles: DsfReviewAnswerProfile[];
  answerProfiles: DsfReviewAnswerProfileDefinition[];
  supportedExamFamilies: ['BANKING', 'SSC'];
  disabledExamFamilies: Array<{ examFamily: 'PUNJAB_STATE'; reason: string }>;
  examSpecificAnswerProfilesImplemented: true;
  questionStudioDiscoverable: true;
  persistenceAllowed: true;
  manualReviewRequired: true;
  manualQuestionPublicationRequired: true;
  questionBankStatus: 'READY_FOR_STORAGE';
  questionBankAcceptanceEnabled: true;
  questionBankWritable: true;
  questionBankAcceptanceMode: 'FULL_RELEASE';
  testEligibility: 'ELIGIBLE';
  testEligible: true;
  mockTestEligible: true;
  publiclyPublishable: true;
  automaticStudentPublication: false;
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
    activationMode: 'MOCK_TEST_RELEASE_ENABLED';
    package: DsfReviewPackage;
    maxBatchSize: number;
    manualReviewRequired: true;
    manualQuestionPublicationRequired: true;
    questionBankAcceptanceEnabled: true;
    questionBankWriteEnabled: true;
    questionBankAcceptanceMode: 'FULL_RELEASE';
    testReleaseCheckpointId: 'DSF-CP-005';
    testReleaseAuthority: string;
    mockTestReleaseCheckpointId: 'DSF-CP-006';
    mockTestReleaseAuthority: string;
    testEligible: true;
    mockTestEligible: true;
    publiclyPublishable: true;
    automaticStudentPublication: false;
  }>('/admin/question-studio/reasoning/data-sufficiency/package', undefined, {
    fallbackMessage: 'Unable to load the Data Sufficiency Question Studio package.',
  });
}

export function previewDsfReview(input: DsfReviewInput) {
  return adminRequest<{
    questionCount: number;
    questions: DsfReviewQuestion[];
    productionEligible: false;
    manualReviewRequired: true;
    manualQuestionPublicationRequired: true;
    questionBankAcceptanceEnabled: true;
    questionBankAcceptanceMode: 'FULL_RELEASE';
    testEligible: true;
    mockTestEligible: true;
    publiclyPublishable: true;
    automaticStudentPublication: false;
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
    deliveryProfileAuthority: string;
    questionBankAcceptanceCheckpointId: 'DSF-CP-004';
    questionBankAcceptanceAuthority: string;
    testReleaseCheckpointId: 'DSF-CP-005';
    testReleaseAuthority: string;
    mockTestReleaseCheckpointId: 'DSF-CP-006';
    mockTestReleaseAuthority: string;
    manualReviewRequired: true;
    manualQuestionPublicationRequired: true;
    questionBankWritable: true;
    questionBankAcceptanceMode: 'FULL_RELEASE';
    testEligible: true;
    publiclyPublishable: true;
    mockTestEligible: true;
    automaticStudentPublication: false;
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

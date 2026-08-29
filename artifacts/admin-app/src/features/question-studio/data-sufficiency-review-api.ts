import { adminRequest } from '@/lib/admin-request';

export type DsfReviewLanguage = 'en' | 'hi' | 'pa';
export type DsfReviewLocale = 'en-IN' | 'hi-IN' | 'pa-IN';
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

export interface DsfReviewLocalizationMetadata {
  sourceLanguage: 'en';
  sourceLocale: 'en-IN';
  language: 'hi' | 'pa';
  locale: 'hi-IN' | 'pa-IN';
  authority: string;
  status: 'PRODUCT_OWNER_APPROVED';
  semanticParity: 'EXECUTABLE_PROVED';
  learnerTextLocalized: true;
  optionSemanticOrderPreserved: true;
  correctIndexPreserved: true;
  canonicalAnswerPreserved: true;
  humanLanguageReviewRequired: false;
  activeEditorialBlockers: string[];
}

export interface DsfReviewQuestion {
  packageId: 'DSF-001';
  sourceCheckpointId: 'DSF-CP-001';
  integrationCheckpointId: 'DSF-CP-002';
  profileCheckpointId: 'DSF-CP-003';
  localizationCheckpointId?: 'DSF-CP-008';
  localizationAuthority?: string;
  localizationApprovalCheckpointId?: 'DSF-CP-009';
  localizationApprovalAuthority?: string;
  canonicalEnglishProfileQuestionId?: string;
  localization?: DsfReviewLocalizationMetadata;
  qlId: 'DSF-QL-001';
  questionId: string;
  sourceQuestionId: string;
  language: DsfReviewLanguage;
  locale: DsfReviewLocale;
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
    localizationRecognized?: true;
    localizedLearnerText?: true;
    semanticParityPreserved?: true;
    optionSemanticOrderPreserved?: true;
    correctIndexPreserved?: true;
    canonicalAnswerPreserved?: true;
  };
  lifecycle: {
    questionStudioDiscoverable: true;
    persistenceAllowed: true;
    reviewOnly: false;
    questionBankStatus: 'READY_FOR_STORAGE';
    questionBankWritable: true;
    questionBankAcceptanceMode: 'FULL_RELEASE';
    manualQuestionPublicationRequired: true;
    testEligibility: 'ELIGIBLE';
    testEligible: true;
    mockTestEligible: true;
    publiclyPublishable: true;
    manualApprovalRequired: true;
    automaticStudentPublication: false;
  };
}

export interface DsfReviewLanguageLifecycle {
  status: 'PRODUCTION_READY_FROZEN' | 'LOCALIZED_PRODUCTION_READY';
  questionBankWritable: boolean;
  testEligible: boolean;
  mockTestEligible: boolean;
  publiclyPublishable: boolean;
  automaticStudentPublication: false;
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
  productionReadinessCheckpointId: 'DSF-CP-007';
  productionReadinessAuthority: string;
  localizationCheckpointId: 'DSF-CP-008';
  localizationAuthority: string;
  localizationApprovalCheckpointId: 'DSF-CP-009';
  localizationApprovalAuthority: string;
  productionReadinessFreezeCheckpointId: 'DSF-CP-010';
  productionReadinessFreezeAuthority: string;
  productionReadinessFreezeStatus: 'PRODUCTION_READY_MULTILINGUAL_FROZEN';
  productionReadinessFreezeFingerprint: string;
  chapterStatus: 'CLOSED_CURRENT_APPROVED_SCOPE';
  localizationStatus: 'PRODUCT_OWNER_APPROVED';
  humanLanguageReviewRequired: false;
  permanentQlIds: ['DSF-QL-001'];
  nextAvailableQlId: 'DSF-QL-002';
  domains: DsfReviewDomainDefinition[];
  solveModeCount: 8;
  supportedSemanticClasses: DsfReviewSemanticClass[];
  supportedDifficulties: DsfReviewDifficulty[];
  supportedLanguages: DsfReviewLanguage[];
  productionLanguages: ['en', 'hi', 'pa'];
  localizationReviewLanguages: [];
  perLanguageLifecycle: Record<DsfReviewLanguage, DsfReviewLanguageLifecycle>;
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
  cp008GenerationItemCount: number;
  cp009GenerationItemCount: number;
  cp010GenerationItemCount: number;
  hindiReviewItemCount: number;
  hindiReleaseItemCount: number;
  punjabiReviewItemCount: number;
  punjabiReleaseItemCount: number;
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
  localizationCheckpointId: 'DSF-CP-008';
  localizationAuthority: string;
  localizationApprovalCheckpointId: 'DSF-CP-009';
  localizationApprovalAuthority: string;
  productionReadinessFreezeCheckpointId: 'DSF-CP-010';
  productionReadinessFreezeAuthority: string;
  productionReadinessFreezeStatus: 'PRODUCTION_READY_MULTILINGUAL_FROZEN';
  productionReadinessFreezeFingerprint: string;
  chapterStatus: 'CLOSED_CURRENT_APPROVED_SCOPE';
  localizationStatus: 'PRODUCT_OWNER_APPROVED';
  localizedHumanReviewRequired: false;
  sourceFreezeAuthority: string;
  supportedLanguages: DsfReviewLanguage[];
  productionLanguages: ['en', 'hi', 'pa'];
  localizationReviewLanguages: [];
  perLanguageLifecycle: Record<DsfReviewLanguage, DsfReviewLanguageLifecycle>;
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
    activationMode: 'MULTILINGUAL_MOCK_TEST_RELEASE_ENABLED';
    localizationReviewMode: 'HI_PA_PRODUCT_OWNER_APPROVED';
    localizationReleaseMode: 'HI_PA_PRODUCT_OWNER_APPROVED';
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
    localizationCheckpointId: 'DSF-CP-008';
    localizationAuthority: string;
    localizationApprovalCheckpointId: 'DSF-CP-009';
    localizationApprovalAuthority: string;
    productionReadinessFreezeCheckpointId: 'DSF-CP-010';
    productionReadinessFreezeAuthority: string;
    productionReadinessFreezeStatus: 'PRODUCTION_READY_MULTILINGUAL_FROZEN';
    productionReadinessFreezeFingerprint: string;
    chapterStatus: 'CLOSED_CURRENT_APPROVED_SCOPE';
    localizedHumanReviewRequired: false;
    localizedQuestionBankWritable: true;
    localizedTestEligible: true;
    localizedMockTestEligible: true;
    localizedPubliclyPublishable: true;
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
    manualQuestionPublicationRequired: boolean;
    humanLanguageReviewRequired: boolean;
    questionBankAcceptanceEnabled: boolean;
    questionBankAcceptanceMode: 'FULL_RELEASE';
    questionBankWritable: boolean;
    testEligible: boolean;
    mockTestEligible: boolean;
    publiclyPublishable: boolean;
    automaticStudentPublication: false;
    localizationCheckpointId?: 'DSF-CP-008';
    localizationAuthority?: string;
    localizationApprovalCheckpointId?: 'DSF-CP-009';
    localizationApprovalAuthority?: string;
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
    localizationCheckpointId?: 'DSF-CP-008';
    localizationAuthority?: string;
    localizationApprovalCheckpointId?: 'DSF-CP-009';
    localizationApprovalAuthority?: string;
    questionBankAcceptanceCheckpointId?: 'DSF-CP-004';
    questionBankAcceptanceAuthority?: string;
    testReleaseCheckpointId?: 'DSF-CP-005';
    testReleaseAuthority?: string;
    mockTestReleaseCheckpointId?: 'DSF-CP-006';
    mockTestReleaseAuthority?: string;
    manualReviewRequired: true;
    manualQuestionPublicationRequired: boolean;
    humanLanguageReviewRequired: boolean;
    questionBankWritable: boolean;
    questionBankAcceptanceMode: 'FULL_RELEASE';
    testEligible: boolean;
    publiclyPublishable: boolean;
    mockTestEligible: boolean;
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

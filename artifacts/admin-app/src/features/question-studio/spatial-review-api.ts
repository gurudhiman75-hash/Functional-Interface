import { adminRequest } from '@/lib/admin-request';

export type SpatialReviewDifficulty = 'Easy' | 'Medium' | 'Hard';
export type SpatialReviewChapter = 'MIR-001' | 'WAT-001' | 'FAN-001' | 'FCL-001' | 'FSR-001' | 'FGC-001';
export type SpatialReviewLanguage = 'en' | 'hi' | 'pa';

export interface SpatialReviewQl {
  permanentQlId: string;
  proposalId: string;
  chapterCode: SpatialReviewChapter;
  name: string;
  difficulty: SpatialReviewDifficulty;
}

export interface SpatialReviewPackage {
  packageId: 'SPA-001';
  label: string;
  topic: string;
  subtopic: string;
  qlIds: string[];
  qls: SpatialReviewQl[];
  chapters: SpatialReviewChapter[];
  supportedLanguages: SpatialReviewLanguage[];
  supportedDifficulties: SpatialReviewDifficulty[];
  runtimeMode: 'CANONICAL_REVIEW';
  reviewStatus: 'APPROVED_EDITORIAL_CANONICAL';
  integrationAuthority: string;
  localizationAuthority: string;
  fgcLocalizationAuthority?: string;
  releaseAuthority: string;
  permanentQlCount: number;
  questionStudioVisible: true;
  questionStudioDiscoverable: true;
  registrationStatus: 'REGISTERED';
  questionBankStatus: 'READY_FOR_STORAGE';
  questionBankEligible: true;
  testEligibility: 'ELIGIBLE';
  testEligible: true;
  mockTestEligible: true;
  publiclyPublishable: true;
  manualApprovalRequired: true;
  automaticStudentPublication: false;
}

export interface SpatialReviewQuestion {
  packageId: 'SPA-001';
  qlId: string;
  proposalId: string;
  chapterCode: SpatialReviewChapter;
  qlName: string;
  language: SpatialReviewLanguage;
  locale: 'en-IN' | 'hi-IN' | 'pa-IN';
  difficultyBand: SpatialReviewDifficulty;
  seed: string;
  generationSeed: string;
  mode: string;
  stem: string;
  stimulusSvgs: string[];
  optionSvgs: string[];
  optionLabels: ['A', 'B', 'C', 'D'];
  correctIndex: 0 | 1 | 2 | 3;
  answer: 'A' | 'B' | 'C' | 'D';
  explanation: {
    observation: string;
    rule: string;
    application: string;
    check: string;
  };
  questionId: string;
  canonicalItemId: string;
  questionLanguageId: string;
  contentFingerprint: string;
  localization: {
    authority: string;
    canonicalLanguage: 'en';
    targetLanguage: SpatialReviewLanguage;
    semanticParity: 'GEOMETRY_AND_ANSWER_EXACT';
  };
  lifecycle: {
    questionBankStatus: 'READY_FOR_STORAGE';
    testEligibility: 'ELIGIBLE';
    publiclyPublishable: true;
    mockTestEligible: true;
    manualApprovalRequired: true;
    automaticStudentPublication: false;
    releaseAuthority: string;
  };
  validation: {
    valid: true;
    semanticOptionUniqueness: true;
    perceptualOptionUniqueness: true;
    learnerExplanationSafe: true;
    uniqueAnswer?: true;
  };
}

export interface SpatialReviewInput {
  language: SpatialReviewLanguage;
  qlId?: string;
  chapterCode?: SpatialReviewChapter;
  difficulty?: SpatialReviewDifficulty;
  count: number;
  seed?: string;
}

export interface SpatialReviewStatus {
  packageId: 'SPA-001';
  permanentQlCount: number;
  supportedLanguages: SpatialReviewLanguage[];
  generationItemCount: number;
  approvedItemCount: number;
  questionBankCount: number;
  integrationAuthority: string;
  localizationAuthority: string;
  releaseAuthority: string;
  questionBankConversionEligibleAfterApproval: true;
  testEligibleAfterApproval: true;
  publiclyPublishableAfterApproval: true;
  automaticStudentPublication: false;
}

function paramsFor(input: SpatialReviewInput) {
  const params = new URLSearchParams({ language: input.language, count: String(input.count) });
  if (input.qlId) params.set('qlId', input.qlId);
  if (input.chapterCode) params.set('chapterCode', input.chapterCode);
  if (input.difficulty) params.set('difficulty', input.difficulty);
  if (input.seed?.trim()) params.set('seed', input.seed.trim());
  return params;
}

export function getSpatialReviewPackage() {
  return adminRequest<{
    generationSystem: 'reasoning-v1';
    activationMode: 'PRODUCTION_REVIEW';
    package: SpatialReviewPackage;
    maxBatchSize: number;
    permanentQlCount: number;
    databaseWriteEnabled: true;
    persistenceAllowed: true;
    questionBankConversionEligibleAfterApproval: true;
    testEligibleAfterApproval: true;
    publiclyPublishableAfterApproval: true;
    automaticStudentPublication: false;
    bulkSyncSupported: false;
  }>(
    '/admin/question-studio/reasoning/spatial/package',
    undefined,
    { fallbackMessage: 'Unable to load the Spatial Reasoning package.' },
  );
}

export function previewSpatialReview(input: SpatialReviewInput) {
  return adminRequest<{
    questions: SpatialReviewQuestion[];
    productionEligible: true;
    integrationAuthority: string;
    localizationAuthority: string;
    releaseAuthority: string;
  }>(
    `/admin/question-studio/reasoning/spatial/preview?${paramsFor(input).toString()}`,
    undefined,
    { fallbackMessage: 'Unable to preview Spatial Reasoning questions.' },
  );
}

export function createSpatialReviewRun(input: SpatialReviewInput) {
  return adminRequest<{
    id: string;
    publicCode: string;
    status: string;
    itemCount: number;
    generationSystem: 'reasoning-v1';
    packageId: 'SPA-001';
    language: SpatialReviewLanguage;
    localizationAuthority: string;
    releaseAuthority: string;
  }>(
    '/admin/question-studio/reasoning/spatial/runs',
    { method: 'POST', body: JSON.stringify(input) },
    { fallbackMessage: 'Unable to create the Spatial Reasoning review run.' },
  );
}

export function getSpatialReviewStatus() {
  return adminRequest<SpatialReviewStatus>(
    '/admin/question-studio/reasoning/spatial/status',
    undefined,
    { fallbackMessage: 'Unable to load Spatial Reasoning status.' },
  );
}

import { adminRequest } from '@/lib/admin-request';

export type SpatialReviewDifficulty = 'Easy' | 'Medium' | 'Hard';
export type SpatialReviewChapter = 'MIR-001' | 'WAT-001' | 'FAN-001' | 'FCL-001' | 'FSR-001';

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
  supportedLanguages: ['en'];
  supportedDifficulties: SpatialReviewDifficulty[];
  runtimeMode: string;
  reviewStatus: string;
  integrationAuthority: string;
  permanentQlCount: number;
  reviewOnly: true;
  questionStudioVisible: true;
  questionStudioDiscoverable: true;
  registrationStatus: 'REGISTERED';
  questionBankStatus: 'NOT_STORED';
  questionBankWritable: false;
  testEligible: false;
  publiclyPublishable: false;
}

export interface SpatialReviewQuestion {
  packageId: 'SPA-001';
  qlId: string;
  proposalId: string;
  chapterCode: SpatialReviewChapter;
  qlName: string;
  language: 'en';
  locale: 'en-IN';
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
  validation: {
    valid: true;
    semanticOptionUniqueness: true;
    perceptualOptionUniqueness: true;
    learnerExplanationSafe: true;
  };
}

export interface SpatialReviewInput {
  qlId?: string;
  chapterCode?: SpatialReviewChapter;
  difficulty?: SpatialReviewDifficulty;
  count: number;
  seed?: string;
}

export interface SpatialReviewStatus {
  packageId: 'SPA-001';
  permanentQlCount: number;
  generationItemCount: number;
  approvedItemCount: number;
  questionBankCount: number;
  integrationAuthority: string;
  reviewOnly: true;
  questionBankWritable: false;
  testEligible: false;
  publiclyPublishable: false;
  automaticStudentPublication: false;
}

function paramsFor(input: SpatialReviewInput) {
  const params = new URLSearchParams({ language: 'en', count: String(input.count) });
  if (input.qlId) params.set('qlId', input.qlId);
  if (input.chapterCode) params.set('chapterCode', input.chapterCode);
  if (input.difficulty) params.set('difficulty', input.difficulty);
  if (input.seed?.trim()) params.set('seed', input.seed.trim());
  return params;
}

export function getSpatialReviewPackage() {
  return adminRequest<{
    generationSystem: 'reasoning-v1';
    activationMode: 'REVIEW_ONLY';
    package: SpatialReviewPackage;
    maxBatchSize: number;
    permanentQlCount: number;
    databaseWriteEnabled: true;
    persistenceAllowed: true;
    questionBankWriteEnabled: false;
    testEligible: false;
    publiclyPublishable: false;
    bulkSyncSupported: false;
  }>(
    '/admin/question-studio/reasoning/spatial/package',
    undefined,
    { fallbackMessage: 'Unable to load the Spatial Reasoning review package.' },
  );
}

export function previewSpatialReview(input: SpatialReviewInput) {
  return adminRequest<{
    questions: SpatialReviewQuestion[];
    productionEligible: false;
    reviewOnly: true;
    integrationAuthority: string;
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
    reviewOnly: true;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
  }>(
    '/admin/question-studio/reasoning/spatial/runs',
    { method: 'POST', body: JSON.stringify({ ...input, language: 'en' }) },
    { fallbackMessage: 'Unable to create the Spatial Reasoning review run.' },
  );
}

export function getSpatialReviewStatus() {
  return adminRequest<SpatialReviewStatus>(
    '/admin/question-studio/reasoning/spatial/status',
    undefined,
    { fallbackMessage: 'Unable to load Spatial Reasoning review status.' },
  );
}

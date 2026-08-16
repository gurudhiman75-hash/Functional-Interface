import { adminRequest } from '@/lib/admin-request';

export type SapReviewDifficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type SapReviewExamProfile = 'SSC' | 'BANKING' | 'RAILWAY' | 'PUNJAB_STATE';

export interface SapReviewQl {
  qlId: string;
  checkpointId: string;
  title: string;
  sourceIdentity: string;
  defaultWeight: number;
  specialist: boolean;
}

export interface SapReviewQuestion {
  packageId: 'SAP';
  qlId: string;
  qlName: string;
  checkpointId: string;
  questionId: string;
  language: 'en';
  locale: 'en-IN';
  examProfile: SapReviewExamProfile;
  difficultyBand: SapReviewDifficulty;
  stem: string;
  options: string[];
  correctIndex: number;
  answer: string;
  explanation: {
    coreConcept: string;
    steps: string[];
    finalAnswer: string;
    verification: string[];
  };
  sourceValidation: { valid: boolean; errors: string[] };
}

export interface SapReviewPackage {
  packageId: 'SAP';
  label: string;
  permanentQlCount: 211;
  qlIds: string[];
  checkpoints: string[];
  qls: SapReviewQl[];
  supportedLanguages: ['en'];
  supportedExamProfiles: SapReviewExamProfile[];
  supportedDifficulties: SapReviewDifficulty[];
  integrationAuthority: string;
  sourceFreeze: string;
  questionStudioRegistrationStatus: 'REGISTERED';
  questionStudioStagingStatus: 'REVIEW_QUEUE_ENABLED';
  questionStudioDiscoverable: true;
  persistenceAllowed: true;
  reviewOnly: true;
  questionBankStatus: 'NOT_STORED';
  questionBankWritable: false;
  testEligible: false;
  publiclyPublishable: false;
  automaticStudentPublication: false;
}

export interface SapReviewInput {
  count: number;
  seed?: string;
  qlId?: string;
  checkpointId?: string;
  difficulty?: SapReviewDifficulty;
  examProfile?: SapReviewExamProfile;
}

export interface SapReviewStatus {
  chapter: string;
  permanentQlCount: number;
  checkpointCount: number;
  generationItemCount: number;
  approvedItemCount: number;
  questionBankCount: number;
  integrationAuthority: string;
  questionStudioDiscoverable: true;
  persistenceAllowed: true;
  reviewOnly: true;
  questionBankWritable: false;
  testEligible: false;
  publiclyPublishable: false;
}

function paramsFor(input: SapReviewInput) {
  const params = new URLSearchParams({
    count: String(input.count),
    examProfile: input.examProfile ?? 'SSC',
  });
  if (input.seed?.trim()) params.set('seed', input.seed.trim());
  if (input.qlId) params.set('qlId', input.qlId);
  if (input.checkpointId) params.set('checkpointId', input.checkpointId);
  if (input.difficulty) params.set('difficulty', input.difficulty);
  return params;
}

export function getSapReviewPackage() {
  return adminRequest<{
    generationSystem: 'quant-v4';
    activationMode: 'QUESTION_STUDIO_CONNECTED_REVIEW_ONLY';
    package: SapReviewPackage;
  }>('/admin/question-studio/quant/simplification/package', undefined, {
    fallbackMessage: 'Unable to load the Simplification & Approximation Question Studio package.',
  });
}

export function previewSapReview(input: SapReviewInput) {
  return adminRequest<{
    packageId: 'SAP';
    integrationAuthority: string;
    reviewOnly: true;
    questions: SapReviewQuestion[];
    productionEligible: false;
  }>(`/admin/question-studio/quant/simplification/preview?${paramsFor(input).toString()}`, undefined, {
    fallbackMessage: 'Unable to preview Simplification & Approximation questions.',
  });
}

export function createSapReviewRun(input: SapReviewInput) {
  return adminRequest<{
    id: string;
    publicCode: string;
    status: 'review';
    itemCount: number;
    generationSystem: 'quant-v4';
    chapter: string;
    integrationAuthority: string;
    reviewOnly: true;
  }>('/admin/question-studio/quant/simplification/runs', {
    method: 'POST',
    body: JSON.stringify({ ...input, examProfile: input.examProfile ?? 'SSC' }),
  }, { fallbackMessage: 'Unable to create a Simplification & Approximation review run.' });
}

export function getSapReviewStatus() {
  return adminRequest<SapReviewStatus>(
    '/admin/question-studio/quant/simplification/status',
    undefined,
    { fallbackMessage: 'Unable to load Simplification & Approximation Question Studio status.' },
  );
}

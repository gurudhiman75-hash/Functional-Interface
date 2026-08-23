import { adminRequest } from '@/lib/admin-request';

export type InterestCp009Language = 'en' | 'hi' | 'pa';
export type InterestCp009Difficulty = 'Medium' | 'Hard';

export interface InterestCp009Question {
  questionId: string;
  questionLanguageId: string;
  qlId: string;
  language: InterestCp009Language;
  locale: string;
  difficultyBand: InterestCp009Difficulty;
  stem: string;
  options: string[];
  correctIndex: number;
  answer: string;
  explanation: string;
  packageExplanation: { lines: string[] };
  authorityId: string;
  solveMode: string;
  taskKind: string;
  answerSemantic: string;
  runtimeMode: 'QUESTION_STUDIO_ACTIVE';
  reviewStatus: 'FROZEN_MULTILINGUAL_CONTENT_AUTHORITY';
  questionStudioDiscoverable: true;
  questionBankWritable: false;
  testEligible: false;
  publiclyPublishable: false;
  traceability: {
    releaseId: string;
    permanentQlId: string;
    authorityId: string;
    sourcePrototypeId: string;
    sourceVariantCount: number;
    freezeFingerprint: string;
  };
}

export interface InterestCp009Package {
  packageId: 'INT-001';
  cpIds: ['INT-CP-009'];
  permanentQlCount: 5;
  permanentQlIds: string[];
  supportedDifficulties: InterestCp009Difficulty[];
  supportedLanguages: InterestCp009Language[];
  enabled: true;
  runtimeMode: 'QUESTION_STUDIO_ACTIVE';
  reviewStatus: 'FROZEN_MULTILINGUAL_CONTENT_AUTHORITY';
  questionBankWritable: false;
  testEligible: false;
  publiclyPublishable: false;
  releaseId: string;
}

export interface InterestCp009Input {
  language: InterestCp009Language;
  qlId?: string;
  difficulty?: InterestCp009Difficulty;
  count: number;
  seed?: string;
}

export interface InterestCp009Status {
  packageId: 'INT-001';
  checkpointId: 'INT-CP-009';
  permanentQlCount: 5;
  generationItemCount: number;
  approvedItemCount: number;
  questionBankCount: number;
  questionStudioDiscoverable: true;
  reviewOnly: true;
  questionBankWritable: false;
  testEligible: false;
  publiclyPublishable: false;
  releaseId: string;
}

export interface InterestCp009RunResult {
  id: string;
  publicCode: string;
  status: string;
  itemCount: number;
  generationSystem: 'quant-v4';
  packageId: 'INT-001';
  checkpointId: 'INT-CP-009';
  releaseId: string;
  reviewOnly: true;
  questionBankWritable: false;
  testEligible: false;
  publiclyPublishable: false;
}

function paramsFor(input: InterestCp009Input) {
  const params = new URLSearchParams({ language: input.language, count: String(input.count) });
  if (input.qlId) params.set('qlId', input.qlId);
  if (input.difficulty) params.set('difficulty', input.difficulty);
  if (input.seed?.trim()) params.set('seed', input.seed.trim());
  return params;
}

export function getInterestCp009Package() {
  return adminRequest<{
    generationSystem: 'quant-v4';
    activationMode: 'FROZEN_MULTILINGUAL_REVIEW';
    package: InterestCp009Package;
    maxBatchSize: number;
    permanentQlCount: 5;
    supportedLanguages: InterestCp009Language[];
    supportedDifficulties: InterestCp009Difficulty[];
    databaseWriteEnabled: true;
    persistenceAllowed: true;
    questionStudioDiscoverable: true;
    questionBankWriteEnabled: false;
    testEligible: false;
    publiclyPublishable: false;
    releaseId: string;
  }>('/admin/question-studio/quant/interest/cp009/package', undefined, {
    fallbackMessage: 'Unable to load the Interest CP-009 review package.',
  });
}

export function previewInterestCp009(input: InterestCp009Input) {
  return adminRequest<{
    questions: InterestCp009Question[];
    productionEligible: false;
    reviewOnly: true;
    integrationAuthority: string;
  }>(`/admin/question-studio/quant/interest/cp009/preview?${paramsFor(input).toString()}`, undefined, {
    fallbackMessage: 'Unable to preview Interest CP-009 questions.',
  });
}

export function createInterestCp009Run(input: InterestCp009Input) {
  return adminRequest<InterestCp009RunResult>(
    '/admin/question-studio/quant/interest/cp009/runs',
    { method: 'POST', body: JSON.stringify(input) },
    { fallbackMessage: 'Unable to create the Interest CP-009 review run.' },
  );
}

export function getInterestCp009Status() {
  return adminRequest<InterestCp009Status>(
    '/admin/question-studio/quant/interest/cp009/status',
    undefined,
    { fallbackMessage: 'Unable to load Interest CP-009 review status.' },
  );
}

import { adminRequest } from '@/lib/admin-request';

export type WorReviewLanguage = 'en' | 'hi' | 'pa';
export type WorReviewDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface WorReviewCheckpoint {
  checkpointId: string;
  title: string;
  prototypeCount: number;
}

export interface WorReviewPrototype {
  prototypeId: string;
  checkpointId: string;
  title: string;
  taskKind: string;
  answerType: string;
  optionCount: 4 | 5;
  supportedDifficulties: WorReviewDifficulty[];
  allocationDecision: string;
  sourceEvidenceStatus: string;
}

export interface WorReviewPackage {
  packageId: 'WOR-001';
  chapterId: 'WOR-001';
  label: string;
  subject: string;
  topic: string;
  subtopic: string;
  checkpointCount: number;
  prototypeCount: number;
  permanentQlCount: 0;
  recommendedPermanentQlRootCount: 8;
  checkpoints: WorReviewCheckpoint[];
  prototypes: WorReviewPrototype[];
  supportedLanguages: WorReviewLanguage[];
  supportedDifficulties: WorReviewDifficulty[];
  runtimeMode: string;
  reviewStatus: string;
  integrationAuthority: string;
  questionStudioRegistrationStatus: 'REGISTERED_REVIEW_ONLY';
  questionStudioStagingStatus: 'REVIEW_QUEUE_ENABLED';
  questionStudioVisible: true;
  reviewOnly: true;
  questionBankStatus: 'NOT_STORED';
  questionBankWritable: false;
  testEligibility: 'INELIGIBLE';
  testEligible: false;
  mockTestEligible: false;
  publiclyPublishable: false;
  automaticStudentPublication: false;
  manualApprovalRequired: true;
  nativeHumanSignoffRequired: true;
  permanentQlAllocationRequired: true;
}

export interface WorReviewQuestion {
  packageId: 'WOR-001';
  chapterId: 'WOR-001';
  checkpointId: string;
  prototypeId: string;
  patternId: string;
  permanentQlId: null;
  qlId: null;
  questionId: string;
  canonicalItemId: string;
  questionLanguageId: string;
  language: WorReviewLanguage;
  locale: string;
  difficultyBand: WorReviewDifficulty;
  taskKind: string;
  instruction: string;
  displayStem: string;
  structuredPrompt: {
    words: string[];
    insertionWord?: string;
    presentedSequence?: string[];
    partialSequence?: string[];
  };
  options: string[];
  optionDetails: Array<{
    label: string;
    text: string;
    isCorrect: boolean;
    misconceptionId: string | null;
  }>;
  correctIndex: number;
  answer: string;
  explanation: string;
  renderer: 'STRUCTURED_TEXT';
  seed: number;
  questionStudioVisible: true;
  lifecycleStatus: 'REVIEW_ONLY';
  integrationAuthority: string;
  reviewStatus: string;
  validation: {
    valid: boolean;
    independentSolverVerified: true;
    lexicallyUnique: true;
    optionsDistinct: boolean;
    exactlyOneCorrect: boolean;
  };
  source: {
    evidenceStatus: string;
    allocationDecision: string;
    objectMode: string;
    familyId: string;
  };
}

export interface WorReviewInput {
  language: WorReviewLanguage;
  checkpointId?: string;
  prototypeId?: string;
  difficulty?: WorReviewDifficulty;
  count: number;
  seed?: string;
}

export interface WorReviewStatus {
  packageId: 'WOR-001';
  checkpointCount: number;
  prototypeCount: number;
  permanentQlCount: 0;
  generationItemCount: number;
  approvedItemCount: number;
  needsFixItemCount: number;
  rejectedItemCount: number;
  questionBankCount: number;
  integrationAuthority: string;
  questionStudioRegistrationStatus: 'REGISTERED_REVIEW_ONLY';
  questionStudioStagingStatus: 'REVIEW_QUEUE_ENABLED';
  questionStudioVisible: true;
  reviewOnly: true;
  questionBankWritable: false;
  testEligible: false;
  publiclyPublishable: false;
  automaticStudentPublication: false;
  releaseFreezeStatus: 'PENDING_NATIVE_SIGNOFF_AND_PERMANENT_QL';
}

function paramsFor(input: WorReviewInput) {
  const params = new URLSearchParams({
    language: input.language,
    count: String(input.count),
  });
  if (input.checkpointId) params.set('checkpointId', input.checkpointId);
  if (input.prototypeId) params.set('prototypeId', input.prototypeId);
  if (input.difficulty) params.set('difficulty', input.difficulty);
  if (input.seed?.trim()) params.set('seed', input.seed.trim());
  return params;
}

export function getWorReviewPackage() {
  return adminRequest<{
    generationSystem: 'reasoning-v1';
    activationMode: 'QUESTION_STUDIO_REVIEW_CONNECTED';
    package: WorReviewPackage;
    maxBatchSize: number;
    databaseWriteEnabled: true;
    persistenceAllowed: true;
    questionBankWriteEnabled: false;
    testEligible: false;
    publiclyPublishable: false;
    bulkSyncSupported: false;
  }>(
    '/admin/question-studio/reasoning/word-dictionary-order/package',
    undefined,
    { fallbackMessage: 'Unable to load the Word & Dictionary Order review package.' },
  );
}

export function previewWorReview(input: WorReviewInput) {
  return adminRequest<{
    questions: WorReviewQuestion[];
    integrationAuthority: string;
    reviewOnly: true;
    productionEligible: false;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
  }>(
    `/admin/question-studio/reasoning/word-dictionary-order/preview?${paramsFor(input).toString()}`,
    undefined,
    { fallbackMessage: 'Unable to preview Word & Dictionary Order questions.' },
  );
}

export function createWorReviewRun(input: WorReviewInput) {
  return adminRequest<{
    id: string;
    publicCode: string;
    status: string;
    itemCount: number;
    generationSystem: 'reasoning-v1';
    packageId: 'WOR-001';
    reviewOnly: true;
    permanentQlCount: 0;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
  }>(
    '/admin/question-studio/reasoning/word-dictionary-order/runs',
    { method: 'POST', body: JSON.stringify(input) },
    { fallbackMessage: 'Unable to create the Word & Dictionary Order review run.' },
  );
}

export function getWorReviewStatus() {
  return adminRequest<WorReviewStatus>(
    '/admin/question-studio/reasoning/word-dictionary-order/status',
    undefined,
    { fallbackMessage: 'Unable to load Word & Dictionary Order review status.' },
  );
}

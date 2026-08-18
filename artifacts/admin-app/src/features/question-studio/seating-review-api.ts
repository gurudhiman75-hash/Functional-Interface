import { adminRequest } from '@/lib/admin-request';

export type SeatingReviewLanguage = 'en' | 'hi' | 'pa';
export type SeatingReviewCheckpoint = 'SEA-CP-001' | 'SEA-CP-002' | 'SEA-CP-003' | 'SEA-CP-004' | 'SEA-CP-005';
export type SeatingReviewDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface SeatingReviewQl {
  permanentQlId: string;
  checkpointId: SeatingReviewCheckpoint;
  blueprintAuthorityId: string;
  name: string;
  difficulty: SeatingReviewDifficulty;
}

export interface SeatingReviewPackage {
  packageId: 'REASONING_V1_SEA_001';
  packageCode: 'SEA-001';
  label: string;
  topic: 'Seating Arrangement';
  subtopic: string;
  qlIds: string[];
  qls: SeatingReviewQl[];
  checkpoints: SeatingReviewCheckpoint[];
  supportedLanguages: SeatingReviewLanguage[];
  supportedDifficulties: SeatingReviewDifficulty[];
  runtimeMode: 'DYNAMIC_CANDIDATE';
  integrationAuthority: string;
  permanentQlCount: 20;
  questionStudioVisible: true;
  questionStudioDiscoverable: true;
  registrationStatus: 'REGISTERED';
  generationRunPersistenceAllowed: true;
  databaseWriteEnabled: true;
  questionBankStatus: 'NOT_STORED';
  questionBankEligible: false;
  testEligibility: 'INELIGIBLE';
  testEligible: false;
  mockTestEligible: false;
  productionStagingApproved: false;
  publiclyPublishable: false;
  manualApprovalRequired: true;
  automaticStudentPublication: false;
}

export interface SeatingReviewQuestion {
  packageId: 'REASONING_V1_SEA_001';
  qlId: string;
  checkpointId: SeatingReviewCheckpoint;
  blueprintAuthorityId: string;
  caseletId: string;
  questionOrder: number;
  questionId: string;
  canonicalItemId: string;
  questionLanguageId: string;
  language: SeatingReviewLanguage;
  locale: 'en-IN' | 'hi-IN' | 'pa-IN';
  difficultyBand: SeatingReviewDifficulty;
  sharedPrompt: string;
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
  decodedStatements: string[];
  explanation: {
    steps: string[];
    conclusion: string;
    shortcut: string;
    commonTrap: string;
    familyTree: null;
    diagramProof: SeatingReviewRenderer;
  };
  renderer: SeatingReviewRenderer;
  contentFingerprint: string;
  traceability: Record<string, unknown>;
  safety: {
    reviewOnly: true;
    questionStudioVisible: true;
    persistenceAllowed: true;
    questionBankEligible: false;
    mockTestEligible: false;
    productionStagingApproved: false;
    publiclyPublishable: false;
  };
  validation: { valid: true };
}

export interface SeatingReviewRenderer {
  kind: 'SEATING_SVG' | 'SEATING_TEXT';
  svg?: string;
  text?: string;
  topology: unknown;
  textFallbackAvailable: boolean;
}

export interface SeatingReviewInput {
  language: SeatingReviewLanguage;
  qlId?: string;
  checkpointId?: SeatingReviewCheckpoint;
  count: number;
  seed?: string;
}

export interface SeatingReviewStatus {
  packageId: 'REASONING_V1_SEA_001';
  permanentQlCount: 20;
  supportedLanguages: SeatingReviewLanguage[];
  generationItemCount: number;
  approvedItemCount: number;
  questionBankCount: number;
  runtimeMode: 'DYNAMIC_CANDIDATE';
  integrationAuthority: string;
  questionBankConversionEligibleAfterApproval: false;
  testEligibleAfterApproval: false;
  publiclyPublishableAfterApproval: false;
  automaticStudentPublication: false;
}

function paramsFor(input: SeatingReviewInput) {
  const params = new URLSearchParams({
    language: input.language,
    count: String(input.count),
  });
  if (input.qlId) params.set('qlId', input.qlId);
  if (input.checkpointId) params.set('checkpointId', input.checkpointId);
  if (input.seed?.trim()) params.set('seed', input.seed.trim());
  return params;
}

export function getSeatingReviewPackage() {
  return adminRequest<{
    generationSystem: 'reasoning-v1';
    activationMode: 'DYNAMIC_REVIEW_ONLY';
    package: SeatingReviewPackage;
    maxBatchSize: number;
    permanentQlCount: 20;
    databaseWriteEnabled: true;
    generationRunPersistenceAllowed: true;
    questionBankConversionEligibleAfterApproval: false;
    testEligibleAfterApproval: false;
    publiclyPublishableAfterApproval: false;
    automaticStudentPublication: false;
  }>(
    '/admin/question-studio/reasoning/seating/package',
    undefined,
    { fallbackMessage: 'Unable to load the Seating Arrangement package.' },
  );
}

export function previewSeatingReview(input: SeatingReviewInput) {
  return adminRequest<{
    questions: SeatingReviewQuestion[];
    reviewEligible: true;
    productionEligible: false;
    integrationAuthority: string;
  }>(
    `/admin/question-studio/reasoning/seating/preview?${paramsFor(input).toString()}`,
    undefined,
    { fallbackMessage: 'Unable to preview Seating Arrangement questions.' },
  );
}

export function createSeatingReviewRun(input: SeatingReviewInput) {
  return adminRequest<{
    id: string;
    publicCode: string;
    status: 'review';
    itemCount: number;
    generationSystem: 'reasoning-v1';
    packageId: 'REASONING_V1_SEA_001';
    runtimeMode: 'DYNAMIC_CANDIDATE';
    integrationAuthority: string;
    questionBankStatus: 'NOT_STORED';
    testEligibility: 'INELIGIBLE';
    publiclyPublishable: false;
  }>(
    '/admin/question-studio/reasoning/seating/runs',
    { method: 'POST', body: JSON.stringify(input) },
    { fallbackMessage: 'Unable to create the Seating Arrangement review run.' },
  );
}

export function getSeatingReviewStatus() {
  return adminRequest<SeatingReviewStatus>(
    '/admin/question-studio/reasoning/seating/status',
    undefined,
    { fallbackMessage: 'Unable to load Seating Arrangement Question Studio status.' },
  );
}

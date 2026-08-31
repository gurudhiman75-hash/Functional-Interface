import { adminRequest } from '@/lib/admin-request';

export type CubesDiceReviewLanguage = 'en' | 'hi' | 'pa';
export type CubesDiceReviewQlId = 'SPA-QL-043' | 'SPA-QL-044' | 'SPA-QL-045' | 'SPA-QL-046' | 'SPA-QL-047';

export interface CubesDiceReviewQl {
  permanentQlId: CubesDiceReviewQlId;
  proposalId: string;
  name: string;
  baseDifficulty: 'Medium';
}

export interface CubesDiceReviewPackage {
  packageId: 'SPA-001-CND-001-REVIEW';
  chapterCode: 'CND-001';
  label: string;
  qlIds: CubesDiceReviewQlId[];
  qls: CubesDiceReviewQl[];
  permanentQlCount: 5;
  supportedLanguages: CubesDiceReviewLanguage[];
  supportedDifficulties: ['Easy', 'Medium', 'Hard'];
  registrationAuthority: string;
  activationAuthority: string;
  activationMode: 'ACTIVE_INTERNAL_BANK_ONLY';
  questionStudioVisible: true;
  questionStudioDiscoverable: true;
  previewGenerationAuthorized: true;
  persistenceAllowed: true;
  databaseWriteEnabled: true;
  questionBankStatus: 'READY_FOR_STORAGE';
  questionBankWritable: true;
  questionBankAcceptanceMode: 'BANK_ONLY';
  manualApprovalRequired: true;
  testEligibility: 'INELIGIBLE';
  testEligible: false;
  mockTestEligible: false;
  publiclyPublishable: false;
  automaticStudentPublication: false;
}

export interface CubesDiceSolutionTable {
  title: string;
  headers: string[];
  rows: string[][];
  emphasizedRowIndexes: number[];
}

export interface CubesDiceReviewQuestion {
  version: 'CND-001-QUESTION-STUDIO-BANK-QUESTION-V1';
  packageId: 'SPA-001';
  qlId: CubesDiceReviewQlId;
  permanentQlId: CubesDiceReviewQlId;
  chapterCode: 'CND-001';
  qlName: string;
  language: CubesDiceReviewLanguage;
  locale: 'en-IN' | 'hi-IN' | 'pa-IN';
  difficultyBand: 'Easy' | 'Medium' | 'Hard';
  seed: string;
  taskKind: string;
  stemVariantId: string;
  stem: string;
  stimulusSvgs: [string];
  options: [string | number, string | number, string | number, string | number];
  optionLabels: ['A', 'B', 'C', 'D'];
  correctIndex: number;
  answer: 'A' | 'B' | 'C' | 'D';
  canonicalAnswer: string | number;
  solution: {
    version: 'CND-001-STUDENT-SOLUTION-V1';
    language: CubesDiceReviewLanguage;
    presentationModel: 'LOGIC_RULE_THEN_EXACT_WORKING_THEN_ANSWER';
    logicRule: string;
    tables: CubesDiceSolutionTable[];
    steps: string[];
    note: string | null;
    answerLine: string;
  };
  legacyExplanationSuppressed: true;
  canonicalItemId: string;
  questionLanguageId: string;
  contentFingerprint: string;
  registrationAuthority: string;
  bankActivationAuthority: string;
  lifecycle: {
    reviewOnly: true;
    questionStudioDiscoverable: true;
    registrationStatus: 'REGISTERED_BANK_ONLY_INTERNAL';
    persistenceAllowed: true;
    questionBankStatus: 'READY_FOR_STORAGE';
    questionBankWritable: true;
    questionBankAcceptanceMode: 'BANK_ONLY';
    manualApprovalRequired: true;
    testEligibility: 'INELIGIBLE';
    testEligible: false;
    testBuilderEligible: false;
    mockTestEligible: false;
    publiclyPublishable: false;
    automaticStudentPublication: false;
  };
}

export interface CubesDiceReviewInput {
  language: CubesDiceReviewLanguage;
  qlId?: CubesDiceReviewQlId;
  count: number;
  seed?: string;
}

export interface CubesDiceReviewStatus {
  packageId: 'SPA-001-CND-001-REVIEW';
  chapterCode: 'CND-001';
  permanentQlCount: 5;
  supportedLanguages: CubesDiceReviewLanguage[];
  registrationStatus: 'REGISTERED_BANK_ONLY_INTERNAL';
  registrationAuthority: string;
  activationAuthority: string;
  questionStudioDiscoverable: true;
  previewGenerationAuthorized: true;
  persistenceAllowed: true;
  questionBankStatus: 'READY_FOR_STORAGE';
  questionBankWritable: true;
  questionBankAcceptanceMode: 'BANK_ONLY';
  manualApprovalRequired: true;
  testEligibility: 'INELIGIBLE';
  testEligible: false;
  mockTestEligible: false;
  publiclyPublishable: false;
  automaticStudentPublication: false;
  generationRunCount: number;
  generationItemCount: number;
  approvedItemCount: number;
  questionBankCount: number;
  nextGate: string;
}

function paramsFor(input: CubesDiceReviewInput) {
  const params = new URLSearchParams({ language: input.language, count: String(input.count) });
  if (input.qlId) params.set('qlId', input.qlId);
  if (input.seed?.trim()) params.set('seed', input.seed.trim());
  return params;
}

export function getCubesDiceReviewPackage() {
  return adminRequest<{
    generationSystem: 'reasoning-v1';
    package: CubesDiceReviewPackage;
    maxPreviewBatchSize: number;
    maxRunBatchSize: number;
    registrationStatus: 'REGISTERED_BANK_ONLY_INTERNAL';
    databaseWriteEnabled: true;
    persistenceAllowed: true;
    questionBankConversionEligibleAfterApproval: true;
    questionBankAcceptanceMode: 'BANK_ONLY';
    testEligibleAfterApproval: false;
    publiclyPublishableAfterApproval: false;
    automaticStudentPublication: false;
  }>(
    '/admin/question-studio/reasoning/spatial/cubes-dice/package',
    undefined,
    { fallbackMessage: 'Unable to load the Cubes & Dice review package.' },
  );
}

export function previewCubesDiceReview(input: CubesDiceReviewInput) {
  return adminRequest<{
    generationSystem: 'reasoning-v1';
    packageId: 'SPA-001-CND-001-REVIEW';
    activationMode: 'ACTIVE_INTERNAL_BANK_ONLY';
    registrationAuthority: string;
    activationAuthority: string;
    questions: CubesDiceReviewQuestion[];
    internalReviewEligible: true;
    persistenceAllowed: true;
    questionBankWritable: true;
    questionBankAcceptanceMode: 'BANK_ONLY';
    testEligible: false;
    publiclyPublishable: false;
  }>(
    `/admin/question-studio/reasoning/spatial/cubes-dice/preview?${paramsFor(input).toString()}`,
    undefined,
    { fallbackMessage: 'Unable to preview Cubes & Dice questions.' },
  );
}

export function createCubesDiceReviewRun(input: CubesDiceReviewInput) {
  return adminRequest<{
    id: string;
    publicCode: string;
    status: 'review';
    itemCount: number;
    generationSystem: 'reasoning-v1';
    packageId: 'SPA-001-CND-001-REVIEW';
    chapterCode: 'CND-001';
    activationAuthority: string;
    questionBankConversionEligibleAfterApproval: true;
    questionBankAcceptanceMode: 'BANK_ONLY';
    testEligible: false;
    publiclyPublishable: false;
    automaticStudentPublication: false;
  }>(
    '/admin/question-studio/reasoning/spatial/cubes-dice/runs',
    { method: 'POST', body: JSON.stringify(input) },
    { fallbackMessage: 'Unable to create the Cubes & Dice review run.' },
  );
}

export function getCubesDiceReviewStatus() {
  return adminRequest<CubesDiceReviewStatus>(
    '/admin/question-studio/reasoning/spatial/cubes-dice/status',
    undefined,
    { fallbackMessage: 'Unable to load Cubes & Dice review status.' },
  );
}

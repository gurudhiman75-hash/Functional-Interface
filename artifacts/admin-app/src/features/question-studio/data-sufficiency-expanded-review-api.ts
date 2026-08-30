import { adminRequest } from '@/lib/admin-request';

export type DsfExpandedDifficulty = 'Easy' | 'Medium' | 'Hard';
export type DsfExpandedSemanticClass =
  | 'STATEMENT_I_ONLY'
  | 'STATEMENT_II_ONLY'
  | 'EACH_STATEMENT_ALONE'
  | 'BOTH_TOGETHER_ONLY'
  | 'INSUFFICIENT_EVEN_TOGETHER';

export interface DsfExpandedLane {
  id: string;
  label: string;
  checkpointId: 'DSF-CP-011' | 'DSF-CP-012' | 'DSF-CP-013';
  domainFamily: 'QUANT' | 'REASONING';
  sourceChapterIds: string[];
  editorialSurfaceVersion?: string;
}

export interface DsfExpandedPackage {
  packageId: 'DSF-001-EXPANDED-REVIEW';
  chapterPackageId: 'DSF-001';
  label: string;
  integrationCheckpointId: 'DSF-CP-017';
  integrationAuthority: string;
  currentPermanentQlIds: Array<'DSF-QL-001' | 'DSF-QL-002'>;
  generatableQlIds: ['DSF-QL-001'];
  nonGeneratablePermanentQlIds: Array<{
    qlId: 'DSF-QL-002';
    status: string;
    reason: string;
  }>;
  nextAvailableQlId: 'DSF-QL-003';
  lanes: DsfExpandedLane[];
  laneCount: number;
  supportedSemanticClasses: DsfExpandedSemanticClass[];
  supportedDifficulties: DsfExpandedDifficulty[];
  supportedLanguages: ['en'];
  defaultLanguage: 'en';
  defaultAnswerProfile: 'GENERIC_DS_STANDARD_5_EN';
  runtimeMode: 'EXPANDED_REVIEW';
  reviewStatus: 'EXPANDED_REVIEW_QUEUE';
  questionStudioDiscoverable: true;
  questionStudioGenerationEnabled: true;
  persistenceAllowed: true;
  reviewOnly: true;
  manualApprovalRequired: true;
  questionBankStatus: 'NOT_STORED';
  questionBankWritable: false;
  testEligibility: 'INELIGIBLE';
  testEligible: false;
  mockTestEligible: false;
  publiclyPublishable: false;
  automaticStudentPublication: false;
}

export interface DsfExpandedQuestion {
  text: string;
  stem: string;
  questionPrompt: string;
  statements: [
    { id: 'I'; text: string; statementRuleId?: string; statementFamily?: string },
    { id: 'II'; text: string; statementRuleId?: string; statementFamily?: string },
  ];
  options: Array<{
    key: 'A' | 'B' | 'C' | 'D' | 'E';
    value: string;
    semanticClass: DsfExpandedSemanticClass;
    isCorrect: boolean;
  }>;
  correctIndex: number;
  answer: string;
  canonicalAnswer: DsfExpandedSemanticClass;
  explanation: string;
  difficulty: DsfExpandedDifficulty;
  qlId: 'DSF-QL-001';
  packageId: 'DSF-001';
  sourceCheckpointId: 'DSF-CP-011' | 'DSF-CP-012' | 'DSF-CP-013';
  integrationCheckpointId: 'DSF-CP-017';
  questionId: string;
  sourceQuestionId: string;
  sourceGenerationIdentity: string;
  sourceChapterId: string;
  sourceCapabilities: string[];
  solveMode: string;
  solveModeId: string;
  targetKind: string;
  domain: string;
  domainLabel: string;
  laneId: string;
  domainFamily: 'QUANT' | 'REASONING';
  topic: 'Data Sufficiency';
  subtopic: string;
  language: 'en';
  locale: 'en-IN';
  seed: number;
  answerProfile: 'GENERIC_DS_STANDARD_5_EN';
  runtimeMode: 'EXPANDED_REVIEW';
  reviewOnly: true;
  editorialSurfaceVersion?: string;
  integrationAuthority: string;
  questionBankStatus: 'NOT_STORED';
  questionBankWritable: false;
  testEligibility: 'INELIGIBLE';
  testEligible: false;
  mockTestEligible: false;
  publiclyPublishable: false;
  automaticStudentPublication: false;
  validation: {
    valid: true;
    semanticTruthPreserved: true;
    sourceLifecyclePreserved: true;
    questionStudioExposureOwnedByCp017: true;
    editorialSurfaceApplied: boolean;
  };
  lifecycle: {
    questionStudioDiscoverable: true;
    questionStudioGenerationEnabled: true;
    persistenceAllowed: true;
    reviewOnly: true;
    manualApprovalRequired: true;
    questionBankStatus: 'NOT_STORED';
    questionBankWritable: false;
    testEligibility: 'INELIGIBLE';
    testEligible: false;
    mockTestEligible: false;
    publiclyPublishable: false;
    automaticStudentPublication: false;
  };
}

export interface DsfExpandedReviewInput {
  laneId?: string;
  semanticClass?: DsfExpandedSemanticClass;
  difficulty?: DsfExpandedDifficulty;
  count: number;
  seed?: string;
}

export interface DsfExpandedStatus {
  chapter: 'Data Sufficiency';
  generationScope: 'EXPANDED_REVIEW';
  integrationCheckpointId: 'DSF-CP-017';
  integrationAuthority: string;
  permanentQlCount: number;
  generatableQlCount: number;
  laneCount: number;
  generationItemCount: number;
  approvedItemCount: number;
  questionBankCount: number;
  currentPermanentQlIds: Array<'DSF-QL-001' | 'DSF-QL-002'>;
  generatableQlIds: ['DSF-QL-001'];
  nextAvailableQlId: 'DSF-QL-003';
  questionStudioDiscoverable: true;
  questionStudioGenerationEnabled: true;
  persistenceAllowed: true;
  manualReviewRequired: true;
  reviewOnly: true;
  questionBankStatus: 'NOT_STORED';
  questionBankWritable: false;
  testEligibility: 'INELIGIBLE';
  testEligible: false;
  mockTestEligible: false;
  publiclyPublishable: false;
  automaticStudentPublication: false;
}

function paramsFor(input: DsfExpandedReviewInput) {
  const params = new URLSearchParams({ count: String(input.count), language: 'en', qlId: 'DSF-QL-001' });
  if (input.laneId) params.set('laneId', input.laneId);
  if (input.semanticClass) params.set('semanticClass', input.semanticClass);
  if (input.difficulty) params.set('difficulty', input.difficulty);
  if (input.seed?.trim()) params.set('seed', input.seed.trim());
  return params;
}

export function getDsfExpandedReviewPackage() {
  return adminRequest<{
    generationSystem: 'reasoning-v1';
    activationMode: 'NORMAL_QUESTION_STUDIO_REVIEW';
    package: DsfExpandedPackage;
    maxBatchSize: number;
  }>('/admin/question-studio/reasoning/data-sufficiency/expanded/package', undefined, {
    fallbackMessage: 'Unable to load the expanded Data Sufficiency Question Studio package.',
  });
}

export function getDsfExpandedReviewStatus() {
  return adminRequest<DsfExpandedStatus>(
    '/admin/question-studio/reasoning/data-sufficiency/expanded/status',
    undefined,
    { fallbackMessage: 'Unable to load expanded Data Sufficiency Question Studio status.' },
  );
}

export function previewDsfExpandedReview(input: DsfExpandedReviewInput) {
  return adminRequest<{
    packageId: 'DSF-001-EXPANDED-REVIEW';
    runtimeMode: 'EXPANDED_REVIEW';
    integrationCheckpointId: 'DSF-CP-017';
    integrationAuthority: string;
    questionCount: number;
    questions: DsfExpandedQuestion[];
    productionEligible: false;
    manualReviewRequired: true;
    questionBankStatus: 'NOT_STORED';
    questionBankWritable: false;
    testEligibility: 'INELIGIBLE';
    testEligible: false;
    mockTestEligible: false;
    publiclyPublishable: false;
    automaticStudentPublication: false;
  }>(`/admin/question-studio/reasoning/data-sufficiency/expanded/preview?${paramsFor(input).toString()}`, undefined, {
    fallbackMessage: 'Unable to preview expanded Data Sufficiency questions.',
  });
}

export function createDsfExpandedReviewRun(input: DsfExpandedReviewInput) {
  return adminRequest<{
    id: string;
    publicCode: string;
    status: 'review';
    itemCount: number;
    generationSystem: 'reasoning-v1';
    chapter: 'Data Sufficiency';
    generationScope: 'EXPANDED_REVIEW';
    packageId: 'DSF-001-EXPANDED-REVIEW';
    qlId: 'DSF-QL-001';
    integrationCheckpointId: 'DSF-CP-017';
    integrationAuthority: string;
    language: 'en';
    manualReviewRequired: true;
    questionBankStatus: 'NOT_STORED';
    questionBankWritable: false;
    testEligibility: 'INELIGIBLE';
    testEligible: false;
    mockTestEligible: false;
    publiclyPublishable: false;
    automaticStudentPublication: false;
  }>('/admin/question-studio/reasoning/data-sufficiency/expanded/runs', {
    method: 'POST',
    body: JSON.stringify({ ...input, language: 'en', qlId: 'DSF-QL-001' }),
  }, {
    fallbackMessage: 'Unable to create the expanded Data Sufficiency review run.',
  });
}

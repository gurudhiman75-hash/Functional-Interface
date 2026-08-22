import { adminRequest } from '@/lib/admin-request';

export type AlgebraReviewLanguage = 'en' | 'hi' | 'pa';
export type AlgebraReviewDifficulty = 'Easy' | 'Medium' | 'Hard';
export type AlgebraReviewExamProfile = 'SSC_CORE' | 'SSC_ADVANCED' | 'BANKING' | 'PUNJAB_STATE';

export interface AlgebraReviewPattern {
  qlId: string;
  packageId: 'ALG-001' | 'ALG-002';
  cpId: string;
  title: string;
  prototypeId: string;
  variantIndex: number;
  solveModeId: string;
  evidenceLevel: string;
}

export interface AlgebraCanonicalProblem {
  cpId: string;
  title: string;
  qlCount: number;
  patternCount: number;
}

export interface AlgebraReviewQuestion {
  packageId: 'ALG-001' | 'ALG-002';
  cpId: string;
  patternId: string;
  qlId: string;
  prototypeId: string;
  variantIndex: number;
  questionId: string;
  canonicalItemId: string;
  questionLanguageId: string;
  language: AlgebraReviewLanguage;
  locale: 'en-IN' | 'hi-IN' | 'pa-IN';
  examProfile: AlgebraReviewExamProfile;
  difficultyBand: AlgebraReviewDifficulty;
  stem: string;
  options: string[];
  optionDetails: Array<{
    label: 'A' | 'B' | 'C' | 'D';
    text: string;
    isCorrect: boolean;
    misconceptionId: string | null;
  }>;
  correctIndex: number;
  answer: string;
  canonicalAnswer: unknown;
  explanation: {
    steps: string[];
    shortcut: string;
    traps: string[];
  };
  solveMode: string;
  renderer: 'TEXT_MATH';
  sourceAuthority: string;
  sourceMaturity: string;
  sourceReviewStatus: string;
  integrationAuthority: string;
  deliveryAuthority: string;
  validation: {
    valid: boolean;
    fourDistinctOptions: boolean;
    exactlyOneCorrect: boolean;
    answerParity: boolean;
    frozenSourcePreserved: boolean;
    questionBankLocked: boolean;
    testMockLocked: boolean;
    publicationLocked: boolean;
  };
  seed: string;
}

export interface AlgebraReviewPackage {
  packageId: 'ALGEBRA';
  label: string;
  integrationAuthority: string;
  deliveryAuthority: string;
  sourceFreezeAuthority: string;
  canonicalProblemCount: number;
  qlCount: number;
  patternCount: number;
  canonicalProblems: AlgebraCanonicalProblem[];
  patterns: AlgebraReviewPattern[];
  supportedLanguages: AlgebraReviewLanguage[];
  supportedDifficulties: AlgebraReviewDifficulty[];
  supportedExamProfiles: AlgebraReviewExamProfile[];
  defaultExamProfile: AlgebraReviewExamProfile;
  runtimeMode: string;
  reviewStatus: string;
  questionStudioDiscoverable: true;
  persistenceAllowed: true;
  questionBankStatus: 'NOT_STORED';
  questionBankWritable: false;
  testEligible: false;
  mockTestEligible: false;
  publiclyPublishable: false;
}

export interface AlgebraReviewInput {
  language?: AlgebraReviewLanguage;
  examProfile?: AlgebraReviewExamProfile;
  cpId?: string;
  qlId?: string;
  patternId?: string;
  difficulty?: AlgebraReviewDifficulty;
  count: number;
  seed?: string;
}

export interface AlgebraReviewStatus {
  chapter: 'Algebra';
  canonicalProblemCount: number;
  patternCount: number;
  qlCount: number;
  generationItemCount: number;
  approvedItemCount: number;
  questionBankCount: number;
  integrationAuthority: string;
  deliveryAuthority: string;
  defaultExamProfile: AlgebraReviewExamProfile;
  supportedExamProfiles: AlgebraReviewExamProfile[];
  supportedLanguages: AlgebraReviewLanguage[];
  questionStudioDiscoverable: true;
  persistenceAllowed: true;
  reviewOnly: true;
  questionBankWritable: false;
  testEligible: false;
  mockTestEligible: false;
  publiclyPublishable: false;
}

function paramsFor(input: AlgebraReviewInput) {
  const params = new URLSearchParams({
    language: input.language ?? 'en',
    examProfile: input.examProfile ?? 'SSC_CORE',
    count: String(input.count),
  });
  if (input.cpId) params.set('cpId', input.cpId);
  if (input.qlId) params.set('qlId', input.qlId);
  if (input.patternId) params.set('patternId', input.patternId);
  if (input.difficulty) params.set('difficulty', input.difficulty);
  if (input.seed?.trim()) params.set('seed', input.seed.trim());
  return params;
}

export function getAlgebraReviewPackage() {
  return adminRequest<{
    generationSystem: 'quant-v4';
    activationMode: 'QUESTION_STUDIO_CONNECTED';
    package: AlgebraReviewPackage;
    maxBatchSize: number;
    reviewOnly: true;
    questionBankWriteEnabled: false;
  }>('/admin/question-studio/quant/algebra/package', undefined, {
    fallbackMessage: 'Unable to load the Algebra Question Studio package.',
  });
}

export function previewAlgebraReview(input: AlgebraReviewInput) {
  return adminRequest<{
    questionCount: number;
    questions: AlgebraReviewQuestion[];
    productionEligible: false;
    reviewOnly: true;
    questionBankWritable: false;
    testEligible: false;
    mockTestEligible: false;
    publiclyPublishable: false;
  }>(`/admin/question-studio/quant/algebra/preview?${paramsFor(input).toString()}`, undefined, {
    fallbackMessage: 'Unable to preview Algebra questions.',
  });
}

export function createAlgebraReviewRun(input: AlgebraReviewInput) {
  return adminRequest<{
    id: string;
    publicCode: string;
    status: 'review';
    itemCount: number;
    generationSystem: 'quant-v4';
    chapter: 'Algebra';
    examProfile: AlgebraReviewExamProfile;
    language: AlgebraReviewLanguage;
    reviewOnly: true;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
  }>('/admin/question-studio/quant/algebra/runs', {
    method: 'POST',
    body: JSON.stringify({
      ...input,
      language: input.language ?? 'en',
      examProfile: input.examProfile ?? 'SSC_CORE',
    }),
  }, { fallbackMessage: 'Unable to create an Algebra Question Studio review run.' });
}

export function getAlgebraReviewStatus() {
  return adminRequest<AlgebraReviewStatus>(
    '/admin/question-studio/quant/algebra/status',
    undefined,
    { fallbackMessage: 'Unable to load Algebra Question Studio status.' },
  );
}

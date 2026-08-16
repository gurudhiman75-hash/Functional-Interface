import { adminRequest } from '@/lib/admin-request';

export type MensurationReviewLanguage = 'en';
export type MensurationReviewDifficulty = 'Easy' | 'Medium' | 'Hard';
export type MensurationPatternKind = 'QL' | 'PROTOTYPE';

export interface MensurationReviewPattern {
  packageId: 'MEN-001' | 'MEN-002';
  cpId: string;
  patternId: string;
  patternKind: MensurationPatternKind;
  qlId: string | null;
  title: string;
}

export interface MensurationCanonicalProblem {
  cpId: string;
  packageId: 'MEN-001' | 'MEN-002';
  title: string;
  patternCount: number;
  qlCount: number;
  prototypeCount: number;
}

export interface MensurationReviewQuestion {
  packageId: 'MEN-001' | 'MEN-002';
  cpId: string;
  patternId: string;
  patternKind: MensurationPatternKind;
  qlId: string | null;
  questionId: string;
  canonicalItemId: string;
  questionLanguageId: string;
  language: MensurationReviewLanguage;
  locale: string;
  difficultyBand: MensurationReviewDifficulty;
  stem: string;
  options: string[];
  optionDetails: Array<{
    label: string;
    text: string;
    isCorrect: boolean;
    misconceptionId: string | null;
  }>;
  correctIndex: number;
  answer: string;
  explanation: {
    steps: string[];
    shortcut: string;
    traps: string[];
  };
  solveMode: string;
  renderer: 'TEXT_MATH';
  integrationAuthority: string;
  validation: {
    valid: boolean;
    fourDistinctOptions: boolean;
    exactlyOneCorrect: boolean;
    answerParity: boolean;
    teachingStepsPresent: boolean;
    sourceLifecycleLocked: boolean;
  };
  sourceAuthority: string;
  sourceReviewStatus: string;
  sourceMaturity: string;
  seed: string;
}

export interface MensurationReviewPackage {
  packageId: 'MENSURATION';
  label: string;
  canonicalProblems: MensurationCanonicalProblem[];
  patterns: MensurationReviewPattern[];
  canonicalProblemCount: 13;
  patternCount: number;
  qlCount: number;
  prototypeCount: number;
  supportedLanguages: MensurationReviewLanguage[];
  supportedDifficulties: MensurationReviewDifficulty[];
  runtimeMode: string;
  reviewStatus: string;
  integrationAuthority: string;
  questionStudioDiscoverable: true;
  persistenceAllowed: true;
  questionBankStatus: 'NOT_STORED';
  questionBankWritable: false;
  publiclyPublishable: false;
}

export interface MensurationReviewInput {
  language?: MensurationReviewLanguage;
  cpId?: string;
  patternId?: string;
  difficulty?: MensurationReviewDifficulty;
  count: number;
  seed?: string;
}

export interface MensurationReviewStatus {
  chapter: 'Mensuration';
  canonicalProblemCount: number;
  patternCount: number;
  qlCount: number;
  prototypeCount: number;
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

function paramsFor(input: MensurationReviewInput) {
  const params = new URLSearchParams({ language: input.language ?? 'en', count: String(input.count) });
  if (input.cpId) params.set('cpId', input.cpId);
  if (input.patternId) params.set('patternId', input.patternId);
  if (input.difficulty) params.set('difficulty', input.difficulty);
  if (input.seed?.trim()) params.set('seed', input.seed.trim());
  return params;
}

export function getMensurationReviewPackage() {
  return adminRequest<{
    generationSystem: 'quant-v4';
    activationMode: 'QUESTION_STUDIO_CONNECTED';
    package: MensurationReviewPackage;
  }>('/admin/question-studio/quant/mensuration/package', undefined, {
    fallbackMessage: 'Unable to load the Mensuration Question Studio package.',
  });
}

export function previewMensurationReview(input: MensurationReviewInput) {
  return adminRequest<{
    questions: MensurationReviewQuestion[];
    productionEligible: false;
    reviewOnly: true;
  }>(`/admin/question-studio/quant/mensuration/preview?${paramsFor(input).toString()}`, undefined, {
    fallbackMessage: 'Unable to preview Mensuration questions.',
  });
}

export function createMensurationReviewRun(input: MensurationReviewInput) {
  return adminRequest<{
    id: string | null;
    publicCode: string | null;
    status: string;
    itemCount: number;
    generationSystem: 'quant-v4';
    chapter: 'Mensuration';
    reviewOnly: true;
  }>('/admin/question-studio/quant/mensuration/runs', {
    method: 'POST',
    body: JSON.stringify({ ...input, language: input.language ?? 'en' }),
  }, { fallbackMessage: 'Unable to create a Mensuration Question Studio run.' });
}

export function getMensurationReviewStatus() {
  return adminRequest<MensurationReviewStatus>(
    '/admin/question-studio/quant/mensuration/status',
    undefined,
    { fallbackMessage: 'Unable to load Mensuration Question Studio status.' },
  );
}

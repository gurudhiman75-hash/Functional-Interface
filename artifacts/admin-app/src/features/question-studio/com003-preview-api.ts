import { adminRequest } from '@/lib/admin-request';

export type Com003PreviewLanguage = 'en' | 'hi' | 'pa';

export interface Com003PreviewQuestion {
  id: string;
  sourceQuestionId: string;
  packageId: 'COM-003';
  chapterCode: 'COM-003';
  subject: 'Computer Awareness';
  topic: 'Office & Productivity Software';
  patternId: string;
  qlId: string;
  cpId: string;
  language: Com003PreviewLanguage;
  locale: 'en-IN' | 'hi-IN' | 'pa-IN';
  surfaceMode: string;
  targetFactId: string;
  stem: string;
  options: string[];
  correctIndex: number;
  answer: string;
  canonicalAnswer: string;
  explanation: string;
  sourceIds: string[];
  sourceFactIds: string[];
  versionScoped: boolean;
  solverAuthority: 'CANONICAL_FACT_RELATION';
  corpusStatus: 'FROZEN';
  registrationStatus: 'NOT_REGISTERED';
  preRegistrationOnly: true;
  questionStudioDiscoverable: false;
  readOnly: true;
  questionBankStatus: 'NOT_STORED';
  testEligibility: 'INELIGIBLE';
  publiclyPublishable: false;
  productionReleased: false;
}

export interface Com003PreviewResponse {
  capability: Record<string, unknown>;
  generationContext: {
    corpusAuthorityId: string;
    packageId: 'COM-003';
    chapterCode: 'COM-003';
    requestedQlId: string | null;
    requestedCpId: string | null;
    seed: string;
    count: number;
    candidatePoolSize: number;
    selectionMode: 'FROZEN_CORPUS_DETERMINISTIC_WITHOUT_REPLACEMENT';
    language: Com003PreviewLanguage;
    stagingStatus: 'FROZEN_PRE_REGISTRATION';
    registrationStatus: 'NOT_REGISTERED';
    questionStudioDiscoverable: false;
    preRegistrationOnly: true;
    readOnly: true;
    questionBankStatus: 'NOT_STORED';
    testEligibility: 'INELIGIBLE';
    publiclyPublishable: false;
    productionReleased: false;
  };
  questions: Com003PreviewQuestion[];
  trace: Array<{
    questionIndex: number;
    sourceQuestionId: string;
    localizedArtifactId: string;
    qlId: string;
    cpId: string;
    language: Com003PreviewLanguage;
    targetFactId: string;
    sourceFactIds: string[];
    sourceIds: string[];
    versionScoped: boolean;
    correctIndex: number;
    solverAuthority: 'CANONICAL_FACT_RELATION';
  }>;
  integrationAuthority: string;
  activationMode: 'READ_ONLY_PRE_REGISTRATION';
  persistenceAllowed: false;
  questionStudioRegistered: false;
  questionStudioDiscoverable: false;
  questionBankWritable: false;
  testEligible: false;
  publiclyPublishable: false;
  productionReleased: false;
}

export interface Com003PackageResponse {
  generationSystem: 'static-knowledge-frozen-corpus';
  activationMode: 'READ_ONLY_PRE_REGISTRATION';
  package: Record<string, unknown>;
  integrationAuthority: Record<string, unknown>;
  qlCount: 19;
  frozenQuestionsPerLanguage: 228;
  frozenQuestionLanguageArtifacts: 684;
  supportedLanguages: Com003PreviewLanguage[];
  databaseWriteEnabled: false;
  persistenceAllowed: false;
  questionStudioRegistrationStatus: 'PRE_REGISTRATION_PREVIEW_ONLY';
  questionStudioDiscoverable: false;
  questionBankWriteEnabled: false;
  testEligible: false;
  publiclyPublishable: false;
  productionReleased: false;
  difficultyFilteringAuthorized: false;
}

export interface Com003StatusResponse {
  packageId: 'COM-003';
  chapterTitle: 'Office & Productivity Software';
  qlCount: 19;
  englishFrozen: true;
  localizationFrozen: true;
  frozenEnglishQuestionCount: 228;
  frozenHindiQuestionCount: 228;
  frozenPunjabiQuestionCount: 228;
  frozenQuestionLanguageArtifactCount: 684;
  integrationAuthority: string;
  previewConnectionAuthorized: true;
  questionStudioRegistrationStatus: 'PRE_REGISTRATION_PREVIEW_ONLY';
  questionStudioRegistered: false;
  questionStudioDiscoverable: false;
  databaseWriteEnabled: false;
  persistenceAllowed: false;
  questionBankWritable: false;
  testEligible: false;
  publiclyPublishable: false;
  automaticStudentPublication: false;
  productionReleased: false;
  nextGate: string;
}

export interface Com003PreviewRequest {
  qlId?: string;
  cpId?: string;
  language?: Com003PreviewLanguage;
  seed?: string;
  count?: number;
}

export function getCom003QuestionStudioPackage() {
  return adminRequest<Com003PackageResponse>(
    '/admin/question-studio/computer/com003/package',
    undefined,
    { fallbackMessage: 'Unable to load COM-003 frozen package metadata.' },
  );
}

export function getCom003QuestionStudioStatus() {
  return adminRequest<Com003StatusResponse>(
    '/admin/question-studio/computer/com003/status',
    undefined,
    { fallbackMessage: 'Unable to load COM-003 preview status.' },
  );
}

export function previewCom003QuestionStudio(input: Com003PreviewRequest) {
  const params = new URLSearchParams();
  if (input.qlId) params.set('qlId', input.qlId);
  if (input.cpId) params.set('cpId', input.cpId);
  if (input.language) params.set('language', input.language);
  if (input.seed) params.set('seed', input.seed);
  if (input.count !== undefined) params.set('count', String(input.count));
  const suffix = params.toString();
  return adminRequest<Com003PreviewResponse>(
    `/admin/question-studio/computer/com003/preview${suffix ? `?${suffix}` : ''}`,
    undefined,
    { fallbackMessage: 'Unable to preview COM-003 frozen questions.' },
  );
}

import { apiRequest, uploadFile } from '@/services/api/client';
import type {
  ContradictionGroup,
  CorpusDoc,
  Fact,
  LocalizedNotes,
  NoteStatus,
  NoteVersion,
  Period,
  StyleSpec,
} from '../domain/types';
import type {
  CreatePeriodCommand,
  GenerateNoteCommand,
  RegisterCorpusCommand,
  ResolveContradictionCommand,
} from './commands';

const BASE = '/admin/notes-studio-v2';

export interface NotesStudioV2Workspace {
  period: Period;
  corpus: CorpusDoc[];
  facts: Fact[];
  contradictions: ContradictionGroup[];
  styleSpec: StyleSpec | null;
  notes: Array<{
    id: string;
    periodId: string;
    subCategoryId?: string;
    level: 'topic' | 'subcategory';
    currentVersionId?: string;
  }>;
  noteVersions: NoteVersion[];
}

export interface ExtractionResponse {
  corpusDocId: string;
  facts: Fact[];
  reusedExistingExtraction?: boolean;
}

export interface ReconciliationResponse {
  periodId: string;
  facts: Fact[];
  contradictions: ContradictionGroup[];
}

export interface StyleBootstrapVariant {
  label: string;
  content: string;
}

export interface StyleBootstrapRoundResponse {
  id: string;
  styleSpecId: string;
  roundNumber: number;
  variants: StyleBootstrapVariant[];
  selectedVariantLabel?: string;
  adminEdits?: string;
  converged: boolean;
}

export interface QualityFinding {
  code: string;
  severity: 'blocker' | 'warning';
  message: string;
  language?: 'en' | 'hi' | 'pa';
  factId?: string;
  corpusDocId?: string;
  locator?: string;
  score?: number;
}

export interface QualityGateResult {
  key: 'factual-accuracy' | 'originality' | 'style-consistency' | 'exam-relevance';
  passed: boolean;
  score?: number;
  findings: QualityFinding[];
}

export interface QualityResponse {
  id: string;
  noteVersionId: string;
  reviewReady: boolean;
  gates: QualityGateResult[];
  checkerVersion: string;
  modelMetadata?: Record<string, unknown>;
  createdBy?: string;
  createdAt: string;
}

export interface GenerateNoteResponse {
  noteId: string;
  version: NoteVersion;
  languagesGenerated: Array<'en' | 'hi' | 'pa'>;
}

export interface CorpusUploadResponse {
  corpusDoc: CorpusDoc;
  facts: Array<{
    id: string;
    subCategoryId: string;
    subCategory: string;
    claim: string;
    entities: string[];
    dateOrEra?: string;
    locator: string;
    extractedText: string;
  }>;
  extraction: {
    provider: string;
    model: string;
    usage: { inputTokens: number; outputTokens: number; totalTokens: number };
    metadata?: Record<string, unknown>;
  };
  rawFilePersisted: false;
}

export interface ExamFrequencySummary {
  periodId: string;
  high: number;
  medium: number;
  low: number;
  untagged: number;
  total: number;
  advisoryOnly: true;
  filtersGeneration: false;
}

export function listPeriods() {
  return apiRequest<Period[]>(`${BASE}/periods`);
}

export function createPeriod(command: CreatePeriodCommand) {
  return apiRequest<Period>(`${BASE}/periods`, {
    method: 'POST',
    body: command,
  });
}

export function getWorkspace(periodId: string) {
  return apiRequest<NotesStudioV2Workspace>(`${BASE}/periods/${periodId}/workspace`);
}

export async function uploadCorpusSource(periodId: string, file: File | Blob) {
  return uploadFile(`${BASE}/periods/${periodId}/corpus/upload`, file) as Promise<CorpusUploadResponse>;
}

export function registerCorpusSource(periodId: string, command: RegisterCorpusCommand) {
  return apiRequest<CorpusDoc>(`${BASE}/periods/${periodId}/corpus`, {
    method: 'POST',
    body: command,
  });
}

export function updateCorpusMetadata(corpusDocId: string, input: {
  title?: string;
  sourceType?: CorpusDoc['sourceType'];
  subCategoryHints?: string[];
}) {
  return apiRequest<CorpusDoc>(`${BASE}/corpus/${corpusDocId}/metadata`, {
    method: 'PATCH',
    body: input,
  });
}

export function extractCorpusFacts(corpusDocId: string) {
  return apiRequest<ExtractionResponse>(`${BASE}/corpus/${corpusDocId}/extract`, {
    method: 'POST',
    body: {},
  });
}

export function updateFactExamFrequency(factId: string, examFrequency: Fact['examFrequency'] | null) {
  return apiRequest<Fact & { examFrequencyIsAdvisory: true; generationEligibilityChanged: false }>(
    `${BASE}/facts/${factId}/exam-frequency`,
    { method: 'PATCH', body: { examFrequency } },
  );
}

export function getExamFrequencySummary(periodId: string) {
  return apiRequest<ExamFrequencySummary>(`${BASE}/periods/${periodId}/exam-frequency-summary`);
}

export function reconcilePeriod(periodId: string) {
  return apiRequest<ReconciliationResponse>(`${BASE}/periods/${periodId}/reconcile`, {
    method: 'POST',
    body: {},
  });
}

export function resolveContradiction(groupId: string, command: ResolveContradictionCommand) {
  return apiRequest<ContradictionGroup>(`${BASE}/contradictions/${groupId}/resolve`, {
    method: 'POST',
    body: command,
  });
}

export function getActiveStyleSpec() {
  return apiRequest<StyleSpec | null>(`${BASE}/style-specs/active`);
}

export function createStyleSpec(input: {
  name: string;
  tone?: string;
  sentenceLength?: 'short' | 'medium' | 'mixed';
  terminologyConventions?: Record<string, string>;
  exampleStructure?: string;
  avoid?: string[];
}) {
  return apiRequest<StyleSpec>(`${BASE}/style-specs`, {
    method: 'POST',
    body: input,
  });
}

export function createStyleBootstrapRound(input: {
  styleSpecId: string;
  periodId: string;
  subCategoryId: string;
  roughTone: string;
}) {
  return apiRequest<StyleBootstrapRoundResponse>(`${BASE}/style-specs/${input.styleSpecId}/bootstrap-rounds`, {
    method: 'POST',
    body: {
      periodId: input.periodId,
      subCategoryId: input.subCategoryId,
      roughTone: input.roughTone,
    },
  });
}

export function reviewStyleBootstrapRound(styleSpecId: string, roundId: string, input: {
  selectedVariantLabel: string;
  adminEdits?: string;
}) {
  return apiRequest<StyleBootstrapRoundResponse>(`${BASE}/style-specs/${styleSpecId}/bootstrap-rounds/${roundId}`, {
    method: 'PATCH',
    body: input,
  });
}

export function activateStyleSpec(styleSpecId: string) {
  return apiRequest<StyleSpec>(`${BASE}/style-specs/${styleSpecId}/activate`, {
    method: 'POST',
    body: {},
  });
}

/**
 * The browser sends only target identifiers and languages. The API server rebuilds
 * the eligible fact graph from notes_studio_v2.* and never accepts source prose here.
 */
export function generateNote(command: GenerateNoteCommand) {
  return apiRequest<GenerateNoteResponse>(`${BASE}/notes/generate`, {
    method: 'POST',
    body: command,
  });
}

/**
 * Quality is persisted as immutable review evidence. Factual/style AI evaluation
 * receives the distilled fact graph and StyleSpec; verification spans remain on
 * the separate deterministic originality path.
 */
export function runQualityGates(noteVersionId: string) {
  return apiRequest<QualityResponse>(`${BASE}/note-versions/${noteVersionId}/quality/persisted`, {
    method: 'POST',
    body: {},
  });
}

export function getLatestQualityRun(noteVersionId: string) {
  return apiRequest<QualityResponse | null>(`${BASE}/note-versions/${noteVersionId}/quality/latest`);
}

export function submitNoteForReview(noteVersionId: string) {
  return apiRequest<NoteVersion>(`${BASE}/note-versions/${noteVersionId}/submit-review`, {
    method: 'POST',
    body: {},
  });
}

export function publishNoteVersion(noteVersionId: string) {
  return apiRequest<NoteVersion>(`${BASE}/note-versions/${noteVersionId}/publish`, {
    method: 'POST',
    body: {},
  });
}

export function createRevision(noteId: string) {
  return apiRequest<NoteVersion>(`${BASE}/notes/${noteId}/revisions`, {
    method: 'POST',
    body: {},
  });
}

export function updateDraftBlocks(noteVersionId: string, blocksByLanguage: LocalizedNotes) {
  return apiRequest<NoteVersion>(`${BASE}/note-versions/${noteVersionId}`, {
    method: 'PATCH',
    body: { blocksByLanguage },
  });
}

export function updateNoteStatus(noteVersionId: string, status: Exclude<NoteStatus, 'published'>) {
  return apiRequest<NoteVersion>(`${BASE}/note-versions/${noteVersionId}`, {
    method: 'PATCH',
    body: { status },
  });
}

export function attachFigure(figureId: string, svgRef: string) {
  return apiRequest<{ id: string; status: 'created'; svgRef: string }>(`${BASE}/figures/${figureId}`, {
    method: 'PATCH',
    body: { svgRef },
  });
}

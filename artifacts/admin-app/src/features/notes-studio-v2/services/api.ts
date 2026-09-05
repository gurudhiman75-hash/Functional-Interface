import { getFirebaseAuth } from '@/integrations/firebase';
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
const configuredBase = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
const apiBase = (configuredBase || '/api').replace(/\/$/, '');

type JsonRequestInit = Omit<RequestInit, 'body'> & { body?: unknown };

async function getToken() {
  const auth = getFirebaseAuth();
  const user = auth?.currentUser;
  if (!user) throw new Error('Your ExamTree admin session has expired. Sign in again.');
  return user.getIdToken();
}

export async function notesStudioV2Request<T>(path: string, init?: JsonRequestInit): Promise<T> {
  const token = await getToken();
  const hasBody = init?.body !== undefined;
  const response = await fetch(`${apiBase}${path}`, {
    ...init,
    body: hasBody ? JSON.stringify(init?.body) : undefined,
    headers: {
      ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
      Authorization: `Bearer ${token}`,
      ...init?.headers,
    },
  });
  const body = await response.json().catch(() => null) as ({ error?: string } & T) | null;
  if (!response.ok) throw new Error(body?.error || `Notes Studio v2 request failed (${response.status}).`);
  if (body === null) throw new Error('Notes Studio v2 API returned an empty response.');
  return body;
}

async function uploadPdf<T>(path: string, file: File | Blob): Promise<T> {
  const token = await getToken();
  const form = new FormData();
  form.append('file', file, file instanceof File ? file.name : 'source.pdf');
  const response = await fetch(`${apiBase}${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const body = await response.json().catch(() => null) as ({ error?: string } & T) | null;
  if (!response.ok) throw new Error(body?.error || `Notes Studio v2 upload failed (${response.status}).`);
  if (body === null) throw new Error('Notes Studio v2 upload returned an empty response.');
  return body;
}

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
  return notesStudioV2Request<Period[]>(`${BASE}/periods`);
}

export function createPeriod(command: CreatePeriodCommand) {
  return notesStudioV2Request<Period>(`${BASE}/periods`, { method: 'POST', body: command });
}

export function getWorkspace(periodId: string) {
  return notesStudioV2Request<NotesStudioV2Workspace>(`${BASE}/periods/${periodId}/workspace`);
}

export function uploadCorpusSource(periodId: string, file: File | Blob) {
  return uploadPdf<CorpusUploadResponse>(`${BASE}/periods/${periodId}/corpus/upload`, file);
}

export function registerCorpusSource(periodId: string, command: RegisterCorpusCommand) {
  return notesStudioV2Request<CorpusDoc>(`${BASE}/periods/${periodId}/corpus`, { method: 'POST', body: command });
}

export function updateCorpusMetadata(corpusDocId: string, input: {
  title?: string;
  sourceType?: CorpusDoc['sourceType'];
  subCategoryHints?: string[];
}) {
  return notesStudioV2Request<CorpusDoc>(`${BASE}/corpus/${corpusDocId}/metadata`, { method: 'PATCH', body: input });
}

export function extractCorpusFacts(corpusDocId: string) {
  return notesStudioV2Request<ExtractionResponse>(`${BASE}/corpus/${corpusDocId}/extract`, { method: 'POST', body: {} });
}

export function updateFactExamFrequency(factId: string, examFrequency: Fact['examFrequency'] | null) {
  return notesStudioV2Request<Fact & { examFrequencyIsAdvisory: true; generationEligibilityChanged: false }>(
    `${BASE}/facts/${factId}/exam-frequency`,
    { method: 'PATCH', body: { examFrequency } },
  );
}

export function getExamFrequencySummary(periodId: string) {
  return notesStudioV2Request<ExamFrequencySummary>(`${BASE}/periods/${periodId}/exam-frequency-summary`);
}

export function reconcilePeriod(periodId: string) {
  return notesStudioV2Request<ReconciliationResponse>(`${BASE}/periods/${periodId}/reconcile`, { method: 'POST', body: {} });
}

export function resolveContradiction(groupId: string, command: ResolveContradictionCommand) {
  return notesStudioV2Request<ContradictionGroup>(`${BASE}/contradictions/${groupId}/resolve`, { method: 'POST', body: command });
}

export function getActiveStyleSpec() {
  return notesStudioV2Request<StyleSpec | null>(`${BASE}/style-specs/active`);
}

export function createStyleSpec(input: {
  name: string;
  tone?: string;
  sentenceLength?: 'short' | 'medium' | 'mixed';
  terminologyConventions?: Record<string, string>;
  exampleStructure?: string;
  avoid?: string[];
}) {
  return notesStudioV2Request<StyleSpec>(`${BASE}/style-specs`, { method: 'POST', body: input });
}

export function createStyleBootstrapRound(input: {
  styleSpecId: string;
  periodId: string;
  subCategoryId: string;
  roughTone: string;
}) {
  return notesStudioV2Request<StyleBootstrapRoundResponse>(`${BASE}/style-specs/${input.styleSpecId}/bootstrap-rounds`, {
    method: 'POST',
    body: { periodId: input.periodId, subCategoryId: input.subCategoryId, roughTone: input.roughTone },
  });
}

export function reviewStyleBootstrapRound(styleSpecId: string, roundId: string, input: {
  selectedVariantLabel: string;
  adminEdits?: string;
}) {
  return notesStudioV2Request<StyleBootstrapRoundResponse>(`${BASE}/style-specs/${styleSpecId}/bootstrap-rounds/${roundId}`, {
    method: 'PATCH', body: input,
  });
}

export function activateStyleSpec(styleSpecId: string) {
  return notesStudioV2Request<StyleSpec>(`${BASE}/style-specs/${styleSpecId}/activate`, { method: 'POST', body: {} });
}

export function generateNote(command: GenerateNoteCommand) {
  return notesStudioV2Request<GenerateNoteResponse>(`${BASE}/notes/generate`, { method: 'POST', body: command });
}

export function runQualityGates(noteVersionId: string) {
  return notesStudioV2Request<QualityResponse>(`${BASE}/note-versions/${noteVersionId}/quality/persisted`, { method: 'POST', body: {} });
}

export function getLatestQualityRun(noteVersionId: string) {
  return notesStudioV2Request<QualityResponse | null>(`${BASE}/note-versions/${noteVersionId}/quality/latest`);
}

export function submitNoteForReview(noteVersionId: string) {
  return notesStudioV2Request<NoteVersion>(`${BASE}/note-versions/${noteVersionId}/submit-review`, { method: 'POST', body: {} });
}

export function publishNoteVersion(noteVersionId: string) {
  return notesStudioV2Request<NoteVersion>(`${BASE}/note-versions/${noteVersionId}/publish`, { method: 'POST', body: {} });
}

export function createRevision(noteId: string) {
  return notesStudioV2Request<NoteVersion>(`${BASE}/notes/${noteId}/revisions`, { method: 'POST', body: {} });
}

export function updateDraftBlocks(noteVersionId: string, blocksByLanguage: LocalizedNotes) {
  return notesStudioV2Request<NoteVersion>(`${BASE}/note-versions/${noteVersionId}`, { method: 'PATCH', body: { blocksByLanguage } });
}

export function updateNoteStatus(noteVersionId: string, status: Exclude<NoteStatus, 'published'>) {
  return notesStudioV2Request<NoteVersion>(`${BASE}/note-versions/${noteVersionId}`, { method: 'PATCH', body: { status } });
}

export function attachFigure(figureId: string, svgRef: string) {
  return notesStudioV2Request<{ id: string; status: 'created'; svgRef: string }>(`${BASE}/figures/${figureId}`, { method: 'PATCH', body: { svgRef } });
}

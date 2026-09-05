import type { LocalizedNotes } from '../domain/types';
import type {
  CreatePeriodCommand,
  GenerateNoteCommand,
  RegisterCorpusCommand,
  ResolveContradictionCommand,
} from './commands';
import * as api from './api';
import * as reviewStateApi from './reviewStateApi';

export interface NotesStudioV2Repository {
  listPeriods: typeof api.listPeriods;
  createPeriod: (command: CreatePeriodCommand) => ReturnType<typeof api.createPeriod>;
  getWorkspace: typeof api.getWorkspace;
  uploadCorpusSource: typeof api.uploadCorpusSource;
  registerCorpusSource: (periodId: string, command: RegisterCorpusCommand) => ReturnType<typeof api.registerCorpusSource>;
  updateCorpusMetadata: typeof api.updateCorpusMetadata;
  extractCorpusFacts: typeof api.extractCorpusFacts;
  updateFactExamFrequency: typeof api.updateFactExamFrequency;
  getExamFrequencySummary: typeof api.getExamFrequencySummary;
  reconcilePeriod: typeof api.reconcilePeriod;
  resolveContradiction: (groupId: string, command: ResolveContradictionCommand) => ReturnType<typeof api.resolveContradiction>;
  getActiveStyleSpec: typeof api.getActiveStyleSpec;
  createStyleSpec: typeof api.createStyleSpec;
  createStyleBootstrapRound: typeof api.createStyleBootstrapRound;
  reviewStyleBootstrapRound: typeof api.reviewStyleBootstrapRound;
  activateStyleSpec: typeof api.activateStyleSpec;
  getStyleBootstrapState: typeof reviewStateApi.getStyleBootstrapState;
  listPeriodFigures: typeof reviewStateApi.listPeriodFigures;
  generateNote: (command: GenerateNoteCommand) => ReturnType<typeof api.generateNote>;
  runQualityGates: typeof api.runQualityGates;
  getLatestQualityRun: typeof api.getLatestQualityRun;
  submitNoteForReview: typeof api.submitNoteForReview;
  publishNoteVersion: typeof api.publishNoteVersion;
  createRevision: typeof api.createRevision;
  updateDraftBlocks: (noteVersionId: string, blocks: LocalizedNotes) => ReturnType<typeof api.updateDraftBlocks>;
  attachFigure: typeof api.attachFigure;
}

type WorkspaceValue = Awaited<ReturnType<typeof api.getWorkspace>>;

const WORKSPACE_RENDER_BURST_TTL_MS = 1_000;
const inFlightWorkspaceReads = new Map<string, ReturnType<typeof api.getWorkspace>>();
const recentWorkspaceReads = new Map<string, { value: WorkspaceValue; expiresAt: number }>();

function invalidateWorkspaceReadCache() {
  recentWorkspaceReads.clear();
}

function getWorkspace(periodId: string): ReturnType<typeof api.getWorkspace> {
  const cached = recentWorkspaceReads.get(periodId);
  if (cached && cached.expiresAt > Date.now()) {
    return Promise.resolve(cached.value);
  }
  if (cached) recentWorkspaceReads.delete(periodId);

  const inFlight = inFlightWorkspaceReads.get(periodId);
  if (inFlight) return inFlight;

  const request = api.getWorkspace(periodId)
    .then((value) => {
      recentWorkspaceReads.set(periodId, {
        value,
        expiresAt: Date.now() + WORKSPACE_RENDER_BURST_TTL_MS,
      });
      return value;
    })
    .finally(() => {
      if (inFlightWorkspaceReads.get(periodId) === request) {
        inFlightWorkspaceReads.delete(periodId);
      }
    });

  inFlightWorkspaceReads.set(periodId, request);
  return request;
}

async function withWorkspaceInvalidation<T>(request: () => Promise<T>): Promise<T> {
  invalidateWorkspaceReadCache();
  try {
    return await request();
  } finally {
    invalidateWorkspaceReadCache();
  }
}

export const httpNotesStudioV2Repository: NotesStudioV2Repository = {
  listPeriods: api.listPeriods,
  createPeriod: (command) => withWorkspaceInvalidation(() => api.createPeriod(command)),
  getWorkspace,
  uploadCorpusSource: (...args) => withWorkspaceInvalidation(() => api.uploadCorpusSource(...args)),
  registerCorpusSource: (periodId, command) => withWorkspaceInvalidation(() => api.registerCorpusSource(periodId, command)),
  updateCorpusMetadata: (...args) => withWorkspaceInvalidation(() => api.updateCorpusMetadata(...args)),
  extractCorpusFacts: (...args) => withWorkspaceInvalidation(() => api.extractCorpusFacts(...args)),
  updateFactExamFrequency: (...args) => withWorkspaceInvalidation(() => api.updateFactExamFrequency(...args)),
  getExamFrequencySummary: api.getExamFrequencySummary,
  reconcilePeriod: (...args) => withWorkspaceInvalidation(() => api.reconcilePeriod(...args)),
  resolveContradiction: (groupId, command) => withWorkspaceInvalidation(() => api.resolveContradiction(groupId, command)),
  getActiveStyleSpec: api.getActiveStyleSpec,
  createStyleSpec: (...args) => withWorkspaceInvalidation(() => api.createStyleSpec(...args)),
  createStyleBootstrapRound: (...args) => withWorkspaceInvalidation(() => api.createStyleBootstrapRound(...args)),
  reviewStyleBootstrapRound: (...args) => withWorkspaceInvalidation(() => api.reviewStyleBootstrapRound(...args)),
  activateStyleSpec: (...args) => withWorkspaceInvalidation(() => api.activateStyleSpec(...args)),
  getStyleBootstrapState: reviewStateApi.getStyleBootstrapState,
  listPeriodFigures: reviewStateApi.listPeriodFigures,
  generateNote: (command) => withWorkspaceInvalidation(() => api.generateNote(command)),
  runQualityGates: (...args) => withWorkspaceInvalidation(() => api.runQualityGates(...args)),
  getLatestQualityRun: api.getLatestQualityRun,
  submitNoteForReview: (...args) => withWorkspaceInvalidation(() => api.submitNoteForReview(...args)),
  publishNoteVersion: (...args) => withWorkspaceInvalidation(() => api.publishNoteVersion(...args)),
  createRevision: (...args) => withWorkspaceInvalidation(() => api.createRevision(...args)),
  updateDraftBlocks: (noteVersionId, blocks) => withWorkspaceInvalidation(() => api.updateDraftBlocks(noteVersionId, blocks)),
  attachFigure: (...args) => withWorkspaceInvalidation(() => api.attachFigure(...args)),
};

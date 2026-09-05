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

export const httpNotesStudioV2Repository: NotesStudioV2Repository = {
  listPeriods: api.listPeriods,
  createPeriod: api.createPeriod,
  getWorkspace: api.getWorkspace,
  uploadCorpusSource: api.uploadCorpusSource,
  registerCorpusSource: api.registerCorpusSource,
  updateCorpusMetadata: api.updateCorpusMetadata,
  extractCorpusFacts: api.extractCorpusFacts,
  updateFactExamFrequency: api.updateFactExamFrequency,
  getExamFrequencySummary: api.getExamFrequencySummary,
  reconcilePeriod: api.reconcilePeriod,
  resolveContradiction: api.resolveContradiction,
  getActiveStyleSpec: api.getActiveStyleSpec,
  createStyleSpec: api.createStyleSpec,
  createStyleBootstrapRound: api.createStyleBootstrapRound,
  reviewStyleBootstrapRound: api.reviewStyleBootstrapRound,
  activateStyleSpec: api.activateStyleSpec,
  getStyleBootstrapState: reviewStateApi.getStyleBootstrapState,
  listPeriodFigures: reviewStateApi.listPeriodFigures,
  generateNote: api.generateNote,
  runQualityGates: api.runQualityGates,
  getLatestQualityRun: api.getLatestQualityRun,
  submitNoteForReview: api.submitNoteForReview,
  publishNoteVersion: api.publishNoteVersion,
  createRevision: api.createRevision,
  updateDraftBlocks: api.updateDraftBlocks,
  attachFigure: api.attachFigure,
};

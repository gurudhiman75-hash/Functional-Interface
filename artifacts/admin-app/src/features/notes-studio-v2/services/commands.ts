import type { NoteLanguage, NoteLevel } from '../domain/types';

export interface GenerateNoteCommand {
  periodId: string;
  noteLevel: NoteLevel;
  subCategoryId?: string;
  languages: NoteLanguage[];
}

export function buildGenerateNoteCommand(input: {
  periodId: string;
  noteLevel: NoteLevel;
  subCategoryId?: string;
  languages?: NoteLanguage[];
}): GenerateNoteCommand {
  if (input.noteLevel === 'subcategory' && !input.subCategoryId) {
    throw new Error('Sub-category generation requires a subCategoryId.');
  }

  return {
    periodId: input.periodId,
    noteLevel: input.noteLevel,
    subCategoryId: input.noteLevel === 'subcategory' ? input.subCategoryId : undefined,
    languages: input.languages ? [...input.languages] : ['en', 'hi', 'pa'],
  };
}

export interface ResolveContradictionCommand {
  resolution: 'select' | 'qualified-merge' | 'alternate-positions';
  selectedFactId?: string;
  qualifiedClaim?: string;
  resolutionNote?: string;
}

export interface CreatePeriodCommand {
  name: string;
  orderIndex: number;
  subCategories: Array<{ name: string; orderIndex: number }>;
}

export interface RegisterCorpusCommand {
  title: string;
  sourceType: 'textbook' | 'reference' | 'academic' | 'other';
  filePath: string;
  subCategoryHints?: string[];
}

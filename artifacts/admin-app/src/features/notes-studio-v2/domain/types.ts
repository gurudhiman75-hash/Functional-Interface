export type NoteLanguage = 'en' | 'hi' | 'pa';
export type FactConfidence = 'confirmed' | 'disputed' | 'single-source';
export type ExamFrequency = 'high' | 'medium' | 'low';
export type NoteLevel = 'topic' | 'subcategory';
export type NoteStatus = 'draft' | 'in-review' | 'published';
export type SourceType = 'textbook' | 'reference' | 'academic' | 'other';

export type NoteBlock =
  | { type: 'text'; content: string }
  | { type: 'formula'; latex: string }
  | { type: 'figure'; svgRef: string | null; placeholder?: string }
  | { type: 'example'; problem: string; solution: string };

export type LocalizedNotes = Record<NoteLanguage, NoteBlock[]>;

export interface SourceRef {
  corpusDocId: string;
  locator: string;
  extractedText?: string;
}

export interface Fact {
  id: string;
  periodId: string;
  subCategoryId: string;
  subCategory: string;
  claim: string;
  entities: string[];
  dateOrEra?: string;
  sourceRefs: SourceRef[];
  confidence: FactConfidence;
  examFrequency?: ExamFrequency;
}

export interface CorpusDoc {
  id: string;
  periodId: string;
  title: string;
  sourceType: SourceType;
  subCategoryHints?: string[];
  file: string;
}

export interface PeriodSubCategory {
  id: string;
  periodId: string;
  name: string;
  orderIndex: number;
}

export interface Period {
  id: string;
  name: string;
  orderIndex: number;
  subCategories: PeriodSubCategory[];
}

export interface StyleSpec {
  id: string;
  name: string;
  tone: string;
  sentenceLength: 'short' | 'medium' | 'mixed';
  terminologyConventions: Record<string, string>;
  exampleStructure: string;
  avoid: string[];
  exemplarNoteVersionIds: string[];
  isActive: boolean;
}

export interface ContradictionGroup {
  id: string;
  periodId: string;
  subCategoryId: string;
  status: 'open' | 'resolved';
  factIds: string[];
  resolvedFactId?: string;
  resolutionNote?: string;
}

export interface NoteVersion {
  id: string;
  noteId: string;
  versionNumber: number;
  blocksByLanguage: LocalizedNotes;
  styleSpecId?: string;
  generatedFromFactIds: string[];
  status: NoteStatus;
  createdBy?: string;
  createdAt: string;
  publishedAt?: string;
}

import type { StyleSpec } from '../domain/types';
import type { StyleBootstrapRoundResponse } from './api';
import { notesStudioV2Request } from './api';

const BASE = '/admin/notes-studio-v2';

export interface StyleBootstrapState {
  styleSpec: StyleSpec;
  rounds: StyleBootstrapRoundResponse[];
  reviewedCount: number;
  canActivate: boolean;
  canGenerateAnotherRound: boolean;
}

export interface FigureReviewItem {
  id: string;
  noteVersionId: string;
  noteId: string;
  versionNumber: number;
  noteStatus: 'draft' | 'in-review' | 'published';
  noteLevel: 'topic' | 'subcategory';
  subCategoryId?: string;
  subCategory?: string;
  blockRef: string;
  placeholderDescription: string;
  svgRef?: string;
  status: 'needed' | 'created';
}

export interface FigureQueueResponse {
  periodId: string;
  neededCount: number;
  figures: FigureReviewItem[];
}

export function getStyleBootstrapState() {
  return notesStudioV2Request<StyleBootstrapState | null>(`${BASE}/style-bootstrap/state`);
}

export function listPeriodFigures(periodId: string) {
  return notesStudioV2Request<FigureQueueResponse>(`${BASE}/periods/${periodId}/figures`);
}

export const NOTES_COVERAGE_BULK_MAX_ITEMS = 50;

export const NOTES_COVERAGE_PRIORITIES = ['required', 'high', 'supporting', 'exclude'] as const;
export const NOTES_COVERAGE_DEPTHS = ['brief', 'standard', 'deep'] as const;

export type NotesCoveragePriority = typeof NOTES_COVERAGE_PRIORITIES[number];
export type NotesCoverageDepth = typeof NOTES_COVERAGE_DEPTHS[number];

export type NotesCoverageBulkItem = {
  title: string;
  syllabusRef: string;
  priority: NotesCoveragePriority;
  plannedDepth: NotesCoverageDepth;
  examRationale: string;
  sortOrder: number;
};

const editableStates = new Set(['brief', 'sources_ready', 'evidence_ready', 'outline_ready']);
const prioritySet = new Set<string>(NOTES_COVERAGE_PRIORITIES);
const depthSet = new Set<string>(NOTES_COVERAGE_DEPTHS);

export class NotesCoverageBulkValidationError extends Error {
  constructor(readonly code: string, message: string) {
    super(message);
  }
}

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function sortOrder(value: unknown, fallback: number): number {
  if (value == null || value === '') return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0 || parsed > 1_000_000) {
    throw new NotesCoverageBulkValidationError('INVALID_SORT_ORDER', 'Coverage sortOrder must be a non-negative whole number.');
  }
  return parsed;
}

export function coveragePlanBulkAllowed(state: unknown): boolean {
  return editableStates.has(String(state ?? '').trim());
}

export function coveragePlanItemKey(item: Pick<NotesCoverageBulkItem, 'title' | 'syllabusRef'>): string {
  return `${item.title.trim().toLowerCase().replace(/\s+/g, ' ')}\u0000${item.syllabusRef.trim().toLowerCase().replace(/\s+/g, ' ')}`;
}

export function normalizeCoveragePlanBulk(value: unknown): NotesCoverageBulkItem[] {
  if (!Array.isArray(value)) {
    throw new NotesCoverageBulkValidationError('COVERAGE_ITEMS_REQUIRED', 'Coverage import must contain an items array.');
  }
  if (value.length < 1 || value.length > NOTES_COVERAGE_BULK_MAX_ITEMS) {
    throw new NotesCoverageBulkValidationError(
      'COVERAGE_ITEM_COUNT_INVALID',
      `Import between 1 and ${NOTES_COVERAGE_BULK_MAX_ITEMS} coverage targets at a time.`,
    );
  }

  const normalized = value.map((raw, index) => {
    const record = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw as Record<string, unknown> : {};
    const title = text(record.title, 300);
    const syllabusRef = text(record.syllabusRef, 500);
    const priorityRaw = text(record.priority, 20).toLowerCase() || 'required';
    const depthRaw = text(record.plannedDepth, 20).toLowerCase() || 'standard';
    const examRationale = text(record.examRationale, 2000);
    if (title.length < 2) {
      throw new NotesCoverageBulkValidationError('COVERAGE_TITLE_REQUIRED', `Coverage item ${index + 1} needs a title.`);
    }
    if (!prioritySet.has(priorityRaw)) {
      throw new NotesCoverageBulkValidationError('INVALID_COVERAGE_PRIORITY', `Coverage item ${index + 1} has an invalid priority.`);
    }
    if (!depthSet.has(depthRaw)) {
      throw new NotesCoverageBulkValidationError('INVALID_COVERAGE_DEPTH', `Coverage item ${index + 1} has an invalid plannedDepth.`);
    }
    return {
      title,
      syllabusRef,
      priority: priorityRaw as NotesCoveragePriority,
      plannedDepth: depthRaw as NotesCoverageDepth,
      examRationale,
      sortOrder: sortOrder(record.sortOrder, index),
    };
  });

  const seen = new Set<string>();
  for (const item of normalized) {
    const key = coveragePlanItemKey(item);
    if (seen.has(key)) {
      throw new NotesCoverageBulkValidationError(
        'DUPLICATE_COVERAGE_ITEM',
        `The import contains a duplicate coverage target: ${item.title}.`,
      );
    }
    seen.add(key);
  }
  return normalized;
}

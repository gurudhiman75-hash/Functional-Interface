import type { GenerationPackage } from './api';

/**
 * Pure admin navigation metadata. This does not change executable package IDs,
 * the engine's request topic/subtopic, difficulty gates or lifecycle policy.
 *
 * The Quant generator's legacy metadata is not a consistent content taxonomy,
 * so use source-owned package families as the stable main-topic authority.
 * Unknown future packages stay discoverable under their declared main topic.
 */
export const QUANT_MAIN_TOPICS = [
  'Arithmetic',
  'Advanced Mathematics',
  'Data Interpretation',
  'Statistics',
] as const;

const ADVANCED_MATH_PACKAGE_IDS = new Set([
  'ALGEBRA',
  'GEO-001',
  'MEN-002',
  'MENSURATION',
  'PNC-001',
  'PNC-002',
  'PNC-SOURCE-REVIEW',
  'PRB-001',
  'PRB-002',
  'TRG-001',
  'TRG-002',
]);

const QUANT_ARITHMETIC_FAMILIES = /^(?:AVG|INT|MAL|NUM|PCT|PNL|PRT|RAP|SAP|SRI|TMW|TSD)(?:-|$)/;

/** Human-readable navigation grouping, never an execution routing parameter. */
export function packageMainTopic(entry: Pick<GenerationPackage, 'subject' | 'packageId' | 'topic'>): string {
  const topic = entry.topic?.trim() ?? '';
  if (entry.subject === 'Quantitative Aptitude') {
    if (entry.packageId.startsWith('DI-')) return 'Data Interpretation';
    if (entry.packageId.startsWith('STAT-')) return 'Statistics';
    if (ADVANCED_MATH_PACKAGE_IDS.has(entry.packageId)) return 'Advanced Mathematics';
    if (QUANT_ARITHMETIC_FAMILIES.test(entry.packageId)) return 'Arithmetic';
    if (QUANT_MAIN_TOPICS.some((candidate) => candidate === topic)) return topic;
    // Do not hide newly registered packages if the taxonomy has yet to catch up.
    return topic || 'Other Quantitative Aptitude';
  }
  // For other subjects, retain registered content ownership. A generic topic is
  // allowed; generating against it still selects an explicit package and CP.
  return topic || entry.subject || 'Other';
}

const GENERIC_CHAPTERS = new Set(['Reasoning', 'Reasoning Ability']);
const REASONING_CHAPTERS: Record<string, string> = {
  'ASM-001': 'Assertion & Reason',
  'CLK-001': 'Clocks',
  'COA-001': 'Course of Action',
  'FLR-001': 'Floor & Flat Arrangement',
  'INE-001': 'Inequality',
};

/**
 * Only the generation selector uses this refinement. Review filtering keeps
 * the backend chapter values to avoid silently changing historic run searches.
 */
export function generationChapter(entry: Pick<GenerationPackage,
  'subject' | 'packageId' | 'chapter' | 'topic' | 'subtopic' | 'label'>): string {
  const existing = entry.chapter?.trim() || entry.subtopic?.trim() || entry.topic?.trim() || entry.label?.trim() || entry.packageId;
  if (entry.subject === 'Reasoning Ability' && GENERIC_CHAPTERS.has(existing)) {
    const specific = entry.subtopic?.trim();
    if (specific && !GENERIC_CHAPTERS.has(specific)) return specific;
    return REASONING_CHAPTERS[entry.packageId] || entry.label?.trim() || entry.packageId;
  }
  return existing;
}

export function sortMainTopics(subject: string, values: readonly string[]): string[] {
  const order: readonly string[] = subject === 'Quantitative Aptitude' ? QUANT_MAIN_TOPICS : [];
  return [...new Set(values)].sort((left, right) => {
    const a = order.indexOf(left);
    const b = order.indexOf(right);
    if (a !== -1 || b !== -1) {
      if (a === -1) return 1;
      if (b === -1) return -1;
      return a - b;
    }
    return left.localeCompare(right);
  });
}

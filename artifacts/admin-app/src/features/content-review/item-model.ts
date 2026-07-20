import type { ContentReviewItem, GeneratedReviewItem, ReviewOption } from './api';

function asText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function generatedPayload(item: GeneratedReviewItem, previous = false): Record<string, unknown> {
  const value = previous ? item.previousPayload : item.currentPayload;
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function generatedCorrectIndex(item: GeneratedReviewItem, previous = false): number {
  const payload = generatedPayload(item, previous);
  const raw = Number(payload.correctIndex ?? payload.correct);
  return Number.isInteger(raw) ? raw : -1;
}

export function reviewItemStem(item: ContentReviewItem, previous = false): string {
  if (item.entityType === 'question') return previous ? item.previousStem ?? '' : item.stem;
  const payload = generatedPayload(item, previous);
  return asText(payload.text) || asText(payload.stem);
}

export function reviewItemExplanation(item: ContentReviewItem, previous = false): string {
  if (item.entityType === 'question') return previous ? item.previousExplanation ?? '' : item.explanation;
  return asText(generatedPayload(item, previous).explanation);
}

export function reviewItemOptions(item: ContentReviewItem, previous = false): ReviewOption[] {
  if (item.entityType === 'question') return previous ? item.previousOptions : item.options;
  const raw = generatedPayload(item, previous).options;
  const correctIndex = generatedCorrectIndex(item, previous);
  return Array.isArray(raw)
    ? raw.map((entry, index) => ({
        key: String.fromCharCode(65 + index),
        text: String(entry ?? '').trim(),
        sortOrder: index + 1,
        isCorrect: correctIndex === index,
      }))
    : [];
}

export function reviewItemDifficulty(item: ContentReviewItem, previous = false): string {
  if (item.entityType === 'question') return previous ? item.previousDifficulty ?? '' : item.difficulty;
  const payload = generatedPayload(item, previous);
  return asText(payload.difficultyLabel) || asText(payload.difficulty) || 'Medium';
}

export function reviewItemTopic(item: ContentReviewItem): string {
  if (item.entityType === 'question') {
    return item.taxonomy.find((node) => node.isPrimary)?.name
      ?? item.taxonomy[item.taxonomy.length - 1]?.name
      ?? 'Unassigned taxonomy';
  }
  const payload = generatedPayload(item);
  return [asText(payload.topic), asText(payload.subtopic)].filter(Boolean).join(' · ')
    || asText(item.requestSnapshot.subject)
    || 'Generated question';
}

export function reviewItemExam(item: ContentReviewItem): string {
  return item.entityType === 'question'
    ? item.examName ?? 'Exam not assigned'
    : asText(item.requestSnapshot.exam) || 'Generated batch';
}

export function hasVersionComparison(item: ContentReviewItem): boolean {
  return Boolean(item.previousVersionId);
}

export function changedReviewFields(item: ContentReviewItem): string[] {
  if (!hasVersionComparison(item)) return [];
  const fields: string[] = [];
  if (reviewItemStem(item) !== reviewItemStem(item, true)) fields.push('Stem');
  if (reviewItemExplanation(item) !== reviewItemExplanation(item, true)) fields.push('Explanation');
  if (reviewItemDifficulty(item) !== reviewItemDifficulty(item, true)) fields.push('Difficulty');
  const current = reviewItemOptions(item).map((option) => `${option.text}:${option.isCorrect}`).join('|');
  const previous = reviewItemOptions(item, true).map((option) => `${option.text}:${option.isCorrect}`).join('|');
  if (current !== previous) fields.push('Options');
  return fields;
}

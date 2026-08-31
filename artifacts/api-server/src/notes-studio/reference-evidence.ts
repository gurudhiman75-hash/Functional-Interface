import { createHash } from 'node:crypto';

export const NOTES_REFERENCE_EVIDENCE_MAX_CHARS = 800;
export const NOTES_REFERENCE_LOCATOR_MAX_CHARS = 300;

const editableStates = new Set(['brief', 'sources_ready', 'evidence_ready', 'outline_ready']);

export class NotesReferenceEvidenceValidationError extends Error {
  constructor(readonly code: string, message: string) {
    super(message);
  }
}

export function referenceEvidenceAllowed(state: unknown): boolean {
  return editableStates.has(String(state ?? '').trim());
}

export function normalizeReferenceEvidenceText(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.replace(/\s+/g, ' ').trim().normalize('NFC').slice(0, NOTES_REFERENCE_EVIDENCE_MAX_CHARS);
}

export function normalizeReferenceLocator(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.replace(/\s+/g, ' ').trim().normalize('NFC').slice(0, NOTES_REFERENCE_LOCATOR_MAX_CHARS);
}

export function referenceEvidenceFingerprint(value: string): string {
  return createHash('sha256').update(normalizeReferenceEvidenceText(value).toLowerCase()).digest('hex');
}

export function validateReferenceEvidenceInput(input: {
  noteText?: unknown;
  locatorLabel?: unknown;
  paraphrasedByEditor?: unknown;
}) {
  const noteText = normalizeReferenceEvidenceText(input.noteText);
  const locatorLabel = normalizeReferenceLocator(input.locatorLabel);
  if (noteText.length < 20) {
    throw new NotesReferenceEvidenceValidationError(
      'REFERENCE_EVIDENCE_TOO_SHORT',
      'Write a factual paraphrase of at least 20 characters.',
    );
  }
  if (input.paraphrasedByEditor !== true) {
    throw new NotesReferenceEvidenceValidationError(
      'REFERENCE_EVIDENCE_ATTESTATION_REQUIRED',
      'Confirm that the note is your own factual paraphrase and does not paste publisher wording.',
    );
  }
  return {
    noteText,
    locatorLabel,
    excerptHash: referenceEvidenceFingerprint(noteText),
  };
}

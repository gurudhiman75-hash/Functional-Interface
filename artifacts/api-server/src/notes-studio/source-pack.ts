import { createHash } from 'node:crypto';

export const NOTE_SOURCE_RIGHTS_BASES = [
  'user_supplied',
  'licensed',
  'public_domain',
  'publisher_authorized',
  'reference_only',
] as const;

export type NoteSourceRightsBasis = (typeof NOTE_SOURCE_RIGHTS_BASES)[number];
export type NoteSourceRetentionMode = 'extracted_text' | 'metadata_only';

const RETAINABLE_RIGHTS = new Set<NoteSourceRightsBasis>([
  'user_supplied',
  'licensed',
  'public_domain',
  'publisher_authorized',
]);

const ENTITY_MAP: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  ndash: '–',
  mdash: '—',
};

export function retentionModeForRights(rightsBasis: NoteSourceRightsBasis): NoteSourceRetentionMode {
  return RETAINABLE_RIGHTS.has(rightsBasis) ? 'extracted_text' : 'metadata_only';
}

export function noteSourceContentHash(value: string | Buffer): string {
  return createHash('sha256').update(value).digest('hex');
}

export function referenceOnlyUrlContentHash(value: string): string {
  const normalizedUrl = assertPublicHttpsUrl(value);
  return noteSourceContentHash(`notes-reference-url-v1:${normalizedUrl}`);
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&#(\d+);/g, (_match, digits) => String.fromCodePoint(Number(digits)))
    .replace(/&#x([0-9a-f]+);/gi, (_match, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&([a-z]+);/gi, (match, key) => ENTITY_MAP[String(key).toLowerCase()] ?? match);
}

export function extractWebTitle(html: string): string {
  const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '';
  return decodeHtmlEntities(title.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()).slice(0, 300);
}

export function extractReadableWebText(html: string): string {
  return decodeHtmlEntities(
    html
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
      .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, ' ')
      .replace(/<svg\b[\s\S]*?<\/svg>/gi, ' ')
      .replace(/<\/(p|div|section|article|main|header|footer|aside|li|h[1-6]|tr|table|blockquote)>/gi, '\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, ' '),
  )
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/[ \t]*\n[ \t]*/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .normalize('NFC');
}

export function sourcePreview(text: string | null | undefined, maxChars = 8000): string {
  if (!text) return '';
  const normalized = text.trim();
  if (normalized.length <= maxChars) return normalized;
  return `${normalized.slice(0, Math.max(0, maxChars - 1)).trimEnd()}…`;
}

export function assertPublicHttpsUrl(value: string, label = 'Source URL'): string {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`${label} must be a valid HTTPS URL.`);
  }
  if (parsed.protocol !== 'https:') throw new Error(`${label} must use HTTPS.`);
  const host = parsed.hostname.toLowerCase();
  const blocked =
    host === 'localhost' ||
    host === '0.0.0.0' ||
    host === '::1' ||
    host.endsWith('.local') ||
    host === '169.254.169.254' ||
    host === 'metadata.google.internal' ||
    /^127\./.test(host) ||
    /^10\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^169\.254\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host);
  if (blocked) throw new Error(`${label} cannot point to a private-network host.`);
  parsed.hash = '';
  return parsed.toString();
}

export function canSourceSupportGeneration(input: {
  retentionMode: NoteSourceRetentionMode;
  extractionStatus: string;
  charCount?: number | null;
}): boolean {
  return input.retentionMode === 'extracted_text'
    && input.extractionStatus === 'processed'
    && Number(input.charCount ?? 0) >= 100;
}

export const NOTES_SOURCE_DISCOVERY_MAX_QUERIES = 4;
export const NOTES_SOURCE_DISCOVERY_MAX_RESULTS = 20;
export const NOTES_SOURCE_DISCOVERY_PROMPT_VERSION = 'notes-source-discovery-v3';

const discoveryStates = new Set([
  'brief',
  'sources_ready',
  'evidence_ready',
  'outline_ready',
  'drafting',
  'qa_required',
  'review_ready',
]);

const LOW_PRIORITY_DISCOVERY_DOMAINS = [
  'wikipedia.org',
  'youtube.com',
  'youtu.be',
  'scribd.com',
  'testbook.com',
  'drishtiias.com',
  'pwonlyias.com',
  'studyiq.com',
  'abhipedia.abhimanu.com',
  'spmiasacademy.com',
  'flipkart.com',
  'amazon.in',
  'amazon.com',
  'linkedin.com',
] as const;

const KNOWN_INSTITUTIONAL_DOMAINS = [
  'un.org',
  'unesco.org',
  'worldbank.org',
] as const;

const DISCOVERY_RELEVANCE_STOPWORDS = new Set([
  'about',
  'after',
  'also',
  'and',
  'authoritative',
  'avoid',
  'blog',
  'coaching',
  'context',
  'current',
  'day',
  'exam',
  'for',
  'from',
  'generic',
  'government',
  'gk',
  'india',
  'indian',
  'institutional',
  'major',
  'material',
  'notes',
  'official',
  'other',
  'prefer',
  'present',
  'primary',
  'reference',
  'sources',
  'source',
  'static',
  'their',
  'through',
  'with',
]);

export type NotesSourceDiscoveryCandidate = {
  sourceUri: string;
  domain: string;
  authorityClass: 'government_primary' | 'institutional_reference' | 'web_reference';
  score: number;
};

export type NotesSourceDiscoveryMetadata = {
  url: unknown;
  title?: unknown;
};

export function sourceDiscoveryAllowed(state: unknown): boolean {
  return discoveryStates.has(String(state ?? '').trim());
}

export function normalizeSourceDiscoveryQuery(value: unknown): string {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().slice(0, 240) : '';
}

export function buildSourceDiscoveryQueries(input: {
  topicLabel?: unknown;
  syllabusEmphasis?: unknown;
  focus?: unknown;
}): string[] {
  const topic = normalizeSourceDiscoveryQuery(input.topicLabel);
  const syllabus = normalizeSourceDiscoveryQuery(input.syllabusEmphasis);
  const focus = normalizeSourceDiscoveryQuery(input.focus);
  const queries = [
    focus,
    [topic, syllabus].filter(Boolean).join(' '),
    topic ? `${topic} official government source` : '',
    topic ? `${topic} authoritative reference India` : '',
  ].map(normalizeSourceDiscoveryQuery).filter(Boolean);
  return [...new Set(queries)].slice(0, NOTES_SOURCE_DISCOVERY_MAX_QUERIES);
}

function privateIpv4(host: string): boolean {
  const match = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!match) return false;
  const octets = match.slice(1).map(Number);
  if (octets.some((value) => value < 0 || value > 255)) return true;
  const [a, b] = octets;
  return a === 10
    || a === 127
    || a === 0
    || (a === 169 && b === 254)
    || (a === 172 && b >= 16 && b <= 31)
    || (a === 192 && b === 168);
}

function blockedHost(host: string): boolean {
  const normalized = host.toLowerCase().replace(/^\[/, '').replace(/\]$/, '');
  const localIpv6 = normalized === '::1'
    || ((normalized.startsWith('fc') || normalized.startsWith('fd')) && normalized.includes(':'))
    || (/^fe[89ab]/.test(normalized) && normalized.includes(':'));
  return !normalized
    || normalized === 'localhost'
    || normalized === '0.0.0.0'
    || normalized === '169.254.169.254'
    || normalized === 'metadata.google.internal'
    || normalized.endsWith('.local')
    || localIpv6
    || privateIpv4(normalized);
}

export function normalizeDiscoveredSourceUrl(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:') return null;
    if (blockedHost(url.hostname)) return null;
    url.hash = '';
    for (const key of [...url.searchParams.keys()]) {
      if (/^(utm_|gclid$|fbclid$)/i.test(key)) url.searchParams.delete(key);
    }
    return url.toString();
  } catch {
    return null;
  }
}

export function sourceDiscoveryDomain(sourceUri: string): string {
  try {
    return new URL(sourceUri).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return '';
  }
}

function matchesDomain(domain: string, candidate: string): boolean {
  return domain === candidate || domain.endsWith(`.${candidate}`);
}

export function sourceDiscoveryLowPriority(domain: string): boolean {
  const host = domain.toLowerCase();
  return LOW_PRIORITY_DISCOVERY_DOMAINS.some((candidate) => matchesDomain(host, candidate));
}

export function sourceDiscoveryAuthorityClass(domain: string): NotesSourceDiscoveryCandidate['authorityClass'] {
  const host = domain.toLowerCase();
  if (host === 'gov.in' || host.endsWith('.gov.in') || host === 'nic.in' || host.endsWith('.nic.in') || host.endsWith('.gov')) {
    return 'government_primary';
  }
  if (
    host.endsWith('.edu')
    || host.endsWith('.ac.in')
    || host.endsWith('.edu.in')
    || host.endsWith('.int')
    || KNOWN_INSTITUTIONAL_DOMAINS.some((candidate) => matchesDomain(host, candidate))
  ) {
    return 'institutional_reference';
  }
  return 'web_reference';
}

export function sourceDiscoveryScore(domain: string, authorityClass: NotesSourceDiscoveryCandidate['authorityClass']): number {
  if (sourceDiscoveryLowPriority(domain)) return 10;
  if (authorityClass === 'government_primary') return 100;
  if (authorityClass === 'institutional_reference') return 70;
  return 40;
}

function canonicalDiscoveryToken(value: string): string {
  const token = value.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (token.endsWith('ies') && token.length > 5) return `${token.slice(0, -3)}y`;
  if (token.endsWith('s') && token.length > 5 && !token.endsWith('ss')) return token.slice(0, -1);
  return token;
}

function discoveryTokens(value: unknown): string[] {
  if (typeof value !== 'string') return [];
  return (value.match(/[A-Za-z0-9]+/g) ?? [])
    .map(canonicalDiscoveryToken)
    .filter(Boolean);
}

export function sourceDiscoveryAnchorTerms(value: unknown): string[] {
  const seen = new Set<string>();
  const anchors: string[] = [];
  for (const token of discoveryTokens(value)) {
    if (token.length < 4 || DISCOVERY_RELEVANCE_STOPWORDS.has(token) || seen.has(token)) continue;
    seen.add(token);
    anchors.push(token);
  }
  return anchors.slice(0, 24);
}

export function sourceDiscoveryRelevanceMatches(input: {
  sourceUri: string;
  title?: unknown;
  anchorTerms: string[];
}): number {
  if (input.anchorTerms.length === 0) return 0;
  const haystack = new Set(discoveryTokens(`${input.sourceUri} ${typeof input.title === 'string' ? input.title : ''}`));
  return input.anchorTerms.reduce((count, term) => count + (haystack.has(term) ? 1 : 0), 0);
}

export function rankDiscoveredSourceMetadata(
  values: NotesSourceDiscoveryMetadata[],
  relevanceFocus: unknown,
): NotesSourceDiscoveryCandidate[] {
  const anchorTerms = sourceDiscoveryAnchorTerms(relevanceFocus);
  const seen = new Set<string>();
  const candidates: NotesSourceDiscoveryCandidate[] = [];

  for (const value of values) {
    const sourceUri = normalizeDiscoveredSourceUrl(value?.url);
    if (!sourceUri || seen.has(sourceUri)) continue;
    seen.add(sourceUri);
    const domain = sourceDiscoveryDomain(sourceUri);
    const authorityClass = sourceDiscoveryAuthorityClass(domain);
    const relevanceMatches = sourceDiscoveryRelevanceMatches({
      sourceUri,
      title: value?.title,
      anchorTerms,
    });

    if (anchorTerms.length > 0) {
      if (relevanceMatches === 0) continue;
      if (authorityClass === 'web_reference' && relevanceMatches < 2) continue;
    }

    const score = sourceDiscoveryScore(domain, authorityClass) + Math.min(relevanceMatches, 8) * 5;
    candidates.push({ sourceUri, domain, authorityClass, score });
  }

  return candidates
    .sort((a, b) => b.score - a.score || a.domain.localeCompare(b.domain) || a.sourceUri.localeCompare(b.sourceUri))
    .slice(0, NOTES_SOURCE_DISCOVERY_MAX_RESULTS);
}

export function rankDiscoveredSourceUrls(values: unknown[]): NotesSourceDiscoveryCandidate[] {
  const seen = new Set<string>();
  const candidates: NotesSourceDiscoveryCandidate[] = [];
  for (const value of values) {
    const sourceUri = normalizeDiscoveredSourceUrl(value);
    if (!sourceUri || seen.has(sourceUri)) continue;
    seen.add(sourceUri);
    const domain = sourceDiscoveryDomain(sourceUri);
    const authorityClass = sourceDiscoveryAuthorityClass(domain);
    const score = sourceDiscoveryScore(domain, authorityClass);
    candidates.push({ sourceUri, domain, authorityClass, score });
  }
  return candidates
    .sort((a, b) => b.score - a.score || a.domain.localeCompare(b.domain) || a.sourceUri.localeCompare(b.sourceUri))
    .slice(0, NOTES_SOURCE_DISCOVERY_MAX_RESULTS);
}

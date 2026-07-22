export const STUDENT_STATUSES = ['active', 'invited', 'suspended', 'disabled'] as const;

export type StudentStatus = typeof STUDENT_STATUSES[number];

export class StudentAdministrationError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode = 400,
  ) {
    super(message);
  }
}

function first(value: unknown): string {
  if (Array.isArray(value)) return String(value[0] ?? '');
  return typeof value === 'string' ? value : '';
}

function boundedInteger(value: unknown, fallback: number, min: number, max: number): number {
  const parsed = Number.parseInt(first(value), 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

export function assertStudentUuid(value: unknown, label = 'studentId'): string {
  const candidate = first(value).trim();
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(candidate)) {
    throw new StudentAdministrationError('INVALID_STUDENT_ID', `${label} must be a valid UUID`);
  }
  return candidate;
}

export function normalizeStudentDirectoryQuery(input: Record<string, unknown>) {
  const rawSearch = first(input.search).trim().slice(0, 160);
  const rawStatus = first(input.status).trim().toLowerCase();
  const rawLanguage = first(input.language).trim().toLowerCase().slice(0, 24);
  const page = boundedInteger(input.page, 1, 1, 100_000);
  const pageSize = boundedInteger(input.pageSize, 25, 1, 100);

  if (rawStatus && !STUDENT_STATUSES.includes(rawStatus as StudentStatus)) {
    throw new StudentAdministrationError('INVALID_STUDENT_STATUS', 'Unsupported student account status');
  }
  if (rawLanguage && !/^[a-z]{2,8}(?:-[a-z0-9]{2,8})?$/.test(rawLanguage)) {
    throw new StudentAdministrationError('INVALID_STUDENT_LANGUAGE', 'Invalid preferred language code');
  }

  return {
    search: rawSearch || null,
    searchPattern: rawSearch ? `%${rawSearch.replaceAll('%', '\\%').replaceAll('_', '\\_')}%` : null,
    status: (rawStatus || null) as StudentStatus | null,
    language: rawLanguage || null,
    page,
    pageSize,
    offset: (page - 1) * pageSize,
  };
}

export function maskStudentIp(value: unknown): string | null {
  const ip = typeof value === 'string' ? value.trim() : '';
  if (!ip) return null;
  if (ip.includes(':')) {
    const parts = ip.split(':').filter(Boolean);
    return parts.length > 1 ? `${parts.slice(0, 2).join(':')}:…` : 'IPv6';
  }
  const parts = ip.split('.');
  if (parts.length === 4 && parts.every((part) => /^\d{1,3}$/.test(part))) {
    return `${parts[0]}.${parts[1]}.x.x`;
  }
  return 'Redacted';
}

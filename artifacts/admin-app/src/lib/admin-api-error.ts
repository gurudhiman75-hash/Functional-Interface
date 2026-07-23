export interface AdminApiErrorShape {
  message: string;
  code: string | null;
  status: number | null;
  details: unknown;
  correlationId: string | null;
  affectedRecord: string | null;
}

export class AdminApiError extends Error implements AdminApiErrorShape {
  code: string | null;
  status: number | null;
  details: unknown;
  correlationId: string | null;
  affectedRecord: string | null;

  constructor(input: AdminApiErrorShape) {
    super(input.message);
    this.name = 'AdminApiError';
    this.code = input.code;
    this.status = input.status;
    this.details = input.details;
    this.correlationId = input.correlationId;
    this.affectedRecord = input.affectedRecord;
  }
}

export function toAdminApiError(error: unknown, fallbackMessage = 'The admin request failed.'): AdminApiError {
  if (error instanceof AdminApiError) return error;
  if (error instanceof Error) {
    const value = error as Error & Partial<AdminApiErrorShape>;
    return new AdminApiError({
      message: value.message || fallbackMessage,
      code: typeof value.code === 'string' ? value.code : null,
      status: typeof value.status === 'number' ? value.status : null,
      details: value.details,
      correlationId: typeof value.correlationId === 'string' ? value.correlationId : null,
      affectedRecord: typeof value.affectedRecord === 'string' ? value.affectedRecord : null,
    });
  }
  return new AdminApiError({
    message: fallbackMessage,
    code: null,
    status: null,
    details: null,
    correlationId: null,
    affectedRecord: null,
  });
}

export function adminApiErrorFromResponse(
  response: Response,
  body: { error?: string; message?: string; code?: string; details?: unknown } | null,
  fallbackMessage: string,
  affectedRecord: string | null = null,
): AdminApiError {
  return new AdminApiError({
    message: body?.error || body?.message || fallbackMessage,
    code: body?.code || null,
    status: response.status,
    details: body?.details ?? null,
    correlationId: response.headers.get('X-Correlation-Id'),
    affectedRecord,
  });
}

export function adminApiErrorDetails(error: AdminApiErrorShape): string {
  return JSON.stringify({
    message: error.message,
    code: error.code,
    status: error.status,
    correlationId: error.correlationId,
    affectedRecord: error.affectedRecord,
    details: error.details,
  }, null, 2);
}

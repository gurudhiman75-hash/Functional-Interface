// Opt-in staging-only resume deep link. Persist ONLY the non-secret run UUID
// in the URL; never serialize the request, Firebase identity or idempotency key.
// The backend rechecks admin authentication and content.generation.read.
export const STAGING_ASYNC_RUN_PARAM = 'qsStagingRun';
const RUN_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function getStagingResumeRunId(search: URLSearchParams): string | null {
  const values = search.getAll(STAGING_ASYNC_RUN_PARAM);
  return values.length === 1 && RUN_UUID.test(values[0] ?? '') ? values[0]! : null;
}

export function withStagingResumeRunId(search: URLSearchParams, runId: string): URLSearchParams {
  if (!RUN_UUID.test(runId)) throw new Error('Invalid staging generation run ID');
  const next = new URLSearchParams(search);
  next.set(STAGING_ASYNC_RUN_PARAM, runId);
  return next;
}

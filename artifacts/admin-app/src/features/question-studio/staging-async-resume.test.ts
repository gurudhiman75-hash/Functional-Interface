import { describe, expect, it } from 'vitest';
import {
  getStagingResumeRunId,
  STAGING_ASYNC_RUN_PARAM,
  withStagingResumeRunId,
} from './staging-async-resume';

const a = '123e4567-e89b-42d3-a456-426614174000';
const b = '123e4567-e89b-42d3-a456-426614174001';

describe('staging async resume deep links', () => {
  it('returns only a valid, unique run UUID and rejects injected ids', () => {
    expect(getStagingResumeRunId(new URLSearchParams())).toBeNull();
    expect(getStagingResumeRunId(new URLSearchParams(`qsStagingRun=${a}`))).toBe(a);
    expect(getStagingResumeRunId(new URLSearchParams('qsStagingRun=../../../../internal'))).toBeNull();
    expect(getStagingResumeRunId(new URLSearchParams(`qsStagingRun=${a}&qsStagingRun=${b}`))).toBeNull();
  });

  it('preserves unrelated filters without storing credentials or request bodies', () => {
    const previous = new URLSearchParams('tab=generate&subject=quant');
    const next = withStagingResumeRunId(previous, a);
    expect(next.get(STAGING_ASYNC_RUN_PARAM)).toBe(a);
    expect(next.get('tab')).toBe('generate');
    expect(next.get('subject')).toBe('quant');
    expect(previous.has(STAGING_ASYNC_RUN_PARAM)).toBe(false);
    expect(Array.from(next.keys()).sort()).toEqual(['qsStagingRun', 'subject', 'tab']);
    expect(withStagingResumeRunId(next, b).get(STAGING_ASYNC_RUN_PARAM)).toBe(b);
    expect(() => withStagingResumeRunId(next, 'bad-id')).toThrow('Invalid staging generation run ID');
  });
});

import { describe, expect, it, vi } from 'vitest';
import type { GenerationPackage } from './api';
import { isProductionChapterPackage, productionChapterCpIds, PRODUCTION_CHAPTER_BATCH_LIMIT } from './production-chapter';
import { enqueueQuestionStudioProductionChapterRun, retryQuestionStudioProductionChapterDispatch } from './api';
import { adminRequest } from '@/lib/admin-request';
vi.mock('@/lib/admin-request', () => ({ adminRequest: vi.fn().mockResolvedValue({ id: 'saved-run' }) }));
const pkg = (engineId: string): GenerationPackage => ({
  engineId, packageId: 'TEST-001', enabled: true, subject: 'Test', chapter: 'Chapter', topic: 'Topic', subtopic: 'Subtopic', label: 'Test',
  cpIds: ['TEST-001-CP-001'], dynamicCandidateCpIds: ['TEST-001-DYNAMIC'], supportedLanguages: ['en'],
  reviewSurfaceRequired: true, manualApprovalRequired: true, productionReleaseAuthorized: false,
  automaticStudentPublication: false, publiclyPublishable: false,
});
describe('production chapter selection and client', () => {
  it('keeps the production chapter UI limit aligned with the bounded server contract', () => {
    expect(PRODUCTION_CHAPTER_BATCH_LIMIT).toBe(50);
  });
  it('includes eligible canonical chapters from every engine and both source lifecycles', () => {
    for (const engine of ['quant-v4', 'reasoning-v1', 'language-v1', 'knowledge-v1']) {
      for (const lifecycleStage of ['REVIEW_ONLY', 'BANK_ONLY'] as const) {
        expect(isProductionChapterPackage({ ...pkg(engine), lifecycleStage })).toBe(true);
      }
      expect(productionChapterCpIds(pkg(engine))).toEqual(['TEST-001-CP-001']);
    }
  });
  it('excludes disabled, unknown, duplicate, malformed and automatically publishable sources', () => {
    for (const patch of [
      { enabled: false }, { engineId: 'unknown' }, { cpIds: [] }, { cpIds: ['bad-id'] },
      { cpIds: ['TEST-001-CP-001', 'TEST-001-CP-001'] },
      { manualApprovalRequired: false }, { reviewSurfaceRequired: false },
      { automaticStudentPublication: true }, { productionReleaseAuthorized: true }, { publiclyPublishable: true },
    ]) expect(isProductionChapterPackage({ ...pkg('quant-v4'), ...patch })).toBe(false);
  });
  it('accepts canonical lowercase and namespaced package keys while keeping CP IDs strict', () => {
    expect(isProductionChapterPackage({ ...pkg('language-v1'), packageId: 'english-eng002-sentence-improvement-v1' })).toBe(true);
    expect(isProductionChapterPackage({ ...pkg('reasoning-v1'), packageId: 'reasoning-v1:sif-001:review-v1' })).toBe(true);
    expect(isProductionChapterPackage({ ...pkg('language-v1'), packageId: '../other' })).toBe(false);
    expect(isProductionChapterPackage({ ...pkg('language-v1'), cpIds: ['lowercase-cp'] })).toBe(false);
  });
  it('posts the selected engine, count, canonical CPs and stable key without client seed', async () => {
    await enqueueQuestionStudioProductionChapterRun({
      engineId: 'knowledge-v1', packageId: 'TEST-001', exam: 'SSC', subject: 'Knowledge',
      language: 'en', difficulty: 'Mixed', count: 50, cpIds: ['TEST-001-CP-001'], seed: 'must-not-send', runtimeMode: 'review-only',
    }, 'stable-key');
    const [url, options] = vi.mocked(adminRequest).mock.calls.at(-1)!;
    expect(url).toBe('/admin/question-studio/runs/async-production-chapter');
    expect(options?.headers).toEqual({ 'Idempotency-Key': 'stable-key' });
    const body = JSON.parse(options?.body as string);
    expect(body.count).toBe(50); expect(body.request.engineId).toBe('knowledge-v1');
    expect(body.selectedCpIds).toEqual(['TEST-001-CP-001']); expect(body.request).not.toHaveProperty('seed');
  });
  it('retries the saved run through its own endpoint without re-enqueueing input', async () => {
    await retryQuestionStudioProductionChapterDispatch('saved-run');
    const [url, options] = vi.mocked(adminRequest).mock.calls.at(-1)!;
    expect(url).toBe('/admin/question-studio/runs/saved-run/dispatch-production-chapter');
    expect(options).toEqual({ method: 'POST' });
  });
});

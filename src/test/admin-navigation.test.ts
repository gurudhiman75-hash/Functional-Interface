import { describe, expect, it } from 'vitest';

import {
  ADMIN_WORKSPACE_COUNTS,
  NAV_GROUPS,
  NAV_LOOKUP,
  WORKSPACE_STATUS_LABELS,
} from '@/app/nav/navigation';

describe('admin navigation roadmap', () => {
  const items = NAV_GROUPS.flatMap((group) => group.items);

  it('keeps the complete admin information architecture visible', () => {
    expect(NAV_GROUPS.map((group) => group.id)).toEqual([
      'overview', 'content', 'tests', 'commerce', 'users', 'analytics', 'settings',
    ]);
    expect(items).toHaveLength(33);
    expect(items.map((item) => item.label)).toEqual(expect.arrayContaining([
      'Question Studio', 'Content Review', 'Coverage Planner', 'Sections & Topics',
      'Test QA', 'Packages', 'Students', 'Question Analytics', 'Audit Logs',
    ]));
  });

  it('has unique paths and complete roadmap metadata', () => {
    const paths = items.map((item) => item.path);
    expect(new Set(paths).size).toBe(paths.length);
    for (const item of items) {
      expect(NAV_LOOKUP[item.path]).toBe(item);
      expect(WORKSPACE_STATUS_LABELS[item.status]).toBeTruthy();
      expect(item.summary.trim().length).toBeGreaterThan(20);
      if (item.status !== 'live') expect(item.milestone?.trim().length).toBeGreaterThan(20);
    }
  });

  it('marks only canonical workspaces live', () => {
    expect(items.filter((item) => item.status === 'live').map((item) => item.path)).toEqual([
      '/dashboard',
      '/content/questions/generate',
      '/content/questions',
      '/content/review',
      '/content/coverage',
      '/content/taxonomy',
      '/tests',
      '/tests/builder',
      '/tests/qa',
    ]);
    expect(ADMIN_WORKSPACE_COUNTS).toEqual({ live: 9, in_progress: 12, planned: 12 });
  });

  it('protects canonical operations with read permissions', () => {
    expect(NAV_LOOKUP['/content/review']?.permission).toBe('content.questions.read');
    expect(NAV_LOOKUP['/content/coverage']?.permission).toBe('content.taxonomy.read');
    expect(NAV_LOOKUP['/content/taxonomy']?.permission).toBe('content.taxonomy.read');
    expect(NAV_LOOKUP['/tests/qa']?.permission).toBe('tests.read');
  });
});

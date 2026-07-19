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
      'overview',
      'content',
      'tests',
      'commerce',
      'users',
      'analytics',
      'settings',
    ]);
    expect(items).toHaveLength(33);
    expect(items.map((item) => item.label)).toEqual(expect.arrayContaining([
      'Question Studio',
      'Coverage Planner',
      'Test QA',
      'Packages',
      'Students',
      'Question Analytics',
      'Audit Logs',
    ]));
  });

  it('has unique paths and complete roadmap metadata', () => {
    const paths = items.map((item) => item.path);
    expect(new Set(paths).size).toBe(paths.length);

    for (const item of items) {
      expect(NAV_LOOKUP[item.path]).toBe(item);
      expect(WORKSPACE_STATUS_LABELS[item.status]).toBeTruthy();
      expect(item.summary.trim().length).toBeGreaterThan(20);
      if (item.status !== 'live') {
        expect(item.milestone?.trim().length).toBeGreaterThan(20);
      }
    }
  });

  it('keeps only canonical workspaces marked live', () => {
    const livePaths = items.filter((item) => item.status === 'live').map((item) => item.path);
    expect(livePaths).toEqual([
      '/dashboard',
      '/content/questions/generate',
      '/content/questions',
      '/tests',
      '/tests/builder',
    ]);
    expect(ADMIN_WORKSPACE_COUNTS).toEqual({
      live: 5,
      in_progress: 16,
      planned: 12,
    });
  });
});

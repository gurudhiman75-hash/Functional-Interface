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
    expect(items).toHaveLength(34);
    expect(items.map((item) => item.label)).toEqual(expect.arrayContaining([
      'Question Studio', 'Content Review', 'Coverage Planner', 'Sections & Topics',
      'Test QA', 'Test Series', 'Exam Blueprints', 'Publishing Calendar', 'Packages', 'Students', 'Admin Team',
      'Question Analytics', 'System Health', 'Request Failures', 'Languages', 'Roles & Permissions', 'Audit Logs',
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
      '/tests/series',
      '/tests/blueprints',
      '/tests/calendar',
      '/users/students',
      '/users/team',
      '/analytics/system-health',
      '/analytics/request-failures',
      '/settings/languages',
      '/settings/roles',
      '/settings/audit-logs',
    ]);
    expect(ADMIN_WORKSPACE_COUNTS).toEqual({ live: 19, in_progress: 4, planned: 11 });
  });

  it('protects canonical operations with read permissions', () => {
    expect(NAV_LOOKUP['/content/review']?.permission).toBe('content.questions.read');
    expect(NAV_LOOKUP['/content/coverage']?.permission).toBe('content.taxonomy.read');
    expect(NAV_LOOKUP['/content/taxonomy']?.permission).toBe('content.taxonomy.read');
    expect(NAV_LOOKUP['/tests/qa']?.permission).toBe('tests.read');
    expect(NAV_LOOKUP['/tests/series']?.permission).toBe('tests.read');
    expect(NAV_LOOKUP['/tests/blueprints']?.permission).toBe('tests.read');
    expect(NAV_LOOKUP['/tests/calendar']?.permission).toBe('tests.read');
    expect(NAV_LOOKUP['/users/students']?.permission).toBe('users.students.read');
    expect(NAV_LOOKUP['/users/team']?.permission).toBe('users.admins.read');
    expect(NAV_LOOKUP['/analytics/system-health']?.permission).toBe('jobs.read');
    expect(NAV_LOOKUP['/analytics/request-failures']?.permission).toBe('jobs.read');
    expect(NAV_LOOKUP['/settings/languages']?.permission).toBe('content.translations.read');
    expect(NAV_LOOKUP['/settings/roles']?.permission).toBe('settings.roles.manage');
    expect(NAV_LOOKUP['/settings/audit-logs']?.permission).toBe('audit.read');
  });
});

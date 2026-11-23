import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

const search = vi.hoisted(() => vi.fn(async () => ({
  questions: [{
    questionId: 'q1', versionId: '11111111-1111-4111-8111-111111111111', publicCode: 'Q-ONE', status: 'published', draftOnly: false,
    questionType: 'mcq', difficulty: 'Medium', stem: 'What is 2+2?', explanation: null, examVersionId: 'ev1', usedInTests: 0, lastUsedAt: null,
    options: [{ id: 'o1', key: 'A', text: '4', sortOrder: 1, isCorrect: true }], taxonomy: [], languages: ['en'],
  }],
  total: 1, limit: 30, offset: 0,
})));

vi.mock('@/features/test-builder/api', async (orig) => ({
  ...(await orig<object>()),
  getLiveTests: vi.fn(async () => ({ tests: [] })),
  getTestCatalog: vi.fn(async () => ({ examVersions: [{ id: 'ev1', examFamilyName: 'SSC', examName: 'SSC CHSL', versionName: '2026', status: 'active', languages: [{ id: 'l1', code: 'en', name: 'English', isPrimary: true }] }] })),
  getLiveTest: vi.fn(async () => ({
    test: { id: 't1', publicCode: 'T-1', examVersionId: 'ev1', status: 'draft', currentDraftVersionId: 'v1', publishedVersionId: null, createdAt: '', updatedAt: '' },
    currentVersion: { id: 'v1', versionNumber: 1, title: 'Mock', description: '', durationSeconds: 600, totalMarks: 0, instructions: {}, settings: {}, changeReason: null, createdAt: '' },
    sections: [{ id: 's1', name: 'Section 1', sectionKey: 'section-1', sortOrder: 1, durationSeconds: null, questions: [] }],
    validationIssues: [], auditEvents: [], publications: [],
  })),
  searchQuestionPicker: search,
  getQuestionReadinessInfo: vi.fn(async () => ({ questions: [] })),
}));
vi.mock('@/features/test-blueprints/api', () => ({ getBlueprints: vi.fn(async () => ({ blueprints: [] })), assembleBlueprint: vi.fn() }));
vi.mock('@/integrations/AdminPermissionContext', () => ({ useAdminPermissions: () => ({ hasPermission: () => true }) }));

import { TestsWorkspacePage } from '@/pages/tests/TestsWorkspacePage';

describe('Tests workspace question picker', () => {
  it('searches and adds a question to the active section', async () => {
    render(
      <MemoryRouter initialEntries={['/tests/t1']}>
        <Routes><Route path="/tests/:id" element={<TestsWorkspacePage />} /></Routes>
      </MemoryRouter>,
    );
    await waitFor(() => expect(search).toHaveBeenCalled(), { timeout: 3000 });
    const add = await screen.findByRole('button', { name: /add/i });
    fireEvent.click(add);
    await waitFor(() => expect(screen.getByText(/Section 1 · 1/)).toBeInTheDocument());
  });
});

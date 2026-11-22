import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

vi.mock('@/features/test-builder/api', async (orig) => ({
  ...(await orig<object>()),
  getLiveTests: vi.fn(async () => ({ tests: [] })),
  getTestCatalog: vi.fn(async () => ({ examVersions: [] })),
  searchQuestionPicker: vi.fn(async () => ({ questions: [], total: 0, limit: 30, offset: 0 })),
}));
vi.mock('@/features/test-blueprints/api', () => ({ getBlueprints: vi.fn(async () => ({ blueprints: [] })), assembleBlueprint: vi.fn() }));
vi.mock('@/integrations/AdminPermissionContext', () => ({ useAdminPermissions: () => ({ hasPermission: () => true }) }));

import { TestsWorkspacePage } from '@/pages/tests/TestsWorkspacePage';

describe('Tests workspace', () => {
  it('New test opens the editor', async () => {
    render(
      <MemoryRouter initialEntries={['/tests']}>
        <Routes>
          <Route path="/tests" element={<TestsWorkspacePage />} />
          <Route path="/tests/new" element={<TestsWorkspacePage />} />
          <Route path="/tests/:id" element={<TestsWorkspacePage />} />
        </Routes>
      </MemoryRouter>,
    );
    fireEvent.click(screen.getAllByRole('button', { name: /new test/i })[0]);
    await waitFor(() => expect(screen.getByText('Setup')).toBeInTheDocument());
  });
});

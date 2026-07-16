import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';

import { AdminPermissionProvider, useAdminPermissions } from '@/integrations/AdminPermissionContext';

describe('admin permission context', () => {
  it('uses server-provided effective permissions and supports the super-admin wildcard', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <AdminPermissionProvider session={{
        user: { id: 'user-1', firebaseUid: 'firebase-1', email: 'admin@example.test' },
        profile: { id: 'profile-1', displayName: null },
        roles: ['editor'],
        permissions: ['content.generation.read'],
      }}>{children}</AdminPermissionProvider>
    );
    const { result } = renderHook(() => useAdminPermissions(), { wrapper });
    expect(result.current.hasPermission('content.generation.read')).toBe(true);
    expect(result.current.hasPermission('content.generation.run')).toBe(false);
  });
});

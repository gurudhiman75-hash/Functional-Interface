import { describe, expect, it } from 'vitest';

import { resolveAdminLoginDestination, shouldRedirectToAdminLogin } from '@/integrations/ExamTreeAdminGate';

describe('ExamTreeAdminGate redirect safety', () => {
  it('redirects an unauthorized admin route once but never redirects the login route again', () => {
    expect(shouldRedirectToAdminLogin('/admin/dashboard', false)).toBe(true);
    expect(shouldRedirectToAdminLogin('/admin/dashboard', true)).toBe(false);
    expect(shouldRedirectToAdminLogin('/login/admin', false)).toBe(false);
  });

  it('sends local admin users to the student app login server', () => {
    expect(resolveAdminLoginDestination('/admin/?tab=users')).toBe(
      'http://localhost:5173/login/admin?next=%2Fadmin%2F%3Ftab%3Dusers',
    );
  });
});

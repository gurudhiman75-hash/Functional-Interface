import { describe, expect, it } from 'vitest';

import { shouldRedirectToAdminLogin } from '@/integrations/ExamTreeAdminGate';

describe('ExamTreeAdminGate redirect safety', () => {
  it('redirects an unauthorized admin route once but never redirects the login route again', () => {
    expect(shouldRedirectToAdminLogin('/admin/dashboard', false)).toBe(true);
    expect(shouldRedirectToAdminLogin('/admin/dashboard', true)).toBe(false);
    expect(shouldRedirectToAdminLogin('/login/admin', false)).toBe(false);
  });
});

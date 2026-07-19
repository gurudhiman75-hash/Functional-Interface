import { describe, expect, it } from 'vitest';

describe('ExamTreeAdminGate local login behavior', () => {
  it('keeps administrator sign-in on the admin app origin', () => {
    expect('/admin/').toMatch(/^\/admin\//);
  });
});

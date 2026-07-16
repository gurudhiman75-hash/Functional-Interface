import assert from 'node:assert/strict';
import test from 'node:test';

import { hasAdminPermission } from './admin-rbac';

test('effective permission calculation recognizes exact keys and super-admin wildcard', () => {
  assert.equal(hasAdminPermission({ permissions: ['content.generation.read'] }, 'content.generation.read'), true);
  assert.equal(hasAdminPermission({ permissions: ['content.generation.read'] }, 'content.generation.run'), false);
  assert.equal(hasAdminPermission({ permissions: ['*'] }, 'content.generation.run'), true);
});

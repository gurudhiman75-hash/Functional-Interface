import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/lib/auth.ts', import.meta.url), 'utf8');

assert.match(source, /function isAdminLoginHandoff\(\): boolean/);
assert.match(source, /window\.location\.pathname\.startsWith\("\/login\/admin"\)/);
assert.match(source, /if \(isAdminLoginHandoff\(\)\) \{\s*return createAdminHandoffUser\(firebaseUser\);\s*\}/);
assert.match(source, /The admin application then\s*\/\/ verifies the Firebase token against canonical RBAC/);
assert.match(source, /return fetchOrCreateUserProfile\(firebaseUser\);/);

console.log('admin login handoff contract passed');

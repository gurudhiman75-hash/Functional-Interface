import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const source = readFileSync(new URL('../scripts/deploy-examtree-cloudrun-admin-zero-traffic.sh', import.meta.url), 'utf8');

test('production canary accepts the existing nondelegated administrative routing flag', () => {
  assert.match(source, /'EXAMTREE_ADMIN_ROUTES_DELEGATED_RENDER':'false'/);
  assert.match(source, /--no-traffic --tag=admin-candidate/);
});

test('candidate deployment verifies pinned serving revision allocation unchanged', () => {
  assert.match(source, /def live_alloc\(x\):/);
  assert.match(source, /live_alloc\(traffic\)==live_alloc\(before\['status'\]\.get\('traffic',\[\]\)\)/);
  assert.match(source, /candidate unexpectedly serving traffic/);
  assert.doesNotMatch(source, /unexpected traffic split/);
});

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { listSifAuthorities } from '../topics/Statement-and-Inference/SIF-001/authorities';
import { validateSifAuthority } from '../topics/Statement-and-Inference/SIF-001/validators';

test('SIF-001 NOVELTY validator proves repeat-detection readiness, not controlled-novel provenance', () => {
  const authorities = listSifAuthorities('SIF-CP011');
  assert.ok(authorities.length > 0);

  for (const authority of authorities.slice(0, 8)) {
    const novelty = validateSifAuthority(authority).find((gate) => gate.gate === 'NOVELTY');
    assert.ok(novelty);
    assert.equal(novelty?.passed, true);
    assert.match(String(novelty?.detail), /novelty-audit readiness only/iu);
    assert.match(String(novelty?.detail), /does not grant CONTROLLED_NOVEL provenance/iu);
  }
});

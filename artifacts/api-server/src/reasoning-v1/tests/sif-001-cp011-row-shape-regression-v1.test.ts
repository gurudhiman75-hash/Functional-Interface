import assert from 'node:assert/strict';
import { test } from 'node:test';
import { SIF_CP011_MULTIPLE_FACTOR_AUTHORITIES } from '../topics/Statement-and-Inference/SIF-001/cp011-multiple-factor-authorities';

test('SIF CP011 legacy rows normalize into complete trilingual authorities', () => {
  assert.equal(SIF_CP011_MULTIPLE_FACTOR_AUTHORITIES.length, 24);

  for (const authority of SIF_CP011_MULTIPLE_FACTOR_AUTHORITIES) {
    assert.equal(authority.cpId, 'SIF-CP011');
    assert.ok(authority.id.startsWith('SIF-CP011-'));
    for (const locale of ['en-IN', 'hi-IN', 'pa-IN'] as const) {
      assert.ok(authority.statement[locale].trim().length > 20, authority.id + '/' + locale + ' missing statement');
      assert.ok(authority.candidates[0].text[locale].trim().length > 5, authority.id + '/' + locale + ' missing inference I');
      assert.ok(authority.candidates[1].text[locale].trim().length > 5, authority.id + '/' + locale + ' missing inference II');
      assert.ok(authority.explanation[locale].trim().length > 20, authority.id + '/' + locale + ' missing explanation');
    }
  }
});

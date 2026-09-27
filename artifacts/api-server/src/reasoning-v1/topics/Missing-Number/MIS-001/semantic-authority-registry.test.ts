import assert from 'node:assert/strict';
import {
  MIS_SEMANTIC_AUTHORITY_ALIASES,
  canonicalMisSemanticAuthorityId,
  misCandidateCreatesSemanticAuthority,
} from './semantic-authority-registry';

assert.equal(MIS_SEMANTIC_AUTHORITY_ALIASES.length, 35);

const mappings: Record<string,string> = {
  'MIS-CAND-028':'MIS-CAND-021',
  'MIS-CAND-029':'MIS-CAND-022',
  'MIS-CAND-035':'MIS-CAND-011',
  'MIS-CAND-036':'MIS-CAND-011',
  'MIS-CAND-037':'MIS-CAND-011',
  'MIS-CAND-038':'MIS-CAND-011',
  'MIS-CAND-039':'MIS-CAND-009',
  'MIS-CAND-040':'MIS-CAND-012',
  'MIS-CAND-041':'MIS-CAND-012',
  'MIS-CAND-042':'MIS-CAND-019',
  'MIS-CAND-043':'MIS-CAND-009',
  'MIS-CAND-044':'MIS-CAND-050',
  'MIS-CAND-045':'MIS-CAND-011',
  'MIS-CAND-047':'MIS-CAND-053',
  'MIS-CAND-048':'MIS-CAND-051',
  'MIS-CAND-049':'MIS-CAND-067',
  'MIS-CAND-052':'MIS-CAND-051',
  'MIS-CAND-055':'MIS-CAND-051',
  'MIS-CAND-056':'MIS-CAND-053',
  'MIS-CAND-057':'MIS-CAND-001',
  'MIS-CAND-058':'MIS-CAND-003',
  'MIS-CAND-060':'MIS-CAND-017',
  'MIS-CAND-061':'MIS-CAND-012',
  'MIS-CAND-062':'MIS-CAND-011',
  'MIS-CAND-063':'MIS-CAND-051',
  'MIS-CAND-065':'MIS-CAND-051',
  'MIS-CAND-066':'MIS-CAND-051',
  'MIS-CAND-068':'MIS-CAND-054',
  'MIS-CAND-079':'MIS-CAND-001',
  'MIS-CAND-080':'MIS-CAND-017',
  'MIS-CAND-081':'MIS-CAND-051',
  'MIS-CAND-082':'MIS-CAND-075',
  'MIS-CAND-083':'MIS-CAND-051',
  'MIS-CAND-086':'MIS-CAND-050',
  'MIS-CAND-097':'MIS-CAND-059',
};

for (const [runtime, canonical] of Object.entries(mappings)) {
  assert.equal(canonicalMisSemanticAuthorityId(runtime), canonical, runtime);
  assert.equal(misCandidateCreatesSemanticAuthority(runtime), false, runtime);
}

const all = Array.from({length:103},(_,i)=>'MIS-CAND-'+String(i+1).padStart(3,'0'));
const authorities = new Set(all.map(canonicalMisSemanticAuthorityId));
assert.equal(authorities.size,68);
assert.equal(all.filter(misCandidateCreatesSemanticAuthority).length,68);

assert.equal(canonicalMisSemanticAuthorityId('MIS-CAND-062'),'MIS-CAND-011');
assert.equal(canonicalMisSemanticAuthorityId('MIS-CAND-066'),'MIS-CAND-051');

console.log('MIS-001 semantic authority registry audit passed.',{
  runtimePatterns:all.length,
  semanticAuthorities:authorities.size,
  aliases:MIS_SEMANTIC_AUTHORITY_ALIASES.length,
});

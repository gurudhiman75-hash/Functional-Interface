import assert from'node:assert/strict';
import{MIS_CP023_CANDIDATE_IDS,generateMisCp023Question}from'./generator';
import{independentlyVerifyMisCp023Group}from'./independent-solver';

assert.deepEqual(MIS_CP023_CANDIDATE_IDS,['MIS-CAND-107']);
const fingerprints=new Set<string>();
for(let i=0;i<120;i++){
 const q=generateMisCp023Question('MIS-CAND-107','mis-cp023-test-'+i);
 assert.equal(q.sourceBacked,true);
 assert.equal(q.createsNewSemanticAuthority,true);
 assert.equal(q.options.length,4);
 assert.equal(new Set(q.options.map(o=>o.value)).size,4);
 assert.equal(q.options.filter(o=>o.errorLabel===null).length,1);
 assert.equal(q.options[q.correctIndex]!.value,q.answer);
 assert.equal(q.ambiguityAudit.accepted,true);
 assert.ok(q.evidenceGroups.every(g=>independentlyVerifyMisCp023Group(q.ruleId,g)));
 assert.ok(independentlyVerifyMisCp023Group(q.ruleId,q.target));
 assert.match(q.explanation,/square roots/i);
 fingerprints.add(q.numericFingerprint);
}
assert.ok(fingerprints.size>=100);
console.log('MIS-CP-023 PSPCL mixed-root source authority audit passed.');

import assert from'node:assert/strict';
import{MIS_CP022_CANDIDATE_IDS,generateMisCp022Question}from'./generator';
import{independentlyVerifyMisCp022Group}from'./independent-solver';

assert.deepEqual(MIS_CP022_CANDIDATE_IDS,['MIS-CAND-106']);
const fingerprints=new Set<string>();
for(let i=0;i<120;i++){
 const q=generateMisCp022Question('MIS-CAND-106','mis-cp022-test-'+i);
 assert.equal(q.sourceBacked,true);
 assert.equal(q.createsNewSemanticAuthority,true);
 assert.equal(q.options.length,4);
 assert.equal(new Set(q.options.map(o=>o.value)).size,4);
 assert.equal(q.options.filter(o=>o.errorLabel===null).length,1);
 assert.equal(q.options[q.correctIndex]!.value,q.answer);
 assert.equal(q.ambiguityAudit.accepted,true);
 assert.ok(q.evidenceGroups.every(g=>independentlyVerifyMisCp022Group(q.ruleId,g)));
 assert.ok(independentlyVerifyMisCp022Group(q.ruleId,q.target));
 assert.match(q.explanation,/divide the sum by 2/i);
 fingerprints.add(q.numericFingerprint);
}
assert.ok(fingerprints.size>=100);
console.log('MIS-CP-022 source-backed arithmetic-mean audit passed.');

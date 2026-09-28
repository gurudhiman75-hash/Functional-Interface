import assert from'node:assert/strict';
import{MIS_CP025_CANDIDATE_IDS,generateMisCp025Question}from'./generator';
import{independentlyVerifyMisCp025Group}from'./independent-solver';

assert.deepEqual(MIS_CP025_CANDIDATE_IDS,['MIS-CAND-109']);
const fingerprints=new Set<string>();const positions=[0,0,0,0];
for(let i=0;i<120;i++){
 const seed='MIS-CP-025:'+i,q=generateMisCp025Question('MIS-CAND-109',seed),replay=generateMisCp025Question('MIS-CAND-109',seed);
 assert.deepEqual(q,replay);
 assert.equal(q.sourceBacked,true);
 assert.equal(q.createsNewSemanticAuthority,false);
 assert.equal(q.semanticAuthorityCandidateId,'MIS-CAND-003');
 assert.equal(q.renderer,'SVG_LINKED_PRODUCT');
 assert.equal(q.figures.length,3);
 assert.ok(q.figures.every(f=>f.svg.includes('linked product number figure')));
 assert.ok(q.evidenceGroups.every(independentlyVerifyMisCp025Group));
 assert.ok(independentlyVerifyMisCp025Group(q.target));
 assert.equal(q.answer,q.target.shared*q.target.rightInput);
 assert.equal(q.options.length,4);
 assert.equal(new Set(q.options.map(o=>o.value)).size,4);
 assert.equal(q.options[q.correctIndex]!.value,q.answer);
 assert.ok(q.explanation.includes('middle number is shared'));
 fingerprints.add(q.numericFingerprint);positions[q.correctIndex]++;
}
assert.ok(fingerprints.size>=100);
assert.ok(Math.max(...positions)/Math.min(...positions)<1.8);
console.log('MIS-CP-025 RRB linked-product renderer alias audit passed.',{fingerprints:fingerprints.size,answerPositions:positions});

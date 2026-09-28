import assert from'node:assert/strict';
import{MIS_CP026_CANDIDATE_IDS,generateMisCp026Question}from'./generator';
import{independentlyVerifyMisCp026Pair}from'./independent-solver';
assert.deepEqual(MIS_CP026_CANDIDATE_IDS,['MIS-CAND-110']);
const fingerprints=new Set<string>();const pos=[0,0,0,0];
for(let i=0;i<120;i++){
 const seed='MIS-CP-026:'+i,q=generateMisCp026Question('MIS-CAND-110',seed),r=generateMisCp026Question('MIS-CAND-110',seed);assert.deepEqual(q,r);
 assert.equal(q.sourceBacked,true);assert.equal(q.createsNewSemanticAuthority,false);assert.equal(q.semanticAuthorityCandidateId,'MIS-CAND-016');
 assert.equal(q.renderer,'SVG_OPPOSITE_SQUARE_WHEEL');assert.equal(q.figures.length,1);assert.ok(q.figures[0]!.svg.includes('opposite pair square number wheel'));
 assert.equal(q.evidenceGroups.length,3);assert.ok(q.evidenceGroups.every(independentlyVerifyMisCp026Pair));assert.ok(independentlyVerifyMisCp026Pair(q.target));
 assert.equal(q.answer,q.target.input*q.target.input);assert.equal(q.options.length,4);assert.equal(new Set(q.options.map(o=>o.value)).size,4);assert.equal(q.options[q.correctIndex]!.value,q.answer);
 fingerprints.add(q.numericFingerprint);pos[q.correctIndex]++;
}
assert.ok(fingerprints.size>=80);assert.ok(Math.max(...pos)/Math.min(...pos)<1.8);
console.log('MIS-CP-026 RRB opposite-square renderer alias audit passed.',{fingerprints:fingerprints.size,answerPositions:pos});
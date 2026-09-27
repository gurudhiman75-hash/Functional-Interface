import assert from'node:assert/strict';
import{generateMisCp014Question,MIS_CP014_CANDIDATE_IDS}from'./generator';
import{independentlySolveMisCp014Missing,independentlySumMisCp014Group}from'./independent-solver';
assert.deepEqual(MIS_CP014_CANDIDATE_IDS,['MIS-CAND-086']);
let total=0;const corners=new Set<string>(),pos=[0,0,0,0];
for(let seed=0;seed<80;seed++){
 const s='CP014:'+seed,q=generateMisCp014Question('MIS-CAND-086',s),r=generateMisCp014Question('MIS-CAND-086',s);assert.deepEqual(q,r);
 assert.equal(q.sourceBacked,true);assert.equal(q.createsNewSemanticAuthority,false);assert.equal(q.semanticAuthorityCandidateId,'MIS-CAND-050');
 assert.ok(q.evidenceGroups.every(g=>independentlySumMisCp014Group(g)===q.targetTotal));
 assert.equal(independentlySumMisCp014Group(q.target),q.targetTotal);
 assert.equal(independentlySolveMisCp014Missing(q.target,q.targetTotal,q.missingCorner),q.answer);
 assert.equal(q.options.length,4);assert.equal(new Set(q.options.map(o=>o.value)).size,4);assert.equal(q.options[q.correctIndex]!.value,q.answer);
 assert.equal(q.figures.length,3);assert.ok(q.figures.every(f=>f.svg.includes('<rect')&&!f.svg.includes('<circle')));
 assert.equal((q.stem.match(/\?/g)??[]).length,1);
 assert.ok(!q.figures[0]!.svg.includes('>?</text>')&&!q.figures[1]!.svg.includes('>?</text>'));
 assert.ok(q.figures[2]!.svg.includes('>?</text>'));
 corners.add(q.missingCorner);pos[q.correctIndex]++;total++;
}
assert.equal(total,80);assert.deepEqual([...corners].sort(),['bottomLeft','bottomRight','topLeft','topRight']);assert.ok(Math.max(...pos)/Math.min(...pos)<1.8);
console.log('MIS-CP-014 PSPCL missing-corner audit passed.',{total,corners:[...corners],answerPositions:pos});

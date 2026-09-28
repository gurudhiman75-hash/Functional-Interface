import assert from'node:assert/strict';
import{generateMisCp016Question,MIS_CP016_CANDIDATE_IDS}from'./generator';
import{independentlyEvaluateMisCp016Rule,independentlyVerifyMisCp016Group}from'./independent-solver';
assert.deepEqual(MIS_CP016_CANDIDATE_IDS,['MIS-CAND-090']);
let total=0;const pos=[0,0,0,0],numeric=new Set<string>();
for(let seed=0;seed<80;seed++){
 const s='CP016:'+seed,q=generateMisCp016Question('MIS-CAND-090',s),r=generateMisCp016Question('MIS-CAND-090',s);assert.deepEqual(q,r);
 assert.equal(q.sourceBacked,true);assert.equal(q.createsNewSemanticAuthority,true);assert.equal(q.semanticAuthorityCandidateId,'MIS-CAND-090');
 assert.equal(q.context.k,2);assert.equal(q.ambiguityAudit.accepted,true);assert.deepEqual(q.ambiguityAudit.survivingRules,['ROW_PRODUCTS_DIFFERENCE_TIMES_2']);
 assert.ok(q.evidenceGroups.every(g=>independentlyVerifyMisCp016Group(g,q.context)));
 assert.equal(independentlyEvaluateMisCp016Rule(q.target.a,q.target.b,q.target.c,q.target.d,q.context),q.answer);
 assert.equal(q.options.length,4);assert.equal(new Set(q.options.map(o=>o.value)).size,4);assert.equal(q.options[q.correctIndex]!.value,q.answer);
 assert.equal(q.renderer,'SVG_BOX');assert.ok(q.figures.every(f=>f.svg.includes('<rect')&&f.svg.includes('<circle')));
 assert.ok(q.explanation.includes('multiply that difference by 2'));assert.ok(q.explanation.includes(`So, ? = ${q.answer}.`));
 numeric.add(q.numericFingerprint);pos[q.correctIndex]++;total++;
}
assert.equal(total,80);assert.ok(numeric.size>=40);assert.ok(Math.max(...pos)/Math.min(...pos)<1.8);
console.log('MIS-CP-016 SSC GD source audit passed.',{total,answerPositions:pos});

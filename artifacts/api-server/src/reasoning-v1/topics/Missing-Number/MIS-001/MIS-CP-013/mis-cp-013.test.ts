import assert from'node:assert/strict';
import{generateMisCp013Question,MIS_CP013_CANDIDATE_IDS}from'./generator';
import{independentlyEvaluateMisCp013Rule}from'./independent-solver';
import{MIS_CP013_RULES}from'./rule-definitions';

assert.equal(MIS_CP013_RULES.length,2);
let total=0;const pos=[0,0,0,0];
for(const id of MIS_CP013_CANDIDATE_IDS){
  const numeric=new Set<string>();
  for(let seed=0;seed<60;seed++){
    const s=`CP013:${id}:${seed}`,q=generateMisCp013Question(id,s),r=generateMisCp013Question(id,s);
    assert.deepEqual(q,r);
    assert.equal(q.sourceBacked,true);
    assert.equal(q.createsNewSemanticAuthority,true);
    assert.equal(q.semanticAuthorityCandidateId,id);
    assert.equal(q.ambiguityAudit.accepted,true);
    assert.equal(q.ambiguityAudit.survivingRules.length,1);
    assert.equal(independentlyEvaluateMisCp013Rule(q.ruleId,q.target.a,q.target.b,q.context),q.answer);
    if(id==='MIS-CAND-084')assert.equal(q.context.k,2);
    assert.equal(q.options.length,4);
    assert.equal(new Set(q.options.map(o=>o.value)).size,4);
    assert.equal(q.options[q.correctIndex]!.value,q.answer);
    assert.ok(q.explanation.includes(`So, ? = ${q.answer}.`));
    numeric.add(q.numericFingerprint);pos[q.correctIndex]++;total++;
  }
  assert.ok(numeric.size>=20,`${id}: low numeric diversity`);
}
assert.equal(total,120);
assert.ok(Math.max(...pos)/Math.min(...pos)<1.8);
console.log('MIS-CP-013 source-discovered audit passed.',{total,answerPositions:pos});

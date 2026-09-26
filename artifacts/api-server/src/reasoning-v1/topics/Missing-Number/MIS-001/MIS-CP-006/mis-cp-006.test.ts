import assert from 'node:assert/strict';
import {generateMisCp006Question,MIS_CP006_CANDIDATE_IDS} from './generator';
import {independentlyEvaluateMisCp006Rule,matchingMisCp006Rules} from './independent-solver';
import {MIS_CP006_RULES} from './rule-definitions';

assert.equal(MIS_CP006_RULES.length,7); const pos=[0,0,0,0],structural=new Set<string>();let total=0;
for(const id of MIS_CP006_CANDIDATE_IDS){
  const numeric=new Set<string>();
  for(let seed=0;seed<60;seed++){
    const s=`CP006:${id}:${seed}`,q=generateMisCp006Question(id,s),r=generateMisCp006Question(id,s);assert.deepEqual(q,r);
    const rule=MIS_CP006_RULES.find(x=>x.candidateId===id)!;assert.equal(q.renderer,'SVG_CIRCLE');assert.equal(q.operandCount,rule.surroundingCount);
    assert.equal(q.ambiguityAudit.accepted,true);assert.equal(new Set(matchingMisCp006Rules(q.evidenceGroups).map(m=>m.semanticKey)).size,1);
    assert.equal(independentlyEvaluateMisCp006Rule(q.ruleId,{top:q.target.top,right:q.target.right,bottom:q.target.bottom,left:q.target.left}),q.answer);
    assert.equal(q.figures.length,q.groupCount);assert.ok(q.figures.every((f,i)=>f.svg.includes('<circle')&&(i===q.figures.length-1?f.svg.includes('>?</text>'):!f.svg.includes('>?</text>'))));
    assert.equal(q.options.length,4);assert.equal(new Set(q.options.map(o=>o.value)).size,4);assert.equal(q.options[q.correctIndex]!.value,q.answer);
    assert.ok(q.explanation.includes('The same rule is used in every circle.'));assert.ok(q.explanation.includes(`So, ? = ${q.answer}.`));
    numeric.add(q.numericFingerprint);structural.add(q.structuralFingerprint);pos[q.correctIndex]++;total++;
  }
  assert.ok(numeric.size>=20,`${id}: low numeric diversity`);
}
assert.equal(total,420);assert.ok(Math.max(...pos)/Math.min(...pos)<1.5);assert.ok(structural.size>=7);
console.log('MIS-CP-006 circle audit passed.',{total,answerPositions:pos,structural:structural.size});

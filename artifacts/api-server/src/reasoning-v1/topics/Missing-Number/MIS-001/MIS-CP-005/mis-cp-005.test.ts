import assert from 'node:assert/strict';
import {generateMisCp005Question,MIS_CP005_CANDIDATE_IDS} from './generator';
import {independentlyEvaluateMisCp005Rule,matchingMisCp005Rules} from './independent-solver';
import {MIS_CP005_RULES} from './rule-definitions';

assert.equal(MIS_CP005_RULES.length,8); assert.equal(MIS_CP005_CANDIDATE_IDS.length,8);
const pos=[0,0,0,0], structural=new Set<string>(); let total=0;
for(const id of MIS_CP005_CANDIDATE_IDS){
  const numeric=new Set<string>();
  for(let seed=0;seed<60;seed++){
    const s=`CP005:${id}:${seed}`,q=generateMisCp005Question(id,s),r=generateMisCp005Question(id,s);
    assert.deepEqual(q,r); assert.equal(q.renderer,'SVG_TRIANGLE'); assert.equal(q.missingPosition,'CENTRE_MISSING');
    assert.deepEqual(q.semanticPositions,['top','left','right','centre']);
    assert.equal(q.ambiguityAudit.accepted,true); assert.equal(new Set(matchingMisCp005Rules(q.evidenceGroups).map(m=>m.semanticKey)).size,1);
    assert.equal(independentlyEvaluateMisCp005Rule(q.ruleId,q.target.top,q.target.left,q.target.right),q.answer);
    assert.equal(q.figures.length,q.groupCount); assert.ok(q.figures.every((f,i)=>f.svg.includes('<polygon')&&f.svg.includes('<circle')&&(i===q.figures.length-1?f.svg.includes('>?</text>'):!f.svg.includes('>?</text>'))));
    assert.equal(q.options.length,4); assert.equal(new Set(q.options.map(o=>o.value)).size,4); assert.equal(q.options[q.correctIndex]!.value,q.answer);
    assert.ok(q.explanation.includes('The same rule is used in every triangle.')); assert.ok(q.explanation.includes(`So, ? = ${q.answer}.`));
    numeric.add(q.numericFingerprint);structural.add(q.structuralFingerprint);pos[q.correctIndex]++;total++;
  }
  assert.ok(numeric.size>=20,`${id}: low numeric diversity`);
}
assert.equal(total,480); assert.ok(Math.max(...pos)/Math.min(...pos)<1.5); assert.ok(structural.size>=8);
console.log('MIS-CP-005 triangle audit passed.',{total,answerPositions:pos,structural:structural.size});

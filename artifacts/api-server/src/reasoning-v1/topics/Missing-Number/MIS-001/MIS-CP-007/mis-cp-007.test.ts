import assert from 'node:assert/strict';
import {generateMisCp007Question,MIS_CP007_CANDIDATE_IDS} from './generator';
import {independentlyEvaluateMisCp007Rule,matchingMisCp007Rules} from './independent-solver';
import {MIS_CP007_RULES} from './rule-definitions';

assert.equal(MIS_CP007_RULES.length,7);const pos=[0,0,0,0],shapes=new Set<string>(),structural=new Set<string>();let total=0;
for(const id of MIS_CP007_CANDIDATE_IDS){
  const numeric=new Set<string>();
  for(let seed=0;seed<60;seed++){
    const s=`CP007:${id}:${seed}`,q=generateMisCp007Question(id,s),r=generateMisCp007Question(id,s);assert.deepEqual(q,r);
    assert.equal(q.renderer,'SVG_BOX');assert.equal(q.operandCount,4);assert.equal(q.ambiguityAudit.accepted,true);
    assert.equal(new Set(matchingMisCp007Rules(q.evidenceGroups).map(m=>m.semanticKey)).size,1);
    assert.equal(independentlyEvaluateMisCp007Rule(q.ruleId,{topLeft:q.target.topLeft,topRight:q.target.topRight,bottomLeft:q.target.bottomLeft,bottomRight:q.target.bottomRight}),q.answer);
    assert.ok(q.figures.every((f,i)=>f.svg.includes('<rect')&&f.svg.includes('<circle')&&(i===q.figures.length-1?f.svg.includes('>?</text>'):!f.svg.includes('>?</text>'))));
    q.figures.forEach(f=>shapes.add(f.shape));assert.equal(q.options.length,4);assert.equal(new Set(q.options.map(o=>o.value)).size,4);assert.equal(q.options[q.correctIndex]!.value,q.answer);
    assert.ok(q.explanation.includes('The same rule is used in every box.'));assert.ok(q.explanation.includes(`So, ? = ${q.answer}.`));
    numeric.add(q.numericFingerprint);structural.add(q.structuralFingerprint);pos[q.correctIndex]++;total++;
  }
  assert.ok(numeric.size>=20,`${id}: low numeric diversity`);
}
assert.equal(total,420);assert.deepEqual([...shapes].sort(),['RECTANGLE','SQUARE']);assert.ok(Math.max(...pos)/Math.min(...pos)<1.5);assert.ok(structural.size>=14);
console.log('MIS-CP-007 box audit passed.',{total,answerPositions:pos,shapes:[...shapes],structural:structural.size});

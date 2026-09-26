import assert from 'node:assert/strict';
import {generateMisCp008Question,MIS_CP008_CANDIDATE_IDS} from './generator';
import {independentlySolveMisCp008Missing,matchingMisCp008Rules} from './independent-solver';
import {MIS_CP008_RULES} from './rule-definitions';
assert.equal(MIS_CP008_RULES.length,6);
let total=0;const positions=new Set<string>();const pos=[0,0,0,0];
for(const id of MIS_CP008_CANDIDATE_IDS){const numeric=new Set<string>();for(let seed=0;seed<60;seed++){
 const s=`CP008:${id}:${seed}`,q=generateMisCp008Question(id,s),r=generateMisCp008Question(id,s);assert.deepEqual(q,r);
 const rule=MIS_CP008_RULES.find(x=>x.candidateId===id)!;assert.equal(q.ambiguityAudit.accepted,true);assert.equal(new Set(matchingMisCp008Rules(q.evidenceGroups).map(m=>m.semanticKey)).size,1);
 const solved=independentlySolveMisCp008Missing(q.ruleId,q.target,q.missingPosition,rule.minInput,rule.maxInput);assert.deepEqual(solved,[q.answer]);
 assert.equal(q.options.length,4);assert.equal(new Set(q.options.map(o=>o.value)).size,4);assert.equal(q.options[q.correctIndex]!.value,q.answer);
 assert.ok(q.explanation.includes('same rule'));assert.ok(q.explanation.includes(`So, ? = ${q.answer}.`));
 if(q.renderer==='SVG_TRIANGLE')assert.ok(q.figures?.every(f=>f.svg.includes('<polygon')));
 positions.add(q.missingPosition);numeric.add(q.numericFingerprint);pos[q.correctIndex]++;total++;
 }assert.ok(numeric.size>=20,`${id}: low numeric diversity`);}
assert.equal(total,360);assert.ok([...positions].some(p=>p!=='RESULT'&&p!=='CENTRE'));assert.ok(Math.max(...pos)/Math.min(...pos)<1.6);
console.log('MIS-CP-008 inverse audit passed.',{total,positions:[...positions],answerPositions:pos});

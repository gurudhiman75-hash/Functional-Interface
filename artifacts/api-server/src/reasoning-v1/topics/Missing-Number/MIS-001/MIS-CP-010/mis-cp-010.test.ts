import assert from 'node:assert/strict';
import {generateMisCp010Question,MIS_CP010_CANDIDATE_IDS} from './generator';
import {matchingMisCp010Rules,independentlyEvaluateMisCp010Rule} from './independent-solver';
import {MIS_CP010_RULES} from './rule-definitions';
assert.equal(MIS_CP010_RULES.length,6);let total=0;const pos=[0,0,0,0];
for(const id of MIS_CP010_CANDIDATE_IDS){const numeric=new Set<string>();for(let seed=0;seed<60;seed++){
 const s=`CP010:${id}:${seed}`,q=generateMisCp010Question(id,s),r=generateMisCp010Question(id,s);assert.deepEqual(q,r);
 assert.equal(q.wholeNumberOrDigitMode,'DIGIT');assert.equal(q.ambiguityAudit.accepted,true);assert.equal(new Set(matchingMisCp010Rules(q.evidenceGroups).map(m=>m.semanticKey)).size,1);
 assert.equal(independentlyEvaluateMisCp010Rule(q.ruleId,q.target.number,q.target.visible),q.answer);
 assert.ok([...q.evidenceGroups,q.target].every(g=>g.number>=11&&g.number<=99&&g.number%10!==0));
 assert.equal(q.options.length,4);assert.equal(new Set(q.options.map(o=>o.value)).size,4);assert.equal(q.options[q.correctIndex]!.value,q.answer);
 assert.ok(q.explanation.startsWith('This is a digit-based pattern.'));assert.ok(q.explanation.includes(`So, ? = ${q.answer}.`));
 numeric.add(q.numericFingerprint);pos[q.correctIndex]++;total++;
 }assert.ok(numeric.size>=20,`${id}: low numeric diversity`);}
assert.equal(total,360);assert.ok(Math.max(...pos)/Math.min(...pos)<1.6);
console.log('MIS-CP-010 digit audit passed.',{total,answerPositions:pos});

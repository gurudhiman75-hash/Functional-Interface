import assert from 'node:assert/strict';
import {generateMisCp009Question,MIS_CP009_CANDIDATE_IDS} from './generator';
import {independentlyEvaluateMisCp009Rule,matchingMisCp009Rules} from './independent-solver';
import {MIS_CP009_RULES} from './rule-definitions';
assert.equal(MIS_CP009_RULES.length,6);let total=0;const authorities=new Set<string>(),shapes=new Set<string>(),pos=[0,0,0,0];
for(const id of MIS_CP009_CANDIDATE_IDS){const numeric=new Set<string>();for(let seed=0;seed<60;seed++){
 const s=`CP009:${id}:${seed}`,q=generateMisCp009Question(id,s),r=generateMisCp009Question(id,s);assert.deepEqual(q,r);
 assert.equal(q.ambiguityAudit.accepted,true);assert.equal(new Set(matchingMisCp009Rules(q.evidenceGroups).map(m=>m.semanticKey)).size,1);
 assert.equal(independentlyEvaluateMisCp009Rule(q.ruleId,q.target.a,q.target.b,q.target.c,q.target.d),q.answer);
 assert.equal(q.renderer,'SVG_BOX');assert.ok(q.figures.every(f=>f.svg.includes('<rect')&&f.svg.includes('<circle')));q.figures.forEach(f=>shapes.add(f.shape));
 assert.equal(q.options.length,4);assert.equal(new Set(q.options.map(o=>o.value)).size,4);assert.equal(q.options[q.correctIndex]!.value,q.answer);
 authorities.add(q.pairingAuthority);numeric.add(q.numericFingerprint);pos[q.correctIndex]++;total++;
 }assert.ok(numeric.size>=20,`${id}: low numeric diversity`);}
assert.equal(total,360);assert.deepEqual([...authorities].sort(),['COLUMNS','DIAGONALS','GROUPED_ROWS','ROWS']);assert.deepEqual([...shapes].sort(),['RECTANGLE','SQUARE']);assert.ok(Math.max(...pos)/Math.min(...pos)<1.6);
console.log('MIS-CP-009 pair/cross audit passed.',{total,authorities:[...authorities],shapes:[...shapes]});

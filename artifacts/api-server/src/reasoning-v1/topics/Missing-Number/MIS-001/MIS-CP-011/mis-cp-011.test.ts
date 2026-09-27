import assert from'node:assert/strict';
import{generateMisCp011Question,MIS_CP011_CANDIDATE_IDS}from'./generator';
import{independentlyEvaluateMisCp011Rule,matchingMisCp011Rules}from'./independent-solver';
import{MIS_CP011_RULES}from'./rule-definitions';
assert.equal(MIS_CP011_RULES.length,3);let total=0;const pos=[0,0,0,0];
for(const id of MIS_CP011_CANDIDATE_IDS){const numeric=new Set<string>();for(let seed=0;seed<60;seed++){
 const s=`CP011:${id}:${seed}`,q=generateMisCp011Question(id,s),r=generateMisCp011Question(id,s);assert.deepEqual(q,r);
 assert.equal(q.ambiguityAudit.accepted,true);assert.equal(new Set(matchingMisCp011Rules(q.evidenceGroups).map(m=>m.semanticKey)).size,1);
 assert.equal(independentlyEvaluateMisCp011Rule(q.ruleId,q.target.a,q.target.b,q.target.c),q.answer);
 assert.equal(q.options.length,4);assert.equal(new Set(q.options.map(o=>o.value)).size,4);assert.equal(q.options[q.correctIndex]!.value,q.answer);
 assert.equal(q.createsNewSemanticAuthority,true);assert.equal(q.semanticAuthorityCandidateId,id);
 assert.ok(q.stem.split('\n').filter(Boolean).length>=4);assert.ok(q.explanation.includes(`So, ? = ${q.answer}.`));
 numeric.add(q.numericFingerprint);pos[q.correctIndex]++;total++;
 }assert.ok(numeric.size>=20,`${id}: low numeric diversity`);}
assert.equal(total,180);assert.ok(Math.max(...pos)/Math.min(...pos)<1.7);
console.log('MIS-CP-011 audit passed.',{total,answerPositions:pos});

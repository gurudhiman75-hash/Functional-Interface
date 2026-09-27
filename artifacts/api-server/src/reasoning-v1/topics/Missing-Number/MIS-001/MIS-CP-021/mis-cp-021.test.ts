import assert from'node:assert/strict';
import{generateMisCp021Question,MIS_CP021_CANDIDATE_IDS}from'./generator';
import{independentlyEvaluateMisCp021Rule,independentlyVerifyMisCp021Group}from'./independent-solver';
import{MIS_CP021_RULES}from'./rule-definitions';
assert.equal(MIS_CP021_RULES.length,2);
let total=0;const pos=[0,0,0,0];
for(const id of MIS_CP021_CANDIDATE_IDS){const numeric=new Set<string>();for(let seed=0;seed<80;seed++){
 const s='MIS-CP-021:'+id+':'+seed,q=generateMisCp021Question(id,s),r=generateMisCp021Question(id,s);assert.deepEqual(q,r);
 assert.equal(q.sourceBacked,true);assert.equal(q.createsNewSemanticAuthority,true);assert.equal(q.semanticAuthorityCandidateId,id);
 assert.equal(q.ambiguityAudit.accepted,true);assert.equal(q.ambiguityAudit.survivingRules.length,1);
 assert.ok(q.evidenceGroups.every(g=>independentlyVerifyMisCp021Group(q.ruleId,g)));
 assert.equal(independentlyEvaluateMisCp021Rule(q.ruleId,q.target.inputs),q.answer);
 assert.equal(q.options.length,4);assert.equal(new Set(q.options.map(o=>o.value)).size,4);assert.equal(q.options[q.correctIndex]!.value,q.answer);
 assert.ok(q.explanation.includes('So, ? = '+String(q.answer)+'.'));numeric.add(q.numericFingerprint);pos[q.correctIndex]++;total++;
 }assert.ok(numeric.size>=35,id+': low numeric diversity');}
assert.equal(total,160);assert.ok(Math.max(...pos)/Math.min(...pos)<1.8);
console.log('MIS-CP-021 SSC source audit passed.',{total,answerPositions:pos});
import assert from'node:assert/strict';
import{generateMisCp020Question,MIS_CP020_CANDIDATE_IDS}from'./generator';
import{independentlyEvaluateMisCp020Rule,independentlyVerifyMisCp020Group}from'./independent-solver';
import{MIS_CP020_RULES}from'./rule-definitions';
assert.equal(MIS_CP020_RULES.length,3);
let total=0;const pos=[0,0,0,0];
for(const id of MIS_CP020_CANDIDATE_IDS){const numeric=new Set<string>();for(let seed=0;seed<80;seed++){
 const s='MIS-CP-020:'+id+':'+seed,q=generateMisCp020Question(id,s),r=generateMisCp020Question(id,s);assert.deepEqual(q,r);
 assert.equal(q.sourceBacked,true);assert.equal(q.createsNewSemanticAuthority,true);assert.equal(q.semanticAuthorityCandidateId,id);
 assert.equal(q.ambiguityAudit.accepted,true);assert.equal(q.ambiguityAudit.survivingRules.length,1);
 assert.ok(q.evidenceGroups.every(g=>independentlyVerifyMisCp020Group(q.ruleId,g)));
 assert.equal(independentlyEvaluateMisCp020Rule(q.ruleId,q.target.first,q.target.second),q.answer);
 assert.equal(q.options.length,4);assert.equal(new Set(q.options.map(o=>o.value)).size,4);assert.equal(q.options[q.correctIndex]!.value,q.answer);
 assert.ok(q.explanation.includes('So, ? = '+String(q.answer)+'.'));assert.equal(q.wholeNumberOrDigitMode,'WHOLE_NUMBER');
 numeric.add(q.numericFingerprint);pos[q.correctIndex]++;total++;
 }assert.ok(numeric.size>=35,id+': low numeric diversity');}
assert.equal(total,240);assert.ok(Math.max(...pos)/Math.min(...pos)<1.8);
console.log('MIS-CP-020 SSC root-extraction audit passed.',{total,answerPositions:pos});

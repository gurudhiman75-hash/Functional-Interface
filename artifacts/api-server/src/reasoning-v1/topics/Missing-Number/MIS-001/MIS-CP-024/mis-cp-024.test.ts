import assert from'node:assert/strict';
import{generateMisCp024Question,MIS_CP024_CANDIDATE_IDS}from'./generator';
import{independentlyEvaluateMisCp024Rule,independentlyVerifyMisCp024Group}from'./independent-solver';
assert.deepEqual(MIS_CP024_CANDIDATE_IDS,['MIS-CAND-108']);
const fingerprints=new Set<string>();const pos=[0,0,0,0];
for(let seed=0;seed<100;seed++){
 const s='MIS-CP-024:'+seed,q=generateMisCp024Question('MIS-CAND-108',s),r=generateMisCp024Question('MIS-CAND-108',s);assert.deepEqual(q,r);
 assert.equal(q.sourceBacked,true);assert.equal(q.createsNewSemanticAuthority,true);assert.equal(q.semanticAuthorityCandidateId,'MIS-CAND-108');
 assert.equal(q.context.multiplier,3);assert.equal(q.context.addend,1);assert.equal(q.ruleId,'SECOND_INPUT_AFFINE');assert.equal(q.operandCount,1);assert.equal(q.ambiguityAudit.accepted,true);
 assert.ok(q.evidenceGroups.every(g=>independentlyVerifyMisCp024Group(g,q.context)));
 assert.equal(independentlyEvaluateMisCp024Rule(q.target.second,q.context),q.answer);
 assert.equal(q.options.length,4);assert.equal(new Set(q.options.map(o=>o.value)).size,4);assert.equal(q.options[q.correctIndex]!.value,q.answer);
 assert.ok(q.explanation.includes('use the second number'));assert.ok(q.explanation.includes('So, ? = '+String(q.answer)+'.'));
 fingerprints.add(q.numericFingerprint);pos[q.correctIndex]++;
}
assert.ok(fingerprints.size>=35);assert.ok(Math.max(...pos)/Math.min(...pos)<1.8);
console.log('MIS-CP-024 repeated affine source audit passed.',{fingerprints:fingerprints.size,answerPositions:pos});
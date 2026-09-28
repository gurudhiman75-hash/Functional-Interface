import assert from 'node:assert/strict';
import { generateMisCp018Question, MIS_CP018_CANDIDATE_IDS } from './generator';
import { independentlyEvaluateMisCp018Rule, independentlyVerifyMisCp018Group } from './independent-solver';
import { MIS_CP018_RULES } from './rule-definitions';

assert.equal(MIS_CP018_RULES.length,4);
let total=0;const positions=[0,0,0,0];
for(const candidateId of MIS_CP018_CANDIDATE_IDS){
  const fingerprints=new Set<string>();
  for(let seed=0;seed<80;seed++){
    const itemSeed='MIS-CP-018:'+candidateId+':'+seed;
    const q=generateMisCp018Question(candidateId,itemSeed);
    const replay=generateMisCp018Question(candidateId,itemSeed);
    assert.deepEqual(q,replay);
    assert.equal(q.sourceBacked,true);
    assert.equal(q.createsNewSemanticAuthority,true);
    assert.equal(q.semanticAuthorityCandidateId,candidateId);
    assert.equal(q.ambiguityAudit.accepted,true);
    assert.equal(q.ambiguityAudit.survivingRules.length,1);
    assert.ok(q.evidenceGroups.every(g=>independentlyVerifyMisCp018Group(q.ruleId,g,q.context)));
    assert.equal(independentlyEvaluateMisCp018Rule(q.ruleId,q.target.first,q.target.second,q.context),q.answer);
    assert.equal(q.options.length,4);
    assert.equal(new Set(q.options.map(o=>o.value)).size,4);
    assert.equal(q.options[q.correctIndex]!.value,q.answer);
    assert.equal(q.wholeNumberOrDigitMode,'WHOLE_NUMBER');
    assert.ok(q.explanation.includes('So, ? = '+String(q.answer)+'.'));
    if(candidateId==='MIS-CAND-093')assert.equal(q.context.divisor,2);
    if(candidateId==='MIS-CAND-095'){assert.equal(q.context.weight,4);assert.equal(q.context.k,1);assert.equal(q.sourceThin,true);}
    fingerprints.add(q.numericFingerprint);positions[q.correctIndex]++;total++;
  }
  assert.ok(fingerprints.size>=35,candidateId+': low numeric diversity');
}
assert.equal(total,320);
assert.ok(Math.max(...positions)/Math.min(...positions)<1.8);
console.log('MIS-CP-018 SSC CHSL source audit passed.',{total,answerPositions:positions});

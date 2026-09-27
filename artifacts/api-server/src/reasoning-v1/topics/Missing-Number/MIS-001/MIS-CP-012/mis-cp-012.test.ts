import assert from'node:assert/strict';
import{generateMisCp012Question,MIS_CP012_CANDIDATE_IDS}from'./generator';
import{survivingMisCp012Rules,evaluateMisCp012Rule}from'./independent-solver';
import{MIS_CP012_PROFILES}from'./rule-definitions';
assert.equal(MIS_CP012_PROFILES.length,5);let total=0;const renderers=new Set<string>(),pos=[0,0,0,0];
for(const id of MIS_CP012_CANDIDATE_IDS){const numeric=new Set<string>();for(let seed=0;seed<50;seed++){
 const s=`CP012:${id}:${seed}`,q=generateMisCp012Question(id,s),r=generateMisCp012Question(id,s);assert.deepEqual(q,r);
 const p=MIS_CP012_PROFILES.find(x=>x.candidateId===id)!;
 assert.ok(survivingMisCp012Rules([p.intendedRule,p.competingRule],[q.evidenceGroups[0]!]).length>=2);
 assert.deepEqual(survivingMisCp012Rules([p.intendedRule,p.competingRule],q.evidenceGroups),[p.intendedRule]);
 assert.equal(evaluateMisCp012Rule(p.intendedRule,q.target.values),q.answer);
 assert.equal(q.firstGroupCompetingRuleCount,2);assert.equal(q.finalCompetingRuleCount,1);assert.equal(q.groupCount,4);
 assert.equal(q.createsNewSemanticAuthority,false);assert.equal(q.semanticAuthorityCandidateId,p.semanticAuthorityCandidateId);
 assert.equal(q.options.length,4);assert.equal(new Set(q.options.map(o=>o.value)).size,4);assert.equal(q.options[q.correctIndex]!.value,q.answer);
 assert.ok(q.explanation.includes('first example alone'));assert.ok(q.explanation.includes(`So, ? = ${q.answer}.`));
 if(q.renderer==='SVG_BOX')assert.ok(q.figures?.every(f=>f.svg.includes('<rect')));
 renderers.add(q.renderer);numeric.add(q.numericFingerprint);pos[q.correctIndex]++;total++;
 }assert.ok(numeric.size>=10,`${id}: low numeric diversity`);}
assert.equal(total,250);assert.deepEqual([...renderers].sort(),['SVG_BOX','TABLE_GROUP']);assert.ok(Math.max(...pos)/Math.min(...pos)<1.8);
console.log('MIS-CP-012 competition audit passed.',{total,renderers:[...renderers]});

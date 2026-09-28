import assert from "node:assert/strict";
import { DI006_ADVANCED_TASKS, DI006_ADVANCED_TOPOLOGIES, generateDi006AdvancedCaseletSet } from "./advanced-caselet-v1";

const topologies=new Set<string>(),tasks=new Set<string>();
let questions=0;
for(let i=0;i<350;i++){
  const seed=`DI-006-ADV-STRESS-${i}`;
  const profile=i%2?"BANKING_MAINS":"BANKING_PRELIMS";
  const set=generateDi006AdvancedCaseletSet({seed,examProfile:profile});
  const replay=generateDi006AdvancedCaseletSet({seed,examProfile:profile});
  assert.deepEqual(set,replay,`${seed}: deterministic replay failed`);
  assert.equal(set.questions.length,5);
  assert.deepEqual(set.questions.map(q=>q.difficulty),["Easy","Medium","Medium","Hard","Hard"]);
  assert.equal(set.resolvedValues.reduce((a,b)=>a+b,0),set.stimulus.totalValue);
  assert(set.stimulus.learnerText.includes(String(set.stimulus.totalValue)),`${seed}: total must be learner-visible`);
  for(const category of set.stimulus.categories){
    assert(set.stimulus.learnerText.includes(category),`${seed}: category absent from learner caselet: ${category}`);
  }
  assert(!/associated|shortcut|common trap/iu.test(set.stimulus.learnerText));
  topologies.add(set.stimulus.topology);
  for(const q of set.questions){
    questions++;tasks.add(q.kind);
    assert.equal(q.options.length,5);
    assert.equal(new Set(q.options).size,5,`${seed}: duplicate options`);
    assert.equal(q.options[q.correctIndex],q.answer,`${seed}: answer/index drift`);
    assert(!/\d+\.\d+/u.test(q.answer),`${seed}: decimal answer leaked: ${q.answer}`);
    assert(q.explanation.steps.length>0);
  }
}
assert.deepEqual([...topologies].sort(),[...DI006_ADVANCED_TOPOLOGIES].sort(),"Not all advanced caselet topologies exercised.");
assert.deepEqual([...tasks].sort(),[...DI006_ADVANCED_TASKS].sort(),"Not all advanced caselet tasks exercised.");
console.log("DI006_ADVANCED_CASELET_V1",JSON.stringify({sets:350,questions,topologies:[...topologies].sort(),tasks:[...tasks].sort()}));

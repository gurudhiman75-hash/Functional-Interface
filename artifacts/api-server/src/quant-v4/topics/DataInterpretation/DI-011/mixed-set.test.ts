import assert from "node:assert/strict";
import { DI011_PAIR_KINDS, DI011_TASK_KINDS, generateDi011MixedSet } from "./mixed-set";
import { renderDi011MixedSvg } from "./mixed-svg";

const pairs=new Set<string>(), tasks=new Set<string>();
let questions=0;
for(let i=0;i<300;i++){
  const seed=`DI-011-STRESS-${i}`;
  const a=generateDi011MixedSet({seed,examProfile:i%2?"BANKING_MAINS":"BANKING_PRELIMS"});
  const b=generateDi011MixedSet({seed,examProfile:i%2?"BANKING_MAINS":"BANKING_PRELIMS"});
  assert.deepEqual(a,b,`${seed}: deterministic replay failed`);
  assert.equal(a.questions.length,5);
  assert.deepEqual(a.questions.map(q=>q.difficulty),["Easy","Medium","Medium","Hard","Hard"]);
  pairs.add(a.stimulus.pairKind);
  const svg=renderDi011MixedSvg(a.stimulus);
  assert(svg.includes("<svg") && svg.includes(a.stimulus.title));
  if (a.stimulus.pairKind === "BAR_LINE") {
    assert(svg.includes("<rect") && svg.includes("<polyline"), `${seed}: BAR_LINE must visibly contain both a bar chart and a line graph.`);
  }
  for(const row of a.stimulus.rows){
    assert(svg.includes(row.category),`${seed}: category not learner-visible: ${row.category}`);
    assert(svg.includes(String(row.left)),`${seed}: left value not learner-visible: ${row.left}`);
    assert(svg.includes(String(row.right)),`${seed}: right value not learner-visible: ${row.right}`);
  }
  for(const q of a.questions){
    questions++; tasks.add(q.kind);
    assert.equal(q.options.length,5,`${seed}: expected five options`);
    assert.equal(new Set(q.options).size,5,`${seed}: options must be unique`);
    assert.equal(q.options[q.correctIndex],q.answer,`${seed}: answer/index drift`);
    assert(!/\.\d/u.test(q.answer),`${seed}: decimal answer leaked: ${q.answer}`);
    assert(q.explanation.steps.length>0);
  }
}
assert.deepEqual([...pairs].sort(),[...DI011_PAIR_KINDS].sort(),"Not all mixed representation pairs were exercised.");
assert.deepEqual([...tasks].sort(),[...DI011_TASK_KINDS].sort(),"Not all DI-011 task families were exercised.");
console.log("DI011_MIXED_MULTI_CHART_V1",JSON.stringify({sets:300,questions,pairKinds:[...pairs].sort(),taskKinds:[...tasks].sort(),learnerVisibleAnswerability:true}));

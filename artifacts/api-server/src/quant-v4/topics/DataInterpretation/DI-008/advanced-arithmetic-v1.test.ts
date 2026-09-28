import assert from "node:assert/strict";
import { DI008_ADVANCED_DOMAINS, DI008_ADVANCED_TASKS, generateDi008AdvancedArithmeticSet } from "./advanced-arithmetic-v1";
import { renderDi008AdvancedTableHtml } from "./advanced-arithmetic-table";

const domains=new Set<string>(),tasks=new Set<string>();
let questions=0;
for(let i=0;i<360;i++){
  const seed=`DI-008-ADV-STRESS-${i}`;
  const profile=i%2?"BANKING_MAINS":"BANKING_PRELIMS";
  const set=generateDi008AdvancedArithmeticSet({seed,examProfile:profile});
  const replay=generateDi008AdvancedArithmeticSet({seed,examProfile:profile});
  assert.deepEqual(set,replay,`${seed}: deterministic replay failed`);
  assert.equal(set.questions.length,5);
  assert.deepEqual(set.questions.map(q=>q.difficulty),["Easy","Medium","Medium","Hard","Hard"]);
  assert.equal(set.derivedValues.length,5);
  assert(set.derivedValues.every(v=>Number.isSafeInteger(v)&&v>0),`${seed}: derived values must be positive integers`);
  const html=renderDi008AdvancedTableHtml(set.stimulus);
  assert(html.includes(set.stimulus.title));
  assert(html.includes(set.stimulus.note),`${seed}: domain rule must be learner-visible`);
  for(const row of set.stimulus.rows){
    assert(html.includes(row.label));
    assert(html.includes(String(row.a)));
    assert(html.includes(String(row.b)));
    if(set.stimulus.columnC)assert(html.includes(String(row.c)));
  }
  domains.add(set.stimulus.domain);
  for(const q of set.questions){
    questions++;tasks.add(q.kind);
    assert.equal(q.options.length,5,`${seed}: expected five options`);
    assert.equal(new Set(q.options).size,5,`${seed}: duplicate options`);
    assert.equal(q.options[q.correctIndex],q.answer,`${seed}: answer/index drift`);
    assert(!/\d+\.\d+/u.test(q.answer),`${seed}: decimal answer leaked: ${q.answer}`);
    assert(!/nearest whole|approximately what whole percent/iu.test(q.stem),`${seed}: rounding wording leaked`);
    assert(q.explanation.steps.length>0);
  }
}
assert.deepEqual([...domains].sort(),[...DI008_ADVANCED_DOMAINS].sort(),"Not all arithmetic domains exercised.");
assert.deepEqual([...tasks].sort(),[...DI008_ADVANCED_TASKS].sort(),"Not all arithmetic tasks exercised.");
console.log("DI008_ADVANCED_ARITHMETIC_V1",JSON.stringify({sets:360,questions,domains:[...domains].sort(),tasks:[...tasks].sort(),exactOnly:true}));

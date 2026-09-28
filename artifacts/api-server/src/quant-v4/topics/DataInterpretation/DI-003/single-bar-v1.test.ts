import assert from "node:assert/strict";
import { DI003_SINGLE_TASKS, generateDi003SingleBarSet } from "./single-bar-v1";
import { renderDi003SingleBarSvg } from "./single-bar-svg-v1";
const tasks=new Set<string>();let questions=0;
for(let i=0;i<300;i++){
  const seed=`DI-003-SINGLE-STRESS-${i}`,profile=i%2?"BANKING_PRELIMS":"SSC_CGL_TIER_I";
  const set=generateDi003SingleBarSet({seed,examProfile:profile});
  assert.deepEqual(set,generateDi003SingleBarSet({seed,examProfile:profile}));
  assert.deepEqual(set.questions.map(q=>q.difficulty),["Easy","Medium","Medium","Hard","Hard"]);
  const svg=renderDi003SingleBarSvg(set.stimulus);
  assert(svg.includes('data-single-series-bar="true"'));
  assert(!svg.includes("SERIES_B"));
  for(const p of set.stimulus.points){assert(svg.includes(`data-value="${p.value}"`));assert(svg.includes(p.category));}
  for(const q of set.questions){questions++;tasks.add(q.kind);const expected=profile==="SSC_CGL_TIER_I"?4:5;assert.equal(q.options.length,expected);assert.equal(new Set(q.options).size,expected);assert.equal(q.options[q.correctIndex],q.answer);assert(!/\d+\.\d+/u.test(q.answer));}
}
assert.deepEqual([...tasks].sort(),[...DI003_SINGLE_TASKS].sort());
console.log("DI003_SINGLE_BAR_V1",JSON.stringify({sets:300,questions,tasks:[...tasks].sort()}));

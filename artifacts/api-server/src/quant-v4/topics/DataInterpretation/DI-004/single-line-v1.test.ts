import assert from "node:assert/strict";
import { DI004_SINGLE_TASKS, generateDi004SingleLineSet } from "./single-line-v1";
import { renderDi004SingleLineSvg } from "./single-line-svg-v1";
const tasks=new Set<string>();let questions=0;
for(let i=0;i<300;i++){
  const seed=`DI-004-SINGLE-STRESS-${i}`,profile=i%2?"BANKING_PRELIMS":"SSC_CGL_TIER_I";
  const set=generateDi004SingleLineSet({seed,examProfile:profile});
  assert.deepEqual(set,generateDi004SingleLineSet({seed,examProfile:profile}));
  assert.deepEqual(set.questions.map(q=>q.difficulty),["Easy","Medium","Medium","Hard","Hard"]);
  const svg=renderDi004SingleLineSvg(set.stimulus);
  assert(svg.includes('data-single-series-line="true"'));
  assert(!svg.includes("SERIES_B"));
  for(const p of set.stimulus.points){assert(svg.includes(`data-value="${p.value}"`));assert(svg.includes(p.period));}
  for(const q of set.questions){questions++;tasks.add(q.kind);const expected=profile==="SSC_CGL_TIER_I"?4:5;assert.equal(q.options.length,expected);assert.equal(new Set(q.options).size,expected);assert.equal(q.options[q.correctIndex],q.answer);assert(!/\d+\.\d+/u.test(q.answer));}
}
assert.deepEqual([...tasks].sort(),[...DI004_SINGLE_TASKS].sort());
console.log("DI004_SINGLE_LINE_V1",JSON.stringify({sets:300,questions,tasks:[...tasks].sort()}));

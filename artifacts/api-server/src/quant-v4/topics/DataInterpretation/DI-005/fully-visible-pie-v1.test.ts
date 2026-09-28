import assert from "node:assert/strict";
import { generateDi005FullyVisibleSet, DI005_FULLY_VISIBLE_TASK_KINDS } from "./fully-visible-pie-v1";
import { renderDiPieSvg } from "../visuals/pie-svg";

const tasks=new Set<string>(), contexts=new Set<string>();
let questions=0;
for(let i=0;i<300;i++){
  const seed=`DI-005-FV-STRESS-${i}`;
  const profile=i%2?"BANKING_PRELIMS":"SSC_CGL_TIER_I";
  const a=generateDi005FullyVisibleSet({seed,examProfile:profile});
  const b=generateDi005FullyVisibleSet({seed,examProfile:profile});
  assert.deepEqual(a,b,`${seed}: deterministic replay failed`);
  assert.deepEqual(a.questions.map(q=>q.difficulty),["Easy","Medium","Medium","Hard","Hard"]);
  assert.equal(a.stimulus.hiddenPercentIndex,-1);
  assert(a.stimulus.slices.every(s=>s.displayPercent===s.percent),`${seed}: every sector must be fully labelled`);
  const svg=renderDiPieSvg(a.stimulus);
  assert(!svg.includes(">?</text>"),`${seed}: hidden percentage leaked into fully-visible mode`);
  for(const slice of a.stimulus.slices){
    assert(svg.includes(`>${slice.percent}%</text>`),`${seed}: visible percentage missing for ${slice.category}`);
    assert(svg.includes(slice.category),`${seed}: category missing from rendered legend`);
  }
  contexts.add(a.stimulus.contextId);
  for(const q of a.questions){
    questions++; tasks.add(q.kind);
    const expected=profile==="SSC_CGL_TIER_I"?4:5;
    assert.equal(q.options.length,expected,`${seed}: option count mismatch`);
    assert.equal(new Set(q.options).size,expected,`${seed}: duplicate options`);
    assert.equal(q.options[q.correctIndex],q.answer,`${seed}: answer/index drift`);
    assert(!/\d+\.\d+/u.test(q.answer),`${seed}: decimal answer leaked: ${q.answer}`);
    assert(q.explanation.steps.length>0);
  }
}
assert.deepEqual([...tasks].sort(),[...DI005_FULLY_VISIBLE_TASK_KINDS].sort(),"Not all fully-visible pie task families were exercised.");
assert(contexts.size>=6,"All six pie contexts should be exercised.");
console.log("DI005_FULLY_VISIBLE_PIE_V1",JSON.stringify({sets:300,questions,tasks:[...tasks].sort(),contexts:contexts.size,fullyVisible:true}));

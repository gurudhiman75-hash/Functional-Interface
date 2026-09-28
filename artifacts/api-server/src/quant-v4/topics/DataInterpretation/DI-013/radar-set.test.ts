import assert from "node:assert/strict";
import { DI013_TASKS, generateDi013RadarSet } from "./radar-set";
import { renderDi013RadarSvg } from "./radar-svg";
const tasks=new Set<string>(),contexts=new Set<string>();let questions=0;
for(let i=0;i<320;i++){
  const seed=`DI-013-STRESS-${i}`,profile=i%2?"BANKING_MAINS":"BANKING_PRELIMS";
  const set=generateDi013RadarSet({seed,examProfile:profile});
  assert.deepEqual(set,generateDi013RadarSet({seed,examProfile:profile}),`${seed}: replay drift`);
  assert.deepEqual(set.questions.map(q=>q.difficulty),["Easy","Medium","Medium","Hard","Hard"]);
  const svg=renderDi013RadarSvg(set.stimulus);
  for(const tick of set.stimulus.radialTicks.filter(t=>t>0))assert(svg.includes(`data-radial-label="${tick}"`));
  for(const point of set.stimulus.points){
    assert(set.stimulus.radialTicks.includes(point.seriesA),`${seed}: A point not on labelled ring`);
    assert(set.stimulus.radialTicks.includes(point.seriesB),`${seed}: B point not on labelled ring`);
    assert(svg.includes(point.category));
    assert(svg.includes(`data-value="${point.seriesA}"`));
    assert(svg.includes(`data-value="${point.seriesB}"`));
  }
  contexts.add(set.stimulus.contextId);
  for(const q of set.questions){
    questions++;tasks.add(q.kind);assert.equal(q.options.length,5);assert.equal(new Set(q.options).size,5,`${seed}: duplicate options`);
    assert.equal(q.options[q.correctIndex],q.answer);assert(!/\d+\.\d+/u.test(q.answer));assert(q.explanation.steps.length>0);
  }
}
assert.deepEqual([...tasks].sort(),[...DI013_TASKS].sort());
assert(contexts.size>=4);
console.log("DI013_RADAR_V1",JSON.stringify({sets:320,questions,tasks:[...tasks].sort(),contexts:contexts.size,renderedAnswerability:true}));

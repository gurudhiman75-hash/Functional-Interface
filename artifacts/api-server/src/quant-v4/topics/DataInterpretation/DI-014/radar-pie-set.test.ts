import assert from "node:assert/strict";
import { generateDi014RadarPieSet, DI014_TASKS } from "./radar-pie-set";
import { renderDi014RadarSvg } from "./radar-svg";
import { renderDiPieSvg } from "../visuals/pie-svg";
const tasks=new Set<string>(),contexts=new Set<string>();let questions=0;
for(let i=0;i<320;i++){
  const seed=`DI-014-STRESS-${i}`,set=generateDi014RadarPieSet({seed});
  assert.deepEqual(set,generateDi014RadarPieSet({seed}),`${seed}: replay drift`);
  assert.deepEqual(set.questions.map(q=>q.difficulty),["Easy","Medium","Medium","Hard","Hard"]);
  const radar=renderDi014RadarSvg(set.radar),pie=renderDiPieSvg(set.pie);
  assert(radar.includes('data-radar-pie-radar="true"'));
  assert(!pie.includes(">?</text>"));
  for(const p of set.radar.points){assert(radar.includes(p.category));assert(radar.includes(`data-value="${p.applications}"`));}
  for(const slice of set.pie.slices){assert(pie.includes(slice.category));assert(pie.includes(`>${slice.percent}%</text>`));}
  assert(pie.includes(String(set.pie.totalValue)));
  contexts.add(set.radar.title.split(" — ")[0]!);
  for(const q of set.questions){questions++;tasks.add(q.kind);assert.equal(q.options.length,5);assert.equal(new Set(q.options).size,5);assert.equal(q.options[q.correctIndex],q.answer);assert(!/\d+\.\d+/u.test(q.answer));assert(q.explanation.steps.length>0);}
}
assert.deepEqual([...tasks].sort(),[...DI014_TASKS].sort());
assert(contexts.size>=3);
console.log("DI014_RADAR_PIE_V1",JSON.stringify({sets:320,questions,tasks:[...tasks].sort(),contexts:contexts.size}));

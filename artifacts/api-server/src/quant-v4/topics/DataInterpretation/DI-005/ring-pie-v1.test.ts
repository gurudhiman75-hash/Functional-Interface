import assert from "node:assert/strict";
import { generateDi005RingSet } from "./ring-pie-v1";
import { renderDi005RingSvg } from "./ring-svg";
const tasks=new Set<string>();let questions=0;
for(let i=0;i<240;i++){
  const seed=`DI-005-RING-STRESS-${i}`,profile=i%2?"BANKING_MAINS":"BANKING_PRELIMS";
  const set=generateDi005RingSet({seed,examProfile:profile});
  assert.deepEqual(set,generateDi005RingSet({seed,examProfile:profile}));
  assert.equal(set.stimulus.hiddenPercentIndex,-1);
  const svg=renderDi005RingSvg(set.stimulus);
  assert(svg.includes('data-ring-chart="true"')&&svg.includes('data-donut-hole="true"'));
  assert.equal((svg.match(/data-ring-sector=/g)||[]).length,5);
  for(const slice of set.stimulus.slices){assert(svg.includes(`${slice.percent}%`));assert(svg.includes(slice.category));}
  for(const q of set.questions){
    questions++;tasks.add(q.kind);assert.equal(q.options.length,5);assert.equal(new Set(q.options).size,5);assert.equal(q.options[q.correctIndex],q.answer);assert(!/\d+\.\d+/u.test(q.answer));
  }
}
assert(tasks.size>=10,"Ring mode should exercise the fully-visible pie task breadth.");
console.log("DI005_RING_DONUT_V1",JSON.stringify({sets:240,questions,tasks:[...tasks].sort(),donut:true}));

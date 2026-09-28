import assert from "node:assert/strict";
import { generateDi005DonutSet } from "./donut-v1";
import { renderDi005DonutSvg } from "./donut-svg-v1";

let questions=0;
for(let i=0;i<260;i++){
  const seed=`DI-005-DONUT-STRESS-${i}`;
  const profile=i%2?"BANKING_MAINS":"BANKING_PRELIMS";
  const set=generateDi005DonutSet({seed,examProfile:profile});
  assert.deepEqual(set,generateDi005DonutSet({seed,examProfile:profile}),`${seed}: replay drift`);
  assert.deepEqual(set.questions.map(q=>q.difficulty),["Easy","Medium","Medium","Hard","Hard"]);
  const svg=renderDi005DonutSvg(set.stimulus);
  assert(svg.includes('data-donut-chart="true"'));
  assert(svg.includes('data-donut-hole="true"'));
  assert(!svg.includes(">?</text>"));
  for(const slice of set.stimulus.slices){
    assert(svg.includes(`>${slice.percent}%</text>`),`${seed}: missing percentage ${slice.percent}`);
    assert(svg.includes(slice.category),`${seed}: missing category ${slice.category}`);
  }
  for(const q of set.questions){
    questions++;
    assert.equal(q.options.length,5);
    assert.equal(new Set(q.options).size,5);
    assert.equal(q.options[q.correctIndex],q.answer);
    assert(!/\d+\.\d+/u.test(q.answer));
  }
}
console.log("DI005_RING_DONUT_V1",JSON.stringify({sets:260,questions,fullyVisible:true,trueDonut:true}));

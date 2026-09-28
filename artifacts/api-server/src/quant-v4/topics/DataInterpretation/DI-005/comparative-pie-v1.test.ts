import assert from "node:assert/strict";
import { DI005_COMPARATIVE_TASKS, generateDi005ComparativePieSet } from "./comparative-pie-v1";
import { renderDiPieSvg } from "../visuals/pie-svg";

const tasks=new Set<string>(),contexts=new Set<string>();
let questions=0;
for(let i=0;i<320;i++){
  const seed=`DI-005-COMP-STRESS-${i}`;
  const profile=i%2?"BANKING_MAINS":"BANKING_PRELIMS";
  const set=generateDi005ComparativePieSet({seed,examProfile:profile});
  const replay=generateDi005ComparativePieSet({seed,examProfile:profile});
  assert.deepEqual(set,replay,`${seed}: deterministic replay failed`);
  assert.deepEqual(set.questions.map(q=>q.difficulty),["Easy","Medium","Medium","Hard","Hard"]);
  const leftSvg=renderDiPieSvg(set.left),rightSvg=renderDiPieSvg(set.right);
  assert(!leftSvg.includes(">?</text>")&&!rightSvg.includes(">?</text>"));
  assert(leftSvg.includes(String(set.left.totalValue))&&rightSvg.includes(String(set.right.totalValue)));
  for(const slice of set.left.slices)assert(leftSvg.includes(`>${slice.percent}%</text>`));
  for(const slice of set.right.slices)assert(rightSvg.includes(`>${slice.percent}%</text>`));
  contexts.add(set.left.title.split(" — ")[0]!);
  for(const q of set.questions){
    questions++;tasks.add(q.kind);
    assert.equal(q.options.length,5);
    assert.equal(new Set(q.options).size,5,`${seed}: duplicate options`);
    assert.equal(q.options[q.correctIndex],q.answer,`${seed}: answer/index drift`);
    assert(!/\d+\.\d+/u.test(q.answer),`${seed}: decimal answer leaked`);
    assert(q.explanation.steps.length>0);
  }
}
assert.deepEqual([...tasks].sort(),[...DI005_COMPARATIVE_TASKS].sort(),"Not all comparative pie tasks exercised.");
assert(contexts.size>=4,"All comparative pie contexts should be exercised.");
console.log("DI005_COMPARATIVE_DOUBLE_PIE_V1",JSON.stringify({sets:320,questions,tasks:[...tasks].sort(),contexts:contexts.size}));

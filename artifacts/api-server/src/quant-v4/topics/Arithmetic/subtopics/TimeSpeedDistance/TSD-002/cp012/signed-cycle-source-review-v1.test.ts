import assert from "node:assert/strict";
import { add, compare, divide, multiply, rational, subtract } from "../../TSD-001/foundation/rational";
import { solveSignedAscentCycle, TSD_CP012_SIGNED_CYCLE_REVIEW_V1, type SignedCycleInput } from "./signed-cycle-source-review-v1";
function simulate(i:SignedCycleInput){
 let height=rational(0),time=rational(0);
 for(let stage=0;stage<1000;stage++){
  const peak=add(height,i.ascent);
  if(compare(peak,i.target)>=0)return add(time,multiply(divide(subtract(i.target,height),i.ascent),i.ascentDuration));
  height=subtract(peak,i.slip);time=add(time,add(i.ascentDuration,i.slipDuration));
 }
 throw new Error("No completion in simulation");
}
assert.equal(TSD_CP012_SIGNED_CYCLE_REVIEW_V1.length,18);
for(const r of TSD_CP012_SIGNED_CYCLE_REVIEW_V1){
 assert.deepEqual(r.solution.time,simulate(r.input));
 assert.equal(r.options[r.correctIndex],r.answerText);assert.equal(new Set(r.options).size,4);
 for(const k of ["contentApproved","frozen","registered","persistence","bank","test","mock","public"] as const)assert.equal(r[k],false);
}
const fixture={target:rational(63),ascent:rational(12),slip:rational(5),ascentDuration:rational(1),slipDuration:rational(1)};
assert.deepEqual(solveSignedAscentCycle(fixture).time,rational(199,12)); // 16 h 35 min, PDF395 Q17.
assert.deepEqual(solveSignedAscentCycle({...fixture,target:rational(7),slip:rational(20)}).time,rational(7,12));
assert.throws(()=>solveSignedAscentCycle({...fixture,slip:rational(12)}));
assert.throws(()=>solveSignedAscentCycle({...fixture,ascentDuration:rational(0)}));
// Broader parameter grid covers exact peak boundaries, zero slip, and unequal stage durations.
let cases=0;
for(const ascent of [3,7,12])for(const slip of [0,1,2])for(const height of [1,3,7,12,19,31,63]){
 const i={target:rational(height),ascent:rational(ascent),slip:rational(slip),ascentDuration:rational(2),slipDuration:rational(3)};
 assert.deepEqual(solveSignedAscentCycle(i).time,simulate(i));cases++;
}
console.log(`PASS: signed-cycle candidate; 18 trilingual rows; ${cases} independent stage simulations; early completion and unreachable states checked; release locks retained.`);

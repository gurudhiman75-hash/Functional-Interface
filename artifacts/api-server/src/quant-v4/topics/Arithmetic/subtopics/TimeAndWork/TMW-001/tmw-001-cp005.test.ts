import { strict as assert } from "node:assert";
import { TMW_CP005_REGISTRY } from "./foundation/cp005-registry";
import { runTmwCp005Pipeline } from "./foundation/cp005-runtime";

assert.equal(TMW_CP005_REGISTRY.length,24);
assert.deepEqual(TMW_CP005_REGISTRY.map(entry=>entry.qlId),Array.from({length:24},(_,index)=>`TMW-QL-${String(index+82).padStart(3,"0")}`));
assert.equal(new Set(TMW_CP005_REGISTRY.map(entry=>entry.solveMode)).size,24);
const positions=new Set<number>(),stems=new Set<string>();
let cases=0;
for(const entry of TMW_CP005_REGISTRY){
 for(let index=0;index<50;index++){
  const seed=`tmw-cp005-proof:${entry.qlId}:${index}`;
  const first=runTmwCp005Pipeline({questionLanguageId:entry.qlId,seed});
  const second=runTmwCp005Pipeline({questionLanguageId:entry.qlId,seed});
  assert.deepEqual(first,second,`${entry.qlId} is not deterministic for ${seed}`);
  assert.equal(first.validation.valid,true,`${entry.qlId}: ${first.validation.errors.join("; ")}`);
  assert.equal(first.options.length,4);
  assert.equal(new Set(first.options).size,4);
  assert.equal(first.options[first.correctIndex],first.solution.answerText);
  assert.equal(first.optionAudit.filter(option=>option.misconceptionId==="CORRECT").length,1);
  assert.equal(first.publiclyPublishable,false);
  positions.add(first.correctIndex);stems.add(first.stem);cases+=1;
 }
}
assert.deepEqual([...positions].sort(),[0,1,2,3]);
assert.throws(()=>runTmwCp005Pipeline({questionLanguageId:"TMW-QL-082",seed:"locale-hi",language:"hi"}));
assert.throws(()=>runTmwCp005Pipeline({questionLanguageId:"TMW-QL-082",seed:"locale-pa",language:"pa"}));
console.log(JSON.stringify({chapter:"TMW-001",checkpoint:"TMW-CP-005",qlCount:TMW_CP005_REGISTRY.length,seedsPerQl:50,cases,distinctStems:stems.size,correctPositions:[...positions].sort(),status:"PASS"},null,2));

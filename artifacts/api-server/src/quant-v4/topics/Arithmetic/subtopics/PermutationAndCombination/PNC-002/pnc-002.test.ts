import { strict as assert } from "node:assert";
import { getPnc002Entries, runPnc002 } from "./index";

const entries=getPnc002Entries();
assert.equal(entries.length,12);
assert.deepEqual(entries.map(e=>e.qlId),Array.from({length:12},(_,i)=>`PNC-QL-${107+i}`));
assert.equal(new Set(entries.map(e=>e.solveMode)).size,6);
let cases=0;
for(const entry of entries){
 for(let i=0;i<20;i++){
  const seed=`pnc002:${entry.qlId}:${i}`;
  const first=runPnc002({questionLanguageId:entry.qlId,seed});
  const second=runPnc002({questionLanguageId:entry.qlId,seed});
  assert.equal(first.valid,true,`${entry.qlId} ${seed}`);
  assert.deepEqual(first,second,`${entry.qlId} deterministic`);
  assert.equal(first.verifierAnswer,Number(first.answer));
  assert.equal(first.publiclyPublishable,false);
  assert.equal(first.explanation.length,3);
  assert.match(first.equation,/^\\\(.+\\\)$/);
  cases++;
 }
}
assert.equal(runPnc002({questionLanguageId:"PNC-QL-117",seed:"inverse-a"}).evidence.recoveredN,Number(runPnc002({questionLanguageId:"PNC-QL-117",seed:"inverse-a"}).answer));
console.log(JSON.stringify({packageId:"PNC-002",canonicalProblemId:"PNC-CP-007",qlCount:entries.length,solveModeCount:new Set(entries.map(e=>e.solveMode)).size,cases,generatedTwice:true,status:"PASS"},null,2));

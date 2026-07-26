import { strict as assert } from "node:assert";
import { TMW_CP004_REGISTRY } from "./foundation/cp004-registry";
import { runTmwCp004Pipeline } from "./foundation/cp004-runtime";
let cases=0;const positions=new Set<number>(),stems=new Set<string>();
for(const entry of TMW_CP004_REGISTRY){for(let i=0;i<50;i++){const seed=`tmw-cp004-proof:${entry.qlId}:${i}`,a=runTmwCp004Pipeline({questionLanguageId:entry.qlId,seed}),b=runTmwCp004Pipeline({questionLanguageId:entry.qlId,seed});assert.deepEqual(a,b);assert.equal(a.validation.valid,true,a.validation.errors.join("; "));assert.equal(a.options.length,4);assert.equal(new Set(a.options).size,4);assert.equal(a.optionAudit[a.correctIndex].misconceptionId,"CORRECT");assert.equal(a.options[a.correctIndex],a.solution.answerText);assert.equal(a.publiclyPublishable,false);positions.add(a.correctIndex);stems.add(a.stem);cases++;}}
assert.equal(TMW_CP004_REGISTRY.length,24);assert.deepEqual([...positions].sort(),[0,1,2,3]);assert.ok(stems.size>=250,`Expected at least 250 distinct stems, found ${stems.size}`);
console.log(JSON.stringify({chapter:"TMW-001",checkpoint:"TMW-CP-004",qlCount:TMW_CP004_REGISTRY.length,seedsPerQl:50,cases,correctPositions:[...positions].sort(),distinctStems:stems.size,status:"PASS"},null,2));

import assert from "node:assert/strict";
import { SAP_CP012_E2_STRUCTURES, generateSapCp012E2 } from "./SAP-002/SAP-CP-012/runtime-release";

const stems = new Set<string>();
const checked: Record<string, number> = {};
const maxDrift: Record<string, number> = {};
function proveNearest(id:string, seed:number, exact:number, answer:number, options:readonly {value:string}[], correctIndex:number, limit:number):void{
  const drift=Math.abs(exact-answer);maxDrift[id]=Math.max(maxDrift[id]??0,drift);checked[id]=(checked[id]??0)+1;
  assert.ok(drift<limit,`${id}/${seed}: displayed equation drifts too far (${drift})`);
  const distances=options.map(o=>Math.abs(Number(o.value)-exact)),best=Math.min(...distances);
  assert.equal(distances.filter(x=>Math.abs(x-best)<1e-10).length,1,`${id}/${seed}: displayed equation has tied nearest option`);
  assert.equal(distances[correctIndex],best,`${id}/${seed}: intended answer is not nearest to displayed equation`);
}
for (const id of SAP_CP012_E2_STRUCTURES) {
  const local = new Set<string>();
  for (let seed = 1; seed <= 100; seed += 1) {
    const q = generateSapCp012E2(id, seed),d=q.oracle.data;
    assert.equal(q.validation.ok, true, `${id}/${seed}: ${q.validation.errors.join("; ")}`);
    assert.equal(q.checkpointId, "SAP-CP-012");assert.equal(q.profile, "BANK");assert.equal(q.options.length, 4);assert.equal(new Set(q.options.map(o => o.value)).size, 4);assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer);
    assert.equal(q.lifecycle.permanentQlId, null);assert.equal(q.lifecycle.active, false);assert.equal(q.lifecycle.questionStudioDiscoverable, false);assert.equal(q.lifecycle.questionBankWritable, false);assert.equal(q.lifecycle.testEligible, false);assert.equal(q.lifecycle.publiclyPublishable, false);
    assert.doesNotMatch(q.stem, /[√∛∜]/);assert.ok(!local.has(q.stem), `${id}/${seed}: duplicate release stem within family`);assert.ok(!stems.has(q.stem), `${id}/${seed}: duplicate release stem across CP012`);local.add(q.stem);stems.add(q.stem);
    if(id==="CP012-E2-MISSING-ADDEND-MIXED"){
      const exact=Number(d.x100)/100*(Number(d.y100)/100)+Number(d.z100)/100-Number(d.w100)/100;proveNearest(id,seed,exact,Number(q.canonicalAnswer),q.options,q.correctIndex,1.5);
    }else if(id==="CP012-E2-MISSING-DIVISOR"){
      const exact=Number(d.x100)/100*(Number(d.b100)/100)/(Number(d.target100)/100-Number(d.c100)/100);proveNearest(id,seed,exact,Number(q.canonicalAnswer),q.options,q.correctIndex,0.5);
    }else if(id==="CP012-E2-TWO-SIDED-MIXED-EQUATION"){
      const exact=Number(d.lNum100)/100/Number(d.leftDen)*(Number(d.lMul100)/100)+Number(d.lC100)/100-Number(d.rNum100)/100/Number(d.rightDen)*(Number(d.rMul100)/100);proveNearest(id,seed,exact,Number(q.canonicalAnswer),q.options,q.correctIndex,1.5);
    }
  }
  assert.equal(local.size, 100);
}
assert.equal(stems.size, 1200);
assert.equal(checked["CP012-E2-MISSING-ADDEND-MIXED"],100);assert.equal(checked["CP012-E2-MISSING-DIVISOR"],100);assert.equal(checked["CP012-E2-TWO-SIDED-MIXED-EQUATION"],100);
console.log(JSON.stringify({ authority: "SAP-E2-CP012-RELEASE-REALISM-V3", states: 1200, checked, maxDrift, lifecycle: "INACTIVE" }));

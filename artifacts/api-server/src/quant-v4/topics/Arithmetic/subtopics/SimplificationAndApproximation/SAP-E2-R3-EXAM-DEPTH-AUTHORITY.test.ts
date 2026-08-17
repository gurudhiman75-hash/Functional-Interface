import assert from "node:assert/strict";
import { generateSapCp012E2 } from "./SAP-002/SAP-CP-012/runtime-release-r3";

const IDS = ["CP012-E2-MISSING-SQUARE-ROOT","CP012-E2-MISSING-CUBE-ROOT","CP012-E2-MISSING-PERCENTAGE"] as const;
function nearest(q:any, actual:number){
  const distances=q.options.map((o:any)=>({value:o.value,d:Math.abs((parseFloat(o.value))-actual)})).sort((a:any,b:any)=>a.d-b.d);
  assert.equal(distances[0].value,q.canonicalAnswer,`${q.structureId}/${q.seed}: keyed option is not nearest to displayed equation; actual=${actual}`);
  assert.ok(distances[1].d-distances[0].d>1e-8,`${q.structureId}/${q.seed}: displayed equation has ambiguous nearest option.`);
}
const global=new Set<string>();
for(const id of IDS){
  const local=new Set<string>();
  for(let seed=1;seed<=100;seed++){
    const q=generateSapCp012E2(id,seed); const d:any=q.oracle.data;
    assert.equal(q.validation.ok,true,`${id}/${seed}: ${q.validation.errors.join("; ")}`);
    assert.equal(q.lifecycle.permanentQlId,null);assert.equal(q.lifecycle.active,false);assert.equal(q.lifecycle.questionStudioDiscoverable,false);assert.equal(q.lifecycle.questionBankWritable,false);assert.equal(q.lifecycle.testEligible,false);assert.equal(q.lifecycle.publiclyPublishable,false);
    assert.equal(q.options.length,4);assert.equal(new Set(q.options.map((o:any)=>o.value)).size,4);assert.equal(q.options[q.correctIndex]?.value,q.canonicalAnswer);
    assert.ok(q.decisionCount>=7);assert.doesNotMatch(q.stem,/[√∛∜]/);assert.doesNotMatch(q.stem,/For estimation, take|using suitable approximation|oracle|runtime|prototype|canonical/i);
    assert.ok(!local.has(q.stem),`${id}/${seed}: duplicate stem`);assert.ok(!global.has(q.stem),`${id}/${seed}: cross-family duplicate stem`);local.add(q.stem);global.add(q.stem);
    if(id==="CP012-E2-MISSING-SQUARE-ROOT"){
      const n1=d.n1_100/100,m1=d.m1_100/100,den1=d.d1_100/100,n2=d.n2_100/100,m2=d.m2_100/100,den2=d.d2_100/100,c=d.c_100/100;
      nearest(q,Math.sqrt(n1*m1/den1+n2*m2/den2+c));
    } else if(id==="CP012-E2-MISSING-CUBE-ROOT"){
      const n=d.n_100/100,rad=d.rad_100/100,base=d.base_100/100,pct=d.pct_100/100;
      nearest(q,Math.cbrt(n/Math.sqrt(rad)*(pct/100)*(base**3)));
    } else {
      const base=d.b_100/100,knownBase=d.knownBase_100/100,kp=d.knownPct_100/100,sq=d.squareBase_100/100,rp=d.rightPct_100/100,rb=d.rightBase_100/100;
      nearest(q,100*(sq**2-(rp/100)*rb-(kp/100)*knownBase)/base);
    }
  }
  assert.equal(local.size,100);
}
assert.equal(global.size,300);
console.log(JSON.stringify({authority:"SAP-E2-R3-EXAM-DEPTH",structures:3,states:300,displayedEquationNearestOptionProof:true,lifecycle:"OFF"}));

import assert from "node:assert/strict";
import { generateSapCp012E2 } from "./SAP-002/SAP-CP-012/runtime-release-r4b";
const id="CP012-E2-MIXED-ROOT-POWER-SYNTHESIS" as const;
const stems=new Set<string>();
for(let seed=1;seed<=100;seed++){
 const q=generateSapCp012E2(id,seed),d:any=q.oracle.data;
 assert.equal(q.validation.ok,true,`${seed}: ${q.validation.errors.join("; ")}`);assert.equal(q.structureId,id);assert.equal(q.profile,"BANK");assert.equal(q.difficulty,"HARD");assert.ok(q.decisionCount>=9);assert.equal(q.options.length,4);assert.equal(new Set(q.options.map(o=>o.value)).size,4);assert.equal(q.options[q.correctIndex]?.value,q.canonicalAnswer);assert.equal(q.lifecycle.permanentQlId,null);assert.equal(q.lifecycle.active,false);assert.equal(q.lifecycle.questionStudioDiscoverable,false);assert.equal(q.lifecycle.questionBankWritable,false);assert.equal(q.lifecycle.testEligible,false);assert.equal(q.lifecycle.publiclyPublishable,false);assert.doesNotMatch(q.stem,/[√∛∜]/);assert.doesNotMatch(q.stem,/For estimation, take|using suitable approximation|oracle|runtime|prototype|canonical/i);assert.ok(!stems.has(q.stem),`${seed}: duplicate visible stem`);stems.add(q.stem);
 const a=d.a_100/100,b=d.b_100/100,c=d.c_100/100,dd=d.d_100/100,e=d.e_100/100,f=d.f_100/100,g=d.g_100/100,h=d.h_100/100,i=d.i_100/100;
 const denom=f*g+h-i;assert.ok(Math.abs(denom)>0.5,`${seed}: unstable displayed denominator`);
 const actual=Math.cbrt(a*b)*Math.sqrt(c*dd/e)/denom*d.scale;
 const ds=q.options.map(o=>({value:o.value,d:Math.abs(Number(o.value)-actual)})).sort((x,y)=>x.d-y.d);
 assert.equal(ds[0]?.value,q.canonicalAnswer,`${seed}: keyed option not nearest to displayed equation; actual=${actual}`);assert.ok((ds[1]?.d??0)-(ds[0]?.d??0)>1e-8,`${seed}: ambiguous displayed nearest option`);
 assert.ok(Math.abs(denom-d.targetDen)<=0.05,`${seed}: displayed denominator drifted too far: ${denom}`);
}
assert.equal(stems.size,100);console.log(JSON.stringify({authority:"SAP-E2-R4B-MIXED-SYNTHESIS",states:100,uniqueStems:100,displayedEquationNearestOptionProof:true,coordinatedDenominator:true,lifecycle:"OFF"}));
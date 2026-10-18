import test from "node:test";
import assert from "node:assert/strict";
import {mkdtempSync,mkdirSync,writeFileSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {spawnSync} from "node:child_process";
const script="scripts/aggregate-qs-universal-compute-coverage.mjs";
function fixture(modify=()=>{}){
 const root=mkdtempSync(join(tmpdir(),"qs-coverage-test-"));
 const items=[
  {packageId:"RNK-001",engineId:"reasoning-v1",subject:"Reasoning Ability",status:"passed"},
  {packageId:"GEO-001",engineId:"quant-v4",subject:"Quantitative Aptitude",status:"passed"},
 ];
 for(let shard=0;shard<2;shard++){
  const folder=join(root,`qs-universal-offline-compute-all-${shard}`);
  mkdirSync(folder);
  const report={runType:"offline-compute-only",wave:"all",shard,shards:2,selection:"chapter",catalogTotal:2,
    selected:1,passed:1,failed:0,durationMs:10,results:[items[shard]]};
  modify(report,shard);
  writeFileSync(join(folder,"qs-universal-compute-report.json"),JSON.stringify(report));
 }
 return root;
}
function execute(root){return spawnSync(process.execPath,[script,root,"2"],{encoding:"utf8",timeout:10000});}
test("aggregates complete disjoint sharded compute results",()=>{
 const root=fixture();
 try{const res=execute(root);assert.equal(res.status,0,res.stdout+" "+res.stderr);assert.match(res.stdout,/2 passed \/ 2 tested/);}
 finally{rmSync(root,{recursive:true,force:true});}
});
test("fails when a package fails even if report claims success",()=>{
 const root=fixture((report,shard)=>{if(shard===1)report.results[0].status="failed";});
 try{const res=execute(root);assert.notEqual(res.status,0);assert.match(res.stdout,/Generation failed: GEO-001/);}
 finally{rmSync(root,{recursive:true,force:true});}
});
test("fails on incomplete or duplicate sharded coverage",()=>{
 const root=fixture((report,shard)=>{if(shard===1)report.results[0].packageId="RNK-001";});
 try{const res=execute(root);assert.notEqual(res.status,0);assert.match(res.stdout,/Duplicate package/);}
 finally{rmSync(root,{recursive:true,force:true});}
});
test("fails on missing shard",()=>{
 const root=fixture();
 try{rmSync(join(root,"qs-universal-offline-compute-all-1"),{recursive:true,force:true});const res=execute(root);assert.notEqual(res.status,0);assert.match(res.stdout,/Missing audit artifact/);}
 finally{rmSync(root,{recursive:true,force:true});}
});

#!/usr/bin/env node
// Offline, compute-only audit through the REAL bundled universal generation worker.
// Never contacts Cloud Run, Firebase, Neon, or Cloud Tasks. Never publishes content.
// Default first wave is deliberately bounded; broader shards require explicit CI dispatch.
import {Worker} from "node:worker_threads";
import {readFileSync, writeFileSync, appendFileSync, chmodSync, statSync, existsSync} from "node:fs";
import {resolve} from "node:path";
import {examForQuestionStudioComputeAudit} from "./qs-universal-coverage-exam-profile.mjs";

const flags=Object.fromEntries(process.argv.slice(2).map(s=>{
 const match=/^--([a-z-]+)=(.*)$/.exec(s);
 if(!match)throw Error("Unexpected argument (use --key=value): "+s);
 return [match[1],match[2]];
}));
const wave=flags.wave??"pilot";
const shard=Number(flags.shard??0),shards=Number(flags.shards??1);
if(!["pilot","all"].includes(wave)||!Number.isSafeInteger(shard)||!Number.isSafeInteger(shards)||shards<1||shards>32||shard<0||shard>=shards){
 throw Error("Invalid audit wave/shard");
}
if(wave==="pilot"&&(shards!==1||shard!==0))throw Error("Pilot wave cannot be sharded");
const timeoutSeconds=Number(flags["timeout-seconds"]??45);
const selection=flags.selection??"chapter";
if(!["chapter","cp"].includes(selection))throw Error("Invalid selection mode");
if(!Number.isSafeInteger(timeoutSeconds)||timeoutSeconds<5||timeoutSeconds>110)throw Error("Invalid bounded timeout");
const manifestPath=resolve(flags.catalog??"artifacts/api-server/dist/question-studio-unified-capabilities.json");
const workerPath=resolve(flags.worker??"artifacts/api-server/dist/qs-universal-coverage-worker.mjs");
const reportPath=resolve(flags.report??"/tmp/qs-universal-compute-report.json");
const catalog=JSON.parse(readFileSync(manifestPath,"utf8"));
const enabled=catalog.packages.filter(p=>p.enabled).sort((a,b)=>a.packageId.localeCompare(b.packageId));
if(!enabled.length||!existsSync(workerPath))throw Error("No enabled packages or built isolated worker");
const groups=[
 ["quant",p=>p.engineId==="quant-v4"],
 ["reasoning",p=>p.engineId==="reasoning-v1"],
 ["english",p=>p.engineId==="language-v1"&&p.subject!=="Punjabi"],
 ["punjabi",p=>p.subject==="Punjabi"],
 ["computer",p=>p.subject==="Computer Awareness"],
 ["gk",p=>p.engineId==="knowledge-v1"&&p.subject!=="Computer Awareness"],
];
let selected;
if(wave==="all"){
 selected=enabled.filter((_,i)=>i%shards===shard);
}else{
 const anchorIds=["TRG-002","NUM-001","PCT-001","OPS-001","IOP-001","ENG-001","ENG-005","COM-001","COM-002","POL-001","GEO-LOC-001"];
 const priority=anchorIds.map(id=>enabled.find(p=>p.packageId===id)).filter(Boolean);
 const extra=groups.map(([,test])=>enabled.find(p=>test(p)&&!priority.some(q=>q.packageId===p.packageId))).filter(Boolean);
 selected=[...new Map([...priority,...extra].map(p=>[p.packageId,p])).values()];
 if(selected.length>16)selected=selected.slice(0,16);
}
if(flags.only){
 const requested=new Set(flags.only.split(",").map(s=>s.trim()).filter(Boolean));
 if(!requested.size)throw Error("Empty explicit package selection");
 const unknown=[...requested].filter(id=>!enabled.some(p=>p.packageId===id));
 if(unknown.length)throw Error("Unknown package(s): "+unknown.join(","));
 selected=enabled.filter(p=>requested.has(p.packageId));
}
console.log("QS_COVERAGE_START "+JSON.stringify({wave,shard,shards,catalogTotal:enabled.length,selected:selected.length,selection,packageIds:selected.map(p=>p.packageId)}));
const results=[];
const date=Date.now();
const cwd=process.cwd();
const originalMode=statSync(cwd).mode&0o777;
// Production container runs with immutable source. Simulate it and reject
// generator modules that attempt to export files as an import side effect.
chmodSync(cwd,0o555);
function safeCode(e){
 const code=typeof e?.code==="string"?e.code:"UNIVERSAL_COMPUTE_FAILED";
 return /^[A-Z0-9_-]{2,90}$/.test(code)?code:"UNIVERSAL_COMPUTE_FAILED";
}
function validateAnswer(q){
 if(!q||typeof q!=="object")return "MISSING_QUESTION";
 if(q.hasStem!==true)return "MISSING_STEM";
 if(!Number.isInteger(q.optionCount)||q.optionCount<2)return "MISSING_OPTIONS";
 if(q.hasAnswer!==true)return "MISSING_ANSWER";
 if(q.hasExplanation!==true)return "MISSING_EXPLANATION";
 return null;
}
let currentWorker=null;
let requestId=0;
async function readyWorker(){
 if(currentWorker)return currentWorker;
 const worker=new Worker(workerPath,{resourceLimits:{maxOldGenerationSizeMb:1536}});
 return await new Promise((resolve,reject)=>{
  let settled=false;
  const clear=()=>{
   clearTimeout(deadline);
   worker.off("message",onMessage);
   worker.off("error",onError);
   worker.off("exit",onExit);
  };
  function onMessage(data){
   if(data?.type!=="ready")return;
   if(settled)return; settled=true;clear();
   currentWorker=worker;
   resolve(worker);
  }
  function fail(err){
   if(settled)return;settled=true;clear();
   void worker.terminate().catch(()=>undefined);
   reject(err);
  }
  function onError(error){fail(error);}
  function onExit(code){fail(Object.assign(new Error("Warm worker exited "+code),{code:"AUDIT_WORKER_BOOT_FAILED"}));}
  const deadline=setTimeout(()=>fail(Object.assign(new Error("Warm worker startup deadline"),{code:"AUDIT_WORKER_BOOT_TIMEOUT"})),90000);
  worker.on("message",onMessage);
  worker.on("error",onError);
  worker.on("exit",onExit);
 });
}
async function compute(input){
 const worker=await readyWorker();
 const id=++requestId;
 return await new Promise((resolve,reject)=>{
  let settled=false;
  const clear=()=>{
   clearTimeout(deadline);
   worker.off("message",onMessage);
   worker.off("error",onError);
   worker.off("exit",onExit);
  };
  function finish(err,batch,terminate=false){
   if(settled)return; settled=true; clear();
   if(terminate){
    if(currentWorker===worker)currentWorker=null;
    void worker.terminate().catch(()=>undefined);
   }
   err?reject(err):resolve(batch);
  }
  function onMessage(data){
   if(data?.type!=="result"||data.id!==id)return;
   if(data.ok&&data.batch)finish(null,data.batch);
   else finish(Object.assign(new Error(String(data?.error?.message??"Compute failed").slice(0,160)),{code:data?.error?.code}));
  }
  function onError(error){finish(error,null,true);}
  function onExit(code){finish(Object.assign(new Error("Worker exited "+code),{code:"UNIVERSAL_WORKER_EXIT"}),null,true);}
  const deadline=setTimeout(()=>finish(Object.assign(new Error("Audit package deadline"),{code:"AUDIT_PACKAGE_TIMEOUT"}),null,true),timeoutSeconds*1000);
  worker.on("message",onMessage);
  worker.on("error",onError);
  worker.on("exit",onExit);
  worker.postMessage({type:"compute",id,input});
 });
}
try{
 for(const pkg of selected){
  const started=Date.now();
  const requiresExplicitCp=pkg.packageId==="english-eng003-grammar-fillers-v1";
  const firstCp=(selection==="cp"||requiresExplicitCp)?((pkg.cpIds??[])[0]??(pkg.dynamicCandidateCpIds??[])[0]):undefined;
  const difficulty=pkg.difficultyFilterSupported===false?undefined
    :(pkg.supportedDifficulties?.includes("Medium")?"Medium":pkg.supportedDifficulties?.[0]??"Mixed");
  // Some chapter authorities are BANKING-only. Exercise their declared
  // exam family; never reinterpret an SSC request as Banking in production.
  const exam=examForQuestionStudioComputeAudit(pkg.packageId);
  const request={
   engineId:pkg.engineId,packageId:pkg.packageId,exam,
   subject:pkg.subject,topic:pkg.topic,subtopic:pkg.subtopic,
   language:pkg.supportedLanguages.includes("en")?"en":pkg.supportedLanguages[0],
   difficulty,runtimeMode:pkg.runtimeMode,count:1,
   seed:"qs-coverage-"+pkg.packageId+"-20261016",
   ...(firstCp?{canonicalProblemId:firstCp}:{})
  };
  const input={request,count:1,selectedCpIds:firstCp?[firstCp]:[]};
  const result={packageId:pkg.packageId,engineId:pkg.engineId,subject:pkg.subject,
    selection,cpId:firstCp??null,exam,language:request.language,difficulty:difficulty??null,
    runtimeMode:pkg.runtimeMode??null,status:"failed",code:null,durationMs:0};
  try{
   const batch=await compute(input);
   if(batch.packageId!==pkg.packageId||batch.engineId!==pkg.engineId||!Array.isArray(batch.questionChecks)||batch.questionChecks.length!==1){
    result.code="BATCH_IDENTITY_OR_COUNT_INVALID";
   }else{
    result.code=validateAnswer(batch.questionChecks[0]);
    result.status=result.code?"failed":"passed";
   }
  }catch(error){
   result.code=safeCode(error);
   result.reason=String(error instanceof Error?error.message:"Compute failed").replace(/\s+/g," ").slice(0,160);
  }
  result.durationMs=Date.now()-started;
  results.push(result);
  console.log("QS_COVERAGE_CASE "+JSON.stringify(result));
 }
}finally{
 chmodSync(cwd,originalMode);
 if(currentWorker){await currentWorker.terminate().catch(()=>undefined);currentWorker=null;}
}
const passed=results.filter(r=>r.status==="passed").length;
const failed=results.filter(r=>r.status==="failed").length;
const output={runType:"offline-compute-only",wave,shard,shards,selection,catalogTotal:enabled.length,
  selected:results.length,passed,failed,durationMs:Date.now()-date,results};
writeFileSync(reportPath,JSON.stringify(output,null,2)+"\n");
if(process.env.GITHUB_STEP_SUMMARY){
 const summary=[
  "## Isolated Question Studio compute audit: "+wave+" / shard "+shard,
  "",
  "Registered/enabled: **"+enabled.length+"**; tested: **"+results.length+"**; passed: **"+passed+"**; failed: **"+failed+"**.",
  "This is an offline one-question structural smoke test using package-eligible exam/CP selectors where required, NOT proof of every exam/CP/difficulty combination, end-to-end acceptance, or answer-truth correctness.",
  "",
  "| Package | Subject | Result | Error code | Duration |",
  "|---|---|---|---|---:|",
  ...results.map(r=>"| "+r.packageId+" | "+r.subject+" | "+r.status+" | "+(r.code??"-")+" | "+r.durationMs+" ms |"),
  "",
 ].join("\n");
 appendFileSync(process.env.GITHUB_STEP_SUMMARY,summary);
}
console.log("QS_COVERAGE_FINISH "+JSON.stringify({selected:results.length,passed,failed,report:reportPath}));
if(failed)process.exitCode=1;

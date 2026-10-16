#!/usr/bin/env node
// Offline, compute-only audit through the REAL bundled universal generation worker.
// Never contacts Cloud Run, Firebase, Neon, or Cloud Tasks. Never publishes content.
// Default first wave is deliberately bounded; broader shards require explicit CI dispatch.
import {Worker} from "node:worker_threads";
import {readFileSync, writeFileSync, appendFileSync, chmodSync, statSync, existsSync} from "node:fs";
import {resolve} from "node:path";

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
if(!Number.isSafeInteger(timeoutSeconds)||timeoutSeconds<5||timeoutSeconds>110)throw Error("Invalid bounded timeout");
const manifestPath=resolve(flags.catalog??"artifacts/api-server/dist/question-studio-unified-capabilities.json");
const workerPath=resolve(flags.worker??"artifacts/api-server/dist/question-studio-universal-worker.mjs");
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
 const anchorIds=["TRG-002","NUM-001","PCT-001","OPS-001","ENG-001","ENG-005","COM-001","COM-002","POL-001","GEO-LOC-001"];
 const priority=anchorIds.map(id=>enabled.find(p=>p.packageId===id)).filter(Boolean);
 const extra=groups.map(([,test])=>enabled.find(p=>test(p)&&!priority.some(q=>q.packageId===p.packageId))).filter(Boolean);
 selected=[...new Map([...priority,...extra].map(p=>[p.packageId,p])).values()];
 if(selected.length>16)selected=selected.slice(0,16);
}
console.log("QS_COVERAGE_START "+JSON.stringify({wave,shard,shards,catalogTotal:enabled.length,selected:selected.length,packageIds:selected.map(p=>p.packageId)}));
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
 if(!(typeof q.stem==="string"&&q.stem.trim()||typeof q.text==="string"&&q.text.trim()))return "MISSING_STEM";
 if(!Array.isArray(q.options)||q.options.length<2)return "MISSING_OPTIONS";
 const answer=[q.correctIndex,q.correct,q.answer,q.correctOption,q.answerKey].find(v=>v!==undefined&&v!==null&&String(v).trim()!=="");
 if(answer===undefined)return "MISSING_ANSWER";
 if(typeof q.explanation!=="string"||!q.explanation.trim())return "MISSING_EXPLANATION";
 return null;
}
async function compute(input){
 return await new Promise((res,rej)=>{
   const thread=new Worker(workerPath,{
     workerData:input,resourceLimits:{maxOldGenerationSizeMb:1536}
   });
   let done=false;
   const settle=(err,batch)=>{
     if(done)return;
     done=true;clearTimeout(timer);
     void thread.terminate().catch(()=>undefined);
     err?rej(err):res(batch);
   };
   const timer=setTimeout(()=>settle(Object.assign(new Error("Audit package deadline"),{code:"AUDIT_PACKAGE_TIMEOUT"})),timeoutSeconds*1000);
   thread.once("message",data=>{
     if(data?.ok&&data.batch)settle(null,data.batch);
     else settle(Object.assign(new Error(String(data?.error?.message??"Compute failed").slice(0,160)),{code:data?.error?.code}));
   });
   thread.once("error",e=>settle(e));
   thread.once("exit",code=>{if(code!==0)settle(Object.assign(new Error("Worker exited "+code),{code:"UNIVERSAL_WORKER_EXIT"}))});
 });
}
try{
 for(const pkg of selected){
  const started=Date.now();
  const firstCp=(pkg.cpIds??[])[0]??(pkg.dynamicCandidateCpIds??[])[0];
  const difficulty=pkg.difficultyFilterSupported===false?undefined
    :(pkg.supportedDifficulties?.includes("Medium")?"Medium":pkg.supportedDifficulties?.[0]??"Mixed");
  const request={
   engineId:pkg.engineId,packageId:pkg.packageId,exam:"SSC CGL Tier 1",
   subject:pkg.subject,topic:pkg.topic,subtopic:pkg.subtopic,
   language:pkg.supportedLanguages.includes("en")?"en":pkg.supportedLanguages[0],
   difficulty,runtimeMode:pkg.runtimeMode,count:1,
   seed:"qs-coverage-"+pkg.packageId+"-20261016",
   ...(firstCp?{canonicalProblemId:firstCp}:{})
  };
  const input={request,count:1,selectedCpIds:firstCp?[firstCp]:[]};
  const result={packageId:pkg.packageId,engineId:pkg.engineId,subject:pkg.subject,
    cpId:firstCp??null,language:request.language,difficulty:difficulty??null,
    runtimeMode:pkg.runtimeMode??null,status:"failed",code:null,durationMs:0};
  try{
   const batch=await compute(input);
   if(batch.packageId!==pkg.packageId||batch.engineId!==pkg.engineId||!Array.isArray(batch.questions)||batch.questions.length!==1){
    result.code="BATCH_IDENTITY_OR_COUNT_INVALID";
   }else{
    result.code=validateAnswer(batch.questions[0]);
    result.status=result.code?"failed":"passed";
   }
  }catch(error){result.code=safeCode(error);}
  result.durationMs=Date.now()-started;
  results.push(result);
  console.log("QS_COVERAGE_CASE "+JSON.stringify(result));
 }
}finally{
 chmodSync(cwd,originalMode);
}
const passed=results.filter(r=>r.status==="passed").length;
const failed=results.filter(r=>r.status==="failed").length;
const output={runType:"offline-compute-only",wave,shard,shards,catalogTotal:enabled.length,
  selected:results.length,passed,failed,durationMs:Date.now()-date,results};
writeFileSync(reportPath,JSON.stringify(output,null,2)+"\n");
if(process.env.GITHUB_STEP_SUMMARY){
 const summary=[
  "## Isolated Question Studio compute audit: "+wave+" / shard "+shard,
  "",
  "Registered/enabled: **"+enabled.length+"**; tested: **"+results.length+"**; passed: **"+passed+"**; failed: **"+failed+"**.",
  "This is an offline one-question structural smoke test, NOT end-to-end acceptance or answer-truth proof.",
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

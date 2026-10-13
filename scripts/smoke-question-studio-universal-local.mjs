// Run built universal worker with four representative engine families.
// No credentials, DB, admin session, publication or writes are performed.
import { spawn } from "node:child_process";
import { once } from "node:events";
import { chmodSync, statSync, existsSync } from "node:fs";

const token = "ci-universal-compute-only-abcdef0123456789";
const worker = "artifacts/api-server/dist/universal-question-studio-worker-service.mjs";
const proc = spawn(process.execPath, [worker], {
  env: { ...process.env, PORT:"0", QUESTION_STUDIO_WORKER_TOKEN:token },
  stdio:["ignore","pipe","pipe"],
});
let output="";
let stderr="";
proc.stderr.on("data",data=>{stderr+=data.toString();});
const port = await new Promise((resolve,reject)=>{
  const timeout = setTimeout(()=>reject(new Error("Worker did not start "+stderr.slice(-700))),10000);
  proc.once("exit",code=>{clearTimeout(timeout);reject(new Error("Worker exited "+code+" "+stderr.slice(-700)));});
  proc.stdout.on("data",chunk=>{
    output+=chunk.toString();
    for(const line of output.split("\n")) {
      try {
        const data=JSON.parse(line);
        if(data.event==="universal_worker_ready"){clearTimeout(timeout);resolve(data.port);}
      } catch {}
    }
  });
});
const url="http://127.0.0.1:"+port+"/internal/question-studio/universal/generate";
const cases=[
  {engineId:"quant-v4",packageId:"TRG-002",topic:"Advanced Mathematics",subtopic:"Trigonometry — Heights & Distances",difficulty:"Medium",runtimeMode:"RELEASED",cp:"TRG-CP-007"},
  {engineId:"reasoning-v1",packageId:"OPS-001",topic:"Mathematical Operations",subtopic:"Mathematical Operations",difficulty:"Mixed",runtimeMode:"review-only"},
  {engineId:"language-v1",packageId:"ENG-001",topic:"Error Spotting",subtopic:"Common Usage / Idiomatic Grammar",difficulty:"Medium",runtimeMode:"review-only",cp:"ENG-001-CP013"},
  {engineId:"knowledge-v1",packageId:"COM-001",topic:"Computer Awareness",subtopic:"Computer Basics",difficulty:"Mixed",runtimeMode:"review-only"},
];
// Cloud Run executes as a non-root user with an immutable image filesystem.
// Prevent a bundled audit/export module from silently writing review files
// under the service working directory during runtime import. The runner is
// a non-root GitHub Actions user; permissions are restored even on failure.
const workdir = process.cwd();
const initialMode = statSync(workdir).mode & 0o777;
const blrAuditPath = "blr-001-multilingual-human-review-output";
if (existsSync(blrAuditPath)) throw new Error("Refusing to test against a preexisting BLR export directory");
chmodSync(workdir, 0o555);
try {
  for(const c of cases) {
    const request={
      engineId:c.engineId,packageId:c.packageId,count:1,exam:"SSC CGL Tier 1",
      subject:c.engineId==="quant-v4"?"Quantitative Aptitude":c.engineId==="reasoning-v1"?"Reasoning Ability":c.engineId==="language-v1"?"English":"Static GK",
      topic:c.topic,subtopic:c.subtopic,language:"en",difficulty:c.difficulty,
      runtimeMode:c.runtimeMode,seed:"ci-universal-"+c.packageId+"-20261012",
      ...(c.cp?{canonicalProblemId:c.cp}:{})
    };
    const response=await fetch(url,{
      method:"POST",
      headers:{"Content-Type":"application/json","X-Examtree-Worker-Token":token},
      body:JSON.stringify({request,count:1,selectedCpIds:c.cp?[c.cp]:[]}),
      signal:AbortSignal.timeout(165000),
    });
    const data=await response.json();
    if(!response.ok||!data.ok||data.batch?.questions?.length!==1||
        data.batch?.engineId!==c.engineId||data.batch?.packageId!==c.packageId) {
      throw new Error(c.packageId+" failed: HTTP "+response.status+" "+JSON.stringify({code:data.code,error:data.error}));
    }
    console.log("PASS: universal "+c.engineId+" "+c.packageId+" generated 1 review-ready candidate (no DB)");
  }
  if (existsSync(blrAuditPath)) throw new Error("Bundled runtime unexpectedly wrote the BLR audit export");
} finally {
  chmodSync(workdir, initialMode);
  proc.kill();
  await once(proc,"exit").catch(()=>undefined);
}

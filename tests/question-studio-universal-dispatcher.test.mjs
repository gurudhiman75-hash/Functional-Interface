import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { fileURLToPath } from "node:url";

const read=(name)=>readFileSync(name,"utf8");
const service=fileURLToPath(new URL("../artifacts/api-server/universal-question-studio-worker-service.mjs", import.meta.url));
const token="ci-test-only-universal-question-worker-token-0123456789";

async function start() {
  const proc=spawn(process.execPath,[service],{env:{...process.env, PORT:"0",QUESTION_STUDIO_WORKER_TOKEN:token},stdio:["ignore","pipe","pipe"]});
  let buf="";
  const port=await new Promise((resolve,reject)=>{
    const deadline=setTimeout(()=>reject(new Error("Universal server did not start")),6500);
    proc.once("exit",code=>{clearTimeout(deadline);reject(new Error("Worker exited: "+code));});
    proc.stdout.on("data",chunk=>{
      buf+=chunk.toString();
      for(const row of buf.split("\n")) {
        try {
          const obj=JSON.parse(row);
          if(obj.event==="universal_worker_ready"){clearTimeout(deadline);resolve(obj.port);}
        } catch {}
      }
    });
  });
  return {proc,url:"http://127.0.0.1:"+port};
}

test("universal worker denies unauthenticated compute, malformed requests and unknown paths", async()=>{
  const {proc,url}=await start();
  const post=(body,auth=true)=>fetch(url+"/internal/question-studio/universal/generate",{
    method:"POST",headers:{"Content-Type":"application/json",...(auth?{"X-Examtree-Worker-Token":token}:{})},
    body:JSON.stringify(body),
  });
  try {
    const health=await (await fetch(url+"/health")).json();
    assert.equal(health.status,"ok");
    assert.deepEqual(health.engineFamilies,["quant-v4","reasoning-v1","language-v1","knowledge-v1"]);
    assert.equal((await post({count:1},false)).status,401);
    const bad=await post({request:{packageId:"BAD-001",count:55},count:55,selectedCpIds:[]});
    assert.equal(bad.status,400);
    assert.equal((await bad.json()).code,"INVALID_UNIVERSAL_GENERATION_REQUEST");
    assert.equal((await fetch(url+"/internal/unapproved")).status,404);
    assert.equal((await (await fetch(url+"/health")).json()).busy,false);
  } finally {
    proc.kill(); await once(proc,"exit").catch(()=>undefined);
  }
});

test("canonical API owns Neon persistence while universal worker owns deterministic compute",()=>{
  const route=read("artifacts/api-server/src/routes/admin-question-studio-engine-v1.ts");
  const app=read("artifacts/api-server/src/app.ts");
  const executor=read("artifacts/api-server/src/question-studio/universal-executor.ts");
  const client=read("artifacts/api-server/src/question-studio/remote-universal-studio-client.ts");
  const server=read("artifacts/api-server/universal-question-studio-worker-service.mjs");
  assert.match(route,/universalStudioRemoteConfigured\(\)/);
  assert.match(route,/runUniversalStudioRemote\(/);
  assert.match(route,/await sqlClient\.begin\(/);
  assert.match(route,/generation_item_versions/);
  assert.match(route,/platform\.audit_events/);
  assert.match(route,/platform\.outbox_events/);
  assert.match(route,/content\.generation_runs/);
  assert.ok(route.indexOf("runUniversalStudioRemote(")<route.indexOf("await sqlClient.begin("));
  assert.match(executor,/listQuestionStudioPackages\(\)/);
  for(const x of ["quant-v4","selectedCpIds","supportedLanguages","supportedRuntimeModes","supportedDifficulties"]){
    assert.ok(executor.includes(x),x);
  }
  assert.match(client,/UNIVERSAL_WORKER_BATCH_MISMATCH/);
  assert.match(server,/timingSafeEqual/);
  assert.doesNotMatch(server,/sqlClient|DATABASE_URL|firebase-admin|Cashfree|publish/);
  assert.doesNotMatch(executor,/sqlClient|INSERT INTO|outbox_events|publication/);
  assert.match(app,/EXAMTREE_ADMIN_DETERMINISTIC_ONLY/);
});

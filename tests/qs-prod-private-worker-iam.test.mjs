import test from "node:test";
import assert from "node:assert/strict";
import {build} from "esbuild";
import {readFileSync} from "node:fs";
import {spawn} from "node:child_process";
import {createServer} from "node:net";
import {once} from "node:events";

const origin="https://examtree-universal-prod-123456789.asia-south1.run.app";
const prodEnv={
  EXAMTREE_API_RUNTIME:"cloud-run",
  EXAMTREE_API_STAGING:"false",
  K_SERVICE:"examtree-qs-receiver-prod",
  EXAMTREE_QS_PRODUCTION_WORKER_BINDING_VERIFIED:"true",
};
const token="A".repeat(35)+"."+"B".repeat(35)+"."+"C".repeat(35);
async function loadModule(file) {
  const b=await build({entryPoints:[file],bundle:true,platform:"node",format:"esm",write:false,logLevel:"silent"});
  const source=b.outputFiles[0].text;
  return import("data:text/javascript;base64,"+Buffer.from(source).toString("base64"));
}

test("private Cloud Run IAM identity is restricted to production receiver and exact worker origin",async()=>{
  const {getPrivateProductionWorkerIdentityToken:identity}=await loadModule("artifacts/api-server/src/question-studio/production-private-worker-oidc.ts");
  const calls=[];
  const fake=async(url,opts)=>{
    calls.push({url,opts});
    return new Response(token,{status:200});
  };
  await assert.rejects(identity(origin,fake,{...prodEnv,EXAMTREE_API_STAGING:"true"}),/identity unavailable/i);
  await assert.rejects(identity(origin,fake,{...prodEnv,K_SERVICE:"examtree-api"}),/identity unavailable/i);
  await assert.rejects(identity("https://examtree-universal-staging-123.run.app",fake,prodEnv),/identity unavailable/i);
  await assert.rejects(identity("http://examtree-universal-prod-123.run.app",fake,prodEnv),/identity unavailable/i);
  assert.equal(calls.length,0,"Reject bad identity or audience before contacting Google metadata");
  const got=await identity(origin,fake,prodEnv);
  assert.equal(got,token);
  assert.equal(calls.length,1);
  const url=new URL(calls[0].url);
  assert.equal(url.hostname,"metadata.google.internal");
  assert.equal(url.searchParams.get("audience"),origin);
  assert.equal(url.searchParams.get("format"),"full");
  assert.equal(calls[0].opts.headers["Metadata-Flavor"],"Google");
  await assert.rejects(identity(origin,async()=>new Response("bad",{status:200}),prodEnv),/identity unavailable/i);
  await assert.rejects(identity(origin,async()=>new Response("no",{status:403}),prodEnv),/identity unavailable/i);
});

test("production receiver opts into IAM and staging preserves legacy shared-token route",async()=>{
  const source=readFileSync("artifacts/api-server/src/async-task-receiver-prod-standalone.ts","utf8");
  const staging=readFileSync("artifacts/api-server/src/async-task-receiver-standalone.ts","utf8");
  const remote=readFileSync("artifacts/api-server/src/question-studio/remote-universal-studio-client.ts","utf8");
  assert.match(source,/runUniversalStudioRemote\(compute,\{productionPrivateCloudRun:true\}\)/);
  assert.match(staging,/runUniversalStudioRemote\(compute\)/);
  assert.match(remote,/opts\.productionPrivateCloudRun/);
  assert.match(remote,/getPrivateProductionWorkerIdentityToken\(url\.origin\)/);
  assert.match(remote,/headers\.Authorization=/);
});

async function freePort(){
  const server=createServer();
  server.listen(0,"127.0.0.1");
  await once(server,"listening");
  const port=server.address().port;
  await new Promise(resolve=>server.close(resolve));
  return port;
}

test("production compute starts disabled with no secret and no generation", {timeout:15000},async()=>{
  const port=await freePort();
  const child=spawn(process.execPath,["artifacts/api-server/prod-universal-worker-service.mjs"],{
    stdio:["ignore","pipe","pipe"],
    env:{...process.env,PORT:String(port),EXAMTREE_API_RUNTIME:"cloud-run",
      EXAMTREE_API_STAGING:"false",K_SERVICE:"examtree-universal-prod",
      EXAMTREE_QS_PRODUCTION_WORKER_APPROVED:"false",
      EXAMTREE_QUESTION_STUDIO_STAGING_TASK_ACCEPTANCE_APPROVED:"false",
      QUESTION_STUDIO_WORKER_TOKEN:"",DATABASE_URL:""},
  });
  let output="";
  child.stderr.on("data",c=>{output+=String(c).slice(0,2000);});
  child.stdout.on("data",c=>{output+=String(c).slice(0,2000);});
  try {
    let ready=false;
    for(let n=0;n<70;n++){
      if(child.exitCode!==null)break;
      try{
        const response=await fetch(`http://127.0.0.1:${port}/health`);
        if(response.status===200){
          const body=await response.json();
          assert.equal(body.ready,false);
          ready=true;break;
        }
      }catch{}
      await new Promise(resolve=>setTimeout(resolve,100));
    }
    assert.ok(ready,"disabled private worker must serve health without secrets "+output);
    const response=await fetch(`http://127.0.0.1:${port}/internal/question-studio/universal/generate`,{method:"POST",headers:{"content-type":"application/json"},body:"{}"});
    assert.equal(response.status,503);
    assert.equal((await response.json()).code,"QS_PRODUCTION_WORKER_DISABLED");
    assert.doesNotMatch(output,/DATABASE_URL|secret of at least 32 characters/);
  }finally {
    child.kill("SIGTERM");
    if(child.exitCode===null)await Promise.race([once(child,"exit").catch(()=>{}),new Promise(r=>setTimeout(r,1000))]);
    if(child.exitCode===null)child.kill("SIGKILL");
  }
});

test("worker image has separate default-disabled entrypoint and no production database injection",()=>{
  const docker=readFileSync("Dockerfile.examtree-qs-prod-universal-worker","utf8");
  const config=readFileSync("cloudbuild.examtree-qs-prod-universal-worker.yaml","utf8");
  const wrapper=readFileSync("artifacts/api-server/prod-universal-worker-service.mjs","utf8");
  assert.match(docker,/CMD \["node", "artifacts\/api-server\/dist\/prod-universal-worker-service\.mjs"\]/);
  assert.match(docker,/EXAMTREE_API_STAGING=false/);
  assert.match(wrapper,/env\.K_SERVICE!=="examtree-universal-prod"/);
  assert.match(wrapper,/env\.EXAMTREE_QS_PRODUCTION_WORKER_APPROVED!=="true"/);
  assert.match(wrapper,/env\.DATABASE_URL/);
  assert.match(config,/Dockerfile\.examtree-qs-prod-universal-worker/);
  assert.doesNotMatch(config,/gcloud run|gcloud tasks|gcloud scheduler/);
});

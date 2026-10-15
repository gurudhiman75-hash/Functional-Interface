import test from "node:test";
import assert from "node:assert/strict";
import {spawn} from "node:child_process";
import {createServer} from "node:net";
import {once} from "node:events";
import {existsSync} from "node:fs";
import path from "node:path";

const entry=path.resolve("artifacts/api-server/dist/async-task-receiver-prod-standalone.mjs");

async function freePort() {
  const server=createServer();
  server.listen(0,"127.0.0.1");
  await once(server,"listening");
  const address=server.address();
  const port=typeof address==="object" && address ? address.port : 0;
  await new Promise((resolve,reject)=>server.close(e=>e?reject(e):resolve()));
  assert.ok(port>0);
  return port;
}

test("disabled prod receiver boots without production DB credentials and rejects tasks", {timeout:20_000}, async()=>{
  assert.ok(existsSync(entry),"Production receiver bundle must be compiled before smoke test");
  const port=await freePort();
  const child=spawn(process.execPath,[entry],{
    cwd:process.cwd(),
    env:{
      ...process.env,
      PORT:String(port),
      K_SERVICE:"examtree-qs-receiver-prod",
      EXAMTREE_API_RUNTIME:"cloud-run",
      EXAMTREE_API_STAGING:"false",
      DATABASE_URL:"",
      EXAMTREE_QS_PRODUCTION_RECEIVER_APPROVED:"false",
      EXAMTREE_QS_PRODUCTION_DATABASE_BINDING_VERIFIED:"false",
      EXAMTREE_QS_PRODUCTION_RECEIVER_OIDC_VERIFIED:"false",
      EXAMTREE_QS_PRODUCTION_WORKER_BINDING_VERIFIED:"false",
      QUESTION_STUDIO_WORKER_TOKEN:"",
      QUESTION_STUDIO_UNIVERSAL_WORKER_URL:"",
    },
    stdio:["ignore","pipe","pipe"],
  });
  let output="";
  child.stderr.on("data",v=>{output+=String(v).slice(0,2500);});
  child.stdout.on("data",v=>{output+=String(v).slice(0,2500);});
  try {
    let healthy=false;
    for(let i=0;i<80;i++){
      if(child.exitCode!==null)throw new Error("Receiver exited on boot: "+output.slice(0,3000));
      try{
        const r=await fetch(`http://127.0.0.1:${port}/health`);
        if(r.status===200){
          const body=await r.json();
          assert.equal(body.ready,false);
          healthy=true;break;
        }
      }catch{} // Wait for HTTP listener during startup.
      await new Promise(resolve=>setTimeout(resolve,100));
    }
    assert.ok(healthy,"Receiver must listen on PORT without Neon secret: "+output.slice(0,3000));
    const response=await fetch(`http://127.0.0.1:${port}/internal/question-studio/async-task`,{
      method:"POST",headers:{"content-type":"application/json"},
      body:JSON.stringify({runId:"00000000-0000-0000-0000-000000000000",queueVersion:1}),
    });
    assert.equal(response.status,503);
    assert.equal((await response.json()).code,"QS_PRODUCTION_RECEIVER_DISABLED");
    assert.doesNotMatch(output,/DATABASE_URL environment variable is required/);
  }finally{
    child.kill("SIGTERM");
    if(child.exitCode===null) {
      await Promise.race([once(child,"exit").catch(()=>{}),new Promise(r=>setTimeout(r,1000))]);
      if(child.exitCode===null)child.kill("SIGKILL");
    }
  }
});

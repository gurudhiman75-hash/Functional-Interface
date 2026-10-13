import assert from "node:assert/strict";
import express from "express";
import {mountQuestionStudioAsyncTaskReceiver} from "./async-task-receiver-mount";

const ON:NodeJS.ProcessEnv={
  EXAMTREE_API_RUNTIME:"cloud-run",
  EXAMTREE_API_STAGING:"true",
  EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED:"true",
  EXAMTREE_QUESTION_STUDIO_ASYNC_OUTBOX_ENABLED:"true",
  EXAMTREE_QUESTION_STUDIO_TASK_RECEIVER_VERIFIED:"true",
  EXAMTREE_QUESTION_STUDIO_TASK_CLAIM_ENABLED:"true",
  EXAMTREE_QUESTION_STUDIO_TASK_REVIEW_COMMIT_ENABLED:"true",
  EXAMTREE_QUESTION_STUDIO_TASK_RECEIVER_ROUTE_ENABLED:"true",
  EXAMTREE_QUESTION_STUDIO_STAGING_TASK_ACCEPTANCE_APPROVED:"true",
};

async function serverFor(overrides:NodeJS.ProcessEnv) {
  const app=express();
  const hits:{url:string;originalUrl:string;body:unknown}[]=[];
  const router=express.Router();
  router.post("/async-task",(req,res)=>{
    hits.push({url:req.url,originalUrl:req.originalUrl,body:req.body});
    res.status(204).end();
  });
  mountQuestionStudioAsyncTaskReceiver(app,router,overrides);
  const server=app.listen(0,"127.0.0.1");
  await new Promise<void>((resolve,reject)=>{
    server.once("listening",resolve);
    server.once("error",reject);
  });
  const address=server.address();
  if(!address||typeof address==="string")throw new Error("No listening TCP port");
  return {
    base:`http://127.0.0.1:${address.port}`,
    hits,
    close:()=>new Promise<void>((resolve,reject)=>server.close(err=>err?reject(err):resolve())),
  };
}

const fullPath="/internal/question-studio/async-task";
const payload={runId:"12345678-1234-4234-8234-123456789012",queueVersion:1};

async function post(base:string,body:unknown,path=fullPath) {
  return fetch(base+path,{
    method:"POST",
    headers:{"content-type":"application/json"},
    body:JSON.stringify(body),
  });
}

// Normal production stays closed, even if someone sets queue flags.
for(const overrides of [
  {...ON,EXAMTREE_API_STAGING:"false"},
  {...ON,EXAMTREE_API_RUNTIME:"render"},
  {...ON,EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED:undefined},
  {...ON,EXAMTREE_QUESTION_STUDIO_TASK_RECEIVER_ROUTE_ENABLED:"false"},
]){
  const x=await serverFor(overrides);
  try {
    const r=await post(x.base,payload);
    assert.equal(r.status,503);
    assert.equal((await r.json()).code,"QUESTION_STUDIO_ASYNC_RECEIVER_DISABLED");
    assert.equal(x.hits.length,0);
  } finally {await x.close();}
}

// Under staging flags, the actual parent-prefix mount must forward to
// Router.post("/async-task"), never 404 because of a double prefix.
const x=await serverFor(ON);
try {
  const r=await post(x.base,payload);
  assert.equal(r.status,204);
  assert.equal(x.hits.length,1);
  assert.equal(x.hits[0]?.url,"/async-task");
  assert.equal(x.hits[0]?.originalUrl,fullPath);
  assert.deepEqual(x.hits[0]?.body,payload);

  const wrong=await post(x.base,payload,"/internal/question-studio/unrelated");
  assert.equal(wrong.status,404);
  const get=await fetch(x.base+fullPath);
  assert.equal(get.status,404);
  assert.equal(x.hits.length,1);

  const oversize=await post(x.base,{runId:payload.runId,queueVersion:1,notes:"x".repeat(3000)});
  assert.equal(oversize.status,413);
  assert.equal(x.hits.length,1);
} finally {await x.close();}

console.log("PASS: actual Express parent router mount, 503 disabled, 204 staging, 404 unrelated, 2kb rejection");

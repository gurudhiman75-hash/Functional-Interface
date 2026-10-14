import test from "node:test";
import assert from "node:assert/strict";
import { configuredQsAdminOrigin, onRequest } from "../functions/api/[[path]].js";

const normal="https://examtree-api-1083299267005.asia-south1.run.app";
const qs="https://examtree-qs-admin-api-staging-1083299267005.asia-south1.run.app";
const render="https://examtree-new.onrender.com";
const env={EXAMTREE_API_UPSTREAM_ORIGIN:normal,EXAMTREE_QS_ADMIN_UPSTREAM_ORIGIN:qs};

test("dedicated Question Studio admin upstream is tightly restricted",()=>{
 assert.equal(configuredQsAdminOrigin({}),null);
 assert.equal(configuredQsAdminOrigin(env),qs);
 for(const bad of [
  "https://examtree.in",
  "https://examtree-api-1083299267005.asia-south1.run.app",
  "https://examtree-qs-admin-api-staging-1083299267005.asia-south1.run.app/other",
  "https://examtree-qs-admin-api-staging-1083299267005.asia-south1.run.app.attacker.example",
  "http://examtree-qs-admin-api-staging-1083299267005.asia-south1.run.app",
 ]) assert.throws(()=>configuredQsAdminOrigin({EXAMTREE_QS_ADMIN_UPSTREAM_ORIGIN:bad}),bad);
});

test("existing Pages frontend routes only QS + session to staging; other routes untouched",async()=>{
 const original=globalThis.fetch, seen=[];
 globalThis.fetch=async(req)=>{seen.push({url:req.url,headers:req.headers,method:req.method});return Response.json({ok:true});};
 try{
  for(const [p,destination] of [
   ["/api/admin/session/bootstrap",qs],
   ["/api/admin/question-studio/capabilities",qs],
   ["/api/admin/question-studio/runs/async-staging",qs],
   ["/api/admin/question-studio/runs/524cec91-ce36-44c0-a202-85ff7a585728/status",qs],
   ["/api/admin/notes-studio-v2/status",render],
   ["/api/admin/commerce/orders",render],
   ["/api/billing/cashfree/webhook",render],
   ["/api/student/profile",normal],
   ["/api/admin/question-studio-evil",render],
   ["/api/admin/session-evil",render],
  ]){
   const response=await onRequest({env,request:new Request("https://examtree.in"+p)});
   assert.equal(response.status,200,p);
   assert.equal(seen.at(-1).url,destination+p,p);
  }
  const response=await onRequest({env,request:new Request("https://examtree.in/api/admin/question-studio/runs/async-staging",{
   method:"POST",headers:{Origin:"https://examtree.in","Idempotency-Key":"qs-test-key-123","Authorization":"Bearer disposable", "Content-Type":"application/json"},body:"{}"
  })});
  assert.equal(response.status,200);
  const forwarded=seen.at(-1);
  assert.equal(forwarded.url,qs+"/api/admin/question-studio/runs/async-staging");
  assert.equal(forwarded.headers.get("Idempotency-Key"),"qs-test-key-123");
  assert.equal(forwarded.headers.get("Authorization"),"Bearer disposable");
  assert.equal(forwarded.headers.get("Origin"),null);
 }finally{globalThis.fetch=original;}
});

test("bad optional QS origin is rejected rather than falling back on writes",async()=>{
 const reply=await onRequest({env:{...env,EXAMTREE_QS_ADMIN_UPSTREAM_ORIGIN:"https://attacker.example"},request:new Request("https://examtree.in/api/admin/question-studio/runs/async-staging",{method:"POST",body:"{}"})});
 assert.equal(reply.status,503);
 assert.equal((await reply.json()).code,"QS_ADMIN_UPSTREAM_MISCONFIGURED");
});

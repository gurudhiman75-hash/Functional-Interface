import assert from "node:assert/strict";
import {generateKeyPairSync, sign} from "node:crypto";
import {
  getQuestionStudioTaskOidcConfig, createQuestionStudioTaskOidcVerifier,
  validateQuestionStudioTaskBody, QuestionStudioTaskAuthError,
} from "./async-cloud-tasks-oidc";

const {privateKey,publicKey}=generateKeyPairSync("rsa",{modulusLength:2048});
const pub=publicKey.export({format:"jwk"}) as Record<string,string>;
const cfg=getQuestionStudioTaskOidcConfig({
  EXAMTREE_QUESTION_STUDIO_TASK_AUDIENCE:"https://examtree-api-1083299267005.asia-south1.run.app",
  EXAMTREE_QUESTION_STUDIO_TASK_SERVICE_ACCOUNT:"qs-tasks@sarbedutech.iam.gserviceaccount.com",
});
const NOW=1_791_900_000;
const base={
  iss:"https://accounts.google.com",
  aud:cfg.audience,
  email:cfg.serviceAccount,
  email_verified:true,
  sub:"123456789012345678901",
  iat:Math.floor(NOW/1000)-30,
  exp:Math.floor(NOW/1000)+1800,
};
function jwt(claims:Record<string,unknown>=base, header:Record<string,unknown>={alg:"RS256",kid:"testing-kid-1",typ:"JWT"},key=privateKey):string{
  const a=Buffer.from(JSON.stringify(header)).toString("base64url");
  const b=Buffer.from(JSON.stringify(claims)).toString("base64url");
  const sig=sign("RSA-SHA256",Buffer.from(a+"."+b),key).toString("base64url");
  return a+"."+b+"."+sig;
}
let certRequests=0;
const verifier=createQuestionStudioTaskOidcVerifier({
  now:()=>NOW,
  request:async (url)=>{
    certRequests++;
    assert.equal(String(url),"https://www.googleapis.com/oauth2/v3/certs");
    return new Response(JSON.stringify({keys:[{...pub,kid:"testing-kid-1",alg:"RS256",use:"sig"}]}),{status:200});
  },
});
const good=jwt();
assert.deepEqual(await verifier("Bearer "+good,cfg),{
  serviceAccountEmail:cfg.serviceAccount,subject:base.sub,
});
assert.equal(certRequests,1);
assert.deepEqual(await verifier("Bearer "+good,cfg),{
  serviceAccountEmail:cfg.serviceAccount,subject:base.sub,
});
assert.equal(certRequests,1,"JWKS cache should avoid repeat network on every task");
for(const [field,override] of [
  ["aud","https://attacker.run.app"],
  ["iss","https://accounts.evil.com"],
  ["email","other@sarbedutech.iam.gserviceaccount.com"],
  ["email_verified",false],
  ["exp",Math.floor(NOW/1000)-1],
  ["iat",Math.floor(NOW/1000)+90],
  ["sub","unknown"],
] as const){
  await assert.rejects(()=>verifier("Bearer "+jwt({...base,[field]:override}),cfg),QuestionStudioTaskAuthError);
}
for(const bad of [
  undefined,
  "Bearer ",
  "Basic xyz",
  "Bearer header.payload",
  "Bearer "+jwt(base,{alg:"none",kid:"testing-kid-1"}),
  "Bearer "+jwt(base,{alg:"HS256",kid:"testing-kid-1"}),
  "Bearer "+jwt(base,{alg:"RS256",kid:"testing-kid-1",crit:["fake"]}),
  "Bearer "+jwt(base).slice(0,-8)+"11111111",
]){
  await assert.rejects(()=>verifier(bad,cfg),QuestionStudioTaskAuthError);
}
const {privateKey:attacker}=generateKeyPairSync("rsa",{modulusLength:2048});
await assert.rejects(()=>verifier("Bearer "+jwt(base,undefined,attacker),cfg),QuestionStudioTaskAuthError);
for(const invalid of [
  {EXAMTREE_QUESTION_STUDIO_TASK_AUDIENCE:"http://examtree-api.run.app"},
  {EXAMTREE_QUESTION_STUDIO_TASK_AUDIENCE:"https://www.example.com"},
  {EXAMTREE_QUESTION_STUDIO_TASK_SERVICE_ACCOUNT:"root@example.com"},
]){
  assert.throws(()=>getQuestionStudioTaskOidcConfig({
    EXAMTREE_QUESTION_STUDIO_TASK_AUDIENCE:cfg.audience,
    EXAMTREE_QUESTION_STUDIO_TASK_SERVICE_ACCOUNT:cfg.serviceAccount,
    ...invalid,
  }),QuestionStudioTaskAuthError);
}
const clean={runId:"12345678-1234-4234-8234-123456789012",queueVersion:1};
assert.deepEqual(validateQuestionStudioTaskBody(clean),clean);
for(const input of [null,{},[clean],{...clean,queueVersion:2},{...clean,token:"hidden"}, {runId:"bad",queueVersion:1}]){
  assert.throws(()=>validateQuestionStudioTaskBody(input),QuestionStudioTaskAuthError);
}
console.log("PASS: Google RS256 OIDC signature, issuer, exact audience/email, expiry, JWKS cache, payload isolation");

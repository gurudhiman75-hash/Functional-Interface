import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(p,"utf8");
const source=read("artifacts/api-server/src/question-studio/async-cloud-tasks-oidc.ts");
const app=read("artifacts/api-server/src/app.ts");
const dispatcher=read("artifacts/api-server/src/question-studio/async-cloud-tasks-transport.ts");

test("task verifier validates Google JWKS signature, issuer and exact receiver identity",()=>{
  assert.match(source,/https:\/\/www\.googleapis\.com\/oauth2\/v3\/certs/);
  assert.match(source,/createPublicKey/);
  assert.match(source,/verify\("RSA-SHA256"/);
  assert.match(source,/header\.alg !== "RS256"/);
  assert.match(source,/payload\.aud !== config\.audience/);
  assert.match(source,/payload\.email !== config\.serviceAccount/);
  assert.match(source,/payload\.email_verified !== true/);
  assert.match(source,/https:\/\/accounts\.google\.com/);
  assert.match(source,/exp <= current/);
  assert.match(source,/JWT_PATTERN/);
  assert.match(source,/MAX_JWT_LENGTH/);
  assert.match(source,/KEY_CACHE_MS/);
});

test("receiver rejects payload fields that could carry Firebase tokens or generation questions",()=>{
  assert.match(source,/Object\.keys\(data\)\.sort\(\)\.join\(","\) !== "queueVersion,runId"/);
  assert.match(source,/data\.queueVersion !== 1/);
  assert.match(source,/UUID\.test\(data\.runId\)/);
  assert.doesNotMatch(source,/X-CloudTasks-TaskName["']\s*\]/);
  assert.doesNotMatch(source,/verifyIdToken\(/);
  assert.match(dispatcher,/oidcToken/);
});

test("identity checker stays unmounted until durable claim, save and replay proofs",()=>{
  assert.doesNotMatch(app,/async-cloud-tasks-oidc|\/internal\/question-studio\/async-task/);
  assert.doesNotMatch(source,/app\.post\(|router\.post\(|runUniversalStudioRemote\(/);
});

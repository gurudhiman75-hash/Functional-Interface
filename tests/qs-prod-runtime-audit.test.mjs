import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync, mkdtempSync, writeFileSync, chmodSync, rmSync} from "node:fs";
import {tmpdir} from "node:os";
import path from "node:path";
import {spawnSync} from "node:child_process";

const script = "scripts/audit-examtree-qs-prod-runtime.py";
const source = readFileSync(script, "utf8");

test("read-only audit syntax and prohibited cloud operations",()=>{
  const result = spawnSync("python3", ["-m","py_compile",script], {encoding:"utf8"});
  assert.equal(result.status,0,result.stderr);
  assert.match(source,/PROJECT = "sarbedutech"/);
  assert.match(source,/REGION = "asia-south1"/);
  assert.match(source,/QUEUE = "examtree-qs-prod"/);
  assert.match(source,/verify_pinned_disabled_revision/);
  assert.match(source,/DISABLED_BASELINES/);
  assert.match(source,/NO DATABASE WRITE, NO JOB EXECUTION, NO QUEUE RESUME/);
  assert.doesNotMatch(source,/gcloud secrets versions access|run jobs execute|tasks queues resume/);
});

function fakeGcloud(projectName) {
  const dir=mkdtempSync(path.join(tmpdir(),"qs-prod-audit-"));
  const bin=path.join(dir,"gcloud"),calls=path.join(dir,"calls");
  writeFileSync(bin, '#!/usr/bin/env bash\n' +
    'echo "$*" >> "$QS_AUDIT_CALLS"\n' +
    'if [[ "$1 $2 $3" == "config get-value project" ]]; then echo '+projectName+'; exit 0; fi\n' +
    'exit 90\n');
  chmodSync(bin,0o755);
  return {dir,calls,env:{...process.env,PATH:dir+":"+process.env.PATH,QS_AUDIT_CALLS:calls}};
}

test("audit rejects wrong Cloud Shell project before reading other resources",()=>{
  const ctx=fakeGcloud("wrong-project");
  try{
    const proc=spawnSync("python3",[script],{encoding:"utf8",timeout:10000,env:ctx.env});
    assert.equal(proc.status,2,proc.stdout+"\n"+proc.stderr);
    assert.match(proc.stdout,/BLOCK: active project/);
    const commands=readFileSync(ctx.calls,"utf8").trim().split("\n");
    assert.deepEqual(commands,["config get-value project"]);
  }finally{rmSync(ctx.dir,{recursive:true,force:true});}
});

test("audit fails closed when resources cannot be read",()=>{
  const ctx=fakeGcloud("sarbedutech");
  try{
    const proc=spawnSync("python3",[script],{encoding:"utf8",timeout:15000,env:ctx.env});
    assert.equal(proc.status,2,proc.stdout+"\n"+proc.stderr);
    assert.match(proc.stdout,/RESULT: NOT READY/);
    assert.match(proc.stdout,/BLOCK: production Cloud Tasks queue/);
    assert.match(proc.stdout,/BLOCK: examtree-qs-receiver-prod/);
    const commands=readFileSync(ctx.calls,"utf8");
    assert.doesNotMatch(commands,/ (?:update|create|deploy|execute|resume|pause|delete|set-iam-policy|add-iam-policy-binding)(?:\s|$)/m);
    assert.doesNotMatch(commands,/secrets versions access|run jobs execute|run deploy/);
  }finally{rmSync(ctx.dir,{recursive:true,force:true});}
});

import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,mkdtempSync,writeFileSync,chmodSync,rmSync} from "node:fs";
import {spawnSync} from "node:child_process";
import {tmpdir} from "node:os";
import path from "node:path";
const file="scripts/prepare-qs-prod-disabled-only.py";
const source=readFileSync(file,"utf8");

test("disabled-only installer has valid Python syntax",()=>{
  const p=spawnSync("python3",["-m","py_compile",file],{encoding:"utf8"});
  assert.equal(p.status,0,p.stderr);
});
test("installer has no queue activation or job execution and pins production IDs",()=>{
  for(const x of ['P="sarbedutech"','N="1083299267005"','QUEUE="examtree-qs-prod"',
    'DB_SECRET="examtree-api-database-url"',
    'EXAMTREE_QS_PRODUCTION_RECEIVER_APPROVED=false',
    'EXAMTREE_QS_PRODUCTION_DISPATCH_APPROVED=false',
    'state")=="PAUSED"',
    'value=cloud(["secrets","versions","access","latest"',
    'ep-polished-king-atj47i5y.c-9.us-east-1.aws.neon.tech',
    'roles/cloudtasks.enqueuer',
    'roles/iam.serviceAccountUser',
    'roles/secretmanager.secretAccessor'])
      assert.ok(source.includes(x),x);
  assert.doesNotMatch(source,/"tasks","queues","resume"|"run","jobs","execute"|"run","deploy"|EXAMTREE_QS_PRODUCTION_RECEIVER_APPROVED=true/);
  assert.doesNotMatch(source,/("projects","add-iam-policy-binding"|roles\/owner|roles\/editor)/);
});
test("wrong active project fails before any cloud resource mutation",()=>{
  const dir=mkdtempSync(path.join(tmpdir(),"qs-prod-bindings-"));
  try{
    const bin=path.join(dir,"gcloud"),log=path.join(dir,"calls");
    writeFileSync(bin,'#!/usr/bin/env bash\necho "$*" >> "$MOCK_LOG"\n' +
      'if [[ "$1 $2 $3" == "config get-value project" ]]; then echo other-project; exit 0; fi\nexit 90\n');
    chmodSync(bin,0o755);
    for(const flags of [[],["--apply"]]){
      const p=spawnSync("python3",[file,...flags],{encoding:"utf8",timeout:10000,
        env:{...process.env,PATH:dir+":"+process.env.PATH,MOCK_LOG:log}});
      assert.equal(p.status,2,p.stdout+"\n"+p.stderr);
      assert.match(p.stderr,/active project is not sarbedutech/);
    }
    const commands=readFileSync(log,"utf8").trim().split("\n");
    assert.deepEqual(commands,["config get-value project","config get-value project"]);
  }finally{rmSync(dir,{recursive:true,force:true});}
});

test("read-only diagnostics list all inaccessible resources, never printing secret bytes",()=>{
  const dir=mkdtempSync(path.join(tmpdir(),"qs-prod-diagnostics-"));
  try{
    const bin=path.join(dir,"gcloud"),log=path.join(dir,"calls");
    writeFileSync(bin,'#!/usr/bin/env bash\n' +
      'echo "$*" >> "$MOCK_LOG"\n' +
      'if [[ "$1 $2 $3" == "config get-value project" ]]; then echo sarbedutech; exit 0; fi\n' +
      'echo "SENSITIVE-DO-NOT-DISPLAY" >&2; exit 17\n');
    chmodSync(bin,0o755);
    const r=spawnSync("python3",[file,"--diagnose"],{encoding:"utf8",timeout:15000,
      env:{...process.env,PATH:dir+":"+process.env.PATH,MOCK_LOG:log}});
    assert.equal(r.status,2,r.stdout+"\n"+r.stderr);
    assert.match(r.stdout,/FAIL: paused production queue/);
    assert.match(r.stdout,/FAIL: Google-managed Cloud Tasks service agent/);
    assert.match(r.stdout,/FAIL: production Neon secret access\/destination/);
    assert.match(r.stdout,/RESULT: 16 read-only diagnostic failures/);
    assert.doesNotMatch(r.stdout+r.stderr,/SENSITIVE-DO-NOT-DISPLAY/);
    const commands=readFileSync(log,"utf8");
    assert.doesNotMatch(commands,/ (?:update|create|deploy|execute|resume|pause|delete|add-iam-policy-binding)(?: |$)/m);
  }finally{rmSync(dir,{recursive:true,force:true});}
});
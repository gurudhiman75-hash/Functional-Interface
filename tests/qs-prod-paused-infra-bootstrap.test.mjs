import test from "node:test";
import assert from "node:assert/strict";
import {mkdtempSync,writeFileSync,readFileSync,rmSync,chmodSync} from "node:fs";
import {tmpdir} from "node:os";
import path from "node:path";
import {spawnSync} from "node:child_process";

const script="scripts/bootstrap-qs-cloud-tasks-production.sh";
const body=readFileSync(script,"utf8");

function exercise(mode, approvals={}, initial="MISSING") {
  const tmp=mkdtempSync(path.join(tmpdir(),"qs-prod-infra-"));
  const gcloud=path.join(tmp,"gcloud"),capture=path.join(tmp,"calls"),state=path.join(tmp,"queue-state");
  writeFileSync(state,initial);
  writeFileSync(gcloud,`#!/usr/bin/env bash
set -e
echo "$*" >> "$CAPTURE_FILE"
case "$1 $2 $3" in
  "config get-value project") echo sarbedutech ;;
  "services list ") echo cloudtasks.googleapis.com ;;
  "iam service-accounts describe") exit 1 ;;
  "iam service-accounts create") exit 0 ;;
  "tasks queues describe")
    current=$(cat "$FAKE_QUEUE_STATE")
    [[ "$current" != MISSING ]] || exit 1
    if [[ "$*" == *"--format=json"* ]]; then echo "{\\\"state\\\":\\\"$current\\\"}"; fi
    ;;
  "tasks queues create") echo RUNNING > "$FAKE_QUEUE_STATE" ;;
  "tasks queues pause") echo PAUSED > "$FAKE_QUEUE_STATE" ;;
  *) echo "Unexpected gcloud action $*" >&2; exit 99 ;;
esac
`);
  chmodSync(gcloud,0o755);
  try {
    const r=spawnSync("bash",[script],{
      encoding:"utf8",timeout:8000,
      env:{...process.env,MODE:mode,PATH:`${tmp}:${process.env.PATH}`,
        CAPTURE_FILE:capture,FAKE_QUEUE_STATE:state,
        EXAMTREE_QS_PROD_INFRA_PROVISION_APPROVED:"",
        EXAMTREE_QS_PROD_PAUSED_ONLY_APPROVED:"",...approvals},
    });
    return {status:r.status,stdout:r.stdout,stderr:r.stderr,
      calls:readFileSync(capture,"utf8"),state:readFileSync(state,"utf8").trim()};
  } finally {rmSync(tmp,{recursive:true,force:true});}
}

test("default check mode is fully read-only",()=>{
  const r=exercise("check");
  assert.equal(r.status,0,r.stderr);
  assert.match(r.stdout,/CHECK ONLY: zero resources created or modified/);
  assert.doesNotMatch(r.calls,/service-accounts create|queues create|queues pause|add-iam-policy-binding/);
});
test("provision refuses missing independent approvals without any mutations",()=>{
  const r=exercise("provision");
  assert.equal(r.status,2);
  assert.match(r.stderr,/provision requires/);
  assert.doesNotMatch(r.calls,/service-accounts create|queues create|queues pause/);
});
test("provision refuses existing production queue rather than changing its state",()=>{
  const r=exercise("provision",{
    EXAMTREE_QS_PROD_INFRA_PROVISION_APPROVED:"yes",
    EXAMTREE_QS_PROD_PAUSED_ONLY_APPROVED:"yes",
  },"RUNNING");
  assert.equal(r.status,2);
  assert.match(r.stderr,/already exists/);
  assert.equal(r.state,"RUNNING");
  assert.doesNotMatch(r.calls,/service-accounts create|queues create|queues pause/);
});
test("explicit approved provision creates only isolated identities and a PAUSED queue",()=>{
  const r=exercise("provision",{
    EXAMTREE_QS_PROD_INFRA_PROVISION_APPROVED:"yes",
    EXAMTREE_QS_PROD_PAUSED_ONLY_APPROVED:"yes",
  });
  assert.equal(r.status,0,r.stderr);
  assert.equal(r.state,"PAUSED");
  assert.match(r.calls,/service-accounts create examtree-qs-dispatch-prod/);
  assert.match(r.calls,/service-accounts create examtree-qs-task-prod/);
  assert.match(r.calls,/queues create examtree-qs-prod/);
  assert.match(r.calls,/--max-concurrent-dispatches=1/);
  assert.match(r.calls,/--max-attempts=3/);
  assert.match(r.calls,/queues pause examtree-qs-prod/);
  assert.doesNotMatch(r.calls,/(?:run deploy|run jobs|scheduler|add-iam-policy-binding|secrets|sql|migrate|resume)/);
});
test("no implicit production execution or activation is coded into bootstrap",()=>{
  assert.match(body,/MODE="\\$\\{MODE:-check\\}"/);
  assert.match(body,/EXAMTREE_QS_PROD_INFRA_PROVISION_APPROVED/);
  assert.match(body,/EXAMTREE_QS_PROD_PAUSED_ONLY_APPROVED/);
  assert.doesNotMatch(body,/gcloud (?:run|scheduler|sql)/);
  assert.doesNotMatch(body,/gcloud tasks queues resume/);
});

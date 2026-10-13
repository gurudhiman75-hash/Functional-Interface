import assert from "node:assert/strict";
import {
  decideQuestionStudioTaskLease, QUESTION_STUDIO_TASK_LEASE_SECONDS,
  QUESTION_STUDIO_TASK_MAX_ATTEMPTS,
} from "./async-task-lease-policy";

const base={
  status:"queued",
  queueVersion:1,
  priorAttempts:0,
  existingLeaseIsActive:false,
  deadlineExpired:false,
};
assert.equal(QUESTION_STUDIO_TASK_LEASE_SECONDS,240);
assert.equal(QUESTION_STUDIO_TASK_MAX_ATTEMPTS,3);
assert.equal(decideQuestionStudioTaskLease(base),"claim");
assert.equal(decideQuestionStudioTaskLease({...base,status:"running",priorAttempts:1}),"claim");
assert.equal(decideQuestionStudioTaskLease({...base,existingLeaseIsActive:true}),"busy");
assert.equal(decideQuestionStudioTaskLease({...base,status:"running",priorAttempts:1,existingLeaseIsActive:true}),"busy");
assert.equal(decideQuestionStudioTaskLease({...base,priorAttempts:2}),"claim");
assert.equal(decideQuestionStudioTaskLease({...base,priorAttempts:3}),"exhausted");
assert.equal(decideQuestionStudioTaskLease({...base,priorAttempts:4}),"exhausted");
assert.equal(decideQuestionStudioTaskLease({...base,priorAttempts:-1}),"exhausted");
assert.equal(decideQuestionStudioTaskLease({...base,priorAttempts:NaN}),"exhausted");
assert.equal(decideQuestionStudioTaskLease({...base,deadlineExpired:true}),"exhausted");
assert.equal(decideQuestionStudioTaskLease({...base,status:"validation"}),"busy");
assert.equal(decideQuestionStudioTaskLease({...base,status:"paused"}),"busy");
assert.equal(decideQuestionStudioTaskLease({...base,status:"draft"}),"invalid");
assert.equal(decideQuestionStudioTaskLease({...base,queueVersion:2}),"invalid");
assert.equal(decideQuestionStudioTaskLease({...base,queueVersion:undefined}),"invalid");
for(const status of ["cancelled","failed","review","approved","partially_approved"]){
  assert.equal(decideQuestionStudioTaskLease({...base,status}),"terminal");
}
console.log("PASS: lease claim, retry, timeout, stale-owner and all terminal run-state outcomes");

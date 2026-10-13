// Pure task-claim state model: Cloud Tasks is at-least-once, not exactly-once.
export const QUESTION_STUDIO_TASK_MAX_ATTEMPTS = 3;
export const QUESTION_STUDIO_TASK_LEASE_SECONDS = 240;

export type TaskLeaseDecision = "claim" | "busy" | "terminal" | "exhausted" | "invalid";

export function decideQuestionStudioTaskLease(input:{
  status:string;
  queueVersion:unknown;
  priorAttempts:number;
  existingLeaseIsActive:boolean;
  deadlineExpired:boolean;
}):TaskLeaseDecision {
  const {status,queueVersion,priorAttempts,existingLeaseIsActive,deadlineExpired}=input;
  if(queueVersion!==1)return "invalid";
  if(["cancelled","failed","review","approved","partially_approved"].includes(status))return "terminal";
  if(["validation","paused"].includes(status))return "busy";
  if(!["queued","running"].includes(status))return "invalid";
  if(existingLeaseIsActive)return "busy";
  if(!Number.isSafeInteger(priorAttempts)||priorAttempts<0||priorAttempts>=QUESTION_STUDIO_TASK_MAX_ATTEMPTS||
      deadlineExpired)return "exhausted";
  return "claim";
}

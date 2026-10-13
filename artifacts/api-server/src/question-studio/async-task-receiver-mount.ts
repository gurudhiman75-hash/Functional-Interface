// Mount the signed Cloud Tasks receiver at the parent Express path so that
// its own Router.post("/async-task") is reachable. A route-level app.post()
// mount leaves req.url untrimmed and silently produces 404.
import express, {type Express,type RequestHandler} from "express";

export const QUESTION_STUDIO_ASYNC_TASK_PATH="/internal/question-studio/async-task";
const PARENT_PATH="/internal/question-studio";
const CHILD_PATH="/async-task";

const REQUIRED_STAGE_FLAGS=[
  "EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED",
  "EXAMTREE_QUESTION_STUDIO_ASYNC_OUTBOX_ENABLED",
  "EXAMTREE_QUESTION_STUDIO_TASK_RECEIVER_VERIFIED",
  "EXAMTREE_QUESTION_STUDIO_TASK_CLAIM_ENABLED",
  "EXAMTREE_QUESTION_STUDIO_TASK_REVIEW_COMMIT_ENABLED",
  "EXAMTREE_QUESTION_STUDIO_TASK_RECEIVER_ROUTE_ENABLED",
  "EXAMTREE_QUESTION_STUDIO_STAGING_TASK_ACCEPTANCE_APPROVED",
] as const;

function isStagingTaskReceiverEnabled(env:NodeJS.ProcessEnv):boolean {
  return env.EXAMTREE_API_RUNTIME==="cloud-run" &&
    env.EXAMTREE_API_STAGING==="true" &&
    REQUIRED_STAGE_FLAGS.every((flag)=>env[flag]==="true");
}

export function mountQuestionStudioAsyncTaskReceiver(
  app:Express,
  taskHandler:RequestHandler,
  env:NodeJS.ProcessEnv=process.env,
):void {
  // Only this exact method + child path is handled. Other internal routes
  // must retain their own auth and routing rather than inheriting this gate.
  app.use(PARENT_PATH,(req,res,next)=>{
    if(req.method!=="POST"||req.path!==CHILD_PATH) {
      next();return;
    }
    if(!isStagingTaskReceiverEnabled(env)) {
      res.setHeader("Cache-Control","no-store");
      res.status(503).json({code:"QUESTION_STUDIO_ASYNC_RECEIVER_DISABLED"});
      return;
    }
    next();
  },express.json({limit:"2kb"}),(req,res,next)=>{
    if(req.method!=="POST"||req.path!==CHILD_PATH) {
      next();return;
    }
    taskHandler(req,res,next);
  });
}

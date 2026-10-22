// Build-only reviewed enqueue entrypoint. Not the existing Cloud Run Job command.
// A separate production deployment approval is required to select this command.
import {enqueueOneProductionReview} from "./prod-reviewed-enqueue-transaction";
const env=process.env;
if(env.EXAMTREE_QS_PRODUCTION_REVIEW_JOB_EXECUTE_APPROVED!=="true" ||
   env.EXAMTREE_QS_PRODUCTION_REVIEW_SCOPE_APPROVED!=="true" ||
   env.CLOUD_RUN_JOB!=="examtree-qs-prod-one-run-enqueue" ||
   env.CLOUD_RUN_TASK_COUNT!=="1" ||
   env.CLOUD_RUN_TASK_INDEX!=="0" ||
   env.CLOUD_RUN_TASK_ATTEMPT!=="0") {
  console.error("STOP: QS_PRODUCTION_REVIEW_JOB_NOT_AUTHORIZED");
  process.exitCode=2;
} else {
  enqueueOneProductionReview().catch(error=>{
    const code=error instanceof Error ? error.message : "unknown";
    console.error("STOP: QS_PRODUCTION_REVIEW_ENQUEUE_FAILED",{
      code:code.startsWith("QS_PROD_")?code:"REDACTED"
    });
    process.exitCode=2;
  });
}

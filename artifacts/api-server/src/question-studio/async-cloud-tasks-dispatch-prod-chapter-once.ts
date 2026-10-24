// One exact-run production chapter review event -> dedicated Cloud Tasks queue.
// Never imported by the ordinary production/staging publisher or the API.
// Defaults to deny; zero scheduler, queue, IAM, traffic or DB migrations here.
import {runQuestionStudioTaskDispatchOnce} from "./async-cloud-tasks-dispatcher";
import {getQuestionStudioTaskConfig} from "./async-cloud-tasks-transport";
import {readCanonicalChapterManifest} from "./prod-chapter-review-policy.mjs";
import {assertIsolatedChapterDispatch} from "./prod-chapter-dispatch-policy.mjs";
import {sqlClient} from "../lib/db";

async function main():Promise<void> {
  const runId=assertIsolatedChapterDispatch(process.env,
    getQuestionStudioTaskConfig(),readCanonicalChapterManifest());
  const handled=await runQuestionStudioTaskDispatchOnce({chapterReviewRunId:runId});
  console.info(handled?"QS_CHAPTER_OUTBOX_EVENT_HANDLED":"QS_CHAPTER_OUTBOX_EMPTY");
}

main().catch(error=>{
  const code=error && typeof error==="object" && "code" in error
    ?String(error.code).slice(0,60):"QS_CHAPTER_DISPATCH_FAILED";
  console.error("QS_CHAPTER_DISPATCH_FAILED",{code});
  process.exitCode=1;
}).finally(async()=>{await sqlClient.end();});

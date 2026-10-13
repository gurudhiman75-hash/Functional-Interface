// Atomic, fencing-token-checked Question Studio review save for a FUTURE
// Google OIDC-authenticated task receiver. This service is NOT mounted,
// scheduled, or invoked by app.ts, Cloud Tasks dispatcher, or current Generate.
// No content.questions/student question bank writes or automatic publication.
import { randomUUID } from "node:crypto";
import { sqlClient } from "../lib/db";
import { listQuestionStudioPackages } from "./engine-registry";
import { validateUniversalStudioComputeInput,
         type UniversalStudioComputeResult } from "./universal-executor";
import { validateQuestionStudioAsyncReviewBatch,
         QuestionStudioReviewCommitError } from "./async-review-commit-contract";

const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type AsyncReviewCommitReceipt = {
  runId:string;publicCode:string;status:"review"|"already_committed";itemCount:number;
};

function sourcePackageLifecycle(packageId:string) {
  const pkg=listQuestionStudioPackages().find(x=>x.packageId===packageId && x.enabled);
  if(!pkg) throw new QuestionStudioReviewCommitError("ASYNC_PACKAGE_UNAVAILABLE","Queued Question Studio package is no longer available");
  // Same package-governed envelope as synchronous Question Studio. A worker
  // cannot self-promote its generated payload by injecting lifecycle fields.
  return Object.fromEntries(Object.entries({
    lifecycleId:pkg.lifecycleId,
    lifecycleStage:pkg.lifecycleStage,
    reviewSurfaceRequired:pkg.reviewSurfaceRequired,
    manualApprovalRequired:pkg.manualApprovalRequired,
    questionBankStatus:pkg.questionBankStatus,
    questionBankWritable:pkg.questionBankWritable,
    questionBankAcceptanceMode:pkg.questionBankAcceptanceMode,
    questionBankAcceptanceAuthority:pkg.questionBankAcceptanceAuthority,
    testEligibility:pkg.testEligibility,
    testEligible:pkg.testEligible,
    mockTestEligible:pkg.mockTestEligible,
    publiclyPublishable:pkg.publiclyPublishable,
    automaticStudentPublication:pkg.automaticStudentPublication,
    productionReleaseAuthorized:pkg.productionReleaseAuthorized,
  }).filter(([,v])=>v!==undefined));
}

export async function commitQuestionStudioAsyncReview(input:{
  runId:string;leaseToken:string;batch:UniversalStudioComputeResult;
}):Promise<AsyncReviewCommitReceipt> {
  if(process.env.EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED!=="true" ||
     process.env.EXAMTREE_QUESTION_STUDIO_TASK_RECEIVER_VERIFIED!=="true" ||
     process.env.EXAMTREE_QUESTION_STUDIO_TASK_REVIEW_COMMIT_ENABLED!=="true"){
    throw new QuestionStudioReviewCommitError("ASYNC_REVIEW_COMMIT_DISABLED","Asynchronous review persistence is not enabled");
  }
  if(!UUID.test(input.runId)||!UUID.test(input.leaseToken)){
    throw new QuestionStudioReviewCommitError("ASYNC_REVIEW_CLAIM_INVALID","Invalid run or claim token");
  }
  return sqlClient.begin(async(tx)=>{
    // Lock the same canonical run row first as the claim helper does. All
    // subsequent ownership checks, inserts and status updates happen inside
    // this single transaction, so crash means complete rollback.
    const runs=await tx`
      SELECT id::text AS id, public_code AS "publicCode",
             requested_by AS "requestedBy",
             status::text AS status, request_snapshot AS "requestSnapshot"
      FROM content.generation_runs
      WHERE id=${input.runId}::uuid
      FOR UPDATE
    `;
    const run=runs[0];
    if(!run)throw new QuestionStudioReviewCommitError("ASYNC_RUN_NOT_FOUND","Generation run was not found");

    const canonical=validateQuestionStudioAsyncReviewBatch(run.requestSnapshot,input.batch);
    validateUniversalStudioComputeInput(canonical);
    const count=canonical.count;
    const status=String(run.status);
    if(["review","partially_approved","approved"].includes(status)){
      const counts=await tx`
        SELECT
          (SELECT COUNT(*)::integer
           FROM content.generation_run_items i
           WHERE i.generation_run_id=${input.runId}::uuid) AS "itemCount",
          (SELECT COUNT(*)::integer
           FROM content.generation_run_items i
           JOIN content.generation_item_versions v ON v.generation_item_id=i.id
           WHERE i.generation_run_id=${input.runId}::uuid AND v.version_number=1) AS "initialVersionCount"
      `;
      if(Number(counts[0]?.itemCount)!==count ||
         Number(counts[0]?.initialVersionCount)!==count){
        throw new QuestionStudioReviewCommitError("ASYNC_REVIEW_STATE_INCOMPLETE","Existing review contains an incomplete initial batch");
      }
      return {runId:input.runId,publicCode:String(run.publicCode),
              status:"already_committed" as const,itemCount:count};
    }
    if(status!=="running"){
      throw new QuestionStudioReviewCommitError("ASYNC_REVIEW_RUN_NOT_ACTIVE","Run is not in the claimed generation state");
    }
    const leaseRows=await tx`
      SELECT lease_token::text AS "leaseToken",
             (lease_expires_at > now() AND completed_at IS NULL) AS active
      FROM content.generation_run_task_leases
      WHERE generation_run_id=${input.runId}::uuid
      FOR UPDATE
    `;
    if(!leaseRows[0] || leaseRows[0].leaseToken!==input.leaseToken ||
       leaseRows[0].active!==true){
      throw new QuestionStudioReviewCommitError("ASYNC_REVIEW_STALE_LEASE","Generation task has lost its lease");
    }

    const lifecycle=sourcePackageLifecycle(String(canonical.request.packageId));
    for(let index=0;index<input.batch.questions.length;index++){
      const question=input.batch.questions[index]!;
      const itemId=randomUUID();
      const payload={
        ...question,
        ...lifecycle,
        generationContexts:input.batch.generationContexts,
        validationResult:"pending",
      };
      await tx`
        INSERT INTO content.generation_run_items (
          id,generation_run_id,item_number,status,current_version_number,
          created_at,updated_at
        ) VALUES (
          ${itemId}::uuid,${input.runId}::uuid,${index+1},
          'unreviewed'::generation_item_status,1,now(),now()
        )
      `;
      await tx`
        INSERT INTO content.generation_item_versions (
          id,generation_item_id,version_number,payload,provider_item_id,created_at
        ) VALUES (
          ${randomUUID()}::uuid,${itemId}::uuid,1,${JSON.stringify(payload)},
          ${typeof question.questionId==="string"?question.questionId:null},now()
        )
      `;
    }
    await tx`
      UPDATE content.generation_runs
      SET status='review'::generation_run_status,
          completed_at=now(),failure_reason=NULL,updated_at=now()
      WHERE id=${input.runId}::uuid AND status='running'
    `;
    await tx`
      UPDATE content.generation_run_task_leases
      SET completed_at=now()
      WHERE generation_run_id=${input.runId}::uuid AND lease_token=${input.leaseToken}::uuid
    `;
    await tx`
      INSERT INTO platform.audit_events (
        id,actor_type,actor_user_id,action_key,entity_type,entity_id,
        reason,summary,metadata
      ) VALUES (
        ${randomUUID()}::uuid,'user'::audit_actor_type,${run.requestedBy??null}::uuid,
        'question_studio.generation_run.generated_async','generation_run',${input.runId}::uuid,
        'Task receiver saved an approved-for-review deterministic generation batch',
        ${`Generated ${count} ${canonical.request.engineId} review candidates in ${run.publicCode}`},
        ${JSON.stringify({runId:input.runId,packageId:canonical.request.packageId,engineId:canonical.request.engineId,itemCount:count,queueVersion:1})}
      )
    `;
    await tx`
      INSERT INTO platform.outbox_events (
        id,aggregate_type,aggregate_id,event_type,payload
      ) VALUES (
        ${randomUUID()}::uuid,'generation_run',${input.runId}::uuid,
        'question_studio.generation_run.created',
        ${JSON.stringify({runId:input.runId,publicCode:String(run.publicCode),itemCount:count,
                           engineId:canonical.request.engineId})}
      )
    `;
    return {runId:input.runId,publicCode:String(run.publicCode),
            status:"review" as const,itemCount:count};
  });
}

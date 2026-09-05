import { randomUUID } from "node:crypto";

import { sqlClient } from "../lib/db";
import { processSelectedCurrentAffairs } from "./selected-affairs-processing-runtime";
import { recoverSelectedPrimaryEvidence } from "./selected-primary-recovery-runtime";
import { recoverSelectedBlockerFacts } from "./selected-blocker-closure-runtime";
import { finalizeSelectedBlockerClosure } from "./selected-blocker-closure-finalizer";

export type SelectedAffairsProcessingRunStatus = "queued" | "running" | "completed" | "failed";

export type SelectedAffairsProcessingRun = {
  runId: string;
  targetDate: string;
  status: SelectedAffairsProcessingRunStatus;
  stage: string;
  failure: string | null;
  startedAt: string | null;
  completedAt: string | null;
  updatedAt: string;
  result: Record<string, unknown> | null;
};

const STALE_HEARTBEAT_MINUTES = 2;

function safeError(error: unknown) {
  return (error instanceof Error ? error.message : "Unknown selected Current Affairs processing failure").slice(0, 4000);
}

function mapRun(row: any): SelectedAffairsProcessingRun {
  return {
    runId: String(row.runId),
    targetDate: String(row.targetDate),
    status: String(row.status) as SelectedAffairsProcessingRunStatus,
    stage: String(row.stage ?? "queued"),
    failure: row.failure ? String(row.failure) : null,
    startedAt: row.startedAt ? String(row.startedAt) : null,
    completedAt: row.completedAt ? String(row.completedAt) : null,
    updatedAt: String(row.updatedAt),
    result: row.result && typeof row.result === "object" ? row.result as Record<string, unknown> : null,
  };
}

async function readRun(runId: string) {
  const rows = await sqlClient`
    SELECT
      id::text AS "runId",
      target_date::text AS "targetDate",
      status,
      stage,
      failure,
      started_at::text AS "startedAt",
      completed_at::text AS "completedAt",
      updated_at::text AS "updatedAt",
      result
    FROM content.current_affairs_selected_processing_runs
    WHERE id=${runId}::uuid
    LIMIT 1
  `;
  return rows[0] ? mapRun(rows[0]) : null;
}

async function readActiveRun(targetDate: string) {
  const rows = await sqlClient`
    SELECT
      id::text AS "runId",
      target_date::text AS "targetDate",
      status,
      stage,
      failure,
      started_at::text AS "startedAt",
      completed_at::text AS "completedAt",
      updated_at::text AS "updatedAt",
      result
    FROM content.current_affairs_selected_processing_runs
    WHERE target_date=${targetDate}::date
      AND status IN ('queued', 'running')
    ORDER BY created_at DESC
    LIMIT 1
  `;
  return rows[0] ? mapRun(rows[0]) : null;
}

async function failStaleRun(runId: string) {
  await sqlClient`
    UPDATE content.current_affairs_selected_processing_runs
    SET status='failed',
        stage='worker_interrupted',
        failure=COALESCE(failure, 'The background processor stopped responding. Retrying this date is safe.'),
        completed_at=COALESCE(completed_at, now()),
        updated_at=now()
    WHERE id=${runId}::uuid
      AND status IN ('queued', 'running')
      AND heartbeat_at < now() - (${STALE_HEARTBEAT_MINUTES}::text || ' minutes')::interval
  `;
}

async function failStaleRunsForDate(targetDate: string) {
  await sqlClient`
    UPDATE content.current_affairs_selected_processing_runs
    SET status='failed',
        stage='worker_interrupted',
        failure=COALESCE(failure, 'The background processor stopped responding. Retrying this date is safe.'),
        completed_at=COALESCE(completed_at, now()),
        updated_at=now()
    WHERE target_date=${targetDate}::date
      AND status IN ('queued', 'running')
      AND heartbeat_at < now() - (${STALE_HEARTBEAT_MINUTES}::text || ' minutes')::interval
  `;
}

async function touchRun(runId: string) {
  await sqlClient`
    UPDATE content.current_affairs_selected_processing_runs
    SET heartbeat_at=now(), updated_at=now()
    WHERE id=${runId}::uuid AND status='running'
  `;
}

async function setStage(runId: string, stage: string) {
  await sqlClient`
    UPDATE content.current_affairs_selected_processing_runs
    SET stage=${stage}, heartbeat_at=now(), updated_at=now()
    WHERE id=${runId}::uuid AND status='running'
  `;
}

function slimProcessingResult(result: any, selectedPrimaryRecovery: any, blockerRecovery: any) {
  return {
    processingVersion: result?.processingVersion,
    targetDate: result?.targetDate,
    startedAt: result?.startedAt,
    completedAt: result?.completedAt,
    selectedHeadlineCount: Number(result?.selectedHeadlineCount ?? 0),
    selectedEventCount: Number(result?.selectedEventCount ?? 0),
    missingEventCandidateIds: Array.isArray(result?.missingEventCandidateIds) ? result.missingEventCandidateIds : [],
    summary: result?.summary ?? { selected: 0, verified: 0, ready: 0, blocked: 0 },
    items: Array.isArray(result?.items) ? result.items : [],
    packPreviewScope: result?.packPreviewScope,
    packPreviewNote: result?.packPreviewNote,
    blockerClosure: result?.blockerClosure ?? {
      closureVersion: blockerRecovery?.closureVersion,
      insertedFactCount: Number(blockerRecovery?.insertedFactCount ?? 0),
    },
    canonicalApprovalAuthority: false,
    publicationAuthority: false,
    questionBankPromotionAuthority: false,
    selectedPrimaryRecovery: {
      recoveryVersion: selectedPrimaryRecovery?.recoveryVersion,
      candidatesExamined: Number(selectedPrimaryRecovery?.candidatesExamined ?? 0),
      protectedCount: Number(selectedPrimaryRecovery?.protectedCount ?? 0),
      headlineClaimsRefreshed: Number(selectedPrimaryRecovery?.headlineClaimsRefreshed ?? 0),
      pageMatches: Number(selectedPrimaryRecovery?.pageMatches ?? 0),
      pageFactsExtracted: Number(selectedPrimaryRecovery?.pageFactsExtracted ?? 0),
      pageFactsInserted: Number(selectedPrimaryRecovery?.pageFactsInserted ?? 0),
      verificationAuthority: false,
      publicationAuthority: false,
    },
    selectedBlockerRecovery: {
      closureVersion: blockerRecovery?.closureVersion,
      candidatesExamined: Number(blockerRecovery?.candidatesExamined ?? 0),
      insertedFactCount: Number(blockerRecovery?.insertedFactCount ?? 0),
      repairedMalformedClaimCount: Number(blockerRecovery?.repairedMalformedClaimCount ?? 0),
      automaticPublicationAuthority: false,
    },
  };
}

async function runSelectedAffairsProcessingJob(runId: string) {
  const claimed = await sqlClient`
    UPDATE content.current_affairs_selected_processing_runs
    SET status='running',
        stage='primary_recovery',
        started_at=COALESCE(started_at, now()),
        heartbeat_at=now(),
        updated_at=now()
    WHERE id=${runId}::uuid AND status='queued'
    RETURNING target_date::text AS "targetDate", requested_by::text AS "requestedBy"
  `;
  if (!claimed[0]) return;

  const targetDate = String(claimed[0].targetDate);
  const actorUserId = String(claimed[0].requestedBy);
  const heartbeat = setInterval(() => {
    void touchRun(runId).catch((error) => console.error("Unable to heartbeat selected Current Affairs processing run", error));
  }, 15_000);
  heartbeat.unref();

  try {
    const selectedPrimaryRecovery = await recoverSelectedPrimaryEvidence({ targetDate, actorUserId });
    await setStage(runId, "blocker_closure_recovery");
    const blockerRecovery = await recoverSelectedBlockerFacts({ targetDate, actorUserId });
    await setStage(runId, "verification_authoring_localization");
    const result = await processSelectedCurrentAffairs({ targetDate, actorUserId });
    await setStage(runId, "blocker_closure_finalize");
    const finalized = await finalizeSelectedBlockerClosure({
      targetDate,
      actorUserId,
      baseResult: result as Record<string, any>,
    });
    await setStage(runId, "persisting_result");
    const persistedResult = slimProcessingResult(finalized, selectedPrimaryRecovery, blockerRecovery);
    await sqlClient`
      UPDATE content.current_affairs_selected_processing_runs
      SET status='completed',
          stage='completed',
          result=${JSON.stringify(persistedResult)}::jsonb,
          failure=NULL,
          completed_at=now(),
          heartbeat_at=now(),
          updated_at=now()
      WHERE id=${runId}::uuid
    `;
  } catch (error) {
    const failure = safeError(error);
    console.error("Selected Current Affairs background processing failed", { runId, targetDate, failure, error });
    await sqlClient`
      UPDATE content.current_affairs_selected_processing_runs
      SET status='failed',
          stage='failed',
          failure=${failure},
          completed_at=now(),
          heartbeat_at=now(),
          updated_at=now()
      WHERE id=${runId}::uuid
    `;
  } finally {
    clearInterval(heartbeat);
  }
}

function scheduleRun(runId: string) {
  setImmediate(() => {
    void runSelectedAffairsProcessingJob(runId).catch((error) => {
      console.error("Unable to start selected Current Affairs background processor", { runId, error });
    });
  });
}

export async function startSelectedAffairsProcessingRun(args: {
  targetDate: string;
  actorUserId: string;
}) {
  await failStaleRunsForDate(args.targetDate);
  const active = await readActiveRun(args.targetDate);
  if (active) {
    if (active.status === "queued") scheduleRun(active.runId);
    return { ...active, reused: true };
  }

  const runId = randomUUID();
  try {
    await sqlClient`
      INSERT INTO content.current_affairs_selected_processing_runs (
        id, target_date, requested_by, status, stage,
        heartbeat_at, created_at, updated_at
      ) VALUES (
        ${runId}::uuid, ${args.targetDate}::date, ${args.actorUserId}::uuid,
        'queued', 'queued', now(), now(), now()
      )
    `;
  } catch (error) {
    const concurrent = await readActiveRun(args.targetDate);
    if (concurrent) {
      if (concurrent.status === "queued") scheduleRun(concurrent.runId);
      return { ...concurrent, reused: true };
    }
    throw error;
  }

  scheduleRun(runId);
  const created = await readRun(runId);
  if (!created) throw new Error("Selected Current Affairs processing run could not be created.");
  return { ...created, reused: false };
}

export async function getSelectedAffairsProcessingRun(runId: string) {
  await failStaleRun(runId);
  return readRun(runId);
}

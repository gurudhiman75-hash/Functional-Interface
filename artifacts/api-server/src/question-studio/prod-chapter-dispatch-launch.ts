// Start the existing exact-run dispatcher, never update its configuration.
// Only the run UUID is overridden; the job owns queue, scope, expiry and rollback gates.
import {productionChapterReleaseActive} from "./prod-chapter-review-policy.mjs";
import type {QueuedGenerationReceipt} from "./async-enqueue-foundation";

export const CHAPTER_DISPATCH_JOB =
  "projects/sarbedutech/locations/asia-south1/jobs/examtree-qs-chapter-dispatch-prod";
const TOKEN_URL = "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

export class ChapterDispatchLaunchError extends Error {
  readonly code: string;
  constructor(code: string) { super(code); this.code = code; }
}

export function assertChapterDispatchLaunchApproved(env = process.env) {
  if (!productionChapterReleaseActive(env) ||
      env.EXAMTREE_QS_PRODUCTION_CHAPTER_REVIEW_ROUTE_APPROVED !== "true" ||
      env.EXAMTREE_QS_PRODUCTION_CHAPTER_DISPATCH_LAUNCH_APPROVED !== "true" ||
      env.EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED !== "true" ||
      env.EXAMTREE_QUESTION_STUDIO_ASYNC_OUTBOX_ENABLED !== "true") {
    throw new ChapterDispatchLaunchError("QS_CHAPTER_DISPATCH_LAUNCH_DISABLED");
  }
}

export async function launchProductionChapterDispatch(
  runId: string,
  {env = process.env, request = fetch}: {env?: NodeJS.ProcessEnv; request?: typeof fetch} = {},
) {
  assertChapterDispatchLaunchApproved(env);
  if (!UUID.test(runId)) throw new ChapterDispatchLaunchError("QS_CHAPTER_DISPATCH_RUN_ID_INVALID");
  const signal = AbortSignal.timeout(12_000);
  try {
    const credentials = await request(TOKEN_URL, {
      headers: {"Metadata-Flavor": "Google"}, signal, redirect: "error",
    });
    if (!credentials.ok) throw new Error("metadata unavailable");
    const payload = await credentials.json() as {access_token?: unknown};
    if (typeof payload.access_token !== "string" || payload.access_token.length < 32)
      throw new Error("metadata token unavailable");
    // Recheck expiry after obtaining credentials, before starting any execution.
    assertChapterDispatchLaunchApproved(env);
    const response = await request(`https://run.googleapis.com/v2/${CHAPTER_DISPATCH_JOB}:run`, {
      method: "POST", signal, redirect: "error",
      headers: {Authorization: `Bearer ${payload.access_token}`, "Content-Type": "application/json"},
      body: JSON.stringify({overrides: {containerOverrides: [{env: [{
        name: "EXAMTREE_QS_PRODUCTION_CHAPTER_DISPATCH_RUN_ID", value: runId,
      }]}]}}),
    });
    if (!response.ok) throw new Error("job execution unavailable");
    const operation = await response.json() as {name?: unknown; error?: unknown};
    if (operation.error || typeof operation.name !== "string" || !/^projects\/(?:sarbedutech|1083299267005)\/locations\/asia-south1\/operations\/[^/]+$/.test(
      operation.name)) throw new Error("invalid operation");
  } catch (error) {
    if (error instanceof ChapterDispatchLaunchError) throw error;
    // Never surface tokens or provider response bodies to clients/logs.
    throw new ChapterDispatchLaunchError("QS_CHAPTER_DISPATCH_LAUNCH_UNAVAILABLE");
  }
}

export async function enqueueAndDispatchChapter(
  enqueue: () => Promise<QueuedGenerationReceipt>,
  launch: (runId: string) => Promise<void> = launchProductionChapterDispatch,
) {
  const receipt = await enqueue(); // Transaction must commit before the job can read it.
  if (receipt.status !== "queued") return {...receipt, dispatchRequested: false};
  try {
    await launch(receipt.id);
    return {...receipt, dispatchRequested: true};
  } catch {
    // Return the durable receipt even if the acknowledgement was lost. The
    // cockpit can save a resume link and retry this run without a new enqueue.
    return {...receipt, dispatchRequested: false};
  }
}

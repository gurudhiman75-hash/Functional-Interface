import { sqlClient } from "./db";
import { logger } from "./logger";

const POLL_INTERVAL_MS = Math.max(1000, Number(process.env.OUTBOX_POLL_INTERVAL_MS ?? "") || 5000);
const BATCH_SIZE = Math.min(100, Math.max(1, Number(process.env.OUTBOX_BATCH_SIZE ?? "") || 25));
let started = false;
let running = false;

type ClaimedEvent = {
  id: string;
  eventType: string;
  aggregateType: string;
  aggregateId: string;
  payload: unknown;
};

// The outbox is the durable integration boundary. At present these events have
// no external broker-specific side effect; publishing means the durable event
// has been observed by the runtime. Future handlers can be added here without
// changing the transaction that creates the event.
async function dispatch(event: ClaimedEvent): Promise<void> {
  logger.info({ outboxEventId: event.id, eventType: event.eventType, aggregateType: event.aggregateType, aggregateId: event.aggregateId }, "Outbox event published");
}

// Process a single event within the SAME transaction that holds its row lock.
// The previous implementation released the SELECT FOR UPDATE SKIP LOCKED claim
// before dispatch/markPublished; two workers could then process one event.
// Today's dispatch is a durable log only. If external side effects are added,
// require per-destination idempotency: a DB lock alone cannot provide exactly
// once delivery to an outside provider after a process crash.
async function publishOneLocked(): Promise<boolean> {
  return sqlClient.begin(async (tx) => {
    const rows = await tx`
      SELECT id::text AS id,
             event_type AS "eventType",
             aggregate_type AS "aggregateType",
             aggregate_id::text AS "aggregateId",
             payload
      FROM platform.outbox_events
      WHERE published_at IS NULL
        AND available_at <= now()
        -- Cloud Tasks events must NEVER be acked by the legacy log-only
        -- publisher. They are reserved for the dedicated authenticated
        -- Question Studio task dispatcher, which alone may ack after
        -- successful or idempotently confirmed Cloud Tasks delivery.
        AND event_type <> 'question_studio.generation_run.queued.v1'
        AND event_type <> 'question_studio.generation_run.chapter_review_queued.v1'
      ORDER BY available_at ASC, occurred_at ASC
      LIMIT 1
      FOR UPDATE SKIP LOCKED
    `;
    if (!rows[0]) return false;
    const event = rows[0] as unknown as ClaimedEvent;
    await tx`
      UPDATE platform.outbox_events
      SET attempts = attempts + 1
      WHERE id = ${event.id}::uuid AND published_at IS NULL
    `;
    try {
      await dispatch(event);
      await tx`
        UPDATE platform.outbox_events
        SET published_at = now(), last_error = NULL
        WHERE id = ${event.id}::uuid AND published_at IS NULL
      `;
    } catch (error) {
      const message = (error instanceof Error ? error.message : String(error)).slice(0, 2000);
      logger.error({ error, outboxEventId: event.id, eventType: event.eventType }, "Outbox event publish failed");
      await tx`
        UPDATE platform.outbox_events
        SET last_error = ${message},
            available_at = now() + interval '1 minute'
        WHERE id = ${event.id}::uuid AND published_at IS NULL
      `;
    }
    return true;
  });
}

export async function runOutboxPublisherOnce(): Promise<void> {
  if (running) return;
  running = true;
  try {
    for (let i = 0; i < BATCH_SIZE; i += 1) {
      if (!(await publishOneLocked())) break;
    }
  } catch (error) {
    logger.error({ error }, "Outbox publisher tick failed");
    // A Cloud Run Job must fail visibly for database/publisher failure;
    // the legacy Render timer keeps its established resilience.
    if (process.env.EXAMTREE_API_RUNTIME === "cloud-run") throw error;
  } finally {
    running = false;
  }
}

export function startOutboxPublisher(): void {
  if (started || process.env.OUTBOX_PUBLISHER_ENABLED === "false") return;
  started = true;
  const timer = setInterval(() => void runOutboxPublisherOnce(), POLL_INTERVAL_MS);
  timer.unref();
  void runOutboxPublisherOnce();
  logger.info({ intervalMs: POLL_INTERVAL_MS, batchSize: BATCH_SIZE }, "Outbox publisher started");
}

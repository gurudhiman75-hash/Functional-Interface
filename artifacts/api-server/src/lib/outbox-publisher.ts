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

async function claimBatch(): Promise<ClaimedEvent[]> {
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
      ORDER BY available_at ASC, occurred_at ASC
      LIMIT ${BATCH_SIZE}
      FOR UPDATE SKIP LOCKED
    `;
    if (rows.length === 0) return [];
    await tx`
      UPDATE platform.outbox_events
      SET attempts = attempts + 1
      WHERE id = ANY(${rows.map((row) => String(row.id))}::uuid[])
    `;
    return rows as unknown as ClaimedEvent[];
  });
}

async function markPublished(id: string): Promise<void> {
  await sqlClient`
    UPDATE platform.outbox_events
    SET published_at = now(), last_error = NULL
    WHERE id = ${id}::uuid AND published_at IS NULL
  `;
}

async function markFailed(id: string, error: unknown): Promise<void> {
  const message = (error instanceof Error ? error.message : String(error)).slice(0, 2000);
  await sqlClient`
    UPDATE platform.outbox_events
    SET last_error = ${message},
        available_at = now() + interval '1 minute'
    WHERE id = ${id}::uuid AND published_at IS NULL
  `;
}

export async function runOutboxPublisherOnce(): Promise<void> {
  if (running) return;
  running = true;
  try {
    const events = await claimBatch();
    for (const event of events) {
      try {
        await dispatch(event);
        await markPublished(event.id);
      } catch (error) {
        logger.error({ error, outboxEventId: event.id, eventType: event.eventType }, "Outbox event publish failed");
        await markFailed(event.id, error);
      }
    }
  } catch (error) {
    logger.error({ error }, "Outbox publisher tick failed");
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

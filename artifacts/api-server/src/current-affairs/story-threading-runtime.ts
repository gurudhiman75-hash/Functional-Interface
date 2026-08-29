import { randomUUID } from "node:crypto";

import { sqlClient } from "../lib/db";
import {
  storyThreadSimilarity,
  type StoryEventSignal,
  type StoryFact,
} from "./story-threading";

const THREADING_VERSION = "ca-cp013-story-threading-v1";

type ThreadRepresentative = {
  threadId: string;
  latestEventDate: string;
  latest: StoryEventSignal;
};

function normalizeFacts(value: unknown): StoryFact[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => item && typeof item === "object" && !Array.isArray(item) ? item as Record<string, unknown> : {})
    .map((item) => ({
      key: String(item.key ?? "").trim(),
      value: String(item.value ?? "").trim(),
    }))
    .filter((item) => item.key && item.value);
}

function eventSignal(row: Record<string, unknown>): StoryEventSignal {
  return {
    id: String(row.id),
    title: String(row.title),
    category: String(row.category),
    eventDate: String(row.eventDate).slice(0, 10),
    facts: normalizeFacts(row.facts),
  };
}

function publicThreadCode(date: string) {
  return `CA-ST-${date.replaceAll("-", "")}-${randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()}`;
}

async function loadUnthreadedEvents(limit: number): Promise<StoryEventSignal[]> {
  const rows = await sqlClient`
    SELECT
      event.id::text AS id,
      authoring.learner_title AS title,
      event.category,
      event.event_date::text AS "eventDate",
      COALESCE((
        SELECT json_agg(json_build_object('key', fact.fact_key, 'value', fact.fact_value)
          ORDER BY fact.fact_key, fact.fact_value)
        FROM content.current_affairs_facts fact
        WHERE fact.event_id=event.id AND fact.is_verified=true
      ), '[]'::json) AS facts
    FROM content.current_affairs_events event
    JOIN content.current_affairs_authoring_versions authoring
      ON authoring.id=event.learner_authoring_version_id
      AND authoring.status IN ('ready', 'manual')
    LEFT JOIN content.current_affairs_story_thread_events membership ON membership.event_id=event.id
    WHERE event.status='verified'
      AND event.learner_authoring_status IN ('ready', 'manual')
      AND membership.event_id IS NULL
      AND NOT EXISTS (
        SELECT 1 FROM content.current_affairs_fact_conflicts conflict
        WHERE conflict.event_id=event.id AND conflict.status='open'
      )
    ORDER BY event.event_date ASC, event.created_at ASC
    LIMIT ${limit}
  `;
  return rows.map((row) => eventSignal(row as Record<string, unknown>));
}

async function loadActiveThreadRepresentatives(limit: number): Promise<ThreadRepresentative[]> {
  const rows = await sqlClient`
    SELECT
      thread.id::text AS "threadId",
      thread.latest_on::text AS "latestEventDate",
      event.id::text AS id,
      authoring.learner_title AS title,
      event.category,
      event.event_date::text AS "eventDate",
      COALESCE((
        SELECT json_agg(json_build_object('key', fact.fact_key, 'value', fact.fact_value)
          ORDER BY fact.fact_key, fact.fact_value)
        FROM content.current_affairs_facts fact
        WHERE fact.event_id=event.id AND fact.is_verified=true
      ), '[]'::json) AS facts
    FROM content.current_affairs_story_threads thread
    JOIN content.current_affairs_events event ON event.id=thread.latest_event_id
    JOIN content.current_affairs_authoring_versions authoring
      ON authoring.id=event.learner_authoring_version_id
    WHERE thread.status='active'
      AND event.status='verified'
      AND event.learner_authoring_status IN ('ready', 'manual')
    ORDER BY thread.latest_on DESC, thread.updated_at DESC
    LIMIT ${limit}
  `;
  return rows.map((row) => ({
    threadId: String(row.threadId),
    latestEventDate: String(row.latestEventDate).slice(0, 10),
    latest: eventSignal(row as Record<string, unknown>),
  }));
}

async function createThread(event: StoryEventSignal): Promise<ThreadRepresentative> {
  const threadId = randomUUID();
  await sqlClient.begin(async (tx) => {
    await tx`
      INSERT INTO content.current_affairs_story_threads (
        id, public_code, category, anchor_event_id, latest_event_id,
        anchor_title, started_on, latest_on, status, metadata, created_at, updated_at
      ) VALUES (
        ${threadId}::uuid, ${publicThreadCode(event.eventDate)}, ${event.category},
        ${event.id}::uuid, ${event.id}::uuid, ${event.title}, ${event.eventDate}, ${event.eventDate},
        'active', ${JSON.stringify({ threadingVersion: THREADING_VERSION, autoCreated: true })}::jsonb,
        now(), now()
      )
    `;
    await tx`
      INSERT INTO content.current_affairs_story_thread_events (
        thread_id, event_id, member_role, similarity_score, auto_linked, metadata, created_at
      ) VALUES (
        ${threadId}::uuid, ${event.id}::uuid, 'anchor', 1, true,
        ${JSON.stringify({ threadingVersion: THREADING_VERSION, reason: "thread_anchor" })}::jsonb,
        now()
      )
    `;
  });
  return { threadId, latestEventDate: event.eventDate, latest: event };
}

async function attachToThread(
  thread: ThreadRepresentative,
  event: StoryEventSignal,
  score: number,
  reason: string,
  sharedTitleTokens: string[],
): Promise<ThreadRepresentative> {
  const becomesLatest = event.eventDate >= thread.latestEventDate;
  await sqlClient.begin(async (tx) => {
    await tx`
      INSERT INTO content.current_affairs_story_thread_events (
        thread_id, event_id, member_role, similarity_score, auto_linked, metadata, created_at
      ) VALUES (
        ${thread.threadId}::uuid, ${event.id}::uuid, 'update', ${score}, true,
        ${JSON.stringify({ threadingVersion: THREADING_VERSION, reason, sharedTitleTokens })}::jsonb,
        now()
      )
      ON CONFLICT (event_id) DO NOTHING
    `;
    if (becomesLatest) {
      await tx`
        UPDATE content.current_affairs_story_threads
        SET latest_event_id=${event.id}::uuid,
            latest_on=${event.eventDate},
            metadata=metadata || ${JSON.stringify({ lastAutoLinkScore: score, threadingVersion: THREADING_VERSION })}::jsonb,
            updated_at=now()
        WHERE id=${thread.threadId}::uuid AND status='active'
      `;
    } else {
      await tx`
        UPDATE content.current_affairs_story_threads
        SET started_on=LEAST(started_on, ${event.eventDate}::date), updated_at=now()
        WHERE id=${thread.threadId}::uuid AND status='active'
      `;
    }
  });
  return becomesLatest
    ? { threadId: thread.threadId, latestEventDate: event.eventDate, latest: event }
    : thread;
}

export async function runCurrentAffairsStoryThreading(limit = 300) {
  const safeLimit = Math.max(1, Math.min(1000, Math.floor(limit)));
  const events = await loadUnthreadedEvents(safeLimit);
  const threads = await loadActiveThreadRepresentatives(2500);
  let created = 0;
  let attached = 0;
  const results: Array<Record<string, unknown>> = [];

  for (const event of events) {
    let best: { index: number; score: number; reason: string; sharedTitleTokens: string[] } | null = null;
    for (let i = 0; i < threads.length; i += 1) {
      const decision = storyThreadSimilarity(event, threads[i]!.latest);
      if (!decision.allowed) continue;
      if (!best || decision.score > best.score) {
        best = {
          index: i,
          score: decision.score,
          reason: decision.reason,
          sharedTitleTokens: decision.sharedTitleTokens,
        };
      }
    }

    if (!best) {
      const thread = await createThread(event);
      threads.push(thread);
      created += 1;
      results.push({ eventId: event.id, threadId: thread.threadId, action: "created", score: 1 });
      continue;
    }

    const current = threads[best.index]!;
    const updated = await attachToThread(
      current,
      event,
      best.score,
      best.reason,
      best.sharedTitleTokens,
    );
    threads[best.index] = updated;
    attached += 1;
    results.push({
      eventId: event.id,
      threadId: current.threadId,
      action: "attached",
      score: best.score,
      sharedTitleTokens: best.sharedTitleTokens,
    });
  }

  return {
    examined: events.length,
    created,
    attached,
    results,
  };
}

import { randomUUID } from "node:crypto";

import { sqlClient } from "../lib/db";
import { loadDailyMasterPackApprovalCandidate } from "./daily-master-pack-approval-runtime";
import { evaluateMasterPackPublication } from "./daily-master-pack-publication-policy";

async function loadState(contentDate: string, client: typeof sqlClient) {
  const candidate = await loadDailyMasterPackApprovalCandidate(contentDate, client);
  const approvalId = candidate.activeApproval?.id ?? null;
  const approved = approvalId ? await client`
    SELECT language_code AS language, payload_sha256 AS "payloadSha256",
      learning_resource_id::text AS "learningResourceId"
    FROM content.current_affairs_daily_master_pack_approval_packs
    WHERE approval_id=${approvalId}::uuid
  ` : [];
  const live = approvalId ? await client`
    SELECT id::text AS id, published_at AS "publishedAt"
    FROM content.current_affairs_daily_master_pack_publications
    WHERE approval_id=${approvalId}::uuid AND withdrawn_at IS NULL
    LIMIT 1
  ` : [];
  const publication = live[0]
    ? { id: String(live[0].id), publishedAt: new Date(live[0].publishedAt as string).toISOString() }
    : null;
  const readiness = evaluateMasterPackPublication({
    hasActiveApproval: Boolean(approvalId),
    alreadyPublished: Boolean(publication),
    approved: approved.map((row) => ({ language: String(row.language), payloadSha256: String(row.payloadSha256) })),
    current: candidate.packs.map((pack) => ({ language: pack.language, payloadSha256: pack.payloadSha256 })),
  });
  return {
    approvalId,
    publication,
    readiness,
    resourceIds: approved.map((row) => String(row.learningResourceId)),
  };
}

export async function loadDailyMasterPackPublication(contentDate: string) {
  const { publication, readiness } = await loadState(contentDate, sqlClient);
  return { contentDate, publication, readiness };
}

// Shares the approval lock so approval, revocation and publication cannot interleave.
async function lockDate(contentDate: string, client: typeof sqlClient) {
  await client`SELECT pg_advisory_xact_lock(hashtext(${`examtree.ca.master-pack-approval:${contentDate}`}))`;
}

async function audit(client: typeof sqlClient, args: {
  actorUserId: string; action: string; publicationId: string; reason: string; contentDate: string; resourceIds: string[];
}) {
  await client`
    INSERT INTO platform.audit_events (
      id, actor_type, actor_user_id, action_key, entity_type, entity_id, reason, summary, metadata
    ) VALUES (
      ${randomUUID()}::uuid, 'user'::audit_actor_type, ${args.actorUserId}::uuid,
      ${args.action}, 'current_affairs_master_pack_publication', ${args.publicationId}::uuid,
      ${args.reason}, ${`Daily Current Affairs ${args.contentDate}: ${args.action}`},
      ${JSON.stringify({ contentDate: args.contentDate, resourceIds: args.resourceIds })}::jsonb
    )
  `;
}

export async function publishDailyMasterPack(args: { contentDate: string; actorUserId: string }) {
  return sqlClient.begin(async (tx) => {
    const client = tx as unknown as typeof sqlClient;
    await lockDate(args.contentDate, client);
    const state = await loadState(args.contentDate, client);
    if (!state.readiness.ready || !state.approvalId) {
      throw new Error(`Publication is blocked: ${state.readiness.blockers.join("; ")}`);
    }
    const publicationId = randomUUID();
    await client`
      INSERT INTO content.current_affairs_daily_master_pack_publications (id, approval_id, published_by)
      VALUES (${publicationId}::uuid, ${state.approvalId}::uuid, ${args.actorUserId}::uuid)
    `;
    const published = await client`
      UPDATE content.learning_resources
      SET status='published', published_at=now(), updated_by=${args.actorUserId}::uuid, updated_at=now()
      WHERE id=ANY(${state.resourceIds}::uuid[]) AND status='draft'
      RETURNING id::text AS id
    `;
    if (published.length !== 3) throw new Error("Publication could not release all three language packs together");
    await audit(client, {
      actorUserId: args.actorUserId, action: "current_affairs.master_pack.published", publicationId,
      reason: "Published approved daily pack to learners", contentDate: args.contentDate, resourceIds: state.resourceIds,
    });
    return { contentDate: args.contentDate, publicationId, publishedResourceCount: published.length };
  });
}

export async function withdrawDailyMasterPack(args: { contentDate: string; actorUserId: string; reason: string }) {
  const reason = args.reason.replace(/\s+/g, " ").trim();
  if (reason.length < 8) throw new Error("Withdrawal requires a reason of at least 8 characters");
  return sqlClient.begin(async (tx) => {
    const client = tx as unknown as typeof sqlClient;
    await lockDate(args.contentDate, client);
    const state = await loadState(args.contentDate, client);
    if (!state.publication) throw new Error("This date has no published pack to withdraw");
    await client`
      UPDATE content.learning_resources
      SET status='draft', published_at=NULL, updated_by=${args.actorUserId}::uuid, updated_at=now()
      WHERE id=ANY(${state.resourceIds}::uuid[])
    `;
    await client`
      UPDATE content.current_affairs_daily_master_pack_publications
      SET withdrawn_by=${args.actorUserId}::uuid, withdrawn_at=now(), withdrawal_reason=${reason}
      WHERE id=${state.publication.id}::uuid
    `;
    await audit(client, {
      actorUserId: args.actorUserId, action: "current_affairs.master_pack.withdrawn",
      publicationId: state.publication.id, reason, contentDate: args.contentDate, resourceIds: state.resourceIds,
    });
    return { contentDate: args.contentDate, withdrawn: true as const };
  });
}

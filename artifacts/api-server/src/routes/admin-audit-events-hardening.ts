import { Router, type Request, type Response } from "express";

import { AdminAccessControlError, assertUuid } from "../lib/admin-access-control";
import { normalizeAuditPagination } from "../lib/admin-control-plane-hardening";
import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router = Router();

function sendError(res: Response, error: unknown): void {
  if (error instanceof AdminAccessControlError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code, details: error.details });
    return;
  }
  console.error("Unable to load audit events", error);
  res.status(500).json({ error: "Unable to load audit events" });
}

function parseFilters(req: Request) {
  const actorUserId = typeof req.query.actorUserId === "string" && req.query.actorUserId
    ? assertUuid(req.query.actorUserId, "actorUserId")
    : null;
  const actionKey = typeof req.query.actionKey === "string" && req.query.actionKey.trim()
    ? req.query.actionKey.trim().slice(0, 160)
    : null;
  const entityType = typeof req.query.entityType === "string" && req.query.entityType.trim()
    ? req.query.entityType.trim().slice(0, 160)
    : null;
  const roleKey = typeof req.query.roleKey === "string" && req.query.roleKey.trim()
    ? req.query.roleKey.trim().slice(0, 120)
    : null;
  const search = typeof req.query.search === "string" && req.query.search.trim()
    ? `%${req.query.search.trim().slice(0, 200)}%`
    : null;
  const from = typeof req.query.from === "string" && req.query.from ? new Date(req.query.from) : null;
  const to = typeof req.query.to === "string" && req.query.to ? new Date(req.query.to) : null;
  if (from && Number.isNaN(from.getTime())) {
    throw new AdminAccessControlError("INVALID_AUDIT_FROM", "Invalid audit start date");
  }
  if (to && Number.isNaN(to.getTime())) {
    throw new AdminAccessControlError("INVALID_AUDIT_TO", "Invalid audit end date");
  }
  return {
    actorUserId,
    actionKey,
    entityType,
    roleKey,
    search,
    from: from?.toISOString() ?? null,
    to: to?.toISOString() ?? null,
  };
}

router.use(authenticate);

router.get("/audit-events", requireAdminPermission("audit.read"), async (req, res) => {
  try {
    const filters = parseFilters(req);
    const { page, pageSize, offset } = normalizeAuditPagination(req.query.page, req.query.pageSize);
    const [events, count, facets] = await Promise.all([
      sqlClient`
        SELECT
          ae.id::text AS id,
          ae.occurred_at AS "occurredAt",
          ae.actor_type::text AS "actorType",
          ae.actor_user_id::text AS "actorUserId",
          actor.display_name AS "actorName",
          actor.email AS "actorEmail",
          ae.effective_role_key AS "effectiveRoleKey",
          ae.action_key AS "actionKey",
          ae.entity_type AS "entityType",
          ae.entity_id::text AS "entityId",
          ae.entity_version_id::text AS "entityVersionId",
          ae.request_id AS "requestId",
          ae.session_id::text AS "sessionId",
          ae.correlation_id::text AS "correlationId",
          ae.approval_request_id::text AS "approvalRequestId",
          ae.reason,
          ae.summary,
          ae.metadata,
          (SELECT COUNT(*)::int FROM platform.audit_event_changes c WHERE c.audit_event_id = ae.id) AS "changeCount"
        FROM platform.audit_events ae
        LEFT JOIN identity.users actor ON actor.id = ae.actor_user_id
        WHERE (${filters.actorUserId}::uuid IS NULL OR ae.actor_user_id = ${filters.actorUserId}::uuid)
          AND (${filters.actionKey}::text IS NULL OR ae.action_key = ${filters.actionKey})
          AND (${filters.entityType}::text IS NULL OR ae.entity_type = ${filters.entityType})
          AND (${filters.roleKey}::text IS NULL OR ae.effective_role_key = ${filters.roleKey})
          AND (${filters.from}::timestamptz IS NULL OR ae.occurred_at >= ${filters.from}::timestamptz)
          AND (${filters.to}::timestamptz IS NULL OR ae.occurred_at <= ${filters.to}::timestamptz)
          AND (
            ${filters.search}::text IS NULL
            OR ae.summary ILIKE ${filters.search}
            OR ae.action_key ILIKE ${filters.search}
            OR ae.entity_type ILIKE ${filters.search}
            OR ae.entity_id::text ILIKE ${filters.search}
            OR actor.display_name ILIKE ${filters.search}
            OR actor.email ILIKE ${filters.search}
          )
        ORDER BY ae.occurred_at DESC, ae.id DESC
        LIMIT ${pageSize}
        OFFSET ${offset}
      `,
      sqlClient`
        SELECT COUNT(*)::int AS count
        FROM platform.audit_events ae
        LEFT JOIN identity.users actor ON actor.id = ae.actor_user_id
        WHERE (${filters.actorUserId}::uuid IS NULL OR ae.actor_user_id = ${filters.actorUserId}::uuid)
          AND (${filters.actionKey}::text IS NULL OR ae.action_key = ${filters.actionKey})
          AND (${filters.entityType}::text IS NULL OR ae.entity_type = ${filters.entityType})
          AND (${filters.roleKey}::text IS NULL OR ae.effective_role_key = ${filters.roleKey})
          AND (${filters.from}::timestamptz IS NULL OR ae.occurred_at >= ${filters.from}::timestamptz)
          AND (${filters.to}::timestamptz IS NULL OR ae.occurred_at <= ${filters.to}::timestamptz)
          AND (
            ${filters.search}::text IS NULL
            OR ae.summary ILIKE ${filters.search}
            OR ae.action_key ILIKE ${filters.search}
            OR ae.entity_type ILIKE ${filters.search}
            OR ae.entity_id::text ILIKE ${filters.search}
            OR actor.display_name ILIKE ${filters.search}
            OR actor.email ILIKE ${filters.search}
          )
      `,
      Promise.all([
        sqlClient`SELECT DISTINCT action_key AS value FROM platform.audit_events ORDER BY action_key`,
        sqlClient`SELECT DISTINCT entity_type AS value FROM platform.audit_events ORDER BY entity_type`,
        sqlClient`SELECT DISTINCT effective_role_key AS value FROM platform.audit_events WHERE effective_role_key IS NOT NULL ORDER BY effective_role_key`,
        sqlClient`SELECT DISTINCT u.id::text AS id, u.display_name AS name, u.email FROM platform.audit_events ae JOIN identity.users u ON u.id = ae.actor_user_id ORDER BY u.display_name`,
      ]),
    ]);
    res.json({
      events,
      page,
      pageSize,
      total: Number(count[0]?.count ?? 0),
      facets: {
        actions: facets[0].map((row) => row.value),
        entityTypes: facets[1].map((row) => row.value),
        roles: facets[2].map((row) => row.value),
        actors: facets[3],
      },
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    sendError(res, error);
  }
});

export default router;

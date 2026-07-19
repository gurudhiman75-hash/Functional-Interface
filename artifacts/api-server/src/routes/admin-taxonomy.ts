import { randomUUID } from "node:crypto";
import { Router, type Response } from "express";

import {
  TaxonomyManagementError,
  normalizeTaxonomyNodeInput,
  type TaxonomyNodeInput,
} from "../lib/admin-taxonomy-management";
import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router = Router();

type SqlExecutor = typeof sqlClient;

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{12}$/i.test(value);
}

function assertNodeId(value: unknown): string {
  const nodeId = typeof value === "string" ? value.trim() : "";
  if (!isUuid(nodeId)) {
    throw new TaxonomyManagementError("INVALID_TAXONOMY_NODE_ID", "Invalid taxonomy node identifier.");
  }
  return nodeId;
}

function sendTaxonomyError(res: Response, error: unknown, fallback: string): void {
  if (error instanceof TaxonomyManagementError) {
    res.status(error.statusCode).json({
      error: error.message,
      code: error.code,
      details: error.details,
    });
    return;
  }
  const message = error instanceof Error ? error.message : fallback;
  if (message.includes("duplicate key")) {
    res.status(409).json({ error: "A taxonomy node with this code already exists.", code: "TAXONOMY_CODE_CONFLICT" });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback });
}

async function assertCodeAvailable(
  client: SqlExecutor,
  code: string,
  excludeNodeId?: string,
): Promise<void> {
  const rows = excludeNodeId
    ? await client`
        SELECT id::text AS id
        FROM catalog.taxonomy_nodes
        WHERE upper(code) = upper(${code})
          AND id <> ${excludeNodeId}::uuid
        LIMIT 1
      `
    : await client`
        SELECT id::text AS id
        FROM catalog.taxonomy_nodes
        WHERE upper(code) = upper(${code})
        LIMIT 1
      `;
  if (rows.length > 0) {
    throw new TaxonomyManagementError(
      "TAXONOMY_CODE_CONFLICT",
      `Taxonomy code ${code} is already in use.`,
      409,
    );
  }
}

async function assertParentsValid(
  client: SqlExecutor,
  nodeId: string,
  parentIds: string[],
): Promise<void> {
  if (parentIds.some((parentId) => !isUuid(parentId))) {
    throw new TaxonomyManagementError("INVALID_PARENT_ID", "One or more parent identifiers are invalid.");
  }
  if (parentIds.includes(nodeId)) {
    throw new TaxonomyManagementError("TAXONOMY_SELF_PARENT", "A taxonomy node cannot be its own parent.");
  }
  if (parentIds.length === 0) return;

  const existing = await client`
    SELECT id::text AS id
    FROM catalog.taxonomy_nodes
    WHERE id = ANY(${parentIds}::uuid[])
      AND deleted_at IS NULL
  `;
  if (existing.length !== parentIds.length) {
    throw new TaxonomyManagementError(
      "TAXONOMY_PARENT_NOT_FOUND",
      "One or more selected parent nodes do not exist.",
      422,
    );
  }

  const cycles = await client`
    WITH RECURSIVE descendants(id) AS (
      SELECT child_id
      FROM catalog.taxonomy_edges
      WHERE parent_id = ${nodeId}::uuid
      UNION
      SELECT edge.child_id
      FROM catalog.taxonomy_edges edge
      INNER JOIN descendants current ON current.id = edge.parent_id
    )
    SELECT id::text AS id
    FROM descendants
    WHERE id = ANY(${parentIds}::uuid[])
    LIMIT 1
  `;
  if (cycles.length > 0) {
    throw new TaxonomyManagementError(
      "TAXONOMY_CYCLE",
      "This parent assignment would create a cycle in the taxonomy hierarchy.",
      422,
    );
  }
}

async function assertExamMappingsValid(
  client: SqlExecutor,
  input: TaxonomyNodeInput,
): Promise<void> {
  const ids = input.examMappings.map((mapping) => mapping.examVersionId);
  if (ids.some((id) => !isUuid(id))) {
    throw new TaxonomyManagementError("INVALID_EXAM_VERSION_ID", "One or more exam-version identifiers are invalid.");
  }
  if (ids.length === 0) return;
  const rows = await client`
    SELECT id::text AS id
    FROM catalog.exam_versions
    WHERE id = ANY(${ids}::uuid[])
  `;
  if (rows.length !== ids.length) {
    throw new TaxonomyManagementError(
      "EXAM_VERSION_NOT_FOUND",
      "One or more selected exam versions do not exist.",
      422,
    );
  }
}

async function replaceParents(
  client: SqlExecutor,
  nodeId: string,
  parentIds: string[],
): Promise<void> {
  await client`DELETE FROM catalog.taxonomy_edges WHERE child_id = ${nodeId}::uuid`;
  for (let index = 0; index < parentIds.length; index += 1) {
    await client`
      INSERT INTO catalog.taxonomy_edges (parent_id, child_id, sort_order)
      VALUES (${parentIds[index]}::uuid, ${nodeId}::uuid, ${index})
    `;
  }
}

async function replaceExamMappings(
  client: SqlExecutor,
  nodeId: string,
  input: TaxonomyNodeInput,
): Promise<void> {
  await client`DELETE FROM catalog.exam_taxonomy_nodes WHERE taxonomy_node_id = ${nodeId}::uuid`;
  for (const mapping of input.examMappings) {
    await client`
      INSERT INTO catalog.exam_taxonomy_nodes (
        exam_version_id,
        taxonomy_node_id,
        display_name_override,
        target_coverage,
        sort_order,
        is_active
      ) VALUES (
        ${mapping.examVersionId}::uuid,
        ${nodeId}::uuid,
        ${mapping.displayNameOverride},
        ${mapping.targetCoverage},
        ${mapping.sortOrder},
        ${mapping.isActive}
      )
    `;
  }
}

async function auditTaxonomyChange(
  client: SqlExecutor,
  input: {
    actorUserId: string;
    roleKey: string | null;
    actionKey: string;
    nodeId: string;
    reason: string;
    summary: string;
    metadata: Record<string, unknown>;
  },
): Promise<void> {
  await client`
    INSERT INTO platform.audit_events (
      id,
      actor_type,
      actor_user_id,
      effective_role_key,
      action_key,
      entity_type,
      entity_id,
      reason,
      summary,
      metadata
    ) VALUES (
      ${randomUUID()}::uuid,
      'user'::audit_actor_type,
      ${input.actorUserId}::uuid,
      ${input.roleKey},
      ${input.actionKey},
      'taxonomy_node',
      ${input.nodeId}::uuid,
      ${input.reason},
      ${input.summary},
      ${client.json(input.metadata)}
    )
  `;
}

router.use(authenticate);

router.get(
  "/workspace",
  requireAdminPermission("content.taxonomy.read"),
  async (_req, res) => {
    try {
      const [families, exams, nodes, coverage] = await Promise.all([
        sqlClient`
          SELECT id::text AS id, code, name, is_active AS "isActive"
          FROM catalog.exam_families
          ORDER BY is_active DESC, name
        `,
        sqlClient`
          SELECT
            e.id::text AS id,
            e.family_id::text AS "familyId",
            e.code,
            e.name,
            e.is_active AS "isActive",
            ev.id::text AS "currentVersionId",
            ev.version_number AS "currentVersionNumber",
            ev.name AS "currentVersionName"
          FROM catalog.exams e
          LEFT JOIN catalog.exam_versions ev
            ON ev.exam_id = e.id
           AND ev.is_current = true
          ORDER BY e.is_active DESC, e.name
        `,
        sqlClient`
          SELECT
            n.id::text AS id,
            n.code,
            n.node_type AS "nodeType",
            n.name,
            n.description,
            n.is_active AS "isActive",
            n.created_at AS "createdAt",
            n.updated_at AS "updatedAt",
            COALESCE((
              SELECT json_agg(
                json_build_object(
                  'id', parent.id::text,
                  'code', parent.code,
                  'nodeType', parent.node_type,
                  'name', parent.name,
                  'sortOrder', edge.sort_order
                ) ORDER BY edge.sort_order, parent.name
              )
              FROM catalog.taxonomy_edges edge
              INNER JOIN catalog.taxonomy_nodes parent ON parent.id = edge.parent_id
              WHERE edge.child_id = n.id
            ), '[]'::json) AS parents,
            COALESCE((
              SELECT json_agg(
                json_build_object(
                  'id', child.id::text,
                  'code', child.code,
                  'nodeType', child.node_type,
                  'name', child.name,
                  'sortOrder', edge.sort_order
                ) ORDER BY edge.sort_order, child.name
              )
              FROM catalog.taxonomy_edges edge
              INNER JOIN catalog.taxonomy_nodes child ON child.id = edge.child_id
              WHERE edge.parent_id = n.id
                AND child.deleted_at IS NULL
            ), '[]'::json) AS children,
            COALESCE((
              SELECT json_agg(
                json_build_object(
                  'examVersionId', mapping.exam_version_id::text,
                  'examId', exam.id::text,
                  'examCode', exam.code,
                  'examName', exam.name,
                  'examVersionName', exam_version.name,
                  'displayNameOverride', mapping.display_name_override,
                  'targetCoverage', mapping.target_coverage,
                  'sortOrder', mapping.sort_order,
                  'isActive', mapping.is_active
                ) ORDER BY exam.name, exam_version.version_number DESC
              )
              FROM catalog.exam_taxonomy_nodes mapping
              INNER JOIN catalog.exam_versions exam_version ON exam_version.id = mapping.exam_version_id
              INNER JOIN catalog.exams exam ON exam.id = exam_version.exam_id
              WHERE mapping.taxonomy_node_id = n.id
            ), '[]'::json) AS "examMappings"
          FROM catalog.taxonomy_nodes n
          WHERE n.deleted_at IS NULL
          ORDER BY n.is_active DESC, n.node_type, n.name
        `,
        sqlClient`
          WITH RECURSIVE closure(ancestor_id, descendant_id) AS (
            SELECT id, id
            FROM catalog.taxonomy_nodes
            WHERE deleted_at IS NULL
            UNION
            SELECT closure.ancestor_id, edge.child_id
            FROM closure
            INNER JOIN catalog.taxonomy_edges edge ON edge.parent_id = closure.descendant_id
          ), display_versions AS (
            SELECT
              q.id AS question_id,
              q.status,
              CASE
                WHEN q.status = 'published'::question_status THEN q.published_version_id
                WHEN q.status = 'approved'::question_status THEN q.approved_version_id
                ELSE COALESCE(q.current_draft_version_id, q.approved_version_id, q.published_version_id)
              END AS version_id
            FROM content.questions q
            WHERE q.deleted_at IS NULL
              AND q.status <> 'archived'::question_status
          ), linked_questions AS (
            SELECT DISTINCT
              display.question_id,
              display.status,
              version.exam_version_id,
              link.taxonomy_node_id
            FROM display_versions display
            INNER JOIN content.question_versions version ON version.id = display.version_id
            INNER JOIN content.question_taxonomy_links link ON link.question_version_id = version.id
          )
          SELECT
            mapping.exam_version_id::text AS "examVersionId",
            mapping.taxonomy_node_id::text AS "taxonomyNodeId",
            mapping.target_coverage AS "targetCoverage",
            mapping.is_active AS "isActive",
            COUNT(DISTINCT linked.question_id)::int AS "totalQuestions",
            COUNT(DISTINCT linked.question_id) FILTER (WHERE linked.status = 'published'::question_status)::int AS "publishedQuestions",
            COUNT(DISTINCT linked.question_id) FILTER (WHERE linked.status = 'approved'::question_status)::int AS "approvedQuestions",
            COUNT(DISTINCT linked.question_id) FILTER (WHERE linked.status IN ('under_review'::question_status, 'needs_fix'::question_status))::int AS "reviewQuestions",
            COUNT(DISTINCT linked.question_id) FILTER (WHERE linked.status IN ('draft'::question_status, 'generated'::question_status))::int AS "draftQuestions"
          FROM catalog.exam_taxonomy_nodes mapping
          LEFT JOIN closure ON closure.ancestor_id = mapping.taxonomy_node_id
          LEFT JOIN linked_questions linked
            ON linked.taxonomy_node_id = closure.descendant_id
           AND linked.exam_version_id = mapping.exam_version_id
          GROUP BY mapping.exam_version_id, mapping.taxonomy_node_id, mapping.target_coverage, mapping.is_active
          ORDER BY mapping.exam_version_id, mapping.taxonomy_node_id
        `,
      ]);

      res.json({
        families,
        exams,
        nodes,
        coverage,
        supportedNodeTypes: [
          "subject",
          "section",
          "topic",
          "subtopic",
          "chapter",
          "canonical_problem",
          "skill",
        ],
        generatedAt: new Date().toISOString(),
      });
    } catch (error) {
      sendTaxonomyError(res, error, "Unable to load canonical taxonomy workspace");
    }
  },
);

router.post(
  "/nodes",
  requireAdminPermission("content.taxonomy.manage"),
  async (req, res) => {
    try {
      const input = normalizeTaxonomyNodeInput(req.body);
      const actorUserId = req.adminSession?.user.id;
      if (!actorUserId) {
        throw new TaxonomyManagementError("ADMIN_SESSION_REQUIRED", "Administrator session required.", 403);
      }
      const nodeId = randomUUID();
      const node = await sqlClient.begin(async (tx) => {
        await tx`SELECT pg_advisory_xact_lock(hashtext('examtree.catalog.taxonomy'))`;
        await assertCodeAvailable(tx as SqlExecutor, input.code);
        await assertParentsValid(tx as SqlExecutor, nodeId, input.parentIds);
        await assertExamMappingsValid(tx as SqlExecutor, input);

        const rows = await tx`
          INSERT INTO catalog.taxonomy_nodes (
            id, code, node_type, name, description, is_active, created_at, updated_at
          ) VALUES (
            ${nodeId}::uuid,
            ${input.code},
            ${input.nodeType},
            ${input.name},
            ${input.description},
            ${input.isActive},
            now(),
            now()
          )
          RETURNING id::text AS id, code, node_type AS "nodeType", name, description, is_active AS "isActive"
        `;
        await replaceParents(tx as SqlExecutor, nodeId, input.parentIds);
        await replaceExamMappings(tx as SqlExecutor, nodeId, input);
        await auditTaxonomyChange(tx as SqlExecutor, {
          actorUserId,
          roleKey: req.adminSession?.roles[0] ?? null,
          actionKey: "catalog.taxonomy_node.created",
          nodeId,
          reason: input.reason,
          summary: `Created taxonomy node ${input.code}`,
          metadata: {
            nodeType: input.nodeType,
            parentIds: input.parentIds,
            examVersionIds: input.examMappings.map((mapping) => mapping.examVersionId),
          },
        });
        return rows[0];
      });
      res.status(201).json({ node });
    } catch (error) {
      sendTaxonomyError(res, error, "Unable to create taxonomy node");
    }
  },
);

router.patch(
  "/nodes/:nodeId",
  requireAdminPermission("content.taxonomy.manage"),
  async (req, res) => {
    try {
      const nodeId = assertNodeId(req.params.nodeId);
      const input = normalizeTaxonomyNodeInput(req.body);
      const actorUserId = req.adminSession?.user.id;
      if (!actorUserId) {
        throw new TaxonomyManagementError("ADMIN_SESSION_REQUIRED", "Administrator session required.", 403);
      }

      const node = await sqlClient.begin(async (tx) => {
        await tx`SELECT pg_advisory_xact_lock(hashtext('examtree.catalog.taxonomy'))`;
        const existing = await tx`
          SELECT id::text AS id, code, node_type AS "nodeType", name, is_active AS "isActive"
          FROM catalog.taxonomy_nodes
          WHERE id = ${nodeId}::uuid
            AND deleted_at IS NULL
          LIMIT 1
          FOR UPDATE
        `;
        if (!existing[0]) {
          throw new TaxonomyManagementError("TAXONOMY_NODE_NOT_FOUND", "Taxonomy node not found.", 404);
        }

        await assertCodeAvailable(tx as SqlExecutor, input.code, nodeId);
        await assertParentsValid(tx as SqlExecutor, nodeId, input.parentIds);
        await assertExamMappingsValid(tx as SqlExecutor, input);

        const rows = await tx`
          UPDATE catalog.taxonomy_nodes
          SET
            code = ${input.code},
            node_type = ${input.nodeType},
            name = ${input.name},
            description = ${input.description},
            is_active = ${input.isActive},
            updated_at = now()
          WHERE id = ${nodeId}::uuid
          RETURNING id::text AS id, code, node_type AS "nodeType", name, description, is_active AS "isActive"
        `;
        await replaceParents(tx as SqlExecutor, nodeId, input.parentIds);
        await replaceExamMappings(tx as SqlExecutor, nodeId, input);
        await auditTaxonomyChange(tx as SqlExecutor, {
          actorUserId,
          roleKey: req.adminSession?.roles[0] ?? null,
          actionKey: "catalog.taxonomy_node.updated",
          nodeId,
          reason: input.reason,
          summary: `Updated taxonomy node ${input.code}`,
          metadata: {
            previous: existing[0],
            nodeType: input.nodeType,
            parentIds: input.parentIds,
            examVersionIds: input.examMappings.map((mapping) => mapping.examVersionId),
          },
        });
        return rows[0];
      });
      res.json({ node });
    } catch (error) {
      sendTaxonomyError(res, error, "Unable to update taxonomy node");
    }
  },
);

export default router;

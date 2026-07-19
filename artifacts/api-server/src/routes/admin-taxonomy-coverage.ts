import { randomUUID } from "node:crypto";
import { Router, type Response } from "express";

import { TaxonomyManagementError } from "../lib/admin-taxonomy-management";
import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router = Router();

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{12}$/i.test(value);
}

function sendError(res: Response, error: unknown): void {
  if (error instanceof TaxonomyManagementError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code, details: error.details });
    return;
  }
  console.error("Unable to update taxonomy coverage", error);
  res.status(500).json({ error: "Unable to update taxonomy coverage" });
}

router.use(authenticate);

router.patch(
  "/coverage",
  requireAdminPermission("content.taxonomy.manage"),
  async (req, res) => {
    try {
      const actorUserId = req.adminSession?.user.id;
      if (!actorUserId) {
        throw new TaxonomyManagementError("ADMIN_SESSION_REQUIRED", "Administrator session required.", 403);
      }
      const reason = typeof req.body?.reason === "string" ? req.body.reason.trim() : "";
      if (reason.length < 4 || reason.length > 500) {
        throw new TaxonomyManagementError(
          "COVERAGE_REASON_REQUIRED",
          "An audit reason of 4–500 characters is required.",
        );
      }
      const rawChanges = Array.isArray(req.body?.changes) ? req.body.changes : [];
      if (rawChanges.length === 0 || rawChanges.length > 500) {
        throw new TaxonomyManagementError(
          "INVALID_COVERAGE_BATCH",
          "Coverage updates must contain 1–500 rows.",
        );
      }

      const seen = new Set<string>();
      const changes = rawChanges.map((raw: unknown, index: number) => {
        const record = raw && typeof raw === "object" && !Array.isArray(raw)
          ? raw as Record<string, unknown>
          : {};
        const taxonomyNodeId = typeof record.taxonomyNodeId === "string" ? record.taxonomyNodeId.trim() : "";
        const examVersionId = typeof record.examVersionId === "string" ? record.examVersionId.trim() : "";
        if (!isUuid(taxonomyNodeId) || !isUuid(examVersionId)) {
          throw new TaxonomyManagementError(
            "INVALID_COVERAGE_IDENTIFIER",
            `Coverage row ${index + 1} contains an invalid identifier.`,
          );
        }
        const key = `${taxonomyNodeId}:${examVersionId}`;
        if (seen.has(key)) {
          throw new TaxonomyManagementError(
            "DUPLICATE_COVERAGE_ROW",
            "Each node and exam version may appear only once in a coverage update.",
          );
        }
        seen.add(key);
        const targetRaw = record.targetCoverage;
        const targetCoverage = targetRaw === null || targetRaw === undefined || targetRaw === ""
          ? null
          : Number(targetRaw);
        if (targetCoverage !== null && (!Number.isInteger(targetCoverage) || targetCoverage < 0 || targetCoverage > 100000)) {
          throw new TaxonomyManagementError(
            "INVALID_COVERAGE_TARGET",
            "Coverage targets must be whole numbers from 0 to 100000.",
          );
        }
        return {
          taxonomyNodeId,
          examVersionId,
          targetCoverage,
          isActive: record.isActive !== false,
        };
      });

      await sqlClient.begin(async (tx) => {
        await tx`SELECT pg_advisory_xact_lock(hashtext('examtree.catalog.taxonomy'))`;
        const nodeIds = [...new Set(changes.map((change) => change.taxonomyNodeId))];
        const examVersionIds = [...new Set(changes.map((change) => change.examVersionId))];
        const nodes = await tx`
          SELECT id::text AS id, code
          FROM catalog.taxonomy_nodes
          WHERE id = ANY(${nodeIds}::uuid[])
            AND deleted_at IS NULL
        `;
        const examVersions = await tx`
          SELECT id::text AS id
          FROM catalog.exam_versions
          WHERE id = ANY(${examVersionIds}::uuid[])
        `;
        if (nodes.length !== nodeIds.length || examVersions.length !== examVersionIds.length) {
          throw new TaxonomyManagementError(
            "COVERAGE_ENTITY_NOT_FOUND",
            "One or more taxonomy nodes or exam versions no longer exist.",
            422,
          );
        }
        const codeById = new Map(nodes.map((node) => [String(node.id), String(node.code)]));

        for (const change of changes) {
          await tx`
            INSERT INTO catalog.exam_taxonomy_nodes (
              exam_version_id,
              taxonomy_node_id,
              display_name_override,
              target_coverage,
              sort_order,
              is_active
            ) VALUES (
              ${change.examVersionId}::uuid,
              ${change.taxonomyNodeId}::uuid,
              NULL,
              ${change.targetCoverage},
              0,
              ${change.isActive}
            )
            ON CONFLICT (exam_version_id, taxonomy_node_id) DO UPDATE
            SET
              target_coverage = EXCLUDED.target_coverage,
              is_active = EXCLUDED.is_active
          `;
          await tx`
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
              ${actorUserId}::uuid,
              ${req.adminSession?.roles[0] ?? null},
              'catalog.taxonomy_coverage.updated',
              'taxonomy_node',
              ${change.taxonomyNodeId}::uuid,
              ${reason},
              ${`Updated coverage target for ${codeById.get(change.taxonomyNodeId) ?? change.taxonomyNodeId}`},
              ${tx.json({
                examVersionId: change.examVersionId,
                targetCoverage: change.targetCoverage,
                isActive: change.isActive,
              })}
            )
          `;
        }
      });

      res.json({ updatedCount: changes.length });
    } catch (error) {
      sendError(res, error);
    }
  },
);

export default router;

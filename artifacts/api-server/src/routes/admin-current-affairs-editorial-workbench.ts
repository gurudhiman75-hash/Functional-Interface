import { Router, type IRouter, type Response } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router: IRouter = Router();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

class EditorialWorkbenchError extends Error {
  constructor(readonly code: string, message: string, readonly statusCode = 400) {
    super(message);
  }
}

function uuid(value: unknown): string {
  const id = typeof value === "string" ? value.trim() : "";
  if (!uuidPattern.test(id)) {
    throw new EditorialWorkbenchError("INVALID_EVENT_ID", "Current Affairs event ID is invalid.");
  }
  return id;
}

function sendError(res: Response, error: unknown, fallback: string) {
  if (error instanceof EditorialWorkbenchError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback, code: "CURRENT_AFFAIRS_EDITORIAL_WORKBENCH_FAILED" });
}

router.use(authenticate);

router.get(
  "/editorial/events/:id",
  requireAdminPermission("content.questions.read"),
  async (req, res) => {
    try {
      const eventId = uuid(req.params.id);
      const eventRows = await sqlClient`
        SELECT
          event.id::text AS id,
          event.public_code AS "publicCode",
          event.canonical_title AS "canonicalTitle",
          event.summary AS "canonicalSummary",
          event.importance_reason AS "importanceReason",
          event.event_date::text AS "eventDate",
          event.category,
          event.subcategory,
          event.status AS "eventStatus",
          event.verification_confidence::float8 AS "verificationConfidence",
          event.learner_authoring_status AS "authoringStatus",
          event.learner_authoring_version_id::text AS "authoringVersionId",
          authoring.version_number AS "authoringVersionNumber",
          authoring.status AS "authoringVersionStatus",
          authoring.learner_title AS "learnerTitle",
          authoring.learner_summary AS "learnerSummary",
          authoring.learner_one_liner AS "learnerOneLiner",
          authoring.template_id AS "authoringTemplateId",
          authoring.authoring_method AS "authoringMethod",
          authoring.source_title_similarity::float8 AS "sourceTitleSimilarity",
          authoring.reasons AS "authoringReasons",
          authoring.created_at AS "authoringCreatedAt",
          event.updated_at AS "eventUpdatedAt"
        FROM content.current_affairs_events event
        LEFT JOIN content.current_affairs_authoring_versions authoring
          ON authoring.id=event.learner_authoring_version_id
        WHERE event.id=${eventId}::uuid
        LIMIT 1
      `;
      const event = eventRows[0];
      if (!event) {
        throw new EditorialWorkbenchError("EVENT_NOT_FOUND", "Current Affairs event not found.", 404);
      }

      const [sources, facts, conflicts, history] = await Promise.all([
        sqlClient`
          SELECT
            evidence.source_id::text AS "sourceId",
            source.source_key AS "sourceKey",
            source.name AS "sourceName",
            source.trust_score::float8 AS "trustScore",
            source.is_primary_source AS "registeredPrimarySource",
            evidence.source_url AS "sourceUrl",
            evidence.source_title AS "sourceTitle",
            evidence.source_published_at AS "sourcePublishedAt",
            evidence.is_primary_evidence AS "isPrimaryEvidence",
            evidence.evidence_confidence::float8 AS "evidenceConfidence",
            evidence.created_at AS "createdAt"
          FROM content.current_affairs_event_sources evidence
          JOIN content.current_affairs_sources source ON source.id=evidence.source_id
          WHERE evidence.event_id=${eventId}::uuid
          ORDER BY evidence.is_primary_evidence DESC, source.trust_score DESC, evidence.created_at ASC
        `,
        sqlClient`
          SELECT
            fact.id::text AS id,
            fact.fact_key AS "factKey",
            fact.fact_value AS "factValue",
            fact.fact_type AS "factType",
            fact.is_verified AS "isVerified",
            fact.confidence::float8 AS confidence,
            fact.reconciliation_status AS "reconciliationStatus",
            fact.support_count::int AS "supportCount",
            fact.primary_support_count::int AS "primarySupportCount",
            fact.provenance,
            fact.sort_order AS "sortOrder"
          FROM content.current_affairs_facts fact
          WHERE fact.event_id=${eventId}::uuid
          ORDER BY fact.sort_order, fact.fact_key, fact.fact_value
        `,
        sqlClient`
          SELECT
            conflict.id::text AS id,
            conflict.fact_key AS "factKey",
            conflict.competing_values AS "competingValues",
            conflict.status,
            conflict.preferred_value AS "preferredValue",
            conflict.resolution_reason AS "resolutionReason",
            conflict.updated_at AS "updatedAt"
          FROM content.current_affairs_fact_conflicts conflict
          WHERE conflict.event_id=${eventId}::uuid
          ORDER BY CASE WHEN conflict.status='open' THEN 0 ELSE 1 END, conflict.updated_at DESC
        `,
        sqlClient`
          SELECT
            version.id::text AS id,
            version.version_number AS "versionNumber",
            version.status,
            version.learner_title AS "learnerTitle",
            version.learner_summary AS "learnerSummary",
            version.learner_one_liner AS "learnerOneLiner",
            version.authoring_method AS "authoringMethod",
            version.source_title_similarity::float8 AS "sourceTitleSimilarity",
            version.reasons,
            version.created_at AS "createdAt"
          FROM content.current_affairs_authoring_versions version
          WHERE version.event_id=${eventId}::uuid
          ORDER BY version.version_number DESC
          LIMIT 12
        `,
      ]);

      const authoringVersionId = event.authoringVersionId ? String(event.authoringVersionId) : null;
      const localizations = authoringVersionId
        ? await sqlClient`
            SELECT
              localization.id::text AS id,
              localization.language_code AS "languageCode",
              localization.status,
              localization.localized_title AS "localizedTitle",
              localization.localized_summary AS "localizedSummary",
              localization.localized_one_liner AS "localizedOneLiner",
              localization.localization_method AS "localizationMethod",
              localization.quality_snapshot AS "qualitySnapshot",
              localization.reasons,
              localization.reviewed_by::text AS "reviewedBy",
              localization.updated_at AS "updatedAt"
            FROM content.current_affairs_localizations localization
            WHERE localization.event_id=${eventId}::uuid
              AND localization.authoring_version_id=${authoringVersionId}::uuid
              AND localization.language_code IN ('hi','pa')
            ORDER BY localization.language_code
          `
        : [];

      res.json({
        event,
        sources,
        facts,
        conflicts,
        localizations,
        authoringHistory: history,
        gates: {
          eventVerified: String(event.eventStatus) === "verified",
          hasVerifiedFacts: facts.some((fact) => Boolean(fact.isVerified)),
          hasOpenConflict: conflicts.some((conflict) => String(conflict.status) === "open"),
          authoringCurrent: Boolean(authoringVersionId),
        },
        generatedAt: new Date().toISOString(),
      });
    } catch (error) {
      sendError(res, error, "Unable to load Current Affairs editorial workbench");
    }
  },
);

export default router;

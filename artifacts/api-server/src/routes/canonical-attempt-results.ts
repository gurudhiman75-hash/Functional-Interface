import { Router, type IRouter } from "express";

import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router: IRouter = Router();

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

router.get("/attempts/:id", authenticate, async (req, res, next) => {
  const attemptId = String(req.params.id ?? "").trim();
  if (!isUuid(attemptId)) return next();

  try {
    const rows = await sqlClient`
      SELECT attempt.result_snapshot AS result,
        descriptive_review.metadata AS "descriptiveReview"
      FROM learning.attempts attempt
      JOIN identity.auth_identities identity
        ON identity.user_id = attempt.user_id
       AND identity.provider = 'firebase'
      LEFT JOIN LATERAL (
        SELECT audit.metadata
        FROM platform.audit_events audit
        WHERE audit.entity_type = 'attempt'
          AND audit.entity_id = attempt.id
          AND audit.action_key = 'student.attempt.descriptive_review.completed'
        ORDER BY audit.occurred_at DESC, audit.id DESC
        LIMIT 1
      ) descriptive_review ON true
      WHERE attempt.id = ${attemptId}::uuid
        AND identity.provider_subject = ${req.user!.id}
        AND attempt.status IN ('evaluated', 'practice_evaluated')
        AND attempt.result_snapshot IS NOT NULL
      LIMIT 1
    `;
    if (!rows[0]?.result) return next();
    const result = asRecord(rows[0].result);
    const descriptiveReview = asRecord(rows[0].descriptiveReview);
    if (Object.keys(descriptiveReview).length === 0) return res.json(result);

    return res.json({
      ...result,
      descriptiveReviewStatus: "reviewed",
      scoringStatus: "COMPLETE",
      descriptiveReview,
      combinedActualScore: descriptiveReview.combinedActualScore ?? null,
      combinedPercentage: descriptiveReview.combinedPercentage ?? null,
      displayActualScore: descriptiveReview.combinedActualScore ?? result.actualScore ?? null,
      displayPercentage: descriptiveReview.combinedPercentage ?? result.score ?? null,
    });
  } catch (error) {
    console.error("Unable to load canonical attempt result", error);
    return res.status(500).json({ error: "Unable to load attempt result", code: "ATTEMPT_RESULT_READ_FAILED" });
  }
});

export default router;

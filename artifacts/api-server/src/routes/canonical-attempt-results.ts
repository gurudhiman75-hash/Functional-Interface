import { Router, type IRouter } from "express";

import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router: IRouter = Router();

const recentResults = new Map<string, { userId: string; result: Record<string, unknown> }>();
const MAX_RECENT_RESULTS = 500;

function rememberResult(attemptId: string, userId: string, result: Record<string, unknown>): void {
  recentResults.set(attemptId, { userId, result });
  if (recentResults.size <= MAX_RECENT_RESULTS) return;
  const oldestKey = recentResults.keys().next().value;
  if (oldestKey) recentResults.delete(oldestKey);
}

function asFiniteNumber(value: unknown, fallback = 0): number {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

// Capture the canonical scorer response before it is sent to the student.
// The immediate in-process copy supports same-instance navigation, while the
// canonical learning.attempts table provides durable refresh/cross-instance access.
router.post("/attempts", authenticate, (req, res, next) => {
  const testId = typeof req.body?.testId === "string" ? req.body.testId.trim() : "";
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(testId)) {
    return next();
  }

  const originalJson = res.json.bind(res);
  res.json = ((body: unknown) => {
    const result = body && typeof body === "object" ? body as Record<string, unknown> : null;
    const attemptId = typeof result?.id === "string" ? result.id : "";
    const returnedTestId = typeof result?.testId === "string" ? result.testId : "";
    const firebaseUserId = req.user?.id ?? "";

    if (!attemptId || !returnedTestId || !firebaseUserId || res.statusCode >= 400) {
      return originalJson(body);
    }

    rememberResult(attemptId, firebaseUserId, result);
    const response = originalJson(body);

    void (async () => {
      try {
        await sqlClient`
          WITH auth_user AS (
            SELECT ai.user_id
            FROM identity.auth_identities ai
            WHERE ai.provider = 'firebase'
              AND ai.provider_subject = ${firebaseUserId}
            LIMIT 1
          ), publication AS (
            SELECT p.id
            FROM assessment.test_publications p
            JOIN assessment.tests t
              ON t.id = p.test_id
             AND t.published_version_id = p.test_version_id
            WHERE p.test_id = ${returnedTestId}::uuid
              AND p.published_at IS NOT NULL
            ORDER BY p.publication_number DESC
            LIMIT 1
          ), next_attempt AS (
            SELECT COALESCE(MAX(a.attempt_number), 0) + 1 AS attempt_number
            FROM learning.attempts a
            CROSS JOIN auth_user u
            CROSS JOIN publication p
            WHERE a.user_id = u.user_id
              AND a.test_publication_id = p.id
          )
          INSERT INTO learning.attempts (
            id,
            user_id,
            test_publication_id,
            attempt_number,
            status,
            started_at,
            submitted_at,
            evaluated_at,
            time_spent_seconds,
            raw_score,
            final_score,
            correct_count,
            incorrect_count,
            unattempted_count,
            result_snapshot,
            created_at,
            updated_at
          )
          SELECT
            ${attemptId}::uuid,
            u.user_id,
            p.id,
            n.attempt_number,
            'evaluated',
            ${String(result.createdAt ?? new Date().toISOString())}::timestamptz,
            now(),
            now(),
            GREATEST(0, ${Math.round(asFiniteNumber(result.timeSpent) * 60)}),
            ${asFiniteNumber(result.actualScore)},
            ${asFiniteNumber(result.score)},
            ${Math.max(0, Math.round(asFiniteNumber(result.correct)))},
            ${Math.max(0, Math.round(asFiniteNumber(result.wrong)))},
            ${Math.max(0, Math.round(asFiniteNumber(result.unanswered)))},
            ${JSON.stringify(result)}::jsonb,
            now(),
            now()
          FROM auth_user u
          CROSS JOIN publication p
          CROSS JOIN next_attempt n
          ON CONFLICT (id) DO UPDATE SET
            status = EXCLUDED.status,
            submitted_at = EXCLUDED.submitted_at,
            evaluated_at = EXCLUDED.evaluated_at,
            time_spent_seconds = EXCLUDED.time_spent_seconds,
            raw_score = EXCLUDED.raw_score,
            final_score = EXCLUDED.final_score,
            correct_count = EXCLUDED.correct_count,
            incorrect_count = EXCLUDED.incorrect_count,
            unattempted_count = EXCLUDED.unattempted_count,
            result_snapshot = EXCLUDED.result_snapshot,
            updated_at = now()
        `;
      } catch (error) {
        console.error("Unable to persist canonical attempt result", error);
      }
    })();

    return response;
  }) as typeof res.json;

  return next();
});

router.get("/attempts/:id", authenticate, async (req, res, next) => {
  const attemptId = String(req.params.id ?? "").trim();
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(attemptId)) {
    return next();
  }

  const firebaseUserId = req.user?.id ?? "";
  const cached = recentResults.get(attemptId);
  if (cached && cached.userId === firebaseUserId) {
    return res.json(cached.result);
  }

  try {
    const rows = await sqlClient`
      SELECT a.result_snapshot AS result
      FROM learning.attempts a
      JOIN identity.auth_identities ai
        ON ai.user_id = a.user_id
       AND ai.provider = 'firebase'
      WHERE a.id = ${attemptId}::uuid
        AND ai.provider_subject = ${firebaseUserId}
        AND a.status = 'evaluated'
      LIMIT 1
    `;
    if (!rows[0]?.result) return next();
    return res.json(rows[0].result);
  } catch (error) {
    console.error("Unable to load canonical attempt result", error);
    return next();
  }
});

export default router;

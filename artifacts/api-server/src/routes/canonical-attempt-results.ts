import { Router, type IRouter } from "express";

import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router: IRouter = Router();
let schemaReady: Promise<void> | null = null;

const recentResults = new Map<string, { userId: string; result: Record<string, unknown> }>();
const MAX_RECENT_RESULTS = 500;

function rememberResult(attemptId: string, userId: string, result: Record<string, unknown>): void {
  recentResults.set(attemptId, { userId, result });
  if (recentResults.size <= MAX_RECENT_RESULTS) return;
  const oldestKey = recentResults.keys().next().value;
  if (oldestKey) recentResults.delete(oldestKey);
}

function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      await sqlClient`
        CREATE TABLE IF NOT EXISTS assessment.student_attempt_results (
          id uuid PRIMARY KEY,
          user_id text NOT NULL,
          test_id uuid NOT NULL,
          result jsonb NOT NULL,
          created_at timestamptz NOT NULL DEFAULT now()
        )
      `;
      await sqlClient`
        CREATE INDEX IF NOT EXISTS student_attempt_results_user_created_idx
        ON assessment.student_attempt_results (user_id, created_at DESC)
      `;
    })().catch((error) => {
      schemaReady = null;
      throw error;
    });
  }
  return schemaReady;
}

// Capture the canonical scorer response before it is sent to the student.
// Keep an immediate in-process copy so the result page can load even when the
// database schema/write is temporarily unavailable. Database persistence still
// runs in the background for refreshes and cross-device access.
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
    const userId = req.user?.id ?? "";

    if (!attemptId || !returnedTestId || !userId || res.statusCode >= 400) {
      return originalJson(body);
    }

    rememberResult(attemptId, userId, result);
    const response = originalJson(body);

    void (async () => {
      try {
        await ensureSchema();
        await sqlClient`
          INSERT INTO assessment.student_attempt_results (id, user_id, test_id, result)
          VALUES (${attemptId}::uuid, ${userId}, ${returnedTestId}::uuid, ${JSON.stringify(result)}::jsonb)
          ON CONFLICT (id) DO UPDATE SET result = EXCLUDED.result
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

  const cached = recentResults.get(attemptId);
  if (cached && cached.userId === (req.user?.id ?? "")) {
    return res.json(cached.result);
  }

  try {
    await ensureSchema();
    const rows = await sqlClient`
      SELECT result
      FROM assessment.student_attempt_results
      WHERE id = ${attemptId}::uuid
        AND user_id = ${req.user?.id ?? ""}
      LIMIT 1
    `;
    if (!rows[0]) return next();
    return res.json(rows[0].result);
  } catch (error) {
    console.error("Unable to load canonical attempt result", error);
    return next();
  }
});

export default router;

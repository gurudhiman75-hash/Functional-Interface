import { Router, type IRouter } from "express";

import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router: IRouter = Router();
let schemaReady: Promise<void> | null = null;

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

// Capture the canonical scorer response before it is sent to the student. The
// scorer remains responsible for correctness; this middleware only persists
// its immutable result so the existing result page can fetch it by attempt ID.
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
      } finally {
        originalJson(body);
      }
    })();

    return res;
  }) as typeof res.json;

  return next();
});

router.get("/attempts/:id", authenticate, async (req, res, next) => {
  const attemptId = String(req.params.id ?? "").trim();
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(attemptId)) {
    return next();
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
    return res.status(500).json({ error: "Unable to load attempt result" });
  }
});

export default router;

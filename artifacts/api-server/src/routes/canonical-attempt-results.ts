import { Router, type IRouter } from "express";

import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router: IRouter = Router();

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

router.get("/attempts/:id", authenticate, async (req, res, next) => {
  const attemptId = String(req.params.id ?? "").trim();
  if (!isUuid(attemptId)) return next();

  try {
    const rows = await sqlClient`
      SELECT attempt.result_snapshot AS result
      FROM learning.attempts attempt
      JOIN identity.auth_identities identity
        ON identity.user_id = attempt.user_id
       AND identity.provider = 'firebase'
      WHERE attempt.id = ${attemptId}::uuid
        AND identity.provider_subject = ${req.user!.id}
        AND attempt.status = 'evaluated'
        AND attempt.result_snapshot IS NOT NULL
      LIMIT 1
    `;
    if (!rows[0]?.result) return next();
    return res.json(rows[0].result);
  } catch (error) {
    console.error("Unable to load canonical attempt result", error);
    return res.status(500).json({ error: "Unable to load attempt result", code: "ATTEMPT_RESULT_READ_FAILED" });
  }
});

export default router;

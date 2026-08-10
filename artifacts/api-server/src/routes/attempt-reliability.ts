import { Router, type IRouter } from "express";

import { sqlClient } from "../lib/db";
import {
  AttemptReliabilityError,
  advanceAttemptSessionSnapshot,
  createAttemptSessionSnapshot,
  readAttemptSessionSnapshot,
  resolveAttemptLimit,
  type AttemptSessionSnapshot,
} from "../lib/attempt-reliability";
import { authenticate } from "../middlewares/auth";

const router: IRouter = Router();

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function asString(value: unknown, maximum = 160): string {
  return typeof value === "string" ? value.trim().slice(0, maximum) : "";
}

function finiteRevision(value: unknown): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : -1;
}

async function loadIdentityUser(firebaseUserId: string) {
  const rows = await sqlClient`
    SELECT ai.user_id::text AS "userId"
    FROM identity.auth_identities ai
    WHERE ai.provider = 'firebase'
      AND ai.provider_subject = ${firebaseUserId}
    LIMIT 1
  `;
  return rows[0] ?? null;
}

async function loadActivePublication(identifier: string) {
  const uuid = isUuid(identifier);
  const rows = await sqlClient`
    SELECT
      test.id::text AS "testId",
      test.public_code AS "publicCode",
      test.published_version_id::text AS "testVersionId",
      version.title,
      version.duration_seconds AS "durationSeconds",
      version.settings,
      publication.id::text AS "publicationId",
      publication.published_at AS "publishedAt",
      publication.closes_at AS "closesAt"
    FROM assessment.tests test
    JOIN assessment.test_versions version ON version.id = test.published_version_id
    JOIN LATERAL (
      SELECT p.id, p.published_at, p.closes_at
      FROM assessment.test_publications p
      WHERE p.test_id = test.id
        AND p.test_version_id = test.published_version_id
        AND p.published_at IS NOT NULL
      ORDER BY p.publication_number DESC
      LIMIT 1
    ) publication ON true
    WHERE test.status = 'live'::test_status
      AND test.deleted_at IS NULL
      AND (publication.closes_at IS NULL OR publication.closes_at > now())
      AND (
        (${uuid}::boolean AND test.id = ${uuid ? identifier : null}::uuid)
        OR lower(test.public_code) = lower(${identifier})
      )
    LIMIT 1
  `;
  return rows[0] ?? null;
}

function sessionResponse(row: Record<string, unknown>, snapshot: AttemptSessionSnapshot) {
  return {
    id: String(row.id),
    testId: String(row.testId),
    testVersionId: String(row.testVersionId),
    publicationId: String(row.publicationId),
    attemptNumber: Number(row.attemptNumber),
    status: String(row.status),
    startedAt: new Date(String(row.startedAt)).toISOString(),
    updatedAt: new Date(String(row.updatedAt)).toISOString(),
    revision: snapshot.revision,
    seriesId: snapshot.seriesId,
    state: snapshot.state,
    savedAt: snapshot.savedAt,
  };
}

router.post("/attempt-sessions", authenticate, async (req, res) => {
  const identifier = asString(req.body?.testId, 120);
  const seriesId = asString(req.body?.seriesId, 120) || null;
  if (!identifier) {
    res.status(400).json({ error: "Select a test before starting an attempt", code: "ATTEMPT_TEST_REQUIRED" });
    return;
  }

  try {
    const [identity, publication] = await Promise.all([
      loadIdentityUser(req.user!.id),
      loadActivePublication(identifier),
    ]);
    if (!identity) {
      res.status(409).json({ error: "Your ExamTree student profile is not ready", code: "ATTEMPT_PROFILE_REQUIRED" });
      return;
    }
    if (!publication) {
      res.status(404).json({ error: "This published test is not currently available", code: "ATTEMPT_TEST_UNAVAILABLE" });
      return;
    }

    const userId = String(identity.userId);
    const testId = String(publication.testId);
    const testVersionId = String(publication.testVersionId);
    const publicationId = String(publication.publicationId);
    const lockKey = `${userId}:${publicationId}`;

    const result = await sqlClient.begin(async (sql) => {
      await sql`SELECT pg_advisory_xact_lock(hashtextextended(${lockKey}, 0))`;

      const activeRows = await sql`
        SELECT
          attempt.id::text AS id,
          attempt.attempt_number AS "attemptNumber",
          attempt.status,
          attempt.started_at AS "startedAt",
          attempt.updated_at AS "updatedAt",
          attempt.result_snapshot AS "resultSnapshot",
          publication.test_id::text AS "testId",
          publication.test_version_id::text AS "testVersionId",
          publication.id::text AS "publicationId"
        FROM learning.attempts attempt
        JOIN assessment.test_publications publication ON publication.id = attempt.test_publication_id
        WHERE attempt.user_id = ${userId}::uuid
          AND attempt.test_publication_id = ${publicationId}::uuid
          AND attempt.status = 'in_progress'
        ORDER BY attempt.started_at DESC
        LIMIT 1
        FOR UPDATE OF attempt
      `;

      if (activeRows[0]) {
        const row = activeRows[0] as Record<string, unknown>;
        const snapshot = readAttemptSessionSnapshot(row.resultSnapshot, { testId, testVersionId, seriesId });
        if (snapshot.seriesId == null && seriesId) {
          snapshot.seriesId = seriesId;
          snapshot.savedAt = new Date().toISOString();
          await sql`
            UPDATE learning.attempts
            SET result_snapshot = ${JSON.stringify(snapshot)}::jsonb,
                updated_at = now()
            WHERE id = ${String(row.id)}::uuid
          `;
          row.updatedAt = new Date().toISOString();
        }
        return sessionResponse(row, snapshot);
      }

      const sequenceRows = await sql`
        SELECT COALESCE(MAX(attempt.attempt_number), 0)::int + 1 AS "attemptNumber"
        FROM learning.attempts attempt
        WHERE attempt.user_id = ${userId}::uuid
          AND attempt.test_publication_id = ${publicationId}::uuid
      `;
      const attemptNumber = Number(sequenceRows[0]?.attemptNumber ?? 1);
      const maxAttempts = resolveAttemptLimit(publication.settings);
      if (attemptNumber > maxAttempts) {
        throw new AttemptReliabilityError(
          "ATTEMPT_LIMIT_REACHED",
          `You have reached the ${maxAttempts}-attempt limit for this test`,
          409,
          { maxAttempts },
        );
      }
      const snapshot = createAttemptSessionSnapshot({ testId, testVersionId, seriesId });
      const inserted = await sql`
        INSERT INTO learning.attempts (
          user_id,
          test_publication_id,
          attempt_number,
          status,
          started_at,
          time_spent_seconds,
          result_snapshot,
          created_at,
          updated_at
        ) VALUES (
          ${userId}::uuid,
          ${publicationId}::uuid,
          ${attemptNumber},
          'in_progress',
          now(),
          0,
          ${JSON.stringify(snapshot)}::jsonb,
          now(),
          now()
        )
        RETURNING
          id::text AS id,
          attempt_number AS "attemptNumber",
          status,
          started_at AS "startedAt",
          updated_at AS "updatedAt"
      `;
      const row = {
        ...(inserted[0] as Record<string, unknown>),
        testId,
        testVersionId,
        publicationId,
      };
      return sessionResponse(row, snapshot);
    });

    res.status(201).json(result);
  } catch (error) {
    if (error instanceof AttemptReliabilityError) {
      const details = error.details && typeof error.details === "object" && !Array.isArray(error.details)
        ? error.details as Record<string, unknown>
        : {};
      res.status(error.statusCode).json({ error: error.message, code: error.code, ...details });
      return;
    }
    console.error("Unable to start canonical attempt session", error);
    res.status(500).json({ error: "Unable to start this test safely", code: "ATTEMPT_SESSION_START_FAILED" });
  }
});

router.get("/attempt-sessions/:id", authenticate, async (req, res) => {
  const attemptId = asString(req.params.id, 120);
  if (!isUuid(attemptId)) {
    res.status(400).json({ error: "Invalid attempt session", code: "ATTEMPT_SESSION_INVALID" });
    return;
  }

  try {
    const rows = await sqlClient`
      SELECT
        attempt.id::text AS id,
        attempt.attempt_number AS "attemptNumber",
        attempt.status,
        attempt.started_at AS "startedAt",
        attempt.updated_at AS "updatedAt",
        attempt.result_snapshot AS "resultSnapshot",
        publication.test_id::text AS "testId",
        publication.test_version_id::text AS "testVersionId",
        publication.id::text AS "publicationId"
      FROM learning.attempts attempt
      JOIN assessment.test_publications publication ON publication.id = attempt.test_publication_id
      JOIN identity.auth_identities identity
        ON identity.user_id = attempt.user_id
       AND identity.provider = 'firebase'
      WHERE attempt.id = ${attemptId}::uuid
        AND identity.provider_subject = ${req.user!.id}
      LIMIT 1
    `;
    const row = rows[0] as Record<string, unknown> | undefined;
    if (!row) {
      res.status(404).json({ error: "Attempt session not found", code: "ATTEMPT_SESSION_NOT_FOUND" });
      return;
    }
    if (["evaluated", "practice_evaluated"].includes(String(row.status))) {
      res.status(409).json({ error: "This attempt has already been submitted", code: "ATTEMPT_ALREADY_SUBMITTED", result: row.resultSnapshot });
      return;
    }
    const snapshot = readAttemptSessionSnapshot(row.resultSnapshot, {
      testId: String(row.testId),
      testVersionId: String(row.testVersionId),
    });
    res.json(sessionResponse(row, snapshot));
  } catch (error) {
    console.error("Unable to load canonical attempt session", error);
    res.status(500).json({ error: "Unable to load saved progress", code: "ATTEMPT_SESSION_READ_FAILED" });
  }
});

router.patch("/attempt-sessions/:id", authenticate, async (req, res) => {
  const attemptId = asString(req.params.id, 120);
  const expectedRevision = finiteRevision(req.body?.expectedRevision);
  if (!isUuid(attemptId) || expectedRevision < 0) {
    res.status(400).json({ error: "Invalid attempt session update", code: "ATTEMPT_SESSION_UPDATE_INVALID" });
    return;
  }

  try {
    const result = await sqlClient.begin(async (sql) => {
      const rows = await sql`
        SELECT
          attempt.id::text AS id,
          attempt.attempt_number AS "attemptNumber",
          attempt.status,
          attempt.started_at AS "startedAt",
          attempt.updated_at AS "updatedAt",
          attempt.result_snapshot AS "resultSnapshot",
          publication.test_id::text AS "testId",
          publication.test_version_id::text AS "testVersionId",
          publication.id::text AS "publicationId"
        FROM learning.attempts attempt
        JOIN assessment.test_publications publication ON publication.id = attempt.test_publication_id
        JOIN identity.auth_identities identity
          ON identity.user_id = attempt.user_id
         AND identity.provider = 'firebase'
        WHERE attempt.id = ${attemptId}::uuid
          AND identity.provider_subject = ${req.user!.id}
        LIMIT 1
        FOR UPDATE OF attempt
      `;
      const row = rows[0] as Record<string, unknown> | undefined;
      if (!row) throw new AttemptReliabilityError("ATTEMPT_SESSION_NOT_FOUND", "Attempt session not found", 404);
      if (String(row.status) !== "in_progress") {
        throw new AttemptReliabilityError(
          "ATTEMPT_ALREADY_SUBMITTED",
          "This attempt has already been submitted",
          409,
          { result: row.resultSnapshot },
        );
      }
      const current = readAttemptSessionSnapshot(row.resultSnapshot, {
        testId: String(row.testId),
        testVersionId: String(row.testVersionId),
      });
      let next: AttemptSessionSnapshot;
      try {
        next = advanceAttemptSessionSnapshot({ current, expectedRevision, state: req.body?.state });
      } catch (error) {
        if (error instanceof AttemptReliabilityError && error.code === "ATTEMPT_SESSION_CONFLICT") {
          throw new AttemptReliabilityError(
            error.code,
            error.message,
            error.statusCode,
            { session: sessionResponse(row, current) },
          );
        }
        throw error;
      }
      await sql`
        UPDATE learning.attempts
        SET result_snapshot = ${JSON.stringify(next)}::jsonb,
            updated_at = now()
        WHERE id = ${attemptId}::uuid
      `;
      row.updatedAt = new Date().toISOString();
      return sessionResponse(row, next);
    });
    res.json(result);
  } catch (error) {
    if (error instanceof AttemptReliabilityError) {
      const details = error.details && typeof error.details === "object" && !Array.isArray(error.details)
        ? error.details as Record<string, unknown>
        : {};
      res.status(error.statusCode).json({ error: error.message, code: error.code, ...details });
      return;
    }
    console.error("Unable to save canonical attempt session", error);
    res.status(500).json({ error: "Unable to save test progress", code: "ATTEMPT_SESSION_SAVE_FAILED" });
  }
});

export default router;

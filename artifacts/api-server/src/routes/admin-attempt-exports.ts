import { randomUUID } from 'node:crypto';
import { Router } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import { authenticate } from '../middlewares/auth';

const router = Router();
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const text = (value: unknown, maximum = 1000) => typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').slice(0, maximum) : '';

router.use(authenticate);

router.get('/exports', requireAdminPermission('users.students.read'), async (_req, res) => {
  try {
    const rows = await sqlClient`
      SELECT ae.id::text AS id, ae.entity_id::text AS "attemptId", ae.reason,
        ae.occurred_at AS "occurredAt", actor.display_name AS "actorName",
        ae.metadata ->> 'registrationCode' AS "registrationCode",
        ae.metadata ->> 'testPublicCode' AS "testPublicCode",
        ae.metadata ->> 'testTitle' AS "testTitle",
        ae.metadata ->> 'fileName' AS "fileName"
      FROM platform.audit_events ae
      LEFT JOIN identity.users actor ON actor.id = ae.actor_user_id
      WHERE ae.action_key = 'student.attempt.evidence_exported'
      ORDER BY ae.occurred_at DESC
      LIMIT 100
    `;
    return res.json({ exports: rows, generatedAt: new Date().toISOString() });
  } catch (error) {
    console.error('Unable to load attempt export history', error);
    return res.status(500).json({ error: 'Unable to load export history', code: 'ATTEMPT_EXPORT_HISTORY_FAILED' });
  }
});

router.post('/:attemptId/exports', requireAdminPermission('users.students.manage'), async (req, res) => {
  const attemptId = text(req.params.attemptId, 80);
  const reason = text(req.body?.reason);
  if (!uuid.test(attemptId)) return res.status(400).json({ error: 'Invalid attempt ID', code: 'INVALID_ATTEMPT_ID' });
  if (reason.length < 20) return res.status(400).json({ error: 'Provide an export reason of at least 20 characters', code: 'ATTEMPT_EXPORT_REASON_REQUIRED' });

  try {
    const bundle = await sqlClient.begin(async (tx) => {
      const attempts = await tx`
        SELECT a.id::text AS id, a.attempt_number AS "attemptNumber", a.status::text AS status,
          a.started_at AS "startedAt", a.submitted_at AS "submittedAt", a.evaluated_at AS "evaluatedAt",
          a.updated_at AS "updatedAt", a.time_spent_seconds AS "timeSpentSeconds",
          a.raw_score AS "rawScore", a.final_score AS "finalScore", a.correct_count AS "correctCount",
          a.incorrect_count AS "incorrectCount", a.unattempted_count AS "unattemptedCount",
          a.result_snapshot AS "resultSnapshot", u.id::text AS "studentId", u.display_name AS "studentName",
          u.email AS "studentEmail", u.status::text AS "studentStatus", sp.registration_code AS "registrationCode",
          t.id::text AS "testId", t.public_code AS "testPublicCode", tv.id::text AS "testVersionId",
          tv.title AS "testTitle", tv.duration_seconds AS "durationSeconds", p.id::text AS "publicationId",
          p.publication_number AS "publicationNumber", p.published_at AS "publishedAt", p.closes_at AS "closesAt",
          (SELECT COUNT(*)::int FROM assessment.test_questions tq WHERE tq.test_version_id = tv.id) AS "questionCount"
        FROM learning.attempts a
        JOIN identity.users u ON u.id = a.user_id
        JOIN identity.student_profiles sp ON sp.user_id = u.id
        JOIN assessment.test_publications p ON p.id = a.test_publication_id
        JOIN assessment.tests t ON t.id = p.test_id
        JOIN assessment.test_versions tv ON tv.id = p.test_version_id
        WHERE a.id = ${attemptId}::uuid
        LIMIT 1
      `;
      const attempt = attempts[0];
      if (!attempt) throw Object.assign(new Error('Attempt not found'), { status: 404, code: 'ATTEMPT_NOT_FOUND' });

      const [events, investigations] = await Promise.all([
        tx`
          SELECT ae.id::text AS id, ae.action_key AS "actionKey", ae.summary, ae.reason,
            ae.occurred_at AS "occurredAt", actor.display_name AS "actorName", ae.metadata
          FROM platform.audit_events ae
          LEFT JOIN identity.users actor ON actor.id = ae.actor_user_id
          WHERE ae.entity_type = 'attempt' AND ae.entity_id = ${attemptId}::uuid
          ORDER BY ae.occurred_at ASC, ae.id ASC
          LIMIT 500
        `,
        tx`
          SELECT ae.metadata ->> 'caseId' AS "caseId", ae.metadata ->> 'category' AS category,
            ae.metadata ->> 'state' AS state, ae.action_key AS "actionKey", ae.reason,
            ae.occurred_at AS "occurredAt", actor.display_name AS "actorName"
          FROM platform.audit_events ae
          LEFT JOIN identity.users actor ON actor.id = ae.actor_user_id
          WHERE ae.entity_type = 'attempt' AND ae.entity_id = ${attemptId}::uuid
            AND ae.metadata ? 'caseId'
          ORDER BY ae.occurred_at ASC, ae.id ASC
          LIMIT 500
        `,
      ]);

      const issues: Array<{ code: string; severity: 'warning' | 'critical'; detail: string }> = [];
      const completed = ['evaluated', 'practice_evaluated'].includes(String(attempt.status));
      const counts = [attempt.correctCount, attempt.incorrectCount, attempt.unattemptedCount];
      if (completed && attempt.resultSnapshot == null) issues.push({ code: 'MISSING_RESULT_SNAPSHOT', severity: 'critical', detail: 'Completed attempt has no canonical result snapshot.' });
      if (completed && !attempt.evaluatedAt) issues.push({ code: 'MISSING_EVALUATED_AT', severity: 'critical', detail: 'Completed attempt has no evaluation timestamp.' });
      if (completed && (attempt.rawScore == null || attempt.finalScore == null)) issues.push({ code: 'MISSING_SCORE_FIELDS', severity: 'critical', detail: 'Completed attempt has incomplete score fields.' });
      if (completed && counts.some((value) => value == null)) issues.push({ code: 'MISSING_RESPONSE_COUNTS', severity: 'warning', detail: 'Completed attempt has incomplete response counts.' });
      if (counts.every((value) => value != null) && counts.reduce((sum, value) => sum + Number(value), 0) !== Number(attempt.questionCount)) issues.push({ code: 'RESPONSE_COUNT_MISMATCH', severity: 'critical', detail: 'Stored response counts do not equal the published test question count.' });
      if (Number(attempt.timeSpentSeconds) < 0) issues.push({ code: 'NEGATIVE_TIME_SPENT', severity: 'critical', detail: 'Recorded time spent is negative.' });
      if (Number(attempt.timeSpentSeconds) > Math.max(Number(attempt.durationSeconds) * 3, Number(attempt.durationSeconds) + 3600)) issues.push({ code: 'EXCESSIVE_TIME_SPENT', severity: 'warning', detail: 'Recorded time substantially exceeds the published duration.' });

      const exportedAt = new Date().toISOString();
      const fileName = `examtree-attempt-${attemptId}-${exportedAt.slice(0, 10)}.json`;
      const exportEventId = randomUUID();
      await tx`
        INSERT INTO platform.audit_events (
          id, actor_type, actor_user_id, effective_role_key, action_key,
          entity_type, entity_id, reason, summary, metadata
        ) VALUES (
          ${exportEventId}::uuid, 'user'::audit_actor_type,
          ${req.adminSession?.user.id ?? null}::uuid, ${req.adminSession?.roles[0] ?? null},
          'student.attempt.evidence_exported', 'attempt', ${attemptId}::uuid,
          ${reason}, 'Exported privacy-scoped attempt evidence package',
          ${tx.json({
            fileName,
            registrationCode: String(attempt.registrationCode),
            testPublicCode: String(attempt.testPublicCode),
            testTitle: String(attempt.testTitle),
            includedResultSnapshot: attempt.resultSnapshot != null,
            includedAuditEventCount: events.length,
            includedInvestigationEventCount: investigations.length,
            scoreFieldsChanged: false,
            resultSnapshotChanged: false,
          })}
        )
      `;

      return {
        fileName,
        payload: {
          manifest: {
            schema: 'examtree.attempt-evidence.v1',
            exportedAt,
            exportReason: reason,
            exportAuditEventId: exportEventId,
            privacy: {
              includesCanonicalStudentIdentity: true,
              excludesAuthenticationIdentities: true,
              excludesSessionsAndTokens: true,
              excludesPaymentAndEntitlementData: true,
            },
            immutableEvidence: true,
            scoreMutationAllowed: false,
          },
          attempt,
          integrity: {
            state: issues.some((issue) => issue.severity === 'critical') ? 'critical' : issues.length ? 'warning' : 'clean',
            issues,
          },
          investigations,
          auditTimeline: events,
        },
      };
    });

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${bundle.fileName}"`);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send(JSON.stringify(bundle.payload, null, 2));
  } catch (error) {
    const typed = error as { status?: number; code?: string; message?: string };
    console.error('Unable to export attempt evidence', error);
    return res.status(typed.status ?? 500).json({ error: typed.message || 'Unable to export attempt evidence', code: typed.code || 'ATTEMPT_EXPORT_FAILED' });
  }
});

export default router;

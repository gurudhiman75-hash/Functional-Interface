import { Router, type IRouter } from "express";

import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router: IRouter = Router();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const maxSelectedExams = 12;

async function canonicalStudentId(firebaseUid: string): Promise<string | null> {
  const rows = await sqlClient`
    SELECT sp.user_id::text AS id
    FROM identity.auth_identities ai
    JOIN identity.users u
      ON u.id = ai.user_id
     AND u.deleted_at IS NULL
     AND u.status = 'active'::user_status
    JOIN identity.student_profiles sp ON sp.user_id = u.id
    WHERE ai.provider = 'firebase'
      AND ai.provider_subject = ${firebaseUid}
    LIMIT 1
  `;
  return rows[0]?.id ? String(rows[0].id) : null;
}

function selectedIds(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  const ids = [...new Set(value.map((item) => String(item).trim()).filter(Boolean))];
  if (ids.length > maxSelectedExams || ids.some((id) => !uuidPattern.test(id))) return null;
  return ids;
}

router.get("/exam-catalog", authenticate, async (_req, res) => {
  try {
    const [families, exams] = await Promise.all([
      sqlClient`
        SELECT
          f.id::text AS id,
          f.code,
          f.name,
          COALESCE(f.description, '') AS description,
          COUNT(e.id)::int AS "examCount"
        FROM catalog.exam_families f
        JOIN catalog.exams e
          ON e.family_id = f.id
         AND e.is_active = true
        JOIN catalog.exam_versions ev
          ON ev.exam_id = e.id
         AND ev.is_current = true
        WHERE f.is_active = true
        GROUP BY f.id
        ORDER BY f.name
      `,
      sqlClient`
        SELECT
          e.id::text AS id,
          e.family_id::text AS "familyId",
          e.code,
          e.name,
          COALESCE(e.description, '') AS description,
          ev.id::text AS "currentVersionId",
          COALESCE((
            SELECT json_agg(
              json_build_object(
                'code', language.code,
                'name', language.name,
                'nativeName', language.native_name,
                'isPrimary', evl.is_primary
              ) ORDER BY evl.is_primary DESC, language.name
            )
            FROM catalog.exam_version_languages evl
            JOIN catalog.languages language ON language.id = evl.language_id
            WHERE evl.exam_version_id = ev.id
              AND language.is_active = true
          ), '[]'::json) AS languages,
          COALESCE((
            SELECT COUNT(*)::int
            FROM assessment.tests test
            WHERE test.exam_version_id = ev.id
              AND test.status = 'live'::test_status
              AND test.deleted_at IS NULL
              AND EXISTS (
                SELECT 1
                FROM assessment.test_publications publication
                WHERE publication.test_id = test.id
                  AND publication.test_version_id = test.published_version_id
                  AND publication.published_at IS NOT NULL
                  AND (publication.closes_at IS NULL OR publication.closes_at > now())
              )
          ), 0) AS "liveTestCount"
        FROM catalog.exams e
        JOIN catalog.exam_families f
          ON f.id = e.family_id
         AND f.is_active = true
        JOIN catalog.exam_versions ev
          ON ev.exam_id = e.id
         AND ev.is_current = true
        WHERE e.is_active = true
        ORDER BY f.name, e.name
      `,
    ]);

    res.json({
      families,
      exams,
      maxSelectedExams,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Unable to load learner exam catalogue", error);
    res.status(500).json({
      error: "Unable to load exam catalogue",
      code: "EXAM_CATALOG_LOAD_FAILED",
    });
  }
});

router.get("/me/exam-preferences", authenticate, async (req, res) => {
  const firebaseUid = req.user?.id?.trim() ?? "";
  if (!firebaseUid) {
    res.status(401).json({ error: "Sign in again.", code: "REAUTH_REQUIRED" });
    return;
  }

  try {
    const userId = await canonicalStudentId(firebaseUid);
    if (!userId) {
      res.status(409).json({
        error: "Complete account setup before choosing exams.",
        code: "STUDENT_PROFILE_REQUIRED",
      });
      return;
    }

    const preferences = await sqlClient`
      SELECT
        preference.exam_id::text AS "examId",
        preference.position,
        e.code AS "examCode",
        e.name AS "examName",
        family.id::text AS "familyId",
        family.code AS "familyCode",
        family.name AS "familyName"
      FROM identity.student_exam_preferences preference
      JOIN catalog.exams e ON e.id = preference.exam_id
      JOIN catalog.exam_families family ON family.id = e.family_id
      WHERE preference.user_id = ${userId}::uuid
      ORDER BY preference.position
    `;

    res.json({
      selectedExamIds: preferences.map((item) => String(item.examId)),
      preferences,
      maxSelectedExams,
    });
  } catch (error) {
    console.error("Unable to load learner exam preferences", error);
    res.status(500).json({
      error: "Unable to load your selected exams",
      code: "EXAM_PREFERENCES_LOAD_FAILED",
    });
  }
});

router.put("/me/exam-preferences", authenticate, async (req, res) => {
  const firebaseUid = req.user?.id?.trim() ?? "";
  if (!firebaseUid) {
    res.status(401).json({ error: "Sign in again.", code: "REAUTH_REQUIRED" });
    return;
  }

  const examIds = selectedIds(req.body?.examIds);
  if (examIds == null) {
    res.status(400).json({
      error: `Choose up to ${maxSelectedExams} valid exams.`,
      code: "INVALID_EXAM_PREFERENCES",
    });
    return;
  }

  try {
    const userId = await canonicalStudentId(firebaseUid);
    if (!userId) {
      res.status(409).json({
        error: "Complete account setup before choosing exams.",
        code: "STUDENT_PROFILE_REQUIRED",
      });
      return;
    }

    if (examIds.length > 0) {
      const validRows = await sqlClient`
        SELECT e.id::text AS id
        FROM catalog.exams e
        JOIN catalog.exam_families family
          ON family.id = e.family_id
         AND family.is_active = true
        JOIN catalog.exam_versions version
          ON version.exam_id = e.id
         AND version.is_current = true
        WHERE e.id = ANY(${examIds}::uuid[])
          AND e.is_active = true
      `;
      const validIds = new Set(validRows.map((row) => String(row.id)));
      if (validIds.size !== examIds.length || examIds.some((id) => !validIds.has(id))) {
        res.status(400).json({
          error: "One or more selected exams are no longer available.",
          code: "EXAM_PREFERENCE_UNAVAILABLE",
        });
        return;
      }
    }

    await sqlClient.begin(async (tx) => {
      await tx`
        DELETE FROM identity.student_exam_preferences
        WHERE user_id = ${userId}::uuid
      `;
      for (const [position, examId] of examIds.entries()) {
        await tx`
          INSERT INTO identity.student_exam_preferences (
            user_id, exam_id, position, created_at, updated_at
          ) VALUES (
            ${userId}::uuid, ${examId}::uuid, ${position}, now(), now()
          )
        `;
      }
    });

    res.json({ selectedExamIds: examIds, maxSelectedExams });
  } catch (error) {
    console.error("Unable to save learner exam preferences", error);
    res.status(500).json({
      error: "Unable to save your selected exams",
      code: "EXAM_PREFERENCES_SAVE_FAILED",
    });
  }
});

export default router;

import { randomUUID } from "node:crypto";

import { APPROVED_EXAMS } from "./approved-exam-catalogue";
import { sqlClient } from "./db";
import { logger } from "./logger";

const DEFAULT_MESSAGE = "Tests are being prepared. No questions are available yet.";

function normalized(value: unknown): string {
  return String(value ?? "").trim().toLowerCase();
}

function seriesCode(examCode: string): string {
  const base = examCode.toUpperCase().replace(/[^A-Z0-9_-]+/g, "_").replace(/^_+|_+$/g, "");
  return (base + "_TEST_SERIES").slice(0, 120);
}

export async function ensureApprovedExamTestSeries(): Promise<{
  createdSeries: number;
  existingSeries: number;
  createdPlaceholderVersions: number;
  missingExams: number;
}> {
  const exams = await sqlClient`
    SELECT e.id::text AS id, e.code, e.name
    FROM catalog.exams e
    JOIN catalog.exam_families f ON f.id = e.family_id
    WHERE e.is_active = true
      AND f.is_active = true
  `;

  const byCode = new Map(exams.map((exam) => [String(exam.code).toUpperCase(), exam]));
  const byName = new Map(exams.map((exam) => [normalized(exam.name), exam]));

  let createdSeries = 0;
  let existingSeries = 0;
  let createdPlaceholderVersions = 0;
  let missingExams = 0;

  await sqlClient.begin(async (tx) => {
    for (const approved of APPROVED_EXAMS) {
      const exam = byCode.get(approved.code) ?? byName.get(normalized(approved.name));
      if (!exam) {
        missingExams += 1;
        logger.warn({ examCode: approved.code, examName: approved.name }, "Approved exam is unavailable for test-series bootstrap");
        continue;
      }

      const activeSeries = await tx`
        SELECT s.id::text AS id
        FROM assessment.test_series s
        JOIN catalog.exam_versions ev ON ev.id = s.exam_version_id
        WHERE ev.exam_id = ${String(exam.id)}::uuid
          AND s.deleted_at IS NULL
        LIMIT 1
      `;
      if (activeSeries[0]) {
        existingSeries += 1;
        continue;
      }

      let versions = await tx`
        SELECT id::text AS id, version_number AS "versionNumber", is_current AS "isCurrent"
        FROM catalog.exam_versions
        WHERE exam_id = ${String(exam.id)}::uuid
        ORDER BY is_current DESC, version_number DESC
        LIMIT 1
      `;

      if (!versions[0]) {
        const placeholderVersionId = randomUUID();
        await tx`
          INSERT INTO catalog.exam_versions (
            id, exam_id, version_number, name, is_current
          ) VALUES (
            ${placeholderVersionId}::uuid,
            ${String(exam.id)}::uuid,
            1,
            'Test-series catalogue shell',
            false
          )
        `;
        versions = [{ id: placeholderVersionId, versionNumber: 1, isCurrent: false }];
        createdPlaceholderVersions += 1;
      }

      const examVersionId = String(versions[0].id);
      const code = seriesCode(String(exam.code));
      const codeConflict = await tx`
        SELECT id::text AS id
        FROM assessment.test_series
        WHERE upper(code) = ${code}
        LIMIT 1
      `;
      if (codeConflict[0]) {
        existingSeries += 1;
        logger.warn({ examCode: String(exam.code), seriesCode: code }, "Approved test-series code already exists");
        continue;
      }

      const seriesId = randomUUID();
      const seriesVersionId = randomUUID();
      const name = String(exam.name) + " Test Series";
      const description =
        "Structured ExamTree mock-test series for " + String(exam.name) +
        ". Tests will appear here as they are prepared, reviewed and published.";

      await tx`
        INSERT INTO assessment.test_series (
          id, exam_version_id, code, name, current_version_number,
          created_by, created_at, updated_at
        ) VALUES (
          ${seriesId}::uuid,
          ${examVersionId}::uuid,
          ${code},
          ${name},
          1,
          NULL,
          now(),
          now()
        )
      `;

      await tx`
        INSERT INTO assessment.test_series_versions (
          id, series_id, version_number, description,
          availability_start_at, availability_end_at,
          progression_mode, completion_threshold, configuration,
          change_reason, created_by, created_at
        ) VALUES (
          ${seriesVersionId}::uuid,
          ${seriesId}::uuid,
          1,
          ${description},
          NULL,
          NULL,
          'open',
          NULL,
          ${tx.json({
            learnerVisibility: "coming_soon",
            learnerMessage: DEFAULT_MESSAGE,
            hubStage: "general",
            hubType: "full-length",
            bootstrapSource: "approved_exam_catalogue",
          })},
          'Created approved exam test-series shell',
          NULL,
          now()
        )
      `;

      createdSeries += 1;
    }
  });

  logger.info(
    {
      createdSeries,
      existingSeries,
      createdPlaceholderVersions,
      missingExams,
      totalApprovedExams: APPROVED_EXAMS.length,
    },
    "Approved exam test series ensured",
  );

  return { createdSeries, existingSeries, createdPlaceholderVersions, missingExams };
}

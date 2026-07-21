import { languageCodesFromSettings } from "./admin-translation-operations";
import { sqlClient } from "./db";

type SqlExecutor = typeof sqlClient;

export type TestLocalizationIssue = {
  code: string;
  message: string;
  languageCode?: string;
  questionVersionId?: string;
  testSectionId?: string;
};

export type TestLocalizationLanguageReadiness = {
  languageCode: string;
  sourceLanguage: boolean;
  allowedForExam: boolean;
  metadataStatus: string;
  sectionCount: number;
  translatedSectionCount: number;
  questionCount: number;
  approvedQuestionCount: number;
  complete: boolean;
};

export type TestLocalizationReadiness = {
  ready: boolean;
  languageCodes: string[];
  languages: TestLocalizationLanguageReadiness[];
  issues: TestLocalizationIssue[];
};

export async function evaluateTestLocalizationReadiness(input: {
  testVersionId: string;
  examVersionId: string;
  settings: unknown;
  client?: SqlExecutor;
}): Promise<TestLocalizationReadiness> {
  const client = input.client ?? sqlClient;
  const languageCodes = languageCodesFromSettings(input.settings);
  const issues: TestLocalizationIssue[] = [];

  const allowedRows = await client`
    SELECT lower(l.code) AS code
    FROM catalog.exam_version_languages evl
    JOIN catalog.languages l ON l.id = evl.language_id
    WHERE evl.exam_version_id = ${input.examVersionId}::uuid
      AND l.is_active = true
  `;
  const allowed = new Set(allowedRows.map((row) => String(row.code)));

  const countRows = await client`
    SELECT
      (SELECT COUNT(*)::int FROM assessment.test_sections
        WHERE test_version_id = ${input.testVersionId}::uuid) AS "sectionCount",
      (SELECT COUNT(*)::int FROM assessment.test_questions
        WHERE test_version_id = ${input.testVersionId}::uuid) AS "questionCount"
  `;
  const sectionCount = Number(countRows[0]?.sectionCount ?? 0);
  const questionCount = Number(countRows[0]?.questionCount ?? 0);

  const languages: TestLocalizationLanguageReadiness[] = [];
  for (const languageCode of languageCodes) {
    const sourceLanguage = languageCode === "en";
    const allowedForExam = allowed.has(languageCode);
    if (!allowedForExam) {
      issues.push({
        code: "TEST_LANGUAGE_NOT_ALLOWED_FOR_EXAM",
        languageCode,
        message: `Language ${languageCode} is not active for this exam version.`,
      });
    }

    if (sourceLanguage) {
      languages.push({
        languageCode,
        sourceLanguage,
        allowedForExam,
        metadataStatus: "source",
        sectionCount,
        translatedSectionCount: sectionCount,
        questionCount,
        approvedQuestionCount: questionCount,
        complete: allowedForExam,
      });
      continue;
    }

    const rows = await client`
      SELECT
        COALESCE(tvt.status, 'missing') AS "metadataStatus",
        (SELECT COUNT(*)::int
          FROM assessment.test_section_translations tst
          JOIN assessment.test_sections section ON section.id = tst.test_section_id
          JOIN catalog.languages section_language ON section_language.id = tst.language_id
          WHERE section.test_version_id = ${input.testVersionId}::uuid
            AND lower(section_language.code) = ${languageCode}) AS "translatedSectionCount",
        (SELECT COUNT(DISTINCT tq.question_version_id)::int
          FROM assessment.test_questions tq
          JOIN content.question_translations qt ON qt.question_version_id = tq.question_version_id
          JOIN catalog.languages question_language ON question_language.id = qt.language_id
          WHERE tq.test_version_id = ${input.testVersionId}::uuid
            AND lower(question_language.code) = ${languageCode}
            AND qt.status = 'approved'
            AND (SELECT COUNT(*) FROM content.question_options qo
                 WHERE qo.question_version_id = tq.question_version_id)
              = (SELECT COUNT(*) FROM content.question_translation_options qto
                 WHERE qto.question_translation_id = qt.id)) AS "approvedQuestionCount"
      FROM catalog.languages l
      LEFT JOIN assessment.test_version_translations tvt
        ON tvt.language_id = l.id
       AND tvt.test_version_id = ${input.testVersionId}::uuid
      WHERE lower(l.code) = ${languageCode}
      LIMIT 1
    `;
    const row = rows[0];
    const metadataStatus = String(row?.metadataStatus ?? "missing");
    const translatedSectionCount = Number(row?.translatedSectionCount ?? 0);
    const approvedQuestionCount = Number(row?.approvedQuestionCount ?? 0);

    if (metadataStatus !== "approved") {
      issues.push({
        code: "TEST_TRANSLATION_NOT_APPROVED",
        languageCode,
        message: `Test metadata for ${languageCode} is not approved.`,
      });
    }
    if (translatedSectionCount !== sectionCount) {
      issues.push({
        code: "TEST_SECTION_TRANSLATION_INCOMPLETE",
        languageCode,
        message: `${translatedSectionCount} of ${sectionCount} section labels are translated for ${languageCode}.`,
      });
    }
    if (approvedQuestionCount !== questionCount) {
      const missingRows = await client`
        SELECT tq.question_version_id::text AS "questionVersionId"
        FROM assessment.test_questions tq
        LEFT JOIN catalog.languages l ON lower(l.code) = ${languageCode}
        LEFT JOIN content.question_translations qt
          ON qt.question_version_id = tq.question_version_id
         AND qt.language_id = l.id
         AND qt.status = 'approved'
        WHERE tq.test_version_id = ${input.testVersionId}::uuid
          AND (
            qt.id IS NULL
            OR (SELECT COUNT(*) FROM content.question_options qo
                WHERE qo.question_version_id = tq.question_version_id)
              <> (SELECT COUNT(*) FROM content.question_translation_options qto
                  WHERE qto.question_translation_id = qt.id)
          )
        ORDER BY tq.position
        LIMIT 100
      `;
      for (const missing of missingRows) {
        issues.push({
          code: "TEST_QUESTION_TRANSLATION_INCOMPLETE",
          languageCode,
          questionVersionId: String(missing.questionVersionId),
          message: `Question ${String(missing.questionVersionId)} lacks a complete approved ${languageCode} translation.`,
        });
      }
    }

    languages.push({
      languageCode,
      sourceLanguage,
      allowedForExam,
      metadataStatus,
      sectionCount,
      translatedSectionCount,
      questionCount,
      approvedQuestionCount,
      complete:
        allowedForExam
        && metadataStatus === "approved"
        && translatedSectionCount === sectionCount
        && approvedQuestionCount === questionCount,
    });
  }

  if (languageCodes.length === 0) {
    issues.push({ code: "TEST_LANGUAGE_MISSING", message: "Test has no configured language." });
  }

  return {
    ready: issues.length === 0 && languages.every((language) => language.complete),
    languageCodes,
    languages,
    issues,
  };
}

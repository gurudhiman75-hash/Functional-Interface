import { randomUUID } from "node:crypto";

import { sqlClient } from "./db";
import { logger } from "./logger";

const DEFAULT_MESSAGE = "Tests are being prepared. No questions are available yet.";

type TestSeriesTarget = {
  codes: readonly string[];
  names: readonly string[];
  seriesName: string;
};

const TARGETS: readonly TestSeriesTarget[] = [
  { codes: ["SSC_CGL"], names: ["SSC CGL"], seriesName: "SSC CGL Test Series" },
  { codes: ["SSC_CHSL"], names: ["SSC CHSL"], seriesName: "SSC CHSL Test Series" },
  { codes: ["SSC_MTS"], names: ["SSC MTS", "SSC MTS & Havaldar"], seriesName: "SSC MTS & Havaldar Test Series" },
  { codes: ["SSC_CPO"], names: ["SSC CPO"], seriesName: "SSC CPO Test Series" },
  { codes: ["SSC_GD"], names: ["SSC GD", "SSC GD Constable"], seriesName: "SSC GD Constable Test Series" },
  { codes: ["SSC_STENOGRAPHER"], names: ["SSC Stenographer", "SSC Stenographer Grade C & D"], seriesName: "SSC Stenographer Grade C & D Test Series" },
  { codes: ["SSC_SELECTION_POST", "SSC_SELECTION_POSTS"], names: ["SSC Selection Post"], seriesName: "SSC Selection Post Test Series" },
  { codes: ["SSC_JE", "SSC_JUNIOR_ENGINEER"], names: ["SSC JE", "SSC Junior Engineer"], seriesName: "SSC JE Test Series" },

  { codes: ["IBPS_PO", "IBPS_PO_PRE", "IBPS_PO_PRELIMS"], names: ["IBPS PO"], seriesName: "IBPS PO Test Series" },
  { codes: ["IBPS_CLERK", "IBPS_CLERK_PRE", "IBPS_CLERK_PRELIMS", "IBPS_CSA"], names: ["IBPS Clerk", "IBPS Clerk / CSA"], seriesName: "IBPS Clerk / CSA Test Series" },
  { codes: ["IBPS_RRB_PO"], names: ["IBPS RRB PO", "IBPS RRB Officer Scale I"], seriesName: "IBPS RRB Officer Scale I Test Series" },
  { codes: ["IBPS_RRB_CLERK"], names: ["IBPS RRB Clerk", "IBPS RRB Office Assistant"], seriesName: "IBPS RRB Office Assistant Test Series" },
  { codes: ["SBI_PO", "SBI_PROBATIONARY_OFFICER"], names: ["SBI PO"], seriesName: "SBI PO Test Series" },
  { codes: ["SBI_CLERK", "SBI_JUNIOR_ASSOCIATE", "SBI_JA"], names: ["SBI Clerk", "SBI Clerk / Junior Associate"], seriesName: "SBI Clerk / Junior Associate Test Series" },
  { codes: ["RBI_ASSISTANT"], names: ["RBI Assistant"], seriesName: "RBI Assistant Test Series" },
  { codes: ["RBI_GRADE_B", "RBI_GRADE_B_OFFICER"], names: ["RBI Grade B"], seriesName: "RBI Grade B Test Series" },
  { codes: ["NABARD_GRADE_A"], names: ["NABARD Grade A"], seriesName: "NABARD Grade A Test Series" },
  { codes: ["SEBI_GRADE_A"], names: ["SEBI Grade A"], seriesName: "SEBI Grade A Test Series" },

  { codes: ["PUNJAB_POLICE_CONSTABLE"], names: ["Punjab Police Constable"], seriesName: "Punjab Police Constable Test Series" },
  { codes: ["PUNJAB_POLICE_SI", "PUNJAB_POLICE_SUB_INSPECTOR"], names: ["Punjab Police SI", "Punjab Police Sub-Inspector"], seriesName: "Punjab Police Sub-Inspector Test Series" },
  { codes: ["PSSSB_CLERK", "PSSSB_JUNIOR_ASSISTANT"], names: ["PSSSB Clerk", "PSSSB Clerk / Junior Assistant"], seriesName: "PSSSB Clerk / Junior Assistant Test Series" },
  { codes: ["PUNJAB_PATWARI", "PSSSB_PATWARI"], names: ["Punjab Patwari", "PSSSB Patwari"], seriesName: "Punjab Patwari Test Series" },
  { codes: ["PSSSB_EXCISE_TAXATION_INSPECTOR", "PUNJAB_EXCISE_TAXATION_INSPECTOR"], names: ["PSSSB Excise & Taxation Inspector", "Punjab Excise & Taxation Inspector"], seriesName: "PSSSB Excise & Taxation Inspector Test Series" },
  { codes: ["PUNJAB_NAIB_TEHSILDAR", "PPSC_NAIB_TEHSILDAR"], names: ["Punjab Naib Tehsildar", "PPSC Naib Tehsildar"], seriesName: "Punjab Naib Tehsildar Test Series" },
  { codes: ["PUNJAB_PCS", "PPSC_PCS", "PUNJAB_STATE_CIVIL_SERVICES"], names: ["Punjab PCS", "PPSC Punjab State Civil Services"], seriesName: "Punjab PCS Test Series" },
  { codes: ["PSSSB_SENIOR_ASSISTANT"], names: ["PSSSB Senior Assistant"], seriesName: "PSSSB Senior Assistant Test Series" },
  { codes: ["PSSSB_VDO", "PSSSB_GRAM_SEVAK", "PUNJAB_VDO"], names: ["PSSSB VDO", "PSSSB VDO / Gram Sevak"], seriesName: "PSSSB VDO / Gram Sevak Test Series" },
  { codes: ["PUNJAB_JAIL_WARDER", "PUNJAB_JAIL_MATRON"], names: ["Punjab Jail Warder", "Punjab Jail Warder / Matron"], seriesName: "Punjab Jail Warder / Matron Test Series" },
  { codes: ["PUNJAB_POLICE_INTELLIGENCE_ASSISTANT"], names: ["Punjab Police Intelligence Assistant"], seriesName: "Punjab Police Intelligence Assistant Test Series" },
  { codes: ["PSPCL_ALM", "PSPCL_ASSISTANT_LINEMAN"], names: ["PSPCL ALM", "PSPCL Assistant Lineman"], seriesName: "PSPCL Assistant Lineman Test Series" },
  { codes: ["PSPCL_REVENUE_ACCOUNTANT"], names: ["PSPCL Revenue Accountant"], seriesName: "PSPCL Revenue Accountant Test Series" },
];

function normalize(value: unknown): string {
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
  const byName = new Map(exams.map((exam) => [normalize(exam.name), exam]));

  let createdSeries = 0;
  let existingSeries = 0;
  let createdPlaceholderVersions = 0;
  let missingExams = 0;

  await sqlClient.begin(async (tx) => {
    for (const target of TARGETS) {
      const exam =
        target.codes.map((code) => byCode.get(code)).find(Boolean) ??
        target.names.map((name) => byName.get(normalize(name))).find(Boolean);

      if (!exam) {
        missingExams += 1;
        logger.warn({ targetCodes: target.codes, targetNames: target.names }, "Approved exam is unavailable for test-series bootstrap");
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

      const versions = await tx`
        SELECT id::text AS id, version_number AS "versionNumber", is_current AS "isCurrent"
        FROM catalog.exam_versions
        WHERE exam_id = ${String(exam.id)}::uuid
        ORDER BY is_current DESC, version_number DESC
        LIMIT 1
      `;

      let examVersionId = versions[0]?.id ? String(versions[0].id) : "";
      if (!examVersionId) {
        examVersionId = randomUUID();
        await tx`
          INSERT INTO catalog.exam_versions (
            id, exam_id, version_number, name, is_current
          ) VALUES (
            ${examVersionId}::uuid,
            ${String(exam.id)}::uuid,
            1,
            'Test-series catalogue shell',
            false
          )
        `;
        createdPlaceholderVersions += 1;
      }
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
          ${target.seriesName},
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
      totalApprovedExams: TARGETS.length,
    },
    "Approved exam test series ensured",
  );

  return { createdSeries, existingSeries, createdPlaceholderVersions, missingExams };
}

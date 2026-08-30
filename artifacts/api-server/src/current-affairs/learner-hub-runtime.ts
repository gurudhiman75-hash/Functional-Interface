import { sqlClient } from "../lib/db";

export type CurrentAffairsHubPeriod = "daily" | "weekly" | "monthly";
export type CurrentAffairsHubFamily = "ssc" | "banking" | "punjab" | "railways" | "general";

type HubResourceRow = {
  languageCode: string;
  publicCode: string;
  title: string;
  summary: string;
  contentDate: string | null;
  format: string;
};

function resourcesByLanguage(value: unknown) {
  const rows = Array.isArray(value) ? value : [];
  const resources: Record<string, HubResourceRow> = {};
  for (const raw of rows) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) continue;
    const row = raw as Record<string, unknown>;
    const languageCode = String(row.languageCode ?? "").toLowerCase();
    if (languageCode !== "en" && languageCode !== "hi" && languageCode !== "pa") continue;
    resources[languageCode] = {
      languageCode,
      publicCode: String(row.publicCode ?? ""),
      title: String(row.title ?? ""),
      summary: String(row.summary ?? ""),
      contentDate: row.contentDate == null ? null : String(row.contentDate).slice(0, 10),
      format: String(row.format ?? "article"),
    };
  }
  return resources;
}

export async function listCurrentAffairsLearnerHub(args: {
  periodType?: CurrentAffairsHubPeriod | null;
  examFamily?: CurrentAffairsHubFamily | null;
  limit?: number;
}) {
  const limit = Math.max(1, Math.min(100, Math.floor(args.limit ?? 50)));
  const periodType = args.periodType ?? null;
  const examFamily = args.examFamily ?? null;
  const rows = await sqlClient`
    SELECT
      release.public_code AS "releaseCode",
      release.period_type AS "periodType",
      release.period_start::text AS "periodStart",
      release.period_end::text AS "periodEnd",
      release.exam_family_key AS "examFamily",
      release.release_version::int AS "releaseVersion",
      release.approved_at AS "approvedAt",
      jsonb_agg(
        jsonb_build_object(
          'languageCode', link.language_code,
          'publicCode', resource.public_code,
          'title', resource.title,
          'summary', COALESCE(resource.summary, ''),
          'contentDate', resource.content_date,
          'format', resource.format
        )
        ORDER BY CASE link.language_code WHEN 'en' THEN 1 WHEN 'hi' THEN 2 ELSE 3 END
      ) AS resources,
      quiz.public_code AS "quizCode",
      quiz.item_count::int AS "quizItemCount",
      quiz.published_at AS "quizPublishedAt"
    FROM content.current_affairs_releases release
    JOIN content.current_affairs_release_compilations link
      ON link.release_id=release.id
    JOIN content.learning_resources resource
      ON resource.id=link.learning_resource_id
    LEFT JOIN content.current_affairs_quiz_deliveries quiz
      ON quiz.release_id=release.id
     AND quiz.status='published'
    WHERE release.status='approved'
      AND resource.status='published'
      AND resource.published_at IS NOT NULL
      AND resource.published_at <= now()
      AND (resource.expires_at IS NULL OR resource.expires_at > now())
      AND (${periodType}::text IS NULL OR release.period_type=${periodType})
      AND (${examFamily}::text IS NULL OR release.exam_family_key=${examFamily})
    GROUP BY release.id, quiz.id
    HAVING count(DISTINCT link.language_code) FILTER (WHERE link.language_code IN ('en','hi','pa')) = 3
    ORDER BY release.period_end DESC, release.approved_at DESC, release.exam_family_key
    LIMIT ${limit}
  `;

  return {
    packs: rows.map((row) => {
      const resources = resourcesByLanguage(row.resources);
      return {
        releaseCode: String(row.releaseCode),
        periodType: String(row.periodType) as CurrentAffairsHubPeriod,
        periodStart: String(row.periodStart).slice(0, 10),
        periodEnd: String(row.periodEnd).slice(0, 10),
        examFamily: String(row.examFamily) as CurrentAffairsHubFamily,
        releaseVersion: Number(row.releaseVersion),
        approvedAt: String(row.approvedAt),
        languages: ["en", "hi", "pa"] as const,
        resources,
        quiz: row.quizCode ? {
          publicCode: String(row.quizCode),
          itemCount: Number(row.quizItemCount ?? 0),
          publishedAt: row.quizPublishedAt ? String(row.quizPublishedAt) : null,
        } : null,
      };
    }),
    filters: { periodType, examFamily },
    generatedAt: new Date().toISOString(),
  };
}

import { Router, type IRouter } from "express";

import { sqlClient } from "../lib/db";

const router: IRouter = Router();

const PUBLIC_TOPICS = Object.freeze({
  "percentage": ["percentage", "percentages"],
  "profit-and-loss": ["profit-and-loss", "profit-loss"],
  "average": ["average", "averages"],
  "ratio-and-proportion": ["ratio-and-proportion", "ratio-proportion"],
  "time-and-work": ["time-and-work", "time-work"],
  "time-speed-distance": ["time-speed-distance", "time-and-distance", "speed-distance-time"],
  "number-system": ["number-system", "number-systems"],
  "syllogism": ["syllogism", "syllogisms"],
  "coding-decoding": ["coding-decoding", "coding-and-decoding"],
  "indian-polity": ["indian-polity", "polity", "indian-constitution"],
} as const);

type PublicTopicSlug = keyof typeof PUBLIC_TOPICS;

function normalizeLanguage(value: unknown): "en" | "hi" | "pa" {
  const normalized = String(value ?? "en").trim().toLowerCase();
  return normalized === "hi" || normalized === "pa" ? normalized : "en";
}

function normalizeLimit(value: unknown): number {
  const parsed = Number.parseInt(String(value ?? "10"), 10);
  if (!Number.isFinite(parsed)) return 10;
  return Math.max(5, Math.min(12, parsed));
}

router.get("/public/practice/:topicSlug", async (req, res) => {
  const topicSlug = String(req.params.topicSlug ?? "").trim().toLowerCase() as PublicTopicSlug;
  const tags = PUBLIC_TOPICS[topicSlug];
  if (!tags) {
    return res.status(404).json({
      error: "Public practice topic not found",
      code: "PUBLIC_PRACTICE_TOPIC_NOT_FOUND",
    });
  }

  const language = normalizeLanguage(req.query.language);
  const limit = normalizeLimit(req.query.limit);

  try {
    const rows = await sqlClient`
      SELECT
        q.public_code AS "publicCode",
        q.id::text AS "questionId",
        v.id::text AS "questionVersionId",
        v.difficulty::text AS difficulty,
        COALESCE(
          CASE WHEN ${language} = 'en' THEN NULL ELSE qt.stem END,
          v.stem
        ) AS stem,
        COALESCE(
          CASE WHEN ${language} = 'en' THEN NULL ELSE qt.explanation END,
          v.explanation
        ) AS explanation,
        COALESCE(
          json_agg(
            json_build_object(
              'key', qo.option_key,
              'text', COALESCE(
                CASE WHEN ${language} = 'en' THEN NULL ELSE qto.text END,
                qo.text
              ),
              'sortOrder', qo.sort_order,
              'isCorrect', qo.is_correct
            )
            ORDER BY qo.sort_order
          ) FILTER (WHERE qo.id IS NOT NULL),
          '[]'::json
        ) AS options
      FROM content.questions q
      JOIN content.question_versions v
        ON v.id = q.published_version_id
      LEFT JOIN catalog.languages lang
        ON lower(lang.code) = ${language}
      LEFT JOIN content.question_translations qt
        ON qt.question_version_id = v.id
       AND qt.language_id = lang.id
       AND lower(qt.status) = 'approved'
      LEFT JOIN content.question_options qo
        ON qo.question_version_id = v.id
      LEFT JOIN content.question_translation_options qto
        ON qto.question_translation_id = qt.id
       AND qto.option_key = qo.option_key
      WHERE q.deleted_at IS NULL
        AND q.status = 'published'::question_status
        AND q.published_version_id IS NOT NULL
        AND (${language} = 'en' OR qt.id IS NOT NULL)
        AND EXISTS (
          SELECT 1
          FROM content.question_taxonomy_links qtl
          JOIN catalog.taxonomy_nodes tn ON tn.id = qtl.taxonomy_node_id
          WHERE qtl.question_version_id = v.id
            AND (
              lower(tn.code) = ANY(${tags}::text[])
              OR regexp_replace(lower(tn.name), '[^a-z0-9]+', '-', 'g') = ANY(${tags}::text[])
            )
        )
      GROUP BY q.id, v.id, qt.id
      HAVING COUNT(qo.id) >= 2
        AND COUNT(qo.id) FILTER (WHERE qo.is_correct = true) = 1
      ORDER BY md5(v.id::text || ${topicSlug})
      LIMIT ${limit}
    `;

    const questions = rows.flatMap((row) => {
      const rawOptions = Array.isArray(row.options) ? row.options : [];
      const options = rawOptions
        .map((entry) => {
          const option = entry && typeof entry === "object" && !Array.isArray(entry)
            ? entry as Record<string, unknown>
            : {};
          return {
            text: String(option.text ?? "").trim(),
            isCorrect: option.isCorrect === true,
            sortOrder: Number(option.sortOrder ?? 0),
          };
        })
        .filter((option) => option.text.length > 0)
        .sort((a, b) => a.sortOrder - b.sortOrder);

      const correctOptionIndex = options.findIndex((option) => option.isCorrect);
      const stem = String(row.stem ?? "").trim();
      if (!stem || correctOptionIndex < 0 || options.length < 2) return [];

      return [{
        id: String(row.publicCode ?? row.questionId),
        topicSlug,
        language,
        difficulty: String(row.difficulty ?? ""),
        text: stem,
        options: options.map((option) => option.text),
        correctOptionIndex,
        explanation: String(row.explanation ?? "").trim(),
      }];
    });

    res.setHeader("Cache-Control", "public, max-age=300, stale-while-revalidate=1800");
    return res.json({
      topicSlug,
      language,
      count: questions.length,
      questions,
    });
  } catch (error) {
    console.error("Unable to load public practice questions", error);
    return res.status(500).json({
      error: "Unable to load public practice questions",
      code: "PUBLIC_PRACTICE_LOAD_FAILED",
    });
  }
});

export default router;

import { Router } from "express";

import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";
import {
  knowledgeV1Pol001QuestionStudioAdapterV1,
} from "../question-studio/engines/knowledge-v1-pol001-adapter-v1";
import {
  languageV1Eng004QuestionStudioAdapterV1,
} from "../question-studio/engines/language-v1-eng004-adapter-v1";
import {
  languageV1Eng005QuestionStudioAdapterV1,
} from "../question-studio/engines/language-v1-eng005-adapter-v1";
import {
  languageV1Eng006QuestionStudioAdapterV1,
} from "../question-studio/engines/language-v1-eng006-adapter-v1";

const router = Router();

export const POLITY_LEARN_CP_MAP: Readonly<Record<string, readonly string[]>> = Object.freeze({
  "POL-LRN-001": ["POL-CP-001"],
  "POL-LRN-002": ["POL-CP-002"],
  "POL-LRN-003": ["POL-CP-003"],
  "POL-LRN-004": ["POL-CP-003"],
  "POL-LRN-005": ["POL-CP-003"],
  "POL-LRN-006": ["POL-CP-004"],
  "POL-LRN-007": ["POL-CP-004"],
  "POL-LRN-008": ["POL-CP-004"],
  "POL-LRN-009": ["POL-CP-004"],
  "POL-LRN-010": ["POL-CP-004"],
  "POL-LRN-011": ["POL-CP-004"],
  "POL-LRN-012": ["POL-CP-004"],
  "POL-LRN-013": ["POL-CP-005"],
  "POL-LRN-014": ["POL-CP-005"],
  "POL-LRN-015": ["POL-CP-007"],
  "POL-LRN-016": ["POL-CP-008"],
  "POL-LRN-017": ["POL-CP-009"],
  "POL-LRN-018": ["POL-CP-009"],
  "POL-LRN-019": ["POL-CP-010"],
  "POL-LRN-020": ["POL-CP-011"],
  "POL-LRN-021": ["POL-CP-010"],
  "POL-LRN-022": ["POL-CP-011"],
  "POL-LRN-023": ["POL-CP-011"],
  "POL-LRN-024": ["POL-CP-011"],
  "POL-LRN-025": ["POL-CP-012"],
  "POL-LRN-026": ["POL-CP-013"],
  "POL-LRN-027": ["POL-CP-022"],
  "POL-LRN-028": ["POL-CP-021"],
  "POL-LRN-029": ["POL-CP-022"],
  "POL-LRN-030": ["POL-CP-022"],
  "POL-LRN-031": ["POL-CP-022"],
  "POL-LRN-032": ["POL-CP-014"],
  "POL-LRN-033": ["POL-CP-015"],
  "POL-LRN-034": ["POL-CP-016"],
  "POL-LRN-035": ["POL-CP-022"],
  "POL-LRN-036": ["POL-CP-022"],
  "POL-LRN-037": ["POL-CP-019"],
  "POL-LRN-038": ["POL-CP-020"],
  "POL-LRN-039": ["POL-CP-017"],
  "POL-LRN-040": ["POL-CP-017"],
  "POL-LRN-041": ["POL-CP-017"],
  "POL-LRN-042": ["POL-CP-017"],
  "POL-LRN-043": ["POL-CP-018"],
  "POL-LRN-044": ["POL-CP-006"],
  "POL-LRN-045": ["POL-CP-006"],
  "POL-LRN-046": ["POL-CP-024"],
  "POL-LRN-047": ["POL-CP-025"],
  "POL-LRN-048": ["POL-CP-026"],
  "POL-LRN-049": ["POL-CP-021"],
  "POL-LRN-050": ["POL-CP-021"],
  "POL-LRN-051": ["POL-CP-022"],
  "POL-LRN-052": ["POL-CP-022"],
  "POL-LRN-053": ["POL-CP-022"],
  "POL-LRN-054": ["POL-CP-023"],
  "POL-LRN-055": ["POL-CP-027"],
  "POL-LRN-056": ["POL-CP-017", "POL-CP-022", "POL-CP-024", "POL-CP-006"],
  "POL-LRN-057": ["POL-CP-007"],
  "POL-LRN-058": ["POL-CP-010", "POL-CP-011"],
  "POL-LRN-059": ["POL-CP-025"],
  "POL-LRN-060": ["POL-CP-013"],
  "POL-LRN-061": ["POL-CP-011"],
  "POL-LRN-062": ["POL-CP-024"],
  "POL-LRN-063": ["POL-CP-017"],
  "POL-LRN-064": ["POL-CP-006", "POL-CP-018", "POL-CP-019", "POL-CP-020", "POL-CP-021", "POL-CP-027"],
  "POL-LRN-065": ["POL-CP-006"],
  "POL-LRN-066": ["POL-CP-018"],
  "POL-LRN-067": ["POL-CP-023"],
});

export async function loadFrozenPolityQuestions(input: {
  topicId: string;
  language: "en" | "hi" | "pa";
  limit: number;
  fresh: boolean;
}) {
  const cpIds = POLITY_LEARN_CP_MAP[input.topicId];
  if (!cpIds?.length) return null;

  const base = Math.floor(input.limit / cpIds.length);
  let remainder = input.limit % cpIds.length;
  const batches = [];

  for (const cpId of cpIds) {
    const count = Math.max(1, base + (remainder-- > 0 ? 1 : 0));
    const result = await knowledgeV1Pol001QuestionStudioAdapterV1.generate({
      packageId: "POL-001",
      language: input.language,
      count,
      difficulty: "Mixed",
      runtimeMode: "review-only",
      patternId: cpId,
      seed: `learn:${input.topicId}:${input.fresh ? Date.now().toString().slice(0, 8) : "stable"}:${cpId}`,
    });
    batches.push(...result.questions);
  }

  return batches.slice(0, input.limit).map((question: any) => ({
    id: String(question.sourceQuestionId ?? question.questionId ?? question.id ?? ""),
    topicId: input.topicId,
    text: String(question.text ?? question.stem ?? ""),
    options: Array.isArray(question.options) ? question.options.map(String) : [],
    correctOptionIndex: Number(question.correctIndex ?? question.correct ?? 0),
    explanation: String(question.explanation ?? ""),
    cpId: String(question.cpId ?? ""),
    qlId: String(question.qlId ?? question.patternId ?? ""),
    difficulty: String(question.difficulty ?? ""),
    source: "POL-001_FROZEN_APPROVED",
  }));
}


export const ENGLISH_VOCABULARY_LEARN_TOPICS = Object.freeze({
  "ENG-VOC-SYN": {
    packageId: "english-eng004-synonyms-antonyms-v1",
    topic: "Synonyms",
    selector: "synonym",
  },
  "ENG-VOC-ANT": {
    packageId: "english-eng004-synonyms-antonyms-v1",
    topic: "Antonyms",
    selector: "antonym",
  },
  "ENG-VOC-IDIOM": {
    packageId: "english-eng005-idioms-phrases-v1",
    topic: "Idioms & Phrases",
  },
  "ENG-VOC-OWS": {
    packageId: "english-eng006-one-word-substitution-v1",
    topic: "One-word Substitution",
  },
} as const);

export async function loadApprovedEnglishVocabularyQuestions(input: {
  topicId: string;
  limit: number;
  fresh: boolean;
}) {
  const config = ENGLISH_VOCABULARY_LEARN_TOPICS[
    input.topicId as keyof typeof ENGLISH_VOCABULARY_LEARN_TOPICS
  ];
  if (!config) return null;

  const seed = `learn:${input.topicId}:${input.fresh ? Date.now().toString() : "stable"}`;
  const baseRequest = {
    packageId: config.packageId,
    language: "en" as const,
    count: input.limit,
    difficulty: "Mixed",
    runtimeMode: "review-only" as const,
    seed,
  };

  let result;
  if (input.topicId === "ENG-VOC-SYN" || input.topicId === "ENG-VOC-ANT") {
    result = await languageV1Eng004QuestionStudioAdapterV1.generate({
      ...baseRequest,
      topic: "Vocabulary",
      subtopic: "selector" in config ? config.selector : undefined,
      patternId: "selector" in config ? config.selector : undefined,
    });
  } else if (input.topicId === "ENG-VOC-IDIOM") {
    result = await languageV1Eng005QuestionStudioAdapterV1.generate({
      ...baseRequest,
      topic: "Idioms & Phrases",
      subtopic: "Vocabulary",
    });
  } else {
    result = await languageV1Eng006QuestionStudioAdapterV1.generate({
      ...baseRequest,
      topic: "One-word Substitution",
      subtopic: "Vocabulary",
    });
  }

  return result.questions.slice(0, input.limit).map((question: any) => ({
    id: String(question.questionId ?? question.id ?? ""),
    topicId: input.topicId,
    text: String(question.stem ?? question.text ?? ""),
    options: Array.isArray(question.options) ? question.options.map(String) : [],
    correctOptionIndex: Number(question.correctIndex ?? question.correct ?? 0),
    explanation: String(question.explanation ?? ""),
    cpId: String(question.cpId ?? ""),
    difficulty: String(question.difficulty ?? ""),
    source: `${config.packageId}:HUMAN_APPROVED_LEARN_ONLY`,
  }));
}


function slug(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function tagsFromQuery(value: unknown): string[] {
  const raw = Array.isArray(value) ? value.join(",") : String(value ?? "");
  return [...new Set(raw.split(",").map(slug).filter(Boolean))].slice(0, 12);
}

function languageFromQuery(value: unknown): "en" | "hi" | "pa" {
  const normalized = String(value ?? "en").trim().toLowerCase();
  return normalized === "hi" || normalized === "pa" ? normalized : "en";
}

function limitFromQuery(value: unknown): number {
  const parsed = Number.parseInt(String(value ?? "20"), 10);
  if (!Number.isFinite(parsed)) return 20;
  return Math.max(5, Math.min(20, parsed));
}

router.get(
  "/learn/practice/questions",
  authenticate,
  async (req, res): Promise<void> => {
    const topicId = String(req.query.topicId ?? "").trim();
    const tags = tagsFromQuery(req.query.tags);
    const language = languageFromQuery(req.query.language);
    const limit = limitFromQuery(req.query.limit);
    const fresh = String(req.query.fresh ?? "") === "1";

    if (!topicId) {
      res.status(400).json({
        error: "topicId is required",
        code: "LEARN_TOPIC_REQUIRED",
      });
      return;
    }
    try {
      const frozenPolity = await loadFrozenPolityQuestions({
        topicId,
        language,
        limit,
        fresh,
      });
      if (frozenPolity != null) {
        res.json({
          topicId,
          language,
          requested: limit,
          count: frozenPolity.length,
          source: "POL-001_FROZEN_APPROVED",
          questions: frozenPolity,
        });
        return;
      }

      const englishVocabulary = await loadApprovedEnglishVocabularyQuestions({
        topicId,
        limit,
        fresh,
      });
      if (englishVocabulary != null) {
        res.json({
          topicId,
          language: "en",
          requested: limit,
          count: englishVocabulary.length,
          source: "ENGLISH_VOCABULARY_HUMAN_APPROVED_LEARN_ONLY",
          questions: englishVocabulary,
        });
        return;
      }

      if (tags.length === 0) {
        res.status(409).json({
          error: "This Learn topic does not have a Question Bank mapping yet.",
          code: "LEARN_TOPIC_MAPPING_MISSING",
          topicId,
        });
        return;
      }

      const rows = await sqlClient`
        SELECT
          q.id::text AS "questionId",
          v.id::text AS "questionVersionId",
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
                OR regexp_replace(lower(tn.name), '[^a-z0-9]+', '-', 'g')
                  = ANY(${tags}::text[])
              )
          )
        GROUP BY q.id, v.id, qt.id
        HAVING COUNT(qo.id) >= 2
          AND COUNT(qo.id) FILTER (WHERE qo.is_correct = true) = 1
        ORDER BY md5(v.id::text || ${topicId})
        LIMIT ${limit}
      `;

      const questions = rows.flatMap((row) => {
        const options = Array.isArray(row.options) ? row.options : [];
        const normalizedOptions = options
          .map((entry) => {
            const option =
              entry && typeof entry === "object" && !Array.isArray(entry)
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
        const correctOptionIndex = normalizedOptions.findIndex(
          (option) => option.isCorrect,
        );
        if (correctOptionIndex < 0 || normalizedOptions.length < 2) return [];

        return [{
          id: String(row.questionId),
          topicId,
          text: String(row.stem ?? "").trim(),
          options: normalizedOptions.map((option) => option.text),
          correctOptionIndex,
          explanation: String(row.explanation ?? "").trim(),
        }];
      });

      res.json({
        topicId,
        language,
        requested: limit,
        count: questions.length,
        questions,
      });
    } catch (error) {
      console.error("Unable to load Learn practice questions", error);
      res.status(500).json({
        error: "Unable to load Learn practice questions.",
        code: "LEARN_PRACTICE_LOAD_FAILED",
      });
    }
  },
);

export default router;

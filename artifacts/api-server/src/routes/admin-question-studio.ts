import { Router } from "express";

import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";
import { requireAdminPermission } from "../lib/admin-rbac";
import nativeEditorialRouter from "./admin-question-studio-native-editorial";

const router = Router();

const ITEM_STATUSES = new Set([
  "unreviewed",
  "needs_fix",
  "approved",
  "rejected",
]);

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asPositiveInteger(value: unknown, fallback: number, max: number) {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0
    ? Math.min(parsed, max)
    : fallback;
}

router.use(authenticate);
router.use(nativeEditorialRouter);

// Read-only multilingual inspection for a single review item. Do not run
// the locale engines for every item on a paginated queue query: they are
// regenerated on demand only when a reviewer opens an eligible question.
// These previews are NOT stored translations or an approval decision.
router.get("/items/:itemId/native-localizations",
  requireAdminPermission("content.generation.read"),
  async (req, res) => {
    const itemId=asString(req.params.itemId);
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(itemId)) {
      res.status(400).json({code:"NATIVE_REVIEW_INVALID_ITEM",error:"Invalid review item."});return;
    }
    const expectedVersion=Number(req.query.version);
    if (!Number.isInteger(expectedVersion)||expectedVersion<1) {
      res.status(400).json({code:"NATIVE_REVIEW_VERSION_REQUIRED",error:"An exact item version is required."});return;
    }
    try {
      const rows=await sqlClient`
        SELECT i.current_version_number AS "version", i.status::text AS status,
               v.payload
        FROM content.generation_run_items i
        JOIN content.generation_item_versions v
          ON v.generation_item_id=i.id
         AND v.version_number=i.current_version_number
        WHERE i.id=${itemId}::uuid
        LIMIT 1
      `;
      if (!rows.length) {res.status(404).json({code:"NATIVE_REVIEW_ITEM_NOT_FOUND"});return;}
      const row=rows[0]!;
      if (Number(row.version)!==expectedVersion) {
        res.status(409).json({code:"NATIVE_REVIEW_VERSION_CHANGED",error:"The review item changed. Refresh before inspecting locales."});return;
      }
      // Keep normal paged review reads lightweight. Generation engines load only
      // when a reviewer opens this specialized native-language preview route.
      const [{nativeLocalizedQuestion,nativeExplanationText,assertNativeEnglishSourceParity,
        assertNativeLocalizedAnswerParity},{listQuestionStudioPackages}]=await Promise.all([
        import("../question-studio/native-linked-localization"),
        import("../question-studio/engine-registry"),
      ]);
      const payload=row.payload as Record<string,unknown>;
      const packageId=asString(payload?.packageId);
      const language=asString(payload?.language);
      const pkg=listQuestionStudioPackages().find(p=>p.enabled && p.packageId===packageId);
      const cpId=asString(payload.canonicalProblemId||payload.selectedCpId||payload.cpId);
      const qlId=asString(payload.questionLanguageId||payload.qlId);
      const seed=asString(payload.seed);
      if (!pkg || !pkg.supportedLanguages.includes("en") ||
          !pkg.supportedLanguages.some(locale=>locale==="hi"||locale==="pa") ||
          !cpId || !qlId || !seed || language!=="en") {
        res.status(422).json({
          code:"NATIVE_REVIEW_NOT_SUPPORTED",
          error:"This item does not have registered multilingual languages and a reusable canonical QL/CP/seed.",
        });return;
      }
      const sourceOptions=Array.isArray(payload.options)?payload.options.map(x=>
        typeof x==="string"?x.trim():asString(x && typeof x==="object" && "text" in x ? x.text : "")):[];
      const correctIndex=Number(payload.correctIndex??payload.correct);
      const source={
        stem:asString(payload.text)||asString(payload.stem),
        explanation:nativeExplanationText(payload.explanation),
        options:sourceOptions,
        correctIndex,
      };
      if (!source.stem||!source.explanation||sourceOptions.length<2||
          !Number.isInteger(correctIndex)||correctIndex<0||correctIndex>=sourceOptions.length) {
        res.status(422).json({code:"NATIVE_REVIEW_SOURCE_INCOMPLETE",error:"The English source must pass review before linked locale inspection."});return;
      }
      // Refuse all versions if the source was revised away from the exact
      // engine output. This prevents silently pairing unrelated questions.
      try {
        const generated=await nativeLocalizedQuestion(payload,"en");
        assertNativeEnglishSourceParity(source,generated);
      } catch(error) {
        res.status(409).json({
          code:"NATIVE_REVIEW_SOURCE_PARITY_FAILED",
          error:"Source no longer matches the saved native generator. Linked locales cannot be verified for this version.",
        });return;
      }
      const variants=await Promise.all((["hi","pa"] as const)
        .filter(locale=>pkg.supportedLanguages.includes(locale)).map(async locale=>{
        try {
          const question=await nativeLocalizedQuestion(payload,locale);
          assertNativeLocalizedAnswerParity(source,question);
          return {language:locale,status:"verified" as const,...question};
        } catch {
          return {language:locale,status:"blocked" as const,
            reason:"The released localization did not pass same-seed answer/format parity."};
        }
      }));
      res.setHeader("Cache-Control","private, no-store");
      res.json({itemId,version:expectedVersion,packageId,
        source:{language:"en",status:"verified",...source},
        variants, saved:false,approved:false});
    } catch(error) {
      console.error("Question Studio locale review failed",error instanceof Error?error.message:"unknown");
      res.status(500).json({code:"NATIVE_REVIEW_UNAVAILABLE",error:"Unable to inspect native localized variants."});
    }
  },
);

router.get("/review-page", requireAdminPermission("content.generation.read"), async (req, res) => {
  const page = asPositiveInteger(req.query?.page, 1, 1000000);
  const pageSize = asPositiveInteger(req.query?.pageSize, 20, 50);
  const subject = asString(req.query?.subject) || null;
  const chapter = asString(req.query?.chapter) || null;
  const packageId = asString(req.query?.packageId) || null;
  const status = asString(req.query?.status) || null;
  const search = asString(req.query?.search).slice(0, 200);
  const searchPattern = search ? `%${search}%` : null;

  if (status && !ITEM_STATUSES.has(status)) {
    res.status(400).json({ error: "Invalid review status filter" });
    return;
  }

  try {
    const totalRows = await sqlClient`
      SELECT COUNT(*)::int AS total
      FROM content.generation_runs r
      WHERE
        (${subject}::text IS NULL OR COALESCE(r.request_snapshot ->> 'subject', r.request_snapshot -> 'request' ->> 'subject') = ${subject})
        AND (
          ${chapter}::text IS NULL
          OR COALESCE(r.request_snapshot ->> 'topic', r.request_snapshot -> 'request' ->> 'topic') = ${chapter}
          OR COALESCE(r.request_snapshot ->> 'subtopic', r.request_snapshot -> 'request' ->> 'subtopic') = ${chapter}
        )
        AND (${packageId}::text IS NULL OR COALESCE(r.request_snapshot ->> 'packageId', r.request_snapshot -> 'request' ->> 'packageId') = ${packageId})
        AND (
          ${status}::text IS NULL
          OR EXISTS (
            SELECT 1
            FROM content.generation_run_items si
            WHERE si.generation_run_id = r.id
              AND si.status::text = ${status}
          )
        )
        AND (
          ${searchPattern}::text IS NULL
          OR r.public_code ILIKE ${searchPattern}
          OR COALESCE(COALESCE(r.request_snapshot ->> 'exam', r.request_snapshot -> 'request' ->> 'exam'), '') ILIKE ${searchPattern}
          OR COALESCE(COALESCE(r.request_snapshot ->> 'subject', r.request_snapshot -> 'request' ->> 'subject'), '') ILIKE ${searchPattern}
          OR COALESCE(COALESCE(r.request_snapshot ->> 'topic', r.request_snapshot -> 'request' ->> 'topic'), '') ILIKE ${searchPattern}
          OR COALESCE(COALESCE(r.request_snapshot ->> 'subtopic', r.request_snapshot -> 'request' ->> 'subtopic'), '') ILIKE ${searchPattern}
          OR COALESCE(COALESCE(r.request_snapshot ->> 'packageId', r.request_snapshot -> 'request' ->> 'packageId'), '') ILIKE ${searchPattern}
          OR EXISTS (
            SELECT 1
            FROM content.generation_run_items qi
            INNER JOIN content.generation_item_versions qv
              ON qv.generation_item_id = qi.id
             AND qv.version_number = qi.current_version_number
            WHERE qi.generation_run_id = r.id
              AND (
                COALESCE(qv.payload ->> 'text', '') ILIKE ${searchPattern}
                OR COALESCE(qv.payload ->> 'stem', '') ILIKE ${searchPattern}
                OR COALESCE(qv.payload ->> 'selectedCpId', '') ILIKE ${searchPattern}
                OR COALESCE(qv.payload ->> 'canonicalProblemId', '') ILIKE ${searchPattern}
                OR COALESCE(qv.payload ->> 'cpId', '') ILIKE ${searchPattern}
                OR COALESCE(qv.payload ->> 'qlId', '') ILIKE ${searchPattern}
              )
          )
        )
    `;

    const totalRuns = Number(totalRows[0]?.total ?? 0);
    const totalPages = totalRuns > 0 ? Math.ceil(totalRuns / pageSize) : 0;
    const normalizedPage = totalPages > 0 ? Math.min(page, totalPages) : 1;
    const offset = (normalizedPage - 1) * pageSize;

    const runs = await sqlClient`
      SELECT
        r.id,
        r.public_code AS "publicCode",
        r.status,
        r.attempt_number AS "attemptNumber",
        r.provider,
        r.model,
        r.prompt_tokens AS "promptTokens",
        r.completion_tokens AS "completionTokens",
        r.estimated_cost_paise AS "estimatedCostPaise",
        r.actual_cost_paise AS "actualCostPaise",
        r.budget_limit_paise AS "budgetLimitPaise",
        r.due_at AS "dueAt",
        r.failure_reason AS "failureReason",
        r.started_at AS "startedAt",
        r.completed_at AS "completedAt",
        r.created_at AS "createdAt",
        r.updated_at AS "updatedAt",
        r.request_snapshot AS "requestSnapshot",
        r.recipe_version_id AS "recipeVersionId",
        jsonb_build_object(
          'total', (
            SELECT COUNT(*)::int
            FROM content.generation_run_items summary_item
            WHERE summary_item.generation_run_id = r.id
          ),
          'unreviewed', (
            SELECT COUNT(*)::int
            FROM content.generation_run_items summary_item
            WHERE summary_item.generation_run_id = r.id
              AND summary_item.status = 'unreviewed'
          ),
          'needsFix', (
            SELECT COUNT(*)::int
            FROM content.generation_run_items summary_item
            WHERE summary_item.generation_run_id = r.id
              AND summary_item.status = 'needs_fix'
          ),
          'approved', (
            SELECT COUNT(*)::int
            FROM content.generation_run_items summary_item
            WHERE summary_item.generation_run_id = r.id
              AND summary_item.status = 'approved'
          ),
          'rejected', (
            SELECT COUNT(*)::int
            FROM content.generation_run_items summary_item
            WHERE summary_item.generation_run_id = r.id
              AND summary_item.status = 'rejected'
          )
        ) AS "reviewSummary"
      FROM content.generation_runs r
      WHERE
        (${subject}::text IS NULL OR COALESCE(r.request_snapshot ->> 'subject', r.request_snapshot -> 'request' ->> 'subject') = ${subject})
        AND (
          ${chapter}::text IS NULL
          OR COALESCE(r.request_snapshot ->> 'topic', r.request_snapshot -> 'request' ->> 'topic') = ${chapter}
          OR COALESCE(r.request_snapshot ->> 'subtopic', r.request_snapshot -> 'request' ->> 'subtopic') = ${chapter}
        )
        AND (${packageId}::text IS NULL OR COALESCE(r.request_snapshot ->> 'packageId', r.request_snapshot -> 'request' ->> 'packageId') = ${packageId})
        AND (
          ${status}::text IS NULL
          OR EXISTS (
            SELECT 1
            FROM content.generation_run_items si
            WHERE si.generation_run_id = r.id
              AND si.status::text = ${status}
          )
        )
        AND (
          ${searchPattern}::text IS NULL
          OR r.public_code ILIKE ${searchPattern}
          OR COALESCE(COALESCE(r.request_snapshot ->> 'exam', r.request_snapshot -> 'request' ->> 'exam'), '') ILIKE ${searchPattern}
          OR COALESCE(COALESCE(r.request_snapshot ->> 'subject', r.request_snapshot -> 'request' ->> 'subject'), '') ILIKE ${searchPattern}
          OR COALESCE(COALESCE(r.request_snapshot ->> 'topic', r.request_snapshot -> 'request' ->> 'topic'), '') ILIKE ${searchPattern}
          OR COALESCE(COALESCE(r.request_snapshot ->> 'subtopic', r.request_snapshot -> 'request' ->> 'subtopic'), '') ILIKE ${searchPattern}
          OR COALESCE(COALESCE(r.request_snapshot ->> 'packageId', r.request_snapshot -> 'request' ->> 'packageId'), '') ILIKE ${searchPattern}
          OR EXISTS (
            SELECT 1
            FROM content.generation_run_items qi
            INNER JOIN content.generation_item_versions qv
              ON qv.generation_item_id = qi.id
             AND qv.version_number = qi.current_version_number
            WHERE qi.generation_run_id = r.id
              AND (
                COALESCE(qv.payload ->> 'text', '') ILIKE ${searchPattern}
                OR COALESCE(qv.payload ->> 'stem', '') ILIKE ${searchPattern}
                OR COALESCE(qv.payload ->> 'selectedCpId', '') ILIKE ${searchPattern}
                OR COALESCE(qv.payload ->> 'canonicalProblemId', '') ILIKE ${searchPattern}
                OR COALESCE(qv.payload ->> 'cpId', '') ILIKE ${searchPattern}
                OR COALESCE(qv.payload ->> 'qlId', '') ILIKE ${searchPattern}
              )
          )
        )
      ORDER BY r.created_at DESC
      LIMIT ${pageSize}
      OFFSET ${offset}
    `;

    const runIds = runs.map((run) => String(run.id));
    const items = runIds.length > 0
      ? await sqlClient`
          SELECT
            i.id,
            i.generation_run_id AS "generationRunId",
            i.item_number AS "itemNumber",
            i.status,
            i.current_version_number AS "currentVersionNumber",
            i.retry_reason AS "retryReason",
            i.reviewer_user_id AS "reviewerUserId",
            i.accepted_question_id AS "acceptedQuestionId",
            i.accepted_question_version_id AS "acceptedQuestionVersionId",
            i.created_at AS "createdAt",
            i.updated_at AS "updatedAt",
            v.id AS "versionId",
            jsonb_strip_nulls(jsonb_build_object(
              'text', v.payload -> 'text',
              'stem', v.payload -> 'stem',
              'options', v.payload -> 'options',
              'explanation', v.payload -> 'explanation',
              'correct', v.payload -> 'correct',
              'correctIndex', v.payload -> 'correctIndex',
              'difficulty', v.payload -> 'difficulty',
              'difficultyLabel', v.payload -> 'difficultyLabel',
              'patternId', v.payload -> 'patternId',
              'packageId', v.payload -> 'packageId',
              'cpId', v.payload -> 'cpId',
              'canonicalProblemId', v.payload -> 'canonicalProblemId',
              'selectedCpId', v.payload -> 'selectedCpId',
              'engineId', v.payload -> 'engineId',
              'questionLanguageId', v.payload -> 'questionLanguageId',
              'topic', v.payload -> 'topic',
              'subtopic', v.payload -> 'subtopic',
              'language', v.payload -> 'language',
              'seed', v.payload -> 'seed',
              'qlId', v.payload -> 'qlId',
              'qlName', v.payload -> 'qlName',
              'stimulusSvgs', v.payload -> 'stimulusSvgs',
              'optionSvgs', v.payload -> 'optionSvgs',
              'explanationSvgs', v.payload -> 'explanationSvgs',
              'optionLabels', v.payload -> 'optionLabels',
              'renderer', v.payload -> 'renderer',
              'semanticMetadata', v.payload -> 'semanticMetadata',
              'contentFingerprint', v.payload -> 'contentFingerprint'
            )) AS payload
          FROM content.generation_run_items i
          INNER JOIN content.generation_runs r
            ON r.id = i.generation_run_id
          LEFT JOIN content.generation_item_versions v
            ON v.generation_item_id = i.id
           AND v.version_number = i.current_version_number
          WHERE i.generation_run_id = ANY(${runIds}::uuid[])
            AND (${status}::text IS NULL OR i.status::text = ${status})
            AND (
              ${searchPattern}::text IS NULL
              OR r.public_code ILIKE ${searchPattern}
              OR COALESCE(COALESCE(r.request_snapshot ->> 'exam', r.request_snapshot -> 'request' ->> 'exam'), '') ILIKE ${searchPattern}
              OR COALESCE(COALESCE(r.request_snapshot ->> 'subject', r.request_snapshot -> 'request' ->> 'subject'), '') ILIKE ${searchPattern}
              OR COALESCE(COALESCE(r.request_snapshot ->> 'topic', r.request_snapshot -> 'request' ->> 'topic'), '') ILIKE ${searchPattern}
              OR COALESCE(COALESCE(r.request_snapshot ->> 'subtopic', r.request_snapshot -> 'request' ->> 'subtopic'), '') ILIKE ${searchPattern}
              OR COALESCE(COALESCE(r.request_snapshot ->> 'packageId', r.request_snapshot -> 'request' ->> 'packageId'), '') ILIKE ${searchPattern}
              OR COALESCE(v.payload ->> 'text', '') ILIKE ${searchPattern}
              OR COALESCE(v.payload ->> 'stem', '') ILIKE ${searchPattern}
              OR COALESCE(v.payload ->> 'selectedCpId', '') ILIKE ${searchPattern}
              OR COALESCE(v.payload ->> 'canonicalProblemId', '') ILIKE ${searchPattern}
              OR COALESCE(v.payload ->> 'cpId', '') ILIKE ${searchPattern}
              OR COALESCE(v.payload ->> 'qlId', '') ILIKE ${searchPattern}
            )
          ORDER BY i.generation_run_id, i.item_number ASC
        `
      : [];

    const pageItemIds = items.map((item) => String(item.id));
    const duplicateMatches = pageItemIds.length > 0
      ? await sqlClient`
          WITH current_payloads AS (
            SELECT
              i.id,
              r.public_code AS "runCode",
              r.created_at AS "runCreatedAt",
              NULLIF(v.payload ->> 'contentFingerprint', '') AS fingerprint,
              LOWER(
                REGEXP_REPLACE(
                  TRIM(COALESCE(NULLIF(v.payload ->> 'text', ''), v.payload ->> 'stem', '')),
                  '[[:space:][:punct:]]+',
                  ' ',
                  'g'
                )
              ) AS "normalizedStem"
            FROM content.generation_run_items i
            INNER JOIN content.generation_runs r
              ON r.id = i.generation_run_id
            INNER JOIN content.generation_item_versions v
              ON v.generation_item_id = i.id
             AND v.version_number = i.current_version_number
          )
          SELECT DISTINCT ON (source.id)
            source.id::text AS "itemId",
            matched.id::text AS "matchedItemId",
            matched."runCode" AS "matchedRunCode",
            1::float AS similarity,
            true AS exact
          FROM current_payloads source
          INNER JOIN current_payloads matched
            ON matched.id <> source.id
           AND source."normalizedStem" <> ''
           AND source."normalizedStem" = matched."normalizedStem"
           AND (
             source.fingerprint IS NULL
             OR matched.fingerprint IS NULL
             OR source.fingerprint = matched.fingerprint
           )
          WHERE source.id = ANY(${pageItemIds}::uuid[])
          ORDER BY source.id, matched."runCreatedAt" DESC, matched.id
        `
      : [];

    const itemsByRun = new Map<string, typeof items>();
    for (const item of items) {
      const runId = String(item.generationRunId);
      const bucket = itemsByRun.get(runId) ?? [];
      bucket.push(item);
      itemsByRun.set(runId, bucket);
    }

    res.json({
      runs: runs.map((run) => ({
        ...run,
        items: itemsByRun.get(String(run.id)) ?? [],
      })),
      duplicateMatches,
      pagination: {
        page: normalizedPage,
        pageSize,
        totalRuns,
        totalPages,
        hasPreviousPage: normalizedPage > 1,
        hasNextPage: totalPages > 0 && normalizedPage < totalPages,
      },
      filters: {
        subject,
        chapter,
        packageId,
        status,
        search: search || null,
      },
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Question Studio review page failed", error);
    res.status(500).json({ error: "Unable to load Question Studio review page" });
  }
});

export default router;
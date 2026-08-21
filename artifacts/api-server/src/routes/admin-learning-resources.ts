import { randomUUID } from "node:crypto";
import { Router, type IRouter, type Response } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router: IRouter = Router();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const publicCodePattern = /^[A-Z][A-Z0-9_-]{2,79}$/;
const categories = new Set(["current_affairs", "notes", "formula_sheet"]);
const formats = new Set(["article", "pdf"]);
const maxExamTargets = 12;

class LearningResourceError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly statusCode = 400,
  ) {
    super(message);
  }
}

type ResourceInput = {
  publicCode: string;
  category: string;
  format: string;
  title: string;
  summary: string;
  languageCode: string;
  contentDate: string | null;
  bodyMarkdown: string | null;
  contentUrl: string | null;
  expiresAt: string | null;
  examIds: string[];
};

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function nullableText(value: unknown, max: number): string | null {
  const valueText = text(value, max);
  return valueText || null;
}

function dateOnly(value: unknown): string | null {
  if (value == null || value === "") return null;
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new LearningResourceError("INVALID_RESOURCE_DATE", "Content date must use YYYY-MM-DD.");
  }
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
    throw new LearningResourceError("INVALID_RESOURCE_DATE", "Content date is invalid.");
  }
  return value;
}

function futureDateTime(value: unknown): string | null {
  if (value == null || value === "") return null;
  if (typeof value !== "string") {
    throw new LearningResourceError("INVALID_RESOURCE_EXPIRY", "Expiry must be an ISO date/time.");
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new LearningResourceError("INVALID_RESOURCE_EXPIRY", "Expiry must be an ISO date/time.");
  }
  return parsed.toISOString();
}

function examIds(value: unknown): string[] {
  if (value == null) return [];
  if (!Array.isArray(value)) {
    throw new LearningResourceError("INVALID_RESOURCE_EXAMS", "Exam targets must be an array.");
  }
  const ids = [...new Set(value.map((item) => String(item).trim()).filter(Boolean))];
  if (ids.length > maxExamTargets || ids.some((id) => !uuidPattern.test(id))) {
    throw new LearningResourceError(
      "INVALID_RESOURCE_EXAMS",
      `Choose up to ${maxExamTargets} valid canonical exams.`,
    );
  }
  return ids;
}

function resourceInput(body: unknown, existingCode?: string): ResourceInput {
  const raw = body && typeof body === "object" && !Array.isArray(body)
    ? body as Record<string, unknown>
    : {};
  const publicCode = (existingCode ?? text(raw.publicCode, 80)).toUpperCase();
  const category = text(raw.category, 40).toLowerCase();
  const format = text(raw.format, 20).toLowerCase();
  const title = text(raw.title, 200);
  const summary = text(raw.summary, 1200);
  const languageCode = text(raw.languageCode, 20).toLowerCase();
  const bodyMarkdown = nullableText(raw.bodyMarkdown, 100000);
  const contentUrl = nullableText(raw.contentUrl, 2000);

  if (!publicCodePattern.test(publicCode)) {
    throw new LearningResourceError(
      "INVALID_RESOURCE_CODE",
      "Use an uppercase resource code with letters, numbers, hyphens or underscores.",
    );
  }
  if (!categories.has(category)) {
    throw new LearningResourceError("INVALID_RESOURCE_CATEGORY", "Choose a supported resource category.");
  }
  if (!formats.has(format)) {
    throw new LearningResourceError("INVALID_RESOURCE_FORMAT", "Choose article or PDF format.");
  }
  if (title.length < 3) {
    throw new LearningResourceError("INVALID_RESOURCE_TITLE", "Resource title is required.");
  }
  if (!/^[a-z]{2,8}(?:-[a-z0-9]{2,8})?$/.test(languageCode)) {
    throw new LearningResourceError("INVALID_RESOURCE_LANGUAGE", "Choose a valid language code.");
  }
  if (!bodyMarkdown && !contentUrl) {
    throw new LearningResourceError(
      "RESOURCE_CONTENT_REQUIRED",
      "Provide article content or an HTTPS document URL.",
    );
  }
  if (contentUrl) {
    let uri: URL;
    try {
      uri = new URL(contentUrl);
    } catch {
      throw new LearningResourceError("INVALID_RESOURCE_URL", "Resource URL must be a valid HTTPS URL.");
    }
    if (uri.protocol !== "https:") {
      throw new LearningResourceError("INVALID_RESOURCE_URL", "Resource URL must use HTTPS.");
    }
  }
  if (format === "pdf" && !contentUrl) {
    throw new LearningResourceError("PDF_URL_REQUIRED", "PDF resources require an HTTPS document URL.");
  }

  return {
    publicCode,
    category,
    format,
    title,
    summary,
    languageCode,
    contentDate: dateOnly(raw.contentDate),
    bodyMarkdown,
    contentUrl,
    expiresAt: futureDateTime(raw.expiresAt),
    examIds: examIds(raw.examIds),
  };
}

function resourceId(value: unknown): string {
  const id = typeof value === "string" ? value.trim() : "";
  if (!uuidPattern.test(id)) {
    throw new LearningResourceError("INVALID_RESOURCE_ID", "Invalid learning resource identifier.");
  }
  return id;
}

async function validateReferences(input: ResourceInput) {
  const languages = await sqlClient`
    SELECT id
    FROM catalog.languages
    WHERE lower(code) = ${input.languageCode}
      AND is_active = true
    LIMIT 1
  `;
  if (!languages[0]) {
    throw new LearningResourceError(
      "RESOURCE_LANGUAGE_UNAVAILABLE",
      "That language is not active in the canonical catalogue.",
    );
  }

  if (input.examIds.length > 0) {
    const rows = await sqlClient`
      SELECT exam.id::text AS id
      FROM catalog.exams exam
      JOIN catalog.exam_families family
        ON family.id = exam.family_id
       AND family.is_active = true
      JOIN catalog.exam_versions version
        ON version.exam_id = exam.id
       AND version.is_current = true
      WHERE exam.id = ANY(${input.examIds}::uuid[])
        AND exam.is_active = true
    `;
    const valid = new Set(rows.map((row) => String(row.id)));
    if (valid.size !== input.examIds.length || input.examIds.some((id) => !valid.has(id))) {
      throw new LearningResourceError(
        "RESOURCE_EXAM_UNAVAILABLE",
        "One or more selected exams are no longer active.",
      );
    }
  }
}

async function loadResource(id: string) {
  const rows = await sqlClient`
    SELECT
      resource.id::text AS id,
      resource.public_code AS "publicCode",
      resource.category,
      resource.format,
      resource.title,
      resource.summary,
      resource.language_code AS "languageCode",
      resource.content_date AS "contentDate",
      resource.body_markdown AS "bodyMarkdown",
      resource.content_url AS "contentUrl",
      resource.status,
      resource.published_at AS "publishedAt",
      resource.expires_at AS "expiresAt",
      resource.created_at AS "createdAt",
      resource.updated_at AS "updatedAt",
      COALESCE(
        array_agg(target.exam_id::text ORDER BY exam.name)
          FILTER (WHERE target.exam_id IS NOT NULL),
        '{}'
      ) AS "examIds"
    FROM content.learning_resources resource
    LEFT JOIN content.learning_resource_exams target ON target.resource_id = resource.id
    LEFT JOIN catalog.exams exam ON exam.id = target.exam_id
    WHERE resource.id = ${id}::uuid
    GROUP BY resource.id
    LIMIT 1
  `;
  return rows[0] ?? null;
}

async function replaceExamTargets(id: string, ids: string[], actorUserId: string) {
  await sqlClient.begin(async (tx) => {
    await tx`DELETE FROM content.learning_resource_exams WHERE resource_id = ${id}::uuid`;
    for (const examId of ids) {
      await tx`
        INSERT INTO content.learning_resource_exams (resource_id, exam_id)
        VALUES (${id}::uuid, ${examId}::uuid)
      `;
    }
    await tx`
      UPDATE content.learning_resources
      SET updated_by = ${actorUserId}::uuid, updated_at = now()
      WHERE id = ${id}::uuid
    `;
  });
}

function sendError(res: Response, error: unknown, fallback: string) {
  if (error instanceof LearningResourceError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback, code: "LEARNING_RESOURCE_ADMIN_FAILED" });
}

router.use(authenticate);

router.get("/", requireAdminPermission("content.questions.read"), async (_req, res) => {
  try {
    const rows = await sqlClient`
      SELECT
        resource.id::text AS id,
        resource.public_code AS "publicCode",
        resource.category,
        resource.format,
        resource.title,
        resource.summary,
        resource.language_code AS "languageCode",
        resource.content_date AS "contentDate",
        resource.status,
        resource.published_at AS "publishedAt",
        resource.expires_at AS "expiresAt",
        resource.updated_at AS "updatedAt",
        COALESCE(COUNT(target.exam_id), 0)::int AS "examTargetCount"
      FROM content.learning_resources resource
      LEFT JOIN content.learning_resource_exams target ON target.resource_id = resource.id
      GROUP BY resource.id
      ORDER BY resource.updated_at DESC
      LIMIT 1000
    `;
    res.json({ resources: rows, generatedAt: new Date().toISOString() });
  } catch (error) {
    sendError(res, error, "Unable to load learning resources");
  }
});

router.post("/", requireAdminPermission("content.questions.update"), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new LearningResourceError("ADMIN_SESSION_REQUIRED", "Administrator session required.", 403);
    const input = resourceInput(req.body);
    await validateReferences(input);
    const id = randomUUID();

    await sqlClient.begin(async (tx) => {
      await tx`
        INSERT INTO content.learning_resources (
          id, public_code, category, format, title, summary, language_code,
          content_date, body_markdown, content_url, status, expires_at,
          created_by, updated_by, created_at, updated_at
        ) VALUES (
          ${id}::uuid, ${input.publicCode}, ${input.category}, ${input.format},
          ${input.title}, ${input.summary}, ${input.languageCode}, ${input.contentDate},
          ${input.bodyMarkdown}, ${input.contentUrl}, 'draft', ${input.expiresAt},
          ${actorUserId}::uuid, ${actorUserId}::uuid, now(), now()
        )
      `;
      for (const examId of input.examIds) {
        await tx`
          INSERT INTO content.learning_resource_exams (resource_id, exam_id)
          VALUES (${id}::uuid, ${examId}::uuid)
        `;
      }
      await tx`
        INSERT INTO platform.audit_events (
          id, actor_type, actor_user_id, action_key, entity_type, entity_id,
          summary, metadata
        ) VALUES (
          ${randomUUID()}::uuid,
          'user'::audit_actor_type,
          ${actorUserId}::uuid,
          'content.learning_resource.created',
          'learning_resource',
          ${id}::uuid,
          ${`Created learning resource ${input.publicCode}`},
          ${tx.json({ category: input.category, format: input.format, languageCode: input.languageCode, examIds: input.examIds })}
        )
      `;
    });

    res.status(201).json({ resource: await loadResource(id) });
  } catch (error) {
    sendError(res, error, "Unable to create learning resource");
  }
});

router.patch("/:id", requireAdminPermission("content.questions.update"), async (req, res) => {
  try {
    const id = resourceId(req.params.id);
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new LearningResourceError("ADMIN_SESSION_REQUIRED", "Administrator session required.", 403);
    const current = await loadResource(id) as { publicCode?: unknown; status?: unknown } | null;
    if (!current) throw new LearningResourceError("LEARNING_RESOURCE_NOT_FOUND", "Learning resource not found.", 404);
    if (String(current.status) !== "draft") {
      throw new LearningResourceError(
        "PUBLISHED_RESOURCE_FROZEN",
        "Published or archived resources are frozen. Create a replacement draft instead.",
        409,
      );
    }
    const input = resourceInput(req.body, String(current.publicCode));
    await validateReferences(input);

    await sqlClient`
      UPDATE content.learning_resources
      SET category = ${input.category},
          format = ${input.format},
          title = ${input.title},
          summary = ${input.summary},
          language_code = ${input.languageCode},
          content_date = ${input.contentDate},
          body_markdown = ${input.bodyMarkdown},
          content_url = ${input.contentUrl},
          expires_at = ${input.expiresAt},
          updated_by = ${actorUserId}::uuid,
          updated_at = now()
      WHERE id = ${id}::uuid
    `;
    await replaceExamTargets(id, input.examIds, actorUserId);
    res.json({ resource: await loadResource(id) });
  } catch (error) {
    sendError(res, error, "Unable to update learning resource");
  }
});

router.post("/:id/publish", requireAdminPermission("content.questions.publish"), async (req, res) => {
  try {
    const id = resourceId(req.params.id);
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new LearningResourceError("ADMIN_SESSION_REQUIRED", "Administrator session required.", 403);
    const current = await loadResource(id) as { status?: unknown; expiresAt?: unknown } | null;
    if (!current) throw new LearningResourceError("LEARNING_RESOURCE_NOT_FOUND", "Learning resource not found.", 404);
    if (String(current.status) !== "draft") {
      throw new LearningResourceError("RESOURCE_NOT_DRAFT", "Only draft resources can be published.", 409);
    }
    if (current.expiresAt && new Date(String(current.expiresAt)).getTime() <= Date.now()) {
      throw new LearningResourceError("RESOURCE_ALREADY_EXPIRED", "Choose a future expiry before publishing.", 409);
    }

    await sqlClient.begin(async (tx) => {
      await tx`
        UPDATE content.learning_resources
        SET status = 'published', published_at = now(),
            updated_by = ${actorUserId}::uuid, updated_at = now()
        WHERE id = ${id}::uuid
      `;
      await tx`
        INSERT INTO platform.audit_events (
          id, actor_type, actor_user_id, action_key, entity_type, entity_id, summary
        ) VALUES (
          ${randomUUID()}::uuid,
          'user'::audit_actor_type,
          ${actorUserId}::uuid,
          'content.learning_resource.published',
          'learning_resource',
          ${id}::uuid,
          'Published learner learning resource'
        )
      `;
    });
    res.json({ resource: await loadResource(id) });
  } catch (error) {
    sendError(res, error, "Unable to publish learning resource");
  }
});

router.post("/:id/archive", requireAdminPermission("content.questions.publish"), async (req, res) => {
  try {
    const id = resourceId(req.params.id);
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new LearningResourceError("ADMIN_SESSION_REQUIRED", "Administrator session required.", 403);
    const current = await loadResource(id);
    if (!current) throw new LearningResourceError("LEARNING_RESOURCE_NOT_FOUND", "Learning resource not found.", 404);

    await sqlClient.begin(async (tx) => {
      await tx`
        UPDATE content.learning_resources
        SET status = 'archived', updated_by = ${actorUserId}::uuid, updated_at = now()
        WHERE id = ${id}::uuid
      `;
      await tx`
        INSERT INTO platform.audit_events (
          id, actor_type, actor_user_id, action_key, entity_type, entity_id, summary
        ) VALUES (
          ${randomUUID()}::uuid,
          'user'::audit_actor_type,
          ${actorUserId}::uuid,
          'content.learning_resource.archived',
          'learning_resource',
          ${id}::uuid,
          'Archived learner learning resource'
        )
      `;
    });
    res.json({ resource: await loadResource(id) });
  } catch (error) {
    sendError(res, error, "Unable to archive learning resource");
  }
});

export default router;

import { randomUUID } from "node:crypto";

import { sqlClient } from "../lib/db";
import { promotionPayloadHash } from "./question-promotion-policy";
import {
  gradeCurrentAffairsQuiz,
  learnerQuizQuestion,
  quizSnapshotPayload,
  type CurrentAffairsQuizGradeInput,
  type CurrentAffairsQuizSnapshotPayload,
  type QuizLanguageCode,
} from "./quiz-delivery-policy";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const PUBLIC_CODE_PATTERN = /^CA-QZ-(D|W|M)-\d{8}-[A-Z0-9_-]{2,24}-V\d+$/;

type SqlClient = typeof sqlClient;

type DeliverySourceItem = {
  generationItemId: string;
  itemNumber: number;
  questionFamily: string;
  sourcePayload: Record<string, unknown>;
  hindiPayload: Record<string, unknown>;
  punjabiPayload: Record<string, unknown>;
  promotionId: string;
  promotionStatus: string;
  questionId: string;
  questionVersionId: string;
  promotedSourceHash: string;
  promotedHindiHash: string;
  promotedPunjabiHash: string;
};

type DeliveryRelease = {
  id: string;
  publicCode: string;
  status: string;
  sourceFingerprint: string;
  releaseVersion: number;
  periodType: "daily" | "weekly" | "monthly";
  periodStart: string;
  periodEnd: string;
  examFamily: string;
  approvedAt: string;
};

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function releaseToken(periodType: DeliveryRelease["periodType"]): "D" | "W" | "M" {
  if (periodType === "daily") return "D";
  if (periodType === "weekly") return "W";
  return "M";
}

function deliveryCode(release: DeliveryRelease): string {
  return `CA-QZ-${releaseToken(release.periodType)}-${release.periodEnd.replaceAll("-", "")}-${release.examFamily.toUpperCase()}-V${release.releaseVersion}`;
}

function assertUuid(value: string, label: string): string {
  if (!UUID_PATTERN.test(value)) throw new Error(`${label} is invalid`);
  return value;
}

function assertPublicCode(value: string): string {
  const code = value.trim().toUpperCase();
  if (!PUBLIC_CODE_PATTERN.test(code)) throw new Error("Current Affairs quiz code is invalid");
  return code;
}

async function loadDeliveryRelease(releaseId: string, client: SqlClient): Promise<DeliveryRelease> {
  const rows = await client`
    SELECT
      id::text AS id,
      public_code AS "publicCode",
      status,
      source_fingerprint AS "sourceFingerprint",
      release_version::int AS "releaseVersion",
      period_type AS "periodType",
      period_start::text AS "periodStart",
      period_end::text AS "periodEnd",
      exam_family_key AS "examFamily",
      approved_at::text AS "approvedAt"
    FROM content.current_affairs_releases
    WHERE id=${releaseId}::uuid
    LIMIT 1
  `;
  const row = rows[0];
  if (!row) throw new Error("Current Affairs release not found");
  return {
    id: String(row.id),
    publicCode: String(row.publicCode),
    status: String(row.status),
    sourceFingerprint: String(row.sourceFingerprint),
    releaseVersion: Number(row.releaseVersion),
    periodType: String(row.periodType) as DeliveryRelease["periodType"],
    periodStart: String(row.periodStart).slice(0, 10),
    periodEnd: String(row.periodEnd).slice(0, 10),
    examFamily: String(row.examFamily),
    approvedAt: String(row.approvedAt),
  };
}

async function loadDeliverySourceItems(releaseId: string, client: SqlClient): Promise<DeliverySourceItem[]> {
  const rows = await client`
    SELECT
      release_item.generation_item_id::text AS "generationItemId",
      generation_item.item_number::int AS "itemNumber",
      question_link.question_family AS "questionFamily",
      source_version.payload AS "sourcePayload",
      hi.localized_payload AS "hindiPayload",
      pa.localized_payload AS "punjabiPayload",
      promotion.id::text AS "promotionId",
      promotion.status AS "promotionStatus",
      promotion.question_id::text AS "questionId",
      promotion.question_version_id::text AS "questionVersionId",
      promotion.source_payload_hash AS "promotedSourceHash",
      promotion.hindi_payload_hash AS "promotedHindiHash",
      promotion.punjabi_payload_hash AS "promotedPunjabiHash"
    FROM content.current_affairs_release_question_items release_item
    JOIN content.generation_run_items generation_item
      ON generation_item.id=release_item.generation_item_id
    JOIN content.generation_item_versions source_version
      ON source_version.id=release_item.source_generation_version_id
    JOIN content.current_affairs_question_links question_link
      ON question_link.generation_item_id=release_item.generation_item_id
    JOIN content.current_affairs_question_localizations hi
      ON hi.id=release_item.hindi_localization_id
    JOIN content.current_affairs_question_localizations pa
      ON pa.id=release_item.punjabi_localization_id
    LEFT JOIN content.current_affairs_question_promotions promotion
      ON promotion.release_id=release_item.release_id
     AND promotion.generation_item_id=release_item.generation_item_id
    WHERE release_item.release_id=${releaseId}::uuid
    ORDER BY generation_item.item_number
  `;
  return rows.map((row) => ({
    generationItemId: String(row.generationItemId),
    itemNumber: Number(row.itemNumber),
    questionFamily: String(row.questionFamily),
    sourcePayload: record(row.sourcePayload),
    hindiPayload: record(row.hindiPayload),
    punjabiPayload: record(row.punjabiPayload),
    promotionId: row.promotionId ? String(row.promotionId) : "",
    promotionStatus: row.promotionStatus ? String(row.promotionStatus) : "missing",
    questionId: row.questionId ? String(row.questionId) : "",
    questionVersionId: row.questionVersionId ? String(row.questionVersionId) : "",
    promotedSourceHash: row.promotedSourceHash ? String(row.promotedSourceHash) : "",
    promotedHindiHash: row.promotedHindiHash ? String(row.promotedHindiHash) : "",
    promotedPunjabiHash: row.promotedPunjabiHash ? String(row.promotedPunjabiHash) : "",
  }));
}

function sanitizedSnapshots(item: DeliverySourceItem) {
  const english = quizSnapshotPayload(item.sourcePayload);
  const hindi = quizSnapshotPayload(item.hindiPayload);
  const punjabi = quizSnapshotPayload(item.punjabiPayload);
  const blockers: string[] = [];
  if (item.promotionStatus !== "active" || !item.promotionId) blockers.push("Active CP015 promotion is missing");
  if (!english || !hindi || !punjabi) blockers.push("EN/HI/PA promotion payload is not a valid quiz question");
  if (promotionPayloadHash(item.sourcePayload) !== item.promotedSourceHash) blockers.push("English release payload no longer matches CP015 promotion hash");
  if (promotionPayloadHash(item.hindiPayload) !== item.promotedHindiHash) blockers.push("Hindi release payload no longer matches CP015 promotion hash");
  if (promotionPayloadHash(item.punjabiPayload) !== item.promotedPunjabiHash) blockers.push("Punjabi release payload no longer matches CP015 promotion hash");
  if (english && hindi && (english.correctIndex !== hindi.correctIndex || english.options.length !== hindi.options.length)) {
    blockers.push("Hindi delivery snapshot breaks answer-index or option-count parity");
  }
  if (english && punjabi && (english.correctIndex !== punjabi.correctIndex || english.options.length !== punjabi.options.length)) {
    blockers.push("Punjabi delivery snapshot breaks answer-index or option-count parity");
  }
  return { english, hindi, punjabi, blockers };
}

async function existingDelivery(releaseId: string, client: SqlClient) {
  const rows = await client`
    SELECT id::text AS id, public_code AS "publicCode", status, item_count::int AS "itemCount",
           published_at::text AS "publishedAt", revoked_at::text AS "revokedAt"
    FROM content.current_affairs_quiz_deliveries
    WHERE release_id=${releaseId}::uuid
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function loadCurrentAffairsQuizDeliveryCandidate(releaseId: string) {
  const id = assertUuid(releaseId, "Current Affairs release ID");
  const release = await loadDeliveryRelease(id, sqlClient);
  const items = await loadDeliverySourceItems(id, sqlClient);
  const itemReadiness = items.map((item) => ({
    generationItemId: item.generationItemId,
    itemNumber: item.itemNumber,
    questionFamily: item.questionFamily,
    promotionId: item.promotionId || null,
    blockers: sanitizedSnapshots(item).blockers,
  }));
  const blockers: string[] = [];
  if (release.status !== "approved") blockers.push("Source CP014 release is not active approved");
  if (items.length === 0) blockers.push("Source release has no question items");
  for (const item of itemReadiness) blockers.push(...item.blockers.map((blocker) => `Item ${item.itemNumber}: ${blocker}`));
  const delivery = await existingDelivery(id, sqlClient);
  if (delivery && String(delivery.status) === "revoked") {
    blockers.push("This release quiz delivery was revoked; use a new corrected Current Affairs release version");
  }
  return {
    release,
    delivery,
    items: itemReadiness,
    itemCount: items.length,
    ready: blockers.length === 0,
    blockers,
  };
}

export async function listCurrentAffairsQuizDeliveryQueue(limit = 100) {
  const safeLimit = Math.max(1, Math.min(300, Math.floor(limit)));
  return sqlClient`
    SELECT
      release.id::text AS "releaseId",
      release.public_code AS "releaseCode",
      release.period_type AS "periodType",
      release.period_start::text AS "periodStart",
      release.period_end::text AS "periodEnd",
      release.exam_family_key AS "examFamily",
      release.release_version::int AS "releaseVersion",
      release.approved_at AS "approvedAt",
      count(release_item.generation_item_id)::int AS "questionItemCount",
      count(promotion.id) FILTER (WHERE promotion.status='active')::int AS "activePromotionCount",
      delivery.id::text AS "deliveryId",
      delivery.public_code AS "deliveryCode",
      COALESCE(delivery.status, 'missing') AS "deliveryStatus"
    FROM content.current_affairs_releases release
    JOIN content.current_affairs_release_question_items release_item ON release_item.release_id=release.id
    LEFT JOIN content.current_affairs_question_promotions promotion
      ON promotion.release_id=release.id
     AND promotion.generation_item_id=release_item.generation_item_id
    LEFT JOIN content.current_affairs_quiz_deliveries delivery ON delivery.release_id=release.id
    WHERE release.status='approved'
    GROUP BY release.id, delivery.id
    ORDER BY release.approved_at DESC
    LIMIT ${safeLimit}
  `;
}

export async function publishCurrentAffairsQuizDelivery(args: {
  releaseId: string;
  actorUserId: string;
  reason: string;
}) {
  const releaseId = assertUuid(args.releaseId, "Current Affairs release ID");
  const reason = args.reason.replace(/\s+/g, " ").trim();
  if (reason.length < 8) throw new Error("Current Affairs quiz publication requires an editorial reason");

  return sqlClient.begin(async (tx) => {
    const client = tx as SqlClient;
    await client`SELECT pg_advisory_xact_lock(hashtext(${`examtree.ca.quiz-delivery:${releaseId}`}))`;
    const release = await loadDeliveryRelease(releaseId, client);
    if (release.status !== "approved") throw new Error("Only an active approved Current Affairs release can publish a learner quiz");
    const currentDelivery = await existingDelivery(releaseId, client);
    if (currentDelivery) {
      if (String(currentDelivery.status) === "published") {
        return {
          id: String(currentDelivery.id),
          publicCode: String(currentDelivery.publicCode),
          status: "published" as const,
          itemCount: Number(currentDelivery.itemCount),
          alreadyPublished: true,
        };
      }
      throw new Error("A revoked Current Affairs quiz delivery cannot be republished; create a corrected release version");
    }

    const items = await loadDeliverySourceItems(releaseId, client);
    if (items.length === 0) throw new Error("Current Affairs release has no promoted quiz items");
    const snapshots = items.map((item) => ({ item, ...sanitizedSnapshots(item) }));
    const blocked = snapshots.filter((entry) => entry.blockers.length > 0);
    if (blocked.length) {
      throw new Error(`Current Affairs learner quiz is blocked: ${blocked.map((entry) =>
        `item ${entry.item.itemNumber}: ${entry.blockers.join("; ")}`).join(" | ")}`);
    }

    const deliveryId = randomUUID();
    const code = deliveryCode(release);
    await client`
      INSERT INTO content.current_affairs_quiz_deliveries (
        id, public_code, release_id, status, item_count, source_fingerprint,
        publication_reason, published_by, published_at, metadata, created_at, updated_at
      ) VALUES (
        ${deliveryId}::uuid, ${code}, ${releaseId}::uuid, 'published', ${items.length},
        ${release.sourceFingerprint}, ${reason}, ${args.actorUserId}::uuid, now(),
        ${JSON.stringify({
          sourceReleaseCode: release.publicCode,
          sourceReleaseVersion: release.releaseVersion,
          examFamily: release.examFamily,
          periodType: release.periodType,
          periodStart: release.periodStart,
          periodEnd: release.periodEnd,
          deliveryLanguages: ["en", "hi", "pa"],
          scoringMode: "server_side_stateless_v1",
          canonicalQuestionPublicationRequired: false,
        })}::jsonb,
        now(), now()
      )
    `;

    for (let index = 0; index < snapshots.length; index += 1) {
      const entry = snapshots[index]!;
      const item = entry.item;
      if (!entry.english || !entry.hindi || !entry.punjabi) throw new Error("Quiz snapshot normalization failed unexpectedly");
      await client`
        INSERT INTO content.current_affairs_quiz_delivery_items (
          id, quiz_delivery_id, promotion_id, generation_item_id,
          question_id, question_version_id, question_family, sort_order,
          english_payload, hindi_payload, punjabi_payload,
          source_payload_hash, hindi_payload_hash, punjabi_payload_hash, created_at
        ) VALUES (
          ${randomUUID()}::uuid, ${deliveryId}::uuid, ${item.promotionId}::uuid,
          ${item.generationItemId}::uuid, ${item.questionId}::uuid, ${item.questionVersionId}::uuid,
          ${item.questionFamily}, ${index + 1},
          ${JSON.stringify(entry.english)}::jsonb, ${JSON.stringify(entry.hindi)}::jsonb,
          ${JSON.stringify(entry.punjabi)}::jsonb, ${item.promotedSourceHash},
          ${item.promotedHindiHash}, ${item.promotedPunjabiHash}, now()
        )
      `;
    }

    await client`
      INSERT INTO platform.audit_events (
        id, actor_type, actor_user_id, action_key, entity_type, entity_id,
        reason, summary, metadata
      ) VALUES (
        ${randomUUID()}::uuid, 'user'::audit_actor_type, ${args.actorUserId}::uuid,
        'current_affairs.quiz_delivery.published', 'current_affairs_quiz_delivery', ${deliveryId}::uuid,
        ${reason}, ${`Published learner Current Affairs quiz ${code}`},
        ${JSON.stringify({ releaseId, releaseCode: release.publicCode, itemCount: items.length, languages: ["en", "hi", "pa"] })}::jsonb
      )
    `;
    await client`
      INSERT INTO platform.outbox_events (
        id, aggregate_type, aggregate_id, event_type, payload
      ) VALUES (
        ${randomUUID()}::uuid, 'current_affairs_quiz_delivery', ${deliveryId}::uuid,
        'current_affairs.quiz_delivery.published',
        ${JSON.stringify({ deliveryId, publicCode: code, releaseId, releaseCode: release.publicCode, itemCount: items.length })}::jsonb
      )
    `;
    return { id: deliveryId, publicCode: code, status: "published" as const, itemCount: items.length, alreadyPublished: false };
  });
}

export async function revokeCurrentAffairsQuizDelivery(args: {
  deliveryId: string;
  actorUserId: string;
  reason: string;
}) {
  const deliveryId = assertUuid(args.deliveryId, "Current Affairs quiz delivery ID");
  const reason = args.reason.replace(/\s+/g, " ").trim();
  if (reason.length < 8) throw new Error("Current Affairs quiz revocation requires an editorial reason");
  return sqlClient.begin(async (tx) => {
    const rows = await tx`
      SELECT id::text AS id, public_code AS "publicCode", status
      FROM content.current_affairs_quiz_deliveries
      WHERE id=${deliveryId}::uuid
      FOR UPDATE
    `;
    const delivery = rows[0];
    if (!delivery) throw new Error("Current Affairs quiz delivery not found");
    if (String(delivery.status) !== "published") throw new Error("Only a published Current Affairs quiz delivery can be revoked");
    await tx`
      UPDATE content.current_affairs_quiz_deliveries
      SET status='revoked', revoked_by=${args.actorUserId}::uuid, revoked_at=now(),
          revocation_reason=${reason}, updated_at=now()
      WHERE id=${deliveryId}::uuid
    `;
    await tx`
      INSERT INTO platform.audit_events (
        id, actor_type, actor_user_id, action_key, entity_type, entity_id,
        reason, summary
      ) VALUES (
        ${randomUUID()}::uuid, 'user'::audit_actor_type, ${args.actorUserId}::uuid,
        'current_affairs.quiz_delivery.revoked', 'current_affairs_quiz_delivery', ${deliveryId}::uuid,
        ${reason}, ${`Revoked learner Current Affairs quiz ${String(delivery.publicCode)}`}
      )
    `;
    return { id: deliveryId, publicCode: String(delivery.publicCode), status: "revoked" as const };
  });
}

export async function listPublishedCurrentAffairsQuizzes(limit = 50) {
  const safeLimit = Math.max(1, Math.min(100, Math.floor(limit)));
  return sqlClient`
    SELECT
      delivery.public_code AS "publicCode",
      delivery.item_count::int AS "itemCount",
      delivery.published_at AS "publishedAt",
      release.period_type AS "periodType",
      release.period_start::text AS "periodStart",
      release.period_end::text AS "periodEnd",
      release.exam_family_key AS "examFamily",
      release.release_version::int AS "releaseVersion"
    FROM content.current_affairs_quiz_deliveries delivery
    JOIN content.current_affairs_releases release ON release.id=delivery.release_id
    WHERE delivery.status='published' AND release.status='approved'
    ORDER BY release.period_end DESC, delivery.published_at DESC
    LIMIT ${safeLimit}
  `;
}

async function loadPublishedDelivery(code: string) {
  const rows = await sqlClient`
    SELECT
      delivery.id::text AS id,
      delivery.public_code AS "publicCode",
      delivery.item_count::int AS "itemCount",
      delivery.published_at AS "publishedAt",
      release.period_type AS "periodType",
      release.period_start::text AS "periodStart",
      release.period_end::text AS "periodEnd",
      release.exam_family_key AS "examFamily",
      release.release_version::int AS "releaseVersion"
    FROM content.current_affairs_quiz_deliveries delivery
    JOIN content.current_affairs_releases release ON release.id=delivery.release_id
    WHERE delivery.public_code=${code}
      AND delivery.status='published'
      AND release.status='approved'
    LIMIT 1
  `;
  return rows[0] ?? null;
}

async function loadDeliveryItems(deliveryId: string, languageCode: QuizLanguageCode) {
  const payloadColumn = languageCode === "hi"
    ? sqlClient`item.hindi_payload`
    : languageCode === "pa"
      ? sqlClient`item.punjabi_payload`
      : sqlClient`item.english_payload`;
  const rows = await sqlClient`
    SELECT id::text AS id, sort_order::int AS "itemNumber", question_family AS "questionFamily",
           ${payloadColumn} AS payload
    FROM content.current_affairs_quiz_delivery_items item
    WHERE item.quiz_delivery_id=${deliveryId}::uuid
    ORDER BY item.sort_order
  `;
  return rows.map((row) => {
    const payload = quizSnapshotPayload(row.payload);
    if (!payload) throw new Error("Published Current Affairs quiz contains an invalid stored snapshot");
    return {
      id: String(row.id),
      itemNumber: Number(row.itemNumber),
      questionFamily: String(row.questionFamily),
      payload,
    };
  });
}

export async function loadLearnerCurrentAffairsQuiz(codeInput: string, languageCode: QuizLanguageCode) {
  const code = assertPublicCode(codeInput);
  const delivery = await loadPublishedDelivery(code);
  if (!delivery) throw new Error("Published Current Affairs quiz not found");
  const items = await loadDeliveryItems(String(delivery.id), languageCode);
  return {
    quiz: {
      publicCode: String(delivery.publicCode),
      periodType: String(delivery.periodType),
      periodStart: String(delivery.periodStart).slice(0, 10),
      periodEnd: String(delivery.periodEnd).slice(0, 10),
      examFamily: String(delivery.examFamily),
      releaseVersion: Number(delivery.releaseVersion),
      languageCode,
      itemCount: items.length,
      publishedAt: delivery.publishedAt,
    },
    questions: items.map((item) => learnerQuizQuestion(item)),
  };
}

export async function gradeLearnerCurrentAffairsQuiz(args: {
  code: string;
  languageCode: QuizLanguageCode;
  answers: CurrentAffairsQuizGradeInput[];
}) {
  const code = assertPublicCode(args.code);
  const delivery = await loadPublishedDelivery(code);
  if (!delivery) throw new Error("Published Current Affairs quiz not found");
  const items = await loadDeliveryItems(String(delivery.id), args.languageCode);
  return {
    quiz: {
      publicCode: code,
      languageCode: args.languageCode,
      periodType: String(delivery.periodType),
      periodStart: String(delivery.periodStart).slice(0, 10),
      periodEnd: String(delivery.periodEnd).slice(0, 10),
      examFamily: String(delivery.examFamily),
    },
    grade: gradeCurrentAffairsQuiz({ items, answers: args.answers }),
  };
}

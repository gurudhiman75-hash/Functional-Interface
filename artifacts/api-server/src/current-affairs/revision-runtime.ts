import { randomUUID } from "node:crypto";

import { sqlClient } from "../lib/db";
import {
  gradeCurrentAffairsQuiz,
  learnerQuizQuestion,
  quizSnapshotPayload,
  type CurrentAffairsQuizGradeInput,
  type CurrentAffairsQuizSnapshotPayload,
  type QuizLanguageCode,
} from "./quiz-delivery-policy";
import {
  revisionStageLabel,
  transitionCurrentAffairsRevision,
  type CurrentAffairsReviewResult,
} from "./revision-policy";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const QUIZ_CODE_PATTERN = /^CA-QZ-(D|W|M)-\d{8}-[A-Z0-9_-]{2,24}-V\d+$/;
type SqlClient = typeof sqlClient;

type ActiveItem = {
  id: string;
  deliveryId: string;
  deliveryCode: string;
  itemNumber: number;
  questionFamily: string;
  englishPayload: Record<string, unknown>;
  hindiPayload: Record<string, unknown>;
  punjabiPayload: Record<string, unknown>;
};

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function normalizedQuizCode(value: string): string {
  const code = value.trim().toUpperCase();
  if (!QUIZ_CODE_PATTERN.test(code)) throw new Error("Current Affairs quiz code is invalid");
  return code;
}

function assertUuid(value: string, label: string): string {
  if (!UUID_PATTERN.test(value)) throw new Error(`${label} is invalid`);
  return value;
}

function payloadForLanguage(item: ActiveItem, languageCode: QuizLanguageCode): CurrentAffairsQuizSnapshotPayload {
  const raw = languageCode === "hi"
    ? item.hindiPayload
    : languageCode === "pa"
      ? item.punjabiPayload
      : item.englishPayload;
  const payload = quizSnapshotPayload(raw);
  if (!payload) throw new Error("Current Affairs revision item contains an invalid immutable quiz snapshot");
  return payload;
}

function resultForSelection(selectedIndex: number | null, correctIndex: number): CurrentAffairsReviewResult {
  if (selectedIndex == null) return "unanswered";
  return selectedIndex === correctIndex ? "correct" : "wrong";
}

function selectedAnswerMap(answers: CurrentAffairsQuizGradeInput[]) {
  const map = new Map<string, number | null>();
  for (const answer of answers) {
    if (!map.has(answer.id)) map.set(answer.id, answer.selectedIndex);
  }
  return map;
}

export async function resolveCurrentAffairsStudentUserId(firebaseUid: string, client: SqlClient = sqlClient) {
  const uid = firebaseUid.trim();
  if (!uid) throw new Error("Authenticated Firebase user is required");
  const rows = await client`
    SELECT user_row.id::text AS id
    FROM identity.auth_identities auth_identity
    JOIN identity.users user_row ON user_row.id=auth_identity.user_id
    JOIN identity.student_profiles student ON student.user_id=user_row.id
    WHERE auth_identity.provider='firebase'
      AND auth_identity.provider_subject=${uid}
      AND user_row.deleted_at IS NULL
      AND user_row.status='active'::user_status
    LIMIT 1
  `;
  if (!rows[0]?.id) throw new Error("Canonical active student account is required before saving Current Affairs progress");
  return String(rows[0].id);
}

async function activeDelivery(code: string, client: SqlClient) {
  const rows = await client`
    SELECT delivery.id::text AS id, delivery.public_code AS "publicCode"
    FROM content.current_affairs_quiz_deliveries delivery
    JOIN content.current_affairs_releases release ON release.id=delivery.release_id
    WHERE delivery.public_code=${code}
      AND delivery.status='published'
      AND release.status='approved'
    LIMIT 1
  `;
  const row = rows[0];
  if (!row) throw new Error("Published Current Affairs quiz not found");
  return { id: String(row.id), publicCode: String(row.publicCode) };
}

async function loadActiveDeliveryItems(deliveryId: string, client: SqlClient): Promise<ActiveItem[]> {
  const rows = await client`
    SELECT
      item.id::text AS id,
      item.quiz_delivery_id::text AS "deliveryId",
      delivery.public_code AS "deliveryCode",
      item.sort_order::int AS "itemNumber",
      item.question_family AS "questionFamily",
      item.english_payload AS "englishPayload",
      item.hindi_payload AS "hindiPayload",
      item.punjabi_payload AS "punjabiPayload"
    FROM content.current_affairs_quiz_delivery_items item
    JOIN content.current_affairs_quiz_deliveries delivery ON delivery.id=item.quiz_delivery_id
    JOIN content.current_affairs_releases release ON release.id=delivery.release_id
    WHERE item.quiz_delivery_id=${deliveryId}::uuid
      AND delivery.status='published'
      AND release.status='approved'
    ORDER BY item.sort_order
  `;
  return rows.map((row) => ({
    id: String(row.id),
    deliveryId: String(row.deliveryId),
    deliveryCode: String(row.deliveryCode),
    itemNumber: Number(row.itemNumber),
    questionFamily: String(row.questionFamily),
    englishPayload: record(row.englishPayload),
    hindiPayload: record(row.hindiPayload),
    punjabiPayload: record(row.punjabiPayload),
  }));
}

async function loadPersistedAttempt(attemptId: string, client: SqlClient) {
  const attempts = await client`
    SELECT id::text AS id, attempt_type AS "attemptType", language_code AS "languageCode",
      total_count::int AS total, correct_count::int AS correct, wrong_count::int AS wrong,
      unanswered_count::int AS unanswered, score_percent::float8 AS "scorePercent",
      submitted_at AS "submittedAt"
    FROM content.current_affairs_learning_attempts
    WHERE id=${attemptId}::uuid
    LIMIT 1
  `;
  const attempt = attempts[0];
  if (!attempt) throw new Error("Current Affairs learning attempt not found");
  const items = await client`
    SELECT item.quiz_delivery_item_id::text AS id, item.selected_index::int AS "selectedIndex",
      item.correct_index::int AS "correctIndex", item.result,
      item.revision_stage_before::int AS "revisionStageBefore",
      item.revision_stage_after::int AS "revisionStageAfter",
      item.next_review_at AS "nextReviewAt",
      snapshot.english_payload AS "englishPayload",
      snapshot.hindi_payload AS "hindiPayload",
      snapshot.punjabi_payload AS "punjabiPayload"
    FROM content.current_affairs_learning_attempt_items item
    JOIN content.current_affairs_quiz_delivery_items snapshot ON snapshot.id=item.quiz_delivery_item_id
    WHERE item.attempt_id=${attemptId}::uuid
    ORDER BY snapshot.sort_order
  `;
  const languageCode = String(attempt.languageCode) as QuizLanguageCode;
  return {
    attempt: {
      id: String(attempt.id),
      attemptType: String(attempt.attemptType),
      languageCode,
      total: Number(attempt.total),
      correct: Number(attempt.correct),
      wrong: Number(attempt.wrong),
      unanswered: Number(attempt.unanswered),
      scorePercent: Number(attempt.scorePercent),
      submittedAt: attempt.submittedAt,
    },
    results: items.map((row) => {
      const raw = languageCode === "hi" ? row.hindiPayload : languageCode === "pa" ? row.punjabiPayload : row.englishPayload;
      const payload = quizSnapshotPayload(raw);
      return {
        id: String(row.id),
        selectedIndex: row.selectedIndex == null ? null : Number(row.selectedIndex),
        correctIndex: Number(row.correctIndex),
        result: String(row.result),
        correctAnswer: payload?.options[Number(row.correctIndex)] ?? null,
        explanation: payload?.explanation ?? null,
        revisionStageBefore: Number(row.revisionStageBefore),
        revisionStageAfter: Number(row.revisionStageAfter),
        nextReviewAt: row.nextReviewAt,
      };
    }),
  };
}

async function existingAttemptByClientId(userId: string, clientAttemptId: string, client: SqlClient) {
  const rows = await client`
    SELECT id::text AS id
    FROM content.current_affairs_learning_attempts
    WHERE user_id=${userId}::uuid AND client_attempt_id=${clientAttemptId}::uuid
    LIMIT 1
  `;
  return rows[0]?.id ? String(rows[0].id) : null;
}

async function scheduleForUpdate(userId: string, itemId: string, client: SqlClient) {
  const rows = await client`
    SELECT stage::int AS stage, next_review_at::text AS "nextReviewAt",
      correct_streak::int AS "correctStreak", review_count::int AS "reviewCount"
    FROM content.current_affairs_revision_schedule
    WHERE user_id=${userId}::uuid AND quiz_delivery_item_id=${itemId}::uuid
    FOR UPDATE
  `;
  return rows[0] ?? null;
}

async function upsertSchedule(args: {
  client: SqlClient;
  userId: string;
  itemId: string;
  attemptId: string;
  result: CurrentAffairsReviewResult;
  stage: number;
  nextReviewAt: string;
  previousCorrectStreak: number;
  previousReviewCount: number;
}) {
  const correctStreak = args.result === "correct" ? args.previousCorrectStreak + 1 : 0;
  await args.client`
    INSERT INTO content.current_affairs_revision_schedule (
      user_id, quiz_delivery_item_id, stage, review_count, correct_streak,
      last_result, first_seen_at, last_reviewed_at, next_review_at,
      last_attempt_id, updated_at
    ) VALUES (
      ${args.userId}::uuid, ${args.itemId}::uuid, ${args.stage}, ${args.previousReviewCount + 1},
      ${correctStreak}, ${args.result}, now(), now(), ${args.nextReviewAt}, ${args.attemptId}::uuid, now()
    )
    ON CONFLICT (user_id, quiz_delivery_item_id) DO UPDATE SET
      stage=EXCLUDED.stage,
      review_count=content.current_affairs_revision_schedule.review_count + 1,
      correct_streak=${correctStreak},
      last_result=EXCLUDED.last_result,
      last_reviewed_at=now(),
      next_review_at=EXCLUDED.next_review_at,
      last_attempt_id=EXCLUDED.last_attempt_id,
      updated_at=now()
  `;
}

export async function submitTrackedCurrentAffairsQuiz(args: {
  firebaseUid: string;
  code: string;
  clientAttemptId: string;
  languageCode: QuizLanguageCode;
  answers: CurrentAffairsQuizGradeInput[];
}) {
  const code = normalizedQuizCode(args.code);
  const clientAttemptId = assertUuid(args.clientAttemptId, "Client attempt ID");
  return sqlClient.begin(async (tx) => {
    const client = tx as SqlClient;
    const userId = await resolveCurrentAffairsStudentUserId(args.firebaseUid, client);
    await client`SELECT pg_advisory_xact_lock(hashtext(${`examtree.ca.attempt:${userId}:${clientAttemptId}`}))`;
    const duplicate = await existingAttemptByClientId(userId, clientAttemptId, client);
    if (duplicate) return { ...(await loadPersistedAttempt(duplicate, client)), idempotentReplay: true };

    const delivery = await activeDelivery(code, client);
    const items = await loadActiveDeliveryItems(delivery.id, client);
    if (items.length === 0) throw new Error("Published Current Affairs quiz has no items");
    const answerMap = selectedAnswerMap(args.answers);
    const gradeItems = items.map((item) => ({
      id: item.id,
      itemNumber: item.itemNumber,
      questionFamily: item.questionFamily,
      payload: payloadForLanguage(item, args.languageCode),
    }));
    const grade = gradeCurrentAffairsQuiz({ items: gradeItems, answers: args.answers });
    const attemptId = randomUUID();
    await client`
      INSERT INTO content.current_affairs_learning_attempts (
        id, user_id, client_attempt_id, attempt_type, quiz_delivery_id,
        language_code, total_count, correct_count, wrong_count, unanswered_count,
        score_percent, metadata, submitted_at, created_at
      ) VALUES (
        ${attemptId}::uuid, ${userId}::uuid, ${clientAttemptId}::uuid, 'quiz', ${delivery.id}::uuid,
        ${args.languageCode}, ${grade.total}, ${grade.correct}, ${grade.wrong}, ${grade.unanswered},
        ${grade.scorePercent}, ${JSON.stringify({ quizCode: code, revisionPolicy: "ca-cp017-d3-d7-d15-d30-d60" })}::jsonb,
        now(), now()
      )
    `;

    const now = new Date();
    for (const item of gradeItems) {
      const selectedRaw = answerMap.has(item.id) ? answerMap.get(item.id)! : null;
      const selectedIndex = Number.isInteger(selectedRaw) && Number(selectedRaw) >= 0 && Number(selectedRaw) < item.payload.options.length
        ? Number(selectedRaw)
        : null;
      const result = resultForSelection(selectedIndex, item.payload.correctIndex);
      const previous = await scheduleForUpdate(userId, item.id, client);
      const stageBefore = previous ? Number(previous.stage) : 0;
      const transition = transitionCurrentAffairsRevision({
        mode: "quiz",
        result,
        currentStage: previous ? stageBefore : null,
        currentNextReviewAt: previous?.nextReviewAt ? String(previous.nextReviewAt) : null,
        now,
      });
      await client`
        INSERT INTO content.current_affairs_learning_attempt_items (
          attempt_id, quiz_delivery_item_id, selected_index, correct_index, result,
          revision_stage_before, revision_stage_after, next_review_at, created_at
        ) VALUES (
          ${attemptId}::uuid, ${item.id}::uuid, ${selectedIndex}, ${item.payload.correctIndex}, ${result},
          ${stageBefore}, ${transition.stage}, ${transition.nextReviewAt}, now()
        )
      `;
      await upsertSchedule({
        client,
        userId,
        itemId: item.id,
        attemptId,
        result,
        stage: transition.stage,
        nextReviewAt: transition.nextReviewAt,
        previousCorrectStreak: Number(previous?.correctStreak ?? 0),
        previousReviewCount: Number(previous?.reviewCount ?? 0),
      });
    }
    return { ...(await loadPersistedAttempt(attemptId, client)), idempotentReplay: false };
  });
}

export async function loadCurrentAffairsRevisionQueue(args: {
  firebaseUid: string;
  languageCode: QuizLanguageCode;
  limit?: number;
}) {
  const userId = await resolveCurrentAffairsStudentUserId(args.firebaseUid);
  const limit = Math.max(1, Math.min(100, Math.floor(args.limit ?? 30)));
  const rows = await sqlClient`
    SELECT
      schedule.quiz_delivery_item_id::text AS id,
      schedule.stage::int AS stage,
      schedule.next_review_at::text AS "nextReviewAt",
      schedule.last_result AS "lastResult",
      schedule.review_count::int AS "reviewCount",
      item.sort_order::int AS "itemNumber",
      item.question_family AS "questionFamily",
      item.english_payload AS "englishPayload",
      item.hindi_payload AS "hindiPayload",
      item.punjabi_payload AS "punjabiPayload",
      delivery.id::text AS "deliveryId",
      delivery.public_code AS "deliveryCode"
    FROM content.current_affairs_revision_schedule schedule
    JOIN content.current_affairs_quiz_delivery_items item ON item.id=schedule.quiz_delivery_item_id
    JOIN content.current_affairs_quiz_deliveries delivery ON delivery.id=item.quiz_delivery_id
    JOIN content.current_affairs_releases release ON release.id=delivery.release_id
    WHERE schedule.user_id=${userId}::uuid
      AND schedule.next_review_at <= now()
      AND delivery.status='published'
      AND release.status='approved'
    ORDER BY schedule.next_review_at, schedule.stage, delivery.public_code, item.sort_order
    LIMIT ${limit}
  `;
  const due = rows.map((row) => {
    const item: ActiveItem = {
      id: String(row.id),
      deliveryId: String(row.deliveryId),
      deliveryCode: String(row.deliveryCode),
      itemNumber: Number(row.itemNumber),
      questionFamily: String(row.questionFamily),
      englishPayload: record(row.englishPayload),
      hindiPayload: record(row.hindiPayload),
      punjabiPayload: record(row.punjabiPayload),
    };
    const payload = payloadForLanguage(item, args.languageCode);
    return {
      ...learnerQuizQuestion({ id: item.id, itemNumber: item.itemNumber, questionFamily: item.questionFamily, payload }),
      sourceQuizCode: item.deliveryCode,
      revision: {
        stage: Number(row.stage),
        stageLabel: revisionStageLabel(Number(row.stage)),
        dueAt: String(row.nextReviewAt),
        lastResult: String(row.lastResult),
        reviewCount: Number(row.reviewCount),
      },
    };
  });
  const counts = await sqlClient`
    SELECT
      count(*) FILTER (WHERE next_review_at <= now())::int AS due,
      count(*) FILTER (WHERE next_review_at > now())::int AS upcoming,
      min(next_review_at) FILTER (WHERE next_review_at > now())::text AS "nextUpcomingAt"
    FROM content.current_affairs_revision_schedule schedule
    JOIN content.current_affairs_quiz_delivery_items item ON item.id=schedule.quiz_delivery_item_id
    JOIN content.current_affairs_quiz_deliveries delivery ON delivery.id=item.quiz_delivery_id
    JOIN content.current_affairs_releases release ON release.id=delivery.release_id
    WHERE schedule.user_id=${userId}::uuid
      AND delivery.status='published'
      AND release.status='approved'
  `;
  return {
    languageCode: args.languageCode,
    due,
    dueCount: Number(counts[0]?.due ?? 0),
    upcomingCount: Number(counts[0]?.upcoming ?? 0),
    nextUpcomingAt: counts[0]?.nextUpcomingAt ?? null,
    generatedAt: new Date().toISOString(),
  };
}

export async function submitCurrentAffairsRevision(args: {
  firebaseUid: string;
  clientAttemptId: string;
  languageCode: QuizLanguageCode;
  answers: CurrentAffairsQuizGradeInput[];
}) {
  const clientAttemptId = assertUuid(args.clientAttemptId, "Client attempt ID");
  if (args.answers.length < 1 || args.answers.length > 100) throw new Error("Revision submission must contain between 1 and 100 due items");
  return sqlClient.begin(async (tx) => {
    const client = tx as SqlClient;
    const userId = await resolveCurrentAffairsStudentUserId(args.firebaseUid, client);
    await client`SELECT pg_advisory_xact_lock(hashtext(${`examtree.ca.attempt:${userId}:${clientAttemptId}`}))`;
    const duplicate = await existingAttemptByClientId(userId, clientAttemptId, client);
    if (duplicate) return { ...(await loadPersistedAttempt(duplicate, client)), idempotentReplay: true };

    const requestedIds = args.answers.map((answer) => assertUuid(answer.id, "Revision item ID"));
    const rows = await client`
      SELECT
        schedule.quiz_delivery_item_id::text AS id,
        schedule.stage::int AS stage,
        schedule.next_review_at::text AS "nextReviewAt",
        schedule.correct_streak::int AS "correctStreak",
        schedule.review_count::int AS "reviewCount",
        item.sort_order::int AS "itemNumber",
        item.question_family AS "questionFamily",
        item.quiz_delivery_id::text AS "deliveryId",
        delivery.public_code AS "deliveryCode",
        item.english_payload AS "englishPayload",
        item.hindi_payload AS "hindiPayload",
        item.punjabi_payload AS "punjabiPayload"
      FROM content.current_affairs_revision_schedule schedule
      JOIN content.current_affairs_quiz_delivery_items item ON item.id=schedule.quiz_delivery_item_id
      JOIN content.current_affairs_quiz_deliveries delivery ON delivery.id=item.quiz_delivery_id
      JOIN content.current_affairs_releases release ON release.id=delivery.release_id
      WHERE schedule.user_id=${userId}::uuid
        AND schedule.quiz_delivery_item_id = ANY(${requestedIds}::uuid[])
        AND schedule.next_review_at <= now()
        AND delivery.status='published'
        AND release.status='approved'
      FOR UPDATE OF schedule
    `;
    if (rows.length !== requestedIds.length) {
      throw new Error("Revision submission contains an item that is not currently due or no longer active");
    }
    const items: ActiveItem[] = rows.map((row) => ({
      id: String(row.id),
      deliveryId: String(row.deliveryId),
      deliveryCode: String(row.deliveryCode),
      itemNumber: Number(row.itemNumber),
      questionFamily: String(row.questionFamily),
      englishPayload: record(row.englishPayload),
      hindiPayload: record(row.hindiPayload),
      punjabiPayload: record(row.punjabiPayload),
    }));
    const rowById = new Map(rows.map((row) => [String(row.id), row]));
    const answerMap = selectedAnswerMap(args.answers);
    const gradeItems = items.map((item) => ({
      id: item.id,
      itemNumber: item.itemNumber,
      questionFamily: item.questionFamily,
      payload: payloadForLanguage(item, args.languageCode),
    }));
    const grade = gradeCurrentAffairsQuiz({ items: gradeItems, answers: args.answers });
    const attemptId = randomUUID();
    await client`
      INSERT INTO content.current_affairs_learning_attempts (
        id, user_id, client_attempt_id, attempt_type, quiz_delivery_id,
        language_code, total_count, correct_count, wrong_count, unanswered_count,
        score_percent, metadata, submitted_at, created_at
      ) VALUES (
        ${attemptId}::uuid, ${userId}::uuid, ${clientAttemptId}::uuid, 'revision', NULL,
        ${args.languageCode}, ${grade.total}, ${grade.correct}, ${grade.wrong}, ${grade.unanswered},
        ${grade.scorePercent}, ${JSON.stringify({ revisionPolicy: "ca-cp017-d3-d7-d15-d30-d60", source: "due_revision_queue" })}::jsonb,
        now(), now()
      )
    `;

    const now = new Date();
    for (const item of gradeItems) {
      const schedule = rowById.get(item.id)!;
      const selectedRaw = answerMap.has(item.id) ? answerMap.get(item.id)! : null;
      const selectedIndex = Number.isInteger(selectedRaw) && Number(selectedRaw) >= 0 && Number(selectedRaw) < item.payload.options.length
        ? Number(selectedRaw)
        : null;
      const result = resultForSelection(selectedIndex, item.payload.correctIndex);
      const stageBefore = Number(schedule.stage);
      const transition = transitionCurrentAffairsRevision({ mode: "revision", result, currentStage: stageBefore, now });
      await client`
        INSERT INTO content.current_affairs_learning_attempt_items (
          attempt_id, quiz_delivery_item_id, selected_index, correct_index, result,
          revision_stage_before, revision_stage_after, next_review_at, created_at
        ) VALUES (
          ${attemptId}::uuid, ${item.id}::uuid, ${selectedIndex}, ${item.payload.correctIndex}, ${result},
          ${stageBefore}, ${transition.stage}, ${transition.nextReviewAt}, now()
        )
      `;
      await upsertSchedule({
        client,
        userId,
        itemId: item.id,
        attemptId,
        result,
        stage: transition.stage,
        nextReviewAt: transition.nextReviewAt,
        previousCorrectStreak: Number(schedule.correctStreak ?? 0),
        previousReviewCount: Number(schedule.reviewCount ?? 0),
      });
    }
    return { ...(await loadPersistedAttempt(attemptId, client)), idempotentReplay: false };
  });
}

export async function listCurrentAffairsLearningAttempts(args: {
  firebaseUid: string;
  limit?: number;
}) {
  const userId = await resolveCurrentAffairsStudentUserId(args.firebaseUid);
  const limit = Math.max(1, Math.min(100, Math.floor(args.limit ?? 30)));
  return sqlClient`
    SELECT
      attempt.id::text AS id,
      attempt.client_attempt_id::text AS "clientAttemptId",
      attempt.attempt_type AS "attemptType",
      attempt.language_code AS "languageCode",
      attempt.total_count::int AS total,
      attempt.correct_count::int AS correct,
      attempt.wrong_count::int AS wrong,
      attempt.unanswered_count::int AS unanswered,
      attempt.score_percent::float8 AS "scorePercent",
      attempt.submitted_at AS "submittedAt",
      delivery.public_code AS "quizCode"
    FROM content.current_affairs_learning_attempts attempt
    LEFT JOIN content.current_affairs_quiz_deliveries delivery ON delivery.id=attempt.quiz_delivery_id
    WHERE attempt.user_id=${userId}::uuid
    ORDER BY attempt.submitted_at DESC
    LIMIT ${limit}
  `;
}

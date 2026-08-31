import { randomUUID } from "node:crypto";

import { sqlClient } from "../lib/db";
import { buildCurrentAffairsEngagementSignals } from "./personalization-policy";
import {
  canDeliverCurrentAffairsNotification,
  currentAffairsIndiaClock,
  DEFAULT_CURRENT_AFFAIRS_DAILY_NOTIFICATION_CAP,
  DEFAULT_CURRENT_AFFAIRS_NOTIFICATION_GAP_MINUTES,
  DEFAULT_CURRENT_AFFAIRS_QUIET_END,
  DEFAULT_CURRENT_AFFAIRS_QUIET_START,
  normalizeCurrentAffairsMuteUntil,
  normalizeCurrentAffairsNotificationCap,
  normalizeCurrentAffairsNotificationGapMinutes,
  normalizeCurrentAffairsQuietTime,
  type CurrentAffairsNotificationStatus,
} from "./notification-policy";
import { DEFAULT_CURRENT_AFFAIRS_DAILY_TARGET } from "./personalization-policy";
import { resolveCurrentAffairsStudentUserId } from "./revision-runtime";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_SCHEDULED_USERS_PER_RUN = 250;
type SqlClient = typeof sqlClient;

type NotificationPreferences = {
  inAppNotificationsEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  dailyNotificationCap: number;
  notificationGapMinutes: number;
  notificationsMutedUntil: string | null;
  revisionSignalEnabled: boolean;
  dailyPackSignalEnabled: boolean;
  studyTargetSignalEnabled: boolean;
  dailyQuestionTarget: number;
  preferredExamFamily: string;
};

const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  inAppNotificationsEnabled: true,
  quietHoursStart: DEFAULT_CURRENT_AFFAIRS_QUIET_START,
  quietHoursEnd: DEFAULT_CURRENT_AFFAIRS_QUIET_END,
  dailyNotificationCap: DEFAULT_CURRENT_AFFAIRS_DAILY_NOTIFICATION_CAP,
  notificationGapMinutes: DEFAULT_CURRENT_AFFAIRS_NOTIFICATION_GAP_MINUTES,
  notificationsMutedUntil: null,
  revisionSignalEnabled: true,
  dailyPackSignalEnabled: true,
  studyTargetSignalEnabled: true,
  dailyQuestionTarget: DEFAULT_CURRENT_AFFAIRS_DAILY_TARGET,
  preferredExamFamily: "general",
};

function assertUuid(value: string, label: string) {
  const normalized = value.trim();
  if (!UUID_PATTERN.test(normalized)) throw new Error(`${label} is invalid`);
  return normalized;
}

async function loadNotificationPreferences(userId: string, client: SqlClient = sqlClient): Promise<NotificationPreferences> {
  const rows = await client`
    SELECT
      in_app_notifications_enabled AS "inAppNotificationsEnabled",
      quiet_hours_start AS "quietHoursStart",
      quiet_hours_end AS "quietHoursEnd",
      daily_notification_cap::int AS "dailyNotificationCap",
      notification_gap_minutes::int AS "notificationGapMinutes",
      notifications_muted_until::text AS "notificationsMutedUntil",
      revision_signal_enabled AS "revisionSignalEnabled",
      daily_pack_signal_enabled AS "dailyPackSignalEnabled",
      study_target_signal_enabled AS "studyTargetSignalEnabled",
      daily_question_target::int AS "dailyQuestionTarget",
      preferred_exam_family AS "preferredExamFamily"
    FROM content.current_affairs_learner_preferences
    WHERE user_id=${userId}::uuid
    LIMIT 1
  `;
  const row = rows[0];
  if (!row) return DEFAULT_NOTIFICATION_PREFERENCES;
  return {
    inAppNotificationsEnabled: Boolean(row.inAppNotificationsEnabled),
    quietHoursStart: String(row.quietHoursStart),
    quietHoursEnd: String(row.quietHoursEnd),
    dailyNotificationCap: Number(row.dailyNotificationCap),
    notificationGapMinutes: Number(row.notificationGapMinutes),
    notificationsMutedUntil: row.notificationsMutedUntil ? String(row.notificationsMutedUntil) : null,
    revisionSignalEnabled: Boolean(row.revisionSignalEnabled),
    dailyPackSignalEnabled: Boolean(row.dailyPackSignalEnabled),
    studyTargetSignalEnabled: Boolean(row.studyTargetSignalEnabled),
    dailyQuestionTarget: Number(row.dailyQuestionTarget),
    preferredExamFamily: String(row.preferredExamFamily),
  };
}

async function loadSignalSnapshot(userId: string, preferences: NotificationPreferences, client: SqlClient = sqlClient) {
  const [scheduleRows, savedRows, studyRows, quizRows] = await Promise.all([
    client`
      SELECT
        count(*) FILTER (WHERE schedule.next_review_at <= now())::int AS "revisionDue",
        count(*) FILTER (
          WHERE schedule.next_review_at <= now()
            AND schedule.stage=0
            AND schedule.last_result <> 'correct'
        )::int AS "recoveryDue"
      FROM content.current_affairs_revision_schedule schedule
      JOIN content.current_affairs_quiz_delivery_items item ON item.id=schedule.quiz_delivery_item_id
      JOIN content.current_affairs_quiz_deliveries delivery ON delivery.id=item.quiz_delivery_id
      JOIN content.current_affairs_releases release ON release.id=delivery.release_id
      WHERE schedule.user_id=${userId}::uuid
        AND delivery.status='published'
        AND release.status='approved'
    `,
    client`
      SELECT count(*)::int AS due
      FROM content.current_affairs_saved_items saved
      WHERE saved.user_id=${userId}::uuid
        AND saved.save_mode='revise_later'
        AND saved.review_after <= now()
        AND (
          (
            saved.learning_resource_id IS NOT NULL
            AND EXISTS (
              SELECT 1
              FROM content.learning_resources resource
              JOIN content.current_affairs_release_compilations link ON link.learning_resource_id=resource.id
              JOIN content.current_affairs_releases release ON release.id=link.release_id
              WHERE resource.id=saved.learning_resource_id
                AND resource.status='published'
                AND resource.published_at <= now()
                AND (resource.expires_at IS NULL OR resource.expires_at > now())
                AND release.status='approved'
            )
          )
          OR
          (
            saved.quiz_delivery_item_id IS NOT NULL
            AND EXISTS (
              SELECT 1
              FROM content.current_affairs_quiz_delivery_items item
              JOIN content.current_affairs_quiz_deliveries delivery ON delivery.id=item.quiz_delivery_id
              JOIN content.current_affairs_releases release ON release.id=delivery.release_id
              WHERE item.id=saved.quiz_delivery_item_id
                AND delivery.status='published'
                AND release.status='approved'
            )
          )
        )
    `,
    client`
      SELECT COALESCE(sum(total_count), 0)::int AS count
      FROM content.current_affairs_learning_attempts
      WHERE user_id=${userId}::uuid
        AND (submitted_at AT TIME ZONE 'Asia/Kolkata')::date=(now() AT TIME ZONE 'Asia/Kolkata')::date
    `,
    client`
      SELECT delivery.public_code AS "quizCode"
      FROM content.current_affairs_quiz_deliveries delivery
      JOIN content.current_affairs_releases release ON release.id=delivery.release_id
      WHERE delivery.status='published'
        AND release.status='approved'
        AND release.period_type='daily'
        AND (${preferences.preferredExamFamily}='general' OR release.exam_family_key=${preferences.preferredExamFamily})
        AND NOT EXISTS (
          SELECT 1
          FROM content.current_affairs_learning_attempts attempt
          WHERE attempt.user_id=${userId}::uuid
            AND attempt.quiz_delivery_id=delivery.id
            AND attempt.attempt_type='quiz'
        )
      ORDER BY release.period_end DESC, delivery.published_at DESC
      LIMIT 1
    `,
  ]);
  return {
    revisionDue: Number(scheduleRows[0]?.revisionDue ?? 0),
    recoveryDue: Number(scheduleRows[0]?.recoveryDue ?? 0),
    savedReviewDue: Number(savedRows[0]?.due ?? 0),
    questionsStudiedToday: Number(studyRows[0]?.count ?? 0),
    latestUnattemptedQuizCode: quizRows[0]?.quizCode ? String(quizRows[0].quizCode) : null,
  };
}

async function loadDeliveryState(userId: string, client: SqlClient = sqlClient) {
  const rows = await client`
    SELECT
      count(*) FILTER (
        WHERE (delivered_at AT TIME ZONE 'Asia/Kolkata')::date=(now() AT TIME ZONE 'Asia/Kolkata')::date
      )::int AS "deliveredToday",
      max(delivered_at)::text AS "lastDeliveredAt"
    FROM content.current_affairs_inapp_notifications
    WHERE user_id=${userId}::uuid
  `;
  return {
    deliveredToday: Number(rows[0]?.deliveredToday ?? 0),
    lastDeliveredAt: rows[0]?.lastDeliveredAt ? new Date(String(rows[0].lastDeliveredAt)) : null,
  };
}

export async function materializeCurrentAffairsNotificationsForUser(userIdInput: string, client: SqlClient = sqlClient) {
  const userId = assertUuid(userIdInput, "Current Affairs notification user ID");
  const now = new Date();
  const clock = currentAffairsIndiaClock(now);
  const preferences = await loadNotificationPreferences(userId, client);
  const snapshot = await loadSignalSnapshot(userId, preferences, client);
  const signals = buildCurrentAffairsEngagementSignals({
    dayKey: clock.dayKey,
    revisionDue: snapshot.revisionDue,
    recoveryDue: snapshot.recoveryDue,
    savedReviewDue: snapshot.savedReviewDue,
    questionsStudiedToday: snapshot.questionsStudiedToday,
    dailyTarget: preferences.dailyQuestionTarget,
    latestUnattemptedQuizCode: snapshot.latestUnattemptedQuizCode,
    revisionSignalEnabled: preferences.revisionSignalEnabled,
    dailyPackSignalEnabled: preferences.dailyPackSignalEnabled,
    studyTargetSignalEnabled: preferences.studyTargetSignalEnabled,
  });

  const state = await loadDeliveryState(userId, client);
  let deliveredToday = state.deliveredToday;
  let lastDeliveredAt = state.lastDeliveredAt;
  let delivered = 0;
  let suppressed = 0;
  const suppressionReasons: Record<string, number> = {};

  for (const signal of signals) {
    const eligibility = canDeliverCurrentAffairsNotification({
      now,
      localTime: clock.localTime,
      enabled: preferences.inAppNotificationsEnabled,
      muteUntil: preferences.notificationsMutedUntil ? new Date(preferences.notificationsMutedUntil) : null,
      quietStart: preferences.quietHoursStart,
      quietEnd: preferences.quietHoursEnd,
      deliveredToday,
      dailyCap: preferences.dailyNotificationCap,
      lastDeliveredAt,
      minimumGapMinutes: preferences.notificationGapMinutes,
    });
    if (!eligibility.allowed) {
      suppressed += 1;
      suppressionReasons[eligibility.reason] = (suppressionReasons[eligibility.reason] ?? 0) + 1;
      continue;
    }

    const sourceQuizCode = signal.type === "daily_pack" ? snapshot.latestUnattemptedQuizCode : null;
    const inserted = await client`
      INSERT INTO content.current_affairs_inapp_notifications (
        id, user_id, signal_key, signal_type, urgency, title, body, deep_link,
        source_quiz_code, signal_count, status, delivered_at, created_at, updated_at
      ) VALUES (
        ${randomUUID()}::uuid, ${userId}::uuid, ${signal.key}, ${signal.type}, ${signal.urgency},
        ${signal.title}, ${signal.body}, ${signal.deepLink}, ${sourceQuizCode}, ${signal.count},
        'unread', now(), now(), now()
      )
      ON CONFLICT (user_id, signal_key) DO NOTHING
      RETURNING id::text AS id, delivered_at::text AS "deliveredAt"
    `;
    if (!inserted[0]) {
      suppressed += 1;
      suppressionReasons.duplicate = (suppressionReasons.duplicate ?? 0) + 1;
      continue;
    }
    delivered += 1;
    deliveredToday += 1;
    lastDeliveredAt = new Date(String(inserted[0].deliveredAt));
  }

  return { delivered, suppressed, suppressionReasons, signalCount: signals.length };
}

export async function loadCurrentAffairsNotificationInbox(args: {
  firebaseUid: string;
  limit?: number;
  materialize?: boolean;
}) {
  const userId = await resolveCurrentAffairsStudentUserId(args.firebaseUid);
  if (args.materialize !== false) await materializeCurrentAffairsNotificationsForUser(userId);
  const limit = Math.max(1, Math.min(50, Math.floor(args.limit ?? 20)));
  const [preferences, rows, unreadRows] = await Promise.all([
    loadNotificationPreferences(userId),
    sqlClient`
      SELECT
        notification.id::text AS id,
        notification.signal_type AS type,
        notification.urgency,
        notification.title,
        notification.body,
        notification.deep_link AS "deepLink",
        notification.signal_count::int AS count,
        notification.status,
        notification.delivered_at::text AS "deliveredAt",
        notification.read_at::text AS "readAt"
      FROM content.current_affairs_inapp_notifications notification
      WHERE notification.user_id=${userId}::uuid
        AND notification.status <> 'dismissed'
        AND (
          notification.signal_type <> 'daily_pack'
          OR EXISTS (
            SELECT 1
            FROM content.current_affairs_quiz_deliveries delivery
            JOIN content.current_affairs_releases release ON release.id=delivery.release_id
            WHERE delivery.public_code=notification.source_quiz_code
              AND delivery.status='published'
              AND release.status='approved'
          )
        )
      ORDER BY (notification.status='unread') DESC, notification.delivered_at DESC
      LIMIT ${limit}
    `,
    sqlClient`
      SELECT count(*)::int AS count
      FROM content.current_affairs_inapp_notifications notification
      WHERE notification.user_id=${userId}::uuid
        AND notification.status='unread'
        AND (
          notification.signal_type <> 'daily_pack'
          OR EXISTS (
            SELECT 1
            FROM content.current_affairs_quiz_deliveries delivery
            JOIN content.current_affairs_releases release ON release.id=delivery.release_id
            WHERE delivery.public_code=notification.source_quiz_code
              AND delivery.status='published'
              AND release.status='approved'
          )
        )
    `,
  ]);
  return {
    unreadCount: Number(unreadRows[0]?.count ?? 0),
    notifications: rows.map((row) => ({
      id: String(row.id),
      type: String(row.type),
      urgency: String(row.urgency),
      title: String(row.title),
      body: String(row.body),
      deepLink: String(row.deepLink),
      count: Number(row.count),
      status: String(row.status),
      deliveredAt: String(row.deliveredAt),
      readAt: row.readAt ? String(row.readAt) : null,
    })),
    preferences: {
      inAppNotificationsEnabled: preferences.inAppNotificationsEnabled,
      quietHoursStart: preferences.quietHoursStart,
      quietHoursEnd: preferences.quietHoursEnd,
      dailyNotificationCap: preferences.dailyNotificationCap,
      notificationGapMinutes: preferences.notificationGapMinutes,
      notificationsMutedUntil: preferences.notificationsMutedUntil,
    },
    generatedAt: new Date().toISOString(),
  };
}

export async function updateCurrentAffairsNotificationPreferences(args: {
  firebaseUid: string;
  inAppNotificationsEnabled?: unknown;
  quietHoursStart?: unknown;
  quietHoursEnd?: unknown;
  dailyNotificationCap?: unknown;
  notificationGapMinutes?: unknown;
  notificationsMutedUntil?: unknown;
}) {
  const userId = await resolveCurrentAffairsStudentUserId(args.firebaseUid);
  const current = await loadNotificationPreferences(userId);
  const booleanValue = args.inAppNotificationsEnabled === undefined
    ? current.inAppNotificationsEnabled
    : typeof args.inAppNotificationsEnabled === "boolean" ? args.inAppNotificationsEnabled : null;
  const quietStart = args.quietHoursStart === undefined ? current.quietHoursStart : normalizeCurrentAffairsQuietTime(args.quietHoursStart);
  const quietEnd = args.quietHoursEnd === undefined ? current.quietHoursEnd : normalizeCurrentAffairsQuietTime(args.quietHoursEnd);
  const dailyCap = args.dailyNotificationCap === undefined ? current.dailyNotificationCap : normalizeCurrentAffairsNotificationCap(args.dailyNotificationCap);
  const gapMinutes = args.notificationGapMinutes === undefined ? current.notificationGapMinutes : normalizeCurrentAffairsNotificationGapMinutes(args.notificationGapMinutes);
  const muteUntil = args.notificationsMutedUntil === undefined
    ? (current.notificationsMutedUntil ? new Date(current.notificationsMutedUntil) : null)
    : normalizeCurrentAffairsMuteUntil(args.notificationsMutedUntil);
  if (booleanValue == null || quietStart == null || quietEnd == null || dailyCap == null || gapMinutes == null || muteUntil === undefined) {
    throw new Error("Current Affairs notification preferences are invalid");
  }
  await sqlClient`
    INSERT INTO content.current_affairs_learner_preferences (
      user_id, daily_question_target, preferred_language, preferred_exam_family,
      revision_signal_enabled, daily_pack_signal_enabled, study_target_signal_enabled,
      in_app_notifications_enabled, quiet_hours_start, quiet_hours_end,
      daily_notification_cap, notification_gap_minutes, notifications_muted_until,
      created_at, updated_at
    ) VALUES (
      ${userId}::uuid, ${current.dailyQuestionTarget}, 'en', ${current.preferredExamFamily},
      ${current.revisionSignalEnabled}, ${current.dailyPackSignalEnabled}, ${current.studyTargetSignalEnabled},
      ${booleanValue}, ${quietStart}, ${quietEnd}, ${dailyCap}, ${gapMinutes}, ${muteUntil?.toISOString() ?? null}::timestamptz,
      now(), now()
    )
    ON CONFLICT (user_id) DO UPDATE SET
      in_app_notifications_enabled=EXCLUDED.in_app_notifications_enabled,
      quiet_hours_start=EXCLUDED.quiet_hours_start,
      quiet_hours_end=EXCLUDED.quiet_hours_end,
      daily_notification_cap=EXCLUDED.daily_notification_cap,
      notification_gap_minutes=EXCLUDED.notification_gap_minutes,
      notifications_muted_until=EXCLUDED.notifications_muted_until,
      updated_at=now()
  `;
  const updated = await loadNotificationPreferences(userId);
  return {
    inAppNotificationsEnabled: updated.inAppNotificationsEnabled,
    quietHoursStart: updated.quietHoursStart,
    quietHoursEnd: updated.quietHoursEnd,
    dailyNotificationCap: updated.dailyNotificationCap,
    notificationGapMinutes: updated.notificationGapMinutes,
    notificationsMutedUntil: updated.notificationsMutedUntil,
  };
}

export async function updateCurrentAffairsNotificationStatus(args: {
  firebaseUid: string;
  notificationId: string;
  status: CurrentAffairsNotificationStatus;
}) {
  const userId = await resolveCurrentAffairsStudentUserId(args.firebaseUid);
  const notificationId = assertUuid(args.notificationId, "Current Affairs notification ID");
  if (args.status !== "read" && args.status !== "dismissed") throw new Error("Current Affairs notification status is invalid");
  const rows = args.status === "read"
    ? await sqlClient`
        UPDATE content.current_affairs_inapp_notifications
        SET status='read', read_at=COALESCE(read_at, now()), dismissed_at=NULL, updated_at=now()
        WHERE id=${notificationId}::uuid AND user_id=${userId}::uuid AND status<>'dismissed'
        RETURNING id::text AS id, status
      `
    : await sqlClient`
        UPDATE content.current_affairs_inapp_notifications
        SET status='dismissed', dismissed_at=now(), updated_at=now()
        WHERE id=${notificationId}::uuid AND user_id=${userId}::uuid
        RETURNING id::text AS id, status
      `;
  if (!rows[0]) throw new Error("Current Affairs notification not found");
  return { id: String(rows[0].id), status: String(rows[0].status) };
}

export async function markAllCurrentAffairsNotificationsRead(firebaseUid: string) {
  const userId = await resolveCurrentAffairsStudentUserId(firebaseUid);
  const rows = await sqlClient`
    UPDATE content.current_affairs_inapp_notifications
    SET status='read', read_at=COALESCE(read_at, now()), updated_at=now()
    WHERE user_id=${userId}::uuid AND status='unread'
    RETURNING id
  `;
  return { updated: rows.length };
}

function scheduledRunKey(now: Date) {
  return `ca-inapp-notifications:${now.toISOString().slice(0, 13)}`;
}

export async function runScheduledCurrentAffairsNotifications(now = new Date()) {
  const runId = randomUUID();
  const runKey = scheduledRunKey(now);
  const inserted = await sqlClient`
    INSERT INTO content.current_affairs_notification_runs (id, run_key, status, started_at, created_at)
    VALUES (${runId}::uuid, ${runKey}, 'running', now(), now())
    ON CONFLICT (run_key) DO NOTHING
    RETURNING id::text AS id
  `;
  if (!inserted[0]) return { runKey, status: "skipped" as const, reason: "schedule_slot_already_processed" };

  let candidateUserCount = 0;
  let evaluatedUserCount = 0;
  let deliveredCount = 0;
  let suppressedCount = 0;
  let errorCount = 0;
  const suppressionReasons: Record<string, number> = {};

  try {
    const users = await sqlClient`
      WITH candidate AS (
        SELECT user_id FROM content.current_affairs_learner_preferences
        UNION
        SELECT user_id FROM content.current_affairs_learning_attempts WHERE submitted_at >= now() - interval '45 days'
        UNION
        SELECT user_id FROM content.current_affairs_revision_schedule WHERE next_review_at <= now() + interval '1 day'
        UNION
        SELECT user_id FROM content.current_affairs_saved_items WHERE save_mode='revise_later' AND review_after <= now() + interval '1 day'
      )
      SELECT candidate.user_id::text AS "userId"
      FROM candidate
      JOIN identity.users user_row ON user_row.id=candidate.user_id
      WHERE user_row.deleted_at IS NULL AND user_row.status='active'::user_status
      ORDER BY md5(candidate.user_id::text || ${runKey})
      LIMIT ${MAX_SCHEDULED_USERS_PER_RUN}
    `;
    candidateUserCount = users.length;

    for (const row of users) {
      try {
        const result = await materializeCurrentAffairsNotificationsForUser(String(row.userId));
        evaluatedUserCount += 1;
        deliveredCount += result.delivered;
        suppressedCount += result.suppressed;
        for (const [reason, count] of Object.entries(result.suppressionReasons)) {
          suppressionReasons[reason] = (suppressionReasons[reason] ?? 0) + count;
        }
      } catch (error) {
        errorCount += 1;
        console.error("Current Affairs notification user evaluation failed", row.userId, error);
      }
    }

    const status = errorCount > 0 ? "completed_with_errors" : "completed";
    await sqlClient`
      UPDATE content.current_affairs_notification_runs
      SET status=${status}, candidate_user_count=${candidateUserCount}, evaluated_user_count=${evaluatedUserCount},
          delivered_count=${deliveredCount}, suppressed_count=${suppressedCount}, error_count=${errorCount},
          stats=${JSON.stringify({ suppressionReasons, batchLimit: MAX_SCHEDULED_USERS_PER_RUN })}::jsonb,
          completed_at=now()
      WHERE id=${runId}::uuid
    `;
    return { runKey, status, candidateUserCount, evaluatedUserCount, deliveredCount, suppressedCount, errorCount, suppressionReasons };
  } catch (error) {
    const failure = error instanceof Error ? error.message.slice(0, 2000) : "Unknown notification scheduler failure";
    await sqlClient`
      UPDATE content.current_affairs_notification_runs
      SET status='failed', candidate_user_count=${candidateUserCount}, evaluated_user_count=${evaluatedUserCount},
          delivered_count=${deliveredCount}, suppressed_count=${suppressedCount}, error_count=${errorCount + 1},
          failure=${failure}, completed_at=now()
      WHERE id=${runId}::uuid
    `;
    throw error;
  }
}

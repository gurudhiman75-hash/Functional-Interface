import { randomUUID } from "node:crypto";

import { sqlClient } from "../lib/db";
import { loadCurrentAffairsLearnerDashboard } from "./dashboard-runtime";
import {
  buildCurrentAffairsEngagementSignals,
  currentAffairsDailyProgress,
  DEFAULT_CURRENT_AFFAIRS_DAILY_TARGET,
  normalizeCurrentAffairsDailyTarget,
  normalizeCurrentAffairsPersonalizationExamFamily,
  normalizeCurrentAffairsPersonalizationLanguage,
  normalizeCurrentAffairsReviewAfter,
  normalizeCurrentAffairsSavedMode,
  type CurrentAffairsPersonalizationExamFamily,
  type CurrentAffairsPersonalizationLanguage,
  type CurrentAffairsSavedMode,
} from "./personalization-policy";
import { resolveCurrentAffairsStudentUserId } from "./revision-runtime";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
type SqlClient = typeof sqlClient;

type PreferenceRow = {
  dailyQuestionTarget: number;
  preferredLanguage: CurrentAffairsPersonalizationLanguage;
  preferredExamFamily: CurrentAffairsPersonalizationExamFamily;
  revisionSignalEnabled: boolean;
  dailyPackSignalEnabled: boolean;
  studyTargetSignalEnabled: boolean;
};

const DEFAULT_PREFERENCES: PreferenceRow = {
  dailyQuestionTarget: DEFAULT_CURRENT_AFFAIRS_DAILY_TARGET,
  preferredLanguage: "en",
  preferredExamFamily: "general",
  revisionSignalEnabled: true,
  dailyPackSignalEnabled: true,
  studyTargetSignalEnabled: true,
};

function assertUuid(value: string, label: string) {
  const normalized = value.trim();
  if (!UUID_PATTERN.test(normalized)) throw new Error(`${label} is invalid`);
  return normalized;
}

async function loadPreferences(userId: string, client: SqlClient = sqlClient): Promise<PreferenceRow> {
  const rows = await client`
    SELECT
      daily_question_target::int AS "dailyQuestionTarget",
      preferred_language AS "preferredLanguage",
      preferred_exam_family AS "preferredExamFamily",
      revision_signal_enabled AS "revisionSignalEnabled",
      daily_pack_signal_enabled AS "dailyPackSignalEnabled",
      study_target_signal_enabled AS "studyTargetSignalEnabled"
    FROM content.current_affairs_learner_preferences
    WHERE user_id=${userId}::uuid
    LIMIT 1
  `;
  const row = rows[0];
  if (!row) return DEFAULT_PREFERENCES;
  return {
    dailyQuestionTarget: Number(row.dailyQuestionTarget),
    preferredLanguage: String(row.preferredLanguage) as CurrentAffairsPersonalizationLanguage,
    preferredExamFamily: String(row.preferredExamFamily) as CurrentAffairsPersonalizationExamFamily,
    revisionSignalEnabled: Boolean(row.revisionSignalEnabled),
    dailyPackSignalEnabled: Boolean(row.dailyPackSignalEnabled),
    studyTargetSignalEnabled: Boolean(row.studyTargetSignalEnabled),
  };
}

async function loadActiveSavedItems(userId: string) {
  const resources = await sqlClient`
    SELECT
      saved.id::text AS id,
      saved.save_mode AS "saveMode",
      saved.review_after AS "reviewAfter",
      saved.updated_at AS "updatedAt",
      resource.id::text AS "targetId",
      resource.public_code AS "publicCode",
      resource.title,
      resource.summary,
      resource.language_code AS "languageCode",
      resource.content_date::text AS "contentDate",
      release.exam_family_key AS "examFamily",
      release.period_type AS "periodType"
    FROM content.current_affairs_saved_items saved
    JOIN content.learning_resources resource ON resource.id=saved.learning_resource_id
    JOIN content.current_affairs_release_compilations link ON link.learning_resource_id=resource.id
    JOIN content.current_affairs_releases release ON release.id=link.release_id
    WHERE saved.user_id=${userId}::uuid
      AND saved.target_type='learning_resource'
      AND resource.status='published'
      AND resource.published_at IS NOT NULL
      AND resource.published_at <= now()
      AND (resource.expires_at IS NULL OR resource.expires_at > now())
      AND release.status='approved'
    ORDER BY saved.updated_at DESC
  `;

  const questions = await sqlClient`
    SELECT
      saved.id::text AS id,
      saved.save_mode AS "saveMode",
      saved.review_after AS "reviewAfter",
      saved.updated_at AS "updatedAt",
      item.id::text AS "targetId",
      delivery.public_code AS "publicCode",
      COALESCE(NULLIF(BTRIM(item.english_payload->>'stem'), ''), 'Saved Current Affairs question') AS title,
      NULL::text AS summary,
      'en'::text AS "languageCode",
      release.period_end::text AS "contentDate",
      release.exam_family_key AS "examFamily",
      release.period_type AS "periodType",
      item.sort_order::int AS "itemNumber",
      item.question_family AS "questionFamily"
    FROM content.current_affairs_saved_items saved
    JOIN content.current_affairs_quiz_delivery_items item ON item.id=saved.quiz_delivery_item_id
    JOIN content.current_affairs_quiz_deliveries delivery ON delivery.id=item.quiz_delivery_id
    JOIN content.current_affairs_releases release ON release.id=delivery.release_id
    WHERE saved.user_id=${userId}::uuid
      AND saved.target_type='quiz_delivery_item'
      AND delivery.status='published'
      AND release.status='approved'
    ORDER BY saved.updated_at DESC
  `;

  return [
    ...resources.map((row) => ({
      id: String(row.id),
      targetType: "learning_resource" as const,
      targetId: String(row.targetId),
      saveMode: String(row.saveMode) as CurrentAffairsSavedMode,
      reviewAfter: row.reviewAfter ? String(row.reviewAfter) : null,
      updatedAt: String(row.updatedAt),
      publicCode: String(row.publicCode),
      title: String(row.title),
      summary: row.summary ? String(row.summary) : null,
      languageCode: String(row.languageCode),
      contentDate: row.contentDate ? String(row.contentDate).slice(0, 10) : null,
      examFamily: String(row.examFamily),
      periodType: String(row.periodType),
      itemNumber: null,
      questionFamily: null,
      deepLink: `/current-affairs/notes/${encodeURIComponent(String(row.publicCode))}`,
    })),
    ...questions.map((row) => ({
      id: String(row.id),
      targetType: "quiz_delivery_item" as const,
      targetId: String(row.targetId),
      saveMode: String(row.saveMode) as CurrentAffairsSavedMode,
      reviewAfter: row.reviewAfter ? String(row.reviewAfter) : null,
      updatedAt: String(row.updatedAt),
      publicCode: String(row.publicCode),
      title: String(row.title),
      summary: null,
      languageCode: "en",
      contentDate: row.contentDate ? String(row.contentDate).slice(0, 10) : null,
      examFamily: String(row.examFamily),
      periodType: String(row.periodType),
      itemNumber: Number(row.itemNumber),
      questionFamily: String(row.questionFamily),
      deepLink: `/current-affairs/quiz/${encodeURIComponent(String(row.publicCode))}`,
    })),
  ].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

async function questionsStudiedToday(userId: string) {
  const rows = await sqlClient`
    SELECT COALESCE(sum(total_count), 0)::int AS count
    FROM content.current_affairs_learning_attempts
    WHERE user_id=${userId}::uuid
      AND (submitted_at AT TIME ZONE 'Asia/Kolkata')::date = (now() AT TIME ZONE 'Asia/Kolkata')::date
  `;
  return Number(rows[0]?.count ?? 0);
}

function recommendationRows(args: {
  dashboard: Awaited<ReturnType<typeof loadCurrentAffairsLearnerDashboard>>;
  savedDue: Array<{ id: string; title: string; deepLink: string }>;
}) {
  const recommendations: Array<{
    key: string;
    type: "revision" | "saved_review" | "weak_category" | "daily_quiz";
    priority: number;
    title: string;
    body: string;
    deepLink: string;
  }> = [];

  if (args.dashboard.revision.dueNow > 0) {
    recommendations.push({
      key: "revision-due",
      type: "revision",
      priority: 100 + args.dashboard.revision.overdue,
      title: "Clear due Current Affairs revision",
      body: `${args.dashboard.revision.dueNow} question${args.dashboard.revision.dueNow === 1 ? " is" : "s are"} due in your memory schedule.`,
      deepLink: "/current-affairs/revision",
    });
  }
  for (const item of args.savedDue.slice(0, 2)) {
    recommendations.push({
      key: `saved-${item.id}`,
      type: "saved_review",
      priority: 90,
      title: "Revisit a saved Current Affairs item",
      body: item.title,
      deepLink: item.deepLink,
    });
  }
  for (const weak of args.dashboard.weakAreas.slice(0, 3)) {
    recommendations.push({
      key: `weak-${weak.category}`,
      type: "weak_category",
      priority: 70 + Math.round(weak.weaknessScore),
      title: `Strengthen ${weak.label}`,
      body: `${weak.accuracy}% accuracy · ${weak.due} due · ${weak.recovery} recovery.`,
      deepLink: "/current-affairs/revision",
    });
  }
  const daily = args.dashboard.latestDailyQuizzes.find((quiz) => !quiz.attempted);
  if (daily) {
    recommendations.push({
      key: `daily-${daily.quizCode}`,
      type: "daily_quiz",
      priority: 65,
      title: `${daily.examFamily.toUpperCase()} daily Current Affairs is ready`,
      body: `${daily.itemCount} questions for ${daily.periodEnd}.`,
      deepLink: `/current-affairs/quiz/${encodeURIComponent(daily.quizCode)}`,
    });
  }
  return recommendations.sort((a, b) => b.priority - a.priority || a.key.localeCompare(b.key)).slice(0, 6);
}

export async function loadCurrentAffairsPersonalization(firebaseUid: string) {
  const userId = await resolveCurrentAffairsStudentUserId(firebaseUid);
  const [preferences, studiedToday, savedItems, dashboard] = await Promise.all([
    loadPreferences(userId),
    questionsStudiedToday(userId),
    loadActiveSavedItems(userId),
    loadCurrentAffairsLearnerDashboard(firebaseUid),
  ]);
  const now = new Date();
  const savedDue = savedItems.filter((item) => item.saveMode === "revise_later" && item.reviewAfter && new Date(item.reviewAfter).getTime() <= now.getTime());
  const dailyProgress = currentAffairsDailyProgress(studiedToday, preferences.dailyQuestionTarget);
  const latestUnattempted = dashboard.latestDailyQuizzes.find((quiz) => !quiz.attempted)?.quizCode ?? null;
  const dayKey = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
  return {
    preferences,
    dailyProgress,
    savedItems,
    savedReviewDue: savedDue.length,
    recommendations: recommendationRows({ dashboard, savedDue }),
    signals: buildCurrentAffairsEngagementSignals({
      dayKey,
      revisionDue: dashboard.revision.dueNow,
      recoveryDue: dashboard.revision.recovery,
      savedReviewDue: savedDue.length,
      questionsStudiedToday: dailyProgress.studied,
      dailyTarget: dailyProgress.target,
      latestUnattemptedQuizCode: latestUnattempted,
      revisionSignalEnabled: preferences.revisionSignalEnabled,
      dailyPackSignalEnabled: preferences.dailyPackSignalEnabled,
      studyTargetSignalEnabled: preferences.studyTargetSignalEnabled,
    }),
    generatedAt: now.toISOString(),
  };
}

export async function updateCurrentAffairsPreferences(args: {
  firebaseUid: string;
  dailyQuestionTarget?: unknown;
  preferredLanguage?: unknown;
  preferredExamFamily?: unknown;
  revisionSignalEnabled?: unknown;
  dailyPackSignalEnabled?: unknown;
  studyTargetSignalEnabled?: unknown;
}) {
  const userId = await resolveCurrentAffairsStudentUserId(args.firebaseUid);
  const current = await loadPreferences(userId);
  const dailyQuestionTarget = args.dailyQuestionTarget === undefined ? current.dailyQuestionTarget : normalizeCurrentAffairsDailyTarget(args.dailyQuestionTarget);
  const preferredLanguage = args.preferredLanguage === undefined ? current.preferredLanguage : normalizeCurrentAffairsPersonalizationLanguage(args.preferredLanguage);
  const preferredExamFamily = args.preferredExamFamily === undefined ? current.preferredExamFamily : normalizeCurrentAffairsPersonalizationExamFamily(args.preferredExamFamily);
  if (dailyQuestionTarget == null || preferredLanguage == null || preferredExamFamily == null) throw new Error("Current Affairs personalization preferences are invalid");
  const booleanValue = (input: unknown, fallback: boolean) => input === undefined ? fallback : typeof input === "boolean" ? input : null;
  const revisionSignalEnabled = booleanValue(args.revisionSignalEnabled, current.revisionSignalEnabled);
  const dailyPackSignalEnabled = booleanValue(args.dailyPackSignalEnabled, current.dailyPackSignalEnabled);
  const studyTargetSignalEnabled = booleanValue(args.studyTargetSignalEnabled, current.studyTargetSignalEnabled);
  if (revisionSignalEnabled == null || dailyPackSignalEnabled == null || studyTargetSignalEnabled == null) throw new Error("Current Affairs signal preferences are invalid");
  await sqlClient`
    INSERT INTO content.current_affairs_learner_preferences (
      user_id, daily_question_target, preferred_language, preferred_exam_family,
      revision_signal_enabled, daily_pack_signal_enabled, study_target_signal_enabled,
      created_at, updated_at
    ) VALUES (
      ${userId}::uuid, ${dailyQuestionTarget}, ${preferredLanguage}, ${preferredExamFamily},
      ${revisionSignalEnabled}, ${dailyPackSignalEnabled}, ${studyTargetSignalEnabled}, now(), now()
    )
    ON CONFLICT (user_id) DO UPDATE SET
      daily_question_target=EXCLUDED.daily_question_target,
      preferred_language=EXCLUDED.preferred_language,
      preferred_exam_family=EXCLUDED.preferred_exam_family,
      revision_signal_enabled=EXCLUDED.revision_signal_enabled,
      daily_pack_signal_enabled=EXCLUDED.daily_pack_signal_enabled,
      study_target_signal_enabled=EXCLUDED.study_target_signal_enabled,
      updated_at=now()
  `;
  return loadPreferences(userId);
}

async function assertActiveSavedTarget(targetType: "learning_resource" | "quiz_delivery_item", targetId: string) {
  if (targetType === "learning_resource") {
    const rows = await sqlClient`
      SELECT resource.id::text AS id
      FROM content.learning_resources resource
      JOIN content.current_affairs_release_compilations link ON link.learning_resource_id=resource.id
      JOIN content.current_affairs_releases release ON release.id=link.release_id
      WHERE resource.id=${targetId}::uuid
        AND resource.category='current_affairs'
        AND resource.status='published'
        AND resource.published_at IS NOT NULL
        AND resource.published_at <= now()
        AND (resource.expires_at IS NULL OR resource.expires_at > now())
        AND release.status='approved'
      LIMIT 1
    `;
    if (!rows[0]) throw new Error("Current Affairs learning resource is not active and saveable");
    return;
  }
  const rows = await sqlClient`
    SELECT item.id::text AS id
    FROM content.current_affairs_quiz_delivery_items item
    JOIN content.current_affairs_quiz_deliveries delivery ON delivery.id=item.quiz_delivery_id
    JOIN content.current_affairs_releases release ON release.id=delivery.release_id
    WHERE item.id=${targetId}::uuid
      AND delivery.status='published'
      AND release.status='approved'
    LIMIT 1
  `;
  if (!rows[0]) throw new Error("Current Affairs quiz item is not active and saveable");
}

export async function saveCurrentAffairsLearnerItem(args: {
  firebaseUid: string;
  targetType: "learning_resource" | "quiz_delivery_item";
  targetId: string;
  saveMode: unknown;
  reviewAfter?: unknown;
}) {
  const userId = await resolveCurrentAffairsStudentUserId(args.firebaseUid);
  const targetId = assertUuid(args.targetId, "Current Affairs saved target ID");
  const saveMode = normalizeCurrentAffairsSavedMode(args.saveMode);
  if (!saveMode) throw new Error("Current Affairs saved-item mode is invalid");
  const reviewAfter = saveMode === "revise_later" ? normalizeCurrentAffairsReviewAfter(args.reviewAfter) : null;
  if (saveMode === "revise_later" && !reviewAfter) throw new Error("Current Affairs revise-later time is invalid");
  await assertActiveSavedTarget(args.targetType, targetId);

  return sqlClient.begin(async (tx) => {
    const client = tx as SqlClient;
    const existing = args.targetType === "learning_resource"
      ? await client`SELECT id::text AS id FROM content.current_affairs_saved_items WHERE user_id=${userId}::uuid AND learning_resource_id=${targetId}::uuid LIMIT 1 FOR UPDATE`
      : await client`SELECT id::text AS id FROM content.current_affairs_saved_items WHERE user_id=${userId}::uuid AND quiz_delivery_item_id=${targetId}::uuid LIMIT 1 FOR UPDATE`;
    const id = existing[0]?.id ? String(existing[0].id) : randomUUID();
    if (existing[0]?.id) {
      await client`
        UPDATE content.current_affairs_saved_items
        SET save_mode=${saveMode}, review_after=${reviewAfter?.toISOString() ?? null}, updated_at=now()
        WHERE id=${id}::uuid AND user_id=${userId}::uuid
      `;
    } else {
      await client`
        INSERT INTO content.current_affairs_saved_items (
          id, user_id, target_type, learning_resource_id, quiz_delivery_item_id,
          save_mode, review_after, created_at, updated_at
        ) VALUES (
          ${id}::uuid, ${userId}::uuid, ${args.targetType},
          ${args.targetType === "learning_resource" ? targetId : null}::uuid,
          ${args.targetType === "quiz_delivery_item" ? targetId : null}::uuid,
          ${saveMode}, ${reviewAfter?.toISOString() ?? null}, now(), now()
        )
      `;
    }
    return { id, targetType: args.targetType, targetId, saveMode, reviewAfter: reviewAfter?.toISOString() ?? null };
  });
}

export async function deleteCurrentAffairsSavedItem(args: { firebaseUid: string; savedItemId: string }) {
  const userId = await resolveCurrentAffairsStudentUserId(args.firebaseUid);
  const id = assertUuid(args.savedItemId, "Current Affairs saved item ID");
  const rows = await sqlClient`
    DELETE FROM content.current_affairs_saved_items
    WHERE id=${id}::uuid AND user_id=${userId}::uuid
    RETURNING id::text AS id
  `;
  if (!rows[0]) throw new Error("Current Affairs saved item not found");
  return { id, deleted: true };
}

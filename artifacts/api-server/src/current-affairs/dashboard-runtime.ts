import { sqlClient } from "../lib/db";
import { resolveCurrentAffairsStudentUserId } from "./revision-runtime";
import {
  buildCurrentAffairsSevenDayActivity,
  currentAffairsCategoryLabel,
  currentAffairsMasteryState,
  currentAffairsStageLabel,
  currentAffairsStudyStreak,
  currentAffairsWeaknessScore,
  type CurrentAffairsActivityDay,
} from "./dashboard-policy";

function number(value: unknown): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function nullableText(value: unknown): string | null {
  return value == null ? null : String(value);
}

export async function loadCurrentAffairsLearnerDashboard(firebaseUid: string) {
  const userId = await resolveCurrentAffairsStudentUserId(firebaseUid);

  const [todayRows, summaryRows, studyDayRows, activityRows, scheduleRows, stageRows, categoryRows, dueCategoryRows, recentAttemptRows, latestQuizRows] = await Promise.all([
    sqlClient`SELECT to_char(now() AT TIME ZONE 'Asia/Kolkata', 'YYYY-MM-DD') AS day`,
    sqlClient`
      SELECT
        count(*)::int AS "attemptCount",
        count(*) FILTER (WHERE attempt_type='quiz')::int AS "quizAttempts",
        count(*) FILTER (WHERE attempt_type='revision')::int AS "revisionAttempts",
        COALESCE(sum(total_count), 0)::int AS "questionCount",
        COALESCE(sum(correct_count), 0)::int AS "correctCount",
        COALESCE(sum(wrong_count), 0)::int AS "wrongCount",
        COALESCE(sum(unanswered_count), 0)::int AS "unansweredCount",
        COALESCE(round(100.0 * sum(correct_count) / NULLIF(sum(total_count), 0), 1), 0)::float8 AS accuracy,
        COALESCE(round(avg(score_percent), 1), 0)::float8 AS "averageScore",
        max(submitted_at)::text AS "lastStudyAt"
      FROM content.current_affairs_learning_attempts
      WHERE user_id=${userId}::uuid
    `,
    sqlClient`
      SELECT DISTINCT to_char(submitted_at AT TIME ZONE 'Asia/Kolkata', 'YYYY-MM-DD') AS day
      FROM content.current_affairs_learning_attempts
      WHERE user_id=${userId}::uuid
      ORDER BY day DESC
      LIMIT 180
    `,
    sqlClient`
      SELECT
        to_char(submitted_at AT TIME ZONE 'Asia/Kolkata', 'YYYY-MM-DD') AS day,
        count(*)::int AS attempts,
        COALESCE(sum(total_count), 0)::int AS questions,
        COALESCE(sum(correct_count), 0)::int AS correct
      FROM content.current_affairs_learning_attempts
      WHERE user_id=${userId}::uuid
        AND submitted_at >= now() - interval '8 days'
      GROUP BY day
      ORDER BY day
    `,
    sqlClient`
      SELECT
        count(*)::int AS "activeItems",
        count(*) FILTER (WHERE schedule.next_review_at <= now())::int AS "dueNow",
        count(*) FILTER (WHERE schedule.next_review_at < now() - interval '1 day')::int AS overdue,
        count(*) FILTER (WHERE schedule.stage=5 AND schedule.last_result='correct')::int AS mastered,
        count(*) FILTER (WHERE schedule.stage=0 AND schedule.last_result <> 'correct')::int AS recovery,
        min(schedule.next_review_at) FILTER (WHERE schedule.next_review_at > now())::text AS "nextReviewAt"
      FROM content.current_affairs_revision_schedule schedule
      JOIN content.current_affairs_quiz_delivery_items item ON item.id=schedule.quiz_delivery_item_id
      JOIN content.current_affairs_quiz_deliveries delivery ON delivery.id=item.quiz_delivery_id
      JOIN content.current_affairs_releases release ON release.id=delivery.release_id
      WHERE schedule.user_id=${userId}::uuid
        AND delivery.status='published'
        AND release.status='approved'
    `,
    sqlClient`
      SELECT schedule.stage::int AS stage,
        count(*)::int AS count,
        count(*) FILTER (WHERE schedule.next_review_at <= now())::int AS due,
        count(*) FILTER (WHERE schedule.last_result='correct')::int AS correct
      FROM content.current_affairs_revision_schedule schedule
      JOIN content.current_affairs_quiz_delivery_items item ON item.id=schedule.quiz_delivery_item_id
      JOIN content.current_affairs_quiz_deliveries delivery ON delivery.id=item.quiz_delivery_id
      JOIN content.current_affairs_releases release ON release.id=delivery.release_id
      WHERE schedule.user_id=${userId}::uuid
        AND delivery.status='published'
        AND release.status='approved'
      GROUP BY schedule.stage
      ORDER BY schedule.stage
    `,
    sqlClient`
      WITH history AS (
        SELECT event.category,
          count(*)::int AS total,
          count(*) FILTER (WHERE attempt_item.result='correct')::int AS correct,
          count(*) FILTER (WHERE attempt_item.result='wrong')::int AS wrong,
          count(*) FILTER (WHERE attempt_item.result='unanswered')::int AS unanswered
        FROM content.current_affairs_learning_attempt_items attempt_item
        JOIN content.current_affairs_learning_attempts attempt ON attempt.id=attempt_item.attempt_id
        JOIN content.current_affairs_quiz_delivery_items item ON item.id=attempt_item.quiz_delivery_item_id
        JOIN content.current_affairs_quiz_deliveries delivery ON delivery.id=item.quiz_delivery_id
        JOIN content.current_affairs_releases release ON release.id=delivery.release_id
        JOIN content.current_affairs_question_links link ON link.generation_item_id=item.generation_item_id
        JOIN content.current_affairs_events event ON event.id=link.event_id
        WHERE attempt.user_id=${userId}::uuid
          AND delivery.status='published'
          AND release.status='approved'
        GROUP BY event.category
      ), schedule_state AS (
        SELECT event.category,
          count(*) FILTER (WHERE schedule.next_review_at <= now())::int AS due,
          count(*) FILTER (WHERE schedule.stage=0 AND schedule.last_result <> 'correct')::int AS recovery,
          count(*) FILTER (WHERE schedule.stage=5 AND schedule.last_result='correct')::int AS mastered
        FROM content.current_affairs_revision_schedule schedule
        JOIN content.current_affairs_quiz_delivery_items item ON item.id=schedule.quiz_delivery_item_id
        JOIN content.current_affairs_quiz_deliveries delivery ON delivery.id=item.quiz_delivery_id
        JOIN content.current_affairs_releases release ON release.id=delivery.release_id
        JOIN content.current_affairs_question_links link ON link.generation_item_id=item.generation_item_id
        JOIN content.current_affairs_events event ON event.id=link.event_id
        WHERE schedule.user_id=${userId}::uuid
          AND delivery.status='published'
          AND release.status='approved'
        GROUP BY event.category
      )
      SELECT COALESCE(history.category, schedule_state.category) AS category,
        COALESCE(history.total, 0)::int AS total,
        COALESCE(history.correct, 0)::int AS correct,
        COALESCE(history.wrong, 0)::int AS wrong,
        COALESCE(history.unanswered, 0)::int AS unanswered,
        COALESCE(schedule_state.due, 0)::int AS due,
        COALESCE(schedule_state.recovery, 0)::int AS recovery,
        COALESCE(schedule_state.mastered, 0)::int AS mastered
      FROM history
      FULL OUTER JOIN schedule_state ON schedule_state.category=history.category
      ORDER BY category
    `,
    sqlClient`
      SELECT event.category,
        count(*)::int AS due,
        count(*) FILTER (WHERE schedule.stage=0 AND schedule.last_result <> 'correct')::int AS recovery,
        min(schedule.next_review_at)::text AS "oldestDueAt"
      FROM content.current_affairs_revision_schedule schedule
      JOIN content.current_affairs_quiz_delivery_items item ON item.id=schedule.quiz_delivery_item_id
      JOIN content.current_affairs_quiz_deliveries delivery ON delivery.id=item.quiz_delivery_id
      JOIN content.current_affairs_releases release ON release.id=delivery.release_id
      JOIN content.current_affairs_question_links link ON link.generation_item_id=item.generation_item_id
      JOIN content.current_affairs_events event ON event.id=link.event_id
      WHERE schedule.user_id=${userId}::uuid
        AND schedule.next_review_at <= now()
        AND delivery.status='published'
        AND release.status='approved'
      GROUP BY event.category
      ORDER BY due DESC, recovery DESC, event.category
      LIMIT 5
    `,
    sqlClient`
      SELECT attempt.id::text AS id,
        attempt.attempt_type AS "attemptType",
        attempt.language_code AS "languageCode",
        attempt.total_count::int AS total,
        attempt.correct_count::int AS correct,
        attempt.wrong_count::int AS wrong,
        attempt.unanswered_count::int AS unanswered,
        attempt.score_percent::float8 AS "scorePercent",
        attempt.submitted_at::text AS "submittedAt",
        delivery.public_code AS "quizCode",
        release.exam_family_key AS "examFamily",
        release.period_type AS "periodType"
      FROM content.current_affairs_learning_attempts attempt
      LEFT JOIN content.current_affairs_quiz_deliveries delivery ON delivery.id=attempt.quiz_delivery_id
      LEFT JOIN content.current_affairs_releases release ON release.id=delivery.release_id
      WHERE attempt.user_id=${userId}::uuid
      ORDER BY attempt.submitted_at DESC
      LIMIT 8
    `,
    sqlClient`
      SELECT DISTINCT ON (release.exam_family_key)
        delivery.public_code AS "quizCode",
        delivery.item_count::int AS "itemCount",
        delivery.published_at::text AS "publishedAt",
        release.period_start::text AS "periodStart",
        release.period_end::text AS "periodEnd",
        release.exam_family_key AS "examFamily",
        EXISTS (
          SELECT 1 FROM content.current_affairs_learning_attempts attempt
          WHERE attempt.user_id=${userId}::uuid
            AND attempt.quiz_delivery_id=delivery.id
            AND attempt.attempt_type='quiz'
        ) AS attempted,
        (
          SELECT max(attempt.score_percent)::float8
          FROM content.current_affairs_learning_attempts attempt
          WHERE attempt.user_id=${userId}::uuid
            AND attempt.quiz_delivery_id=delivery.id
            AND attempt.attempt_type='quiz'
        ) AS "bestScore"
      FROM content.current_affairs_quiz_deliveries delivery
      JOIN content.current_affairs_releases release ON release.id=delivery.release_id
      WHERE delivery.status='published'
        AND release.status='approved'
        AND release.period_type='daily'
      ORDER BY release.exam_family_key, release.period_end DESC, delivery.published_at DESC
    `,
  ]);

  const todayKey = String(todayRows[0]?.day ?? "");
  const summary = summaryRows[0] ?? {};
  const schedule = scheduleRows[0] ?? {};
  const streak = currentAffairsStudyStreak(studyDayRows.map((row) => String(row.day)), todayKey);
  const sevenDayActivity = buildCurrentAffairsSevenDayActivity(
    activityRows.map((row) => ({
      day: String(row.day),
      attempts: number(row.attempts),
      questions: number(row.questions),
      correct: number(row.correct),
    } satisfies CurrentAffairsActivityDay)),
    todayKey,
  );

  const categories = categoryRows.map((row) => {
    const total = number(row.total);
    const correct = number(row.correct);
    const due = number(row.due);
    const recovery = number(row.recovery);
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    return {
      category: String(row.category),
      label: currentAffairsCategoryLabel(String(row.category)),
      total,
      correct,
      wrong: number(row.wrong),
      unanswered: number(row.unanswered),
      accuracy,
      due,
      recovery,
      mastered: number(row.mastered),
      weaknessScore: currentAffairsWeaknessScore({ accuracy, total, due, recovery }),
    };
  });

  const weakAreas = [...categories]
    .filter((item) => item.total > 0 || item.due > 0)
    .sort((left, right) => right.weaknessScore - left.weaknessScore || left.accuracy - right.accuracy)
    .slice(0, 4);

  return {
    generatedAt: new Date().toISOString(),
    today: todayKey,
    summary: {
      attemptCount: number(summary.attemptCount),
      quizAttempts: number(summary.quizAttempts),
      revisionAttempts: number(summary.revisionAttempts),
      questionCount: number(summary.questionCount),
      correctCount: number(summary.correctCount),
      wrongCount: number(summary.wrongCount),
      unansweredCount: number(summary.unansweredCount),
      accuracy: number(summary.accuracy),
      averageScore: number(summary.averageScore),
      streak,
      lastStudyAt: nullableText(summary.lastStudyAt),
    },
    revision: {
      activeItems: number(schedule.activeItems),
      dueNow: number(schedule.dueNow),
      overdue: number(schedule.overdue),
      mastered: number(schedule.mastered),
      recovery: number(schedule.recovery),
      nextReviewAt: nullableText(schedule.nextReviewAt),
      stages: Array.from({ length: 6 }, (_, stage) => {
        const row = stageRows.find((candidate) => number(candidate.stage) === stage);
        const count = number(row?.count);
        const correct = number(row?.correct);
        const representativeResult = count > 0 && correct === count ? "correct" : stage === 0 ? "wrong" : "correct";
        return {
          stage,
          label: currentAffairsStageLabel(stage),
          count,
          due: number(row?.due),
          masteryState: currentAffairsMasteryState(stage, representativeResult),
        };
      }),
    },
    sevenDayActivity,
    categories,
    weakAreas,
    todayFocus: dueCategoryRows.map((row) => ({
      category: String(row.category),
      label: currentAffairsCategoryLabel(String(row.category)),
      due: number(row.due),
      recovery: number(row.recovery),
      oldestDueAt: nullableText(row.oldestDueAt),
    })),
    recentAttempts: recentAttemptRows.map((row) => ({
      id: String(row.id),
      attemptType: String(row.attemptType),
      languageCode: String(row.languageCode),
      total: number(row.total),
      correct: number(row.correct),
      wrong: number(row.wrong),
      unanswered: number(row.unanswered),
      scorePercent: number(row.scorePercent),
      submittedAt: String(row.submittedAt),
      quizCode: nullableText(row.quizCode),
      examFamily: nullableText(row.examFamily),
      periodType: nullableText(row.periodType),
    })),
    latestDailyQuizzes: latestQuizRows.map((row) => ({
      quizCode: String(row.quizCode),
      itemCount: number(row.itemCount),
      publishedAt: String(row.publishedAt),
      periodStart: String(row.periodStart),
      periodEnd: String(row.periodEnd),
      examFamily: String(row.examFamily),
      attempted: row.attempted === true,
      bestScore: row.bestScore == null ? null : number(row.bestScore),
    })),
  };
}

import { Router } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import { authenticate } from '../middlewares/auth';

const router = Router();
const ATTEMPT_SCAN_LIMIT = 10000;
const text = (value: unknown, maximum = 200) => typeof value === 'string' ? value.trim().slice(0, maximum) : '';

function stableQuestionId(id: string, index = 0): number {
  let hash = 17;
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash || index + 1;
}

const rate = (part: number, whole: number) => whole > 0 ? Math.round((part / whole) * 10000) / 100 : 0;

router.use(authenticate);

router.get('/questions', requireAdminPermission('users.students.read'), async (req, res) => {
  const days = Math.min(365, Math.max(7, Math.floor(Number(req.query.days) || 30)));
  const search = text(req.query.search).toLowerCase();
  const limit = Math.min(250, Math.max(10, Math.floor(Number(req.query.limit) || 100)));

  try {
    const [rawAttemptRows, catalogRows] = await Promise.all([
      sqlClient`
        SELECT a.id::text AS "attemptId", a.test_publication_id::text AS "publicationId",
          a.final_score AS "finalScore", a.result_snapshot AS "resultSnapshot"
        FROM learning.attempts a
        JOIN assessment.test_publications p ON p.id = a.test_publication_id
        WHERE a.started_at >= now() - make_interval(days => ${days})
          AND a.status::text IN ('evaluated', 'practice_evaluated')
          AND a.result_snapshot IS NOT NULL
        ORDER BY a.evaluated_at DESC NULLS LAST
        LIMIT ${ATTEMPT_SCAN_LIMIT + 1}
      `,
      sqlClient`
        SELECT p.id::text AS "publicationId", t.public_code AS "testPublicCode", tv.title AS "testTitle",
          tq.id::text AS "testQuestionId", tq.question_version_id::text AS "questionVersionId",
          tq.test_section_id::text AS "testSectionId", section.name AS "sectionName", v.stem, tq.position,
          row_number() OVER (PARTITION BY p.id ORDER BY section.sort_order, tq.position) - 1 AS "questionIndex",
          COALESCE(json_agg(json_build_object('key', o.option_key, 'text', o.text, 'sortOrder', o.sort_order, 'isCorrect', o.is_correct)
            ORDER BY o.sort_order) FILTER (WHERE o.id IS NOT NULL), '[]'::json) AS options
        FROM assessment.test_publications p
        JOIN assessment.tests t ON t.id = p.test_id
        JOIN assessment.test_versions tv ON tv.id = p.test_version_id
        JOIN assessment.test_questions tq ON tq.test_version_id = tv.id
        JOIN assessment.test_sections section ON section.id = tq.test_section_id
        JOIN content.question_versions v ON v.id = tq.question_version_id
        LEFT JOIN content.question_options o ON o.question_version_id = v.id
        GROUP BY p.id, t.public_code, tv.title, tq.id, tq.question_version_id, tq.test_section_id,
          section.name, section.sort_order, v.stem, tq.position
      `,
    ]);

    type Option = { key?: string; text?: string; sortOrder?: number; isCorrect?: boolean };
    type Placement = {
      publicationId: string; questionVersionId: string; testQuestionId: string; testSectionId: string;
      testPublicCode: string; testTitle: string; sectionName: string; stem: string; options: Option[]; stableId: number;
    };
    type Metric = {
      publicationId: string; questionVersionId: string; testQuestionIds: string[]; testSectionIds: string[];
      testPublicCode: string; testTitle: string; sectionName: string; stem: string; options: Option[];
      duplicatePlacements: number; exposures: number; answered: number; skipped: number; correct: number;
      incorrect: number; flagged: number; timedResponses: number; totalTimeSeconds: number;
      invalidResponseItems: number; optionSelections: number[]; directLinkages: number; legacyLinkages: number;
    };

    const metrics = new Map<string, Metric>();
    const placementsByTestQuestion = new Map<string, Placement>();
    const placementsByQuestionVersion = new Map<string, Placement[]>();
    const placementsByStableId = new Map<string, Placement[]>();

    for (const row of catalogRows) {
      const publicationId = String(row.publicationId);
      const questionVersionId = String(row.questionVersionId);
      const options = Array.isArray(row.options) ? row.options as Option[] : [];
      const placement: Placement = {
        publicationId,
        questionVersionId,
        testQuestionId: String(row.testQuestionId),
        testSectionId: String(row.testSectionId),
        testPublicCode: String(row.testPublicCode),
        testTitle: String(row.testTitle),
        sectionName: String(row.sectionName),
        stem: String(row.stem),
        options,
        stableId: stableQuestionId(questionVersionId, Number(row.questionIndex)),
      };
      placementsByTestQuestion.set(`${publicationId}:${placement.testQuestionId}`, placement);
      const qvKey = `${publicationId}:${questionVersionId}`;
      placementsByQuestionVersion.set(qvKey, [...(placementsByQuestionVersion.get(qvKey) ?? []), placement]);
      const stableKey = `${publicationId}:${placement.stableId}`;
      placementsByStableId.set(stableKey, [...(placementsByStableId.get(stableKey) ?? []), placement]);

      const existing = metrics.get(qvKey);
      if (existing) {
        existing.testQuestionIds.push(placement.testQuestionId);
        existing.testSectionIds.push(placement.testSectionId);
        existing.duplicatePlacements += 1;
      } else {
        metrics.set(qvKey, {
          publicationId, questionVersionId, testQuestionIds: [placement.testQuestionId], testSectionIds: [placement.testSectionId],
          testPublicCode: placement.testPublicCode, testTitle: placement.testTitle, sectionName: placement.sectionName,
          stem: placement.stem, options, duplicatePlacements: 1, exposures: 0, answered: 0, skipped: 0,
          correct: 0, incorrect: 0, flagged: 0, timedResponses: 0, totalTimeSeconds: 0,
          invalidResponseItems: 0, optionSelections: Array.from({ length: options.length }, () => 0),
          directLinkages: 0, legacyLinkages: 0,
        });
      }
    }

    const attemptRows = rawAttemptRows.slice(0, ATTEMPT_SCAN_LIMIT);
    const scanTruncated = rawAttemptRows.length > ATTEMPT_SCAN_LIMIT;
    let unmatchedReviewItems = 0;
    let reviewedItems = 0;
    let malformedReviewAttempts = 0;

    for (const attempt of attemptRows) {
      const publicationId = String(attempt.publicationId);
      const snapshot = attempt.resultSnapshot && typeof attempt.resultSnapshot === 'object'
        ? attempt.resultSnapshot as Record<string, unknown>
        : {};
      if (!Array.isArray(snapshot.questionReview)) { malformedReviewAttempts += 1; continue; }

      for (const item of snapshot.questionReview as Array<Record<string, unknown>>) {
        reviewedItems += 1;
        const testQuestionId = typeof item.testQuestionId === 'string' ? item.testQuestionId : '';
        const questionVersionId = typeof item.questionVersionId === 'string' ? item.questionVersionId : '';
        const directPlacement = testQuestionId
          ? placementsByTestQuestion.get(`${publicationId}:${testQuestionId}`)
          : (questionVersionId ? placementsByQuestionVersion.get(`${publicationId}:${questionVersionId}`)?.[0] : undefined);
        const legacyCandidates = placementsByStableId.get(`${publicationId}:${Number(item.questionId)}`) ?? [];
        const legacyQuestionVersions = new Set(legacyCandidates.map((candidate) => candidate.questionVersionId));
        const legacyPlacement = legacyQuestionVersions.size === 1 ? legacyCandidates[0] : undefined;
        const placement = directPlacement ?? legacyPlacement;
        if (!placement) { unmatchedReviewItems += 1; continue; }

        const metric = metrics.get(`${publicationId}:${placement.questionVersionId}`);
        if (!metric) { unmatchedReviewItems += 1; continue; }
        if (directPlacement) metric.directLinkages += 1; else metric.legacyLinkages += 1;
        metric.exposures += 1;

        const selectedOptionKey = typeof item.selectedOptionKey === 'string' ? item.selectedOptionKey : '';
        const rawSelected = item.selected == null ? null : Number(item.selected);
        const selected = selectedOptionKey
          ? metric.options.findIndex((option) => String(option.key ?? '') === selectedOptionKey)
          : rawSelected;
        if (rawSelected == null && !selectedOptionKey) {
          metric.skipped += 1;
        } else if (selected == null || !Number.isInteger(selected) || selected < 0 || selected >= metric.options.length) {
          metric.invalidResponseItems += 1;
        } else {
          metric.answered += 1;
          metric.optionSelections[selected] = (metric.optionSelections[selected] ?? 0) + 1;
          const correctIndex = metric.options.findIndex((option) => Boolean(option.isCorrect));
          if (correctIndex >= 0 && selected === correctIndex) metric.correct += 1;
          else metric.incorrect += 1;
        }

        const time = item.timeTakenSeconds == null ? null : Number(item.timeTakenSeconds);
        if (time != null && Number.isFinite(time) && time >= 0) {
          metric.timedResponses += 1;
          metric.totalTimeSeconds += time;
        }
        if (Boolean(item.flagged)) metric.flagged += 1;
      }
    }

    const all = Array.from(metrics.values()).filter((metric) => metric.exposures > 0);
    const filtered = all.filter((metric) => !search || metric.stem.toLowerCase().includes(search)
      || metric.questionVersionId.toLowerCase().includes(search) || metric.testTitle.toLowerCase().includes(search)
      || metric.testPublicCode.toLowerCase().includes(search));
    const questions = filtered.map((metric) => ({
      ...metric,
      answerRate: rate(metric.answered, metric.exposures),
      skipRate: rate(metric.skipped, metric.exposures),
      accuracy: metric.answered ? rate(metric.correct, metric.answered) : null,
      facility: rate(metric.correct, metric.exposures),
      flagRate: rate(metric.flagged, metric.exposures),
      averageTimeSeconds: metric.timedResponses ? Math.round((metric.totalTimeSeconds / metric.timedResponses) * 100) / 100 : null,
      linkageMethod: metric.directLinkages > 0 && metric.legacyLinkages > 0 ? 'mixed' : metric.directLinkages > 0 ? 'direct' : 'legacy',
      optionSelection: metric.options.map((option, index) => ({
        key: option.key ?? String(index + 1), text: option.text ?? '', isCorrect: Boolean(option.isCorrect),
        count: metric.optionSelections[index] ?? 0, shareOfAnswered: rate(metric.optionSelections[index] ?? 0, metric.answered),
      })),
    })).sort((a, b) => b.exposures - a.exposures || (a.accuracy ?? 101) - (b.accuracy ?? 101)).slice(0, limit);

    const answered = all.reduce((sum, row) => sum + row.answered, 0);
    const correct = all.reduce((sum, row) => sum + row.correct, 0);
    const directLinkages = all.reduce((sum, row) => sum + row.directLinkages, 0);
    const legacyLinkages = all.reduce((sum, row) => sum + row.legacyLinkages, 0);
    const timedResponses = all.reduce((sum, row) => sum + row.timedResponses, 0);
    const totalTimeSeconds = all.reduce((sum, row) => sum + row.totalTimeSeconds, 0);
    const stableCollisionGroups = Array.from(placementsByStableId.values())
      .filter((placements) => new Set(placements.map((placement) => placement.questionVersionId)).size > 1).length;
    const duplicateQuestionPlacements = Array.from(metrics.values()).filter((metric) => metric.duplicatePlacements > 1).length;

    return res.json({
      windowDays: days,
      summary: {
        completedAttemptsScanned: attemptRows.length, questionsWithExposure: all.length,
        responseItems: all.reduce((sum, row) => sum + row.exposures, 0), answeredItems: answered,
        skippedItems: all.reduce((sum, row) => sum + row.skipped, 0),
        invalidResponseItems: all.reduce((sum, row) => sum + row.invalidResponseItems, 0),
        overallAccuracy: answered ? rate(correct, answered) : null,
        averageQuestionTimeSeconds: timedResponses ? Math.round((totalTimeSeconds / timedResponses) * 100) / 100 : null,
        timedResponses, directLinkages, legacyLinkages, unmatchedReviewItems, reviewedItems,
        malformedReviewAttempts, stableCollisionGroups, duplicateQuestionPlacements,
      },
      questions, resultLimit: limit, truncated: filtered.length > limit, scanTruncated,
      capabilities: {
        correctness: true, optionSelection: true, flagAnalytics: true,
        questionTiming: timedResponses > 0, discrimination: false, directQuestionLinkage: directLinkages > 0,
        reason: 'New result snapshots persist direct immutable question linkage, immutable option keys and optional per-question timing. Legacy snapshots continue through collision-safe stable-ID reconstruction. Discrimination remains deferred until a separately validated cohort method is implemented.',
      },
      readOnly: true, generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Unable to load canonical Question Analytics', error);
    return res.status(500).json({ error: 'Unable to load question analytics', code: 'ADMIN_QUESTION_ANALYTICS_FAILED' });
  }
});

export default router;

import { Router } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import { authenticate } from '../middlewares/auth';

const router = Router();
const ATTEMPT_SCAN_LIMIT = 10000;
const VISIBLE_PUBLICATION_LIMIT = 250;
const text = (value: unknown, maximum = 200) => typeof value === 'string' ? value.trim().slice(0, maximum) : '';

function stableQuestionId(id: string, index = 0): number {
  let hash = 17;
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash || index + 1;
}

const rate = (part: number, whole: number) => whole > 0 ? Math.round((part / whole) * 10000) / 100 : 0;

router.use(authenticate);

router.get('/questions/quality', requireAdminPermission('users.students.read'), async (req, res) => {
  const days = Math.min(365, Math.max(7, Math.floor(Number(req.query.days) || 30)));
  const search = text(req.query.search).toLowerCase();

  try {
    const [rawAttemptRows, catalogRows] = await Promise.all([
      sqlClient`
        SELECT a.id::text AS "attemptId", a.test_publication_id::text AS "publicationId",
          a.evaluated_at AS "evaluatedAt", a.result_snapshot AS "resultSnapshot"
        FROM learning.attempts a
        WHERE a.started_at >= now() - make_interval(days => ${days})
          AND a.status::text IN ('evaluated', 'practice_evaluated')
          AND a.test_publication_id IS NOT NULL
        ORDER BY a.evaluated_at DESC NULLS LAST
        LIMIT ${ATTEMPT_SCAN_LIMIT + 1}
      `,
      sqlClient`
        SELECT p.id::text AS "publicationId", p.publication_number AS "publicationNumber",
          t.public_code AS "testPublicCode", tv.title AS "testTitle",
          tq.id::text AS "testQuestionId", tq.question_version_id::text AS "questionVersionId",
          tq.test_section_id::text AS "testSectionId", section.name AS "sectionName", v.stem,
          row_number() OVER (PARTITION BY p.id ORDER BY section.sort_order, tq.position) - 1 AS "questionIndex",
          COALESCE(json_agg(json_build_object('key', o.option_key, 'text', o.text,
            'sortOrder', o.sort_order, 'isCorrect', o.is_correct) ORDER BY o.sort_order)
            FILTER (WHERE o.id IS NOT NULL), '[]'::json) AS options
        FROM assessment.test_publications p
        JOIN assessment.tests t ON t.id = p.test_id
        JOIN assessment.test_versions tv ON tv.id = p.test_version_id
        JOIN assessment.test_questions tq ON tq.test_version_id = tv.id
        JOIN assessment.test_sections section ON section.id = tq.test_section_id
        JOIN content.question_versions v ON v.id = tq.question_version_id
        LEFT JOIN content.question_options o ON o.question_version_id = v.id
        WHERE (${search} = '' OR lower(tv.title) LIKE ${`%${search}%`}
          OR lower(t.public_code) LIKE ${`%${search}%`} OR lower(v.stem) LIKE ${`%${search}%`}
          OR lower(tq.question_version_id::text) = ${search})
        GROUP BY p.id, p.publication_number, t.public_code, tv.title, tq.id,
          tq.question_version_id, tq.test_section_id, section.name, section.sort_order, v.stem, tq.position
        ORDER BY tv.title, p.publication_number, section.sort_order, tq.position
      `,
    ]);

    type Option = { key?: string; text?: string; isCorrect?: boolean };
    type Placement = {
      publicationId: string; publicationNumber: number; testPublicCode: string; testTitle: string;
      testQuestionId: string; questionVersionId: string; testSectionId: string; sectionName: string;
      stem: string; stableId: number; options: Option[];
    };
    type PublicationQuality = {
      publicationId: string; publicationNumber: number; testPublicCode: string; testTitle: string;
      questionCount: number; completedAttemptsScanned: number; reviewedItems: number; matchedItems: number;
      directLinkages: number; legacyLinkages: number; unmatchedReviewItems: number; malformedReviewAttempts: number;
      missingQuestionItems: number; invalidOptionSelections: number; answerKeyMismatches: number;
      identifierMismatchItems: number; duplicateSnapshotItems: number; stableIdCollisions: number;
      duplicateQuestionPlacements: number; limitedSampleQuestions: number; latestActivityAt: string | null;
    };

    const placementsByPublication = new Map<string, Placement[]>();
    const byTestQuestion = new Map<string, Placement>();
    const byQuestionVersion = new Map<string, Placement[]>();
    const byStableId = new Map<string, Placement[]>();
    const exposureByQuestion = new Map<string, number>();
    const publications = new Map<string, PublicationQuality>();

    for (const row of catalogRows) {
      const publicationId = String(row.publicationId);
      const questionVersionId = String(row.questionVersionId);
      const placement: Placement = {
        publicationId,
        publicationNumber: Number(row.publicationNumber),
        testPublicCode: String(row.testPublicCode),
        testTitle: String(row.testTitle),
        testQuestionId: String(row.testQuestionId),
        questionVersionId,
        testSectionId: String(row.testSectionId),
        sectionName: String(row.sectionName),
        stem: String(row.stem),
        stableId: stableQuestionId(questionVersionId, Number(row.questionIndex)),
        options: Array.isArray(row.options) ? row.options as Option[] : [],
      };
      placementsByPublication.set(publicationId, [...(placementsByPublication.get(publicationId) ?? []), placement]);
      byTestQuestion.set(`${publicationId}:${placement.testQuestionId}`, placement);
      const qvKey = `${publicationId}:${questionVersionId}`;
      byQuestionVersion.set(qvKey, [...(byQuestionVersion.get(qvKey) ?? []), placement]);
      const stableKey = `${publicationId}:${placement.stableId}`;
      byStableId.set(stableKey, [...(byStableId.get(stableKey) ?? []), placement]);
      exposureByQuestion.set(qvKey, 0);
      if (!publications.has(publicationId)) {
        publications.set(publicationId, {
          publicationId, publicationNumber: placement.publicationNumber, testPublicCode: placement.testPublicCode,
          testTitle: placement.testTitle, questionCount: 0, completedAttemptsScanned: 0, reviewedItems: 0,
          matchedItems: 0, directLinkages: 0, legacyLinkages: 0, unmatchedReviewItems: 0,
          malformedReviewAttempts: 0, missingQuestionItems: 0, invalidOptionSelections: 0,
          answerKeyMismatches: 0, identifierMismatchItems: 0, duplicateSnapshotItems: 0,
          stableIdCollisions: 0, duplicateQuestionPlacements: 0, limitedSampleQuestions: 0,
          latestActivityAt: null,
        });
      }
      publications.get(publicationId)!.questionCount += 1;
    }

    for (const [key, placements] of byQuestionVersion) {
      if (placements.length > 1) publications.get(key.split(':')[0])!.duplicateQuestionPlacements += 1;
    }
    for (const [key, placements] of byStableId) {
      if (new Set(placements.map((placement) => placement.questionVersionId)).size > 1) {
        publications.get(key.split(':')[0])!.stableIdCollisions += 1;
      }
    }

    const attemptRows = rawAttemptRows.slice(0, ATTEMPT_SCAN_LIMIT);
    const scanTruncated = rawAttemptRows.length > ATTEMPT_SCAN_LIMIT;

    for (const attempt of attemptRows) {
      const publicationId = String(attempt.publicationId);
      const quality = publications.get(publicationId);
      const publicationPlacements = placementsByPublication.get(publicationId);
      if (!quality || !publicationPlacements) continue;
      quality.completedAttemptsScanned += 1;
      if (attempt.evaluatedAt) {
        const timestamp = new Date(String(attempt.evaluatedAt)).toISOString();
        if (!quality.latestActivityAt || timestamp > quality.latestActivityAt) quality.latestActivityAt = timestamp;
      }

      const snapshot = attempt.resultSnapshot && typeof attempt.resultSnapshot === 'object'
        ? attempt.resultSnapshot as Record<string, unknown>
        : {};
      if (!Array.isArray(snapshot.questionReview)) {
        quality.malformedReviewAttempts += 1;
        quality.missingQuestionItems += publicationPlacements.length;
        continue;
      }

      const matchedPlacementKeys = new Set<string>();
      for (const item of snapshot.questionReview as Array<Record<string, unknown>>) {
        quality.reviewedItems += 1;
        const testQuestionId = typeof item.testQuestionId === 'string' ? item.testQuestionId : '';
        const questionVersionId = typeof item.questionVersionId === 'string' ? item.questionVersionId : '';
        const testQuestionPlacement = testQuestionId ? byTestQuestion.get(`${publicationId}:${testQuestionId}`) : undefined;
        const qvPlacements = questionVersionId ? byQuestionVersion.get(`${publicationId}:${questionVersionId}`) ?? [] : [];
        if (testQuestionPlacement && questionVersionId && testQuestionPlacement.questionVersionId !== questionVersionId) {
          quality.identifierMismatchItems += 1;
        }
        const directPlacement = testQuestionPlacement ?? qvPlacements[0];
        const legacyCandidates = byStableId.get(`${publicationId}:${Number(item.questionId)}`) ?? [];
        const legacyQuestionVersions = new Set(legacyCandidates.map((candidate) => candidate.questionVersionId));
        const legacyPlacement = legacyQuestionVersions.size === 1 ? legacyCandidates[0] : undefined;
        const placement = directPlacement ?? legacyPlacement;
        if (!placement) { quality.unmatchedReviewItems += 1; continue; }

        const placementKey = `${publicationId}:${placement.testQuestionId}`;
        if (matchedPlacementKeys.has(placementKey)) quality.duplicateSnapshotItems += 1;
        matchedPlacementKeys.add(placementKey);
        quality.matchedItems += 1;
        if (directPlacement) quality.directLinkages += 1; else quality.legacyLinkages += 1;
        const exposureKey = `${publicationId}:${placement.questionVersionId}`;
        exposureByQuestion.set(exposureKey, (exposureByQuestion.get(exposureKey) ?? 0) + 1);

        const selectedOptionKey = typeof item.selectedOptionKey === 'string' ? item.selectedOptionKey : '';
        const rawSelected = item.selected == null ? null : Number(item.selected);
        const selected = selectedOptionKey
          ? placement.options.findIndex((option) => String(option.key ?? '') === selectedOptionKey)
          : rawSelected;
        if ((rawSelected != null || selectedOptionKey)
          && (selected == null || !Number.isInteger(selected) || selected < 0 || selected >= placement.options.length)) {
          quality.invalidOptionSelections += 1;
        }

        const expectedCorrectIndex = placement.options.findIndex((option) => Boolean(option.isCorrect));
        const expectedCorrectKey = expectedCorrectIndex >= 0 ? String(placement.options[expectedCorrectIndex]?.key ?? '') : '';
        const snapshotCorrectIndex = item.correct == null ? null : Number(item.correct);
        const snapshotCorrectKey = typeof item.correctOptionKey === 'string' ? item.correctOptionKey : '';
        if ((snapshotCorrectIndex != null && snapshotCorrectIndex !== expectedCorrectIndex)
          || (snapshotCorrectKey && snapshotCorrectKey !== expectedCorrectKey)) quality.answerKeyMismatches += 1;
      }
      quality.missingQuestionItems += Math.max(0, publicationPlacements.length - matchedPlacementKeys.size);
    }

    for (const [key, count] of exposureByQuestion) {
      if (count < 20) publications.get(key.split(':')[0])!.limitedSampleQuestions += 1;
    }

    const rows = Array.from(publications.values()).map((row) => {
      const criticalIssues = row.unmatchedReviewItems + row.invalidOptionSelections + row.answerKeyMismatches
        + row.identifierMismatchItems + row.duplicateSnapshotItems + row.stableIdCollisions + row.duplicateQuestionPlacements;
      const warningIssues = row.malformedReviewAttempts + row.missingQuestionItems + row.legacyLinkages + row.limitedSampleQuestions;
      const state = criticalIssues > 0 ? 'critical' : warningIssues > 0 ? 'warning' : 'clean';
      return {
        ...row,
        directCoverageRate: rate(row.directLinkages, row.directLinkages + row.legacyLinkages),
        issueCount: criticalIssues + warningIssues,
        state,
      };
    }).sort((a, b) => {
      const rank = (state: string) => state === 'critical' ? 0 : state === 'warning' ? 1 : 2;
      return rank(a.state) - rank(b.state) || b.issueCount - a.issueCount
        || String(b.latestActivityAt ?? '').localeCompare(String(a.latestActivityAt ?? ''));
    });

    const summary = rows.reduce((acc, row) => {
      acc.publications += 1;
      acc.critical += row.state === 'critical' ? 1 : 0;
      acc.warning += row.state === 'warning' ? 1 : 0;
      acc.clean += row.state === 'clean' ? 1 : 0;
      acc.completedAttemptsScanned += row.completedAttemptsScanned;
      acc.reviewedItems += row.reviewedItems;
      acc.directLinkages += row.directLinkages;
      acc.legacyLinkages += row.legacyLinkages;
      acc.unmatchedReviewItems += row.unmatchedReviewItems;
      acc.malformedReviewAttempts += row.malformedReviewAttempts;
      acc.missingQuestionItems += row.missingQuestionItems;
      acc.invalidOptionSelections += row.invalidOptionSelections;
      acc.answerKeyMismatches += row.answerKeyMismatches;
      acc.stableIdCollisions += row.stableIdCollisions;
      acc.duplicateQuestionPlacements += row.duplicateQuestionPlacements;
      return acc;
    }, {
      publications: 0, critical: 0, warning: 0, clean: 0, completedAttemptsScanned: 0,
      reviewedItems: 0, directLinkages: 0, legacyLinkages: 0, unmatchedReviewItems: 0,
      malformedReviewAttempts: 0, missingQuestionItems: 0, invalidOptionSelections: 0,
      answerKeyMismatches: 0, stableIdCollisions: 0, duplicateQuestionPlacements: 0,
    });

    return res.json({
      windowDays: days,
      summary: { ...summary, directCoverageRate: rate(summary.directLinkages, summary.directLinkages + summary.legacyLinkages) },
      publications: rows.slice(0, VISIBLE_PUBLICATION_LIMIT),
      truncated: rows.length > VISIBLE_PUBLICATION_LIMIT,
      scanTruncated,
      thresholds: { usableExposure: 20, attemptScanLimit: ATTEMPT_SCAN_LIMIT, visiblePublicationLimit: VISIBLE_PUBLICATION_LIMIT },
      freshness: { latestActivityAt: rows.reduce<string | null>((latest, row) => !row.latestActivityAt || (latest && latest >= row.latestActivityAt) ? latest : row.latestActivityAt, null) },
      readOnly: true,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Unable to load Question Analytics quality diagnostics', error);
    return res.status(500).json({ error: 'Unable to load question analytics quality', code: 'ADMIN_QUESTION_ANALYTICS_QUALITY_FAILED' });
  }
});

export default router;

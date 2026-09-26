import type { GeoAgr001Difficulty, GeoAgr001Question } from "./geo-agr-001-review-types";

const BANNED = /associated with|best describes|described as|in the context of|\bbroad(?:ly)?\b|\bmainly\b|given in NCERT|\bNCERT\b|\btextbook\b|which pair correctly|which statement correctly|which option gives|sourceFact|runtimeRegistered|review-only|generator/i;
const TRIVIAL_DISTRACTOR = /currency|stock market|movie|sports team|bank rate|tax slab|parliament seat|railway zone/i;

export function auditGeoAgr001Batch(
  questions: readonly GeoAgr001Question[],
  qlStart: number,
  qlEnd: number,
) {
  const issues: string[] = [];
  const ids = new Set<string>();
  const stems = new Set<string>();
  const explanations = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoAgr001Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];

  for (const q of questions) {
    if (ids.has(q.questionId)) issues.push("DUPLICATE_ID:" + q.questionId);
    ids.add(q.questionId);

    const stem = q.stem.replace(/\s+/g, " ").trim().toLowerCase();
    if (stems.has(stem)) issues.push("DUPLICATE_STEM:" + q.questionId);
    stems.add(stem);

    const explanation = q.explanation.replace(/\s+/g, " ").trim().toLowerCase();
    if (explanations.has(explanation)) issues.push("DUPLICATE_EXPLANATION:" + q.questionId);
    explanations.add(explanation);

    qlCounts[q.qlId] = (qlCounts[q.qlId] ?? 0) + 1;
    difficultyCounts[q.difficulty] += 1;
    answerPositions[q.correctIndex] += 1;

    if (q.options.length !== 4 || new Set(q.options).size !== 4) issues.push("OPTIONS:" + q.questionId);
    if (q.options[q.correctIndex] !== q.canonicalAnswer) issues.push("ANSWER:" + q.questionId);
    if (!q.sourceIds.length || !q.sourceFactIds.length) issues.push("PROVENANCE:" + q.questionId);
    if (!q.reviewOnly || q.runtimeRegistered) issues.push("LIFECYCLE:" + q.questionId);

    const distractors = q.options.filter((_, i) => i !== q.correctIndex);
    if (distractors.some((option) => TRIVIAL_DISTRACTOR.test(option))) issues.push("TRIVIAL_DISTRACTOR:" + q.questionId);

    const learnerText = q.stem + "\n" + q.options.join("\n") + "\n" + q.explanation;
    if (BANNED.test(learnerText)) issues.push("STYLE:" + q.questionId);
    if (q.stem.length < 18 || q.stem.length > 320 || !q.stem.trim().endsWith("?")) issues.push("STEM_SHAPE:" + q.questionId);
    if (q.explanation.length < 110) issues.push("SHORT_EXPLANATION:" + q.questionId);
    if ((q.explanation.match(/[.!?](?:\s|$)/g) ?? []).length < 2) issues.push("EXPLANATION_DEPTH:" + q.questionId);
  }

  if (questions.length !== 54) issues.push("COUNT:" + questions.length);
  for (let n = qlStart; n <= qlEnd; n += 1) {
    const qlId = "GEO-AGR-001-QL-" + String(n).padStart(3, "0");
    if (qlCounts[qlId] !== 6) issues.push("QL_COUNT:" + qlId + ":" + (qlCounts[qlId] ?? 0));
  }
  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 6) {
    issues.push("DIFFICULTY:" + JSON.stringify(difficultyCounts));
  }
  if (answerPositions.join(",") !== "14,14,13,13") {
    issues.push("ANSWER_POSITIONS:" + answerPositions.join(","));
  }
  if (stems.size !== 54) issues.push("STEM_COUNT:" + stems.size);
  if (explanations.size !== 54) issues.push("EXPLANATION_COUNT:" + explanations.size);

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: questions.length,
    stemCount: stems.size,
    explanationCount: explanations.size,
    qlCounts: Object.freeze(qlCounts),
    difficultyCounts: Object.freeze(difficultyCounts),
    answerPositions: Object.freeze(answerPositions),
  });
}

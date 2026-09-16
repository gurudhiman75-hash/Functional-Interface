import {
  GEO_CLI_001_CP010_REVIEW_BATCH_V2,
} from "./geo-cli-001-cp010-review-batch-v2";
import type {
  GeoCli001Cp010Difficulty,
  GeoCli001Cp010Question,
} from "./geo-cli-001-cp010-review-batch-v1";

const STEM_OVERRIDES: Readonly<Record<string, string>> = Object.freeze({
  "GEO-CLI-001-CP010-Q002": "Western Rajasthan mainly falls in which rainfall category?",
  "GEO-CLI-001-CP010-Q042": "Which state pair follows the east-to-west decrease in northern-plain rainfall?",
});

const EXPLANATION_OVERRIDES: Readonly<Record<string, string>> = Object.freeze({
  "GEO-CLI-001-CP010-Q005": "The Arabian Sea branch crosses Rajasthan with limited uplift because the Aravallis run nearly parallel to its path, so rainfall stays scanty.",
  "GEO-CLI-001-CP010-Q006": "Western Rajasthan is dry and highly variable, but the Aravallis do not strongly block and uplift the Arabian Sea branch because their alignment is nearly parallel to it.",
  "GEO-CLI-001-CP010-Q032": "After crossing the Western Ghats, air descends on the eastern side and becomes drier, creating a rain-shadow zone in the interior Deccan.",
  "GEO-CLI-001-CP010-Q040": "The east-to-west decrease means eastern areas such as Bihar generally receive more monsoon rain than western Uttar Pradesh.",
});

export const GEO_CLI_001_CP010_REVIEW_BATCH_V3: readonly GeoCli001Cp010Question[] = Object.freeze(
  GEO_CLI_001_CP010_REVIEW_BATCH_V2.map((question) => {
    const stem = STEM_OVERRIDES[question.questionId] ?? question.stem;
    const explanation = EXPLANATION_OVERRIDES[question.questionId] ?? question.explanation;
    return stem === question.stem && explanation === question.explanation
      ? question
      : Object.freeze({ ...question, stem, explanation });
  }),
);

const BANNED_LEARNER_TEXT = /sourceFact|review-only|runtimeRegistered|generator|qualification gate|truth authority|\bNCERT\b|\bIMD\b|\bbroad(?:ly)?\b/i;
const BANNED_STEM_TEXT = /associated with|described as|in the context of|with reference to the above|what is a key feature|which is correct\?|which statement is correct\?|which climate control best explains/i;

export function auditGeoCli001Cp010ReviewBatchV3() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const stems = new Set<string>();
  const semantics = new Set<string>();
  const explanations = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoCli001Cp010Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];
  const hardAnswers = new Set<string>();
  let statementStemCount = 0;

  for (const question of GEO_CLI_001_CP010_REVIEW_BATCH_V3) {
    if (ids.has(question.questionId)) issues.push(`DUPLICATE_ID:${question.questionId}`);
    ids.add(question.questionId);
    const normalizedStem = question.stem.replace(/\s+/g, " ").trim().toLowerCase();
    if (stems.has(normalizedStem)) issues.push(`DUPLICATE_STEM:${question.questionId}`);
    stems.add(normalizedStem);
    const semantic = `${normalizedStem}::${question.canonicalAnswer.toLowerCase()}`;
    if (semantics.has(semantic)) issues.push(`DUPLICATE_SEMANTIC:${question.questionId}`);
    semantics.add(semantic);
    const normalizedExplanation = question.explanation.replace(/\s+/g, " ").trim().toLowerCase();
    if (explanations.has(normalizedExplanation)) issues.push(`DUPLICATE_EXPLANATION:${question.questionId}`);
    explanations.add(normalizedExplanation);
    qlCounts[question.qlId] = (qlCounts[question.qlId] ?? 0) + 1;
    difficultyCounts[question.difficulty] += 1;
    answerPositions[question.correctIndex] += 1;
    if (question.difficulty === "Hard") hardAnswers.add(question.canonicalAnswer);
    if (/\nI\./.test(question.stem)) statementStemCount += 1;
    if (question.options.length !== 4 || new Set(question.options).size !== 4) issues.push(`OPTIONS:${question.questionId}`);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`ANSWER:${question.questionId}`);
    if (!question.sourceIds.length || !question.sourceFactIds.length) issues.push(`PROVENANCE:${question.questionId}`);
    if (!question.reviewOnly || question.runtimeRegistered) issues.push(`LIFECYCLE:${question.questionId}`);
    if (question.explanation.length < 60) issues.push(`SHORT_EXPLANATION:${question.questionId}`);
    if (question.stem.length < 28) issues.push(`SHORT_STEM:${question.questionId}`);
    if (question.stem.length > 220) issues.push(`LONG_STEM:${question.questionId}`);
    if (!question.stem.trim().endsWith("?")) issues.push(`NON_QUESTION_STEM:${question.questionId}`);
    if (BANNED_STEM_TEXT.test(question.stem)) issues.push(`NON_EXAM_STEM:${question.questionId}`);
    const learnerText = `${question.stem}\n${question.options.join("\n")}\n${question.explanation}`;
    if (BANNED_LEARNER_TEXT.test(learnerText)) issues.push(`LEARNER_TEXT:${question.questionId}`);
  }

  if (Object.keys(STEM_OVERRIDES).length !== 2) issues.push(`V3_STEM_OVERRIDE_COUNT:${Object.keys(STEM_OVERRIDES).length}`);
  if (Object.keys(EXPLANATION_OVERRIDES).length !== 4) issues.push(`V3_EXPLANATION_OVERRIDE_COUNT:${Object.keys(EXPLANATION_OVERRIDES).length}`);
  if (GEO_CLI_001_CP010_REVIEW_BATCH_V3.length !== 54) issues.push(`COUNT:${GEO_CLI_001_CP010_REVIEW_BATCH_V3.length}`);
  if (stems.size !== 54) issues.push(`STEM_COUNT:${stems.size}`);
  if (semantics.size !== 54) issues.push(`SEMANTIC_COUNT:${semantics.size}`);
  if (explanations.size !== 54) issues.push(`EXPLANATION_COUNT:${explanations.size}`);
  if (statementStemCount > 10) issues.push(`STATEMENT_STEM_OVERUSE:${statementStemCount}`);
  for (let i = 82; i <= 90; i += 1) {
    const qlId = `GEO-CLI-001-QL-${String(i).padStart(3, "0")}`;
    if (qlCounts[qlId] !== 6) issues.push(`QL_COUNT:${qlId}:${qlCounts[qlId] ?? 0}`);
  }
  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 6) issues.push(`DIFFICULTY:${JSON.stringify(difficultyCounts)}`);
  if (answerPositions.join(",") !== "14,14,13,13") issues.push(`ANSWER_POSITIONS:${answerPositions.join(",")}`);
  if (hardAnswers.size < 3) issues.push(`HARD_ANSWER_VARIETY:${hardAnswers.size}`);

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: GEO_CLI_001_CP010_REVIEW_BATCH_V3.length,
    stemCount: stems.size,
    semanticCount: semantics.size,
    explanationCount: explanations.size,
    qlCounts: Object.freeze(qlCounts),
    difficultyCounts: Object.freeze(difficultyCounts),
    answerPositions: Object.freeze(answerPositions),
    hardAnswerVariety: hardAnswers.size,
    statementStemCount,
  });
}

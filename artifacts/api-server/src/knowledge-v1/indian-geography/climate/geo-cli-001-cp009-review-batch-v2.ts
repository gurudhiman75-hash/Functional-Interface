import {
  GEO_CLI_001_CP009_REVIEW_BATCH_V1,
  type GeoCli001Cp009Difficulty,
  type GeoCli001Cp009Question,
} from "./geo-cli-001-cp009-review-batch-v1";

const STEM_OVERRIDES: Readonly<Record<string, string>> = Object.freeze({
  "GEO-CLI-001-CP009-Q006": "Consider these statements:\nI. Western disturbances enter India from the west.\nII. Many form near the eastern Mediterranean.\nIII. They can gain Caspian and Persian Gulf moisture.\nWhich statements are correct?",
  "GEO-CLI-001-CP009-Q012": "Consider these statements:\nI. Western disturbances can bring winter rain to northwest India.\nII. The rain benefits rabi crops.\nIII. It is usually very heavy across all India.\nWhich statements are correct?",
  "GEO-CLI-001-CP009-Q018": "Consider these statements:\nI. Western disturbances may give rain to northwest plains.\nII. They may give snow to the Himalayas.\nIII. This snow can support summer river flow.\nWhich statements are correct?",
  "GEO-CLI-001-CP009-Q024": "Consider these statements:\nI. The westerly jet lies south of the Himalayas in winter.\nII. It is the main surface wind of the northeast monsoon.\nIII. It helps steer western disturbances.\nWhich statements are correct?",
  "GEO-CLI-001-CP009-Q030": "Consider these statements:\nI. The westerly jet lies south of the Himalayas in winter.\nII. It withdraws as the summer monsoon develops.\nIII. The easterly jet sets in before this withdrawal.\nWhich statements are correct?",
});

export const GEO_CLI_001_CP009_REVIEW_BATCH_V2: readonly GeoCli001Cp009Question[] = Object.freeze(
  GEO_CLI_001_CP009_REVIEW_BATCH_V1.map((question) => {
    const stem = STEM_OVERRIDES[question.questionId] ?? question.stem;

    if (question.questionId === "GEO-CLI-001-CP009-Q024") {
      return Object.freeze({
        ...question,
        stem,
        options: Object.freeze(["I only", "II and III only", "I, II and III", "I and III only"]),
        correctIndex: 3,
        canonicalAnswer: "I and III only",
        explanation: "Statements I and III are correct. The westerly jet is an upper-air current, not the main surface wind of the northeast monsoon.",
      });
    }

    return stem === question.stem ? question : Object.freeze({ ...question, stem });
  }),
);

const BANNED_LEARNER_TEXT = /sourceFact|review-only|runtimeRegistered|generator|qualification gate|truth authority|\bNCERT\b|\bIMD\b/i;
const BANNED_STEM_TEXT = /associated with|described as|in the context of|with reference to the above|what is a key feature|which is correct\?|which statement is correct\?|what broad effect can it have|which climate control best explains/i;

export function auditGeoCli001Cp009ReviewBatchV2() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const stems = new Set<string>();
  const semantics = new Set<string>();
  const explanations = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoCli001Cp009Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];
  const hardAnswers = new Set<string>();
  let statementStemCount = 0;

  for (const question of GEO_CLI_001_CP009_REVIEW_BATCH_V2) {
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
    if (question.options.length !== 4 || new Set(question.options).size !== 4) issues.push(`OPTIONS:${question.questionId}`);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`ANSWER:${question.questionId}`);
    if (!question.sourceIds.length || !question.sourceFactIds.length) issues.push(`PROVENANCE:${question.questionId}`);
    if (!question.reviewOnly || question.runtimeRegistered) issues.push(`LIFECYCLE:${question.questionId}`);
    if (question.explanation.length < 60) issues.push(`SHORT_EXPLANATION:${question.questionId}`);
    if (question.stem.length < 28) issues.push(`SHORT_STEM:${question.questionId}`);
    if (question.stem.length > 220) issues.push(`LONG_STEM:${question.questionId}`);
    if (!question.stem.trim().endsWith("?")) issues.push(`NON_QUESTION_STEM:${question.questionId}`);
    if (BANNED_STEM_TEXT.test(question.stem)) issues.push(`NON_EXAM_STEM:${question.questionId}`);
    if (/^Consider these statements/i.test(question.stem)) statementStemCount += 1;
    const learnerText = `${question.stem}\n${question.options.join("\n")}\n${question.explanation}`;
    if (BANNED_LEARNER_TEXT.test(learnerText)) issues.push(`LEARNER_TEXT:${question.questionId}`);
  }

  if (Object.keys(STEM_OVERRIDES).length !== 5) issues.push(`V2_OVERRIDE_COUNT:${Object.keys(STEM_OVERRIDES).length}`);
  if (GEO_CLI_001_CP009_REVIEW_BATCH_V2.length !== 54) issues.push(`COUNT:${GEO_CLI_001_CP009_REVIEW_BATCH_V2.length}`);
  if (stems.size !== 54) issues.push(`STEM_COUNT:${stems.size}`);
  if (semantics.size !== 54) issues.push(`SEMANTIC_COUNT:${semantics.size}`);
  if (explanations.size !== 54) issues.push(`EXPLANATION_COUNT:${explanations.size}`);
  if (statementStemCount > 10) issues.push(`STATEMENT_STEM_OVERUSE:${statementStemCount}`);
  for (let i = 73; i <= 81; i += 1) {
    const qlId = `GEO-CLI-001-QL-${String(i).padStart(3, "0")}`;
    if (qlCounts[qlId] !== 6) issues.push(`QL_COUNT:${qlId}:${qlCounts[qlId] ?? 0}`);
  }
  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 6) issues.push(`DIFFICULTY:${JSON.stringify(difficultyCounts)}`);
  if (answerPositions.join(",") !== "14,14,13,13") issues.push(`ANSWER_POSITIONS:${answerPositions.join(",")}`);
  if (hardAnswers.size < 3) issues.push(`HARD_ANSWER_VARIETY:${hardAnswers.size}`);

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: GEO_CLI_001_CP009_REVIEW_BATCH_V2.length,
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

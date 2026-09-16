import {
  GEO_CLI_001_CP008_REVIEW_BATCH_V1,
  type GeoCli001Cp008Difficulty,
  type GeoCli001Cp008Question,
} from "./geo-cli-001-cp008-review-batch-v1";

const STEM_PATCHES: Readonly<Record<string, string>> = Object.freeze({
  "GEO-CLI-001-CP008-Q001": "Which factor affects rainfall by forcing moist air to rise?",
  "GEO-CLI-001-CP008-Q002": "What happens when moist monsoon air rises along a mountain slope?",
  "GEO-CLI-001-CP008-Q003": "Which side of a mountain usually receives more orographic rainfall?",
  "GEO-CLI-001-CP008-Q004": "Why can places at the same latitude receive different monsoon rainfall?",
  "GEO-CLI-001-CP008-Q005": "A moist wind rises over a hill, gives rain, then descends on the other side. Which process explains this?",
  "GEO-CLI-001-CP008-Q006": "How does relief affect monsoon rainfall in India?",
  "GEO-CLI-001-CP008-Q007": "Which side of the Western Ghats gets heavy rain from the Arabian Sea branch?",
  "GEO-CLI-001-CP008-Q008": "What happens when Arabian Sea monsoon winds strike the Western Ghats?",
  "GEO-CLI-001-CP008-Q009": "Why does the Western Coastal Plain receive heavy monsoon rainfall?",
  "GEO-CLI-001-CP008-Q010": "Why do the western slopes of the Western Ghats receive heavy southwest-monsoon rain?",
  "GEO-CLI-001-CP008-Q011": "Which rainfall pattern is seen across the Western Ghats during June-September?",
  "GEO-CLI-001-CP008-Q012": "Two places lie at similar latitude on opposite sides of the Western Ghats. Which usually gets more southwest-monsoon rain?",
  "GEO-CLI-001-CP008-Q013": "What is the dry region east of the Western Ghats called?",
  "GEO-CLI-001-CP008-Q014": "Why does the area east of the Western Ghats receive less rain than the west coast?",
  "GEO-CLI-001-CP008-Q015": "Which sequence correctly explains the rain-shadow effect of the Western Ghats?",
  "GEO-CLI-001-CP008-Q016": "Which place usually receives less southwest-monsoon rain?",
  "GEO-CLI-001-CP008-Q017": "Why does rainfall decrease after monsoon winds cross the Western Ghats?",
  "GEO-CLI-001-CP008-Q018": "Why can a rain-shadow region still receive monsoon winds?",
  "GEO-CLI-001-CP008-Q019": "Which river valleys help the Arabian Sea branch move into central India?",
  "GEO-CLI-001-CP008-Q020": "What is the main effect of the Arabian Sea branch moving through the Narmada and Tapi valleys?",
  "GEO-CLI-001-CP008-Q021": "How is the Narmada-Tapi route different from the Western Ghats route?",
  "GEO-CLI-001-CP008-Q022": "Which monsoon branch does the Narmada-Tapi route later meet over northern India?",
  "GEO-CLI-001-CP008-Q023": "Which feature helps the Arabian Sea branch move inland north of Mumbai?",
  "GEO-CLI-001-CP008-Q024": "Heavy rain occurs on the west coast, while another rain belt extends through central India. Which combination explains this?",
  "GEO-CLI-001-CP008-Q025": "Which region receives scanty rain from the Arabian Sea branch in northwestern India?",
  "GEO-CLI-001-CP008-Q026": "Which mountain range is linked with scanty southwest-monsoon rainfall in western Rajasthan?",
  "GEO-CLI-001-CP008-Q027": "Why do the Aravallis cause less orographic rain than the Western Ghats?",
  "GEO-CLI-001-CP008-Q028": "Which route of the Arabian Sea branch is linked with scanty rain in western Rajasthan?",
  "GEO-CLI-001-CP008-Q029": "Which comparison best shows the effect of mountain orientation on rainfall?",
  "GEO-CLI-001-CP008-Q030": "If moist winds blow nearly parallel to a mountain range, what usually happens to orographic rainfall?",
  "GEO-CLI-001-CP008-Q031": "How does southwest-monsoon rainfall generally change across the northern plains?",
  "GEO-CLI-001-CP008-Q032": "Why does rainfall decrease from east to west across the northern plains?",
  "GEO-CLI-001-CP008-Q033": "Which part of the northern plains generally receives more southwest-monsoon rain?",
  "GEO-CLI-001-CP008-Q034": "How far west does the Bay of Bengal branch move across the northern plains?",
  "GEO-CLI-001-CP008-Q035": "Which sequence best shows the Bay branch losing moisture across northern India?",
  "GEO-CLI-001-CP008-Q036": "Two stations lie on the northern plains, one in the east and one in the west. Which usually receives more monsoon rain?",
  "GEO-CLI-001-CP008-Q037": "Which hills of northeast India receive very heavy rain from a Bay of Bengal monsoon branch?",
  "GEO-CLI-001-CP008-Q038": "Mawsynram is located in which hills?",
  "GEO-CLI-001-CP008-Q039": "Why do the Khasi Hills receive exceptionally heavy monsoon rainfall?",
  "GEO-CLI-001-CP008-Q040": "Which route brings southwest-monsoon rain into Assam and the northeast?",
  "GEO-CLI-001-CP008-Q041": "Which contrast best shows the effect of relief on monsoon rainfall?",
  "GEO-CLI-001-CP008-Q042": "A Bay branch moves through a valley and then strikes a hill barrier. Which pair matches this route?",
  "GEO-CLI-001-CP008-Q043": "Why is the Tamil Nadu coast relatively dry during the southwest monsoon?",
  "GEO-CLI-001-CP008-Q044": "Which southwest-monsoon branch flows broadly parallel to the Tamil Nadu coast?",
  "GEO-CLI-001-CP008-Q045": "Why does Tamil Nadu receive less rain from the Arabian Sea branch in summer?",
  "GEO-CLI-001-CP008-Q046": "Which comparison is correct during the southwest monsoon?",
  "GEO-CLI-001-CP008-Q047": "Which two factors explain the Tamil Nadu coast's low southwest-monsoon rainfall?",
  "GEO-CLI-001-CP008-Q048": "Which coast lies east of the Western Ghats and nearly parallel to the summer Bay branch?",
  "GEO-CLI-001-CP008-Q049": "Which pair best shows a windward-leeward rainfall contrast in India?",
  "GEO-CLI-001-CP008-Q050": "Which region is a major example of relief-enhanced rainfall from the Bay of Bengal branch?",
  "GEO-CLI-001-CP008-Q051": "Which sequence correctly explains rainfall across the Western Ghats and the interior Deccan?",
  "GEO-CLI-001-CP008-Q052": "Which region-rainfall pair is correctly matched for the southwest monsoon?",
  "GEO-CLI-001-CP008-Q053": "How are the Ganga plain and Meghalaya rainfall patterns related?",
  "GEO-CLI-001-CP008-Q054": "A map shows heavy rain on the west coast and Meghalaya, less rain east of the Western Ghats, and declining rain westward across the northern plains. What explains this?",
});

export const GEO_CLI_001_CP008_REVIEW_BATCH_V2: readonly GeoCli001Cp008Question[] = Object.freeze(
  GEO_CLI_001_CP008_REVIEW_BATCH_V1.map((question) => Object.freeze({
    ...question,
    stem: STEM_PATCHES[question.questionId] ?? question.stem,
    reviewOnly: true as const,
    runtimeRegistered: false as const,
  })),
);

const BANNED_LEARNER_TEXT = /sourceFact|review-only|runtimeRegistered|generator|qualification gate|truth authority|\bNCERT\b/i;
const BANNED_STEM_TEXT = /associated with|described as|in the context of|with reference to the above|what is a key feature|which is correct\?|which statement is correct\?|what broad effect can it have|which climate control best explains/i;

export function auditGeoCli001Cp008ReviewBatchV2() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const stems = new Set<string>();
  const semantics = new Set<string>();
  const explanations = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoCli001Cp008Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];
  const hardAnswers = new Set<string>();
  let statementStemCount = 0;

  if (Object.keys(STEM_PATCHES).length !== 54) issues.push(`STEM_PATCH_COUNT:${Object.keys(STEM_PATCHES).length}`);

  for (const question of GEO_CLI_001_CP008_REVIEW_BATCH_V2) {
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

  if (GEO_CLI_001_CP008_REVIEW_BATCH_V2.length !== 54) issues.push(`COUNT:${GEO_CLI_001_CP008_REVIEW_BATCH_V2.length}`);
  if (stems.size !== 54) issues.push(`STEM_COUNT:${stems.size}`);
  if (semantics.size !== 54) issues.push(`SEMANTIC_COUNT:${semantics.size}`);
  if (explanations.size !== 54) issues.push(`EXPLANATION_COUNT:${explanations.size}`);
  if (statementStemCount > 10) issues.push(`STATEMENT_STEM_OVERUSE:${statementStemCount}`);
  for (let i = 64; i <= 72; i += 1) {
    const qlId = `GEO-CLI-001-QL-${String(i).padStart(3, "0")}`;
    if (qlCounts[qlId] !== 6) issues.push(`QL_COUNT:${qlId}:${qlCounts[qlId] ?? 0}`);
  }
  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 6) issues.push(`DIFFICULTY:${JSON.stringify(difficultyCounts)}`);
  if (answerPositions.join(",") !== "14,14,13,13") issues.push(`ANSWER_POSITIONS:${answerPositions.join(",")}`);
  if (hardAnswers.size < 3) issues.push(`HARD_ANSWER_VARIETY:${hardAnswers.size}`);

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: GEO_CLI_001_CP008_REVIEW_BATCH_V2.length,
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

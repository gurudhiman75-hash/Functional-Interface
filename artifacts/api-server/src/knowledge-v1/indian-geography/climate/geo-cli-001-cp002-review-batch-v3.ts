import {
  GEO_CLI_001_CP002_REVIEW_BATCH_V2,
  type GeoCli001Cp002Difficulty,
  type GeoCli001Cp002Question,
} from "./geo-cli-001-cp002-review-batch-v2";

const STEM_PATCHES: Readonly<Record<string, string>> = Object.freeze({
  "GEO-CLI-001-CP002-Q001": "Why does summer heating create a pressure contrast between the Indian landmass and the surrounding seas?",
  "GEO-CLI-001-CP002-Q002": "In summer, which heats more rapidly over the Indian region?",
  "GEO-CLI-001-CP002-Q003": "Which process is the basic cause of the summer land-sea pressure contrast over India?",
  "GEO-CLI-001-CP002-Q004": "Intense summer heating over the Indian landmass generally produces which pressure condition?",
  "GEO-CLI-001-CP002-Q005": "Which pair correctly shows the effect of summer heating over India?",
  "GEO-CLI-001-CP002-Q006": "Consider these statements about summer heating:\nI. Land heats faster than water.\nII. The surrounding seas warm more slowly and remain at relatively higher pressure.\nWhich statement(s) are correct?",
  "GEO-CLI-001-CP002-Q007": "The major summer thermal low over India develops mainly over which region?",
  "GEO-CLI-001-CP002-Q008": "During the hot-weather season, which pressure condition develops over northwestern India?",
  "GEO-CLI-001-CP002-Q009": "Why are winds drawn from the Indian Ocean toward the Indian subcontinent in summer?",
  "GEO-CLI-001-CP002-Q010": "Which pressure pattern favours summer onshore winds over India?",
  "GEO-CLI-001-CP002-Q011": "A strong thermal low forms over northwestern India. What effect does it have on nearby air?",
  "GEO-CLI-001-CP002-Q012": "Which process best explains the summer pressure gradient over the Indian subcontinent?",
  "GEO-CLI-001-CP002-Q013": "The Inter-Tropical Convergence Zone (ITCZ) is best described as which of the following?",
  "GEO-CLI-001-CP002-Q014": "In July, the ITCZ over India is generally located near which latitudinal belt?",
  "GEO-CLI-001-CP002-Q015": "What is the ITCZ called when it shifts north over the Gangetic plain in summer?",
  "GEO-CLI-001-CP002-Q016": "How does the northward shift of the ITCZ help the Indian summer monsoon?",
  "GEO-CLI-001-CP002-Q017": "What usually happens to air where the trade winds converge within the ITCZ?",
  "GEO-CLI-001-CP002-Q018": "Consider these statements about the ITCZ:\nI. It is a low-pressure convergence zone.\nII. In July, it shifts northward over India.\nWhich statement(s) are correct?",
  "GEO-CLI-001-CP002-Q019": "Which winds cross the Equator to become part of India's southwest monsoon circulation?",
  "GEO-CLI-001-CP002-Q020": "The southeast trade winds feeding the Indian summer monsoon cross the Equator mainly between which longitudes?",
  "GEO-CLI-001-CP002-Q021": "Why do Southern Hemisphere southeast trade winds move toward India during summer?",
  "GEO-CLI-001-CP002-Q022": "After crossing the Equator, the southeast trade winds are directed mainly toward which region?",
  "GEO-CLI-001-CP002-Q023": "The southwest monsoon over India develops from which basic wind flow?",
  "GEO-CLI-001-CP002-Q024": "Consider these statements about the summer monsoon:\nI. Southeast trade winds cross the Equator.\nII. They then move toward the low-pressure area over India.\nWhich statement(s) are correct?",
  "GEO-CLI-001-CP002-Q025": "Why do cross-equatorial winds reach India from the southwest?",
  "GEO-CLI-001-CP002-Q026": "Which movement of Earth produces the Coriolis force?",
  "GEO-CLI-001-CP002-Q027": "In the Northern Hemisphere, the Coriolis force deflects moving air in which direction?",
  "GEO-CLI-001-CP002-Q028": "What happens to southeast trade winds after they cross the Equator toward India?",
  "GEO-CLI-001-CP002-Q029": "Which pair correctly explains why the summer monsoon is called the 'southwest monsoon'?",
  "GEO-CLI-001-CP002-Q030": "Consider these statements:\nI. The summer monsoon flow crosses the Equator from the Southern Hemisphere.\nII. Coriolis deflection helps turn it into a southwesterly flow.\nWhich statement(s) are correct?",
  "GEO-CLI-001-CP002-Q031": "During summer, the main monsoon flow over India moves in which direction?",
  "GEO-CLI-001-CP002-Q032": "Why can the southwest monsoon carry large amounts of moisture toward India?",
  "GEO-CLI-001-CP002-Q033": "Which pressure pattern most directly drives the summer monsoon from sea toward land?",
  "GEO-CLI-001-CP002-Q034": "Moist winds move from the Indian Ocean toward a thermal low over northern India. This flow is typical of which season?",
  "GEO-CLI-001-CP002-Q035": "Which two factors mainly determine the direction of the summer monsoon toward India?",
  "GEO-CLI-001-CP002-Q036": "Which pair correctly describes the summer monsoon over India?",
  "GEO-CLI-001-CP002-Q037": "Which pressure condition generally develops over northern India during winter?",
  "GEO-CLI-001-CP002-Q038": "During winter, the prevailing surface winds over much of India generally blow from which direction?",
  "GEO-CLI-001-CP002-Q039": "Why do India's monsoon winds reverse direction in winter?",
  "GEO-CLI-001-CP002-Q040": "What happens to the ITCZ as winter sets in over India?",
  "GEO-CLI-001-CP002-Q041": "Which pair correctly describes India's winter monsoon?",
  "GEO-CLI-001-CP002-Q042": "Consider these statements about winter:\nI. Northern India develops relatively high pressure.\nII. Surface winds generally blow from land toward sea.\nWhich statement(s) are correct?",
  "GEO-CLI-001-CP002-Q043": "Which wind-direction pattern best represents the Indian monsoon through the year?",
  "GEO-CLI-001-CP002-Q044": "Why do the prevailing monsoon winds over India change direction between summer and winter?",
  "GEO-CLI-001-CP002-Q045": "Which sequence correctly shows the broad summer monsoon setup over India?",
  "GEO-CLI-001-CP002-Q046": "Which sequence correctly shows the broad winter monsoon setup over India?",
  "GEO-CLI-001-CP002-Q047": "A wind system is mainly onshore in summer and mainly offshore in winter. What does this indicate?",
  "GEO-CLI-001-CP002-Q048": "Consider these statements:\nI. Summer pressure conditions favour ocean-to-land flow.\nII. Winter pressure conditions favour land-to-sea flow.\nWhich statement(s) are correct?",
  "GEO-CLI-001-CP002-Q049": "Which sequence correctly explains the development of India's southwest monsoon?",
  "GEO-CLI-001-CP002-Q050": "Consider these statements:\nI. The ITCZ shifts north in summer.\nII. Southeast trade winds cross the Equator toward India.\nIII. Coriolis deflection turns them into southwesterlies.\nWhich statements are correct?",
  "GEO-CLI-001-CP002-Q051": "Which pressure pattern correctly compares the Indian summer and winter monsoons?",
  "GEO-CLI-001-CP002-Q052": "If summer heating over northwestern India weakens sharply, which part of the monsoon mechanism is affected first?",
  "GEO-CLI-001-CP002-Q053": "A southeast trade wind crosses the Equator and reaches India from the southwest. Which processes explain this change?",
  "GEO-CLI-001-CP002-Q054": "Which chain correctly explains the seasonal reversal of monsoon winds over India?",
});

export const GEO_CLI_001_CP002_REVIEW_BATCH_V3: readonly GeoCli001Cp002Question[] = Object.freeze(
  GEO_CLI_001_CP002_REVIEW_BATCH_V2.map((question) => Object.freeze({
    ...question,
    stem: STEM_PATCHES[question.questionId] ?? question.stem,
    reviewOnly: true as const,
    runtimeRegistered: false as const,
  })),
);

const BANNED_LEARNER_TEXT =
  /sourceFact|review-only|runtimeRegistered|generator|qualification gate|truth authority|NCERT|population density|soil colour|more roads/i;
const BANNED_STEM_TEXT =
  /associated with|described as|in the context of|with reference to the above|what is a key feature|which is correct\?|which statement is correct\?|what broad effect can it have|which climate control best explains/i;

export function auditGeoCli001Cp002ReviewBatchV3() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const stems = new Set<string>();
  const semantics = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoCli001Cp002Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];
  const hardAnswers = new Set<string>();
  let statementStemCount = 0;

  if (Object.keys(STEM_PATCHES).length !== 54) issues.push(`STEM_PATCH_COUNT:${Object.keys(STEM_PATCHES).length}`);

  for (const question of GEO_CLI_001_CP002_REVIEW_BATCH_V3) {
    if (!STEM_PATCHES[question.questionId]) issues.push(`MISSING_STEM_PATCH:${question.questionId}`);
    if (ids.has(question.questionId)) issues.push(`DUPLICATE_ID:${question.questionId}`);
    ids.add(question.questionId);

    const normalizedStem = question.stem.replace(/\s+/g, " ").trim().toLowerCase();
    if (stems.has(normalizedStem)) issues.push(`DUPLICATE_STEM:${question.questionId}`);
    stems.add(normalizedStem);

    const semantic = `${normalizedStem}::${question.canonicalAnswer.toLowerCase()}`;
    if (semantics.has(semantic)) issues.push(`DUPLICATE_SEMANTIC:${question.questionId}`);
    semantics.add(semantic);

    qlCounts[question.qlId] = (qlCounts[question.qlId] ?? 0) + 1;
    difficultyCounts[question.difficulty] += 1;
    answerPositions[question.correctIndex] += 1;
    if (question.difficulty === "Hard") hardAnswers.add(question.canonicalAnswer);

    if (question.options.length !== 4 || new Set(question.options).size !== 4) issues.push(`OPTIONS:${question.questionId}`);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`ANSWER:${question.questionId}`);
    if (!question.sourceIds.length || !question.sourceFactIds.length) issues.push(`PROVENANCE:${question.questionId}`);
    if (!question.reviewOnly || question.runtimeRegistered) issues.push(`LIFECYCLE:${question.questionId}`);
    if (question.explanation.length < 40) issues.push(`SHORT_EXPLANATION:${question.questionId}`);
    if (question.stem.length < 28) issues.push(`SHORT_STEM:${question.questionId}`);
    if (question.stem.length > 220) issues.push(`LONG_STEM:${question.questionId}`);
    if (!question.stem.trim().endsWith("?")) issues.push(`NON_QUESTION_STEM:${question.questionId}`);
    if (BANNED_STEM_TEXT.test(question.stem)) issues.push(`NON_EXAM_STEM:${question.questionId}`);
    if (/^Consider these statements/i.test(question.stem)) statementStemCount += 1;

    const learnerText = `${question.stem}\n${question.options.join("\n")}\n${question.explanation}`;
    if (BANNED_LEARNER_TEXT.test(learnerText)) issues.push(`LEARNER_TEXT:${question.questionId}`);
  }

  if (GEO_CLI_001_CP002_REVIEW_BATCH_V3.length !== 54) issues.push(`COUNT:${GEO_CLI_001_CP002_REVIEW_BATCH_V3.length}`);
  if (stems.size !== 54) issues.push(`STEM_COUNT:${stems.size}`);
  if (semantics.size !== 54) issues.push(`SEMANTIC_COUNT:${semantics.size}`);
  if (statementStemCount > 10) issues.push(`STATEMENT_STEM_OVERUSE:${statementStemCount}`);

  for (let i = 10; i <= 18; i += 1) {
    const qlId = `GEO-CLI-001-QL-${String(i).padStart(3, "0")}`;
    if (qlCounts[qlId] !== 6) issues.push(`QL_COUNT:${qlId}:${qlCounts[qlId] ?? 0}`);
  }

  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 6) {
    issues.push(`DIFFICULTY:${difficultyCounts.Easy}/${difficultyCounts.Medium}/${difficultyCounts.Hard}`);
  }
  if (answerPositions.join(",") !== "14,14,13,13") issues.push(`ANSWER_POSITIONS:${answerPositions.join(",")}`);
  if (hardAnswers.size < 3) issues.push(`HARD_ANSWER_VARIETY:${hardAnswers.size}`);

  return {
    valid: issues.length === 0,
    issues,
    questionCount: GEO_CLI_001_CP002_REVIEW_BATCH_V3.length,
    stemCount: stems.size,
    semanticCount: semantics.size,
    qlCounts,
    difficultyCounts,
    answerPositions,
    hardAnswerVariety: hardAnswers.size,
    statementStemCount,
  };
}

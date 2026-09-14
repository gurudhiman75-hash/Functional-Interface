import { GEO_CLI_001_CP001_REVIEW_BATCH_V3 } from "./geo-cli-001-cp001-review-batch-v3";
import type {
  GeoCli001Cp001Question,
  GeoCli001Difficulty,
} from "./geo-cli-001-cp001-review-batch-v1";

const STEM_PATCHES: Readonly<Record<string, string>> = Object.freeze({
  "GEO-CLI-001-CP001-Q001": "India generally has which broad type of climate?",
  "GEO-CLI-001-CP001-Q002": "Which feature most clearly distinguishes a monsoon climate?",
  "GEO-CLI-001-CP001-Q003": "Which statement best describes the seasonal pattern of India's climate?",
  "GEO-CLI-001-CP001-Q004": "A seasonal reversal in prevailing wind direction is characteristic of which climate?",
  "GEO-CLI-001-CP001-Q005": "Which of the following pairs is correctly matched?",
  "GEO-CLI-001-CP001-Q006": "Consider these statements about India's climate:\nI. Seasonal wind changes are important.\nII. Rainfall has a strong seasonal pattern.\nWhich statement(s) are correct?",
  "GEO-CLI-001-CP001-Q007": "Which latitude passes through the central part of India and has major climatic significance?",
  "GEO-CLI-001-CP001-Q008": "In broad climatic terms, the Tropic of Cancer separates India into which zones?",
  "GEO-CLI-001-CP001-Q009": "Latitude affects temperature mainly because it changes which factor?",
  "GEO-CLI-001-CP001-Q010": "Which part of India generally receives more direct solar radiation because of its lower latitude?",
  "GEO-CLI-001-CP001-Q011": "The broad north-south difference in solar heating over India is mainly controlled by which factor?",
  "GEO-CLI-001-CP001-Q012": "Consider these statements:\nI. The Tropic of Cancer passes through India.\nII. Latitude contributes to broad temperature differences from south to north.\nWhich statement(s) are correct?",
  "GEO-CLI-001-CP001-Q013": "With increasing altitude, air temperature generally shows which change?",
  "GEO-CLI-001-CP001-Q014": "Hill regions are generally cooler than nearby plains mainly because they have what feature?",
  "GEO-CLI-001-CP001-Q015": "Lower temperatures at high elevations are mainly the result of which climate control?",
  "GEO-CLI-001-CP001-Q016": "Two places lie at nearly the same latitude, but one is at a much higher elevation. Which place is likely to be cooler?",
  "GEO-CLI-001-CP001-Q017": "Which statement correctly relates altitude and temperature?",
  "GEO-CLI-001-CP001-Q018": "A hill station is cooler than a nearby lowland mainly because of which factor?",
  "GEO-CLI-001-CP001-Q019": "Which location is expected to have the smaller annual temperature range?",
  "GEO-CLI-001-CP001-Q020": "Inland areas often experience greater temperature extremes than coastal areas mainly because they have what disadvantage?",
  "GEO-CLI-001-CP001-Q021": "Moderate coastal temperatures are mainly due to which climate control?",
  "GEO-CLI-001-CP001-Q022": "Which statement correctly compares coastal and inland temperature ranges?",
  "GEO-CLI-001-CP001-Q023": "A place at the same latitude as a coast has hotter summers and colder winters. This is an example of which effect?",
  "GEO-CLI-001-CP001-Q024": "Consider these statements:\nI. The sea reduces temperature extremes near the coast.\nII. Inland locations receive weaker marine influence.\nWhich statement(s) are correct?",
  "GEO-CLI-001-CP001-Q025": "Which mountain system protects northern India from very cold winds from Central Asia?",
  "GEO-CLI-001-CP001-Q026": "The Himalayas moderate winter conditions in northern India mainly by doing what?",
  "GEO-CLI-001-CP001-Q027": "Which statement best describes the climatic role of the Himalayas?",
  "GEO-CLI-001-CP001-Q028": "What usually happens when moisture-bearing winds meet the Himalayan barrier?",
  "GEO-CLI-001-CP001-Q029": "A high mountain chain blocks the movement of air masses. Which climate control is operating most directly?",
  "GEO-CLI-001-CP001-Q030": "Consider these statements:\nI. The Himalayas shield India from very cold Central Asian winds.\nII. They also affect the path and uplift of moisture-bearing winds.\nWhich statement(s) are correct?",
  "GEO-CLI-001-CP001-Q031": "Which climate control can modify coastal temperatures through the movement of warm or cold seawater?",
  "GEO-CLI-001-CP001-Q032": "If a warm ocean current flows close to a coast, what effect may it have?",
  "GEO-CLI-001-CP001-Q033": "A cold ocean current flowing near a coast may produce which effect?",
  "GEO-CLI-001-CP001-Q034": "The influence of an ocean current on nearby land is strongest under which condition?",
  "GEO-CLI-001-CP001-Q035": "Which of the following pairs is correctly matched?",
  "GEO-CLI-001-CP001-Q036": "Consider these statements:\nI. Warm and cold ocean currents can affect nearby coastal temperatures.\nII. Onshore winds can carry this influence toward land.\nWhich statement(s) are correct?",
  "GEO-CLI-001-CP001-Q037": "Surface winds generally move from which pressure condition to which pressure condition?",
  "GEO-CLI-001-CP001-Q038": "Why can seasonal pressure changes alter the prevailing wind direction over India?",
  "GEO-CLI-001-CP001-Q039": "Strong summer heating of land generally produces which surface-pressure condition?",
  "GEO-CLI-001-CP001-Q040": "Strong winter cooling of land generally produces which surface-pressure condition?",
  "GEO-CLI-001-CP001-Q041": "Which climate control directly links seasonal heating with changes in wind flow?",
  "GEO-CLI-001-CP001-Q042": "Consider these statements:\nI. Pressure differences help drive winds.\nII. Seasonal pressure changes can help reverse prevailing winds.\nWhich statement(s) are correct?",
  "GEO-CLI-001-CP001-Q043": "Rainfall produced when moist air is forced to rise over a mountain barrier is called what?",
  "GEO-CLI-001-CP001-Q044": "Orographic rainfall is generally greater on which side of a mountain barrier?",
  "GEO-CLI-001-CP001-Q045": "The relatively dry zone on the leeward side of a mountain range is called what?",
  "GEO-CLI-001-CP001-Q046": "Why does the orientation of a mountain range matter for rainfall?",
  "GEO-CLI-001-CP001-Q047": "Large rainfall differences across the same mountain range are mainly explained by which climate control?",
  "GEO-CLI-001-CP001-Q048": "Consider these statements:\nI. Moist air cools as it rises over high relief.\nII. The leeward side can receive less rainfall.\nWhich statement(s) are correct?",
  "GEO-CLI-001-CP001-Q049": "A coastal highland is cooler than a nearby coastal plain and also receives heavy windward rain. Which pair of controls explains both features?",
  "GEO-CLI-001-CP001-Q050": "An inland place has a larger temperature range than a coastal place, while a nearby hill station is cooler than both. Which controls are involved?",
  "GEO-CLI-001-CP001-Q051": "Consider these statements:\nI. Latitude affects solar heating.\nII. Altitude affects temperature.\nIII. Relief can create rain-shadow areas.\nWhich statement(s) are correct?",
  "GEO-CLI-001-CP001-Q052": "Consider these statements:\nI. Coasts have smaller temperature ranges than interiors.\nII. The Himalayas limit cold Central Asian winds.\nIII. Windward slopes can receive more rain than leeward slopes.\nWhich are correct?",
  "GEO-CLI-001-CP001-Q053": "A region lies far inland, at low elevation, and on the leeward side of a major mountain barrier. Which conditions are most likely?",
  "GEO-CLI-001-CP001-Q054": "A coastal plain has a smaller temperature range than an inland area behind a mountain barrier, and the inland area is also drier. Which controls explain both differences?",
});

export const GEO_CLI_001_CP001_REVIEW_BATCH_V4: readonly GeoCli001Cp001Question[] = Object.freeze(
  GEO_CLI_001_CP001_REVIEW_BATCH_V3.map((question) => Object.freeze({
    ...question,
    stem: STEM_PATCHES[question.questionId] ?? question.stem,
    reviewOnly: true as const,
    runtimeRegistered: false as const,
  })),
);

const BANNED_LEARNER_TEXT =
  /sourceFact|review-only|runtimeRegistered|generator|qualification gate|truth authority|NCERT|population density|soil colour|more roads|groundwater rainfall|tidal plain|permanent cyclone belt/i;
const BANNED_STEM_TEXT =
  /associated with|described as|in the context of|with reference to the above|what is a key feature|which is correct\?|which statement is correct\?|what broad effect can it have|which climate control best explains/i;

export function auditGeoCli001Cp001ReviewBatchV4() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const stems = new Set<string>();
  const semantics = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoCli001Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];
  const hardAnswers = new Set<string>();
  let statementStemCount = 0;

  for (const question of GEO_CLI_001_CP001_REVIEW_BATCH_V4) {
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
    if (/^Consider these statements:/i.test(question.stem)) statementStemCount += 1;

    const learnerText = `${question.stem}\n${question.options.join("\n")}\n${question.explanation}`;
    if (BANNED_LEARNER_TEXT.test(learnerText)) issues.push(`LEARNER_TEXT:${question.questionId}`);
  }

  if (GEO_CLI_001_CP001_REVIEW_BATCH_V4.length !== 54) issues.push(`COUNT:${GEO_CLI_001_CP001_REVIEW_BATCH_V4.length}`);
  if (stems.size !== 54) issues.push(`STEM_COUNT:${stems.size}`);
  if (semantics.size !== 54) issues.push(`SEMANTIC_COUNT:${semantics.size}`);
  if (statementStemCount > 10) issues.push(`STATEMENT_STEM_OVERUSE:${statementStemCount}`);

  for (let i = 1; i <= 9; i += 1) {
    const qlId = `GEO-CLI-001-QL-${String(i).padStart(3, "0")}`;
    if (qlCounts[qlId] !== 6) issues.push(`QL_COUNT:${qlId}:${qlCounts[qlId] ?? 0}`);
  }

  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 6) {
    issues.push(`DIFFICULTY:${difficultyCounts.Easy}/${difficultyCounts.Medium}/${difficultyCounts.Hard}`);
  }
  if (answerPositions.join(",") !== "14,14,13,13") issues.push(`ANSWER_POSITIONS:${answerPositions.join(",")}`);
  if (hardAnswers.size < 3) issues.push(`HARD_ANSWER_VARIETY:${hardAnswers.size}`);

  const ql006 = GEO_CLI_001_CP001_REVIEW_BATCH_V4.filter((question) => question.qlId === "GEO-CLI-001-QL-006");
  if (ql006.length !== 6 || !ql006.every((question) => question.qlName === "Ocean currents and coastal influence")) {
    issues.push("QL006_OCEAN_CURRENT_COVERAGE");
  }

  return {
    valid: issues.length === 0,
    issues,
    questionCount: GEO_CLI_001_CP001_REVIEW_BATCH_V4.length,
    stemCount: stems.size,
    semanticCount: semantics.size,
    qlCounts,
    difficultyCounts,
    answerPositions,
    hardAnswerVariety: hardAnswers.size,
    statementStemCount,
  };
}

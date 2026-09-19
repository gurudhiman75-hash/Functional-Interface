import {
  GEO_CLI_001_CP002_REVIEW_BATCH_V4,
  type GeoCli001Cp002Difficulty,
  type GeoCli001Cp002Question,
} from "./geo-cli-001-cp002-review-batch-v4";

const STEM_PATCHES_V5: Readonly<Record<string, string>> = Object.freeze({
  "GEO-CLI-001-CP002-Q007": "The major summer thermal low over India develops over which region?",
  "GEO-CLI-001-CP002-Q020": "Approximately between which longitudes do the southeast trade winds feeding the Indian summer monsoon cross the Equator?",
  "GEO-CLI-001-CP002-Q022": "After crossing the Equator, the southeast trade winds move toward which region?",
  "GEO-CLI-001-CP002-Q035": "Which two factors determine the direction of the summer monsoon toward India?",
  "GEO-CLI-001-CP002-Q037": "What pressure pattern over northern India is typical of the cold-weather season?",
  "GEO-CLI-001-CP002-Q038": "In the cold-weather season, what is the usual direction of prevailing surface winds over much of India?",
  "GEO-CLI-001-CP002-Q045": "Which sequence correctly shows the summer monsoon setup over India?",
  "GEO-CLI-001-CP002-Q046": "Which sequence correctly shows the winter monsoon setup over India?",
  "GEO-CLI-001-CP002-Q047": "A wind system is onshore in summer and offshore in winter. What does this indicate?",
  "GEO-CLI-001-CP002-Q050": "Consider these statements about the Indian summer monsoon:\nI. A high-pressure area east of Madagascar influences the monsoon circulation.\nII. Strong summer heating of the Tibetan Plateau produces vigorous vertical air currents and low pressure aloft.\nIII. The ITCZ shifts northward over India in summer.\nWhich statements are correct?",
  "GEO-CLI-001-CP002-Q052": "Which pressure centre over the southern Indian Ocean influences the Indian summer monsoon?",
  "GEO-CLI-001-CP002-Q054": "Intense summer heating of the Tibetan Plateau contributes to the monsoon by producing which atmospheric condition?"
});

const EXPLANATION_PATCHES_V5: Readonly<Record<string, string>> = Object.freeze({
  "GEO-CLI-001-CP002-Q001": "Land heats more quickly than the surrounding sea in summer. The warmer land heats the air above it, helping surface pressure fall while pressure over the sea stays relatively higher.",
  "GEO-CLI-001-CP002-Q002": "The Indian landmass heats faster than the surrounding ocean because land responds to solar heating more quickly than water. This faster warming helps create the summer pressure contrast.",
  "GEO-CLI-001-CP002-Q003": "Differential heating of land and sea creates the basic summer pressure contrast. Hotter land develops lower pressure relative to the surrounding ocean.",
  "GEO-CLI-001-CP002-Q004": "Strong summer heating warms and lifts the air over the landmass. This helps produce lower surface pressure over the heated land.",
  "GEO-CLI-001-CP002-Q005": "The match is correct because the land warms faster than the sea in summer. Faster land heating favours lower pressure over the landmass.",
  "GEO-CLI-001-CP002-Q006": "Both statements are correct. Land warms faster, while the surrounding seas warm more slowly and therefore remain at relatively higher pressure.",
  "GEO-CLI-001-CP002-Q007": "The major summer thermal low develops over north and northwestern India, where intense heating produces a strong low-pressure region.",
  "GEO-CLI-001-CP002-Q008": "Northwestern India develops low pressure during the hot-weather season because intense surface heating warms and lifts the air.",
  "GEO-CLI-001-CP002-Q009": "Air moves from relatively higher pressure over the Indian Ocean toward lower pressure over the heated subcontinent. This pressure gradient draws winds inland.",
  "GEO-CLI-001-CP002-Q010": "An onshore summer flow is favoured when pressure is higher over the ocean and lower over the land. Winds then move from sea toward the subcontinent.",
  "GEO-CLI-001-CP002-Q011": "A thermal low draws surrounding air toward it because air moves down the pressure gradient from higher pressure to lower pressure.",
  "GEO-CLI-001-CP002-Q012": "Strong summer heating lowers pressure over the subcontinent relative to the surrounding seas. This creates the pressure gradient that supports monsoon inflow.",
  "GEO-CLI-001-CP002-Q013": "The ITCZ is a low-pressure belt where trade winds converge. The converging air tends to rise, making the zone important for tropical rainfall and monsoon circulation.",
  "GEO-CLI-001-CP002-Q014": "In July, the ITCZ shifts northward to roughly 20°N–25°N over the Gangetic plain. This seasonal shift places the convergence zone over northern India.",
  "GEO-CLI-001-CP002-Q015": "When the ITCZ shifts north over the Gangetic plain in summer, it is called the monsoon trough.",
  "GEO-CLI-001-CP002-Q016": "The northward-shifted ITCZ creates a low-pressure trough over northern India. This helps draw moist monsoon air toward the subcontinent.",
  "GEO-CLI-001-CP002-Q017": "Trade winds meeting in the ITCZ converge and the air tends to rise. Rising moist air supports cloud formation and rainfall.",
  "GEO-CLI-001-CP002-Q018": "Both statements are correct: the ITCZ is a low-pressure convergence zone, and in July it shifts northward over the Indian region.",
  "GEO-CLI-001-CP002-Q019": "Southern Hemisphere southeast trade winds cross the Equator and feed the Indian summer monsoon. After crossing, their direction changes in the Northern Hemisphere.",
  "GEO-CLI-001-CP002-Q020": "The southeast trade winds feeding the summer monsoon cross the Equator chiefly between about 40°E and 60°E before moving toward India.",
  "GEO-CLI-001-CP002-Q021": "In summer, strong low pressure over the subcontinent helps draw Southern Hemisphere southeast trade winds across the Equator toward India.",
  "GEO-CLI-001-CP002-Q022": "After crossing the Equator, these winds move toward the Indian subcontinent because of the summer low-pressure system over the region.",
  "GEO-CLI-001-CP002-Q023": "The southwest monsoon is linked to southeast trade winds from the Southern Hemisphere that cross the Equator and are redirected toward India.",
  "GEO-CLI-001-CP002-Q024": "Both statements are correct. Southeast trade winds cross the Equator and then move toward the Indian low-pressure area as part of the summer monsoon circulation.",
  "GEO-CLI-001-CP002-Q025": "After crossing the Equator, the winds enter the Northern Hemisphere and are deflected to the right by the Coriolis force. They therefore approach India as southwesterlies.",
  "GEO-CLI-001-CP002-Q026": "The Coriolis force arises from Earth's rotation. It changes the apparent direction of moving air over the rotating Earth.",
  "GEO-CLI-001-CP002-Q027": "In the Northern Hemisphere, the Coriolis force deflects moving air to the right of its path.",
  "GEO-CLI-001-CP002-Q028": "After crossing the Equator, southeast trade winds are deflected in the Northern Hemisphere and become a southwesterly flow toward India.",
  "GEO-CLI-001-CP002-Q029": "The flow reaches India from the southwest after crossing the Equator and being deflected by the Coriolis force. That approach direction gives the southwest monsoon its name.",
  "GEO-CLI-001-CP002-Q030": "Both statements are correct. The flow crosses from the Southern Hemisphere, and Coriolis deflection helps turn it into a southwesterly wind over the Northern Hemisphere.",
  "GEO-CLI-001-CP002-Q031": "During summer, the pressure gradient carries monsoon winds from the Indian Ocean toward the Indian landmass.",
  "GEO-CLI-001-CP002-Q032": "Summer monsoon winds travel over warm ocean water before reaching India. This allows them to pick up large amounts of moisture.",
  "GEO-CLI-001-CP002-Q033": "The summer monsoon is driven by relatively higher pressure over the ocean and lower pressure over the heated land, producing an onshore pressure gradient.",
  "GEO-CLI-001-CP002-Q034": "Moist ocean-to-land flow toward a thermal low over northern India is characteristic of the summer monsoon season.",
  "GEO-CLI-001-CP002-Q035": "The pressure gradient draws air toward India, while the Coriolis force changes the direction of the cross-equatorial flow. Together they shape the summer monsoon path.",
  "GEO-CLI-001-CP002-Q036": "The summer monsoon is a moist onshore flow because winds move from the Indian Ocean toward the heated landmass and carry oceanic moisture inland.",
  "GEO-CLI-001-CP002-Q037": "During the cold-weather season, the northern Indian landmass cools and develops relatively high pressure compared with the surrounding seas.",
  "GEO-CLI-001-CP002-Q038": "In winter, prevailing surface winds over much of India generally blow from the northeast toward the south and southwest as air moves outward from the higher-pressure landmass.",
  "GEO-CLI-001-CP002-Q039": "The monsoon reverses in winter because the land-sea pressure pattern reverses. Cooler land develops higher pressure, so the prevailing flow turns from land toward sea.",
  "GEO-CLI-001-CP002-Q040": "As winter sets in, the ITCZ shifts southward away from the Gangetic plain. This accompanies the seasonal reversal of the monsoon circulation.",
  "GEO-CLI-001-CP002-Q041": "The winter monsoon is a northeasterly flow from land toward sea because continental pressure is relatively higher during the cold season.",
  "GEO-CLI-001-CP002-Q042": "Both statements are correct. Northern India develops relatively high pressure in winter, and the resulting surface flow is generally from land toward sea.",
  "GEO-CLI-001-CP002-Q043": "India's monsoon reverses seasonally: southwesterly winds dominate in summer, while northeasterly winds dominate in winter.",
  "GEO-CLI-001-CP002-Q044": "Seasonal heating and cooling reverse the land-sea pressure gradient between summer and winter. The prevailing monsoon winds reverse with that pressure change.",
  "GEO-CLI-001-CP002-Q045": "The summer sequence is strong land heating, development of low pressure over land, and movement of moist winds inland from the ocean.",
  "GEO-CLI-001-CP002-Q046": "The winter sequence is strong land cooling, development of relatively higher pressure over the continent, and outward flow toward the seas.",
  "GEO-CLI-001-CP002-Q047": "A switch from onshore summer winds to offshore winter winds is the defining seasonal reversal of a monsoon wind system.",
  "GEO-CLI-001-CP002-Q048": "Both statements are correct. Summer pressure conditions favour ocean-to-land flow, whereas winter conditions favour land-to-sea flow.",
  "GEO-CLI-001-CP002-Q049": "The southwest monsoon develops through a linked sequence: strong summer heating lowers pressure over northern India, cross-equatorial winds move toward that low, and Coriolis deflection turns the flow southwesterly.",
  "GEO-CLI-001-CP002-Q050": "All three statements are correct. The high-pressure area east of Madagascar influences the monsoon, intense heating of the Tibetan Plateau strengthens vertical circulation and low pressure aloft, and the ITCZ shifts northward in summer.",
  "GEO-CLI-001-CP002-Q051": "In summer, heated land develops relatively lower pressure and draws winds inland. In winter, cooler land develops relatively higher pressure and the prevailing flow reverses outward.",
  "GEO-CLI-001-CP002-Q052": "A high-pressure centre east of Madagascar near about 20°S over the Indian Ocean influences the Indian summer monsoon. Its position and intensity affect the monsoon circulation.",
  "GEO-CLI-001-CP002-Q053": "The wind first crosses the Equator toward India's summer low-pressure area and then is deflected by the Coriolis force in the Northern Hemisphere, so it reaches India from the southwest.",
  "GEO-CLI-001-CP002-Q054": "Intense summer heating of the Tibetan Plateau produces strong vertical air currents and low pressure over the plateau at high altitude. This forms part of the larger monsoon circulation setup."
});

const CONTENT_PATCHES_V5: Readonly<
  Record<string, Partial<Pick<GeoCli001Cp002Question, "options" | "canonicalAnswer" | "sourceFactIds">>>
> = Object.freeze({
  "GEO-CLI-001-CP002-Q013": {
    "options": [
      "A low-pressure zone where trade winds converge",
      "A high-pressure zone where subtropical winds descend",
      "A cold-current zone along the western Indian coast",
      "A winter-pressure belt over the northern plains"
    ]
  },
  "GEO-CLI-001-CP002-Q050": {
    "options": [
      "I and II only",
      "I, II and III",
      "II and III only",
      "I and III only"
    ],
    "sourceFactIds": [
      "geo-cli-001-cp002-018-core-mascarene-high",
      "geo-cli-001-cp002-018-core-tibetan-plateau",
      "geo-cli-001-cp002-018-core-itcz-shift"
    ]
  },
  "GEO-CLI-001-CP002-Q052": {
    "options": [
      "A low-pressure centre over the central Arabian Sea",
      "A winter high-pressure centre over northern India",
      "A low-pressure belt over the equatorial Pacific",
      "The high-pressure area east of Madagascar near 20°S"
    ],
    "canonicalAnswer": "The high-pressure area east of Madagascar near 20°S",
    "sourceFactIds": [
      "geo-cli-001-cp002-018-mascarene-high"
    ]
  },
  "GEO-CLI-001-CP002-Q053": {
    "options": [
      "Cross-equatorial movement toward low pressure and Coriolis deflection",
      "Southward ITCZ movement followed by polar-easterly deflection",
      "Winter land cooling followed by a northeast pressure gradient",
      "Ocean tides followed by a local sea-breeze circulation"
    ]
  },
  "GEO-CLI-001-CP002-Q054": {
    "options": [
      "Strong subsidence and persistent high pressure over the plateau",
      "Strong vertical air currents and low pressure over the plateau aloft",
      "A permanent cold-air inversion over the Gangetic plain",
      "A southward shift of the ITCZ during peak summer"
    ],
    "canonicalAnswer": "Strong vertical air currents and low pressure over the plateau aloft",
    "sourceFactIds": [
      "geo-cli-001-cp002-018-tibetan-plateau"
    ]
  }
});

export const GEO_CLI_001_CP002_REVIEW_BATCH_V5: readonly GeoCli001Cp002Question[] = Object.freeze(
  GEO_CLI_001_CP002_REVIEW_BATCH_V4.map((question) => {
    const contentPatch = CONTENT_PATCHES_V5[question.questionId] ?? {};
    return Object.freeze({
      ...question,
      ...contentPatch,
      stem: STEM_PATCHES_V5[question.questionId] ?? question.stem,
      explanation: EXPLANATION_PATCHES_V5[question.questionId] ?? question.explanation,
      reviewOnly: true as const,
      runtimeRegistered: false as const,
    });
  }),
);

const BANNED_LEARNER_TEXT =
  /sourceFact|review-only|runtimeRegistered|generator|qualification gate|truth authority|NCERT|population density|soil colour|more roads/i;
const BANNED_STEM_TEXT =
  /associated with|described as|in the context of|with reference to the above|what is a key feature|which is correct\?|which statement is correct\?|what broad effect can it have|which climate control best explains/i;
const BANNED_STYLE_TEXT = /\bbroad(?:ly)?\b|\bmainly\b/i;

export function auditGeoCli001Cp002ReviewBatchV5() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const stems = new Set<string>();
  const semantics = new Set<string>();
  const explanations = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoCli001Cp002Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];
  const hardAnswers = new Set<string>();
  let statementStemCount = 0;
  let mascareneCoverage = 0;
  let tibetanCoverage = 0;

  if (Object.keys(EXPLANATION_PATCHES_V5).length !== 54) {
    issues.push("EXPLANATION_PATCH_COUNT:" + Object.keys(EXPLANATION_PATCHES_V5).length);
  }

  for (const question of GEO_CLI_001_CP002_REVIEW_BATCH_V5) {
    if (!EXPLANATION_PATCHES_V5[question.questionId]) issues.push("MISSING_EXPLANATION_PATCH:" + question.questionId);
    if (ids.has(question.questionId)) issues.push("DUPLICATE_ID:" + question.questionId);
    ids.add(question.questionId);

    const normalizedStem = question.stem.replace(/\s+/g, " ").trim().toLowerCase();
    if (stems.has(normalizedStem)) issues.push("DUPLICATE_STEM:" + question.questionId);
    stems.add(normalizedStem);

    const semantic = normalizedStem + "::" + question.canonicalAnswer.toLowerCase();
    if (semantics.has(semantic)) issues.push("DUPLICATE_SEMANTIC:" + question.questionId);
    semantics.add(semantic);

    const normalizedExplanation = question.explanation.replace(/\s+/g, " ").trim().toLowerCase();
    if (explanations.has(normalizedExplanation)) issues.push("DUPLICATE_EXPLANATION:" + question.questionId);
    explanations.add(normalizedExplanation);

    qlCounts[question.qlId] = (qlCounts[question.qlId] ?? 0) + 1;
    difficultyCounts[question.difficulty] += 1;
    answerPositions[question.correctIndex] += 1;
    if (question.difficulty === "Hard") hardAnswers.add(question.canonicalAnswer);

    if (question.options.length !== 4 || new Set(question.options).size !== 4) issues.push("OPTIONS:" + question.questionId);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push("ANSWER:" + question.questionId);
    if (!question.sourceIds.length || !question.sourceFactIds.length) issues.push("PROVENANCE:" + question.questionId);
    if (!question.reviewOnly || question.runtimeRegistered) issues.push("LIFECYCLE:" + question.questionId);
    if (question.explanation.length < 55) issues.push("SHORT_EXPLANATION:" + question.questionId);
    if (question.stem.length < 28) issues.push("SHORT_STEM:" + question.questionId);
    if (question.stem.length > 360) issues.push("LONG_STEM:" + question.questionId);
    if (!question.stem.trim().endsWith("?")) issues.push("NON_QUESTION_STEM:" + question.questionId);
    if (BANNED_STEM_TEXT.test(question.stem)) issues.push("NON_EXAM_STEM:" + question.questionId);
    if (/^Consider these statements/i.test(question.stem)) statementStemCount += 1;

    const learnerText = question.stem + "\n" + question.options.join("\n") + "\n" + question.explanation;
    if (BANNED_LEARNER_TEXT.test(learnerText)) issues.push("LEARNER_TEXT:" + question.questionId);
    if (BANNED_STYLE_TEXT.test(learnerText)) issues.push("STYLE_TEXT:" + question.questionId);

    const answerPrefix = question.canonicalAnswer.trim().toLowerCase() + ".";
    if (normalizedExplanation.startsWith(answerPrefix)) issues.push("ANSWER_PREFIX_EXPLANATION:" + question.questionId);

    if (/Madagascar|Mascarene/i.test(learnerText)) mascareneCoverage += 1;
    if (/Tibetan Plateau/i.test(learnerText)) tibetanCoverage += 1;
  }

  if (GEO_CLI_001_CP002_REVIEW_BATCH_V5.length !== 54) issues.push("COUNT:" + GEO_CLI_001_CP002_REVIEW_BATCH_V5.length);
  if (stems.size !== 54) issues.push("STEM_COUNT:" + stems.size);
  if (semantics.size !== 54) issues.push("SEMANTIC_COUNT:" + semantics.size);
  if (explanations.size !== 54) issues.push("EXPLANATION_COUNT:" + explanations.size);
  if (statementStemCount > 10) issues.push("STATEMENT_STEM_OVERUSE:" + statementStemCount);
  if (mascareneCoverage < 2) issues.push("MASCARENE_COVERAGE:" + mascareneCoverage);
  if (tibetanCoverage < 2) issues.push("TIBETAN_COVERAGE:" + tibetanCoverage);

  for (let i = 10; i <= 18; i += 1) {
    const qlId = "GEO-CLI-001-QL-" + String(i).padStart(3, "0");
    if (qlCounts[qlId] !== 6) issues.push("QL_COUNT:" + qlId + ":" + (qlCounts[qlId] ?? 0));
  }

  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 6) {
    issues.push("DIFFICULTY:" + difficultyCounts.Easy + "/" + difficultyCounts.Medium + "/" + difficultyCounts.Hard);
  }
  if (answerPositions.join(",") !== "14,14,13,13") issues.push("ANSWER_POSITIONS:" + answerPositions.join(","));
  if (hardAnswers.size < 3) issues.push("HARD_ANSWER_VARIETY:" + hardAnswers.size);

  return {
    valid: issues.length === 0,
    issues,
    questionCount: GEO_CLI_001_CP002_REVIEW_BATCH_V5.length,
    stemCount: stems.size,
    semanticCount: semantics.size,
    explanationCount: explanations.size,
    qlCounts,
    difficultyCounts,
    answerPositions,
    hardAnswerVariety: hardAnswers.size,
    statementStemCount,
    mascareneCoverage,
    tibetanCoverage,
  };
}

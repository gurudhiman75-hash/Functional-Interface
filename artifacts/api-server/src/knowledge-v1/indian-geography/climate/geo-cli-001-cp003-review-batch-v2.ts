import {
  GEO_CLI_001_CP003_REVIEW_BATCH_V1,
  type GeoCli001Cp003Difficulty,
  type GeoCli001Cp003Question,
} from "./geo-cli-001-cp003-review-batch-v1";

const STEM_PATCHES: Readonly<Record<string, string>> = Object.freeze({
  "GEO-CLI-001-CP003-Q048": "Consider these statements about winter rain in India:\nI. Western disturbances can bring rain to the northern plains.\nII. Moist northeast winds can give rain to the Tamil Nadu coast.\nWhich statement(s) are correct?",
  "GEO-CLI-001-CP003-Q053": "Consider these statements:\nI. Northern India has relatively high winter pressure.\nII. Most winter winds blow from land to sea.\nIII. Peninsular coasts remain milder due to maritime influence.\nWhich statements are correct?",
});

const EXPLANATION_PATCHES: Readonly<Record<string, string>> = Object.freeze({
  "GEO-CLI-001-CP003-Q001": "Mid-November. In northern India, the cold weather season usually begins around mid-November as temperatures fall and the winter pressure pattern becomes established.",
  "GEO-CLI-001-CP003-Q002": "December and January. These are generally the coldest months over northern India, when temperatures reach their seasonal minimum before beginning to rise again.",
  "GEO-CLI-001-CP003-Q003": "February. The cold weather season over northern India broadly lasts from mid-November through February, after which temperatures rise toward the hot-weather season.",
  "GEO-CLI-001-CP003-Q004": "Northern India. Winter cooling is much stronger over the northern interior than over the southern coasts, where lower latitude and sea influence keep conditions milder.",
  "GEO-CLI-001-CP003-Q005": "Mid-November onset → December-January peak cold → February weakening. This sequence matches the normal progression of winter over northern India.",
  "GEO-CLI-001-CP003-Q006": "Both I and II. Winter usually sets in around mid-November in northern India, and December-January are generally the coldest months of the season.",

  "GEO-CLI-001-CP003-Q007": "It decreases from south to north. Winter temperatures are relatively high in southern India and become progressively lower toward the northern plains and Himalayan region.",
  "GEO-CLI-001-CP003-Q008": "Southern India lies at lower latitudes and has stronger maritime influence. Both factors reduce winter cooling compared with the more continental northern interior.",
  "GEO-CLI-001-CP003-Q009": "The northern plains. They lie farther north and have a stronger continental winter influence, so they are generally much cooler than India's southern coastal belt.",
  "GEO-CLI-001-CP003-Q010": "The north is much cooler, while the far south remains relatively warm. This broad contrast is a standard feature of India's winter temperature pattern.",
  "GEO-CLI-001-CP003-Q011": "The southern coastal city. Coastal southern India stays relatively warm in January because of lower latitude and the moderating effect of the surrounding sea.",
  "GEO-CLI-001-CP003-Q012": "Latitude. India's broad winter temperature gradient mainly follows its north-south position, with lower latitudes in the south receiving stronger winter solar heating.",

  "GEO-CLI-001-CP003-Q013": "Relatively high pressure. Winter cooling over northern India makes the near-surface air denser and supports a continental high-pressure area.",
  "GEO-CLI-001-CP003-Q014": "The land cools and the overlying air becomes denser. Cooler, denser air supports higher surface pressure over much of northern India during winter.",
  "GEO-CLI-001-CP003-Q015": "Higher pressure over land than over nearby seas. Air tends to move outward from the winter continental high toward relatively lower pressure over surrounding waters.",
  "GEO-CLI-001-CP003-Q016": "Cooler land — relatively higher surface pressure. Strong winter cooling over the continent helps produce higher pressure rather than the summer thermal low.",
  "GEO-CLI-001-CP003-Q017": "It strengthens a continental high-pressure area. Cooling increases air density near the surface, which is the basic reason winter pressure rises over northern India.",
  "GEO-CLI-001-CP003-Q018": "Both I and II. Winter land cooling raises surface pressure over northern India, and that pressure pattern favours winds flowing outward from the continent.",

  "GEO-CLI-001-CP003-Q019": "From the northeast toward the south and southwest. Much of India is dominated by northeasterly surface winds during the cold weather season.",
  "GEO-CLI-001-CP003-Q020": "They generally blow from land toward sea. Because these winds begin over the continent rather than crossing a long ocean path, they are dry over most of India.",
  "GEO-CLI-001-CP003-Q021": "Northeast trade winds. These winds dominate much of India in winter as the continental high-pressure pattern sends air outward from the land.",
  "GEO-CLI-001-CP003-Q022": "Northeasterly and mainly offshore. This is the normal winter flow over most of India, so the season is generally dry away from regional exceptions.",
  "GEO-CLI-001-CP003-Q023": "The generally dry weather over most of the country. A land-to-sea wind starts with little marine moisture, so widespread winter rain is uncommon.",
  "GEO-CLI-001-CP003-Q024": "Both I and II. Winter winds are generally northeasterly and, over most of India, move from land toward sea with limited moisture.",

  "GEO-CLI-001-CP003-Q025": "Low temperature, low humidity and clear skies. These are typical winter conditions over northern India when dry continental air dominates the circulation.",
  "GEO-CLI-001-CP003-Q026": "The prevailing continental winds are generally dry. Limited moisture reduces cloud formation, so clear skies are common during normal winter weather.",
  "GEO-CLI-001-CP003-Q027": "Persistently high humidity. Normal northern winter weather is usually cool and dry, with low humidity and generally clear skies except during disturbed spells.",
  "GEO-CLI-001-CP003-Q028": "Cold weather season. Clear skies, low humidity and light winds over the northern plains are a typical combination during India's winter season.",
  "GEO-CLI-001-CP003-Q029": "Low humidity. Dry continental winter winds carry little moisture over most of northern India, keeping humidity relatively low under normal conditions.",
  "GEO-CLI-001-CP003-Q030": "Cool and dry with generally clear skies. This combination best represents normal cold-weather conditions over the northern plains of India.",

  "GEO-CLI-001-CP003-Q031": "Northern and northwestern plains. Winter nights can become cold enough there for near-surface temperatures to reach freezing and produce frost.",
  "GEO-CLI-001-CP003-Q032": "Snow. At high Himalayan elevations, winter temperatures are low enough for precipitation to fall mainly as snow rather than rain.",
  "GEO-CLI-001-CP003-Q033": "Northern winter nights are much colder and continental influence is stronger. Southern coasts are moderated by the sea, making frost far less likely there.",
  "GEO-CLI-001-CP003-Q034": "Higher Himalayas — snowfall. High elevation and very low winter temperatures make snowfall a common form of cold-season precipitation in the higher Himalayas.",
  "GEO-CLI-001-CP003-Q035": "Frost. When the ground and near-surface air cool below freezing, water vapour can freeze on exposed surfaces and form frost.",
  "GEO-CLI-001-CP003-Q036": "Both I and II. Frost may occur over parts of the northern plains, while the higher Himalayas commonly receive snowfall during winter.",

  "GEO-CLI-001-CP003-Q037": "The surrounding seas moderate winter temperatures. Water cools more slowly than land, so coastal and peninsular areas do not experience the same sharp winter cold as the north.",
  "GEO-CLI-001-CP003-Q038": "Coastal peninsular India. Strong maritime influence reduces seasonal temperature extremes, so winter cooling is weaker than in the northern continental interior.",
  "GEO-CLI-001-CP003-Q039": "Maritime influence of the surrounding seas. The nearby sea changes temperature slowly and keeps coastal peninsular cities relatively mild in January.",
  "GEO-CLI-001-CP003-Q040": "Peninsular coasts remain milder than the northern interior. Lower latitude and nearby seas both reduce the intensity of winter cooling over coastal southern India.",
  "GEO-CLI-001-CP003-Q041": "Its low latitude and maritime setting keep temperatures relatively moderate. These two controls make the cold season less sharply defined over peninsular India.",
  "GEO-CLI-001-CP003-Q042": "Northern interior — larger fall in temperature; southern coast — milder conditions. Continental interiors cool more strongly, while the sea moderates coastal temperatures.",

  "GEO-CLI-001-CP003-Q043": "Cyclonic disturbances arriving from the west and northwest. These systems interrupt the normally dry winter weather and bring useful rain to parts of the northern plains.",
  "GEO-CLI-001-CP003-Q044": "Rabi crops. Winter rainfall over the northern plains supplies useful moisture to crops such as wheat that grow during the rabi season.",
  "GEO-CLI-001-CP003-Q045": "The Himalayan region. When western cyclonic disturbances affect northern India in winter, colder high elevations commonly receive snow while lower plains receive rain.",
  "GEO-CLI-001-CP003-Q046": "The winds cross the Bay of Bengal and pick up moisture before reaching the coast. This makes the Tamil Nadu coast an important exception to India's generally dry winter pattern.",
  "GEO-CLI-001-CP003-Q047": "The northern plains may receive rain from western cyclonic disturbances. Such spells are a major regional exception to the otherwise dry cold-weather season.",
  "GEO-CLI-001-CP003-Q048": "Both I and II. Western disturbances can bring winter rain to northern India, while northeast winds can collect Bay of Bengal moisture before reaching the Tamil Nadu coast.",

  "GEO-CLI-001-CP003-Q049": "High continental pressure, dry northeasterly flow and low humidity. These conditions fit the normal winter circulation and weather pattern over the northern plains.",
  "GEO-CLI-001-CP003-Q050": "Latitude and maritime influence. The northern interior is cooler because of its higher latitude and continental setting, while the southern coast is moderated by the sea.",
  "GEO-CLI-001-CP003-Q051": "Land cools → pressure rises over the continent → northeasterly winds blow outward. This sequence links winter cooling directly to India's cold-season surface circulation.",
  "GEO-CLI-001-CP003-Q052": "A western cyclonic disturbance interrupting the normally dry winter weather. Such systems can give rain to Punjab and snowfall in the western Himalayas.",
  "GEO-CLI-001-CP003-Q053": "I, II and III. Northern high pressure, mainly dry land-to-sea winter winds and maritime moderation of peninsular coasts are all standard cold-season features.",
  "GEO-CLI-001-CP003-Q054": "Dry offshore northeast winds dominate, but regional moisture pickup and western disturbances produce exceptions. This explains both the broad winter dryness and the main rainfall exceptions.",
});

export const GEO_CLI_001_CP003_REVIEW_BATCH_V2: readonly GeoCli001Cp003Question[] = Object.freeze(
  GEO_CLI_001_CP003_REVIEW_BATCH_V1.map((question) => Object.freeze({
    ...question,
    stem: STEM_PATCHES[question.questionId] ?? question.stem,
    explanation: EXPLANATION_PATCHES[question.questionId] ?? question.explanation,
    reviewOnly: true as const,
    runtimeRegistered: false as const,
  })),
);

const BANNED_LEARNER_TEXT = /sourceFact|review-only|runtimeRegistered|generator|qualification gate|truth authority|NCERT/i;
const BANNED_STEM_TEXT = /associated with|described as|in the context of|with reference to the above|what is a key feature|which is correct\?|which statement is correct\?|what broad effect can it have|which climate control best explains/i;

export function auditGeoCli001Cp003ReviewBatchV2() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const stems = new Set<string>();
  const semantics = new Set<string>();
  const explanations = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoCli001Cp003Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];
  const hardAnswers = new Set<string>();
  let statementStemCount = 0;

  if (Object.keys(EXPLANATION_PATCHES).length !== 54) issues.push(`EXPLANATION_PATCH_COUNT:${Object.keys(EXPLANATION_PATCHES).length}`);

  for (const question of GEO_CLI_001_CP003_REVIEW_BATCH_V2) {
    if (!EXPLANATION_PATCHES[question.questionId]) issues.push(`MISSING_EXPLANATION_PATCH:${question.questionId}`);
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
    if (/^Consider these statements/i.test(question.stem) || /^Which statement set/i.test(question.stem)) statementStemCount += 1;
    const learnerText = `${question.stem}\n${question.options.join("\n")}\n${question.explanation}`;
    if (BANNED_LEARNER_TEXT.test(learnerText)) issues.push(`LEARNER_TEXT:${question.questionId}`);
  }

  if (GEO_CLI_001_CP003_REVIEW_BATCH_V2.length !== 54) issues.push(`COUNT:${GEO_CLI_001_CP003_REVIEW_BATCH_V2.length}`);
  if (stems.size !== 54) issues.push(`STEM_COUNT:${stems.size}`);
  if (semantics.size !== 54) issues.push(`SEMANTIC_COUNT:${semantics.size}`);
  if (explanations.size !== 54) issues.push(`EXPLANATION_COUNT:${explanations.size}`);
  if (statementStemCount > 10) issues.push(`STATEMENT_STEM_OVERUSE:${statementStemCount}`);
  for (let i = 19; i <= 27; i += 1) {
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
    questionCount: GEO_CLI_001_CP003_REVIEW_BATCH_V2.length,
    stemCount: stems.size,
    semanticCount: semantics.size,
    explanationCount: explanations.size,
    qlCounts,
    difficultyCounts,
    answerPositions,
    hardAnswerVariety: hardAnswers.size,
    statementStemCount,
  };
}

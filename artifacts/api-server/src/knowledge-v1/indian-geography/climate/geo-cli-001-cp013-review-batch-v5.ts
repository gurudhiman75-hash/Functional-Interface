import {
  GEO_CLI_001_CP013_REVIEW_BATCH_V4,
  type GeoCli001Cp013Question,
  type GeoCli001Cp013Difficulty,
} from "./geo-cli-001-cp013-review-batch-v4";

const STEM_PATCHES: Readonly<Record<string, string>> = Object.freeze({
  "GEO-CLI-001-CP013-Q001": `India mainly experiences which type of climate?`,
  "GEO-CLI-001-CP013-Q002": `Which important latitude passes almost through the middle of India?`,
  "GEO-CLI-001-CP013-Q003": `How does temperature generally change with increase in altitude?`,
  "GEO-CLI-001-CP013-Q004": `Which location is likely to have the smallest annual range of temperature?`,
  "GEO-CLI-001-CP013-Q005": `Which mountain system shields northern India from very cold Central Asian winds?`,
  "GEO-CLI-001-CP013-Q006": `Which climatic control operates through warm and cold ocean currents?`,
  "GEO-CLI-001-CP013-Q007": `Wind normally moves from which pressure condition to which?`,
  "GEO-CLI-001-CP013-Q008": `What is rainfall produced when moist air is forced to rise over a mountain barrier called?`,
  "GEO-CLI-001-CP013-Q009": `A coastal hill station is cooler than a nearby plain and receives heavier windward rainfall. Which two controls explain this?`,
  "GEO-CLI-001-CP013-Q010": `Why does a strong land–sea pressure contrast develop over India in summer?`,
  "GEO-CLI-001-CP013-Q011": `During summer, India's main thermal low develops over which region?`,
  "GEO-CLI-001-CP013-Q012": `Which description best defines the Inter-Tropical Convergence Zone (ITCZ)?`,
  "GEO-CLI-001-CP013-Q013": `Which winds cross the Equator and contribute to India's southwest monsoon?`,
  "GEO-CLI-001-CP013-Q014": `Why do the cross-equatorial winds approach India as southwesterlies?`,
  "GEO-CLI-001-CP013-Q015": `During the summer monsoon, the main surface flow over India is in which direction?`,
  "GEO-CLI-001-CP013-Q016": `What pressure condition normally develops over northern India in winter?`,
  "GEO-CLI-001-CP013-Q017": `Which seasonal wind pattern correctly represents the Indian monsoon?`,
  "GEO-CLI-001-CP013-Q018": `Which sequence correctly explains the development of the southwest monsoon over India?`,
  "GEO-CLI-001-CP013-Q019": `In northern India, the cold weather season usually begins around which time?`,
  "GEO-CLI-001-CP013-Q020": `During winter, how does mean temperature generally vary from south to north in India?`,
  "GEO-CLI-001-CP013-Q021": `Why does high surface pressure develop over much of India in winter?`,
  "GEO-CLI-001-CP013-Q022": `During winter, surface winds over much of India generally blow in which direction?`,
  "GEO-CLI-001-CP013-Q023": `Which weather conditions are most typical of winter in northern India?`,
  "GEO-CLI-001-CP013-Q024": `Frost during the cold weather season is most common in which region of India?`,
  "GEO-CLI-001-CP013-Q025": `Why are winters comparatively mild over peninsular India?`,
  "GEO-CLI-001-CP013-Q026": `Which weather system brings important winter rainfall to northwestern India?`,
  "GEO-CLI-001-CP013-Q027": `Which combination best represents typical winter conditions over the northern plains?`,
  "GEO-CLI-001-CP013-Q028": `Which months mainly constitute the hot weather season in northern India?`,
  "GEO-CLI-001-CP013-Q029": `Why is summer heat generally less severe in southern India than in northern India?`,
  "GEO-CLI-001-CP013-Q030": `What happens to surface pressure over northern India as summer heating intensifies?`,
  "GEO-CLI-001-CP013-Q031": `What is the 'loo' experienced over northern India in summer?`,
  "GEO-CLI-001-CP013-Q032": `May dust storms are especially common in which parts of India?`,
  "GEO-CLI-001-CP013-Q033": `Pre-monsoon evening thunderstorms in Bengal and Assam are commonly known as what?`,
  "GEO-CLI-001-CP013-Q034": `What are the pre-monsoon showers of Kerala and coastal Karnataka called?`,
  "GEO-CLI-001-CP013-Q035": `What is common to mango showers and nor'westers?`,
  "GEO-CLI-001-CP013-Q036": `Which sequence correctly describes hot-weather conditions over northern India?`,
  "GEO-CLI-001-CP013-Q037": `Around which date does the southwest monsoon normally reach the Kerala coast?`,
  "GEO-CLI-001-CP013-Q038": `What is meant by the 'burst of the monsoon'?`,
  "GEO-CLI-001-CP013-Q039": `Which branch of the southwest monsoon strikes India's western coast directly?`,
  "GEO-CLI-001-CP013-Q040": `The Bay of Bengal branch is first strongly deflected by which hills before entering eastern India?`,
  "GEO-CLI-001-CP013-Q041": `Why does much of the Bay of Bengal branch move westward along the Ganga plains?`,
  "GEO-CLI-001-CP013-Q042": `What is meant by a 'break' in the southwest monsoon?`,
  "GEO-CLI-001-CP013-Q043": `Which route of the Arabian Sea branch produces heavy orographic rain on the Western Ghats?`,
  "GEO-CLI-001-CP013-Q044": `Where do the Arabian Sea and Bay of Bengal branches reinforce each other over northwestern India?`,
  "GEO-CLI-001-CP013-Q045": `Which sequence correctly shows the normal advance of the southwest monsoon over India?`,
  "GEO-CLI-001-CP013-Q046": `Which months mainly form the retreating monsoon season in India?`,
  "GEO-CLI-001-CP013-Q047": `What does the term 'October heat' refer to?`,
  "GEO-CLI-001-CP013-Q048": `After the southwest monsoon withdraws, which wind direction becomes dominant over much of India?`,
  "GEO-CLI-001-CP013-Q049": `Which region receives important rainfall from the retreating monsoon during October and November?`,
  "GEO-CLI-001-CP013-Q050": `Why can the northeast monsoon bring rain to the Tamil Nadu coast despite beginning as a dry continental wind?`,
  "GEO-CLI-001-CP013-Q051": `Which weather system often brings heavy rain during the retreating monsoon?`,
  "GEO-CLI-001-CP013-Q052": `Which river deltas are especially vulnerable to tropical cyclones during the retreating monsoon?`,
  "GEO-CLI-001-CP013-Q053": `Which pattern best describes regional weather during the retreating monsoon season?`,
  "GEO-CLI-001-CP013-Q054": `Which sequence correctly explains rainfall on India's southeast coast after the southwest monsoon withdraws?`,
  "GEO-CLI-001-CP013-Q055": `What is India's approximate average annual rainfall?`,
  "GEO-CLI-001-CP013-Q056": `Which region of India is known for receiving more than 200 cm of annual rainfall?`,
  "GEO-CLI-001-CP013-Q057": `In India's rainfall classification, which range represents low-rainfall areas?`,
  "GEO-CLI-001-CP013-Q058": `Rainfall variability measures which aspect of a region's rainfall?`,
  "GEO-CLI-001-CP013-Q059": `What level of annual rainfall is generally found where rainfall variability is below 25 per cent?`,
  "GEO-CLI-001-CP013-Q060": `Rainfall variability above 50 per cent is most prominent in which region?`,
  "GEO-CLI-001-CP013-Q061": `Over much of the rest of India, rainfall variability generally lies within which range?`,
  "GEO-CLI-001-CP013-Q062": `High rainfall variability creates which major risk for Indian agriculture?`,
  "GEO-CLI-001-CP013-Q063": `Consider the following statements about India's rainfall distribution:
I. India's average annual rainfall is about 125 cm.
II. High-rainfall areas receive more than 200 cm annually.
III. Inadequate-rainfall areas receive less than 50 cm annually.
Which of the statements given above are correct?`,
  "GEO-CLI-001-CP013-Q064": `Which factor produces orographic rainfall by forcing moisture-laden air to rise?`,
  "GEO-CLI-001-CP013-Q065": `Which side of the Western Ghats receives heavy rainfall from the Arabian Sea branch?`,
  "GEO-CLI-001-CP013-Q066": `What is the dry area on the leeward side of the Western Ghats called?`,
  "GEO-CLI-001-CP013-Q067": `Which river valleys help the Arabian Sea branch penetrate into central India?`,
  "GEO-CLI-001-CP013-Q068": `Which northwestern region receives scanty rainfall from the Arabian Sea branch?`,
  "GEO-CLI-001-CP013-Q069": `How does southwest-monsoon rainfall generally change from east to west across the northern plains?`,
  "GEO-CLI-001-CP013-Q070": `Which hills in northeast India receive exceptionally heavy rainfall from the Bay of Bengal branch?`,
  "GEO-CLI-001-CP013-Q071": `Why does the Tamil Nadu coast receive comparatively little rain from the southwest monsoon?`,
  "GEO-CLI-001-CP013-Q072": `Which pair best represents a windward–leeward rainfall contrast in India?`,
  "GEO-CLI-001-CP013-Q073": `Western disturbances affecting India generally originate near which region?`,
  "GEO-CLI-001-CP013-Q074": `Western disturbances bring most of their winter rainfall to which part of India?`,
  "GEO-CLI-001-CP013-Q075": `What form of winter precipitation do western disturbances often produce in the higher Himalayas?`,
  "GEO-CLI-001-CP013-Q076": `Why are western disturbances closely linked with the westerly jet stream?`,
  "GEO-CLI-001-CP013-Q077": `Which upper-air change marks the transition from winter circulation to the summer monsoon pattern?`,
  "GEO-CLI-001-CP013-Q078": `The tropical easterly jet becomes established over India after which upper-air change?`,
  "GEO-CLI-001-CP013-Q079": `Which atmospheric variable is compared between Tahiti and Darwin in the Southern Oscillation?`,
  "GEO-CLI-001-CP013-Q080": `ENSO combines changes in which two parts of the climate system?`,
  "GEO-CLI-001-CP013-Q081": `Which option correctly matches each phenomenon with its climatic role in India?`,
  "GEO-CLI-001-CP013-Q082": `Why is rainfall in western Rajasthan considered less dependable than in wetter regions of India?`,
  "GEO-CLI-001-CP013-Q083": `Which of the following region–climate pairs is correctly matched?`,
  "GEO-CLI-001-CP013-Q084": `October and November are particularly rainy for which region of India?`,
  "GEO-CLI-001-CP013-Q085": `Why do the southern slopes of the Khasi Hills receive exceptionally heavy rainfall?`,
  "GEO-CLI-001-CP013-Q086": `Which condition best describes winter weather in Punjab and Haryana?`,
  "GEO-CLI-001-CP013-Q087": `Which region is a typical rain-shadow area east of the Western Ghats?`,
  "GEO-CLI-001-CP013-Q088": `Why does rainfall generally decrease westward across the Ganga plain?`,
  "GEO-CLI-001-CP013-Q089": `Apart from creating high-altitude cold conditions, how do the Himalayas influence India's winter climate?`,
  "GEO-CLI-001-CP013-Q090": `Which option contains only correctly matched region–climate associations?`,
  "GEO-CLI-001-CP013-Q091": `How do surface pressure conditions over northern India differ between winter and the hot weather season?`,
  "GEO-CLI-001-CP013-Q092": `Why is the low-pressure area over northwestern India important before the southwest monsoon sets in?`,
  "GEO-CLI-001-CP013-Q093": `Consider the following statements about the southwest and retreating monsoons:
I. June to September is the main rainy season for most of India.
II. October and November are important rainy months for Tamil Nadu.
III. Both phases have the same prevailing wind direction.
Which of the statements given above are correct?`,
  "GEO-CLI-001-CP013-Q094": `Consider the following statements about cool-season rainfall in India:
I. Western disturbances bring rainfall to northwestern India.
II. Tamil Nadu receives important rainfall during October and November.
III. The same weather system causes both rainfall patterns.
Which of the statements given above are correct?`,
  "GEO-CLI-001-CP013-Q095": `Which pair correctly represents maritime and continental climate in India?`,
  "GEO-CLI-001-CP013-Q096": `Which statement correctly distinguishes the climatic effects of latitude and altitude?`,
  "GEO-CLI-001-CP013-Q097": `Which statement correctly distinguishes the climatic effects of relief and distance from the sea?`,
  "GEO-CLI-001-CP013-Q098": `Consider the following statements about seasonal pressure and winds over India:
I. Summer heating lowers pressure over northwestern India.
II. Winter pressure is relatively higher over northern India.
III. Prevailing surface winds keep the same direction in both seasons.
Which of the statements given above are correct?`,
  "GEO-CLI-001-CP013-Q099": `Consider the following statements about India's climate controls:
I. Sea influence reduces temperature extremes near the coast.
II. Relief creates windward and leeward rainfall contrasts.
III. Seasonal pressure changes help reverse monsoon winds.
Which of the statements given above are correct?`,
  "GEO-CLI-001-CP013-Q100": `Which climate control is correctly matched with its effect in India?`,
  "GEO-CLI-001-CP013-Q101": `A place is very hot in May, receives heavy rain with monsoon onset in June, and becomes drier by October. Which seasonal sequence does this show?`,
  "GEO-CLI-001-CP013-Q102": `Which combination of conditions most directly supports the onset of the southwest monsoon over India?`,
  "GEO-CLI-001-CP013-Q103": `Which region receives heavy monsoon rainfall because moist winds are forced to rise along the Western Ghats?`,
  "GEO-CLI-001-CP013-Q104": `Which weather system is correctly matched with its main climatic effect in India?`,
  "GEO-CLI-001-CP013-Q105": `Which option correctly matches the regions with their characteristic climate features?`,
  "GEO-CLI-001-CP013-Q106": `Which cause–effect pair correctly explains an Indian climatic pattern?`,
  "GEO-CLI-001-CP013-Q107": `Consider the following statements about winter in India:
I. Western disturbances can bring rain to the northwestern plains.
II. The higher Himalayas can receive snowfall.
III. Loo winds are a typical winter feature.
Which of the statements given above are correct?`,
  "GEO-CLI-001-CP013-Q108": `Consider the following statements about India's climate:
I. Seasonal pressure reversal has no role in monsoon winds.
II. Relief redistributes rainfall.
III. Sea influence reduces temperature extremes near the coast.
Which of the statements given above are correct?`,
});

export const GEO_CLI_001_CP013_REVIEW_BATCH_V5: readonly GeoCli001Cp013Question[] = Object.freeze(
  GEO_CLI_001_CP013_REVIEW_BATCH_V4.map((question) => Object.freeze({
    ...question,
    stem: STEM_PATCHES[question.questionId] ?? question.stem,
    reviewOnly: true as const,
    runtimeRegistered: false as const,
  })),
);

const BANNED_LEARNER_TEXT = /sourceFact|review-only|runtimeRegistered|generator|qualification gate|truth authority|\bNCERT\b|\bIMD\b|\bbroad(?:ly)?\b|\bassociated with\b/i;
const WEAK_STEM_OPENERS = /^(?:compare\b|for\s+(?:cool-season rain|india[’']s? winter climate|a climate summary)\b)/i;

export function auditGeoCli001Cp013ReviewBatchV5() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const sourceQuestionIds = new Set<string>();
  const stems = new Set<string>();
  const semantics = new Set<string>();
  const explanations = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoCli001Cp013Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];

  for (let index = 0; index < GEO_CLI_001_CP013_REVIEW_BATCH_V5.length; index += 1) {
    const question = GEO_CLI_001_CP013_REVIEW_BATCH_V5[index];
    const prior = GEO_CLI_001_CP013_REVIEW_BATCH_V4[index];
    if (ids.has(question.questionId)) issues.push(`DUPLICATE_ID:${question.questionId}`);
    ids.add(question.questionId);
    if (sourceQuestionIds.has(question.sourceQuestionId)) issues.push(`DUPLICATE_SOURCE:${question.sourceQuestionId}`);
    sourceQuestionIds.add(question.sourceQuestionId);
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
    if (question.options.length !== 4 || new Set(question.options).size !== 4) issues.push(`OPTIONS:${question.questionId}`);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`ANSWER:${question.questionId}`);
    if (!question.sourceIds.length || !question.sourceFactIds.length) issues.push(`PROVENANCE:${question.questionId}`);
    if (!question.reviewOnly || question.runtimeRegistered) issues.push(`LIFECYCLE:${question.questionId}`);
    if (question.stem.length < 20 || question.stem.length > 360 || !question.stem.trim().endsWith("?")) issues.push(`STEM_SHAPE:${question.questionId}`);
    if (WEAK_STEM_OPENERS.test(question.stem.trim())) issues.push(`WEAK_STEM_OPENER:${question.questionId}`);
    if (question.explanation.length < 45) issues.push(`SHORT_EXPLANATION:${question.questionId}`);
    const learnerText = `${question.stem}\n${question.options.join("\n")}\n${question.explanation}`;
    if (BANNED_LEARNER_TEXT.test(learnerText)) issues.push(`LEARNER_TEXT:${question.questionId}`);
    if (question.stem === prior.stem) issues.push(`UNREVISED_STEM:${question.questionId}`);
    if (
      question.qlId !== prior.qlId ||
      question.difficulty !== prior.difficulty ||
      question.correctIndex !== prior.correctIndex ||
      question.canonicalAnswer !== prior.canonicalAnswer ||
      question.explanation !== prior.explanation ||
      JSON.stringify(question.options) !== JSON.stringify(prior.options) ||
      JSON.stringify(question.sourceIds) !== JSON.stringify(prior.sourceIds) ||
      JSON.stringify(question.sourceFactIds) !== JSON.stringify(prior.sourceFactIds)
    ) issues.push(`NON_STEM_DRIFT:${question.questionId}`);
  }

  if (GEO_CLI_001_CP013_REVIEW_BATCH_V5.length !== 108) issues.push(`COUNT:${GEO_CLI_001_CP013_REVIEW_BATCH_V5.length}`);
  if (Object.keys(STEM_PATCHES).length !== 108) issues.push(`STEM_PATCH_COUNT:${Object.keys(STEM_PATCHES).length}`);
  for (let n = 1; n <= 108; n += 1) {
    const qlId = `GEO-CLI-001-QL-${String(n).padStart(3, "0")}`;
    if (qlCounts[qlId] !== 1) issues.push(`QL_COUNT:${qlId}:${qlCounts[qlId] ?? 0}`);
  }
  if (difficultyCounts.Easy !== 36 || difficultyCounts.Medium !== 60 || difficultyCounts.Hard !== 12) issues.push(`DIFFICULTY:${JSON.stringify(difficultyCounts)}`);
  if (answerPositions.join(",") !== "27,27,27,27") issues.push(`ANSWER_POSITIONS:${answerPositions.join(",")}`);
  if (stems.size !== 108) issues.push(`STEM_COUNT:${stems.size}`);
  if (semantics.size !== 108) issues.push(`SEMANTIC_COUNT:${semantics.size}`);
  if (explanations.size !== 108) issues.push(`EXPLANATION_COUNT:${explanations.size}`);

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: GEO_CLI_001_CP013_REVIEW_BATCH_V5.length,
    qlCount: Object.keys(qlCounts).length,
    qlCounts: Object.freeze(qlCounts),
    difficultyCounts: Object.freeze(difficultyCounts),
    answerPositions: Object.freeze(answerPositions),
    stemCount: stems.size,
    semanticCount: semantics.size,
    explanationCount: explanations.size,
    stemPatchCount: Object.keys(STEM_PATCHES).length,
  });
}

export type GeoCli001Cp010Difficulty = "Easy" | "Medium" | "Hard";

export interface GeoCli001Cp010Question {
  questionId: string;
  qlId: string;
  qlName: string;
  difficulty: GeoCli001Cp010Difficulty;
  stem: string;
  options: readonly string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
  reviewOnly: true;
  runtimeRegistered: false;
}

const SOURCE_IDS = Object.freeze(["NCERT-INDIA-PHYSICAL-ENVIRONMENT-CLIMATE", "NCERT-CONTEMPORARY-INDIA-I-CLIMATE"]);
const QL_NAMES: Record<number, string> = Object.freeze({
  82: "Western Rajasthan climate association",
  83: "Kerala and west-coast monsoon association",
  84: "Tamil Nadu and Coromandel coast association",
  85: "Meghalaya and northeast rainfall association",
  86: "Punjab-Haryana and northwestern winter climate",
  87: "Interior Deccan rain-shadow association",
  88: "Northern plains east-west rainfall gradient",
  89: "Himalayan climate and altitude association",
  90: "Integrated state-region climate associations",
});

type Raw = readonly [number, GeoCli001Cp010Difficulty, string, string, string, string, string, string, readonly string[]];

const RAW: readonly Raw[] = Object.freeze([
  [82, "Easy", "Which climatic feature is most typical of western Rajasthan?", "Very low annual rainfall", "Heavy rainfall through most of the year", "Regular winter rain from tropical cyclones", "A small annual temperature range", "Western Rajasthan lies in India's arid belt, so annual rainfall is very low and much of the region has desert conditions.", ["WR-ARID-LOW-RAIN"]],
  [82, "Easy", "Western Rajasthan is mainly placed in which broad rainfall category?", "Inadequate rainfall below about 50 cm", "High rainfall above 200 cm", "Medium rainfall of 100–200 cm", "Humid rainfall above 300 cm", "Large parts of western Rajasthan receive less than about 50 cm of rain annually, placing them in the inadequate-rainfall belt.", ["WR-INADEQUATE-RAIN"]],
  [82, "Medium", "Why is rainfall in western Rajasthan considered less dependable than in wetter parts of India?", "Its rainfall is low and highly variable", "It receives rain equally in all months", "It lies directly in the path of both monsoon branches", "It is surrounded by high coastal mountains", "Dry parts of western Rajasthan combine low rainfall with high year-to-year variability, making water availability less dependable.", ["WR-HIGH-VARIABILITY", "WR-LOW-RAIN"]],
  [82, "Medium", "Which combination best matches the climate of western Rajasthan?", "Low rainfall and high rainfall variability", "High rainfall and low variability", "Winter-dominant coastal rainfall and low variability", "Heavy orographic rainfall and a short dry season", "Western Rajasthan is among India's driest areas and also shows high relative variability in annual rainfall.", ["WR-HIGH-VARIABILITY", "WR-LOW-RAIN"]],
  [82, "Medium", "The southwest monsoon gives only scanty rain in much of western Rajasthan mainly because which feature limits uplift?", "The Aravalli range runs roughly parallel to the Arabian Sea branch", "The Himalayas block all summer winds from the west", "The Western Ghats lie east of Rajasthan", "The Bay of Bengal branch never reaches northern India", "The Arabian Sea branch crosses Rajasthan with limited uplift because the Aravallis run broadly parallel to its path, so rainfall stays scanty.", ["WR-ARAVALLI-PARALLEL"]],
  [82, "Hard", "For western Rajasthan, which statements are correct?\nI. Annual rainfall is very low.\nII. Rainfall variability is high.\nIII. The Aravallis strongly uplift the Arabian Sea branch?", "I and II only", "I only", "II and III only", "I, II and III", "Western Rajasthan is dry and highly variable, but the Aravallis do not strongly block and uplift the Arabian Sea branch because their alignment is broadly parallel to it.", ["WR-LOW-RAIN", "WR-HIGH-VARIABILITY", "WR-ARAVALLI-PARALLEL"]],
  [83, "Easy", "Which region normally receives the earliest onset of the southwest monsoon in mainland India?", "Kerala", "Punjab", "Western Rajasthan", "Tamil Nadu interior", "The southwest monsoon normally reaches the Kerala coast first on the Indian mainland before advancing northward.", ["KERALA-MONSOON-ONSET"]],
  [83, "Easy", "Why does the Kerala coast receive heavy rain from the Arabian Sea branch?", "Moist winds are forced to rise along the Western Ghats", "Cold continental winds descend over the coast", "The Aravallis block the monsoon directly", "Winter western disturbances remain there all year", "Moist southwest monsoon winds strike the Western Ghats near the west coast and rise, producing heavy orographic rainfall.", ["WEST-COAST-OROGRAPHIC-RAIN"]],
  [83, "Medium", "Which pair is correctly matched?", "Kerala coast — early southwest monsoon arrival", "Punjab — northeast monsoon onset", "Western Rajasthan — heaviest orographic rain", "Tamil Nadu coast — first Arabian Sea monsoon landfall", "Kerala is the normal first mainland region reached by the southwest monsoon, so the state is closely linked with monsoon onset.", ["KERALA-MONSOON-ONSET"]],
  [83, "Medium", "A coastal station west of the Western Ghats receives very heavy summer rain. Which location best fits this pattern?", "Kerala", "Western Rajasthan", "Haryana", "Ladakh", "Kerala lies on the windward side of the Western Ghats, where moisture-laden Arabian Sea winds rise and give heavy monsoon rain.", ["WEST-COAST-OROGRAPHIC-RAIN"]],
  [83, "Medium", "Compared with interior northwestern India, coastal Kerala generally has which temperature pattern?", "A smaller annual temperature range", "A much larger annual temperature range", "Severe winter cold caused by continentality", "Large day-night extremes throughout the year", "The nearby sea moderates temperatures along coastal Kerala, so annual temperature variation is smaller than in far inland regions.", ["KERALA-MARITIME-EFFECT"]],
  [83, "Hard", "For Kerala, which statements are correct?\nI. Southwest monsoon reaches it early.\nII. Western Ghats enhance windward rain.\nIII. The sea moderates annual temperature range?", "I, II and III", "I and II only", "II and III only", "I and III only", "Kerala combines early southwest monsoon arrival, strong windward rainfall along the Western Ghats and a maritime influence that moderates temperature.", ["KERALA-MONSOON-ONSET", "WEST-COAST-OROGRAPHIC-RAIN", "KERALA-MARITIME-EFFECT"]],
  [84, "Easy", "Which Indian coast receives a large share of its annual rain during the retreating monsoon season?", "Tamil Nadu coast", "Konkan coast", "Kutch coast", "Punjab plain", "The Tamil Nadu coast receives much of its important rainfall in October and November during the retreating or northeast monsoon period.", ["TN-RETREATING-MONSOON-RAIN"]],
  [84, "Easy", "Why is the Tamil Nadu coast relatively dry during much of the southwest monsoon season?", "It lies in the rain shadow of the Arabian Sea branch and parallel to the Bay branch", "It is blocked from all seas by the Himalayas", "It receives only western-disturbance rain", "It lies on the windward side of the Western Ghats", "Tamil Nadu gets less southwest-monsoon rain because it lies in the rain shadow of the Arabian Sea branch and the Bay branch flows roughly parallel to its coast.", ["TN-SW-MONSOON-DRY"]],
  [84, "Medium", "October and November are especially rainy months for which region?", "The Tamil Nadu and Coromandel coast", "Western Rajasthan", "Punjab and Haryana", "The Ladakh plateau", "The retreating monsoon brings important rain to the southeastern coast, making October and November especially wet for Tamil Nadu.", ["TN-OCT-NOV-RAIN"]],
  [84, "Medium", "Which weather systems contribute substantially to retreating-monsoon rainfall on the Tamil Nadu coast?", "Depressions and cyclones from the Bay of Bengal region", "Western disturbances from the Mediterranean", "Loo winds from northwestern India", "Local dust storms from the Thar Desert", "Cyclonic depressions forming over the Bay and nearby seas often cross the southeastern coast and provide a large share of Tamil Nadu's seasonal rain.", ["TN-CYCLONIC-RAIN"]],
  [84, "Medium", "Which comparison between Kerala and Tamil Nadu is correct?", "Kerala gets strong southwest-monsoon rain, while Tamil Nadu gains much more from the retreating monsoon", "Both receive most rain only from western disturbances", "Tamil Nadu gets the earliest Arabian Sea monsoon onset", "Kerala remains dry during the southwest monsoon", "Kerala is strongly exposed to the Arabian Sea branch in summer, whereas Tamil Nadu receives a much larger share of rain during the retreating monsoon.", ["KERALA-WET-SW", "TN-RETREATING-MONSOON-RAIN"]],
  [84, "Hard", "For the Tamil Nadu coast, which statements are correct?\nI. Southwest-monsoon rain is limited.\nII. October–November is rainy.\nIII. Bay cyclonic systems can add heavy rain?", "I, II and III", "I and II only", "II and III only", "I and III only", "All three statements describe Tamil Nadu's seasonal pattern: limited southwest-monsoon rain, important retreating-monsoon rainfall and frequent contribution from Bay cyclonic systems.", ["TN-SW-MONSOON-DRY", "TN-OCT-NOV-RAIN", "TN-CYCLONIC-RAIN"]],
  [85, "Easy", "Which state contains the Khasi Hills, where very heavy monsoon rainfall is common?", "Meghalaya", "Rajasthan", "Haryana", "Gujarat", "The Khasi Hills are in Meghalaya, a northeastern state famous for very heavy rainfall caused by uplift of moisture-laden monsoon winds.", ["MEGHALAYA-KHASI-HILLS"]],
  [85, "Easy", "Mawsynram, noted for exceptionally high average annual rainfall, is in which state?", "Meghalaya", "Punjab", "Tamil Nadu", "Maharashtra", "Mawsynram lies on the Khasi Hills in Meghalaya, where local relief strongly enhances rainfall from the Bay of Bengal branch.", ["MAWSYNRAM-MEGHALAYA"]],
  [85, "Medium", "Why do the southern slopes of the Khasi Hills receive exceptionally heavy rain?", "Moist Bay of Bengal winds are forced to rise against the hills", "Dry desert winds descend from the Aravallis", "The area lies behind the Western Ghats", "Winter westerlies remain stationary over the hills", "Moist monsoon winds entering the northeast are lifted sharply against the Khasi Hills, causing intense orographic rainfall on exposed slopes.", ["MEGHALAYA-OROGRAPHIC-UPLIFT"]],
  [85, "Medium", "Which climate association best identifies Meghalaya?", "Very heavy monsoon rain linked with relief", "Very low rainfall and high aridity", "Winter rain mainly from western disturbances", "Dry summers caused by the Arabian Sea rain shadow", "Meghalaya's climate is strongly linked with very heavy monsoon rainfall produced when moisture-bearing winds are lifted by its hill relief.", ["MEGHALAYA-OROGRAPHIC-UPLIFT"]],
  [85, "Medium", "A question mentions the Garo, Khasi and Jaintia Hills. Which rainfall pattern should you expect?", "High rainfall in exposed monsoon-facing areas", "Inadequate rainfall below 50 cm throughout", "Rain mainly from winter western disturbances", "Little effect of relief on rainfall", "The Garo, Khasi and Jaintia Hills lie in Meghalaya, where monsoon-facing slopes receive high rainfall because of strong relief uplift.", ["MEGHALAYA-HILLS-HIGH-RAIN"]],
  [85, "Hard", "For Meghalaya, which statements are correct?\nI. Khasi Hills intercept moist monsoon winds.\nII. Mawsynram lies in this wet region.\nIII. Relief uplift helps produce heavy rain?", "I, II and III", "I and II only", "II and III only", "I and III only", "Meghalaya's extreme rainfall is closely tied to the Khasi Hills, including Mawsynram, where moist monsoon air is forced upward by relief.", ["MEGHALAYA-KHASI-HILLS", "MAWSYNRAM-MEGHALAYA", "MEGHALAYA-OROGRAPHIC-UPLIFT"]],
  [86, "Easy", "Which weather system commonly brings useful winter rain to Punjab and Haryana?", "Western disturbances", "The northeast monsoon", "Mango showers", "The Arabian Sea branch in January", "Punjab and Haryana receive occasional winter rainfall from western disturbances moving into northwestern India from the west.", ["NW-WESTERN-DISTURBANCE-RAIN"]],
  [86, "Easy", "Winter rain in Punjab and Haryana is especially useful for which crop season?", "Rabi season", "Kharif season only", "Plantation crops only", "Zaid season only", "Light winter rain from western disturbances provides useful soil moisture for rabi crops, including wheat, in northwestern India.", ["NW-RABI-BENEFIT"]],
  [86, "Medium", "Which combination best matches Punjab and Haryana in winter?", "Cool dry weather interrupted by western-disturbance rain", "Persistent northeast-monsoon rain", "Daily heavy orographic rain", "Hot humid weather with tropical cyclones", "Winter in the northwestern plains is generally cool and dry, but western disturbances occasionally bring cloud, rain and colder conditions.", ["NW-WINTER-PATTERN"]],
  [86, "Medium", "Why can Punjab receive winter rainfall even though the northeast monsoon mainly affects southeastern India?", "Western disturbances provide a separate winter rain source", "The Bay branch remains active there all winter", "Sea breezes cross the Himalayas", "The Western Ghats redirect coastal rain northward", "Punjab's winter rain comes mainly from western disturbances, a different weather system from the northeast monsoon of the southeast coast.", ["NW-WESTERN-DISTURBANCE-RAIN"]],
  [86, "Medium", "Which hot, dry summer wind commonly blows over the northwestern plains, including Punjab and Haryana?", "The loo", "Mango showers", "Nor'westers only", "Sea breeze", "The loo is a hot, dry summer wind of the northern and northwestern plains and is commonly experienced across this region before the monsoon.", ["NW-LOO"]],
  [86, "Hard", "For Punjab and Haryana, which statements are correct?\nI. Western disturbances can bring winter rain.\nII. This rain supports rabi crops.\nIII. Hot, dry loo winds may blow before the monsoon?", "I, II and III", "I and II only", "II and III only", "I and III only", "The region links two different seasonal features: useful winter rain from western disturbances and hot dry loo winds during the pre-monsoon summer.", ["NW-WESTERN-DISTURBANCE-RAIN", "NW-RABI-BENEFIT", "NW-LOO"]],
  [87, "Easy", "Why do parts of the interior Deccan receive less southwest-monsoon rain than the west coast?", "They lie in the rain shadow of the Western Ghats", "They are north of the Himalayas", "They face the Bay branch directly from the east all year", "They receive only winter snow", "The Western Ghats force moist Arabian Sea winds to shed much of their rain on the western slopes, leaving the leeward interior drier.", ["DECCAN-RAIN-SHADOW"]],
  [87, "Easy", "Which side of the Western Ghats contains major rain-shadow areas?", "The eastern leeward side", "The western windward side", "The open Arabian Sea", "The Himalayan side", "After crossing the Western Ghats, air descends on the eastern side and becomes drier, creating a broad rain-shadow zone in the interior Deccan.", ["DECCAN-LEEWARD"]],
  [87, "Medium", "Which region best represents a rain-shadow climate behind the Western Ghats?", "Interior Maharashtra and parts of Karnataka", "The windward Konkan coast", "The Khasi Hills", "The Ganga delta", "Interior Maharashtra and parts of Karnataka lie east of the Western Ghats, where descending leeward air gives less rainfall than the west coast.", ["DECCAN-RAIN-SHADOW"]],
  [87, "Medium", "A station east of the Western Ghats receives much less rain than a nearby west-coast station. What best explains the contrast?", "Windward-leeward relief effect", "Difference in latitude alone", "Winter western disturbances only", "Distance from the Himalayas only", "The Western Ghats create a sharp windward-leeward contrast: air rises and rains on the west, then descends drier over the interior plateau.", ["DECCAN-WINDWARD-LEEWARD"]],
  [87, "Medium", "Which comparison is correct for the southwest monsoon?", "West-coast slopes are wetter than much of the interior Deccan", "Interior Deccan is always wetter than the coast", "Both sides receive identical rainfall", "The Western Ghats reduce rainfall on their western slopes", "The windward west-coast slopes receive heavy orographic rain, while the leeward interior Deccan receives substantially less.", ["DECCAN-WINDWARD-LEEWARD"]],
  [87, "Hard", "For the interior Deccan, which statements are correct?\nI. Parts lie leeward of the Western Ghats.\nII. Descending air reduces rainfall.\nIII. West-coast windward slopes are wetter?", "I, II and III", "I and II only", "II and III only", "I and III only", "The interior Deccan is a classic rain-shadow region: the Western Ghats take heavy windward rain, while descending leeward air produces drier conditions inland.", ["DECCAN-RAIN-SHADOW", "DECCAN-WINDWARD-LEEWARD"]],
  [88, "Easy", "Along the northern plains, summer monsoon rainfall generally decreases in which direction?", "From east to west", "From west to east", "From north to south only", "It remains uniform", "The Bay of Bengal branch loses moisture as it moves westward along the Ganga plains, so monsoon rainfall generally decreases from east to west.", ["PLAINS-EAST-WEST-GRADIENT"]],
  [88, "Easy", "Which part of the northern plains generally receives more monsoon rain?", "The eastern part", "The far western part", "All parts receive exactly the same amount", "Only the central desert belt", "Eastern sections of the northern plains are reached earlier by moisture-rich Bay of Bengal winds and generally receive more rain than western sections.", ["PLAINS-EAST-WETTER"]],
  [88, "Medium", "Why does rainfall decrease westward across much of the Ganga plain?", "The Bay of Bengal branch loses moisture as it travels inland", "The Himalayas disappear toward the west", "The Arabian Sea becomes colder each day", "The Coromandel coast blocks the winds", "As the Bay of Bengal branch moves farther inland toward the west, it progressively loses moisture through rainfall, creating an east-to-west decline.", ["PLAINS-MOISTURE-LOSS-WESTWARD"]],
  [88, "Medium", "Which comparison best fits the monsoon rainfall gradient of the northern plains?", "Bihar is generally wetter than western Uttar Pradesh", "Western Uttar Pradesh is always wetter than Bihar", "Punjab is wetter than all of eastern India", "Rainfall is identical from Bengal to Punjab", "The broad east-to-west decrease means eastern areas such as Bihar generally receive more monsoon rain than western Uttar Pradesh.", ["PLAINS-EAST-WEST-GRADIENT"]],
  [88, "Medium", "A monsoon branch moves from Bengal toward Punjab along the plains. What trend is most likely?", "Its rainfall contribution generally weakens westward", "Its moisture continuously increases westward", "It changes into the northeast monsoon", "It produces equal rain at every point", "The Bay of Bengal branch progressively loses moisture while moving westward, so its rainfall contribution generally becomes smaller.", ["PLAINS-MOISTURE-LOSS-WESTWARD"]],
  [88, "Medium", "Which state pair follows the broad east-to-west decrease in northern-plain rainfall?", "Bihar wetter than Haryana", "Haryana wetter than Bihar", "Rajasthan wetter than Assam", "Punjab wetter than West Bengal", "Bihar lies farther east and generally receives more monsoon rainfall than Haryana, which is farther west in the northern plains.", ["PLAINS-EAST-WEST-GRADIENT"]],
  [89, "Easy", "Which climate control mainly explains why high Himalayan areas are colder than nearby plains?", "Altitude", "Longitude alone", "Distance from the equator alone", "Soil colour", "Temperature falls with height, so the great altitude of the Himalayas makes high mountain areas much colder than nearby lowland plains.", ["HIMALAYA-ALTITUDE-TEMP"]],
  [89, "Easy", "Which winter precipitation is common at higher Himalayan elevations?", "Snowfall", "Only summer drizzle", "Only hail from sea breezes", "No precipitation at all", "Cold high elevations allow winter precipitation, including that brought by western disturbances, to fall as snow in many Himalayan areas.", ["HIMALAYA-WINTER-SNOW"]],
  [89, "Medium", "How do the Himalayas influence India's winter climate beyond their high-altitude cold?", "They help block very cold continental winds from Central Asia", "They draw warm ocean currents into Punjab", "They create the northeast monsoon over Tamil Nadu", "They eliminate western disturbances", "The Himalayan barrier limits the direct southward flow of very cold continental air, helping northern India remain warmer than comparable continental interiors.", ["HIMALAYA-COLD-WIND-BARRIER"]],
  [89, "Medium", "Which pair is correctly matched?", "Himalayan highlands — lower temperature because of altitude", "Himalayan highlands — year-round desert heat", "Himalayan highlands — no winter snow", "Himalayan highlands — sea-moderated temperature", "The dominant local climate control in high Himalayan terrain is altitude, which keeps temperatures lower than on adjacent plains.", ["HIMALAYA-ALTITUDE-TEMP"]],
  [89, "Medium", "A winter disturbance crosses northwestern India and reaches the mountains. What change is most likely with increasing elevation?", "Rain is more likely to change to snow", "Snow changes to desert dust", "Rain changes to sea breeze", "All precipitation stops immediately", "As elevation rises, temperatures fall, so winter precipitation from the same weather system is increasingly likely to occur as snow.", ["HIMALAYA-WINTER-SNOW"]],
  [89, "Medium", "Which combination best describes the Himalayan climate role?", "High altitude cools the mountains, and the range also acts as a climatic barrier", "Low altitude heats the mountains, and the range has no wind effect", "The mountains receive only coastal sea breezes", "The range causes identical climate on both sides", "The Himalayas affect climate both locally through high altitude and regionally by acting as a major barrier to air movement.", ["HIMALAYA-ALTITUDE-TEMP", "HIMALAYA-COLD-WIND-BARRIER"]],
  [90, "Easy", "Which state–climate pair is correctly matched?", "Tamil Nadu — important retreating-monsoon rainfall", "Rajasthan — very heavy orographic rainfall", "Punjab — main northeast-monsoon coast", "Meghalaya — inadequate rainfall below 50 cm", "Tamil Nadu is strongly linked with rainfall during the retreating or northeast monsoon season, especially in October and November.", ["INTEGRATED-TN"]],
  [90, "Easy", "Which region–climate pair is correctly matched?", "Interior Deccan — rain-shadow conditions", "Kerala coast — inadequate summer rainfall", "Meghalaya — desert climate", "Punjab — year-round tropical cyclone rainfall", "Much of the interior Deccan lies leeward of the Western Ghats and therefore shows rain-shadow conditions compared with the west coast.", ["INTEGRATED-DECCAN"]],
  [90, "Medium", "Which set contains only correctly matched climate associations?", "Kerala—early southwest monsoon; Meghalaya—heavy orographic rain; Punjab—western-disturbance winter rain", "Kerala—winter snowfall; Meghalaya—desert climate; Punjab—northeast monsoon", "Kerala—rain shadow; Meghalaya—loo winds; Punjab—Coromandel cyclones", "Kerala—late monsoon onset; Meghalaya—low rainfall; Punjab—sea-moderated climate", "Kerala is linked with early southwest monsoon arrival, Meghalaya with relief-enhanced heavy rain, and Punjab with winter rain from western disturbances.", ["INTEGRATED-KERALA", "INTEGRATED-MEGHALAYA", "INTEGRATED-PUNJAB"]],
  [90, "Medium", "A region is dry in the southwest monsoon but much wetter in October–November. Which region best fits this clue?", "Tamil Nadu coast", "Kerala coast", "Western Rajasthan", "Punjab plain", "Tamil Nadu's coast receives relatively little rain from the southwest monsoon but gains important rainfall during the retreating monsoon in October and November.", ["INTEGRATED-TN"]],
  [90, "Medium", "Which contrast is correctly stated?", "Western Rajasthan is dry and variable, while Meghalaya is very wet because of relief uplift", "Western Rajasthan is wetter than Meghalaya", "Both regions receive identical monsoon rainfall", "Meghalaya is dry because it lies behind the Aravallis", "Western Rajasthan lies in an arid, highly variable rainfall belt, whereas Meghalaya receives very heavy monsoon rain enhanced by hill relief.", ["INTEGRATED-RAJASTHAN", "INTEGRATED-MEGHALAYA"]],
  [90, "Medium", "Which regional sequence correctly moves from a windward wet area to a leeward drier area?", "Konkan coast → interior Maharashtra", "Interior Maharashtra → Konkan coast", "Western Rajasthan → Meghalaya", "Punjab plain → Tamil Nadu coast", "The Konkan lies on the windward side of the Western Ghats, while interior Maharashtra lies leeward and receives less rain in the rain shadow.", ["INTEGRATED-WINDWARD-LEEWARD"]],
]);

function placeOptions(answer: string, distractors: readonly string[], correctIndex: number): string[] {
  const options = [...distractors];
  options.splice(correctIndex, 0, answer);
  return options;
}

export const GEO_CLI_001_CP010_REVIEW_BATCH_V1: readonly GeoCli001Cp010Question[] = Object.freeze(
  RAW.map((raw, index) => {
    const [ql, difficulty, stem, answer, d1, d2, d3, explanation, sourceFactIds] = raw;
    const correctIndex = index % 4;
    return Object.freeze({
      questionId: `GEO-CLI-001-CP010-Q${String(index + 1).padStart(3, "0")}`,
      qlId: `GEO-CLI-001-QL-${String(ql).padStart(3, "0")}`,
      qlName: QL_NAMES[ql],
      difficulty,
      stem,
      options: Object.freeze(placeOptions(answer, [d1, d2, d3], correctIndex)),
      correctIndex,
      canonicalAnswer: answer,
      explanation,
      sourceIds: SOURCE_IDS,
      sourceFactIds: Object.freeze([...sourceFactIds]),
      reviewOnly: true as const,
      runtimeRegistered: false as const,
    });
  }),
);

const BANNED_LEARNER_TEXT = /sourceFact|review-only|runtimeRegistered|generator|qualification gate|truth authority|\bNCERT\b|\bIMD\b/i;
const BANNED_STEM_TEXT = /associated with|described as|in the context of|with reference to the above|what is a key feature|which is correct\?|which statement is correct\?|what broad effect can it have|which climate control best explains/i;

export function auditGeoCli001Cp010ReviewBatchV1() {
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

  for (const question of GEO_CLI_001_CP010_REVIEW_BATCH_V1) {
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

  if (GEO_CLI_001_CP010_REVIEW_BATCH_V1.length !== 54) issues.push(`COUNT:${GEO_CLI_001_CP010_REVIEW_BATCH_V1.length}`);
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
    questionCount: GEO_CLI_001_CP010_REVIEW_BATCH_V1.length,
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

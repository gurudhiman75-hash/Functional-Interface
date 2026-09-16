export type GeoCli001Cp006Difficulty = "Easy" | "Medium" | "Hard";

export interface GeoCli001Cp006Question {
  questionId: string;
  qlId: string;
  qlName: string;
  difficulty: GeoCli001Cp006Difficulty;
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

type Raw = readonly [number, GeoCli001Cp006Difficulty, string, string, readonly [string, string, string], string];

const QL_NAMES: Readonly<Record<number, string>> = Object.freeze({
  46: "Retreat timing and southward pressure shift",
  47: "October heat and transitional weather",
  48: "Northeast monsoon wind reversal",
  49: "Tamil Nadu and Coromandel rainfall",
  50: "Bay of Bengal moisture pickup",
  51: "Cyclonic depressions and Andaman Sea origin",
  52: "East-coast cyclone exposure",
  53: "Regional retreating-monsoon contrast",
  54: "Integrated retreating-monsoon reasoning",
});

const SOURCE_IDS = Object.freeze([
  "NCERT-INDIA-PHYSICAL-ENVIRONMENT-CLIMATE",
  "NCERT-CONTEMPORARY-INDIA-I-CLIMATE",
]);

const FACT_IDS: Readonly<Record<number, string>> = Object.freeze({
  46: "NCERT-CLI-RETREAT-TIMING",
  47: "NCERT-CLI-OCTOBER-HEAT",
  48: "NCERT-CLI-NORTHEAST-FLOW",
  49: "NCERT-CLI-COROMANDEL-RAIN",
  50: "NCERT-CLI-BAY-MOISTURE-PICKUP",
  51: "NCERT-CLI-CYCLONIC-DEPRESSIONS",
  52: "NCERT-CLI-EAST-COAST-CYCLONES",
  53: "NCERT-CLI-REGIONAL-RETREAT-CONTRAST",
  54: "NCERT-CLI-RETREAT-INTEGRATION",
});

const RAW: readonly Raw[] = Object.freeze([
  [46,"Easy","Which months are mainly known as the retreating monsoon season in India?","October and November",["July and August","December and January","April and May"],"October and November are the main retreating-monsoon months, when the southwest monsoon withdraws and the seasonal pressure pattern shifts southward."],
  [46,"Easy","Why does the southwest monsoon begin to weaken by the end of September?","The low-pressure trough over the Ganga plain starts shifting southward",["The ITCZ shifts farther north","The Arabian Sea becomes much warmer than land","A permanent high forms over the Bay of Bengal"],"By the end of September, the low-pressure trough over the Ganga plain starts moving southward with the apparent southward movement of the Sun, weakening the southwest monsoon."],
  [46,"Easy","From which region does the southwest monsoon start withdrawing first?","Western Rajasthan",["Tamil Nadu coast","Assam valley","Konkan coast"],"Withdrawal begins from western Rajasthan around the first week of September, making it the earliest major region to see the retreat of the southwest monsoon."],
  [46,"Easy","By the end of September, the southwest monsoon has usually withdrawn from which group of regions?","Rajasthan, Gujarat, western Ganga plain and the Central Highlands",["Tamil Nadu, Kerala, Assam and Meghalaya","Punjab, Kashmir, Odisha and coastal Andhra Pradesh","Konkan, Malabar, Assam and the Brahmaputra valley"],"The end-September withdrawal covers Rajasthan, Gujarat, the western Ganga plain and the Central Highlands before the retreat progresses farther south."],
  [46,"Easy","By the beginning of October, the seasonal low-pressure area is mainly found over which region?","Northern parts of the Bay of Bengal",["Western Rajasthan","The Arabian Sea west of Gujarat","The upper Indus valley"],"As withdrawal advances, the low-pressure area shifts away from northern India and by early October lies over the northern parts of the Bay of Bengal."],
  [46,"Easy","By about when is the seasonal low-pressure centre completely removed from the Indian Peninsula?","By the middle of December",["By the middle of September","By the first week of October","By the end of January"],"The seasonal low continues to move southward through October and November and is completely removed from the Peninsula by about mid-December."],

  [47,"Easy","What does the term 'October heat' refer to during the retreating monsoon season?","Oppressive weather caused by high temperature and high humidity",["A sudden cold wave over northern India","Dry hot loo winds over the northern plains","Heavy snowfall in the western Himalayas"],"After the monsoon starts retreating, skies often clear but the land remains moist. High temperature together with high humidity makes the weather oppressive, producing October heat."],
  [47,"Easy","Which weather pattern commonly marks the retreating southwest monsoon season?","Clear skies with a rise in temperature",["Persistent overcast skies with falling temperature","Continuous snowfall over the plains","Strong dry loo winds throughout India"],"Retreating-monsoon weather is commonly marked by clearer skies and a rise in temperature before temperatures begin falling more sharply later in October."],
  [47,"Easy","Why can the weather feel especially oppressive during October in many parts of India?","The land remains moist while temperature and humidity stay high",["Cold dry winds blow continuously from Central Asia","The southwest monsoon becomes stronger everywhere","Surface humidity falls to very low levels"],"The ground remains moist after the rainy season, while temperatures and humidity can both remain high. This combination makes October weather feel hot and uncomfortable."],
  [47,"Easy","In northern India, temperatures usually begin to fall rapidly during which part of October?","The second half of October",["The first two days of October","Only after mid-December","The whole of September"],"The retreating season begins warm, but in northern India temperatures usually start falling rapidly during the second half of October."],
  [47,"Easy","October heat is most closely linked with which phase of India's annual climate cycle?","The retreating monsoon season",["The peak cold weather season","The advancing southwest monsoon only","The late hot-weather season before monsoon onset"],"October heat is a characteristic feature of the retreating monsoon season, when the rains withdraw but residual moisture combines with warm conditions."],
  [47,"Easy","Consider these statements about October heat:\nI. Skies often become clearer as the monsoon retreats.\nII. High temperature and humidity can make the weather oppressive.\nWhich statement(s) are correct?","Both I and II",["I only","II only","Neither I nor II"],"Both statements are correct. Retreating-monsoon skies become clearer, while high temperature over moist ground keeps humidity high and produces the oppressive October heat."],

  [48,"Easy","Which wind direction becomes dominant over much of India after the southwest monsoon retreats?","Northeasterly flow",["Southwesterly flow","Northwesterly flow from the Arabian Sea","Southeasterly equatorial flow"],"As the seasonal pressure pattern reverses, winds over much of India turn northeasterly. This is the basis of the northeast or retreating monsoon circulation."],
  [48,"Easy","What broad wind reversal occurs as India moves from the summer monsoon toward winter conditions?","Southwesterly winds give way to northeasterly winds",["Northeasterly winds give way to permanent westerlies","Easterly winds become permanent southerlies","All surface winds stop over the subcontinent"],"The monsoon is a seasonal reversal of winds. As the summer low weakens and the circulation changes, southwesterly monsoon winds are replaced by northeasterly winds."],
  [48,"Easy","During the northeast monsoon, surface winds over much of India generally blow in which direction?","From northeast toward the south and southwest",["From southwest toward the northeast","From southeast toward the northwest","From west toward the east only"],"The winter-side monsoon circulation is mainly northeasterly, so surface winds generally move from the northeast toward southern and southwestern directions."],
  [48,"Easy","Why are northeast monsoon winds dry over most of the Indian landmass?","They generally begin over land and blow toward the sea",["They travel first across the warm Arabian Sea","They rise over the Himalayas before reaching the plains","They come directly from the equatorial Indian Ocean"],"Over most of India, northeast winds originate over the continent and move seaward. Because their path is mainly over land, they carry relatively little moisture."],
  [48,"Easy","Where can otherwise dry northeast winds pick up enough moisture to give rain to southeast India?","Over the Bay of Bengal",["Over the Thar Desert","Over the Tibetan Plateau","Over the upper Ganga plain"],"Northeast winds can cross the Bay of Bengal, collect moisture and then reach the southeastern coast as rain-bearing winds."],
  [48,"Easy","Consider these statements about the northeast monsoon:\nI. Its winds are generally continental over most of India.\nII. They can gain moisture while crossing the Bay of Bengal.\nWhich statement(s) are correct?","Both I and II",["I only","II only","Neither I nor II"],"Both are correct. The winds are mainly dry while moving from land toward sea, but a Bay of Bengal track can add moisture before they reach the southeast coast."],

  [49,"Medium","Which part of India receives important rainfall during October and November from the retreating monsoon?","The southeastern coast of the Peninsula",["The western Rajasthan desert only","The upper Indus valley","The Ladakh plateau"],"The southeastern part of the Peninsula, especially the Tamil Nadu and Coromandel coast, receives important rain in October and November during the retreating monsoon."],
  [49,"Medium","Why does the Tamil Nadu coast receive rain from northeast monsoon winds?","The winds cross the Bay of Bengal and pick up moisture before reaching the coast",["The winds cross the Thar Desert and become humid","The winds descend from the Himalayas and condense","The Arabian Sea branch remains active over all of India"],"Although northeast winds are dry over much of India, those crossing the Bay of Bengal gain moisture and can bring rain to the Tamil Nadu coast."],
  [49,"Medium","The Coromandel Coast receives a large share of its cool-season rainfall from which weather systems?","Bay of Bengal depressions and cyclones",["Western disturbances from the Mediterranean only","Dry continental anticyclones","Local loo winds from northwestern India"],"A large part of the Coromandel Coast's retreating-season rainfall is produced by depressions and tropical cyclones moving across the Bay of Bengal."],
  [49,"Medium","In the eastern part of the southern Peninsula, which months are often the rainiest of the year?","October and November",["January and February","April and May","July and August"],"For the eastern part of the southern Peninsula, October and November are especially important rainfall months because the retreating monsoon and Bay cyclones affect the region."],
  [49,"Medium","Which contrast best describes retreating-monsoon rainfall over India?","North India is generally dry while the southeastern Peninsula receives rain",["North India is very wet while the southeastern coast is completely dry","Both north India and the southeast coast are equally rainless","Only the western Himalayas receive rain from the northeast monsoon"],"Retreating-monsoon weather is mostly dry in northern India, but the southeastern Peninsula can receive substantial rain from Bay moisture and cyclonic systems."],
  [49,"Medium","Consider these statements:\nI. The Coromandel Coast receives important rain during the retreating monsoon.\nII. Bay of Bengal depressions and cyclones contribute strongly to this rainfall.\nWhich statement(s) are correct?","Both I and II",["I only","II only","Neither I nor II"],"Both statements are correct. The Coromandel Coast is a major retreating-monsoon rainfall region, and cyclonic systems over the Bay of Bengal are a key source of that rain."],

  [50,"Medium","How can a wind that begins dry over the Indian landmass become rain-bearing near Tamil Nadu?","It crosses the Bay of Bengal and gains moisture",["It passes over the Thar Desert and cools sharply","It crosses the Himalayas and becomes warmer","It remains over land for a longer distance"],"The northeast wind may begin as a dry continental flow, but crossing the Bay of Bengal allows it to absorb moisture before reaching Tamil Nadu."],
  [50,"Medium","Which water body is most important for adding moisture to northeast monsoon winds reaching Tamil Nadu?","Bay of Bengal",["Arabian Sea only","Caspian Sea","Red Sea"],"The Bay of Bengal lies directly along the marine path taken by northeast winds before they reach the southeastern coast, so it is the main source of added moisture."],
  [50,"Medium","A northeast wind leaves the Indian landmass, crosses warm sea water and then reaches the Coromandel Coast. What is the likely result?","The wind becomes moisture-bearing and can produce rain",["The wind becomes completely dry","The wind changes into a loo","The wind causes snowfall on the coast"],"A marine crossing over the Bay of Bengal supplies water vapour to the northeast flow, allowing it to produce rain when it reaches the Coromandel Coast."],
  [50,"Medium","Why can southeast India be wet while much of northern India stays dry during the retreating monsoon?","The southeast coast receives winds that have crossed the Bay of Bengal",["Northern India lies closer to the Equator","The southeast coast is farther from every sea","Northern India receives the southwest monsoon throughout winter"],"Over northern India, the retreating flow is mainly dry and continental. The southeast coast is different because the winds can cross the Bay and arrive with moisture."],
  [50,"Medium","Which sequence correctly explains moisture gain in the northeast monsoon?","Dry continental wind → Bay of Bengal crossing → moisture gain → rain on the southeast coast",["Moist ocean wind → Thar Desert crossing → snowfall on the coast","Dry land wind → Himalayan ascent → Arabian Sea cyclone","Southwest wind → Tibetan Plateau → Coromandel rain"],"The key sequence is continental origin followed by a Bay of Bengal crossing. That marine path adds moisture before the wind reaches the southeast coast."],
  [50,"Medium","Consider these statements:\nI. Northeast monsoon winds are dry over much of India.\nII. A Bay of Bengal crossing can make them rain-bearing near the southeast coast.\nWhich statement(s) are correct?","Both I and II",["I only","II only","Neither I nor II"],"Both are correct. Their continental origin explains broad dryness, while the Bay of Bengal moisture source explains the rainfall exception along the southeast coast."],

  [51,"Medium","Widespread rain during the retreating monsoon is often linked with which type of weather system?","Cyclonic depressions",["Permanent continental highs","Dry dust storms from Rajasthan","Western Himalayan katabatic winds"],"Retreating-monsoon rain over the southeast is frequently connected with cyclonic depressions moving across the Bay of Bengal region."],
  [51,"Medium","Many cyclonic depressions affecting southern India's east coast during the retreating monsoon originate over which region?","The Andaman Sea",["The Caspian Sea","The Thar Desert","The western Himalayas"],"Many retreating-season cyclonic depressions originate over the Andaman Sea before moving toward the eastern coast of the southern Peninsula."],
  [51,"Medium","After forming over the Andaman Sea, retreating-monsoon depressions commonly move toward which area?","The eastern coast of the southern Peninsula",["The western coast of Rajasthan","The upper Indus valley","The Ladakh plateau"],"The typical track carries these systems across the Bay toward the eastern coast of the southern Peninsula."],
  [51,"Medium","What is a major weather effect of Bay of Bengal depressions during the retreating monsoon?","Heavy rain over parts of the southeast coast",["Persistent dry weather over the entire Peninsula","Snowfall over the Coromandel Coast","Loo winds over Tamil Nadu"],"Bay of Bengal depressions can produce widespread and sometimes heavy rain along the southeastern coast during the retreating-monsoon season."],
  [51,"Medium","Which systems supply a large part of the Coromandel Coast's retreating-season rainfall?","Depressions and tropical cyclones",["Sea breezes alone","Western disturbances alone","Dry northeast trades without any sea crossing"],"Depressions and tropical cyclones over the Bay of Bengal are a major source of rainfall for the Coromandel Coast in this season."],
  [51,"Medium","Consider these statements:\nI. Many retreating-season depressions originate near the Andaman Sea.\nII. They can cross the eastern coast of the southern Peninsula.\nWhich statement(s) are correct?","Both I and II",["I only","II only","Neither I nor II"],"Both statements match the usual retreating-monsoon pattern: formation near the Andaman Sea followed by movement toward the southeast coast."],

  [52,"Medium","Which river deltas are especially exposed to destructive tropical cyclones during the retreating monsoon?","Godavari, Krishna and Kaveri deltas",["Narmada, Tapi and Sabarmati deltas","Indus, Jhelum and Chenab valleys","Luni, Mahi and Banas basins"],"The densely populated Godavari, Krishna and Kaveri deltas are specifically identified as preferred targets of destructive retreating-season cyclones."],
  [52,"Medium","Which coast is especially affected by tropical cyclones linked with the retreating monsoon?","The eastern coast of the southern Peninsula",["The inland Rajasthan plateau","The upper Ganga-Yamuna divide","The Ladakh interior"],"Many retreating-season cyclones cross the eastern coast of the southern Peninsula, making this coast particularly exposed during October and November."],
  [52,"Medium","Compared with the Bay of Bengal, retreating-season cyclonic storms are generally less frequent over which sea?","The Arabian Sea",["The Andaman Sea","The Bay of Bengal","The eastern Indian Ocean near the Andamans"],"Cyclonic storms of this type are less frequent in the Arabian Sea than in the Bay of Bengal region."],
  [52,"Medium","Besides the southern east coast of India, retreating-season cyclonic storms may also strike which region?","West Bengal, Bangladesh and Myanmar",["Punjab, Himachal Pradesh and Ladakh only","Rajasthan, Gujarat and Haryana only","Kerala, Goa and Lakshadweep only"],"Some Bay cyclonic storms also move toward the northern and northeastern Bay, affecting West Bengal, Bangladesh and Myanmar."],
  [52,"Medium","Which set of locations is correctly linked with high cyclone exposure during the retreating monsoon?","The Godavari, Krishna and Kaveri delta regions",["The Narmada gorge, Aravali crest and Thar dunes","The upper Sutlej basin, Ladakh plateau and Kashmir valley","The Malwa plateau, Chambal basin and Aravali foothills"],"The Godavari, Krishna and Kaveri deltas lie along the cyclone-prone eastern coast and are specifically highlighted as frequent targets."],
  [52,"Medium","Consider these statements:\nI. Retreating-monsoon cyclones often affect east-coast deltas.\nII. Comparable cyclonic storms are less frequent in the Arabian Sea.\nWhich statement(s) are correct?","Both I and II",["I only","II only","Neither I nor II"],"Both are correct. The east coast, including major deltas, is frequently affected, while such cyclonic storms are comparatively less frequent in the Arabian Sea."],

  [53,"Medium","During the retreating monsoon, which broad regional contrast is most typical?","Dry weather in northern India and rain over the eastern southern Peninsula",["Heavy rain across northern India and drought on the southeast coast","Snowfall over all of India and dry Himalayan weather","Uniform rainfall across the whole country"],"The retreating season is generally dry in northern India, while the eastern part of the southern Peninsula receives rain from Bay moisture and cyclonic systems."],
  [53,"Medium","Which region remains an important rainfall zone even as the southwest monsoon withdraws from most of India?","The eastern part of the southern Peninsula",["Western Rajasthan","The Trans-Himalayan region","The upper Indus valley"],"The eastern southern Peninsula remains wet in October-November because northeast flow and Bay cyclones continue to supply moisture after the southwest monsoon retreats."],
  [53,"Medium","Why are October and November especially important rainfall months for parts of southeast India?","Retreating monsoon winds and Bay cyclonic systems affect the region",["The southwest monsoon is at its strongest over all India","Western disturbances dominate the Bay of Bengal","Dry continental winds never reach the Peninsula"],"Southeast India receives moisture from northeast winds crossing the Bay and from cyclonic systems, making October and November major rainfall months."],
  [53,"Medium","A northern station turns mostly dry in October while a Tamil Nadu coastal station becomes wetter. What best explains this contrast?","The retreating circulation is dry in the north but gains Bay moisture before reaching the southeast coast",["Both places receive identical wind paths","The southwest monsoon intensifies over northern India","The Tamil Nadu coast becomes farther from the sea"],"The north experiences dry retreating conditions, while southeast-bound northeast winds cross the Bay of Bengal and can arrive moisture-laden."],
  [53,"Medium","Which pair correctly compares retreating-monsoon conditions?","Northern India — mostly dry; southeast coast — comparatively wet",["Northern India — cyclone-dominated; southeast coast — rainless","Northern India — humid monsoon peak; southeast coast — snowfall","Northern India — southwest monsoon burst; southeast coast — loo winds"],"The key contrast is broad dryness over northern India versus important retreating-season rainfall along the southeastern coast."],
  [53,"Medium","Consider these statements:\nI. Northern India is generally dry during the retreating monsoon.\nII. The eastern southern Peninsula can receive substantial rain in the same season.\nWhich statement(s) are correct?","Both I and II",["I only","II only","Neither I nor II"],"Both are correct. This north-versus-southeast contrast is one of the most important regional features of India's retreating-monsoon season."],

  [54,"Hard","Which sequence best explains the shift from southwest monsoon withdrawal to rain on India's southeast coast?","Low-pressure trough shifts south → southwest monsoon weakens → northeast flow develops → Bay moisture and cyclones bring rain",["ITCZ shifts north → southwest monsoon strengthens → land dries → snowfall reaches Tamil Nadu","Western disturbances deepen → loo winds form → Arabian Sea dries → Bay rainfall stops","Land heating peaks → thermal low deepens → southwest winds intensify → October heat ends"],"The retreat begins as the low-pressure system shifts south. Northeasterly flow then develops, and Bay moisture plus cyclonic systems can produce rain on the southeast coast."],
  [54,"Hard","Consider these statements about the retreating monsoon:\nI. October and November are its main months.\nII. October heat combines high temperature with high humidity.\nIII. Many rain-bearing depressions form near the Andaman Sea.\nWhich statements are correct?","I, II and III",["I and II only","II and III only","I and III only"],"All three are standard retreating-monsoon features: October-November timing, oppressive October heat and Bay-Andaman cyclonic depressions."],
  [54,"Hard","A station is dry in northern India while coastal Tamil Nadu receives heavy rain from a Bay depression. Which season best fits this pattern?","The retreating or northeast monsoon season",["The peak hot-weather season","The advancing southwest monsoon over all India","The cold-weather season before any Bay influence"],"This combination is characteristic of the retreating monsoon: broad northern dryness together with southeast-coast rain from Bay moisture and cyclonic systems."],
  [54,"Hard","Why can rainfall continue on the Coromandel Coast after the southwest monsoon weakens over much of India?","Northeast winds gain Bay moisture and cyclonic depressions remain active",["The southwest monsoon becomes permanently stronger over the coast","Dry continental air alone creates heavy rain","Western Himalayan snowfall directly supplies coastal rain"],"The Coromandel Coast stays rainy because northeast winds can become moisture-bearing over the Bay and because Bay depressions and cyclones are active in this season."],
  [54,"Hard","Which combination correctly represents the retreating-monsoon season?","Clearer skies and October heat inland, but cyclone-linked rain on the southeast coast",["Continuous southwest-monsoon rain over all India with no temperature rise","Severe winter cold everywhere with no coastal rain","Loo winds over the north and snowstorms over Tamil Nadu"],"Retreating monsoon weather can look very different by region: clearer, warm and humid conditions inland, but significant cyclone-related rainfall along the southeast coast."],
  [54,"Hard","Which chain best explains the regional contrast between dry northern India and wet coastal Tamil Nadu in October-November?","Continental northeast flow keeps the north dry, while a Bay crossing adds moisture and cyclonic systems enhance rain in the southeast",["Southwest winds strengthen over the north but avoid all seas near Tamil Nadu","Both regions receive the same dry continental wind path","Northern India lies farther south, while Tamil Nadu lies beyond the monsoon belt"],"The same seasonal reversal produces different outcomes because northern India mainly receives dry continental flow, while winds reaching Tamil Nadu can cross the Bay and interact with cyclonic systems."],
]);

function placeAnswer(answer: string, distractors: readonly [string, string, string], correctIndex: number): readonly string[] {
  const options = [...distractors];
  options.splice(correctIndex, 0, answer);
  return Object.freeze(options);
}

export const GEO_CLI_001_CP006_REVIEW_BATCH_V1: readonly GeoCli001Cp006Question[] = Object.freeze(
  RAW.map((row, index) => {
    const [ql, difficulty, stem, canonicalAnswer, distractors, explanation] = row;
    const correctIndex = index % 4;
    return Object.freeze({
      questionId: `GEO-CLI-001-CP006-Q${String(index + 1).padStart(3, "0")}`,
      qlId: `GEO-CLI-001-QL-${String(ql).padStart(3, "0")}`,
      qlName: QL_NAMES[ql],
      difficulty,
      stem,
      options: placeAnswer(canonicalAnswer, distractors, correctIndex),
      correctIndex,
      canonicalAnswer,
      explanation,
      sourceIds: SOURCE_IDS,
      sourceFactIds: Object.freeze([FACT_IDS[ql]]),
      reviewOnly: true as const,
      runtimeRegistered: false as const,
    });
  }),
);

const BANNED_LEARNER_TEXT = /sourceFact|review-only|runtimeRegistered|generator|qualification gate|truth authority|NCERT/i;
const BANNED_STEM_TEXT = /associated with|described as|in the context of|with reference to the above|what is a key feature|which is correct\?|which statement is correct\?|what broad effect can it have|which climate control best explains/i;

export function auditGeoCli001Cp006ReviewBatchV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const stems = new Set<string>();
  const semantics = new Set<string>();
  const explanations = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoCli001Cp006Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];
  const hardAnswers = new Set<string>();
  let statementStemCount = 0;

  for (const question of GEO_CLI_001_CP006_REVIEW_BATCH_V1) {
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

  if (GEO_CLI_001_CP006_REVIEW_BATCH_V1.length !== 54) issues.push(`COUNT:${GEO_CLI_001_CP006_REVIEW_BATCH_V1.length}`);
  if (stems.size !== 54) issues.push(`STEM_COUNT:${stems.size}`);
  if (semantics.size !== 54) issues.push(`SEMANTIC_COUNT:${semantics.size}`);
  if (explanations.size !== 54) issues.push(`EXPLANATION_COUNT:${explanations.size}`);
  if (statementStemCount > 10) issues.push(`STATEMENT_STEM_OVERUSE:${statementStemCount}`);
  for (let i = 46; i <= 54; i += 1) {
    const qlId = `GEO-CLI-001-QL-${String(i).padStart(3, "0")}`;
    if (qlCounts[qlId] !== 6) issues.push(`QL_COUNT:${qlId}:${qlCounts[qlId] ?? 0}`);
  }
  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 6) issues.push(`DIFFICULTY:${JSON.stringify(difficultyCounts)}`);
  if (answerPositions.join(",") !== "14,14,13,13") issues.push(`ANSWER_POSITIONS:${answerPositions.join(",")}`);
  if (hardAnswers.size < 3) issues.push(`HARD_ANSWER_VARIETY:${hardAnswers.size}`);

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: GEO_CLI_001_CP006_REVIEW_BATCH_V1.length,
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

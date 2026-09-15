export type GeoCli001Cp003Difficulty = "Easy" | "Medium" | "Hard";
export interface GeoCli001Cp003Question {
  questionId: string;
  qlId: string;
  qlName: string;
  difficulty: GeoCli001Cp003Difficulty;
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

type Raw = readonly [number, GeoCli001Cp003Difficulty, string, string, readonly [string, string, string]];

const QL_NAMES: Readonly<Record<number, string>> = Object.freeze({
  19: "Timing and seasonal progression",
  20: "Winter temperature pattern",
  21: "Winter pressure pattern",
  22: "Northeast trade winds and dry flow",
  23: "Typical winter weather",
  24: "Frost, snowfall and northern cold conditions",
  25: "Peninsular and coastal moderation",
  26: "Winter rainfall exceptions and basic causes",
  27: "Integrated cold-weather reasoning",
});

const QL_NOTES: Readonly<Record<number, string>> = Object.freeze({
  19: "In northern India, the cold weather season begins around mid-November. December and January are usually the coldest months, and conditions begin to ease by February.",
  20: "Winter temperatures generally decrease from south to north. Northern India is cooler, while the far south and coastal areas remain relatively warm because of lower latitude and maritime influence.",
  21: "Winter cooling makes the continental air denser and helps build relatively high surface pressure over northern India. This favours outward flow from the land toward lower pressure over the seas.",
  22: "Northeast trade winds prevail over much of India in winter. Because they usually blow from land toward sea, they carry little moisture and keep most of the country dry.",
  23: "Typical cold-season weather over northern India includes low temperatures, low humidity, generally clear skies and light or variable winds. Short disturbed spells can interrupt this pattern.",
  24: "Cold winter nights can produce frost over parts of the northern and northwestern plains. In the higher Himalayas, winter precipitation commonly falls as snow.",
  25: "Peninsular and coastal India experience a milder cold season because surrounding seas reduce temperature extremes. Low latitude also keeps the south warmer than the northern interior.",
  26: "Winter is generally dry, but there are important exceptions. Western cyclonic disturbances can bring rain to the northern plains and snow to the Himalayas, while northeast winds can pick up Bay of Bengal moisture before reaching the Tamil Nadu coast.",
  27: "India's cold-weather pattern links continental cooling, high pressure, dry northeasterly winds, north-south temperature contrast and regional precipitation exceptions. Coastal moderation weakens the cold farther south.",
});

const SOURCE_IDS = Object.freeze([
  "NCERT-CONTEMPORARY-INDIA-I-CLIMATE",
  "NCERT-INDIA-PHYSICAL-ENVIRONMENT-CLIMATE",
]);

const RAW: readonly Raw[] = Object.freeze([
  [19,"Easy","In northern India, the cold weather season generally begins around which period?","Mid-November",["Early September","Late January","Mid-March"]],
  [19,"Easy","Which months are generally the coldest over northern India?","December and January",["August and September","March and April","June and July"]],
  [19,"Easy","The cold weather season over northern India extends broadly from mid-November to about which month?","February",["May","July","September"]],
  [19,"Easy","As winter develops over India, the strongest fall in temperature is generally felt over which part?","Northern India",["Southern coastal India","Andaman and Nicobar Islands","Lakshadweep"]],
  [19,"Easy","Which sequence correctly shows the broad progression of the cold season in northern India?","Mid-November onset → December-January peak cold → February weakening",["September onset → November peak cold → January end","January onset → March peak cold → May end","June onset → August peak cold → October end"]],
  [19,"Easy","Consider these statements about the cold weather season:\nI. It begins around mid-November in northern India.\nII. December and January are usually the coldest months there.\nWhich statement(s) are correct?","Both I and II",["I only","II only","Neither I nor II"]],

  [20,"Easy","During winter, the mean temperature generally changes in what way from south to north across India?","It decreases from south to north",["It increases from south to north","It remains nearly uniform","It increases only over coastal areas"]],
  [20,"Easy","Why are winter temperatures generally higher in southern India than in northern India?","Southern India lies at lower latitudes and has stronger maritime influence",["Southern India is farther from the sea","Northern India receives more direct winter sunshine","The Himalayas warm the northern plains"]],
  [20,"Easy","Which region generally experiences lower winter temperatures?","The northern plains",["The southern coastal belt","Lakshadweep","The Andaman coast"]],
  [20,"Easy","Which statement best matches India's winter temperature pattern?","The north is much cooler, while the far south remains relatively warm",["The far south is colder than the northern plains","All regions have nearly the same winter temperature","Only the western coast becomes very cold"]],
  [20,"Easy","A city in northern India and a coastal city in southern India are compared in January. Which is more likely to be warmer?","The southern coastal city",["The northern inland city","Both must have the same temperature","The northern city because it is farther from the Equator"]],
  [20,"Easy","Which factor most directly explains the broad north-south winter temperature difference in India?","Latitude",["Longitude alone","River drainage","Soil type"]],

  [21,"Easy","Which pressure condition generally develops over northern India during winter?","Relatively high pressure",["Deep thermal low pressure","Permanent equatorial low pressure","Uniform low pressure over land and sea"]],
  [21,"Easy","Why does relatively high pressure develop over much of the Indian landmass in winter?","The land cools and the overlying air becomes denser",["The land heats faster than the sea","The ITCZ remains over northern India","The southwest monsoon strengthens"]],
  [21,"Easy","In winter, surface winds generally move away from northern India mainly because of which pressure pattern?","Higher pressure over land than over nearby seas",["Lower pressure over land than over nearby seas","Equal pressure over land and sea","A permanent low over the Himalayas"]],
  [21,"Easy","Which pair is correctly matched for the Indian winter?","Cooler land — relatively higher surface pressure",["Cooler land — deep thermal low","Warmer land — relatively higher pressure","Cooler sea — no pressure gradient"]],
  [21,"Easy","What is the direct effect of winter cooling over the northern Indian landmass?","It strengthens a continental high-pressure area",["It creates the summer thermal low","It fixes the ITCZ over the Gangetic plain","It turns all winds into southwesterlies"]],
  [21,"Easy","Consider these statements:\nI. Land cooling in winter helps raise surface pressure over northern India.\nII. This pressure pattern favours outward flow from the land.\nWhich statement(s) are correct?","Both I and II",["I only","II only","Neither I nor II"]],

  [22,"Medium","During winter, the prevailing surface winds over much of India generally blow from which direction?","From the northeast toward the south and southwest",["From the southwest toward the northeast","From the southeast toward the northwest","From the west toward the east"]],
  [22,"Medium","Why are winter winds dry over most of India?","They generally blow from land toward sea",["They cross a long stretch of warm ocean before reaching India","They rise continuously over the Himalayas","They originate over the equatorial Indian Ocean"]],
  [22,"Medium","Which wind system dominates much of India during the cold weather season?","Northeast trade winds",["Southwest monsoon winds","Equatorial westerlies","Polar easterlies"]],
  [22,"Medium","Which pair correctly describes the winter winds over most of India?","Northeasterly and mainly offshore",["Southwesterly and mainly onshore","Southeasterly and permanently humid","Westerly and equatorial"]],
  [22,"Medium","A surface wind begins over the Indian landmass and moves toward the surrounding seas in winter. What does this most directly explain?","The generally dry weather over most of the country",["The onset of the southwest monsoon","Heavy rain over all of peninsular India","The summer thermal low"]],
  [22,"Medium","Consider these statements about winter winds:\nI. They generally blow from the northeast.\nII. Over most of India they move from land toward sea and carry little moisture.\nWhich statement(s) are correct?","Both I and II",["I only","II only","Neither I nor II"]],

  [23,"Medium","Which set of conditions is most typical of the cold weather season over northern India?","Low temperature, low humidity and clear skies",["High temperature, high humidity and overcast skies","High temperature, dry hot winds and dust storms","Warm nights, very high humidity and continuous rain"]],
  [23,"Medium","Why are clear skies common over much of India during the winter season?","The prevailing continental winds are generally dry",["The southwest monsoon is at its strongest","The ITCZ remains over northern India","Moist onshore winds dominate all regions"]],
  [23,"Medium","Which weather condition is least typical of the northern Indian winter under normal conditions?","Persistently high humidity",["Clear skies","Cool temperatures","Light or variable winds"]],
  [23,"Medium","A winter day over the northern plains has clear skies, low humidity and light winds. Which season does this pattern indicate?","Cold weather season",["Advancing monsoon season","Hot weather season","Retreating monsoon only"]],
  [23,"Medium","Which feature commonly accompanies the dry winter circulation over northern India?","Low humidity",["Persistent marine humidity","Daily thunderstorms","Strong onshore moisture flow"]],
  [23,"Medium","Which combination best describes normal winter weather over the northern plains?","Cool and dry with generally clear skies",["Hot and humid with frequent thunderstorms","Warm and wet with continuous monsoon rain","Hot and dry with strong loo winds"]],

  [24,"Medium","Frost during the cold weather season is most common in which part of India?","Northern and northwestern plains",["Southern coastal belt","Lakshadweep","Andaman and Nicobar Islands"]],
  [24,"Medium","During winter, precipitation in the higher Himalayan region commonly falls in which form?","Snow",["Hail only","Warm rain only","Drizzle from sea breezes"]],
  [24,"Medium","Why are frost conditions more likely over the northern plains than over southern coastal India?","Northern winter nights are much colder and continental influence is stronger",["Southern coasts are farther from the sea","Northern plains receive more oceanic moderation","Southern India lies at a higher latitude"]],
  [24,"Medium","Which pair is correctly matched with Indian winter conditions?","Higher Himalayas — snowfall",["Tamil Nadu coast — widespread frost","Lakshadweep — heavy snowfall","Northern plains — tropical sea breeze throughout winter"]],
  [24,"Medium","A sharp fall in night temperature below freezing near the ground is most likely to produce what over the northern plains?","Frost",["Monsoon burst","Sea breeze","Mango showers"]],
  [24,"Medium","Consider these statements:\nI. Frost may occur over parts of the northern plains in winter.\nII. The higher Himalayas commonly receive snowfall in winter.\nWhich statement(s) are correct?","Both I and II",["I only","II only","Neither I nor II"]],

  [25,"Medium","Why is the cold weather season less sharply felt over peninsular India?","The surrounding seas moderate winter temperatures",["The peninsula lies farther from the Equator than northern India","The Himalayas block all winter winds there","The southwest monsoon remains active all winter"]],
  [25,"Medium","Which part of India usually shows the smallest winter temperature contrast because of strong maritime influence?","Coastal peninsular India",["Interior northwestern India","Upper Gangetic plain","Trans-Himalayan region"]],
  [25,"Medium","A coastal city in peninsular India remains relatively warm in January. Which factor best explains this?","Maritime influence of the surrounding seas",["Greater distance from the sea","Stronger continentality","Persistent snow cover"]],
  [25,"Medium","Which comparison is generally correct during the cold weather season?","Peninsular coasts remain milder than the northern interior",["Northern interior remains warmer than all peninsular coasts","Peninsular coasts experience the strongest frost","Winter temperatures are identical across India"]],
  [25,"Medium","Why does peninsular India not experience a well-defined cold season like northern India?","Its low latitude and maritime setting keep temperatures relatively moderate",["It lies at very high altitude","It is cut off from the sea","It receives polar winds throughout the season"]],
  [25,"Medium","Which pair best shows the effect of continentality in winter?","Northern interior — larger fall in temperature; southern coast — milder conditions",["Northern interior — strong sea moderation; southern coast — severe frost","Northern interior — tropical maritime warmth; southern coast — snow","Both regions — identical temperature range"]],

  [26,"Medium","Which weather system brings important winter rain to the northern plains of India?","Cyclonic disturbances arriving from the west and northwest",["Southwest monsoon depressions from the Bay of Bengal","Local sea breezes from the Arabian Sea","Equatorial easterlies from the Indian Ocean"]],
  [26,"Medium","Winter rain over the northern plains is especially important for which agricultural season?","Rabi crops",["Kharif crops only","Zaid crops only","Plantation crops only"]],
  [26,"Medium","Which region commonly receives snowfall when western cyclonic disturbances affect India in winter?","The Himalayan region",["The Coromandel Coast","Lakshadweep","The Deccan plateau"]],
  [26,"Medium","Why can the Tamil Nadu coast receive rain during winter despite the generally dry northeast winds?","The winds cross the Bay of Bengal and pick up moisture before reaching the coast",["The winds descend directly from the Himalayas","The southwest monsoon remains active over all India","The coast lies in a permanent equatorial low"]],
  [26,"Medium","Which statement identifies an important exception to India's generally dry winter weather?","The northern plains may receive rain from western cyclonic disturbances",["All of India receives heavy southwest-monsoon rain","The Thar Desert receives daily convectional rain","The western coast receives continuous polar snowfall"]],
  [26,"Medium","Consider these statements about winter precipitation:\nI. Western cyclonic disturbances can bring rain to the northern plains.\nII. The Tamil Nadu coast can receive rain from moisture-bearing northeast winds.\nWhich statement(s) are correct?","Both I and II",["I only","II only","Neither I nor II"]],

  [27,"Hard","Which combination best explains a typical cold-weather day over the northern plains of India?","High continental pressure, dry northeasterly flow and low humidity",["Low continental pressure, moist southwesterly flow and high humidity","Equatorial low pressure, onshore easterlies and continuous rain","Strong summer heating, thermal low and loo winds"]],
  [27,"Hard","A northern plain station is cool and dry, while a southern coastal station is milder in January. Which two factors best explain this contrast?","Latitude and maritime influence",["Longitude and river drainage","Soil colour and vegetation","Ocean depth and mineral type"]],
  [27,"Hard","Which sequence correctly explains the broad winter circulation over India?","Land cools → pressure rises over the continent → northeasterly winds blow outward",["Land heats → pressure falls → southwesterly winds blow inland","Sea cools faster → continental pressure falls → easterlies stop","ITCZ shifts north → thermal low deepens → winter monsoon strengthens"]],
  [27,"Hard","A winter disturbance brings rain to Punjab and snow to the western Himalayas. Which seasonal pattern does this represent?","A western cyclonic disturbance interrupting the normally dry winter weather",["The normal advance of the southwest monsoon","A summer loo event","A retreating-monsoon cyclone over the Coromandel Coast"]],
  [27,"Hard","Which statement set correctly describes India's cold weather season?\nI. Northern India develops relatively high pressure.\nII. Most winter winds are dry because they blow from land to sea.\nIII. Peninsular coasts remain milder because of maritime influence.","I, II and III",["I and II only","II and III only","I and III only"]],
  [27,"Hard","Which chain best explains why winter is generally dry over most of India but not completely rainless?","Dry offshore northeast winds dominate, but regional moisture pickup and western disturbances produce exceptions",["Moist southwest winds dominate, but deserts block rain everywhere","Uniform high humidity prevails, but only mountains receive rain","The ITCZ stays over northern India, causing daily convectional rain"]],
] as Raw[]);

function makeOptions(answer: string, distractors: readonly [string, string, string], correctIndex: number) {
  const options = [...distractors];
  options.splice(correctIndex, 0, answer);
  return Object.freeze(options);
}

export const GEO_CLI_001_CP003_REVIEW_BATCH_V1: readonly GeoCli001Cp003Question[] = Object.freeze(
  RAW.map(([ql, difficulty, stem, answer, distractors], index) => {
    const correctIndex = index % 4;
    const qlCode = String(ql).padStart(3, "0");
    const within = String((index % 6) + 1).padStart(2, "0");
    return Object.freeze({
      questionId: `GEO-CLI-001-CP003-Q${String(index + 1).padStart(3, "0")}`,
      qlId: `GEO-CLI-001-QL-${qlCode}`,
      qlName: QL_NAMES[ql],
      difficulty,
      stem,
      options: makeOptions(answer, distractors, correctIndex),
      correctIndex,
      canonicalAnswer: answer,
      explanation: `${answer}. ${QL_NOTES[ql]}`,
      sourceIds: SOURCE_IDS,
      sourceFactIds: Object.freeze([`geo-cli-001-cp003-${qlCode}-${within}`]),
      reviewOnly: true as const,
      runtimeRegistered: false as const,
    });
  }),
);

const BANNED_LEARNER_TEXT = /sourceFact|review-only|runtimeRegistered|generator|qualification gate|truth authority|NCERT/i;
const BANNED_STEM_TEXT = /associated with|described as|in the context of|with reference to the above|what is a key feature|which is correct\?|which statement is correct\?|what broad effect can it have|which climate control best explains/i;

export function auditGeoCli001Cp003ReviewBatchV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const stems = new Set<string>();
  const semantics = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoCli001Cp003Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];
  const hardAnswers = new Set<string>();
  let statementStemCount = 0;

  for (const question of GEO_CLI_001_CP003_REVIEW_BATCH_V1) {
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
    if (question.explanation.length < 55) issues.push(`SHORT_EXPLANATION:${question.questionId}`);
    if (question.stem.length < 28) issues.push(`SHORT_STEM:${question.questionId}`);
    if (question.stem.length > 220) issues.push(`LONG_STEM:${question.questionId}`);
    if (!question.stem.trim().endsWith("?")) issues.push(`NON_QUESTION_STEM:${question.questionId}`);
    if (BANNED_STEM_TEXT.test(question.stem)) issues.push(`NON_EXAM_STEM:${question.questionId}`);
    if (/^Consider these statements/i.test(question.stem) || /^Which statement set/i.test(question.stem)) statementStemCount += 1;
    const learnerText = `${question.stem}\n${question.options.join("\n")}\n${question.explanation}`;
    if (BANNED_LEARNER_TEXT.test(learnerText)) issues.push(`LEARNER_TEXT:${question.questionId}`);
  }

  if (GEO_CLI_001_CP003_REVIEW_BATCH_V1.length !== 54) issues.push(`COUNT:${GEO_CLI_001_CP003_REVIEW_BATCH_V1.length}`);
  if (stems.size !== 54) issues.push(`STEM_COUNT:${stems.size}`);
  if (semantics.size !== 54) issues.push(`SEMANTIC_COUNT:${semantics.size}`);
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
    questionCount: GEO_CLI_001_CP003_REVIEW_BATCH_V1.length,
    stemCount: stems.size,
    semanticCount: semantics.size,
    qlCounts,
    difficultyCounts,
    answerPositions,
    hardAnswerVariety: hardAnswers.size,
    statementStemCount,
  };
}

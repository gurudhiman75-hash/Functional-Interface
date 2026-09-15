export type GeoCli001Cp004Difficulty = "Easy" | "Medium" | "Hard";

export interface GeoCli001Cp004Question {
  questionId: string;
  qlId: string;
  qlName: string;
  difficulty: GeoCli001Cp004Difficulty;
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

type Raw = readonly [
  number,
  GeoCli001Cp004Difficulty,
  string,
  string,
  readonly [string, string, string],
  string,
];

const QL_NAMES: Readonly<Record<number, string>> = Object.freeze({
  28: "Summer timing and heat-belt progression",
  29: "Regional summer temperature contrasts",
  30: "Summer low pressure and northward ITCZ shift",
  31: "Loo winds of the northern plains",
  32: "May dust storms and intense local storms",
  33: "Nor'westers, Kal Baisakhi and Bardoisila",
  34: "Mango showers and blossom showers",
  35: "Regional pre-monsoon weather comparisons",
  36: "Integrated hot-weather reasoning",
});

const SOURCE_FACTS: Readonly<Record<number, readonly string[]>> = Object.freeze({
  28: ["NCERT-IPE-CLIMATE-P34-HOT-WEATHER-TEMPERATURE"],
  29: ["NCERT-IPE-CLIMATE-P34-PENINSULAR-MODERATION-ALTITUDE"],
  30: ["NCERT-IPE-CLIMATE-P34-SUMMER-PRESSURE-ITCZ"],
  31: ["NCERT-IPE-CLIMATE-P34-P35-LOO"],
  32: ["NCERT-IPE-CLIMATE-P34-DUST-LOCAL-STORMS"],
  33: ["NCERT-IPE-CLIMATE-P35-NORWESTERS-KALBAISAKHI-BARDOISILA"],
  34: ["NCERT-IPE-CLIMATE-P35-MANGO-BLOSSOM-SHOWERS"],
  35: ["NCERT-IPE-CLIMATE-P34-P35-PREMONSOON-REGIONAL-EVENTS"],
  36: ["NCERT-IPE-CLIMATE-P34-P35-HOT-WEATHER-INTEGRATION"],
});

const SOURCE_IDS = Object.freeze([
  "NCERT-CONTEMPORARY-INDIA-I-CLIMATE",
  "NCERT-INDIA-PHYSICAL-ENVIRONMENT-CLIMATE",
]);

const RAW: readonly Raw[] = Object.freeze([
  [28,"Easy","In northern India, which months broadly make up the hot weather season?","April, May and June",["January, February and March","July, August and September","October, November and December"],"In northern India, April, May and June are the main summer months, following the temperature rise that begins in March."],
  [28,"Easy","Temperatures over northern India generally begin rising sharply from which month?","March",["January","July","November"],"March marks the start of the strong pre-monsoon temperature rise as the apparent position of the Sun moves northward."],
  [28,"Easy","By which month does the main heat belt shift into northwestern India?","May",["January","August","December"],"By May, the zone of very high temperature has moved northward into northwestern India, where extreme daytime heat becomes common."],
  [28,"Easy","Which sequence best shows the northward shift of India's summer heat belt?","Deccan in March → Gujarat-Madhya Pradesh in April → northwest in May",["Northwest in March → Deccan in April → coast in May","Coast in March → Himalayas in April → Deccan in May","Northeast in March → coast in April → northwest in May"],"The hottest belt shifts northward through spring: the Deccan is hottest in March, Gujarat-Madhya Pradesh in April, and the northwest in May."],
  [28,"Easy","Which statement best describes the temperature trend from March to May over much of India?","Temperatures rise and the zone of greatest heat shifts northward",["Temperatures fall steadily from north to south","Temperatures remain nearly unchanged everywhere","The strongest heat moves steadily toward the southern tip"],"From March to May, temperatures increase over much of India while the belt of maximum heat moves progressively northward."],
  [28,"Easy","Consider these statements about the hot weather season:\nI. Temperatures begin rising in northern India from March.\nII. April, May and June are the main summer months there.\nWhich statement(s) are correct?","Both I and II",["I only","II only","Neither I nor II"],"Both statements are correct: the strong warming begins in March, while April to June broadly form the hot weather season in northern India."],

  [29,"Easy","Why is the hot weather season generally less intense in southern India than in northern India?","The surrounding seas moderate temperatures",["Southern India is farther from the Equator","The Himalayas cool the peninsula directly","The peninsula receives winter snowfall"],"Southern India is peninsular and strongly influenced by nearby seas, which reduce the extreme summer heating seen over the northern interior."],
  [29,"Easy","Which part of India is most likely to have a milder summer because of maritime influence?","Coastal peninsular India",["Interior Rajasthan","Upper Gangetic Plain","Thar Desert"],"Coastal peninsular India is moderated by the surrounding seas, so its summer temperatures are usually lower and less extreme than inland northern areas."],
  [29,"Easy","Why do the hills of the Western Ghats remain cooler than nearby lowlands during summer?","Higher altitude lowers temperature",["They lie farther north","They receive polar winds","They are farther from the sea"],"Temperature decreases with height, so the elevated hills of the Western Ghats stay cooler than the nearby lower coastal and plateau areas."],
  [29,"Easy","Which comparison is generally correct during India's hot weather season?","Northwestern interiors are hotter than southern coasts",["Southern coasts are hotter than northwestern interiors","All coastal and inland areas have the same temperature","The Himalayas are hotter than the northern plains"],"Northwestern interiors heat strongly and lack strong sea moderation, while southern coastal areas remain comparatively milder because of maritime influence."],
  [29,"Easy","A coastal station and an inland northwestern station are compared in May. Which is more likely to record extreme daytime heat?","The inland northwestern station",["The coastal station","Both must record the same maximum","The station nearer the sea"],"The inland northwest is more continental and can become extremely hot in May, whereas the sea limits temperature extremes at coastal stations."],
  [29,"Easy","Which two controls best explain the milder summer of peninsular coasts and Western Ghats hills?","Maritime influence and altitude",["Longitude and soil colour","River drainage and vegetation","Pressure alone and longitude"],"Nearby seas moderate peninsular coastal temperatures, while higher elevation keeps the Western Ghats hills cooler than surrounding lowlands."],

  [30,"Easy","What happens to surface air pressure over northern India as summer heating becomes intense?","It falls and a thermal low develops",["It rises into a strong winter high","It remains uniform with the ocean","It becomes permanently equal across India"],"Intense summer heating warms and expands the air over northern India, producing falling surface pressure and a strong thermal low."],
  [30,"Easy","Which region develops a strong low-pressure area as the Indian landmass heats during late summer?","Northwestern India",["Southern Indian Ocean only","Higher Himalayas only","Andaman Sea only"],"Northwestern India becomes intensely heated in late spring, helping establish the major thermal low that is important to the summer circulation."],
  [30,"Easy","What is the broad summer movement of the ITCZ over the Indian subcontinent?","It shifts northward",["It shifts permanently to the South Pole","It remains fixed at the Equator","It disappears from the region"],"Strong heating of the Asian landmass pulls the ITCZ northward, bringing the low-pressure belt closer to northern India."],
  [30,"Easy","Which combination best describes the northern half of India during the hot weather season?","Excessive heat and falling air pressure",["Low temperature and rising pressure","Cool moist air and permanent high pressure","Snowfall and weak pressure gradients"],"The summer months in northern India are a period of excessive heat accompanied by falling air pressure."],
  [30,"Easy","A rapidly heated landmass develops lower pressure than the adjoining ocean. What is the immediate atmospheric result?","Air is drawn toward the low-pressure land area",["Air is forced outward from land in all directions","The pressure gradient disappears","Surface winds stop completely"],"Air moves from relatively higher pressure toward lower pressure, so intense continental heating begins to draw surface air toward the land."],
  [30,"Easy","Consider these statements:\nI. Summer heating lowers pressure over northern India.\nII. The ITCZ shifts northward as the subcontinent heats.\nWhich statement(s) are correct?","Both I and II",["I only","II only","Neither I nor II"],"Both are features of the hot weather season: continental heating deepens low pressure and helps shift the ITCZ northward."],

  [31,"Medium","What is the 'loo' of northern India?","A hot, dry summer wind",["A cold winter wind","A moist southwest monsoon branch","A sea breeze over Kerala"],"The loo is a hot, dry and oppressive local wind that blows across the northern plains during the hot weather season."],
  [31,"Medium","The loo is most characteristic of which broad region?","Northern plains",["Western coastal plain","Andaman Islands","High Himalayas"],"The loo is a northern-plains phenomenon, especially across the belt from Punjab toward Bihar during the peak summer heat."],
  [31,"Medium","At what time of day is the loo especially common?","Afternoon",["Early dawn only","Midnight only","Before sunrise only"],"The loo commonly blows during the hot afternoon when land temperatures are highest and the lower atmosphere is intensely heated."],
  [31,"Medium","Which weather description best matches a loo event?","Very hot, dry and oppressive winds over the plains",["Cool moist winds with steady rain","Cold dry winds with frost","Humid sea breezes with drizzle"],"Loo conditions are marked by very hot, dry, oppressive winds over the northern plains rather than moisture-bearing rain winds."],
  [31,"Medium","A hot dry wind is reported from Delhi toward Patna during May. Which local wind is most likely?","Loo",["Mango shower","Nor'wester","Western disturbance"],"The Delhi-Patna belt lies within the core region where the loo is especially strong during the hot weather season."],
  [31,"Medium","Which pair is correctly matched for the hot weather season?","Loo — hot dry wind of the northern plains",["Loo — winter rainfall system","Loo — evening thunderstorm of Bengal","Loo — pre-monsoon shower of Kerala"],"Loo refers specifically to the hot, dry and oppressive winds of the northern plains during late spring and early summer."],

  [32,"Medium","Dust storms during May are especially common in which group of areas?","Punjab, Haryana, eastern Rajasthan and Uttar Pradesh",["Kerala, Tamil Nadu and Lakshadweep","Assam, Meghalaya and Nagaland only","Goa, coastal Karnataka and Kerala only"],"May dust storms are frequent over Punjab, Haryana, eastern Rajasthan and Uttar Pradesh during the hot weather season."],
  [32,"Medium","Why can an evening dust storm briefly reduce the oppressive summer heat?","It may bring light rain and a cooler breeze",["It permanently ends the summer season","It produces snowfall over the plains","It stops all surface winds for several days"],"These temporary storms can bring light rain and a pleasant cool breeze, giving short relief from intense pre-monsoon heat."],
  [32,"Medium","What can happen when dry hot air suddenly meets moisture-laden air near the summer trough?","A violent local storm can develop",["A winter high-pressure cell forms","The monsoon permanently retreats","A cold wave develops over the peninsula"],"Sudden contact between dry and moist air masses near the trough can trigger intense local storms with strong winds and heavy rain."],
  [32,"Medium","Which weather element may accompany intense local summer storms in northern India?","Hail",["Sea ice","Blizzard snow","Permanent fog"],"Strong pre-monsoon convection can produce violent winds, torrential rain and sometimes hail during intense local storms."],
  [32,"Medium","Which statement best describes May dust storms over the northern plains?","They are short-lived storms that can bring temporary cooling",["They are the main winter rainfall system","They are continuous monsoon rain lasting months","They occur only over oceanic islands"],"May dust storms are temporary events; despite strong winds and dust, they can cool the air briefly through light rain and cooler gusts."],
  [32,"Medium","Consider these statements about local summer storms:\nI. Dust storms are common in parts of north India in May.\nII. Strong local storms can include heavy rain and hail.\nWhich statement(s) are correct?","Both I and II",["I only","II only","Neither I nor II"],"Both statements are correct: May dust storms are common in parts of northern India, and stronger convective storms may bring heavy rain and hail."],

  [33,"Medium","The pre-monsoon evening thunderstorms of Bengal and Assam are commonly called what?","Nor'westers",["Loo","Mango showers","Western disturbances"],"Nor'westers are the well-known pre-monsoon evening thunderstorms of Bengal and Assam during the hot weather season."],
  [33,"Medium","What is the local name 'Kal Baisakhi' linked with?","Nor'westers in Bengal",["Loo in Punjab","Mango showers in Kerala","Winter rain in Tamil Nadu"],"In Bengal, destructive pre-monsoon nor'westers are locally known as Kal Baisakhi, referring to storms of the Baisakh season."],
  [33,"Medium","In Assam, the same type of violent pre-monsoon storm is commonly known as what?","Bardoisila",["Loo","Mango shower","Mahawat"],"The fierce pre-monsoon thunderstorms known as nor'westers in Bengal are called Bardoisila in Assam."],
  [33,"Medium","Which crops can benefit from nor'wester showers in eastern India?","Tea, jute and rice",["Wheat only","Cotton only","Millets only"],"Although nor'westers can be violent, their rain is useful for tea, jute and rice cultivation in eastern and northeastern India."],
  [33,"Medium","Which pair is correctly matched?","Kal Baisakhi — Bengal pre-monsoon thunderstorm",["Kal Baisakhi — hot dry wind of Punjab","Kal Baisakhi — Kerala mango shower","Kal Baisakhi — western winter disturbance"],"Kal Baisakhi is the local Bengali name for violent pre-monsoon nor'westers, not for the loo or southern pre-monsoon showers."],
  [33,"Medium","A violent evening thunderstorm in Assam during the hot season is most likely to be locally called what?","Bardoisila",["Loo","Blossom shower","Sea breeze"],"In Assam, these powerful pre-monsoon thunderstorms are locally called Bardoisila; the same storm family is known as nor'westers farther west in Bengal."],

  [34,"Medium","What are the pre-monsoon showers of Kerala and coastal Karnataka that help ripen mangoes called?","Mango showers",["Nor'westers","Loo","Western disturbances"],"Mango showers are late-summer pre-monsoon rains of Kerala and coastal Karnataka, named because they help the early ripening of mangoes."],
  [34,"Medium","Why are 'mango showers' given that name?","They help in the early ripening of mangoes",["They destroy mango orchards every year","They occur only after the southwest monsoon ends","They bring frost to mango-growing regions"],"These pre-monsoon showers are called mango showers because their rain helps mango fruits ripen earlier in parts of southern India."],
  [34,"Medium","Which region is especially known for mango showers?","Kerala and coastal Karnataka",["Punjab and Haryana","Western Rajasthan","Ladakh and Himachal Pradesh"],"Mango showers are a characteristic pre-monsoon feature of Kerala and the coastal parts of Karnataka."],
  [34,"Medium","What do 'blossom showers' mainly help in southern India?","Coffee flowering",["Wheat harvest","Apple snowfall","Jute retting"],"Blossom showers provide moisture that helps coffee flowers blossom in Kerala and nearby coffee-growing areas before the main monsoon."],
  [34,"Medium","Which pair is correctly matched?","Blossom shower — coffee flowering in Kerala and nearby areas",["Blossom shower — loo in the northern plains","Blossom shower — winter rain in Punjab","Blossom shower — snowfall in the Himalayas"],"Blossom showers are pre-monsoon rains connected with coffee flowering in Kerala and nearby areas, not with northern summer winds or winter systems."],
  [34,"Medium","A late-summer shower benefits fruit ripening and plantation activity along India's southwest. Which season does it belong to?","Pre-monsoon hot weather season",["Cold weather season","Retreating monsoon season only","Peak southwest monsoon season only"],"Mango and blossom showers occur before the main southwest monsoon, so they belong to the late hot-weather or pre-monsoon period."],

  [35,"Medium","Which feature is shared by mango showers and nor'westers?","Both are pre-monsoon weather events",["Both are cold-season systems","Both are hot dry winds without rain","Both occur only in northwestern India"],"Mango showers and nor'westers occur before the main southwest monsoon, though they affect different regions and have different local names."],
  [35,"Medium","Which local summer event is most directly linked with temporary cooling over the northwestern plains?","Evening dust storms",["Mango showers","Blossom showers","Winter western disturbances"],"Evening dust storms can bring light rain and cooler gusts to the northern plains, giving brief relief from oppressive heat."],
  [35,"Medium","Which local pre-monsoon event is most closely linked with Kerala's mango crop?","Mango showers",["Nor'westers","Loo","Bardoisila"],"Mango showers are named for their beneficial effect on early mango ripening in Kerala and coastal Karnataka."],
  [35,"Medium","Which event best fits Bengal: violent evening thunder, strong winds and useful pre-monsoon rain?","Nor'wester",["Loo","Mango shower","Cold wave"],"Nor'westers are violent evening thunderstorms of Bengal that bring strong winds and rain, while also supporting crops such as jute and rice."],
  [35,"Medium","A hot dry afternoon wind and a violent evening thunderstorm are reported on the same pre-monsoon map. Which pair fits them?","Loo and nor'wester",["Mango shower and western disturbance","Sea breeze and cold wave","Blossom shower and winter monsoon"],"The loo is the hot dry afternoon wind of the northern plains, while nor'westers are violent pre-monsoon evening thunderstorms in the east."],
  [35,"Medium","Consider these statements:\nI. Mango showers are linked with the southwest coast.\nII. Nor'westers are linked with Bengal and Assam.\nWhich statement(s) are correct?","Both I and II",["I only","II only","Neither I nor II"],"Both are correct: mango showers occur around Kerala and coastal Karnataka, while nor'westers are characteristic pre-monsoon storms of Bengal and Assam."],

  [36,"Hard","Which sequence best explains the hot-weather circulation over northern India?","Strong land heating → falling pressure → northward ITCZ shift → local hot-weather disturbances",["Land cooling → rising pressure → southward ITCZ shift → frost","Ocean cooling → higher land pressure → snowfall → monsoon retreat","Weak heating → no pressure gradient → no local storms"],"Strong pre-monsoon heating lowers pressure over northern India and shifts the ITCZ northward, creating conditions in which hot winds and local storms become prominent."],
  [36,"Hard","A May weather map shows extreme heat in the northwest, falling pressure and hot dry afternoon winds. Which set of features is being observed?","Thermal low and loo during the hot weather season",["Winter high and western disturbances","Retreating monsoon and coastal cyclones","Southwest monsoon burst and rain shadow"],"Extreme May heat in the northwest deepens the thermal low, while hot dry afternoon winds over the plains are the loo—both classic hot-weather features."],
  [36,"Hard","Which comparison correctly distinguishes two major pre-monsoon local weather events?","Loo is hot and dry; nor'westers are violent thunderstorms",["Loo is a rainstorm; nor'westers are dry winds","Both are winter cyclonic systems","Both occur mainly over Kerala"],"The loo is a hot dry wind of the northern plains, whereas nor'westers are intense pre-monsoon thunderstorms of Bengal and Assam."],
  [36,"Hard","A southern coastal region stays relatively mild while the northwest reaches extreme heat in May. Which explanation is strongest?","Maritime moderation in the south and continental heating in the northwest",["Higher latitude in the south and sea cooling in the northwest","Snow cover in the south and warm currents in the northwest","Identical heating but different soils only"],"Southern coasts are moderated by the surrounding seas, while the continental northwest heats much more strongly and develops very high daytime temperatures."],
  [36,"Hard","Which statement set correctly describes India's hot weather season?\nI. Pressure falls over much of northern India.\nII. Loo winds affect the northern plains.\nIII. Mango showers occur along parts of the southwest coast.","I, II and III",["I and II only","II and III only","I and III only"],"All three are standard hot-weather features: northern pressure falls with intense heating, loo winds affect the plains, and mango showers occur in the southwest."],
  [36,"Hard","Which chain best links regional heating with India's main pre-monsoon local weather contrasts?","Northwest heats strongly and gets loo/dust storms, while eastern and southwest regions get convective showers",["All regions receive the same hot dry wind","Southwest coast gets loo while Bengal remains storm-free","Northwest gets mango showers while Kerala gets dust storms"],"Pre-monsoon weather varies regionally: the northwest is dominated by severe dry heat, loo and dust storms, while eastern and southwest regions receive important local convective showers."],
]);

function placeAnswer(answer: string, distractors: readonly [string, string, string], correctIndex: number): readonly string[] {
  const options = [...distractors];
  options.splice(correctIndex, 0, answer);
  return Object.freeze(options);
}

export const GEO_CLI_001_CP004_REVIEW_BATCH_V1: readonly GeoCli001Cp004Question[] = Object.freeze(
  RAW.map((row, index) => {
    const [ql, difficulty, stem, answer, distractors, reason] = row;
    const correctIndex = index % 4;
    return Object.freeze({
      questionId: `GEO-CLI-001-CP004-Q${String(index + 1).padStart(3, "0")}`,
      qlId: `GEO-CLI-001-QL-${String(ql).padStart(3, "0")}`,
      qlName: QL_NAMES[ql],
      difficulty,
      stem,
      options: placeAnswer(answer, distractors, correctIndex),
      correctIndex,
      canonicalAnswer: answer,
      explanation: `${answer}. ${reason}`,
      sourceIds: SOURCE_IDS,
      sourceFactIds: SOURCE_FACTS[ql],
      reviewOnly: true as const,
      runtimeRegistered: false as const,
    });
  }),
);

const BANNED_LEARNER_TEXT = /sourceFact|review-only|runtimeRegistered|generator|qualification gate|truth authority|NCERT/i;
const BANNED_STEM_TEXT = /associated with|described as|in the context of|with reference to the above|what is a key feature|which is correct\?|which statement is correct\?|what broad effect can it have|which climate control best explains/i;

export function auditGeoCli001Cp004ReviewBatchV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const stems = new Set<string>();
  const semantics = new Set<string>();
  const explanations = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoCli001Cp004Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];
  const hardAnswers = new Set<string>();
  let statementStemCount = 0;

  for (const question of GEO_CLI_001_CP004_REVIEW_BATCH_V1) {
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

  if (GEO_CLI_001_CP004_REVIEW_BATCH_V1.length !== 54) issues.push(`COUNT:${GEO_CLI_001_CP004_REVIEW_BATCH_V1.length}`);
  if (stems.size !== 54) issues.push(`STEM_COUNT:${stems.size}`);
  if (semantics.size !== 54) issues.push(`SEMANTIC_COUNT:${semantics.size}`);
  if (explanations.size !== 54) issues.push(`EXPLANATION_COUNT:${explanations.size}`);
  if (statementStemCount > 10) issues.push(`STATEMENT_STEM_OVERUSE:${statementStemCount}`);
  for (let i = 28; i <= 36; i += 1) {
    const qlId = `GEO-CLI-001-QL-${String(i).padStart(3, "0")}`;
    if (qlCounts[qlId] !== 6) issues.push(`QL_COUNT:${qlId}:${qlCounts[qlId] ?? 0}`);
  }
  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 6) {
    issues.push(`DIFFICULTY:${JSON.stringify(difficultyCounts)}`);
  }
  if (answerPositions.join(",") !== "14,14,13,13") issues.push(`ANSWER_POSITIONS:${answerPositions.join(",")}`);
  if (hardAnswers.size < 3) issues.push(`HARD_ANSWER_VARIETY:${hardAnswers.size}`);

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: GEO_CLI_001_CP004_REVIEW_BATCH_V1.length,
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

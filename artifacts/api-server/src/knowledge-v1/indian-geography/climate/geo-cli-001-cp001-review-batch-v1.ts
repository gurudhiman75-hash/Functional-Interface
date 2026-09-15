export type GeoCli001Difficulty = "Easy" | "Medium" | "Hard";

export interface GeoCli001Cp001Question {
  questionId: string;
  qlId: string;
  qlName: string;
  difficulty: GeoCli001Difficulty;
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

type Seed = {
  qlId: string;
  qlName: string;
  difficulty: GeoCli001Difficulty;
  stem: string;
  answer: string;
  distractors: readonly [string, string, string];
  explanation: string;
};

const SOURCE_ID = "NCERT-CONTEMPORARY-INDIA-I-CLIMATE";

const SEEDS: readonly Seed[] = [
  { qlId: "GEO-CLI-001-QL-001", qlName: "Monsoon-type climate and seasonal character", difficulty: "Easy", stem: "Which broad climate type is found over most of India?", answer: "Monsoon type", distractors: ["Mediterranean type", "Tundra type", "Equatorial type"], explanation: "India has a monsoon-type climate, marked by strong seasonal changes in winds and rainfall." },
  { qlId: "GEO-CLI-001-QL-001", qlName: "Monsoon-type climate and seasonal character", difficulty: "Easy", stem: "What is a key feature of India's monsoon climate?", answer: "Seasonal reversal of winds", distractors: ["Same wind direction all year", "Rainfall only from winter winds", "No seasonal change in pressure"], explanation: "A major feature of the monsoon system is the seasonal reversal of the prevailing winds." },
  { qlId: "GEO-CLI-001-QL-001", qlName: "Monsoon-type climate and seasonal character", difficulty: "Easy", stem: "Which statement best describes the seasonal nature of India's climate?", answer: "Wind and rainfall patterns change strongly with the seasons", distractors: ["Temperature stays nearly the same everywhere", "Rain falls equally in every month", "Winds remain fixed throughout the year"], explanation: "India's monsoon climate shows clear seasonal changes in winds, temperature and rainfall." },
  { qlId: "GEO-CLI-001-QL-001", qlName: "Monsoon-type climate and seasonal character", difficulty: "Easy", stem: "A climate with a marked seasonal change in wind direction is called what in the Indian context?", answer: "Monsoon climate", distractors: ["Polar climate", "Steppe climate", "Mediterranean climate"], explanation: "The term monsoon climate is used for the seasonal wind system that dominates India's climate." },
  { qlId: "GEO-CLI-001-QL-001", qlName: "Monsoon-type climate and seasonal character", difficulty: "Easy", stem: "Which pair is correctly matched?", answer: "India — monsoon-type climate", distractors: ["India — tundra climate", "India — equatorial climate throughout", "India — Mediterranean climate throughout"], explanation: "India is commonly described as having a monsoon-type climate." },
  { qlId: "GEO-CLI-001-QL-001", qlName: "Monsoon-type climate and seasonal character", difficulty: "Easy", stem: "Consider these statements about India's climate: I. Seasonal wind changes are important. II. Rainfall has a strong seasonal pattern. Which is correct?", answer: "Both I and II", distractors: ["I only", "II only", "Neither I nor II"], explanation: "Both statements describe basic features of India's monsoon climate." },

  { qlId: "GEO-CLI-001-QL-002", qlName: "Latitude and the Tropic of Cancer", difficulty: "Easy", stem: "Which important latitude passes roughly through the middle of India?", answer: "Tropic of Cancer", distractors: ["Equator", "Arctic Circle", "Tropic of Capricorn"], explanation: "The Tropic of Cancer passes roughly through the middle of India." },
  { qlId: "GEO-CLI-001-QL-002", qlName: "Latitude and the Tropic of Cancer", difficulty: "Easy", stem: "The Tropic of Cancer divides India broadly into which two climatic zones?", answer: "Tropical south and subtropical north", distractors: ["Polar south and tropical north", "Temperate south and polar north", "Equatorial north and tundra south"], explanation: "Areas south of the Tropic of Cancer are broadly tropical, while much of the north has subtropical influence." },
  { qlId: "GEO-CLI-001-QL-002", qlName: "Latitude and the Tropic of Cancer", difficulty: "Easy", stem: "Why does latitude affect temperature across India?", answer: "It changes the angle and intensity of incoming sunlight", distractors: ["It changes the height of mountains", "It fixes the direction of all rivers", "It removes the effect of the sea"], explanation: "Latitude changes the angle at which sunlight reaches the surface, so it influences temperature." },
  { qlId: "GEO-CLI-001-QL-002", qlName: "Latitude and the Tropic of Cancer", difficulty: "Easy", stem: "Which part of India receives more direct solar heating for much of the year?", answer: "The southern part", distractors: ["The far northern mountains only", "Only the western coast", "Only the eastern coast"], explanation: "Lower latitudes in southern India receive more direct solar heating for much of the year." },
  { qlId: "GEO-CLI-001-QL-002", qlName: "Latitude and the Tropic of Cancer", difficulty: "Easy", stem: "Which climate control helps explain the north-south difference in solar heating across India?", answer: "Latitude", distractors: ["Soil type", "River length", "Population density"], explanation: "Latitude is the main control behind broad north-south differences in solar heating." },
  { qlId: "GEO-CLI-001-QL-002", qlName: "Latitude and the Tropic of Cancer", difficulty: "Easy", stem: "Consider these statements: I. The Tropic of Cancer passes through India. II. Latitude helps create broad temperature differences from south to north. Which is correct?", answer: "Both I and II", distractors: ["I only", "II only", "Neither I nor II"], explanation: "Both statements are correct: the Tropic crosses India and latitude affects temperature." },

  { qlId: "GEO-CLI-001-QL-003", qlName: "Altitude and temperature", difficulty: "Easy", stem: "What usually happens to air temperature as altitude increases?", answer: "It decreases", distractors: ["It always increases", "It remains fixed", "It depends only on longitude"], explanation: "Temperature generally decreases with height, so higher places are usually cooler." },
  { qlId: "GEO-CLI-001-QL-003", qlName: "Altitude and temperature", difficulty: "Easy", stem: "Why are hill areas generally cooler than nearby plains?", answer: "They are at a higher altitude", distractors: ["They are always nearer the sea", "They receive no sunlight", "They lie south of the Tropic of Cancer"], explanation: "Higher altitude is the main reason hill areas are usually cooler than nearby plains." },
  { qlId: "GEO-CLI-001-QL-003", qlName: "Altitude and temperature", difficulty: "Easy", stem: "Which climate control best explains cooler conditions at high elevations?", answer: "Altitude", distractors: ["Latitude alone", "Ocean currents alone", "Distance from rivers"], explanation: "Altitude directly affects temperature because air becomes cooler with height." },
  { qlId: "GEO-CLI-001-QL-003", qlName: "Altitude and temperature", difficulty: "Easy", stem: "Two places are at nearly the same latitude, but one is much higher. Which is likely to be cooler?", answer: "The higher place", distractors: ["The lower place", "Both must have the same temperature", "The place with more roads"], explanation: "When latitude is similar, the higher place is usually cooler because temperature falls with altitude." },
  { qlId: "GEO-CLI-001-QL-003", qlName: "Altitude and temperature", difficulty: "Easy", stem: "Which statement about altitude is correct?", answer: "Higher elevation generally means lower temperature", distractors: ["Higher elevation always means more rainfall", "Altitude has no effect on climate", "Lower elevation always has snow"], explanation: "The clearest climatic effect of altitude is a fall in temperature with increasing height." },
  { qlId: "GEO-CLI-001-QL-003", qlName: "Altitude and temperature", difficulty: "Easy", stem: "A mountain station is cooler than a nearby lowland mainly because of which factor?", answer: "Elevation above sea level", distractors: ["Longitude", "Soil colour", "Length of daylight alone"], explanation: "Its greater elevation lowers temperature compared with the nearby lowland." },

  { qlId: "GEO-CLI-001-QL-004", qlName: "Distance from sea and continental effect", difficulty: "Medium", stem: "Which area usually has a smaller annual temperature range?", answer: "A coastal area", distractors: ["A far inland area", "A desert interior", "A high plateau far from the sea"], explanation: "The sea heats and cools slowly, so coastal areas usually have a more moderate temperature range." },
  { qlId: "GEO-CLI-001-QL-004", qlName: "Distance from sea and continental effect", difficulty: "Medium", stem: "Why do inland areas often have greater temperature extremes than coastal areas?", answer: "They receive less moderating influence from the sea", distractors: ["They are always at higher latitude", "They are always at higher altitude", "They receive no winds"], explanation: "Farther inland, the sea has less effect, so summers and winters can be more extreme." },
  { qlId: "GEO-CLI-001-QL-004", qlName: "Distance from sea and continental effect", difficulty: "Medium", stem: "Which climate control best explains moderate temperatures near the coast?", answer: "Distance from the sea", distractors: ["River direction", "Rock type", "Population density"], explanation: "Proximity to the sea moderates temperature because water changes temperature more slowly than land." },
  { qlId: "GEO-CLI-001-QL-004", qlName: "Distance from sea and continental effect", difficulty: "Medium", stem: "Which statement is correct?", answer: "Coastal areas are generally more equable than inland areas", distractors: ["Inland areas are always cooler than coasts", "Coasts always have the largest temperature range", "Distance from sea affects only rainfall, never temperature"], explanation: "Coastal areas usually have smaller temperature swings because of the sea's moderating effect." },
  { qlId: "GEO-CLI-001-QL-004", qlName: "Distance from sea and continental effect", difficulty: "Medium", stem: "A place has hot summers and cold winters compared with a coastal place at similar latitude. Which factor best explains this?", answer: "Continental effect", distractors: ["Oceanic moderation", "Higher humidity alone", "Shorter day length"], explanation: "A place far from the sea shows a stronger continental effect and larger temperature extremes." },
  { qlId: "GEO-CLI-001-QL-004", qlName: "Distance from sea and continental effect", difficulty: "Medium", stem: "Consider these statements: I. The sea reduces temperature extremes near the coast. II. Inland locations usually feel weaker marine influence. Which is correct?", answer: "Both I and II", distractors: ["I only", "II only", "Neither I nor II"], explanation: "Both statements describe how distance from the sea affects climate." },

  { qlId: "GEO-CLI-001-QL-005", qlName: "Himalayan barrier effect", difficulty: "Medium", stem: "Which mountain system helps block very cold winds from Central Asia from entering India?", answer: "The Himalayas", distractors: ["The Aravalis", "The Eastern Ghats", "The Satpuras"], explanation: "The Himalayas form a high barrier that limits the entry of very cold winds from Central Asia." },
  { qlId: "GEO-CLI-001-QL-005", qlName: "Himalayan barrier effect", difficulty: "Medium", stem: "How do the Himalayas influence winter conditions in northern India?", answer: "They reduce the direct effect of cold Central Asian winds", distractors: ["They make all of India equally cold", "They remove all winter rainfall", "They keep every northern area snow-free"], explanation: "The Himalayan barrier protects much of northern India from extremely cold continental winds." },
  { qlId: "GEO-CLI-001-QL-005", qlName: "Himalayan barrier effect", difficulty: "Medium", stem: "Which statement about the Himalayas and climate is correct?", answer: "They act as a major climatic barrier", distractors: ["They have no effect on winds", "They only affect coastal temperatures", "They cause the sea to warm"], explanation: "Their great height makes the Himalayas an important climatic barrier for the subcontinent." },
  { qlId: "GEO-CLI-001-QL-005", qlName: "Himalayan barrier effect", difficulty: "Medium", stem: "Besides blocking cold winds, what important effect do the Himalayas have on moisture-bearing winds?", answer: "They obstruct and lift them", distractors: ["They permanently stop all winds", "They turn every wind westward", "They remove moisture before winds reach India"], explanation: "The mountains obstruct moisture-bearing winds and force air to rise, helping rainfall over suitable slopes and regions." },
  { qlId: "GEO-CLI-001-QL-005", qlName: "Himalayan barrier effect", difficulty: "Medium", stem: "Which climate control is shown when a high mountain chain blocks air movement?", answer: "Relief barrier", distractors: ["Latitude", "Distance from sea", "Ocean current"], explanation: "A mountain barrier is a relief control because topography changes the movement of air." },
  { qlId: "GEO-CLI-001-QL-005", qlName: "Himalayan barrier effect", difficulty: "Medium", stem: "Consider these statements: I. The Himalayas shield India from very cold Central Asian winds. II. They also influence the path and uplift of moisture-bearing winds. Which is correct?", answer: "Both I and II", distractors: ["I only", "II only", "Neither I nor II"], explanation: "Both are major ways in which the Himalayas influence India's climate." },

  { qlId: "GEO-CLI-001-QL-006", qlName: "Western Ghats and rain-shadow effect", difficulty: "Medium", stem: "Which side of the Western Ghats generally receives heavier rain from moisture-laden winds from the Arabian Sea?", answer: "The western windward side", distractors: ["The eastern leeward side", "Both sides always receive equal rain", "Only the northern end"], explanation: "Moist winds rise along the western slopes, cool and give heavier rain on the windward side." },
  { qlId: "GEO-CLI-001-QL-006", qlName: "Western Ghats and rain-shadow effect", difficulty: "Medium", stem: "Why is the interior east of the Western Ghats drier than the western slopes in many areas?", answer: "It lies in a rain-shadow zone", distractors: ["It is always farther north", "It receives no sunlight", "It is below sea level"], explanation: "After losing moisture on the windward slopes, descending air gives less rain on the leeward side." },
  { qlId: "GEO-CLI-001-QL-006", qlName: "Western Ghats and rain-shadow effect", difficulty: "Medium", stem: "Which landform is most directly linked with a major rain-shadow effect in peninsular India?", answer: "Western Ghats", distractors: ["Northern Plains", "Thar Desert only", "Ganga Delta"], explanation: "The Western Ghats create a clear contrast between wetter western slopes and drier leeward interiors." },
  { qlId: "GEO-CLI-001-QL-006", qlName: "Western Ghats and rain-shadow effect", difficulty: "Medium", stem: "What happens when moisture-laden air is forced up the Western Ghats?", answer: "It cools and produces rain on the windward side", distractors: ["It becomes permanently dry before rising", "It stops moving completely", "It warms and loses all clouds immediately"], explanation: "Rising moist air cools, condenses and produces orographic rain on the windward slopes." },
  { qlId: "GEO-CLI-001-QL-006", qlName: "Western Ghats and rain-shadow effect", difficulty: "Medium", stem: "Which pair is correctly matched?", answer: "Leeward side of Western Ghats — lower rainfall", distractors: ["Windward side of Western Ghats — rain shadow", "Leeward side — maximum uplift rainfall", "Western Ghats — no effect on rainfall"], explanation: "The leeward side receives less rainfall because it lies behind the mountain barrier." },
  { qlId: "GEO-CLI-001-QL-006", qlName: "Western Ghats and rain-shadow effect", difficulty: "Medium", stem: "Consider these statements: I. The western slopes of the Western Ghats are windward to Arabian Sea moisture. II. Areas to the east can lie in rain shadow. Which is correct?", answer: "Both I and II", distractors: ["I only", "II only", "Neither I nor II"], explanation: "Both statements explain the rainfall contrast created by the Western Ghats." },

  { qlId: "GEO-CLI-001-QL-007", qlName: "Pressure and seasonal wind response", difficulty: "Medium", stem: "Air generally moves from which pressure area to which pressure area?", answer: "High pressure to low pressure", distractors: ["Low pressure to high pressure", "East to west only", "Sea to land in every season"], explanation: "Wind is driven by pressure differences and generally moves from higher toward lower pressure." },
  { qlId: "GEO-CLI-001-QL-007", qlName: "Pressure and seasonal wind response", difficulty: "Medium", stem: "Why can seasonal pressure changes alter wind direction over India?", answer: "Winds respond to changing pressure differences", distractors: ["Pressure never affects wind", "Only mountains control wind direction", "Latitude fixes wind direction for the whole year"], explanation: "As pressure patterns change with the seasons, the direction of prevailing winds can also change." },
  { qlId: "GEO-CLI-001-QL-007", qlName: "Pressure and seasonal wind response", difficulty: "Medium", stem: "During strong summer heating, land tends to develop what kind of pressure near the surface compared with cooler surroundings?", answer: "Lower pressure", distractors: ["Higher pressure", "No pressure difference", "Permanent polar pressure"], explanation: "Strong heating makes air rise and helps create lower surface pressure over hot land." },
  { qlId: "GEO-CLI-001-QL-007", qlName: "Pressure and seasonal wind response", difficulty: "Medium", stem: "During cooler winter conditions, the land tends to develop relatively what kind of surface pressure?", answer: "Higher pressure", distractors: ["Lower pressure only", "No pressure system", "Equatorial low pressure"], explanation: "Cooler, denser air over land supports relatively higher surface pressure in winter." },
  { qlId: "GEO-CLI-001-QL-007", qlName: "Pressure and seasonal wind response", difficulty: "Medium", stem: "Which climate control directly links seasonal heating with changing wind flow?", answer: "Pressure and wind system", distractors: ["River drainage", "Soil texture", "Natural vegetation"], explanation: "Seasonal heating changes pressure patterns, and those pressure differences influence wind flow." },
  { qlId: "GEO-CLI-001-QL-007", qlName: "Pressure and seasonal wind response", difficulty: "Medium", stem: "Consider these statements: I. Pressure differences help drive winds. II. Seasonal changes in pressure can help reverse prevailing winds. Which is correct?", answer: "Both I and II", distractors: ["I only", "II only", "Neither I nor II"], explanation: "Both statements describe the basic pressure-wind link behind seasonal wind changes." },

  { qlId: "GEO-CLI-001-QL-008", qlName: "Relief and orographic rainfall", difficulty: "Medium", stem: "What is rainfall caused when moist air is forced to rise over a mountain barrier called?", answer: "Orographic rainfall", distractors: ["Convectional rainfall only", "Frontal snowfall only", "Groundwater rainfall"], explanation: "When moist air rises over relief, it cools and can produce orographic rainfall." },
  { qlId: "GEO-CLI-001-QL-008", qlName: "Relief and orographic rainfall", difficulty: "Medium", stem: "Which side of a mountain usually receives more orographic rain?", answer: "Windward side", distractors: ["Leeward side", "Both sides equally in all cases", "The side farthest from incoming winds"], explanation: "The windward side faces the moist air, which rises, cools and gives more rain." },
  { qlId: "GEO-CLI-001-QL-008", qlName: "Relief and orographic rainfall", difficulty: "Medium", stem: "What commonly develops on the leeward side of a high mountain barrier?", answer: "Rain-shadow area", distractors: ["Permanent cyclone belt", "Ocean current", "Tidal plain"], explanation: "Descending air on the leeward side is drier, producing a rain-shadow effect." },
  { qlId: "GEO-CLI-001-QL-008", qlName: "Relief and orographic rainfall", difficulty: "Medium", stem: "Why does the direction of a mountain range matter for rainfall?", answer: "It affects whether moist winds are forced to rise", distractors: ["It changes Earth's latitude", "It determines sea temperature everywhere", "It fixes the length of seasons"], explanation: "Relief has a stronger rainfall effect when it stands across the path of moisture-bearing winds." },
  { qlId: "GEO-CLI-001-QL-008", qlName: "Relief and orographic rainfall", difficulty: "Medium", stem: "Which climate control best explains sharp rainfall differences across a mountain range?", answer: "Relief", distractors: ["Longitude", "Population", "Soil colour"], explanation: "Relief changes air movement, creating wetter windward slopes and drier leeward areas." },
  { qlId: "GEO-CLI-001-QL-008", qlName: "Relief and orographic rainfall", difficulty: "Medium", stem: "Consider these statements: I. Moist air cools as it rises over high relief. II. The leeward side can receive less rain. Which is correct?", answer: "Both I and II", distractors: ["I only", "II only", "Neither I nor II"], explanation: "Both statements describe the basic process of orographic rainfall and rain shadow." },

  { qlId: "GEO-CLI-001-QL-009", qlName: "Combined climate-control reasoning", difficulty: "Hard", stem: "A coastal highland is cooler than a nearby coastal plain and also receives heavy windward rain. Which controls explain both differences?", answer: "Altitude and relief", distractors: ["Latitude and soil", "Distance from sea and longitude", "Ocean current and population"], explanation: "Altitude explains the cooler highland, while relief explains the uplift and heavier windward rain." },
  { qlId: "GEO-CLI-001-QL-009", qlName: "Combined climate-control reasoning", difficulty: "Hard", stem: "An inland place has a larger temperature range than a coastal place, while a nearby hill station is cooler than both. Which controls are involved?", answer: "Distance from sea and altitude", distractors: ["Latitude and soil", "Ocean current and river length", "Relief and vegetation only"], explanation: "Distance from sea explains the larger inland temperature range, while altitude explains the cooler hill station." },
  { qlId: "GEO-CLI-001-QL-009", qlName: "Combined climate-control reasoning", difficulty: "Hard", stem: "Consider these statements: I. Latitude affects solar heating. II. Altitude affects temperature. III. Relief can create rain-shadow areas. Which is correct?", answer: "All three", distractors: ["I and II only", "II and III only", "I and III only"], explanation: "All three statements describe established controls of India's climate." },
  { qlId: "GEO-CLI-001-QL-009", qlName: "Combined climate-control reasoning", difficulty: "Hard", stem: "Consider these statements: I. Coastal areas usually have smaller temperature ranges than interiors. II. The Himalayas limit very cold Central Asian winds. III. Windward mountain slopes can receive more rain than leeward slopes. Which is correct?", answer: "All three", distractors: ["I and II only", "II and III only", "I and III only"], explanation: "All three are correct effects of distance from sea and relief on India's climate." },
  { qlId: "GEO-CLI-001-QL-009", qlName: "Combined climate-control reasoning", difficulty: "Hard", stem: "A region is far inland, lies at low elevation and is on the leeward side of a major mountain barrier. Which combination is most likely?", answer: "Larger temperature range and lower rainfall", distractors: ["Small temperature range and heavy windward rain", "Cool conditions from high altitude and heavy rain", "No seasonal temperature change and equal rain"], explanation: "An inland location has stronger temperature extremes, and a leeward location can receive less rainfall." },
  { qlId: "GEO-CLI-001-QL-009", qlName: "Combined climate-control reasoning", difficulty: "Hard", stem: "Which pair of controls best explains why a high coastal mountain slope can be cooler than a nearby coast and wetter than the interior behind it?", answer: "Altitude and relief", distractors: ["Latitude and distance from sea only", "Ocean current and longitude", "Pressure and soil type"], explanation: "Altitude lowers temperature, while relief forces moist air upward and can leave the interior in rain shadow." },
];

function rotateOptions(answer: string, distractors: readonly string[], correctIndex: number) {
  const options = [...distractors];
  options.splice(correctIndex, 0, answer);
  return Object.freeze(options);
}

export const GEO_CLI_001_CP001_REVIEW_BATCH_V1: readonly GeoCli001Cp001Question[] = Object.freeze(
  SEEDS.map((seed, index) => {
    const correctIndex = index % 4;
    return Object.freeze({
      questionId: `GEO-CLI-001-CP001-Q${String(index + 1).padStart(3, "0")}`,
      qlId: seed.qlId,
      qlName: seed.qlName,
      difficulty: seed.difficulty,
      stem: seed.stem,
      options: rotateOptions(seed.answer, seed.distractors, correctIndex),
      correctIndex,
      canonicalAnswer: seed.answer,
      explanation: seed.explanation,
      sourceIds: Object.freeze([SOURCE_ID]),
      sourceFactIds: Object.freeze([`GEO-CLI-001-FACT-${String(index + 1).padStart(3, "0")}`]),
      reviewOnly: true as const,
      runtimeRegistered: false as const,
    });
  }),
);

const BANNED_LEARNER_TEXT = /sourceFact|review-only|runtimeRegistered|generator|qualification gate|truth authority|NCERT/i;

export function auditGeoCli001Cp001ReviewBatchV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const semantics = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];
  const hardAnswers = new Set<string>();

  for (const question of GEO_CLI_001_CP001_REVIEW_BATCH_V1) {
    if (ids.has(question.questionId)) issues.push(`DUPLICATE_ID:${question.questionId}`);
    ids.add(question.questionId);
    const semanticKey = `${question.stem}::${question.canonicalAnswer}`;
    if (semantics.has(semanticKey)) issues.push(`DUPLICATE_SEMANTIC:${question.questionId}`);
    semantics.add(semanticKey);
    qlCounts[question.qlId] = (qlCounts[question.qlId] ?? 0) + 1;
    difficultyCounts[question.difficulty] += 1;
    answerPositions[question.correctIndex] += 1;
    if (question.difficulty === "Hard") hardAnswers.add(question.canonicalAnswer);
    if (question.options.length !== 4 || new Set(question.options).size !== 4) issues.push(`OPTIONS:${question.questionId}`);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`ANSWER:${question.questionId}`);
    if (!question.sourceIds.length || !question.sourceFactIds.length) issues.push(`PROVENANCE:${question.questionId}`);
    if (!question.reviewOnly || question.runtimeRegistered) issues.push(`LIFECYCLE:${question.questionId}`);
    if (question.explanation.trim().length < 40) issues.push(`SHORT_EXPLANATION:${question.questionId}`);
    if (question.stem.length > 260) issues.push(`LONG_STEM:${question.questionId}`);
    const learnerText = `${question.stem}\n${question.options.join("\n")}\n${question.explanation}`;
    if (BANNED_LEARNER_TEXT.test(learnerText)) issues.push(`META:${question.questionId}`);
  }

  if (GEO_CLI_001_CP001_REVIEW_BATCH_V1.length !== 54) issues.push(`COUNT:${GEO_CLI_001_CP001_REVIEW_BATCH_V1.length}`);
  if (semantics.size !== 54) issues.push(`SEMANTIC_COUNT:${semantics.size}`);
  for (let i = 1; i <= 9; i += 1) {
    const qlId = `GEO-CLI-001-QL-${String(i).padStart(3, "0")}`;
    if (qlCounts[qlId] !== 6) issues.push(`QL_COUNT:${qlId}:${qlCounts[qlId] ?? 0}`);
  }
  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 6) issues.push(`DIFFICULTY:${difficultyCounts.Easy}/${difficultyCounts.Medium}/${difficultyCounts.Hard}`);
  if (answerPositions.join(",") !== "14,14,13,13") issues.push(`ANSWER_POSITIONS:${answerPositions.join(",")}`);
  if (hardAnswers.size < 3) issues.push(`HARD_ANSWER_VARIETY:${hardAnswers.size}`);

  return { valid: issues.length === 0, issues, questionCount: GEO_CLI_001_CP001_REVIEW_BATCH_V1.length, semanticCount: semantics.size, qlCounts, difficultyCounts, answerPositions, hardAnswerVariety: hardAnswers.size };
}

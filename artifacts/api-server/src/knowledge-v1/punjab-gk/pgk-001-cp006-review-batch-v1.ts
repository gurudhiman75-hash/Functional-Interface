import type { KnowledgeV1Difficulty } from "../types";
import {
  PGK_001_CP006_FACT_IDS,
  PGK_001_CP006_SOURCE_IDS,
} from "./pgk-001-cp006-facts";

export type Pgk001Cp006ReviewQuestion = Readonly<{
  questionId: string;
  qlId: string;
  qlName: string;
  difficulty: KnowledgeV1Difficulty;
  stem: string;
  options: readonly string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  factIds: readonly string[];
  sourceIds: readonly string[];
  reviewOnly: true;
  runtimeRegistered: false;
}>;

export const PGK_001_CP006_QL_NAMES = Object.freeze({
  "PGK-001-QL-035": "Seasons and climate cycle",
  "PGK-001-QL-036": "Rainfall and temperature pattern",
  "PGK-001-QL-037": "Alluvial soils and floodplain terms",
  "PGK-001-QL-038": "South-western soil and groundwater conditions",
  "PGK-001-QL-039": "Soil and groundwater degradation",
  "PGK-001-QL-040": "Soil-water conservation relations",
  "PGK-001-QL-041": "Climate-soil-resource synthesis",
} as const);

type Row = Readonly<{
  difficulty: KnowledgeV1Difficulty;
  stem: string;
  canonical: string;
  options: readonly string[];
  explanation: string;
  factIds: readonly string[];
  sourceIds: readonly string[];
}>;

const climateSource = [PGK_001_CP006_SOURCE_IDS.knowPunjab] as const;
const soilSource = [PGK_001_CP006_SOURCE_IDS.psebClass9] as const;
const southwestSource = [PGK_001_CP006_SOURCE_IDS.pauSouthWest] as const;
const conservationSource = [PGK_001_CP006_SOURCE_IDS.soilWaterRti] as const;
const stressSources = [PGK_001_CP006_SOURCE_IDS.soilWaterRti, PGK_001_CP006_SOURCE_IDS.agriculturePolicy] as const;

const rowsByQl: Record<keyof typeof PGK_001_CP006_QL_NAMES, readonly Row[]> = {
  "PGK-001-QL-035": [
    {
      difficulty: "Easy",
      stem: "Punjab's main summer season generally extends from:",
      canonical: "Mid-April to the end of June",
      options: ["Mid-April to the end of June", "January to March", "July to September", "October to December"],
      explanation: "Punjab's main summer season runs roughly from mid-April to the end of June. This is the hottest part of the annual cycle.",
      factIds: ["summer-season"], sourceIds: climateSource,
    },
    {
      difficulty: "Easy",
      stem: "The main rainy season in Punjab generally lasts from:",
      canonical: "Early July to the end of September",
      options: ["Early July to the end of September", "October to December", "January to March", "Mid-April to June"],
      explanation: "Punjab receives most of its monsoon rain from early July to the end of September.",
      factIds: ["monsoon-season"], sourceIds: climateSource,
    },
    {
      difficulty: "Easy",
      stem: "Which month broadly marks the beginning of the winter season in Punjab?",
      canonical: "October",
      options: ["October", "July", "April", "June"],
      explanation: "Winter begins around October, with distinctly colder conditions developing from December onward.",
      factIds: ["winter-season"], sourceIds: climateSource,
    },
    {
      difficulty: "Medium",
      stem: "Which sequence correctly represents Punjab's broad seasonal cycle?",
      canonical: "Summer → Rainy season → Winter",
      options: ["Summer → Rainy season → Winter", "Winter → Summer → Rainy season", "Rainy season → Winter → Summer", "Summer → Winter → Rainy season"],
      explanation: "Punjab moves from the hot summer into the monsoon rainy season and then into winter.",
      factIds: ["summer-season", "monsoon-season", "winter-season"], sourceIds: climateSource,
    },
    {
      difficulty: "Medium",
      stem: "Punjab's winter becomes distinctly colder from around:",
      canonical: "December",
      options: ["December", "August", "May", "July"],
      explanation: "Although winter begins earlier, colder conditions become more pronounced from December onward.",
      factIds: ["winter-season"], sourceIds: climateSource,
    },
    {
      difficulty: "Hard",
      stem: "Consider the following statements about Punjab's seasons:\nI. Summer extends roughly from mid-April to the end of June.\nII. The rainy season is mainly from early July to the end of September.\nIII. Winter begins around October.\nWhich of the statements given above are correct?",
      canonical: "I, II and III",
      options: ["I only", "I and II only", "II and III only", "I, II and III"],
      explanation: "All three statements are correct and describe Punjab's broad seasonal cycle.",
      factIds: ["summer-season", "monsoon-season", "winter-season"], sourceIds: climateSource,
    },
  ],
  "PGK-001-QL-036": [
    {
      difficulty: "Easy",
      stem: "Which part of Punjab generally receives heavier rainfall?",
      canonical: "The Shivalik and Himalayan foothill side",
      options: ["The Shivalik and Himalayan foothill side", "The far south-western plains", "Only the central Malwa plain", "All parts receive the same rainfall"],
      explanation: "Rainfall is generally heavier near the Himalayan and Shivalik foothills and becomes lower away from them.",
      factIds: ["rainfall-gradient"], sourceIds: climateSource,
    },
    {
      difficulty: "Easy",
      stem: "Rainfall in Punjab generally decreases toward the:",
      canonical: "Southwest",
      options: ["Southwest", "Northeast foothills", "Shivalik hills", "Northern hill belt"],
      explanation: "Punjab becomes drier toward the southwest, while the foothill side receives more rainfall.",
      factIds: ["rainfall-gradient"], sourceIds: climateSource,
    },
    {
      difficulty: "Easy",
      stem: "Which description best fits Punjab's annual temperature pattern?",
      canonical: "Hot summers and cold winters",
      options: ["Hot summers and cold winters", "Cool summers and warm winters", "Almost no seasonal change", "Cold throughout the year"],
      explanation: "Punjab has a strongly continental temperature pattern, with very hot summers and cold winters.",
      factIds: ["temperature-extremes"], sourceIds: climateSource,
    },
    {
      difficulty: "Medium",
      stem: "Which pair is correctly matched?",
      canonical: "Northeast foothills — higher rainfall",
      options: ["Northeast foothills — higher rainfall", "Southwest — highest rainfall", "Foothill belt — driest part", "Southwest — coolest summers"],
      explanation: "The foothill side is wetter, while rainfall generally decreases toward the southwest.",
      factIds: ["rainfall-gradient"], sourceIds: climateSource,
    },
    {
      difficulty: "Medium",
      stem: "Compared with the foothill side, south-western Punjab is generally:",
      canonical: "Drier and hotter",
      options: ["Drier and hotter", "Wetter and cooler", "Equally wet and cooler", "Snowier and wetter"],
      explanation: "The southwest lies farther from the foothills and generally receives less rainfall, with higher heat during summer.",
      factIds: ["rainfall-gradient", "temperature-extremes"], sourceIds: climateSource,
    },
    {
      difficulty: "Hard",
      stem: "Consider the following statements:\nI. Rainfall is generally higher near Punjab's foothill belt.\nII. Rainfall tends to decrease toward the southwest.\nIII. Punjab experiences marked summer and winter temperature extremes.\nWhich of the statements given above are correct?",
      canonical: "I, II and III",
      options: ["I only", "I and II only", "II and III only", "I, II and III"],
      explanation: "All three statements are correct. They summarize Punjab's main rainfall and temperature pattern.",
      factIds: ["rainfall-gradient", "temperature-extremes"], sourceIds: climateSource,
    },
  ],
  "PGK-001-QL-037": [
    {
      difficulty: "Easy",
      stem: "The broad plains of Punjab are mainly covered by which type of soil?",
      canonical: "Alluvial soil",
      options: ["Alluvial soil", "Black cotton soil", "Laterite soil", "Mountain podzol"],
      explanation: "Punjab's plains are predominantly alluvial, formed from river-borne sediments.",
      factIds: ["alluvial-dominant"], sourceIds: soilSource,
    },
    {
      difficulty: "Easy",
      stem: "Bangar refers to:",
      canonical: "Older alluvium away from active floodplains",
      options: ["Older alluvium away from active floodplains", "New alluvium deposited by recent floods", "Rocky hill soil", "Wind-blown desert sand only"],
      explanation: "Bangar is older alluvium found on higher ground that is normally beyond regular river flooding.",
      factIds: ["bangar-old-alluvium"], sourceIds: soilSource,
    },
    {
      difficulty: "Easy",
      stem: "Khadar refers to which type of alluvium?",
      canonical: "Newer alluvium in low-lying floodplains",
      options: ["Newer alluvium in low-lying floodplains", "Old alluvium on higher ground", "Rocky foothill debris only", "Saline groundwater"],
      explanation: "Khadar is younger alluvium found close to rivers where floods can deposit fresh sediment.",
      factIds: ["khadar-new-alluvium"], sourceIds: soilSource,
    },
    {
      difficulty: "Medium",
      stem: "Which Punjab term is also used for low-lying Khadar floodplain tracts?",
      canonical: "Bet",
      options: ["Bet", "Bangar", "Kandi", "Bhabar"],
      explanation: "Bet is a Punjab term for low-lying river floodplain land formed by newer alluvium.",
      factIds: ["khadar-new-alluvium"], sourceIds: soilSource,
    },
    {
      difficulty: "Medium",
      stem: "Which soil relation is correctly matched?",
      canonical: "Bangar — old alluvium",
      options: ["Bangar — old alluvium", "Khadar — old alluvium", "Bet — upland old alluvium", "Alluvium — volcanic lava soil"],
      explanation: "Bangar is old alluvium, while Khadar or Bet refers to younger floodplain alluvium.",
      factIds: ["bangar-old-alluvium", "khadar-new-alluvium"], sourceIds: soilSource,
    },
    {
      difficulty: "Hard",
      stem: "Consider the following statements:\nI. Bangar is older alluvium.\nII. Khadar is newer alluvium.\nIII. Bet refers to low-lying river floodplains in Punjab.\nWhich of the statements given above are correct?",
      canonical: "I, II and III",
      options: ["I only", "I and II only", "II and III only", "I, II and III"],
      explanation: "All three are correct. Bangar is older upland alluvium, while Khadar or Bet is younger floodplain alluvium.",
      factIds: ["bangar-old-alluvium", "khadar-new-alluvium"], sourceIds: soilSource,
    },
  ],
  "PGK-001-QL-038": [
    {
      difficulty: "Easy",
      stem: "Soils in parts of south-western Punjab are commonly:",
      canonical: "Alkaline in reaction",
      options: ["Alkaline in reaction", "Strongly acidic throughout", "Volcanic in origin", "Permanently water-saturated everywhere"],
      explanation: "Parts of south-western Punjab have alkaline soils, often with a soil reaction above neutral pH.",
      factIds: ["southwest-alkaline"], sourceIds: southwestSource,
    },
    {
      difficulty: "Easy",
      stem: "Sub-soil water in parts of south-western Punjab is often:",
      canonical: "Brackish or saline",
      options: ["Brackish or saline", "Fresh glacial water everywhere", "Naturally distilled", "Completely absent"],
      explanation: "Some south-western tracts have brackish or saline groundwater, which can limit its use for irrigation.",
      factIds: ["southwest-brackish-water"], sourceIds: southwestSource,
    },
    {
      difficulty: "Medium",
      stem: "Which combination is most characteristic of parts of south-western Punjab?",
      canonical: "Alkaline soils and brackish groundwater",
      options: ["Alkaline soils and brackish groundwater", "Acidic soils and heavy snowfall", "Peaty soils and permanent marshes", "Volcanic soils and fresh springs"],
      explanation: "Alkaline soil conditions and brackish groundwater occur together in parts of the southwest.",
      factIds: ["southwest-alkaline", "southwest-brackish-water"], sourceIds: southwestSource,
    },
    {
      difficulty: "Medium",
      stem: "Why can brackish groundwater be unsuitable for direct irrigation?",
      canonical: "It contains excessive dissolved salts",
      options: ["It contains excessive dissolved salts", "It is always too cold", "It contains no minerals", "It evaporates before reaching fields"],
      explanation: "Brackish water contains higher dissolved salts, which can damage sensitive crops and worsen soil salinity.",
      factIds: ["southwest-brackish-water", "brackish-groundwater"], sourceIds: southwestSource,
    },
    {
      difficulty: "Medium",
      stem: "Which soil condition typically has a pH above 7?",
      canonical: "Alkaline soil",
      options: ["Alkaline soil", "Strongly acidic soil", "Peat soil", "Podzol soil"],
      explanation: "A pH above 7 indicates an alkaline reaction. Some south-western Punjab soils show this condition.",
      factIds: ["southwest-alkaline"], sourceIds: southwestSource,
    },
    {
      difficulty: "Hard",
      stem: "Consider the following statements about parts of south-western Punjab:\nI. Soils can be alkaline.\nII. Sub-soil water can be brackish or saline.\nIII. Such groundwater may be unsuitable for direct irrigation.\nWhich of the statements given above are correct?",
      canonical: "I, II and III",
      options: ["I only", "I and II only", "II and III only", "I, II and III"],
      explanation: "All three statements are correct and describe an important soil-water problem of the south-western zone.",
      factIds: ["southwest-alkaline", "southwest-brackish-water"], sourceIds: southwestSource,
    },
  ],
  "PGK-001-QL-039": [
    {
      difficulty: "Easy",
      stem: "Excessive pumping of groundwater can lead to:",
      canonical: "A falling water table",
      options: ["A falling water table", "Permanent rise in rainfall", "Formation of mountains", "Conversion of all soil into clay"],
      explanation: "When groundwater is withdrawn faster than it is replenished, the water table can fall.",
      factIds: ["groundwater-overuse"], sourceIds: stressSources,
    },
    {
      difficulty: "Easy",
      stem: "Waterlogging occurs when:",
      canonical: "The water table rises close to the soil surface",
      options: ["The water table rises close to the soil surface", "Rainfall stops completely", "Soil becomes volcanic", "Groundwater disappears entirely"],
      explanation: "Waterlogging develops when excess water keeps the water table too close to the root zone and reduces soil aeration.",
      factIds: ["waterlogging"], sourceIds: stressSources,
    },
    {
      difficulty: "Easy",
      stem: "Salt-affected soil is harmful mainly because:",
      canonical: "Excess salts reduce soil productivity",
      options: ["Excess salts reduce soil productivity", "It always increases rainfall", "It creates new river channels", "It removes all clay particles"],
      explanation: "High salt or alkalinity levels interfere with plant growth and reduce soil productivity.",
      factIds: ["salt-affected-soils"], sourceIds: stressSources,
    },
    {
      difficulty: "Medium",
      stem: "Which problem directly removes fertile topsoil?",
      canonical: "Soil erosion",
      options: ["Soil erosion", "Groundwater recharge", "Rainwater harvesting", "Land levelling"],
      explanation: "Soil erosion strips away the fertile upper layer, especially where runoff is strong.",
      factIds: ["soil-erosion"], sourceIds: stressSources,
    },
    {
      difficulty: "Medium",
      stem: "Which pair is incorrectly matched?",
      canonical: "Groundwater over-extraction — rising water table everywhere",
      options: ["Groundwater over-extraction — rising water table everywhere", "Waterlogging — poor root-zone aeration", "Soil erosion — loss of topsoil", "Salinity — reduced soil productivity"],
      explanation: "Over-extraction generally lowers groundwater levels; it does not cause the water table to rise everywhere.",
      factIds: ["groundwater-overuse", "waterlogging", "soil-erosion", "salt-affected-soils"], sourceIds: stressSources,
    },
    {
      difficulty: "Hard",
      stem: "Consider the following resource problems:\nI. Falling groundwater levels from excessive pumping.\nII. Waterlogging where the water table becomes too shallow.\nIII. Salt-affected soils that reduce productivity.\nWhich of these can occur in different parts of Punjab?",
      canonical: "I, II and III",
      options: ["I only", "I and II only", "II and III only", "I, II and III"],
      explanation: "All three problems occur in different settings. Punjab can face groundwater decline in one area and waterlogging or salinity in another.",
      factIds: ["groundwater-overuse", "waterlogging", "salt-affected-soils"], sourceIds: stressSources,
    },
  ],
  "PGK-001-QL-040": [
    {
      difficulty: "Easy",
      stem: "Which measure is most directly used to remove excess water from a field?",
      canonical: "Field drainage",
      options: ["Field drainage", "Contour bunding", "Drip irrigation", "Land levelling"],
      explanation: "Field drainage removes excess water and is useful where waterlogging is a problem.",
      factIds: ["field-drainage"], sourceIds: conservationSource,
    },
    {
      difficulty: "Easy",
      stem: "Which irrigation method applies water close to the plant root zone?",
      canonical: "Drip irrigation",
      options: ["Drip irrigation", "Contour bunding", "Field drainage", "Deep ploughing"],
      explanation: "Drip irrigation delivers water near the root zone and improves water-use efficiency.",
      factIds: ["drip-irrigation"], sourceIds: conservationSource,
    },
    {
      difficulty: "Easy",
      stem: "Rainwater harvesting helps mainly by:",
      canonical: "Storing runoff for later use",
      options: ["Storing runoff for later use", "Increasing soil salinity", "Lowering every river permanently", "Removing all groundwater"],
      explanation: "Rainwater harvesting captures runoff so it can be stored or reused instead of being lost quickly.",
      factIds: ["rainwater-harvesting"], sourceIds: conservationSource,
    },
    {
      difficulty: "Medium",
      stem: "Contour bunding is mainly useful for:",
      canonical: "Reducing runoff and soil erosion on slopes",
      options: ["Reducing runoff and soil erosion on slopes", "Increasing salinity", "Deepening groundwater extraction", "Creating river deltas"],
      explanation: "Contour bunds slow water moving downslope, helping reduce runoff and soil loss.",
      factIds: ["contour-bunding"], sourceIds: conservationSource,
    },
    {
      difficulty: "Medium",
      stem: "Which conservation measure improves uniform distribution of irrigation water across a field?",
      canonical: "Land levelling",
      options: ["Land levelling", "Field drainage", "Contour bunding", "Afforestation only"],
      explanation: "A level field allows irrigation water to spread more evenly and reduces avoidable losses.",
      factIds: ["land-levelling"], sourceIds: conservationSource,
    },
    {
      difficulty: "Hard",
      stem: "Which conservation pair is correctly matched?",
      canonical: "Watershed treatment — reducing runoff and erosion",
      options: ["Watershed treatment — reducing runoff and erosion", "Field drainage — increasing waterlogging", "Drip irrigation — increasing water loss", "Rainwater harvesting — removing stored water"],
      explanation: "Watershed treatment slows runoff, reduces erosion and improves local water conservation.",
      factIds: ["watershed-treatment"], sourceIds: conservationSource,
    },
  ],
  "PGK-001-QL-041": [
    {
      difficulty: "Hard",
      stem: "Which combination is correctly matched?",
      canonical: "Foothill side — higher rainfall; southwest — drier conditions",
      options: ["Foothill side — higher rainfall; southwest — drier conditions", "Foothill side — driest; southwest — wettest", "Southwest — heavy snowfall; foothills — desert climate", "All Punjab — identical rainfall"],
      explanation: "Rainfall is generally higher toward the foothills and lower toward the southwest.",
      factIds: ["rainfall-gradient"], sourceIds: climateSource,
    },
    {
      difficulty: "Hard",
      stem: "Which sequence correctly matches each soil term with its setting?",
      canonical: "Bangar — older alluvium; Khadar/Bet — newer floodplain alluvium",
      options: ["Bangar — older alluvium; Khadar/Bet — newer floodplain alluvium", "Bangar — new floodplain alluvium; Khadar — old upland soil", "Bet — mountain rock; Bangar — marsh soil", "Khadar — volcanic soil; Bangar — black soil"],
      explanation: "Bangar is older alluvium on higher ground, while Khadar or Bet is younger alluvium found in floodplains.",
      factIds: ["bangar-old-alluvium", "khadar-new-alluvium"], sourceIds: soilSource,
    },
    {
      difficulty: "Hard",
      stem: "Which resource problem and remedy are correctly matched?",
      canonical: "Waterlogging — field drainage",
      options: ["Waterlogging — field drainage", "Soil erosion — increased runoff", "Groundwater decline — more uncontrolled pumping", "Salinity — addition of more salts"],
      explanation: "Field drainage removes excess water and directly addresses waterlogging.",
      factIds: ["waterlogging", "field-drainage"], sourceIds: conservationSource,
    },
    {
      difficulty: "Hard",
      stem: "Which combination best describes parts of south-western Punjab?",
      canonical: "Lower rainfall, alkaline soils and brackish groundwater",
      options: ["Lower rainfall, alkaline soils and brackish groundwater", "Highest rainfall, acidic soils and fresh groundwater everywhere", "Snowfall, peat soil and permanent marshes", "Volcanic soil, glaciers and heavy rainfall"],
      explanation: "The southwest is generally drier, and some tracts also have alkaline soils and brackish groundwater.",
      factIds: ["rainfall-gradient", "southwest-alkaline", "southwest-brackish-water"], sourceIds: [PGK_001_CP006_SOURCE_IDS.knowPunjab, PGK_001_CP006_SOURCE_IDS.pauSouthWest],
    },
    {
      difficulty: "Hard",
      stem: "Consider the following statements:\nI. Punjab's plains are mainly alluvial.\nII. The foothill side generally receives more rainfall than the southwest.\nIII. Excessive groundwater extraction can lower the water table.\nWhich of the statements given above are correct?",
      canonical: "I, II and III",
      options: ["I only", "I and II only", "II and III only", "I, II and III"],
      explanation: "All three are correct and connect Punjab's soil, rainfall and groundwater-resource pattern.",
      factIds: ["alluvial-dominant", "rainfall-gradient", "groundwater-overuse"], sourceIds: [PGK_001_CP006_SOURCE_IDS.psebClass9, PGK_001_CP006_SOURCE_IDS.knowPunjab, PGK_001_CP006_SOURCE_IDS.agriculturePolicy],
    },
    {
      difficulty: "Hard",
      stem: "Consider the following pairs:\nI. Drip irrigation — efficient root-zone water application\nII. Contour bunding — reduced runoff on slopes\nIII. Rainwater harvesting — storage of runoff\nWhich of the pairs given above are correctly matched?",
      canonical: "I, II and III",
      options: ["I only", "I and II only", "II and III only", "I, II and III"],
      explanation: "All three pairs are correctly matched and represent practical soil-water conservation measures.",
      factIds: ["drip-irrigation", "contour-bunding", "rainwater-harvesting"], sourceIds: conservationSource,
    },
  ],
};

function buildQuestion(
  qlId: keyof typeof PGK_001_CP006_QL_NAMES,
  row: Row,
  index: number,
): Pgk001Cp006ReviewQuestion {
  const correctIndex = row.options.indexOf(row.canonical);
  if (correctIndex < 0) throw new Error(`${qlId} row ${index + 1} is missing its canonical answer`);
  return Object.freeze({
    questionId: `PGK-001-CP006-Q${String(index + 1).padStart(3, "0")}`,
    qlId,
    qlName: PGK_001_CP006_QL_NAMES[qlId],
    difficulty: row.difficulty,
    stem: row.stem,
    options: Object.freeze([...row.options]),
    correctIndex,
    canonicalAnswer: row.canonical,
    explanation: row.explanation,
    factIds: Object.freeze([...row.factIds]),
    sourceIds: Object.freeze([...row.sourceIds]),
    reviewOnly: true,
    runtimeRegistered: false,
  });
}

export const PGK_001_CP006_REVIEW_BATCH_V1: readonly Pgk001Cp006ReviewQuestion[] = Object.freeze(
  (Object.keys(PGK_001_CP006_QL_NAMES) as (keyof typeof PGK_001_CP006_QL_NAMES)[]).flatMap((qlId, qlIndex) =>
    rowsByQl[qlId].map((row, rowIndex) => buildQuestion(qlId, row, qlIndex * 6 + rowIndex)),
  ),
);

export function auditPgk001Cp006ReviewBatchV1() {
  const issues: string[] = [];
  const stems = new Set<string>();
  const qlCounts = new Map<string, number>();
  const validFactIds = new Set(PGK_001_CP006_FACT_IDS);
  const bannedLearnerPhrases = [
    "government of punjab",
    "pseb",
    "punjab agricultural university",
    "pau",
    "department of soil",
    "rti",
    "policy",
    "report",
    "website",
    "source",
    "the correct answer is",
    "the correct option",
    "the other options",
    "this question tests",
    "review batch",
    "generator",
    "identify it",
  ];

  for (const question of PGK_001_CP006_REVIEW_BATCH_V1) {
    const normalizedStem = question.stem.trim().toLowerCase().replace(/\s+/g, " ");
    const learnerText = `${question.stem} ${question.explanation}`.toLowerCase();
    if (stems.has(normalizedStem)) issues.push(`${question.questionId}: duplicate stem`);
    stems.add(normalizedStem);
    qlCounts.set(question.qlId, (qlCounts.get(question.qlId) ?? 0) + 1);

    if (question.options.length !== 4) issues.push(`${question.questionId}: expected four options`);
    if (new Set(question.options).size !== 4) issues.push(`${question.questionId}: options are not unique`);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`${question.questionId}: canonical answer/index mismatch`);
    if (!question.explanation.trim()) issues.push(`${question.questionId}: missing explanation`);
    if (question.sourceIds.length === 0) issues.push(`${question.questionId}: missing internal source authority`);
    if (!question.reviewOnly || question.runtimeRegistered) issues.push(`${question.questionId}: lifecycle guard broken`);
    for (const factId of question.factIds) if (!validFactIds.has(factId)) issues.push(`${question.questionId}: unknown fact id ${factId}`);
    for (const phrase of bannedLearnerPhrases) if (learnerText.includes(phrase)) issues.push(`${question.questionId}: learner-facing banned phrase: ${phrase}`);
  }

  for (const qlId of Object.keys(PGK_001_CP006_QL_NAMES)) {
    if (qlCounts.get(qlId) !== 6) issues.push(`${qlId}: expected six review questions`);
  }

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: PGK_001_CP006_REVIEW_BATCH_V1.length,
  });
}

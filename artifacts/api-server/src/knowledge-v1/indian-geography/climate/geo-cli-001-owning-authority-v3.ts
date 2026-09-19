import {
  GEO_CLI_001_OWNING_AUTHORITY_V2,
  type GeoCli001OwningDifficulty,
  type GeoCli001OwningQuestionV2,
} from "./geo-cli-001-owning-authority-v2";

type QualityPatch = Readonly<{
  stem: string;
  canonicalAnswer: string;
  options: readonly string[];
  explanation: string;
}>;

const QUALITY_PATCHES_V3: Readonly<Record<string, QualityPatch>> = Object.freeze({
  "GEO-CLI-001-CP007-Q049": {
    "stem": "Region A receives about 220 cm of annual rainfall with low year-to-year variability, while Region B receives about 40 cm with very high variability. Which conclusion is most reasonable?",
    "canonicalAnswer": "Region A has more dependable rainfall; Region B faces greater rainfall uncertainty",
    "options": [
      "Region A has more dependable rainfall; Region B faces greater rainfall uncertainty",
      "Region A is drier and more variable; Region B is wetter and steadier",
      "Both regions have similar rainfall reliability because only the annual total matters",
      "Region B is more dependable because lower rainfall always means lower variability"
    ],
    "explanation": "Higher-rainfall regions generally show lower relative variability, while very dry regions often show much greater year-to-year variability. Region B therefore faces the greater risk of rainfall shortfall."
  },
  "GEO-CLI-001-CP007-Q053": {
    "stem": "A district lies first in a 150 cm rainfall zone, then in a 70 cm zone, and finally in a 40 cm zone. Which change in rainfall reliability is generally expected along this sequence?",
    "canonicalAnswer": "Rainfall becomes less dependable as the amount falls and relative variability rises",
    "options": [
      "Rainfall becomes less dependable as the amount falls and relative variability rises",
      "Rainfall becomes more dependable because drier regions have lower variability",
      "Rainfall reliability remains unchanged because all three values are annual totals",
      "The 40 cm zone becomes the most reliable because it receives the least rainfall"
    ],
    "explanation": "India's rainfall pattern generally links wetter areas with lower relative variability and very dry areas with higher variability. Moving from 150 cm toward 40 cm therefore tends to increase rainfall uncertainty."
  },
  "GEO-CLI-001-CP010-Q012": {
    "stem": "A region is reached early by the southwest monsoon, receives heavy windward rain along the Western Ghats, and has a small annual temperature range. Which region best fits all three clues?",
    "canonicalAnswer": "Kerala's west coast",
    "options": [
      "Kerala's west coast",
      "Western Rajasthan",
      "Interior Deccan Plateau",
      "Punjab-Haryana plains"
    ],
    "explanation": "Kerala combines early southwest monsoon arrival, heavy orographic rain on the windward side of the Western Ghats, and strong maritime moderation of temperature."
  },
  "GEO-CLI-001-CP010-Q018": {
    "stem": "Why can the Tamil Nadu coast receive relatively little rain during the main southwest monsoon but substantial rain in October-November?",
    "canonicalAnswer": "Summer flow is less favourable, while retreating northeasterly winds gain moisture over the Bay of Bengal",
    "options": [
      "Summer flow is less favourable, while retreating northeasterly winds gain moisture over the Bay of Bengal",
      "Western disturbances replace the southwest monsoon and cross the Arabian Sea",
      "The coast becomes windward to the Western Ghats only during June-July",
      "Loo winds cross the Bay of Bengal and become the northeast monsoon"
    ],
    "explanation": "Tamil Nadu is comparatively less favoured by the main southwest monsoon. During the retreating season, northeasterly winds cross the Bay of Bengal, gain moisture, and can bring substantial rain to the coast."
  },
  "GEO-CLI-001-CP010-Q024": {
    "stem": "Moist Bay of Bengal winds approach the Khasi Hills and are forced to rise sharply. Which regional rainfall outcome is best explained by this combination?",
    "canonicalAnswer": "Very heavy orographic rainfall over Meghalaya, including the Mawsynram region",
    "options": [
      "Very heavy orographic rainfall over Meghalaya, including the Mawsynram region",
      "A major rain shadow over the windward Khasi slopes",
      "Persistent winter drought caused by western disturbances",
      "Low rainfall because the hills block all Bay moisture before uplift"
    ],
    "explanation": "The Khasi Hills force moisture-bearing monsoon air to rise rapidly. Strong orographic uplift produces exceptionally heavy rainfall over Meghalaya, including the Mawsynram area."
  },
  "GEO-CLI-001-CP010-Q036": {
    "stem": "The same Arabian Sea monsoon flow gives heavy rain on the west side of the Western Ghats but much less rain over the interior Deccan. Which chain explains the contrast?",
    "canonicalAnswer": "Windward uplift causes heavy rain, moisture is lost, and descending leeward air creates a rain shadow",
    "options": [
      "Windward uplift causes heavy rain, moisture is lost, and descending leeward air creates a rain shadow",
      "Leeward uplift increases moisture and makes the interior wetter than the coast",
      "Sea moderation alone creates both the west-coast rain and the Deccan dryness",
      "Western disturbances produce west-coast rain and then weaken over the plateau"
    ],
    "explanation": "Moist air rises along the western slopes and loses much of its moisture as rain. The air then descends on the eastern side, producing drier rain-shadow conditions over the interior Deccan."
  },
  "GEO-CLI-001-CP011-Q006": {
    "stem": "A northern station has relatively high pressure in January but develops intense heat, lower pressure and loo winds by May. Which seasonal transition does this show?",
    "canonicalAnswer": "Cold-weather high pressure changing to hot-weather thermal low conditions",
    "options": [
      "Cold-weather high pressure changing to hot-weather thermal low conditions",
      "Hot-weather low pressure changing directly to winter snowfall conditions",
      "Retreating-monsoon low pressure changing to permanent summer high pressure",
      "Southwest-monsoon rain changing to identical winter wind conditions"
    ],
    "explanation": "Northern India is relatively high-pressure in winter. Strong pre-monsoon heating later lowers pressure and produces hot-weather features such as the loo, so the clues show the winter-to-hot-season transition."
  },
  "GEO-CLI-001-CP011-Q018": {
    "stem": "Most of India is wet under southwesterly flow in July, but by October-November northern India is drying while Tamil Nadu receives important rain. Which comparison explains the shift?",
    "canonicalAnswer": "The southwest monsoon retreats and the circulation turns northeasterly, allowing Bay moisture to favour the southeast coast",
    "options": [
      "The southwest monsoon retreats and the circulation turns northeasterly, allowing Bay moisture to favour the southeast coast",
      "The same southwesterly flow strengthens everywhere and shifts rainfall uniformly southward",
      "Western disturbances become India's main July rain source and later move to Tamil Nadu",
      "The monsoon keeps the same direction, but latitude alone moves all rainfall to the southeast"
    ],
    "explanation": "The summer southwest monsoon weakens and retreats, while the seasonal circulation turns northeasterly. Winds crossing the Bay of Bengal can then carry moisture toward Tamil Nadu even as northern India becomes drier."
  },
  "GEO-CLI-001-CP011-Q024": {
    "stem": "Punjab receives a January shower and Chennai receives a heavy October downpour. Why should these two cool-season rain events not be treated as the same weather system?",
    "canonicalAnswer": "Punjab is affected by western disturbances, while Chennai is favoured by Bay-linked retreating or northeast-monsoon circulation",
    "options": [
      "Punjab is affected by western disturbances, while Chennai is favoured by Bay-linked retreating or northeast-monsoon circulation",
      "Both events are caused by the same Mediterranean cyclone following an identical route",
      "Both are produced by the southwest monsoon at its June peak",
      "Punjab rain comes from Bay cyclones, while Chennai rain comes from loo winds"
    ],
    "explanation": "Northwestern winter rain is commonly brought by western disturbances approaching from the west. Chennai's important October-November rain is tied instead to retreating or northeast-monsoon flow and Bay systems."
  },
  "GEO-CLI-001-CP011-Q048": {
    "stem": "Summer heating creates low pressure over northwestern India and draws in southwesterly flow; winter cooling creates higher pressure and outward northeasterly flow. What connects the two patterns?",
    "canonicalAnswer": "Seasonal reversal of the land-sea pressure gradient drives reversal of the prevailing winds",
    "options": [
      "Seasonal reversal of the land-sea pressure gradient drives reversal of the prevailing winds",
      "The Coriolis force reverses direction between summer and winter",
      "The Himalayas change position and redirect the winds each season",
      "Ocean pressure remains fixed while only local sea breezes reverse"
    ],
    "explanation": "Land heats and cools faster than the surrounding ocean, so the pressure contrast reverses seasonally. The prevailing monsoon winds reverse with that changing pressure gradient."
  },
  "GEO-CLI-001-CP012-Q006": {
    "stem": "A high mountain town is cool, a coastal city has a small annual temperature range, and a leeward plateau is dry. Which controls explain the three observations in the same order?",
    "canonicalAnswer": "Altitude, sea proximity, and relief",
    "options": [
      "Altitude, sea proximity, and relief",
      "Latitude, western disturbances, and longitude",
      "Sea proximity, altitude, and river direction",
      "Relief, soil type, and latitude"
    ],
    "explanation": "Altitude lowers temperature at the mountain town, the nearby sea moderates the coastal city's temperature range, and mountain relief creates the dry leeward rain-shadow condition."
  },
  "GEO-CLI-001-CP012-Q042": {
    "stem": "Strong summer heating lowers pressure over northwestern India, moist monsoon air rises against the Western Ghats, and a high hill station remains cooler than a nearby plain. Which chain matches all three effects?",
    "canonicalAnswer": "Heating → thermal low; relief uplift → windward rain; altitude → lower temperature",
    "options": [
      "Heating → thermal low; relief uplift → windward rain; altitude → lower temperature",
      "Heating → winter high; relief descent → windward rain; altitude → higher temperature",
      "Sea cooling → monsoon burst; latitude → rain shadow; altitude → no temperature change",
      "Western disturbances → summer low; sea breeze → mountain rain; longitude → cooling"
    ],
    "explanation": "Strong heating produces the summer thermal low, mountain uplift enhances windward rainfall, and temperature falls with altitude. The answer combines three separate climate-control relations correctly."
  },
  "GEO-CLI-001-CP003-Q032": {
    "stem": "At high Himalayan elevations, winter precipitation commonly falls in which form?",
    "canonicalAnswer": "Snow",
    "options": [
      "Snow",
      "Sleet",
      "Cold rain",
      "Hail"
    ],
    "explanation": "Winter temperatures at high Himalayan elevations are often low enough for precipitation to fall as snow. The other forms are not the characteristic cold-season precipitation of the higher Himalayas."
  },
  "GEO-CLI-001-CP004-Q028": {
    "stem": "Which frozen form of precipitation can accompany intense pre-monsoon thunderstorms in northern India?",
    "canonicalAnswer": "Hail",
    "options": [
      "Hail",
      "Snowfall",
      "Freezing drizzle",
      "Ice pellets"
    ],
    "explanation": "Strong pre-monsoon convection can produce violent thunderstorms and hail. Snowfall and freezing drizzle are not characteristic products of the intense hot-weather storms over the northern plains."
  },
  "GEO-CLI-001-CP006-Q046": {
    "stem": "A northern station becomes mostly dry in October while a Tamil Nadu coastal station becomes wetter. Which comparison best explains the contrast?",
    "canonicalAnswer": "North: drier retreating conditions; Tamil Nadu: Bay-moisture rain during northeasterly flow",
    "options": [
      "North: drier retreating conditions; Tamil Nadu: Bay-moisture rain during northeasterly flow",
      "North: stronger southwest monsoon; Tamil Nadu: dry continental retreat",
      "Both: identical southwest-monsoon flow and equal rainfall",
      "Both: dry northeasterly winds that remain entirely over land"
    ],
    "explanation": "Northern India dries as the southwest monsoon retreats. Toward the southeast coast, northeasterly winds can cross the Bay of Bengal, gain moisture, and bring rain to Tamil Nadu."
  },
  "GEO-CLI-001-CP008-Q053": {
    "stem": "Which comparison correctly links the Ganga plain and Meghalaya to the Bay of Bengal monsoon branch?",
    "canonicalAnswer": "Ganga plain — rainfall weakens westward; Meghalaya — relief greatly intensifies rainfall",
    "options": [
      "Ganga plain — rainfall weakens westward; Meghalaya — relief greatly intensifies rainfall",
      "Ganga plain — rainfall strengthens westward; Meghalaya — rain shadow dominates",
      "Ganga plain — Arabian Sea branch only; Meghalaya — no relief effect",
      "Ganga plain — identical rainfall throughout; Meghalaya — winter rain only"
    ],
    "explanation": "The Bay branch affects both regions. Across the Ganga plain, rainfall generally decreases westward as moisture is lost, while strong relief uplift makes Meghalaya exceptionally wet."
  },
  "GEO-CLI-001-CP009-Q054": {
    "stem": "Which comparison correctly distinguishes western disturbances from ENSO?",
    "canonicalAnswer": "Western disturbances — regional winter systems; ENSO — Pacific ocean-atmosphere influence",
    "options": [
      "Western disturbances — regional winter systems; ENSO — Pacific ocean-atmosphere influence",
      "Western disturbances — Pacific warming; ENSO — Mediterranean winter cyclones",
      "Western disturbances — local desert winds; ENSO — Himalayan snowfall system",
      "Western disturbances — monsoon rain shadow; ENSO — local sea breeze"
    ],
    "explanation": "Western disturbances are travelling winter weather systems that affect northern India. ENSO is a coupled tropical Pacific ocean-atmosphere pattern with much broader climate influence."
  },
  "GEO-CLI-001-CP011-Q016": {
    "stem": "Which comparison correctly describes the prevailing wind direction in the two monsoon phases?",
    "canonicalAnswer": "Summer — southwesterly inflow; retreating season — northeasterly flow",
    "options": [
      "Summer — southwesterly inflow; retreating season — northeasterly flow",
      "Summer — northeasterly outflow; retreating season — southwesterly inflow",
      "Summer — westerly flow only; retreating season — westerly flow only",
      "Summer — southeasterly continental flow; retreating season — northwesterly oceanic flow"
    ],
    "explanation": "The summer monsoon reaches India as southwesterly flow, while the retreating or cooler-season circulation turns northeasterly. The contrast reflects the seasonal reversal of the monsoon."
  },
  "GEO-CLI-001-CP011-Q023": {
    "stem": "Which agricultural contrast correctly follows from the two cool-season rainfall patterns?",
    "canonicalAnswer": "Northwest winter rain can support rabi crops; southeast rain is an important seasonal water source",
    "options": [
      "Northwest winter rain can support rabi crops; southeast rain is an important seasonal water source",
      "Northwest winter rain starts kharif sowing; southeast rain produces snowfall",
      "Both rainfall patterns occur only in June-July and support the same crop season",
      "Neither rainfall pattern has an important agricultural or water-supply role"
    ],
    "explanation": "Light winter rain from western disturbances can benefit rabi crops in the northwest. October-November rainfall is an important seasonal source of water for the southeast coast."
  },
  "GEO-CLI-001-CP011-Q039": {
    "stem": "Which comparison correctly separates the climatic roles of relief and distance from the sea?",
    "canonicalAnswer": "Relief — redistributes rainfall; sea distance — changes temperature range",
    "options": [
      "Relief — redistributes rainfall; sea distance — changes temperature range",
      "Relief — changes latitude; sea distance — creates mountain height",
      "Relief — controls longitude; sea distance — produces western disturbances",
      "Relief — removes seasonal winds; sea distance — fixes rainfall everywhere"
    ],
    "explanation": "Relief forces air to rise or descend and therefore redistributes rainfall. Distance from the sea affects how strongly temperatures vary because the ocean heats and cools more slowly than land."
  }
});

const HARD_CALIBRATION_IDS = Object.freeze([
  "GEO-CLI-001-CP007-Q049",
  "GEO-CLI-001-CP007-Q053",
  "GEO-CLI-001-CP010-Q012",
  "GEO-CLI-001-CP010-Q018",
  "GEO-CLI-001-CP010-Q024",
  "GEO-CLI-001-CP010-Q036",
  "GEO-CLI-001-CP011-Q006",
  "GEO-CLI-001-CP011-Q018",
  "GEO-CLI-001-CP011-Q024",
  "GEO-CLI-001-CP011-Q048",
  "GEO-CLI-001-CP012-Q006",
  "GEO-CLI-001-CP012-Q042"
] as const);
const OPTION_SHAPE_IDS = Object.freeze([
  "GEO-CLI-001-CP003-Q032",
  "GEO-CLI-001-CP004-Q028",
  "GEO-CLI-001-CP006-Q046",
  "GEO-CLI-001-CP008-Q053",
  "GEO-CLI-001-CP009-Q054",
  "GEO-CLI-001-CP011-Q016",
  "GEO-CLI-001-CP011-Q023",
  "GEO-CLI-001-CP011-Q039"
] as const);

function placeOptions(options: readonly string[], canonicalAnswer: string, correctIndex: number): readonly string[] {
  const distractors = options.filter((option) => option !== canonicalAnswer);
  const placed = [...distractors];
  placed.splice(correctIndex, 0, canonicalAnswer);
  return Object.freeze(placed);
}

export const GEO_CLI_001_OWNING_AUTHORITY_V3: readonly GeoCli001OwningQuestionV2[] = Object.freeze(
  GEO_CLI_001_OWNING_AUTHORITY_V2.map((question) => {
    const patch = QUALITY_PATCHES_V3[question.questionId];
    if (!patch) return question;
    return Object.freeze({
      ...question,
      stem: patch.stem,
      canonicalAnswer: patch.canonicalAnswer,
      options: placeOptions(patch.options, patch.canonicalAnswer, question.correctIndex),
      explanation: patch.explanation,
      reviewOnly: true as const,
      runtimeRegistered: false as const,
    });
  }),
);

function qlNumber(qlId: string): number {
  return Number(qlId.slice(-3));
}

export function auditGeoCli001OwningAuthorityV3() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const stems = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoCli001OwningDifficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];

  for (const question of GEO_CLI_001_OWNING_AUTHORITY_V3) {
    if (ids.has(question.questionId)) issues.push("DUPLICATE_ID:" + question.questionId);
    ids.add(question.questionId);

    const stem = question.stem.replace(/\s+/g, " ").trim().toLowerCase();
    if (stems.has(stem)) issues.push("DUPLICATE_STEM:" + question.questionId);
    stems.add(stem);

    qlCounts[question.qlId] = (qlCounts[question.qlId] ?? 0) + 1;
    difficultyCounts[question.difficulty] += 1;
    answerPositions[question.correctIndex] += 1;

    if (question.options.length !== 4 || new Set(question.options).size !== 4) issues.push("OPTIONS:" + question.questionId);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push("ANSWER:" + question.questionId);
    if (!question.sourceIds.length || !question.sourceFactIds.length) issues.push("PROVENANCE:" + question.questionId);
    if (!question.reviewOnly || question.runtimeRegistered) issues.push("LIFECYCLE:" + question.questionId);
    if (/\bbroad(?:ly)?\b|\bmainly\b/i.test(question.stem + "\n" + question.options.join("\n") + "\n" + question.explanation)) {
      issues.push("STYLE_TEXT:" + question.questionId);
    }
  }

  for (const questionId of HARD_CALIBRATION_IDS) {
    const current = GEO_CLI_001_OWNING_AUTHORITY_V3.find((question) => question.questionId === questionId);
    const prior = GEO_CLI_001_OWNING_AUTHORITY_V2.find((question) => question.questionId === questionId);
    if (!current || current.difficulty !== "Hard") issues.push("HARD_CALIBRATION_DIFFICULTY:" + questionId);
    if (!prior || current?.stem === prior.stem) issues.push("UNREVISED_HARD:" + questionId);
  }

  for (const questionId of OPTION_SHAPE_IDS) {
    const current = GEO_CLI_001_OWNING_AUTHORITY_V3.find((question) => question.questionId === questionId);
    const prior = GEO_CLI_001_OWNING_AUTHORITY_V2.find((question) => question.questionId === questionId);
    if (!current || !prior || current.stem === prior.stem && current.canonicalAnswer === prior.canonicalAnswer && JSON.stringify(current.options) === JSON.stringify(prior.options)) {
      issues.push("UNREVISED_OPTION_SHAPE:" + questionId);
    }
  }

  if (Object.keys(QUALITY_PATCHES_V3).length !== 20) issues.push("QUALITY_PATCH_COUNT:" + Object.keys(QUALITY_PATCHES_V3).length);
  if (GEO_CLI_001_OWNING_AUTHORITY_V3.length !== 648) issues.push("COUNT:" + GEO_CLI_001_OWNING_AUTHORITY_V3.length);
  if (stems.size !== 648) issues.push("STEM_COUNT:" + stems.size);

  for (let ql = 1; ql <= 108; ql += 1) {
    const qlId = "GEO-CLI-001-QL-" + String(ql).padStart(3, "0");
    if (qlCounts[qlId] !== 6) issues.push("QL_COUNT:" + qlId + ":" + (qlCounts[qlId] ?? 0));
  }
  if (Object.keys(qlCounts).some((qlId) => qlNumber(qlId) < 1 || qlNumber(qlId) > 108)) issues.push("UNKNOWN_QL");
  if (difficultyCounts.Easy !== 216 || difficultyCounts.Medium !== 360 || difficultyCounts.Hard !== 72) {
    issues.push("DIFFICULTY:" + JSON.stringify(difficultyCounts));
  }
  if (answerPositions.join(",") !== "162,162,162,162") issues.push("ANSWER_POSITIONS:" + answerPositions.join(","));

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: GEO_CLI_001_OWNING_AUTHORITY_V3.length,
    stemCount: stems.size,
    qualityPatchCount: Object.keys(QUALITY_PATCHES_V3).length,
    hardCalibrationCount: HARD_CALIBRATION_IDS.length,
    optionShapePatchCount: OPTION_SHAPE_IDS.length,
    qlCounts: Object.freeze(qlCounts),
    difficultyCounts: Object.freeze(difficultyCounts),
    answerPositions: Object.freeze(answerPositions),
  });
}

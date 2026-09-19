import {
  GEO_CLI_001_CP012_REVIEW_BATCH_V1,
  type GeoCli001Cp012Difficulty,
  type GeoCli001Cp012Question,
} from "./geo-cli-001-cp012-review-batch-v1";

type Patch = Readonly<{
  stem: string;
  canonicalAnswer: string;
  options: readonly string[];
  explanation: string;
  sourceFactIds: readonly string[];
}>;

const INTEGRATION_PATCHES_V2: Readonly<Record<string, Patch>> = Object.freeze({
  "GEO-CLI-001-CP012-Q001": {
    "stem": "A high hill station is cooler than a nearby plain, while its windward slope receives heavy rain. Which two climate controls explain these features?",
    "canonicalAnswer": "Altitude and relief",
    "options": [
      "Altitude and relief",
      "Longitude and soil",
      "River direction and longitude",
      "Western disturbances and soil"
    ],
    "explanation": "Greater altitude lowers temperature, while relief forces moist air to rise on windward slopes and increases rainfall. The question therefore combines temperature control with rainfall control.",
    "sourceFactIds": [
      "ALTITUDE-TEMP",
      "RELIEF-OROGRAPHIC"
    ]
  },
  "GEO-CLI-001-CP012-Q008": {
    "stem": "A region experiences intense heat in May and widespread monsoon rain in July. Which seasonal transition does this represent?",
    "canonicalAnswer": "Hot weather season to southwest monsoon season",
    "options": [
      "Retreating monsoon to winter",
      "Hot weather season to southwest monsoon season",
      "Winter to retreating monsoon",
      "Southwest monsoon to hot weather season"
    ],
    "explanation": "May belongs to the hot-weather season, while July falls within the main southwest monsoon period. The change links the annual seasonal sequence rather than recalling one month in isolation.",
    "sourceFactIds": [
      "HOT-SEASON-MONTHS",
      "SW-MONSOON-MONTHS"
    ]
  },
  "GEO-CLI-001-CP012-Q013": {
    "stem": "Strong summer heating lowers pressure over northwestern India while pressure remains relatively higher over the ocean. What follows from this contrast?",
    "canonicalAnswer": "Moist winds are drawn from the ocean toward the land",
    "options": [
      "Winter winds strengthen from land to sea",
      "Moist winds are drawn from the ocean toward the land",
      "The ITCZ shifts permanently southward",
      "Western disturbances become the main summer rain source"
    ],
    "explanation": "Summer heating creates low pressure over the subcontinent. Air then moves from relatively higher pressure over the ocean toward the land, helping establish the moisture-bearing monsoon inflow.",
    "sourceFactIds": [
      "SUMMER-LOW-PRESSURE",
      "MONSOON-ONSHORE-FLOW"
    ]
  },
  "GEO-CLI-001-CP012-Q014": {
    "stem": "Southeast trade winds cross the Equator toward India and then reach the subcontinent as southwesterlies. Which combination explains this change?",
    "canonicalAnswer": "Cross-equatorial flow toward low pressure and Coriolis deflection",
    "options": [
      "Cross-equatorial flow toward low pressure and Coriolis deflection",
      "Winter land cooling and polar easterlies",
      "Relief rainfall and sea moderation",
      "Western disturbances and retreating monsoon"
    ],
    "explanation": "The winds first cross the Equator toward the summer low-pressure region over India. After entering the Northern Hemisphere, Coriolis deflection turns the flow so that it approaches India from the southwest.",
    "sourceFactIds": [
      "SUMMER-LOW-PRESSURE",
      "CROSS-EQUATORIAL-DEFLECTION"
    ]
  },
  "GEO-CLI-001-CP012-Q019": {
    "stem": "The west coast is very wet during the southwest monsoon, but the interior Deccan east of the Western Ghats is much drier. Which pair explains this contrast?",
    "canonicalAnswer": "Windward uplift and leeward rain shadow",
    "options": [
      "Windward uplift and leeward rain shadow",
      "Winter high pressure and western disturbances",
      "Latitude difference and sea breeze",
      "ENSO and river direction"
    ],
    "explanation": "Moist Arabian Sea winds rise along the western slopes of the Western Ghats and produce heavy rain. After crossing the range, descending air is drier, creating a rain-shadow effect over the interior Deccan.",
    "sourceFactIds": [
      "WESTERN-GHATS-WINDWARD",
      "DECCAN-RAIN-SHADOW"
    ]
  },
  "GEO-CLI-001-CP012-Q020": {
    "stem": "After moisture-bearing winds cross the Western Ghats from west to east, which rainfall change is most likely?",
    "canonicalAnswer": "Heavy windward rain followed by drier leeward conditions",
    "options": [
      "Equal rainfall on both sides",
      "Heavier rain only on the eastern side",
      "Heavy windward rain followed by drier leeward conditions",
      "No rainfall on either side"
    ],
    "explanation": "The western slopes receive strong orographic rainfall as moist air rises. Much of that moisture is lost before the air descends on the eastern side, so the interior becomes markedly drier.",
    "sourceFactIds": [
      "RELIEF-WINDWARD-LEEWARD",
      "DECCAN-RAIN-SHADOW"
    ]
  },
  "GEO-CLI-001-CP012-Q025": {
    "stem": "Punjab receives winter showers while higher Himalayan areas may receive snowfall during the same disturbances. Which weather system links both effects?",
    "canonicalAnswer": "Western disturbances",
    "options": [
      "Western disturbances",
      "Loo winds",
      "Southwest monsoon burst",
      "Mango showers"
    ],
    "explanation": "Western disturbances affect northern India in winter. They can produce rain over the northwestern plains and snowfall at higher Himalayan elevations, linking two regional effects of the same weather system.",
    "sourceFactIds": [
      "WESTERN-DISTURBANCES",
      "HIMALAYAN-WINTER-SNOW"
    ]
  },
  "GEO-CLI-001-CP012-Q026": {
    "stem": "Which pair correctly links a large-scale climate influence with the season or effect it can affect in India?",
    "canonicalAnswer": "ENSO — summer monsoon strength; western disturbances — northwest winter rain",
    "options": [
      "ENSO — summer monsoon strength; western disturbances — northwest winter rain",
      "ENSO — loo winds; western disturbances — October Tamil Nadu rain",
      "ENSO — Himalayan snowfall only; western disturbances — Kerala onset",
      "ENSO — sea moderation; western disturbances — rain shadow"
    ],
    "explanation": "ENSO can influence the strength and behaviour of the Indian summer monsoon, while western disturbances are important for winter precipitation over northwestern India. The item integrates two different large-scale influences.",
    "sourceFactIds": [
      "ENSO-MONSOON-INFLUENCE",
      "WESTERN-DISTURBANCES",
      "NW-WINTER-RAIN"
    ]
  },
  "GEO-CLI-001-CP012-Q031": {
    "stem": "Which region–season pair correctly combines two different Indian rainfall patterns?",
    "canonicalAnswer": "Tamil Nadu — October–November rain; Punjab — winter rain from western disturbances",
    "options": [
      "Tamil Nadu — October–November rain; Punjab — winter rain from western disturbances",
      "Tamil Nadu — January southwest monsoon; Punjab — October cyclone maximum",
      "Tamil Nadu — Himalayan snowfall; Punjab — northeast monsoon maximum",
      "Tamil Nadu — loo season rain; Punjab — sea-moderated winter"
    ],
    "explanation": "Tamil Nadu receives important rainfall in October–November during the retreating or northeast-monsoon period. Punjab can receive winter showers from western disturbances, so the answer correctly links two distinct regional-seasonal patterns.",
    "sourceFactIds": [
      "TN-OCT-NOV-RAIN",
      "PUNJAB-WINTER-RAIN"
    ]
  },
  "GEO-CLI-001-CP012-Q032": {
    "stem": "Kerala is reached early by the southwest monsoon, while Tamil Nadu receives an important share of rain later in the year. Which comparison is correct?",
    "canonicalAnswer": "Kerala — early southwest monsoon onset; Tamil Nadu — retreating-monsoon rain",
    "options": [
      "Kerala — winter snowfall; Tamil Nadu — summer loo rain",
      "Kerala — early southwest monsoon onset; Tamil Nadu — retreating-monsoon rain",
      "Kerala — western-disturbance maximum; Tamil Nadu — rain shadow only",
      "Kerala — northeast monsoon onset first; Tamil Nadu — June monsoon maximum"
    ],
    "explanation": "Kerala is among the first mainland regions reached by the southwest monsoon. Tamil Nadu, by contrast, receives important rainfall during October–November as the monsoon retreats and Bay systems become active.",
    "sourceFactIds": [
      "KERALA-MONSOON-ONSET",
      "TN-OCT-NOV-RAIN"
    ]
  },
  "GEO-CLI-001-CP012-Q037": {
    "stem": "A coastal city has a small annual temperature range, while a nearby high hill station is much cooler than the plain. Which controls explain the two patterns?",
    "canonicalAnswer": "Sea proximity and altitude",
    "options": [
      "Sea proximity and altitude",
      "Longitude and soil",
      "Rain shadow and river direction",
      "Western disturbances and latitude only"
    ],
    "explanation": "The sea heats and cools slowly, reducing temperature extremes near the coast. Higher altitude lowers temperature with height, so the two observations are explained by sea proximity and altitude.",
    "sourceFactIds": [
      "SEA-MODERATION",
      "ALTITUDE-TEMP"
    ]
  },
  "GEO-CLI-001-CP012-Q038": {
    "stem": "Moist winds rise on the western side of the Western Ghats, lose much of their moisture, and descend over the Deccan. Which cause–effect chain is correct?",
    "canonicalAnswer": "Windward uplift → heavy rain → leeward rain shadow",
    "options": [
      "Windward uplift → heavy rain → leeward rain shadow",
      "Leeward descent → heavier windward drought → coastal snowfall",
      "Winter high pressure → monsoon burst → rain shadow",
      "Sea moderation → western disturbance → orographic drought"
    ],
    "explanation": "Rising moist air cools and produces heavy rain on the windward side. After crossing the mountains, the drier air descends on the leeward side, producing the characteristic Deccan rain-shadow pattern.",
    "sourceFactIds": [
      "RELIEF-OROGRAPHIC",
      "DECCAN-RAIN-SHADOW"
    ]
  }
});

const REQUIRED_INTEGRATION_PATCHES = Object.freeze([
  "GEO-CLI-001-CP012-Q001","GEO-CLI-001-CP012-Q008","GEO-CLI-001-CP012-Q013","GEO-CLI-001-CP012-Q014",
  "GEO-CLI-001-CP012-Q019","GEO-CLI-001-CP012-Q020","GEO-CLI-001-CP012-Q025","GEO-CLI-001-CP012-Q026",
  "GEO-CLI-001-CP012-Q031","GEO-CLI-001-CP012-Q032","GEO-CLI-001-CP012-Q037","GEO-CLI-001-CP012-Q038",
] as const);

function placePatchedOptions(
  options: readonly string[],
  canonicalAnswer: string,
  correctIndex: number,
): readonly string[] {
  const distractors = options.filter((option) => option !== canonicalAnswer);
  const placed = [...distractors];
  placed.splice(correctIndex, 0, canonicalAnswer);
  return Object.freeze(placed);
}

export const GEO_CLI_001_CP012_REVIEW_BATCH_V2: readonly GeoCli001Cp012Question[] = Object.freeze(
  GEO_CLI_001_CP012_REVIEW_BATCH_V1.map((question) => {
    const patch = INTEGRATION_PATCHES_V2[question.questionId];
    if (!patch) return question;
    return Object.freeze({
      ...question,
      stem: patch.stem,
      canonicalAnswer: patch.canonicalAnswer,
      options: placePatchedOptions(patch.options, patch.canonicalAnswer, question.correctIndex),
      explanation: patch.explanation,
      sourceFactIds: Object.freeze([...patch.sourceFactIds]),
      reviewOnly: true as const,
      runtimeRegistered: false as const,
    });
  }),
);

const BANNED_LEARNER_TEXT =
  /sourceFact|review-only|runtimeRegistered|generator|qualification gate|truth authority|\bNCERT\b|\bIMD\b|\bbroad(?:ly)?\b/i;
const BANNED_STEM_TEXT =
  /associated with|described as|in the context of|with reference to the above|what is a key feature|which is correct\?|which statement is correct\?|what broad effect can it have/i;

export function auditGeoCli001Cp012ReviewBatchV2() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const stems = new Set<string>();
  const semantics = new Set<string>();
  const explanations = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoCli001Cp012Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];
  const hardAnswers = new Set<string>();
  let statementStemCount = 0;

  if (Object.keys(INTEGRATION_PATCHES_V2).length !== REQUIRED_INTEGRATION_PATCHES.length) {
    issues.push("INTEGRATION_PATCH_COUNT:" + Object.keys(INTEGRATION_PATCHES_V2).length);
  }

  for (const required of REQUIRED_INTEGRATION_PATCHES) {
    if (!INTEGRATION_PATCHES_V2[required]) issues.push("MISSING_INTEGRATION_PATCH:" + required);
  }

  for (const question of GEO_CLI_001_CP012_REVIEW_BATCH_V2) {
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
    if (/\nI\./.test(question.stem)) statementStemCount += 1;

    if (question.options.length !== 4 || new Set(question.options).size !== 4) issues.push("OPTIONS:" + question.questionId);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push("ANSWER:" + question.questionId);
    if (!question.sourceIds.length || !question.sourceFactIds.length) issues.push("PROVENANCE:" + question.questionId);
    if (!question.reviewOnly || question.runtimeRegistered) issues.push("LIFECYCLE:" + question.questionId);
    if (question.explanation.length < 70) issues.push("SHORT_EXPLANATION:" + question.questionId);
    if (question.stem.length < 28 || question.stem.length > 300 || !question.stem.trim().endsWith("?")) {
      issues.push("STEM_SHAPE:" + question.questionId);
    }
    if (BANNED_STEM_TEXT.test(question.stem)) issues.push("NON_EXAM_STEM:" + question.questionId);

    const learnerText = question.stem + "\n" + question.options.join("\n") + "\n" + question.explanation;
    if (BANNED_LEARNER_TEXT.test(learnerText)) issues.push("LEARNER_TEXT:" + question.questionId);

    if (REQUIRED_INTEGRATION_PATCHES.includes(question.questionId as typeof REQUIRED_INTEGRATION_PATCHES[number])) {
      if (question.sourceFactIds.length < 2) issues.push("THIN_INTEGRATION_PROVENANCE:" + question.questionId);
      if (question.stem === GEO_CLI_001_CP012_REVIEW_BATCH_V1.find((old) => old.questionId === question.questionId)?.stem) {
        issues.push("UNREVISED_INTEGRATION_STEM:" + question.questionId);
      }
    }
  }

  if (GEO_CLI_001_CP012_REVIEW_BATCH_V2.length !== 54) issues.push("COUNT:" + GEO_CLI_001_CP012_REVIEW_BATCH_V2.length);
  if (stems.size !== 54) issues.push("STEM_COUNT:" + stems.size);
  if (semantics.size !== 54) issues.push("SEMANTIC_COUNT:" + semantics.size);
  if (explanations.size !== 54) issues.push("EXPLANATION_COUNT:" + explanations.size);
  if (statementStemCount > 18) issues.push("STATEMENT_STEM_OVERUSE:" + statementStemCount);

  for (let i = 100; i <= 108; i += 1) {
    const qlId = "GEO-CLI-001-QL-" + String(i).padStart(3, "0");
    if (qlCounts[qlId] !== 6) issues.push("QL_COUNT:" + qlId + ":" + (qlCounts[qlId] ?? 0));
  }

  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 6) {
    issues.push("DIFFICULTY:" + JSON.stringify(difficultyCounts));
  }
  if (answerPositions.join(",") !== "14,14,13,13") issues.push("ANSWER_POSITIONS:" + answerPositions.join(","));
  if (hardAnswers.size < 3) issues.push("HARD_ANSWER_VARIETY:" + hardAnswers.size);

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: GEO_CLI_001_CP012_REVIEW_BATCH_V2.length,
    integrationPatchCount: Object.keys(INTEGRATION_PATCHES_V2).length,
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

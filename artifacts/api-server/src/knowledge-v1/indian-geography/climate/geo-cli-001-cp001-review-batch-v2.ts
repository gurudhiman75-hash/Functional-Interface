import {
  GEO_CLI_001_CP001_REVIEW_BATCH_V1,
  type GeoCli001Cp001Question,
  type GeoCli001Difficulty,
} from "./geo-cli-001-cp001-review-batch-v1";

type QuestionPatch = Partial<Omit<GeoCli001Cp001Question, "questionId" | "reviewOnly" | "runtimeRegistered">> & {
  answer?: string;
  distractors?: readonly [string, string, string];
};

const SOURCE_ID = "NCERT-CONTEMPORARY-INDIA-I-CLIMATE";

const PATCHES: Record<string, QuestionPatch> = {
  "GEO-CLI-001-CP001-Q008": {
    canonicalAnswer: "Tropical south and subtropical/temperate north",
    answer: "Tropical south and subtropical/temperate north",
    distractors: [
      "Polar south and tropical north",
      "Temperate south and polar north",
      "Equatorial north and tundra south",
    ],
    explanation: "South of the Tropic of Cancer is broadly tropical, while northern India has subtropical and temperate influence.",
  },
  "GEO-CLI-001-CP001-Q011": {
    distractors: ["Altitude", "Distance from the sea", "Relief"],
  },
  "GEO-CLI-001-CP001-Q015": {
    distractors: ["Latitude", "Distance from the sea", "Relief"],
  },
  "GEO-CLI-001-CP001-Q018": {
    distractors: ["Latitude", "Distance from the sea", "Relief"],
  },
  "GEO-CLI-001-CP001-Q021": {
    distractors: ["Latitude", "Altitude", "Relief"],
  },
  "GEO-CLI-001-CP001-Q022": {
    stem: "Which statement about coastal and inland temperatures is correct?",
    canonicalAnswer: "Coastal areas usually have smaller temperature changes than inland areas",
    answer: "Coastal areas usually have smaller temperature changes than inland areas",
    distractors: [
      "Inland areas always have smaller temperature changes than coasts",
      "Distance from the sea has no effect on temperature",
      "Coastal and inland areas always have the same temperature range",
    ],
    explanation: "The sea heats and cools slowly, so coastal areas usually have smaller temperature changes than inland areas.",
  },
  "GEO-CLI-001-CP001-Q029": {
    canonicalAnswer: "Relief",
    answer: "Relief",
    distractors: ["Latitude", "Distance from the sea", "Pressure and wind system"],
    explanation: "A high mountain barrier is a relief feature, and relief can change the movement of air.",
  },
  "GEO-CLI-001-CP001-Q031": {
    qlName: "Ocean currents and coastal influence",
    stem: "Which climate control can warm or cool a coastal area through moving seawater?",
    canonicalAnswer: "Ocean currents",
    answer: "Ocean currents",
    distractors: ["Altitude", "Latitude", "Distance from the sea"],
    explanation: "Warm and cold ocean currents can change temperatures near a coast, especially when winds blow from sea to land.",
    sourceIds: [SOURCE_ID],
    sourceFactIds: ["geo-cli-001-cp001-ocean-current-control"],
  },
  "GEO-CLI-001-CP001-Q032": {
    qlName: "Ocean currents and coastal influence",
    stem: "A warm ocean current passes close to a coast. What effect can it have on that coast?",
    canonicalAnswer: "It can raise nearby coastal temperatures",
    answer: "It can raise nearby coastal temperatures",
    distractors: [
      "It can only lower coastal temperatures",
      "It removes all marine influence from the coast",
      "It makes coastal temperature independent of winds",
    ],
    explanation: "A warm current can raise temperatures along a nearby coast, especially when onshore winds carry its influence inland.",
    sourceIds: [SOURCE_ID],
    sourceFactIds: ["geo-cli-001-cp001-warm-current-effect"],
  },
  "GEO-CLI-001-CP001-Q033": {
    qlName: "Ocean currents and coastal influence",
    stem: "A cold ocean current passes close to a coast. What broad effect can it have?",
    canonicalAnswer: "It can lower nearby coastal temperatures",
    answer: "It can lower nearby coastal temperatures",
    distractors: [
      "It can only raise nearby coastal temperatures",
      "It always gives the coast a continental climate",
      "It removes the effect of winds on the coast",
    ],
    explanation: "A cold current can lower temperatures along a nearby coast when its influence is carried toward land.",
    sourceIds: [SOURCE_ID],
    sourceFactIds: ["geo-cli-001-cp001-cold-current-effect"],
  },
  "GEO-CLI-001-CP001-Q034": {
    qlName: "Ocean currents and coastal influence",
    stem: "When can an ocean current most directly affect the temperature of nearby land?",
    canonicalAnswer: "When winds carry its influence from sea toward land",
    answer: "When winds carry its influence from sea toward land",
    distractors: [
      "When winds blow only from land toward sea",
      "Only when the coast lies at high altitude",
      "Only when the coast is far from the ocean",
    ],
    explanation: "Onshore winds can carry the temperature influence of a nearby ocean current from the sea onto the coast.",
    sourceIds: [SOURCE_ID],
    sourceFactIds: ["geo-cli-001-cp001-current-onshore-wind"],
  },
  "GEO-CLI-001-CP001-Q035": {
    qlName: "Ocean currents and coastal influence",
    stem: "Which pair is correctly matched?",
    canonicalAnswer: "Warm ocean current — can raise nearby coastal temperature",
    answer: "Warm ocean current — can raise nearby coastal temperature",
    distractors: [
      "Warm ocean current — always lowers nearby coastal temperature",
      "Cold ocean current — always raises nearby coastal temperature",
      "Ocean currents — never affect coastal temperature",
    ],
    explanation: "Warm currents can raise nearby coastal temperatures, while cold currents can have the opposite effect.",
    sourceIds: [SOURCE_ID],
    sourceFactIds: ["geo-cli-001-cp001-current-pair"],
  },
  "GEO-CLI-001-CP001-Q036": {
    qlName: "Ocean currents and coastal influence",
    stem: "Consider these statements: I. Warm and cold ocean currents can affect nearby coastal temperatures. II. Onshore winds can carry this influence toward land. Which is correct?",
    canonicalAnswer: "Both I and II",
    answer: "Both I and II",
    distractors: ["I only", "II only", "Neither I nor II"],
    explanation: "Both statements are correct: currents can modify coastal temperature and onshore winds can carry that influence landward.",
    sourceIds: [SOURCE_ID],
    sourceFactIds: ["geo-cli-001-cp001-current-statements"],
  },
  "GEO-CLI-001-CP001-Q041": {
    distractors: ["Latitude", "Altitude", "Distance from the sea"],
  },
  "GEO-CLI-001-CP001-Q047": {
    distractors: ["Latitude", "Distance from the sea", "Pressure and wind system"],
  },
  "GEO-CLI-001-CP001-Q049": {
    distractors: [
      "Latitude and distance from the sea",
      "Pressure and winds with latitude",
      "Ocean currents and distance from the sea",
    ],
  },
  "GEO-CLI-001-CP001-Q050": {
    distractors: [
      "Latitude and relief",
      "Pressure and winds with relief",
      "Ocean currents and latitude",
    ],
  },
  "GEO-CLI-001-CP001-Q053": {
    distractors: [
      "Smaller temperature range and lower rainfall",
      "Larger temperature range and heavy windward rainfall",
      "Cool high-altitude conditions and lower rainfall",
    ],
  },
  "GEO-CLI-001-CP001-Q054": {
    stem: "A coastal plain has a smaller temperature range than an inland area behind a mountain barrier, and that inland area is also drier. Which controls explain both differences?",
    canonicalAnswer: "Distance from the sea and relief",
    answer: "Distance from the sea and relief",
    distractors: [
      "Latitude and altitude",
      "Pressure and winds with latitude",
      "Ocean currents and altitude",
    ],
    explanation: "Distance from the sea explains the smaller coastal temperature range, while relief can leave the inland leeward area drier.",
  },
};

function buildOptions(answer: string, distractors: readonly string[], correctIndex: number) {
  if (distractors.length !== 3) throw new Error("CP001 V2 requires exactly three distractors");
  const options = [...distractors];
  options.splice(correctIndex, 0, answer);
  return Object.freeze(options);
}

export const GEO_CLI_001_CP001_REVIEW_BATCH_V2: readonly GeoCli001Cp001Question[] = Object.freeze(
  GEO_CLI_001_CP001_REVIEW_BATCH_V1.map((question) => {
    const patch = PATCHES[question.questionId];
    if (!patch) return question;

    const answer = patch.answer ?? patch.canonicalAnswer ?? question.canonicalAnswer;
    const options = patch.distractors
      ? buildOptions(answer, patch.distractors, question.correctIndex)
      : question.options;

    return Object.freeze({
      ...question,
      ...patch,
      canonicalAnswer: answer,
      options,
      sourceIds: patch.sourceIds ?? question.sourceIds,
      sourceFactIds: patch.sourceFactIds ?? question.sourceFactIds,
      reviewOnly: true as const,
      runtimeRegistered: false as const,
    });
  }),
);

const BANNED_LEARNER_TEXT = /sourceFact|review-only|runtimeRegistered|generator|qualification gate|truth authority|NCERT/i;

export function auditGeoCli001Cp001ReviewBatchV2() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const semantics = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoCli001Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];
  const hardAnswers = new Set<string>();

  for (const question of GEO_CLI_001_CP001_REVIEW_BATCH_V2) {
    if (ids.has(question.questionId)) issues.push(`DUPLICATE_ID:${question.questionId}`);
    ids.add(question.questionId);

    const semantic = `${question.stem}::${question.canonicalAnswer}`.toLowerCase();
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
    if (question.explanation.length < 40) issues.push(`SHORT_EXPLANATION:${question.questionId}`);
    if (question.stem.length > 260) issues.push(`LONG_STEM:${question.questionId}`);

    const learnerText = `${question.stem}\n${question.options.join("\n")}\n${question.explanation}`;
    if (BANNED_LEARNER_TEXT.test(learnerText)) issues.push(`META:${question.questionId}`);
  }

  if (GEO_CLI_001_CP001_REVIEW_BATCH_V2.length !== 54) issues.push(`COUNT:${GEO_CLI_001_CP001_REVIEW_BATCH_V2.length}`);
  if (semantics.size !== 54) issues.push(`SEMANTIC_COUNT:${semantics.size}`);
  for (let i = 1; i <= 9; i += 1) {
    const qlId = `GEO-CLI-001-QL-${String(i).padStart(3, "0")}`;
    if (qlCounts[qlId] !== 6) issues.push(`QL_COUNT:${qlId}:${qlCounts[qlId] ?? 0}`);
  }
  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 6) {
    issues.push(`DIFFICULTY:${difficultyCounts.Easy}/${difficultyCounts.Medium}/${difficultyCounts.Hard}`);
  }
  if (answerPositions.join(",") !== "14,14,13,13") issues.push(`ANSWER_POSITIONS:${answerPositions.join(",")}`);
  if (hardAnswers.size < 3) issues.push(`HARD_ANSWER_VARIETY:${hardAnswers.size}`);

  const ql006 = GEO_CLI_001_CP001_REVIEW_BATCH_V2.filter((question) => question.qlId === "GEO-CLI-001-QL-006");
  if (!ql006.every((question) => /ocean current|current/i.test(`${question.stem} ${question.canonicalAnswer} ${question.explanation}`))) {
    issues.push("QL006_OCEAN_CURRENT_COVERAGE");
  }

  return {
    valid: issues.length === 0,
    issues,
    questionCount: GEO_CLI_001_CP001_REVIEW_BATCH_V2.length,
    semanticCount: semantics.size,
    qlCounts,
    difficultyCounts,
    answerPositions,
    hardAnswerVariety: hardAnswers.size,
  };
}

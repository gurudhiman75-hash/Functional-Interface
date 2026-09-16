import {
  GEO_CLI_001_CP001_REVIEW_BATCH_V2,
  type GeoCli001Cp001Question,
  type GeoCli001Difficulty,
} from "./geo-cli-001-cp001-review-batch-v2";

type OptionPatch = {
  answer?: string;
  distractors: readonly [string, string, string];
};

const OPTION_PATCHES: Record<string, OptionPatch> = {
  "GEO-CLI-001-CP001-Q009": {
    distractors: [
      "It changes elevation above sea level",
      "It changes distance from the sea",
      "It creates mountain barriers",
    ],
  },
  "GEO-CLI-001-CP001-Q010": {
    distractors: [
      "The northern plains",
      "The high Himalayas",
      "The northwestern interior",
    ],
  },
  "GEO-CLI-001-CP001-Q013": {
    distractors: [
      "It increases",
      "It remains nearly unchanged",
      "It changes only with distance from the sea",
    ],
  },
  "GEO-CLI-001-CP001-Q014": {
    distractors: [
      "They are closer to the Equator",
      "They are always closer to the sea",
      "They are always on a leeward slope",
    ],
  },
  "GEO-CLI-001-CP001-Q016": {
    distractors: [
      "The lower place",
      "Both must have the same temperature",
      "The place closer to the sea, regardless of height",
    ],
  },
  "GEO-CLI-001-CP001-Q043": {
    distractors: [
      "Convectional rainfall",
      "Cyclonic rainfall",
      "Frontal rainfall",
    ],
  },
  "GEO-CLI-001-CP001-Q045": {
    distractors: [
      "Windward rain belt",
      "Zone of forced uplift",
      "Area of maximum relief rainfall",
    ],
  },
  "GEO-CLI-001-CP001-Q046": {
    distractors: [
      "It changes the region's distance from the sea",
      "It changes the latitude of the region",
      "It determines which ocean current reaches the coast",
    ],
  },
};

function optionsFor(question: GeoCli001Cp001Question, patch: OptionPatch) {
  const answer = patch.answer ?? question.canonicalAnswer;
  const options = [...patch.distractors];
  options.splice(question.correctIndex, 0, answer);
  return Object.freeze(options);
}

export const GEO_CLI_001_CP001_REVIEW_BATCH_V3: readonly GeoCli001Cp001Question[] = Object.freeze(
  GEO_CLI_001_CP001_REVIEW_BATCH_V2.map((question) => {
    const patch = OPTION_PATCHES[question.questionId];
    if (!patch) return question;
    const canonicalAnswer = patch.answer ?? question.canonicalAnswer;
    return Object.freeze({
      ...question,
      canonicalAnswer,
      options: optionsFor(question, patch),
      reviewOnly: true as const,
      runtimeRegistered: false as const,
    });
  }),
);

const BANNED_LEARNER_TEXT = /sourceFact|review-only|runtimeRegistered|generator|qualification gate|truth authority|NCERT|population density|soil colour|more roads|groundwater rainfall|tidal plain|permanent cyclone belt/i;

export function auditGeoCli001Cp001ReviewBatchV3() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const semantics = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoCli001Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];
  const hardAnswers = new Set<string>();

  for (const question of GEO_CLI_001_CP001_REVIEW_BATCH_V3) {
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
    if (BANNED_LEARNER_TEXT.test(learnerText)) issues.push(`LEARNER_TEXT:${question.questionId}`);
  }

  if (GEO_CLI_001_CP001_REVIEW_BATCH_V3.length !== 54) issues.push(`COUNT:${GEO_CLI_001_CP001_REVIEW_BATCH_V3.length}`);
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

  const ql006 = GEO_CLI_001_CP001_REVIEW_BATCH_V3.filter((question) => question.qlId === "GEO-CLI-001-QL-006");
  if (ql006.length !== 6 || !ql006.every((question) => question.qlName === "Ocean currents and coastal influence")) {
    issues.push("QL006_OCEAN_CURRENT_COVERAGE");
  }

  return {
    valid: issues.length === 0,
    issues,
    questionCount: GEO_CLI_001_CP001_REVIEW_BATCH_V3.length,
    semanticCount: semantics.size,
    qlCounts,
    difficultyCounts,
    answerPositions,
    hardAnswerVariety: hardAnswers.size,
  };
}

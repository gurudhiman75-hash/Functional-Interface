import {
  getAnswerType,
  getCommonQuestionLanguageIds,
  getQuestionLanguageIds,
  getExplanationId,
  getQuestionEntry,
  getRequiredVariables,
  getTaskKind,
} from "./library";
import { stableBucket } from "./math";
import {
  PCT_005_ARCHETYPE_ID,
  PCT_005_CP_IDS,
  type Pct005CanonicalProblemId,
  type Pct005DifficultyBand,
  type Pct005Language,
  type Pct005Parameters,
  type Pct005Variables,
} from "./types";

export interface Pct005ParameterInput {
  seed?: string;
  language?: Pct005Language;
  questionLanguageId?: string;
  difficultyBand?: Pct005DifficultyBand;
}

type ScenarioFactory = (difficulty: Pct005DifficultyBand, seed: string) => Pct005Variables;

function pick<T>(items: readonly T[], seed: string): T {
  return items[stableBucket(seed, items.length)]!;
}

function getSelectableQuestionLanguageIds(cpId: Pct005CanonicalProblemId, language: Pct005Language) {
  return language === "en" ? getQuestionLanguageIds(cpId, "en") : getCommonQuestionLanguageIds(cpId);
}

function assignDifficulty(cpId: Pct005CanonicalProblemId, language: Pct005Language, seed: string): Pct005DifficultyBand {
  const qlIds = getSelectableQuestionLanguageIds(cpId, language);
  const qlId = qlIds[stableBucket(seed, qlIds.length)]!;
  return getQuestionEntry(cpId, qlId, language).difficulty;
}

const SCENARIO_BUILDERS: Record<string, ScenarioFactory> = {
  "PCT-QL-001": (_difficulty, seed) => ({
    originalValue: pick([1000, 2000, 5000, 10000], `${seed}:originalValue`),
    rate1: pick([10, 12, 15, 20], `${seed}:rate1`),
    rate2: pick([10, 15, 20, 25], `${seed}:rate2`),
    wholeLabel: "value",
  }),
  "PCT-QL-002": (_difficulty, seed) => ({
    originalValue: pick([20000, 30000, 40000, 50000], `${seed}:originalValue`),
    rate1: pick([10, 15, 20], `${seed}:rate1`),
    rate2: pick([10, 20, 25], `${seed}:rate2`),
    wholeLabel: "salary",
    valuePrefix: "Rs. ",
  }),
  "PCT-QL-003": (_difficulty, seed) => ({
    originalValue: pick([1000, 2000, 5000, 8000], `${seed}:originalValue`),
    rate1: pick([10, 15, 20], `${seed}:rate1`),
    rate2: pick([10, 15, 20, 25], `${seed}:rate2`),
    wholeLabel: "population",
  }),
  "PCT-QL-004": (_difficulty, seed) => ({
    originalValue: pick([20000, 30000, 40000], `${seed}:originalValue`),
    rate1: pick([10, 12, 15], `${seed}:rate1`),
    rate2: pick([10, 15, 20], `${seed}:rate2`),
    wholeLabel: "salary",
    valuePrefix: "Rs. ",
  }),
  "PCT-QL-005": (_difficulty, seed) => ({
    originalValue: pick([1000, 2000, 5000, 10000], `${seed}:originalValue`),
    rate1: pick([10, 20, 25], `${seed}:rate1`),
    rate2: pick([10, 20, 25], `${seed}:rate2`),
    wholeLabel: "value",
  }),
  "PCT-QL-006": (_difficulty, seed) => ({
    originalValue: pick([400, 600, 800, 1000], `${seed}:originalValue`),
    rate1: pick([10, 15, 20], `${seed}:rate1`),
    rate2: pick([10, 15, 20], `${seed}:rate2`),
    wholeLabel: "production",
  }),
  "PCT-QL-007": (_difficulty, seed) => ({
    originalValue: pick([1000, 2000, 5000, 10000], `${seed}:originalValue`),
    rate1: pick([10, 20, 25], `${seed}:rate1`),
    rate2: pick([10, 20, 25], `${seed}:rate2`),
    wholeLabel: "value",
  }),
  "PCT-QL-008": (_difficulty, seed) => ({
    originalValue: pick([500, 800, 1200, 1600], `${seed}:originalValue`),
    rate1: pick([10, 15, 20], `${seed}:rate1`),
    rate2: pick([10, 12, 15], `${seed}:rate2`),
    wholeLabel: "attendance",
  }),
  "PCT-QL-009": (_difficulty, seed) => ({
    rate1: pick([10, 12, 15, 20], `${seed}:rate1`),
    rate2: pick([10, 15, 20, 25], `${seed}:rate2`),
    direction1: "increase",
    direction2: "increase",
    wholeLabel: "value",
  }),
  "PCT-QL-010": (_difficulty, seed) => ({
    rate1: pick([10, 15, 20], `${seed}:rate1`),
    rate2: pick([5, 10, 12, 15], `${seed}:rate2`),
    direction1: "increase",
    direction2: "decrease",
    wholeLabel: "value",
  }),
  "PCT-QL-011": (_difficulty, seed) => ({
    rate1: pick([20, 25, 40], `${seed}:rate1`),
    rate2: pick([10, 15, 20], `${seed}:rate2`),
    direction1: "increase",
    direction2: "increase",
    wholeLabel: "value",
  }),
  "PCT-QL-012": (_difficulty, seed) => ({
    rate1: pick([10, 15, 20], `${seed}:rate1`),
    rate2: pick([5, 10, 12, 15], `${seed}:rate2`),
    direction1: "increase",
    direction2: "decrease",
    wholeLabel: "value",
  }),
  "PCT-QL-013": (_difficulty, seed) => {
    const originalValue = pick([450, 540, 600, 720], `${seed}:originalValue`);
    const rate1 = pick([10, 20, 25], `${seed}:rate1`);
    const rate2 = pick([10, 15, 20], `${seed}:rate2`);
    const direction1 = "increase";
    const direction2 = "increase";
    const finalValue = originalValue * (100 + rate1) / 100 * (100 + rate2) / 100;
    return { finalValue, rate1, rate2, direction1, direction2, wholeLabel: "value" };
  },
  "PCT-QL-014": (_difficulty, seed) => {
    const originalValue = pick([500, 800, 1000, 1200], `${seed}:originalValue`);
    const rate1 = pick([20, 25], `${seed}:rate1`);
    const rate2 = pick([10, 15], `${seed}:rate2`);
    const direction1 = "increase";
    const direction2 = "decrease";
    const finalValue =
      originalValue *
      (100 + rate1) / 100 *
      (100 - rate2) / 100;
    return { finalValue, rate1, rate2, direction1, direction2, wholeLabel: "value" };
  },
  "PCT-QL-015": (_difficulty, seed) => ({
    originalA: pick([1000, 2000, 5000], `${seed}:originalA`),
    labelA: "A",
    directionA1: "increase",
    rateA1: pick([10, 12, 15], `${seed}:rateA1`),
    directionA2: "increase",
    rateA2: pick([15, 20, 25], `${seed}:rateA2`),
    originalB: pick([1000, 2000, 5000], `${seed}:originalB`),
    labelB: "B",
    directionB1: "increase",
    rateB1: pick([10, 12, 15], `${seed}:rateB1`),
    directionB2: "increase",
    rateB2: pick([12, 15, 20], `${seed}:rateB2`),
  }),
  "PCT-QL-016": (_difficulty, seed) => ({
    originalA: pick([20000, 30000, 40000], `${seed}:originalA`),
    labelA: "salary A",
    valuePrefix: "Rs. ",
    directionA1: "increase",
    rateA1: pick([10, 15, 20], `${seed}:rateA1`),
    directionA2: "decrease",
    rateA2: pick([5, 10, 12], `${seed}:rateA2`),
    originalB: pick([20000, 30000, 40000], `${seed}:originalB`),
    labelB: "salary B",
    directionB1: "increase",
    rateB1: pick([12, 15, 18], `${seed}:rateB1`),
    directionB2: "increase",
    rateB2: pick([10, 12, 15], `${seed}:rateB2`),
  }),
  "PCT-QL-017": (_difficulty, seed) => ({
    originalValue: pick([1000, 2000, 5000], `${seed}:originalValue`),
    stageCount: 3,
    direction1: "increase",
    rate1: pick([10, 12, 15], `${seed}:rate1`),
    direction2: "increase",
    rate2: pick([15, 20], `${seed}:rate2`),
    direction3: "decrease",
    rate3: pick([5, 10], `${seed}:rate3`),
    wholeLabel: "value",
  }),
  "PCT-QL-018": (_difficulty, seed) => ({
    originalValue: pick([1000, 2000, 5000], `${seed}:originalValue`),
    stageCount: 4,
    direction1: "increase",
    rate1: pick([10, 12, 15], `${seed}:rate1`),
    direction2: "increase",
    rate2: pick([15, 20], `${seed}:rate2`),
    direction3: "decrease",
    rate3: pick([5, 10], `${seed}:rate3`),
    direction4: "increase",
    rate4: pick([10, 15], `${seed}:rate4`),
    wholeLabel: "value",
  }),
  "PCT-QL-019": (_difficulty, seed) => ({
    originalValue: pick([5000, 8000, 10000], `${seed}:originalValue`),
    stageCount: 3,
    direction1: "increase",
    rate1: pick([10, 15], `${seed}:rate1`),
    direction2: "decrease",
    rate2: pick([5, 10], `${seed}:rate2`),
    direction3: "increase",
    rate3: pick([10, 12], `${seed}:rate3`),
    wholeLabel: "population",
  }),
  "PCT-QL-020": (_difficulty, seed) => ({
    originalValue: pick([20000, 30000, 40000], `${seed}:originalValue`),
    stageCount: 3,
    direction1: "increase",
    rate1: pick([10, 15], `${seed}:rate1`),
    direction2: "increase",
    rate2: pick([12, 20], `${seed}:rate2`),
    direction3: "decrease",
    rate3: pick([5, 10], `${seed}:rate3`),
    wholeLabel: "sales",
    valuePrefix: "Rs. ",
  }),
};

const SCENARIO_ALIASES: Record<string, string> = {
  "PCT-QL-021": "PCT-QL-001",
  "PCT-QL-022": "PCT-QL-001",
  "PCT-QL-023": "PCT-QL-001",
  "PCT-QL-024": "PCT-QL-003",
  "PCT-QL-025": "PCT-QL-004",
  "PCT-QL-026": "PCT-QL-003",
  "PCT-QL-027": "PCT-QL-005",
  "PCT-QL-028": "PCT-QL-006",
  "PCT-QL-029": "PCT-QL-006",
  "PCT-QL-030": "PCT-QL-007",
  "PCT-QL-031": "PCT-QL-008",
  "PCT-QL-032": "PCT-QL-008",
  "PCT-QL-033": "PCT-QL-009",
  "PCT-QL-034": "PCT-QL-010",
  "PCT-QL-035": "PCT-QL-010",
  "PCT-QL-036": "PCT-QL-011",
  "PCT-QL-037": "PCT-QL-012",
  "PCT-QL-038": "PCT-QL-012",
  "PCT-QL-039": "PCT-QL-013",
  "PCT-QL-040": "PCT-QL-014",
  "PCT-QL-041": "PCT-QL-014",
  "PCT-QL-042": "PCT-QL-015",
  "PCT-QL-043": "PCT-QL-016",
  "PCT-QL-044": "PCT-QL-016",
  "PCT-QL-045": "PCT-QL-017",
  "PCT-QL-046": "PCT-QL-018",
  "PCT-QL-047": "PCT-QL-018",
  "PCT-QL-048": "PCT-QL-019",
  "PCT-QL-049": "PCT-QL-019",
  "PCT-QL-050": "PCT-QL-020",
};

function createVariables(questionLanguageId: string, difficultyBand: Pct005DifficultyBand, seed: string) {
  const builderId = SCENARIO_ALIASES[questionLanguageId] ?? questionLanguageId;
  const builder = SCENARIO_BUILDERS[builderId];
  if (!builder) throw new Error(`Missing scenario builder for ${questionLanguageId}`);
  return builder(difficultyBand, seed);
}

export function selectQuestionLanguageId(
  cpId: Pct005CanonicalProblemId,
  language: Pct005Language,
  seed: string,
  difficultyBand?: Pct005DifficultyBand,
) {
  const qlIds = getSelectableQuestionLanguageIds(cpId, language);
  const filtered = difficultyBand
    ? qlIds.filter((qlId) => getQuestionEntry(cpId, qlId, language).difficulty === difficultyBand)
    : qlIds;
  const source = filtered.length > 0 ? filtered : qlIds;
  return source[stableBucket(seed, source.length)]!;
}

export function generatePct005Parameters(cpId: Pct005CanonicalProblemId, input: Pct005ParameterInput = {}): Pct005Parameters {
  const seed = input.seed ?? `PCT-005:${cpId}`;
  const language = input.language ?? "en";
  const difficultyBand = input.difficultyBand ?? assignDifficulty(cpId, language, seed);
  const questionLanguageId = input.questionLanguageId ?? selectQuestionLanguageId(cpId, language, seed, difficultyBand);
  const questionEntry = getQuestionEntry(cpId, questionLanguageId, language);
  const resolvedDifficulty = questionEntry.difficulty;
  const taskKind = getTaskKind(cpId, questionLanguageId);
  const answerType = getAnswerType(cpId, questionLanguageId);
  const requiredVariables = getRequiredVariables(cpId, questionLanguageId);
  const variables = createVariables(questionLanguageId, resolvedDifficulty, seed);

  for (const requiredVariable of requiredVariables) {
    if (!Object.hasOwn(variables, requiredVariable)) {
      throw new Error(`Missing required variable ${requiredVariable} for ${questionLanguageId}`);
    }
  }

  return {
    archetypeId: PCT_005_ARCHETYPE_ID,
    canonicalProblemId: cpId,
    questionId: `${cpId}:${questionLanguageId}:${seed}`,
    questionLanguageId,
    explanationId: getExplanationId(cpId),
    language,
    difficultyBand: resolvedDifficulty,
    taskKind,
    answerType,
    requiredVariables,
    variables,
    sourceTrace: {
      questionLanguageSource: "question-language.en.json",
      explanationSource: "explanation.en.json",
      variableRangeSource: "variable-ranges.library.json",
    },
  };
}

export function getPct005ActiveCanonicalProblemIds() {
  return [...PCT_005_CP_IDS] as Pct005CanonicalProblemId[];
}

export function pickPct005CanonicalProblemId(seed: string) {
  return PCT_005_CP_IDS[stableBucket(seed, PCT_005_CP_IDS.length)]!;
}

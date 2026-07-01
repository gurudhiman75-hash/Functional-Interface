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
  PCT_003_ARCHETYPE_ID,
  PCT_003_CP_IDS,
  type Pct003CanonicalProblemId,
  type Pct003DifficultyBand,
  type Pct003Language,
  type Pct003Parameters,
  type Pct003Variables,
} from "./types";

export interface Pct003ParameterInput {
  seed?: string;
  language?: Pct003Language;
  questionLanguageId?: string;
  difficultyBand?: Pct003DifficultyBand;
}

type ScenarioFactory = (difficulty: Pct003DifficultyBand, seed: string) => Pct003Variables;

function pick<T>(items: readonly T[], seed: string): T {
  return items[stableBucket(seed, items.length)]!;
}

function getSelectableQuestionLanguageIds(cpId: Pct003CanonicalProblemId, language: Pct003Language) {
  return language === "en" ? getQuestionLanguageIds(cpId, "en") : getCommonQuestionLanguageIds(cpId);
}

function assignDifficulty(cpId: Pct003CanonicalProblemId, language: Pct003Language, seed: string): Pct003DifficultyBand {
  const qlIds = getSelectableQuestionLanguageIds(cpId, language);
  const qlId = qlIds[stableBucket(seed, qlIds.length)]!;
  return getQuestionEntry(cpId, qlId, language).difficulty;
}

const SCENARIO_BUILDERS: Record<string, ScenarioFactory> = {
  "PCT-QL-001": (_difficulty, seed) => ({
    originalValue: pick([20000, 30000, 40000, 50000, 60000], `${seed}:originalValue`),
    increaseRate: pick([10, 12, 15, 20, 25], `${seed}:increaseRate`),
    wholeLabel: "salary",
    valuePrefix: "Rs. ",
  }),
  "PCT-QL-002": (_difficulty, seed) => ({
    originalValue: pick([4000, 5000, 8000, 12000, 20000], `${seed}:originalValue`),
    increaseRate: pick([10, 15, 20, 25], `${seed}:increaseRate`),
    wholeLabel: "population",
  }),
  "PCT-QL-003": (_difficulty, seed) => ({
    originalValue: pick([20000, 30000, 40000, 50000], `${seed}:originalValue`),
    increaseRate: pick([10, 15, 20, 25], `${seed}:increaseRate`),
    wholeLabel: "salary",
    valuePrefix: "Rs. ",
  }),
  "PCT-QL-004": (_difficulty, seed) => ({
    originalValue: pick([400, 600, 800, 1000, 1200], `${seed}:originalValue`),
    increaseRate: pick([10, 15, 20, 25], `${seed}:increaseRate`),
    wholeLabel: "production",
  }),
  "PCT-QL-005": (_difficulty, seed) => {
    const originalValue = pick([30000, 40000, 50000, 60000], `${seed}:originalValue`);
    const increaseRate = pick([10, 20, 25, 50], `${seed}:increaseRate`);
    return {
      increasedValue: originalValue * (100 + increaseRate) / 100,
      increaseRate,
      wholeLabel: "salary",
      valuePrefix: "Rs. ",
    };
  },
  "PCT-QL-006": (_difficulty, seed) => {
    const originalValue = pick([4000, 8000, 12000, 20000], `${seed}:originalValue`);
    const increaseRate = pick([10, 15, 20, 25], `${seed}:increaseRate`);
    return {
      increasedValue: originalValue * (100 + increaseRate) / 100,
      increaseRate,
      wholeLabel: "population",
    };
  },
  "PCT-QL-007": (_difficulty, seed) => ({
    increaseRate: pick([10, 15, 20, 25], `${seed}:increaseRate`),
    wholeLabel: "salary",
  }),
  "PCT-QL-008": (_difficulty, seed) => ({
    increaseRate: pick([12, 18, 20, 25], `${seed}:increaseRate`),
    wholeLabel: "population",
  }),
  "PCT-QL-009": (_difficulty, seed) => ({
    originalValue: pick([20000, 30000, 40000], `${seed}:originalValue`),
    rate1: pick([10, 15, 20], `${seed}:rate1`),
    rate2: pick([10, 20, 25], `${seed}:rate2`),
    wholeLabel: "salary",
    valuePrefix: "Rs. ",
  }),
  "PCT-QL-010": (_difficulty, seed) => ({
    originalValue: pick([4000, 5000, 8000, 10000], `${seed}:originalValue`),
    rate1: pick([10, 15, 20], `${seed}:rate1`),
    rate2: pick([10, 20, 25], `${seed}:rate2`),
    wholeLabel: "population",
  }),
  "PCT-QL-011": (_difficulty, seed) => ({
    rate1: pick([10, 15, 20], `${seed}:rate1`),
    rate2: pick([10, 15, 20, 25], `${seed}:rate2`),
    wholeLabel: "price",
  }),
  "PCT-QL-012": (_difficulty, seed) => ({
    rate1: pick([10, 15, 20], `${seed}:rate1`),
    rate2: pick([10, 15, 20], `${seed}:rate2`),
    wholeLabel: "population",
  }),
  "PCT-QL-013": (_difficulty, seed) => ({
    originalA: pick([30000, 40000, 50000], `${seed}:originalA`),
    rateA: pick([10, 15, 20], `${seed}:rateA`),
    labelA: "salary A",
    originalB: pick([25000, 35000, 45000], `${seed}:originalB`),
    rateB: pick([10, 15, 20, 25], `${seed}:rateB`),
    labelB: "salary B",
    valuePrefix: "Rs. ",
  }),
  "PCT-QL-014": (_difficulty, seed) => ({
    originalA: pick([400, 600, 800], `${seed}:originalA`),
    rateA: pick([10, 15, 20], `${seed}:rateA`),
    labelA: "production A",
    originalB: pick([500, 700, 900], `${seed}:originalB`),
    rateB: pick([10, 15, 20, 25], `${seed}:rateB`),
    labelB: "production B",
  }),
  "PCT-QL-015": (_difficulty, seed) => ({
    totalValue: pick([200, 300, 400, 500], `${seed}:totalValue`),
    partRate: pick([40, 45, 50, 60], `${seed}:partRate`),
    partIncreaseRate: pick([10, 15, 20], `${seed}:partIncreaseRate`),
    otherIncreaseRate: pick([10, 15, 20], `${seed}:otherIncreaseRate`),
    wholeLabel: "students",
    partLabel: "boys",
    otherLabel: "girls",
  }),
  "PCT-QL-016": (_difficulty, seed) => ({
    totalValue: pick([400, 600, 800, 1000], `${seed}:totalValue`),
    partRate: pick([30, 40, 45, 50], `${seed}:partRate`),
    partIncreaseRate: pick([10, 15, 20], `${seed}:partIncreaseRate`),
    otherIncreaseRate: pick([10, 12, 15], `${seed}:otherIncreaseRate`),
    wholeLabel: "workers",
    partLabel: "urban workers",
    otherLabel: "rural workers",
  }),
  "PCT-QL-017": (_difficulty, seed) => ({
    ...(() => {
      const pairs = [
        { currentValue: 40000, targetValue: 50000 },
        { currentValue: 48000, targetValue: 60000 },
        { currentValue: 50000, targetValue: 62500 },
        { currentValue: 60000, targetValue: 72000 },
      ] as const;
      const pair = pick(pairs, `${seed}:salaryTargetPair`);
      return {
        currentValue: pair.currentValue,
        targetValue: pair.targetValue,
        wholeLabel: "salary",
        valuePrefix: "Rs. ",
      };
    })(),
  }),
  "PCT-QL-018": (_difficulty, seed) => {
    const currentValue = pick([400, 500, 600, 800], `${seed}:currentValue`);
    const targetValue = currentValue + pick([100, 150, 200, 300], `${seed}:targetValue`);
    return { currentValue, targetValue, wholeLabel: "production" };
  },
  "PCT-QL-019": (_difficulty, seed) => ({
    currentValue: pick([5000, 8000, 10000, 12000], `${seed}:currentValue`),
    growthRate: pick([10, 12, 15, 20], `${seed}:growthRate`),
    periodCount: 2,
    wholeLabel: "population",
  }),
  "PCT-QL-020": (_difficulty, seed) => ({
    currentValue: pick([20000, 30000, 40000], `${seed}:currentValue`),
    growthRate: pick([10, 15, 20], `${seed}:growthRate`),
    periodCount: 3,
    wholeLabel: "production value",
    valuePrefix: "Rs. ",
  }),
};

const SCENARIO_ALIASES: Record<string, string> = {
  "PCT-QL-021": "PCT-QL-001",
  "PCT-QL-022": "PCT-QL-002",
  "PCT-QL-023": "PCT-QL-002",
  "PCT-QL-024": "PCT-QL-003",
  "PCT-QL-025": "PCT-QL-004",
  "PCT-QL-026": "PCT-QL-004",
  "PCT-QL-027": "PCT-QL-005",
  "PCT-QL-028": "PCT-QL-006",
  "PCT-QL-029": "PCT-QL-006",
  "PCT-QL-030": "PCT-QL-007",
  "PCT-QL-031": "PCT-QL-008",
  "PCT-QL-032": "PCT-QL-008",
  "PCT-QL-033": "PCT-QL-010",
  "PCT-QL-034": "PCT-QL-010",
  "PCT-QL-035": "PCT-QL-010",
  "PCT-QL-036": "PCT-QL-011",
  "PCT-QL-037": "PCT-QL-012",
  "PCT-QL-038": "PCT-QL-012",
  "PCT-QL-039": "PCT-QL-013",
  "PCT-QL-040": "PCT-QL-014",
  "PCT-QL-041": "PCT-QL-013",
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

function createVariables(questionLanguageId: string, difficultyBand: Pct003DifficultyBand, seed: string) {
  const builderId = SCENARIO_ALIASES[questionLanguageId] ?? questionLanguageId;
  const builder = SCENARIO_BUILDERS[builderId];
  if (!builder) throw new Error(`Missing scenario builder for ${questionLanguageId}`);
  return builder(difficultyBand, seed);
}

export function selectQuestionLanguageId(
  cpId: Pct003CanonicalProblemId,
  language: Pct003Language,
  seed: string,
  difficultyBand?: Pct003DifficultyBand,
) {
  const qlIds = getSelectableQuestionLanguageIds(cpId, language);
  const filtered = difficultyBand
    ? qlIds.filter((qlId) => getQuestionEntry(cpId, qlId, language).difficulty === difficultyBand)
    : qlIds;
  const source = filtered.length > 0 ? filtered : qlIds;
  return source[stableBucket(seed, source.length)]!;
}

export function generatePct003Parameters(cpId: Pct003CanonicalProblemId, input: Pct003ParameterInput = {}): Pct003Parameters {
  const seed = input.seed ?? `PCT-003:${cpId}`;
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
    archetypeId: PCT_003_ARCHETYPE_ID,
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

export function getPct003ActiveCanonicalProblemIds() {
  return [...PCT_003_CP_IDS] as Pct003CanonicalProblemId[];
}

export function pickPct003CanonicalProblemId(seed: string) {
  return PCT_003_CP_IDS[stableBucket(seed, PCT_003_CP_IDS.length)]!;
}

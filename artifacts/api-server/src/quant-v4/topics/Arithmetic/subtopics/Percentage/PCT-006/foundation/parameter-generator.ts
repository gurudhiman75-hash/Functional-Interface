import {
  getAnswerType,
  getCommonQuestionLanguageIds,
  getContextTag,
  getExplanationId,
  getQuestionEntry,
  getQuestionLanguageIds,
  getRequiredVariables,
  getSolveMode,
  getTaskKind,
} from "./library";
import { stableBucket } from "./math";
import {
  PCT_006_ARCHETYPE_ID,
  PCT_006_CP_IDS,
  type Pct006CanonicalProblemId,
  type Pct006DifficultyBand,
  type Pct006Language,
  type Pct006Parameters,
  type Pct006SolveMode,
  type Pct006Variables,
} from "./types";

export interface Pct006ParameterInput {
  seed?: string;
  language?: Pct006Language;
  questionLanguageId?: string;
  difficultyBand?: Pct006DifficultyBand;
}

type ContextDefinition = {
  subjectA: string;
  subjectB: string;
  subjectC: string;
  wholeLabel: string;
  valuePrefix: string;
  unitLabel: string;
  scalePool: number[];
  pairMultiplier: number;
};

type MoreThanCase = {
  rate: number;
  numerator: number;
  denominator: number;
};

const CONTEXTS: Record<string, ContextDefinition> = {
  salary: {
    subjectA: "Aman",
    subjectB: "Bharat",
    subjectC: "Charan",
    wholeLabel: "salary",
    valuePrefix: "Rs. ",
    unitLabel: "",
    scalePool: [400, 500, 600, 750, 800, 1000, 1200],
    pairMultiplier: 100,
  },
  marks: {
    subjectA: "Riya",
    subjectB: "Karan",
    subjectC: "Meera",
    wholeLabel: "marks",
    valuePrefix: "",
    unitLabel: "marks",
    scalePool: [4, 5, 6, 8, 10, 12, 15, 20],
    pairMultiplier: 1,
  },
  population: {
    subjectA: "Town A",
    subjectB: "Town B",
    subjectC: "Town C",
    wholeLabel: "population",
    valuePrefix: "",
    unitLabel: "people",
    scalePool: [100, 120, 150, 200, 250, 300],
    pairMultiplier: 10,
  },
  production: {
    subjectA: "Unit A",
    subjectB: "Unit B",
    subjectC: "Unit C",
    wholeLabel: "production",
    valuePrefix: "",
    unitLabel: "units",
    scalePool: [20, 25, 30, 40, 50, 60],
    pairMultiplier: 2,
  },
  price: {
    subjectA: "Article A",
    subjectB: "Article B",
    subjectC: "Article C",
    wholeLabel: "price",
    valuePrefix: "Rs. ",
    unitLabel: "",
    scalePool: [40, 50, 60, 80, 100, 120],
    pairMultiplier: 10,
  },
  sales: {
    subjectA: "Store A",
    subjectB: "Store B",
    subjectC: "Store C",
    wholeLabel: "sales",
    valuePrefix: "Rs. ",
    unitLabel: "",
    scalePool: [500, 800, 1000, 1200, 1500, 2000],
    pairMultiplier: 100,
  },
  attendance: {
    subjectA: "Section A",
    subjectB: "Section B",
    subjectC: "Section C",
    wholeLabel: "attendance",
    valuePrefix: "",
    unitLabel: "students",
    scalePool: [5, 6, 8, 10, 12, 15],
    pairMultiplier: 1,
  },
  stock: {
    subjectA: "Warehouse A",
    subjectB: "Warehouse B",
    subjectC: "Warehouse C",
    wholeLabel: "stock",
    valuePrefix: "",
    unitLabel: "items",
    scalePool: [20, 25, 30, 40, 50, 60],
    pairMultiplier: 5,
  },
  passengers: {
    subjectA: "Route A",
    subjectB: "Route B",
    subjectC: "Route C",
    wholeLabel: "passenger count",
    valuePrefix: "",
    unitLabel: "passengers",
    scalePool: [10, 12, 15, 20, 25, 30],
    pairMultiplier: 5,
  },
  usage: {
    subjectA: "Block A",
    subjectB: "Block B",
    subjectC: "Block C",
    wholeLabel: "monthly usage",
    valuePrefix: "",
    unitLabel: "units",
    scalePool: [10, 12, 15, 20, 25, 30],
    pairMultiplier: 5,
  },
};

const MORE_THAN_CASES: readonly MoreThanCase[] = [
  { rate: 5, numerator: 21, denominator: 20 },
  { rate: 10, numerator: 11, denominator: 10 },
  { rate: 12.5, numerator: 9, denominator: 8 },
  { rate: 15, numerator: 23, denominator: 20 },
  { rate: 20, numerator: 6, denominator: 5 },
  { rate: 25, numerator: 5, denominator: 4 },
  { rate: 30, numerator: 13, denominator: 10 },
  { rate: 40, numerator: 7, denominator: 5 },
  { rate: 50, numerator: 3, denominator: 2 },
  { rate: 60, numerator: 8, denominator: 5 },
  { rate: 75, numerator: 7, denominator: 4 },
];

const LESS_THAN_CASES: readonly MoreThanCase[] = [
  { rate: 10, numerator: 9, denominator: 10 },
  { rate: 20, numerator: 4, denominator: 5 },
  { rate: 25, numerator: 3, denominator: 4 },
  { rate: 30, numerator: 7, denominator: 10 },
  { rate: 40, numerator: 3, denominator: 5 },
  { rate: 50, numerator: 1, denominator: 2 },
  { rate: 60, numerator: 2, denominator: 5 },
  { rate: 75, numerator: 1, denominator: 4 },
];

const VALUE_PAIR_CASES: readonly [number, number][] = [
  [80, 100],
  [100, 125],
  [120, 150],
  [150, 200],
  [240, 300],
  [400, 500],
  [480, 600],
  [600, 750],
  [900, 1200],
  [960, 1200],
];

const RATE_ONLY_CASES = [20, 25, 30, 40, 50, 60, 75] as const;

const PERCENTAGE_POINT_CASES: readonly [number, number][] = [
  [20, 25],
  [25, 30],
  [30, 45],
  [40, 50],
  [50, 60],
  [60, 75],
  [80, 90],
];

const CHAIN_CASES: Record<string, readonly [number, number][]> = {
  chainAAboveB_BBelowC: [
    [20, 25],
    [25, 20],
    [50, 20],
    [40, 25],
    [20, 10],
  ],
  chainABelow_BAboveC: [
    [20, 25],
    [10, 20],
    [25, 50],
    [40, 25],
    [50, 20],
  ],
  chainAAboveB_BAboveC: [
    [20, 10],
    [25, 20],
    [50, 20],
    [10, 10],
    [40, 20],
  ],
  chainABelow_BBelowC: [
    [20, 10],
    [25, 20],
    [40, 25],
    [10, 20],
    [50, 20],
  ],
};

function pick<T>(items: readonly T[], seed: string): T {
  return items[stableBucket(seed, items.length)]!;
}

function getSelectableQuestionLanguageIds(cpId: Pct006CanonicalProblemId, language: Pct006Language) {
  return language === "en" ? getQuestionLanguageIds(cpId, "en") : getCommonQuestionLanguageIds(cpId);
}

function assignDifficulty(cpId: Pct006CanonicalProblemId, language: Pct006Language, seed: string): Pct006DifficultyBand {
  const qlIds = getSelectableQuestionLanguageIds(cpId, language);
  const qlId = qlIds[stableBucket(seed, qlIds.length)]!;
  return getQuestionEntry(cpId, qlId, language).difficulty;
}

function baseContextVariables(contextTag: string): Pct006Variables {
  const context = CONTEXTS[contextTag];
  return {
    subjectA: context.subjectA,
    subjectB: context.subjectB,
    subjectC: context.subjectC,
    wholeLabel: context.wholeLabel,
    valuePrefix: context.valuePrefix,
    unitLabel: context.unitLabel,
  };
}

function buildMoreComparison(contextTag: string, solveMode: Pct006SolveMode, seed: string): Pct006Variables {
  const context = CONTEXTS[contextTag];
  const ratioCase = pick(MORE_THAN_CASES, `${seed}:case`);
  const scale = pick(context.scalePool, `${seed}:scale`);
  const base = ratioCase.denominator * scale;
  const greater = ratioCase.numerator * scale;
  return {
    ...baseContextVariables(contextTag),
    percentageRate: ratioCase.rate,
    baseValue: solveMode === "moreFindBase" ? greater : base,
  };
}

function buildLessComparison(contextTag: string, solveMode: Pct006SolveMode, seed: string): Pct006Variables {
  const context = CONTEXTS[contextTag];
  const ratioCase = pick(LESS_THAN_CASES, `${seed}:case`);
  const scale = pick(context.scalePool, `${seed}:scale`);
  const higher = ratioCase.denominator * scale;
  const lower = ratioCase.numerator * scale;
  return {
    ...baseContextVariables(contextTag),
    percentageRate: ratioCase.rate,
    baseValue: solveMode === "lessFindBase" ? lower : higher,
  };
}

function buildValuePair(contextTag: string, seed: string) {
  const context = CONTEXTS[contextTag];
  const pair = pick(VALUE_PAIR_CASES, `${seed}:pair`);
  return [pair[0] * context.pairMultiplier, pair[1] * context.pairMultiplier] as const;
}

function buildComparisonPair(contextTag: string, seed: string) {
  const context = CONTEXTS[contextTag];
  const firstScale = pick(context.scalePool, `${seed}:first`);
  const secondScale = pick(context.scalePool, `${seed}:second`);
  return [firstScale * 10, secondScale * 10] as const;
}

function buildCrossBaseVariables(contextTag: string, seed: string): Pct006Variables {
  const context = CONTEXTS[contextTag];
  const basePool = context.scalePool.map((value) => value * 10);
  const baseValue1 = pick(basePool, `${seed}:baseValue1`);
  let baseValue2 = pick(basePool, `${seed}:baseValue2`);
  if (baseValue2 === baseValue1) {
    baseValue2 = basePool[(stableBucket(`${seed}:fallback`, basePool.length - 1) + 1) % basePool.length]!;
  }
  return {
    ...baseContextVariables(contextTag),
    rate1: pick([40, 50, 60, 70, 75, 80, 90], `${seed}:rate1`),
    rate2: pick([40, 50, 60, 70, 75, 80, 90], `${seed}:rate2`),
    baseValue1,
    baseValue2,
  };
}

function buildVariables(
  cpId: Pct006CanonicalProblemId,
  solveMode: Pct006SolveMode,
  contextTag: string,
  seed: string,
): Pct006Variables {
  switch (cpId) {
    case "PCT-CP-001":
      return buildMoreComparison(contextTag, solveMode, seed);
    case "PCT-CP-002":
      return buildLessComparison(contextTag, solveMode, seed);
    case "PCT-CP-003":
      return {
        ...baseContextVariables(contextTag),
        percentageRate:
          solveMode === "reverseLessFromMore"
            ? pick(MORE_THAN_CASES, `${seed}:moreRate`).rate
            : pick(LESS_THAN_CASES, `${seed}:lessRate`).rate,
      };
    case "PCT-CP-004": {
      const [value1, value2] = buildValuePair(contextTag, seed);
      return {
        ...baseContextVariables(contextTag),
        value1,
        value2,
      };
    }
    case "PCT-CP-005": {
      const ratios = pick(
        [
          [5, 4],
          [4, 3],
          [3, 2],
          [6, 5],
          [7, 5],
          [8, 5],
          [9, 5],
          [10, 7],
          [11, 8],
          [12, 9],
        ] as const,
        `${seed}:ratio`,
      );
      return {
        ...baseContextVariables(contextTag),
        ratioA: ratios[0],
        ratioB: ratios[1],
      };
    }
    case "PCT-CP-006": {
      const [smaller, larger] = buildValuePair(contextTag, seed);
      return {
        ...baseContextVariables(contextTag),
        value1: solveMode === "requiredIncreaseToTarget" ? smaller : larger,
        value2: solveMode === "requiredIncreaseToTarget" ? larger : smaller,
      };
    }
    case "PCT-CP-007": {
      const [value1, value2] = buildComparisonPair(contextTag, seed);
      const increaseRates = [10, 20, 25, 50] as const;
      const decreaseRates = [5, 10, 20, 25] as const;
      return {
        ...baseContextVariables(contextTag),
        value1,
        value2,
        rate1: pick(
          solveMode === "compareFinalBothDecrease" || solveMode === "compareFinalADownBUp" ? decreaseRates : increaseRates,
          `${seed}:rate1`,
        ),
        rate2: pick(
          solveMode === "compareFinalBothIncrease" || solveMode === "compareFinalADownBUp" ? increaseRates : decreaseRates,
          `${seed}:rate2`,
        ),
      };
    }
    case "PCT-CP-008": {
      const pair = pick(CHAIN_CASES[solveMode], `${seed}:chain`);
      return {
        ...baseContextVariables(contextTag),
        rate1: pair[0],
        rate2: pair[1],
      };
    }
    case "PCT-CP-009": {
      const pair = pick(PERCENTAGE_POINT_CASES, `${seed}:pointPair`);
      return {
        ...baseContextVariables(contextTag),
        oldRate: pair[0],
        newRate: pair[1],
      };
    }
    case "PCT-CP-010":
      return buildCrossBaseVariables(contextTag, seed);
  }
}

export function selectQuestionLanguageId(
  cpId: Pct006CanonicalProblemId,
  language: Pct006Language,
  seed: string,
  difficultyBand?: Pct006DifficultyBand,
) {
  const qlIds = getSelectableQuestionLanguageIds(cpId, language);
  const filtered = difficultyBand
    ? qlIds.filter((qlId) => getQuestionEntry(cpId, qlId, language).difficulty === difficultyBand)
    : qlIds;
  const source = filtered.length > 0 ? filtered : qlIds;
  return source[stableBucket(seed, source.length)]!;
}

export function generatePct006Parameters(cpId: Pct006CanonicalProblemId, input: Pct006ParameterInput = {}): Pct006Parameters {
  const seed = input.seed ?? `PCT-006:${cpId}`;
  const language = input.language ?? "en";
  const difficultyBand = input.difficultyBand ?? assignDifficulty(cpId, language, seed);
  const questionLanguageId = input.questionLanguageId ?? selectQuestionLanguageId(cpId, language, seed, difficultyBand);
  const questionEntry = getQuestionEntry(cpId, questionLanguageId, language);
  const resolvedDifficulty = questionEntry.difficulty;
  const taskKind = getTaskKind(cpId, questionLanguageId);
  const solveMode = getSolveMode(cpId, questionLanguageId);
  const answerType = getAnswerType(cpId, questionLanguageId);
  const requiredVariables = getRequiredVariables(cpId, questionLanguageId);
  const contextTag = getContextTag(cpId, questionLanguageId);
  const variables = buildVariables(cpId, solveMode, contextTag, seed);

  for (const requiredVariable of requiredVariables) {
    if (!Object.hasOwn(variables, requiredVariable)) {
      throw new Error(`Missing required variable ${requiredVariable} for ${questionLanguageId}`);
    }
  }

  return {
    archetypeId: PCT_006_ARCHETYPE_ID,
    canonicalProblemId: cpId,
    questionId: `${cpId}:${questionLanguageId}:${seed}`,
    questionLanguageId,
    explanationId: getExplanationId(cpId),
    language,
    difficultyBand: resolvedDifficulty,
    taskKind,
    solveMode,
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

export function getPct006ActiveCanonicalProblemIds() {
  return [...PCT_006_CP_IDS] as Pct006CanonicalProblemId[];
}

export function pickPct006CanonicalProblemId(seed: string) {
  return PCT_006_CP_IDS[stableBucket(seed, PCT_006_CP_IDS.length)]!;
}

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
  PCT_002_ARCHETYPE_ID,
  PCT_002_CP_IDS,
  type Pct002CanonicalProblemId,
  type Pct002DifficultyBand,
  type Pct002Language,
  type Pct002Parameters,
  type Pct002Variables,
} from "./types";

export interface Pct002ParameterInput {
  seed?: string;
  language?: Pct002Language;
  questionLanguageId?: string;
  difficultyBand?: Pct002DifficultyBand;
}

type ScenarioFactory = (difficulty: Pct002DifficultyBand, seed: string) => Pct002Variables;

function pick<T>(items: readonly T[], seed: string): T {
  return items[stableBucket(seed, items.length)]!;
}

function percentBase(seed: string, rates: readonly number[], totals: readonly number[]) {
  const rate = pick(rates, `${seed}:rate`);
  const total = pick(totals, `${seed}:total`);
  return { rate, total };
}

export function getSelectableQuestionLanguageIds(cpId: Pct002CanonicalProblemId, language: Pct002Language) {
  return language === "en" ? getQuestionLanguageIds(cpId, "en") : getCommonQuestionLanguageIds(cpId);
}

function assignDifficulty(cpId: Pct002CanonicalProblemId, language: Pct002Language, seed: string): Pct002DifficultyBand {
  const qlIds = getSelectableQuestionLanguageIds(cpId, language);
  const qlId = qlIds[stableBucket(seed, qlIds.length)]!;
  return getQuestionEntry(cpId, qlId, language).difficulty;
}

const SCENARIO_BUILDERS: Record<string, ScenarioFactory> = {
  "PCT-QL-001": (_difficulty, seed) => {
    const { rate, total } = percentBase(seed, [20, 25, 30, 40, 45], [400, 600, 720, 800, 900, 1200]);
    return { knownRate: rate, wholeValue: total, knownValue: (total * rate) / 100, wholeLabel: "students", partLabel: "girls" };
  },
  "PCT-QL-002": (_difficulty, seed) => {
    const { rate, total } = percentBase(seed, [10, 15, 20, 25], [20000, 24000, 30000, 36000, 40000, 48000]);
    return { knownRate: rate, wholeValue: total, knownValue: (total * rate) / 100, wholeLabel: "monthly income", partLabel: "savings", valuePrefix: "Rs. " };
  },
  "PCT-QL-003": (_difficulty, seed) => {
    const wholeValue = pick([20000, 25000, 30000, 36000, 40000, 50000], `${seed}:whole`);
    const knownRate = pick([20, 25, 30, 40], `${seed}:knownRate`);
    const targetRate = pick([50, 55, 60, 65, 70], `${seed}:targetRate`);
    return { knownRate, targetRate, wholeValue, knownValue: (wholeValue * knownRate) / 100, wholeLabel: "income", partLabel: "income", targetLabel: "expenditure", valuePrefix: "Rs. " };
  },
  "PCT-QL-004": (_difficulty, seed) => {
    const wholeValue = pick([280, 320, 400, 560, 700, 840], `${seed}:whole`);
    const knownRate = pick([20, 25, 35, 40], `${seed}:knownRate`);
    const targetRate = pick([45, 50, 60, 75], `${seed}:targetRate`);
    return { knownRate, targetRate, wholeValue, knownValue: (wholeValue * knownRate) / 100, wholeLabel: "students", partLabel: "students", targetLabel: "students" };
  },
  "PCT-QL-005": (_difficulty, seed) => {
    const wholeValue = pick([240, 360, 480, 600, 720], `${seed}:whole`);
    const partRate = pick([20, 25, 30, 35, 40], `${seed}:rate`);
    return { wholeValue, partValue: (wholeValue * partRate) / 100, partLabel: "girls", wholeLabel: "students" };
  },
  "PCT-QL-006": (_difficulty, seed) => {
    const wholeValue = pick([20000, 30000, 36000, 40000, 48000], `${seed}:whole`);
    const partRate = pick([10, 15, 20, 25, 30], `${seed}:rate`);
    return { wholeValue, partValue: (wholeValue * partRate) / 100, partLabel: "savings", wholeLabel: "income", valuePrefix: "Rs. " };
  },
  "PCT-QL-007": (_difficulty, seed) => {
    const knownRate = pick([25, 30, 40, 45, 50], `${seed}:knownRate`);
    const totalValue = pick([4000, 5000, 6000, 8000, 10000], `${seed}:total`);
    const targetRate = pick([15, 20, 25, 30, 35], `${seed}:targetRate`);
    return { knownRate, totalValue, knownValue: (totalValue * knownRate) / 100, targetValue: (totalValue * targetRate) / 100, wholeLabel: "salary", partLabel: "rent", targetLabel: "books", valuePrefix: "Rs. " };
  },
  "PCT-QL-008": (_difficulty, seed) => {
    const knownRate = pick([20, 25, 30, 40], `${seed}:knownRate`);
    const totalValue = pick([300, 400, 500, 600, 800], `${seed}:total`);
    const targetRate = pick([10, 15, 20, 35, 50], `${seed}:targetRate`);
    return { knownRate, totalValue, knownValue: (totalValue * knownRate) / 100, targetValue: (totalValue * targetRate) / 100, wholeLabel: "books", partLabel: "reference books", targetLabel: "story books" };
  },
  "PCT-QL-009": (_difficulty, seed) => {
    const partA = pick([1, 2, 3, 4, 5], `${seed}:a`);
    const partB = pick([1, 2, 3, 4, 5], `${seed}:b`);
    return { partA, partB, targetPartLabel: "first part" };
  },
  "PCT-QL-010": (_difficulty, seed) => {
    const partA = pick([1, 2, 3, 4, 5], `${seed}:a`);
    const partB = pick([1, 2, 3, 4, 5], `${seed}:b`);
    return { partA, partB, targetPartLabel: "second part" };
  },
  "PCT-QL-011": (_difficulty, seed) => {
    return { knownRate: pick([20, 25, 30, 40, 45], `${seed}:rate`), partLabel: "girls", complementLabel: "boys" };
  },
  "PCT-QL-012": (_difficulty, seed) => {
    return { knownRate: pick([10, 15, 18, 20, 25], `${seed}:rate`), partLabel: "savings", complementLabel: "expenditure" };
  },
  "PCT-QL-013": (_difficulty, seed) => {
    return { rate1: pick([35, 40, 45, 50], `${seed}:rate1`), rate2: pick([15, 20, 25, 30], `${seed}:rate2`), partLabel: "boys", otherLabel: "girls" };
  },
  "PCT-QL-014": (_difficulty, seed) => {
    return { rate1: pick([30, 35, 40, 45], `${seed}:rate1`), rate2: pick([10, 15, 20, 25], `${seed}:rate2`), partLabel: "food expenses", otherLabel: "transport expenses" };
  },
  "PCT-QL-015": (_difficulty, seed) => {
    const totalValue = pick([400, 600, 800, 1000, 1200], `${seed}:total`);
    const targetRate = pick([25, 35, 40], `${seed}:targetRate`);
    const otherRate = pick([20, 30, 35], `${seed}:otherRate`);
    const thirdRate = 100 - targetRate - otherRate;
    return { totalValue, targetRate, otherRate, thirdRate, wholeLabel: "students", targetLabel: "girls", otherLabel: "boys", thirdLabel: "other students" };
  },
  "PCT-QL-016": (_difficulty, seed) => {
    const totalValue = pick([12000, 16000, 20000, 24000, 30000], `${seed}:total`);
    const targetRate = pick([25, 30, 35], `${seed}:targetRate`);
    const otherRate = pick([20, 25, 30], `${seed}:otherRate`);
    const thirdRate = 100 - targetRate - otherRate;
    return { totalValue, targetRate, otherRate, thirdRate, wholeLabel: "monthly expenses", targetLabel: "rent", otherLabel: "food", thirdLabel: "transport", valuePrefix: "Rs. " };
  },
  "PCT-QL-017": (_difficulty, seed) => {
    const rate1 = pick([25, 30, 35], `${seed}:rate1`);
    const rate2 = pick([15, 20, 25], `${seed}:rate2`);
    const rate3 = pick([10, 15, 20], `${seed}:rate3`);
    return { rate1, rate2, rate3, partLabel: "food", otherLabel: "rent", thirdLabel: "transport", complementLabel: "remaining" };
  },
  "PCT-QL-018": (_difficulty, seed) => {
    const rate1 = pick([20, 25, 30], `${seed}:rate1`);
    const rate2 = pick([15, 20, 25], `${seed}:rate2`);
    const rate3 = pick([10, 15, 20], `${seed}:rate3`);
    return { rate1, rate2, rate3, partLabel: "marketing", otherLabel: "salaries", thirdLabel: "rent", complementLabel: "other expenses" };
  },
  "PCT-QL-019": (_difficulty, seed) => {
    const totalValue = pick([4000, 5000, 6000, 8000, 10000], `${seed}:total`);
    const rateMale = pick([35, 40, 45], `${seed}:male`);
    const rateFemale = pick([30, 35, 40], `${seed}:female`);
    const rateChildren = 100 - rateMale - rateFemale;
    return { totalValue, targetRate: rateChildren, rate1: rateMale, rate2: rateFemale, wholeLabel: "population", targetLabel: "children", otherLabel: "males", thirdLabel: "females" };
  },
  "PCT-QL-020": (_difficulty, seed) => {
    const totalValue = pick([20000, 24000, 30000, 36000, 40000], `${seed}:total`);
    const rateFood = pick([25, 30, 35], `${seed}:food`);
    const rateRent = pick([20, 25, 30], `${seed}:rent`);
    const rateTransport = pick([10, 15, 20], `${seed}:transport`);
    const rateEducation = 100 - rateFood - rateRent - rateTransport;
    return { totalValue, targetRate: rateEducation, rate1: rateFood, rate2: rateRent, rate3: rateTransport, wholeLabel: "monthly expenses", targetLabel: "education", otherLabel: "food", thirdLabel: "rent", fourthLabel: "transport", valuePrefix: "Rs. " };
  },
};

const SCENARIO_ALIASES: Record<string, string> = Object.fromEntries(
  [
    ["021", "001"], ["022", "001"], ["023", "001"], ["024", "003"], ["025", "004"], ["026", "004"],
    ["027", "005"], ["028", "005"], ["029", "005"], ["030", "007"], ["031", "008"], ["032", "008"],
    ["033", "009"], ["034", "010"], ["035", "009"], ["036", "011"], ["037", "012"], ["038", "011"],
    ["039", "013"], ["040", "014"], ["041", "014"], ["042", "015"], ["043", "015"], ["044", "015"],
    ["045", "017"], ["046", "018"], ["047", "017"], ["048", "019"], ["049", "019"], ["050", "020"],
  ].map(([alias, base]) => [`PCT-QL-${alias}`, `PCT-QL-${base}`]),
);

function createVariables(questionLanguageId: string, difficultyBand: Pct002DifficultyBand, seed: string) {
  const builderId = SCENARIO_ALIASES[questionLanguageId] ?? questionLanguageId;
  const builder = SCENARIO_BUILDERS[builderId];
  if (!builder) throw new Error(`Missing scenario builder for ${questionLanguageId}`);
  return builder(difficultyBand, seed);
}

export function selectQuestionLanguageId(
  cpId: Pct002CanonicalProblemId,
  language: Pct002Language,
  seed: string,
  difficultyBand?: Pct002DifficultyBand,
) {
  const qlIds = getSelectableQuestionLanguageIds(cpId, language);
  const filtered = difficultyBand
    ? qlIds.filter((qlId) => getQuestionEntry(cpId, qlId, language).difficulty === difficultyBand)
    : qlIds;
  const source = filtered.length > 0 ? filtered : qlIds;
  return source[stableBucket(seed, source.length)]!;
}

export function generatePct002Parameters(cpId: Pct002CanonicalProblemId, input: Pct002ParameterInput = {}): Pct002Parameters {
  const seed = input.seed ?? `PCT-002:${cpId}`;
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
    archetypeId: PCT_002_ARCHETYPE_ID,
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

export function getPct002ActiveCanonicalProblemIds() {
  return [...PCT_002_CP_IDS] as Pct002CanonicalProblemId[];
}

export function pickPct002CanonicalProblemId(seed: string) {
  return PCT_002_CP_IDS[stableBucket(seed, PCT_002_CP_IDS.length)]!;
}

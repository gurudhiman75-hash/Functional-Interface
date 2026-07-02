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

export function getSelectableQuestionLanguageIds(cpId: Pct003CanonicalProblemId, language: Pct003Language) {
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
  "PCT-QL-051": "PCT-QL-001",
  "PCT-QL-052": "PCT-QL-001",
  "PCT-QL-053": "PCT-QL-001",
  "PCT-QL-054": "PCT-QL-001",
  "PCT-QL-055": "PCT-QL-001",
  "PCT-QL-056": "PCT-QL-002",
  "PCT-QL-057": "PCT-QL-002",
  "PCT-QL-058": "PCT-QL-002",
  "PCT-QL-059": "PCT-QL-002",
  "PCT-QL-060": "PCT-QL-002",
  "PCT-QL-061": "PCT-QL-003",
  "PCT-QL-062": "PCT-QL-003",
  "PCT-QL-063": "PCT-QL-003",
  "PCT-QL-064": "PCT-QL-003",
  "PCT-QL-065": "PCT-QL-003",
  "PCT-QL-066": "PCT-QL-004",
  "PCT-QL-067": "PCT-QL-004",
  "PCT-QL-068": "PCT-QL-004",
  "PCT-QL-069": "PCT-QL-004",
  "PCT-QL-070": "PCT-QL-004",
  "PCT-QL-071": "PCT-QL-005",
  "PCT-QL-072": "PCT-QL-005",
  "PCT-QL-073": "PCT-QL-005",
  "PCT-QL-074": "PCT-QL-005",
  "PCT-QL-075": "PCT-QL-005",
  "PCT-QL-076": "PCT-QL-006",
  "PCT-QL-077": "PCT-QL-006",
  "PCT-QL-078": "PCT-QL-006",
  "PCT-QL-079": "PCT-QL-006",
  "PCT-QL-080": "PCT-QL-006",
  "PCT-QL-081": "PCT-QL-007",
  "PCT-QL-082": "PCT-QL-007",
  "PCT-QL-083": "PCT-QL-008",
  "PCT-QL-084": "PCT-QL-008",
  "PCT-QL-085": "PCT-QL-007",
  "PCT-QL-086": "PCT-QL-007",
  "PCT-QL-087": "PCT-QL-008",
  "PCT-QL-088": "PCT-QL-008",
  "PCT-QL-089": "PCT-QL-007",
  "PCT-QL-090": "PCT-QL-008",
  "PCT-QL-091": "PCT-QL-009",
  "PCT-QL-092": "PCT-QL-009",
  "PCT-QL-093": "PCT-QL-009",
  "PCT-QL-094": "PCT-QL-009",
  "PCT-QL-095": "PCT-QL-009",
  "PCT-QL-096": "PCT-QL-010",
  "PCT-QL-097": "PCT-QL-010",
  "PCT-QL-098": "PCT-QL-010",
  "PCT-QL-099": "PCT-QL-010",
  "PCT-QL-100": "PCT-QL-010",
  "PCT-QL-101": "PCT-QL-011",
  "PCT-QL-102": "PCT-QL-011",
  "PCT-QL-103": "PCT-QL-012",
  "PCT-QL-104": "PCT-QL-011",
  "PCT-QL-105": "PCT-QL-012",
  "PCT-QL-106": "PCT-QL-011",
  "PCT-QL-107": "PCT-QL-012",
  "PCT-QL-108": "PCT-QL-011",
  "PCT-QL-109": "PCT-QL-012",
  "PCT-QL-110": "PCT-QL-011",
  "PCT-QL-111": "PCT-QL-013",
  "PCT-QL-112": "PCT-QL-013",
  "PCT-QL-113": "PCT-QL-013",
  "PCT-QL-114": "PCT-QL-013",
  "PCT-QL-115": "PCT-QL-013",
  "PCT-QL-116": "PCT-QL-014",
  "PCT-QL-117": "PCT-QL-014",
  "PCT-QL-118": "PCT-QL-014",
  "PCT-QL-119": "PCT-QL-014",
  "PCT-QL-120": "PCT-QL-014",
  "PCT-QL-121": "PCT-QL-015",
  "PCT-QL-122": "PCT-QL-015",
  "PCT-QL-123": "PCT-QL-016",
  "PCT-QL-124": "PCT-QL-015",
  "PCT-QL-125": "PCT-QL-016",
  "PCT-QL-126": "PCT-QL-015",
  "PCT-QL-127": "PCT-QL-016",
  "PCT-QL-128": "PCT-QL-015",
  "PCT-QL-129": "PCT-QL-016",
  "PCT-QL-130": "PCT-QL-015",
  "PCT-QL-131": "PCT-QL-017",
  "PCT-QL-132": "PCT-QL-017",
  "PCT-QL-133": "PCT-QL-017",
  "PCT-QL-134": "PCT-QL-017",
  "PCT-QL-135": "PCT-QL-017",
  "PCT-QL-136": "PCT-QL-018",
  "PCT-QL-137": "PCT-QL-018",
  "PCT-QL-138": "PCT-QL-018",
  "PCT-QL-139": "PCT-QL-018",
  "PCT-QL-140": "PCT-QL-018",
  "PCT-QL-141": "PCT-QL-019",
  "PCT-QL-142": "PCT-QL-019",
  "PCT-QL-143": "PCT-QL-019",
  "PCT-QL-144": "PCT-QL-019",
  "PCT-QL-145": "PCT-QL-019",
  "PCT-QL-146": "PCT-QL-020",
  "PCT-QL-147": "PCT-QL-020",
  "PCT-QL-148": "PCT-QL-020",
  "PCT-QL-149": "PCT-QL-020",
  "PCT-QL-150": "PCT-QL-020",
};

const SCENARIO_VARIABLE_OVERRIDES: Record<string, Partial<Pct003Variables>> = {
  "PCT-QL-021": { wholeLabel: "electricity consumption", valuePrefix: "" },
  "PCT-QL-022": { wholeLabel: "internet users" },
  "PCT-QL-023": { wholeLabel: "crop production" },
  "PCT-QL-024": { wholeLabel: "salary" },
  "PCT-QL-025": { wholeLabel: "seating capacity" },
  "PCT-QL-026": { wholeLabel: "milk production" },
  "PCT-QL-027": { wholeLabel: "price" },
  "PCT-QL-028": { wholeLabel: "stock" },
  "PCT-QL-029": { wholeLabel: "number of internet users" },
  "PCT-QL-030": { wholeLabel: "quantity" },
  "PCT-QL-031": { wholeLabel: "price" },
  "PCT-QL-032": { wholeLabel: "production" },
  "PCT-QL-033": { wholeLabel: "number of students" },
  "PCT-QL-034": { wholeLabel: "production" },
  "PCT-QL-035": { wholeLabel: "number of mobile users" },
  "PCT-QL-036": { wholeLabel: "sales" },
  "PCT-QL-037": { wholeLabel: "number of visitors" },
  "PCT-QL-038": { wholeLabel: "quantity" },
  "PCT-QL-039": { labelA: "Branch A sales", labelB: "Branch B sales" },
  "PCT-QL-040": { labelA: "population of Town A", labelB: "population of Town B" },
  "PCT-QL-041": { labelA: "price of Product A", labelB: "price of Product B" },
  "PCT-QL-042": { wholeLabel: "employees", partLabel: "trained employees", otherLabel: "untrained employees" },
  "PCT-QL-043": { wholeLabel: "respondents", partLabel: "yes responses", otherLabel: "no responses" },
  "PCT-QL-044": { wholeLabel: "passengers", partLabel: "adult passengers", otherLabel: "student passengers" },
  "PCT-QL-045": { wholeLabel: "sales" },
  "PCT-QL-046": { wholeLabel: "production" },
  "PCT-QL-047": { wholeLabel: "internet users" },
  "PCT-QL-048": { wholeLabel: "number of mobile users" },
  "PCT-QL-049": { wholeLabel: "cattle population" },
  "PCT-QL-050": { wholeLabel: "machine output", valuePrefix: "" },
  "PCT-QL-051": { wholeLabel: "fixed deposit" },
  "PCT-QL-052": { wholeLabel: "monthly salary" },
  "PCT-QL-053": { wholeLabel: "profit" },
  "PCT-QL-054": { wholeLabel: "premium collection" },
  "PCT-QL-055": { wholeLabel: "investment value" },
  "PCT-QL-056": { wholeLabel: "households" },
  "PCT-QL-057": { wholeLabel: "students" },
  "PCT-QL-058": { wholeLabel: "bags of cement" },
  "PCT-QL-059": { wholeLabel: "passengers" },
  "PCT-QL-060": { wholeLabel: "employees" },
  "PCT-QL-061": { wholeLabel: "monthly income" },
  "PCT-QL-062": { wholeLabel: "rent collection" },
  "PCT-QL-063": { wholeLabel: "bonus fund" },
  "PCT-QL-064": { wholeLabel: "commission income" },
  "PCT-QL-065": { wholeLabel: "tax collection" },
  "PCT-QL-066": { wholeLabel: "residents" },
  "PCT-QL-067": { wholeLabel: "applicants" },
  "PCT-QL-068": { wholeLabel: "cartons" },
  "PCT-QL-069": { wholeLabel: "passengers" },
  "PCT-QL-070": { wholeLabel: "units" },
  "PCT-QL-071": { wholeLabel: "price" },
  "PCT-QL-072": { wholeLabel: "income" },
  "PCT-QL-073": { wholeLabel: "investment" },
  "PCT-QL-074": { wholeLabel: "monthly turnover" },
  "PCT-QL-075": { wholeLabel: "salary" },
  "PCT-QL-076": { wholeLabel: "students" },
  "PCT-QL-077": { wholeLabel: "residents" },
  "PCT-QL-078": { wholeLabel: "cartons" },
  "PCT-QL-079": { wholeLabel: "passengers" },
  "PCT-QL-080": { wholeLabel: "accounts" },
  "PCT-QL-081": { wholeLabel: "salary" },
  "PCT-QL-082": { wholeLabel: "price" },
  "PCT-QL-083": { wholeLabel: "population" },
  "PCT-QL-084": { wholeLabel: "production" },
  "PCT-QL-085": { wholeLabel: "income" },
  "PCT-QL-086": { wholeLabel: "rent" },
  "PCT-QL-087": { wholeLabel: "sales" },
  "PCT-QL-088": { wholeLabel: "stock" },
  "PCT-QL-089": { wholeLabel: "attendance" },
  "PCT-QL-090": { wholeLabel: "output" },
  "PCT-QL-091": { wholeLabel: "market value" },
  "PCT-QL-092": { wholeLabel: "price" },
  "PCT-QL-093": { wholeLabel: "salary" },
  "PCT-QL-094": { wholeLabel: "sales" },
  "PCT-QL-095": { wholeLabel: "investment value" },
  "PCT-QL-096": { wholeLabel: "residents" },
  "PCT-QL-097": { wholeLabel: "boxes" },
  "PCT-QL-098": { wholeLabel: "passengers" },
  "PCT-QL-099": { wholeLabel: "students" },
  "PCT-QL-100": { wholeLabel: "units" },
  "PCT-QL-101": { wholeLabel: "price" },
  "PCT-QL-102": { wholeLabel: "salary" },
  "PCT-QL-103": { wholeLabel: "sales" },
  "PCT-QL-104": { wholeLabel: "production" },
  "PCT-QL-105": { wholeLabel: "population" },
  "PCT-QL-106": { wholeLabel: "turnover" },
  "PCT-QL-107": { wholeLabel: "attendance" },
  "PCT-QL-108": { wholeLabel: "stock" },
  "PCT-QL-109": { wholeLabel: "income" },
  "PCT-QL-110": { wholeLabel: "output" },
  "PCT-QL-111": { labelA: "Branch A sales", labelB: "Branch B sales" },
  "PCT-QL-112": { labelA: "salary A", labelB: "salary B" },
  "PCT-QL-113": { labelA: "Product A price", labelB: "Product B price" },
  "PCT-QL-114": { labelA: "Shop A revenue", labelB: "Shop B revenue" },
  "PCT-QL-115": { labelA: "Fund A value", labelB: "Fund B value" },
  "PCT-QL-116": { labelA: "Town A population", labelB: "Town B population" },
  "PCT-QL-117": { labelA: "Section A attendance", labelB: "Section B attendance" },
  "PCT-QL-118": { labelA: "Warehouse A stock", labelB: "Warehouse B stock" },
  "PCT-QL-119": { labelA: "Route A passengers", labelB: "Route B passengers" },
  "PCT-QL-120": { labelA: "Unit A output", labelB: "Unit B output" },
  "PCT-QL-121": { wholeLabel: "students", partLabel: "girls", otherLabel: "boys" },
  "PCT-QL-122": { wholeLabel: "employees", partLabel: "trained employees", otherLabel: "untrained employees" },
  "PCT-QL-123": { wholeLabel: "workers", partLabel: "skilled workers", otherLabel: "unskilled workers" },
  "PCT-QL-124": { wholeLabel: "respondents", partLabel: "online respondents", otherLabel: "offline respondents" },
  "PCT-QL-125": { wholeLabel: "voters", partLabel: "female voters", otherLabel: "male voters" },
  "PCT-QL-126": { wholeLabel: "employees", partLabel: "permanent employees", otherLabel: "contract employees" },
  "PCT-QL-127": { wholeLabel: "passengers", partLabel: "adult passengers", otherLabel: "child passengers" },
  "PCT-QL-128": { wholeLabel: "students", partLabel: "hostellers", otherLabel: "day scholars" },
  "PCT-QL-129": { wholeLabel: "residents", partLabel: "literate residents", otherLabel: "illiterate residents" },
  "PCT-QL-130": { wholeLabel: "workers", partLabel: "male workers", otherLabel: "female workers" },
  "PCT-QL-131": { wholeLabel: "salary" },
  "PCT-QL-132": { wholeLabel: "monthly income" },
  "PCT-QL-133": { wholeLabel: "sales target" },
  "PCT-QL-134": { wholeLabel: "budget" },
  "PCT-QL-135": { wholeLabel: "investment value" },
  "PCT-QL-136": { wholeLabel: "students" },
  "PCT-QL-137": { wholeLabel: "residents" },
  "PCT-QL-138": { wholeLabel: "cartons" },
  "PCT-QL-139": { wholeLabel: "passengers" },
  "PCT-QL-140": { wholeLabel: "applicants" },
  "PCT-QL-141": { wholeLabel: "population" },
  "PCT-QL-142": { wholeLabel: "number of users" },
  "PCT-QL-143": { wholeLabel: "residents" },
  "PCT-QL-144": { wholeLabel: "passengers" },
  "PCT-QL-145": { wholeLabel: "units" },
  "PCT-QL-146": { wholeLabel: "investment value" },
  "PCT-QL-147": { wholeLabel: "sales figure" },
  "PCT-QL-148": { wholeLabel: "investment value" },
  "PCT-QL-149": { wholeLabel: "annual turnover" },
  "PCT-QL-150": { wholeLabel: "fund value" },
};

function createVariables(questionLanguageId: string, difficultyBand: Pct003DifficultyBand, seed: string) {
  const builderId = SCENARIO_ALIASES[questionLanguageId] ?? questionLanguageId;
  const builder = SCENARIO_BUILDERS[builderId];
  if (!builder) throw new Error(`Missing scenario builder for ${questionLanguageId}`);
  return {
    ...builder(difficultyBand, seed),
    ...(SCENARIO_VARIABLE_OVERRIDES[questionLanguageId] ?? {}),
  };
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

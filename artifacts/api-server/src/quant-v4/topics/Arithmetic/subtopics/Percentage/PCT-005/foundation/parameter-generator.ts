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

export function getSelectableQuestionLanguageIds(cpId: Pct005CanonicalProblemId, language: Pct005Language) {
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
  "PCT-QL-051": "PCT-QL-002",
  "PCT-QL-052": "PCT-QL-002",
  "PCT-QL-053": "PCT-QL-002",
  "PCT-QL-054": "PCT-QL-002",
  "PCT-QL-055": "PCT-QL-002",
  "PCT-QL-056": "PCT-QL-001",
  "PCT-QL-057": "PCT-QL-001",
  "PCT-QL-058": "PCT-QL-001",
  "PCT-QL-059": "PCT-QL-001",
  "PCT-QL-060": "PCT-QL-001",
  "PCT-QL-061": "PCT-QL-004",
  "PCT-QL-062": "PCT-QL-004",
  "PCT-QL-063": "PCT-QL-004",
  "PCT-QL-064": "PCT-QL-004",
  "PCT-QL-065": "PCT-QL-004",
  "PCT-QL-066": "PCT-QL-003",
  "PCT-QL-067": "PCT-QL-003",
  "PCT-QL-068": "PCT-QL-003",
  "PCT-QL-069": "PCT-QL-003",
  "PCT-QL-070": "PCT-QL-003",
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
  "PCT-QL-083": "PCT-QL-007",
  "PCT-QL-084": "PCT-QL-007",
  "PCT-QL-085": "PCT-QL-007",
  "PCT-QL-086": "PCT-QL-008",
  "PCT-QL-087": "PCT-QL-008",
  "PCT-QL-088": "PCT-QL-008",
  "PCT-QL-089": "PCT-QL-008",
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
  "PCT-QL-103": "PCT-QL-011",
  "PCT-QL-104": "PCT-QL-011",
  "PCT-QL-105": "PCT-QL-011",
  "PCT-QL-106": "PCT-QL-012",
  "PCT-QL-107": "PCT-QL-012",
  "PCT-QL-108": "PCT-QL-012",
  "PCT-QL-109": "PCT-QL-012",
  "PCT-QL-110": "PCT-QL-012",
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
  "PCT-QL-123": "PCT-QL-015",
  "PCT-QL-124": "PCT-QL-015",
  "PCT-QL-125": "PCT-QL-015",
  "PCT-QL-126": "PCT-QL-016",
  "PCT-QL-127": "PCT-QL-016",
  "PCT-QL-128": "PCT-QL-016",
  "PCT-QL-129": "PCT-QL-016",
  "PCT-QL-130": "PCT-QL-016",
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

const SCENARIO_VARIABLE_OVERRIDES: Record<string, Partial<Pct005Variables>> = {
  "PCT-QL-021": { wholeLabel: "output" },
  "PCT-QL-022": { wholeLabel: "sales figure" },
  "PCT-QL-023": { wholeLabel: "passenger count" },
  "PCT-QL-024": { wholeLabel: "stock" },
  "PCT-QL-025": { wholeLabel: "asset value" },
  "PCT-QL-026": { wholeLabel: "active users" },
  "PCT-QL-027": { wholeLabel: "selling price" },
  "PCT-QL-028": { wholeLabel: "production" },
  "PCT-QL-029": { wholeLabel: "admissions" },
  "PCT-QL-030": { wholeLabel: "bill amount" },
  "PCT-QL-031": { wholeLabel: "stock" },
  "PCT-QL-032": { wholeLabel: "attendance" },
  "PCT-QL-033": { wholeLabel: "passenger count" },
  "PCT-QL-034": { wholeLabel: "sales" },
  "PCT-QL-035": { wholeLabel: "wildlife population" },
  "PCT-QL-036": { wholeLabel: "usage index" },
  "PCT-QL-037": { wholeLabel: "price" },
  "PCT-QL-038": { wholeLabel: "revenue" },
  "PCT-QL-039": { wholeLabel: "price" },
  "PCT-QL-040": { wholeLabel: "stock" },
  "PCT-QL-041": { wholeLabel: "admissions" },
  "PCT-QL-042": { labelA: "Branch A stock", labelB: "Branch B stock" },
  "PCT-QL-043": { labelA: "Product A price", labelB: "Product B price" },
  "PCT-QL-044": { labelA: "School A attendance", labelB: "School B attendance" },
  "PCT-QL-045": { wholeLabel: "sales" },
  "PCT-QL-046": { wholeLabel: "stock" },
  "PCT-QL-047": { wholeLabel: "price" },
  "PCT-QL-048": { wholeLabel: "turnout" },
  "PCT-QL-049": { wholeLabel: "stock" },
  "PCT-QL-050": { wholeLabel: "revenue" },
  "PCT-QL-051": { wholeLabel: "market value" },
  "PCT-QL-052": { wholeLabel: "monthly salary" },
  "PCT-QL-053": { wholeLabel: "price" },
  "PCT-QL-054": { wholeLabel: "premium amount" },
  "PCT-QL-055": { wholeLabel: "fixed deposit" },
  "PCT-QL-056": { wholeLabel: "residents" },
  "PCT-QL-057": { wholeLabel: "students" },
  "PCT-QL-058": { wholeLabel: "cartons" },
  "PCT-QL-059": { wholeLabel: "passengers" },
  "PCT-QL-060": { wholeLabel: "units" },
  "PCT-QL-061": { wholeLabel: "salary" },
  "PCT-QL-062": { wholeLabel: "turnover" },
  "PCT-QL-063": { wholeLabel: "budget amount" },
  "PCT-QL-064": { wholeLabel: "premium amount" },
  "PCT-QL-065": { wholeLabel: "fund value" },
  "PCT-QL-066": { wholeLabel: "residents" },
  "PCT-QL-067": { wholeLabel: "students" },
  "PCT-QL-068": { wholeLabel: "cartons" },
  "PCT-QL-069": { wholeLabel: "passengers" },
  "PCT-QL-070": { wholeLabel: "units" },
  "PCT-QL-071": { wholeLabel: "market value" },
  "PCT-QL-072": { wholeLabel: "index value" },
  "PCT-QL-073": { wholeLabel: "asset value" },
  "PCT-QL-074": { wholeLabel: "budget allocation" },
  "PCT-QL-075": { wholeLabel: "fund value" },
  "PCT-QL-076": { wholeLabel: "residents" },
  "PCT-QL-077": { wholeLabel: "students" },
  "PCT-QL-078": { wholeLabel: "cartons" },
  "PCT-QL-079": { wholeLabel: "passengers" },
  "PCT-QL-080": { wholeLabel: "units" },
  "PCT-QL-081": { wholeLabel: "investment value" },
  "PCT-QL-082": { wholeLabel: "market value" },
  "PCT-QL-083": { wholeLabel: "assessed value" },
  "PCT-QL-084": { wholeLabel: "contract value" },
  "PCT-QL-085": { wholeLabel: "fund value" },
  "PCT-QL-086": { wholeLabel: "residents" },
  "PCT-QL-087": { wholeLabel: "students" },
  "PCT-QL-088": { wholeLabel: "cartons" },
  "PCT-QL-089": { wholeLabel: "passengers" },
  "PCT-QL-090": { wholeLabel: "units" },
  "PCT-QL-091": { wholeLabel: "traffic volume" },
  "PCT-QL-092": { wholeLabel: "revenue" },
  "PCT-QL-093": { wholeLabel: "index value" },
  "PCT-QL-094": { wholeLabel: "production level" },
  "PCT-QL-095": { wholeLabel: "portfolio value" },
  "PCT-QL-096": { wholeLabel: "market demand" },
  "PCT-QL-097": { wholeLabel: "sales" },
  "PCT-QL-098": { wholeLabel: "attendance" },
  "PCT-QL-099": { wholeLabel: "stock" },
  "PCT-QL-100": { wholeLabel: "output" },
  "PCT-QL-101": { wholeLabel: "productivity index" },
  "PCT-QL-102": { wholeLabel: "cost index" },
  "PCT-QL-103": { wholeLabel: "market value" },
  "PCT-QL-104": { wholeLabel: "production level" },
  "PCT-QL-105": { wholeLabel: "sales figure" },
  "PCT-QL-106": { wholeLabel: "price" },
  "PCT-QL-107": { wholeLabel: "attendance" },
  "PCT-QL-108": { wholeLabel: "stock" },
  "PCT-QL-109": { wholeLabel: "output" },
  "PCT-QL-110": { wholeLabel: "revenue" },
  "PCT-QL-111": { wholeLabel: "sales figure" },
  "PCT-QL-112": { wholeLabel: "market value" },
  "PCT-QL-113": { wholeLabel: "fund value" },
  "PCT-QL-114": { wholeLabel: "output level" },
  "PCT-QL-115": { wholeLabel: "assessment score" },
  "PCT-QL-116": { wholeLabel: "passenger count" },
  "PCT-QL-117": { wholeLabel: "stock" },
  "PCT-QL-118": { wholeLabel: "attendance" },
  "PCT-QL-119": { wholeLabel: "voter turnout" },
  "PCT-QL-120": { wholeLabel: "output" },
  "PCT-QL-121": { labelA: "Branch A sales", labelB: "Branch B sales" },
  "PCT-QL-122": { labelA: "Fund A value", labelB: "Fund B value" },
  "PCT-QL-123": { labelA: "Unit A output", labelB: "Unit B output" },
  "PCT-QL-124": { labelA: "Store A turnover", labelB: "Store B turnover" },
  "PCT-QL-125": { labelA: "Route A passengers", labelB: "Route B passengers" },
  "PCT-QL-126": { labelA: "Salary A", labelB: "Salary B" },
  "PCT-QL-127": { labelA: "Product A price", labelB: "Product B price" },
  "PCT-QL-128": { labelA: "Store A sales", labelB: "Store B sales" },
  "PCT-QL-129": { labelA: "Asset A value", labelB: "Asset B value" },
  "PCT-QL-130": { labelA: "Fund A value", labelB: "Fund B value" },
  "PCT-QL-131": { wholeLabel: "sales" },
  "PCT-QL-132": { wholeLabel: "stock" },
  "PCT-QL-133": { wholeLabel: "price" },
  "PCT-QL-134": { wholeLabel: "output" },
  "PCT-QL-135": { wholeLabel: "attendance" },
  "PCT-QL-136": { wholeLabel: "revenue" },
  "PCT-QL-137": { wholeLabel: "stock" },
  "PCT-QL-138": { wholeLabel: "price" },
  "PCT-QL-139": { wholeLabel: "output" },
  "PCT-QL-140": { wholeLabel: "attendance" },
  "PCT-QL-141": { wholeLabel: "residents" },
  "PCT-QL-142": { wholeLabel: "students" },
  "PCT-QL-143": { wholeLabel: "cartons" },
  "PCT-QL-144": { wholeLabel: "passengers" },
  "PCT-QL-145": { wholeLabel: "units" },
  "PCT-QL-146": { wholeLabel: "sales figure" },
  "PCT-QL-147": { wholeLabel: "salary" },
  "PCT-QL-148": { wholeLabel: "investment value" },
  "PCT-QL-149": { wholeLabel: "budget amount" },
  "PCT-QL-150": { wholeLabel: "revenue" },
};

function createVariables(questionLanguageId: string, difficultyBand: Pct005DifficultyBand, seed: string) {
  const builderId = SCENARIO_ALIASES[questionLanguageId] ?? questionLanguageId;
  const builder = SCENARIO_BUILDERS[builderId];
  if (!builder) throw new Error(`Missing scenario builder for ${questionLanguageId}`);
  return {
    ...builder(difficultyBand, seed),
    ...(SCENARIO_VARIABLE_OVERRIDES[questionLanguageId] ?? {}),
  };
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

import { hashSeed, pick, ratioDisplay, seededRandom, shuffle } from "../DI-001/exact";
import type {
  Di008Difficulty,
  Di008ExamProfile,
  Di008Explanation,
  Di008Option,
  Di008Question,
  Di008QuestionSet,
  Di008Row,
  Di008Stimulus,
  Di008TaskKind,
  Di008ValidationCheck,
} from "./types";

const PRODUCTS = ["Product A", "Product B", "Product C", "Product D", "Product E"] as const;
const PREVIOUS_UNITS = [200, 240, 280, 320, 360] as const;
const GROWTH_RATES = [10, 20, 25, 40, 50] as const;
const COSTS = [40, 60, 80, 100, 120] as const;
const PROFIT_RATES = [10, 20, 25, 40, 50] as const;
const INDEXES = [0, 1, 2, 3, 4] as const;

type Candidate = Readonly<{ text: string; misconceptionId: string; derivation: string }>;
type Draft = Readonly<{
  kind: Di008TaskKind;
  difficulty: Di008Difficulty;
  stem: string;
  answer: string;
  candidates: readonly Candidate[];
  explanation: Di008Explanation;
  evidence: Readonly<{ primaryIndices: readonly number[]; secondaryIndices?: readonly number[] }>;
}>;

function formatQuotient(numerator: number, denominator: number): string {
  if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator) || denominator <= 0) {
    throw new Error("DI-008 received an invalid rational value.");
  }
  const sign = numerator < 0 ? -1n : 1n;
  const n = BigInt(Math.abs(numerator));
  const d = BigInt(denominator);
  const hundredths = (n * 100n + d / 2n) / d;
  const whole = hundredths / 100n;
  const fraction = Number(hundredths % 100n);
  const prefix = sign < 0n ? "-" : "";
  if (fraction === 0) return `${prefix}${whole}`;
  if (fraction % 10 === 0) return `${prefix}${whole}.${fraction / 10}`;
  return `${prefix}${whole}.${String(fraction).padStart(2, "0")}`;
}

function formatPercent(numerator: number, denominator: number): string {
  return `${formatQuotient(numerator * 100, denominator)}%`;
}

function buildStimulus(seed: string): Di008Stimulus {
  const previousUnits = shuffle(seededRandom(`${seed}:previous-units`), PREVIOUS_UNITS);
  const growthRates = shuffle(seededRandom(`${seed}:growth-rates`), GROWTH_RATES);
  const costs = shuffle(seededRandom(`${seed}:costs`), COSTS);
  const profitRates = shuffle(seededRandom(`${seed}:profit-rates`), PROFIT_RATES);

  const rows: Di008Row[] = PRODUCTS.map((product, index) => {
    const unitsPrevious = previousUnits[index]!;
    const growth = growthRates[index]!;
    const unitsCurrent = (unitsPrevious * (100 + growth)) / 100;
    const costPerUnit = costs[index]!;
    const sellingPricePerUnit = (costPerUnit * (100 + profitRates[index]!)) / 100;
    if (!Number.isSafeInteger(unitsCurrent) || !Number.isSafeInteger(sellingPricePerUnit)) {
      throw new Error("DI-008 state must be integral by construction.");
    }
    return { product, unitsPrevious, unitsCurrent, costPerUnit, sellingPricePerUnit };
  });

  return {
    kind: "ARITHMETIC_TABLE",
    title: "Sales and unit economics of five products",
    instruction: "The table gives units sold in two periods along with cost price and selling price per unit. Answer the five questions that follow.",
    rows,
    unit: "units",
    currency: "INR",
  };
}

function sum(rows: readonly Di008Row[], indices: readonly number[], key: "unitsPrevious" | "unitsCurrent"): number {
  return indices.reduce((total, index) => total + rows[index]![key], 0);
}

function costTotal(rows: readonly Di008Row[], indices: readonly number[]): number {
  return indices.reduce((total, index) => total + rows[index]!.unitsCurrent * rows[index]!.costPerUnit, 0);
}

function revenueTotal(rows: readonly Di008Row[], indices: readonly number[]): number {
  return indices.reduce((total, index) => total + rows[index]!.unitsCurrent * rows[index]!.sellingPricePerUnit, 0);
}

function profitTotal(rows: readonly Di008Row[], indices: readonly number[]): number {
  return revenueTotal(rows, indices) - costTotal(rows, indices);
}

function names(rows: readonly Di008Row[], indices: readonly number[]): string {
  return indices.map((index) => rows[index]!.product).join(indices.length === 2 ? " and " : ", ");
}

function buildOptions(seed: string, answer: string, candidates: readonly Candidate[]) {
  const seen = new Set<string>();
  const retained: Di008Option[] = [];
  const add = (candidate: Candidate) => {
    const key = candidate.text.trim().toLowerCase();
    if (!candidate.text.trim() || seen.has(key)) return;
    seen.add(key);
    retained.push(candidate);
  };
  add({ text: answer, misconceptionId: "CORRECT", derivation: "Exact recomputation from the shared DI-008 arithmetic dataset." });
  candidates.forEach(add);
  if (retained.length < 5) throw new Error(`DI-008 could construct only ${retained.length} unique options; 5 are required.`);
  const shuffled = shuffle(seededRandom(`${seed}:options`), retained.slice(0, 5));
  const correctIndex = shuffled.findIndex((option) => option.misconceptionId === "CORRECT");
  if (correctIndex < 0) throw new Error("DI-008 lost the correct option during deterministic shuffling.");
  return { options: shuffled.map((option) => option.text), optionMetadata: shuffled, correctIndex };
}

function buildDrafts(seed: string, profile: Di008ExamProfile, stimulus: Di008Stimulus): Draft[] {
  const rows = stimulus.rows;
  const order = shuffle(seededRandom(`${seed}:${profile}:roles`), INDEXES);
  const changeIndices = profile === "BANKING_PRELIMS" ? [order[0]!] : [order[0]!, order[1]!];
  const ratioLeft = profile === "BANKING_PRELIMS" ? [order[1]!] : [order[0]!, order[1]!];
  const ratioRight = profile === "BANKING_PRELIMS" ? [order[2]!] : [order[2]!, order[3]!];
  const profitIndices = profile === "BANKING_PRELIMS" ? [order[3]!] : [order[1]!, order[4]!];
  const averageIndices = profile === "BANKING_PRELIMS" ? order.slice(0, 3) : order.slice(0, 4);
  const shareIndices = profile === "BANKING_PRELIMS" ? [order[4]!] : [order[2]!, order[4]!];

  const oldUnits = sum(rows, changeIndices, "unitsPrevious");
  const newUnits = sum(rows, changeIndices, "unitsCurrent");
  const unitDiff = newUnits - oldUnits;
  const changeAnswer = formatPercent(unitDiff, oldUnits);

  const leftRevenue = revenueTotal(rows, ratioLeft);
  const rightRevenue = revenueTotal(rows, ratioRight);
  const revenueRatioAnswer = ratioDisplay(leftRevenue, rightRevenue);
  const leftUnits = sum(rows, ratioLeft, "unitsCurrent");
  const rightUnits = sum(rows, ratioRight, "unitsCurrent");
  const leftPreviousUnits = sum(rows, ratioLeft, "unitsPrevious");
  const rightPreviousUnits = sum(rows, ratioRight, "unitsPrevious");
  const leftCost = costTotal(rows, ratioLeft);
  const rightCost = costTotal(rows, ratioRight);
  const leftProfit = leftRevenue - leftCost;
  const rightProfit = rightRevenue - rightCost;

  const aggregateCost = costTotal(rows, profitIndices);
  const aggregateRevenue = revenueTotal(rows, profitIndices);
  const aggregateProfit = aggregateRevenue - aggregateCost;
  const profitAnswer = formatPercent(aggregateProfit, aggregateCost);

  const selectedProfit = profitTotal(rows, averageIndices);
  const averageProfitAnswer = `₹${formatQuotient(selectedProfit, averageIndices.length)}`;

  const selectedRevenue = revenueTotal(rows, shareIndices);
  const allRevenue = revenueTotal(rows, INDEXES);
  const shareAnswer = formatPercent(selectedRevenue, allRevenue);
  const selectedUnits = sum(rows, shareIndices, "unitsCurrent");
  const allUnits = sum(rows, INDEXES, "unitsCurrent");
  const allCost = costTotal(rows, INDEXES);
  const selectedCost = costTotal(rows, shareIndices);

  return [
    {
      kind: "UNITS_PERCENT_CHANGE",
      difficulty: profile === "BANKING_PRELIMS" ? "Medium" : "Hard",
      stem: profile === "BANKING_PRELIMS"
        ? `By what percentage did the units sold of ${names(rows, changeIndices)} increase from the previous period to the current period?`
        : `The combined units sold of ${names(rows, changeIndices)} increased by what percentage from the previous period to the current period?`,
      answer: changeAnswer,
      candidates: [
        { text: `${unitDiff}%`, misconceptionId: "TREAT_ABSOLUTE_CHANGE_AS_PERCENT", derivation: "Uses the numerical increase in units as a percentage without dividing by the previous-period base." },
        { text: formatPercent(unitDiff, newUnits), misconceptionId: "USE_CURRENT_UNITS_AS_BASE", derivation: "Divides the increase by current-period units instead of previous-period units." },
        { text: formatPercent(newUnits, oldUnits), misconceptionId: "REPORT_CURRENT_AS_PERCENT_OF_PREVIOUS", derivation: "Reports current units as a percentage of previous units instead of only the increase." },
        { text: formatPercent(oldUnits, newUnits), misconceptionId: "REVERSE_PERIOD_PERCENT", derivation: "Reverses the comparison and expresses previous units as a percentage of current units." },
        { text: formatPercent(unitDiff, oldUnits + newUnits), misconceptionId: "USE_TWO_PERIOD_TOTAL_AS_BASE", derivation: "Uses the sum of both periods as the percentage base." },
      ],
      explanation: {
        keyIdea: "Percentage increase always compares the increase with the original, previous-period quantity; for a Mains combination, aggregate the selected products first.",
        steps: [`Previous-period units = ${oldUnits}; current-period units = ${newUnits}.`, `Increase = ${newUnits} - ${oldUnits} = ${unitDiff}; percentage increase = ${unitDiff}/${oldUnits} × 100 = ${changeAnswer}.`],
        shortcut: "For combined products, add the old values and new values separately before taking the percentage change; do not average individual growth rates.",
        trap: "Using the current value as denominator gives percentage decrease relative to the new base, not the requested percentage increase.",
      },
      evidence: { primaryIndices: changeIndices },
    },
    {
      kind: "REVENUE_RATIO",
      difficulty: profile === "BANKING_PRELIMS" ? "Medium" : "Hard",
      stem: `What is the ratio of current-period revenue from ${names(rows, ratioLeft)} to current-period revenue from ${names(rows, ratioRight)}?`,
      answer: revenueRatioAnswer,
      candidates: [
        { text: ratioDisplay(rightRevenue, leftRevenue), misconceptionId: "REVERSE_REVENUE_RATIO", derivation: "Reverses the two revenue groups while forming the requested ratio." },
        { text: ratioDisplay(leftUnits, rightUnits), misconceptionId: "USE_UNITS_RATIO", derivation: "Compares current units sold and ignores the selling price per unit needed for revenue." },
        { text: ratioDisplay(leftCost, rightCost), misconceptionId: "USE_COST_OUTLAY_RATIO", derivation: "Uses total current-period cost instead of sales revenue for the two groups." },
        { text: ratioDisplay(leftProfit, rightProfit), misconceptionId: "USE_PROFIT_RATIO", derivation: "Compares total profit from the two groups instead of their current-period sales revenue." },
        { text: ratioDisplay(leftPreviousUnits, rightPreviousUnits), misconceptionId: "USE_PREVIOUS_PERIOD_UNITS_RATIO", derivation: "Compares previous-period units for the two groups instead of their current-period revenue." },
        { text: ratioDisplay(leftRevenue * rightUnits, rightRevenue * leftUnits), misconceptionId: "USE_AVERAGE_SELLING_PRICE_RATIO", derivation: "Compares weighted average selling price per unit rather than total current-period revenue." },
        { text: ratioDisplay(leftRevenue, leftRevenue + rightRevenue), misconceptionId: "LEFT_REVENUE_TO_PAIR_TOTAL", derivation: "Compares the first group with the pair total instead of with the second group." },
        { text: ratioDisplay(rightRevenue, leftRevenue + rightRevenue), misconceptionId: "RIGHT_REVENUE_TO_PAIR_TOTAL", derivation: "Compares the second group with the pair total rather than preserving the requested two-group ratio." },
      ],
      explanation: {
        keyIdea: "Revenue equals current units sold multiplied by selling price per unit; calculate revenue for each requested group before simplifying the ratio.",
        steps: [`Revenue of ${names(rows, ratioLeft)} = ₹${leftRevenue}; revenue of ${names(rows, ratioRight)} = ₹${rightRevenue}.`, `Required ratio = ${leftRevenue}:${rightRevenue} = ${revenueRatioAnswer}.`],
        shortcut: "Do not compute profit or cost for a revenue-ratio question; only current units × selling price matters.",
        trap: "A units-sold, cost or profit ratio is generally not a revenue ratio because both quantity and selling price determine revenue.",
      },
      evidence: { primaryIndices: ratioLeft, secondaryIndices: ratioRight },
    },
    {
      kind: "PROFIT_PERCENT",
      difficulty: profile === "BANKING_PRELIMS" ? "Medium" : "Hard",
      stem: `What is the profit percentage on total cost for ${names(rows, profitIndices)} in the current period?`,
      answer: profitAnswer,
      candidates: [
        { text: formatPercent(aggregateProfit, aggregateRevenue), misconceptionId: "USE_REVENUE_AS_PROFIT_BASE", derivation: "Calculates profit margin on revenue instead of profit percentage on cost." },
        { text: formatPercent(aggregateRevenue, aggregateCost), misconceptionId: "REPORT_REVENUE_AS_PERCENT_OF_COST", derivation: "Includes the original 100% cost and reports revenue as a percentage of cost." },
        { text: formatPercent(aggregateCost, aggregateRevenue), misconceptionId: "REPORT_COST_AS_PERCENT_OF_REVENUE", derivation: "Reverses the cost and revenue comparison." },
        { text: formatPercent(aggregateProfit, aggregateCost + aggregateRevenue), misconceptionId: "USE_COST_PLUS_REVENUE_BASE", derivation: "Uses the combined cost-and-revenue total as an invalid percentage base." },
        { text: formatPercent(aggregateCost, aggregateProfit), misconceptionId: "INVERT_PROFIT_AND_COST", derivation: "Divides cost by profit instead of profit by cost." },
      ],
      explanation: {
        keyIdea: "Profit percentage is profit divided by cost, not profit divided by revenue. For multiple products, combine rupee cost and revenue before computing the rate.",
        steps: [`Total cost = ₹${aggregateCost}; total revenue = ₹${aggregateRevenue}; profit = ₹${aggregateProfit}.`, `Profit percentage = ${aggregateProfit}/${aggregateCost} × 100 = ${profitAnswer}.`],
        shortcut: "For a combined group, sum money values first; a simple average of individual profit rates is wrong unless their cost weights are equal.",
        trap: "Profit ÷ revenue gives margin, which is a different percentage from profit ÷ cost.",
      },
      evidence: { primaryIndices: profitIndices },
    },
    {
      kind: "AVERAGE_PROFIT_PER_PRODUCT",
      difficulty: profile === "BANKING_PRELIMS" ? "Medium" : "Hard",
      stem: `What is the average current-period profit per product for ${names(rows, averageIndices)}?`,
      answer: averageProfitAnswer,
      candidates: [
        { text: `₹${selectedProfit}`, misconceptionId: "USE_TOTAL_PROFIT_WITHOUT_AVERAGING", derivation: "Adds the selected products' profits but forgets to divide by the number of products." },
        { text: `₹${formatQuotient(selectedProfit, Math.max(1, averageIndices.length - 1))}`, misconceptionId: "DIVIDE_BY_ONE_FEWER_PRODUCT", derivation: "Uses one fewer product than the set actually contains when computing the average." },
        { text: `₹${formatQuotient(selectedProfit, averageIndices.length + 1)}`, misconceptionId: "DIVIDE_BY_ONE_EXTRA_PRODUCT", derivation: "Divides by one more product than was included in the profit total." },
        { text: `₹${formatQuotient(revenueTotal(rows, averageIndices), averageIndices.length)}`, misconceptionId: "AVERAGE_REVENUE_INSTEAD_OF_PROFIT", derivation: "Averages sales revenue rather than profit after subtracting cost." },
        { text: `₹${formatQuotient(costTotal(rows, averageIndices), averageIndices.length)}`, misconceptionId: "AVERAGE_COST_INSTEAD_OF_PROFIT", derivation: "Averages total cost rather than profit." },
      ],
      explanation: {
        keyIdea: "Find each selected product's current-period rupee profit through revenue minus cost, combine those profits, then divide by the number of selected products.",
        steps: [`Combined profit for ${averageIndices.length} products = ₹${selectedProfit}.`, `Average profit = ₹${selectedProfit} ÷ ${averageIndices.length} = ${averageProfitAnswer}.`],
        shortcut: "Once each product's total profit is known, average the profit totals directly; do not average unit selling prices or profit percentages.",
        trap: "The question asks for average profit in rupees, not average revenue and not average profit percentage.",
      },
      evidence: { primaryIndices: averageIndices },
    },
    {
      kind: "REVENUE_SHARE_OF_TOTAL",
      difficulty: profile === "BANKING_PRELIMS" ? "Medium" : "Hard",
      stem: `Current-period revenue from ${names(rows, shareIndices)} is what percentage of the total current-period revenue from all five products?`,
      answer: shareAnswer,
      candidates: [
        { text: formatPercent(selectedUnits, allUnits), misconceptionId: "USE_UNIT_SHARE_INSTEAD_OF_REVENUE_SHARE", derivation: "Uses units sold as the share base and ignores different selling prices." },
        { text: formatPercent(selectedCost, allCost), misconceptionId: "USE_COST_SHARE_INSTEAD_OF_REVENUE_SHARE", derivation: "Uses the selected products' share of total cost rather than their share of revenue." },
        { text: formatPercent(allRevenue - selectedRevenue, allRevenue), misconceptionId: "USE_COMPLEMENT_REVENUE_SHARE", derivation: "Reports the revenue share of all other products instead of the named products." },
        { text: formatPercent(selectedRevenue, allRevenue - selectedRevenue), misconceptionId: "USE_UNSELECTED_REVENUE_AS_BASE", derivation: "Compares selected revenue with unselected revenue rather than total revenue." },
        { text: formatPercent(selectedUnits, sum(rows, INDEXES, "unitsPrevious")), misconceptionId: "MIX_CURRENT_SELECTED_WITH_PREVIOUS_TOTAL", derivation: "Mixes current selected units with the previous-period total and does not use revenue at all." },
      ],
      explanation: {
        keyIdea: "A revenue contribution question uses selected current revenue over total current revenue; units and costs are not interchangeable with revenue.",
        steps: [`Selected revenue = ₹${selectedRevenue}; total revenue = ₹${allRevenue}.`, `Revenue share = ${selectedRevenue}/${allRevenue} × 100 = ${shareAnswer}.`],
        shortcut: "Compute only the selected revenue and the all-product revenue totals; there is no need to calculate profit for this task.",
        trap: "A product can have a small unit share but a larger revenue share if its selling price per unit is higher.",
      },
      evidence: { primaryIndices: shareIndices },
    },
  ];
}

function validateSet(set: Omit<Di008QuestionSet, "validation">) {
  const checks: Di008ValidationCheck[] = [];
  const add = (id: string, passed: boolean, message: string) => checks.push({ id, passed, message });
  add("ARITHMETIC_KIND", set.stimulus.kind === "ARITHMETIC_TABLE", "DI-008 must expose mixed arithmetic table semantics.");
  add("FIVE_PRODUCTS", set.stimulus.rows.length === 5, "DI-008 requires exactly five product rows.");
  add("POSITIVE_INTEGRAL_STATE", set.stimulus.rows.every((row) => [row.unitsPrevious, row.unitsCurrent, row.costPerUnit, row.sellingPricePerUnit].every((value) => Number.isSafeInteger(value) && value > 0)), "All DI-008 source values must be positive exact integers.");
  add("CURRENT_ABOVE_PREVIOUS", set.stimulus.rows.every((row) => row.unitsCurrent > row.unitsPrevious), "Every Phase 7 product must have a positive period-on-period increase.");
  add("SELLING_ABOVE_COST", set.stimulus.rows.every((row) => row.sellingPricePerUnit > row.costPerUnit), "Every Phase 7 product must have positive unit profit.");
  add("LINKED_QUESTION_COUNT", set.questions.length === 5, "DI-008 requires five linked child questions.");
  add("DISTINCT_TASK_KINDS", new Set(set.questions.map((question) => question.kind)).size === 5, "Every child must test a distinct arithmetic skill.");
  add("SET_ID_PARITY", set.questions.every((question) => question.setId === set.setId), "All children must retain the shared parent set ID.");
  add("FIVE_OPTIONS", set.questions.every((question) => question.options.length === 5), "Banking Arithmetic DI must always expose five options.");
  add("UNIQUE_OPTIONS", set.questions.every((question) => new Set(question.options).size === 5), "Every child must have five unique displayed options.");
  add("ONE_CORRECT", set.questions.every((question) => question.optionMetadata.filter((option) => option.misconceptionId === "CORRECT").length === 1 && question.options[question.correctIndex] === question.answer), "Every child must bind exactly one correct option.");
  add("EXPLANATION_SPECIFICITY", set.questions.every((question) => question.explanation.steps.length >= 2 && question.explanation.keyIdea.length > 45 && question.explanation.shortcut.length > 35 && question.explanation.trap.length > 30), "Every child requires question-specific working, shortcut and trap guidance.");
  add("LIFECYCLE_LOCK", !set.traceability.questionStudioDiscoverable && set.traceability.questionBankStatus === "NOT_STORED" && set.traceability.testEligibility === "INELIGIBLE" && !set.traceability.publiclyPublishable, "DI-008 Phase 7 must remain review-only.");
  return { valid: checks.every((check) => check.passed), checks };
}

export function generateDi008ArithmeticSet(input: { seed?: string; examProfile?: Di008ExamProfile } = {}): Di008QuestionSet {
  const seed = input.seed ?? "DI-008:ARITHMETIC:P7";
  const examProfile = input.examProfile ?? "BANKING_PRELIMS";
  const stimulus = buildStimulus(seed);
  const drafts = buildDrafts(seed, examProfile, stimulus);
  const setId = `DI-008-SET-${hashSeed(`${seed}:${examProfile}`).toString(36)}`;
  const questions = drafts.map((draft, index): Di008Question => {
    const optionPackage = buildOptions(`${seed}:${examProfile}:${draft.kind}`, draft.answer, draft.candidates);
    return {
      questionId: `${setId}-Q${index + 1}`,
      setId,
      kind: draft.kind,
      difficulty: draft.difficulty,
      stem: draft.stem,
      options: optionPackage.options,
      optionMetadata: optionPackage.optionMetadata,
      correctIndex: optionPackage.correctIndex,
      answer: draft.answer,
      explanation: draft.explanation,
      evidence: draft.evidence,
    };
  });
  const withoutValidation: Omit<Di008QuestionSet, "validation"> = {
    packageId: "DI-008",
    setId,
    seed,
    language: "en",
    examProfile,
    optionCount: 5,
    setDifficulty: "MIXED_ARITHMETIC_DI",
    stimulus,
    questions,
    traceability: {
      packageId: "DI-008",
      representation: "ARITHMETIC_DI",
      parentFoundation: "DI-001",
      missingDiSibling: "DI-007",
      setContractVersion: "DI-008-SET-CONTRACT-V1",
      arithmeticAuthority: "EXACT_INTEGER_RATIONAL",
      reviewStatus: "UNREVIEWED",
      questionStudioDiscoverable: false,
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
    },
  };
  const validation = validateSet(withoutValidation);
  if (!validation.valid) {
    const failed = validation.checks.filter((check) => !check.passed).map((check) => check.id).join(", ");
    throw new Error(`DI-008 set validation failed: ${failed}`);
  }
  return { ...withoutValidation, validation };
}
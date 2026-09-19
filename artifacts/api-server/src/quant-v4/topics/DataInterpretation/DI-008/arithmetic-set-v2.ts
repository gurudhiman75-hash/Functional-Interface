import { hashSeed, pick, ratioDisplay, seededRandom, shuffle } from "../DI-001/exact";
import type {
  Di008V2ContextId,
  Di008V2Difficulty,
  Di008V2ExamProfile,
  Di008V2Explanation,
  Di008V2Option,
  Di008V2Question,
  Di008V2QuestionSet,
  Di008V2Row,
  Di008V2Stimulus,
  Di008V2TaskKind,
  Di008V2ValidationCheck,
} from "./arithmetic-v2-types";

const INDEXES = [0, 1, 2, 3, 4] as const;
const GROWTH_RATES = [10, 20, 25, 40, 50] as const;
const PROFIT_RATES = [10, 20, 25, 40, 50] as const;
const BASE_COSTS = [40, 60, 80, 100, 120] as const;

const PREVIOUS_PATTERNS = [
  [160, 200, 240, 280, 320],
  [180, 220, 260, 300, 340],
  [200, 240, 280, 320, 360],
  [220, 260, 300, 340, 380],
  [240, 280, 320, 360, 400],
  [260, 300, 340, 380, 420],
] as const;

type Context = Readonly<{
  id: Di008V2ContextId;
  title: string;
  rowLabel: string;
  items: readonly string[];
  priceScale: number;
}>;

const CONTEXTS: readonly Context[] = [
  {
    id: "STATIONERY_WHOLESALE",
    title: "Sales and unit economics of five stationery products",
    rowLabel: "Product",
    items: ["Notebooks", "Folders", "Marker sets", "Desk files", "Staplers"],
    priceScale: 1,
  },
  {
    id: "PACKAGED_FOODS",
    title: "Sales and unit economics of five packaged food items",
    rowLabel: "Item",
    items: ["Tea packs", "Coffee jars", "Cereal boxes", "Biscuit packs", "Juice cartons"],
    priceScale: 2,
  },
  {
    id: "SPORTS_GOODS",
    title: "Sales and unit economics of five sports goods",
    rowLabel: "Item",
    items: ["Footballs", "Badminton rackets", "Cricket gloves", "Skipping ropes", "Gym bottles"],
    priceScale: 5,
  },
  {
    id: "ELECTRONIC_ACCESSORIES",
    title: "Sales and unit economics of five electronic accessories",
    rowLabel: "Accessory",
    items: ["USB cables", "Power banks", "Keyboards", "Earphones", "Webcams"],
    priceScale: 10,
  },
  {
    id: "HOUSEHOLD_ITEMS",
    title: "Sales and unit economics of five household items",
    rowLabel: "Item",
    items: ["Table lamps", "Electric kettles", "Steam irons", "Storage boxes", "Mixer jars"],
    priceScale: 5,
  },
  {
    id: "OFFICE_SUPPLIES",
    title: "Sales and unit economics of five office supplies",
    rowLabel: "Item",
    items: ["Paper reams", "Desk organisers", "Ink cartridges", "Label rolls", "Document trays"],
    priceScale: 4,
  },
];

const EASY_TASKS: readonly Di008V2TaskKind[] = ["UNIT_INCREASE", "REVENUE_AMOUNT"];
const MEDIUM_ARITHMETIC_TASKS: readonly Di008V2TaskKind[] = ["PERCENT_CHANGE", "PROFIT_AMOUNT", "PROFIT_PERCENT"];
const MEDIUM_COMPARISON_TASKS: readonly Di008V2TaskKind[] = ["REVENUE_SHARE", "PROFIT_RATIO", "AVERAGE_PROFIT"];
const HARD_AGGREGATE_TASKS: readonly Di008V2TaskKind[] = ["COMBINED_PERCENT_CHANGE", "COMBINED_PROFIT_PERCENT"];
const HARD_WEIGHTED_TASKS: readonly Di008V2TaskKind[] = ["GROUP_REVENUE_RATIO", "WEIGHTED_AVERAGE_SELLING_PRICE"];

const DIFFICULTY_BY_TASK: Readonly<Record<Di008V2TaskKind, Di008V2Difficulty>> = {
  UNIT_INCREASE: "Easy",
  REVENUE_AMOUNT: "Easy",
  PERCENT_CHANGE: "Medium",
  PROFIT_AMOUNT: "Medium",
  PROFIT_PERCENT: "Medium",
  REVENUE_SHARE: "Medium",
  PROFIT_RATIO: "Medium",
  AVERAGE_PROFIT: "Medium",
  COMBINED_PERCENT_CHANGE: "Hard",
  COMBINED_PROFIT_PERCENT: "Hard",
  GROUP_REVENUE_RATIO: "Hard",
  WEIGHTED_AVERAGE_SELLING_PRICE: "Hard",
};

type Candidate = Readonly<{ text: string; misconceptionId: string; derivation: string }>;
type Draft = Readonly<{
  kind: Di008V2TaskKind;
  difficulty: Di008V2Difficulty;
  stemVariant: 0 | 1 | 2;
  stem: string;
  answer: string;
  candidates: readonly Candidate[];
  explanation: Di008V2Explanation;
  evidence: Readonly<{ primaryIndices: readonly number[]; secondaryIndices?: readonly number[] }>;
}>;

function formatQuotient(numerator: number, denominator: number): string {
  if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator) || denominator <= 0) {
    throw new Error("DI-008 V2 received an invalid rational value.");
  }
  const sign = numerator < 0 ? -1n : 1n;
  const n = BigInt(Math.abs(numerator));
  const d = BigInt(denominator);
  const hundredths = (n * 100n + d / 2n) / d;
  const whole = hundredths / 100n;
  const fraction = Number(hundredths % 100n);
  const prefix = sign < 0n ? "-" : "";
  if (fraction === 0) return prefix + String(whole);
  if (fraction % 10 === 0) return prefix + String(whole) + "." + String(fraction / 10);
  return prefix + String(whole) + "." + String(fraction).padStart(2, "0");
}

function formatPercent(numerator: number, denominator: number): string {
  return formatQuotient(numerator * 100, denominator) + "%";
}

function formatMoney(value: number): string {
  return "\u20b9" + formatQuotient(value, 1);
}

function formatMoneyQuotient(numerator: number, denominator: number): string {
  return "\u20b9" + formatQuotient(numerator, denominator);
}

function formatMoneyDecimal(value: number): string {
  return "\u20b9" + formatQuotient(Math.round(value * 100), 100);
}

function rowCost(row: Di008V2Row): number {
  return row.unitsCurrent * row.costPerUnit;
}

function rowRevenue(row: Di008V2Row): number {
  return row.unitsCurrent * row.sellingPricePerUnit;
}

function rowProfit(row: Di008V2Row): number {
  return rowRevenue(row) - rowCost(row);
}

function sumUnits(rows: readonly Di008V2Row[], indices: readonly number[], key: "unitsPrevious" | "unitsCurrent"): number {
  return indices.reduce((sum, index) => sum + rows[index]![key], 0);
}

function costTotal(rows: readonly Di008V2Row[], indices: readonly number[]): number {
  return indices.reduce((sum, index) => sum + rowCost(rows[index]!), 0);
}

function revenueTotal(rows: readonly Di008V2Row[], indices: readonly number[]): number {
  return indices.reduce((sum, index) => sum + rowRevenue(rows[index]!), 0);
}

function profitTotal(rows: readonly Di008V2Row[], indices: readonly number[]): number {
  return indices.reduce((sum, index) => sum + rowProfit(rows[index]!), 0);
}

function names(rows: readonly Di008V2Row[], indices: readonly number[]): string {
  const labels = indices.map((index) => rows[index]!.label);
  if (labels.length <= 1) return labels[0] ?? "";
  if (labels.length === 2) return labels[0] + " and " + labels[1];
  return labels.slice(0, -1).join(", ") + " and " + labels[labels.length - 1];
}

function buildStimulus(seed: string): Di008V2Stimulus {
  const context = pick(seededRandom(seed + ":context"), CONTEXTS);
  const previousPattern = pick(seededRandom(seed + ":previous-pattern"), PREVIOUS_PATTERNS);
  const previousUnits = shuffle(seededRandom(seed + ":previous-order"), previousPattern);
  const growthRates = shuffle(seededRandom(seed + ":growth-order"), GROWTH_RATES);
  const costs = shuffle(seededRandom(seed + ":cost-order"), BASE_COSTS);
  const profitRates = shuffle(seededRandom(seed + ":profit-order"), PROFIT_RATES);
  const labels = shuffle(seededRandom(seed + ":label-order"), context.items);

  const rows: Di008V2Row[] = INDEXES.map((index) => {
    const unitsPrevious = previousUnits[index]!;
    const unitsCurrent = (unitsPrevious * (100 + growthRates[index]!)) / 100;
    const costPerUnit = costs[index]! * context.priceScale;
    const sellingPricePerUnit = (costPerUnit * (100 + profitRates[index]!)) / 100;
    if (![unitsPrevious, unitsCurrent, costPerUnit, sellingPricePerUnit].every(Number.isSafeInteger)) {
      throw new Error("DI-008 V2 state must remain integral by construction.");
    }
    return {
      label: labels[index]!,
      unitsPrevious,
      unitsCurrent,
      costPerUnit,
      sellingPricePerUnit,
    };
  });

  return {
    kind: "ARITHMETIC_TABLE",
    contextId: context.id,
    title: context.title,
    instruction: "Study the table and answer the five questions that follow. Cost price and selling price are given per unit.",
    rowLabel: context.rowLabel,
    rows,
    currency: "INR",
  };
}

function stemVariant(seed: string, kind: Di008V2TaskKind): 0 | 1 | 2 {
  return (hashSeed(seed + ":" + kind + ":stem") % 3) as 0 | 1 | 2;
}

function chooseIndices(seed: string, count: number, salt: string, exclude: readonly number[] = []): number[] {
  const available = INDEXES.filter((index) => !exclude.includes(index));
  if (count > available.length) throw new Error("DI-008 V2 requested too many distinct row indices.");
  return shuffle(seededRandom(seed + ":" + salt), available).slice(0, count);
}

function chooseTasks(seed: string): Di008V2TaskKind[] {
  const tasks: Di008V2TaskKind[] = [
    pick(seededRandom(seed + ":easy-task"), EASY_TASKS),
    pick(seededRandom(seed + ":medium-arithmetic-task"), MEDIUM_ARITHMETIC_TASKS),
    pick(seededRandom(seed + ":medium-comparison-task"), MEDIUM_COMPARISON_TASKS),
    pick(seededRandom(seed + ":hard-aggregate-task"), HARD_AGGREGATE_TASKS),
    pick(seededRandom(seed + ":hard-weighted-task"), HARD_WEIGHTED_TASKS),
  ];
  return shuffle(seededRandom(seed + ":question-order"), tasks);
}

function buildOptions(seed: string, answer: string, candidates: readonly Candidate[]) {
  const retained: Di008V2Option[] = [];
  const seen = new Set<string>();
  const add = (candidate: Candidate) => {
    const key = candidate.text.trim().toLowerCase();
    if (!candidate.text.trim() || seen.has(key)) return;
    seen.add(key);
    retained.push(candidate);
  };

  add({ text: answer, misconceptionId: "CORRECT", derivation: "Exact recomputation from the shared DI-008 V2 dataset." });
  candidates.forEach(add);

  if (retained.length < 5 && /^\u20b9-?\d+(?:\.\d+)?$/.test(answer)) {
    const base = Number(answer.slice(1));
    const step = Math.max(10, Math.round(Math.abs(base) * 0.05 / 10) * 10);
    for (const multiplier of [-2, -1, 1, 2, 3, -3]) {
      const value = base + multiplier * step;
      if (value <= 0) continue;
      add({ text: formatMoneyDecimal(value), misconceptionId: "NEARBY_MONEY_" + String(multiplier), derivation: "A nearby money value caused by a one-step arithmetic slip." });
    }
  }

  if (retained.length < 5 && /^-?\d+(?:\.\d+)?%$/.test(answer)) {
    const base = Number(answer.slice(0, -1));
    for (const delta of [-10, -5, 5, 10, 15, -15]) {
      const value = base + delta;
      if (value <= 0) continue;
      add({ text: formatQuotient(Math.round(value * 100), 100) + "%", misconceptionId: "NEARBY_PERCENT_" + String(delta), derivation: "A nearby percentage caused by using the wrong base or a small arithmetic slip." });
    }
  }

  if (retained.length < 5 && /^\d+:\d+$/.test(answer)) {
    const parts = answer.split(":").map(Number);
    const left = parts[0]!;
    const right = parts[1]!;
    const nearby = [
      [left + 1, right],
      [left, right + 1],
      [left + 2, right],
      [left, right + 2],
      [left + 1, right + 2],
      [left + 2, right + 1],
    ] as const;
    nearby.forEach((pair, index) => add({ text: ratioDisplay(pair[0], pair[1]), misconceptionId: "NEARBY_RATIO_" + String(index), derivation: "A nearby simplified ratio caused by a one-term calculation slip." }));
  }

  if (retained.length < 5 && /^\d+(?:\.\d+)?$/.test(answer)) {
    const base = Number(answer);
    const step = Math.max(1, Math.round(base * 0.05));
    for (const multiplier of [-2, -1, 1, 2, 3, -3]) {
      const value = base + multiplier * step;
      if (value <= 0) continue;
      add({ text: formatQuotient(value, 1), misconceptionId: "NEARBY_NUMBER_" + String(multiplier), derivation: "A nearby numeric value caused by a one-step arithmetic slip." });
    }
  }

  if (retained.length < 5) throw new Error("DI-008 V2 could construct only " + retained.length + " unique options for " + answer + ".");
  const shuffled = shuffle(seededRandom(seed + ":options"), retained.slice(0, 5));
  const correctIndex = shuffled.findIndex((option) => option.misconceptionId === "CORRECT");
  if (correctIndex < 0) throw new Error("DI-008 V2 lost the correct option during deterministic shuffling.");
  return { options: shuffled.map((option) => option.text), optionMetadata: shuffled, correctIndex };
}

function unitIncreaseStem(stimulus: Di008V2Stimulus, index: number, variant: 0 | 1 | 2): string {
  const label = stimulus.rows[index]!.label;
  return [
    "How many more units of " + label + " were sold in the current period than in the previous period?",
    "Find the increase in units sold of " + label + " from the previous period to the current period.",
    "The current-period sales of " + label + " exceed the previous-period sales by how many units?",
  ][variant]!;
}

function revenueAmountStem(stimulus: Di008V2Stimulus, index: number, variant: 0 | 1 | 2): string {
  const label = stimulus.rows[index]!.label;
  return [
    "What is the current-period revenue from " + label + "?",
    "Find the sales revenue earned from " + label + " in the current period.",
    "How much revenue is generated by the current-period sales of " + label + "?",
  ][variant]!;
}

function percentChangeStem(stimulus: Di008V2Stimulus, indices: readonly number[], variant: 0 | 1 | 2): string {
  const label = names(stimulus.rows, indices);
  const prefix = indices.length === 1 ? "units sold of " : "combined units sold of ";
  return [
    "By what percentage did the " + prefix + label + " increase from the previous period to the current period?",
    "Find the percentage increase in the " + prefix + label + " between the two periods.",
    "The " + prefix + label + " rose by what percentage over the previous period?",
  ][variant]!;
}

function profitAmountStem(stimulus: Di008V2Stimulus, indices: readonly number[], variant: 0 | 1 | 2): string {
  const label = names(stimulus.rows, indices);
  return [
    "What is the total current-period profit from " + label + "?",
    "Find the profit earned on the current-period sales of " + label + ".",
    "How much profit is generated in the current period from " + label + "?",
  ][variant]!;
}

function profitPercentStem(stimulus: Di008V2Stimulus, indices: readonly number[], variant: 0 | 1 | 2): string {
  const label = names(stimulus.rows, indices);
  return [
    "What is the profit percentage on total cost for " + label + " in the current period?",
    "For " + label + ", profit is what percentage of the current-period cost?",
    "Find the current-period profit percentage on cost for " + label + ".",
  ][variant]!;
}

function revenueShareStem(stimulus: Di008V2Stimulus, indices: readonly number[], variant: 0 | 1 | 2): string {
  const label = names(stimulus.rows, indices);
  return [
    "Current-period revenue from " + label + " is what percentage of the total revenue from all five items?",
    "What percentage of the total current-period revenue is contributed by " + label + "?",
    "Find the share of " + label + " in the total current-period revenue of all five items.",
  ][variant]!;
}

function profitRatioStem(stimulus: Di008V2Stimulus, left: readonly number[], right: readonly number[], variant: 0 | 1 | 2): string {
  const a = names(stimulus.rows, left);
  const b = names(stimulus.rows, right);
  return [
    "What is the ratio of current-period profit from " + a + " to that from " + b + "?",
    "Compare the current-period profits of " + a + " and " + b + " as a ratio in the same order.",
    "Find the ratio of profit earned from " + a + " to the profit earned from " + b + ".",
  ][variant]!;
}

function averageProfitStem(stimulus: Di008V2Stimulus, indices: readonly number[], variant: 0 | 1 | 2): string {
  const label = names(stimulus.rows, indices);
  return [
    "What is the average current-period profit per item for " + label + "?",
    "Find the average profit earned from " + label + " in the current period.",
    "The current-period profits of " + label + " have what average value?",
  ][variant]!;
}

function combinedPercentStem(stimulus: Di008V2Stimulus, indices: readonly number[], variant: 0 | 1 | 2): string {
  const label = names(stimulus.rows, indices);
  return [
    "The combined units sold of " + label + " increased by what percentage from the previous period to the current period?",
    "After combining the sales of " + label + ", find the percentage increase between the two periods.",
    "What is the percentage rise in total units sold of " + label + " from the previous period to the current period?",
  ][variant]!;
}

function combinedProfitPercentStem(stimulus: Di008V2Stimulus, indices: readonly number[], variant: 0 | 1 | 2): string {
  const label = names(stimulus.rows, indices);
  return [
    "For the combined current-period sales of " + label + ", what is the profit percentage on total cost?",
    "Combine the current-period cost and profit of " + label + ". Profit is what percentage of the combined cost?",
    "Find the overall current-period profit percentage on cost for " + label + " taken together.",
  ][variant]!;
}

function groupRevenueRatioStem(stimulus: Di008V2Stimulus, left: readonly number[], right: readonly number[], variant: 0 | 1 | 2): string {
  const a = names(stimulus.rows, left);
  const b = names(stimulus.rows, right);
  return [
    "What is the ratio of current-period revenue from " + a + " to the revenue from " + b + "?",
    "Find the ratio of the combined current-period revenues of " + a + " and " + b + " in the same order.",
    "Compare the current-period revenue generated by " + a + " with that generated by " + b + " as a ratio.",
  ][variant]!;
}

function weightedAverageStem(stimulus: Di008V2Stimulus, indices: readonly number[], variant: 0 | 1 | 2): string {
  const label = names(stimulus.rows, indices);
  return [
    "What is the weighted average selling price per unit for the current-period sales of " + label + "?",
    "Considering current units sold as weights, find the average selling price per unit for " + label + ".",
    "For " + label + ", total current-period revenue divided by total current units sold gives what average selling price per unit?",
  ][variant]!;
}

function buildDraftForTask(seed: string, profile: Di008V2ExamProfile, stimulus: Di008V2Stimulus, kind: Di008V2TaskKind): Draft {
  const rows = stimulus.rows;
  const variant = stemVariant(seed, kind);
  const single = chooseIndices(seed, 1, kind + ":single");
  const pair = chooseIndices(seed, 2, kind + ":pair");
  const triple = chooseIndices(seed, 3, kind + ":triple");
  const quad = chooseIndices(seed, 4, kind + ":quad");
  const mediumIndices = profile === "BANKING_PRELIMS" ? single : pair;
  const averageIndices = profile === "BANKING_PRELIMS" ? pair : triple;
  const hardIndices = profile === "BANKING_PRELIMS" ? pair : triple;
  const weightedIndices = profile === "BANKING_PRELIMS" ? pair : quad;
  const ratioLeft = profile === "BANKING_PRELIMS" ? chooseIndices(seed, 1, kind + ":ratio-left") : chooseIndices(seed, 2, kind + ":ratio-left");
  const ratioRight = profile === "BANKING_PRELIMS"
    ? chooseIndices(seed, 1, kind + ":ratio-right", ratioLeft)
    : chooseIndices(seed, 2, kind + ":ratio-right", ratioLeft);
  const hardLeft = profile === "BANKING_PRELIMS" ? chooseIndices(seed, 2, kind + ":hard-left") : chooseIndices(seed, 2, kind + ":hard-left");
  const hardRight = profile === "BANKING_PRELIMS"
    ? chooseIndices(seed, 2, kind + ":hard-right", hardLeft)
    : chooseIndices(seed, 3, kind + ":hard-right", hardLeft);

  switch (kind) {
    case "UNIT_INCREASE": {
      const row = rows[single[0]!]!;
      const increase = row.unitsCurrent - row.unitsPrevious;
      return {
        kind,
        difficulty: "Easy",
        stemVariant: variant,
        stem: unitIncreaseStem(stimulus, single[0]!, variant),
        answer: String(increase),
        candidates: [
          { text: String(row.unitsCurrent), misconceptionId: "USE_CURRENT_UNITS", derivation: "Reports the current-period units instead of the increase." },
          { text: String(row.unitsPrevious), misconceptionId: "USE_PREVIOUS_UNITS", derivation: "Reports the previous-period units instead of the increase." },
          { text: String(row.unitsCurrent + row.unitsPrevious), misconceptionId: "ADD_PERIODS", derivation: "Adds both periods rather than subtracting them." },
          { text: formatQuotient(increase * 100, row.unitsPrevious), misconceptionId: "RETURN_PERCENT_WITHOUT_SYMBOL", derivation: "Calculates a percentage-like value although the question asks for units." },
        ],
        explanation: {
          keyIdea: "The question asks for the increase in units, so subtract previous-period sales from current-period sales.",
          steps: [
            row.label + ": previous-period units = " + row.unitsPrevious + ", current-period units = " + row.unitsCurrent + ".",
            "Increase = " + row.unitsCurrent + " - " + row.unitsPrevious + " = " + increase + " units.",
          ],
        },
        evidence: { primaryIndices: single },
      };
    }

    case "REVENUE_AMOUNT": {
      const row = rows[single[0]!]!;
      const revenue = rowRevenue(row);
      return {
        kind,
        difficulty: "Easy",
        stemVariant: variant,
        stem: revenueAmountStem(stimulus, single[0]!, variant),
        answer: formatMoney(revenue),
        candidates: [
          { text: formatMoney(rowCost(row)), misconceptionId: "USE_COST", derivation: "Uses current-period cost instead of revenue." },
          { text: formatMoney(rowProfit(row)), misconceptionId: "USE_PROFIT", derivation: "Uses profit instead of sales revenue." },
          { text: formatMoney(row.unitsPrevious * row.sellingPricePerUnit), misconceptionId: "USE_PREVIOUS_UNITS", derivation: "Uses previous-period units with the current selling price." },
          { text: formatMoney(row.unitsCurrent * row.costPerUnit), misconceptionId: "USE_COST_PRICE", derivation: "Multiplies current units by cost price instead of selling price." },
        ],
        explanation: {
          keyIdea: "Revenue is current units sold multiplied by selling price per unit.",
          steps: [
            row.label + ": current units sold = " + row.unitsCurrent + "; selling price per unit = \u20b9" + row.sellingPricePerUnit + ".",
            "Revenue = " + row.unitsCurrent + " \u00d7 \u20b9" + row.sellingPricePerUnit + " = " + formatMoney(revenue) + ".",
          ],
        },
        evidence: { primaryIndices: single },
      };
    }

    case "PERCENT_CHANGE": {
      const indices = mediumIndices;
      const previous = sumUnits(rows, indices, "unitsPrevious");
      const current = sumUnits(rows, indices, "unitsCurrent");
      const increase = current - previous;
      const answer = formatPercent(increase, previous);
      return {
        kind,
        difficulty: "Medium",
        stemVariant: variant,
        stem: percentChangeStem(stimulus, indices, variant),
        answer,
        candidates: [
          { text: formatPercent(increase, current), misconceptionId: "USE_CURRENT_AS_BASE", derivation: "Uses current-period units as the percentage base." },
          { text: formatPercent(current, previous), misconceptionId: "REPORT_CURRENT_AS_PERCENT", derivation: "Reports current units as a percentage of previous units instead of only the increase." },
          { text: formatPercent(previous, current), misconceptionId: "REVERSE_PERIODS", derivation: "Reverses the old and new values." },
          { text: formatPercent(increase, previous + current), misconceptionId: "USE_TWO_PERIOD_TOTAL", derivation: "Uses the sum of both periods as the percentage base." },
        ],
        explanation: {
          keyIdea: "Percentage increase uses the increase over the previous-period base. Combine the selected rows first when more than one item is named.",
          steps: [
            "Previous-period total = " + previous + " units; current-period total = " + current + " units.",
            "Increase = " + current + " - " + previous + " = " + increase + " units.",
            "Percentage increase = " + increase + "/" + previous + " \u00d7 100 = " + answer + ".",
          ],
        },
        evidence: { primaryIndices: indices },
      };
    }

    case "PROFIT_AMOUNT": {
      const indices = mediumIndices;
      const cost = costTotal(rows, indices);
      const revenue = revenueTotal(rows, indices);
      const profit = revenue - cost;
      return {
        kind,
        difficulty: "Medium",
        stemVariant: variant,
        stem: profitAmountStem(stimulus, indices, variant),
        answer: formatMoney(profit),
        candidates: [
          { text: formatMoney(revenue), misconceptionId: "USE_REVENUE", derivation: "Reports revenue instead of profit." },
          { text: formatMoney(cost), misconceptionId: "USE_COST", derivation: "Reports total cost instead of profit." },
          { text: formatMoney(revenue + cost), misconceptionId: "ADD_COST_AND_REVENUE", derivation: "Adds cost and revenue instead of subtracting cost from revenue." },
          { text: formatMoney(Math.abs(cost - profit)), misconceptionId: "SUBTRACT_PROFIT_FROM_COST", derivation: "Uses cost and profit in a second subtraction." },
        ],
        explanation: {
          keyIdea: "Profit equals revenue minus cost. For more than one item, add the rupee cost and revenue first.",
          steps: [
            "Total current-period cost for " + names(rows, indices) + " = " + formatMoney(cost) + ".",
            "Total current-period revenue = " + formatMoney(revenue) + ".",
            "Profit = " + formatMoney(revenue) + " - " + formatMoney(cost) + " = " + formatMoney(profit) + ".",
          ],
        },
        evidence: { primaryIndices: indices },
      };
    }

    case "PROFIT_PERCENT": {
      const indices = mediumIndices;
      const cost = costTotal(rows, indices);
      const revenue = revenueTotal(rows, indices);
      const profit = revenue - cost;
      const answer = formatPercent(profit, cost);
      return {
        kind,
        difficulty: "Medium",
        stemVariant: variant,
        stem: profitPercentStem(stimulus, indices, variant),
        answer,
        candidates: [
          { text: formatPercent(profit, revenue), misconceptionId: "USE_REVENUE_BASE", derivation: "Uses revenue as the base and calculates profit margin instead." },
          { text: formatPercent(revenue, cost), misconceptionId: "REPORT_REVENUE_ON_COST", derivation: "Reports revenue as a percentage of cost, including the original 100% cost." },
          { text: formatPercent(cost, revenue), misconceptionId: "REVERSE_COST_REVENUE", derivation: "Reverses cost and revenue." },
          { text: formatPercent(profit, cost + revenue), misconceptionId: "USE_COST_PLUS_REVENUE", derivation: "Uses an invalid combined cost-and-revenue base." },
        ],
        explanation: {
          keyIdea: "Profit percentage on cost is profit divided by cost. When several items are involved, use their combined rupee totals.",
          steps: [
            "Combined cost = " + formatMoney(cost) + "; combined revenue = " + formatMoney(revenue) + ".",
            "Profit = " + formatMoney(revenue) + " - " + formatMoney(cost) + " = " + formatMoney(profit) + ".",
            "Profit percentage = " + formatMoney(profit) + "/" + formatMoney(cost) + " \u00d7 100 = " + answer + ".",
          ],
        },
        evidence: { primaryIndices: indices },
      };
    }

    case "REVENUE_SHARE": {
      const indices = profile === "BANKING_PRELIMS" ? single : pair;
      const selectedRevenue = revenueTotal(rows, indices);
      const totalRevenue = revenueTotal(rows, INDEXES);
      const selectedUnits = sumUnits(rows, indices, "unitsCurrent");
      const totalUnits = sumUnits(rows, INDEXES, "unitsCurrent");
      const selectedCost = costTotal(rows, indices);
      const totalCost = costTotal(rows, INDEXES);
      const answer = formatPercent(selectedRevenue, totalRevenue);
      return {
        kind,
        difficulty: "Medium",
        stemVariant: variant,
        stem: revenueShareStem(stimulus, indices, variant),
        answer,
        candidates: [
          { text: formatPercent(selectedUnits, totalUnits), misconceptionId: "USE_UNIT_SHARE", derivation: "Uses share of units sold instead of share of revenue." },
          { text: formatPercent(selectedCost, totalCost), misconceptionId: "USE_COST_SHARE", derivation: "Uses share of total cost instead of share of revenue." },
          { text: formatPercent(totalRevenue - selectedRevenue, totalRevenue), misconceptionId: "USE_COMPLEMENT", derivation: "Reports the revenue share of all other items." },
          { text: formatPercent(selectedRevenue, totalRevenue - selectedRevenue), misconceptionId: "USE_REST_AS_BASE", derivation: "Uses revenue of the remaining items as the base instead of total revenue." },
        ],
        explanation: {
          keyIdea: "Revenue contribution is selected current-period revenue divided by total current-period revenue of all five items.",
          steps: [
            "Revenue from " + names(rows, indices) + " = " + formatMoney(selectedRevenue) + ".",
            "Total revenue from all five items = " + formatMoney(totalRevenue) + ".",
            "Revenue share = " + formatMoney(selectedRevenue) + "/" + formatMoney(totalRevenue) + " \u00d7 100 = " + answer + ".",
          ],
        },
        evidence: { primaryIndices: indices },
      };
    }

    case "PROFIT_RATIO": {
      const left = ratioLeft;
      const right = ratioRight;
      const leftProfit = profitTotal(rows, left);
      const rightProfit = profitTotal(rows, right);
      const leftRevenue = revenueTotal(rows, left);
      const rightRevenue = revenueTotal(rows, right);
      const leftCost = costTotal(rows, left);
      const rightCost = costTotal(rows, right);
      const answer = ratioDisplay(leftProfit, rightProfit);
      return {
        kind,
        difficulty: "Medium",
        stemVariant: variant,
        stem: profitRatioStem(stimulus, left, right, variant),
        answer,
        candidates: [
          { text: ratioDisplay(rightProfit, leftProfit), misconceptionId: "REVERSE_RATIO", derivation: "Reverses the requested profit ratio." },
          { text: ratioDisplay(leftRevenue, rightRevenue), misconceptionId: "USE_REVENUE_RATIO", derivation: "Compares revenues instead of profits." },
          { text: ratioDisplay(leftCost, rightCost), misconceptionId: "USE_COST_RATIO", derivation: "Compares costs instead of profits." },
          { text: ratioDisplay(sumUnits(rows, left, "unitsCurrent"), sumUnits(rows, right, "unitsCurrent")), misconceptionId: "USE_UNIT_RATIO", derivation: "Compares units sold rather than rupee profit." },
        ],
        explanation: {
          keyIdea: "Find profit for each side separately, then simplify the ratio in the order asked.",
          steps: [
            "Profit from " + names(rows, left) + " = " + formatMoney(leftProfit) + ".",
            "Profit from " + names(rows, right) + " = " + formatMoney(rightProfit) + ".",
            "Required ratio = " + leftProfit + ":" + rightProfit + " = " + answer + ".",
          ],
        },
        evidence: { primaryIndices: left, secondaryIndices: right },
      };
    }

    case "AVERAGE_PROFIT": {
      const indices = averageIndices;
      const profit = profitTotal(rows, indices);
      const answer = formatMoneyQuotient(profit, indices.length);
      return {
        kind,
        difficulty: "Medium",
        stemVariant: variant,
        stem: averageProfitStem(stimulus, indices, variant),
        answer,
        candidates: [
          { text: formatMoney(profit), misconceptionId: "USE_TOTAL_PROFIT", derivation: "Uses combined profit without dividing by the number of items." },
          { text: formatMoneyQuotient(revenueTotal(rows, indices), indices.length), misconceptionId: "AVERAGE_REVENUE", derivation: "Averages revenue instead of profit." },
          { text: formatMoneyQuotient(costTotal(rows, indices), indices.length), misconceptionId: "AVERAGE_COST", derivation: "Averages cost instead of profit." },
          { text: formatMoneyQuotient(profit, indices.length + 1), misconceptionId: "DIVIDE_BY_EXTRA_ITEM", derivation: "Divides by one more item than the set contains." },
        ],
        explanation: {
          keyIdea: "Add the current-period profits of the named items and divide by the number of items.",
          steps: [
            "Combined profit from " + names(rows, indices) + " = " + formatMoney(profit) + ".",
            "Number of items = " + indices.length + ".",
            "Average profit = " + formatMoney(profit) + " \u00f7 " + indices.length + " = " + answer + ".",
          ],
        },
        evidence: { primaryIndices: indices },
      };
    }

    case "COMBINED_PERCENT_CHANGE": {
      const indices = hardIndices;
      const previous = sumUnits(rows, indices, "unitsPrevious");
      const current = sumUnits(rows, indices, "unitsCurrent");
      const increase = current - previous;
      const answer = formatPercent(increase, previous);
      const simpleAverageGrowth = indices.reduce((sum, index) => sum + ((rows[index]!.unitsCurrent - rows[index]!.unitsPrevious) * 100) / rows[index]!.unitsPrevious, 0) / indices.length;
      return {
        kind,
        difficulty: "Hard",
        stemVariant: variant,
        stem: combinedPercentStem(stimulus, indices, variant),
        answer,
        candidates: [
          { text: formatPercent(increase, current), misconceptionId: "USE_CURRENT_AS_BASE", derivation: "Uses the current combined total as the percentage base." },
          { text: formatQuotient(Math.round(simpleAverageGrowth * 100), 100) + "%", misconceptionId: "AVERAGE_INDIVIDUAL_GROWTH", derivation: "Takes a simple average of item growth rates instead of using combined old and new totals." },
          { text: formatPercent(current, previous), misconceptionId: "REPORT_CURRENT_AS_PERCENT", derivation: "Reports the new total as a percentage of the old total." },
          { text: formatPercent(increase, previous + current), misconceptionId: "USE_TWO_PERIOD_TOTAL", derivation: "Uses both-period total as the base." },
        ],
        explanation: {
          keyIdea: "For a combined percentage change, add the selected previous-period values and current-period values separately. Do not average the individual growth rates.",
          steps: [
            "Previous-period combined units for " + names(rows, indices) + " = " + previous + ".",
            "Current-period combined units = " + current + ".",
            "Combined increase = " + current + " - " + previous + " = " + increase + " units.",
            "Percentage increase = " + increase + "/" + previous + " \u00d7 100 = " + answer + ".",
          ],
        },
        evidence: { primaryIndices: indices },
      };
    }

    case "COMBINED_PROFIT_PERCENT": {
      const indices = hardIndices;
      const cost = costTotal(rows, indices);
      const revenue = revenueTotal(rows, indices);
      const profit = revenue - cost;
      const answer = formatPercent(profit, cost);
      const simpleAverageRate = indices.reduce((sum, index) => sum + (rowProfit(rows[index]!) * 100) / rowCost(rows[index]!), 0) / indices.length;
      return {
        kind,
        difficulty: "Hard",
        stemVariant: variant,
        stem: combinedProfitPercentStem(stimulus, indices, variant),
        answer,
        candidates: [
          { text: formatPercent(profit, revenue), misconceptionId: "USE_REVENUE_BASE", derivation: "Uses total revenue as the base and calculates margin." },
          { text: formatQuotient(Math.round(simpleAverageRate * 100), 100) + "%", misconceptionId: "AVERAGE_ITEM_RATES", derivation: "Averages item profit rates without weighting them by cost." },
          { text: formatPercent(revenue, cost), misconceptionId: "REPORT_REVENUE_ON_COST", derivation: "Reports revenue as a percentage of cost rather than profit percentage." },
          { text: formatPercent(profit, cost + revenue), misconceptionId: "USE_COST_PLUS_REVENUE", derivation: "Uses an invalid combined base." },
        ],
        explanation: {
          keyIdea: "Combine rupee cost and rupee profit before calculating the overall profit percentage. A simple average of item profit rates is not generally valid.",
          steps: [
            "Combined current-period cost of " + names(rows, indices) + " = " + formatMoney(cost) + ".",
            "Combined current-period revenue = " + formatMoney(revenue) + ".",
            "Combined profit = " + formatMoney(revenue) + " - " + formatMoney(cost) + " = " + formatMoney(profit) + ".",
            "Overall profit percentage = " + formatMoney(profit) + "/" + formatMoney(cost) + " \u00d7 100 = " + answer + ".",
          ],
        },
        evidence: { primaryIndices: indices },
      };
    }

    case "GROUP_REVENUE_RATIO": {
      const left = hardLeft;
      const right = hardRight;
      const leftRevenue = revenueTotal(rows, left);
      const rightRevenue = revenueTotal(rows, right);
      const answer = ratioDisplay(leftRevenue, rightRevenue);
      return {
        kind,
        difficulty: "Hard",
        stemVariant: variant,
        stem: groupRevenueRatioStem(stimulus, left, right, variant),
        answer,
        candidates: [
          { text: ratioDisplay(rightRevenue, leftRevenue), misconceptionId: "REVERSE_RATIO", derivation: "Reverses the two revenue groups." },
          { text: ratioDisplay(sumUnits(rows, left, "unitsCurrent"), sumUnits(rows, right, "unitsCurrent")), misconceptionId: "USE_UNIT_RATIO", derivation: "Uses units sold instead of revenue." },
          { text: ratioDisplay(costTotal(rows, left), costTotal(rows, right)), misconceptionId: "USE_COST_RATIO", derivation: "Uses total cost instead of revenue." },
          { text: ratioDisplay(profitTotal(rows, left), profitTotal(rows, right)), misconceptionId: "USE_PROFIT_RATIO", derivation: "Uses profit instead of revenue." },
          { text: ratioDisplay(leftRevenue * sumUnits(rows, right, "unitsCurrent"), rightRevenue * sumUnits(rows, left, "unitsCurrent")), misconceptionId: "USE_AVERAGE_SP_RATIO", derivation: "Compares weighted average selling prices rather than total revenue." },
        ],
        explanation: {
          keyIdea: "Revenue for each group is the sum of current units \u00d7 selling price for its items. Form the ratio only after both group revenues are complete.",
          steps: [
            "Revenue from " + names(rows, left) + " = " + formatMoney(leftRevenue) + ".",
            "Revenue from " + names(rows, right) + " = " + formatMoney(rightRevenue) + ".",
            "Required ratio = " + leftRevenue + ":" + rightRevenue + ".",
            "After simplification, the ratio is " + answer + ".",
          ],
        },
        evidence: { primaryIndices: left, secondaryIndices: right },
      };
    }

    case "WEIGHTED_AVERAGE_SELLING_PRICE": {
      const indices = weightedIndices;
      const revenue = revenueTotal(rows, indices);
      const units = sumUnits(rows, indices, "unitsCurrent");
      const answer = "\u20b9" + formatQuotient(revenue, units);
      const simpleAverage = indices.reduce((sum, index) => sum + rows[index]!.sellingPricePerUnit, 0) / indices.length;
      const costAverage = costTotal(rows, indices) / units;
      return {
        kind,
        difficulty: "Hard",
        stemVariant: variant,
        stem: weightedAverageStem(stimulus, indices, variant),
        answer,
        candidates: [
          { text: "\u20b9" + formatQuotient(Math.round(simpleAverage * 100), 100), misconceptionId: "SIMPLE_AVERAGE_SP", derivation: "Takes the simple average of listed selling prices and ignores different units sold." },
          { text: "\u20b9" + formatQuotient(Math.round(costAverage * 100), 100), misconceptionId: "WEIGHTED_AVERAGE_COST", derivation: "Calculates weighted average cost price instead of selling price." },
          { text: "\u20b9" + formatQuotient(revenue, indices.length), misconceptionId: "DIVIDE_REVENUE_BY_ITEM_COUNT", derivation: "Divides revenue by number of items instead of total units sold." },
          { text: "\u20b9" + formatQuotient(profitTotal(rows, indices), units), misconceptionId: "AVERAGE_PROFIT_PER_UNIT", derivation: "Calculates average profit per unit rather than average selling price." },
        ],
        explanation: {
          keyIdea: "Selling prices must be weighted by the number of units sold. Total revenue divided by total current units gives the required weighted average.",
          steps: [
            "Total current-period revenue from " + names(rows, indices) + " = " + formatMoney(revenue) + ".",
            "Total current units sold for these items = " + units + ".",
            "Weighted average selling price = total revenue \u00f7 total units.",
            "Weighted average = " + formatMoney(revenue) + " \u00f7 " + units + " = " + answer + " per unit.",
          ],
        },
        evidence: { primaryIndices: indices },
      };
    }
  }
}

function validateSet(set: Omit<Di008V2QuestionSet, "validation">) {
  const checks: Di008V2ValidationCheck[] = [];
  const add = (id: string, passed: boolean, message: string) => checks.push({ id, passed, message });
  const difficultyCounts = set.questions.reduce<Record<string, number>>((acc, question) => {
    acc[question.difficulty] = (acc[question.difficulty] ?? 0) + 1;
    return acc;
  }, {});

  add("ARITHMETIC_KIND", set.stimulus.kind === "ARITHMETIC_TABLE", "DI-008 V2 must remain a shared arithmetic table.");
  add("FIVE_ROWS", set.stimulus.rows.length === 5, "DI-008 V2 requires exactly five business rows.");
  add("CONTEXTUAL_LABELS", set.stimulus.rows.every((row) => !/^Product [A-E]$/u.test(row.label)), "Generic Product A-E labels must not leak to the V2 learner surface.");
  add("POSITIVE_INTEGRAL_STATE", set.stimulus.rows.every((row) => [row.unitsPrevious, row.unitsCurrent, row.costPerUnit, row.sellingPricePerUnit].every((value) => Number.isSafeInteger(value) && value > 0)), "All source values must be positive exact integers.");
  add("FIVE_LINKED_QUESTIONS", set.questions.length === 5, "Each V2 set must contain five linked questions.");
  add("DISTINCT_TASKS", new Set(set.questions.map((question) => question.kind)).size === 5, "A V2 set must not repeat a task family.");
  add("DIFFICULTY_MIX", difficultyCounts.Easy === 1 && difficultyCounts.Medium === 2 && difficultyCounts.Hard === 2, "Each V2 set must contain exactly 1 Easy, 2 Medium and 2 Hard questions.");
  add("FIVE_OPTIONS", set.questions.every((question) => question.options.length === 5), "Banking DI must keep five options per question.");
  add("UNIQUE_OPTIONS", set.questions.every((question) => new Set(question.options).size === 5), "Every question must have five unique displayed options.");
  add("ONE_CORRECT", set.questions.every((question) => question.optionMetadata.filter((option) => option.misconceptionId === "CORRECT").length === 1 && question.options[question.correctIndex] === question.answer), "Every question must bind exactly one correct option.");
  add("EXPLANATION_QUALITY", set.questions.every((question) => question.explanation.keyIdea.length >= 35 && question.explanation.steps.length >= 2), "Every question needs a simple worked explanation.");
  add("NO_FORCED_EDITORIAL_SECTIONS", set.questions.every((question) => !/shortcut|trap|template|generator/iu.test(question.explanation.keyIdea + " " + question.explanation.steps.join(" "))), "Learner explanations must not expose shortcut/trap/template boilerplate.");
  add("LIFECYCLE_LOCK", !set.traceability.questionStudioDiscoverable && !set.traceability.questionBankWritable && !set.traceability.testEligible && !set.traceability.mockTestEligible && !set.traceability.publiclyPublishable && !set.traceability.automaticStudentPublication && !set.traceability.productionReleaseAuthorized, "V2 remains human-review-only.");
  return { valid: checks.every((check) => check.passed), checks };
}

export function generateDi008V2ReviewSet(input: { seed?: string; examProfile?: Di008V2ExamProfile } = {}): Di008V2QuestionSet {
  const seed = input.seed ?? "DI-008:ARITHMETIC:V2";
  const examProfile = input.examProfile ?? "BANKING_PRELIMS";
  const stimulus = buildStimulus(seed);
  const tasks = chooseTasks(seed + ":" + examProfile);
  const setId = "DI-008-V2-SET-" + hashSeed(seed + ":" + examProfile).toString(36);

  const questions = tasks.map((kind, index): Di008V2Question => {
    const draft = buildDraftForTask(seed + ":" + examProfile + ":" + kind, examProfile, stimulus, kind);
    if (draft.difficulty !== DIFFICULTY_BY_TASK[kind]) throw new Error("DI-008 V2 difficulty ownership drifted for " + kind + ".");
    const optionPackage = buildOptions(seed + ":" + examProfile + ":" + kind, draft.answer, draft.candidates);
    return {
      questionId: setId + "-Q" + String(index + 1),
      setId,
      kind,
      difficulty: draft.difficulty,
      stemVariant: draft.stemVariant,
      stem: draft.stem,
      options: optionPackage.options,
      optionMetadata: optionPackage.optionMetadata,
      correctIndex: optionPackage.correctIndex,
      answer: draft.answer,
      explanation: draft.explanation,
      evidence: draft.evidence,
    };
  });

  const withoutValidation: Omit<Di008V2QuestionSet, "validation"> = {
    packageId: "DI-008",
    setId,
    seed,
    language: "en",
    examProfile,
    optionCount: 5,
    setDifficulty: "MIXED_ARITHMETIC_DI_V2",
    stimulus,
    questions,
    traceability: {
      packageId: "DI-008",
      representation: "ARITHMETIC_DI",
      sourceFoundation: "DI-008-PHASE7",
      setContractVersion: "DI-008-SET-CONTRACT-V2",
      arithmeticAuthority: "EXACT_INTEGER_RATIONAL",
      reviewStatus: "HUMAN_REVIEW_PENDING",
      questionStudioDiscoverable: false,
      questionBankStatus: "NOT_STORED",
      questionBankWritable: false,
      testEligibility: "INELIGIBLE",
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
      productionReleaseAuthorized: false,
    },
  };

  const validation = validateSet(withoutValidation);
  if (!validation.valid) {
    const failed = validation.checks.filter((check) => !check.passed).map((check) => check.id).join(", ");
    throw new Error("DI-008 V2 set validation failed: " + failed);
  }
  return { ...withoutValidation, validation };
}

import { hashSeed, pick, ratioDisplay, seededRandom, shuffle } from "../DI-001/exact";
import type {
  Di007V2AggregateCondition,
  Di007V2ContextId,
  Di007V2Difficulty,
  Di007V2ExamProfile,
  Di007V2Explanation,
  Di007V2Option,
  Di007V2Question,
  Di007V2QuestionSet,
  Di007V2RecoveryMode,
  Di007V2Stimulus,
  Di007V2TaskKind,
  Di007V2ValidationCheck,
} from "./missing-v2-types";

const INDEXES = [0, 1, 2, 3, 4] as const;
const SCALES = [10, 20, 25, 40] as const;

const A_PATTERNS = [
  [15, 19, 23, 27, 31],
  [16, 20, 24, 28, 32],
  [18, 21, 25, 29, 33],
  [14, 18, 22, 26, 30],
  [17, 22, 24, 28, 34],
  [19, 23, 26, 30, 35],
] as const;

const B_PATTERNS = [
  [20, 24, 28, 32, 36],
  [18, 22, 26, 30, 34],
  [21, 25, 29, 33, 37],
  [16, 20, 28, 32, 40],
  [19, 24, 27, 35, 39],
  [22, 26, 30, 34, 38],
] as const;

const PRELIMS_MODES: readonly Di007V2RecoveryMode[] = ["COLUMN_TOTAL", "COLUMN_AVERAGE", "COMBINED_TOTAL"];
const MAINS_MODES: readonly Di007V2RecoveryMode[] = [
  "COLUMN_TOTAL",
  "COLUMN_AVERAGE",
  "COMBINED_TOTAL",
  "TOTAL_RATIO_TO_A",
  "DIFFERENCE_FROM_A_TOTAL",
];

type Context = Readonly<{
  id: Di007V2ContextId;
  title: string;
  rowLabel: string;
  rowLabels: readonly string[];
  seriesALabel: string;
  seriesBLabel: string;
  seriesAMeasure: string;
  seriesBMeasure: string;
  unit: string;
}>;

const CONTEXTS: readonly Context[] = [
  {
    id: "BANK_BRANCH_APPLICATIONS",
    title: "Loan applications received and approved by five branches",
    rowLabel: "Branch",
    rowLabels: ["Branch A", "Branch B", "Branch C", "Branch D", "Branch E"],
    seriesALabel: "Applications received",
    seriesBLabel: "Applications approved",
    seriesAMeasure: "number of applications received",
    seriesBMeasure: "number of applications approved",
    unit: "applications",
  },
  {
    id: "INSURANCE_POLICIES",
    title: "New and renewed insurance policies over five quarters",
    rowLabel: "Quarter",
    rowLabels: ["Q1", "Q2", "Q3", "Q4", "Q5"],
    seriesALabel: "New policies",
    seriesBLabel: "Renewed policies",
    seriesAMeasure: "number of new policies",
    seriesBMeasure: "number of renewed policies",
    unit: "policies",
  },
  {
    id: "FACTORY_OUTPUT",
    title: "Output of two production lines over five months",
    rowLabel: "Month",
    rowLabels: ["January", "February", "March", "April", "May"],
    seriesALabel: "Line A output",
    seriesBLabel: "Line B output",
    seriesAMeasure: "Line A output",
    seriesBMeasure: "Line B output",
    unit: "units",
  },
  {
    id: "COURSE_ENROLMENT",
    title: "Enrolment in two course groups across five centres",
    rowLabel: "Centre",
    rowLabels: ["Centre A", "Centre B", "Centre C", "Centre D", "Centre E"],
    seriesALabel: "Group A enrolment",
    seriesBLabel: "Group B enrolment",
    seriesAMeasure: "Group A enrolment",
    seriesBMeasure: "Group B enrolment",
    unit: "students",
  },
  {
    id: "ONLINE_ORDERS",
    title: "Orders handled by two channels over five days",
    rowLabel: "Day",
    rowLabels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    seriesALabel: "Channel A orders",
    seriesBLabel: "Channel B orders",
    seriesAMeasure: "number of Channel A orders",
    seriesBMeasure: "number of Channel B orders",
    unit: "orders",
  },
  {
    id: "BOOK_ISSUES",
    title: "Books issued from two sections over five weeks",
    rowLabel: "Week",
    rowLabels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
    seriesALabel: "Section A books issued",
    seriesBLabel: "Section B books issued",
    seriesAMeasure: "number of books issued from Section A",
    seriesBMeasure: "number of books issued from Section B",
    unit: "books",
  },
];

const EASY_TASKS: readonly Di007V2TaskKind[] = ["DIRECT_VISIBLE_VALUE", "VISIBLE_ROW_DIFFERENCE"];
const MEDIUM_TASKS: readonly Di007V2TaskKind[] = [
  "RECOVER_MISSING_VALUE",
  "HIDDEN_ROW_COMBINED_TOTAL",
  "MISSING_TO_PAIRED_RATIO",
  "B_TOTAL_AS_PERCENT_OF_A_TOTAL",
  "MISSING_SHARE_OF_B_TOTAL",
  "VISIBLE_TWO_ROW_B_TOTAL",
];
const HARD_TASKS: readonly Di007V2TaskKind[] = [
  "MISSING_AS_PERCENT_OF_PAIRED_A",
  "COMBINED_HIDDEN_VISIBLE_SHARE_OF_B_TOTAL",
  "HIDDEN_VS_VISIBLE_B_PERCENT_EXCESS",
  "HIDDEN_ROW_TO_VISIBLE_ROW_TOTAL_RATIO",
];

type Candidate = Readonly<{ text: string; misconceptionId: string; derivation: string }>;
type Draft = Readonly<{
  kind: Di007V2TaskKind;
  difficulty: Di007V2Difficulty;
  stemVariant: 0 | 1 | 2;
  stem: string;
  answer: string;
  candidates: readonly Candidate[];
  explanation: Di007V2Explanation;
  evidence: Readonly<Record<string, number>>;
}>;

function gcd(a: number, b: number): number {
  let left = Math.abs(a);
  let right = Math.abs(b);
  while (right !== 0) {
    const next = left % right;
    left = right;
    right = next;
  }
  return left || 1;
}

function gcdMany(values: readonly number[]): number {
  return values.reduce((acc, value) => gcd(acc, value), 0) || 1;
}

function formatQuotient(numerator: number, denominator: number): string {
  if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator) || denominator <= 0) {
    throw new Error("DI-007 V2 received an invalid rational value.");
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

function aggregateConditionText(
  context: Context,
  mode: Di007V2RecoveryMode,
  totalA: number,
  totalB: number,
): Di007V2AggregateCondition {
  switch (mode) {
    case "COLUMN_TOTAL":
      return {
        mode,
        value: totalB,
        learnerText: `The total for ${context.seriesBMeasure} across all five ${context.rowLabel.toLowerCase()} entries is ${totalB} ${context.unit}.`,
      };
    case "COLUMN_AVERAGE": {
      const average = totalB / 5;
      if (!Number.isSafeInteger(average)) throw new Error("DI-007 V2 needs an integral second-column average.");
      return {
        mode,
        value: average,
        learnerText: `The average ${context.seriesBMeasure} across the five ${context.rowLabel.toLowerCase()} entries is ${average} ${context.unit}.`,
      };
    }
    case "COMBINED_TOTAL":
      return {
        mode,
        value: totalA + totalB,
        learnerText: `The combined total of ${context.seriesAMeasure} and ${context.seriesBMeasure} is ${totalA + totalB} ${context.unit}.`,
      };
    case "TOTAL_RATIO_TO_A": {
      const divisor = gcd(totalB, totalA);
      const numerator = totalB / divisor;
      const denominator = totalA / divisor;
      return {
        mode,
        numerator,
        denominator,
        learnerText: `The ratio of the total ${context.seriesBMeasure} to the total ${context.seriesAMeasure} is ${numerator}:${denominator}.`,
      };
    }
    case "DIFFERENCE_FROM_A_TOTAL": {
      const direction = totalB >= totalA ? "ABOVE" as const : "BELOW" as const;
      const value = Math.abs(totalB - totalA);
      return {
        mode,
        direction,
        value,
        learnerText: `The total ${context.seriesBMeasure} is ${value} ${context.unit} ${direction === "ABOVE" ? "more" : "less"} than the total ${context.seriesAMeasure}.`,
      };
    }
  }
}

function recoverBTotal(stimulus: Di007V2Stimulus): number {
  const totalA = stimulus.points.reduce((sum, point) => sum + point.seriesA, 0);
  const condition = stimulus.aggregateCondition;
  switch (condition.mode) {
    case "COLUMN_TOTAL":
      return condition.value!;
    case "COLUMN_AVERAGE":
      return condition.value! * stimulus.points.length;
    case "COMBINED_TOTAL":
      return condition.value! - totalA;
    case "TOTAL_RATIO_TO_A": {
      const numerator = totalA * condition.numerator!;
      if (numerator % condition.denominator! !== 0) throw new Error("DI-007 V2 ratio recovery must be integral.");
      return numerator / condition.denominator!;
    }
    case "DIFFERENCE_FROM_A_TOTAL":
      return condition.direction === "ABOVE" ? totalA + condition.value! : totalA - condition.value!;
  }
}

function recoverMissing(stimulus: Di007V2Stimulus): number {
  const totalB = recoverBTotal(stimulus);
  const visibleB = stimulus.points.reduce(
    (sum, point, index) => index === stimulus.hiddenIndex ? sum : sum + point.seriesB,
    0,
  );
  return totalB - visibleB;
}

function buildStimulus(seed: string, profile: Di007V2ExamProfile): Di007V2Stimulus {
  const context = pick(seededRandom(`${seed}:context`), CONTEXTS);
  const aPattern = pick(seededRandom(`${seed}:a-pattern`), A_PATTERNS);
  const bPattern = pick(seededRandom(`${seed}:b-pattern`), B_PATTERNS);
  const scale = pick(seededRandom(`${seed}:scale`), SCALES);
  const aValues = shuffle(seededRandom(`${seed}:a-order`), aPattern).map((value) => value * scale);
  const bValues = shuffle(seededRandom(`${seed}:b-order`), bPattern).map((value) => value * scale);
  const hiddenIndex = pick(seededRandom(`${seed}:hidden-index`), INDEXES);
  const totalA = aValues.reduce((sum, value) => sum + value, 0);
  const totalB = bValues.reduce((sum, value) => sum + value, 0);
  const allowedModes = profile === "BANKING_PRELIMS" ? PRELIMS_MODES : MAINS_MODES;
  const mode = pick(seededRandom(`${seed}:${profile}:recovery-mode`), allowedModes);
  const aggregateCondition = aggregateConditionText(context, mode, totalA, totalB);

  return {
    kind: "MISSING_TABLE",
    contextId: context.id,
    title: context.title,
    instruction: `Study the table and answer the questions. One entry under ${context.seriesBLabel} is missing. ${aggregateCondition.learnerText}`,
    rowLabel: context.rowLabel,
    seriesALabel: context.seriesALabel,
    seriesBLabel: context.seriesBLabel,
    seriesAMeasure: context.seriesAMeasure,
    seriesBMeasure: context.seriesBMeasure,
    unit: context.unit,
    points: context.rowLabels.map((label, index) => ({
      label,
      seriesA: aValues[index]!,
      seriesB: bValues[index]!,
      displaySeriesB: index === hiddenIndex ? "?" as const : bValues[index]!,
    })),
    hiddenIndex,
    aggregateCondition,
  };
}

function buildOptions(seed: string, answer: string, candidates: readonly Candidate[], numericFallbackScale: number) {
  const seen = new Set<string>();
  const retained: Di007V2Option[] = [];
  const add = (candidate: Candidate) => {
    const key = candidate.text.trim().toLowerCase();
    if (!candidate.text.trim() || seen.has(key)) return;
    seen.add(key);
    retained.push(candidate);
  };

  add({ text: answer, misconceptionId: "CORRECT", derivation: "Exact result from the DI-007 V2 table." });
  candidates.forEach(add);

  if (retained.length < 5 && /^-?\d+(?:\.\d+)?$/.test(answer)) {
    const base = Number(answer);
    const step = Math.max(1, numericFallbackScale);
    for (const delta of [-2, -1, 1, 2, 3, -3]) {
      const value = base + delta * step;
      if (value <= 0 || !Number.isFinite(value)) continue;
      add({
        text: String(value),
        misconceptionId: `NEARBY_VALUE_${delta}`,
        derivation: "A nearby table-scale value produced by a one-step arithmetic slip.",
      });
    }
  }

  if (retained.length < 5 && /^\d+(?:\.\d+)?%$/.test(answer)) {
    const base = Number(answer.slice(0, -1));
    const upper = base <= 100 ? 100 : Math.max(200, base + 25);
    for (const delta of [-10, -5, 5, 10, 15, -15]) {
      const value = Math.round((base + delta) * 100) / 100;
      if (value <= 0 || value > upper) continue;
      const display = Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
      add({
        text: `${display}%`,
        misconceptionId: `NEARBY_PERCENT_${delta}`,
        derivation: "A nearby percentage consistent with a small base or arithmetic error.",
      });
    }
  }

  if (retained.length < 5 && /^\d+:\d+$/.test(answer)) {
    const ratioParts = answer.split(":");
    const left = Number(ratioParts[0]!);
    const right = Number(ratioParts[1]!);
    for (const [a, b, id] of [
      [left + 1, right, "LEFT_PLUS_ONE"],
      [left, right + 1, "RIGHT_PLUS_ONE"],
      [Math.max(1, left - 1), right, "LEFT_MINUS_ONE"],
      [left, Math.max(1, right - 1), "RIGHT_MINUS_ONE"],
    ] as const) {
      add({
        text: ratioDisplay(a, b),
        misconceptionId: id,
        derivation: "A nearby simplified ratio produced by a one-term arithmetic slip.",
      });
    }
  }

  if (retained.length < 5) throw new Error(`DI-007 V2 could construct only ${retained.length} unique options for answer ${answer}.`);
  const shuffled = shuffle(seededRandom(`${seed}:options`), retained.slice(0, 5));
  const correctIndex = shuffled.findIndex((option) => option.misconceptionId === "CORRECT");
  if (correctIndex < 0) throw new Error("DI-007 V2 lost the correct option during shuffling.");
  return { options: shuffled.map((option) => option.text), optionMetadata: shuffled, correctIndex };
}

function stemVariant(seed: string, kind: Di007V2TaskKind): 0 | 1 | 2 {
  return (hashSeed(`${seed}:${kind}:stem`) % 3) as 0 | 1 | 2;
}

function chooseVisibleIndex(seed: string, stimulus: Di007V2Stimulus, salt: string): number {
  const visible = INDEXES.filter((index) => index !== stimulus.hiddenIndex);
  return pick(seededRandom(`${seed}:${salt}`), visible);
}

function chooseTwoVisible(seed: string, stimulus: Di007V2Stimulus, salt: string): [number, number] {
  const visible = shuffle(
    seededRandom(`${seed}:${salt}`),
    INDEXES.filter((index) => index !== stimulus.hiddenIndex),
  );
  return [visible[0]!, visible[1]!];
}

function visibleValueStem(stimulus: Di007V2Stimulus, index: number, variant: 0 | 1 | 2): string {
  const row = stimulus.points[index]!;
  const templates = [
    `What is the ${stimulus.seriesBMeasure} for ${row.label}?`,
    `For ${row.label}, what is the ${stimulus.seriesBMeasure}?`,
    `For ${row.label}, find the ${stimulus.seriesBMeasure} figure.`,
  ] as const;
  return templates[variant];
}

function visibleDifferenceStem(stimulus: Di007V2Stimulus, index: number, variant: 0 | 1 | 2): string {
  const row = stimulus.points[index]!;
  const templates = [
    `What is the difference between ${stimulus.seriesAMeasure} and ${stimulus.seriesBMeasure} for ${row.label}?`,
    `For ${row.label}, by how many ${stimulus.unit} do the two table values differ?`,
    `Find the absolute difference between the two values shown for ${row.label}.`,
  ] as const;
  return templates[variant];
}

function recoverStem(stimulus: Di007V2Stimulus, variant: 0 | 1 | 2): string {
  const row = stimulus.points[stimulus.hiddenIndex]!;
  const templates = [
    `What is the missing value of ${stimulus.seriesBMeasure} for ${row.label}?`,
    `Find the value represented by ? for ${row.label}.`,
    `How many ${stimulus.unit} should replace the missing entry in ${row.label}?`,
  ] as const;
  return templates[variant];
}

function hiddenCombinedStem(stimulus: Di007V2Stimulus, variant: 0 | 1 | 2): string {
  const row = stimulus.points[stimulus.hiddenIndex]!;
  const templates = [
    `What is the combined ${stimulus.seriesAMeasure} and ${stimulus.seriesBMeasure} value for ${row.label}?`,
    `After finding the missing entry, what is the total of both table values for ${row.label}?`,
    `Find ${stimulus.seriesAMeasure} plus ${stimulus.seriesBMeasure} for ${row.label}.`,
  ] as const;
  return templates[variant];
}

function missingRatioStem(stimulus: Di007V2Stimulus, variant: 0 | 1 | 2): string {
  const row = stimulus.points[stimulus.hiddenIndex]!;
  const templates = [
    `What is the ratio of ${stimulus.seriesBMeasure} to ${stimulus.seriesAMeasure} for ${row.label}?`,
    `For ${row.label}, find the ratio ${stimulus.seriesBLabel} : ${stimulus.seriesALabel}.`,
    `After recovering the missing value, what is its ratio to the paired ${stimulus.seriesAMeasure} value?`,
  ] as const;
  return templates[variant];
}

function bTotalPercentStem(stimulus: Di007V2Stimulus, variant: 0 | 1 | 2): string {
  const templates = [
    `The total ${stimulus.seriesBMeasure} is what percentage of the total ${stimulus.seriesAMeasure}?`,
    `Find ${stimulus.seriesBLabel} as a percentage of ${stimulus.seriesALabel}, using the five-row totals.`,
    `What percentage of the ${stimulus.seriesAMeasure} total is the ${stimulus.seriesBMeasure} total?`,
  ] as const;
  return templates[variant];
}

function missingShareStem(stimulus: Di007V2Stimulus, variant: 0 | 1 | 2): string {
  const row = stimulus.points[stimulus.hiddenIndex]!;
  const templates = [
    `The ${stimulus.seriesBMeasure} for ${row.label} is what percentage of the total ${stimulus.seriesBMeasure} across all five rows?`,
    `What percentage of the total ${stimulus.seriesBMeasure} comes from ${row.label}?`,
    `After finding the missing entry for ${row.label}, what percentage of the total ${stimulus.seriesBMeasure} does it represent?`,
  ] as const;
  return templates[variant];
}

function visibleTwoRowStem(stimulus: Di007V2Stimulus, i: number, j: number, variant: 0 | 1 | 2): string {
  const left = stimulus.points[i]!.label;
  const right = stimulus.points[j]!.label;
  const templates = [
    `What is the combined ${stimulus.seriesBMeasure} for ${left} and ${right}?`,
    `Find the sum of the ${stimulus.seriesBMeasure} values for ${left} and ${right}.`,
    `Together, how many ${stimulus.unit} are recorded under ${stimulus.seriesBLabel} for ${left} and ${right}?`,
  ] as const;
  return templates[variant];
}

function missingPairedPercentStem(stimulus: Di007V2Stimulus, variant: 0 | 1 | 2): string {
  const row = stimulus.points[stimulus.hiddenIndex]!;
  const templates = [
    `For ${row.label}, the ${stimulus.seriesBMeasure} is what percentage of the ${stimulus.seriesAMeasure}?`,
    `After finding the missing entry for ${row.label}, express the ${stimulus.seriesBMeasure} as a percentage of the ${stimulus.seriesAMeasure}.`,
    `For ${row.label}, what percent of the ${stimulus.seriesAMeasure} is the ${stimulus.seriesBMeasure}?`,
  ] as const;
  return templates[variant];
}

function combinedShareStem(stimulus: Di007V2Stimulus, otherIndex: number, variant: 0 | 1 | 2): string {
  const hidden = stimulus.points[stimulus.hiddenIndex]!.label;
  const other = stimulus.points[otherIndex]!.label;
  const templates = [
    `The combined ${stimulus.seriesBMeasure} for ${hidden} and ${other} is what percentage of the total ${stimulus.seriesBMeasure}?`,
    `What percentage of the total ${stimulus.seriesBMeasure} comes from ${hidden} and ${other} together?`,
    `After finding the missing entry, what percentage of the total ${stimulus.seriesBMeasure} comes from ${hidden} and ${other} together?`,
  ] as const;
  return templates[variant];
}

function excessStem(stimulus: Di007V2Stimulus, otherIndex: number, hidden: number, other: number, variant: 0 | 1 | 2): string {
  const hiddenLabel = stimulus.points[stimulus.hiddenIndex]!.label;
  const otherLabel = stimulus.points[otherIndex]!.label;
  const largerLabel = hidden >= other ? hiddenLabel : otherLabel;
  const smallerLabel = hidden >= other ? otherLabel : hiddenLabel;
  const templates = [
    `The ${stimulus.seriesBMeasure} for ${largerLabel} is what percentage more than that for ${smallerLabel}?`,
    `Between ${hiddenLabel} and ${otherLabel}, by what percentage does the higher ${stimulus.seriesBMeasure} exceed the lower one?`,
    `Compare ${hiddenLabel} and ${otherLabel}. By what percentage is the higher ${stimulus.seriesBMeasure} above the lower one?`,
  ] as const;
  return templates[variant];
}

function rowTotalRatioStem(stimulus: Di007V2Stimulus, otherIndex: number, variant: 0 | 1 | 2): string {
  const hiddenLabel = stimulus.points[stimulus.hiddenIndex]!.label;
  const otherLabel = stimulus.points[otherIndex]!.label;
  const templates = [
    `What is the ratio of the combined row total for ${hiddenLabel} to the combined row total for ${otherLabel}?`,
    `Find the ratio (${stimulus.seriesALabel} + ${stimulus.seriesBLabel}) for ${hiddenLabel} to the corresponding total for ${otherLabel}.`,
    `After finding the missing entry, compare the combined values of both columns for ${hiddenLabel} and ${otherLabel} as a ratio.`,
  ] as const;
  return templates[variant];
}

function buildDraftForTask(seed: string, stimulus: Di007V2Stimulus, kind: Di007V2TaskKind): Draft {
  const hiddenIndex = stimulus.hiddenIndex;
  const hiddenPoint = stimulus.points[hiddenIndex]!;
  const hidden = recoverMissing(stimulus);
  const totalA = stimulus.points.reduce((sum, point) => sum + point.seriesA, 0);
  const totalB = recoverBTotal(stimulus);
  const visibleBTotal = totalB - hidden;
  const variant = stemVariant(seed, kind);

  const visibleIndex = chooseVisibleIndex(seed, stimulus, `${kind}:visible`);
  const visiblePoint = stimulus.points[visibleIndex]!;
  const [visibleI, visibleJ] = chooseTwoVisible(seed, stimulus, `${kind}:pair`);
  const visiblePairSum = stimulus.points[visibleI]!.seriesB + stimulus.points[visibleJ]!.seriesB;
  const hiddenRowTotal = hiddenPoint.seriesA + hidden;
  const visibleRowTotal = visiblePoint.seriesA + visiblePoint.seriesB;
  const fallbackScale = gcdMany(stimulus.points.flatMap((point) => [point.seriesA, point.seriesB]));

  switch (kind) {
    case "DIRECT_VISIBLE_VALUE": {
      const answer = String(visiblePoint.seriesB);
      return {
        kind,
        difficulty: "Easy",
        stemVariant: variant,
        stem: visibleValueStem(stimulus, visibleIndex, variant),
        answer,
        candidates: [
          { text: String(visiblePoint.seriesA), misconceptionId: "READ_PAIRED_A", derivation: "Reads the other value from the same row." },
          { text: String(stimulus.points[visibleI]!.seriesB), misconceptionId: "READ_OTHER_ROW_1", derivation: "Reads the requested column from another visible row." },
          { text: String(stimulus.points[visibleJ]!.seriesB), misconceptionId: "READ_OTHER_ROW_2", derivation: "Reads the requested column from a different visible row." },
          { text: String(Math.abs(visiblePoint.seriesA - visiblePoint.seriesB)), misconceptionId: "TAKE_ROW_DIFFERENCE", derivation: "Calculates the row difference instead of reading the value." },
          { text: String(visiblePoint.seriesA + visiblePoint.seriesB), misconceptionId: "TAKE_ROW_TOTAL", derivation: "Adds both values in the row instead of reading the requested entry." },
        ],
        explanation: {
          keyIdea: "This is a direct table-reading question; no missing-value calculation is needed.",
          steps: [`Locate ${visiblePoint.label}.`, `The value under ${stimulus.seriesBLabel} is ${answer} ${stimulus.unit}.`],
        },
        evidence: { visibleIndex },
      };
    }

    case "VISIBLE_ROW_DIFFERENCE": {
      const difference = Math.abs(visiblePoint.seriesA - visiblePoint.seriesB);
      return {
        kind,
        difficulty: "Easy",
        stemVariant: variant,
        stem: visibleDifferenceStem(stimulus, visibleIndex, variant),
        answer: String(difference),
        candidates: [
          { text: String(visiblePoint.seriesA + visiblePoint.seriesB), misconceptionId: "ADD_ROW_VALUES", derivation: "Adds the two values instead of finding their difference." },
          { text: String(visiblePoint.seriesA), misconceptionId: "USE_A_ONLY", derivation: "Reports only the first value from the row." },
          { text: String(visiblePoint.seriesB), misconceptionId: "USE_B_ONLY", derivation: "Reports only the second value from the row." },
          { text: String(Math.abs(visiblePoint.seriesA - hidden)), misconceptionId: "USE_HIDDEN_ROW_B", derivation: "Uses the recovered hidden value from another row." },
          { text: String(difference + fallbackScale), misconceptionId: "ONE_STEP_DIFFERENCE_SLIP", derivation: "Makes a one-step subtraction error at the table scale." },
        ],
        explanation: {
          keyIdea: "Both values are already visible in this row, so subtract the smaller from the larger.",
          steps: [`${visiblePoint.label}: ${stimulus.seriesALabel} = ${visiblePoint.seriesA}, ${stimulus.seriesBLabel} = ${visiblePoint.seriesB}.`, `Difference = ${Math.max(visiblePoint.seriesA, visiblePoint.seriesB)} - ${Math.min(visiblePoint.seriesA, visiblePoint.seriesB)} = ${difference}.`],
        },
        evidence: { visibleIndex },
      };
    }

    case "RECOVER_MISSING_VALUE":
      return {
        kind,
        difficulty: "Medium",
        stemVariant: variant,
        stem: recoverStem(stimulus, variant),
        answer: String(hidden),
        candidates: [
          { text: String(hiddenPoint.seriesA), misconceptionId: "COPY_PAIRED_A", derivation: "Copies the paired first-column value instead of reconstructing the missing entry." },
          { text: String(visibleBTotal), misconceptionId: "USE_VISIBLE_B_SUBTOTAL", derivation: "Stops at the subtotal of the four visible second-column values." },
          { text: String(totalB), misconceptionId: "USE_FULL_B_TOTAL", derivation: "Reports the complete second-column total rather than the missing cell." },
          { text: String(hidden + stimulus.points[visibleIndex]!.seriesB), misconceptionId: "OMIT_ONE_VISIBLE_VALUE", derivation: "Fails to subtract one visible second-column row." },
          { text: String(Math.abs(totalB - hidden)), misconceptionId: "REPORT_VISIBLE_COMPLEMENT", derivation: "Reports the visible complement instead of the missing value." },
        ],
        explanation: {
          keyIdea: `Use the additional condition to find the total ${stimulus.seriesBMeasure}, then subtract the four visible entries.`,
          steps: [
            `Total ${stimulus.seriesBMeasure} = ${totalB}; sum of the four visible values = ${visibleBTotal}.`,
            `Missing value = ${totalB} - ${visibleBTotal} = ${hidden} ${stimulus.unit}.`,
          ],
        },
        evidence: { hiddenIndex, totalB, visibleBTotal },
      };

    case "HIDDEN_ROW_COMBINED_TOTAL": {
      const answer = String(hiddenRowTotal);
      return {
        kind,
        difficulty: "Medium",
        stemVariant: variant,
        stem: hiddenCombinedStem(stimulus, variant),
        answer,
        candidates: [
          { text: String(hidden), misconceptionId: "USE_MISSING_ONLY", derivation: "Reports only the recovered second-column value." },
          { text: String(hiddenPoint.seriesA), misconceptionId: "USE_A_ONLY", derivation: "Reports only the visible first-column value." },
          { text: String(Math.abs(hidden - hiddenPoint.seriesA)), misconceptionId: "SUBTRACT_ROW_VALUES", derivation: "Finds the difference instead of the row total." },
          { text: String(totalB), misconceptionId: "USE_B_TOTAL", derivation: "Uses the full second-column total instead of the requested row total." },
          { text: String(hiddenRowTotal + fallbackScale), misconceptionId: "ONE_STEP_ROW_TOTAL_SLIP", derivation: "Adds an extra table-scale amount after forming the row total." },
        ],
        explanation: {
          keyIdea: `First find the missing ${stimulus.seriesBMeasure}, then add it to the ${stimulus.seriesAMeasure} in the same row.`,
          steps: [`For ${hiddenPoint.label}, the missing ${stimulus.seriesBMeasure} value is ${hidden}.`, `Combined row value = ${hiddenPoint.seriesA} + ${hidden} = ${hiddenRowTotal}.`],
        },
        evidence: { hiddenIndex },
      };
    }

    case "MISSING_TO_PAIRED_RATIO": {
      const answer = ratioDisplay(hidden, hiddenPoint.seriesA);
      return {
        kind,
        difficulty: "Medium",
        stemVariant: variant,
        stem: missingRatioStem(stimulus, variant),
        answer,
        candidates: [
          { text: ratioDisplay(hiddenPoint.seriesA, hidden), misconceptionId: "REVERSE_RATIO", derivation: "Reverses the requested order." },
          { text: ratioDisplay(hiddenRowTotal, hiddenPoint.seriesA), misconceptionId: "USE_ROW_TOTAL_AS_B", derivation: "Uses the combined row total as the first term." },
          { text: ratioDisplay(hidden, hiddenRowTotal), misconceptionId: "USE_ROW_TOTAL_AS_A", derivation: "Uses the combined row total as the second term." },
          { text: ratioDisplay(totalB, hiddenPoint.seriesA), misconceptionId: "USE_COLUMN_TOTAL", derivation: "Uses the full second-column total instead of the missing row value." },
          { text: ratioDisplay(visiblePoint.seriesB, visiblePoint.seriesA), misconceptionId: "USE_VISIBLE_ROW_RATIO", derivation: "Forms the same type of ratio from another row." },
        ],
        explanation: {
          keyIdea: `Find the missing ${stimulus.seriesBMeasure} first, then simplify the two values in that row in the order asked.`,
          steps: [`${hiddenPoint.label}: ${stimulus.seriesBLabel} = ${hidden}, ${stimulus.seriesALabel} = ${hiddenPoint.seriesA}.`, `Required ratio = ${hidden}:${hiddenPoint.seriesA} = ${answer}.`],
        },
        evidence: { hiddenIndex },
      };
    }

    case "B_TOTAL_AS_PERCENT_OF_A_TOTAL": {
      const answer = formatPercent(totalB, totalA);
      return {
        kind,
        difficulty: "Medium",
        stemVariant: variant,
        stem: bTotalPercentStem(stimulus, variant),
        answer,
        candidates: [
          { text: formatPercent(totalA, totalB), misconceptionId: "REVERSE_TOTAL_PERCENT", derivation: "Reverses the requested percentage comparison." },
          { text: formatPercent(totalB, totalA + totalB), misconceptionId: "USE_COMBINED_BASE", derivation: "Uses both series together as the denominator." },
          { text: formatPercent(totalA, totalA + totalB), misconceptionId: "USE_A_SHARE_OF_COMBINED", derivation: "Finds the first-column share of the combined total." },
          { text: formatPercent(visibleBTotal, totalA), misconceptionId: "OMIT_MISSING_FROM_B", derivation: "Uses only the four visible second-column values." },
          { text: formatPercent(hidden, totalA), misconceptionId: "USE_MISSING_ONLY", derivation: "Uses only the recovered missing cell as the numerator." },
        ],
        explanation: {
          keyIdea: `After finding the missing entry, compare the complete totals of ${stimulus.seriesBMeasure} and ${stimulus.seriesAMeasure}.`,
          steps: [`Total ${stimulus.seriesAMeasure} = ${totalA}; total ${stimulus.seriesBMeasure} = ${totalB}.`, `Required percentage = ${totalB}/${totalA} × 100 = ${answer}.`],
        },
        evidence: { totalA, totalB },
      };
    }

    case "MISSING_SHARE_OF_B_TOTAL": {
      const answer = formatPercent(hidden, totalB);
      return {
        kind,
        difficulty: "Medium",
        stemVariant: variant,
        stem: missingShareStem(stimulus, variant),
        answer,
        candidates: [
          { text: formatPercent(visibleBTotal, totalB), misconceptionId: "USE_VISIBLE_COMPLEMENT", derivation: "Finds the share of the four visible rows." },
          { text: formatPercent(hidden, visibleBTotal), misconceptionId: "USE_VISIBLE_SUBTOTAL_BASE", derivation: "Uses only the visible subtotal as the denominator." },
          { text: formatPercent(hiddenPoint.seriesA, totalA), misconceptionId: "USE_PAIRED_A_SHARE", derivation: "Uses the paired first-column value and first-column total." },
          { text: formatPercent(hidden, totalA), misconceptionId: "USE_A_TOTAL_BASE", derivation: "Uses the first-column total as the denominator." },
          { text: formatPercent(hiddenPoint.seriesA, totalB), misconceptionId: "USE_PAIRED_A_NUMERATOR", derivation: "Uses the paired first-column row as the numerator." },
        ],
        explanation: {
          keyIdea: `Use the recovered ${stimulus.seriesBMeasure} for ${hiddenPoint.label} as the numerator and the complete ${stimulus.seriesBMeasure} total as the denominator.`,
          steps: [`Missing ${stimulus.seriesBMeasure} = ${hidden}; complete total = ${totalB}.`, `Percentage share = ${hidden}/${totalB} × 100 = ${answer}.`],
        },
        evidence: { hiddenIndex, totalB },
      };
    }

    case "VISIBLE_TWO_ROW_B_TOTAL":
      return {
        kind,
        difficulty: "Medium",
        stemVariant: variant,
        stem: visibleTwoRowStem(stimulus, visibleI, visibleJ, variant),
        answer: String(visiblePairSum),
        candidates: [
          { text: String(stimulus.points[visibleI]!.seriesB), misconceptionId: "USE_FIRST_ROW_ONLY", derivation: "Uses only the first named row." },
          { text: String(stimulus.points[visibleJ]!.seriesB), misconceptionId: "USE_SECOND_ROW_ONLY", derivation: "Uses only the second named row." },
          { text: String(Math.abs(stimulus.points[visibleI]!.seriesB - stimulus.points[visibleJ]!.seriesB)), misconceptionId: "TAKE_DIFFERENCE", derivation: "Subtracts the two values instead of adding them." },
          { text: String(stimulus.points[visibleI]!.seriesA + stimulus.points[visibleJ]!.seriesA), misconceptionId: "ADD_WRONG_SERIES", derivation: "Adds the first-column values for the named rows." },
          { text: String(visiblePairSum + hidden), misconceptionId: "ADD_HIDDEN_ROW_TOO", derivation: "Includes the missing row even though only two visible rows were requested." },
        ],
        explanation: {
          keyIdea: "Both requested second-column values are visible, so simply add those two entries.",
          steps: [`${stimulus.points[visibleI]!.label} = ${stimulus.points[visibleI]!.seriesB}; ${stimulus.points[visibleJ]!.label} = ${stimulus.points[visibleJ]!.seriesB}.`, `Combined value = ${stimulus.points[visibleI]!.seriesB} + ${stimulus.points[visibleJ]!.seriesB} = ${visiblePairSum}.`],
        },
        evidence: { visibleI, visibleJ },
      };

    case "MISSING_AS_PERCENT_OF_PAIRED_A": {
      const answer = formatPercent(hidden, hiddenPoint.seriesA);
      return {
        kind,
        difficulty: "Hard",
        stemVariant: variant,
        stem: missingPairedPercentStem(stimulus, variant),
        answer,
        candidates: [
          { text: formatPercent(hiddenPoint.seriesA, hidden), misconceptionId: "REVERSE_ROW_PERCENT", derivation: "Reverses the requested row percentage." },
          { text: formatPercent(hidden, hiddenRowTotal), misconceptionId: "USE_ROW_TOTAL_BASE", derivation: "Uses the combined row total as the denominator." },
          { text: formatPercent(hiddenPoint.seriesA, hiddenRowTotal), misconceptionId: "USE_A_SHARE_OF_ROW", derivation: "Finds the first-column share of the row total." },
          { text: formatPercent(totalB, totalA), misconceptionId: "USE_COLUMN_TOTAL_PERCENT", derivation: "Uses the two full column totals instead of the hidden row." },
          { text: formatPercent(visiblePoint.seriesB, visiblePoint.seriesA), misconceptionId: "USE_VISIBLE_ROW_PERCENT", derivation: "Calculates the same type of percentage for a visible row." },
        ],
        explanation: {
          keyIdea: `This needs two steps: find the missing ${stimulus.seriesBMeasure}, then compare it with the ${stimulus.seriesAMeasure} in the same row.`,
          steps: [`Missing ${stimulus.seriesBMeasure} for ${hiddenPoint.label} = ${hidden}.`, `Required percentage = ${hidden}/${hiddenPoint.seriesA} × 100 = ${answer}.`],
        },
        evidence: { hiddenIndex },
      };
    }

    case "COMBINED_HIDDEN_VISIBLE_SHARE_OF_B_TOTAL": {
      const numerator = hidden + visiblePoint.seriesB;
      const answer = formatPercent(numerator, totalB);
      return {
        kind,
        difficulty: "Hard",
        stemVariant: variant,
        stem: combinedShareStem(stimulus, visibleIndex, variant),
        answer,
        candidates: [
          { text: formatPercent(hidden, totalB), misconceptionId: "USE_HIDDEN_ONLY", derivation: "Uses only the recovered hidden row." },
          { text: formatPercent(visiblePoint.seriesB, totalB), misconceptionId: "USE_VISIBLE_ONLY", derivation: "Uses only the named visible row." },
          { text: formatPercent(numerator, visibleBTotal), misconceptionId: "USE_VISIBLE_SUBTOTAL_BASE", derivation: "Uses the four-row visible subtotal as denominator." },
          { text: formatPercent(totalB - numerator, totalB), misconceptionId: "USE_COMPLEMENT_SHARE", derivation: "Reports the share of all remaining rows." },
          { text: formatPercent(hidden + visiblePoint.seriesA, totalB), misconceptionId: "MIX_SERIES_IN_NUMERATOR", derivation: "Adds the wrong series value from the visible row." },
        ],
        explanation: {
          keyIdea: `Find the missing ${stimulus.seriesBMeasure}, add it to the named visible value from the same column, then compare the sum with the column total.`,
          steps: [`${hiddenPoint.label} = ${hidden}; ${visiblePoint.label} = ${visiblePoint.seriesB}; combined = ${numerator}.`, `Combined share = ${numerator}/${totalB} × 100 = ${answer}.`],
        },
        evidence: { hiddenIndex, visibleIndex, totalB },
      };
    }

    case "HIDDEN_VS_VISIBLE_B_PERCENT_EXCESS": {
      const larger = Math.max(hidden, visiblePoint.seriesB);
      const smaller = Math.min(hidden, visiblePoint.seriesB);
      const difference = larger - smaller;
      const answer = formatPercent(difference, smaller);
      return {
        kind,
        difficulty: "Hard",
        stemVariant: variant,
        stem: excessStem(stimulus, visibleIndex, hidden, visiblePoint.seriesB, variant),
        answer,
        candidates: [
          { text: formatPercent(difference, larger), misconceptionId: "USE_LARGER_AS_BASE", derivation: "Uses the larger value as the percentage base instead of the smaller one." },
          { text: formatPercent(larger, smaller), misconceptionId: "REPORT_LARGER_AS_PERCENT", derivation: "Reports the larger value as a percentage of the smaller instead of only the excess." },
          { text: formatPercent(smaller, larger), misconceptionId: "REVERSE_COMPARISON", derivation: "Reverses the comparison." },
          { text: formatPercent(difference, hidden + visiblePoint.seriesB), misconceptionId: "USE_PAIR_TOTAL_BASE", derivation: "Uses the sum of the two values as the base." },
          { text: formatPercent(Math.abs(hiddenPoint.seriesA - visiblePoint.seriesA), Math.min(hiddenPoint.seriesA, visiblePoint.seriesA)), misconceptionId: "COMPARE_WRONG_SERIES", derivation: "Performs the excess calculation on the first series instead." },
        ],
        explanation: {
          keyIdea: `Find the missing ${stimulus.seriesBMeasure}, identify the smaller of the two values being compared, then measure the difference relative to that smaller value.`,
          steps: [`The two ${stimulus.seriesBMeasure} values are ${hidden} and ${visiblePoint.seriesB}; difference = ${difference}.`, `Percentage excess = ${difference}/${smaller} × 100 = ${answer}.`],
        },
        evidence: { hiddenIndex, visibleIndex },
      };
    }

    case "HIDDEN_ROW_TO_VISIBLE_ROW_TOTAL_RATIO": {
      const answer = ratioDisplay(hiddenRowTotal, visibleRowTotal);
      return {
        kind,
        difficulty: "Hard",
        stemVariant: variant,
        stem: rowTotalRatioStem(stimulus, visibleIndex, variant),
        answer,
        candidates: [
          { text: ratioDisplay(visibleRowTotal, hiddenRowTotal), misconceptionId: "REVERSE_ROW_TOTAL_RATIO", derivation: "Reverses the requested row order." },
          { text: ratioDisplay(hidden, visiblePoint.seriesB), misconceptionId: "USE_B_ONLY", derivation: "Compares only the second-column values and ignores the paired first-column values." },
          { text: ratioDisplay(hiddenPoint.seriesA, visiblePoint.seriesA), misconceptionId: "USE_A_ONLY", derivation: "Compares only the first-column values." },
          { text: ratioDisplay(hiddenRowTotal, visiblePoint.seriesB), misconceptionId: "MIX_ROW_TOTAL_WITH_B", derivation: "Compares a row total with a single second-column value." },
          { text: ratioDisplay(hidden, visibleRowTotal), misconceptionId: "MIX_B_WITH_ROW_TOTAL", derivation: "Compares the hidden second-column value with the other row's total." },
        ],
        explanation: {
          keyIdea: `Find the missing entry, add the two column values for each requested row, and then simplify the ratio of those row totals.`,
          steps: [`${hiddenPoint.label} row total = ${hiddenPoint.seriesA} + ${hidden} = ${hiddenRowTotal}; ${visiblePoint.label} row total = ${visiblePoint.seriesA} + ${visiblePoint.seriesB} = ${visibleRowTotal}.`, `Required ratio = ${hiddenRowTotal}:${visibleRowTotal} = ${answer}.`],
        },
        evidence: { hiddenIndex, visibleIndex },
      };
    }
  }
}

function selectTasks(seed: string): readonly Di007V2TaskKind[] {
  const easy = pick(seededRandom(`${seed}:easy-task`), EASY_TASKS);
  const medium = shuffle(seededRandom(`${seed}:medium-tasks`), MEDIUM_TASKS).slice(0, 2);
  const hard = shuffle(seededRandom(`${seed}:hard-tasks`), HARD_TASKS).slice(0, 2);
  return shuffle(seededRandom(`${seed}:question-order`), [easy, ...medium, ...hard]);
}

function validateSet(set: Omit<Di007V2QuestionSet, "validation">) {
  const checks: Di007V2ValidationCheck[] = [];
  const add = (id: string, passed: boolean, message: string) => checks.push({ id, passed, message });
  const recovered = recoverMissing(set.stimulus);
  const difficultyCounts = set.questions.reduce<Record<string, number>>((acc, question) => {
    acc[question.difficulty] = (acc[question.difficulty] ?? 0) + 1;
    return acc;
  }, {});

  add("MISSING_TABLE_KIND", set.stimulus.kind === "MISSING_TABLE", "DI-007 V2 must use missing-table semantics.");
  add("FIVE_ROWS", set.stimulus.points.length === 5, "DI-007 V2 requires five table rows.");
  add("ONE_HIDDEN_CELL", set.stimulus.points.filter((point) => point.displaySeriesB === "?").length === 1, "Exactly one second-column cell must be hidden.");
  add("RECOVERY_PARITY", recovered === set.stimulus.points[set.stimulus.hiddenIndex]?.seriesB, "The condition must recover the exact hidden value.");
  add("FIVE_LINKED_QUESTIONS", set.questions.length === 5, "Each set must contain five linked questions.");
  add("DIFFICULTY_MIX", difficultyCounts.Easy === 1 && difficultyCounts.Medium === 2 && difficultyCounts.Hard === 2, "Each set must contain exactly 1 Easy, 2 Medium and 2 Hard questions.");
  add("DISTINCT_TASKS", new Set(set.questions.map((question) => question.kind)).size === 5, "A set must not repeat a task family.");
  add("FIVE_UNIQUE_OPTIONS", set.questions.every((question) => question.options.length === 5 && new Set(question.options).size === 5), "Every banking question must expose five unique options.");
  add("ONE_CORRECT", set.questions.every((question) => question.options[question.correctIndex] === question.answer && question.optionMetadata.filter((option) => option.misconceptionId === "CORRECT").length === 1), "Every question must bind exactly one correct option.");
  add("EXPLANATION_QUALITY", set.questions.every((question) => question.explanation.keyIdea.length >= 35 && question.explanation.steps.length >= 2), "Every question needs a simple worked explanation.");
  add("LIFECYCLE_LOCK", !set.traceability.questionStudioDiscoverable && !set.traceability.questionBankWritable && !set.traceability.testEligible && !set.traceability.mockTestEligible && !set.traceability.publiclyPublishable && !set.traceability.automaticStudentPublication && !set.traceability.productionReleaseAuthorized, "DI-007 V2 must remain review-only.");
  return { valid: checks.every((check) => check.passed), checks };
}

export function generateDi007V2ReviewSet(input: { seed?: string; examProfile?: Di007V2ExamProfile } = {}): Di007V2QuestionSet {
  const seed = input.seed ?? "DI-007:V2:REVIEW";
  const examProfile = input.examProfile ?? "BANKING_PRELIMS";
  const stimulus = buildStimulus(seed, examProfile);
  const tasks = selectTasks(seed);
  const setId = `DI-007-V2-${hashSeed(`${seed}:${examProfile}`).toString(36)}`;

  const questions = tasks.map((kind, index): Di007V2Question => {
    const draft = buildDraftForTask(seed, stimulus, kind);
    const numericScale = gcdMany(stimulus.points.flatMap((point) => [point.seriesA, point.seriesB]));
    const optionPackage = buildOptions(`${seed}:${examProfile}:${kind}`, draft.answer, draft.candidates, numericScale);
    return {
      questionId: `${setId}-Q${index + 1}`,
      setId,
      kind: draft.kind,
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

  const withoutValidation: Omit<Di007V2QuestionSet, "validation"> = {
    packageId: "DI-007",
    setId,
    seed,
    language: "en",
    examProfile,
    optionCount: 5,
    setDifficulty: "MISSING_DI_RECONSTRUCTION_V2",
    stimulus,
    questions,
    traceability: {
      packageId: "DI-007",
      representation: "MISSING_DI",
      sourceFoundation: "DI-007-PHASE6",
      setContractVersion: "DI-007-SET-CONTRACT-V2",
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
    throw new Error(`DI-007 V2 validation failed: ${failed}`);
  }
  return { ...withoutValidation, validation };
}

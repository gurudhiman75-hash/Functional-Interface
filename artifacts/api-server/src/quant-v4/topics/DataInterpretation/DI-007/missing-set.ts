import { hashSeed, pick, ratioDisplay, seededRandom, shuffle } from "../DI-001/exact";
import type {
  Di007AggregateCondition,
  Di007Difficulty,
  Di007ExamProfile,
  Di007Explanation,
  Di007Option,
  Di007Question,
  Di007QuestionSet,
  Di007RecoveryMode,
  Di007Stimulus,
  Di007TaskKind,
  Di007ValidationCheck,
} from "./types";

const PERIODS = ["2021", "2022", "2023", "2024", "2025"] as const;
const SERIES_A_POOL = [150, 190, 230, 270, 310, 350, 390] as const;
const SERIES_B_POOL = [200, 240, 280, 320, 360, 400, 440] as const;
const INDEXES = [0, 1, 2, 3, 4] as const;

const PRELIMS_MODES: readonly Di007RecoveryMode[] = ["COLUMN_TOTAL", "COLUMN_AVERAGE", "COMBINED_TOTAL"];
const MAINS_MODES: readonly Di007RecoveryMode[] = [
  "COLUMN_TOTAL",
  "COLUMN_AVERAGE",
  "COMBINED_TOTAL",
  "TOTAL_RATIO_TO_A",
  "DIFFERENCE_FROM_A_TOTAL",
];

type Candidate = Readonly<{
  text: string;
  misconceptionId: string;
  derivation: string;
}>;

type Draft = Readonly<{
  kind: Di007TaskKind;
  difficulty: Di007Difficulty;
  stem: string;
  answer: string;
  candidates: readonly Candidate[];
  explanation: Di007Explanation;
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

function formatQuotient(numerator: number, denominator: number): string {
  if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator) || numerator < 0 || denominator <= 0) {
    throw new Error("DI-007 received an invalid rational value.");
  }
  const n = BigInt(numerator);
  const d = BigInt(denominator);
  const hundredths = (n * 100n + d / 2n) / d;
  const whole = hundredths / 100n;
  const fraction = Number(hundredths % 100n);
  if (fraction === 0) return String(whole);
  if (fraction % 10 === 0) return `${whole}.${fraction / 10}`;
  return `${whole}.${String(fraction).padStart(2, "0")}`;
}

function formatPercent(numerator: number, denominator: number): string {
  return `${formatQuotient(numerator * 100, denominator)}%`;
}

function buildAggregateCondition(mode: Di007RecoveryMode, totalA: number, totalB: number): Di007AggregateCondition {
  switch (mode) {
    case "COLUMN_TOTAL":
      return { mode, value: totalB, learnerText: `The total number of accounts in Series B over all five years is ${totalB}.` };
    case "COLUMN_AVERAGE": {
      const average = totalB / 5;
      if (!Number.isSafeInteger(average)) throw new Error("DI-007 requires an integral Series B average.");
      return { mode, value: average, learnerText: `The average number of accounts in Series B over the five years is ${average}.` };
    }
    case "COMBINED_TOTAL":
      return { mode, value: totalA + totalB, learnerText: `The combined five-year total of Series A and Series B is ${totalA + totalB} accounts.` };
    case "TOTAL_RATIO_TO_A": {
      const divisor = gcd(totalB, totalA);
      const numerator = totalB / divisor;
      const denominator = totalA / divisor;
      return { mode, numerator, denominator, learnerText: `The ratio of the five-year total of Series B to the five-year total of Series A is ${numerator}:${denominator}.` };
    }
    case "DIFFERENCE_FROM_A_TOTAL": {
      const direction = totalB > totalA ? "ABOVE" as const : "BELOW" as const;
      const value = Math.abs(totalB - totalA);
      return {
        mode,
        direction,
        value,
        learnerText: `The five-year total of Series B is ${value} accounts ${direction === "ABOVE" ? "more" : "less"} than the five-year total of Series A.`,
      };
    }
  }
}

function recoverBTotal(stimulus: Di007Stimulus): number {
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
      if (numerator % condition.denominator! !== 0) throw new Error("DI-007 ratio condition does not reconstruct an integer Series B total.");
      return numerator / condition.denominator!;
    }
    case "DIFFERENCE_FROM_A_TOTAL":
      return condition.direction === "ABOVE" ? totalA + condition.value! : totalA - condition.value!;
  }
}

function recoverMissing(stimulus: Di007Stimulus): number {
  const totalB = recoverBTotal(stimulus);
  const visibleB = stimulus.points.reduce((sum, point, index) => index === stimulus.hiddenIndex ? sum : sum + point.seriesB, 0);
  return totalB - visibleB;
}

function buildStimulus(seed: string, examProfile: Di007ExamProfile): Di007Stimulus {
  const aValues = shuffle(seededRandom(`${seed}:series-a`), SERIES_A_POOL).slice(0, 5);
  const bValues = shuffle(seededRandom(`${seed}:series-b`), SERIES_B_POOL).slice(0, 5);
  const hiddenIndex = pick(seededRandom(`${seed}:hidden-index`), INDEXES);
  const totalA = aValues.reduce((sum, value) => sum + value, 0);
  const totalB = bValues.reduce((sum, value) => sum + value, 0);
  const allowedModes = examProfile === "BANKING_PRELIMS" ? PRELIMS_MODES : MAINS_MODES;
  const mode = pick(seededRandom(`${seed}:${examProfile}:recovery-mode`), allowedModes);

  return {
    kind: "MISSING_TABLE",
    title: "Year-wise number of accounts in Series A and Series B",
    instruction: `Study the table and use the additional condition to determine the missing Series B value. ${buildAggregateCondition(mode, totalA, totalB).learnerText}`,
    periods: PERIODS,
    points: PERIODS.map((period, index) => ({
      period,
      seriesA: aValues[index]!,
      seriesB: bValues[index]!,
      displaySeriesB: index === hiddenIndex ? "?" as const : bValues[index]!,
    })),
    hiddenIndex,
    aggregateCondition: buildAggregateCondition(mode, totalA, totalB),
    unit: "accounts",
  };
}

function buildOptions(seed: string, answer: string, candidates: readonly Candidate[]) {
  const seen = new Set<string>();
  const retained: Di007Option[] = [];
  const add = (candidate: Candidate) => {
    const key = candidate.text.trim().toLowerCase();
    if (!candidate.text.trim() || seen.has(key)) return;
    seen.add(key);
    retained.push(candidate);
  };

  add({ text: answer, misconceptionId: "CORRECT", derivation: "Exact recomputation from the shared DI-007 missing-value stimulus." });
  candidates.forEach(add);
  if (retained.length < 5) throw new Error(`DI-007 could construct only ${retained.length} unique options; 5 are required.`);

  const shuffled = shuffle(seededRandom(`${seed}:options`), retained.slice(0, 5));
  const correctIndex = shuffled.findIndex((option) => option.misconceptionId === "CORRECT");
  if (correctIndex < 0) throw new Error("DI-007 lost the correct option during deterministic shuffling.");
  return { options: shuffled.map((option) => option.text), optionMetadata: shuffled, correctIndex };
}

function buildDrafts(stimulus: Di007Stimulus, examProfile: Di007ExamProfile): Draft[] {
  const hiddenIndex = stimulus.hiddenIndex;
  const hiddenPoint = stimulus.points[hiddenIndex]!;
  const hidden = recoverMissing(stimulus);
  const totalA = stimulus.points.reduce((sum, point) => sum + point.seriesA, 0);
  const totalB = recoverBTotal(stimulus);
  const visibleBValues = stimulus.points.filter((_, index) => index !== hiddenIndex).map((point) => point.seriesB);
  const visibleBTotal = visibleBValues.reduce((sum, value) => sum + value, 0);
  const minVisibleB = Math.min(...visibleBValues);
  const rowCombined = hiddenPoint.seriesA + hidden;
  const bAsPercentOfA = formatPercent(totalB, totalA);
  const missingShare = formatPercent(hidden, totalB);
  const hard = examProfile === "BANKING_MAINS" ? "Hard" as const : "Medium" as const;

  return [
    {
      kind: "RECOVER_MISSING_VALUE",
      difficulty: hard,
      stem: `What is the missing Series B value for ${hiddenPoint.period}?`,
      answer: String(hidden),
      candidates: [
        { text: String(hiddenPoint.seriesA), misconceptionId: "COPY_PAIRED_A_VALUE", derivation: "Copies the visible Series A value from the missing row instead of using the aggregate condition." },
        { text: String(visibleBTotal), misconceptionId: "USE_VISIBLE_B_SUBTOTAL", derivation: "Adds the four visible Series B values but forgets to subtract that subtotal from the reconstructed Series B total." },
        { text: String(totalB), misconceptionId: "USE_FULL_B_TOTAL", derivation: "Reports the reconstructed five-year Series B total instead of the one missing row value." },
        { text: String(hidden + minVisibleB), misconceptionId: "OMIT_ONE_VISIBLE_B_VALUE", derivation: "Subtracts only three of the four visible Series B values, leaving the missing value plus one visible row." },
        { text: String(totalB + hidden), misconceptionId: "ADD_MISSING_TO_TOTAL", derivation: "Adds the missing value to the already complete Series B total." },
      ],
      explanation: {
        keyIdea: "First turn the additional condition into the complete Series B total, then subtract the four visible Series B values.",
        steps: [
          `Series B total from the condition = ${totalB}; visible Series B subtotal = ${visibleBValues.join(" + ")} = ${visibleBTotal}.`,
          `Missing ${hiddenPoint.period} value = ${totalB} - ${visibleBTotal} = ${hidden}.`,
        ],
        shortcut: "Treat the aggregate condition as a way to recover the column total; after that, Missing = total − visible subtotal.",
        trap: "Do not stop at the Series B total or the visible subtotal. The question asks for the single unprinted cell.",
      },
      evidence: { hiddenIndex },
    },
    {
      kind: "MISSING_TO_PAIRED_RATIO",
      difficulty: "Hard",
      stem: `What is the ratio of Series B to Series A in ${hiddenPoint.period}?`,
      answer: ratioDisplay(hidden, hiddenPoint.seriesA),
      candidates: [
        { text: ratioDisplay(hiddenPoint.seriesA, hidden), misconceptionId: "REVERSE_ROW_RATIO", derivation: "Reverses the requested Series B-to-Series A order within the hidden row." },
        { text: ratioDisplay(rowCombined, hiddenPoint.seriesA), misconceptionId: "USE_ROW_TOTAL_AS_B", derivation: "Uses the combined row total as the Series B term instead of the reconstructed missing value." },
        { text: ratioDisplay(hidden, rowCombined), misconceptionId: "USE_ROW_TOTAL_AS_A", derivation: "Uses the combined row total as the Series A comparison term." },
        { text: ratioDisplay(hiddenPoint.seriesA, rowCombined), misconceptionId: "PAIR_A_WITH_ROW_TOTAL", derivation: "Compares Series A with the row total rather than comparing Series B with Series A." },
        { text: ratioDisplay(totalB, hiddenPoint.seriesA), misconceptionId: "USE_B_TOTAL_IN_RATIO", derivation: "Uses the five-year Series B total as the first ratio term instead of the missing row value." },
      ],
      explanation: {
        keyIdea: "Recover the missing Series B cell first, then form the row-wise ratio in exactly the order stated.",
        steps: [
          `Missing Series B in ${hiddenPoint.period} = ${hidden}; Series A = ${hiddenPoint.seriesA}.`,
          `${hidden}:${hiddenPoint.seriesA} = ${ratioDisplay(hidden, hiddenPoint.seriesA)}.`,
        ],
        shortcut: "Once the missing value is known, ignore all other rows for this question and simplify the two values in the hidden row.",
        trap: "Ratio order matters: Series B to Series A is not the same as Series A to Series B.",
      },
      evidence: { hiddenIndex },
    },
    {
      kind: "B_TOTAL_AS_PERCENT_OF_A_TOTAL",
      difficulty: "Hard",
      stem: "The five-year total of Series B is what percentage of the five-year total of Series A?",
      answer: bAsPercentOfA,
      candidates: [
        { text: formatPercent(totalA, totalB), misconceptionId: "REVERSE_TOTAL_PERCENT", derivation: "Reverses the requested whole-series comparison and calculates Series A as a percentage of Series B." },
        { text: formatPercent(totalB, totalA * 2), misconceptionId: "DOUBLE_A_BASE", derivation: "Uses twice the Series A total as the denominator, halving the required percentage." },
        { text: formatPercent(totalB * 2, totalA), misconceptionId: "DOUBLE_B_NUMERATOR", derivation: "Doubles the Series B total before comparing it with Series A." },
        { text: formatPercent(totalB, totalA + totalB), misconceptionId: "USE_COMBINED_TOTAL_BASE", derivation: "Uses the combined total of both series as the denominator instead of Series A total." },
        { text: formatPercent(totalA, totalA + totalB), misconceptionId: "USE_A_SHARE_OF_COMBINED", derivation: "Finds Series A's share of the combined total instead of Series B relative to Series A." },
      ],
      explanation: {
        keyIdea: "Reconstruct the complete Series B total, then compare it directly with the fully visible Series A total.",
        steps: [
          `Series A total = ${totalA}; Series B total = ${totalB}.`,
          `Required percentage = ${totalB}/${totalA} × 100 = ${bAsPercentOfA}.`,
        ],
        shortcut: "Once both column totals are known, this is a direct part-to-base percentage; no row-level work is needed.",
        trap: "The denominator is Series A total because the wording asks 'Series B is what percentage of Series A'.",
      },
      evidence: {},
    },
    {
      kind: "HIDDEN_ROW_COMBINED_TOTAL",
      difficulty: "Medium",
      stem: `What is the combined value of Series A and Series B in ${hiddenPoint.period}?`,
      answer: String(rowCombined),
      candidates: [
        { text: String(hidden), misconceptionId: "USE_MISSING_B_ONLY", derivation: "Reports only the reconstructed Series B value and omits the visible Series A value in the same row." },
        { text: String(hiddenPoint.seriesA), misconceptionId: "USE_A_ONLY", derivation: "Reports only the visible Series A value and ignores the recovered Series B value." },
        { text: String(Math.abs(hidden - hiddenPoint.seriesA)), misconceptionId: "SUBTRACT_ROW_VALUES", derivation: "Takes the difference between the two row values instead of their combined total." },
        { text: String(totalB), misconceptionId: "USE_B_COLUMN_TOTAL", derivation: "Uses the five-year Series B total instead of combining the two values in the hidden row." },
        { text: String(totalA), misconceptionId: "USE_A_COLUMN_TOTAL", derivation: "Uses the five-year Series A total instead of the requested row total." },
      ],
      explanation: {
        keyIdea: "After reconstructing the missing Series B cell, add it to the visible Series A value in the same row.",
        steps: [
          `Series B in ${hiddenPoint.period} = ${hidden}; Series A = ${hiddenPoint.seriesA}.`,
          `Combined row value = ${hidden} + ${hiddenPoint.seriesA} = ${rowCombined}.`,
        ],
        shortcut: "Do the missing-cell recovery once, then reuse that value for all downstream questions from the same row.",
        trap: "This is a row total, not a column total and not a difference between the two series.",
      },
      evidence: { hiddenIndex },
    },
    {
      kind: "MISSING_SHARE_OF_B_TOTAL",
      difficulty: "Hard",
      stem: `The Series B value in ${hiddenPoint.period} is what percentage of the five-year Series B total?`,
      answer: missingShare,
      candidates: [
        { text: formatPercent(hidden, totalB * 2), misconceptionId: "DOUBLE_B_TOTAL_BASE", derivation: "Uses twice the Series B total as the denominator, halving the required share." },
        { text: formatPercent(hidden * 2, totalB), misconceptionId: "DOUBLE_MISSING_VALUE", derivation: "Doubles the recovered missing value before calculating its share of Series B total." },
        { text: formatPercent(hidden, totalB + hidden), misconceptionId: "ADD_MISSING_TO_COMPLETE_TOTAL", derivation: "Adds the missing value again to a Series B total that already includes it." },
        { text: formatPercent(visibleBTotal, totalB), misconceptionId: "USE_VISIBLE_COMPLEMENT_SHARE", derivation: "Calculates the share of the four visible Series B rows instead of the missing row." },
        { text: formatPercent(hiddenPoint.seriesA, totalA), misconceptionId: "USE_PAIRED_A_SHARE", derivation: "Uses the paired Series A row as a share of Series A total instead of the missing Series B share." },
      ],
      explanation: {
        keyIdea: "The numerator is the reconstructed missing Series B cell and the denominator is the complete five-year Series B total.",
        steps: [
          `Missing Series B value = ${hidden}; Series B total = ${totalB}.`,
          `Required share = ${hidden}/${totalB} × 100 = ${missingShare}.`,
        ],
        shortcut: "Reuse the recovered Series B total from the missing-cell step; no new aggregate reconstruction is needed.",
        trap: "Do not use the visible four-row subtotal as the numerator; that gives the complement of the missing row's share.",
      },
      evidence: { hiddenIndex },
    },
  ];
}

function validateSet(set: Omit<Di007QuestionSet, "validation">) {
  const checks: Di007ValidationCheck[] = [];
  const add = (id: string, passed: boolean, message: string) => checks.push({ id, passed, message });
  const recovered = recoverMissing(set.stimulus);

  add("MISSING_TABLE_KIND", set.stimulus.kind === "MISSING_TABLE", "DI-007 must expose missing-table semantics.");
  add("FIVE_ROWS", set.stimulus.points.length === 5, "DI-007 requires exactly five rows.");
  add("ONE_HIDDEN_CELL", set.stimulus.points.filter((point) => point.displaySeriesB === "?").length === 1, "Exactly one Series B cell must be hidden.");
  add("HIDDEN_INDEX_PARITY", set.stimulus.points[set.stimulus.hiddenIndex]?.displaySeriesB === "?", "The hidden index must identify the missing cell.");
  add("RECOVERY_PARITY", recovered === set.stimulus.points[set.stimulus.hiddenIndex]?.seriesB, "Aggregate condition must reconstruct the exact hidden Series B value.");
  add("LINKED_QUESTION_COUNT", set.questions.length === 5, "DI-007 requires five linked child questions.");
  add("DISTINCT_TASK_KINDS", new Set(set.questions.map((question) => question.kind)).size === 5, "Each DI-007 child must test a distinct missing-DI task.");
  add("OPTION_COUNT", set.questions.every((question) => question.options.length === 5), "Every banking DI-007 child must expose exactly five options.");
  add("UNIQUE_OPTIONS", set.questions.every((question) => new Set(question.options).size === 5), "Every DI-007 child must have five unique displayed options.");
  add("ONE_CORRECT", set.questions.every((question) => question.optionMetadata.filter((option) => option.misconceptionId === "CORRECT").length === 1 && question.options[question.correctIndex] === question.answer), "Every child must have exactly one bound correct option.");
  add("EXPLANATION_SPECIFICITY", set.questions.every((question) => question.explanation.steps.length >= 2 && question.explanation.keyIdea.length > 40 && question.explanation.trap.length > 30), "Every DI-007 child requires a worked, question-specific explanation.");
  add("LIFECYCLE_LOCK", !set.traceability.questionStudioDiscoverable && set.traceability.questionBankStatus === "NOT_STORED" && set.traceability.testEligibility === "INELIGIBLE" && !set.traceability.publiclyPublishable, "DI-007 Phase 6 must remain review-only.");

  return { valid: checks.every((check) => check.passed), checks };
}

export function generateDi007MissingSet(input: { seed?: string; examProfile?: Di007ExamProfile } = {}): Di007QuestionSet {
  const seed = input.seed ?? "DI-007:MISSING:P6";
  const examProfile = input.examProfile ?? "BANKING_PRELIMS";
  const stimulus = buildStimulus(seed, examProfile);
  const drafts = buildDrafts(stimulus, examProfile);
  const setId = `DI-007-SET-${hashSeed(`${seed}:${examProfile}`).toString(36)}`;

  const questions = drafts.map((draft, index): Di007Question => {
    const questionId = `${setId}-Q${index + 1}`;
    const optionPackage = buildOptions(`${seed}:${examProfile}:${draft.kind}`, draft.answer, draft.candidates);
    return {
      questionId,
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

  const withoutValidation: Omit<Di007QuestionSet, "validation"> = {
    packageId: "DI-007",
    setId,
    seed,
    language: "en",
    examProfile,
    optionCount: 5,
    setDifficulty: "MISSING_DI_RECONSTRUCTION_MIXED",
    stimulus,
    questions,
    traceability: {
      packageId: "DI-007",
      representation: "MISSING_DI",
      parentFoundation: "DI-001",
      caseletSibling: "DI-006",
      setContractVersion: "DI-007-SET-CONTRACT-V1",
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
    throw new Error(`DI-007 set validation failed: ${failed}`);
  }

  return { ...withoutValidation, validation };
}

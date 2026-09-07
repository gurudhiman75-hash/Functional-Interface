import {
  hashSeed,
  pick,
  ratioDisplay,
  seededRandom,
  shuffle,
} from "../DI-001/exact";
import type {
  Di003Difficulty,
  Di003ExamProfile,
  Di003Explanation,
  Di003Option,
  Di003Question,
  Di003QuestionSet,
  Di003Stimulus,
  Di003TaskKind,
  Di003ValidationCheck,
} from "./types";

const CATEGORIES = ["2021", "2022", "2023", "2024", "2025"] as const;
const SERIES_A_POOL = [160, 180, 200, 220, 240, 260, 280] as const;
const SERIES_B_POOL = [100, 120, 140, 160, 180, 200, 220] as const;
const SCALE_POOL = [1, 2, 3] as const;

const OPTION_COUNT_BY_PROFILE: Record<Di003ExamProfile, 4 | 5> = {
  SSC_CGL_TIER_I: 4,
  BANKING_PRELIMS: 5,
};

type Candidate = Readonly<{
  text: string;
  misconceptionId: string;
  derivation: string;
}>;

type Draft = Readonly<{
  kind: Di003TaskKind;
  difficulty: Di003Difficulty;
  stem: string;
  answer: string;
  candidates: readonly Candidate[];
  explanation: Di003Explanation;
  evidence: Readonly<Record<string, number>>;
}>;

function formatPercent(numerator: number, denominator: number): string {
  if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator) || numerator < 0 || denominator <= 0) {
    throw new Error("DI-003 received an invalid percentage fraction.");
  }
  const n = BigInt(numerator);
  const d = BigInt(denominator);
  const hundredths = (n * 10_000n + d / 2n) / d;
  const whole = hundredths / 100n;
  const fraction = Number(hundredths % 100n);
  if (fraction === 0) return `${whole}%`;
  if (fraction % 10 === 0) return `${whole}.${fraction / 10}%`;
  return `${whole}.${String(fraction).padStart(2, "0")}%`;
}

function buildStimulus(seed: string): Di003Stimulus {
  const scale = pick(seededRandom(`${seed}:scale`), SCALE_POOL);
  const aValues = shuffle(seededRandom(`${seed}:series-a`), SERIES_A_POOL).slice(0, 5).map((value) => value * scale);
  const bValues = shuffle(seededRandom(`${seed}:series-b`), SERIES_B_POOL).slice(0, 5).map((value) => value * scale);
  const points = CATEGORIES.map((category, index) => ({
    category,
    seriesA: aValues[index]!,
    seriesB: bValues[index]!,
  }));

  return {
    kind: "GROUPED_BAR",
    title: "Annual sales of Product A and Product B",
    instruction: "Study the grouped bar chart and answer the five questions that follow.",
    categories: CATEGORIES,
    series: [
      { id: "SERIES_A", label: "Product A" },
      { id: "SERIES_B", label: "Product B" },
    ],
    points,
    yAxisLabel: "Sales (units)",
    unit: "units",
  };
}

function buildOptions(seed: string, optionCount: 4 | 5, answer: string, candidates: readonly Candidate[]) {
  const seen = new Set<string>();
  const retained: Di003Option[] = [];
  const add = (candidate: Candidate) => {
    const key = candidate.text.trim().toLowerCase();
    if (!candidate.text.trim() || seen.has(key)) return;
    seen.add(key);
    retained.push(candidate);
  };

  add({
    text: answer,
    misconceptionId: "CORRECT",
    derivation: "Exact recomputation from the shared DI-003 grouped-bar stimulus.",
  });
  candidates.forEach(add);

  if (retained.length < optionCount) {
    throw new Error(`DI-003 could construct only ${retained.length} unique options; ${optionCount} are required.`);
  }

  const shuffled = shuffle(seededRandom(`${seed}:options`), retained.slice(0, optionCount));
  const correctIndex = shuffled.findIndex((option) => option.misconceptionId === "CORRECT");
  if (correctIndex < 0) throw new Error("DI-003 lost the correct option during deterministic shuffling.");

  return {
    options: shuffled.map((option) => option.text),
    optionMetadata: shuffled,
    correctIndex,
  };
}

function buildDrafts(seed: string, stimulus: Di003Stimulus): Draft[] {
  const points = stimulus.points;
  const totalA = points.reduce((sum, point) => sum + point.seriesA, 0);
  const totalB = points.reduce((sum, point) => sum + point.seriesB, 0);
  if (totalA <= totalB) throw new Error("DI-003 grouped-bar state must keep Product A total above Product B total.");

  const differenceEntry = pick(
    seededRandom(`${seed}:difference-category`),
    points
      .map((point, index) => ({ index, difference: Math.abs(point.seriesA - point.seriesB) }))
      .filter((entry) => entry.difference > 0),
  );
  const differenceIndex = differenceEntry.index;
  const differencePoint = points[differenceIndex]!;
  const crossDifference = differenceEntry.difference;
  const neighborIndex = differenceIndex === points.length - 1 ? differenceIndex - 1 : differenceIndex + 1;
  const neighbor = points[neighborIndex]!;

  const [firstIndex, secondIndex] = pick(
    seededRandom(`${seed}:combined-ratio`),
    [[0, 1], [0, 2], [0, 4], [1, 3], [2, 4]] as const,
  );
  const firstPoint = points[firstIndex]!;
  const secondPoint = points[secondIndex]!;
  const firstCombined = firstPoint.seriesA + firstPoint.seriesB;
  const secondCombined = secondPoint.seriesA + secondPoint.seriesB;
  const combinedRatio = ratioDisplay(firstCombined, secondCombined);

  const [pairLeft, pairRight] = pick(
    seededRandom(`${seed}:percent-change-pair`),
    [[0, 1], [0, 2], [0, 4], [1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]] as const,
  );
  const lowerIndex = points[pairLeft]!.seriesA < points[pairRight]!.seriesA ? pairLeft : pairRight;
  const higherIndex = lowerIndex === pairLeft ? pairRight : pairLeft;
  const changeFrom = points[lowerIndex]!.seriesA;
  const changeTo = points[higherIndex]!.seriesA;
  const changeDifference = changeTo - changeFrom;
  const percentChange = formatPercent(changeDifference, changeFrom);
  const bDifference = Math.abs(points[higherIndex]!.seriesB - points[lowerIndex]!.seriesB);
  const bLower = Math.min(points[higherIndex]!.seriesB, points[lowerIndex]!.seriesB);

  const shareIndex = pick(seededRandom(`${seed}:share-category`), [0, 1, 2, 3, 4] as const);
  const sharePoint = points[shareIndex]!;
  const shareAnswer = formatPercent(sharePoint.seriesB, totalB);

  const totalDifference = totalA - totalB;
  const totalExcess = formatPercent(totalDifference, totalB);

  return [
    {
      kind: "CROSS_SERIES_DIFFERENCE",
      difficulty: "Medium",
      stem: `In ${differencePoint.category}, what was the difference between the sales of Product A and Product B?`,
      answer: String(crossDifference),
      candidates: [
        { text: String(differencePoint.seriesA + differencePoint.seriesB), misconceptionId: "ADD_INSTEAD_OF_DIFFERENCE", derivation: "Adds the two bar heights in the named year instead of subtracting them." },
        { text: String(differencePoint.seriesA), misconceptionId: "READ_PRODUCT_A_ONLY", derivation: "Reports the Product A bar height without comparing it with Product B." },
        { text: String(differencePoint.seriesB), misconceptionId: "READ_PRODUCT_B_ONLY", derivation: "Reports the Product B bar height without taking the cross-series difference." },
        { text: String(totalA), misconceptionId: "USE_PRODUCT_A_SERIES_TOTAL", derivation: "Uses Product A's five-year total instead of comparing the two bars in the named year." },
        { text: String(totalB), misconceptionId: "USE_PRODUCT_B_SERIES_TOTAL", derivation: "Uses Product B's five-year total instead of the same-year cross-series difference." },
        { text: String(Math.abs(neighbor.seriesA - neighbor.seriesB)), misconceptionId: "READ_ADJACENT_CATEGORY", derivation: `Takes the Product A–Product B difference in ${neighbor.category} instead of ${differencePoint.category}.` },
      ],
      explanation: {
        keyIdea: "Read the two bars for the same category and subtract the smaller value from the larger value.",
        steps: [
          `Product A in ${differencePoint.category} = ${differencePoint.seriesA}; Product B = ${differencePoint.seriesB}.`,
          `Difference = |${differencePoint.seriesA} - ${differencePoint.seriesB}| = ${crossDifference}.`,
        ],
        shortcut: "For a same-year bar difference, only the two bars in that category are relevant.",
        trap: "Do not add the bars, use a whole-series total or move to another year; the question asks for one category's difference.",
      },
      evidence: { categoryIndex: differenceIndex },
    },
    {
      kind: "COMBINED_CATEGORY_RATIO",
      difficulty: "Hard",
      stem: `What is the ratio of the combined sales of both products in ${firstPoint.category} to their combined sales in ${secondPoint.category}?`,
      answer: combinedRatio,
      candidates: [
        { text: ratioDisplay(secondCombined, firstCombined), misconceptionId: "REVERSE_COMBINED_RATIO", derivation: "Reverses the order of the two named years after forming their combined totals." },
        { text: ratioDisplay(firstPoint.seriesA, secondPoint.seriesA), misconceptionId: "USE_PRODUCT_A_ONLY", derivation: "Uses only Product A bars and ignores Product B in both named years." },
        { text: ratioDisplay(firstPoint.seriesB, secondPoint.seriesB), misconceptionId: "USE_PRODUCT_B_ONLY", derivation: "Uses only Product B bars and ignores Product A in both named years." },
        { text: ratioDisplay(firstPoint.seriesA + secondPoint.seriesA, firstPoint.seriesB + secondPoint.seriesB), misconceptionId: "GROUP_BY_SERIES_NOT_CATEGORY", derivation: "Groups the four bars by product instead of by the two named years." },
        { text: ratioDisplay(firstCombined, secondPoint.seriesA), misconceptionId: "OMIT_ONE_BAR_SECOND_CATEGORY", derivation: `Combines both bars in ${firstPoint.category} but omits Product B from ${secondPoint.category}.` },
        { text: ratioDisplay(firstPoint.seriesA, secondCombined), misconceptionId: "OMIT_ONE_BAR_FIRST_CATEGORY", derivation: `Omits Product B from ${firstPoint.category} while combining both bars in ${secondPoint.category}.` },
      ],
      explanation: {
        keyIdea: "Add Product A and Product B within each named category before forming the ratio.",
        steps: [
          `${firstPoint.category} combined sales = ${firstPoint.seriesA} + ${firstPoint.seriesB} = ${firstCombined}.`,
          `${secondPoint.category} combined sales = ${secondPoint.seriesA} + ${secondPoint.seriesB} = ${secondCombined}.`,
          `${firstCombined}:${secondCombined} = ${combinedRatio}.`,
        ],
        shortcut: "Aggregate within each bar-group first; simplify the ratio only after both category totals are formed.",
        trap: "Do not compare only one product or regroup by product across years; the question asks for category totals.",
      },
      evidence: { firstIndex, secondIndex },
    },
    {
      kind: "PERCENT_CHANGE_WITHIN_SERIES",
      difficulty: "Hard",
      stem: `Product A sales in ${points[higherIndex]!.category} were what percentage higher than in ${points[lowerIndex]!.category}?`,
      answer: percentChange,
      candidates: [
        { text: formatPercent(changeDifference, changeTo), misconceptionId: "USE_HIGHER_VALUE_AS_DENOMINATOR", derivation: "Divides the increase by the higher Product A value instead of the lower comparison base." },
        { text: formatPercent(changeTo, changeFrom), misconceptionId: "REPORT_HIGHER_AS_PERCENT_OF_LOWER", derivation: "Reports the higher value as a percentage of the lower value rather than only the percentage increase." },
        { text: `${changeDifference}%`, misconceptionId: "TREAT_ABSOLUTE_CHANGE_AS_PERCENT", derivation: "Attaches a percent sign to the unit increase without dividing by the lower Product A value." },
        { text: formatPercent(bDifference, bLower), misconceptionId: "USE_PRODUCT_B_CHANGE", derivation: "Calculates the relative difference from Product B bars instead of Product A." },
        { text: formatPercent(changeDifference, totalA), misconceptionId: "USE_SERIES_TOTAL_AS_DENOMINATOR", derivation: "Divides the two-year Product A difference by total Product A sales across all five years." },
        { text: formatPercent(changeDifference, changeFrom + changeTo), misconceptionId: "USE_TWO_YEAR_SUM_AS_DENOMINATOR", derivation: "Uses the sum of the two Product A bars as the denominator instead of the lower bar." },
      ],
      explanation: {
        keyIdea: "For 'what percentage higher', use the lower Product A value as the comparison base.",
        steps: [
          `Difference = ${changeTo} - ${changeFrom} = ${changeDifference}.`,
          `Percentage higher = ${changeDifference}/${changeFrom} × 100 = ${percentChange}.`,
        ],
        shortcut: "Identify the lower of the two named Product A bars first; that lower value is the denominator.",
        trap: "Do not switch to Product B or divide by the higher bar; both change the comparison being asked.",
      },
      evidence: { fromIndex: lowerIndex, toIndex: higherIndex },
    },
    {
      kind: "CATEGORY_SHARE_OF_SERIES_TOTAL",
      difficulty: "Medium",
      stem: `Product B sales in ${sharePoint.category} formed what percentage of Product B's total sales over all five years?`,
      answer: shareAnswer,
      candidates: [
        { text: formatPercent(sharePoint.seriesA, totalA), misconceptionId: "USE_PRODUCT_A_SHARE", derivation: "Finds Product A's share of its own total instead of Product B's share." },
        { text: formatPercent(sharePoint.seriesB, totalA), misconceptionId: "USE_WRONG_SERIES_TOTAL", derivation: "Uses the correct Product B bar but divides by total Product A sales." },
        { text: formatPercent(sharePoint.seriesB, totalA + totalB), misconceptionId: "USE_BOTH_SERIES_TOTAL", derivation: "Divides the Product B bar by the combined total of both products instead of Product B's total." },
        { text: formatPercent(sharePoint.seriesB, totalB - sharePoint.seriesB), misconceptionId: "EXCLUDE_TARGET_FROM_TOTAL", derivation: "Builds the denominator from the other four Product B bars and excludes the target year." },
        { text: formatPercent(totalB, sharePoint.seriesB), misconceptionId: "REVERSE_PART_WHOLE", derivation: "Reverses the part-whole fraction, dividing the five-year total by the target bar." },
        { text: formatPercent(sharePoint.seriesA + sharePoint.seriesB, totalA + totalB), misconceptionId: "USE_CATEGORY_SHARE_OF_BOTH_SERIES", derivation: "Finds the named year's share of both products combined rather than Product B's share of Product B total." },
      ],
      explanation: {
        keyIdea: "Use the Product B bar for the named year as the part and the sum of all Product B bars as the whole.",
        steps: [
          `Product B five-year total = ${points.map((point) => point.seriesB).join(" + ")} = ${totalB}.`,
          `Required percentage = ${sharePoint.seriesB}/${totalB} × 100 = ${shareAnswer}.`,
        ],
        shortcut: "Keep numerator and denominator in the same series: one Product B bar over total Product B bars.",
        trap: "The nearby Product A bars are not part of the denominator when the question asks for Product B's own total.",
      },
      evidence: { categoryIndex: shareIndex },
    },
    {
      kind: "TOTAL_SERIES_PERCENT_EXCESS",
      difficulty: "Hard",
      stem: "By what percentage did the total sales of Product A over the five years exceed the total sales of Product B?",
      answer: totalExcess,
      candidates: [
        { text: formatPercent(totalDifference, totalA), misconceptionId: "USE_LARGER_TOTAL_AS_DENOMINATOR", derivation: "Divides the excess by Product A total instead of using Product B as the comparison base." },
        { text: formatPercent(totalA, totalB), misconceptionId: "REPORT_A_AS_PERCENT_OF_B", derivation: "Reports Product A total as a percentage of Product B total rather than only the excess." },
        { text: formatPercent(totalDifference, totalA + totalB), misconceptionId: "USE_COMBINED_TOTAL_AS_DENOMINATOR", derivation: "Divides the excess by the combined total of both products." },
        { text: formatPercent(totalB, totalA), misconceptionId: "REPORT_B_AS_PERCENT_OF_A", derivation: "Forms the reverse whole-series percentage instead of Product A's excess over Product B." },
        { text: `${totalDifference}%`, misconceptionId: "TREAT_TOTAL_DIFFERENCE_AS_PERCENT", derivation: "Attaches a percent sign to the absolute five-year sales difference." },
        { text: formatPercent(totalDifference, (totalA + totalB) / 2), misconceptionId: "USE_AVERAGE_TOTAL_AS_BASE", derivation: "Uses the average of the two five-year totals as the percentage base instead of Product B total." },
      ],
      explanation: {
        keyIdea: "For 'A exceeds B by what percent', first find both five-year totals and divide the excess by B, the comparison base.",
        steps: [
          `Product A total = ${points.map((point) => point.seriesA).join(" + ")} = ${totalA}.`,
          `Product B total = ${points.map((point) => point.seriesB).join(" + ")} = ${totalB}.`,
          `Excess = ${totalA} - ${totalB} = ${totalDifference}; percentage excess = ${totalDifference}/${totalB} × 100 = ${totalExcess}.`,
        ],
        shortcut: "Sum each series separately, then use (larger − smaller) / smaller for 'exceeds by what percent'.",
        trap: "Do not divide by Product A merely because it is larger; the wording 'A exceeds B' makes B the base.",
      },
      evidence: {},
    },
  ];
}

function validateSet(set: Omit<Di003QuestionSet, "validation">) {
  const checks: Di003ValidationCheck[] = [];
  const add = (id: string, passed: boolean, message: string) => checks.push({ id, passed, message });

  add("GROUPED_BAR_KIND", set.stimulus.kind === "GROUPED_BAR", "DI-003 must expose grouped-bar stimulus semantics.");
  add("FIVE_CATEGORIES", set.stimulus.points.length === 5 && set.stimulus.categories.length === 5, "DI-003 requires five bar groups.");
  add("POSITIVE_INTEGER_BARS", set.stimulus.points.every((point) => Number.isSafeInteger(point.seriesA) && Number.isSafeInteger(point.seriesB) && point.seriesA > 0 && point.seriesB > 0), "All bar heights must be positive safe integers.");
  add("SERIES_TOTAL_ORDER", set.stimulus.points.reduce((sum, point) => sum + point.seriesA, 0) > set.stimulus.points.reduce((sum, point) => sum + point.seriesB, 0), "Product A total must exceed Product B total for the percent-excess task.");
  add("LINKED_QUESTION_COUNT", set.questions.length === 5, "DI-003 requires five linked child questions.");
  add("DISTINCT_TASK_KINDS", new Set(set.questions.map((question) => question.kind)).size === 5, "Each DI-003 child must test a distinct grouped-bar task.");
  add("SET_ID_PARITY", set.questions.every((question) => question.setId === set.setId), "Every child must retain the same grouped-bar parent set ID.");
  add("OPTION_COUNT", set.questions.every((question) => question.options.length === set.optionCount), `Every DI-003 child must expose ${set.optionCount} options.`);
  add("UNIQUE_OPTIONS", set.questions.every((question) => new Set(question.options).size === question.options.length), "Every child must have unique displayed options.");
  add("ONE_CORRECT", set.questions.every((question) => question.optionMetadata.filter((option) => option.misconceptionId === "CORRECT").length === 1 && question.options[question.correctIndex] === question.answer), "Every child must have exactly one bound correct option.");
  add("EXPLANATION_SPECIFICITY", set.questions.every((question) => question.explanation.steps.length >= 2 && question.explanation.keyIdea.length > 30 && question.explanation.trap.length > 25), "Every grouped-bar child requires a worked, question-specific explanation.");
  add("LIFECYCLE_LOCK", !set.traceability.questionStudioDiscoverable && set.traceability.questionBankStatus === "NOT_STORED" && set.traceability.testEligibility === "INELIGIBLE" && !set.traceability.publiclyPublishable, "DI-003 Phase 2 must remain review-only.");

  return { valid: checks.every((check) => check.passed), checks };
}

export function generateDi003GroupedBarSet(input: { seed?: string; examProfile?: Di003ExamProfile } = {}): Di003QuestionSet {
  const seed = input.seed ?? "DI-003:GROUPED-BAR:P2";
  const examProfile = input.examProfile ?? "SSC_CGL_TIER_I";
  const optionCount = OPTION_COUNT_BY_PROFILE[examProfile];
  const stimulus = buildStimulus(seed);
  const drafts = buildDrafts(seed, stimulus);
  const setId = `DI-003-SET-${hashSeed(`${seed}:${examProfile}`).toString(36)}`;

  const questions = drafts.map((draft, index): Di003Question => {
    const questionId = `${setId}-Q${index + 1}`;
    const optionPackage = buildOptions(`${seed}:${examProfile}:${draft.kind}`, optionCount, draft.answer, draft.candidates);
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

  const withoutValidation: Omit<Di003QuestionSet, "validation"> = {
    packageId: "DI-003",
    setId,
    seed,
    language: "en",
    examProfile,
    optionCount,
    setDifficulty: "GROUPED_BAR_MIXED",
    stimulus,
    questions,
    traceability: {
      packageId: "DI-003",
      representation: "GROUPED_BAR",
      parentFoundation: "DI-001",
      advancedTableSibling: "DI-002",
      setContractVersion: "DI-003-SET-CONTRACT-V1",
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
    throw new Error(`DI-003 set validation failed: ${failed}`);
  }

  return { ...withoutValidation, validation };
}

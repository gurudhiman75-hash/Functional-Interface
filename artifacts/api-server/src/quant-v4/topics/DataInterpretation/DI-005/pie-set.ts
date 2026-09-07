import { hashSeed, pick, ratioDisplay, seededRandom, shuffle } from "../DI-001/exact";
import type {
  Di005Difficulty,
  Di005ExamProfile,
  Di005Explanation,
  Di005Option,
  Di005Question,
  Di005QuestionSet,
  Di005Stimulus,
  Di005TaskKind,
  Di005ValidationCheck,
} from "./types";

const CATEGORIES = ["Course A", "Course B", "Course C", "Course D", "Course E"] as const;
const SHARE_SET = [10, 15, 20, 25, 30] as const;
const TOTAL_POOL = [800, 1000, 1200, 1600, 2000, 2400] as const;
const INDEXES = [0, 1, 2, 3, 4] as const;

const OPTION_COUNT_BY_PROFILE: Record<Di005ExamProfile, 4 | 5> = {
  SSC_CGL_TIER_I: 4,
  BANKING_PRELIMS: 5,
};

type Candidate = Readonly<{
  text: string;
  misconceptionId: string;
  derivation: string;
}>;

type Draft = Readonly<{
  kind: Di005TaskKind;
  difficulty: Di005Difficulty;
  stem: string;
  answer: string;
  candidates: readonly Candidate[];
  explanation: Di005Explanation;
  evidence: Readonly<Record<string, number>>;
}>;

function formatPercent(numerator: number, denominator: number): string {
  return `${formatQuotient(numerator * 100, denominator)}%`;
}

function formatQuotient(numerator: number, denominator: number): string {
  if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator) || numerator < 0 || denominator <= 0) {
    throw new Error("DI-005 received an invalid rational value.");
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

function buildStimulus(seed: string): Di005Stimulus {
  const shares = shuffle(seededRandom(`${seed}:shares`), SHARE_SET);
  const hiddenPercentIndex = pick(seededRandom(`${seed}:hidden`), INDEXES);
  const totalStudents = pick(seededRandom(`${seed}:total`), TOTAL_POOL);

  const slices = CATEGORIES.map((category, index) => {
    const percent = shares[index]!;
    const angleDegrees = (percent * 18) / 5;
    if (!Number.isSafeInteger(angleDegrees)) throw new Error("DI-005 requires integral sector angles.");
    return {
      category,
      percent,
      displayPercent: index === hiddenPercentIndex ? "?" as const : percent,
      angleDegrees,
    };
  });

  return {
    kind: "PIE",
    title: "Distribution of students across five courses",
    instruction: `The pie chart shows the distribution of ${totalStudents} students across five courses. One sector percentage is not printed.`,
    totalStudents,
    slices,
    hiddenPercentIndex,
    unit: "students",
  };
}

function buildOptions(seed: string, optionCount: 4 | 5, answer: string, candidates: readonly Candidate[]) {
  const seen = new Set<string>();
  const retained: Di005Option[] = [];
  const add = (candidate: Candidate) => {
    const key = candidate.text.trim().toLowerCase();
    if (!candidate.text.trim() || seen.has(key)) return;
    seen.add(key);
    retained.push(candidate);
  };

  add({
    text: answer,
    misconceptionId: "CORRECT",
    derivation: "Exact recomputation from the shared DI-005 pie-chart stimulus.",
  });
  candidates.forEach(add);

  if (retained.length < optionCount) {
    throw new Error(`DI-005 could construct only ${retained.length} unique options; ${optionCount} are required.`);
  }

  const shuffled = shuffle(seededRandom(`${seed}:options`), retained.slice(0, optionCount));
  const correctIndex = shuffled.findIndex((option) => option.misconceptionId === "CORRECT");
  if (correctIndex < 0) throw new Error("DI-005 lost the correct option during deterministic shuffling.");

  return {
    options: shuffled.map((option) => option.text),
    optionMetadata: shuffled,
    correctIndex,
  };
}

function buildDrafts(seed: string, stimulus: Di005Stimulus): Draft[] {
  const slices = stimulus.slices;
  const hiddenIndex = stimulus.hiddenPercentIndex;
  const hiddenSlice = slices[hiddenIndex]!;
  const visibleIndexes = INDEXES.filter((index) => index !== hiddenIndex);
  const visiblePercentSum = visibleIndexes.reduce((sum, index) => sum + slices[index]!.percent, 0);
  const visibleSlices = visibleIndexes.map((index) => slices[index]!);

  const angleIndex = pick(seededRandom(`${seed}:angle-index`), visibleIndexes);
  const angleSlice = slices[angleIndex]!;
  const countIndex = pick(seededRandom(`${seed}:count-index`), visibleIndexes);
  const countSlice = slices[countIndex]!;
  const countAnswer = (stimulus.totalStudents * countSlice.percent) / 100;
  if (!Number.isSafeInteger(countAnswer)) throw new Error("DI-005 requires integral sector counts.");

  const ratioOrder = shuffle(seededRandom(`${seed}:ratio-pair`), visibleIndexes).slice(0, 2);
  const ratioFirstIndex = ratioOrder[0]!;
  const ratioSecondIndex = ratioOrder[1]!;
  const ratioFirst = slices[ratioFirstIndex]!;
  const ratioSecond = slices[ratioSecondIndex]!;
  const ratioAnswer = ratioDisplay(ratioFirst.percent, ratioSecond.percent);

  const excessOrder = shuffle(seededRandom(`${seed}:excess-pair`), visibleIndexes).slice(0, 2);
  const excessFirst = slices[excessOrder[0]!]!;
  const excessSecond = slices[excessOrder[1]!]!;
  const larger = excessFirst.percent > excessSecond.percent ? excessFirst : excessSecond;
  const smaller = larger === excessFirst ? excessSecond : excessFirst;
  const excessDifference = larger.percent - smaller.percent;
  const excessAnswer = formatPercent(excessDifference, smaller.percent);

  return [
    {
      kind: "MISSING_SECTOR_PERCENT",
      difficulty: "Medium",
      stem: `The percentage for ${hiddenSlice.category} is missing from the pie chart. What percentage of the students are in ${hiddenSlice.category}?`,
      answer: `${hiddenSlice.percent}%`,
      candidates: visibleSlices.map((slice, index) => ({
        text: `${slice.percent}%`,
        misconceptionId: `COPY_VISIBLE_SECTOR_${index + 1}`,
        derivation: `Copies the printed ${slice.percent}% share of ${slice.category} instead of completing the pie total to 100%.`,
      })),
      explanation: {
        keyIdea: "All sectors of a pie chart together represent 100%, so the missing share is the remainder after adding the four printed shares.",
        steps: [
          `Printed shares total = ${visibleSlices.map((slice) => `${slice.percent}%`).join(" + ")} = ${visiblePercentSum}%.`,
          `Missing share = 100% - ${visiblePercentSum}% = ${hiddenSlice.percent}%.`,
        ],
        shortcut: "For one missing pie percentage, add the visible labels and subtract the result from 100.",
        trap: "Do not copy a nearby sector label; the missing slice is determined by the whole pie, not by visual similarity.",
      },
      evidence: { hiddenIndex },
    },
    {
      kind: "SECTOR_ANGLE_DEGREES",
      difficulty: "Medium",
      stem: `What angle at the centre of the pie chart represents ${angleSlice.category}?`,
      answer: `${angleSlice.angleDegrees}°`,
      candidates: [
        { text: `${angleSlice.percent}°`, misconceptionId: "COPY_PERCENT_AS_DEGREES", derivation: "Uses the printed percentage as though it were already an angle in degrees." },
        { text: `${360 - angleSlice.angleDegrees}°`, misconceptionId: "USE_COMPLEMENT_ANGLE", derivation: "Reports the angle occupied by the rest of the pie instead of the named sector." },
        { text: `${angleSlice.angleDegrees / 2}°`, misconceptionId: "USE_180_DEGREE_WHOLE", derivation: "Treats a semicircle of 180° as the whole instead of a full 360° pie." },
        { text: `${angleSlice.angleDegrees * 2}°`, misconceptionId: "DOUBLE_SECTOR_ANGLE", derivation: "Doubles the correctly converted sector angle after applying the percentage share." },
      ],
      explanation: {
        keyIdea: "A full pie is 360°, so a sector with p% of the whole has angle p/100 × 360°.",
        steps: [
          `${angleSlice.category} represents ${angleSlice.percent}% of the pie.`,
          `Sector angle = ${angleSlice.percent}/100 × 360° = ${angleSlice.angleDegrees}°.`
        ],
        shortcut: "Multiply a pie percentage by 3.6 to convert it directly to degrees.",
        trap: "Percentage and degrees use different wholes: 100% corresponds to 360°, not 100°.",
      },
      evidence: { categoryIndex: angleIndex },
    },
    {
      kind: "SECTOR_COUNT_FROM_TOTAL",
      difficulty: "Medium",
      stem: `How many of the ${stimulus.totalStudents} students are in ${countSlice.category}?`,
      answer: String(countAnswer),
      candidates: [
        { text: String(stimulus.totalStudents - countAnswer), misconceptionId: "USE_COMPLEMENT_COUNT", derivation: "Finds the number of students outside the named course instead of inside it." },
        { text: formatQuotient(stimulus.totalStudents * countSlice.percent, 360), misconceptionId: "TREAT_PERCENT_AS_ANGLE", derivation: "Divides by 360 as though the printed percentage were a degree measure." },
        { text: String((stimulus.totalStudents * (countSlice.percent + 5)) / 100), misconceptionId: "READ_FIVE_POINTS_TOO_HIGH", derivation: "Uses a sector share five percentage points higher than the printed value." },
        { text: String((stimulus.totalStudents * (countSlice.percent - 5)) / 100), misconceptionId: "READ_FIVE_POINTS_TOO_LOW", derivation: "Uses a sector share five percentage points lower than the printed value." },
        { text: String(countSlice.percent), misconceptionId: "COPY_PERCENT_AS_COUNT", derivation: "Copies the sector percentage as a student count without applying it to the chart total." },
      ],
      explanation: {
        keyIdea: "Convert the named sector's percentage share into a count by multiplying that percentage by the total number of students.",
        steps: [
          `${countSlice.category} share = ${countSlice.percent}% of ${stimulus.totalStudents}.`,
          `Students = ${stimulus.totalStudents} × ${countSlice.percent}/100 = ${countAnswer}.`,
        ],
        shortcut: `Find 1% of ${stimulus.totalStudents} first, then multiply by ${countSlice.percent}; here the result is ${countAnswer}.`,
        trap: "Do not divide by 360 unless the chart gives an angle. This sector is labelled as a percentage.",
      },
      evidence: { categoryIndex: countIndex },
    },
    {
      kind: "RATIO_OF_TWO_SECTORS",
      difficulty: "Hard",
      stem: `What is the ratio of the number of students in ${ratioFirst.category} to the number in ${ratioSecond.category}?`,
      answer: ratioAnswer,
      candidates: [
        { text: ratioDisplay(ratioSecond.percent, ratioFirst.percent), misconceptionId: "REVERSE_SECTOR_RATIO", derivation: "Reverses the two named courses while forming their ratio." },
        { text: ratioDisplay(ratioFirst.percent, 100), misconceptionId: "FIRST_SECTOR_TO_WHOLE", derivation: "Compares the first course with the whole pie instead of with the second course." },
        { text: ratioDisplay(ratioSecond.percent, 100), misconceptionId: "SECOND_SECTOR_TO_WHOLE", derivation: "Compares the second course with the whole pie instead of the first named course." },
        { text: ratioDisplay(100 - ratioFirst.percent, ratioSecond.percent), misconceptionId: "USE_FIRST_COMPLEMENT", derivation: "Uses everybody outside the first course as the first term of the ratio." },
        { text: ratioDisplay(ratioFirst.percent, 100 - ratioSecond.percent), misconceptionId: "USE_SECOND_COMPLEMENT", derivation: "Uses everybody outside the second course as the second term of the ratio." },
      ],
      explanation: {
        keyIdea: "Because both course counts are the same total multiplied by their shares, the common total cancels and the count ratio equals the percentage ratio.",
        steps: [
          `${ratioFirst.category}:${ratioSecond.category} = ${ratioFirst.percent}%:${ratioSecond.percent}%.`,
          `${ratioFirst.percent}:${ratioSecond.percent} = ${ratioAnswer}.`,
        ],
        shortcut: "For two sectors from the same pie total, compare their percentages directly; there is no need to calculate both counts first.",
        trap: "Keep the order exactly as stated. Reversing the course order reverses the ratio.",
      },
      evidence: { firstIndex: ratioFirstIndex, secondIndex: ratioSecondIndex },
    },
    {
      kind: "RELATIVE_SECTOR_PERCENT_EXCESS",
      difficulty: "Hard",
      stem: `${larger.category} has what percentage more students than ${smaller.category}?`,
      answer: excessAnswer,
      candidates: [
        { text: `${excessDifference}%`, misconceptionId: "USE_PERCENTAGE_POINT_GAP", derivation: "Reports the difference between the two pie shares in percentage points instead of the relative excess over the smaller course." },
        { text: formatPercent(excessDifference, larger.percent), misconceptionId: "USE_LARGER_SHARE_AS_BASE", derivation: "Divides the share difference by the larger course instead of using the smaller comparison base." },
        { text: formatPercent(larger.percent, smaller.percent), misconceptionId: "REPORT_LARGER_AS_PERCENT_OF_SMALLER", derivation: "Reports the larger course as a percentage of the smaller rather than only how much more it has." },
        { text: formatPercent(smaller.percent, larger.percent), misconceptionId: "REPORT_SMALLER_AS_PERCENT_OF_LARGER", derivation: "Forms the reverse relative percentage instead of the excess of the larger course." },
        { text: formatPercent(excessDifference, larger.percent + smaller.percent), misconceptionId: "USE_PAIR_TOTAL_AS_BASE", derivation: "Uses the combined share of the two courses as the percentage base." },
      ],
      explanation: {
        keyIdea: "For 'A has what percent more than B', use the difference in their shares and divide by B, the smaller comparison base.",
        steps: [
          `Share difference = ${larger.percent}% - ${smaller.percent}% = ${excessDifference} percentage points.`,
          `Relative excess = ${excessDifference}/${smaller.percent} × 100 = ${excessAnswer}.`,
        ],
        shortcut: "The total student count cancels: work directly with the two sector percentages for a relative comparison.",
        trap: "A percentage-point gap and a percentage-more comparison are not the same; the latter must be divided by the smaller share.",
      },
      evidence: { largerIndex: slices.indexOf(larger), smallerIndex: slices.indexOf(smaller) },
    },
  ];
}

function validateSet(set: Omit<Di005QuestionSet, "validation">) {
  const checks: Di005ValidationCheck[] = [];
  const add = (id: string, passed: boolean, message: string) => checks.push({ id, passed, message });

  add("PIE_KIND", set.stimulus.kind === "PIE", "DI-005 must expose pie-chart stimulus semantics.");
  add("FIVE_SLICES", set.stimulus.slices.length === 5, "DI-005 requires exactly five pie sectors.");
  add("SHARES_TOTAL_100", set.stimulus.slices.reduce((sum, slice) => sum + slice.percent, 0) === 100, "All pie sector percentages must total 100%.");
  add("UNIQUE_SHARES", new Set(set.stimulus.slices.map((slice) => slice.percent)).size === 5, "DI-005 uses unique sector shares to keep comparison tasks unambiguous.");
  add("ANGLES_TOTAL_360", set.stimulus.slices.reduce((sum, slice) => sum + slice.angleDegrees, 0) === 360, "All pie sector angles must total 360°.");
  add("ONE_HIDDEN_PERCENT", set.stimulus.slices.filter((slice) => slice.displayPercent === "?").length === 1, "Exactly one sector percentage must be hidden.");
  add("HIDDEN_INDEX_PARITY", set.stimulus.slices[set.stimulus.hiddenPercentIndex]?.displayPercent === "?", "The hidden index must identify the missing percentage label.");
  add("LINKED_QUESTION_COUNT", set.questions.length === 5, "DI-005 requires five linked child questions.");
  add("DISTINCT_TASK_KINDS", new Set(set.questions.map((question) => question.kind)).size === 5, "Each DI-005 child must test a distinct pie-chart task.");
  add("SET_ID_PARITY", set.questions.every((question) => question.setId === set.setId), "Every child must retain the same pie-chart parent set ID.");
  add("OPTION_COUNT", set.questions.every((question) => question.options.length === set.optionCount), `Every DI-005 child must expose ${set.optionCount} options.`);
  add("UNIQUE_OPTIONS", set.questions.every((question) => new Set(question.options).size === question.options.length), "Every pie-chart child must have unique displayed options.");
  add("ONE_CORRECT", set.questions.every((question) => question.optionMetadata.filter((option) => option.misconceptionId === "CORRECT").length === 1 && question.options[question.correctIndex] === question.answer), "Every child must have exactly one bound correct option.");
  add("EXPLANATION_SPECIFICITY", set.questions.every((question) => question.explanation.steps.length >= 2 && question.explanation.keyIdea.length > 35 && question.explanation.trap.length > 30), "Every DI-005 child requires a worked, question-specific explanation.");
  add("LIFECYCLE_LOCK", !set.traceability.questionStudioDiscoverable && set.traceability.questionBankStatus === "NOT_STORED" && set.traceability.testEligibility === "INELIGIBLE" && !set.traceability.publiclyPublishable, "DI-005 Phase 4 must remain review-only.");

  return { valid: checks.every((check) => check.passed), checks };
}

export function generateDi005PieSet(input: { seed?: string; examProfile?: Di005ExamProfile } = {}): Di005QuestionSet {
  const seed = input.seed ?? "DI-005:PIE:P4";
  const examProfile = input.examProfile ?? "SSC_CGL_TIER_I";
  const optionCount = OPTION_COUNT_BY_PROFILE[examProfile];
  const stimulus = buildStimulus(seed);
  const drafts = buildDrafts(seed, stimulus);
  const setId = `DI-005-SET-${hashSeed(`${seed}:${examProfile}`).toString(36)}`;

  const questions = drafts.map((draft, index): Di005Question => {
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

  const withoutValidation: Omit<Di005QuestionSet, "validation"> = {
    packageId: "DI-005",
    setId,
    seed,
    language: "en",
    examProfile,
    optionCount,
    setDifficulty: "PIE_PART_WHOLE_MIXED",
    stimulus,
    questions,
    traceability: {
      packageId: "DI-005",
      representation: "PIE",
      parentFoundation: "DI-001",
      advancedTableSibling: "DI-002",
      groupedBarSibling: "DI-003",
      lineSibling: "DI-004",
      setContractVersion: "DI-005-SET-CONTRACT-V1",
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
    throw new Error(`DI-005 set validation failed: ${failed}`);
  }

  return { ...withoutValidation, validation };
}

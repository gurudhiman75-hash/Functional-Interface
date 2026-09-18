import { hashSeed, pick, ratioDisplay, seededRandom, shuffle } from "../DI-001/exact";
import type {
  Di005V2Difficulty,
  Di005V2ExamProfile,
  Di005V2Explanation,
  Di005V2Option,
  Di005V2Question,
  Di005V2QuestionSet,
  Di005V2Stimulus,
  Di005V2TaskKind,
  Di005V2ValidationCheck,
} from "./pie-v2-types";

export const DI005_V2_TASK_KINDS: readonly Di005V2TaskKind[] = [
  "DIRECT_SECTOR_PERCENT",
  "LARGEST_SECTOR_IDENTIFICATION",
  "SMALLEST_SECTOR_IDENTIFICATION",
  "MISSING_SECTOR_PERCENT",
  "SECTOR_ANGLE_DEGREES",
  "SECTOR_COUNT_FROM_TOTAL",
  "COMBINED_SECTOR_PERCENT",
  "DIFFERENCE_IN_COUNTS",
  "RATIO_OF_TWO_SECTORS",
  "RELATIVE_SECTOR_PERCENT_EXCESS",
  "COMBINED_SECTOR_ANGLE",
  "REMAINDER_AFTER_TWO_SECTORS_COUNT",
] as const;

export const DI005_V2_DIFFICULTY: Readonly<Record<Di005V2TaskKind, Di005V2Difficulty>> = {
  DIRECT_SECTOR_PERCENT: "Easy",
  LARGEST_SECTOR_IDENTIFICATION: "Easy",
  SMALLEST_SECTOR_IDENTIFICATION: "Easy",
  MISSING_SECTOR_PERCENT: "Medium",
  SECTOR_ANGLE_DEGREES: "Medium",
  SECTOR_COUNT_FROM_TOTAL: "Medium",
  COMBINED_SECTOR_PERCENT: "Medium",
  DIFFERENCE_IN_COUNTS: "Medium",
  RATIO_OF_TWO_SECTORS: "Hard",
  RELATIVE_SECTOR_PERCENT_EXCESS: "Hard",
  COMBINED_SECTOR_ANGLE: "Hard",
  REMAINDER_AFTER_TWO_SECTORS_COUNT: "Hard",
};

const EASY_KINDS = DI005_V2_TASK_KINDS.filter((kind) => DI005_V2_DIFFICULTY[kind] === "Easy");
const MEDIUM_KINDS = DI005_V2_TASK_KINDS.filter((kind) => DI005_V2_DIFFICULTY[kind] === "Medium");
const HARD_KINDS = DI005_V2_TASK_KINDS.filter((kind) => DI005_V2_DIFFICULTY[kind] === "Hard");

const OPTION_COUNT: Readonly<Record<Di005V2ExamProfile, 4 | 5>> = {
  SSC_CGL_TIER_I: 4,
  BANKING_PRELIMS: 5,
};

const SHARE_SETS = [
  [10, 15, 20, 25, 30],
  [5, 15, 20, 25, 35],
  [5, 10, 20, 30, 35],
  [5, 10, 15, 30, 40],
  [5, 10, 20, 25, 40],
] as const;

const CONTEXTS = [
  {
    id: "COURSE_ENROLMENT",
    title: "Distribution of students among five courses",
    categories: ["Course A", "Course B", "Course C", "Course D", "Course E"],
    totalLabel: "Total students",
    unit: "students",
    totals: [800, 1000, 1200, 1600, 2000, 2400],
  },
  {
    id: "BOOK_CATEGORIES",
    title: "Distribution of books issued by category",
    categories: ["Fiction", "Science", "History", "Commerce", "General"],
    totalLabel: "Total books issued",
    unit: "books",
    totals: [800, 1000, 1200, 1600, 2000, 2400],
  },
  {
    id: "DEPARTMENT_STAFF",
    title: "Distribution of employees among departments",
    categories: ["Sales", "Accounts", "Operations", "Support", "Administration"],
    totalLabel: "Total employees",
    unit: "employees",
    totals: [400, 600, 800, 1000, 1200, 1600],
  },
  {
    id: "PRODUCT_OUTPUT",
    title: "Distribution of total production among five products",
    categories: ["Product P", "Product Q", "Product R", "Product S", "Product T"],
    totalLabel: "Total production",
    unit: "units",
    totals: [1000, 1200, 1600, 2000, 2400, 3000],
  },
  {
    id: "SPORTS_PARTICIPATION",
    title: "Distribution of participants among five sports",
    categories: ["Cricket", "Football", "Badminton", "Athletics", "Volleyball"],
    totalLabel: "Total participants",
    unit: "participants",
    totals: [400, 600, 800, 1000, 1200, 1600],
  },
  {
    id: "ORDER_CATEGORIES",
    title: "Distribution of orders among five categories",
    categories: ["Category A", "Category B", "Category C", "Category D", "Category E"],
    totalLabel: "Total orders",
    unit: "orders",
    totals: [800, 1000, 1200, 1600, 2000, 2400],
  },
] as const;

const BLOCKED_LANGUAGE = ["associated", "shortcut", "common trap", "trap"] as const;

type Candidate = Readonly<{
  text: string;
  misconceptionId: string;
  derivation: string;
}>;

type Draft = Readonly<{
  kind: Di005V2TaskKind;
  difficulty: Di005V2Difficulty;
  stemSurfaceId: string;
  stem: string;
  answer: string;
  candidates: readonly Candidate[];
  explanation: Di005V2Explanation;
  evidence: Readonly<Record<string, string | number>>;
  numericStep?: number;
}>;

function formatQuotient(numerator: number, denominator: number): string {
  if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator) || numerator < 0 || denominator <= 0) {
    throw new Error("DI-005 V2 received an invalid rational value.");
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

function surface(seed: string, values: readonly string[]) {
  const index = hashSeed(seed) % values.length;
  return { id: `S${index + 1}`, text: values[index]! };
}

function pair(seed: string, indexes: readonly number[]): [number, number] {
  return shuffle(seededRandom(seed), [...indexes]).slice(0, 2) as [number, number];
}

function normalize(value: string) {
  return value.trim().replace(/\s+/gu, " ").toLowerCase();
}

function fallbackCandidates(answer: string, numericStep: number): Candidate[] {
  const ratio = answer.match(/^(\d+)\s*:\s*(\d+)$/u);
  if (ratio) {
    const left = Number(ratio[1]);
    const right = Number(ratio[2]);
    return [
      { text: `${right}:${left}`, misconceptionId: "FALLBACK_REVERSED_RATIO", derivation: "Reverses the requested ratio order." },
      { text: ratioDisplay(left, left + right), misconceptionId: "FALLBACK_PART_TO_TOTAL", derivation: "Compares the first part with the combined total." },
      { text: ratioDisplay(left + right, right), misconceptionId: "FALLBACK_TOTAL_TO_PART", derivation: "Compares the combined total with the second part." },
      { text: `${left + 1}:${right}`, misconceptionId: "FALLBACK_NEARBY_RATIO_LEFT", derivation: "Uses a nearby first ratio term after a reading slip." },
      { text: `${left}:${right + 1}`, misconceptionId: "FALLBACK_NEARBY_RATIO_RIGHT", derivation: "Uses a nearby second ratio term after a reading slip." },
    ];
  }

  const angle = answer.match(/^(\d+(?:\.\d+)?)°$/u);
  if (angle) {
    const value = Number(angle[1]);
    return [-36, -18, 18, 36, 54]
      .map((delta, index) => ({
        text: `${value + delta}°`,
        misconceptionId: `FALLBACK_ANGLE_${index}`,
        derivation: "Uses a nearby sector angle after a conversion or reading error.",
      }))
      .filter((candidate) => !candidate.text.startsWith("-") && candidate.text !== "0°");
  }

  const percent = answer.match(/^(\d+(?:\.\d+)?)%$/u);
  if (percent) {
    const value = Number(percent[1]);
    return [-10, -5, 5, 10, 15]
      .map((delta, index) => ({
        text: `${value + delta}%`,
        misconceptionId: `FALLBACK_PERCENT_${index}`,
        derivation: "Uses a nearby percentage after a pie-reading or arithmetic error.",
      }))
      .filter((candidate) => !candidate.text.startsWith("-") && candidate.text !== "0%");
  }

  if (/^\d+(?:\.\d+)?$/u.test(answer)) {
    const value = Number(answer);
    return [-2, -1, 1, 2, 3]
      .map((multiple, index) => ({
        text: String(value + multiple * numericStep),
        misconceptionId: `FALLBACK_VALUE_${index}`,
        derivation: "Uses a nearby count after a small chart-reading or arithmetic error.",
      }))
      .filter((candidate) => Number(candidate.text) >= 0);
  }

  return [];
}

function buildOptions(input: {
  seed: string;
  optionCount: 4 | 5;
  answer: string;
  candidates: readonly Candidate[];
  numericStep: number;
}) {
  const seen = new Set<string>();
  const retained: Di005V2Option[] = [];
  const add = (candidate: Candidate) => {
    const key = normalize(candidate.text);
    if (!candidate.text.trim() || seen.has(key)) return;
    seen.add(key);
    retained.push(candidate);
  };

  add({ text: input.answer, misconceptionId: "CORRECT", derivation: "Exact recomputation from the shared pie-chart stimulus." });
  input.candidates.forEach(add);
  fallbackCandidates(input.answer, input.numericStep).forEach(add);
  if (retained.length < input.optionCount) {
    throw new Error(`DI-005 V2 ${input.seed} has only ${retained.length} unique options for ${input.answer}.`);
  }

  const shuffled = shuffle(seededRandom(`${input.seed}:options`), retained.slice(0, input.optionCount));
  const correctIndex = shuffled.findIndex((option) => option.misconceptionId === "CORRECT");
  if (correctIndex < 0) throw new Error("DI-005 V2 lost the correct option during shuffling.");
  return { options: shuffled.map((option) => option.text), optionMetadata: shuffled, correctIndex };
}

function buildStimulus(seed: string): Di005V2Stimulus {
  const context = pick(seededRandom(`${seed}:context`), CONTEXTS);
  const shares = shuffle(seededRandom(`${seed}:shares-order`), pick(seededRandom(`${seed}:shares-set`), SHARE_SETS));
  const hiddenPercentIndex = hashSeed(`${seed}:hidden`) % 5;
  const totalValue = pick(seededRandom(`${seed}:total`), context.totals);
  const slices = context.categories.map((category, index) => {
    const percent = shares[index]!;
    const angleDegrees = percent * 3.6;
    if (!Number.isSafeInteger(angleDegrees)) throw new Error("DI-005 V2 requires integral sector angles.");
    const count = (totalValue * percent) / 100;
    if (!Number.isSafeInteger(count)) throw new Error("DI-005 V2 requires integral sector counts.");
    return {
      category,
      percent,
      displayPercent: index === hiddenPercentIndex ? "?" as const : percent,
      angleDegrees,
    };
  });

  return {
    kind: "PIE",
    contextId: context.id,
    title: context.title,
    instruction: `Study the pie chart and answer the questions that follow. One sector percentage is not printed.`,
    totalValue,
    totalLabel: context.totalLabel,
    unit: context.unit,
    slices,
    hiddenPercentIndex,
  };
}

function categoryCandidates(stimulus: Di005V2Stimulus, answer: string): Candidate[] {
  return stimulus.slices
    .filter((slice) => slice.category !== answer)
    .map((slice, index) => ({
      text: slice.category,
      misconceptionId: `OTHER_CATEGORY_${index + 1}`,
      derivation: "Chooses another sector after comparing the pie incorrectly.",
    }));
}

function buildDrafts(seed: string, stimulus: Di005V2Stimulus): Readonly<Record<Di005V2TaskKind, Draft>> {
  const slices = stimulus.slices;
  const allIndexes = [0, 1, 2, 3, 4] as const;
  const visibleIndexes = allIndexes.filter((index) => index !== stimulus.hiddenPercentIndex);
  const visibleSlices = visibleIndexes.map((index) => slices[index]!);
  const countFor = (index: number) => (stimulus.totalValue * slices[index]!.percent) / 100;
  const numericStep = stimulus.totalValue / 20;

  const directIndex = pick(seededRandom(`${seed}:direct`), visibleIndexes);
  const direct = slices[directIndex]!;
  const directSurface = surface(`${seed}:DIRECT_SECTOR_PERCENT`, [
    `What percentage of the total is represented by ${direct.category}?`,
    `According to the pie chart, ${direct.category} accounts for what percentage of the total?`,
    `Read the sector for ${direct.category}. What percentage does it show?`,
  ]);

  const largestIndex = slices.reduce((best, slice, index) => slice.percent > slices[best]!.percent ? index : best, 0);
  const largest = slices[largestIndex]!;
  const largestSurface = surface(`${seed}:LARGEST_SECTOR_IDENTIFICATION`, [
    `Which category has the largest share in the pie chart?`,
    `The biggest sector in the chart represents which category?`,
    `Which category accounts for the highest percentage of the total?`,
  ]);

  const smallestIndex = slices.reduce((best, slice, index) => slice.percent < slices[best]!.percent ? index : best, 0);
  const smallest = slices[smallestIndex]!;
  const smallestSurface = surface(`${seed}:SMALLEST_SECTOR_IDENTIFICATION`, [
    `Which category has the smallest share in the pie chart?`,
    `The smallest sector in the chart represents which category?`,
    `Which category accounts for the lowest percentage of the total?`,
  ]);

  const hiddenIndex = stimulus.hiddenPercentIndex;
  const hidden = slices[hiddenIndex]!;
  const visibleTotal = visibleSlices.reduce((sum, slice) => sum + slice.percent, 0);
  const missingSurface = surface(`${seed}:MISSING_SECTOR_PERCENT`, [
    `The percentage for ${hidden.category} is missing. What should it be?`,
    `What percentage is represented by the unlabelled ${hidden.category} sector?`,
    `Find the missing percentage for ${hidden.category}.`,
  ]);

  const angleIndex = pick(seededRandom(`${seed}:angle`), visibleIndexes);
  const angleSlice = slices[angleIndex]!;
  const angleSurface = surface(`${seed}:SECTOR_ANGLE_DEGREES`, [
    `What angle at the centre represents ${angleSlice.category}?`,
    `Find the central angle of the ${angleSlice.category} sector.`,
    `The sector for ${angleSlice.category} subtends what angle at the centre?`,
  ]);

  const countIndex = pick(seededRandom(`${seed}:count`), visibleIndexes);
  const countSlice = slices[countIndex]!;
  const countAnswer = countFor(countIndex);
  const countSurface = surface(`${seed}:SECTOR_COUNT_FROM_TOTAL`, [
    `How many ${stimulus.unit} are represented by ${countSlice.category}?`,
    `Find the number of ${stimulus.unit} in ${countSlice.category}.`,
    `What is the count for ${countSlice.category} in the pie chart?`,
  ]);

  const [combinedFirstIndex, combinedSecondIndex] = pair(`${seed}:combined-percent`, visibleIndexes);
  const combinedFirst = slices[combinedFirstIndex]!;
  const combinedSecond = slices[combinedSecondIndex]!;
  const combinedPercent = combinedFirst.percent + combinedSecond.percent;
  const combinedSurface = surface(`${seed}:COMBINED_SECTOR_PERCENT`, [
    `Together, what percentage of the total do ${combinedFirst.category} and ${combinedSecond.category} represent?`,
    `Find the combined percentage share of ${combinedFirst.category} and ${combinedSecond.category}.`,
    `What part of the whole, in percent, is covered by ${combinedFirst.category} and ${combinedSecond.category} together?`,
  ]);

  const [differenceFirstIndex, differenceSecondIndex] = pair(`${seed}:difference-count`, visibleIndexes);
  const differenceFirst = slices[differenceFirstIndex]!;
  const differenceSecond = slices[differenceSecondIndex]!;
  const differenceFirstCount = countFor(differenceFirstIndex);
  const differenceSecondCount = countFor(differenceSecondIndex);
  const differenceCount = Math.abs(differenceFirstCount - differenceSecondCount);
  const differenceSurface = surface(`${seed}:DIFFERENCE_IN_COUNTS`, [
    `What is the difference between the numbers represented by ${differenceFirst.category} and ${differenceSecond.category}?`,
    `How many more ${stimulus.unit} does the larger of ${differenceFirst.category} and ${differenceSecond.category} represent?`,
    `Find the absolute difference between the counts for ${differenceFirst.category} and ${differenceSecond.category}.`,
  ]);

  const [ratioFirstIndex, ratioSecondIndex] = pair(`${seed}:ratio`, visibleIndexes);
  const ratioFirst = slices[ratioFirstIndex]!;
  const ratioSecond = slices[ratioSecondIndex]!;
  const ratioAnswer = ratioDisplay(ratioFirst.percent, ratioSecond.percent);
  const ratioSurface = surface(`${seed}:RATIO_OF_TWO_SECTORS`, [
    `What is the ratio of ${ratioFirst.category} to ${ratioSecond.category}?`,
    `Find the ratio of the counts represented by ${ratioFirst.category} and ${ratioSecond.category}.`,
    `The numbers in ${ratioFirst.category} and ${ratioSecond.category} are in what ratio?`,
  ]);

  const [excessAIndex, excessBIndex] = pair(`${seed}:excess`, visibleIndexes);
  const excessA = slices[excessAIndex]!;
  const excessB = slices[excessBIndex]!;
  const largerIndexForExcess = excessA.percent > excessB.percent ? excessAIndex : excessBIndex;
  const smallerIndexForExcess = largerIndexForExcess === excessAIndex ? excessBIndex : excessAIndex;
  const larger = slices[largerIndexForExcess]!;
  const smaller = slices[smallerIndexForExcess]!;
  const excessDifference = larger.percent - smaller.percent;
  const excessAnswer = formatPercent(excessDifference, smaller.percent);
  const excessSurface = surface(`${seed}:RELATIVE_SECTOR_PERCENT_EXCESS`, [
    `${larger.category} represents what percent more than ${smaller.category}?`,
    `By what percentage is the count for ${larger.category} greater than that for ${smaller.category}?`,
    `The ${larger.category} sector exceeds the ${smaller.category} sector by what percentage of ${smaller.category}?`,
  ]);

  const [angleFirstIndex, angleSecondIndex] = pair(`${seed}:combined-angle`, visibleIndexes);
  const angleFirst = slices[angleFirstIndex]!;
  const angleSecond = slices[angleSecondIndex]!;
  const combinedAngle = angleFirst.angleDegrees + angleSecond.angleDegrees;
  const combinedAngleSurface = surface(`${seed}:COMBINED_SECTOR_ANGLE`, [
    `What is the combined central angle of ${angleFirst.category} and ${angleSecond.category}?`,
    `Together, the sectors for ${angleFirst.category} and ${angleSecond.category} subtend what angle at the centre?`,
    `Find the total angle covered by ${angleFirst.category} and ${angleSecond.category}.`,
  ]);

  const [remainderFirstIndex, remainderSecondIndex] = pair(`${seed}:remainder`, visibleIndexes);
  const remainderFirst = slices[remainderFirstIndex]!;
  const remainderSecond = slices[remainderSecondIndex]!;
  const remainderPercent = 100 - remainderFirst.percent - remainderSecond.percent;
  const remainderCount = (stimulus.totalValue * remainderPercent) / 100;
  const remainderSurface = surface(`${seed}:REMAINDER_AFTER_TWO_SECTORS_COUNT`, [
    `How many ${stimulus.unit} belong to all categories other than ${remainderFirst.category} and ${remainderSecond.category}?`,
    `After excluding ${remainderFirst.category} and ${remainderSecond.category}, how many ${stimulus.unit} remain?`,
    `Find the combined count of the remaining three categories after removing ${remainderFirst.category} and ${remainderSecond.category}.`,
  ]);

  return {
    DIRECT_SECTOR_PERCENT: {
      kind: "DIRECT_SECTOR_PERCENT",
      difficulty: "Easy",
      stemSurfaceId: directSurface.id,
      stem: directSurface.text,
      answer: `${direct.percent}%`,
      candidates: visibleSlices.filter((slice) => slice.category !== direct.category).map((slice, index) => ({
        text: `${slice.percent}%`, misconceptionId: `READ_OTHER_SECTOR_${index + 1}`, derivation: `Reads the ${slice.category} sector instead of ${direct.category}.`,
      })),
      explanation: {
        keyIdea: "Read the percentage printed for the named sector.",
        steps: [`The ${direct.category} sector is marked ${direct.percent}%.`, `So ${direct.category} represents ${direct.percent}% of the total.`],
      },
      evidence: { categoryIndex: directIndex },
      numericStep: 5,
    },
    LARGEST_SECTOR_IDENTIFICATION: {
      kind: "LARGEST_SECTOR_IDENTIFICATION",
      difficulty: "Easy",
      stemSurfaceId: largestSurface.id,
      stem: largestSurface.text,
      answer: largest.category,
      candidates: categoryCandidates(stimulus, largest.category),
      explanation: {
        keyIdea: "Compare the sizes of the five sectors.",
        steps: [`${largest.category} has the greatest share at ${largest.percent}%.`, `Therefore it forms the largest sector.`],
      },
      evidence: { categoryIndex: largestIndex },
      numericStep: 1,
    },
    SMALLEST_SECTOR_IDENTIFICATION: {
      kind: "SMALLEST_SECTOR_IDENTIFICATION",
      difficulty: "Easy",
      stemSurfaceId: smallestSurface.id,
      stem: smallestSurface.text,
      answer: smallest.category,
      candidates: categoryCandidates(stimulus, smallest.category),
      explanation: {
        keyIdea: "Compare the sizes of the five sectors.",
        steps: [`${smallest.category} has the smallest share at ${smallest.percent}%.`, `Therefore it forms the smallest sector.`],
      },
      evidence: { categoryIndex: smallestIndex },
      numericStep: 1,
    },
    MISSING_SECTOR_PERCENT: {
      kind: "MISSING_SECTOR_PERCENT",
      difficulty: "Medium",
      stemSurfaceId: missingSurface.id,
      stem: missingSurface.text,
      answer: `${hidden.percent}%`,
      candidates: visibleSlices.map((slice, index) => ({
        text: `${slice.percent}%`, misconceptionId: `COPY_VISIBLE_SECTOR_${index + 1}`, derivation: `Copies the printed ${slice.percent}% share of ${slice.category} instead of completing the pie to 100%.`,
      })),
      explanation: {
        keyIdea: "All sectors of a pie chart together make 100%.",
        steps: [`The four printed shares add to ${visibleTotal}%.`, `Missing share = 100% - ${visibleTotal}% = ${hidden.percent}%.`],
      },
      evidence: { categoryIndex: hiddenIndex },
      numericStep: 5,
    },
    SECTOR_ANGLE_DEGREES: {
      kind: "SECTOR_ANGLE_DEGREES",
      difficulty: "Medium",
      stemSurfaceId: angleSurface.id,
      stem: angleSurface.text,
      answer: `${angleSlice.angleDegrees}°`,
      candidates: [
        { text: `${angleSlice.percent}°`, misconceptionId: "COPY_PERCENT_AS_DEGREES", derivation: "Uses the percentage value directly as degrees." },
        { text: `${360 - angleSlice.angleDegrees}°`, misconceptionId: "USE_COMPLEMENT_ANGLE", derivation: "Finds the angle of the rest of the pie." },
        { text: `${angleSlice.angleDegrees / 2}°`, misconceptionId: "USE_180_DEGREE_WHOLE", derivation: "Treats 180° as the whole instead of 360°." },
        { text: `${angleSlice.angleDegrees + 18}°`, misconceptionId: "ADD_FIVE_PERCENT_ANGLE", derivation: "Uses a share five percentage points too high." },
        { text: `${Math.max(18, angleSlice.angleDegrees - 18)}°`, misconceptionId: "SUBTRACT_FIVE_PERCENT_ANGLE", derivation: "Uses a share five percentage points too low." },
      ],
      explanation: {
        keyIdea: "A full pie is 360°, so multiply the sector percentage by 360/100.",
        steps: [`${angleSlice.category} represents ${angleSlice.percent}% of the pie.`, `Central angle = ${angleSlice.percent}/100 × 360° = ${angleSlice.angleDegrees}°.`],
      },
      evidence: { categoryIndex: angleIndex },
      numericStep: 18,
    },
    SECTOR_COUNT_FROM_TOTAL: {
      kind: "SECTOR_COUNT_FROM_TOTAL",
      difficulty: "Medium",
      stemSurfaceId: countSurface.id,
      stem: countSurface.text,
      answer: String(countAnswer),
      candidates: [
        { text: String(stimulus.totalValue - countAnswer), misconceptionId: "USE_COMPLEMENT_COUNT", derivation: "Counts everything outside the named sector." },
        { text: formatQuotient(stimulus.totalValue * countSlice.percent, 360), misconceptionId: "TREAT_PERCENT_AS_ANGLE", derivation: "Divides by 360 as though the printed value were an angle." },
        { text: String((stimulus.totalValue * (countSlice.percent + 5)) / 100), misconceptionId: "READ_FIVE_POINTS_HIGH", derivation: "Uses a share five percentage points too high." },
        { text: String(Math.max(0, (stimulus.totalValue * (countSlice.percent - 5)) / 100)), misconceptionId: "READ_FIVE_POINTS_LOW", derivation: "Uses a share five percentage points too low." },
        { text: String(countSlice.percent), misconceptionId: "COPY_PERCENT_AS_COUNT", derivation: "Copies the percentage as a count." },
      ],
      explanation: {
        keyIdea: "Apply the sector percentage to the total shown with the pie chart.",
        steps: [`${countSlice.category} = ${countSlice.percent}% of ${stimulus.totalValue}.`, `Count = ${stimulus.totalValue} × ${countSlice.percent}/100 = ${countAnswer}.`],
      },
      evidence: { categoryIndex: countIndex },
      numericStep,
    },
    COMBINED_SECTOR_PERCENT: {
      kind: "COMBINED_SECTOR_PERCENT",
      difficulty: "Medium",
      stemSurfaceId: combinedSurface.id,
      stem: combinedSurface.text,
      answer: `${combinedPercent}%`,
      candidates: [
        { text: `${Math.abs(combinedFirst.percent - combinedSecond.percent)}%`, misconceptionId: "USE_DIFFERENCE_INSTEAD_OF_SUM", derivation: "Subtracts the two shares instead of combining them." },
        { text: `${combinedFirst.percent}%`, misconceptionId: "USE_FIRST_ONLY", derivation: "Uses only the first named sector." },
        { text: `${combinedSecond.percent}%`, misconceptionId: "USE_SECOND_ONLY", derivation: "Uses only the second named sector." },
        { text: `${100 - combinedPercent}%`, misconceptionId: "USE_COMPLEMENT", derivation: "Reports the share of the other three sectors." },
        { text: `${combinedPercent + 5}%`, misconceptionId: "ADD_FIVE_POINTS", derivation: "Adds an extra five percentage points after combining the sectors." },
      ],
      explanation: {
        keyIdea: "For two sectors of the same pie, add their percentage shares.",
        steps: [`${combinedFirst.category} = ${combinedFirst.percent}% and ${combinedSecond.category} = ${combinedSecond.percent}%.`, `Combined share = ${combinedFirst.percent}% + ${combinedSecond.percent}% = ${combinedPercent}%.`],
      },
      evidence: { firstIndex: combinedFirstIndex, secondIndex: combinedSecondIndex },
      numericStep: 5,
    },
    DIFFERENCE_IN_COUNTS: {
      kind: "DIFFERENCE_IN_COUNTS",
      difficulty: "Medium",
      stemSurfaceId: differenceSurface.id,
      stem: differenceSurface.text,
      answer: String(differenceCount),
      candidates: [
        { text: String(differenceFirstCount + differenceSecondCount), misconceptionId: "ADD_COUNTS", derivation: "Adds the two category counts instead of finding their difference." },
        { text: String(Math.abs(differenceFirst.percent - differenceSecond.percent)), misconceptionId: "USE_PERCENT_GAP_AS_COUNT", derivation: "Uses the percentage-point gap as though it were a count." },
        { text: String(Math.max(differenceFirstCount, differenceSecondCount)), misconceptionId: "USE_LARGER_COUNT_ONLY", derivation: "Reports the larger category count without subtracting." },
        { text: String(Math.min(differenceFirstCount, differenceSecondCount)), misconceptionId: "USE_SMALLER_COUNT_ONLY", derivation: "Reports the smaller category count without subtracting." },
        { text: String(differenceCount + numericStep), misconceptionId: "ONE_SCALE_STEP_HIGH", derivation: "Moves one five-percent count step above the correct difference." },
      ],
      explanation: {
        keyIdea: "Convert the two sector shares to counts, then subtract the smaller count from the larger one.",
        steps: [
          `${differenceFirst.category} count = ${stimulus.totalValue} × ${differenceFirst.percent}/100 = ${differenceFirstCount}; ${differenceSecond.category} count = ${stimulus.totalValue} × ${differenceSecond.percent}/100 = ${differenceSecondCount}.`,
          `Difference = |${differenceFirstCount} - ${differenceSecondCount}| = ${differenceCount}.`,
        ],
      },
      evidence: { firstIndex: differenceFirstIndex, secondIndex: differenceSecondIndex },
      numericStep,
    },
    RATIO_OF_TWO_SECTORS: {
      kind: "RATIO_OF_TWO_SECTORS",
      difficulty: "Hard",
      stemSurfaceId: ratioSurface.id,
      stem: ratioSurface.text,
      answer: ratioAnswer,
      candidates: [
        { text: ratioDisplay(ratioSecond.percent, ratioFirst.percent), misconceptionId: "REVERSE_RATIO", derivation: "Reverses the order of the two named categories." },
        { text: ratioDisplay(ratioFirst.percent, 100), misconceptionId: "FIRST_TO_WHOLE", derivation: "Compares the first category with the whole pie." },
        { text: ratioDisplay(ratioSecond.percent, 100), misconceptionId: "SECOND_TO_WHOLE", derivation: "Compares the second category with the whole pie." },
        { text: ratioDisplay(100 - ratioFirst.percent, ratioSecond.percent), misconceptionId: "FIRST_COMPLEMENT", derivation: "Uses the complement of the first category." },
        { text: ratioDisplay(ratioFirst.percent, 100 - ratioSecond.percent), misconceptionId: "SECOND_COMPLEMENT", derivation: "Uses the complement of the second category." },
      ],
      explanation: {
        keyIdea: "Both category counts use the same total, so their count ratio equals the ratio of their sector percentages.",
        steps: [`${ratioFirst.category}:${ratioSecond.category} = ${ratioFirst.percent}:${ratioSecond.percent}.`, `Simplifying gives ${ratioAnswer}.`],
      },
      evidence: { firstIndex: ratioFirstIndex, secondIndex: ratioSecondIndex },
      numericStep: 1,
    },
    RELATIVE_SECTOR_PERCENT_EXCESS: {
      kind: "RELATIVE_SECTOR_PERCENT_EXCESS",
      difficulty: "Hard",
      stemSurfaceId: excessSurface.id,
      stem: excessSurface.text,
      answer: excessAnswer,
      candidates: [
        { text: `${excessDifference}%`, misconceptionId: "USE_PERCENTAGE_POINT_GAP", derivation: "Reports the share gap rather than the percentage excess over the smaller category." },
        { text: formatPercent(excessDifference, larger.percent), misconceptionId: "USE_LARGER_AS_BASE", derivation: "Uses the larger category as the comparison base." },
        { text: formatPercent(larger.percent, smaller.percent), misconceptionId: "REPORT_LARGER_AS_PERCENT_OF_SMALLER", derivation: "Reports the full larger share relative to the smaller instead of only the excess." },
        { text: formatPercent(smaller.percent, larger.percent), misconceptionId: "REVERSE_RELATIVE_PERCENT", derivation: "Forms the reverse relative comparison." },
        { text: formatPercent(excessDifference, larger.percent + smaller.percent), misconceptionId: "USE_PAIR_TOTAL_AS_BASE", derivation: "Uses the combined pair as the comparison base." },
      ],
      explanation: {
        keyIdea: "For 'A is what percent more than B', divide the difference by B, the comparison base.",
        steps: [`Share difference = ${larger.percent}% - ${smaller.percent}% = ${excessDifference} percentage points.`, `Percentage excess = ${excessDifference}/${smaller.percent} × 100 = ${excessAnswer}.`],
      },
      evidence: { largerIndex: largerIndexForExcess, smallerIndex: smallerIndexForExcess },
      numericStep: 5,
    },
    COMBINED_SECTOR_ANGLE: {
      kind: "COMBINED_SECTOR_ANGLE",
      difficulty: "Hard",
      stemSurfaceId: combinedAngleSurface.id,
      stem: combinedAngleSurface.text,
      answer: `${combinedAngle}°`,
      candidates: [
        { text: `${Math.abs(angleFirst.angleDegrees - angleSecond.angleDegrees)}°`, misconceptionId: "USE_ANGLE_DIFFERENCE", derivation: "Subtracts the sector angles instead of combining them." },
        { text: `${angleFirst.angleDegrees}°`, misconceptionId: "USE_FIRST_ANGLE_ONLY", derivation: "Uses only the first sector angle." },
        { text: `${angleSecond.angleDegrees}°`, misconceptionId: "USE_SECOND_ANGLE_ONLY", derivation: "Uses only the second sector angle." },
        { text: `${360 - combinedAngle}°`, misconceptionId: "USE_REMAINING_ANGLE", derivation: "Finds the angle of the other three sectors." },
        { text: `${combinedAngle + 18}°`, misconceptionId: "ADD_FIVE_PERCENT_ANGLE", derivation: "Adds one extra five-percent angle step." },
      ],
      explanation: {
        keyIdea: "Find each sector angle from its percentage, then add the two angles.",
        steps: [`${angleFirst.category}: ${angleFirst.percent}% × 360°/100 = ${angleFirst.angleDegrees}°; ${angleSecond.category}: ${angleSecond.percent}% × 360°/100 = ${angleSecond.angleDegrees}°.`, `Combined angle = ${angleFirst.angleDegrees}° + ${angleSecond.angleDegrees}° = ${combinedAngle}°.`],
      },
      evidence: { firstIndex: angleFirstIndex, secondIndex: angleSecondIndex },
      numericStep: 18,
    },
    REMAINDER_AFTER_TWO_SECTORS_COUNT: {
      kind: "REMAINDER_AFTER_TWO_SECTORS_COUNT",
      difficulty: "Hard",
      stemSurfaceId: remainderSurface.id,
      stem: remainderSurface.text,
      answer: String(remainderCount),
      candidates: [
        { text: String((stimulus.totalValue * (remainderFirst.percent + remainderSecond.percent)) / 100), misconceptionId: "COUNT_EXCLUDED_PAIR", derivation: "Counts the two excluded categories instead of the remaining three." },
        { text: String(remainderPercent), misconceptionId: "USE_REMAINDER_PERCENT_AS_COUNT", derivation: "Uses the remaining percentage directly as a count." },
        { text: String(stimulus.totalValue - remainderCount), misconceptionId: "USE_COMPLEMENT_COUNT", derivation: "Reports the count of the excluded pair." },
        { text: String(remainderCount + numericStep), misconceptionId: "ONE_SCALE_STEP_HIGH", derivation: "Moves one five-percent count step above the correct remainder." },
        { text: String(Math.max(0, remainderCount - numericStep)), misconceptionId: "ONE_SCALE_STEP_LOW", derivation: "Moves one five-percent count step below the correct remainder." },
      ],
      explanation: {
        keyIdea: "Subtract the two excluded shares from 100%, then apply the remaining share to the total.",
        steps: [`Remaining share = 100% - ${remainderFirst.percent}% - ${remainderSecond.percent}% = ${remainderPercent}%.`, `Remaining count = ${stimulus.totalValue} × ${remainderPercent}/100 = ${remainderCount}.`],
      },
      evidence: { firstIndex: remainderFirstIndex, secondIndex: remainderSecondIndex },
      numericStep,
    },
  };
}

function validateSet(set: Omit<Di005V2QuestionSet, "validation">) {
  const checks: Di005V2ValidationCheck[] = [];
  const add = (id: string, passed: boolean, message: string) => checks.push({ id, passed, message });
  const difficulties = set.questions.map((question) => question.difficulty);
  const allLearnerText = set.questions.flatMap((question) => [question.stem, question.explanation.keyIdea, ...question.explanation.steps]).join(" ").toLowerCase();

  add("PIE_KIND", set.stimulus.kind === "PIE", "DI-005 V2 must expose pie-chart semantics.");
  add("FIVE_SLICES", set.stimulus.slices.length === 5, "DI-005 V2 requires exactly five sectors.");
  add("SHARES_TOTAL_100", set.stimulus.slices.reduce((sum, slice) => sum + slice.percent, 0) === 100, "Pie shares must total 100%.");
  add("ANGLES_TOTAL_360", set.stimulus.slices.reduce((sum, slice) => sum + slice.angleDegrees, 0) === 360, "Pie angles must total 360°.");
  add("UNIQUE_SHARES", new Set(set.stimulus.slices.map((slice) => slice.percent)).size === 5, "All five shares must be distinct so largest/smallest tasks are unambiguous.");
  add("ONE_HIDDEN_LABEL", set.stimulus.slices.filter((slice) => slice.displayPercent === "?").length === 1, "Exactly one percentage label must be hidden.");
  add("FIVE_QUESTIONS", set.questions.length === 5, "Each DI-005 V2 set must contain exactly five questions.");
  add("DISTINCT_TASKS", new Set(set.questions.map((question) => question.kind)).size === 5, "All five questions in a set must use distinct task families.");
  add("DIFFICULTY_MIX", difficulties.filter((difficulty) => difficulty === "Easy").length === 1 && difficulties.filter((difficulty) => difficulty === "Medium").length === 2 && difficulties.filter((difficulty) => difficulty === "Hard").length === 2, "Each set must contain 1 Easy, 2 Medium and 2 Hard questions.");
  add("OPTION_SHAPE", set.questions.every((question) => question.options.length === set.optionCount && new Set(question.options.map(normalize)).size === set.optionCount), "Every question must expose the profile-specific number of unique options.");
  add("ANSWER_INDEX", set.questions.every((question) => question.options[question.correctIndex] === question.answer), "Every correctIndex must point to the canonical answer.");
  add("SET_LINKAGE", set.questions.every((question) => question.setId === set.setId), "Every child question must retain the parent set id.");
  add("SEMANTIC_STIMULUS_ONLY", !("svg" in (set.stimulus as unknown as Record<string, unknown>)), "Generated question state must not embed SVG presentation markup.");
  add("LANGUAGE_CLEAN", BLOCKED_LANGUAGE.every((word) => !allLearnerText.includes(word)), "Learner-facing text must not contain blocked boilerplate language.");
  add("REVIEW_ONLY", set.traceability.questionStudioDiscoverable === false && set.traceability.questionBankWritable === false && set.traceability.testEligible === false && set.traceability.mockTestEligible === false && set.traceability.publiclyPublishable === false && set.traceability.automaticStudentPublication === false && set.traceability.productionReleaseAuthorized === false, "DI-005 V2 must remain fully review-only before approval.");

  return { valid: checks.every((check) => check.passed), checks } as const;
}

export function generateDi005V2Set(input: { seed: string; examProfile: Di005V2ExamProfile }): Di005V2QuestionSet {
  const stimulus = buildStimulus(input.seed);
  const draftMap = buildDrafts(input.seed, stimulus);
  const selectedKinds = [
    pick(seededRandom(`${input.seed}:easy-kind`), EASY_KINDS),
    ...shuffle(seededRandom(`${input.seed}:medium-kinds`), [...MEDIUM_KINDS]).slice(0, 2),
    ...shuffle(seededRandom(`${input.seed}:hard-kinds`), [...HARD_KINDS]).slice(0, 2),
  ] as Di005V2TaskKind[];
  const orderedKinds = shuffle(seededRandom(`${input.seed}:question-order`), selectedKinds);
  const optionCount = OPTION_COUNT[input.examProfile];
  const setId = `DI-005-V2-${hashSeed(input.seed).toString(16).toUpperCase()}`;

  const questions: Di005V2Question[] = orderedKinds.map((kind, index) => {
    const draft = draftMap[kind];
    const optionState = buildOptions({
      seed: `${input.seed}:${kind}:${input.examProfile}`,
      optionCount,
      answer: draft.answer,
      candidates: draft.candidates,
      numericStep: draft.numericStep ?? 1,
    });
    return {
      questionId: `${setId}-Q${index + 1}`,
      setId,
      kind,
      difficulty: draft.difficulty,
      stemSurfaceId: draft.stemSurfaceId,
      stem: draft.stem,
      options: optionState.options,
      optionMetadata: optionState.optionMetadata,
      correctIndex: optionState.correctIndex,
      answer: draft.answer,
      explanation: draft.explanation,
      evidence: draft.evidence,
    };
  });

  const withoutValidation = {
    packageId: "DI-005" as const,
    reviewVersion: "V2" as const,
    setId,
    seed: input.seed,
    language: "en" as const,
    examProfile: input.examProfile,
    optionCount,
    setDifficulty: "PIE_MIXED_V2" as const,
    stimulus,
    questions,
    traceability: {
      packageId: "DI-005" as const,
      representation: "PIE" as const,
      parentFoundation: "DI-001" as const,
      setContractVersion: "DI-005-SET-CONTRACT-V2" as const,
      questionLogicVersion: "DI-005-QUESTION-LOGIC-V2" as const,
      presentationAuthority: "DATA_INTERPRETATION_SHARED_VISUALS" as const,
      arithmeticAuthority: "EXACT_INTEGER_RATIONAL" as const,
      reviewStatus: "UNREVIEWED" as const,
      questionStudioDiscoverable: false as const,
      questionBankStatus: "NOT_STORED" as const,
      questionBankWritable: false as const,
      testEligibility: "INELIGIBLE" as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
      productionReleaseAuthorized: false as const,
    },
  };
  const validation = validateSet(withoutValidation);
  if (!validation.valid) {
    const failures = validation.checks.filter((check) => !check.passed).map((check) => check.id).join(", ");
    throw new Error(`DI-005 V2 validation failed for ${input.seed}: ${failures}`);
  }
  return { ...withoutValidation, validation };
}

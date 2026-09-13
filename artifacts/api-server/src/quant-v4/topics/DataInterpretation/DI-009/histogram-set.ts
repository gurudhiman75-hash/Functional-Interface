import { hashSeed, pick, ratioDisplay, seededRandom, shuffle } from "../DI-001/exact";
import type {
  Di009Difficulty,
  Di009ExamProfile,
  Di009Explanation,
  Di009HistogramBin,
  Di009Option,
  Di009Question,
  Di009QuestionSet,
  Di009Stimulus,
  Di009TaskKind,
  Di009ValidationCheck,
} from "./types";

const OPTION_COUNT = 4 as const;

const CONTEXTS = [
  {
    title: "Heights of students in an athletic club",
    xAxisLabel: "Height (cm)",
    yAxisLabel: "Number of students",
    unit: "students",
    start: 120,
    width: 5,
    frequencyPool: [20, 25, 30, 35, 40, 45, 50, 55, 60],
  },
  {
    title: "Marks obtained by students in a test",
    xAxisLabel: "Marks",
    yAxisLabel: "Number of students",
    unit: "students",
    start: 10,
    width: 10,
    frequencyPool: [8, 12, 16, 20, 24, 28, 32, 36, 40],
  },
  {
    title: "Daily travel time of employees",
    xAxisLabel: "Travel time (minutes)",
    yAxisLabel: "Number of employees",
    unit: "employees",
    start: 10,
    width: 10,
    frequencyPool: [10, 15, 20, 25, 30, 35, 40, 45, 50],
  },
] as const;

type Candidate = Readonly<{ text: string; misconceptionId: string; derivation: string }>;
type Draft = Readonly<{
  kind: Di009TaskKind;
  difficulty: Di009Difficulty;
  stem: string;
  answer: string;
  candidates: readonly Candidate[];
  explanation: Di009Explanation;
  evidence: Readonly<Record<string, number | string>>;
}>;

function formatDecimal(numerator: number, denominator: number): string {
  if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator) || denominator <= 0) {
    throw new Error("DI-009 received an invalid exact decimal fraction.");
  }
  const negative = numerator < 0;
  const n = BigInt(Math.abs(numerator));
  const d = BigInt(denominator);
  const hundredths = (n * 100n + d / 2n) / d;
  const whole = hundredths / 100n;
  const fraction = Number(hundredths % 100n);
  const sign = negative ? "-" : "";
  if (fraction === 0) return `${sign}${whole}`;
  if (fraction % 10 === 0) return `${sign}${whole}.${fraction / 10}`;
  return `${sign}${whole}.${String(fraction).padStart(2, "0")}`;
}

function formatPercent(part: number, whole: number) {
  return `${formatDecimal(part * 100, whole)}%`;
}

function intervalLabel(bin: Di009HistogramBin) {
  return `${bin.lower}–${bin.upper}`;
}

function rangeLabel(bins: readonly Di009HistogramBin[], start: number, end: number) {
  return `${bins[start]!.lower}–${bins[end]!.upper}`;
}

function sumRange(bins: readonly Di009HistogramBin[], start: number, end: number) {
  let total = 0;
  for (let index = start; index <= end; index += 1) total += bins[index]!.frequency;
  return total;
}

function totalFrequency(bins: readonly Di009HistogramBin[]) {
  return bins.reduce((total, bin) => total + bin.frequency, 0);
}

function groupedMeanDisplay(bins: readonly Di009HistogramBin[]) {
  const doubledWeightedTotal = bins.reduce(
    (total, bin) => total + (bin.lower + bin.upper) * bin.frequency,
    0,
  );
  return formatDecimal(doubledWeightedTotal, 2 * totalFrequency(bins));
}

function weightedLimitDisplay(bins: readonly Di009HistogramBin[], key: "lower" | "upper") {
  const weighted = bins.reduce((total, bin) => total + bin[key] * bin.frequency, 0);
  return formatDecimal(weighted, totalFrequency(bins));
}

export function renderDi009HistogramSvg(stimulus: Omit<Di009Stimulus, "svg">): string {
  const width = 760;
  const height = 390;
  const left = 70;
  const right = 24;
  const top = 48;
  const bottom = 78;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const maxFrequency = Math.max(...stimulus.bins.map((bin) => bin.frequency));
  const yMax = Math.max(10, Math.ceil(maxFrequency / 10) * 10);
  const barWidth = plotWidth / stimulus.bins.length;
  const yStep = yMax / 5;
  const parts: string[] = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${stimulus.title}">`,
    `<rect x="0" y="0" width="${width}" height="${height}" fill="white"/>`,
    `<text x="${width / 2}" y="24" text-anchor="middle" font-family="Arial, sans-serif" font-size="16">${stimulus.title}</text>`,
    `<line x1="${left}" y1="${top + plotHeight}" x2="${left + plotWidth}" y2="${top + plotHeight}" stroke="#333" stroke-width="1"/>`,
    `<line x1="${left}" y1="${top}" x2="${left}" y2="${top + plotHeight}" stroke="#333" stroke-width="1"/>`,
    `<g data-contiguous-bars="true">`,
  ];

  stimulus.bins.forEach((bin, index) => {
    const x = left + index * barWidth;
    const h = (bin.frequency / yMax) * plotHeight;
    const y = top + plotHeight - h;
    parts.push(`<rect data-bin-index="${index}" x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${barWidth.toFixed(2)}" height="${h.toFixed(2)}" fill="#f2f2f2" stroke="#444" stroke-width="1"/>`);
  });
  parts.push(`</g>`);

  for (let tick = 0; tick <= 5; tick += 1) {
    const value = tick * yStep;
    const y = top + plotHeight - (value / yMax) * plotHeight;
    parts.push(`<line x1="${left - 5}" y1="${y.toFixed(2)}" x2="${left}" y2="${y.toFixed(2)}" stroke="#333" stroke-width="1"/>`);
    parts.push(`<text x="${left - 10}" y="${(y + 4).toFixed(2)}" text-anchor="end" font-family="Arial, sans-serif" font-size="11">${value}</text>`);
  }

  const boundaries = [stimulus.bins[0]!.lower, ...stimulus.bins.map((bin) => bin.upper)];
  boundaries.forEach((boundary, index) => {
    const x = left + index * barWidth;
    parts.push(`<line x1="${x.toFixed(2)}" y1="${top + plotHeight}" x2="${x.toFixed(2)}" y2="${top + plotHeight + 5}" stroke="#333" stroke-width="1"/>`);
    parts.push(`<text x="${x.toFixed(2)}" y="${top + plotHeight + 22}" text-anchor="middle" font-family="Arial, sans-serif" font-size="11">${boundary}</text>`);
  });

  parts.push(`<text x="${left + plotWidth / 2}" y="${height - 18}" text-anchor="middle" font-family="Arial, sans-serif" font-size="12">${stimulus.xAxisLabel}</text>`);
  parts.push(`<text transform="translate(18 ${top + plotHeight / 2}) rotate(-90)" text-anchor="middle" font-family="Arial, sans-serif" font-size="12">${stimulus.yAxisLabel}</text>`);
  parts.push(`</svg>`);
  return parts.join("");
}

function buildStimulus(seed: string, profile: Di009ExamProfile): Di009Stimulus {
  const context = pick(seededRandom(`${seed}:${profile}:context`), CONTEXTS);
  const scale = pick(seededRandom(`${seed}:${profile}:scale`), profile === "SSC_CGL_TIER_II" ? [1, 1, 2] : [1, 1, 1, 2]);
  const frequencies = shuffle(seededRandom(`${seed}:${profile}:frequencies`), context.frequencyPool)
    .slice(0, 6)
    .map((value) => value * scale);
  const bins = frequencies.map((frequency, index) => ({
    lower: context.start + index * context.width,
    upper: context.start + (index + 1) * context.width,
    frequency,
  }));
  const core = {
    kind: "HISTOGRAM" as const,
    title: context.title,
    instruction: "Study the histogram and answer the questions that follow.",
    bins,
    classWidth: context.width,
    xAxisLabel: context.xAxisLabel,
    yAxisLabel: context.yAxisLabel,
    unit: context.unit,
  };
  return { ...core, svg: renderDi009HistogramSvg(core) };
}

function buildOptions(seed: string, answer: string, candidates: readonly Candidate[]) {
  const retained: Di009Option[] = [];
  const seen = new Set<string>();
  const add = (candidate: Candidate) => {
    const key = candidate.text.trim().toLowerCase();
    if (!candidate.text.trim() || seen.has(key)) return;
    seen.add(key);
    retained.push(candidate);
  };
  add({ text: answer, misconceptionId: "CORRECT", derivation: "Exact recomputation from the DI-009 histogram stimulus." });
  candidates.forEach(add);
  if (retained.length < OPTION_COUNT) throw new Error(`DI-009 constructed only ${retained.length} unique options.`);
  const shuffled = shuffle(seededRandom(`${seed}:options`), retained.slice(0, OPTION_COUNT));
  const correctIndex = shuffled.findIndex((option) => option.misconceptionId === "CORRECT");
  if (correctIndex < 0) throw new Error("DI-009 lost the correct option during deterministic shuffling.");
  return { options: shuffled.map((option) => option.text), optionMetadata: shuffled, correctIndex };
}

function buildDrafts(seed: string, stimulus: Di009Stimulus): Draft[] {
  const bins = stimulus.bins;
  const total = totalFrequency(bins);

  const directIndex = pick(seededRandom(`${seed}:direct-index`), [0, 1, 2, 3, 4, 5] as const);
  const directBin = bins[directIndex]!;
  const otherBins = bins.filter((_, index) => index !== directIndex);

  const totalStart = pick(seededRandom(`${seed}:range-total-start`), [0, 1, 2, 3, 4] as const);
  const totalEnd = Math.min(5, totalStart + pick(seededRandom(`${seed}:range-total-width`), [1, 1, 2] as const));
  const rangeTotal = sumRange(bins, totalStart, totalEnd);

  const ratioCandidates = [
    [0, 1, 3, 4],
    [0, 1, 4, 5],
    [1, 2, 4, 5],
    [0, 2, 3, 5],
    [0, 2, 2, 4],
  ] as const;
  const validRatioRanges = ratioCandidates.filter(([ls, le, rs, re]) => sumRange(bins, ls, le) !== sumRange(bins, rs, re));
  const [leftStart, leftEnd, rightStart, rightEnd] = pick(seededRandom(`${seed}:ratio-ranges`), validRatioRanges);
  const leftTotal = sumRange(bins, leftStart, leftEnd);
  const rightTotal = sumRange(bins, rightStart, rightEnd);
  const rangeRatio = ratioDisplay(leftTotal, rightTotal);

  const shareIndex = pick(seededRandom(`${seed}:share-index`), [0, 1, 2, 3, 4, 5] as const);
  const shareBin = bins[shareIndex]!;
  const shareAnswer = formatPercent(shareBin.frequency, total);
  const neighborShare = bins[shareIndex === 5 ? 4 : shareIndex + 1]!;

  let modalIndex = 0;
  for (let index = 1; index < bins.length; index += 1) {
    if (bins[index]!.frequency > bins[modalIndex]!.frequency) modalIndex = index;
  }
  const modalBin = bins[modalIndex]!;
  const modalAlternatives = [...bins]
    .map((bin, index) => ({ bin, index }))
    .filter((entry) => entry.index !== modalIndex)
    .sort((a, b) => b.bin.frequency - a.bin.frequency);

  const groupedMean = groupedMeanDisplay(bins);
  const weightedLower = weightedLimitDisplay(bins, "lower");
  const weightedUpper = weightedLimitDisplay(bins, "upper");
  const unweightedClassMarkMean = formatDecimal(
    bins.reduce((sum, bin) => sum + bin.lower + bin.upper, 0),
    2 * bins.length,
  );
  const modalMidpoint = formatDecimal(modalBin.lower + modalBin.upper, 2);
  const firstMidpoint = formatDecimal(bins[0]!.lower + bins[0]!.upper, 2);

  return [
    {
      kind: "DIRECT_CLASS_FREQUENCY",
      difficulty: "Easy",
      stem: `How many ${stimulus.unit} are represented by the class interval ${intervalLabel(directBin)}?`,
      answer: String(directBin.frequency),
      candidates: otherBins.map((bin, index) => ({
        text: String(bin.frequency),
        misconceptionId: `READ_WRONG_RECTANGLE_${index}`,
        derivation: `Reads the height of class interval ${intervalLabel(bin)} instead of ${intervalLabel(directBin)}.`,
      })),
      explanation: {
        keyIdea: `In a histogram with equal class widths, the height of the rectangle gives the frequency for that class interval.`,
        steps: [
          `Locate the rectangle whose base is ${intervalLabel(directBin)}.`,
          `Its height is ${directBin.frequency}, so the class contains ${directBin.frequency} ${stimulus.unit}.`,
        ],
      },
      evidence: { targetIndex: directIndex },
    },
    {
      kind: "COMBINED_RANGE_TOTAL",
      difficulty: "Medium",
      stem: `How many ${stimulus.unit} lie in the range ${rangeLabel(bins, totalStart, totalEnd)}?`,
      answer: String(rangeTotal),
      candidates: [
        { text: String(bins[totalStart]!.frequency), misconceptionId: "USE_FIRST_BIN_ONLY", derivation: "Reads only the first rectangle in the stated range." },
        { text: String(bins[totalEnd]!.frequency), misconceptionId: "USE_LAST_BIN_ONLY", derivation: "Reads only the last rectangle in the stated range." },
        { text: String(Math.abs(bins[totalEnd]!.frequency - bins[totalStart]!.frequency)), misconceptionId: "SUBTRACT_ENDPOINT_BARS", derivation: "Subtracts the first and last bar heights instead of adding all frequencies in the range." },
        { text: String(totalStart > 0 ? rangeTotal + bins[totalStart - 1]!.frequency : rangeTotal + bins[totalEnd + 1]!.frequency), misconceptionId: "INCLUDE_ADJACENT_BIN", derivation: "Includes one neighbouring class interval that lies outside the requested range." },
        { text: String(total), misconceptionId: "USE_WHOLE_HISTOGRAM_TOTAL", derivation: "Adds all histogram frequencies rather than only the requested contiguous range." },
      ],
      explanation: {
        keyIdea: `A range covering several histogram classes requires adding the frequencies of every rectangle whose base lies in that range.`,
        steps: [
          `The relevant frequencies are ${bins.slice(totalStart, totalEnd + 1).map((bin) => bin.frequency).join(" + ")}.`,
          `Their total is ${rangeTotal}.`,
        ],
      },
      evidence: { startIndex: totalStart, endIndex: totalEnd },
    },
    {
      kind: "RANGE_RATIO",
      difficulty: "Medium",
      stem: `What is the ratio of the number of ${stimulus.unit} in ${rangeLabel(bins, leftStart, leftEnd)} to those in ${rangeLabel(bins, rightStart, rightEnd)}?`,
      answer: rangeRatio,
      candidates: [
        { text: ratioDisplay(rightTotal, leftTotal), misconceptionId: "REVERSE_RANGE_RATIO", derivation: "Reverses the order of the two stated ranges." },
        { text: ratioDisplay(bins[leftStart]!.frequency, bins[rightStart]!.frequency), misconceptionId: "USE_FIRST_BIN_OF_EACH_RANGE", derivation: "Uses only the first rectangle from each multi-class range." },
        { text: ratioDisplay(bins[leftEnd]!.frequency, bins[rightEnd]!.frequency), misconceptionId: "USE_LAST_BIN_OF_EACH_RANGE", derivation: "Uses only the last rectangle from each multi-class range." },
        { text: ratioDisplay(leftTotal, total), misconceptionId: "COMPARE_FIRST_RANGE_WITH_WHOLE", derivation: "Compares the first range with the whole histogram instead of the second range." },
        { text: ratioDisplay(total, rightTotal), misconceptionId: "COMPARE_WHOLE_WITH_SECOND_RANGE", derivation: "Uses the whole histogram total as the first term of the ratio." },
        { text: ratioDisplay(leftTotal + bins[leftStart]!.frequency, rightTotal), misconceptionId: "DOUBLE_COUNT_FIRST_LEFT_BIN", derivation: "Totals the first range but accidentally counts its first rectangle twice before forming the ratio." },
        { text: ratioDisplay(leftTotal, rightTotal + bins[rightStart]!.frequency), misconceptionId: "DOUBLE_COUNT_FIRST_RIGHT_BIN", derivation: "Totals the second range but accidentally counts its first rectangle twice before forming the ratio." },
        { text: ratioDisplay(leftTotal + bins[leftEnd]!.frequency, rightTotal), misconceptionId: "DOUBLE_COUNT_LAST_LEFT_BIN", derivation: "Totals the first range but accidentally counts its last rectangle twice before forming the ratio." },
        { text: ratioDisplay(leftTotal, rightTotal + bins[rightEnd]!.frequency), misconceptionId: "DOUBLE_COUNT_LAST_RIGHT_BIN", derivation: "Totals the second range but accidentally counts its last rectangle twice before forming the ratio." },
      ],
      explanation: {
        keyIdea: `First total the bars in each named range, then form the ratio in the same order as the question.`,
        steps: [
          `${rangeLabel(bins, leftStart, leftEnd)} total = ${bins.slice(leftStart, leftEnd + 1).map((bin) => bin.frequency).join(" + ")} = ${leftTotal}.`,
          `${rangeLabel(bins, rightStart, rightEnd)} total = ${bins.slice(rightStart, rightEnd + 1).map((bin) => bin.frequency).join(" + ")} = ${rightTotal}.`,
          `Required ratio = ${leftTotal}:${rightTotal} = ${rangeRatio}.`,
        ],
      },
      evidence: { leftStart, leftEnd, rightStart, rightEnd },
    },
    {
      kind: "CLASS_SHARE_OF_TOTAL",
      difficulty: "Medium",
      stem: `The class interval ${intervalLabel(shareBin)} represents what percentage of the total ${stimulus.unit} shown in the histogram?`,
      answer: shareAnswer,
      candidates: [
        { text: `${shareBin.frequency}%`, misconceptionId: "ATTACH_PERCENT_TO_FREQUENCY", derivation: "Uses the class frequency as a percentage without dividing by the total frequency." },
        { text: formatPercent(shareBin.frequency, total - shareBin.frequency), misconceptionId: "EXCLUDE_TARGET_FROM_DENOMINATOR", derivation: "Divides by the total of all other classes instead of the full histogram total." },
        { text: formatPercent(neighborShare.frequency, total), misconceptionId: "USE_NEIGHBOURING_CLASS_SHARE", derivation: `Finds the percentage for adjacent interval ${intervalLabel(neighborShare)} instead of ${intervalLabel(shareBin)}.` },
        { text: formatPercent(total, shareBin.frequency), misconceptionId: "REVERSE_PART_WHOLE", derivation: "Reverses the part-whole fraction by dividing the total by the selected class frequency." },
      ],
      explanation: {
        keyIdea: `Use the selected class frequency as the part and the sum of all histogram frequencies as the whole.`,
        steps: [
          `Total frequency = ${bins.map((bin) => bin.frequency).join(" + ")} = ${total}.`,
          `Required percentage = ${shareBin.frequency}/${total} × 100 = ${shareAnswer}.`,
        ],
      },
      evidence: { targetIndex: shareIndex },
    },
    {
      kind: "MODAL_CLASS_IDENTIFICATION",
      difficulty: "Easy",
      stem: `Which class interval is the modal class of the distribution shown?`,
      answer: intervalLabel(modalBin),
      candidates: modalAlternatives.map((entry) => ({
        text: intervalLabel(entry.bin),
        misconceptionId: `SELECT_NON_MAXIMUM_BAR_${entry.index}`,
        derivation: `Selects class ${intervalLabel(entry.bin)}, whose frequency ${entry.bin.frequency} is below the maximum ${modalBin.frequency}.`,
      })),
      explanation: {
        keyIdea: `The modal class is the class interval with the greatest frequency, so it is represented by the tallest rectangle.`,
        steps: [
          `The largest frequency on the histogram is ${modalBin.frequency}.`,
          `That rectangle has base ${intervalLabel(modalBin)}, so ${intervalLabel(modalBin)} is the modal class.`,
        ],
      },
      evidence: { modalIndex },
    },
    {
      kind: "APPROX_GROUPED_MEAN_FROM_HISTOGRAM",
      difficulty: "Hard",
      stem: `Using the class marks of the intervals, what is the approximate mean of the distribution shown in the histogram?`,
      answer: groupedMean,
      candidates: [
        { text: weightedLower, misconceptionId: "USE_LOWER_LIMITS_AS_VALUES", derivation: "Uses each lower class limit in place of the class mark when forming the weighted mean." },
        { text: weightedUpper, misconceptionId: "USE_UPPER_LIMITS_AS_VALUES", derivation: "Uses each upper class limit in place of the class mark when forming the weighted mean." },
        { text: unweightedClassMarkMean, misconceptionId: "IGNORE_FREQUENCIES", derivation: "Averages the class marks without weighting them by the histogram frequencies." },
        { text: modalMidpoint, misconceptionId: "USE_MODAL_CLASS_MIDPOINT", derivation: "Reports the midpoint of the tallest rectangle instead of the mean of the full distribution." },
        { text: firstMidpoint, misconceptionId: "USE_FIRST_CLASS_MIDPOINT", derivation: "Uses the first class midpoint rather than the frequency-weighted mean across all classes." },
      ],
      explanation: {
        keyIdea: `Treat each class by its class mark (midpoint), multiply that mark by the rectangle frequency, and divide the total of those products by the total frequency.`,
        steps: [
          `Class marks are ${bins.map((bin) => formatDecimal(bin.lower + bin.upper, 2)).join(", ")}.`,
          `Σf = ${total}; Σ(f × class mark) = ${formatDecimal(bins.reduce((sum, bin) => sum + (bin.lower + bin.upper) * bin.frequency, 0), 2)}.`,
          `Approximate mean = Σfx/Σf = ${groupedMean}.`,
        ],
      },
      evidence: { totalFrequency: total },
    },
  ];
}

function validateSet(set: Omit<Di009QuestionSet, "validation">) {
  const checks: Di009ValidationCheck[] = [];
  const add = (id: string, passed: boolean, message: string) => checks.push({ id, passed, message });
  const bins = set.stimulus.bins;
  add("HISTOGRAM_KIND", set.stimulus.kind === "HISTOGRAM", "DI-009 must expose histogram stimulus semantics.");
  add("SIX_BINS", bins.length === 6, "DI-009 histogram requires six class intervals.");
  add("CONTIGUOUS_CLASSES", bins.every((bin, index) => index === 0 || bins[index - 1]!.upper === bin.lower), "Histogram class intervals must touch with no category gaps.");
  add("EQUAL_CLASS_WIDTH", bins.every((bin) => bin.upper - bin.lower === set.stimulus.classWidth), "Phase-0 SSC histogram classes must have equal widths.");
  add("POSITIVE_FREQUENCIES", bins.every((bin) => Number.isSafeInteger(bin.frequency) && bin.frequency > 0), "Histogram frequencies must be positive integers.");
  const max = Math.max(...bins.map((bin) => bin.frequency));
  add("UNIQUE_MODAL_CLASS", bins.filter((bin) => bin.frequency === max).length === 1, "DI-009 requires a unique tallest rectangle for modal-class questions.");
  add("SVG_PRESENT", set.stimulus.svg.includes("<svg") && (set.stimulus.svg.match(/data-bin-index=/g)?.length ?? 0) === 6, "Histogram review stimulus must expose six rendered rectangles.");
  add("CONTIGUOUS_VISUAL_BARS", set.stimulus.svg.includes('data-contiguous-bars="true"'), "Rendered histogram bars must explicitly remain contiguous.");
  add("SIX_TASKS", set.questions.length === 6 && new Set(set.questions.map((question) => question.kind)).size === 6, "DI-009 requires six distinct histogram task families per review set.");
  add("FOUR_OPTIONS", set.questions.every((question) => question.options.length === 4), "Every SSC DI-009 question must expose four options.");
  add("UNIQUE_OPTIONS", set.questions.every((question) => new Set(question.options).size === 4), "Every DI-009 question must have four unique displayed options.");
  add("ONE_CORRECT", set.questions.every((question) => question.optionMetadata.filter((option) => option.misconceptionId === "CORRECT").length === 1 && question.options[question.correctIndex] === question.answer), "Each DI-009 question must bind exactly one option to the answer.");
  add("EXPLANATION_DEPTH", set.questions.every((question) => question.explanation.keyIdea.length >= 60 && question.explanation.steps.length >= 2), "Each explanation must state the idea and show question-specific working.");
  add("NO_GENERIC_FILLER", set.questions.every((question) => !/\bshortcut\b|\bcommon trap\b|\btrap\b/iu.test(`${question.explanation.keyIdea} ${question.explanation.steps.join(" ")}`)), "DI-009 explanations must not contain generic shortcut/trap filler.");
  add("LIFECYCLE_LOCK", !set.traceability.questionStudioDiscoverable && set.traceability.questionBankStatus === "NOT_STORED" && set.traceability.testEligibility === "INELIGIBLE" && !set.traceability.mockTestEligible && !set.traceability.publiclyPublishable && !set.traceability.automaticStudentPublication, "DI-009 Phase 0 must remain review-only.");
  return { valid: checks.every((check) => check.passed), checks };
}

export function generateDi009HistogramSet(input: { seed?: string; examProfile?: Di009ExamProfile } = {}): Di009QuestionSet {
  const seed = input.seed ?? "DI-009:P0";
  const examProfile = input.examProfile ?? "SSC_CGL_TIER_I";
  const stimulus = buildStimulus(seed, examProfile);
  const setId = `DI-009:${hashSeed(`${seed}:${examProfile}`).toString(16).padStart(8, "0")}`;
  const drafts = buildDrafts(seed, stimulus);
  const questions: Di009Question[] = drafts.map((draft, index) => {
    const options = buildOptions(`${seed}:${draft.kind}:${index}`, draft.answer, draft.candidates);
    return {
      questionId: `${setId}:Q${index + 1}`,
      setId,
      kind: draft.kind,
      difficulty: draft.difficulty,
      stem: draft.stem,
      options: options.options,
      optionMetadata: options.optionMetadata,
      correctIndex: options.correctIndex,
      answer: draft.answer,
      explanation: draft.explanation,
      evidence: draft.evidence,
    };
  });
  const base = {
    packageId: "DI-009" as const,
    setId,
    seed,
    language: "en" as const,
    examProfile,
    optionCount: OPTION_COUNT,
    setDifficulty: "HISTOGRAM_MIXED" as const,
    stimulus,
    questions,
    traceability: {
      packageId: "DI-009" as const,
      representation: "HISTOGRAM" as const,
      groupedBarSibling: "DI-003" as const,
      statisticsSibling: "STAT-003" as const,
      frequencyPolygonSibling: "DI-010_PLANNED" as const,
      setContractVersion: "DI-009-SET-CONTRACT-V1" as const,
      arithmeticAuthority: "EXACT_INTEGER_RATIONAL" as const,
      reviewStatus: "UNREVIEWED" as const,
      questionStudioDiscoverable: false as const,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
    },
  };
  const validation = validateSet(base);
  if (!validation.valid) {
    throw new Error(`Invalid DI-009 set: ${validation.checks.filter((check) => !check.passed).map((check) => check.id).join(", ")}`);
  }
  return { ...base, validation };
}

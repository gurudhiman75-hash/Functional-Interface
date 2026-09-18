import { ratioDisplay, seededRandom, shuffle } from "../DI-001/exact";
import { generateDi005V2Set } from "./pie-set-v2";
import type { Di005V2ExamProfile, Di005V2Option, Di005V2Question, Di005V2QuestionSet } from "./pie-v2-types";

type Candidate = Readonly<{ text: string; misconceptionId: string; derivation: string }>;

function uniqueCandidates(answer: string, candidates: readonly Candidate[], needed: number) {
  const seen = new Set<string>();
  const retained: Di005V2Option[] = [];
  const add = (candidate: Candidate) => {
    const key = candidate.text.trim().toLowerCase();
    if (!candidate.text.trim() || seen.has(key)) return;
    seen.add(key);
    retained.push(candidate);
  };
  add({ text: answer, misconceptionId: "CORRECT", derivation: "Exact recomputation from the shared pie-chart stimulus." });
  candidates.forEach(add);
  if (retained.length < needed) throw new Error(`DI-005 V2 quality layer has only ${retained.length} options for ${answer}.`);
  return retained;
}

function optionizedQuestion(
  set: Di005V2QuestionSet,
  question: Di005V2Question,
  answer: string,
  candidates: readonly Candidate[],
  seedSuffix: string,
) {
  const retained = uniqueCandidates(answer, candidates, set.optionCount);
  const shuffled = shuffle(
    seededRandom(`${set.seed}:${question.kind}:${set.examProfile}:${seedSuffix}`),
    retained.slice(0, set.optionCount),
  );
  const correctIndex = shuffled.findIndex((option) => option.misconceptionId === "CORRECT");
  if (correctIndex < 0) throw new Error(`DI-005 V2 quality layer lost the answer for ${question.kind}.`);
  return {
    ...question,
    answer,
    options: shuffled.map((option) => option.text),
    optionMetadata: shuffled,
    correctIndex,
  };
}

function surfaceText(surfaceId: string, variants: readonly string[]) {
  const index = Math.max(0, Math.min(variants.length - 1, Number(surfaceId.replace(/^S/u, "")) - 1));
  return variants[index] ?? variants[0]!;
}

function formatQuotient(numerator: number, denominator: number): string {
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

/**
 * Hard questions must require more than a direct read plus one arithmetic step.
 * For ratio and combined-angle families, one requested sector is therefore the
 * unlabelled sector. The learner first reconstructs its share from the rest of
 * the pie and then performs the requested comparison/conversion.
 */
function recalibrateHardQuestion(set: Di005V2QuestionSet, question: Di005V2Question): Di005V2Question {
  const calibratedKinds = new Set([
    "RATIO_OF_TWO_SECTORS",
    "RELATIVE_SECTOR_PERCENT_EXCESS",
    "COMBINED_SECTOR_ANGLE",
    "REMAINDER_AFTER_TWO_SECTORS_COUNT",
  ]);
  if (!calibratedKinds.has(question.kind)) return question;

  const hiddenIndex = set.stimulus.hiddenPercentIndex;
  const visibleIndexes = set.stimulus.slices
    .map((_, index) => index)
    .filter((index) => index !== hiddenIndex);
  const visibleIndex = shuffle(seededRandom(`${set.seed}:${question.kind}:hard-visible`), visibleIndexes)[0]!;
  const hidden = set.stimulus.slices[hiddenIndex]!;
  const visible = set.stimulus.slices[visibleIndex]!;
  const visibleTotal = set.stimulus.slices.reduce(
    (sum, slice, index) => index === hiddenIndex ? sum : sum + slice.percent,
    0,
  );
  const recoveryStep = `The printed sectors total ${visibleTotal}%, so ${hidden.category} = 100% - ${visibleTotal}% = ${hidden.percent}%.`;

  if (question.kind === "RATIO_OF_TWO_SECTORS") {
    const ordered = shuffle(seededRandom(`${set.seed}:RATIO_OF_TWO_SECTORS:hard-order`), [hiddenIndex, visibleIndex]);
    const firstIndex = ordered[0]!;
    const secondIndex = ordered[1]!;
    const first = set.stimulus.slices[firstIndex]!;
    const second = set.stimulus.slices[secondIndex]!;
    const answer = ratioDisplay(first.percent, second.percent);
    const calibrated = optionizedQuestion(set, question, answer, [
      { text: ratioDisplay(second.percent, first.percent), misconceptionId: "REVERSE_RATIO", derivation: "Reverses the order of the two named categories." },
      { text: ratioDisplay(first.percent, 100), misconceptionId: "FIRST_TO_WHOLE", derivation: "Compares the first category with the whole pie." },
      { text: ratioDisplay(second.percent, 100), misconceptionId: "SECOND_TO_WHOLE", derivation: "Compares the second category with the whole pie." },
      { text: ratioDisplay(first.percent + second.percent, second.percent), misconceptionId: "PAIR_TOTAL_TO_SECOND", derivation: "Uses the combined share of the pair as the first ratio term." },
      { text: ratioDisplay(first.percent, first.percent + second.percent), misconceptionId: "FIRST_TO_PAIR_TOTAL", derivation: "Compares the first category with the combined pair instead of the second category." },
      { text: ratioDisplay(100 - first.percent, second.percent), misconceptionId: "FIRST_COMPLEMENT", derivation: "Uses the complement of the first category." },
    ], "hard-calibrated-options");

    return {
      ...calibrated,
      stem: surfaceText(question.stemSurfaceId, [
        `What is the ratio of ${first.category} to ${second.category}?`,
        `Find the ratio of the counts represented by ${first.category} and ${second.category}.`,
        `The numbers in ${first.category} and ${second.category} are in what ratio?`,
      ]),
      explanation: {
        keyIdea: "First find the missing sector share. Then form the requested ratio from the two sector percentages.",
        steps: [
          recoveryStep,
          `${first.category}:${second.category} = ${first.percent}:${second.percent}.`,
          `Simplifying gives ${answer}.`,
        ],
      },
      evidence: { firstIndex, secondIndex },
    };
  }

  if (question.kind === "RELATIVE_SECTOR_PERCENT_EXCESS") {
    const largerIndex = hidden.percent > visible.percent ? hiddenIndex : visibleIndex;
    const smallerIndex = largerIndex === hiddenIndex ? visibleIndex : hiddenIndex;
    const larger = set.stimulus.slices[largerIndex]!;
    const smaller = set.stimulus.slices[smallerIndex]!;
    const difference = larger.percent - smaller.percent;
    const answer = formatPercent(difference, smaller.percent);
    const calibrated = optionizedQuestion(set, question, answer, [
      { text: `${difference}%`, misconceptionId: "USE_PERCENTAGE_POINT_GAP", derivation: "Reports the percentage-point gap instead of relative percentage excess." },
      { text: formatPercent(difference, larger.percent), misconceptionId: "USE_LARGER_AS_BASE", derivation: "Uses the larger category as the comparison base." },
      { text: formatPercent(larger.percent, smaller.percent), misconceptionId: "REPORT_LARGER_AS_PERCENT_OF_SMALLER", derivation: "Reports the full larger share relative to the smaller category." },
      { text: formatPercent(smaller.percent, larger.percent), misconceptionId: "REVERSE_RELATIVE_PERCENT", derivation: "Forms the reverse relative comparison." },
      { text: formatPercent(difference, larger.percent + smaller.percent), misconceptionId: "USE_PAIR_TOTAL_AS_BASE", derivation: "Uses the combined pair as the comparison base." },
      { text: `${difference + 5}%`, misconceptionId: "ADD_FIVE_TO_POINT_GAP", derivation: "Adds five percentage points to the share gap and reports it as the relative percentage." },
    ], "hard-calibrated-options");

    return {
      ...calibrated,
      stem: surfaceText(question.stemSurfaceId, [
        `${larger.category} represents what percent more than ${smaller.category}?`,
        `By what percentage is the count for ${larger.category} greater than that for ${smaller.category}?`,
        `The ${larger.category} sector exceeds the ${smaller.category} sector by what percentage of ${smaller.category}?`,
      ]),
      explanation: {
        keyIdea: "First recover the missing sector. Then compare the difference with the smaller category, which is the base.",
        steps: [
          recoveryStep,
          `Difference in shares = ${larger.percent}% - ${smaller.percent}% = ${difference} percentage points.`,
          `Percentage more = ${difference}/${smaller.percent} × 100 = ${answer}.`,
        ],
      },
      evidence: { largerIndex, smallerIndex },
    };
  }

  if (question.kind === "COMBINED_SECTOR_ANGLE") {
    const ordered = shuffle(seededRandom(`${set.seed}:COMBINED_SECTOR_ANGLE:hard-order`), [hiddenIndex, visibleIndex]);
    const firstIndex = ordered[0]!;
    const secondIndex = ordered[1]!;
    const first = set.stimulus.slices[firstIndex]!;
    const second = set.stimulus.slices[secondIndex]!;
    const combinedPercent = first.percent + second.percent;
    const combinedAngle = combinedPercent * 3.6;
    const firstAngle = first.percent * 3.6;
    const secondAngle = second.percent * 3.6;
    const answer = `${combinedAngle}°`;
    const calibrated = optionizedQuestion(set, question, answer, [
      { text: `${Math.abs(firstAngle - secondAngle)}°`, misconceptionId: "USE_ANGLE_DIFFERENCE", derivation: "Subtracts the two sector angles instead of combining them." },
      { text: `${firstAngle}°`, misconceptionId: "USE_FIRST_ANGLE_ONLY", derivation: "Uses only the first named sector angle." },
      { text: `${secondAngle}°`, misconceptionId: "USE_SECOND_ANGLE_ONLY", derivation: "Uses only the second named sector angle." },
      { text: `${360 - combinedAngle}°`, misconceptionId: "USE_REMAINING_ANGLE", derivation: "Finds the angle of the other three sectors." },
      { text: `${combinedPercent}°`, misconceptionId: "COPY_COMBINED_PERCENT_AS_DEGREES", derivation: "Adds the two percentages but forgets to convert the result to degrees." },
      { text: `${combinedAngle + 18}°`, misconceptionId: "ADD_FIVE_PERCENT_ANGLE", derivation: "Uses a combined share five percentage points too high." },
    ], "hard-calibrated-options");

    return {
      ...calibrated,
      stem: surfaceText(question.stemSurfaceId, [
        `What is the combined central angle of ${first.category} and ${second.category}?`,
        `Together, the sectors for ${first.category} and ${second.category} subtend what angle at the centre?`,
        `Find the total angle covered by ${first.category} and ${second.category}.`,
      ]),
      explanation: {
        keyIdea: "First recover the missing sector share, then convert the two required shares to angles and add them.",
        steps: [
          recoveryStep,
          `${first.category}: ${first.percent}% × 360°/100 = ${firstAngle}°; ${second.category}: ${second.percent}% × 360°/100 = ${secondAngle}°.`,
          `Combined angle = ${firstAngle}° + ${secondAngle}° = ${combinedAngle}°.`,
        ],
      },
      evidence: { firstIndex, secondIndex },
    };
  }

  const ordered = shuffle(seededRandom(`${set.seed}:REMAINDER_AFTER_TWO_SECTORS_COUNT:hard-order`), [hiddenIndex, visibleIndex]);
  const firstIndex = ordered[0]!;
  const secondIndex = ordered[1]!;
  const first = set.stimulus.slices[firstIndex]!;
  const second = set.stimulus.slices[secondIndex]!;
  const excludedPercent = first.percent + second.percent;
  const remainderPercent = 100 - excludedPercent;
  const remainderCount = (set.stimulus.totalValue * remainderPercent) / 100;
  const firstCount = (set.stimulus.totalValue * first.percent) / 100;
  const secondCount = (set.stimulus.totalValue * second.percent) / 100;
  const excludedCount = firstCount + secondCount;
  const step = set.stimulus.totalValue / 20;
  const answer = String(remainderCount);
  const calibrated = optionizedQuestion(set, question, answer, [
    { text: String(excludedCount), misconceptionId: "COUNT_EXCLUDED_PAIR", derivation: "Counts the two excluded categories instead of the remaining categories." },
    { text: String(firstCount), misconceptionId: "COUNT_FIRST_EXCLUDED_ONLY", derivation: "Uses only the first excluded category count." },
    { text: String(secondCount), misconceptionId: "COUNT_SECOND_EXCLUDED_ONLY", derivation: "Uses only the second excluded category count." },
    { text: String(set.stimulus.totalValue - firstCount), misconceptionId: "REMOVE_FIRST_ONLY", derivation: "Removes only the first excluded category." },
    { text: String(set.stimulus.totalValue - secondCount), misconceptionId: "REMOVE_SECOND_ONLY", derivation: "Removes only the second excluded category." },
    { text: String(remainderCount + step), misconceptionId: "ONE_SCALE_STEP_HIGH", derivation: "Uses a remaining share five percentage points too high." },
    { text: String(Math.max(0, remainderCount - step)), misconceptionId: "ONE_SCALE_STEP_LOW", derivation: "Uses a remaining share five percentage points too low." },
  ], "hard-calibrated-options");

  return {
    ...calibrated,
    stem: surfaceText(question.stemSurfaceId, [
      `How many ${set.stimulus.unit} belong to all categories other than ${first.category} and ${second.category}?`,
      `After excluding ${first.category} and ${second.category}, how many ${set.stimulus.unit} remain?`,
      `Find the combined count of the remaining three categories after removing ${first.category} and ${second.category}.`,
    ]),
    explanation: {
      keyIdea: "First recover the missing sector share. Then remove the two named sectors from the whole and convert the remainder to a count.",
      steps: [
        recoveryStep,
        `Excluded share = ${first.percent}% + ${second.percent}% = ${excludedPercent}%, so remaining share = 100% - ${excludedPercent}% = ${remainderPercent}%.`,
        `Remaining count = ${set.stimulus.totalValue} × ${remainderPercent}/100 = ${remainderCount}.`,
      ],
    },
    evidence: { firstIndex, secondIndex },
  };
}

function rebuildOptions(set: Di005V2QuestionSet, question: Di005V2Question) {
  const optionCount = set.optionCount;
  const total = set.stimulus.totalValue;
  const countFor = (index: number) => (total * set.stimulus.slices[index]!.percent) / 100;
  const step = total / 20;
  let candidates: Candidate[] | undefined;

  if (question.kind === "SECTOR_COUNT_FROM_TOTAL") {
    const targetIndex = Number(question.evidence.categoryIndex);
    candidates = set.stimulus.slices
      .map((slice, index) => ({ slice, index }))
      .filter(({ index }) => index !== targetIndex)
      .map(({ slice, index }) => ({
        text: String(countFor(index)),
        misconceptionId: `READ_OTHER_SECTOR_COUNT_${index + 1}`,
        derivation: `Uses the count represented by ${slice.category} instead of the requested sector.`,
      }));
  }

  if (question.kind === "DIFFERENCE_IN_COUNTS") {
    const firstIndex = Number(question.evidence.firstIndex);
    const secondIndex = Number(question.evidence.secondIndex);
    const first = countFor(firstIndex);
    const second = countFor(secondIndex);
    const correct = Math.abs(first - second);
    const otherSectorCounts: Candidate[] = set.stimulus.slices
      .map((slice, index) => ({ slice, index }))
      .filter(({ index }) => index !== firstIndex && index !== secondIndex)
      .map(({ slice, index }) => ({
        text: String(countFor(index)),
        misconceptionId: `READ_THIRD_SECTOR_COUNT_${index + 1}`,
        derivation: `Uses the count represented by ${slice.category} instead of subtracting the two named sectors.`,
      }));
    candidates = [
      { text: String(first + second), misconceptionId: "ADD_COUNTS", derivation: "Adds the two category counts instead of finding their difference." },
      { text: String(Math.max(first, second)), misconceptionId: "USE_LARGER_COUNT_ONLY", derivation: "Reports the larger category count without subtracting." },
      { text: String(Math.min(first, second)), misconceptionId: "USE_SMALLER_COUNT_ONLY", derivation: "Reports the smaller category count without subtracting." },
      { text: String(correct + step), misconceptionId: "ONE_SCALE_STEP_HIGH", derivation: "Moves one five-percent count step above the correct difference." },
      { text: String(Math.max(0, correct - step)), misconceptionId: "ONE_SCALE_STEP_LOW", derivation: "Moves one five-percent count step below the correct difference." },
      ...otherSectorCounts,
      { text: String(correct + 2 * step), misconceptionId: "TWO_SCALE_STEPS_HIGH", derivation: "Moves two five-percent count steps above the correct difference." },
      { text: String(correct + 3 * step), misconceptionId: "THREE_SCALE_STEPS_HIGH", derivation: "Moves three five-percent count steps above the correct difference." },
    ];
  }

  if (!candidates) return question;
  const retained = uniqueCandidates(question.answer, candidates, optionCount);
  const shuffled = shuffle(seededRandom(`${set.seed}:${question.kind}:${set.examProfile}:quality-options`), retained.slice(0, optionCount));
  const correctIndex = shuffled.findIndex((option) => option.misconceptionId === "CORRECT");
  if (correctIndex < 0) throw new Error(`DI-005 V2 quality layer lost the answer for ${question.kind}.`);
  return {
    ...question,
    options: shuffled.map((option) => option.text),
    optionMetadata: shuffled,
    correctIndex,
  };
}

/**
 * Review authority for DI-005 V2.
 * Keeps the deterministic semantic set state while hardening learner-facing
 * option quality and ensuring every Hard route is genuinely multi-step.
 */
export function generateDi005V2ReviewSet(input: { seed: string; examProfile: Di005V2ExamProfile }): Di005V2QuestionSet {
  const base = generateDi005V2Set(input);
  const questions = base.questions.map((question) => rebuildOptions(base, recalibrateHardQuestion(base, question)));
  const hardCalibrationPassed = questions.every((question) => {
    const hidden = base.stimulus.hiddenPercentIndex;
    if (question.kind === "RELATIVE_SECTOR_PERCENT_EXCESS") {
      return Number(question.evidence.largerIndex) === hidden || Number(question.evidence.smallerIndex) === hidden;
    }
    if (
      question.kind === "RATIO_OF_TWO_SECTORS" ||
      question.kind === "COMBINED_SECTOR_ANGLE" ||
      question.kind === "REMAINDER_AFTER_TWO_SECTORS_COUNT"
    ) {
      return Number(question.evidence.firstIndex) === hidden || Number(question.evidence.secondIndex) === hidden;
    }
    return true;
  });
  const validation = {
    valid: base.validation.valid && hardCalibrationPassed,
    checks: [
      ...base.validation.checks,
      {
        id: "HARD_MULTI_STEP_CALIBRATION",
        passed: hardCalibrationPassed,
        message: "Every Hard DI-005 V2 family must require recovery of the hidden sector before the requested calculation.",
      },
    ],
  } as const;
  if (!validation.valid) throw new Error(`DI-005 V2 review-quality validation failed for ${input.seed}.`);
  return { ...base, questions, validation };
}

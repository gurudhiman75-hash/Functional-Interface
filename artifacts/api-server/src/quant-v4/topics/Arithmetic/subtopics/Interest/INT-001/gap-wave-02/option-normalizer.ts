import { deterministicIndex, rotate } from "../foundation/prng";
import {
  addRational,
  compareRational,
  divideRational,
  equalsRational,
  isWholeRational,
  multiplyRational,
  rational,
  rationalKey,
  reciprocalRational,
  subtractRational,
} from "../foundation/rational";
import { INT_CP001_WAVE2_RATE_PERCENT_POOL } from "./parameter-generator";
import { formatIntCp001Wave2Answer } from "./presentation";
import type {
  IntCp001Wave2MisconceptionId,
  IntCp001Wave2OptionAudit,
  IntCp001Wave2PrototypeParameters,
  IntCp001Wave2SolveResult,
  Rational,
} from "./types";

interface OptionPackage {
  options: string[];
  optionAudit: IntCp001Wave2OptionAudit[];
  correctIndex: number;
}

interface WrongCandidate {
  value: Rational;
  misconceptionId: IntCp001Wave2MisconceptionId;
}

function candidate(
  value: Rational,
  misconceptionId: IntCp001Wave2MisconceptionId,
): WrongCandidate {
  return { value, misconceptionId };
}

function existingWrongLabels(optionPackage: OptionPackage): IntCp001Wave2MisconceptionId[] {
  const labels = optionPackage.optionAudit
    .filter((option) => option.misconceptionId !== "CORRECT")
    .map((option) => option.misconceptionId);
  return labels.length >= 3
    ? labels
    : [...labels, "PLAUSIBLE_SCALE_ERROR", "PLAUSIBLE_SCALE_ERROR"];
}

function normalisedRateCandidates(
  parameters: IntCp001Wave2PrototypeParameters,
  solution: IntCp001Wave2SolveResult,
  labels: readonly IntCp001Wave2MisconceptionId[],
): WrongCandidate[] {
  const rotated = rotate(
    [...INT_CP001_WAVE2_RATE_PERCENT_POOL],
    deterministicIndex(`${parameters.prototypeId}:${parameters.seed}:rate-options`, INT_CP001_WAVE2_RATE_PERCENT_POOL.length),
  );
  return rotated
    .filter((value) => !equalsRational(value, solution.value))
    .slice(0, 3)
    .map((value, index) => candidate(value, labels[index] ?? "PLAUSIBLE_SCALE_ERROR"));
}

function wholeMonthCandidates(
  parameters: IntCp001Wave2PrototypeParameters,
  solution: IntCp001Wave2SolveResult,
): WrongCandidate[] {
  if (!isWholeRational(solution.value)) {
    throw new Error(`Wave 02 month answer is not whole for ${parameters.prototypeId}.`);
  }
  const months = solution.value.numerator;
  const values: WrongCandidate[] = [];
  if (months >= 12n && months % 12n === 0n) {
    values.push(candidate(rational(months / 12n), "YEARS_REPORTED_AS_MONTHS"));
  }
  values.push(
    candidate(rational(months * 12n), "MONTHS_MULTIPLIED_TWICE"),
    candidate(rational(months + 12n), "PLAUSIBLE_SCALE_ERROR"),
  );
  if (months > 12n) values.push(candidate(rational(months - 12n), "PLAUSIBLE_SCALE_ERROR"));
  values.push(
    candidate(rational(months + 6n), "PLAUSIBLE_SCALE_ERROR"),
    candidate(rational(months * 2n), "PLAUSIBLE_SCALE_ERROR"),
    candidate(rational(12), "PLAUSIBLE_SCALE_ERROR"),
    candidate(rational(24), "PLAUSIBLE_SCALE_ERROR"),
    candidate(rational(36), "PLAUSIBLE_SCALE_ERROR"),
  );
  return values;
}

function amountMultipleCandidates(solution: IntCp001Wave2SolveResult): WrongCandidate[] {
  const interestRatio = subtractRational(solution.value, rational(1));
  return [
    candidate(interestRatio, "AMOUNT_MULTIPLE_REPORTED_AS_INTEREST_RATIO"),
    candidate(
      addRational(rational(1), divideRational(interestRatio, rational(2))),
      "OMITTED_TIME_FACTOR",
    ),
    candidate(addRational(solution.value, rational(1, 10)), "PLAUSIBLE_SCALE_ERROR"),
    candidate(reciprocalRational(solution.value), "RECIPROCAL_RATIO"),
  ];
}

function interestRatioCandidates(solution: IntCp001Wave2SolveResult): WrongCandidate[] {
  return [
    candidate(
      addRational(rational(1), solution.value),
      "INTEREST_RATIO_REPORTED_AS_AMOUNT_MULTIPLE",
    ),
    candidate(divideRational(solution.value, rational(2)), "OMITTED_TIME_FACTOR"),
    candidate(multiplyRational(solution.value, rational(2)), "PLAUSIBLE_SCALE_ERROR"),
    candidate(addRational(solution.value, rational(1, 10)), "PLAUSIBLE_SCALE_ERROR"),
  ];
}

function rebuild(
  parameters: IntCp001Wave2PrototypeParameters,
  solution: IntCp001Wave2SolveResult,
  optionPackage: OptionPackage,
  candidates: readonly WrongCandidate[],
): OptionPackage {
  const seen = new Set<string>([rationalKey(solution.value)]);
  const wrong: IntCp001Wave2OptionAudit[] = [];
  for (const item of candidates) {
    if (compareRational(item.value, rational(0)) <= 0) continue;
    const key = rationalKey(item.value);
    if (seen.has(key)) continue;
    seen.add(key);
    const result: IntCp001Wave2SolveResult = {
      semantic: solution.semantic,
      value: item.value,
    };
    wrong.push({
      text: formatIntCp001Wave2Answer(result),
      result,
      misconceptionId: item.misconceptionId,
    });
    if (wrong.length === 3) break;
  }
  if (wrong.length !== 3) {
    throw new Error(`Could not normalise three options for ${parameters.prototypeId}.`);
  }

  const correct: IntCp001Wave2OptionAudit = {
    text: formatIntCp001Wave2Answer(solution),
    result: solution,
    misconceptionId: "CORRECT",
  };
  const orderedWrong = rotate(
    wrong,
    deterministicIndex(`${parameters.prototypeId}:${parameters.seed}:normalised-wrong-order`, wrong.length),
  );
  const optionAudit = [...orderedWrong];
  optionAudit.splice(optionPackage.correctIndex, 0, correct);
  return {
    options: optionAudit.map((option) => option.text),
    optionAudit,
    correctIndex: optionPackage.correctIndex,
  };
}

export function normaliseIntCp001Wave2Options(
  parameters: IntCp001Wave2PrototypeParameters,
  solution: IntCp001Wave2SolveResult,
  optionPackage: OptionPackage,
): OptionPackage {
  const labels = existingWrongLabels(optionPackage);
  if (solution.semantic === "ANNUAL_RATE_PERCENT") {
    return rebuild(
      parameters,
      solution,
      optionPackage,
      normalisedRateCandidates(parameters, solution, labels),
    );
  }
  if (solution.semantic === "TIME_MONTHS") {
    return rebuild(parameters, solution, optionPackage, wholeMonthCandidates(parameters, solution));
  }
  if (solution.semantic === "AMOUNT_MULTIPLE") {
    return rebuild(parameters, solution, optionPackage, amountMultipleCandidates(solution));
  }
  if (solution.semantic === "INTEREST_TO_PRINCIPAL_RATIO") {
    return rebuild(parameters, solution, optionPackage, interestRatioCandidates(solution));
  }
  return optionPackage;
}

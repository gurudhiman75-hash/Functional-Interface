import { validSingleDigits } from "../../foundation/divisibility";
import { createRandom, type DeterministicRandom } from "../../foundation/prng";
import { completedNumber, shuffle } from "./core";
import { linkedAdditionDivisibilityExtremum } from "./linked-arithmetic-generator";
import {
  greatestCompletedNumber,
  largestValidDigit,
  smallestCompletedNumber,
  smallestValidDigit,
  sumValidDigits,
} from "./single-digit-generators";
import {
  NUM_CP003_WAVE05_IDS,
  type NumCp003Wave05Id,
  type NumCp003Wave05Question,
  type RawWave05,
  type Wave05HiddenState,
} from "./types";

function rawFor(id: NumCp003Wave05Id, random: DeterministicRandom): RawWave05 {
  switch (id) {
    case "NUM-CP003-W5-PROT-LARGEST-VALID-DIGIT": return largestValidDigit(random);
    case "NUM-CP003-W5-PROT-SMALLEST-VALID-DIGIT": return smallestValidDigit(random);
    case "NUM-CP003-W5-PROT-SUM-VALID-DIGITS": return sumValidDigits(random);
    case "NUM-CP003-W5-PROT-GREATEST-COMPLETED-NUMBER": return greatestCompletedNumber(random);
    case "NUM-CP003-W5-PROT-SMALLEST-COMPLETED-NUMBER": return smallestCompletedNumber(random);
    case "NUM-CP003-W5-PROT-LINKED-ADDITION-DIVISIBILITY-EXTREMUM": return linkedAdditionDivisibilityExtremum(random);
  }
}

function verify(state: Wave05HiddenState): string {
  if (state.kind === "SINGLE_DIGIT_CANDIDATE_SET") {
    const validDigits = validSingleDigits(state.template, state.divisor);
    if (validDigits.length < 2) throw new Error("Expected a multi-candidate valid set");
    const smallest = validDigits[0]!;
    const largest = validDigits[validDigits.length - 1]!;
    switch (state.target) {
      case "LARGEST_VALID_DIGIT": return String(largest);
      case "SMALLEST_VALID_DIGIT": return String(smallest);
      case "SUM_VALID_DIGITS": return String(validDigits.reduce((sum, digit) => sum + digit, 0));
      case "GREATEST_COMPLETED_NUMBER": return completedNumber(state.template, largest).toString();
      case "SMALLEST_COMPLETED_NUMBER": return completedNumber(state.template, smallest).toString();
    }
  }

  const arithmeticPairs: Array<[number, number]> = [];
  const validPairs: Array<[number, number]> = [];
  for (let first = 0; first <= 9; first += 1) {
    for (let second = 0; second <= 9; second += 1) {
      const source = BigInt(100 * state.sourceHundreds + 10 * first + state.sourceUnits);
      const result = BigInt(100 * state.resultHundreds + 10 * second + state.resultUnits);
      if (state.addend + source !== result) continue;
      arithmeticPairs.push([first, second]);
      if (result % state.divisor === 0n) validPairs.push([first, second]);
    }
  }
  if (arithmeticPairs.length < 2) throw new Error("Arithmetic evidence does not leave multiple candidates");
  if (validPairs.length < 2 || validPairs.length >= arithmeticPairs.length) {
    throw new Error("Divisibility must materially reduce the arithmetic candidate set while preserving an extremum choice");
  }
  const digits = validPairs.map((pair) => pair[0]).sort((left, right) => left - right);
  return String(state.targetDirection === "LARGEST" ? digits[digits.length - 1] : digits[0]);
}

export function generateNumCp003Wave05(
  id: NumCp003Wave05Id,
  seed: string,
): NumCp003Wave05Question {
  if (!NUM_CP003_WAVE05_IDS.includes(id)) throw new Error(`Unknown Wave 05 prototype ${id}`);
  const random = createRandom(`${id}:${seed}`);
  const raw = rawFor(id, random);
  const stem = raw.stem.endsWith("?") ? raw.stem : `${raw.stem.replace(/[.]+$/u, "")}?`;
  const explanation = {
    ...raw.explanation,
    steps: raw.explanation.steps.map((step) => step.trim().length >= 16 ? step : `Complete the calculation: ${step}`),
  };
  const shuffled = shuffle(random, raw.options);
  const verifierAnswer = verify(raw.hiddenState);
  const errors: string[] = [];

  if (verifierAnswer !== raw.answer) errors.push(`Verifier ${verifierAnswer} != answer ${raw.answer}`);
  if (shuffled.rows[shuffled.correctIndex]?.text !== raw.answer) errors.push("Correct option mismatch");
  if (shuffled.rows.length !== 4 || new Set(shuffled.rows.map((row) => row.text)).size !== 4) errors.push("Expected four unique options");
  if (!stem.endsWith("?")) errors.push("Stem is not interrogative");
  if (explanation.steps.length < 3) errors.push("Expected at least three explanation steps");
  if (explanation.traps.length !== 3) errors.push("Expected exactly three traps");
  if (raw.options.some((row) => row.diagnostic.trim().length < 16)) errors.push("Option diagnostic is missing or too short");

  if (raw.hiddenState.kind === "LINKED_ADDITION_EXTREMUM") {
    if (raw.hiddenState.arithmeticPairs.length <= raw.hiddenState.validPairs.length) {
      errors.push("Linked arithmetic prototype does not use divisibility materially");
    }
    if (raw.hiddenState.validPairs.length < 2) errors.push("Linked extremum requires at least two valid pairs");
  }

  return {
    canonicalProblemId: "NUM-CP-003",
    prototypeId: id,
    permanentQlId: null,
    seed,
    difficulty: raw.difficulty,
    answerSemantic: raw.answerSemantic,
    stem,
    answer: raw.answer,
    options: shuffled.rows.map((row) => row.text),
    correctIndex: shuffled.correctIndex,
    optionAudit: shuffled.rows,
    hiddenState: raw.hiddenState,
    explanation,
    reasoningGraph: { nodes: raw.nodes },
    fingerprint: raw.fingerprint,
    validation: { ok: errors.length === 0, errors, verifierAnswer },
    reviewStatus: "UNREVIEWED_DISCOVERY_CANDIDATE",
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
  };
}

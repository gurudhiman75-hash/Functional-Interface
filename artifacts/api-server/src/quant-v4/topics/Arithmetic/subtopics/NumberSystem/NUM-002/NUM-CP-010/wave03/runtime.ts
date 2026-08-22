import { createHash } from "node:crypto";

import type { NumCp010Difficulty, NumCp010Option } from "../wave01/types.ts";
import type { NumCp010Wave03Package, NumCp010Wave03PrototypeId } from "./types.ts";

const lifecycle = Object.freeze({
  maturity: "DISCOVERY_PROTOTYPE" as const,
  reviewStatus: "WAVE03_REVIEW_REQUIRED" as const,
  active: false as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});

class Rng {
  private state: number;
  constructor(seed: number) { this.state = seed >>> 0; }
  next() {
    this.state = (Math.imul(1664525, this.state) + 1013904223) >>> 0;
    return this.state / 0x100000000;
  }
  int(min: number, max: number) { return min + Math.floor(this.next() * (max - min + 1)); }
}

function fingerprint(prototypeId: string, state: Readonly<Record<string, unknown>>) {
  return createHash("sha256").update(JSON.stringify({ prototypeId, state })).digest("hex");
}

function shuffle<T>(values: readonly T[], rng: Rng) {
  const out = [...values];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = rng.int(0, i);
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

function optionsFromStrings(correct: string, wrong: readonly string[], rng: Rng): readonly NumCp010Option[] {
  const values = [correct];
  for (const value of wrong) {
    if (value !== correct && !values.includes(value)) values.push(value);
    if (values.length === 4) break;
  }
  if (values.length !== 4) throw new Error(`Could not build four unique options for ${correct}`);
  return Object.freeze(shuffle(values, rng).map((value, index) => Object.freeze({
    value,
    isCorrect: value === correct,
    misconceptionId: value === correct ? "CORRECT" : `DISTRACTOR_${index + 1}`,
  })));
}

function numericOptions(correct: number, wrong: readonly number[], rng: Rng) {
  const values = [correct];
  for (const value of wrong) {
    if (Number.isSafeInteger(value) && value >= 0 && !values.includes(value)) values.push(value);
    if (values.length === 4) break;
  }
  let delta = 1;
  while (values.length < 4) {
    for (const value of [correct + delta, Math.max(0, correct - delta)]) {
      if (!values.includes(value)) values.push(value);
      if (values.length === 4) break;
    }
    delta += 1;
  }
  return optionsFromStrings(String(correct), values.slice(1).map(String), rng);
}

function packageFrom(input: Readonly<{
  prototypeId: NumCp010Wave03PrototypeId;
  seed: number;
  difficulty: NumCp010Difficulty;
  answerSemantic: string;
  representation: string;
  stem: string;
  canonicalAnswer: string;
  verifierAnswer: string;
  options: readonly NumCp010Option[];
  state: Readonly<Record<string, unknown>>;
  concept: string;
  strategy: string;
  steps: readonly string[];
  sourceAncestry: readonly string[];
}>): NumCp010Wave03Package {
  const correctIndex = input.options.findIndex((option) => option.isCorrect);
  if (correctIndex < 0) throw new Error(`${input.prototypeId}: correct option missing`);
  return Object.freeze({
    packageId: "NUM-002",
    checkpointId: "NUM-CP-010",
    temporaryPrototypeId: input.prototypeId,
    seed: input.seed,
    locale: "en-IN",
    difficulty: input.difficulty,
    answerSemantic: input.answerSemantic,
    representation: input.representation,
    stem: input.stem,
    options: Object.freeze([...input.options]),
    correctIndex,
    canonicalAnswer: input.canonicalAnswer,
    verifierAnswer: input.verifierAnswer,
    hiddenState: Object.freeze({ ...input.state }),
    mathematicalFingerprint: fingerprint(input.prototypeId, input.state),
    explanation: Object.freeze({
      coreConcept: input.concept,
      strategy: input.strategy,
      steps: Object.freeze([...input.steps]),
      finalAnswer: input.canonicalAnswer,
    }),
    sourceAncestry: Object.freeze([...input.sourceAncestry]),
    prototypeAncestry: Object.freeze([input.prototypeId]),
    lifecycle,
  });
}

function classifyCount(count: number) {
  if (count === 0) return "No number is possible";
  if (count === 1) return "Exactly one number is possible";
  return "More than one number is possible";
}

function p018(seed: number): NumCp010Wave03Package {
  const rng = new Rng(seed * 89 + 18);
  const caseKind = seed % 3;
  const sum = rng.int(6, 14);
  let conditionText = `The sum of its digits is ${sum}.`;
  let valid: number[] = [];

  if (caseKind === 0) {
    for (let n = 10; n <= 99; n += 1) {
      const a = Math.floor(n / 10);
      const b = n % 10;
      if (a + b === sum) valid.push(n);
    }
  } else {
    let difference: number;
    if (caseKind === 1) {
      let a = rng.int(2, 9);
      let b = rng.int(0, a - 1);
      difference = a - b;
      const chosenSum = a + b;
      conditionText = `The sum of its digits is ${chosenSum}, and the tens digit is ${difference} greater than the units digit.`;
      for (let n = 10; n <= 99; n += 1) {
        const t = Math.floor(n / 10);
        const u = n % 10;
        if (t + u === chosenSum && t - u === difference) valid.push(n);
      }
    } else {
      difference = sum % 2 === 0 ? 3 : 2;
      if ((sum + difference) % 2 === 0) difference += 1;
      conditionText = `The sum of its digits is ${sum}, and the tens digit is ${difference} greater than the units digit.`;
      for (let n = 10; n <= 99; n += 1) {
        const t = Math.floor(n / 10);
        const u = n % 10;
        if (t + u === sum && t - u === difference) valid.push(n);
      }
    }
  }

  const correct = classifyCount(valid.length);
  return packageFrom({
    prototypeId: "NUM-CP010-PROT-018",
    seed,
    difficulty: caseKind === 0 ? "MEDIUM" : "HARD",
    answerSemantic: "SOLUTION_MULTIPLICITY_CLASS",
    representation: "DIGIT_CONSTRAINT_CLASSIFICATION",
    stem: `Consider a two-digit number. ${conditionText} How many numbers satisfy the condition${conditionText.includes("and") ? "s" : ""}?`,
    canonicalAnswer: correct,
    verifierAnswer: classifyCount(valid.length),
    options: optionsFromStrings(correct, [
      "No number is possible",
      "Exactly one number is possible",
      "More than one number is possible",
      "Every two-digit number is possible",
    ].filter((value) => value !== correct).slice(0, 3), rng),
    state: { caseKind, sum, conditionText, valid },
    concept: "A digit equation can have no valid state, one valid state or several valid states within the digit limits.",
    strategy: "Translate the stated digit conditions into tens/units relations and check the admissible digit range 1–9 for the tens digit and 0–9 for the units digit.",
    steps: [
      `The valid two-digit numbers are ${valid.length ? valid.join(", ") : "none"}.`,
      `There ${valid.length === 1 ? "is" : "are"} ${valid.length} valid state${valid.length === 1 ? "" : "s"}.`,
      `Therefore ${correct.toLowerCase()}.`,
    ],
    sourceAncestry: ["V2:ns_digit_constraints", "V4_GAP:SOLUTION_CLASS"],
  });
}

function setText(values: readonly number[]) { return `{${values.join(", ")}}`; }

function p019(seed: number): NumCp010Wave03Package {
  const rng = new Rng(seed * 97 + 19);
  const sum = rng.int(3, 7);
  const valid: number[] = [];
  for (let n = 10; n <= 99; n += 1) {
    const t = Math.floor(n / 10);
    const u = n % 10;
    if (t + u === sum) valid.push(n);
  }
  const correct = setText(valid);
  const wrongA = setText(valid.slice(1));
  const wrongB = setText(valid.slice(0, -1));
  const shifted = valid.map((n) => n + 1);
  const wrongC = setText(shifted);
  return packageFrom({
    prototypeId: "NUM-CP010-PROT-019",
    seed,
    difficulty: valid.length >= 6 ? "HARD" : "MEDIUM",
    answerSemantic: "DECIMAL_INTEGER_SET",
    representation: "COMPLETE_NUMBER_SET",
    stem: `Which set contains all two-digit numbers whose digits add up to ${sum}?`,
    canonicalAnswer: correct,
    verifierAnswer: setText(valid),
    options: optionsFromStrings(correct, [wrongA, wrongB, wrongC], rng),
    state: { sum, valid },
    concept: "A complete-set question must include every admissible tens/units pair, not just one example.",
    strategy: "Let the tens digit run from 1 upward. For each tens digit t, the units digit must be sum − t and must stay between 0 and 9.",
    steps: [
      `Valid tens/units pairs are ${valid.map((n) => `(${Math.floor(n / 10)}, ${n % 10})`).join(", ")}.`,
      `These give the complete number set ${correct}.`,
    ],
    sourceAncestry: ["V2:ns_digit_constraints", "V4_GAP:COMPLETE_NUMBER_SET"],
  });
}

function pairText(x: number, y: number) { return `(${x}, ${y})`; }

function p020(seed: number): NumCp010Wave03Package {
  const rng = new Rng(seed * 101 + 20);
  const firstTens = rng.int(1, 7);
  const x = rng.int(5, 9);
  const fixedUnits = rng.int(Math.max(1, 10 - x), 9);
  const y = rng.int(1, 8);
  const first = 10 * firstTens + x;
  const second = 10 * y + fixedUnits;
  const result = first + second;
  const matches: Array<[number, number]> = [];
  for (let cx = 0; cx <= 9; cx += 1) {
    for (let cy = 1; cy <= 9; cy += 1) {
      if (10 * firstTens + cx + 10 * cy + fixedUnits === result) matches.push([cx, cy]);
    }
  }
  const verifier = matches.length === 1 ? pairText(matches[0]![0], matches[0]![1]) : "INVALID";
  const correct = pairText(x, y);
  return packageFrom({
    prototypeId: "NUM-CP010-PROT-020",
    seed,
    difficulty: "HARD",
    answerSemantic: "ORDERED_DIGIT_PAIR",
    representation: "TWO_UNKNOWN_COLUMN_ADDITION",
    stem: `In the addition below, x and y are digits. Find the ordered pair (x, y).\n\n  ${firstTens}x\n+ y${fixedUnits}\n----\n  ${result}`,
    canonicalAnswer: correct,
    verifierAnswer: verifier,
    options: optionsFromStrings(correct, [pairText(y, x), pairText(Math.max(0, x - 1), y), pairText(x, Math.min(9, y + 1))], rng),
    state: { firstTens, x, y, fixedUnits, first, second, result, matches },
    concept: "With one unknown in each addend, the units column fixes x and its carry; the tens column then fixes y.",
    strategy: "Solve from right to left, keeping the units carry attached to the tens-column equation.",
    steps: [
      `Units: x + ${fixedUnits} must end in ${result % 10}; this gives x = ${x} and a carry of 1.`,
      `Tens: ${firstTens} + y + 1 = ${Math.floor(result / 10)}, so y = ${y}.`,
      `Therefore (x, y) = ${correct}. Check: ${first} + ${second} = ${result}.`,
    ],
    sourceAncestry: ["V2:ns_unknown_digit_equation", "V4_GAP:TWO_UNKNOWN_DIGITS"],
  });
}

function p021(seed: number): NumCp010Wave03Package {
  const rng = new Rng(seed * 103 + 21);
  const multiplier = rng.int(2, 9);
  const minimumX = Math.ceil(10 / multiplier);
  const x = rng.int(minimumX, 9);
  const tens = rng.int(1, 9);
  const number = 10 * tens + x;
  const result = number * multiplier;
  const matches = Array.from({ length: 10 }, (_, candidate) => candidate)
    .filter((candidate) => (10 * tens + candidate) * multiplier === result);
  const verifier = matches.length === 1 ? matches[0]! : -1;
  const unitsProduct = x * multiplier;
  const carry = Math.floor(unitsProduct / 10);
  return packageFrom({
    prototypeId: "NUM-CP010-PROT-021",
    seed,
    difficulty: multiplier >= 6 ? "HARD" : "MEDIUM",
    answerSemantic: "DIGIT",
    representation: "COLUMN_MULTIPLICATION",
    stem: `In the multiplication ${tens}x × ${multiplier} = ${result}, x is a digit. Find x.`,
    canonicalAnswer: String(x),
    verifierAnswer: String(verifier),
    options: numericOptions(x, [result % 10, carry, Math.max(0, x - 1)], rng),
    state: { tens, x, multiplier, number, result, unitsProduct, carry },
    concept: "In multiplication, the units digit of the product is determined by the units multiplication, while any tens are carried left.",
    strategy: "Use the product's units digit to determine x, then check the full two-digit multiplication.",
    steps: [
      `${x} × ${multiplier} = ${unitsProduct}, so the product ends in ${unitsProduct % 10} and carries ${carry}.`,
      `Thus x = ${x}. Full check: ${number} × ${multiplier} = ${result}.`,
    ],
    sourceAncestry: ["V2:ns_unknown_digit_equation", "V4_GAP:MULTIPLICATION_CARRY"],
  });
}

function p022(seed: number): NumCp010Wave03Package {
  const rng = new Rng(seed * 107 + 22);
  const block = rng.int(12, 98);
  const repeated = block * 101;
  const difference = repeated - block;
  const verifierCandidates = Array.from({ length: 90 }, (_, index) => index + 10)
    .filter((candidate) => candidate * 101 - candidate === difference);
  const verifier = verifierCandidates.length === 1 ? verifierCandidates[0]! : -1;
  return packageFrom({
    prototypeId: "NUM-CP010-PROT-022",
    seed,
    difficulty: "MEDIUM",
    answerSemantic: "DECIMAL_INTEGER",
    representation: "REPEATED_BLOCK",
    stem: `A four-digit number is made by writing the same two-digit number twice. The four-digit number is ${difference} greater than the two-digit number. Find the two-digit number.`,
    canonicalAnswer: String(block),
    verifierAnswer: String(verifier),
    options: numericOptions(block, [Math.floor(difference / 101), Math.floor(difference / 99), Math.max(10, block - 10)], rng),
    state: { block, repeated, difference },
    concept: "Writing a two-digit number n twice gives 100n + n = 101n.",
    strategy: "Express the repeated four-digit number in terms of the original block, then use the given difference.",
    steps: [
      `Repeated number = 101n. Therefore repeated number − original number = 100n.`,
      `100n = ${difference}, so n = ${difference} ÷ 100 = ${block}.`,
      `Check: writing ${block} twice gives ${repeated}, and ${repeated} − ${block} = ${difference}.`,
    ],
    sourceAncestry: ["V2:ns_digit_constraints", "V4_GAP:DECIMAL_CONCATENATION"],
  });
}

function p023(seed: number): NumCp010Wave03Package {
  const rng = new Rng(seed * 109 + 23);
  const tens = rng.int(1, 9);
  const number = 10 * tens;
  const reversed = tens;
  const difference = number - reversed;
  const candidates = Array.from({ length: 9 }, (_, index) => (index + 1) * 10)
    .filter((candidate) => candidate - Math.floor(candidate / 10) === difference);
  const verifier = candidates.length === 1 ? candidates[0]! : -1;
  return packageFrom({
    prototypeId: "NUM-CP010-PROT-023",
    seed,
    difficulty: "EASY",
    answerSemantic: "DECIMAL_INTEGER",
    representation: "REVERSAL_WITH_LEADING_ZERO_DROP",
    stem: `A two-digit number ends in 0. After its digits are reversed, the leading 0 is dropped. The original number is ${difference} greater than the reversed number. Find the original number.`,
    canonicalAnswer: String(number),
    verifierAnswer: String(verifier),
    options: numericOptions(number, [reversed, number + 10, Math.max(10, number - 10)], rng),
    state: { tens, number, reversed, difference },
    concept: "Reversing a number ending in 0 creates a leading 0, which does not change the numerical value after it is dropped.",
    strategy: "Write the original number as 10a and the reversed value as a, then use their difference.",
    steps: [
      `Original − reverse = 10a − a = 9a = ${difference}.`,
      `So a = ${difference} ÷ 9 = ${tens}.`,
      `The original number is 10 × ${tens} = ${number}.`,
    ],
    sourceAncestry: ["V2:ns_digit_interchange", "V4_EDGE:REVERSAL_TRAILING_ZERO"],
  });
}

function p024(seed: number): NumCp010Wave03Package {
  const rng = new Rng(seed * 113 + 24);
  const middle = rng.int(1, 8);
  const h = middle + 1;
  const u = middle - 1;
  const sum = h + middle + u;
  const correct = 100 * h + 10 * middle + u;
  const candidates: number[] = [];
  for (let n = 100; n <= 999; n += 1) {
    const a = Math.floor(n / 100);
    const b = Math.floor(n / 10) % 10;
    const c = n % 10;
    if (a - 1 === b && b - 1 === c && a + b + c === sum) candidates.push(n);
  }
  const verifier = candidates.length === 1 ? candidates[0]! : -1;
  return packageFrom({
    prototypeId: "NUM-CP010-PROT-024",
    seed,
    difficulty: "EASY",
    answerSemantic: "DECIMAL_INTEGER",
    representation: "DESCENDING_CONSECUTIVE_DIGITS",
    stem: `A three-digit number has consecutive decreasing digits. The sum of its digits is ${sum}. Find the number.`,
    canonicalAnswer: String(correct),
    verifierAnswer: String(verifier),
    options: numericOptions(correct, [100 * u + 10 * middle + h, correct + 111, Math.max(100, correct - 111)], rng),
    state: { h, middle, u, sum, correct },
    concept: "Consecutive decreasing digits fall by 1 from left to right.",
    strategy: "Represent the digits as one more than the middle digit, the middle digit, and one less than it; the digit sum fixes the middle digit.",
    steps: [
      `Let the middle digit be b. Then the digits are b + 1, b, b − 1, so their sum is 3b = ${sum}.`,
      `Thus b = ${middle}, giving digits ${h}, ${middle}, ${u}.`,
      `The number is ${correct}.`,
    ],
    sourceAncestry: ["V2:ns_consecutive_digit_number", "V4_EDGE:DESCENDING_DIGITS"],
  });
}

function iterativeDigitalRoot(value: number) {
  let current = value;
  const stages: number[] = [];
  while (current >= 10) {
    current = String(current).split("").reduce((sum, ch) => sum + Number(ch), 0);
    stages.push(current);
  }
  return { root: current, stages };
}

function p025(seed: number): NumCp010Wave03Package {
  const rng = new Rng(seed * 127 + 25);
  const length = rng.int(5, 7);
  const digits = Array.from({ length }, (_, index) => index === 0 ? rng.int(1, 9) : rng.int(0, 9));
  const number = Number(digits.join(""));
  const iterative = iterativeDigitalRoot(number);
  const verifier = number === 0 ? 0 : 1 + ((number - 1) % 9);
  const firstSum = digits.reduce((sum, digit) => sum + digit, 0);
  const stageText = iterative.stages.map((value, index) => `${index === 0 ? `First digit sum = ${value}` : `Next digit sum = ${value}`}.`);
  return packageFrom({
    prototypeId: "NUM-CP010-PROT-025",
    seed,
    difficulty: iterative.stages.length >= 2 ? "MEDIUM" : "EASY",
    answerSemantic: "DIGITAL_ROOT",
    representation: "REPEATED_DIGIT_SUM",
    stem: `Find the digital root of ${number.toLocaleString("en-IN")}.`,
    canonicalAnswer: String(iterative.root),
    verifierAnswer: String(verifier),
    options: numericOptions(iterative.root, [firstSum, Math.max(0, iterative.root - 1), Math.min(9, iterative.root + 1)], rng),
    state: { number, digits, firstSum, stages: iterative.stages, root: iterative.root },
    concept: "The digital root is found by repeatedly adding the decimal digits until only one digit remains.",
    strategy: "Add all digits, then repeat the digit sum only if the result still has more than one digit.",
    steps: [...stageText, `The final one-digit result is ${iterative.root}.`],
    sourceAncestry: ["V4_GAP:DIGITAL_ROOT", "V2:ns_sum_of_digits"],
  });
}

export function generateNumCp010Wave03(prototypeId: NumCp010Wave03PrototypeId, seed: number): NumCp010Wave03Package {
  if (!Number.isSafeInteger(seed) || seed < 1) throw new Error(`Seed must be a positive safe integer, received ${seed}`);
  switch (prototypeId) {
    case "NUM-CP010-PROT-018": return p018(seed);
    case "NUM-CP010-PROT-019": return p019(seed);
    case "NUM-CP010-PROT-020": return p020(seed);
    case "NUM-CP010-PROT-021": return p021(seed);
    case "NUM-CP010-PROT-022": return p022(seed);
    case "NUM-CP010-PROT-023": return p023(seed);
    case "NUM-CP010-PROT-024": return p024(seed);
    case "NUM-CP010-PROT-025": return p025(seed);
  }
}

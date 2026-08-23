import { createHash } from "node:crypto";

import type { NumCp010Difficulty, NumCp010Option } from "../wave01/types.ts";
import type { NumCp010Wave02Package, NumCp010Wave02PrototypeId } from "./types.ts";

const lifecycle = Object.freeze({
  maturity: "DISCOVERY_PROTOTYPE" as const,
  reviewStatus: "WAVE02_REVIEW_REQUIRED" as const,
  active: false as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});

class Rng {
  private state: number;
  constructor(seed: number) {
    this.state = seed >>> 0;
  }
  next() {
    this.state = (Math.imul(1664525, this.state) + 1013904223) >>> 0;
    return this.state / 0x100000000;
  }
  int(min: number, max: number) {
    return min + Math.floor(this.next() * (max - min + 1));
  }
}

function fingerprint(prototypeId: string, state: Readonly<Record<string, unknown>>) {
  return createHash("sha256").update(JSON.stringify({ prototypeId, state })).digest("hex");
}

function shuffle<T>(values: readonly T[], rng: Rng): T[] {
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
  if (values.length !== 4) throw new Error(`Expected four unique option values for ${correct}; received ${JSON.stringify(values)}`);
  const misconceptionByValue = new Map<string, string>();
  wrong.forEach((value, index) => misconceptionByValue.set(value, `DISTRACTOR_${index + 1}`));
  return Object.freeze(shuffle(values, rng).map((value) => Object.freeze({
    value,
    isCorrect: value === correct,
    misconceptionId: value === correct ? "CORRECT" : (misconceptionByValue.get(value) ?? "ALTERNATE_STATE"),
  })));
}

function numericOptions(correct: number, wrong: readonly number[], rng: Rng): readonly NumCp010Option[] {
  const values = [correct];
  for (const value of wrong) {
    if (Number.isSafeInteger(value) && value >= 0 && !values.includes(value)) values.push(value);
    if (values.length === 4) break;
  }
  let delta = 1;
  while (values.length < 4) {
    for (const candidate of [correct + delta, Math.max(0, correct - delta)]) {
      if (!values.includes(candidate)) values.push(candidate);
      if (values.length === 4) break;
    }
    delta += 1;
  }
  return optionsFromStrings(String(correct), values.slice(1).map(String), rng);
}

function packageFrom(input: Readonly<{
  prototypeId: NumCp010Wave02PrototypeId;
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
}>): NumCp010Wave02Package {
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

function p009(seed: number): NumCp010Wave02Package {
  const rng = new Rng(seed * 47 + 9);
  const digit = rng.int(1, 9);
  const position = rng.int(1, 5);
  const positionalValue = 10 ** position;
  const placeValue = digit * positionalValue;
  const verifier = placeValue / positionalValue;
  return packageFrom({
    prototypeId: "NUM-CP010-PROT-009",
    seed,
    difficulty: position >= 4 ? "MEDIUM" : "EASY",
    answerSemantic: "DIGIT",
    representation: "INVERSE_PLACE_VALUE",
    stem: `A digit has place value ${placeValue.toLocaleString("en-IN")} and is ${position} place${position === 1 ? "" : "s"} to the left of the units place. What is the digit?`,
    canonicalAnswer: String(digit),
    verifierAnswer: String(verifier),
    options: numericOptions(digit, [position, Math.max(0, digit - 1), Math.min(9, digit + 1)], rng),
    state: { digit, position, positionalValue, placeValue },
    concept: "Place value equals the digit multiplied by the value of its decimal position.",
    strategy: "Divide the given place value by the positional value to recover the digit.",
    steps: [
      `The positional value is 10^${position} = ${positionalValue.toLocaleString("en-IN")}.`,
      `${placeValue.toLocaleString("en-IN")} ÷ ${positionalValue.toLocaleString("en-IN")} = ${digit}.`,
      `So the digit is ${digit}.`,
    ],
    sourceAncestry: ["V2:ns_digit_constraints", "V4_GAP:INVERSE_PLACE_VALUE"],
  });
}

function p010(seed: number): NumCp010Wave02Package {
  const rng = new Rng(seed * 53 + 10);
  const digit = rng.int(1, 9);
  const position = rng.int(1, 5);
  const placeValue = digit * (10 ** position);
  let verifier = -1;
  for (let p = 0; p <= 8; p += 1) {
    if (digit * (10 ** p) === placeValue) {
      verifier = p;
      break;
    }
  }
  return packageFrom({
    prototypeId: "NUM-CP010-PROT-010",
    seed,
    difficulty: position >= 4 ? "MEDIUM" : "EASY",
    answerSemantic: "DECIMAL_POSITION",
    representation: "INVERSE_PLACE_VALUE",
    stem: `The digit ${digit} has place value ${placeValue.toLocaleString("en-IN")} in a number. How many places to the left of the units place is it?`,
    canonicalAnswer: String(position),
    verifierAnswer: String(verifier),
    options: numericOptions(position, [Math.max(0, position - 1), position + 1, digit], rng),
    state: { digit, position, placeValue },
    concept: "Moving one place left in a decimal number multiplies the place value by 10.",
    strategy: `Compare ${placeValue.toLocaleString("en-IN")} with the digit ${digit} to determine the power of 10 attached to it.`,
    steps: [
      `${placeValue.toLocaleString("en-IN")} ÷ ${digit} = ${(10 ** position).toLocaleString("en-IN")} = 10^${position}.`,
      `Therefore the digit is ${position} place${position === 1 ? "" : "s"} to the left of the units place.`,
    ],
    sourceAncestry: ["V2:ns_digit_constraints", "V4_GAP:INVERSE_PLACE_POSITION"],
  });
}

function p011(seed: number): NumCp010Wave02Package {
  const rng = new Rng(seed * 59 + 11);
  const hundreds = rng.int(1, 7);
  const x = rng.int(5, 9);
  const units = rng.int(5, 9);
  const bUnits = rng.int(Math.max(1, 10 - units), 9);
  const bTens = rng.int(Math.max(0, 9 - x), 9);
  const bHundreds = rng.int(1, 2);
  const first = 100 * hundreds + 10 * x + units;
  const addend = 100 * bHundreds + 10 * bTens + bUnits;
  const result = first + addend;
  const matches = Array.from({ length: 10 }, (_, candidate) => candidate)
    .filter((candidate) => 100 * hundreds + 10 * candidate + units + addend === result);
  const verifier = matches.length === 1 ? matches[0]! : -1;
  const unitsTotal = units + bUnits;
  const carry1 = Math.floor(unitsTotal / 10);
  const tensTotal = x + bTens + carry1;
  const carry2 = Math.floor(tensTotal / 10);
  return packageFrom({
    prototypeId: "NUM-CP010-PROT-011",
    seed,
    difficulty: "HARD",
    answerSemantic: "DIGIT",
    representation: "CHAINED_COLUMN_ADDITION",
    stem: `In the addition below, x is a digit. Find x.\n\n  ${hundreds}x${units}\n+ ${addend}\n-----\n  ${result}`,
    canonicalAnswer: String(x),
    verifierAnswer: String(verifier),
    options: numericOptions(x, [result % 10, bTens, Math.max(0, x - 1)], rng),
    state: { hundreds, x, units, addend, first, result, carry1, carry2 },
    concept: "In column addition, each column must match after carrying from the column on its right.",
    strategy: "Use the units column to identify the first carry, then use the tens column to recover x and confirm the next carry.",
    steps: [
      `Units: ${units} + ${bUnits} = ${unitsTotal}, so write ${unitsTotal % 10} and carry ${carry1}.`,
      `Tens: x + ${bTens} + ${carry1} must give tens digit ${Math.floor(result / 10) % 10}. This gives x = ${x} and carry ${carry2}.`,
      `Check the complete addition: ${first} + ${addend} = ${result}.`,
    ],
    sourceAncestry: ["V2:ns_unknown_digit_equation", "V4_GAP:CHAINED_CARRY"],
  });
}

function p012(seed: number): NumCp010Wave02Package {
  const rng = new Rng(seed * 61 + 12);
  const hundreds = rng.int(4, 9);
  const x = rng.int(1, 6);
  const units = rng.int(0, 5);
  const sUnits = rng.int(units + 1, 9);
  const sTens = rng.int(x, 9);
  const sHundreds = rng.int(1, hundreds - 1);
  const minuend = 100 * hundreds + 10 * x + units;
  const subtrahend = 100 * sHundreds + 10 * sTens + sUnits;
  const result = minuend - subtrahend;
  const matches = Array.from({ length: 10 }, (_, candidate) => candidate)
    .filter((candidate) => 100 * hundreds + 10 * candidate + units - subtrahend === result);
  const verifier = matches.length === 1 ? matches[0]! : -1;
  return packageFrom({
    prototypeId: "NUM-CP010-PROT-012",
    seed,
    difficulty: "HARD",
    answerSemantic: "DIGIT",
    representation: "CHAINED_COLUMN_SUBTRACTION",
    stem: `In the subtraction below, x is a digit. Find x.\n\n  ${hundreds}x${units}\n- ${subtrahend}\n-----\n  ${String(result).padStart(3, "0")}`,
    canonicalAnswer: String(x),
    verifierAnswer: String(verifier),
    options: numericOptions(x, [sTens, Math.min(9, x + 1), Math.max(0, x - 1)], rng),
    state: { hundreds, x, units, subtrahend, minuend, result, chainedBorrow: true },
    concept: "A borrow changes two neighbouring columns: the current column gains 10 and the column on its left loses 1.",
    strategy: "Track the borrow from units into tens and then the second borrow from tens into hundreds before solving for x.",
    steps: [
      `Units: since ${units} < ${sUnits}, borrow 1 ten. The units calculation is ${units + 10} − ${sUnits} = ${result % 10}.`,
      `That leaves x − 1 in the tens column. Because x − 1 is smaller than ${sTens}, borrow again: x − 1 + 10 − ${sTens} = ${Math.floor(result / 10) % 10}.`,
      `Solving gives x = ${x}. Check: ${minuend} − ${subtrahend} = ${result}.`,
    ],
    sourceAncestry: ["V2:ns_unknown_digit_equation", "V4_GAP:CHAINED_BORROW"],
  });
}

function extremumCandidates(sum: number) {
  const values: number[] = [];
  for (let units = 1; units <= 4; units += 1) {
    const hundreds = 2 * units;
    const tens = sum - hundreds - units;
    if (tens >= 0 && tens <= 9) values.push(100 * hundreds + 10 * tens + units);
  }
  return values.sort((a, b) => a - b);
}

function p013(seed: number): NumCp010Wave02Package {
  const rng = new Rng(seed * 67 + 13);
  const viableSums = Array.from({ length: 16 }, (_, i) => i + 6).filter((sum) => extremumCandidates(sum).length >= 2);
  const sum = viableSums[rng.int(0, viableSums.length - 1)]!;
  const candidates = extremumCandidates(sum);
  const askGreatest = seed % 2 === 0;
  const correct = askGreatest ? candidates[candidates.length - 1]! : candidates[0]!;
  const verifier = askGreatest ? Math.max(...candidates) : Math.min(...candidates);
  const wrongPool = candidates.filter((value) => value !== correct);
  while (wrongPool.length < 3) wrongPool.push(correct + (wrongPool.length + 1) * 10);
  return packageFrom({
    prototypeId: "NUM-CP010-PROT-013",
    seed,
    difficulty: candidates.length >= 3 ? "HARD" : "MEDIUM",
    answerSemantic: askGreatest ? "GREATEST_DECIMAL_INTEGER" : "LEAST_DECIMAL_INTEGER",
    representation: "DIGIT_RELATION_OPTIMISATION",
    stem: `In a three-digit number, the hundreds digit is twice the units digit and the sum of all three digits is ${sum}. What is the ${askGreatest ? "greatest" : "least"} possible number?`,
    canonicalAnswer: String(correct),
    verifierAnswer: String(verifier),
    options: numericOptions(correct, wrongPool.slice(0, 3), rng),
    state: { sum, candidates, askGreatest, correct },
    concept: "Digit relations can leave several valid numbers, so an extremum question must compare every admissible digit state.",
    strategy: "Let the units digit be u, making the hundreds digit 2u. Use the digit sum to find the tens digit for each allowed u, then compare the resulting numbers.",
    steps: [
      `Valid numbers from the digit conditions are ${candidates.join(", ")}.`,
      `${askGreatest ? "The greatest" : "The least"} of these is ${correct}.`,
    ],
    sourceAncestry: ["V2:ns_range_optimization", "V2:ns_digit_constraints", "V4_GAP:DIGIT_EXTREMUM"],
  });
}

function setText(values: readonly number[]) {
  return `{${values.join(", ")}}`;
}

function p014(seed: number): NumCp010Wave02Package {
  const rng = new Rng(seed * 71 + 14);
  const hundreds = rng.int(1, 9);
  const units = rng.int(0, 9);
  const lowerX = rng.int(1, 5);
  const upperX = rng.int(lowerX + 2, Math.min(9, lowerX + 4));
  const knownSum = hundreds + units;
  const lowerTotal = knownSum + lowerX;
  const upperTotal = knownSum + upperX;
  const valid = Array.from({ length: 10 }, (_, x) => x).filter((x) => {
    const total = knownSum + x;
    return total >= lowerTotal && total <= upperTotal;
  });
  const correct = setText(valid);
  const wrongA = setText(valid.slice(1));
  const wrongB = setText(valid.slice(0, -1));
  const expanded = [Math.max(0, valid[0]! - 1), ...valid, Math.min(9, valid[valid.length - 1]! + 1)]
    .filter((value, index, array) => array.indexOf(value) === index);
  const wrongC = setText(expanded);
  return packageFrom({
    prototypeId: "NUM-CP010-PROT-014",
    seed,
    difficulty: "MEDIUM",
    answerSemantic: "DIGIT_SET",
    representation: "BOUNDED_DIGIT_SET",
    stem: `In the three-digit number ${hundreds}x${units}, x is a digit. The sum of the three digits is at least ${lowerTotal} and at most ${upperTotal}. Which set contains all possible values of x?`,
    canonicalAnswer: correct,
    verifierAnswer: setText(Array.from({ length: 10 }, (_, x) => x).filter((x) => knownSum + x >= lowerTotal && knownSum + x <= upperTotal)),
    options: optionsFromStrings(correct, [wrongA, wrongB, wrongC], rng),
    state: { hundreds, units, knownSum, lowerTotal, upperTotal, valid },
    concept: "When a digit is bounded by a digit-sum range, every digit from 0 to 9 must be checked against both limits.",
    strategy: "Subtract the sum of the visible digits from the lower and upper totals to obtain the allowed interval for x.",
    steps: [
      `The visible digits add to ${knownSum}.`,
      `${lowerTotal} ≤ ${knownSum} + x ≤ ${upperTotal}, so ${lowerX} ≤ x ≤ ${upperX}.`,
      `Therefore all possible digits are ${correct}.`,
    ],
    sourceAncestry: ["V2:ns_digit_constraints", "V2:ns_hidden_number_reconstruction", "V4_GAP:COMPLETE_DIGIT_SET"],
  });
}

function countDigitBrute(upper: number, digit: number) {
  let count = 0;
  for (let n = 1; n <= upper; n += 1) {
    for (const ch of String(n)) if (Number(ch) === digit) count += 1;
  }
  return count;
}

function p015(seed: number): NumCp010Wave02Package {
  const rng = new Rng(seed * 73 + 15);
  const k = rng.int(0, 4);
  const upper = 100 * k + 99;
  const digit = rng.int(1, 9);
  const perLowPlace = 10 * (k + 1);
  const hundredsContribution = digit <= k ? 100 : 0;
  const correct = 2 * perLowPlace + hundredsContribution;
  const verifier = countDigitBrute(upper, digit);
  return packageFrom({
    prototypeId: "NUM-CP010-PROT-015",
    seed,
    difficulty: k >= 2 ? "HARD" : "MEDIUM",
    answerSemantic: "DIGIT_OCCURRENCE_COUNT",
    representation: "BOUNDED_INTERVAL",
    stem: `How many times does the digit ${digit} appear when all integers from 1 to ${upper} are written in decimal notation?`,
    canonicalAnswer: String(correct),
    verifierAnswer: String(verifier),
    options: numericOptions(correct, [2 * perLowPlace, perLowPlace + hundredsContribution, correct + 10], rng),
    state: { k, upper, digit, perLowPlace, hundredsContribution, correct },
    concept: "Count appearances by position—units, tens and hundreds—rather than counting only the numbers that contain the digit.",
    strategy: `Because the range ends at ${upper}, the units and tens positions each run through complete blocks. The hundreds position contributes only when ${digit} is one of the completed hundreds digits.`,
    steps: [
      `In the units place, ${digit} appears ${perLowPlace} times; in the tens place it also appears ${perLowPlace} times.`,
      `Hundreds-place contribution = ${hundredsContribution}.`,
      `Total appearances = ${perLowPlace} + ${perLowPlace} + ${hundredsContribution} = ${correct}.`,
    ],
    sourceAncestry: ["V4_GAP:BOUNDED_DIGIT_OCCURRENCE"],
  });
}

function p016(seed: number): NumCp010Wave02Package {
  const rng = new Rng(seed * 79 + 16);
  const a = rng.int(1, 9);
  const b = rng.int(0, 9);
  const c = rng.int(0, 9);
  const correct = 10000 * a + 1000 * b + 100 * c + 10 * b + a;
  const digitSum = 2 * a + 2 * b + c;
  const matches: number[] = [];
  for (let middle = 0; middle <= 9; middle += 1) {
    const n = 10000 * a + 1000 * b + 100 * middle + 10 * b + a;
    if (2 * a + 2 * b + middle === digitSum) matches.push(n);
  }
  const verifier = matches.length === 1 ? matches[0]! : -1;
  return packageFrom({
    prototypeId: "NUM-CP010-PROT-016",
    seed,
    difficulty: "MEDIUM",
    answerSemantic: "DECIMAL_INTEGER",
    representation: "FIVE_DIGIT_PALINDROME",
    stem: `A five-digit palindrome begins with the digits ${a}${b}, and the sum of all its digits is ${digitSum}. Find the palindrome.`,
    canonicalAnswer: String(correct),
    verifierAnswer: String(verifier),
    options: numericOptions(correct, [correct + 100, Math.max(10000, correct - 100), 10000 * a + 1000 * c + 100 * b + 10 * c + a], rng),
    state: { a, b, c, digitSum, correct },
    concept: "A five-digit palindrome has the form abcba, so only the middle digit is unpaired.",
    strategy: "Use the two mirrored digit pairs first, then subtract their contribution from the total digit sum to get the middle digit.",
    steps: [
      `The paired digits contribute 2 × ${a} + 2 × ${b} = ${2 * a + 2 * b}.`,
      `Middle digit = ${digitSum} − ${2 * a + 2 * b} = ${c}.`,
      `So the palindrome is ${a}${b}${c}${b}${a} = ${correct}.`,
    ],
    sourceAncestry: ["V4_GAP:PALINDROME", "V2:ns_digit_constraints"],
  });
}

function p017(seed: number): NumCp010Wave02Package {
  const rng = new Rng(seed * 83 + 17);
  const coefficient = rng.int(1, 9);
  const power = rng.int(3, 8);
  const tail = rng.int(0, Math.min((10 ** power) - 1, 9999));
  const value = coefficient * (10 ** power) + tail;
  const correct = power + 1;
  const verifier = String(value).length;
  return packageFrom({
    prototypeId: "NUM-CP010-PROT-017",
    seed,
    difficulty: power >= 6 ? "MEDIUM" : "EASY",
    answerSemantic: "NUMBER_OF_DIGITS",
    representation: "POSITIONAL_EXPRESSION",
    stem: `How many digits are in the number ${coefficient} × 10^${power} + ${tail}?`,
    canonicalAnswer: String(correct),
    verifierAnswer: String(verifier),
    options: numericOptions(correct, [power, power + 2, coefficient + power], rng),
    state: { coefficient, power, tail, value, correct },
    concept: "A positive integer from 10^n up to 10^(n+1) − 1 has exactly n + 1 digits.",
    strategy: "Place the expression between consecutive powers of 10 instead of expanding every zero.",
    steps: [
      `The number is at least 10^${power} because ${coefficient} is non-zero.`,
      `It is less than 10^${power + 1}, since ${coefficient} × 10^${power} + ${tail} < 10^${power + 1}.`,
      `Therefore it has ${correct} digits.`,
    ],
    sourceAncestry: ["V2:ns_number_of_digits", "V4_POLICY:EXACT_DIGIT_COUNT_ONLY"],
  });
}

export function generateNumCp010Wave02(prototypeId: NumCp010Wave02PrototypeId, seed: number): NumCp010Wave02Package {
  if (!Number.isSafeInteger(seed) || seed < 1) throw new Error(`Seed must be a positive safe integer, received ${seed}`);
  switch (prototypeId) {
    case "NUM-CP010-PROT-009": return p009(seed);
    case "NUM-CP010-PROT-010": return p010(seed);
    case "NUM-CP010-PROT-011": return p011(seed);
    case "NUM-CP010-PROT-012": return p012(seed);
    case "NUM-CP010-PROT-013": return p013(seed);
    case "NUM-CP010-PROT-014": return p014(seed);
    case "NUM-CP010-PROT-015": return p015(seed);
    case "NUM-CP010-PROT-016": return p016(seed);
    case "NUM-CP010-PROT-017": return p017(seed);
  }
}

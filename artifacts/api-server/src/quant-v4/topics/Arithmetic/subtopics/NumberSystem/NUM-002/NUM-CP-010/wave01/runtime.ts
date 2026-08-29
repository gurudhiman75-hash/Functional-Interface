import { createHash } from "node:crypto";

import type {
  NumCp010Difficulty,
  NumCp010Option,
  NumCp010Wave01Package,
  NumCp010Wave01PrototypeId,
} from "./types.ts";

const lifecycle = Object.freeze({
  maturity: "DISCOVERY_PROTOTYPE" as const,
  reviewStatus: "WAVE01_REVIEW_REQUIRED" as const,
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
  return createHash("sha256")
    .update(JSON.stringify({ prototypeId, state }))
    .digest("hex");
}

function shuffle<T>(values: readonly T[], rng: Rng): T[] {
  const out = [...values];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = rng.int(0, i);
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

function numericOptions(correct: number, wrong: readonly number[], rng: Rng): readonly NumCp010Option[] {
  const values: number[] = [correct];
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
  const misconceptionByValue = new Map<number, string>();
  wrong.forEach((value, index) => misconceptionByValue.set(value, `DISTRACTOR_${index + 1}`));
  return Object.freeze(shuffle(values, rng).map((value) => Object.freeze({
    value: String(value),
    isCorrect: value === correct,
    misconceptionId: value === correct ? "CORRECT" : (misconceptionByValue.get(value) ?? "NEARBY_VALUE"),
  })));
}

function packageFrom(input: Readonly<{
  prototypeId: NumCp010Wave01PrototypeId;
  seed: number;
  difficulty: NumCp010Difficulty;
  answerSemantic: string;
  representation: string;
  stem: string;
  correct: number;
  verifier: number;
  wrong: readonly number[];
  state: Readonly<Record<string, unknown>>;
  concept: string;
  strategy: string;
  steps: readonly string[];
  sourceAncestry: readonly string[];
}>): NumCp010Wave01Package {
  const optionRng = new Rng(input.seed * 7919 + Number(input.prototypeId.slice(-3)));
  const options = numericOptions(input.correct, input.wrong, optionRng);
  const correctIndex = options.findIndex((option) => option.isCorrect);
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
    options,
    correctIndex,
    canonicalAnswer: String(input.correct),
    verifierAnswer: String(input.verifier),
    hiddenState: Object.freeze({ ...input.state }),
    mathematicalFingerprint: fingerprint(input.prototypeId, input.state),
    explanation: Object.freeze({
      coreConcept: input.concept,
      strategy: input.strategy,
      steps: Object.freeze([...input.steps]),
      finalAnswer: String(input.correct),
    }),
    sourceAncestry: Object.freeze([...input.sourceAncestry]),
    prototypeAncestry: Object.freeze([input.prototypeId]),
    lifecycle,
  });
}

function p001(seed: number): NumCp010Wave01Package {
  const rng = new Rng(seed * 17 + 1);
  const length = rng.int(5, 7);
  const position = rng.int(1, length - 2);
  const target = rng.int(2, 9);
  const digits = Array.from({ length }, (_, index) => index === 0 ? rng.int(1, 9) : rng.int(0, 9));
  digits[length - 1 - position] = target;
  for (let i = 0; i < digits.length; i += 1) {
    if (i !== length - 1 - position && digits[i] === target) digits[i] = (target + i + 1) % 10;
  }
  if (digits[0] === 0) digits[0] = 1;
  const numberText = digits.join("");
  const correct = target * (10 ** position);
  const verifier = Number(numberText[length - 1 - position]) * (10 ** position);
  return packageFrom({
    prototypeId: "NUM-CP010-PROT-001",
    seed,
    difficulty: position >= 4 ? "MEDIUM" : "EASY",
    answerSemantic: "PLACE_VALUE",
    representation: "DECIMAL_NUMERAL",
    stem: `In the number ${numberText}, what is the place value of the digit ${target}?`,
    correct,
    verifier,
    wrong: [target, 10 ** position, target * (10 ** Math.max(0, position - 1))],
    state: { numberText, target, position, correct },
    concept: "A digit's place value is the digit multiplied by the value of its position.",
    strategy: `The digit ${target} is ${position} place${position === 1 ? "" : "s"} to the left of the units place, so its positional value is 10^${position}.`,
    steps: [
      `Positional value = ${10 ** position}.`,
      `Place value of ${target} = ${target} × ${10 ** position} = ${correct}.`,
    ],
    sourceAncestry: ["V2:ns_digit_constraints", "V4_GAP:PLACE_VALUE"],
  });
}

function p002(seed: number): NumCp010Wave01Package {
  const rng = new Rng(seed * 19 + 2);
  const unknownIndex = rng.int(1, 3);
  const digits = [rng.int(1, 9), rng.int(0, 9), rng.int(0, 9), rng.int(0, 9), rng.int(0, 9)];
  const correct = digits[unknownIndex]!;
  const total = digits.reduce((sum, digit) => sum + digit, 0);
  const pattern = digits.map((digit, index) => index === unknownIndex ? "x" : String(digit)).join("");
  const knownSum = total - correct;
  const candidates = Array.from({ length: 10 }, (_, x) => x).filter((x) => knownSum + x === total);
  const verifier = candidates.length === 1 ? candidates[0]! : -1;
  return packageFrom({
    prototypeId: "NUM-CP010-PROT-002",
    seed,
    difficulty: "EASY",
    answerSemantic: "DIGIT",
    representation: "DIGIT_PATTERN",
    stem: `The sum of the digits of the five-digit number ${pattern} is ${total}. What digit is x?`,
    correct,
    verifier,
    wrong: [Math.max(0, total - knownSum - 1), Math.min(9, total - knownSum + 1), Math.min(9, knownSum % 10)],
    state: { digits, unknownIndex, pattern, total, knownSum, correct },
    concept: "The digit sum is obtained by adding every decimal digit exactly once.",
    strategy: "Add the four visible digits first. The missing digit is the amount still needed to reach the given total.",
    steps: [
      `Sum of the visible digits = ${knownSum}.`,
      `Therefore x = ${total} − ${knownSum} = ${correct}.`,
    ],
    sourceAncestry: ["V2:ns_sum_of_digits", "V2:ns_digit_sum_reconstruction"],
  });
}

function p003(seed: number): NumCp010Wave01Package {
  const rng = new Rng(seed * 23 + 3);
  let a = rng.int(3, 9);
  let b = rng.int(1, a - 1);
  if (a === b) b = Math.max(1, a - 1);
  const correct = 10 * a + b;
  const reversed = 10 * b + a;
  const sum = a + b;
  const difference = correct - reversed;
  const matches: number[] = [];
  for (let n = 11; n <= 99; n += 1) {
    const tens = Math.floor(n / 10);
    const units = n % 10;
    if (units === 0) continue;
    const rev = 10 * units + tens;
    if (tens + units === sum && n - rev === difference) matches.push(n);
  }
  const verifier = matches.length === 1 ? matches[0]! : -1;
  return packageFrom({
    prototypeId: "NUM-CP010-PROT-003",
    seed,
    difficulty: difference >= 36 ? "MEDIUM" : "EASY",
    answerSemantic: "DECIMAL_INTEGER",
    representation: "REVERSAL_RELATION",
    stem: `A two-digit number is ${difference} greater than the number obtained by reversing its digits. The sum of its digits is ${sum}. Find the original number.`,
    correct,
    verifier,
    wrong: [reversed, correct - 9, correct + 9],
    state: { a, b, sum, difference, correct, reversed },
    concept: "A two-digit number with tens digit a and units digit b is 10a + b; its reverse is 10b + a.",
    strategy: "Use the digit sum together with the difference between the number and its reverse to recover the two digits.",
    steps: [
      `Original − reverse = 9(a − b) = ${difference}, so a − b = ${difference / 9}.`,
      `Also a + b = ${sum}. Solving the two simple digit relations gives a = ${a}, b = ${b}.`,
      `The original number is 10 × ${a} + ${b} = ${correct}.`,
    ],
    sourceAncestry: ["PYQ:number_reverse_structure", "V2:ns_digit_interchange", "V2:ns_reverse_number_theory"],
  });
}

function p004(seed: number): NumCp010Wave01Package {
  const rng = new Rng(seed * 29 + 4);
  let a = rng.int(3, 9);
  let c = rng.int(1, a - 1);
  const b = rng.int(0, 9);
  const correct = 100 * a + 10 * b + c;
  const reversed = 100 * c + 10 * b + a;
  const outerSum = a + c;
  const difference = correct - reversed;
  const matches: number[] = [];
  for (let n = 100; n <= 999; n += 1) {
    const h = Math.floor(n / 100);
    const t = Math.floor(n / 10) % 10;
    const u = n % 10;
    if (u === 0) continue;
    const rev = 100 * u + 10 * t + h;
    if (t === b && h + u === outerSum && n - rev === difference) matches.push(n);
  }
  const verifier = matches.length === 1 ? matches[0]! : -1;
  return packageFrom({
    prototypeId: "NUM-CP010-PROT-004",
    seed,
    difficulty: "MEDIUM",
    answerSemantic: "DECIMAL_INTEGER",
    representation: "THREE_DIGIT_REVERSAL",
    stem: `A three-digit number has tens digit ${b}. It is ${difference} greater than the number obtained by reversing its digits, and the sum of its hundreds and units digits is ${outerSum}. Find the number.`,
    correct,
    verifier,
    wrong: [reversed, 100 * a + 10 * c + b, 100 * c + 10 * a + b],
    state: { a, b, c, outerSum, difference, correct, reversed },
    concept: "For a three-digit number abc, reversing the digits changes the place values of a and c while the middle digit stays in the tens place.",
    strategy: "The reversal difference gives the difference of the outer digits; the given outer-digit sum then fixes both digits.",
    steps: [
      `Original − reverse = 99(a − c) = ${difference}, so a − c = ${difference / 99}.`,
      `Also a + c = ${outerSum}. Hence a = ${a} and c = ${c}.`,
      `With tens digit ${b}, the number is ${a}${b}${c} = ${correct}.`,
    ],
    sourceAncestry: ["PYQ:number_reverse_structure", "V2:ns_digit_interchange", "V4_GAP:DIGIT_REVERSAL"],
  });
}

function p005(seed: number): NumCp010Wave01Package {
  const rng = new Rng(seed * 31 + 5);
  const tens = rng.int(2, 8);
  const correct = rng.int(0, 9);
  const addend = rng.int(12, 79);
  const first = 10 * tens + correct;
  const result = first + addend;
  const pattern = `${tens}x`;
  const matches = Array.from({ length: 10 }, (_, x) => x).filter((x) => 10 * tens + x + addend === result);
  const verifier = matches.length === 1 ? matches[0]! : -1;
  return packageFrom({
    prototypeId: "NUM-CP010-PROT-005",
    seed,
    difficulty: (correct + addend % 10) >= 10 ? "MEDIUM" : "EASY",
    answerSemantic: "DIGIT",
    representation: "COLUMN_ADDITION",
    stem: `In the addition below, x is a digit. Find x.\n\n  ${pattern}\n+ ${addend}\n-----\n  ${result}`,
    correct,
    verifier,
    wrong: [Math.abs((result % 10) - (addend % 10)), (result % 10), (addend % 10)],
    state: { tens, correct, addend, first, result, carry: (correct + addend % 10) >= 10 },
    concept: "In column addition, the units column determines the missing units digit, including any carry to the tens column.",
    strategy: "Work from the units column first and check that the tens column agrees with the resulting carry.",
    steps: [
      `Units column: ${correct} + ${addend % 10} gives a units digit of ${result % 10}${(correct + addend % 10) >= 10 ? " and carries 1" : ""}.`,
      `So x = ${correct}. Checking the full addition: ${first} + ${addend} = ${result}.`,
    ],
    sourceAncestry: ["V2:ns_unknown_digit_equation", "V4_GAP:CARRY_RECONSTRUCTION"],
  });
}

function p006(seed: number): NumCp010Wave01Package {
  const rng = new Rng(seed * 37 + 6);
  let tens = rng.int(4, 9);
  let correct = rng.int(0, 7);
  let subUnits = rng.int(correct + 1, 9);
  let subTens = rng.int(1, Math.max(1, tens - 1));
  const minuend = 10 * tens + correct;
  let subtrahend = 10 * subTens + subUnits;
  if (subtrahend >= minuend) {
    subTens = Math.max(1, tens - 2);
    subtrahend = 10 * subTens + subUnits;
  }
  const result = minuend - subtrahend;
  const pattern = `${tens}x`;
  const matches = Array.from({ length: 10 }, (_, x) => x).filter((x) => 10 * tens + x - subtrahend === result);
  const verifier = matches.length === 1 ? matches[0]! : -1;
  return packageFrom({
    prototypeId: "NUM-CP010-PROT-006",
    seed,
    difficulty: "MEDIUM",
    answerSemantic: "DIGIT",
    representation: "COLUMN_SUBTRACTION",
    stem: `In the subtraction below, x is a digit. Find x.\n\n  ${pattern}\n- ${subtrahend}\n-----\n  ${String(result).padStart(2, "0")}`,
    correct,
    verifier,
    wrong: [Math.abs((result % 10) - subUnits), (10 + result % 10 - subUnits + 10) % 10, subUnits],
    state: { tens, correct, subtrahend, minuend, result, borrow: true },
    concept: "When the top units digit is smaller than the bottom units digit, one ten is borrowed before subtracting the units.",
    strategy: "Use the borrowed units column to recover x, then verify the complete subtraction.",
    steps: [
      `Because x is smaller than ${subUnits}, the units column becomes 10 + x. We need 10 + x − ${subUnits} = ${result % 10}.`,
      `So x = ${correct}. Check: ${minuend} − ${subtrahend} = ${result}.`,
    ],
    sourceAncestry: ["V2:ns_unknown_digit_equation", "V4_GAP:BORROW_RECONSTRUCTION"],
  });
}

function p007(seed: number): NumCp010Wave01Package {
  const rng = new Rng(seed * 41 + 7);
  const a = rng.int(1, 9);
  const b = rng.int(0, 9);
  const correct = 1000 * a + 100 * b + 10 * b + a;
  const digitSum = 2 * (a + b);
  const matches: number[] = [];
  for (let inner = 0; inner <= 9; inner += 1) {
    const n = 1000 * a + 100 * inner + 10 * inner + a;
    if (2 * (a + inner) === digitSum) matches.push(n);
  }
  const verifier = matches.length === 1 ? matches[0]! : -1;
  return packageFrom({
    prototypeId: "NUM-CP010-PROT-007",
    seed,
    difficulty: "EASY",
    answerSemantic: "DECIMAL_INTEGER",
    representation: "PALINDROME",
    stem: `A four-digit palindrome begins with ${a} and the sum of all its digits is ${digitSum}. Find the palindrome.`,
    correct,
    verifier,
    wrong: [1000 * a + 100 * b + 10 * a + b, 1000 * a + 100 * a + 10 * b + b, correct + 110],
    state: { a, b, digitSum, correct },
    concept: "A four-digit palindrome has the form abba, so the first digit equals the last and the two middle digits are equal.",
    strategy: "Use the palindrome symmetry first, then use the digit sum to find the repeated middle digit.",
    steps: [
      `For abba, the digit sum is 2a + 2b. Here 2 × ${a} + 2b = ${digitSum}.`,
      `Thus 2b = ${digitSum - 2 * a}, so b = ${b}.`,
      `The palindrome is ${a}${b}${b}${a} = ${correct}.`,
    ],
    sourceAncestry: ["V4_GAP:PALINDROME", "V2:ns_digit_constraints"],
  });
}

function p008(seed: number): NumCp010Wave01Package {
  const rng = new Rng(seed * 43 + 8);
  const middle = rng.int(2, 7);
  const h = middle - 1;
  const u = middle + 1;
  const correct = 100 * h + 10 * middle + u;
  const sum = h + middle + u;
  const matches: number[] = [];
  for (let n = 100; n <= 999; n += 1) {
    const a = Math.floor(n / 100);
    const b = Math.floor(n / 10) % 10;
    const c = n % 10;
    if (a + 1 === b && b + 1 === c && a + b + c === sum) matches.push(n);
  }
  const verifier = matches.length === 1 ? matches[0]! : -1;
  return packageFrom({
    prototypeId: "NUM-CP010-PROT-008",
    seed,
    difficulty: "EASY",
    answerSemantic: "DECIMAL_INTEGER",
    representation: "DIGIT_RELATION",
    stem: `A three-digit number has consecutive increasing digits. The sum of its digits is ${sum}. Find the number.`,
    correct,
    verifier,
    wrong: [100 * u + 10 * middle + h, correct + 111, Math.max(100, correct - 111)],
    state: { h, middle, u, sum, correct },
    concept: "Consecutive increasing digits differ by 1 from left to right.",
    strategy: "Represent the digits as one less than the middle digit, the middle digit itself, and one more than it. Their sum fixes the middle digit.",
    steps: [
      `Let the middle digit be b. Then the digits are b − 1, b, b + 1, so their sum is 3b = ${sum}.`,
      `Therefore b = ${middle}, giving digits ${h}, ${middle}, ${u}.`,
      `The required number is ${correct}.`,
    ],
    sourceAncestry: ["V2:ns_consecutive_digit_number", "V2:ns_digit_constraints"],
  });
}

export function generateNumCp010Wave01(prototypeId: NumCp010Wave01PrototypeId, seed: number): NumCp010Wave01Package {
  if (!Number.isSafeInteger(seed) || seed < 1) throw new Error(`Seed must be a positive safe integer, received ${seed}`);
  switch (prototypeId) {
    case "NUM-CP010-PROT-001": return p001(seed);
    case "NUM-CP010-PROT-002": return p002(seed);
    case "NUM-CP010-PROT-003": return p003(seed);
    case "NUM-CP010-PROT-004": return p004(seed);
    case "NUM-CP010-PROT-005": return p005(seed);
    case "NUM-CP010-PROT-006": return p006(seed);
    case "NUM-CP010-PROT-007": return p007(seed);
    case "NUM-CP010-PROT-008": return p008(seed);
  }
}

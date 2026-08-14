import {
  decimalCycle,
  denominatorPrimeProfile,
  fractionBody,
  fractionLatex,
  rational,
  terminatingPlaces,
  terminates,
  type Rational,
} from "../wave01/exact";
import { NUM_CP002_WAVE02_SOURCE_ANCESTRY } from "./source-registry";
import {
  NUM_CP002_WAVE02_PROTOTYPE_IDS,
  type NumCp002Wave02AnswerSemantic,
  type NumCp002Wave02Difficulty,
  type NumCp002Wave02Option,
  type NumCp002Wave02Package,
  type NumCp002Wave02PrototypeId,
} from "./types";

const math = (body: string) => `\\(${body}\\)`;
const lifecycle = Object.freeze({
  permanentQlId: null,
  maturity: "EXECUTABLE_DISCOVERY_PROOF" as const,
  reviewStatus: "UNREVIEWED_DISCOVERY_CANDIDATE" as const,
  active: false as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  questionBankStatus: "NOT_STORED" as const,
  testEligible: false as const,
  testEligibility: "INELIGIBLE" as const,
  publiclyPublishable: false as const,
});

function idx(seed: number, size: number, salt = 0): number {
  return (Math.imul((seed + 17) ^ Math.imul(salt + 3, 0x45d9f3b), 2654435761) >>> 0) % size;
}
function choose<T>(seed: number, values: readonly T[], salt = 0): T { return values[idx(seed, values.length, salt)]!; }

function place(correct: string, wrong: readonly { value: string; misconceptionId: string }[], seed: number, salt: number) {
  const filtered = wrong.filter((x, i, all) => x.value !== correct && all.findIndex((y) => y.value === x.value) === i).slice(0, 3);
  if (filtered.length !== 3) throw new Error(`Need 3 distractors for ${correct}`);
  const correctIndex = idx(seed, 4, salt);
  const options: NumCp002Wave02Option[] = filtered.map((x) => ({ ...x, isCorrect: false }));
  options.splice(correctIndex, 0, { value: correct, isCorrect: true });
  return { options: Object.freeze(options), correctIndex };
}

function badDenominatorPart(value: Rational): number { return denominatorPrimeProfile(value).rest; }

function leastMultiplierBrute(value: Rational): number {
  for (let m = 1; m <= value.d; m += 1) if (terminates(rational(value.n * m, value.d))) return m;
  throw new Error("multiplier not found");
}

function leastDenominatorDivisorBrute(value: Rational): number {
  for (let k = 2; k <= value.d; k += 1) {
    if (value.d % k === 0 && terminates(rational(value.n, value.d / k))) return k;
  }
  throw new Error("denominator divisor not found");
}

function boundedDenominators(numerator: number, maxD: number): number[] {
  const out: number[] = [];
  for (let d = 2; d <= maxD; d += 1) if (terminates(rational(numerator, d))) out.push(d);
  return out;
}

function setLatex(values: readonly number[]): string { return math(`\\{${values.join(",") }\\}`); }

interface Draft {
  answerSemantic: NumCp002Wave02AnswerSemantic;
  difficulty: NumCp002Wave02Difficulty;
  stem: string;
  correct: string;
  wrong: readonly { value: string; misconceptionId: string }[];
  hiddenState: Record<string, unknown>;
  concept?: string;
  solution: readonly string[];
}

const inverseFractions = [
  rational(5, 12), rational(7, 18), rational(11, 21), rational(13, 28), rational(17, 45), rational(19, 42), rational(23, 63), rational(29, 84),
] as const;

function p013(seed: number): Draft {
  const f = choose(seed, inverseFractions, 13);
  const rest = badDenominatorPart(f);
  const correct = math(String(rest));
  return {
    answerSemantic: "INTEGER", difficulty: "MEDIUM",
    stem: `What is the least positive integer by which ${fractionLatex(f)} must be multiplied so that the product has a terminating decimal expansion?`,
    correct,
    wrong: [
      { value: math(String(f.d)), misconceptionId: "USE_COMPLETE_DENOMINATOR" },
      { value: math(String(Math.max(2, denominatorPrimeProfile(f).twos + denominatorPrimeProfile(f).fives))), misconceptionId: "USE_TWO_FIVE_EXPONENT_COUNT" },
      { value: math(String(Math.max(2, Math.floor(Math.sqrt(rest))))), misconceptionId: "CANCEL_ONLY_PART_OF_BAD_FACTOR" },
    ],
    hiddenState: { n: f.n, d: f.d },
    concept: "Only the prime factors other than 2 and 5 must be cancelled from the reduced denominator.",
    solution: [`The reduced denominator is ${math(String(f.d))}; its non-${math("2,5")} part is ${math(String(rest))}.`, `Multiplying by ${math(String(rest))} cancels that part, leaving a denominator made only of ${math("2")} and/or ${math("5")}.`],
  };
}

function p014(seed: number): Draft {
  const f = choose(seed, inverseFractions, 14);
  const rest = badDenominatorPart(f);
  const correct = math(String(rest));
  return {
    answerSemantic: "INTEGER", difficulty: "MEDIUM",
    stem: `The denominator of ${fractionLatex(f)} is to be divided by an integer greater than ${math("1")}. What is the least such integer that makes the new fraction terminating?`,
    correct,
    wrong: [
      { value: math(String(f.d)), misconceptionId: "DIVIDE_BY_COMPLETE_DENOMINATOR" },
      { value: math(String(Math.max(2, f.d / rest))), misconceptionId: "REMOVE_TWO_FIVE_PART" },
      { value: math(String(Math.max(2, rest + 1))), misconceptionId: "NEARBY_DIVISOR_GUESS" },
    ],
    hiddenState: { n: f.n, d: f.d },
    concept: "The denominator must lose every prime factor other than 2 and 5.",
    solution: [`In ${math(String(f.d))}, the complete non-${math("2,5")} factor is ${math(String(rest))}.`, `Dividing the denominator by ${math(String(rest))} is the least valid removal.`],
  };
}

const exponentCases = [
  { unknown: "a", fixed: 1, places: 3 }, { unknown: "a", fixed: 2, places: 4 }, { unknown: "a", fixed: 1, places: 5 },
  { unknown: "b", fixed: 1, places: 3 }, { unknown: "b", fixed: 2, places: 4 }, { unknown: "b", fixed: 2, places: 5 },
] as const;

function p015(seed: number): Draft {
  const c = choose(seed, exponentCases, 15);
  const unknownIsA = c.unknown === "a";
  const answer = c.places;
  const denominator = unknownIsA ? `2^a\\times5^{${c.fixed}}` : `2^{${c.fixed}}\\times5^b`;
  return {
    answerSemantic: "INTEGER", difficulty: "MEDIUM",
    stem: `The fraction ${math(`\\frac{1}{${denominator}}`)} has an exact terminating decimal with ${math(String(c.places))} decimal places. Find ${math(c.unknown)}.`,
    correct: math(String(answer)),
    wrong: [
      { value: math(String(c.fixed)), misconceptionId: "COPY_FIXED_EXPONENT" },
      { value: math(String(c.places - 1)), misconceptionId: "ONE_LESS_THAN_PLACES" },
      { value: math(String(c.places + 1)), misconceptionId: "ONE_MORE_THAN_PLACES" },
    ],
    hiddenState: { unknown: c.unknown, fixed: c.fixed, places: c.places },
    concept: `For denominator ${math("2^a5^b")}, the decimal-place count is ${math("\\max(a,b)")}.`,
    solution: [`The fixed exponent ${math(String(c.fixed))} is smaller than ${math(String(c.places))}.`, `Therefore the unknown exponent itself must be ${math(String(c.places))}.`],
  };
}

const powerTenFractions = [rational(3, 8), rational(7, 40), rational(11, 16), rational(13, 125), rational(17, 250), rational(19, 32)] as const;
function p016(seed: number): Draft {
  const f = choose(seed, powerTenFractions, 16);
  const k = terminatingPlaces(f)!;
  return {
    answerSemantic: "INTEGER", difficulty: k <= 2 ? "EASY" : "MEDIUM",
    stem: `Find the least non-negative integer ${math("k")} for which ${math(`10^k\\times${fractionBody(f)}`)} is an integer.`,
    correct: math(String(k)),
    wrong: [
      { value: math(String(Math.max(0, k - 1))), misconceptionId: "POWER_ONE_LOW" },
      { value: math(String(k + 1)), misconceptionId: "POWER_ONE_HIGH" },
      { value: math(String(f.d)), misconceptionId: "USE_DENOMINATOR_AS_POWER" },
    ],
    hiddenState: { n: f.n, d: f.d },
    concept: "The least such power equals the number of places in the exact terminating decimal.",
    solution: [`${fractionLatex(f)} needs ${math(String(k))} decimal place${k === 1 ? "" : "s"}.`, `Hence ${math(`10^{${k}}`)} is the least power of ${math("10")} that clears its denominator.`],
  };
}

const boundedCases = [
  { numerator: 3, maxD: 20 }, { numerator: 6, maxD: 24 }, { numerator: 7, maxD: 25 }, { numerator: 10, maxD: 30 },
  { numerator: 12, maxD: 30 }, { numerator: 15, maxD: 35 }, { numerator: 21, maxD: 36 },
] as const;

function p017(seed: number): Draft {
  const c = choose(seed, boundedCases, 17);
  const set = boundedDenominators(c.numerator, c.maxD);
  const count = set.length;
  return {
    answerSemantic: "COUNT", difficulty: "HARD",
    stem: `For how many integers ${math("d")} with ${math(`2\\le d\\le${c.maxD}`)} does ${math(`\\frac{${c.numerator}}{d}`)} have a terminating decimal expansion after reduction?`,
    correct: math(String(count)),
    wrong: [
      { value: math(String(count - 1)), misconceptionId: "MISS_ONE_CANCELLED_DENOMINATOR" },
      { value: math(String(count + 1)), misconceptionId: "INCLUDE_ONE_NONTERMINATING_DENOMINATOR" },
      { value: math(String(Math.max(1, count - 2))), misconceptionId: "IGNORE_NUMERATOR_CANCELLATION" },
    ],
    hiddenState: { numerator: c.numerator, maxD: c.maxD },
    concept: "Each denominator must be tested after cancelling its common factors with the numerator.",
    solution: [`The valid denominators are ${setLatex(set)}.`, `There are ${math(String(count))} such denominators.`],
  };
}

function p018(seed: number): Draft {
  const c = choose(seed, boundedCases.slice(0, 5), 18);
  const set = boundedDenominators(c.numerator, c.maxD);
  const correct = setLatex(set);
  const dropLast = setLatex(set.slice(0, -1));
  const addBad = (() => {
    const bad = Array.from({ length: c.maxD - 1 }, (_, i) => i + 2).find((d) => !set.includes(d))!;
    return setLatex([...set.slice(0, Math.max(0, set.length - 1)), bad].sort((a, b) => a - b));
  })();
  const noCancellation = Array.from({ length: c.maxD - 1 }, (_, i) => i + 2).filter((d) => terminates(rational(1, d)));
  return {
    answerSemantic: "DENOMINATOR_SET", difficulty: "HARD",
    stem: `Which option gives the complete set of integers ${math("d")} with ${math(`2\\le d\\le${c.maxD}`)} for which ${math(`\\frac{${c.numerator}}{d}`)} terminates after reduction?`,
    correct,
    wrong: [
      { value: dropLast, misconceptionId: "INCOMPLETE_VALID_SET" },
      { value: addBad, misconceptionId: "INCLUDE_NONTERMINATING_DENOMINATOR" },
      { value: setLatex(noCancellation), misconceptionId: "IGNORE_NUMERATOR_CANCELLATION" },
    ],
    hiddenState: { numerator: c.numerator, maxD: c.maxD },
    concept: "Cancellation by the numerator can turn some apparently non-terminating denominators into terminating ones.",
    solution: [`Reduce ${math(`\\frac{${c.numerator}}{d}`)} separately for each allowed ${math("d")}.`, `The complete valid set is ${correct}.`],
  };
}

const numeratorCases = [
  { d: 42, correct: 21, wrong: [3, 7, 14] },
  { d: 63, correct: 63, wrong: [3, 7, 21] },
  { d: 84, correct: 21, wrong: [3, 7, 14] },
  { d: 90, correct: 9, wrong: [3, 5, 15] },
  { d: 126, correct: 63, wrong: [7, 9, 21] },
] as const;
function p019(seed: number): Draft {
  const c = choose(seed, numeratorCases, 19);
  return {
    answerSemantic: "INTEGER", difficulty: "MEDIUM",
    stem: `Which numerator ${math("n")} makes ${math(`\\frac{n}{${c.d}}`)} a terminating decimal after reduction?`,
    correct: math(String(c.correct)),
    wrong: c.wrong.map((value, i) => ({ value: math(String(value)), misconceptionId: `INCOMPLETE_BAD_FACTOR_CANCELLATION_${i + 1}` })),
    hiddenState: { d: c.d, candidates: [c.correct, ...c.wrong] },
    concept: "The numerator must cancel every denominator prime factor other than 2 and 5.",
    solution: [`The non-${math("2,5")} part of ${math(String(c.d))} must disappear on reduction.`, `${math(String(c.correct))} cancels all of that part; the other options do not.`],
  };
}

const cycleFractions = [rational(1, 7), rational(2, 7), rational(1, 13), rational(5, 27), rational(7, 33), rational(4, 37)] as const;
function p020(seed: number): Draft {
  const f = choose(seed, cycleFractions, 20);
  const cycle = decimalCycle(f, 50);
  if (!cycle.repeating || cycle.repeating.length < 2) throw new Error("missing-digit family needs nontrivial repeat");
  const position = idx(seed, cycle.repeating.length, 21);
  const digit = Number(cycle.repeating[position]);
  const shown = cycle.repeating.split(""); shown[position] = "?";
  const wrongDigits = [0,1,2,3,4,5,6,7,8,9].filter((x) => x !== digit);
  return {
    answerSemantic: "DIGIT", difficulty: "MEDIUM",
    stem: `The exact decimal expansion of ${fractionLatex(f)} is ${math(`0.${cycle.nonRepeating}\\overline{${shown.join("")}}`)}. Find the missing digit.`,
    correct: math(String(digit)),
    wrong: [0,1,2].map((offset, i) => ({ value: math(String(wrongDigits[(idx(seed, wrongDigits.length, 30 + i) + offset) % wrongDigits.length]!)), misconceptionId: `WRONG_CYCLE_DIGIT_${i + 1}` })),
    hiddenState: { n: f.n, d: f.d, position },
    concept: "The marked block is fixed by the exact remainder cycle of long division.",
    solution: [`Long division of ${fractionLatex(f)} gives the repeating block ${math(`\\overline{${cycle.repeating}}`)}.`, `The missing digit is ${math(String(digit))}.`],
  };
}

const periodFractions = [rational(1, 6), rational(1, 7), rational(2, 11), rational(1, 12), rational(1, 13), rational(5, 21), rational(1, 27), rational(3, 28), rational(7, 33)] as const;
function p021(seed: number): Draft {
  const f = choose(seed, periodFractions, 21);
  const cycle = decimalCycle(f, 60);
  const length = cycle.repeating.length;
  if (length < 1) throw new Error("period family must recur");
  const candidates = [Math.max(1, length - 1), length + 1, Math.max(1, cycle.nonRepeating.length + length)]
    .filter((x, i, all) => x !== length && all.indexOf(x) === i);
  while (candidates.length < 3) candidates.push(length + candidates.length + 2);
  return {
    answerSemantic: "COUNT", difficulty: length >= 3 ? "HARD" : "MEDIUM",
    stem: `What is the length of the repeating block in the exact decimal expansion of ${fractionLatex(f)}?`,
    correct: math(String(length)),
    wrong: candidates.slice(0, 3).map((value, i) => ({ value: math(String(value)), misconceptionId: i === 2 ? "COUNT_NONREPEATING_PREFIX" : `PERIOD_LENGTH_${i === 0 ? "LOW" : "HIGH"}` })),
    hiddenState: { n: f.n, d: f.d },
    concept: "A repeating block ends when long division returns to a remainder already seen.",
    solution: [`The exact remainder cycle gives ${math(`0.${cycle.nonRepeating}\\overline{${cycle.repeating}}`)}.`, `The repeating block has ${math(String(length))} digit${length === 1 ? "" : "s"}.`],
  };
}

const ninesCases = [
  { whole: 0, prefix: "2", terminating: "0.3" },
  { whole: 0, prefix: "24", terminating: "0.25" },
  { whole: 1, prefix: "4", terminating: "1.5" },
  { whole: 2, prefix: "07", terminating: "2.08" },
  { whole: 3, prefix: "124", terminating: "3.125" },
] as const;
function p022(seed: number): Draft {
  const c = choose(seed, ninesCases, 22);
  const recurring = `${c.whole}.${c.prefix}\\overline{9}`;
  const correct = math(c.terminating);
  const wrongBase = Number(c.terminating);
  const places = c.terminating.split(".")[1]?.length ?? 0;
  const unit = 10 ** -Math.max(1, places);
  return {
    answerSemantic: "DECIMAL_REPRESENTATION", difficulty: "EASY",
    stem: `Which terminating decimal is exactly equal to ${math(recurring)}?`,
    correct,
    wrong: [
      { value: math(`${c.whole}.${c.prefix}9`), misconceptionId: "TREAT_RECURRING_NINE_AS_SINGLE_NINE" },
      { value: math((wrongBase - unit).toFixed(places)), misconceptionId: "KEEP_VALUE_BELOW_LIMIT" },
      { value: math((wrongBase + unit).toFixed(places)), misconceptionId: "OVERSHOOT_NEXT_TERMINATING_VALUE" },
    ],
    hiddenState: { recurring, terminating: c.terminating },
    concept: `${math("0.\\overline{9}=1")}; a tail of recurring 9s reaches the next terminating decimal exactly.`,
    solution: [`The recurring ${math("9")} tail fills the remaining gap to the next terminating value.`, `So ${math(recurring)} ${math(`=${c.terminating}`)}.`],
  };
}

const drafts: Readonly<Record<NumCp002Wave02PrototypeId, (seed: number) => Draft>> = {
  "NUM-CP002-PROT-013": p013,
  "NUM-CP002-PROT-014": p014,
  "NUM-CP002-PROT-015": p015,
  "NUM-CP002-PROT-016": p016,
  "NUM-CP002-PROT-017": p017,
  "NUM-CP002-PROT-018": p018,
  "NUM-CP002-PROT-019": p019,
  "NUM-CP002-PROT-020": p020,
  "NUM-CP002-PROT-021": p021,
  "NUM-CP002-PROT-022": p022,
};

export function independentlyVerifyNumCp002Wave02(id: NumCp002Wave02PrototypeId, s: Readonly<Record<string, unknown>>): string {
  const h = s as any;
  switch (id) {
    case "NUM-CP002-PROT-013": return math(String(leastMultiplierBrute(rational(Number(h.n), Number(h.d)))));
    case "NUM-CP002-PROT-014": return math(String(leastDenominatorDivisorBrute(rational(Number(h.n), Number(h.d)))));
    case "NUM-CP002-PROT-015": {
      const matches: number[] = [];
      for (let x = 0; x <= 9; x += 1) {
        const d = h.unknown === "a" ? 2 ** x * 5 ** Number(h.fixed) : 2 ** Number(h.fixed) * 5 ** x;
        if (terminatingPlaces(rational(1, d)) === Number(h.places)) matches.push(x);
      }
      if (matches.length !== 1) throw new Error(`P015 non-unique inverse: ${matches}`);
      return math(String(matches[0]));
    }
    case "NUM-CP002-PROT-016": {
      const f = rational(Number(h.n), Number(h.d));
      for (let k = 0; k <= 12; k += 1) if ((f.n * 10 ** k) % f.d === 0) return math(String(k));
      throw new Error("P016 verifier no k");
    }
    case "NUM-CP002-PROT-017": return math(String(boundedDenominators(Number(h.numerator), Number(h.maxD)).length));
    case "NUM-CP002-PROT-018": return setLatex(boundedDenominators(Number(h.numerator), Number(h.maxD)));
    case "NUM-CP002-PROT-019": {
      const d = Number(h.d);
      const valid = (h.candidates as number[]).filter((n) => terminates(rational(n, d)));
      if (valid.length !== 1) throw new Error(`P019 valid candidates ${valid}`);
      return math(String(valid[0]));
    }
    case "NUM-CP002-PROT-020": {
      const cycle = decimalCycle(rational(Number(h.n), Number(h.d)), 60);
      return math(String(Number(cycle.repeating[Number(h.position)])));
    }
    case "NUM-CP002-PROT-021": return math(String(decimalCycle(rational(Number(h.n), Number(h.d)), 60).repeating.length));
    case "NUM-CP002-PROT-022": return math(String(h.terminating));
  }
}

export function generateNumCp002Wave02(id: NumCp002Wave02PrototypeId, seed: number): NumCp002Wave02Package {
  if (!Number.isInteger(seed) || seed < 0) throw new Error("seed must be non-negative integer");
  const prototypeIndex = NUM_CP002_WAVE02_PROTOTYPE_IDS.indexOf(id);
  if (prototypeIndex < 0) throw new Error(`Unknown Wave02 prototype ${id}`);
  const d = drafts[id](seed);
  const { options, correctIndex } = place(d.correct, d.wrong, seed, 50 + prototypeIndex);
  const verifierAnswer = independentlyVerifyNumCp002Wave02(id, d.hiddenState);
  if (verifierAnswer !== d.correct) throw new Error(`${id}: verifier ${verifierAnswer} != ${d.correct}`);
  return Object.freeze({
    packageId: "NUM-001", checkpointId: "NUM-CP-002", temporaryPrototypeId: id, permanentQlId: null,
    seed, locale: "en-IN", difficulty: d.difficulty, answerSemantic: d.answerSemantic,
    stem: d.stem, options, correctIndex, canonicalAnswer: d.correct, verifierAnswer,
    hiddenState: Object.freeze({ ...d.hiddenState }), sourceAncestry: NUM_CP002_WAVE02_SOURCE_ANCESTRY[id],
    mathematicalFingerprint: `${id}:${JSON.stringify(d.hiddenState)}`,
    explanation: Object.freeze({ concept: d.concept, solution: Object.freeze([...d.solution]), finalAnswer: d.correct }), lifecycle,
  });
}

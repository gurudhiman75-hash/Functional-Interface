import {
  compareRational,
  decimalDigitsToRational,
  denominatorPrimeProfile,
  fractionBody,
  fractionLatex,
  gcd,
  mixedRecurringToRational,
  pureRecurringToRational,
  rational,
  recurringLatex,
  terminatingDecimal,
  terminatingPlaces,
  terminates,
  type Rational,
} from "./exact";
import { NUM_CP002_WAVE01_SOURCE_ANCESTRY } from "./source-registry";
import {
  NUM_CP002_WAVE01_PROTOTYPE_IDS,
  type NumCp002AnswerSemantic,
  type NumCp002Difficulty,
  type NumCp002Option,
  type NumCp002Wave01Package,
  type NumCp002Wave01PrototypeId,
} from "./types";

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

function index(seed: number, size: number, salt = 0): number {
  const x = Math.imul((seed + 1) ^ (salt * 0x9e3779b9), 2654435761) >>> 0;
  return x % size;
}

function choose<T>(seed: number, values: readonly T[], salt = 0): T {
  return values[index(seed, values.length, salt)]!;
}

function math(body: string): string { return `\\(${body}\\)`; }

function mixedLatex(whole: number, numerator: number, denominator: number): string {
  if (numerator === 0) return math(String(whole));
  return math(`${whole}\\frac{${numerator}}{${denominator}}`);
}

function decimalLatex(value: string): string { return math(value); }

function placeOptions(correct: string, distractors: readonly { value: string; misconceptionId: string }[], correctIndex: number): readonly NumCp002Option[] {
  const uniqueWrong = distractors.filter((entry, i, all) => entry.value !== correct && all.findIndex((x) => x.value === entry.value) === i).slice(0, 3);
  if (uniqueWrong.length !== 3) throw new Error(`Need three unique distractors for ${correct}`);
  const options: NumCp002Option[] = uniqueWrong.map((x) => ({ ...x, isCorrect: false }));
  options.splice(correctIndex, 0, { value: correct, isCorrect: true });
  return Object.freeze(options);
}

function difficulty(seed: number, prototypeIndex: number): NumCp002Difficulty {
  const band = (seed + prototypeIndex) % 3;
  return band === 0 ? "EASY" : band === 1 ? "MEDIUM" : "HARD";
}

interface Draft {
  answerSemantic: NumCp002AnswerSemantic;
  stem: string;
  correct: string;
  distractors: readonly { value: string; misconceptionId: string }[];
  hiddenState: Record<string, unknown>;
  concept?: string;
  solution: readonly string[];
}

const reducedPairs = [
  [2, 3], [3, 5], [5, 8], [7, 9], [7, 12], [11, 15], [13, 20], [17, 24],
] as const;

function prototype001(seed: number): Draft {
  const [rn, rd] = choose(seed, reducedPairs, 1);
  const factor = choose(seed, [2, 3, 4, 5, 6, 8, 9] as const, 2);
  const n = rn * factor, d = rd * factor;
  const correct = fractionLatex(rational(n, d));
  return {
    answerSemantic: "REDUCED_FRACTION",
    stem: `Reduce ${math(`\\frac{${n}}{${d}}`)} to lowest terms.`,
    correct,
    distractors: [
      { value: math(`\\frac{${rn}}{${d}}`), misconceptionId: "DIVIDE_NUMERATOR_ONLY" },
      { value: math(`\\frac{${n}}{${rd}}`), misconceptionId: "DIVIDE_DENOMINATOR_ONLY" },
      { value: math(`\\frac{${rn + 1}}{${rd}}`), misconceptionId: "INCOMPLETE_REDUCTION" },
    ],
    hiddenState: { n, d },
    concept: "A fraction is in lowest terms when numerator and denominator have no common factor greater than 1.",
    solution: [`${math(`\\gcd(${n},${d})=${factor}`)}.`, `${math(`\\frac{${n}\\div${factor}}{${d}\\div${factor}}=\\frac{${rn}}{${rd}}`)}.`],
  };
}

function conversionState(seed: number) {
  const d = choose(seed, [3, 4, 5, 7, 8, 9, 11] as const, 3);
  let r = choose(seed, [1, 2, 3, 4, 5, 6] as const, 4) % d;
  if (r === 0) r = 1;
  while (gcd(r, d) !== 1) r = (r % (d - 1)) + 1;
  const q = choose(seed, [2, 3, 4, 5, 6, 7] as const, 5);
  return { q, r, d, n: q * d + r };
}

function prototype002(seed: number): Draft {
  const { q, r, d, n } = conversionState(seed);
  const correct = mixedLatex(q, r, d);
  return {
    answerSemantic: "MIXED_FRACTION",
    stem: `Express ${math(`\\frac{${n}}{${d}}`)} as a mixed fraction.`,
    correct,
    distractors: [
      { value: mixedLatex(q + 1, r, d), misconceptionId: "QUOTIENT_ONE_HIGH" },
      { value: mixedLatex(q, d - r, d), misconceptionId: "COMPLEMENT_REMAINDER" },
      { value: mixedLatex(q - 1, r, d), misconceptionId: "QUOTIENT_ONE_LOW" },
    ],
    hiddenState: { n, d },
    solution: [`${math(`${n}=${q}\\times${d}+${r}`)}.`, `So ${math(`\\frac{${n}}{${d}}=${q}\\frac{${r}}{${d}}`)}.`],
  };
}

function prototype003(seed: number): Draft {
  const { q, r, d, n } = conversionState(seed);
  const correct = fractionLatex(rational(n, d));
  return {
    answerSemantic: "IMPROPER_FRACTION",
    stem: `Convert ${mixedLatex(q, r, d)} to an improper fraction.`,
    correct,
    distractors: [
      { value: math(`\\frac{${q + r}}{${d}}`), misconceptionId: "ADD_WHOLE_AND_NUMERATOR" },
      { value: math(`\\frac{${q * d - r}}{${d}}`), misconceptionId: "SUBTRACT_REMAINDER" },
      { value: math(`\\frac{${q * d + r + 1}}{${d}}`), misconceptionId: "OFF_BY_ONE_NUMERATOR" },
    ],
    hiddenState: { q, r, d },
    solution: [`${math(`${q}\\times${d}+${r}=${n}`)}.`, `Therefore the fraction is ${math(`\\frac{${n}}{${d}}`)}.`],
  };
}

const terminatingDecimalCases = [
  { display: "0.375", whole: 0, digits: 375, places: 3 },
  { display: "1.25", whole: 1, digits: 25, places: 2 },
  { display: "2.125", whole: 2, digits: 125, places: 3 },
  { display: "0.045", whole: 0, digits: 45, places: 3 },
  { display: "3.04", whole: 3, digits: 4, places: 2 },
  { display: "0.008", whole: 0, digits: 8, places: 3 },
] as const;

function prototype004(seed: number): Draft {
  const c = choose(seed, terminatingDecimalCases, 6);
  const value = decimalDigitsToRational(c.whole, c.digits, c.places);
  const correct = fractionLatex(value);
  const scale = 10 ** c.places;
  const unreducedN = c.whole * scale + c.digits;
  return {
    answerSemantic: "REDUCED_FRACTION",
    stem: `Convert ${decimalLatex(c.display)} to a fraction in lowest terms.`,
    correct,
    distractors: [
      { value: fractionLatex(rational(unreducedN, scale * 10)), misconceptionId: "PLACE_VALUE_ONE_EXTRA_ZERO" },
      { value: fractionLatex(rational(unreducedN, scale / 10)), misconceptionId: "PLACE_VALUE_ONE_ZERO_SHORT" },
      { value: math(`\\frac{${Math.abs(unreducedN)}}{${scale}}`), misconceptionId: "NOT_REDUCED" },
    ],
    hiddenState: { whole: c.whole, digits: c.digits, places: c.places },
    concept: "Write the decimal over the matching power of 10, then reduce.",
    solution: [`${decimalLatex(c.display)} ${math(`=\\frac{${unreducedN}}{${scale}}`)}.`, `Reducing gives ${correct}.`],
  };
}

const pureBlocks = [
  { block: 3, digits: 1 }, { block: 6, digits: 1 }, { block: 9, digits: 1 },
  { block: 27, digits: 2 }, { block: 45, digits: 2 }, { block: 72, digits: 2 },
] as const;

function prototype005(seed: number): Draft {
  const c = choose(seed, pureBlocks, 7);
  const value = pureRecurringToRational(c.block, c.digits);
  const denom = 10 ** c.digits - 1;
  const correct = fractionLatex(value);
  return {
    answerSemantic: "REDUCED_FRACTION",
    stem: `Convert ${math(`0.\\overline{${String(c.block).padStart(c.digits, "0")}}`)} to a fraction in lowest terms.`,
    correct,
    distractors: [
      { value: fractionLatex(rational(c.block, 10 ** c.digits)), misconceptionId: "TREAT_RECURRING_AS_TERMINATING" },
      { value: fractionLatex(rational(c.block, 10 ** c.digits + 1)), misconceptionId: "USE_POWER_PLUS_ONE" },
      { value: fractionLatex(rational(Math.max(1, c.block - 1), denom)), misconceptionId: "REPEATING_BLOCK_ONE_LOW" },
    ],
    hiddenState: { block: c.block, digits: c.digits },
    concept: "For a pure recurring block of length k, subtraction produces a denominator of k nines.",
    solution: [`Let ${math("x=0.\\overline{" + String(c.block).padStart(c.digits, "0") + "}")}.`, `${math(`${denom}x=${c.block}`)}, so ${math(`x=${fractionBody(value)}`)}.`],
  };
}

const mixedRecurringCases = [
  { prefix: 1, prefixDigits: 1, block: 6, blockDigits: 1 },
  { prefix: 2, prefixDigits: 1, block: 7, blockDigits: 1 },
  { prefix: 5, prefixDigits: 1, block: 4, blockDigits: 1 },
  { prefix: 12, prefixDigits: 2, block: 3, blockDigits: 1 },
  { prefix: 58, prefixDigits: 2, block: 3, blockDigits: 1 },
  { prefix: 14, prefixDigits: 2, block: 27, blockDigits: 2 },
] as const;

function prototype006(seed: number): Draft {
  const c = choose(seed, mixedRecurringCases, 8);
  const value = mixedRecurringToRational(c.prefix, c.prefixDigits, c.block, c.blockDigits);
  const prefixText = String(c.prefix).padStart(c.prefixDigits, "0");
  const blockText = String(c.block).padStart(c.blockDigits, "0");
  const full = c.prefix * 10 ** c.blockDigits + c.block;
  const denominator = 10 ** (c.prefixDigits + c.blockDigits) - 10 ** c.prefixDigits;
  const correct = fractionLatex(value);
  return {
    answerSemantic: "REDUCED_FRACTION",
    stem: `Convert ${math(`0.${prefixText}\\overline{${blockText}}`)} to a fraction in lowest terms.`,
    correct,
    distractors: [
      { value: fractionLatex(rational(full, 10 ** (c.prefixDigits + c.blockDigits))), misconceptionId: "TREAT_ALL_DIGITS_AS_TERMINATING" },
      { value: fractionLatex(rational(c.block, 10 ** c.blockDigits - 1)), misconceptionId: "IGNORE_NONREPEATING_PREFIX" },
      { value: fractionLatex(rational(full - c.prefix, 10 ** (c.prefixDigits + c.blockDigits) - 1)), misconceptionId: "ALL_NINES_DENOMINATOR" },
    ],
    hiddenState: { prefix: c.prefix, prefixDigits: c.prefixDigits, block: c.block, blockDigits: c.blockDigits },
    concept: "Shift past the recurring block and subtract a shift that ends just before it.",
    solution: [`The subtraction gives ${math(`${denominator}x=${full}-${c.prefix}=${full - c.prefix}`)}.`, `Hence ${math(`x=${fractionBody(value)}`)}.`],
  };
}

const terminatingFractions = [
  rational(3, 8), rational(7, 20), rational(17, 40), rational(9, 125), rational(11, 16), rational(23, 25), rational(31, 50),
] as const;

function prototype007(seed: number): Draft {
  const value = choose(seed, terminatingFractions, 9);
  const decimal = terminatingDecimal(value);
  const correct = decimalLatex(decimal);
  const numeric = Number(decimal);
  const places = terminatingPlaces(value)!;
  return {
    answerSemantic: "DECIMAL_REPRESENTATION",
    stem: `Express ${fractionLatex(value)} as an exact decimal.`,
    correct,
    distractors: [
      { value: decimalLatex((numeric + 10 ** -places).toFixed(places)), misconceptionId: "LAST_DIGIT_ONE_HIGH" },
      { value: decimalLatex(Math.max(0, numeric - 10 ** -places).toFixed(places)), misconceptionId: "LAST_DIGIT_ONE_LOW" },
      { value: decimalLatex((value.n / (value.d * 10)).toFixed(places + 1)), misconceptionId: "DENOMINATOR_EXTRA_ZERO" },
    ],
    hiddenState: { n: value.n, d: value.d },
    solution: [`Since the reduced denominator has only factors ${math("2")} and ${math("5")}, the decimal terminates.`, `${fractionLatex(value)} ${math(`=${decimal}`)}.`],
  };
}

const recurringFractions = [
  rational(1, 3), rational(5, 6), rational(2, 11), rational(5, 12), rational(4, 7), rational(7, 15), rational(8, 27),
] as const;

function prototype008(seed: number): Draft {
  const value = choose(seed, recurringFractions, 10);
  const correct = recurringLatex(value);
  const wrongPool = [math("0.\\overline{3}"), math("0.8\\overline{3}"), math("0.\\overline{18}"), math("0.41\\overline{6}"), math("0.\\overline{571428}"), math("0.4\\overline{6}"), math("0.\\overline{296}")]
    .filter((x) => x !== correct);
  return {
    answerSemantic: "DECIMAL_REPRESENTATION",
    stem: `Which is the exact decimal representation of ${fractionLatex(value)}?`,
    correct,
    distractors: wrongPool.slice(index(seed, wrongPool.length, 11)).concat(wrongPool).filter((x, i, all) => all.indexOf(x) === i).slice(0, 3).map((value, i) => ({ value, misconceptionId: `WRONG_REPETEND_${i + 1}` })),
    hiddenState: { n: value.n, d: value.d },
    concept: "A recurring decimal is determined by the repeating remainder cycle in exact long division.",
    solution: [`Exact long division of ${fractionLatex(value)} repeats a remainder.`, `The repeating decimal is ${correct}.`],
  };
}

const compareCases = [
  [rational(5, 7), rational(7, 10)], [rational(7, 12), rational(5, 8)], [rational(9, 14), rational(18, 28)],
  [rational(11, 15), rational(8, 11)], [rational(13, 20), rational(2, 3)], [rational(17, 24), rational(7, 10)],
] as const;

function relation(a: Rational, b: Rational): string {
  const c = compareRational(a, b);
  return c < 0 ? math("<") : c > 0 ? math(">") : math("=");
}

function prototype009(seed: number): Draft {
  const [a, b] = choose(seed, compareCases, 12);
  const correct = relation(a, b);
  const left = a.n * b.d, right = b.n * a.d;
  return {
    answerSemantic: "COMPARISON_RELATION",
    stem: `Choose the correct relation between ${fractionLatex(a)} and ${fractionLatex(b)}.`,
    correct,
    distractors: [math("<"), math(">"), math("=")].filter((x) => x !== correct).map((value, i) => ({ value, misconceptionId: i === 0 ? "REVERSED_COMPARISON" : "FALSE_EQUALITY" })).concat([{ value: "Cannot be determined", misconceptionId: "AVOID_EXACT_COMPARISON" }]).slice(0, 3),
    hiddenState: { aN: a.n, aD: a.d, bN: b.n, bD: b.d },
    concept: "Compare fractions by exact cross-products; no decimal rounding is needed.",
    solution: [`${math(`${a.n}\\times${b.d}=${left}`)} and ${math(`${b.n}\\times${a.d}=${right}`)}.`, `Therefore ${fractionLatex(a)} ${correct} ${fractionLatex(b)}.`],
  };
}

interface OrderEntry { readonly display: string; readonly value: Rational }
const orderSets: readonly (readonly OrderEntry[])[] = [
  [
    { display: math("\\frac{2}{3}"), value: rational(2, 3) },
    { display: math("0.65"), value: rational(13, 20) },
    { display: math("\\frac{5}{8}"), value: rational(5, 8) },
  ],
  [
    { display: math("0.7"), value: rational(7, 10) },
    { display: math("0.\\overline{6}"), value: rational(2, 3) },
    { display: math("\\frac{11}{16}"), value: rational(11, 16) },
  ],
  [
    { display: math("\\frac{7}{12}"), value: rational(7, 12) },
    { display: math("0.58"), value: rational(29, 50) },
    { display: math("0.5\\overline{8}"), value: rational(53, 90) },
  ],
  [
    { display: math("\\frac{9}{14}"), value: rational(9, 14) },
    { display: math("0.64"), value: rational(16, 25) },
    { display: math("0.6\\overline{3}"), value: rational(19, 30) },
  ],
];

function orderText(entries: readonly OrderEntry[], ascending: boolean): string {
  const sorted = [...entries].sort((x, y) => compareRational(x.value, y.value) * (ascending ? 1 : -1));
  const symbol = ascending ? "<" : ">";
  const bodies = sorted.map((e) => e.display.replace(/^\\\((.*)\\\)$/u, "$1"));
  return math(bodies.join(symbol));
}

function prototype010(seed: number): Draft {
  const entries = choose(seed, orderSets, 13);
  const ascending = seed % 2 === 0;
  const correct = orderText(entries, ascending);
  const perms = [
    [entries[1]!, entries[0]!, entries[2]!], [entries[2]!, entries[1]!, entries[0]!], [entries[0]!, entries[2]!, entries[1]!],
  ];
  return {
    answerSemantic: "ORDERED_LIST",
    stem: `Arrange ${entries.map((e) => e.display).join(", ")} in ${ascending ? "ascending" : "descending"} order.`,
    correct,
    distractors: perms.map((p, i) => ({ value: orderText(p, ascending), misconceptionId: `PAIRWISE_ORDER_ERROR_${i + 1}` })),
    hiddenState: { ascending, entries: entries.map((e) => ({ display: e.display, n: e.value.n, d: e.value.d })) },
    concept: "Compare all values exactly as rational numbers before ordering them.",
    solution: [`Convert or compare the three values exactly; do not round a recurring decimal.`, `The required order is ${correct}.`],
  };
}

const terminationCases = [
  [6, 15], [14, 35], [21, 30], [10, 24], [14, 42], [18, 48], [28, 70], [35, 84],
] as const;

function prototype011(seed: number): Draft {
  const [n, d] = choose(seed, terminationCases, 14);
  const reduced = rational(n, d);
  const isTerminating = terminates(reduced);
  const correct = isTerminating ? "Terminating" : "Non-terminating recurring";
  const p = denominatorPrimeProfile(reduced);
  return {
    answerSemantic: "DECIMAL_NATURE",
    stem: `What is the nature of the decimal expansion of ${math(`\\frac{${n}}{${d}}`)}?`,
    correct,
    distractors: ["Terminating", "Non-terminating recurring", "Non-terminating non-recurring", "Cannot be determined"].filter((x) => x !== correct).slice(0, 3).map((value, i) => ({ value, misconceptionId: `DECIMAL_NATURE_ERROR_${i + 1}` })),
    hiddenState: { n, d },
    concept: "Reduce first. A rational decimal terminates exactly when the reduced denominator has no prime factors other than 2 and 5.",
    solution: [`${math(`\\frac{${n}}{${d}}=${fractionBody(reduced)}`)}.`, p.rest === 1 ? `Its reduced denominator contains only ${math("2")} and/or ${math("5")}.` : `Its reduced denominator still contains the factor ${math(String(p.rest))} other than ${math("2")} or ${math("5")}.`],
  };
}

const placeCases = [rational(3, 8), rational(7, 40), rational(9, 125), rational(11, 32), rational(13, 20), rational(17, 250), rational(19, 16)] as const;

function prototype012(seed: number): Draft {
  const value = choose(seed, placeCases, 15);
  const places = terminatingPlaces(value)!;
  const p = denominatorPrimeProfile(value);
  const correct = math(String(places));
  const candidates = [Math.max(1, places - 1), places + 1, places + 2, Math.max(1, p.twos + p.fives)]
    .filter((x, i, all) => x !== places && all.indexOf(x) === i).slice(0, 3);
  while (candidates.length < 3) candidates.push(places + candidates.length + 2);
  return {
    answerSemantic: "COUNT",
    stem: `How many decimal places are required for the exact terminating decimal expansion of ${fractionLatex(value)}?`,
    correct,
    distractors: candidates.map((x, i) => ({ value: math(String(x)), misconceptionId: i === 0 ? "USE_SMALLER_EXPONENT" : i === 1 ? "ADD_ONE_PLACE" : "ADD_FACTOR_EXPONENTS" })),
    hiddenState: { n: value.n, d: value.d },
    concept: "For a reduced denominator ${math("2^a5^b")}, the exact terminating decimal needs ${math("\\max(a,b)")} places.",
    solution: [`${math(`${value.d}=2^{${p.twos}}\\times5^{${p.fives}}`)}.`, `So the required number of places is ${math(`\\max(${p.twos},${p.fives})=${places}`)}.`],
  };
}

const generators: Readonly<Record<NumCp002Wave01PrototypeId, (seed: number) => Draft>> = {
  "NUM-CP002-PROT-001": prototype001,
  "NUM-CP002-PROT-002": prototype002,
  "NUM-CP002-PROT-003": prototype003,
  "NUM-CP002-PROT-004": prototype004,
  "NUM-CP002-PROT-005": prototype005,
  "NUM-CP002-PROT-006": prototype006,
  "NUM-CP002-PROT-007": prototype007,
  "NUM-CP002-PROT-008": prototype008,
  "NUM-CP002-PROT-009": prototype009,
  "NUM-CP002-PROT-010": prototype010,
  "NUM-CP002-PROT-011": prototype011,
  "NUM-CP002-PROT-012": prototype012,
};

export function independentlyVerifyNumCp002Wave01(prototypeId: NumCp002Wave01PrototypeId, hiddenState: Readonly<Record<string, unknown>>): string {
  const s = hiddenState as any;
  switch (prototypeId) {
    case "NUM-CP002-PROT-001": return fractionLatex(rational(Number(s.n), Number(s.d)));
    case "NUM-CP002-PROT-002": {
      const n = Number(s.n), d = Number(s.d), q = Math.floor(n / d), r = n % d;
      return mixedLatex(q, r, d);
    }
    case "NUM-CP002-PROT-003": return fractionLatex(rational(Number(s.q) * Number(s.d) + Number(s.r), Number(s.d)));
    case "NUM-CP002-PROT-004": return fractionLatex(decimalDigitsToRational(Number(s.whole), Number(s.digits), Number(s.places)));
    case "NUM-CP002-PROT-005": return fractionLatex(pureRecurringToRational(Number(s.block), Number(s.digits)));
    case "NUM-CP002-PROT-006": return fractionLatex(mixedRecurringToRational(Number(s.prefix), Number(s.prefixDigits), Number(s.block), Number(s.blockDigits)));
    case "NUM-CP002-PROT-007": return decimalLatex(terminatingDecimal(rational(Number(s.n), Number(s.d))));
    case "NUM-CP002-PROT-008": return recurringLatex(rational(Number(s.n), Number(s.d)));
    case "NUM-CP002-PROT-009": return relation(rational(Number(s.aN), Number(s.aD)), rational(Number(s.bN), Number(s.bD)));
    case "NUM-CP002-PROT-010": {
      const entries = (s.entries as any[]).map((e) => ({ display: String(e.display), value: rational(Number(e.n), Number(e.d)) }));
      return orderText(entries, Boolean(s.ascending));
    }
    case "NUM-CP002-PROT-011": return terminates(rational(Number(s.n), Number(s.d))) ? "Terminating" : "Non-terminating recurring";
    case "NUM-CP002-PROT-012": return math(String(terminatingPlaces(rational(Number(s.n), Number(s.d)))));
  }
}

export function generateNumCp002Wave01(prototypeId: NumCp002Wave01PrototypeId, seed: number): NumCp002Wave01Package {
  if (!Number.isInteger(seed) || seed < 0) throw new Error("seed must be a non-negative integer");
  const prototypeIndex = NUM_CP002_WAVE01_PROTOTYPE_IDS.indexOf(prototypeId);
  if (prototypeIndex < 0) throw new Error(`Unknown prototype ${prototypeId}`);
  const draft = generators[prototypeId](seed);
  const correctIndex = index(seed, 4, prototypeIndex + 20);
  const options = placeOptions(draft.correct, draft.distractors, correctIndex);
  const verifierAnswer = independentlyVerifyNumCp002Wave01(prototypeId, draft.hiddenState);
  if (verifierAnswer !== draft.correct) throw new Error(`${prototypeId}: verifier disagreement ${verifierAnswer} != ${draft.correct}`);
  return Object.freeze({
    packageId: "NUM-001",
    checkpointId: "NUM-CP-002",
    temporaryPrototypeId: prototypeId,
    permanentQlId: null,
    seed,
    locale: "en-IN",
    difficulty: difficulty(seed, prototypeIndex),
    answerSemantic: draft.answerSemantic,
    stem: draft.stem,
    options,
    correctIndex,
    canonicalAnswer: draft.correct,
    verifierAnswer,
    hiddenState: Object.freeze({ ...draft.hiddenState }),
    sourceAncestry: NUM_CP002_WAVE01_SOURCE_ANCESTRY[prototypeId],
    mathematicalFingerprint: `${prototypeId}:${JSON.stringify(draft.hiddenState)}`,
    explanation: Object.freeze({ concept: draft.concept, solution: Object.freeze([...draft.solution]), finalAnswer: draft.correct }),
    lifecycle,
  });
}

export function generateAllNumCp002Wave01(seed: number): readonly NumCp002Wave01Package[] {
  return Object.freeze(NUM_CP002_WAVE01_PROTOTYPE_IDS.map((prototypeId) => generateNumCp002Wave01(prototypeId, seed)));
}

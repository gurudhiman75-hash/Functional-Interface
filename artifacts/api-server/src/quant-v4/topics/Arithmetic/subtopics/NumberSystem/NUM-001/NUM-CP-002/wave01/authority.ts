import { compareRational, rational, type Rational } from "./exact";
import { NUM_CP002_WAVE01_SOURCE_ANCESTRY } from "./source-registry";
import type { NumCp002Option, NumCp002Wave01Package, NumCp002Wave01PrototypeId } from "./types";
import { generateNumCp002Wave01, independentlyVerifyNumCp002Wave01 } from "./runtime";

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
  const sorted = [...entries].sort((a, b) => compareRational(a.value, b.value) * (ascending ? 1 : -1));
  const bodies = sorted.map((e) => e.display.replace(/^\\\((.*)\\\)$/u, "$1"));
  return math(bodies.join(ascending ? "<" : ">"));
}

function permutations<T>(values: readonly T[]): readonly (readonly T[])[] {
  if (values.length <= 1) return [values];
  return values.flatMap((value, index) => permutations(values.filter((_, i) => i !== index)).map((rest) => [value, ...rest]));
}

function fixedOrder(seed: number): NumCp002Wave01Package {
  const entries = orderSets[((seed * 7 + 3) >>> 0) % orderSets.length]!;
  const ascending = seed % 2 === 0;
  const correct = orderText(entries, ascending);
  const wrongs = permutations(entries).map((p) => orderText(p, ascending)).filter((value, index, all) => value !== correct && all.indexOf(value) === index).slice(0, 3);
  if (wrongs.length !== 3) throw new Error("NUM-CP002-PROT-010: insufficient order distractors");
  const correctIndex = ((seed * 11 + 1) >>> 0) % 4;
  const options: NumCp002Option[] = wrongs.map((value, i) => ({ value, isCorrect: false, misconceptionId: `PAIRWISE_ORDER_ERROR_${i + 1}` }));
  options.splice(correctIndex, 0, { value: correct, isCorrect: true });
  const hiddenState = Object.freeze({ ascending, entries: entries.map((e) => ({ display: e.display, n: e.value.n, d: e.value.d })) });
  const verifierAnswer = independentlyVerifyNumCp002Wave01("NUM-CP002-PROT-010", hiddenState);
  if (verifierAnswer !== correct) throw new Error("NUM-CP002-PROT-010 verifier disagreement");
  return Object.freeze({
    packageId: "NUM-001",
    checkpointId: "NUM-CP-002",
    temporaryPrototypeId: "NUM-CP002-PROT-010",
    permanentQlId: null,
    seed,
    locale: "en-IN",
    difficulty: seed % 3 === 0 ? "EASY" : seed % 3 === 1 ? "MEDIUM" : "HARD",
    answerSemantic: "ORDERED_LIST",
    stem: `Arrange ${entries.map((e) => e.display).join(", ")} in ${ascending ? "ascending" : "descending"} order.`,
    options: Object.freeze(options),
    correctIndex,
    canonicalAnswer: correct,
    verifierAnswer,
    hiddenState,
    sourceAncestry: NUM_CP002_WAVE01_SOURCE_ANCESTRY["NUM-CP002-PROT-010"],
    mathematicalFingerprint: `NUM-CP002-PROT-010:${JSON.stringify(hiddenState)}`,
    explanation: Object.freeze({
      concept: "Compare every value exactly; recurring decimals must not be rounded.",
      solution: Object.freeze(["Write the values on one exact rational scale.", `The required order is ${correct}.`]),
      finalAnswer: correct,
    }),
    lifecycle,
  });
}

export function generateNumCp002Wave01Authority(prototypeId: NumCp002Wave01PrototypeId, seed: number): NumCp002Wave01Package {
  return prototypeId === "NUM-CP002-PROT-010" ? fixedOrder(seed) : generateNumCp002Wave01(prototypeId, seed);
}

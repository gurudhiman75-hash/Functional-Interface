import { fractionBody, fractionLatex, rational } from "../wave01/exact";
import { NUM_CP002_WAVE03_SOURCE_ANCESTRY } from "./source-registry";
import { generateNumCp002Wave03Authority, independentlyVerifyNumCp002Wave03Authority } from "./authority";
import type { NumCp002Wave03Option, NumCp002Wave03Package, NumCp002Wave03PrototypeId } from "./types";

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
function idx(seed: number, size: number, salt = 0) { return (Math.imul((seed + 31) ^ Math.imul(salt + 13, 0x45d9f3b), 2654435761) >>> 0) % size; }

const betweenCases = [
  { a: rational(2, 5), b: rational(1, 2), c: rational(9, 20) },
  { a: rational(5, 8), b: rational(2, 3), c: rational(13, 20) },
  { a: rational(7, 12), b: rational(3, 5), c: rational(59, 100) },
  { a: rational(11, 20), b: rational(4, 7), c: rational(14, 25) },
] as const;

function fixedBetween(seed: number): NumCp002Wave03Package {
  const c = betweenCases[idx(seed, betweenCases.length, 23)]!;
  const correct = fractionLatex(c.c);
  const wrongValues = [fractionLatex(c.a), fractionLatex(c.b), fractionLatex(rational(c.b.n * 20 + c.b.d, c.b.d * 20))];
  const correctIndex = idx(seed, 4, 173);
  const options: NumCp002Wave03Option[] = wrongValues.map((value, i) => ({ value, isCorrect: false, misconceptionId: `BOUNDARY_ERROR_${i + 1}` }));
  options.splice(correctIndex, 0, { value: correct, isCorrect: true });
  const hiddenState = Object.freeze({ aN: c.a.n, aD: c.a.d, bN: c.b.n, bD: c.b.d, cN: c.c.n, cD: c.c.d });
  const verifierAnswer = independentlyVerifyNumCp002Wave03Authority("NUM-CP002-PROT-023", hiddenState);
  if (verifierAnswer !== correct) throw new Error("P023 verifier disagreement");
  return Object.freeze({
    packageId: "NUM-001", checkpointId: "NUM-CP-002", temporaryPrototypeId: "NUM-CP002-PROT-023", permanentQlId: null,
    seed, locale: "en-IN", difficulty: "MEDIUM", answerSemantic: "RATIONAL",
    stem: `Which of the following lies strictly between ${fractionLatex(c.a)} and ${fractionLatex(c.b)}?`,
    options: Object.freeze(options), correctIndex, canonicalAnswer: correct, verifierAnswer, hiddenState,
    sourceAncestry: NUM_CP002_WAVE03_SOURCE_ANCESTRY["NUM-CP002-PROT-023"],
    mathematicalFingerprint: `NUM-CP002-PROT-023:${JSON.stringify(hiddenState)}`,
    explanation: Object.freeze({ concept: "A valid choice must be greater than the lower bound and smaller than the upper bound.", solution: Object.freeze([`${fractionLatex(c.a)} ${math("<")} ${correct} ${math("<")} ${fractionLatex(c.b)}.`]), finalAnswer: correct }), lifecycle,
  });
}

const denominatorCases = [
  { n: 5, target: rational(5, 9), display: math("0.\\overline{5}") },
  { n: 7, target: rational(7, 9), display: math("0.\\overline{7}") },
  { n: 4, target: rational(4, 9), display: math("0.\\overline{4}") },
  { n: 5, target: rational(1, 6), display: math("0.1\\overline{6}") },
  { n: 7, target: rational(7, 30), display: math("0.2\\overline{3}") },
] as const;

function fixedDenominator(seed: number): NumCp002Wave03Package {
  const c = denominatorCases[idx(seed, denominatorCases.length, 26)]!;
  const d = (c.n * c.target.d) / c.target.n;
  if (!Number.isInteger(d)) throw new Error("P026 denominator fixture is non-integer");
  const correct = math(String(d));
  const candidates = [d - 1, d + 1, Math.max(2, d - 2), d + 2, c.target.d, c.target.n].map(String).map(math).filter((v, i, a) => v !== correct && a.indexOf(v) === i).slice(0, 3);
  if (candidates.length !== 3) throw new Error("P026 insufficient distractors");
  const correctIndex = idx(seed, 4, 176);
  const options: NumCp002Wave03Option[] = candidates.map((value, i) => ({ value, isCorrect: false, misconceptionId: `DENOMINATOR_INVERSE_ERROR_${i + 1}` }));
  options.splice(correctIndex, 0, { value: correct, isCorrect: true });
  const hiddenState = Object.freeze({ n: c.n, targetN: c.target.n, targetD: c.target.d });
  const verifierAnswer = independentlyVerifyNumCp002Wave03Authority("NUM-CP002-PROT-026", hiddenState);
  if (verifierAnswer !== correct) throw new Error("P026 verifier disagreement");
  const targetBody = fractionBody(c.target);
  return Object.freeze({
    packageId: "NUM-001", checkpointId: "NUM-CP-002", temporaryPrototypeId: "NUM-CP002-PROT-026", permanentQlId: null,
    seed, locale: "en-IN", difficulty: "MEDIUM", answerSemantic: "INTEGER",
    stem: `If ${math(`\\frac{${c.n}}{d}`)} is exactly equal to ${c.display}, find the positive integer ${math("d")}.`,
    options: Object.freeze(options), correctIndex, canonicalAnswer: correct, verifierAnswer, hiddenState,
    sourceAncestry: NUM_CP002_WAVE03_SOURCE_ANCESTRY["NUM-CP002-PROT-026"], mathematicalFingerprint: `NUM-CP002-PROT-026:${JSON.stringify(hiddenState)}`,
    explanation: Object.freeze({ concept: "Convert the recurring decimal to its exact reduced fraction, then use equivalent fractions.", solution: Object.freeze([`${c.display} ${math(`=${targetBody}`)}.`, `${math(`\\frac{${c.n}}{d}=${targetBody}\\Rightarrow d=${d}`)}.`]), finalAnswer: correct }), lifecycle,
  });
}

const compoundCases = [
  { p2: 2, p5: 1, badPrime: 3, badExp: 2 },
  { p2: 1, p5: 3, badPrime: 7, badExp: 1 },
  { p2: 4, p5: 1, badPrime: 3, badExp: 3 },
  { p2: 2, p5: 2, badPrime: 11, badExp: 1 },
] as const;
function fixedCompound(seed: number): NumCp002Wave03Package {
  const c = compoundCases[idx(seed, compoundCases.length, 30)]!;
  const correct = math(String(c.badExp));
  const wrongValues = [Math.max(0, c.badExp - 1), c.badExp + 1, c.p2 + c.p5, c.badExp + 2, c.badPrime]
    .map(String).map(math).filter((v, i, a) => v !== correct && a.indexOf(v) === i).slice(0, 3);
  if (wrongValues.length !== 3) throw new Error("P030 insufficient distractors");
  const correctIndex = idx(seed, 4, 180);
  const options: NumCp002Wave03Option[] = wrongValues.map((value, i) => ({ value, isCorrect: false, misconceptionId: `TERMINATION_EXPONENT_ERROR_${i + 1}` }));
  options.splice(correctIndex, 0, { value: correct, isCorrect: true });
  const hiddenState = Object.freeze({ p2: c.p2, p5: c.p5, badPrime: c.badPrime, badExp: c.badExp });
  const verifierAnswer = independentlyVerifyNumCp002Wave03Authority("NUM-CP002-PROT-030", hiddenState);
  if (verifierAnswer !== correct) throw new Error("P030 verifier disagreement");
  return Object.freeze({
    packageId: "NUM-001", checkpointId: "NUM-CP-002", temporaryPrototypeId: "NUM-CP002-PROT-030", permanentQlId: null,
    seed, locale: "en-IN", difficulty: "MEDIUM", answerSemantic: "INTEGER",
    stem: `Find the least non-negative integer ${math("x")} for which ${math(`\\frac{${c.badPrime}^{x}}{2^{${c.p2}}\\times5^{${c.p5}}\\times${c.badPrime}^{${c.badExp}}}`)} has a terminating decimal expansion after reduction.`,
    options: Object.freeze(options), correctIndex, canonicalAnswer: correct, verifierAnswer, hiddenState,
    sourceAncestry: NUM_CP002_WAVE03_SOURCE_ANCESTRY["NUM-CP002-PROT-030"], mathematicalFingerprint: `NUM-CP002-PROT-030:${JSON.stringify(hiddenState)}`,
    explanation: Object.freeze({ concept: "Every denominator prime other than 2 and 5 must be cancelled completely.", solution: Object.freeze([`The only unwanted denominator factor is ${math(`${c.badPrime}^{${c.badExp}}`)}.`, `Therefore ${math(`x=${c.badExp}`)} is the least valid exponent.`]), finalAnswer: correct }), lifecycle,
  });
}

export function generateNumCp002Wave03Final(id: NumCp002Wave03PrototypeId, seed: number): NumCp002Wave03Package {
  if (id === "NUM-CP002-PROT-023") return fixedBetween(seed);
  if (id === "NUM-CP002-PROT-026") return fixedDenominator(seed);
  if (id === "NUM-CP002-PROT-030") return fixedCompound(seed);
  return generateNumCp002Wave03Authority(id, seed);
}

export function independentlyVerifyNumCp002Wave03Final(id: NumCp002Wave03PrototypeId, hiddenState: Readonly<Record<string, unknown>>): string {
  return independentlyVerifyNumCp002Wave03Authority(id, hiddenState);
}

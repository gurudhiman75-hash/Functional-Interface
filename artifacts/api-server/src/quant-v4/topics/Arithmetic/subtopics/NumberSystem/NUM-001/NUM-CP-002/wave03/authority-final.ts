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
  const candidates = [d - 1, d + 1, Math.max(2, d - 2), d + 2, c.target.d, c.target.n]
    .map(String).map(math).filter((v, i, a) => v !== correct && a.indexOf(v) === i).slice(0, 3);
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
    sourceAncestry: NUM_CP002_WAVE03_SOURCE_ANCESTRY["NUM-CP002-PROT-026"],
    mathematicalFingerprint: `NUM-CP002-PROT-026:${JSON.stringify(hiddenState)}`,
    explanation: Object.freeze({
      concept: "Convert the recurring decimal to its exact reduced fraction, then use equivalent fractions.",
      solution: Object.freeze([`${c.display} ${math(`=${targetBody}`)}.`, `${math(`\\frac{${c.n}}{d}=${targetBody}\\Rightarrow d=${d}`)}.`]),
      finalAnswer: correct,
    }), lifecycle,
  });
}

export function generateNumCp002Wave03Final(id: NumCp002Wave03PrototypeId, seed: number): NumCp002Wave03Package {
  return id === "NUM-CP002-PROT-026" ? fixedDenominator(seed) : generateNumCp002Wave03Authority(id, seed);
}

export function independentlyVerifyNumCp002Wave03Final(id: NumCp002Wave03PrototypeId, hiddenState: Readonly<Record<string, unknown>>): string {
  return independentlyVerifyNumCp002Wave03Authority(id, hiddenState);
}

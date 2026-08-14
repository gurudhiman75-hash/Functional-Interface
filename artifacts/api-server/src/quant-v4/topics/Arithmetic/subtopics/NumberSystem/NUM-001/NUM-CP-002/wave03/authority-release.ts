import { fractionLatex, rational } from "../wave01/exact";
import { NUM_CP002_WAVE03_SOURCE_ANCESTRY } from "./source-registry";
import { generateNumCp002Wave03Final, independentlyVerifyNumCp002Wave03Final } from "./authority-final";
import type { NumCp002Wave03Option, NumCp002Wave03Package, NumCp002Wave03PrototypeId } from "./types";

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
function idx(seed: number, size: number, salt = 0) { return (Math.imul((seed + 37) ^ Math.imul(salt + 17, 0x45d9f3b), 2654435761) >>> 0) % size; }

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
  const verifierAnswer = independentlyVerifyNumCp002Wave03Final("NUM-CP002-PROT-023", hiddenState);
  if (verifierAnswer !== correct) throw new Error("P023 release verifier disagreement");
  return Object.freeze({
    packageId: "NUM-001", checkpointId: "NUM-CP-002", temporaryPrototypeId: "NUM-CP002-PROT-023", permanentQlId: null,
    seed, locale: "en-IN", difficulty: "MEDIUM", answerSemantic: "RATIONAL",
    stem: `Which of the following lies strictly between ${fractionLatex(c.a)} and ${fractionLatex(c.b)}?`,
    options: Object.freeze(options), correctIndex, canonicalAnswer: correct, verifierAnswer, hiddenState,
    sourceAncestry: NUM_CP002_WAVE03_SOURCE_ANCESTRY["NUM-CP002-PROT-023"],
    mathematicalFingerprint: `NUM-CP002-PROT-023:${JSON.stringify(hiddenState)}`,
    explanation: Object.freeze({
      concept: "A valid choice must be greater than the lower bound and smaller than the upper bound.",
      solution: Object.freeze([`${fractionLatex(c.a)} \\( < \\) ${correct} \\( < \\) ${fractionLatex(c.b)}.`]),
      finalAnswer: correct,
    }), lifecycle,
  });
}

export function generateNumCp002Wave03Release(id: NumCp002Wave03PrototypeId, seed: number): NumCp002Wave03Package {
  return id === "NUM-CP002-PROT-023" ? fixedBetween(seed) : generateNumCp002Wave03Final(id, seed);
}

export function independentlyVerifyNumCp002Wave03Release(id: NumCp002Wave03PrototypeId, hiddenState: Readonly<Record<string, unknown>>): string {
  return independentlyVerifyNumCp002Wave03Final(id, hiddenState);
}

import {
  compareRational,
  fractionBody,
  fractionLatex,
  rational,
  type Rational,
} from "../wave01/exact";
import { NUM_CP002_WAVE03_SOURCE_ANCESTRY } from "./source-registry";
import { generateNumCp002Wave03, independentlyVerifyNumCp002Wave03 } from "./runtime";
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

function idx(seed: number, size: number, salt = 0) {
  return (Math.imul((seed + 29) ^ Math.imul(salt + 11, 0x45d9f3b), 2654435761) >>> 0) % size;
}
function choose<T>(seed: number, values: readonly T[], salt = 0): T { return values[idx(seed, values.length, salt)]!; }
function add(a: Rational, b: Rational) { return rational(a.n * b.d + b.n * a.d, a.d * b.d); }
function sub(a: Rational, b: Rational) { return rational(a.n * b.d - b.n * a.d, a.d * b.d); }
function reciprocal(a: Rational) { if (a.n === 0) throw new Error("zero reciprocal"); return rational(a.d, a.n); }
function equal(a: Rational, b: Rational) { return compareRational(a, b) === 0; }

function place(correct: string, wrongValues: readonly string[], seed: number, salt: number) {
  const wrong = wrongValues.filter((value, i, all) => value !== correct && all.indexOf(value) === i).slice(0, 3);
  if (wrong.length !== 3) throw new Error(`Wave03 authority needs three unique distractors for ${correct}`);
  const correctIndex = idx(seed, 4, salt);
  const options: NumCp002Wave03Option[] = wrong.map((value, i) => ({ value, isCorrect: false, misconceptionId: `CONTROLLED_DISTRACTOR_${i + 1}` }));
  options.splice(correctIndex, 0, { value: correct, isCorrect: true });
  return { options: Object.freeze(options), correctIndex };
}

function pack(
  id: NumCp002Wave03PrototypeId,
  seed: number,
  difficulty: "EASY" | "MEDIUM" | "HARD",
  answerSemantic: "RATIONAL" | "BOOLEAN_COMBINATION" | "SUFFICIENCY_CLASS" | "DECIMAL_REPRESENTATION",
  stem: string,
  correct: string,
  wrong: readonly string[],
  hiddenState: Record<string, unknown>,
  concept: string,
  solution: readonly string[],
  verifier: (state: Readonly<Record<string, unknown>>) => string,
): NumCp002Wave03Package {
  const placed = place(correct, wrong, seed, 150 + Number(id.slice(-3)));
  const verifierAnswer = verifier(hiddenState);
  if (verifierAnswer !== correct) throw new Error(`${id}: authority/verifier disagreement ${verifierAnswer} != ${correct}`);
  return Object.freeze({
    packageId: "NUM-001",
    checkpointId: "NUM-CP-002",
    temporaryPrototypeId: id,
    permanentQlId: null,
    seed,
    locale: "en-IN",
    difficulty,
    answerSemantic,
    stem,
    options: placed.options,
    correctIndex: placed.correctIndex,
    canonicalAnswer: correct,
    verifierAnswer,
    hiddenState: Object.freeze({ ...hiddenState }),
    sourceAncestry: NUM_CP002_WAVE03_SOURCE_ANCESTRY[id],
    mathematicalFingerprint: `${id}:${JSON.stringify(hiddenState)}`,
    explanation: Object.freeze({ concept, solution: Object.freeze([...solution]), finalAnswer: correct }),
    lifecycle,
  });
}

const constraintTargets = [rational(1, 4), rational(2, 5), rational(3, 8), rational(5, 12), rational(7, 20)] as const;
function p027(seed: number): NumCp002Wave03Package {
  const t = choose(seed, constraintTargets, 27);
  const complement = seed % 2 === 0;
  const x = complement ? sub(rational(1, 1), t) : reciprocal(t);
  const correct = fractionLatex(x);
  const tBody = fractionBody(t);
  const xBody = fractionBody(x);
  const stem = complement
    ? `If ${math(`1-x=${tBody}`)}, find ${math("x")}.`
    : `If ${math(`\\frac{1}{x}=${tBody}`)}, find ${math("x")}.`;
  const wrong = complement
    ? [fractionLatex(t), fractionLatex(add(rational(1, 1), t)), fractionLatex(sub(rational(1, 1), rational(t.n, t.d * 2)))]
    : [fractionLatex(t), fractionLatex(rational(t.d + 1, t.n)), fractionLatex(rational(t.d, t.n + 1))];
  const hidden = { mode: complement ? "COMPLEMENT" : "RECIPROCAL", tN: t.n, tD: t.d };
  return pack(
    "NUM-CP002-PROT-027", seed, complement ? "MEDIUM" : "EASY", "RATIONAL", stem, correct, wrong, hidden,
    complement ? "Use the exact complement to 1." : "Taking the reciprocal twice returns the original rational number.",
    complement ? [`${math(`x=1-${tBody}=${xBody}`)}.`] : [`${math(`x=\\frac{1}{${tBody}}=${xBody}`)}.`],
    (s) => { const h = s as any; const v = rational(Number(h.tN), Number(h.tD)); return fractionLatex(h.mode === "COMPLEMENT" ? sub(rational(1, 1), v) : reciprocal(v)); },
  );
}

const evidenceCases = [
  { t: rational(1, 6), u: rational(3, 4) },
  { t: rational(2, 9), u: rational(7, 9) },
  { t: rational(3, 10), u: rational(4, 5) },
  { t: rational(5, 12), u: rational(11, 12) },
] as const;
function p028(seed: number): NumCp002Wave03Package {
  const c = choose(seed, evidenceCases, 28);
  const difference = seed % 2 === 1;
  const x = sub(c.u, c.t);
  const correct = fractionLatex(x);
  const uBody = fractionBody(c.u), tBody = fractionBody(c.t), xBody = fractionBody(x);
  const stem = difference
    ? `If ${math(`${uBody}-x=${tBody}`)}, find ${math("x")}.`
    : `If ${math(`x+${tBody}=${uBody}`)}, find ${math("x")}.`;
  const hidden = { tN: c.t.n, tD: c.t.d, uN: c.u.n, uD: c.u.d };
  return pack(
    "NUM-CP002-PROT-028", seed, "MEDIUM", "RATIONAL", stem, correct,
    [fractionLatex(add(c.u, c.t)), fractionLatex(c.t), fractionLatex(c.u)], hidden,
    "Keep all quantities as exact fractions and isolate the unknown.",
    [`${math(`x=${uBody}-${tBody}=${xBody}`)}.`],
    (s) => { const h = s as any; return fractionLatex(sub(rational(Number(h.uN), Number(h.uD)), rational(Number(h.tN), Number(h.tD)))); },
  );
}

function parseRecurring(display: string): Rational {
  const bodyMatch = display.match(/^\\\((\d+)\.(\d*)\\overline\{(\d+)\}\\\)$/u);
  if (!bodyMatch) throw new Error(`Unsupported recurring display ${display}`);
  const whole = Number(bodyMatch[1]);
  const prefixText = String(bodyMatch[2]);
  const blockText = String(bodyMatch[3]);
  const prefixDigits = prefixText.length;
  const blockDigits = blockText.length;
  const prefix = prefixText ? Number(prefixText) : 0;
  const block = Number(blockText);
  const powPrefix = 10 ** prefixDigits;
  const powBlock = 10 ** blockDigits;
  const decimalPart = rational(prefix * powBlock + block - prefix, powPrefix * (powBlock - 1));
  return add(rational(whole, 1), decimalPart);
}

const recurringEquivalenceCases = [
  { short: math("0.\\overline{3}"), long: math("0.\\overline{33}") },
  { short: math("0.\\overline{27}"), long: math("0.\\overline{2727}") },
  { short: math("0.1\\overline{6}"), long: math("0.1\\overline{66}") },
  { short: math("0.2\\overline{45}"), long: math("0.2\\overline{4545}") },
] as const;
function p029(seed: number): NumCp002Wave03Package {
  const c = choose(seed, recurringEquivalenceCases, 29);
  const shortValue = parseRecurring(c.short);
  const longValue = parseRecurring(c.long);
  if (!equal(shortValue, longValue)) throw new Error("P029 fixture is not equivalent");
  const wrong = [math("0.\\overline{03}"), math("0.25"), math("0.\\overline{9}"), math("0.2\\overline{54}")]
    .filter((value) => value !== c.short && value !== c.long);
  const hidden = { short: c.short, long: c.long, n: shortValue.n, d: shortValue.d };
  return pack(
    "NUM-CP002-PROT-029", seed, "EASY", "DECIMAL_REPRESENTATION", `Which recurring decimal is exactly equal to ${c.short}?`,
    c.long, wrong, hidden,
    "Repeating the same minimal recurring block again does not change the represented rational number.",
    [`Both ${c.short} and ${c.long} reduce to ${fractionLatex(shortValue)}.`],
    (s) => { const h = s as any; const a = parseRecurring(String(h.short)); const b = parseRecurring(String(h.long)); if (!equal(a, b)) throw new Error("P029 independent equivalence failed"); return String(h.long); },
  );
}

const statementCases = [
  {
    statements: [
      "A rational number in lowest terms with denominator 40 has a terminating decimal.",
      "A rational number in lowest terms with denominator 21 has a terminating decimal.",
      `${math("0.\\overline{9}")} is exactly ${math("1")}.`,
    ], truth: [true, false, true], correct: "I and III only",
  },
  {
    statements: [
      "A reduced denominator containing only powers of 2 and 5 gives a terminating decimal.",
      "Every non-terminating decimal is irrational.",
      `${math("0.\\overline{3}")} is exactly ${math("\\frac{3}{10}")}.`,
    ], truth: [true, false, false], correct: "I only",
  },
  {
    statements: [
      "A rational number in lowest terms with denominator 6 has a terminating decimal.",
      `${math("0.125=\\frac{1}{8}")}.`,
      "Every recurring decimal is irrational.",
    ], truth: [false, true, false], correct: "II only",
  },
  {
    statements: [
      "A rational decimal may terminate after common factors are cancelled first.",
      `${math("0.375=\\frac{3}{8}")}.`,
      "Every recurring decimal represents a rational number.",
    ], truth: [true, true, true], correct: "I, II and III",
  },
] as const;
const combinationOptions = ["I only", "II only", "I and III only", "I, II and III"] as const;
function p031(seed: number): NumCp002Wave03Package {
  const c = choose(seed, statementCases, 31);
  const hidden = { truth: [...c.truth] };
  return pack(
    "NUM-CP002-PROT-031", seed, "MEDIUM", "BOOLEAN_COMBINATION",
    ["Consider the following statements:", `I. ${c.statements[0]}`, `II. ${c.statements[1]}`, `III. ${c.statements[2]}`, "Which statement(s) is/are correct?"].join("\n"),
    c.correct, combinationOptions.filter((x) => x !== c.correct), hidden,
    "Judge each statement from exact rational representation and reduced-denominator structure.",
    [`Statement I is ${c.truth[0] ? "true" : "false"}; Statement II is ${c.truth[1] ? "true" : "false"}; Statement III is ${c.truth[2] ? "true" : "false"}.`, `Therefore: ${c.correct}.`],
    (s) => { const t = (s as any).truth as boolean[]; if (t[0] && !t[1] && !t[2]) return "I only"; if (!t[0] && t[1] && !t[2]) return "II only"; if (t[0] && !t[1] && t[2]) return "I and III only"; if (t[0] && t[1] && t[2]) return "I, II and III"; throw new Error(`Unsupported truth pattern ${t}`); },
  );
}

const dsOptions = [
  "Statement I alone is sufficient",
  "Statement II alone is sufficient",
  "Both statements together are sufficient, but neither alone is sufficient",
  "Even both statements together are not sufficient",
] as const;
const dsCases = [
  { d: 12, s1: "n is divisible by 3", s2: "n is even", k1: 3, k2: 2, cls: 0 },
  { d: 28, s1: "n is even", s2: "n is divisible by 7", k1: 2, k2: 7, cls: 1 },
  { d: 84, s1: "n is divisible by 3", s2: "n is divisible by 7", k1: 3, k2: 7, cls: 2 },
  { d: 84, s1: "n is divisible by 3", s2: "n is even", k1: 3, k2: 2, cls: 3 },
] as const;
function isSufficient(d: number, predicates: readonly number[]): boolean {
  const outcomes = new Set<boolean>();
  for (let n = 1; n <= 2 * d; n += 1) {
    if (predicates.every((k) => n % k === 0)) outcomes.add(terminates(rational(n, d)));
  }
  return outcomes.size === 1;
}
function classifyDs(d: number, k1: number, k2: number): number {
  const a = isSufficient(d, [k1]);
  const b = isSufficient(d, [k2]);
  if (a) return 0;
  if (b) return 1;
  if (isSufficient(d, [k1, k2])) return 2;
  return 3;
}
function p032(seed: number): NumCp002Wave03Package {
  const c = choose(seed, dsCases, 32);
  const cls = classifyDs(c.d, c.k1, c.k2);
  if (cls !== c.cls) throw new Error(`P032 fixture class ${c.cls} disagrees with enumeration ${cls}`);
  const correct = dsOptions[cls]!;
  const hidden = { d: c.d, k1: c.k1, k2: c.k2 };
  const reasoning = cls === 0
    ? `Statement I alone always removes the denominator factor ${math(String(c.k1))} that prevents termination.`
    : cls === 1
      ? `Statement II alone always removes the denominator factor ${math(String(c.k2))} that prevents termination.`
      : cls === 2
        ? "Neither statement alone settles the decimal nature, but the two conditions together do."
        : "Even with both conditions, valid numerators can still give different decimal natures.";
  return pack(
    "NUM-CP002-PROT-032", seed, "HARD", "SUFFICIENCY_CLASS",
    [`For a positive integer ${math("n")}, is ${math(`\\frac{n}{${c.d}}`)} terminating after reduction?`, `Statement I: ${c.s1}.`, `Statement II: ${c.s2}.`, "Which option correctly describes the sufficiency of the statements?"].join("\n"),
    correct, dsOptions.filter((x) => x !== correct), hidden,
    "A statement is sufficient only when it fixes the answer for every positive integer satisfying that statement.",
    [reasoning, `Hence: ${correct}.`],
    (s) => { const h = s as any; return dsOptions[classifyDs(Number(h.d), Number(h.k1), Number(h.k2))]!; },
  );
}

export function generateNumCp002Wave03Authority(id: NumCp002Wave03PrototypeId, seed: number): NumCp002Wave03Package {
  if (id === "NUM-CP002-PROT-027") return p027(seed);
  if (id === "NUM-CP002-PROT-028") return p028(seed);
  if (id === "NUM-CP002-PROT-029") return p029(seed);
  if (id === "NUM-CP002-PROT-031") return p031(seed);
  if (id === "NUM-CP002-PROT-032") return p032(seed);
  return generateNumCp002Wave03(id, seed);
}

export function independentlyVerifyNumCp002Wave03Authority(id: NumCp002Wave03PrototypeId, hiddenState: Readonly<Record<string, unknown>>): string {
  if (id === "NUM-CP002-PROT-027") { const h = hiddenState as any; const t = rational(Number(h.tN), Number(h.tD)); return fractionLatex(h.mode === "COMPLEMENT" ? sub(rational(1, 1), t) : reciprocal(t)); }
  if (id === "NUM-CP002-PROT-028") { const h = hiddenState as any; return fractionLatex(sub(rational(Number(h.uN), Number(h.uD)), rational(Number(h.tN), Number(h.tD)))); }
  if (id === "NUM-CP002-PROT-029") { const h = hiddenState as any; const a = parseRecurring(String(h.short)); const b = parseRecurring(String(h.long)); if (!equal(a, b)) throw new Error("P029 independent equivalence failed"); return String(h.long); }
  if (id === "NUM-CP002-PROT-031") { const t = (hiddenState as any).truth as boolean[]; if (t[0] && !t[1] && !t[2]) return "I only"; if (!t[0] && t[1] && !t[2]) return "II only"; if (t[0] && !t[1] && t[2]) return "I and III only"; if (t[0] && t[1] && t[2]) return "I, II and III"; throw new Error(`Unsupported truth pattern ${t}`); }
  if (id === "NUM-CP002-PROT-032") { const h = hiddenState as any; return dsOptions[classifyDs(Number(h.d), Number(h.k1), Number(h.k2))]!; }
  return independentlyVerifyNumCp002Wave03(id, hiddenState);
}

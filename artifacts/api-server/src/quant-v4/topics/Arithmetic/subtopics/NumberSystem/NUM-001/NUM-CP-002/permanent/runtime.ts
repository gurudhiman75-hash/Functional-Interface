import {
  denominatorPrimeProfile,
  fractionLatex,
  gcd,
  rational,
  terminates,
} from "../wave01/exact";
import {
  generateNumCp002Wave01,
  independentlyVerifyNumCp002Wave01,
} from "../wave01/runtime";
import { generateNumCp002Wave02Authority } from "../wave02/authority";
import { independentlyVerifyNumCp002Wave02 } from "../wave02/runtime";
import {
  generateNumCp002Wave03Final,
  independentlyVerifyNumCp002Wave03Final,
} from "../wave03/authority-final";
import {
  NUM_CP002_PERMANENT_QL_IDS,
  getNumCp002PermanentAllocation,
  type NumCp002PermanentAllocationEntry,
  type NumCp002PermanentQlId,
} from "./allocation";

export type NumCp002PermanentDifficulty = "EASY" | "MEDIUM" | "HARD";

export interface NumCp002PermanentOption {
  readonly value: string;
  readonly isCorrect: boolean;
  readonly misconceptionId?: string;
}

export interface NumCp002PermanentExplanation {
  readonly concept?: string;
  readonly solution: readonly string[];
  readonly finalAnswer: string;
}

interface NumCp002TemporaryPackage {
  readonly packageId: "NUM-001";
  readonly checkpointId: "NUM-CP-002";
  readonly temporaryPrototypeId: string;
  readonly permanentQlId: null;
  readonly seed: number;
  readonly locale: "en-IN";
  readonly difficulty: NumCp002PermanentDifficulty;
  readonly answerSemantic: string;
  readonly stem: string;
  readonly options: readonly NumCp002PermanentOption[];
  readonly correctIndex: number;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly hiddenState: Readonly<Record<string, unknown>>;
  readonly sourceAncestry: readonly string[];
  readonly mathematicalFingerprint: string;
  readonly explanation: NumCp002PermanentExplanation;
  readonly lifecycle: Readonly<{
    permanentQlId: null;
    maturity: "EXECUTABLE_DISCOVERY_PROOF";
    reviewStatus: "UNREVIEWED_DISCOVERY_CANDIDATE";
    active: false;
    questionStudioDiscoverable: false;
    questionBankWritable: false;
    questionBankStatus: "NOT_STORED";
    testEligible: false;
    testEligibility: "INELIGIBLE";
    publiclyPublishable: false;
  }>;
}

export interface NumCp002PermanentRuntimeInput {
  readonly questionLanguageId?: NumCp002PermanentQlId;
  readonly seed?: number;
  readonly language?: "en";
}

export interface NumCp002PermanentLifecycle {
  readonly permanentQlId: NumCp002PermanentQlId;
  readonly maturity: "ENGLISH_IMPLEMENTATION_FROZEN";
  readonly reviewStatus: "AWAITING_PRODUCT_OWNER_EDITORIAL_REVIEW";
  readonly questionBankStatus: "NOT_STORED";
  readonly testEligibility: "INELIGIBLE";
  readonly active: false;
  readonly questionStudioDiscoverable: false;
  readonly questionBankWritable: false;
  readonly testEligible: false;
  readonly publiclyPublishable: false;
}

export interface NumCp002PermanentQuestion {
  readonly packageId: "NUM-001";
  readonly checkpointId: "NUM-CP-002";
  readonly permanentQlId: NumCp002PermanentQlId;
  readonly questionLanguageId: NumCp002PermanentQlId;
  readonly questionId: string;
  readonly qlTemplateId: NumCp002PermanentAllocationEntry["qlTemplateId"];
  readonly solveModeId: NumCp002PermanentAllocationEntry["solveModeId"];
  readonly authorityId: NumCp002PermanentAllocationEntry["authorityId"];
  readonly temporaryPrototypeId: string;
  readonly authorityPrototypeIds: readonly string[];
  readonly seed: number;
  readonly sourceSeed: number;
  readonly locale: "en-IN";
  readonly language: "en";
  readonly difficulty: NumCp002PermanentDifficulty;
  readonly answerSemantic: string;
  readonly stem: string;
  readonly options: readonly NumCp002PermanentOption[];
  readonly correctIndex: number;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly hiddenState: Readonly<Record<string, unknown>>;
  readonly mathematicalFingerprint: string;
  readonly explanation: NumCp002PermanentExplanation;
  readonly sourceAncestry: readonly string[];
  readonly allocationStatus: "PRODUCT_OWNER_APPROVED_INACTIVE_ENGLISH_IMPLEMENTATION";
  readonly permanentIdentityFrozen: true;
  readonly solveModeFrozen: true;
  readonly englishImplementationFrozen: true;
  readonly reviewStatus: "AWAITING_PRODUCT_OWNER_EDITORIAL_REVIEW";
  readonly maturity: "ENGLISH_IMPLEMENTATION_FROZEN";
  readonly lifecycle: NumCp002PermanentLifecycle;
  readonly traceability: Readonly<{
    packageId: "NUM-001";
    canonicalProblemId: "NUM-CP-002";
    questionLanguageId: NumCp002PermanentQlId;
    qlTemplateId: NumCp002PermanentAllocationEntry["qlTemplateId"];
    solveModeId: NumCp002PermanentAllocationEntry["solveModeId"];
    authorityId: NumCp002PermanentAllocationEntry["authorityId"];
    authorityPrototypeIds: readonly string[];
    runtimePrototypeId: string;
    language: "en";
  }>;
}

const math = (body: string): string => `\\(${body}\\)`;

function prototypeNumber(prototypeId: string): number {
  const match = prototypeId.match(/NUM-CP002-PROT-(\d{3})$/);
  if (!match) throw new Error(`Invalid NUM-CP-002 prototype ID: ${prototypeId}`);
  return Number(match[1]);
}

export function generateNumCp002TemporaryAuthorityPackage(
  prototypeId: string,
  seed: number,
): NumCp002TemporaryPackage {
  const n = prototypeNumber(prototypeId);
  let result: unknown;
  if (n <= 12) result = generateNumCp002Wave01(prototypeId as never, seed);
  else if (n <= 22) result = generateNumCp002Wave02Authority(prototypeId as never, seed);
  else if (n <= 32) result = generateNumCp002Wave03Final(prototypeId as never, seed);
  else throw new Error(`Unsupported NUM-CP-002 prototype ID: ${prototypeId}`);
  return result as NumCp002TemporaryPackage;
}

export function independentlyVerifyNumCp002TemporaryAuthority(
  prototypeId: string,
  hiddenState: Readonly<Record<string, unknown>>,
): string {
  const n = prototypeNumber(prototypeId);
  if (n <= 12) return independentlyVerifyNumCp002Wave01(prototypeId as never, hiddenState);
  if (n <= 22) return independentlyVerifyNumCp002Wave02(prototypeId as never, hiddenState);
  if (n <= 32) return independentlyVerifyNumCp002Wave03Final(prototypeId as never, hiddenState);
  throw new Error(`Unsupported NUM-CP-002 prototype ID: ${prototypeId}`);
}

const DIFFICULTY_BANDS: Readonly<Record<NumCp002PermanentQlId, readonly NumCp002PermanentDifficulty[]>> = Object.freeze({
  "NUM-QL-145": ["EASY"],
  "NUM-QL-146": ["EASY"],
  "NUM-QL-147": ["EASY"],
  "NUM-QL-148": ["EASY", "MEDIUM", "HARD"],
  "NUM-QL-149": ["EASY"],
  "NUM-QL-150": ["MEDIUM", "HARD"],
  "NUM-QL-151": ["MEDIUM"],
  "NUM-QL-152": ["MEDIUM", "HARD"],
  "NUM-QL-153": ["MEDIUM"],
  "NUM-QL-154": ["MEDIUM"],
  "NUM-QL-155": ["MEDIUM"],
  "NUM-QL-156": ["MEDIUM"],
  "NUM-QL-157": ["MEDIUM", "HARD"],
  "NUM-QL-158": ["HARD"],
  "NUM-QL-159": ["HARD"],
  "NUM-QL-160": ["MEDIUM"],
  "NUM-QL-161": ["MEDIUM", "HARD"],
  "NUM-QL-162": ["MEDIUM", "HARD"],
  "NUM-QL-163": ["MEDIUM"],
  "NUM-QL-164": ["MEDIUM"],
  "NUM-QL-165": ["HARD"],
});

export function getNumCp002PermanentDifficultyBands(qlId: NumCp002PermanentQlId): readonly NumCp002PermanentDifficulty[] {
  return DIFFICULTY_BANDS[qlId];
}

function stripTwoFive(value: number): number {
  let n = Math.abs(value);
  while (n > 0 && n % 2 === 0) n /= 2;
  while (n > 0 && n % 5 === 0) n /= 5;
  return n;
}

function distinctPrimeFactorCount(value: number): number {
  let n = Math.abs(value);
  let count = 0;
  for (let p = 2; p * p <= n; p += 1) {
    if (n % p !== 0) continue;
    count += 1;
    while (n % p === 0) n /= p;
  }
  if (n > 1) count += 1;
  return count;
}

function recurringBlockLength(text: string): number {
  const match = text.match(/\\overline\{([^}]+)\}/u);
  return match ? match[1]!.replace("?", "").length : 0;
}

function integerMathAnswer(text: string): number {
  const match = text.match(/^\\\((-?\d+)\\\)$/u);
  return match ? Number(match[1]) : Number.NaN;
}

function permanentDifficulty(
  qlId: NumCp002PermanentQlId,
  prototypeId: string,
  temporary: NumCp002TemporaryPackage,
): NumCp002PermanentDifficulty {
  const h = temporary.hiddenState as Record<string, unknown>;
  switch (qlId) {
    case "NUM-QL-145":
    case "NUM-QL-146":
    case "NUM-QL-147":
    case "NUM-QL-149": return "EASY";
    case "NUM-QL-148": {
      if (prototypeId === "NUM-CP002-PROT-022" || prototypeId === "NUM-CP002-PROT-029") return "EASY";
      if (prototypeId === "NUM-CP002-PROT-006" && (Number(h.prefixDigits) > 1 || Number(h.blockDigits) > 1)) return "HARD";
      return "MEDIUM";
    }
    case "NUM-QL-150": return recurringBlockLength(temporary.canonicalAnswer) >= 5 ? "HARD" : "MEDIUM";
    case "NUM-QL-151": return "MEDIUM";
    case "NUM-QL-152": return prototypeId === "NUM-CP002-PROT-024" ? "HARD" : "MEDIUM";
    case "NUM-QL-153":
    case "NUM-QL-154":
    case "NUM-QL-155":
    case "NUM-QL-156": return "MEDIUM";
    case "NUM-QL-157": {
      const reduced = rational(Number(h.n), Number(h.d));
      return distinctPrimeFactorCount(denominatorPrimeProfile(reduced).rest) >= 2 ? "HARD" : "MEDIUM";
    }
    case "NUM-QL-158":
    case "NUM-QL-159": return "HARD";
    case "NUM-QL-160": return "MEDIUM";
    case "NUM-QL-161": return recurringBlockLength(temporary.stem) >= 5 ? "HARD" : "MEDIUM";
    case "NUM-QL-162": return integerMathAnswer(temporary.canonicalAnswer) >= 5 ? "HARD" : "MEDIUM";
    case "NUM-QL-163":
    case "NUM-QL-164": return "MEDIUM";
    case "NUM-QL-165": return "HARD";
  }
}

function validBoundedDenominators(numerator: number, maxD: number): number[] {
  const values: number[] = [];
  for (let d = 2; d <= maxD; d += 1) {
    if (terminates(rational(numerator, d))) values.push(d);
  }
  return values;
}

function setLatex(values: readonly number[]): string {
  return math(`\\{${values.join(",")}\\}`);
}

function primeFactorisationBody(value: number): string {
  if (value <= 1) return String(value);
  let n = value;
  const parts: string[] = [];
  for (let p = 2; p * p <= n; p += 1) {
    if (n % p !== 0) continue;
    let exponent = 0;
    while (n % p === 0) { n /= p; exponent += 1; }
    parts.push(exponent === 1 ? String(p) : `${p}^{${exponent}}`);
  }
  if (n > 1) parts.push(String(n));
  return parts.join("\\times");
}

function primeFactorisation(value: number): string {
  return math(primeFactorisationBody(value));
}

function remodelStatementStem(stem: string): string {
  return stem
    .replace(
      "A rational decimal may terminate after common factors are cancelled first.",
      "A rational number may have a terminating decimal after common factors are cancelled.",
    )
    .replace("powers of 2 and 5", `powers of ${math("2")} and ${math("5")}`)
    .replace(/denominator (\d+)/g, (_match, digits: string) => `denominator ${math(digits)}`);
}

function remodelStem(temporary: NumCp002TemporaryPackage): string {
  const prototypeId = temporary.temporaryPrototypeId;
  const h = temporary.hiddenState as Record<string, unknown>;
  if (prototypeId === "NUM-CP002-PROT-014") {
    const n = Number(h.n), d = Number(h.d);
    return `By what least integer greater than ${math("1")} should the denominator of ${math(`\\frac{${n}}{${d}}`)} be divided so that the decimal expansion of the resulting fraction terminates?`;
  }
  if (prototypeId === "NUM-CP002-PROT-031") return remodelStatementStem(temporary.stem);
  if (prototypeId === "NUM-CP002-PROT-032") {
    const d = Number(h.d), k1 = Number(h.k1), k2 = Number(h.k2);
    return [
      `For a positive integer ${math("n")}, is ${math(`\\frac{n}{${d}}`)} terminating after reduction?`,
      `Statement I: ${math("n")} is divisible by ${math(String(k1))}.`,
      `Statement II: ${math("n")} is divisible by ${math(String(k2))}.`,
      "Which option correctly describes the sufficiency of the statements?",
    ].join("\n");
  }
  return temporary.stem;
}

function cleanConcept(concept: string | undefined): string | undefined {
  if (!concept) return undefined;
  return concept
    .replace(/non-\\\(2,5\\\) part/gi, `factor made of primes other than ${math("2")} and ${math("5")}`)
    .replace(/non-\\\(2,5\\\) factor/gi, `factor made of primes other than ${math("2")} and ${math("5")}`)
    .replace("rational decimal", "rational number")
    .replace("length k", `length ${math("k")}`);
}

function statementReason(statement: string, label: "I" | "II" | "III"): string {
  if (statement.includes("denominator 40")) return `${label}. ${math("40=2^3\\times5")}, so the decimal terminates. The statement is true.`;
  if (statement.includes("denominator 21")) return `${label}. ${math("21=3\\times7")}; the reduced denominator contains primes other than ${math("2")} and ${math("5")}. The statement is false.`;
  if (statement.includes("0.\\overline{9}") && statement.includes("exactly")) return `${label}. ${math("0.\\overline{9}=1")}. The statement is true.`;
  if (statement.includes("only powers of 2 and 5")) return `${label}. A reduced denominator containing only ${math("2")} and ${math("5")} gives a terminating decimal. The statement is true.`;
  if (statement.includes("Every non-terminating decimal is irrational")) return `${label}. Recurring non-terminating decimals are rational, so the statement is false.`;
  if (statement.includes("0.\\overline{3}") && statement.includes("3}{10")) return `${label}. ${math("0.\\overline{3}=\\frac{1}{3}")}, not ${math("\\frac{3}{10}")}. The statement is false.`;
  if (statement.includes("denominator 6")) return `${label}. ${math("6=2\\times3")}; the factor ${math("3")} makes the decimal recurring. The statement is false.`;
  if (statement.includes("0.125") && statement.includes("1}{8")) return `${label}. ${math("0.125=\\frac{1}{8}")}. The statement is true.`;
  if (statement.includes("Every recurring decimal is irrational")) return `${label}. Every recurring decimal represents a rational number. The statement is false.`;
  if (statement.includes("may terminate after common factors")) return `${label}. Decimal nature is decided after reducing the fraction, so the statement is true.`;
  if (statement.includes("0.375") && statement.includes("3}{8")) return `${label}. ${math("0.375=\\frac{3}{8}")}. The statement is true.`;
  if (statement.includes("Every recurring decimal represents a rational number")) return `${label}. A recurring decimal can be converted exactly to a fraction. The statement is true.`;
  return `${label}. Check the statement using the exact fraction/decimal rule.`;
}

function statementExplanation(temporary: NumCp002TemporaryPackage): NumCp002PermanentExplanation {
  const statements = temporary.stem.split("\n")
    .filter((line) => /^(I|II|III)\.\s/u.test(line))
    .map((line) => line.replace(/^(I|II|III)\.\s/u, ""));
  const labels = ["I", "II", "III"] as const;
  return {
    concept: "Check each statement separately using exact fraction and decimal rules.",
    solution: statements.slice(0, 3).map((statement, index) => statementReason(statement, labels[index]!)),
    finalAnswer: temporary.canonicalAnswer,
  };
}

function dsExplanation(temporary: NumCp002TemporaryPackage): NumCp002PermanentExplanation {
  const h = temporary.hiddenState as Record<string, unknown>;
  const d = Number(h.d), k1 = Number(h.k1), k2 = Number(h.k2);
  const badPart = stripTwoFive(d);
  const combined = Math.abs(k1 * k2) / gcd(k1, k2);
  const concept = badPart === 1
    ? `The denominator already contains only ${math("2")} and ${math("5")}.`
    : `For ${math(`\\frac{n}{${d}}`)} to terminate, ${math("n")} must cancel the denominator factor ${math(String(badPart))} made from primes other than ${math("2")} and ${math("5")}.`;
  let solution: readonly string[];
  if (badPart === 1) {
    solution = ["The fraction terminates for every positive numerator, so no extra statement is needed."];
  } else if (k1 % badPart === 0) {
    solution = [`Statement I forces ${math("n")} to be divisible by ${math(String(badPart))}, so Statement I alone is sufficient.`];
  } else if (k2 % badPart === 0) {
    solution = [`Statement II forces ${math("n")} to be divisible by ${math(String(badPart))}, so Statement II alone is sufficient.`];
  } else if (combined % badPart === 0) {
    solution = [`Neither statement alone forces cancellation of ${math(String(badPart))}, but together they make ${math("n")} divisible by ${math(String(combined))}, which does.`];
  } else {
    solution = [`Together the statements force divisibility only by ${math(String(combined))}, which does not force cancellation of ${math(String(badPart))}; therefore even together they are insufficient.`];
  }
  return { concept, solution, finalAnswer: temporary.canonicalAnswer };
}

function remodelExplanation(temporary: NumCp002TemporaryPackage): NumCp002PermanentExplanation {
  const id = temporary.temporaryPrototypeId;
  const h = temporary.hiddenState as Record<string, unknown>;

  if (id === "NUM-CP002-PROT-013" || id === "NUM-CP002-PROT-014") {
    const n = Number(h.n), d = Number(h.d);
    const reduced = rational(n, d);
    const unwanted = denominatorPrimeProfile(reduced).rest;
    const action = id === "NUM-CP002-PROT-013" ? "Multiplying the fraction" : "Dividing the denominator";
    return {
      concept: `After reduction, a terminating decimal can have only ${math("2")} and ${math("5")} as denominator prime factors.`,
      solution: [
        `${fractionLatex(reduced)} has denominator ${primeFactorisation(reduced.d)}; the factor that must disappear is ${math(String(unwanted))}.`,
        `${action} by ${math(String(unwanted))} removes that factor, so the least required integer is ${temporary.canonicalAnswer}.`,
      ],
      finalAnswer: temporary.canonicalAnswer,
    };
  }

  if (id === "NUM-CP002-PROT-017" || id === "NUM-CP002-PROT-018") {
    const numerator = Number(h.numerator), maxD = Number(h.maxD);
    const valid = validBoundedDenominators(numerator, maxD);
    const cancellable = stripTwoFive(numerator);
    return {
      concept: `After reduction, the denominator may contain only ${math("2")} and ${math("5")}.`,
      solution: id === "NUM-CP002-PROT-017"
        ? [
            `Any part of ${math("d")} built from other primes must divide ${math(String(cancellable))}, the corresponding cancellable part of the numerator.`,
            `For ${math(`2\\le d\\le${maxD}`)}, the valid denominators are ${setLatex(valid)}, giving ${math(String(valid.length))} values.`,
          ]
        : [
            `Any part of ${math("d")} built from other primes must divide ${math(String(cancellable))}, the corresponding cancellable part of the numerator.`,
            `For ${math(`2\\le d\\le${maxD}`)}, the complete set is ${setLatex(valid)}.`,
          ],
      finalAnswer: temporary.canonicalAnswer,
    };
  }

  if (id === "NUM-CP002-PROT-019") {
    const d = Number(h.d);
    const unwanted = stripTwoFive(d);
    return {
      concept: `The numerator must cancel every denominator prime factor other than ${math("2")} and ${math("5")}.`,
      solution: [
        `${math(`${d}=${primeFactorisationBody(d)}`)}; therefore the factor ${math(String(unwanted))} must be cancelled by the numerator.`,
        `Among the options, ${temporary.canonicalAnswer} supplies that complete cancellation.`,
      ],
      finalAnswer: temporary.canonicalAnswer,
    };
  }

  if (id === "NUM-CP002-PROT-030") {
    return {
      concept: `Every denominator prime other than ${math("2")} and ${math("5")} must be cancelled completely.`,
      solution: temporary.explanation.solution.slice(0, 3),
      finalAnswer: temporary.canonicalAnswer,
    };
  }

  if (id === "NUM-CP002-PROT-031") return statementExplanation(temporary);
  if (id === "NUM-CP002-PROT-032") return dsExplanation(temporary);

  return {
    concept: cleanConcept(temporary.explanation.concept),
    solution: temporary.explanation.solution.slice(0, 3),
    finalAnswer: temporary.canonicalAnswer,
  };
}

function authorityPrototypeIds(allocation: NumCp002PermanentAllocationEntry): readonly string[] {
  return Object.freeze([...allocation.corePrototypeIds, ...allocation.adapterPrototypeIds]);
}

function generateEditoriallyStrongTemporary(
  prototypeId: string,
  initialSourceSeed: number,
): { readonly temporary: NumCp002TemporaryPackage; readonly sourceSeed: number } {
  let sourceSeed = initialSourceSeed;
  for (let attempt = 0; attempt < 24; attempt += 1, sourceSeed += 1) {
    const temporary = generateNumCp002TemporaryAuthorityPackage(prototypeId, sourceSeed);
    if (prototypeId === "NUM-CP002-PROT-009" && temporary.canonicalAnswer === math("=")) continue;
    return { temporary, sourceSeed };
  }
  throw new Error(`${prototypeId}: unable to find an editorially strong permanent state`);
}

export function runNumCp002PermanentPipeline(
  input: NumCp002PermanentRuntimeInput = {},
): NumCp002PermanentQuestion {
  const questionLanguageId = input.questionLanguageId ?? NUM_CP002_PERMANENT_QL_IDS[0];
  const language = input.language ?? "en";
  if (language !== "en") {
    throw new Error(`NUM-CP-002 canonical permanent runtime only supports English; received ${language}.`);
  }
  const seed = input.seed ?? 1;
  if (!Number.isInteger(seed) || seed <= 0) throw new Error(`Seed must be a positive integer; received ${seed}`);

  const allocation = getNumCp002PermanentAllocation(questionLanguageId);
  const variants = authorityPrototypeIds(allocation);
  if (variants.length < 1) throw new Error(`${questionLanguageId}: no runtime prototype variants`);
  const variantIndex = (seed - 1) % variants.length;
  const initialSourceSeed = Math.floor((seed - 1) / variants.length) + 1;
  const runtimePrototypeId = variants[variantIndex]!;
  if (runtimePrototypeId === "NUM-CP002-PROT-027" || runtimePrototypeId === "NUM-CP002-PROT-028") {
    throw new Error(`${questionLanguageId}: delegated Algebra prototype reached permanent Number System runtime`);
  }

  const { temporary, sourceSeed } = generateEditoriallyStrongTemporary(runtimePrototypeId, initialSourceSeed);
  const independent = independentlyVerifyNumCp002TemporaryAuthority(runtimePrototypeId, temporary.hiddenState);
  if (temporary.temporaryPrototypeId !== runtimePrototypeId) {
    throw new Error(`${questionLanguageId}/${seed}: temporary-prototype mismatch`);
  }
  if (temporary.canonicalAnswer !== temporary.verifierAnswer || temporary.canonicalAnswer !== independent) {
    throw new Error(`${questionLanguageId}/${seed}: independent verifier mismatch`);
  }
  if (
    temporary.permanentQlId !== null
    || temporary.lifecycle.permanentQlId !== null
    || temporary.lifecycle.active
    || temporary.lifecycle.questionStudioDiscoverable
    || temporary.lifecycle.questionBankWritable
    || temporary.lifecycle.testEligible
    || temporary.lifecycle.publiclyPublishable
  ) {
    throw new Error(`${questionLanguageId}/${seed}: discovery lifecycle boundary violated`);
  }

  const difficulty = permanentDifficulty(allocation.qlId, runtimePrototypeId, temporary);
  const stem = remodelStem(temporary);
  const explanation = remodelExplanation(temporary);
  const lifecycle: NumCp002PermanentLifecycle = {
    permanentQlId: allocation.qlId,
    maturity: "ENGLISH_IMPLEMENTATION_FROZEN",
    reviewStatus: "AWAITING_PRODUCT_OWNER_EDITORIAL_REVIEW",
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    active: false,
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
  };

  return Object.freeze({
    packageId: "NUM-001",
    checkpointId: "NUM-CP-002",
    permanentQlId: allocation.qlId,
    questionLanguageId: allocation.qlId,
    questionId: `NUM-001:${allocation.qlId}:${seed}`,
    qlTemplateId: allocation.qlTemplateId,
    solveModeId: allocation.solveModeId,
    authorityId: allocation.authorityId,
    temporaryPrototypeId: runtimePrototypeId,
    authorityPrototypeIds: variants,
    seed,
    sourceSeed,
    locale: "en-IN",
    language: "en",
    difficulty,
    answerSemantic: temporary.answerSemantic,
    stem,
    options: temporary.options,
    correctIndex: temporary.correctIndex,
    canonicalAnswer: temporary.canonicalAnswer,
    verifierAnswer: independent,
    hiddenState: temporary.hiddenState,
    mathematicalFingerprint: `${allocation.qlId}:${runtimePrototypeId}:${temporary.mathematicalFingerprint}`,
    explanation,
    sourceAncestry: Object.freeze([
      ...temporary.sourceAncestry,
      "NUM-CP-002-PERMANENT-ALLOCATION",
      "NUM-CP-002-PERMANENT-ENGLISH-FREEZE",
    ]),
    allocationStatus: "PRODUCT_OWNER_APPROVED_INACTIVE_ENGLISH_IMPLEMENTATION",
    permanentIdentityFrozen: true,
    solveModeFrozen: true,
    englishImplementationFrozen: true,
    reviewStatus: "AWAITING_PRODUCT_OWNER_EDITORIAL_REVIEW",
    maturity: "ENGLISH_IMPLEMENTATION_FROZEN",
    lifecycle,
    traceability: Object.freeze({
      packageId: "NUM-001",
      canonicalProblemId: "NUM-CP-002",
      questionLanguageId: allocation.qlId,
      qlTemplateId: allocation.qlTemplateId,
      solveModeId: allocation.solveModeId,
      authorityId: allocation.authorityId,
      authorityPrototypeIds: variants,
      runtimePrototypeId,
      language: "en",
    }),
  });
}

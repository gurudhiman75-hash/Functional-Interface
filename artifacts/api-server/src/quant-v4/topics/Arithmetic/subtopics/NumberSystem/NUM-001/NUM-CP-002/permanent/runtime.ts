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
import {
  generateNumCp002Wave02,
  independentlyVerifyNumCp002Wave02,
} from "../wave02/runtime";
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
  else if (n <= 22) result = generateNumCp002Wave02(prototypeId as never, seed);
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
  "NUM-QL-145": ["EASY", "MEDIUM"],
  "NUM-QL-146": ["EASY", "MEDIUM"],
  "NUM-QL-147": ["EASY", "MEDIUM"],
  "NUM-QL-148": ["MEDIUM", "HARD"],
  "NUM-QL-149": ["EASY", "MEDIUM"],
  "NUM-QL-150": ["MEDIUM", "HARD"],
  "NUM-QL-151": ["MEDIUM"],
  "NUM-QL-152": ["MEDIUM", "HARD"],
  "NUM-QL-153": ["MEDIUM"],
  "NUM-QL-154": ["EASY", "MEDIUM"],
  "NUM-QL-155": ["MEDIUM", "HARD"],
  "NUM-QL-156": ["MEDIUM", "HARD"],
  "NUM-QL-157": ["MEDIUM", "HARD"],
  "NUM-QL-158": ["HARD"],
  "NUM-QL-159": ["HARD"],
  "NUM-QL-160": ["MEDIUM", "HARD"],
  "NUM-QL-161": ["MEDIUM", "HARD"],
  "NUM-QL-162": ["HARD"],
  "NUM-QL-163": ["MEDIUM", "HARD"],
  "NUM-QL-164": ["MEDIUM", "HARD"],
  "NUM-QL-165": ["HARD"],
});

export function getNumCp002PermanentDifficultyBands(qlId: NumCp002PermanentQlId): readonly NumCp002PermanentDifficulty[] {
  return DIFFICULTY_BANDS[qlId];
}

function permanentDifficulty(qlId: NumCp002PermanentQlId, seed: number): NumCp002PermanentDifficulty {
  const bands = DIFFICULTY_BANDS[qlId];
  return bands[(seed - 1) % bands.length]!;
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

function primeFactorisation(value: number): string {
  if (value <= 1) return math(String(value));
  let n = value;
  const parts: string[] = [];
  for (let p = 2; p * p <= n; p += 1) {
    if (n % p !== 0) continue;
    let exponent = 0;
    while (n % p === 0) { n /= p; exponent += 1; }
    parts.push(exponent === 1 ? String(p) : `${p}^{${exponent}}`);
  }
  if (n > 1) parts.push(String(n));
  return math(parts.join("\\times"));
}

function remodelStatementStem(stem: string): string {
  return stem
    .replace(
      "A rational decimal may terminate after common factors are cancelled first.",
      "A rational number may have a terminating decimal after common factors are cancelled.",
    )
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
    .replace("rational decimal", "rational number");
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
    const answerLine = id === "NUM-CP002-PROT-017"
      ? `This gives ${math(String(valid.length))} valid denominators.`
      : `Hence the complete set is ${setLatex(valid)}.`;
    return {
      concept: `After cancelling common factors, the denominator may contain only ${math("2")} and ${math("5")}.`,
      solution: [
        `So any prime factor of ${math("d")} other than ${math("2")} or ${math("5")} must be completely cancelled by the numerator ${math(String(numerator))}.`,
        `Applying this condition for ${math(`2\\le d\\le${maxD}`)} gives ${setLatex(valid)}. ${answerLine}`,
      ],
      finalAnswer: temporary.canonicalAnswer,
    };
  }

  if (id === "NUM-CP002-PROT-019") {
    const d = Number(h.d);
    return {
      concept: `The numerator must cancel every denominator prime factor other than ${math("2")} and ${math("5")}.`,
      solution: [
        `${math(String(d))}=${primeFactorisation(d)}. Remove all denominator primes other than ${math("2")} and ${math("5")} through cancellation.`,
        `Among the options, ${temporary.canonicalAnswer} supplies the complete required cancellation.`,
      ],
      finalAnswer: temporary.canonicalAnswer,
    };
  }

  if (id === "NUM-CP002-PROT-031") {
    return {
      concept: "Check each statement separately using exact fraction and decimal rules.",
      solution: temporary.explanation.solution.slice(0, 3),
      finalAnswer: temporary.canonicalAnswer,
    };
  }

  if (id === "NUM-CP002-PROT-032") {
    return {
      concept: `A statement is sufficient only if it fixes the yes/no answer for every allowed value of ${math("n")}.`,
      solution: temporary.explanation.solution.slice(0, 3),
      finalAnswer: temporary.canonicalAnswer,
    };
  }

  return {
    concept: cleanConcept(temporary.explanation.concept),
    solution: temporary.explanation.solution.slice(0, 3),
    finalAnswer: temporary.canonicalAnswer,
  };
}

function authorityPrototypeIds(allocation: NumCp002PermanentAllocationEntry): readonly string[] {
  return Object.freeze([...allocation.corePrototypeIds, ...allocation.adapterPrototypeIds]);
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
  const sourceSeed = Math.floor((seed - 1) / variants.length) + 1;
  const runtimePrototypeId = variants[variantIndex]!;
  if (runtimePrototypeId === "NUM-CP002-PROT-027" || runtimePrototypeId === "NUM-CP002-PROT-028") {
    throw new Error(`${questionLanguageId}: delegated Algebra prototype reached permanent Number System runtime`);
  }

  const temporary = generateNumCp002TemporaryAuthorityPackage(runtimePrototypeId, sourceSeed);
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

  const difficulty = permanentDifficulty(allocation.qlId, seed);
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

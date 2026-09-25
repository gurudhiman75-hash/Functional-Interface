import {
  equalsRational,
  formatRational,
  multiplyPolynomials,
  polynomial,
  rational,
  solveRationalEquationOverRationals,
  type Polynomial1,
  type Rational,
  type RationalEquation1,
  type RationalFunction1,
} from "../../../../../shared/algebra";
import type { AlgCp008Answer } from "../ALG-002/ALG-CP-008/types";
import { ALG_ENGLISH_V3_FREEZE_ID } from "./english-freeze-v3";

export const ALG_CP008_ENGLISH_REVIEW_V4_AUTHORITY =
  "ALG-CP008-ENGLISH-REVIEW-V4-CONTROLLED-REOPEN" as const;

export type AlgCp008ReviewV4PrototypeId =
  | "ALG-CP001-CAND-006"
  | "ALG-CP008-CAND-005"
  | "ALG-CP008-CAND-007";

export type AlgCp008ReviewV4Answer =
  | AlgCp008Answer
  | { kind: "BOOLEAN"; value: boolean };

export interface AlgCp008EnglishReviewV4Item {
  readonly authority: typeof ALG_CP008_ENGLISH_REVIEW_V4_AUTHORITY;
  readonly sourceFreezeId: typeof ALG_ENGLISH_V3_FREEZE_ID;
  readonly cpId: "ALG-CP-008";
  readonly packageId: "ALG-002";
  readonly qlId: "ALG-QL-024";
  readonly prototypeId: AlgCp008ReviewV4PrototypeId;
  readonly seed: number;
  readonly question: string;
  readonly answer: AlgCp008ReviewV4Answer;
  readonly answerText: string;
  readonly explanation: string;
  readonly equation?: RationalEquation1;
  readonly state:
    | Readonly<{
        kind: "DOMAIN_CHECK";
        forbidden: number;
        testValue: number;
        denominatorValue: number;
        defined: boolean;
      }>
    | Readonly<{
        kind: "NO_VALID_ROOT";
        excluded: number;
        rightRoot: number;
      }>
    | Readonly<{
        kind: "INFINITE_ON_DOMAIN";
        excludedValues: readonly [number, number];
      }>;
  readonly permanentIdentityFrozen: true;
  readonly semanticContractFrozen: true;
  readonly solverAuthorityFrozen: true;
  readonly learnerContentFrozen: false;
  readonly reviewStatus: "REVIEW_CANDIDATE_ONLY";
  readonly active: false;
  readonly questionStudioDiscoverable: false;
  readonly questionBankWritable: false;
  readonly testEligible: false;
  readonly publiclyPublishable: false;
}

function positiveMod(value: number, modulus: number) {
  return ((value % modulus) + modulus) % modulus;
}

function denominatorText(forbidden: number) {
  if (forbidden === 0) return "x";
  return forbidden < 0 ? `x + ${Math.abs(forbidden)}` : `x - ${forbidden}`;
}

function polynomialText(value: Polynomial1): string {
  const pieces: string[] = [];
  for (let degree = value.coefficients.length - 1; degree >= 0; degree -= 1) {
    const coefficient = value.coefficients[degree]!;
    if (coefficient.numerator === 0n) continue;
    if (coefficient.denominator !== 1n) throw new Error("CP-008 V4 formatter expects integer coefficients");
    const n = Number(coefficient.numerator);
    const absolute = Math.abs(n);
    const variable = degree === 0 ? "" : degree === 1 ? "x" : degree === 2 ? "x²" : `x^${degree}`;
    const magnitude = degree > 0 && absolute === 1 ? variable : `${absolute}${variable}`;
    if (pieces.length === 0) pieces.push(n < 0 ? `-${magnitude}` : magnitude);
    else pieces.push(`${n < 0 ? "-" : "+"} ${magnitude}`);
  }
  return pieces.join(" ") || "0";
}

function fractionText(value: RationalFunction1) {
  return `(${polynomialText(value.numerator)})/(${polynomialText(value.denominator)})`;
}

function rationalFunctionText(value: RationalFunction1) {
  const denominator = polynomialText(value.denominator);
  return denominator === "1" ? polynomialText(value.numerator) : fractionText(value);
}

function denominatorSubstitutionText(forbidden: number, testValue: number, denominatorValue: number) {
  if (forbidden === 0) return `${testValue} = ${denominatorValue}`;
  if (forbidden < 0) return `${testValue} + ${Math.abs(forbidden)} = ${denominatorValue}`;
  return `${testValue} - ${forbidden} = ${denominatorValue}`;
}

function linearFactor(excluded: number): Polynomial1 {
  return polynomial("x", [
    rational(BigInt(-excluded)),
    rational(1n),
  ]);
}

function pairState(seed: number) {
  const index = positiveMod(seed - 1, 64);
  const excluded = (index % 16) - 8;
  const band = Math.floor(index / 16);
  const deltas = [1, -2, 3, -4] as const;
  const rightRoot = excluded + deltas[band]!;
  if (rightRoot === excluded) throw new Error("CP-008 V4 pair state must use distinct roots");
  return { excluded, rightRoot };
}

function rationalFunction(numerator: Polynomial1, denominator: Polynomial1): RationalFunction1 {
  return { numerator, denominator };
}

function domainQuestion(forbidden: number, testValue: number, frame: number) {
  const expression = `1/(${denominatorText(forbidden)})`;
  switch (frame % 4) {
    case 0:
      return `Is the expression ${expression} defined at x = ${testValue}?`;
    case 1:
      return `For x = ${testValue}, is ${expression} defined?`;
    case 2:
      return `Check whether ${expression} has a defined value when x = ${testValue}.`;
    default:
      return `Does x = ${testValue} belong to the domain of ${expression}?`;
  }
}

function generateDomainCheck(seed: number): AlgCp008EnglishReviewV4Item {
  const index = positiveMod(seed - 1, 64);
  const definedCase = index >= 32;
  const forbidden = definedCase ? index - 48 : index - 16;
  const testValue = definedCase
    ? forbidden + (index % 2 === 0 ? 1 : -1)
    : forbidden;
  const denominatorValue = testValue - forbidden;
  const defined = denominatorValue !== 0;

  return {
    authority: ALG_CP008_ENGLISH_REVIEW_V4_AUTHORITY,
    sourceFreezeId: ALG_ENGLISH_V3_FREEZE_ID,
    cpId: "ALG-CP-008",
    packageId: "ALG-002",
    qlId: "ALG-QL-024",
    prototypeId: "ALG-CP001-CAND-006",
    seed,
    question: domainQuestion(forbidden, testValue, seed),
    answer: { kind: "BOOLEAN", value: defined },
    answerText: defined ? "Yes" : "No",
    explanation: [
      `The denominator is ${denominatorText(forbidden)}, and a rational expression is defined only when its denominator is non-zero.`,
      `Substitute x = ${testValue}: the denominator becomes ${denominatorSubstitutionText(forbidden, testValue, denominatorValue)}.`,
      denominatorValue === 0
        ? "Because the denominator becomes 0, division is not defined at this value."
        : `Because ${denominatorValue} is non-zero, the denominator is valid and the expression has a defined value.`,
      `Therefore the answer is ${defined ? "Yes" : "No"}.`,
    ].join(" "),
    state: { kind: "DOMAIN_CHECK", forbidden, testValue, denominatorValue, defined },
    permanentIdentityFrozen: true,
    semanticContractFrozen: true,
    solverAuthorityFrozen: true,
    learnerContentFrozen: false,
    reviewStatus: "REVIEW_CANDIDATE_ONLY",
    active: false,
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
  };
}

function rationalEquationQuestion(equation: RationalEquation1, mode: "NO_SOLUTION" | "INFINITE", frame: number) {
  const equationText = `${rationalFunctionText(equation.left)} = ${rationalFunctionText(equation.right)}`;
  if (mode === "NO_SOLUTION") {
    switch (frame % 4) {
      case 0: return `Solve ${equationText}.`;
      case 1: return `Find the solution set of ${equationText}.`;
      case 2: return `Determine all values of x satisfying ${equationText}.`;
      default: return `Solve the rational equation ${equationText}, keeping the original domain restriction in mind.`;
    }
  }
  switch (frame % 4) {
    case 0: return `Describe the solution set of ${equationText}.`;
    case 1: return `For which real values of x does ${equationText} hold?`;
    case 2: return `Determine the complete real solution set of ${equationText}.`;
    default: return `State all real x satisfying ${equationText}, taking the original domain restriction into account.`;
  }
}

function generateNoValidRoot(seed: number): AlgCp008EnglishReviewV4Item {
  const { excluded, rightRoot } = pairState(seed);
  const denominator = linearFactor(excluded);
  const numerator = multiplyPolynomials(denominator, denominator);
  const rightNumerator = linearFactor(rightRoot);
  const equation: RationalEquation1 = {
    left: rationalFunction(numerator, denominator),
    right: rationalFunction(rightNumerator, polynomial("x", [rational(1n)])),
  };
  const solved = solveRationalEquationOverRationals(equation);
  if (solved.kind !== "NO_SOLUTION") {
    throw new Error("CP-008 V4 no-valid-root construction did not produce NO_SOLUTION");
  }
  if (
    solved.excludedValues.length !== 1
    || !equalsRational(solved.excludedValues[0]!, rational(BigInt(excluded)))
    || solved.rejectedExcludedRoots.length !== 1
    || !equalsRational(solved.rejectedExcludedRoots[0]!, rational(BigInt(excluded)))
  ) {
    throw new Error("CP-008 V4 no-valid-root exclusion proof mismatch");
  }

  const denominatorDisplay = polynomialText(denominator);
  const rightDisplay = polynomialText(rightNumerator);
  const difference = rightRoot - excluded;

  return {
    authority: ALG_CP008_ENGLISH_REVIEW_V4_AUTHORITY,
    sourceFreezeId: ALG_ENGLISH_V3_FREEZE_ID,
    cpId: "ALG-CP-008",
    packageId: "ALG-002",
    qlId: "ALG-QL-024",
    prototypeId: "ALG-CP008-CAND-005",
    seed,
    question: rationalEquationQuestion(equation, "NO_SOLUTION", seed),
    answer: { kind: "NO_SOLUTION" },
    answerText: "No solution",
    explanation: [
      `The original denominator is ${denominatorDisplay}, so x = ${excluded} is excluded from the domain.`,
      `Cross-multiplying gives (${denominatorDisplay})² = (${rightDisplay})(${denominatorDisplay}).`,
      `Bringing the right side over and factoring gives ${difference}(${denominatorDisplay}) = 0, so the only algebraic candidate is x = ${excluded}.`,
      `But x = ${excluded} makes the original denominator 0, so that candidate must be rejected. Therefore the equation has no solution.`,
    ].join(" "),
    equation,
    state: { kind: "NO_VALID_ROOT", excluded, rightRoot },
    permanentIdentityFrozen: true,
    semanticContractFrozen: true,
    solverAuthorityFrozen: true,
    learnerContentFrozen: false,
    reviewStatus: "REVIEW_CANDIDATE_ONLY",
    active: false,
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
  };
}

function generateInfiniteOnDomain(seed: number): AlgCp008EnglishReviewV4Item {
  const { excluded, rightRoot } = pairState(seed + 17);
  const leftFactor = linearFactor(excluded);
  const rightFactor = linearFactor(rightRoot);
  const equation: RationalEquation1 = {
    left: rationalFunction(leftFactor, leftFactor),
    right: rationalFunction(rightFactor, rightFactor),
  };
  const solved = solveRationalEquationOverRationals(equation);
  if (solved.kind !== "INFINITE_ON_DOMAIN") {
    throw new Error("CP-008 V4 restricted-domain identity did not produce INFINITE_ON_DOMAIN");
  }
  const expected = [rational(BigInt(excluded)), rational(BigInt(rightRoot))];
  if (
    solved.excludedValues.length !== 2
    || !expected.every((value) => solved.excludedValues.some((actual) => equalsRational(actual, value)))
  ) {
    throw new Error("CP-008 V4 restricted-domain exclusions mismatch");
  }

  const excludedText = [excluded, rightRoot].sort((a, b) => a - b).join(" and ");

  return {
    authority: ALG_CP008_ENGLISH_REVIEW_V4_AUTHORITY,
    sourceFreezeId: ALG_ENGLISH_V3_FREEZE_ID,
    cpId: "ALG-CP-008",
    packageId: "ALG-002",
    qlId: "ALG-QL-024",
    prototypeId: "ALG-CP008-CAND-007",
    seed,
    question: rationalEquationQuestion(equation, "INFINITE", seed),
    answer: { kind: "INFINITE_ON_DOMAIN", excludedValues: solved.excludedValues },
    answerText: `All real x except ${excludedText}`,
    explanation: [
      `The left side is the same non-zero factor divided by itself, so it equals 1 whenever x ≠ ${excluded}.`,
      `The right side also equals 1 whenever x ≠ ${rightRoot}.`,
      `Thus both sides are equal for every real x in the original domain, but x = ${excluded} and x = ${rightRoot} are excluded because a denominator becomes 0.`,
      `Therefore the solution set is all real x except ${excludedText}.`,
    ].join(" "),
    equation,
    state: { kind: "INFINITE_ON_DOMAIN", excludedValues: [excluded, rightRoot] },
    permanentIdentityFrozen: true,
    semanticContractFrozen: true,
    solverAuthorityFrozen: true,
    learnerContentFrozen: false,
    reviewStatus: "REVIEW_CANDIDATE_ONLY",
    active: false,
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
  };
}

export function generateAlgCp008EnglishReviewV4(
  prototypeId: AlgCp008ReviewV4PrototypeId,
  seed: number,
): AlgCp008EnglishReviewV4Item {
  if (!Number.isInteger(seed)) throw new Error("ALG-CP008 V4 review requires an integer seed");
  if (prototypeId === "ALG-CP001-CAND-006") return generateDomainCheck(seed);
  if (prototypeId === "ALG-CP008-CAND-005") return generateNoValidRoot(seed);
  return generateInfiniteOnDomain(seed);
}

export const ALG_CP008_ENGLISH_REVIEW_V4_TARGETS = Object.freeze([
  "ALG-CP001-CAND-006",
  "ALG-CP008-CAND-005",
  "ALG-CP008-CAND-007",
] as const);

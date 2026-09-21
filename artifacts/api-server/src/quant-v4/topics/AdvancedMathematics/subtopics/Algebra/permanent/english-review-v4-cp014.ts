import {
  compareRationalPossibilitySets,
  divideRational,
  formatDataSufficiencyVerdict,
  formatQuantityRelation,
  formatRational,
  rational,
  solveLinearEquation,
  solveLinearSystem2V,
  type Rational,
} from "../../../../../shared/algebra";
import { generateAlgCp014DiscoveryItem } from "../ALG-002/ALG-CP-014";
import type {
  AlgCp014DiscoveryItem,
  AlgCp014SingleVariableStatement,
} from "../ALG-002/ALG-CP-014/types";
import { ALG_ENGLISH_V3_FREEZE_ID } from "./english-freeze-v3";

export const ALG_CP014_ENGLISH_REVIEW_V4_AUTHORITY =
  "ALG-CP014-ENGLISH-REVIEW-V4-CONTROLLED-REOPEN" as const;

export type AlgCp014ReviewV4PrototypeId =
  | "ALG-CP014-CAND-002"
  | "ALG-CP014-CAND-003"
  | "ALG-CP014-CAND-004"
  | "ALG-CP014-CAND-005"
  | "ALG-CP014-CAND-006"
  | "ALG-CP014-CAND-007"
  | "ALG-CP014-CAND-008";

export interface AlgCp014EnglishReviewV4Item {
  readonly authority: typeof ALG_CP014_ENGLISH_REVIEW_V4_AUTHORITY;
  readonly sourceFreezeId: typeof ALG_ENGLISH_V3_FREEZE_ID;
  readonly cpId: "ALG-CP-014";
  readonly packageId: "ALG-002";
  readonly qlId: "ALG-QL-039" | "ALG-QL-040";
  readonly prototypeId: AlgCp014ReviewV4PrototypeId;
  readonly seed: number;
  readonly question: string;
  readonly answer: AlgCp014DiscoveryItem["answer"];
  readonly answerText: string;
  readonly explanation: string;
  readonly math: AlgCp014DiscoveryItem["math"];
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

function integer(value: Rational) {
  if (value.denominator !== 1n) return formatRational(value);
  return String(value.numerator);
}

function valuesText(values: readonly Rational[]) {
  return values.map(integer).join(" or ");
}

function setComparisonStem(
  q1: readonly Rational[],
  q2: readonly Rational[],
  frame: number,
) {
  const first = valuesText(q1);
  const second = valuesText(q2);
  switch (frame % 4) {
    case 0:
      return `Quantity I may be ${first}, while Quantity II may be ${second}. Compare the quantities using every allowed case.`;
    case 1:
      return `The possible values of Quantity I are ${first}. The possible values of Quantity II are ${second}. Which relation must hold for all cases?`;
    case 2:
      return `Compare Quantity I (${first}) with Quantity II (${second}) after considering all possible values.`;
    default:
      return `Considering every admissible value, determine the relation between Quantity I: ${first} and Quantity II: ${second}.`;
  }
}

function generateDeterminateSetComparison(seed: number): AlgCp014EnglishReviewV4Item {
  const index = positiveMod(seed - 1, 420);
  const base = (Math.floor(index / 2) % 21) - 10;
  const orientation = index % 2;
  const gap = 2 + (Math.floor(index / 42) % 5);
  const lowerWidth = 1 + (Math.floor(index / 210) % 2);
  const upperWidth = 1 + (Math.floor(index / 105) % 3);

  const low = [rational(base - lowerWidth), rational(base)];
  const high = [rational(base + gap), rational(base + gap + upperWidth)];
  const q1Values = orientation === 0 ? high : low;
  const q2Values = orientation === 0 ? low : high;
  const relation = compareRationalPossibilitySets(q1Values, q2Values);
  const answer = {
    kind: "QUANTITY_RELATION" as const,
    value: relation,
    text: formatQuantityRelation(relation),
  };
  const smallestHigh = orientation === 0 ? q1Values[0]! : q2Values[0]!;
  const largestLow = orientation === 0 ? q2Values[1]! : q1Values[1]!;
  const dominant = orientation === 0 ? "Quantity I" : "Quantity II";
  const other = orientation === 0 ? "Quantity II" : "Quantity I";

  return {
    authority: ALG_CP014_ENGLISH_REVIEW_V4_AUTHORITY,
    sourceFreezeId: ALG_ENGLISH_V3_FREEZE_ID,
    cpId: "ALG-CP-014",
    packageId: "ALG-002",
    qlId: "ALG-QL-039",
    prototypeId: "ALG-CP014-CAND-002",
    seed,
    question: setComparisonStem(q1Values, q2Values, seed),
    answer,
    answerText: answer.text,
    explanation: [
      `Check the extreme allowed values instead of testing only one pair.`,
      `The smallest possible ${dominant} is ${formatRational(smallestHigh)}, while the largest possible ${other} is ${formatRational(largestLow)}.`,
      `Since ${formatRational(smallestHigh)} > ${formatRational(largestLow)}, the same comparison holds for every admissible pairing.`,
      `Therefore ${answer.text}.`,
    ].join(" "),
    math: { kind: "SET_QC", quantityIValues: [...q1Values], quantityIIValues: [...q2Values] },
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

function generateIndeterminateSetComparison(seed: number): AlgCp014EnglishReviewV4Item {
  const index = positiveMod(seed - 1, 420);
  const base = (index % 31) - 15;
  const leftI = 1 + (Math.floor(index / 31) % 4);
  const rightI = 2 + (Math.floor(index / 124) % 4);
  const leftII = 2 + (index % 3);
  const rightII = 1 + (Math.floor(index / 3) % 4);
  const q1Values = [rational(base - leftI), rational(base + rightI)];
  const q2Values = [rational(base - leftII), rational(base + rightII)];
  const relation = compareRationalPossibilitySets(q1Values, q2Values);
  const answer = {
    kind: "QUANTITY_RELATION" as const,
    value: relation,
    text: formatQuantityRelation(relation),
  };

  return {
    authority: ALG_CP014_ENGLISH_REVIEW_V4_AUTHORITY,
    sourceFreezeId: ALG_ENGLISH_V3_FREEZE_ID,
    cpId: "ALG-CP-014",
    packageId: "ALG-002",
    qlId: "ALG-QL-039",
    prototypeId: "ALG-CP014-CAND-003",
    seed,
    question: setComparisonStem(q1Values, q2Values, seed + 1),
    answer,
    answerText: answer.text,
    explanation: [
      `Use two valid pairings to test whether one fixed relation always holds.`,
      `Taking Quantity I = ${formatRational(q1Values[0]!)} and Quantity II = ${formatRational(q2Values[1]!)} gives Quantity I < Quantity II.`,
      `Taking Quantity I = ${formatRational(q1Values[1]!)} and Quantity II = ${formatRational(q2Values[0]!)} gives Quantity I > Quantity II.`,
      `Because different admissible cases give different relations, ${answer.text.toLowerCase()}.`,
    ].join(" "),
    math: { kind: "SET_QC", quantityIValues: [...q1Values], quantityIIValues: [...q2Values] },
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

function statementExplanation(
  label: "Statement I" | "Statement II",
  statement: AlgCp014SingleVariableStatement,
  visible: string,
) {
  if (statement.kind === "LINEAR_EQUATION") {
    const solved = solveLinearEquation(statement.equation);
    if (solved.kind !== "UNIQUE") {
      throw new Error(`${label} was expected to have one exact solution`);
    }
    return `${label} (${visible}) gives x = ${formatRational(solved.value)} after solving the linear equation. Because the non-zero coefficient leaves only this single value of x, the statement is sufficient by itself.`;
  }
  return `${label} (${visible}) is an inequality. It restricts x to one side of a boundary but still allows many possible x-values, so the statement does not determine one unique value of x.`;
}

function dataSufficiencyExplanation(
  prototypeId: Exclude<AlgCp014ReviewV4PrototypeId, "ALG-CP014-CAND-002" | "ALG-CP014-CAND-003">,
  base: AlgCp014DiscoveryItem,
) {
  if (!base.statements) throw new Error(`${prototypeId} is missing data-sufficiency statements`);

  if (base.math.kind === "DS_SINGLE_VARIABLE") {
    const first = statementExplanation("Statement I", base.math.statementI, base.statements[0].replace(/^I\.\s*/, ""));
    const second = statementExplanation("Statement II", base.math.statementII, base.statements[1].replace(/^II\.\s*/, ""));
    return [
      first,
      second,
      `Therefore ${base.answer.text}.`,
    ].join(" ");
  }

  if (base.math.kind !== "DS_SYSTEM") {
    throw new Error(`${prototypeId} has an unexpected math state`);
  }

  const [statementI, statementII] = base.statements;
  const solved = solveLinearSystem2V(base.math.system);

  if (prototypeId === "ALG-CP014-CAND-007") {
    if (solved.kind !== "UNIQUE") throw new Error("CAND-007 must have a unique combined solution");
    return [
      `Statement I (${statementI.replace(/^I\.\s*/, "")}) is one equation in x and y, so x is not fixed by Statement I alone.`,
      `Statement II (${statementII.replace(/^II\.\s*/, "")}) is also one equation in two unknowns, so Statement II alone is insufficient.`,
      `Using both independent equations together gives x = ${formatRational(solved.x)} and y = ${formatRational(solved.y)}.`,
      `Thus x is uniquely determined only when both statements are used together. Therefore ${base.answer.text.toLowerCase()}.`,
    ].join(" ");
  }

  if (prototypeId === "ALG-CP014-CAND-008") {
    const scale = divideRational(base.math.system.a2, base.math.system.a1);
    return [
      `Statement I is ${statementI.replace(/^I\.\s*/, "")}.`,
      `Statement II is ${statementII.replace(/^II\.\s*/, "")}, and every coefficient and the constant are ${formatRational(scale)} times those in Statement I.`,
      `So both statements represent the same line, not two independent equations. Infinitely many (x, y) pairs remain possible, so x is not unique.`,
      `Therefore ${base.answer.text}.`,
    ].join(" ");
  }

  throw new Error(`${prototypeId} was expected to use the single-variable data-sufficiency path`);
}

function generateDataSufficiencyReview(
  prototypeId: Exclude<AlgCp014ReviewV4PrototypeId, "ALG-CP014-CAND-002" | "ALG-CP014-CAND-003">,
  seed: number,
): AlgCp014EnglishReviewV4Item {
  let base = generateAlgCp014DiscoveryItem(prototypeId, seed);
  if (prototypeId === "ALG-CP014-CAND-006" && base.statements?.[0] === base.statements?.[1]) {
    for (let attempt = 1; attempt <= 12; attempt += 1) {
      const candidate = generateAlgCp014DiscoveryItem(prototypeId, seed + attempt * 104729);
      if (candidate.statements?.[0] !== candidate.statements?.[1]) {
        base = candidate;
        break;
      }
    }
  }
  if (base.answer.kind !== "DATA_SUFFICIENCY") {
    throw new Error(`${prototypeId} did not produce a data-sufficiency answer`);
  }
  if (prototypeId === "ALG-CP014-CAND-006" && base.statements?.[0] === base.statements?.[1]) {
    throw new Error("CAND-006 review must not repeat the exact same sufficient statement twice");
  }
  const question = [base.stem, ...(base.statements ?? [])].join("\n");

  return {
    authority: ALG_CP014_ENGLISH_REVIEW_V4_AUTHORITY,
    sourceFreezeId: ALG_ENGLISH_V3_FREEZE_ID,
    cpId: "ALG-CP-014",
    packageId: "ALG-002",
    qlId: "ALG-QL-040",
    prototypeId,
    seed,
    question,
    answer: base.answer,
    answerText: base.answer.text,
    explanation: dataSufficiencyExplanation(prototypeId, base),
    math: base.math,
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

export function generateAlgCp014EnglishReviewV4(
  prototypeId: AlgCp014ReviewV4PrototypeId,
  seed: number,
): AlgCp014EnglishReviewV4Item {
  if (!Number.isInteger(seed)) throw new Error("ALG-CP014 V4 review requires an integer seed");
  if (prototypeId === "ALG-CP014-CAND-002") return generateDeterminateSetComparison(seed);
  if (prototypeId === "ALG-CP014-CAND-003") return generateIndeterminateSetComparison(seed);
  return generateDataSufficiencyReview(prototypeId, seed);
}

export const ALG_CP014_ENGLISH_REVIEW_V4_TARGETS = Object.freeze([
  "ALG-CP014-CAND-002",
  "ALG-CP014-CAND-003",
  "ALG-CP014-CAND-004",
  "ALG-CP014-CAND-005",
  "ALG-CP014-CAND-006",
  "ALG-CP014-CAND-007",
  "ALG-CP014-CAND-008",
] as const);

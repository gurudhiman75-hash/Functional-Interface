import {
  SAP_E1_INACTIVE_LIFECYCLE,
  sapE1BaseValidation,
  sapE1Math,
  sapE1Options,
  type SapE1CandidatePackage,
} from "../../SAP-E1-CANDIDATE-TYPES";

export const SAP_CP004_E3_HETEROGENEOUS_ROOT_CHAIN = "SAP-CP004-E3-CAND-HETEROGENEOUS-EXACT-ROOT-CHAIN" as const;
export const SAP_CP004_E3_DECIMAL_ROOT_QUOTIENT = "SAP-CP004-E3-CAND-DECIMAL-ROOT-QUOTIENT" as const;
export const SAP_CP004_E3_CANDIDATE_IDS = Object.freeze([
  SAP_CP004_E3_HETEROGENEOUS_ROOT_CHAIN,
  SAP_CP004_E3_DECIMAL_ROOT_QUOTIENT,
] as const);
export type SapCp004E3CandidateId = typeof SAP_CP004_E3_CANDIDATE_IDS[number];

function pow(base: number, exponent: number): number {
  let out = 1;
  for (let i = 0; i < exponent; i += 1) out *= base;
  return out;
}
function root(index: number, body: string | number): string {
  return index === 2 ? `\\sqrt{${body}}` : `\\sqrt[${index}]{${body}}`;
}
function fixed(value: number, places: number): string {
  return value.toFixed(places).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
}
function makePackage(args: {
  candidateId: SapCp004E3CandidateId;
  seed: number;
  difficulty: "MEDIUM" | "HARD";
  stem: string;
  answer: string;
  wrongs: readonly { value: string; misconceptionId: string; analysis: string }[];
  concept: string;
  steps: readonly string[];
  verification: readonly string[];
  oracleKind: string;
  data: Readonly<Record<string, number | string>>;
  sourceDisposition: string;
}): SapE1CandidatePackage {
  const correctIndex = (args.seed - 1) % 4;
  const options = sapE1Options(args.answer, args.wrongs, correctIndex);
  const errors = [...sapE1BaseValidation({ stem: args.stem, answer: args.answer, options, correctIndex, steps: args.steps })];
  if (/[√∛∜]/.test(`${args.stem} ${args.steps.join(" ")}`)) errors.push("Raw Unicode radical leaked into E3 learner text.");
  return Object.freeze({
    packageId: "SAP-001",
    checkpointId: "SAP-CP-004",
    candidateId: args.candidateId,
    candidateStatus: "E1_PROVISIONAL_UNALLOCATED",
    sourceDisposition: args.sourceDisposition,
    seed: args.seed,
    locale: "en-IN",
    difficulty: args.difficulty,
    stem: args.stem,
    canonicalAnswer: args.answer,
    options,
    correctIndex,
    explanation: Object.freeze({
      coreConcept: args.concept,
      steps: Object.freeze([...args.steps]),
      finalAnswer: `Therefore, the exact value is ${args.answer}.`,
      verification: Object.freeze([...args.verification]),
    }),
    oracle: Object.freeze({ kind: args.oracleKind, data: args.data }),
    canonicalPayloadKey: JSON.stringify({ candidateId: args.candidateId, seed: args.seed, stem: args.stem, answer: args.answer, data: args.data, e3: true }),
    generationIdentity: `${args.candidateId}:${args.seed}:${JSON.stringify(args.data)}`,
    lifecycle: SAP_E1_INACTIVE_LIFECYCLE,
    validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }),
  });
}

function heterogeneousRootChain(seed: number): SapE1CandidatePackage {
  if (!Number.isInteger(seed) || seed < 1 || seed > 100) throw new Error("CP004 E3 seed must be 1..100.");
  const p = seed - 1;
  const sixth = 2 + (p % 4);
  const fourth = 3 + ((p * 3) % 4);
  const cube = 5 + ((p * 5) % 7);
  const square = 12 + ((p * 7) % 19);
  const sixthRad = pow(sixth, 6), fourthRad = pow(fourth, 4), cubeRad = pow(cube, 3), squareRad = pow(square, 2);
  const answerN = sixth + fourth + cube + square;
  const answer = String(answerN);
  const stem = `Simplify ${sapE1Math(`${root(6, sixthRad)} + ${root(4, fourthRad)} + ${root(3, cubeRad)} + ${root(2, squareRad)}`)}.`;
  return makePackage({
    candidateId: SAP_CP004_E3_HETEROGENEOUS_ROOT_CHAIN,
    seed,
    difficulty: "MEDIUM",
    stem,
    answer,
    wrongs: [
      { value: String(answerN - sixth), misconceptionId: "SIXTH_ROOT_TERM_DROPPED", analysis: "The fourth, cube and square roots are evaluated, but the sixth-root term is omitted from the final sum." },
      { value: String(answerN + fourth), misconceptionId: "FOURTH_ROOT_AS_SQUARE_ROOT", analysis: "The fourth root is effectively treated as a square root, making that contribution too large." },
      { value: String(answerN + cubeRad - cube), misconceptionId: "CUBE_RADICAND_NOT_ROOTED", analysis: "The cube-root block is left as its radicand instead of being reduced to its exact cube root." },
    ],
    concept: "Evaluate each perfect root at its own index, then combine the exact integer results.",
    steps: [
      `${sapE1Math(`${root(6, sixthRad)}=${sixth},\;${root(4, fourthRad)}=${fourth}`)} and ${sapE1Math(`${root(3, cubeRad)}=${cube},\;${root(2, squareRad)}=${square}`)}.`,
      `${sixth} + ${fourth} + ${cube} + ${square} = ${answer}.`,
    ],
    verification: [`Checks: ${sixth}^6=${sixthRad}, ${fourth}^4=${fourthRad}, ${cube}^3=${cubeRad}, ${square}^2=${squareRad}.`],
    oracleKind: "HETEROGENEOUS_EXACT_ROOT_CHAIN",
    data: Object.freeze({ sixth, fourth, cube, square, sixthRad, fourthRad, cubeRad, squareRad, answer: answerN }),
    sourceDisposition: "E3_EXPAND_EXISTING_CP004_ROOT_ARITHMETIC_NO_NEW_QL",
  });
}

function decimalRootQuotient(seed: number): SapE1CandidatePackage {
  if (!Number.isInteger(seed) || seed < 1 || seed > 100) throw new Error("CP004 E3 seed must be 1..100.");
  const p = seed - 1;
  const denominatorRootMilli = 23 + (p % 37);
  const ratio = 2 + ((p * 3) % 5);
  const numeratorRootMilli = denominatorRootMilli * ratio;
  const numeratorRad = numeratorRootMilli * numeratorRootMilli;
  const denominatorRad = denominatorRootMilli * denominatorRootMilli;
  const numerator = fixed(numeratorRad / 1_000_000, 6);
  const denominator = fixed(denominatorRad / 1_000_000, 6);
  const answer = String(ratio);
  const stem = `Simplify ${sapE1Math(`\\frac{${root(2, numerator)}}{${root(2, denominator)}}`)}.`;
  return makePackage({
    candidateId: SAP_CP004_E3_DECIMAL_ROOT_QUOTIENT,
    seed,
    difficulty: "MEDIUM",
    stem,
    answer,
    wrongs: [
      { value: String(ratio * ratio), misconceptionId: "RADICAND_RATIO_NOT_ROOTED", analysis: "The ratio of the decimal radicands is used directly instead of taking the square root of that ratio." },
      { value: String(Math.max(1, ratio - 1)), misconceptionId: "DECIMAL_ROOT_RATIO_ONE_LOW", analysis: "Both decimal roots are recognised, but their final ratio is reduced one integer too low." },
      { value: String(ratio + 1), misconceptionId: "DECIMAL_ROOT_RATIO_ONE_HIGH", analysis: "Both decimal roots are recognised, but their final ratio is reduced one integer too high." },
    ],
    concept: "Treat terminating-decimal perfect squares exactly; the quotient of their roots is the quotient of the exact decimal root values.",
    steps: [
      `${sapE1Math(`${root(2, numerator)}=${fixed(numeratorRootMilli / 1000, 3)}`)} and ${sapE1Math(`${root(2, denominator)}=${fixed(denominatorRootMilli / 1000, 3)}`)}.`,
      `${fixed(numeratorRootMilli / 1000, 3)} ÷ ${fixed(denominatorRootMilli / 1000, 3)} = ${answer}.`,
    ],
    verification: [`The root-value ratio is ${numeratorRootMilli}:${denominatorRootMilli} = ${ratio}:1.`],
    oracleKind: "DECIMAL_EXACT_ROOT_QUOTIENT",
    data: Object.freeze({ numeratorRootMilli, denominatorRootMilli, numeratorRad, denominatorRad, ratio }),
    sourceDisposition: "E3_EXPAND_EXISTING_CP004_DECIMAL_ROOT_TOPOLOGY_NO_NEW_QL",
  });
}

export function generateSapCp004E3(candidateId: SapCp004E3CandidateId, seed: number): SapE1CandidatePackage {
  if (candidateId === SAP_CP004_E3_HETEROGENEOUS_ROOT_CHAIN) return heterogeneousRootChain(seed);
  return decimalRootQuotient(seed);
}

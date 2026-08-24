import {
  compareRational,
  powRationalInteger,
  proofEvent,
  rational,
  sriInt,
  sriPick,
} from "../../../../../shared/surds-indices";
import { textAnswer, textDistractors } from "../discovery-answer-utils";
import { finalizeSriDiscoveryQuestion } from "../discovery-runtime";
import type { SriCandidateDescriptor, SriDiscoveryQuestion } from "../discovery-types";

export const SRI_CP006_CANDIDATES: readonly SriCandidateDescriptor[] = [
  { candidateId: "C006-A", checkpointId: "SRI-CP-006", title: "compare after same-base alignment", sourceDisposition: "KEEP" },
  { candidateId: "C006-B", checkpointId: "SRI-CP-006", title: "order three or more powers after alignment", sourceDisposition: "KEEP" },
  { candidateId: "C006-C", checkpointId: "SRI-CP-006", title: "compare expressions with a common exponent", sourceDisposition: "NEW" },
  { candidateId: "C006-D", checkpointId: "SRI-CP-006", title: "classify two powers as equal greater or smaller", sourceDisposition: "KEEP" },
  { candidateId: "C006-E", checkpointId: "SRI-CP-006", title: "select the true statement about index laws", sourceDisposition: "NEW" },
  { candidateId: "C006-F", checkpointId: "SRI-CP-006", title: "classify a pair of power-law statements", sourceDisposition: "NEW" },
  { candidateId: "C006-G", checkpointId: "SRI-CP-006", title: "quantity comparison after exact power normalization", sourceDisposition: "NEW" },
] as const;

type Relation = "FIRST_GREATER" | "SECOND_GREATER" | "EQUAL";

function powBigInt(base: number, exponent: number): bigint {
  let value = 1n;
  for (let i = 0; i < exponent; i += 1) value *= BigInt(base);
  return value;
}

function relationFromComparison(comparison: -1 | 0 | 1): Relation {
  return comparison > 0 ? "FIRST_GREATER" : comparison < 0 ? "SECOND_GREATER" : "EQUAL";
}

function relationAnswer(relation: Relation, firstLabel = "First expression", secondLabel = "Second expression") {
  if (relation === "FIRST_GREATER") return textAnswer(`${firstLabel} is greater`, "T:FIRST_GREATER");
  if (relation === "SECOND_GREATER") return textAnswer(`${secondLabel} is greater`, "T:SECOND_GREATER");
  return textAnswer("The two expressions are equal", "T:EQUAL");
}

function relationDistractors() {
  return textDistractors([
    { text: "First expression is greater", key: "T:FIRST_GREATER", misconceptionId: "COMPARE_VISIBLE_BASES_ONLY" },
    { text: "Second expression is greater", key: "T:SECOND_GREATER", misconceptionId: "COMPARE_VISIBLE_EXPONENTS_ONLY" },
    { text: "The two expressions are equal", key: "T:EQUAL", misconceptionId: "ASSUME_EQUAL_AFTER_ALIGNMENT" },
    { text: "Cannot be determined", key: "T:CANNOT_DETERMINE", misconceptionId: "MISS_EXACT_NORMALIZATION" },
  ]);
}

function finishRelation(
  candidateId: string,
  seed: string,
  state: Readonly<Record<string, string | number | boolean>>,
  stem: string,
  solverRelation: Relation,
  verifierRelation: Relation,
  method: string,
  working: readonly string[],
  firstLabel = "First expression",
  secondLabel = "Second expression",
): SriDiscoveryQuestion {
  const answer = relationAnswer(solverRelation, firstLabel, secondLabel);
  return finalizeSriDiscoveryQuestion({
    packageId: "SRI-001",
    checkpointId: "SRI-CP-006",
    candidateId,
    seed,
    state,
    stem,
    answer,
    canonicalSolverKey: answer.canonicalKey,
    independentVerifierKey: relationAnswer(verifierRelation, firstLabel, secondLabel).canonicalKey,
    distractors: relationDistractors(),
    explanation: {
      given: stem.replace(/\?$/, ""),
      asked: "Compare the quantities exactly using index laws.",
      method,
      working,
      answer: answer.text,
    },
    proofEvents: [proofEvent("COMPARE", method, { stem }, { relation: solverRelation })],
  });
}

interface LawStatement {
  readonly id: string;
  readonly text: string;
  readonly trueForDeclaredDomain: boolean;
  readonly misconceptionId: string;
  readonly reason: string;
}

const TRUE_LAWS: readonly LawStatement[] = [
  { id: "MUL_SAME_BASE", text: "For a ≠ 0, a^m × a^n = a^(m+n).", trueForDeclaredDomain: true, misconceptionId: "VALID_MULTIPLICATION_LAW", reason: "Same-base multiplication adds exponents." },
  { id: "DIV_SAME_BASE", text: "For a ≠ 0, a^m ÷ a^n = a^(m-n).", trueForDeclaredDomain: true, misconceptionId: "VALID_DIVISION_LAW", reason: "Same-base division subtracts exponents." },
  { id: "POWER_OF_POWER", text: "For a ≠ 0, (a^m)^n = a^(mn).", trueForDeclaredDomain: true, misconceptionId: "VALID_POWER_OF_POWER", reason: "A power raised to a power multiplies exponents." },
  { id: "ZERO_POWER", text: "For a ≠ 0, a^0 = 1.", trueForDeclaredDomain: true, misconceptionId: "VALID_ZERO_POWER", reason: "Every non-zero base raised to zero equals 1." },
  { id: "COMMON_EXP_PRODUCT", text: "For real a,b and integer n, a^n b^n = (ab)^n whenever both sides are defined.", trueForDeclaredDomain: true, misconceptionId: "VALID_COMMON_EXPONENT", reason: "A common integer exponent distributes over multiplication." },
];

const FALSE_LAWS: readonly LawStatement[] = [
  { id: "ADD_EXPONENTS_ON_SUM", text: "For a ≠ 0, a^m + a^n = a^(m+n).", trueForDeclaredDomain: false, misconceptionId: "ADD_EXPONENTS_ON_ADDITION", reason: "Exponent addition applies to multiplication, not addition." },
  { id: "ZERO_POWER_ZERO", text: "For a ≠ 0, a^0 = 0.", trueForDeclaredDomain: false, misconceptionId: "ZERO_POWER_GIVES_ZERO", reason: "For a non-zero base, a^0=1." },
  { id: "POWER_ADD_EXP", text: "For a ≠ 0, (a^m)^n = a^(m+n).", trueForDeclaredDomain: false, misconceptionId: "ADD_IN_POWER_OF_POWER", reason: "Power-of-power multiplies exponents." },
  { id: "DIV_ADD_EXP", text: "For a ≠ 0, a^m ÷ a^n = a^(m+n).", trueForDeclaredDomain: false, misconceptionId: "ADD_ON_DIVISION", reason: "Division subtracts exponents." },
  { id: "BINOMIAL_POWER", text: "For all real a,b, (a+b)^2 = a^2+b^2.", trueForDeclaredDomain: false, misconceptionId: "DROP_CROSS_TERM", reason: "The square also contains the term 2ab." },
];

export function generateSriCp006Candidate(candidateId: string, seed: string): SriDiscoveryQuestion {
  const commonBase = sriPick(`${seed}:common-base`, [2, 3]);

  switch (candidateId) {
    case "C006-A": {
      const k1 = sriPick(`${seed}:k1`, [2, 3]);
      const k2 = sriPick(`${seed}:k2`, [2, 3, 4].filter((value) => value !== k1));
      const m = sriInt(`${seed}:m`, 1, 5);
      const n = sriInt(`${seed}:n`, 1, 5);
      const visible1 = Number(powBigInt(commonBase, k1));
      const visible2 = Number(powBigInt(commonBase, k2));
      const e1 = k1 * m;
      const e2 = k2 * n;
      const solverRelation = e1 > e2 ? "FIRST_GREATER" : e1 < e2 ? "SECOND_GREATER" : "EQUAL";
      const verifierRelation = relationFromComparison(compareRational(powRationalInteger(rational(visible1), m), powRationalInteger(rational(visible2), n)));
      const stem = sriPick(`${seed}:surface`, [
        `Compare ${visible1}^${m} and ${visible2}^${n}.`,
        `Which is greater: ${visible1}^${m} or ${visible2}^${n}?`,
        `After writing both with base ${commonBase}, compare ${visible1}^${m} with ${visible2}^${n}.`,
      ]);
      return finishRelation(candidateId, seed, { commonBase, visible1, m, visible2, n }, stem, solverRelation, verifierRelation,
        "Rewrite both expressions with the same base and compare their resulting exponents.",
        [`${visible1}^${m} = ${commonBase}^${e1}`, `${visible2}^${n} = ${commonBase}^${e2}`, `Compare ${e1} and ${e2}.`]);
    }
    case "C006-B": {
      const tuples = [
        { label: "A", k: 2, m: 2, exponent: 4 },
        { label: "B", k: 3, m: 2, exponent: 6 },
        { label: "C", k: 3, m: 3, exponent: 9 },
      ] as const;
      const rotation = sriInt(`${seed}:rotation`, 0, 2);
      const ordered = [...tuples.slice(rotation), ...tuples.slice(0, rotation)];
      const expressions = ordered.map((item) => ({
        label: item.label,
        visibleBase: Number(powBigInt(commonBase, item.k)),
        exponent: item.m,
        normalizedExponent: item.exponent,
        value: powBigInt(commonBase, item.exponent),
      }));
      const sortedBySolver = [...expressions].sort((a, b) => a.normalizedExponent - b.normalizedExponent);
      const sortedByVerifier = [...expressions].sort((a, b) => a.value < b.value ? -1 : a.value > b.value ? 1 : 0);
      const solverText = sortedBySolver.map((item) => item.label).join(" < ");
      const verifierText = sortedByVerifier.map((item) => item.label).join(" < ");
      const answer = textAnswer(solverText, `T:ORDER:${solverText}`);
      const wrongOrders = [
        [...sortedBySolver].reverse().map((item) => item.label).join(" < "),
        [sortedBySolver[1]!, sortedBySolver[0]!, sortedBySolver[2]!].map((item) => item.label).join(" < "),
        [sortedBySolver[0]!, sortedBySolver[2]!, sortedBySolver[1]!].map((item) => item.label).join(" < "),
      ];
      const stem = sriPick(`${seed}:surface`, [
        `Arrange A=${expressions[0]!.visibleBase}^${expressions[0]!.exponent}, B=${expressions[1]!.visibleBase}^${expressions[1]!.exponent}, C=${expressions[2]!.visibleBase}^${expressions[2]!.exponent} in increasing order.`,
        `Find the increasing order of A=${expressions[0]!.visibleBase}^${expressions[0]!.exponent}, B=${expressions[1]!.visibleBase}^${expressions[1]!.exponent}, C=${expressions[2]!.visibleBase}^${expressions[2]!.exponent}.`,
        `Using base ${commonBase}, order A=${expressions[0]!.visibleBase}^${expressions[0]!.exponent}, B=${expressions[1]!.visibleBase}^${expressions[1]!.exponent}, C=${expressions[2]!.visibleBase}^${expressions[2]!.exponent} from least to greatest.`,
      ]);
      return finalizeSriDiscoveryQuestion({
        packageId: "SRI-001", checkpointId: "SRI-CP-006", candidateId, seed,
        state: { commonBase, A: `${expressions[0]!.visibleBase}^${expressions[0]!.exponent}`, B: `${expressions[1]!.visibleBase}^${expressions[1]!.exponent}`, C: `${expressions[2]!.visibleBase}^${expressions[2]!.exponent}` },
        stem, answer,
        canonicalSolverKey: answer.canonicalKey,
        independentVerifierKey: `T:ORDER:${verifierText}`,
        distractors: wrongOrders.map((text, index) => ({ text, canonicalKey: `T:ORDER:${text}`, misconceptionId: ["REVERSE_ORDER", "SWAP_LOWEST_TWO", "SWAP_HIGHEST_TWO"][index]! })),
        explanation: {
          given: stem.replace(/\?$/, ""),
          asked: "Arrange all three powers in increasing order.",
          method: "Convert each expression to the common base and order the resulting exponents.",
          working: expressions.map((item) => `${item.label} = ${commonBase}^${item.normalizedExponent}`),
          answer: answer.text,
        },
        proofEvents: [proofEvent("COMPARE", "three-way exact common-base ordering", { stem }, { order: solverText })],
      });
    }
    case "C006-C": {
      const pair = sriPick(`${seed}:pair`, [[2, 5], [3, 7], [4, 9], [5, 8]] as const);
      const exponent = sriPick(`${seed}:exponent`, [-3, -2, 2, 3]);
      const first = powRationalInteger(rational(pair[0]), exponent);
      const second = powRationalInteger(rational(pair[1]), exponent);
      const verifierRelation = relationFromComparison(compareRational(first, second));
      const solverRelation: Relation = exponent > 0
        ? pair[0] > pair[1] ? "FIRST_GREATER" : "SECOND_GREATER"
        : pair[0] > pair[1] ? "SECOND_GREATER" : "FIRST_GREATER";
      const stem = sriPick(`${seed}:surface`, [
        `Compare ${pair[0]}^(${exponent}) and ${pair[1]}^(${exponent}).`,
        `Which is greater: ${pair[0]}^(${exponent}) or ${pair[1]}^(${exponent})?`,
        `The two expressions have the same exponent ${exponent}. Compare ${pair[0]}^(${exponent}) with ${pair[1]}^(${exponent}).`,
      ]);
      return finishRelation(candidateId, seed, { firstBase: pair[0], secondBase: pair[1], exponent }, stem, solverRelation, verifierRelation,
        exponent > 0 ? "With a common positive exponent, the larger positive base gives the larger value." : "With a common negative exponent, reciprocals reverse the base order.",
        exponent > 0
          ? [`${pair[0]} ${pair[0] < pair[1] ? "<" : ">"} ${pair[1]} and exponent ${exponent} is positive.`]
          : [`${pair[0]}^(${exponent}) = 1/${pair[0]}^${-exponent}`, `${pair[1]}^(${exponent}) = 1/${pair[1]}^${-exponent}`, "The reciprocal comparison reverses the positive-base order."]);
    }
    case "C006-D": {
      const mode = sriPick(`${seed}:mode`, ["FIRST_GREATER", "SECOND_GREATER", "EQUAL"] as const);
      const firstK = mode === "SECOND_GREATER" ? 2 : 3;
      const firstM = mode === "FIRST_GREATER" ? 3 : 2;
      const secondK = mode === "FIRST_GREATER" ? 2 : 3;
      const secondM = mode === "SECOND_GREATER" ? 3 : 2;
      const visible1 = Number(powBigInt(commonBase, firstK));
      const visible2 = Number(powBigInt(commonBase, secondK));
      const e1 = firstK * firstM;
      const e2 = secondK * secondM;
      const solverRelation = e1 > e2 ? "FIRST_GREATER" : e1 < e2 ? "SECOND_GREATER" : "EQUAL";
      const verifierRelation = relationFromComparison(compareRational(powRationalInteger(rational(visible1), firstM), powRationalInteger(rational(visible2), secondM)));
      const stem = sriPick(`${seed}:surface`, [
        `Classify the relation between ${visible1}^${firstM} and ${visible2}^${secondM}.`,
        `State whether ${visible1}^${firstM} is greater than, less than, or equal to ${visible2}^${secondM}.`,
        `Compare exactly: ${visible1}^${firstM} versus ${visible2}^${secondM}.`,
      ]);
      return finishRelation(candidateId, seed, { commonBase, visible1, firstM, visible2, secondM }, stem, solverRelation, verifierRelation,
        "Reduce each expression to a power of the same base and classify the relation.",
        [`${visible1}^${firstM} = ${commonBase}^${e1}`, `${visible2}^${secondM} = ${commonBase}^${e2}`]);
    }
    case "C006-E": {
      const trueLaw = sriPick(`${seed}:true-law`, TRUE_LAWS);
      const falseStart = sriInt(`${seed}:false-start`, 0, FALSE_LAWS.length - 1);
      const falseLaws = [0, 1, 2].map((offset) => FALSE_LAWS[(falseStart + offset) % FALSE_LAWS.length]!);
      const optionPool = [trueLaw, ...falseLaws];
      const answer = textAnswer(trueLaw.text, `T:LAW:${trueLaw.id}`);
      const stem = sriPick(`${seed}:surface`, [
        "Which of the following statements about indices is true?",
        "Select the correct law of indices.",
        "Which statement is valid under its stated domain?",
        "Identify the true index-law statement.",
      ]);
      return finalizeSriDiscoveryQuestion({
        packageId: "SRI-001", checkpointId: "SRI-CP-006", candidateId, seed,
        state: { trueLawId: trueLaw.id }, stem, answer,
        canonicalSolverKey: answer.canonicalKey,
        independentVerifierKey: optionPool.filter((item) => item.trueForDeclaredDomain).length === 1 ? `T:LAW:${trueLaw.id}` : "T:INVALID_POOL",
        distractors: falseLaws.map((law) => ({ text: law.text, canonicalKey: `T:LAW:${law.id}`, misconceptionId: law.misconceptionId })),
        explanation: {
          given: "Four index-law statements are given, each with its domain stated where needed.",
          asked: "Choose the one statement that is mathematically valid.",
          method: "Check the operation involved against the exact index law rather than transferring a rule from multiplication to addition or division.",
          working: [trueLaw.reason, ...falseLaws.map((law) => `${law.id}: ${law.reason}`)],
          answer: answer.text,
        },
        proofEvents: [proofEvent("VERIFY", "truth-table check of index-law statements", { candidateCount: "4" }, { uniqueTrueLaw: trueLaw.id })],
      });
    }
    case "C006-F": {
      const firstTruth = sriPick(`${seed}:truth1`, [true, false]);
      const secondTruth = sriPick(`${seed}:truth2`, [true, false]);
      const firstLaw = sriPick(`${seed}:law1`, firstTruth ? TRUE_LAWS : FALSE_LAWS);
      let secondLaw = sriPick(`${seed}:law2`, secondTruth ? TRUE_LAWS : FALSE_LAWS);
      if (secondLaw.id === firstLaw.id) {
        const pool = secondTruth ? TRUE_LAWS : FALSE_LAWS;
        secondLaw = pool[(pool.findIndex((law) => law.id === secondLaw.id) + 1) % pool.length]!;
      }
      const key = firstTruth && secondTruth ? "BOTH_TRUE" : firstTruth ? "ONLY_I" : secondTruth ? "ONLY_II" : "BOTH_FALSE";
      const answerText = key === "BOTH_TRUE" ? "Both I and II are true" : key === "ONLY_I" ? "Only I is true" : key === "ONLY_II" ? "Only II is true" : "Both I and II are false";
      const answer = textAnswer(answerText, `T:${key}`);
      const stem = sriPick(`${seed}:surface`, [
        `Statement I: ${firstLaw.text} Statement II: ${secondLaw.text} Which conclusion is correct?`,
        `Consider I: ${firstLaw.text} II: ${secondLaw.text} Choose the correct truth combination.`,
        `For the following two index statements— I. ${firstLaw.text} II. ${secondLaw.text} —which option is correct?`,
      ]);
      return finalizeSriDiscoveryQuestion({
        packageId: "SRI-001", checkpointId: "SRI-CP-006", candidateId, seed,
        state: { statementI: firstLaw.id, statementII: secondLaw.id, firstTruth, secondTruth }, stem, answer,
        canonicalSolverKey: answer.canonicalKey,
        independentVerifierKey: `T:${firstLaw.trueForDeclaredDomain && secondLaw.trueForDeclaredDomain ? "BOTH_TRUE" : firstLaw.trueForDeclaredDomain ? "ONLY_I" : secondLaw.trueForDeclaredDomain ? "ONLY_II" : "BOTH_FALSE"}`,
        distractors: textDistractors([
          { text: "Both I and II are true", key: "T:BOTH_TRUE", misconceptionId: "MARK_BOTH_TRUE" },
          { text: "Only I is true", key: "T:ONLY_I", misconceptionId: "MARK_ONLY_I" },
          { text: "Only II is true", key: "T:ONLY_II", misconceptionId: "MARK_ONLY_II" },
          { text: "Both I and II are false", key: "T:BOTH_FALSE", misconceptionId: "MARK_BOTH_FALSE" },
        ]),
        explanation: {
          given: `Statement I is ${firstLaw.id}; Statement II is ${secondLaw.id}.`,
          asked: "Determine the truth value of each statement independently.",
          method: "Apply the exact law to each statement separately before combining the two truth values.",
          working: [`I: ${firstLaw.reason}`, `II: ${secondLaw.reason}`],
          answer: answer.text,
        },
        proofEvents: [proofEvent("VERIFY", "independent truth evaluation of two index statements", { I: firstLaw.id, II: secondLaw.id }, { result: key })],
      });
    }
    case "C006-G": {
      const mode = sriPick(`${seed}:mode`, ["FIRST_GREATER", "SECOND_GREATER", "EQUAL"] as const);
      const firstNormalized = mode === "FIRST_GREATER" ? 8 : mode === "SECOND_GREATER" ? 6 : 6;
      const secondNormalized = mode === "FIRST_GREATER" ? 6 : mode === "SECOND_GREATER" ? 8 : 6;
      const firstK = 2;
      const firstM = firstNormalized / firstK;
      const secondK = 3;
      const secondM = secondNormalized / secondK;
      const firstBase = Number(powBigInt(commonBase, firstK));
      const secondBase = Number(powBigInt(commonBase, secondK));
      const firstValue = powRationalInteger(rational(firstBase), firstM);
      const secondValue = powRationalInteger(rational(secondBase), secondM);
      const solverRelation = firstNormalized > secondNormalized ? "FIRST_GREATER" : firstNormalized < secondNormalized ? "SECOND_GREATER" : "EQUAL";
      const verifierRelation = relationFromComparison(compareRational(firstValue, secondValue));
      const stem = sriPick(`${seed}:surface`, [
        `Quantity A: ${firstBase}^${firstM}. Quantity B: ${secondBase}^${secondM}. Compare A and B.`,
        `Compare Quantity A = ${firstBase}^${firstM} with Quantity B = ${secondBase}^${secondM}.`,
        `Which relation is correct for A=${firstBase}^${firstM} and B=${secondBase}^${secondM}?`,
      ]);
      return finishRelation(candidateId, seed, { commonBase, quantityA: `${firstBase}^${firstM}`, quantityB: `${secondBase}^${secondM}` }, stem, solverRelation, verifierRelation,
        "Normalize both quantities to powers of the same base and compare the exact exponents.",
        [`A = ${commonBase}^${firstNormalized}`, `B = ${commonBase}^${secondNormalized}`], "Quantity A", "Quantity B");
    }
    default:
      throw new Error(`Unknown SRI-CP-006 candidate: ${candidateId}`);
  }
}

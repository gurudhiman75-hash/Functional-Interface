import {
  OpsFoundationError,
  STANDARD_IDENTITY_MAPPING,
  applyOperatorMapping,
  composeTransformations,
  evaluateParsedExpression,
  formatExact,
  inferBijectiveMapping,
  parseSemanticTokens,
  parsedExpressionFingerprint,
  renderDisplayTokens,
  solveWithMapping,
  swapDigitIdentities,
  swapDisplayOperators,
  swapWholeNumberTokens,
  tokenizeDisplayExpression,
  type DisplayToken,
  type EvaluationResult,
  type OperatorMapping,
  type OperatorPairSwap,
} from "../foundation";
import type { OpsPilotExplanationStep, OpsPilotOption } from "./representative-pilots";

export type OpsFinalCandidateId =
  | "OPS-CAND-021"
  | "OPS-CAND-022"
  | "OPS-CAND-024"
  | "OPS-CAND-025"
  | "OPS-CAND-027"
  | "OPS-CAND-028"
  | "OPS-CAND-029"
  | "OPS-CAND-031"
  | "OPS-CAND-032"
  | "OPS-CAND-033";

export interface OpsFinalCandidateQuestion {
  candidateId: OpsFinalCandidateId;
  checkpointId: string;
  seed: number;
  locale: "en-IN";
  taskKind: string;
  solveMode: string;
  renderer: "STRUCTURED_TEXT" | "TABLE_OR_GRID";
  stem: string;
  options: readonly OpsPilotOption[];
  correctIndex: number;
  answer: string;
  explanation: {
    ruleStatement: string;
    steps: readonly OpsPilotExplanationStep[];
    conclusion: string;
  };
  proof: {
    unique: true;
    solverRoute: string;
    eligibleCandidateCount: number;
    survivingCandidateCount: 1;
    semanticFingerprint: string;
  };
  metadata: Readonly<Record<string, string | number | boolean>>;
}

class FinalPilotRng {
  private state: number;

  constructor(candidateId: string, seed: number) {
    let hash = 2166136261 >>> 0;
    for (const char of `${candidateId}:${seed}:final`) {
      hash ^= char.charCodeAt(0);
      hash = Math.imul(hash, 16777619) >>> 0;
    }
    this.state = hash || 0xc2b2ae35;
  }

  next(): number {
    let value = this.state;
    value ^= value << 13;
    value ^= value >>> 17;
    value ^= value << 5;
    this.state = value >>> 0;
    return this.state / 0x100000000;
  }

  int(min: number, max: number): number {
    return min + Math.floor(this.next() * (max - min + 1));
  }

  pick<T>(values: readonly T[]): T {
    if (values.length === 0) throw new Error("Cannot pick from an empty collection.");
    return values[this.int(0, values.length - 1)];
  }

  shuffle<T>(values: readonly T[]): T[] {
    const output = [...values];
    for (let index = output.length - 1; index > 0; index -= 1) {
      const swapIndex = this.int(0, index);
      [output[index], output[swapIndex]] = [output[swapIndex], output[index]];
    }
    return output;
  }
}

const OPERATOR_PAIRS: readonly OperatorPairSwap[] = [
  { left: "+", right: "−" },
  { left: "+", right: "×" },
  { left: "+", right: "÷" },
  { left: "−", right: "×" },
  { left: "−", right: "÷" },
  { left: "×", right: "÷" },
];

function pairKey(left: string, right: string): string {
  return [left, right].sort().join("<->");
}

function digitPairKey(left: number, right: number): string {
  return [left, right].sort((a, b) => a - b).join("<->");
}

function solveArithmeticWithTransform(
  expression: string,
  transform: (tokens: readonly DisplayToken[]) => readonly DisplayToken[],
): { value: string; transformed: string; fingerprint: string } {
  const original = tokenizeDisplayExpression(expression);
  const transformed = transform(original);
  const parsed = parseSemanticTokens(applyOperatorMapping(transformed, STANDARD_IDENTITY_MAPPING));
  const result = evaluateParsedExpression(parsed);
  if (result.parsed.kind !== "ARITHMETIC" || !result.arithmeticValue) throw new Error(`Expected arithmetic result: ${expression}`);
  return {
    value: formatExact(result.arithmeticValue),
    transformed: renderDisplayTokens(transformed),
    fingerprint: parsedExpressionFingerprint(parsed),
  };
}

function numericDistractors(answer: string): readonly OpsPilotOption[] {
  const output: OpsPilotOption[] = [];
  const add = (value: string, errorLabel: string): void => {
    if (value !== answer && !output.some((entry) => entry.value === value)) output.push({ value, errorLabel });
  };
  if (/^-?\d+$/.test(answer)) {
    const value = BigInt(answer);
    add((value + 1n).toString(), "OFF_BY_ONE");
    add((value - 1n).toString(), "PRECEDENCE_TRAP");
    add((-value).toString(), "SIGN_ERROR");
    add((value * 2n).toString(), "PARTIAL_TRANSFORMATION");
  } else {
    add("0", "TRANSFORMATION_NOT_APPLIED");
    add("1", "PRECEDENCE_TRAP");
    add("−1", "SIGN_ERROR");
  }
  return output.slice(0, 3);
}

function finalize(
  question: Omit<OpsFinalCandidateQuestion, "options" | "correctIndex"> & { options: readonly OpsPilotOption[] },
  rng: FinalPilotRng,
): OpsFinalCandidateQuestion {
  if (question.options.length !== 4) throw new Error(`${question.candidateId} must produce four options.`);
  if (new Set(question.options.map((option) => option.value)).size !== 4) throw new Error(`${question.candidateId} produced duplicate options.`);
  if (question.options.filter((option) => option.errorLabel === null).length !== 1) throw new Error(`${question.candidateId} must have one correct option.`);
  const options = rng.shuffle(question.options);
  return { ...question, options, correctIndex: options.findIndex((option) => option.errorLabel === null) };
}

function numericQuestion(
  base: Omit<OpsFinalCandidateQuestion, "options" | "correctIndex" | "answer">,
  answer: string,
  rng: FinalPilotRng,
): OpsFinalCandidateQuestion {
  return finalize({ ...base, answer, options: [{ value: answer, errorLabel: null }, ...numericDistractors(answer)] }, rng);
}

function generate021(seed: number): OpsFinalCandidateQuestion {
  const rng = new FinalPilotRng("OPS-CAND-021", seed);
  const blueprint = rng.pick([
    { expression: "24 + 6 × 2", pair: ["24", "6"] as const },
    { expression: "20 + 4 × 3", pair: ["20", "4"] as const },
    { expression: "15 − 3 × 2", pair: ["15", "3"] as const },
  ] as const);
  const solved = solveArithmeticWithTransform(blueprint.expression, (tokens) => swapWholeNumberTokens(tokens, blueprint.pair[0], blueprint.pair[1]).tokens);
  return numericQuestion({
    candidateId: "OPS-CAND-021",
    checkpointId: "OPS-CP-006",
    seed,
    locale: "en-IN",
    taskKind: "EVALUATE_AFTER_GIVEN_INTERCHANGE",
    solveMode: "evaluateAfterSpecifiedWholeNumberSwap",
    renderer: "STRUCTURED_TEXT",
    stem: `Interchange the complete numbers ${blueprint.pair[0]} and ${blueprint.pair[1]} in ${blueprint.expression}, then evaluate it.`,
    explanation: {
      ruleStatement: "Swap complete numeric tokens everywhere, preserving all individual digits inside every other number.",
      steps: [{ label: "Apply whole-number swap", expression: blueprint.expression, result: solved.transformed }, { label: "Evaluate", expression: solved.transformed, result: solved.value }],
      conclusion: `The transformed value is ${solved.value}.`,
    },
    proof: { unique: true, solverRoute: "PRESCRIBED_WHOLE_NUMBER_SWAP", eligibleCandidateCount: 1, survivingCandidateCount: 1, semanticFingerprint: solved.fingerprint },
    metadata: { numberIdentity: "COMPLETE_TOKEN", prescribedPair: blueprint.pair.join("<->") },
  }, solved.value, rng);
}

function generate022(seed: number): OpsFinalCandidateQuestion {
  const rng = new FinalPilotRng("OPS-CAND-022", seed);
  const expression = rng.pick(["24 + 6 × 2", "20 + 4 × 3"] as const);
  const pair = expression.startsWith("24") ? ["24", "6"] as const : ["20", "4"] as const;
  const solved = solveArithmeticWithTransform(expression, (tokens) => swapWholeNumberTokens(tokens, pair[0], pair[1]).tokens);
  const options: OpsPilotOption[] = [
    { value: `${expression} = ${solved.value}`, errorLabel: null },
    ...numericDistractors(solved.value).map((entry) => ({ value: `${expression} = ${entry.value}`, errorLabel: entry.errorLabel })),
  ];
  return finalize({
    candidateId: "OPS-CAND-022",
    checkpointId: "OPS-CP-006",
    seed,
    locale: "en-IN",
    taskKind: "IDENTIFY_CORRECT_EQUATION_AFTER_INTERCHANGE",
    solveMode: "selectEquationByTruthAfterSpecifiedWholeNumberSwap",
    renderer: "TABLE_OR_GRID",
    stem: `After interchanging the complete numbers ${pair[0]} and ${pair[1]} in every option, select the true equation.`,
    answer: `${expression} = ${solved.value}`,
    options,
    explanation: {
      ruleStatement: "Apply the prescribed complete-number swap independently to every equation option.",
      steps: [{ label: "Transform correct option", expression, result: `${solved.transformed} = ${solved.value}` }],
      conclusion: `${expression} = ${solved.value} is the only true option.`,
    },
    proof: { unique: true, solverRoute: "PRESCRIBED_WHOLE_NUMBER_SWAP_OPTION_TRUTH", eligibleCandidateCount: 4, survivingCandidateCount: 1, semanticFingerprint: solved.fingerprint },
    metadata: { optionTopology: "EQUATION_OPTIONS", numberIdentity: "COMPLETE_TOKEN" },
  }, rng);
}

function generate024(seed: number): OpsFinalCandidateQuestion {
  const rng = new FinalPilotRng("OPS-CAND-024", seed);
  const blueprint = rng.pick([
    { expression: "15 + 3 × 2", pair: [2, 5] as const },
    { expression: "26 + 4 × 3", pair: [2, 6] as const },
    { expression: "37 − 2 × 4", pair: [3, 7] as const },
  ] as const);
  const solved = solveArithmeticWithTransform(blueprint.expression, (tokens) => swapDigitIdentities(tokens, blueprint.pair[0], blueprint.pair[1]).tokens);
  return numericQuestion({
    candidateId: "OPS-CAND-024",
    checkpointId: "OPS-CP-007",
    seed,
    locale: "en-IN",
    taskKind: "EVALUATE_AFTER_GIVEN_INTERCHANGE",
    solveMode: "evaluateAfterSpecifiedGlobalDigitSwap",
    renderer: "STRUCTURED_TEXT",
    stem: `Interchange digits ${blueprint.pair[0]} and ${blueprint.pair[1]} globally in ${blueprint.expression}, then evaluate it.`,
    explanation: {
      ruleStatement: "Replace every occurrence of the two digit identities and rebuild each affected numeric literal.",
      steps: [{ label: "Apply global digit swap", expression: blueprint.expression, result: solved.transformed }, { label: "Evaluate", expression: solved.transformed, result: solved.value }],
      conclusion: `The transformed value is ${solved.value}.`,
    },
    proof: { unique: true, solverRoute: "PRESCRIBED_GLOBAL_DIGIT_SWAP", eligibleCandidateCount: 1, survivingCandidateCount: 1, semanticFingerprint: solved.fingerprint },
    metadata: { digitScope: "GLOBAL_IDENTITY", leadingZeroPolicy: "REJECT", prescribedPair: digitPairKey(blueprint.pair[0], blueprint.pair[1]) },
  }, solved.value, rng);
}

function generate025(seed: number): OpsFinalCandidateQuestion {
  const rng = new FinalPilotRng("OPS-CAND-025", seed);
  const expression = rng.pick(["15 + 3 × 2", "26 + 4 × 3"] as const);
  const pair = expression.startsWith("15") ? [2, 5] as const : [2, 6] as const;
  const solved = solveArithmeticWithTransform(expression, (tokens) => swapDigitIdentities(tokens, pair[0], pair[1]).tokens);
  const options: OpsPilotOption[] = [
    { value: `${expression} = ${solved.value}`, errorLabel: null },
    ...numericDistractors(solved.value).map((entry) => ({ value: `${expression} = ${entry.value}`, errorLabel: entry.errorLabel })),
  ];
  return finalize({
    candidateId: "OPS-CAND-025",
    checkpointId: "OPS-CP-007",
    seed,
    locale: "en-IN",
    taskKind: "IDENTIFY_CORRECT_EQUATION_AFTER_INTERCHANGE",
    solveMode: "selectEquationByTruthAfterSpecifiedGlobalDigitSwap",
    renderer: "TABLE_OR_GRID",
    stem: `After interchanging digits ${pair[0]} and ${pair[1]} globally in every option, select the true equation.`,
    answer: `${expression} = ${solved.value}`,
    options,
    explanation: {
      ruleStatement: "Apply the prescribed digit-identity swap to every numeral in each complete option.",
      steps: [{ label: "Transform correct option", expression, result: `${solved.transformed} = ${solved.value}` }],
      conclusion: `${expression} = ${solved.value} is the only true option.`,
    },
    proof: { unique: true, solverRoute: "PRESCRIBED_DIGIT_SWAP_OPTION_TRUTH", eligibleCandidateCount: 4, survivingCandidateCount: 1, semanticFingerprint: solved.fingerprint },
    metadata: { optionTopology: "EQUATION_OPTIONS", digitScope: "GLOBAL_IDENTITY" },
  }, rng);
}

interface OperatorDigitRepair {
  operatorPair: OperatorPairSwap;
  digitPair: readonly [number, number];
  transformed: readonly DisplayToken[];
  result: EvaluationResult;
}

function findOperatorAndDigitRepairs(equation: string): readonly OperatorDigitRepair[] {
  const original = tokenizeDisplayExpression(equation);
  const digits = [...new Set(original
    .filter((token): token is Extract<DisplayToken, { kind: "NUMBER" }> => token.kind === "NUMBER")
    .flatMap((token) => [...token.source].filter((char) => /\d/.test(char)).map(Number)))]
    .sort((a, b) => a - b);
  const repairs: OperatorDigitRepair[] = [];
  for (const operatorPair of OPERATOR_PAIRS) {
    for (let leftIndex = 0; leftIndex < digits.length; leftIndex += 1) {
      for (let rightIndex = leftIndex + 1; rightIndex < digits.length; rightIndex += 1) {
        const digitPair = [digits[leftIndex], digits[rightIndex]] as const;
        try {
          const transformed = composeTransformations(original, [
            (tokens) => swapDisplayOperators(tokens, [operatorPair]),
            (tokens) => swapDigitIdentities(tokens, digitPair[0], digitPair[1]),
          ]).tokens;
          const result = evaluateParsedExpression(parseSemanticTokens(applyOperatorMapping(transformed, STANDARD_IDENTITY_MAPPING)));
          if (result.parsed.kind === "RELATION" && result.relationValue === true) repairs.push({ operatorPair, digitPair, transformed, result });
        } catch (error) {
          if (!(error instanceof OpsFoundationError)) throw error;
        }
      }
    }
  }
  return repairs;
}

function generate027(seed: number): OpsFinalCandidateQuestion {
  const rng = new FinalPilotRng("OPS-CAND-027", seed);
  const blueprints = [
    { equation: "88 ÷ 7 + 7 ÷ 12 = 4", operatorPair: { left: "−", right: "÷" }, digitPair: [2, 8] as const },
    { equation: "28 × 2 − 7 + 2 = 9", operatorPair: { left: "×", right: "÷" }, digitPair: [7, 9] as const },
    { equation: "29 − 11 × 6 − 8 = 55", operatorPair: { left: "+", right: "−" }, digitPair: [5, 9] as const },
  ] as const;
  const blueprint = rng.pick(blueprints);
  const repairs = findOperatorAndDigitRepairs(blueprint.equation);
  if (repairs.length !== 1) throw new Error(`OPS-CAND-027 expected one complete-pool repair, found ${repairs.length}.`);
  const repair = repairs[0];
  if (pairKey(repair.operatorPair.left, repair.operatorPair.right) !== pairKey(blueprint.operatorPair.left, blueprint.operatorPair.right)
    || digitPairKey(repair.digitPair[0], repair.digitPair[1]) !== digitPairKey(blueprint.digitPair[0], blueprint.digitPair[1])) {
    throw new Error("OPS-CAND-027 survivor does not match intended compound repair.");
  }
  const answer = `${repair.operatorPair.left} ↔ ${repair.operatorPair.right}; ${repair.digitPair[0]} ↔ ${repair.digitPair[1]}`;
  const wrongOperator = OPERATOR_PAIRS.find((pair) => pairKey(pair.left, pair.right) !== pairKey(repair.operatorPair.left, repair.operatorPair.right))!;
  const options: OpsPilotOption[] = [
    { value: answer, errorLabel: null },
    { value: `${repair.operatorPair.left} ↔ ${repair.operatorPair.right}; no digit swap`, errorLabel: "ONLY_OPERATOR_SWAP_APPLIED" },
    { value: `no operator swap; ${repair.digitPair[0]} ↔ ${repair.digitPair[1]}`, errorLabel: "ONLY_DIGIT_SWAP_APPLIED" },
    { value: `${wrongOperator.left} ↔ ${wrongOperator.right}; ${repair.digitPair[0]} ↔ ${repair.digitPair[1]}`, errorLabel: "WRONG_OPERATOR_PAIR" },
  ];
  return finalize({
    candidateId: "OPS-CAND-027",
    checkpointId: "OPS-CP-008",
    seed,
    locale: "en-IN",
    taskKind: "IDENTIFY_OPERATOR_AND_VALUE_SWAP",
    solveMode: "identifyOperatorAndDigitPairSwap",
    renderer: "TABLE_OR_GRID",
    stem: `Which operator pair and digit pair must both be interchanged to make ${blueprint.equation} correct?`,
    answer,
    options,
    explanation: {
      ruleStatement: "Enumerate the full operator-pair × digit-pair pool and rebuild every affected numeral from the original equation.",
      steps: [{ label: "Apply unique compound repair", expression: blueprint.equation, result: renderDisplayTokens(repair.transformed) }],
      conclusion: `${answer} is the only valid compound repair.`,
    },
    proof: { unique: true, solverRoute: "ENUMERATE_OPERATOR_X_DIGIT_COMPOUND_POOL", eligibleCandidateCount: OPERATOR_PAIRS.length * 45, survivingCandidateCount: 1, semanticFingerprint: parsedExpressionFingerprint(repair.result.parsed) },
    metadata: { completePoolRepairCount: repairs.length, leadingZeroPolicy: "REJECT" },
  }, rng);
}

interface CompoundBlueprint {
  expression: string;
  operatorPair: OperatorPairSwap;
  numberPair?: readonly [string, string];
  digitPair?: readonly [number, number];
  subtype: "OPERATOR_AND_WHOLE_NUMBER" | "OPERATOR_AND_DIGIT";
}

function applyCompoundBlueprint(tokens: readonly DisplayToken[], blueprint: CompoundBlueprint): readonly DisplayToken[] {
  const transforms: Array<(value: readonly DisplayToken[]) => ReturnType<typeof swapDisplayOperators>> = [
    (value) => swapDisplayOperators(value, [blueprint.operatorPair]),
  ];
  if (blueprint.numberPair) transforms.push((value) => swapWholeNumberTokens(value, blueprint.numberPair![0], blueprint.numberPair![1]));
  if (blueprint.digitPair) transforms.push((value) => swapDigitIdentities(value, blueprint.digitPair![0], blueprint.digitPair![1]));
  return composeTransformations(tokens, transforms).tokens;
}

function compoundText(blueprint: CompoundBlueprint): string {
  const valuePart = blueprint.numberPair
    ? `numbers ${blueprint.numberPair[0]} and ${blueprint.numberPair[1]}`
    : `digits ${blueprint.digitPair![0]} and ${blueprint.digitPair![1]}`;
  return `${blueprint.operatorPair.left} ↔ ${blueprint.operatorPair.right} and ${valuePart}`;
}

function prescribedCompoundBlueprint(rng: FinalPilotRng): CompoundBlueprint {
  return rng.pick([
    { expression: "16 × 4 + 12 ÷ 4 − 15", operatorPair: { left: "+", right: "−" }, numberPair: ["16", "12"], subtype: "OPERATOR_AND_WHOLE_NUMBER" },
    { expression: "88 ÷ 7 + 7 ÷ 12", operatorPair: { left: "−", right: "÷" }, digitPair: [2, 8], subtype: "OPERATOR_AND_DIGIT" },
  ] as const);
}

function generate028(seed: number): OpsFinalCandidateQuestion {
  const rng = new FinalPilotRng("OPS-CAND-028", seed);
  const blueprint = prescribedCompoundBlueprint(rng);
  const solved = solveArithmeticWithTransform(blueprint.expression, (tokens) => applyCompoundBlueprint(tokens, blueprint));
  return numericQuestion({
    candidateId: "OPS-CAND-028",
    checkpointId: "OPS-CP-008",
    seed,
    locale: "en-IN",
    taskKind: "EVALUATE_AFTER_GIVEN_INTERCHANGE",
    solveMode: "evaluateAfterSpecifiedCompoundSwap",
    renderer: "STRUCTURED_TEXT",
    stem: `Apply the prescribed compound interchange (${compoundText(blueprint)}) to ${blueprint.expression}, then evaluate it.`,
    explanation: {
      ruleStatement: "Apply every prescribed transformation component from the original expression before exact evaluation.",
      steps: [{ label: "Apply compound transformation", expression: blueprint.expression, result: solved.transformed }, { label: "Evaluate", expression: solved.transformed, result: solved.value }],
      conclusion: `The transformed value is ${solved.value}.`,
    },
    proof: { unique: true, solverRoute: "PRESCRIBED_COMPOUND_TRANSFORMATION", eligibleCandidateCount: 1, survivingCandidateCount: 1, semanticFingerprint: solved.fingerprint },
    metadata: { compoundSubtype: blueprint.subtype, componentCount: 2 },
  }, solved.value, rng);
}

function generate029(seed: number): OpsFinalCandidateQuestion {
  const rng = new FinalPilotRng("OPS-CAND-029", seed);
  const blueprint = prescribedCompoundBlueprint(rng);
  const solved = solveArithmeticWithTransform(blueprint.expression, (tokens) => applyCompoundBlueprint(tokens, blueprint));
  const options: OpsPilotOption[] = [
    { value: `${blueprint.expression} = ${solved.value}`, errorLabel: null },
    ...numericDistractors(solved.value).map((entry) => ({ value: `${blueprint.expression} = ${entry.value}`, errorLabel: entry.errorLabel })),
  ];
  return finalize({
    candidateId: "OPS-CAND-029",
    checkpointId: "OPS-CP-008",
    seed,
    locale: "en-IN",
    taskKind: "IDENTIFY_CORRECT_EQUATION_AFTER_INTERCHANGE",
    solveMode: "selectEquationByTruthAfterSpecifiedCompoundSwap",
    renderer: "TABLE_OR_GRID",
    stem: `After applying ${compoundText(blueprint)} in every option, select the true equation.`,
    answer: `${blueprint.expression} = ${solved.value}`,
    options,
    explanation: {
      ruleStatement: "Apply the complete prescribed transformation independently to every equation option.",
      steps: [{ label: "Transform correct option", expression: blueprint.expression, result: `${solved.transformed} = ${solved.value}` }],
      conclusion: `${blueprint.expression} = ${solved.value} is the only true option.`,
    },
    proof: { unique: true, solverRoute: "PRESCRIBED_COMPOUND_OPTION_TRUTH", eligibleCandidateCount: 4, survivingCandidateCount: 1, semanticFingerprint: solved.fingerprint },
    metadata: { compoundSubtype: blueprint.subtype, optionTopology: "EQUATION_OPTIONS" },
  }, rng);
}

function hiddenArithmeticEvidence(seed: number): {
  mapping: OperatorMapping;
  evidence: readonly { expression: string; expectedValue: string }[];
  target: string;
  targetValue: string;
} {
  const rng = new FinalPilotRng("HIDDEN_ARITHMETIC_SHARED", seed);
  const x = rng.int(4, 12);
  const y = rng.int(2, x - 1);
  const evidence = [
    { expression: `${x} M ${y}`, expectedValue: String(x + y) },
    { expression: `${x + 5} N ${y}`, expectedValue: String(x + 5 - y) },
  ] as const;
  const inferred = inferBijectiveMapping(["M", "N"], ["ADD", "SUBTRACT"], evidence);
  if (inferred.length !== 1) throw new Error("Hidden arithmetic evidence is not unique.");
  const target = `${x + 2} M ${y + 1} N 2`;
  const solved = solveWithMapping(target, inferred[0]);
  if (solved.evaluation.parsed.kind !== "ARITHMETIC" || !solved.evaluation.arithmeticValue) throw new Error("Hidden target is not arithmetic.");
  return { mapping: inferred[0], evidence, target, targetValue: formatExact(solved.evaluation.arithmeticValue) };
}

function evidenceText(evidence: readonly { expression: string; expectedValue: string }[]): string {
  return evidence.map((entry) => `${entry.expression} = ${entry.expectedValue}`).join(" and ");
}

function generate031(seed: number): OpsFinalCandidateQuestion {
  const rng = new FinalPilotRng("OPS-CAND-031", seed);
  const hidden = hiddenArithmeticEvidence(seed);
  const solved = solveWithMapping(hidden.target, hidden.mapping);
  return numericQuestion({
    candidateId: "OPS-CAND-031",
    checkpointId: "OPS-CP-009",
    seed,
    locale: "en-IN",
    taskKind: "INFER_MAPPING_AND_RECOVER_RESULT",
    solveMode: "inferOperatorMappingThenRecoverMissingResult",
    renderer: "STRUCTURED_TEXT",
    stem: `Given ${evidenceText(hidden.evidence)}, complete ${hidden.target} = _.`,
    explanation: {
      ruleStatement: "Infer the unique mapping from all evidence, then preserve the target as an equation with a missing result slot.",
      steps: [{ label: "Infer mapping", expression: evidenceText(hidden.evidence), result: "M means +; N means −" }, { label: "Recover target result", expression: hidden.target, result: hidden.targetValue }],
      conclusion: `The missing result is ${hidden.targetValue}.`,
    },
    proof: { unique: true, solverRoute: "HIDDEN_MAPPING_RESULT_SLOT", eligibleCandidateCount: 2, survivingCandidateCount: 1, semanticFingerprint: solved.semanticFingerprint },
    metadata: { mergeProbeWith: "OPS-CAND-030", resultSlotRenderer: true },
  }, hidden.targetValue, rng);
}

function generate032(seed: number): OpsFinalCandidateQuestion {
  const rng = new FinalPilotRng("OPS-CAND-032", seed);
  const hidden = hiddenArithmeticEvidence(seed);
  const solved = solveWithMapping(hidden.target, hidden.mapping);
  const options: OpsPilotOption[] = [
    { value: `${hidden.target} = ${hidden.targetValue}`, errorLabel: null },
    ...numericDistractors(hidden.targetValue).map((entry) => ({ value: `${hidden.target} = ${entry.value}`, errorLabel: entry.errorLabel })),
  ];
  return finalize({
    candidateId: "OPS-CAND-032",
    checkpointId: "OPS-CP-009",
    seed,
    locale: "en-IN",
    taskKind: "INFER_MAPPING_AND_IDENTIFY_TRUE_STATEMENT",
    solveMode: "inferOperatorMappingThenSelectEquationByTruth",
    renderer: "TABLE_OR_GRID",
    stem: `Given ${evidenceText(hidden.evidence)}, infer M and N, then select the true target equation.`,
    answer: `${hidden.target} = ${hidden.targetValue}`,
    options,
    explanation: {
      ruleStatement: "Infer the hidden mapping once, then apply it independently to every target equation option.",
      steps: [{ label: "Infer mapping", expression: evidenceText(hidden.evidence), result: "M means +; N means −" }, { label: "Validate target option", expression: hidden.target, result: hidden.targetValue }],
      conclusion: `${hidden.target} = ${hidden.targetValue} is the only true target equation.`,
    },
    proof: { unique: true, solverRoute: "HIDDEN_MAPPING_OPTION_TRUTH", eligibleCandidateCount: 4, survivingCandidateCount: 1, semanticFingerprint: solved.semanticFingerprint },
    metadata: { optionTopology: "EQUATION_OPTIONS", evidenceCount: hidden.evidence.length },
  }, rng);
}

function generate033(seed: number): OpsFinalCandidateQuestion {
  const rng = new FinalPilotRng("OPS-CAND-033", seed);
  const x = rng.int(6, 15);
  const y = rng.int(2, x - 1);
  const expected = String(x - y);
  const evidence = [{ expression: `${x} N ${y}`, expectedValue: expected }] as const;
  const inferred = inferBijectiveMapping(["N"], ["ADD", "SUBTRACT", "MULTIPLY", "DIVIDE"], evidence);
  if (inferred.length !== 1 || inferred[0].entries[0].semanticOperator !== "SUBTRACT") throw new Error("OPS-CAND-033 operator meaning is not uniquely recoverable.");
  const answer = "−";
  const options = ["+", "−", "×", "÷"].map((value): OpsPilotOption => ({
    value,
    errorLabel: value === answer ? null : "WRONG_RECOVERED_OPERATOR_MEANING",
  }));
  return finalize({
    candidateId: "OPS-CAND-033",
    checkpointId: "OPS-CP-009",
    seed,
    locale: "en-IN",
    taskKind: "INFER_HIDDEN_OPERATOR_MAPPING",
    solveMode: "recoverOneUnknownOperatorMeaning",
    renderer: "STRUCTURED_TEXT",
    stem: `If ${x} N ${y} = ${expected}, which arithmetic operation does N represent?`,
    answer,
    options,
    explanation: {
      ruleStatement: "Test each eligible operation against the complete evidence and retain the one meaning that fits exactly.",
      steps: [{ label: "Test N", expression: `${x} N ${y} = ${expected}`, result: `${x} − ${y} = ${expected}` }],
      conclusion: "N represents subtraction (−).",
    },
    proof: { unique: true, solverRoute: "ENUMERATE_ONE_TOKEN_OPERATION_MEANINGS", eligibleCandidateCount: 4, survivingCandidateCount: 1, semanticFingerprint: `MAPPING:N->${inferred[0].entries[0].semanticOperator}` },
    metadata: { recoveredToken: "N", recoveredMeaning: "SUBTRACT" },
  }, rng);
}

export const OPS_FINAL_CANDIDATE_PILOT_IDS: readonly OpsFinalCandidateId[] = [
  "OPS-CAND-021",
  "OPS-CAND-022",
  "OPS-CAND-024",
  "OPS-CAND-025",
  "OPS-CAND-027",
  "OPS-CAND-028",
  "OPS-CAND-029",
  "OPS-CAND-031",
  "OPS-CAND-032",
  "OPS-CAND-033",
];

const GENERATORS: Readonly<Record<OpsFinalCandidateId, (seed: number) => OpsFinalCandidateQuestion>> = {
  "OPS-CAND-021": generate021,
  "OPS-CAND-022": generate022,
  "OPS-CAND-024": generate024,
  "OPS-CAND-025": generate025,
  "OPS-CAND-027": generate027,
  "OPS-CAND-028": generate028,
  "OPS-CAND-029": generate029,
  "OPS-CAND-031": generate031,
  "OPS-CAND-032": generate032,
  "OPS-CAND-033": generate033,
};

export function generateOpsFinalCandidatePilot(candidateId: OpsFinalCandidateId, seed: number): OpsFinalCandidateQuestion {
  if (!Number.isInteger(seed) || seed < 0) throw new Error(`Pilot seed must be a non-negative integer; received ${seed}.`);
  return GENERATORS[candidateId](seed);
}

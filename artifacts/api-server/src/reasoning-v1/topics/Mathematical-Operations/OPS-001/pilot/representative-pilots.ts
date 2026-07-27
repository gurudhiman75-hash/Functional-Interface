import {
  STANDARD_IDENTITY_MAPPING,
  composeTransformations,
  findDigitPairRepairs,
  findOperatorAndWholeNumberRepairs,
  findOperatorPairRepairs,
  findWholeNumberPairRepairs,
  formatExact,
  inferBijectiveMapping,
  renderDisplayTokens,
  solveWithMapping,
  swapDisplayOperators,
  swapWholeNumberTokens,
  tokenizeDisplayExpression,
  type ExactRational,
  type OperatorMapping,
  type OperatorPairSwap,
  type SemanticOperator,
} from "../foundation";

export type OpsPilotCandidateId =
  | "OPS-CAND-001"
  | "OPS-CAND-003"
  | "OPS-CAND-010"
  | "OPS-CAND-012"
  | "OPS-CAND-014"
  | "OPS-CAND-016"
  | "OPS-CAND-018"
  | "OPS-CAND-020"
  | "OPS-CAND-023"
  | "OPS-CAND-026"
  | "OPS-CAND-030"
  | "OPS-CAND-034";

export interface OpsPilotOption {
  value: string;
  errorLabel: string | null;
}

export interface OpsPilotExplanationStep {
  label: string;
  expression: string;
  result: string;
}

export interface OpsPilotQuestion {
  candidateId: OpsPilotCandidateId;
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

class PilotRng {
  private state: number;

  constructor(candidateId: string, seed: number) {
    let hash = 2166136261 >>> 0;
    for (const char of `${candidateId}:${seed}`) {
      hash ^= char.charCodeAt(0);
      hash = Math.imul(hash, 16777619) >>> 0;
    }
    this.state = hash || 0x9e3779b9;
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

const ARITHMETIC_GLYPHS = ["+", "−", "×", "÷"] as const;
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

function numberPairKey(pair: readonly [string, string]): string {
  return [...pair].sort().join("<->");
}

function exactToString(value: ExactRational | undefined): string {
  if (!value) throw new Error("Expected an arithmetic value.");
  return formatExact(value);
}

function solveArithmetic(
  expression: string,
  mapping: OperatorMapping = STANDARD_IDENTITY_MAPPING,
  preTransform?: Parameters<typeof solveWithMapping>[2],
): { value: string; fingerprint: string; transformed: string } {
  const solved = solveWithMapping(expression, mapping, preTransform);
  if (solved.evaluation.parsed.kind !== "ARITHMETIC") {
    throw new Error(`Expected arithmetic expression: ${expression}`);
  }
  return {
    value: exactToString(solved.evaluation.arithmeticValue),
    fingerprint: solved.semanticFingerprint,
    transformed: renderDisplayTokens(solved.transformedTokens),
  };
}

function equationTruth(
  equation: string,
  mapping: OperatorMapping = STANDARD_IDENTITY_MAPPING,
  preTransform?: Parameters<typeof solveWithMapping>[2],
): { value: boolean; fingerprint: string; transformed: string } {
  const solved = solveWithMapping(equation, mapping, preTransform);
  if (solved.evaluation.parsed.kind !== "RELATION") {
    throw new Error(`Expected relation expression: ${equation}`);
  }
  return {
    value: solved.evaluation.relationValue === true,
    fingerprint: solved.semanticFingerprint,
    transformed: renderDisplayTokens(solved.transformedTokens),
  };
}

function mappingText(mapping: OperatorMapping): string {
  return mapping.entries.map((entry) => `${entry.displayToken} means ${semanticGlyph(entry.semanticOperator)}`).join(", ");
}

function semanticGlyph(operator: SemanticOperator): string {
  switch (operator) {
    case "ADD": return "+";
    case "SUBTRACT": return "−";
    case "MULTIPLY": return "×";
    case "DIVIDE": return "÷";
    case "EQUAL": return "=";
    case "LESS_THAN": return "<";
    case "GREATER_THAN": return ">";
  }
}

function numericDistractors(answer: string): readonly OpsPilotOption[] {
  const candidates: OpsPilotOption[] = [];
  const add = (value: string, errorLabel: string): void => {
    if (value !== answer && !candidates.some((entry) => entry.value === value)) {
      candidates.push({ value, errorLabel });
    }
  };
  if (/^-?\d+$/.test(answer)) {
    const value = BigInt(answer);
    add((value + 1n).toString(), "OFF_BY_ONE");
    add((value - 1n).toString(), "PRECEDENCE_TRAP");
    add((-value).toString(), "SIGN_ERROR");
    add((value * 2n).toString(), "PARTIAL_TRANSFORMATION");
    add("0", "SUBSTITUTION_NOT_APPLIED");
  } else {
    add("0", "SUBSTITUTION_NOT_APPLIED");
    add("1", "PRECEDENCE_TRAP");
    add("−1", "SIGN_ERROR");
    add(answer.startsWith("−") ? answer.slice(1) : `−${answer}`, "SIGN_ERROR");
  }
  return candidates.slice(0, 3);
}

function finalize(
  base: Omit<OpsPilotQuestion, "options" | "correctIndex"> & { options: readonly OpsPilotOption[] },
  rng: PilotRng,
): OpsPilotQuestion {
  if (base.options.length !== 4) throw new Error(`${base.candidateId} must produce four options.`);
  if (new Set(base.options.map((option) => option.value)).size !== 4) {
    throw new Error(`${base.candidateId} produced duplicate options.`);
  }
  if (base.options.filter((option) => option.errorLabel === null).length !== 1) {
    throw new Error(`${base.candidateId} must produce exactly one correct option.`);
  }
  const options = rng.shuffle(base.options);
  const correctIndex = options.findIndex((option) => option.errorLabel === null);
  return { ...base, options, correctIndex };
}

function numericQuestion(
  base: Omit<OpsPilotQuestion, "options" | "correctIndex" | "answer">,
  answer: string,
  rng: PilotRng,
): OpsPilotQuestion {
  return finalize({
    ...base,
    answer,
    options: [{ value: answer, errorLabel: null }, ...numericDistractors(answer)],
  }, rng);
}

function generateCandidate001(seed: number): OpsPilotQuestion {
  const rng = new PilotRng("OPS-CAND-001", seed);
  const blueprints = [
    {
      mapping: { entries: [{ displayToken: "+", semanticOperator: "MULTIPLY" }, { displayToken: "×", semanticOperator: "ADD" }], preserveUnmappedStandardOperators: true } satisfies OperatorMapping,
      expression: "8 + 3 × 2",
    },
    {
      mapping: { entries: [{ displayToken: "+", semanticOperator: "DIVIDE" }, { displayToken: "−", semanticOperator: "ADD" }, { displayToken: "×", semanticOperator: "SUBTRACT" }], preserveUnmappedStandardOperators: true } satisfies OperatorMapping,
      expression: "24 + 6 − 3 × 2",
    },
    {
      mapping: { entries: [{ displayToken: "+", semanticOperator: "MULTIPLY" }, { displayToken: "×", semanticOperator: "ADD" }], preserveUnmappedStandardOperators: true } satisfies OperatorMapping,
      expression: "0.5 + 4 × 2",
    },
    {
      mapping: { entries: [{ displayToken: "+", semanticOperator: "ADD" }, { displayToken: "−", semanticOperator: "ADD" }, { displayToken: "×", semanticOperator: "MULTIPLY" }], preserveUnmappedStandardOperators: true } satisfies OperatorMapping,
      expression: "7 − 5 + 2 × 3",
    },
  ] as const;
  const blueprint = rng.pick(blueprints);
  const solved = solveArithmetic(blueprint.expression, blueprint.mapping);
  return numericQuestion({
    candidateId: "OPS-CAND-001",
    checkpointId: "OPS-CP-001",
    seed,
    locale: "en-IN",
    taskKind: "EVALUATE_AFTER_GIVEN_MAPPING",
    solveMode: "evaluateAfterGivenArithmeticSignMapping",
    renderer: "STRUCTURED_TEXT",
    stem: `If ${mappingText(blueprint.mapping)}, evaluate ${blueprint.expression}.`,
    explanation: {
      ruleStatement: "Replace every displayed sign by its stated operation before applying ordinary precedence.",
      steps: [
        { label: "Apply mapping", expression: blueprint.expression, result: solved.transformed },
        { label: "Evaluate exactly", expression: solved.transformed, result: solved.value },
      ],
      conclusion: `The required value is ${solved.value}.`,
    },
    proof: { unique: true, solverRoute: "SUPPLIED_MAPPING_EXACT_EVALUATOR", eligibleCandidateCount: 1, survivingCandidateCount: 1, semanticFingerprint: solved.fingerprint },
    metadata: { mappingCardinality: blueprint.mapping.entries.length, sourceFamily: "SUPPLIED_ARITHMETIC_SIGN_MAPPING" },
  }, solved.value, rng);
}

function generateCandidate003(seed: number): OpsPilotQuestion {
  const rng = new PilotRng("OPS-CAND-003", seed);
  const mapping: OperatorMapping = {
    entries: [
      { displayToken: "+", semanticOperator: "MULTIPLY" },
      { displayToken: "×", semanticOperator: "ADD" },
    ],
    preserveUnmappedStandardOperators: true,
  };
  const leftExpressions = ["8 + 3 × 2", "6 + 4 × 5", "9 + 2 × 7"] as const;
  const left = rng.pick(leftExpressions);
  const solved = solveArithmetic(left, mapping);
  const distractors = numericDistractors(solved.value);
  const equations: OpsPilotOption[] = [
    { value: `${left} = ${solved.value}`, errorLabel: null },
    ...distractors.map((entry) => ({ value: `${left} = ${entry.value}`, errorLabel: entry.errorLabel })),
  ];
  return finalize({
    candidateId: "OPS-CAND-003",
    checkpointId: "OPS-CP-001",
    seed,
    locale: "en-IN",
    taskKind: "IDENTIFY_EQUATION_AFTER_MAPPING",
    solveMode: "selectEquationByTruthAfterGivenArithmeticMapping",
    renderer: "TABLE_OR_GRID",
    stem: `If ${mappingText(mapping)}, select the equation that is true.`,
    answer: `${left} = ${solved.value}`,
    options: equations,
    explanation: {
      ruleStatement: "Apply the same supplied mapping independently to every option.",
      steps: [{ label: "Transform common left side", expression: left, result: `${solved.transformed} = ${solved.value}` }],
      conclusion: `Only ${left} = ${solved.value} is true.`,
    },
    proof: { unique: true, solverRoute: "MAP_AND_VALIDATE_EACH_EQUATION_OPTION", eligibleCandidateCount: 4, survivingCandidateCount: 1, semanticFingerprint: solved.fingerprint },
    metadata: { queryPolarity: "TRUE", optionTopology: "EQUATION_OPTIONS" },
  }, rng);
}

function generateCandidate010(seed: number): OpsPilotQuestion {
  const rng = new PilotRng("OPS-CAND-010", seed);
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const a = rng.int(3, 24);
    const b = rng.int(2, 12);
    const intended = rng.pick(ARITHMETIC_GLYPHS);
    let result: string;
    try {
      result = solveArithmetic(`${a} ${intended} ${b}`).value;
    } catch {
      continue;
    }
    if (!/^-?\d+$/.test(result)) continue;
    const valid = ARITHMETIC_GLYPHS.filter((glyph) => equationTruth(`${a} ${glyph} ${b} = ${result}`).value);
    if (valid.length !== 1 || valid[0] !== intended) continue;
    const options = ARITHMETIC_GLYPHS.map((glyph): OpsPilotOption => ({
      value: glyph,
      errorLabel: glyph === intended ? null : "WRONG_MISSING_OPERATOR",
    }));
    const truth = equationTruth(`${a} ${intended} ${b} = ${result}`);
    return finalize({
      candidateId: "OPS-CAND-010",
      checkpointId: "OPS-CP-004",
      seed,
      locale: "en-IN",
      taskKind: "RECOVER_SINGLE_MISSING_OPERATOR",
      solveMode: "recoverSingleMissingArithmeticOperator",
      renderer: "STRUCTURED_TEXT",
      stem: `Which operator replaces the blank in ${a} _ ${b} = ${result}?`,
      answer: intended,
      options,
      explanation: {
        ruleStatement: "Test each allowed arithmetic operator in the missing position.",
        steps: [{ label: "Insert unique operator", expression: `${a} ${intended} ${b}`, result }],
        conclusion: `${intended} is the only operator that makes the equation true.`,
      },
      proof: { unique: true, solverRoute: "ENUMERATE_SINGLE_OPERATOR_DOMAIN", eligibleCandidateCount: 4, survivingCandidateCount: 1, semanticFingerprint: truth.fingerprint },
      metadata: { attempts: attempt + 1, allowedOperators: 4 },
    }, rng);
  }
  throw new Error("OPS-CAND-010 could not construct a unique instance.");
}

function sequenceLabel(sequence: readonly string[]): string {
  return sequence.join(", ");
}

function generateCandidate012(seed: number): OpsPilotQuestion {
  const rng = new PilotRng("OPS-CAND-012", seed);
  const allSequences = ARITHMETIC_GLYPHS.flatMap((first) => ARITHMETIC_GLYPHS.map((second) => [first, second] as const));
  for (let attempt = 0; attempt < 600; attempt += 1) {
    const operands = [rng.int(2, 18), rng.int(2, 12), rng.int(2, 10)] as const;
    const intended = rng.pick(allSequences);
    let result: string;
    try {
      result = solveArithmetic(`${operands[0]} ${intended[0]} ${operands[1]} ${intended[1]} ${operands[2]}`).value;
    } catch {
      continue;
    }
    if (!/^-?\d+$/.test(result)) continue;
    const valid = allSequences.filter((sequence) => {
      try {
        return equationTruth(`${operands[0]} ${sequence[0]} ${operands[1]} ${sequence[1]} ${operands[2]} = ${result}`).value;
      } catch {
        return false;
      }
    });
    if (valid.length !== 1 || sequenceLabel(valid[0]) !== sequenceLabel(intended)) continue;
    const wrong = rng.shuffle(allSequences.filter((sequence) => sequenceLabel(sequence) !== sequenceLabel(intended))).slice(0, 3);
    const options: OpsPilotOption[] = [
      { value: sequenceLabel(intended), errorLabel: null },
      ...wrong.map((sequence, index) => ({ value: sequenceLabel(sequence), errorLabel: index === 0 ? "OPERATOR_SEQUENCE_REVERSED" : "ONE_OPERATOR_MISPLACED" })),
    ];
    const completed = `${operands[0]} ${intended[0]} ${operands[1]} ${intended[1]} ${operands[2]} = ${result}`;
    const truth = equationTruth(completed);
    return finalize({
      candidateId: "OPS-CAND-012",
      checkpointId: "OPS-CP-004",
      seed,
      locale: "en-IN",
      taskKind: "FILL_OPERATOR_SEQUENCE_FOR_EQUALITY",
      solveMode: "fillOrderedOperatorsWithFixedRelation",
      renderer: "TABLE_OR_GRID",
      stem: `Select the ordered pair of operators that makes ${operands[0]} _ ${operands[1]} _ ${operands[2]} = ${result} true.`,
      answer: sequenceLabel(intended),
      options,
      explanation: {
        ruleStatement: "Insert each option in order and evaluate the completed equation exactly.",
        steps: [{ label: "Insert selected sequence", expression: completed, result: "Both sides are equal" }],
        conclusion: `${sequenceLabel(intended)} is the unique balancing sequence.`,
      },
      proof: { unique: true, solverRoute: "ENUMERATE_ORDERED_OPERATOR_SEQUENCES", eligibleCandidateCount: allSequences.length, survivingCandidateCount: 1, semanticFingerprint: truth.fingerprint },
      metadata: { attempts: attempt + 1, placeholderCount: 2 },
    }, rng);
  }
  throw new Error("OPS-CAND-012 could not construct a unique instance.");
}

function generateCandidate014(seed: number): OpsPilotQuestion {
  const rng = new PilotRng("OPS-CAND-014", seed);
  const blueprints = [
    { expression: "18 + 6 × 2", pair: { left: "+", right: "×" } },
    { expression: "36 ÷ 6 − 2", pair: { left: "÷", right: "−" } },
    { expression: "24 + 8 ÷ 4", pair: { left: "+", right: "÷" } },
  ] as const;
  const blueprint = rng.pick(blueprints);
  const solved = solveArithmetic(
    blueprint.expression,
    STANDARD_IDENTITY_MAPPING,
    (tokens) => swapDisplayOperators(tokens, [blueprint.pair]).tokens,
  );
  return numericQuestion({
    candidateId: "OPS-CAND-014",
    checkpointId: "OPS-CP-005",
    seed,
    locale: "en-IN",
    taskKind: "EVALUATE_AFTER_GIVEN_INTERCHANGE",
    solveMode: "evaluateAfterSpecifiedSingleOperatorPairSwap",
    renderer: "STRUCTURED_TEXT",
    stem: `Interchange ${blueprint.pair.left} and ${blueprint.pair.right} throughout ${blueprint.expression}, then evaluate it.`,
    explanation: {
      ruleStatement: "Interchange both operator identities simultaneously at every occurrence.",
      steps: [
        { label: "Apply simultaneous interchange", expression: blueprint.expression, result: solved.transformed },
        { label: "Evaluate transformed expression", expression: solved.transformed, result: solved.value },
      ],
      conclusion: `The transformed value is ${solved.value}.`,
    },
    proof: { unique: true, solverRoute: "PRESCRIBED_OPERATOR_SWAP_THEN_EXACT_EVALUATION", eligibleCandidateCount: 1, survivingCandidateCount: 1, semanticFingerprint: solved.fingerprint },
    metadata: { swapPair: pairKey(blueprint.pair.left, blueprint.pair.right), scope: "GLOBAL_TOKEN" },
  }, solved.value, rng);
}

function generateCandidate016(seed: number): OpsPilotQuestion {
  const rng = new PilotRng("OPS-CAND-016", seed);
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const a = rng.int(3, 15);
    const b = rng.int(2, 10);
    const product = a * b;
    const display = `${a} + ${b} = ${product}`;
    const repairs = findOperatorPairRepairs(display);
    if (repairs.length !== 1 || pairKey(repairs[0].candidate.left, repairs[0].candidate.right) !== pairKey("+", "×")) continue;
    const correct = repairs[0].candidate;
    const wrong = rng.shuffle(OPERATOR_PAIRS.filter((pair) => pairKey(pair.left, pair.right) !== pairKey(correct.left, correct.right))).slice(0, 3);
    const options: OpsPilotOption[] = [
      { value: `${correct.left} ↔ ${correct.right}`, errorLabel: null },
      ...wrong.map((pair) => ({ value: `${pair.left} ↔ ${pair.right}`, errorLabel: "WRONG_OPERATOR_PAIR" })),
    ];
    return finalize({
      candidateId: "OPS-CAND-016",
      checkpointId: "OPS-CP-005",
      seed,
      locale: "en-IN",
      taskKind: "IDENTIFY_OPERATOR_PAIR_TO_SWAP",
      solveMode: "identifySingleOperatorPairSwapForEquation",
      renderer: "TABLE_OR_GRID",
      stem: `Which pair of operators must be interchanged to make ${display} correct?`,
      answer: `${correct.left} ↔ ${correct.right}`,
      options,
      explanation: {
        ruleStatement: "Apply every eligible global operator interchange to the original equation and re-solve it.",
        steps: [{ label: "Apply unique repair", expression: display, result: renderDisplayTokens(repairs[0].transformed) }],
        conclusion: `Only ${correct.left} and ${correct.right} repair the equation.`,
      },
      proof: { unique: true, solverRoute: "ENUMERATE_ALL_OPERATOR_PAIR_REPAIRS", eligibleCandidateCount: OPERATOR_PAIRS.length, survivingCandidateCount: 1, semanticFingerprint: repairs[0].result.parsed.kind === "RELATION" ? "RELATION_REPAIR" : "INVALID" },
      metadata: { attempts: attempt + 1, ambiguityPool: "ALL_BASIC_OPERATOR_PAIRS" },
    }, rng);
  }
  throw new Error("OPS-CAND-016 could not construct a unique instance.");
}

function generateCandidate018(seed: number): OpsPilotQuestion {
  const rng = new PilotRng("OPS-CAND-018", seed);
  const displays = [
    "12 = 3 + 2 ÷ 6",
    "15 = 5 + 2 ÷ 5",
    "18 = 3 + 3 ÷ 9",
  ] as const;
  for (const display of rng.shuffle(displays)) {
    const repairs = findOperatorPairRepairs(display, ["+", "−", "×", "÷", "="]);
    const relationRepairs = repairs.filter((repair) => repair.candidate.left === "=" || repair.candidate.right === "=");
    if (repairs.length !== 1 || relationRepairs.length !== 1) continue;
    const correct = relationRepairs[0].candidate;
    const eligiblePairs: OperatorPairSwap[] = [];
    const tokens = ["+", "−", "×", "÷", "="];
    for (let left = 0; left < tokens.length; left += 1) {
      for (let right = left + 1; right < tokens.length; right += 1) eligiblePairs.push({ left: tokens[left], right: tokens[right] });
    }
    const wrong = rng.shuffle(eligiblePairs.filter((pair) => pairKey(pair.left, pair.right) !== pairKey(correct.left, correct.right))).slice(0, 3);
    const options: OpsPilotOption[] = [
      { value: `${correct.left} ↔ ${correct.right}`, errorLabel: null },
      ...wrong.map((pair) => ({ value: `${pair.left} ↔ ${pair.right}`, errorLabel: pair.left === "=" || pair.right === "=" ? "WRONG_RELATION_RELOCATION" : "RELATION_NOT_MOVED" })),
    ];
    return finalize({
      candidateId: "OPS-CAND-018",
      checkpointId: "OPS-CP-005",
      seed,
      locale: "en-IN",
      taskKind: "IDENTIFY_OPERATOR_PAIR_TO_SWAP",
      solveMode: "identifyArithmeticRelationPairSwapForEquation",
      renderer: "TABLE_OR_GRID",
      stem: `Which pair of signs must be interchanged to make ${display} correct?`,
      answer: `${correct.left} ↔ ${correct.right}`,
      options,
      explanation: {
        ruleStatement: "A swap involving the relation sign can move the equation boundary, so every candidate must be reparsed.",
        steps: [{ label: "Relocate relation boundary", expression: display, result: renderDisplayTokens(relationRepairs[0].transformed) }],
        conclusion: `Interchanging ${correct.left} and ${correct.right} gives the only valid equation.`,
      },
      proof: { unique: true, solverRoute: "ENUMERATE_OPERATOR_AND_RELATION_PAIR_REPAIRS", eligibleCandidateCount: eligiblePairs.length, survivingCandidateCount: 1, semanticFingerprint: "RELATION_BOUNDARY_REDISCOVERED" },
      metadata: { relationRelocated: true, ambiguityPool: "ARITHMETIC_AND_RELATION_PAIRS" },
    }, rng);
  }
  throw new Error("OPS-CAND-018 has no valid curated pilot display.");
}

function generateCandidate020(seed: number): OpsPilotQuestion {
  const rng = new PilotRng("OPS-CAND-020", seed);
  const displays = [
    "4 ÷ 5 − 3 + 2 × 1 = 11",
    "9 − 6 = 15",
    "14 − 5 = 21",
  ] as const;
  for (const display of rng.shuffle(displays)) {
    const repairs = findWholeNumberPairRepairs(display);
    if (repairs.length !== 1) continue;
    const correct = repairs[0].candidate;
    const numberTokens = [...new Set(tokenizeDisplayExpression(display).filter((token) => token.kind === "NUMBER").map((token) => token.source))];
    const pairs: Array<readonly [string, string]> = [];
    for (let left = 0; left < numberTokens.length; left += 1) {
      for (let right = left + 1; right < numberTokens.length; right += 1) pairs.push([numberTokens[left], numberTokens[right]] as const);
    }
    const wrong = rng.shuffle(pairs.filter((pair) => numberPairKey(pair) !== numberPairKey(correct))).slice(0, 3);
    if (wrong.length < 3) continue;
    const options: OpsPilotOption[] = [
      { value: `${correct[0]} ↔ ${correct[1]}`, errorLabel: null },
      ...wrong.map((pair) => ({ value: `${pair[0]} ↔ ${pair[1]}`, errorLabel: "WRONG_WHOLE_NUMBER_PAIR" })),
    ];
    return finalize({
      candidateId: "OPS-CAND-020",
      checkpointId: "OPS-CP-006",
      seed,
      locale: "en-IN",
      taskKind: "IDENTIFY_VALUE_PAIR_TO_SWAP",
      solveMode: "identifyWholeNumberPairSwapForEquation",
      renderer: "TABLE_OR_GRID",
      stem: `Which two complete numbers must be interchanged to make ${display} correct?`,
      answer: `${correct[0]} ↔ ${correct[1]}`,
      options,
      explanation: {
        ruleStatement: "Interchange complete numeric tokens, not their individual digits.",
        steps: [{ label: "Apply whole-number swap", expression: display, result: renderDisplayTokens(repairs[0].transformed) }],
        conclusion: `${correct[0]} and ${correct[1]} form the unique whole-number repair.`,
      },
      proof: { unique: true, solverRoute: "ENUMERATE_WHOLE_NUMBER_TOKEN_PAIRS", eligibleCandidateCount: pairs.length, survivingCandidateCount: 1, semanticFingerprint: "WHOLE_NUMBER_REPAIR" },
      metadata: { numberIdentity: "COMPLETE_TOKEN", candidatePairCount: pairs.length },
    }, rng);
  }
  throw new Error("OPS-CAND-020 has no valid curated pilot display.");
}

function generateCandidate023(seed: number): OpsPilotQuestion {
  const rng = new PilotRng("OPS-CAND-023", seed);
  const displays = ["15 + 3 = 12", "26 + 4 = 23", "37 + 2 = 34"] as const;
  for (const display of rng.shuffle(displays)) {
    const repairs = findDigitPairRepairs(display);
    if (repairs.length !== 1) continue;
    const correct = repairs[0].candidate;
    const digits = [...new Set(display.match(/\d/g)?.map(Number) ?? [])].sort((a, b) => a - b);
    const pairs: Array<readonly [number, number]> = [];
    for (let left = 0; left < digits.length; left += 1) {
      for (let right = left + 1; right < digits.length; right += 1) pairs.push([digits[left], digits[right]] as const);
    }
    const wrong = rng.shuffle(pairs.filter((pair) => pair[0] !== correct[0] || pair[1] !== correct[1])).slice(0, 3);
    if (wrong.length < 3) continue;
    const options: OpsPilotOption[] = [
      { value: `${correct[0]} ↔ ${correct[1]}`, errorLabel: null },
      ...wrong.map((pair) => ({ value: `${pair[0]} ↔ ${pair[1]}`, errorLabel: "WRONG_DIGIT_IDENTITY_PAIR" })),
    ];
    return finalize({
      candidateId: "OPS-CAND-023",
      checkpointId: "OPS-CP-007",
      seed,
      locale: "en-IN",
      taskKind: "IDENTIFY_DIGIT_PAIR_TO_SWAP",
      solveMode: "identifyGlobalDigitPairSwapForEquation",
      renderer: "TABLE_OR_GRID",
      stem: `Which two digits must be interchanged globally to make ${display} correct?`,
      answer: `${correct[0]} ↔ ${correct[1]}`,
      options,
      explanation: {
        ruleStatement: "Replace every occurrence of each digit by the other digit and rebuild all numeric literals.",
        steps: [{ label: "Apply global digit swap", expression: display, result: renderDisplayTokens(repairs[0].transformed) }],
        conclusion: `Digits ${correct[0]} and ${correct[1]} give the unique valid repair.`,
      },
      proof: { unique: true, solverRoute: "ENUMERATE_GLOBAL_DIGIT_IDENTITY_PAIRS", eligibleCandidateCount: pairs.length, survivingCandidateCount: 1, semanticFingerprint: "DIGIT_REPAIR" },
      metadata: { digitScope: "GLOBAL_IDENTITY", leadingZeroPolicy: "REJECT" },
    }, rng);
  }
  throw new Error("OPS-CAND-023 has no valid curated pilot display.");
}

function generateCandidate026(seed: number): OpsPilotQuestion {
  const rng = new PilotRng("OPS-CAND-026", seed);
  const candidateOperatorPairs = [
    { left: "+", right: "−" },
    { left: "−", right: "×" },
    { left: "+", right: "×" },
  ] as const;
  for (let attempt = 0; attempt < 1200; attempt += 1) {
    const a = rng.int(6, 22);
    const b = rng.int(2, 8);
    const c = rng.int(1, 12);
    const result = a * b - c;
    if (result <= 0 || new Set([String(a), String(b), String(c), String(result)]).size < 4) continue;
    const trueEquation = `${a} × ${b} − ${c} = ${result}`;
    const operatorPair = rng.pick(candidateOperatorPairs);
    const numberChoices: Array<readonly [string, string]> = [[String(a), String(c)], [String(a), String(result)], [String(b), String(result)]];
    const numberPair = rng.pick(numberChoices);
    const encoded = composeTransformations(tokenizeDisplayExpression(trueEquation), [
      (tokens) => swapDisplayOperators(tokens, [operatorPair]),
      (tokens) => swapWholeNumberTokens(tokens, numberPair[0], numberPair[1]),
    ]);
    const display = renderDisplayTokens(encoded.tokens);
    const repairs = findOperatorAndWholeNumberRepairs(display);
    if (repairs.length !== 1) continue;
    const repair = repairs[0].candidate;
    if (pairKey(repair.operatorPair.left, repair.operatorPair.right) !== pairKey(operatorPair.left, operatorPair.right)) continue;
    if (numberPairKey(repair.numberPair) !== numberPairKey(numberPair)) continue;

    const allNumbers = [...new Set(tokenizeDisplayExpression(display).filter((token) => token.kind === "NUMBER").map((token) => token.source))];
    const wrongNumber = allNumbers.find((value) => !numberPair.includes(value)) ?? allNumbers[0];
    const wrongOperator = OPERATOR_PAIRS.find((pair) => pairKey(pair.left, pair.right) !== pairKey(operatorPair.left, operatorPair.right))!;
    const answer = `${operatorPair.left} ↔ ${operatorPair.right}; ${numberPair[0]} ↔ ${numberPair[1]}`;
    const options: OpsPilotOption[] = [
      { value: answer, errorLabel: null },
      { value: `${operatorPair.left} ↔ ${operatorPair.right}; no number swap`, errorLabel: "ONLY_OPERATOR_SWAP_APPLIED" },
      { value: `no operator swap; ${numberPair[0]} ↔ ${numberPair[1]}`, errorLabel: "ONLY_NUMBER_SWAP_APPLIED" },
      { value: `${wrongOperator.left} ↔ ${wrongOperator.right}; ${numberPair[0]} ↔ ${wrongNumber}`, errorLabel: "WRONG_COMPOUND_PAIR" },
    ];
    return finalize({
      candidateId: "OPS-CAND-026",
      checkpointId: "OPS-CP-008",
      seed,
      locale: "en-IN",
      taskKind: "IDENTIFY_OPERATOR_AND_VALUE_SWAP",
      solveMode: "identifyOperatorAndWholeNumberPairSwap",
      renderer: "TABLE_OR_GRID",
      stem: `Which operator pair and whole-number pair must both be interchanged to make ${display} correct?`,
      answer,
      options,
      explanation: {
        ruleStatement: "Apply each compound option from the original equation; neither partial transformation is sufficient.",
        steps: [{ label: "Apply both simultaneous swaps", expression: display, result: renderDisplayTokens(repairs[0].transformed) }],
        conclusion: `${answer} is the unique compound repair.`,
      },
      proof: { unique: true, solverRoute: "ENUMERATE_OPERATOR_X_NUMBER_COMPOUND_POOL", eligibleCandidateCount: OPERATOR_PAIRS.length * ((allNumbers.length * (allNumbers.length - 1)) / 2), survivingCandidateCount: 1, semanticFingerprint: "COMPOUND_REPAIR" },
      metadata: { attempts: attempt + 1, sourceTrueEquation: trueEquation, compoundComponents: 2 },
    }, rng);
  }
  throw new Error("OPS-CAND-026 could not construct a unique compound instance.");
}

function generateCandidate030(seed: number): OpsPilotQuestion {
  const rng = new PilotRng("OPS-CAND-030", seed);
  const x = rng.int(3, 12);
  const y = rng.int(2, x - 1);
  const evidence = [
    { expression: `${x} M ${y}`, expectedValue: String(x + y) },
    { expression: `${x + 5} N ${y}`, expectedValue: String(x + 5 - y) },
  ] as const;
  const inferred = inferBijectiveMapping(["M", "N"], ["ADD", "SUBTRACT"], evidence);
  if (inferred.length !== 1) throw new Error("OPS-CAND-030 evidence did not identify one mapping.");
  const target = `${x + 2} M ${y + 1} N 2`;
  const solved = solveArithmetic(target, inferred[0]);
  return numericQuestion({
    candidateId: "OPS-CAND-030",
    checkpointId: "OPS-CP-009",
    seed,
    locale: "en-IN",
    taskKind: "INFER_MAPPING_AND_EVALUATE_TARGET",
    solveMode: "inferArithmeticOperatorMappingThenEvaluateTarget",
    renderer: "STRUCTURED_TEXT",
    stem: `Given ${evidence[0].expression} = ${evidence[0].expectedValue} and ${evidence[1].expression} = ${evidence[1].expectedValue}, evaluate ${target}.`,
    explanation: {
      ruleStatement: "Infer the unique symbol-to-operation mapping from all examples before solving the target.",
      steps: [
        { label: "Infer mapping", expression: evidence.map((item) => `${item.expression} = ${item.expectedValue}`).join("; "), result: mappingText(inferred[0]) },
        { label: "Apply to target", expression: target, result: `${solved.transformed} = ${solved.value}` },
      ],
      conclusion: `The target value is ${solved.value}.`,
    },
    proof: { unique: true, solverRoute: "ENUMERATE_BIJECTIVE_ARITHMETIC_MAPPINGS", eligibleCandidateCount: 2, survivingCandidateCount: 1, semanticFingerprint: solved.fingerprint },
    metadata: { evidenceCount: evidence.length, inferredMappingCount: inferred.length },
  }, solved.value, rng);
}

function generateCandidate034(seed: number): OpsPilotQuestion {
  const rng = new PilotRng("OPS-CAND-034", seed);
  const evidence = [
    { expression: "3 A 2 B 5", expectedTruth: true },
    { expression: "7 C 4", expectedTruth: true },
  ] as const;
  const domain: readonly SemanticOperator[] = ["ADD", "EQUAL", "GREATER_THAN"];
  const inferred = inferBijectiveMapping(["A", "B", "C"], domain, evidence);
  if (inferred.length !== 1) throw new Error("OPS-CAND-034 evidence did not identify one mixed mapping.");
  const statements = [
    "4 A 3 B 7",
    "4 A 3 C 8",
    "9 C 12",
    "6 A 2 B 9",
  ] as const;
  const evaluated = statements.map((statement) => ({ statement, truth: equationTruth(statement, inferred[0]) }));
  const trueStatements = evaluated.filter((entry) => entry.truth.value);
  if (trueStatements.length !== 1) throw new Error("OPS-CAND-034 target statements are not uniquely true.");
  const answer = trueStatements[0].statement;
  const options: OpsPilotOption[] = evaluated.map((entry) => ({
    value: entry.statement,
    errorLabel: entry.truth.value ? null : "STATEMENT_FALSE_UNDER_INFERRED_MAPPING",
  }));
  return finalize({
    candidateId: "OPS-CAND-034",
    checkpointId: "OPS-CP-009",
    seed,
    locale: "en-IN",
    taskKind: "INFER_MAPPING_AND_IDENTIFY_TRUE_STATEMENT",
    solveMode: "inferMixedArithmeticRelationMappingThenSelectStatement",
    renderer: "TABLE_OR_GRID",
    stem: `From the facts ${evidence[0].expression} is true and ${evidence[1].expression} is true, infer A, B and C, then select the true statement.`,
    answer,
    options,
    explanation: {
      ruleStatement: "Infer arithmetic and relation meanings together; the relation boundary must be validated after mapping.",
      steps: [
        { label: "Infer mixed mapping", expression: evidence.map((item) => item.expression).join("; "), result: mappingText(inferred[0]) },
        { label: "Validate options", expression: answer, result: "True" },
      ],
      conclusion: `${answer} is the only true statement.`,
    },
    proof: { unique: true, solverRoute: "ENUMERATE_MIXED_ARITHMETIC_RELATION_MAPPINGS", eligibleCandidateCount: 6, survivingCandidateCount: 1, semanticFingerprint: trueStatements[0].truth.fingerprint },
    metadata: { evidenceCount: evidence.length, relationTokenInferred: true },
  }, rng);
}

export const OPS_REPRESENTATIVE_PILOT_IDS: readonly OpsPilotCandidateId[] = [
  "OPS-CAND-001",
  "OPS-CAND-003",
  "OPS-CAND-010",
  "OPS-CAND-012",
  "OPS-CAND-014",
  "OPS-CAND-016",
  "OPS-CAND-018",
  "OPS-CAND-020",
  "OPS-CAND-023",
  "OPS-CAND-026",
  "OPS-CAND-030",
  "OPS-CAND-034",
];

const GENERATORS: Readonly<Record<OpsPilotCandidateId, (seed: number) => OpsPilotQuestion>> = {
  "OPS-CAND-001": generateCandidate001,
  "OPS-CAND-003": generateCandidate003,
  "OPS-CAND-010": generateCandidate010,
  "OPS-CAND-012": generateCandidate012,
  "OPS-CAND-014": generateCandidate014,
  "OPS-CAND-016": generateCandidate016,
  "OPS-CAND-018": generateCandidate018,
  "OPS-CAND-020": generateCandidate020,
  "OPS-CAND-023": generateCandidate023,
  "OPS-CAND-026": generateCandidate026,
  "OPS-CAND-030": generateCandidate030,
  "OPS-CAND-034": generateCandidate034,
};

export function generateOpsRepresentativePilot(candidateId: OpsPilotCandidateId, seed: number): OpsPilotQuestion {
  if (!Number.isInteger(seed) || seed < 0) throw new Error(`Pilot seed must be a non-negative integer; received ${seed}.`);
  return GENERATORS[candidateId](seed);
}

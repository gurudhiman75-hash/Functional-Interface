import {
  STANDARD_IDENTITY_MAPPING,
  applyOperatorMapping,
  evaluateParsedExpression,
  formatExact,
  inferBijectiveMapping,
  parseSemanticTokens,
  parsedExpressionFingerprint,
  renderDisplayTokens,
  solveWithMapping,
  swapDisplayOperators,
  tokenizeDisplayExpression,
  type EvaluationResult,
  type OperatorMapping,
  type OperatorPairSwap,
  type SemanticOperator,
} from "../foundation";
import type { OpsPilotExplanationStep, OpsPilotOption } from "./representative-pilots";

export type OpsSupplementaryCandidateId =
  | "OPS-CAND-002"
  | "OPS-CAND-004"
  | "OPS-CAND-005"
  | "OPS-CAND-006"
  | "OPS-CAND-007"
  | "OPS-CAND-008"
  | "OPS-CAND-009"
  | "OPS-CAND-011"
  | "OPS-CAND-013"
  | "OPS-CAND-015"
  | "OPS-CAND-017"
  | "OPS-CAND-019";

export interface OpsSupplementaryQuestion {
  candidateId: OpsSupplementaryCandidateId;
  checkpointId: string;
  seed: number;
  locale: "en-IN";
  localeMode: "TRANSLATABLE" | "LANGUAGE_ADAPTED";
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

class SupplementaryRng {
  private state: number;

  constructor(candidateId: string, seed: number) {
    let hash = 2166136261 >>> 0;
    for (const char of `${candidateId}:${seed}:supplementary`) {
      hash ^= char.charCodeAt(0);
      hash = Math.imul(hash, 16777619) >>> 0;
    }
    this.state = hash || 0x85ebca6b;
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
const SINGLE_OPERATOR_PAIRS: readonly OperatorPairSwap[] = [
  { left: "+", right: "−" },
  { left: "+", right: "×" },
  { left: "+", right: "÷" },
  { left: "−", right: "×" },
  { left: "−", right: "÷" },
  { left: "×", right: "÷" },
];
const DOUBLE_OPERATOR_PAIRINGS: readonly (readonly [OperatorPairSwap, OperatorPairSwap])[] = [
  [{ left: "+", right: "−" }, { left: "×", right: "÷" }],
  [{ left: "+", right: "×" }, { left: "−", right: "÷" }],
  [{ left: "+", right: "÷" }, { left: "−", right: "×" }],
];

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

function mappingText(mapping: OperatorMapping): string {
  return mapping.entries.map((entry) => `${entry.displayToken} means ${semanticGlyph(entry.semanticOperator)}`).join(", ");
}

function solveArithmetic(expression: string, mapping: OperatorMapping): { value: string; fingerprint: string; transformed: string } {
  const solved = solveWithMapping(expression, mapping);
  if (solved.evaluation.parsed.kind !== "ARITHMETIC" || !solved.evaluation.arithmeticValue) {
    throw new Error(`Expected arithmetic result for ${expression}.`);
  }
  return {
    value: formatExact(solved.evaluation.arithmeticValue),
    fingerprint: solved.semanticFingerprint,
    transformed: renderDisplayTokens(solved.transformedTokens),
  };
}

function evaluateTransformedRelation(
  expression: string,
  mapping: OperatorMapping,
  swaps?: readonly OperatorPairSwap[],
): { truth: boolean; fingerprint: string; transformed: string } {
  const original = tokenizeDisplayExpression(expression);
  const transformed = swaps ? swapDisplayOperators(original, swaps).tokens : original;
  const parsed = parseSemanticTokens(applyOperatorMapping(transformed, mapping));
  const result = evaluateParsedExpression(parsed);
  if (result.parsed.kind !== "RELATION") throw new Error(`Expected relation: ${expression}`);
  return {
    truth: result.relationValue === true,
    fingerprint: parsedExpressionFingerprint(parsed),
    transformed: renderDisplayTokens(transformed),
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
    add("0", "SUBSTITUTION_NOT_APPLIED");
    add("1", "PRECEDENCE_TRAP");
    add("−1", "SIGN_ERROR");
  }
  return output.slice(0, 3);
}

function finalize(
  question: Omit<OpsSupplementaryQuestion, "options" | "correctIndex"> & { options: readonly OpsPilotOption[] },
  rng: SupplementaryRng,
): OpsSupplementaryQuestion {
  if (question.options.length !== 4) throw new Error(`${question.candidateId} must produce four options.`);
  if (new Set(question.options.map((option) => option.value)).size !== 4) throw new Error(`${question.candidateId} produced duplicate options.`);
  if (question.options.filter((option) => option.errorLabel === null).length !== 1) throw new Error(`${question.candidateId} must have one correct option.`);
  const options = rng.shuffle(question.options);
  return { ...question, options, correctIndex: options.findIndex((option) => option.errorLabel === null) };
}

function numericQuestion(
  base: Omit<OpsSupplementaryQuestion, "options" | "correctIndex" | "answer">,
  answer: string,
  rng: SupplementaryRng,
): OpsSupplementaryQuestion {
  return finalize({ ...base, answer, options: [{ value: answer, errorLabel: null }, ...numericDistractors(answer)] }, rng);
}

function generate002(seed: number): OpsSupplementaryQuestion {
  const rng = new SupplementaryRng("OPS-CAND-002", seed);
  const mapping: OperatorMapping = {
    entries: [
      { displayToken: "+", semanticOperator: "MULTIPLY" },
      { displayToken: "×", semanticOperator: "ADD" },
    ],
    preserveUnmappedStandardOperators: true,
  };
  const expression = rng.pick(["8 + 3 × 2", "6 + 4 × 5", "9 + 2 × 7"] as const);
  const solved = solveArithmetic(expression, mapping);
  return numericQuestion({
    candidateId: "OPS-CAND-002",
    checkpointId: "OPS-CP-001",
    seed,
    locale: "en-IN",
    localeMode: "TRANSLATABLE",
    taskKind: "RECOVER_MISSING_RESULT_AFTER_MAPPING",
    solveMode: "recoverMissingResultAfterGivenArithmeticMapping",
    renderer: "STRUCTURED_TEXT",
    stem: `If ${mappingText(mapping)}, complete ${expression} = _.`,
    explanation: {
      ruleStatement: "Transform the left side first, then place its exact value in the missing result position.",
      steps: [{ label: "Transform left side", expression, result: solved.transformed }, { label: "Recover result", expression: solved.transformed, result: solved.value }],
      conclusion: `The missing result is ${solved.value}.`,
    },
    proof: { unique: true, solverRoute: "SUPPLIED_MAPPING_RESULT_SLOT", eligibleCandidateCount: 1, survivingCandidateCount: 1, semanticFingerprint: solved.fingerprint },
    metadata: { mergeProbeWith: "OPS-CAND-001", resultSlotRenderer: true },
  }, solved.value, rng);
}

function generate004(seed: number): OpsSupplementaryQuestion {
  const rng = new SupplementaryRng("OPS-CAND-004", seed);
  const blueprints = [
    {
      mapping: { entries: [{ displayToken: "M", semanticOperator: "MULTIPLY" }, { displayToken: "N", semanticOperator: "ADD" }], preserveUnmappedStandardOperators: true } satisfies OperatorMapping,
      expression: "8 M 3 N 2",
      tokenFamily: "LETTER_TOKEN",
    },
    {
      mapping: { entries: [{ displayToken: "$", semanticOperator: "ADD" }, { displayToken: "#", semanticOperator: "MULTIPLY" }], preserveUnmappedStandardOperators: true } satisfies OperatorMapping,
      expression: "7 $ 5 # 2",
      tokenFamily: "PUNCTUATION_TOKEN",
    },
    {
      mapping: { entries: [{ displayToken: "◆", semanticOperator: "SUBTRACT" }, { displayToken: "●", semanticOperator: "MULTIPLY" }], preserveUnmappedStandardOperators: true } satisfies OperatorMapping,
      expression: "15 ◆ 3 ● 2",
      tokenFamily: "FONT_SAFE_SHAPE_TOKEN",
    },
  ] as const;
  const blueprint = rng.pick(blueprints);
  const solved = solveArithmetic(blueprint.expression, blueprint.mapping);
  return numericQuestion({
    candidateId: "OPS-CAND-004",
    checkpointId: "OPS-CP-002",
    seed,
    locale: "en-IN",
    localeMode: "TRANSLATABLE",
    taskKind: "EVALUATE_AFTER_GIVEN_MAPPING",
    solveMode: "evaluateAfterGivenArbitraryTokenMapping",
    renderer: "STRUCTURED_TEXT",
    stem: `If ${mappingText(blueprint.mapping)}, evaluate ${blueprint.expression}.`,
    explanation: {
      ruleStatement: "Treat each arbitrary token as its supplied arithmetic operation, not as a code character.",
      steps: [{ label: "Replace arbitrary tokens", expression: blueprint.expression, result: solved.transformed }, { label: "Evaluate", expression: solved.transformed, result: solved.value }],
      conclusion: `The required value is ${solved.value}.`,
    },
    proof: { unique: true, solverRoute: "ARBITRARY_TOKEN_MAPPING_EVALUATOR", eligibleCandidateCount: 1, survivingCandidateCount: 1, semanticFingerprint: solved.fingerprint },
    metadata: { tokenFamily: blueprint.tokenFamily, localeMode: "TRANSLATABLE" },
  }, solved.value, rng);
}

function generate005(seed: number): OpsSupplementaryQuestion {
  const rng = new SupplementaryRng("OPS-CAND-005", seed);
  const mapping: OperatorMapping = {
    entries: [
      { displayToken: "scale", semanticOperator: "MULTIPLY" },
      { displayToken: "combine", semanticOperator: "ADD" },
    ],
    preserveUnmappedStandardOperators: true,
  };
  const expression = rng.pick(["4 scale 3 combine 2", "6 combine 2 scale 5", "8 scale 2 combine 3"] as const);
  const solved = solveArithmetic(expression, mapping);
  return numericQuestion({
    candidateId: "OPS-CAND-005",
    checkpointId: "OPS-CP-002",
    seed,
    locale: "en-IN",
    localeMode: "LANGUAGE_ADAPTED",
    taskKind: "EVALUATE_AFTER_GIVEN_MAPPING",
    solveMode: "evaluateAfterGivenWordTokenMapping",
    renderer: "STRUCTURED_TEXT",
    stem: `If the word operator scale means × and combine means +, evaluate ${expression}.`,
    explanation: {
      ruleStatement: "Resolve each complete word token through the locale-specific operation dictionary before parsing the expression.",
      steps: [{ label: "Replace word operators", expression, result: solved.transformed }, { label: "Evaluate", expression: solved.transformed, result: solved.value }],
      conclusion: `The required value is ${solved.value}.`,
    },
    proof: { unique: true, solverRoute: "LANGUAGE_ADAPTED_WORD_TOKEN_EVALUATOR", eligibleCandidateCount: 1, survivingCandidateCount: 1, semanticFingerprint: solved.fingerprint },
    metadata: { tokenFamily: "WORD_TOKEN", localeAdaptationRequired: true },
  }, solved.value, rng);
}

function generate006(seed: number): OpsSupplementaryQuestion {
  const rng = new SupplementaryRng("OPS-CAND-006", seed);
  const mapping: OperatorMapping = {
    entries: [
      { displayToken: "P", semanticOperator: "ADD" },
      { displayToken: "Q", semanticOperator: "MULTIPLY" },
    ],
    preserveUnmappedStandardOperators: true,
  };
  const expression = rng.pick(["5 P 3 Q 2", "7 Q 2 P 4", "9 P 2 Q 3"] as const);
  const solved = solveArithmetic(expression, mapping);
  return numericQuestion({
    candidateId: "OPS-CAND-006",
    checkpointId: "OPS-CP-002",
    seed,
    locale: "en-IN",
    localeMode: "TRANSLATABLE",
    taskKind: "RECOVER_MISSING_RESULT_AFTER_MAPPING",
    solveMode: "recoverMissingResultAfterArbitraryTokenMapping",
    renderer: "STRUCTURED_TEXT",
    stem: `If ${mappingText(mapping)}, complete ${expression} = _.`,
    explanation: {
      ruleStatement: "Map the arbitrary tokens, evaluate the transformed left side and fill the result slot.",
      steps: [{ label: "Map tokens", expression, result: solved.transformed }, { label: "Recover result", expression: solved.transformed, result: solved.value }],
      conclusion: `The missing result is ${solved.value}.`,
    },
    proof: { unique: true, solverRoute: "ARBITRARY_TOKEN_RESULT_SLOT", eligibleCandidateCount: 1, survivingCandidateCount: 1, semanticFingerprint: solved.fingerprint },
    metadata: { mergeProbeWith: "OPS-CAND-004", resultSlotRenderer: true },
  }, solved.value, rng);
}

function generate007(seed: number): OpsSupplementaryQuestion {
  const rng = new SupplementaryRng("OPS-CAND-007", seed);
  const mapping: OperatorMapping = {
    entries: [
      { displayToken: "M", semanticOperator: "MULTIPLY" },
      { displayToken: "N", semanticOperator: "ADD" },
    ],
    preserveUnmappedStandardOperators: true,
  };
  const left = rng.pick(["8 M 3 N 2", "6 M 4 N 5", "9 M 2 N 7"] as const);
  const solved = solveArithmetic(left, mapping);
  const distractors = numericDistractors(solved.value);
  const options: OpsPilotOption[] = [
    { value: `${left} = ${solved.value}`, errorLabel: null },
    ...distractors.map((entry) => ({ value: `${left} = ${entry.value}`, errorLabel: entry.errorLabel })),
  ];
  return finalize({
    candidateId: "OPS-CAND-007",
    checkpointId: "OPS-CP-002",
    seed,
    locale: "en-IN",
    localeMode: "TRANSLATABLE",
    taskKind: "IDENTIFY_EQUATION_AFTER_MAPPING",
    solveMode: "selectEquationByTruthAfterArbitraryTokenMapping",
    renderer: "TABLE_OR_GRID",
    stem: `If ${mappingText(mapping)}, select the true equation.`,
    answer: `${left} = ${solved.value}`,
    options,
    explanation: {
      ruleStatement: "Apply the arbitrary-token mapping independently to each equation option.",
      steps: [{ label: "Transform option expression", expression: left, result: `${solved.transformed} = ${solved.value}` }],
      conclusion: `${left} = ${solved.value} is the only true equation.`,
    },
    proof: { unique: true, solverRoute: "ARBITRARY_TOKEN_OPTION_TRUTH", eligibleCandidateCount: 4, survivingCandidateCount: 1, semanticFingerprint: solved.fingerprint },
    metadata: { optionTopology: "EQUATION_OPTIONS", tokenFamily: "LETTER_TOKEN" },
  }, rng);
}

const MIXED_MAPPING: OperatorMapping = {
  entries: [
    { displayToken: "A", semanticOperator: "ADD" },
    { displayToken: "B", semanticOperator: "EQUAL" },
    { displayToken: "C", semanticOperator: "GREATER_THAN" },
    { displayToken: "D", semanticOperator: "LESS_THAN" },
  ],
  preserveUnmappedStandardOperators: true,
};

function generate008(seed: number): OpsSupplementaryQuestion {
  const rng = new SupplementaryRng("OPS-CAND-008", seed);
  const statements = ["4 A 3 B 7", "4 A 3 C 8", "9 C 12", "6 A 2 C 9"] as const;
  const evaluated = statements.map((statement) => ({ statement, result: evaluateTransformedRelation(statement, MIXED_MAPPING) }));
  const trueStatements = evaluated.filter((entry) => entry.result.truth);
  if (trueStatements.length !== 1) throw new Error("OPS-CAND-008 statement set is not unique.");
  const answer = trueStatements[0].statement;
  return finalize({
    candidateId: "OPS-CAND-008",
    checkpointId: "OPS-CP-003",
    seed,
    locale: "en-IN",
    localeMode: "TRANSLATABLE",
    taskKind: "IDENTIFY_TRUE_STATEMENT_AFTER_MAPPING",
    solveMode: "selectStatementByTruthAfterMixedMapping",
    renderer: "TABLE_OR_GRID",
    stem: `If ${mappingText(MIXED_MAPPING)}, select the true statement.`,
    answer,
    options: evaluated.map((entry) => ({ value: entry.statement, errorLabel: entry.result.truth ? null : "FALSE_AFTER_MIXED_MAPPING" })),
    explanation: {
      ruleStatement: "Map arithmetic and relation tokens together, then validate the completed relation structure of each option.",
      steps: [{ label: "Validate unique true statement", expression: answer, result: "True" }],
      conclusion: `${answer} is the only true statement.`,
    },
    proof: { unique: true, solverRoute: "SUPPLIED_MIXED_MAPPING_OPTION_TRUTH", eligibleCandidateCount: statements.length, survivingCandidateCount: 1, semanticFingerprint: trueStatements[0].result.fingerprint },
    metadata: { mappingIncludesRelationTokens: true, queryPolarity: "TRUE" },
  }, rng);
}

function generate009(seed: number): OpsSupplementaryQuestion {
  const rng = new SupplementaryRng("OPS-CAND-009", seed);
  const left = rng.pick(["4 A 3", "6 A 2", "5 A 4"] as const);
  const right = solveArithmetic(left, MIXED_MAPPING).value;
  const eligible = ["A", "B", "C", "D"] as const;
  const results = eligible.map((token) => {
    try {
      return { token, truth: evaluateTransformedRelation(`${left} ${token} ${right}`, MIXED_MAPPING).truth };
    } catch {
      return { token, truth: false };
    }
  });
  const survivors = results.filter((entry) => entry.truth);
  if (survivors.length !== 1 || survivors[0].token !== "B") throw new Error("OPS-CAND-009 relation token is not unique.");
  const fingerprint = evaluateTransformedRelation(`${left} B ${right}`, MIXED_MAPPING).fingerprint;
  return finalize({
    candidateId: "OPS-CAND-009",
    checkpointId: "OPS-CP-003",
    seed,
    locale: "en-IN",
    localeMode: "TRANSLATABLE",
    taskKind: "RECOVER_MISSING_RELATION_AFTER_MAPPING",
    solveMode: "recoverMissingRelationTokenAfterMixedMapping",
    renderer: "STRUCTURED_TEXT",
    stem: `If ${mappingText(MIXED_MAPPING)}, which token replaces the blank in ${left} _ ${right}?`,
    answer: "B",
    options: results.map((entry) => ({ value: entry.token, errorLabel: entry.truth ? null : "WRONG_RELATION_TOKEN" })),
    explanation: {
      ruleStatement: "Evaluate both arithmetic sides, then choose the mapped display token for their exact relation.",
      steps: [{ label: "Compare transformed sides", expression: `${left} _ ${right}`, result: `${left} B ${right}` }],
      conclusion: "B is the unique token representing equality here.",
    },
    proof: { unique: true, solverRoute: "ENUMERATE_MAPPED_RELATION_TOKENS", eligibleCandidateCount: eligible.length, survivingCandidateCount: 1, semanticFingerprint: fingerprint },
    metadata: { answerSemantic: "DISPLAY_RELATION_TOKEN", mappedMeaning: "EQUAL" },
  }, rng);
}

function generate011(seed: number): OpsSupplementaryQuestion {
  const rng = new SupplementaryRng("OPS-CAND-011", seed);
  const blueprints = [
    { left: "7 + 5", right: "3 × 4", answer: "=" },
    { left: "8 + 3", right: "4 × 3", answer: "<" },
    { left: "9 + 4", right: "3 × 4", answer: ">" },
  ] as const;
  const blueprint = rng.pick(blueprints);
  const options = ["=", "<", ">", "Cannot be determined"].map((value): OpsPilotOption => ({
    value,
    errorLabel: value === blueprint.answer ? null : "WRONG_RELATION_OPERATOR",
  }));
  const truth = evaluateTransformedRelation(`${blueprint.left} ${blueprint.answer} ${blueprint.right}`, STANDARD_IDENTITY_MAPPING);
  return finalize({
    candidateId: "OPS-CAND-011",
    checkpointId: "OPS-CP-004",
    seed,
    locale: "en-IN",
    localeMode: "TRANSLATABLE",
    taskKind: "RECOVER_SINGLE_MISSING_RELATION",
    solveMode: "recoverSingleMissingRelationOperator",
    renderer: "STRUCTURED_TEXT",
    stem: `Which relation sign replaces the blank in ${blueprint.left} _ ${blueprint.right}?`,
    answer: blueprint.answer,
    options,
    explanation: {
      ruleStatement: "Evaluate both sides independently and compare their exact values.",
      steps: [{ label: "Compare sides", expression: `${blueprint.left} _ ${blueprint.right}`, result: `${blueprint.left} ${blueprint.answer} ${blueprint.right}` }],
      conclusion: `${blueprint.answer} is the correct relation sign.`,
    },
    proof: { unique: true, solverRoute: "EXACT_SIDE_COMPARISON", eligibleCandidateCount: 3, survivingCandidateCount: 1, semanticFingerprint: truth.fingerprint },
    metadata: { suppliedMapping: false, relationPositionFixed: true },
  }, rng);
}

const FILL_SEQUENCE_POOL: readonly (readonly [string, string, string])[] = (() => {
  const sequences: Array<readonly [string, string, string]> = [];
  const arithmetic = ["+", "−", "×"];
  for (let relationIndex = 0; relationIndex < 3; relationIndex += 1) {
    for (const first of arithmetic) {
      for (const second of arithmetic) {
        const sequence = ["", "", ""];
        sequence[relationIndex] = "=";
        const values = [first, second];
        let valueIndex = 0;
        for (let index = 0; index < sequence.length; index += 1) {
          if (!sequence[index]) sequence[index] = values[valueIndex++];
        }
        sequences.push(sequence as unknown as readonly [string, string, string]);
      }
    }
  }
  return sequences;
})();

function sequenceKey(sequence: readonly string[]): string {
  return sequence.join(", ");
}

function fillExpression(operands: readonly [number, number, number, number], sequence: readonly [string, string, string]): string {
  return `${operands[0]} ${sequence[0]} ${operands[1]} ${sequence[1]} ${operands[2]} ${sequence[2]} ${operands[3]}`;
}

function generate013(seed: number): OpsSupplementaryQuestion {
  const rng = new SupplementaryRng("OPS-CAND-013", seed);
  const blueprints = [
    { operands: [7, 5, 3, 4] as const, sequence: ["+", "=", "×"] as const },
    { operands: [2, 2, 3, 4] as const, sequence: ["=", "×", "−"] as const },
    { operands: [2, 2, 3, 8] as const, sequence: ["+", "×", "="] as const },
  ] as const;
  const blueprint = rng.pick(blueprints);
  const valid = FILL_SEQUENCE_POOL.filter((sequence) => {
    try {
      return evaluateTransformedRelation(fillExpression(blueprint.operands, sequence), STANDARD_IDENTITY_MAPPING).truth;
    } catch {
      return false;
    }
  });
  if (valid.length !== 1 || sequenceKey(valid[0]) !== sequenceKey(blueprint.sequence)) throw new Error("OPS-CAND-013 fill sequence is not unique.");
  const wrong = rng.shuffle(FILL_SEQUENCE_POOL.filter((sequence) => sequenceKey(sequence) !== sequenceKey(blueprint.sequence))).slice(0, 3);
  const completed = fillExpression(blueprint.operands, blueprint.sequence);
  const truth = evaluateTransformedRelation(completed, STANDARD_IDENTITY_MAPPING);
  return finalize({
    candidateId: "OPS-CAND-013",
    checkpointId: "OPS-CP-004",
    seed,
    locale: "en-IN",
    localeMode: "TRANSLATABLE",
    taskKind: "INSERT_EQUALITY_WITH_OPERATORS",
    solveMode: "fillOrderedOperatorsIncludingRelationPosition",
    renderer: "TABLE_OR_GRID",
    stem: `Select the ordered sequence that makes ${blueprint.operands.join(" _ ")} a true equation.`,
    answer: sequenceKey(blueprint.sequence),
    options: [{ value: sequenceKey(blueprint.sequence), errorLabel: null }, ...wrong.map((sequence) => ({ value: sequenceKey(sequence), errorLabel: "WRONG_RELATION_POSITION_OR_OPERATOR" }))],
    explanation: {
      ruleStatement: "Insert every sequence in order; the equality sign may occupy any blank, so the equation boundary must be rediscovered.",
      steps: [{ label: "Insert unique sequence", expression: blueprint.operands.join(" _ "), result: completed }],
      conclusion: `${sequenceKey(blueprint.sequence)} is the unique valid sequence.`,
    },
    proof: { unique: true, solverRoute: "ENUMERATE_SEQUENCE_WITH_MOVABLE_RELATION", eligibleCandidateCount: FILL_SEQUENCE_POOL.length, survivingCandidateCount: 1, semanticFingerprint: truth.fingerprint },
    metadata: { relationPosition: blueprint.sequence.indexOf("="), candidateSequenceCount: FILL_SEQUENCE_POOL.length },
  }, rng);
}

function generate015(seed: number): OpsSupplementaryQuestion {
  const rng = new SupplementaryRng("OPS-CAND-015", seed);
  const blueprints = [
    { expression: "18 + 6 − 4 × 2 ÷ 2", swaps: [{ left: "+", right: "×" }, { left: "−", right: "÷" }] as const },
    { expression: "24 + 3 − 6 × 2 ÷ 2", swaps: [{ left: "+", right: "×" }, { left: "−", right: "÷" }] as const },
    { expression: "20 − 5 + 3 ÷ 2 × 4", swaps: [{ left: "+", right: "−" }, { left: "×", right: "÷" }] as const },
  ] as const;
  const blueprint = rng.pick(blueprints);
  const original = tokenizeDisplayExpression(blueprint.expression);
  const swapped = swapDisplayOperators(original, blueprint.swaps);
  const parsed = parseSemanticTokens(applyOperatorMapping(swapped.tokens, STANDARD_IDENTITY_MAPPING));
  const result = evaluateParsedExpression(parsed);
  if (result.parsed.kind !== "ARITHMETIC" || !result.arithmeticValue) throw new Error("OPS-CAND-015 expected arithmetic value.");
  const answer = formatExact(result.arithmeticValue);
  return numericQuestion({
    candidateId: "OPS-CAND-015",
    checkpointId: "OPS-CP-005",
    seed,
    locale: "en-IN",
    localeMode: "TRANSLATABLE",
    taskKind: "EVALUATE_AFTER_GIVEN_INTERCHANGE",
    solveMode: "evaluateAfterSpecifiedDoubleOperatorPairSwap",
    renderer: "STRUCTURED_TEXT",
    stem: `Interchange ${blueprint.swaps[0].left} with ${blueprint.swaps[0].right} and ${blueprint.swaps[1].left} with ${blueprint.swaps[1].right} simultaneously in ${blueprint.expression}, then evaluate it.`,
    explanation: {
      ruleStatement: "Apply both disjoint operator interchanges simultaneously; applying only one pair is incomplete.",
      steps: [{ label: "Apply both pairs", expression: blueprint.expression, result: renderDisplayTokens(swapped.tokens) }, { label: "Evaluate", expression: renderDisplayTokens(swapped.tokens), result: answer }],
      conclusion: `The transformed value is ${answer}.`,
    },
    proof: { unique: true, solverRoute: "PRESCRIBED_DOUBLE_OPERATOR_SWAP", eligibleCandidateCount: 1, survivingCandidateCount: 1, semanticFingerprint: parsedExpressionFingerprint(parsed) },
    metadata: { pairCount: 2, distinctFirstPairTrap: true },
  }, answer, rng);
}

function relationResultAfterSwaps(equation: string, swaps: readonly OperatorPairSwap[]): EvaluationResult | null {
  try {
    const transformed = swapDisplayOperators(tokenizeDisplayExpression(equation), swaps).tokens;
    return evaluateParsedExpression(parseSemanticTokens(applyOperatorMapping(transformed, STANDARD_IDENTITY_MAPPING)));
  } catch {
    return null;
  }
}

function isTrueRelation(result: EvaluationResult | null): boolean {
  return result?.parsed.kind === "RELATION" && result.relationValue === true;
}

function doublePairText(pairs: readonly [OperatorPairSwap, OperatorPairSwap]): string {
  return `${pairs[0].left} ↔ ${pairs[0].right}; ${pairs[1].left} ↔ ${pairs[1].right}`;
}

function generate017(seed: number): OpsSupplementaryQuestion {
  const rng = new SupplementaryRng("OPS-CAND-017", seed);
  const blueprints = [
    { equation: "5 + 5 ÷ 14 ÷ 4 − 14 = 71", answerPairs: DOUBLE_OPERATOR_PAIRINGS[2] },
    { equation: "15 + 3 − 13 × 15 × 10 = 40", answerPairs: DOUBLE_OPERATOR_PAIRINGS[2] },
    { equation: "7 − 11 × 3 × 9 ÷ 11 = 76", answerPairs: DOUBLE_OPERATOR_PAIRINGS[2] },
  ] as const;
  const blueprint = rng.pick(blueprints);
  const doubleSurvivors = DOUBLE_OPERATOR_PAIRINGS.filter((pairs) => isTrueRelation(relationResultAfterSwaps(blueprint.equation, pairs)));
  const singleSurvivors = SINGLE_OPERATOR_PAIRS.filter((pair) => isTrueRelation(relationResultAfterSwaps(blueprint.equation, [pair])));
  if (doubleSurvivors.length !== 1 || doublePairText(doubleSurvivors[0]) !== doublePairText(blueprint.answerPairs) || singleSurvivors.length !== 0) {
    throw new Error("OPS-CAND-017 double-pair repair is not uniquely minimal.");
  }
  const transformed = swapDisplayOperators(tokenizeDisplayExpression(blueprint.equation), blueprint.answerPairs).tokens;
  const parsed = parseSemanticTokens(applyOperatorMapping(transformed, STANDARD_IDENTITY_MAPPING));
  const options: OpsPilotOption[] = DOUBLE_OPERATOR_PAIRINGS.map((pairs) => ({
    value: doublePairText(pairs),
    errorLabel: doublePairText(pairs) === doublePairText(blueprint.answerPairs) ? null : "WRONG_DOUBLE_PAIRING",
  }));
  options.push({ value: "Only one pair is required", errorLabel: "SIMPLER_SINGLE_PAIR_FALSE" });
  return finalize({
    candidateId: "OPS-CAND-017",
    checkpointId: "OPS-CP-005",
    seed,
    locale: "en-IN",
    localeMode: "TRANSLATABLE",
    taskKind: "IDENTIFY_TWO_OPERATOR_PAIRS_TO_SWAP",
    solveMode: "identifyTwoOperatorPairSwapsForEquation",
    renderer: "TABLE_OR_GRID",
    stem: `Which two disjoint operator pairs must be interchanged simultaneously to make ${blueprint.equation} correct?`,
    answer: doublePairText(blueprint.answerPairs),
    options,
    explanation: {
      ruleStatement: "Test all three disjoint pairings and also reject every simpler single-pair repair.",
      steps: [{ label: "Apply unique double pairing", expression: blueprint.equation, result: renderDisplayTokens(transformed) }],
      conclusion: `${doublePairText(blueprint.answerPairs)} is the unique minimal repair.`,
    },
    proof: { unique: true, solverRoute: "ENUMERATE_DOUBLE_PAIRINGS_AND_EXCLUDE_SINGLE_REPAIRS", eligibleCandidateCount: DOUBLE_OPERATOR_PAIRINGS.length + SINGLE_OPERATOR_PAIRS.length, survivingCandidateCount: 1, semanticFingerprint: parsedExpressionFingerprint(parsed) },
    metadata: { doublePairSurvivors: doubleSurvivors.length, simplerSinglePairSurvivors: singleSurvivors.length },
  }, rng);
}

function generate019(seed: number): OpsSupplementaryQuestion {
  const rng = new SupplementaryRng("OPS-CAND-019", seed);
  const pair = rng.pick([
    { left: "+", right: "×" },
    { left: "−", right: "÷" },
  ] as const);
  const left = pair.left === "+" ? "8 + 3 × 2" : "36 ÷ 6 − 2";
  const transformed = swapDisplayOperators(tokenizeDisplayExpression(left), [pair]).tokens;
  const parsed = parseSemanticTokens(applyOperatorMapping(transformed, STANDARD_IDENTITY_MAPPING));
  const result = evaluateParsedExpression(parsed);
  if (result.parsed.kind !== "ARITHMETIC" || !result.arithmeticValue) throw new Error("OPS-CAND-019 expected arithmetic value.");
  const answerValue = formatExact(result.arithmeticValue);
  const distractors = numericDistractors(answerValue);
  const options: OpsPilotOption[] = [
    { value: `${left} = ${answerValue}`, errorLabel: null },
    ...distractors.map((entry) => ({ value: `${left} = ${entry.value}`, errorLabel: entry.errorLabel })),
  ];
  return finalize({
    candidateId: "OPS-CAND-019",
    checkpointId: "OPS-CP-005",
    seed,
    locale: "en-IN",
    localeMode: "TRANSLATABLE",
    taskKind: "IDENTIFY_CORRECT_EQUATION_AFTER_INTERCHANGE",
    solveMode: "selectEquationByTruthAfterSpecifiedOperatorSwap",
    renderer: "TABLE_OR_GRID",
    stem: `After interchanging ${pair.left} and ${pair.right} in every option, select the true equation.`,
    answer: `${left} = ${answerValue}`,
    options,
    explanation: {
      ruleStatement: "Apply the prescribed interchange independently to each complete equation option.",
      steps: [{ label: "Transform correct option", expression: left, result: `${renderDisplayTokens(transformed)} = ${answerValue}` }],
      conclusion: `${left} = ${answerValue} is the only true option after interchange.`,
    },
    proof: { unique: true, solverRoute: "PRESCRIBED_SWAP_OPTION_TRUTH", eligibleCandidateCount: 4, survivingCandidateCount: 1, semanticFingerprint: parsedExpressionFingerprint(parsed) },
    metadata: { optionTopology: "EQUATION_OPTIONS", swapPair: `${pair.left}<->${pair.right}` },
  }, rng);
}

export const OPS_SUPPLEMENTARY_PILOT_IDS: readonly OpsSupplementaryCandidateId[] = [
  "OPS-CAND-002",
  "OPS-CAND-004",
  "OPS-CAND-005",
  "OPS-CAND-006",
  "OPS-CAND-007",
  "OPS-CAND-008",
  "OPS-CAND-009",
  "OPS-CAND-011",
  "OPS-CAND-013",
  "OPS-CAND-015",
  "OPS-CAND-017",
  "OPS-CAND-019",
];

const GENERATORS: Readonly<Record<OpsSupplementaryCandidateId, (seed: number) => OpsSupplementaryQuestion>> = {
  "OPS-CAND-002": generate002,
  "OPS-CAND-004": generate004,
  "OPS-CAND-005": generate005,
  "OPS-CAND-006": generate006,
  "OPS-CAND-007": generate007,
  "OPS-CAND-008": generate008,
  "OPS-CAND-009": generate009,
  "OPS-CAND-011": generate011,
  "OPS-CAND-013": generate013,
  "OPS-CAND-015": generate015,
  "OPS-CAND-017": generate017,
  "OPS-CAND-019": generate019,
};

export function generateOpsSupplementaryPilot(candidateId: OpsSupplementaryCandidateId, seed: number): OpsSupplementaryQuestion {
  if (!Number.isInteger(seed) || seed < 0) throw new Error(`Pilot seed must be a non-negative integer; received ${seed}.`);
  return GENERATORS[candidateId](seed);
}

import {
  OPS_APPROVED_CANDIDATE_IDS,
  generateApprovedOpsQuestion as generateEntryQuestion,
  type ApprovedOpsQuestion,
  type OpsApprovedCandidateId,
} from "./approved-teaching-entry";
import {
  arithmeticTrace,
  relationTrace,
  swapDigits,
  swapOperatorPairs,
  swapWholeNumbers,
  type TeachingStep,
} from "./approved-teaching-helpers";
import type { OpsPilotOption } from "./representative-pilots";

export { OPS_APPROVED_CANDIDATE_IDS };
export type { ApprovedOpsQuestion, OpsApprovedCandidateId };

const OPERATOR_PAIRS = [
  ["+", "−"],
  ["+", "×"],
  ["+", "÷"],
  ["−", "×"],
  ["−", "÷"],
  ["×", "÷"],
] as const;

type OperatorPair = (typeof OPERATOR_PAIRS)[number];
const DOUBLE_PAIRINGS: readonly (readonly [OperatorPair, OperatorPair])[] = [
  [["+", "−"], ["×", "÷"]],
  [["+", "×"], ["−", "÷"]],
  [["+", "÷"], ["−", "×"]],
] as const;

type CompoundInstance = {
  readonly expression: string;
  readonly operatorPair: OperatorPair;
  readonly numberPair: readonly [string, string];
  readonly operatorOnlyExpression: string;
  readonly numberOnlyExpression: string;
  readonly transformedExpression: string;
  readonly originalAnswer: string;
  readonly operatorOnlyAnswer: string;
  readonly numberOnlyAnswer: string;
  readonly answer: string;
  readonly sourceSeed: number;
};

function rotate<T>(values: readonly T[], offset: number): T[] {
  const normalized = ((offset % values.length) + values.length) % values.length;
  return [...values.slice(normalized), ...values.slice(0, normalized)];
}

function mixed(seed: number, salt: number): number {
  let value = (seed ^ Math.imul(salt + 1, 0x9e3779b1)) >>> 0;
  value ^= value >>> 16;
  value = Math.imul(value, 0x85ebca6b) >>> 0;
  value ^= value >>> 13;
  value = Math.imul(value, 0xc2b2ae35) >>> 0;
  value ^= value >>> 16;
  return value >>> 0;
}

function int(seed: number, salt: number, minimum: number, maximum: number): number {
  return minimum + (mixed(seed, salt) % (maximum - minimum + 1));
}

function integerAnswer(expression: string): string | null {
  try {
    const value = arithmeticTrace(expression).value;
    if (!/^-?\d+$/u.test(value)) return null;
    const numeric = Number(value);
    if (!Number.isSafeInteger(numeric) || Math.abs(numeric) > 10000) return null;
    return value;
  } catch {
    return null;
  }
}

function relationIsTrue(statement: string): boolean {
  try {
    return relationTrace(statement).truth;
  } catch {
    return false;
  }
}

function pairText(pair: OperatorPair): string {
  return `${pair[0]} ↔ ${pair[1]}`;
}

function distinctOptions(
  answer: string,
  candidates: readonly { readonly value: string | null; readonly errorLabel: string }[],
  seed: number,
): readonly OpsPilotOption[] | null {
  const wrong: OpsPilotOption[] = [];
  for (const candidate of candidates) {
    if (candidate.value == null || candidate.value === answer) continue;
    if (wrong.some((entry) => entry.value === candidate.value)) continue;
    wrong.push({ value: candidate.value, errorLabel: candidate.errorLabel });
    if (wrong.length === 3) break;
  }
  if (wrong.length !== 3) return null;
  return rotate([{ value: answer, errorLabel: null }, ...wrong], seed);
}

function replaceTokens(source: string, mapping: readonly (readonly [string, string])[]): string {
  const placeholders = mapping.map((_, index) => `__OPS_${index}__`);
  let transformed = source;
  mapping.forEach(([from], index) => {
    transformed = transformed.split(from).join(placeholders[index]!);
  });
  mapping.forEach(([, to], index) => {
    transformed = transformed.split(placeholders[index]!).join(to);
  });
  return transformed;
}

function mappingKey(mapping: readonly (readonly [string, string])[]): string {
  return mapping.map(([display, meaning]) => `${display} means ${meaning}`).join(", ");
}

function makeMappedNumericInstance(
  seed: number,
  salt: number,
  displayTokens: readonly [string, string],
  semanticTokens: readonly [string, string],
): {
  readonly expression: string;
  readonly transformed: string;
  readonly answer: string;
  readonly ordinaryAnswer: string;
  readonly firstOnlyAnswer: string;
  readonly secondOnlyAnswer: string;
  readonly mapping: readonly (readonly [string, string])[];
  readonly sourceSeed: number;
} {
  for (let attempt = 0; attempt < 5000; attempt += 1) {
    const sourceSeed = (seed * 1009 + attempt * 7919 + salt) >>> 0;
    const a = int(sourceSeed, salt + 1, 4, 34);
    const b = int(sourceSeed, salt + 2, 2, 12);
    const c = int(sourceSeed, salt + 3, 2, 17);
    const mapping = [
      [displayTokens[0], semanticTokens[0]],
      [displayTokens[1], semanticTokens[1]],
    ] as const;
    const expression = `${a} ${displayTokens[0]} ${b} ${displayTokens[1]} ${c}`;
    const transformed = replaceTokens(expression, mapping);
    const firstOnly = replaceTokens(expression, [mapping[0]]);
    const secondOnly = replaceTokens(expression, [mapping[1]]);
    const identityMapping: Array<readonly [string, string]> = [];
    for (const token of displayTokens) {
      if (["+", "−", "×", "÷"].includes(token)) identityMapping.push([token, token]);
    }
    if (identityMapping.length !== 2) {
      identityMapping.length = 0;
      identityMapping.push([displayTokens[0], "+"], [displayTokens[1], "×"]);
    }
    const ordinaryExpression = replaceTokens(expression, identityMapping);
    const answer = integerAnswer(transformed);
    const ordinaryAnswer = integerAnswer(ordinaryExpression);
    const firstOnlyAnswer = integerAnswer(firstOnly);
    const secondOnlyAnswer = integerAnswer(secondOnly);
    if (!answer || !ordinaryAnswer || !firstOnlyAnswer || !secondOnlyAnswer) continue;
    if (new Set([answer, ordinaryAnswer, firstOnlyAnswer, secondOnlyAnswer]).size !== 4) continue;
    return {
      expression,
      transformed,
      answer,
      ordinaryAnswer,
      firstOnlyAnswer,
      secondOnlyAnswer,
      mapping,
      sourceSeed,
    };
  }
  throw new Error(`OPS mapped runtime could not build a misconception-separated instance for seed ${seed}.`);
}

function generatedMetadata(seed: number, sourceSeed: number, extra: Record<string, string | number | boolean> = {}) {
  return {
    teachingExplanationVersion: "V3_APPROVED",
    teachingTraceVerified: true,
    requestedSeed: seed,
    sourceSeed,
    generatedAuditState: true,
    ...extra,
  } as const;
}

function generate001(seed: number): ApprovedOpsQuestion {
  const mappingFamilies = [
    { display: ["+", "×"] as const, semantic: ["×", "+"] as const },
    { display: ["+", "−"] as const, semantic: ["×", "+"] as const },
    { display: ["−", "×"] as const, semantic: ["+", "−"] as const },
  ] as const;
  const family = mappingFamilies[int(seed, 101, 0, mappingFamilies.length - 1)]!;
  const instance = makeMappedNumericInstance(seed, 110, family.display, family.semantic);
  const options = distinctOptions(instance.answer, [
    { value: instance.ordinaryAnswer, errorLabel: "IGNORED_SUPPLIED_MAPPING" },
    { value: instance.firstOnlyAnswer, errorLabel: "APPLIED_ONLY_FIRST_MAPPING" },
    { value: instance.secondOnlyAnswer, errorLabel: "APPLIED_ONLY_SECOND_MAPPING" },
  ], seed)!;
  return {
    candidateId: "OPS-CAND-001", checkpointId: "OPS-CP-001", seed, locale: "en-IN",
    taskKind: "EVALUATE_AFTER_GIVEN_MAPPING", solveMode: "evaluateAfterGivenArithmeticSignMapping", renderer: "STRUCTURED_TEXT",
    stem: `If ${mappingKey(instance.mapping)}, evaluate ${instance.expression}.`,
    options, correctIndex: options.findIndex((option) => option.errorLabel === null), answer: instance.answer,
    explanation: {
      ruleStatement: "Replace every displayed sign by its supplied arithmetic meaning before calculating; the printed sign itself must not be used until the complete mapping has been applied.",
      steps: [
        { label: "Read the replacement key", expression: mappingKey(instance.mapping), result: "Use both stated meanings for every occurrence." },
        { label: "Apply the complete replacement", expression: instance.expression, result: instance.transformed },
        { label: "Evaluate the transformed expression", expression: instance.transformed, result: instance.answer },
      ],
      conclusion: `Therefore, the required value is ${instance.answer}.`,
    },
    proof: { unique: true, solverRoute: "GENERATED_SUPPLIED_MAPPING_EXACT_EVALUATOR", eligibleCandidateCount: 4, survivingCandidateCount: 1, semanticFingerprint: `OPS-CAND-001:${mappingKey(instance.mapping)}:${instance.transformed}:${instance.answer}` },
    metadata: generatedMetadata(seed, instance.sourceSeed, { misconceptionDistractorsGrounded: true }),
  };
}

function generate003(seed: number): ApprovedOpsQuestion {
  const instance = makeMappedNumericInstance(seed, 130, ["+", "×"], ["×", "+"]);
  const equation = (value: string) => `${instance.expression} = ${value}`;
  const optionValues = distinctOptions(instance.answer, [
    { value: instance.ordinaryAnswer, errorLabel: "IGNORED_SUPPLIED_MAPPING" },
    { value: instance.firstOnlyAnswer, errorLabel: "APPLIED_ONLY_FIRST_MAPPING" },
    { value: instance.secondOnlyAnswer, errorLabel: "APPLIED_ONLY_SECOND_MAPPING" },
  ], seed)!;
  const options = optionValues.map((option) => ({ ...option, value: equation(option.value) }));
  const answer = equation(instance.answer);
  return {
    candidateId: "OPS-CAND-003", checkpointId: "OPS-CP-001", seed, locale: "en-IN",
    taskKind: "IDENTIFY_EQUATION_AFTER_MAPPING", solveMode: "selectEquationByTruthAfterGivenArithmeticMapping", renderer: "TABLE_OR_GRID",
    stem: `If ${mappingKey(instance.mapping)}, select the equation that is true.`,
    options, correctIndex: options.findIndex((option) => option.errorLabel === null), answer,
    explanation: {
      ruleStatement: "Apply the supplied meanings to the common coded expression once, calculate its exact value and select the single equation whose right-hand side matches that value.",
      steps: [
        { label: "Read the replacement key", expression: mappingKey(instance.mapping), result: "Apply both meanings to the common expression." },
        { label: "Transform the common left side", expression: instance.expression, result: instance.transformed },
        { label: "Select the matching equation", expression: `${instance.transformed} = ${instance.answer}`, result: answer },
      ],
      conclusion: `Hence, ${answer} is the only true equation.`,
    },
    proof: { unique: true, solverRoute: "GENERATED_MAP_AND_VALIDATE_EQUATION_OPTIONS", eligibleCandidateCount: 4, survivingCandidateCount: 1, semanticFingerprint: `OPS-CAND-003:${instance.transformed}:${instance.answer}` },
    metadata: generatedMetadata(seed, instance.sourceSeed, { optionTopology: "EQUATION_OPTIONS" }),
  };
}

function arbitraryTokenFamily(seed: number): { display: readonly [string, string]; semantic: readonly [string, string]; tokenFamily: string } {
  const families = [
    { display: ["M", "N"] as const, semantic: ["×", "+"] as const, tokenFamily: "LETTER_TOKEN" },
    { display: ["P", "Q"] as const, semantic: ["+", "×"] as const, tokenFamily: "LETTER_TOKEN" },
    { display: ["#", "$" ] as const, semantic: ["×", "+"] as const, tokenFamily: "PUNCTUATION_TOKEN" },
    { display: ["◆", "●"] as const, semantic: ["−", "×"] as const, tokenFamily: "FONT_SAFE_SHAPE_TOKEN" },
  ] as const;
  return families[int(seed, 150, 0, families.length - 1)]!;
}

function generate004(seed: number): ApprovedOpsQuestion {
  const family = arbitraryTokenFamily(seed);
  const instance = makeMappedNumericInstance(seed, 160, family.display, family.semantic);
  const options = distinctOptions(instance.answer, [
    { value: instance.ordinaryAnswer, errorLabel: "USED_DEFAULT_TOKEN_MEANINGS" },
    { value: instance.firstOnlyAnswer, errorLabel: "APPLIED_ONLY_FIRST_TOKEN_MEANING" },
    { value: instance.secondOnlyAnswer, errorLabel: "APPLIED_ONLY_SECOND_TOKEN_MEANING" },
  ], seed)!;
  return {
    candidateId: "OPS-CAND-004", checkpointId: "OPS-CP-002", seed, locale: "en-IN",
    taskKind: "EVALUATE_AFTER_GIVEN_MAPPING", solveMode: "evaluateAfterGivenArbitraryTokenMapping", renderer: "STRUCTURED_TEXT",
    stem: `If ${mappingKey(instance.mapping)}, evaluate ${instance.expression}.`,
    options, correctIndex: options.findIndex((option) => option.errorLabel === null), answer: instance.answer,
    explanation: {
      ruleStatement: "Treat each arbitrary token as the arithmetic operation stated in the key, replace every token first and then evaluate the transformed expression normally.",
      steps: [
        { label: "Read the meaning key", expression: mappingKey(instance.mapping), result: "Keep the two token meanings separate." },
        { label: "Replace arbitrary tokens", expression: instance.expression, result: instance.transformed },
        { label: "Evaluate the transformed expression", expression: instance.transformed, result: instance.answer },
      ],
      conclusion: `Therefore, the required value is ${instance.answer}.`,
    },
    proof: { unique: true, solverRoute: "GENERATED_ARBITRARY_TOKEN_MAPPING_EVALUATOR", eligibleCandidateCount: 4, survivingCandidateCount: 1, semanticFingerprint: `OPS-CAND-004:${family.tokenFamily}:${instance.transformed}:${instance.answer}` },
    metadata: generatedMetadata(seed, instance.sourceSeed, { tokenFamily: family.tokenFamily }),
  };
}

function generate005(seed: number): ApprovedOpsQuestion {
  const instance = makeMappedNumericInstance(seed, 180, ["scale", "combine"], ["×", "+"]);
  const options = distinctOptions(instance.answer, [
    { value: instance.ordinaryAnswer, errorLabel: "IGNORED_WORD_OPERATOR_KEY" },
    { value: instance.firstOnlyAnswer, errorLabel: "APPLIED_ONLY_FIRST_WORD_OPERATOR" },
    { value: instance.secondOnlyAnswer, errorLabel: "APPLIED_ONLY_SECOND_WORD_OPERATOR" },
  ], seed)!;
  return {
    candidateId: "OPS-CAND-005", checkpointId: "OPS-CP-002", seed, locale: "en-IN", localeMode: "LANGUAGE_ADAPTED",
    taskKind: "EVALUATE_AFTER_GIVEN_MAPPING", solveMode: "evaluateAfterGivenWordTokenMapping", renderer: "STRUCTURED_TEXT",
    stem: `If scale means ×, combine means +, evaluate ${instance.expression}.`,
    options, correctIndex: options.findIndex((option) => option.errorLabel === null), answer: instance.answer,
    explanation: {
      ruleStatement: "Read each complete word operator from the supplied key, replace the words by their mathematical operations and only then perform the calculation.",
      steps: [
        { label: "Read the word-operator meaning key", expression: "scale → ×; combine → +", result: "Each complete word has one arithmetic meaning." },
        { label: "Replace the word operators", expression: instance.expression, result: instance.transformed },
        { label: "Evaluate after replacement", expression: instance.transformed, result: instance.answer },
      ],
      conclusion: `Therefore, the required value is ${instance.answer}.`,
    },
    proof: { unique: true, solverRoute: "GENERATED_LANGUAGE_ADAPTED_WORD_TOKEN_EVALUATOR", eligibleCandidateCount: 4, survivingCandidateCount: 1, semanticFingerprint: `OPS-CAND-005:${instance.transformed}:${instance.answer}` },
    metadata: generatedMetadata(seed, instance.sourceSeed, { tokenFamily: "WORD_TOKEN", localeAdaptationRequired: true }),
  };
}

function generate007(seed: number): ApprovedOpsQuestion {
  const family = arbitraryTokenFamily(seed);
  const instance = makeMappedNumericInstance(seed, 200, family.display, family.semantic);
  const equation = (value: string) => `${instance.expression} = ${value}`;
  const optionValues = distinctOptions(instance.answer, [
    { value: instance.ordinaryAnswer, errorLabel: "USED_DEFAULT_TOKEN_MEANINGS" },
    { value: instance.firstOnlyAnswer, errorLabel: "APPLIED_ONLY_FIRST_TOKEN_MEANING" },
    { value: instance.secondOnlyAnswer, errorLabel: "APPLIED_ONLY_SECOND_TOKEN_MEANING" },
  ], seed)!;
  const options = optionValues.map((option) => ({ ...option, value: equation(option.value) }));
  const answer = equation(instance.answer);
  return {
    candidateId: "OPS-CAND-007", checkpointId: "OPS-CP-002", seed, locale: "en-IN",
    taskKind: "IDENTIFY_EQUATION_AFTER_MAPPING", solveMode: "selectEquationByTruthAfterArbitraryTokenMapping", renderer: "TABLE_OR_GRID",
    stem: `If ${mappingKey(instance.mapping)}, select the true equation.`,
    options, correctIndex: options.findIndex((option) => option.errorLabel === null), answer,
    explanation: {
      ruleStatement: "Use the same arbitrary-token meaning key for the common expression, evaluate that transformed expression once and select the option with the matching result.",
      steps: [
        { label: "Read the complete meaning key", expression: mappingKey(instance.mapping), result: "Use this one key for every option." },
        { label: "Transform the common option expression", expression: instance.expression, result: instance.transformed },
        { label: "Select the matching equation", expression: `${instance.transformed} = ${instance.answer}`, result: answer },
      ],
      conclusion: `Hence, ${answer} is the only true equation.`,
    },
    proof: { unique: true, solverRoute: "GENERATED_ARBITRARY_TOKEN_OPTION_TRUTH", eligibleCandidateCount: 4, survivingCandidateCount: 1, semanticFingerprint: `OPS-CAND-007:${instance.transformed}:${instance.answer}` },
    metadata: generatedMetadata(seed, instance.sourceSeed, { optionTopology: "EQUATION_OPTIONS", tokenFamily: family.tokenFamily }),
  };
}

const MIXED_MAPPING = [["A", "+"], ["B", "="], ["C", ">"], ["D", "<"]] as const;

function generate008(seed: number): ApprovedOpsQuestion {
  const sourceSeed = mixed(seed, 220);
  const a = int(sourceSeed, 221, 2, 35);
  const b = int(sourceSeed, 222, 2, 20);
  const sum = a + b;
  const greaterLeft = int(sourceSeed, 223, 20, 60);
  const greaterRight = int(sourceSeed, 224, 2, greaterLeft - 1);
  const correct = `${a} A ${b} B ${sum}`;
  const statementValues = rotate([
    correct,
    `${a} A ${b} C ${sum + 1}`,
    `${greaterLeft} D ${greaterRight}`,
    `${a} B ${b} A ${sum}`,
  ], seed);
  const options: OpsPilotOption[] = statementValues.map((value) => {
    const transformed = replaceTokens(value, MIXED_MAPPING);
    return { value, errorLabel: relationIsTrue(transformed) ? null : "FALSE_AFTER_MIXED_MAPPING" };
  });
  if (options.filter((option) => option.errorLabel === null).length !== 1) throw new Error(`OPS-CAND-008 lost one-answer truth at seed ${seed}.`);
  return {
    candidateId: "OPS-CAND-008", checkpointId: "OPS-CP-003", seed, locale: "en-IN",
    taskKind: "IDENTIFY_TRUE_STATEMENT_AFTER_MAPPING", solveMode: "selectStatementByTruthAfterMixedMapping", renderer: "TABLE_OR_GRID",
    stem: "If A means +, B means =, C means >, D means <, select the true statement.",
    options, correctIndex: options.findIndex((option) => option.errorLabel === null), answer: correct,
    explanation: {
      ruleStatement: "Replace the arithmetic and relation tokens together, then evaluate each completed statement under the same supplied key and retain the single true option.",
      steps: options.map((option, index) => ({
        label: `Check option ${String.fromCharCode(65 + index)}`,
        expression: option.value,
        result: `${replaceTokens(option.value, MIXED_MAPPING)}; ${option.errorLabel === null ? "true" : "false"}.`,
      })),
      conclusion: `Therefore, ${correct} is the only true statement.`,
    },
    proof: { unique: true, solverRoute: "GENERATED_SUPPLIED_MIXED_MAPPING_OPTION_TRUTH", eligibleCandidateCount: 4, survivingCandidateCount: 1, semanticFingerprint: `OPS-CAND-008:${statementValues.join("|")}:${correct}` },
    metadata: generatedMetadata(seed, sourceSeed, { mappingIncludesRelationTokens: true }),
  };
}

function generate009(seed: number): ApprovedOpsQuestion {
  const sourceSeed = mixed(seed, 240);
  const a = int(sourceSeed, 241, 2, 45);
  const b = int(sourceSeed, 242, 2, 24);
  const right = a + b;
  const left = `${a} A ${b}`;
  const candidates = ["A", "B", "C", "D"] as const;
  const truth = candidates.map((token) => relationIsTrue(replaceTokens(`${left} ${token} ${right}`, MIXED_MAPPING)));
  if (truth.filter(Boolean).length !== 1 || !truth[1]) throw new Error(`OPS-CAND-009 relation token is not uniquely B for seed ${seed}.`);
  const options: OpsPilotOption[] = rotate(candidates.map((value, index) => ({ value, errorLabel: truth[index] ? null : "WRONG_RELATION_TOKEN" })), seed);
  return {
    candidateId: "OPS-CAND-009", checkpointId: "OPS-CP-003", seed, locale: "en-IN",
    taskKind: "RECOVER_MISSING_RELATION_AFTER_MAPPING", solveMode: "recoverMissingRelationTokenAfterMixedMapping", renderer: "STRUCTURED_TEXT",
    stem: `If A means +, B means =, C means >, D means <, which token replaces the blank in ${left} _ ${right}?`,
    options, correctIndex: options.findIndex((option) => option.errorLabel === null), answer: "B",
    explanation: {
      ruleStatement: "Use the supplied arithmetic meaning to evaluate the two sides, determine their actual relation and then convert that relation back to the corresponding display token.",
      steps: [
        { label: "Read the complete meaning key", expression: "A → +; B → =; C → >; D → <", result: "The answer must be a display token from this key." },
        { label: "Evaluate the arithmetic side", expression: left, result: `${a} + ${b} = ${right}` },
        { label: "Convert the relation back to its token", expression: `${right} = ${right}`, result: "B represents equality." },
      ],
      conclusion: "Therefore, B is the unique token that fills the blank.",
    },
    proof: { unique: true, solverRoute: "GENERATED_ENUMERATE_MAPPED_RELATION_TOKENS", eligibleCandidateCount: 4, survivingCandidateCount: 1, semanticFingerprint: `OPS-CAND-009:${a}:${b}:${right}:B` },
    metadata: generatedMetadata(seed, sourceSeed, { answerSemantic: "DISPLAY_RELATION_TOKEN", mappedMeaning: "EQUAL" }),
  };
}

function generate011(seed: number): ApprovedOpsQuestion {
  const sourceSeed = mixed(seed, 260);
  const leftA = int(sourceSeed, 261, 2, 35);
  const leftB = int(sourceSeed, 262, 2, 20);
  const leftValue = leftA + leftB;
  const relationIndex = int(sourceSeed, 263, 0, 2);
  const relation = (["=", "<", ">"] as const)[relationIndex]!;
  const delta = int(sourceSeed, 264, 1, 12);
  const rightValue = relation === "=" ? leftValue : relation === "<" ? leftValue + delta : Math.max(1, leftValue - delta);
  const rightB = int(sourceSeed, 265, 2, 9);
  const rightA = rightValue * rightB;
  const left = `${leftA} + ${leftB}`;
  const right = `${rightA} ÷ ${rightB}`;
  const options: OpsPilotOption[] = rotate(["=", "<", ">", "Cannot be determined"].map((value) => ({ value, errorLabel: value === relation ? null : "WRONG_RELATION_OPERATOR" })), seed);
  return {
    candidateId: "OPS-CAND-011", checkpointId: "OPS-CP-004", seed, locale: "en-IN",
    taskKind: "RECOVER_SINGLE_MISSING_RELATION", solveMode: "recoverSingleMissingRelationOperator", renderer: "STRUCTURED_TEXT",
    stem: `Which relation sign replaces the blank in ${left} _ ${right}?`,
    options, correctIndex: options.findIndex((option) => option.errorLabel === null), answer: relation,
    explanation: {
      ruleStatement: "Evaluate the left and right sides independently, compare their exact values and choose the one relation sign that describes that comparison.",
      steps: [
        { label: "Evaluate the left side", expression: left, result: String(leftValue) },
        { label: "Evaluate the right side", expression: right, result: String(rightValue) },
        { label: "Compare both sides", expression: `${leftValue} _ ${rightValue}`, result: `${leftValue} ${relation} ${rightValue}` },
      ],
      conclusion: `Therefore, ${relation} is the correct relation sign.`,
    },
    proof: { unique: true, solverRoute: "GENERATED_EXACT_SIDE_COMPARISON", eligibleCandidateCount: 3, survivingCandidateCount: 1, semanticFingerprint: `OPS-CAND-011:${leftValue}:${relation}:${rightValue}` },
    metadata: generatedMetadata(seed, sourceSeed, { suppliedMapping: false, relationPositionFixed: true }),
  };
}

function buildPrescribedSwapInstance(seed: number, salt: number, pair: OperatorPair): { expression: string; transformed: string; answer: string; originalAnswer: string; wrongPairAnswer: string; sourceSeed: number } {
  for (let attempt = 0; attempt < 4000; attempt += 1) {
    const sourceSeed = (seed * 1013 + attempt * 6151 + salt) >>> 0;
    const a = int(sourceSeed, salt + 1, 4, 30);
    const b = int(sourceSeed, salt + 2, 2, 12);
    const c = int(sourceSeed, salt + 3, 2, 16);
    const d = int(sourceSeed, salt + 4, 2, 10);
    const expression = `${a} + ${b} × ${c} − ${d}`;
    const transformed = swapOperatorPairs(expression, [pair]);
    const wrongPair = OPERATOR_PAIRS.find((candidate) => pairText(candidate) !== pairText(pair))!;
    const answer = integerAnswer(transformed);
    const originalAnswer = integerAnswer(expression);
    const wrongPairAnswer = integerAnswer(swapOperatorPairs(expression, [wrongPair]));
    if (!answer || !originalAnswer || !wrongPairAnswer) continue;
    if (new Set([answer, originalAnswer, wrongPairAnswer]).size !== 3) continue;
    return { expression, transformed, answer, originalAnswer, wrongPairAnswer, sourceSeed };
  }
  throw new Error(`OPS prescribed-swap runtime could not build seed ${seed}.`);
}

function generate014(seed: number): ApprovedOpsQuestion {
  const pair = OPERATOR_PAIRS[int(seed, 280, 0, OPERATOR_PAIRS.length - 1)]!;
  const instance = buildPrescribedSwapInstance(seed, 290, pair);
  const answerNumber = Number(instance.answer);
  const options = distinctOptions(instance.answer, [
    { value: instance.originalAnswer, errorLabel: "INTERCHANGE_NOT_APPLIED" },
    { value: instance.wrongPairAnswer, errorLabel: "WRONG_OPERATOR_PAIR_INTERCHANGED" },
    { value: String(answerNumber + (answerNumber >= 0 ? 1 : -1)), errorLabel: "ARITHMETIC_AFTER_SWAP_ERROR" },
  ], seed)!;
  return {
    candidateId: "OPS-CAND-014", checkpointId: "OPS-CP-005", seed, locale: "en-IN",
    taskKind: "EVALUATE_AFTER_GIVEN_INTERCHANGE", solveMode: "evaluateAfterSpecifiedSingleOperatorPairSwap", renderer: "STRUCTURED_TEXT",
    stem: `Interchange ${pair[0]} and ${pair[1]} throughout ${instance.expression}, then evaluate it.`,
    options, correctIndex: options.findIndex((option) => option.errorLabel === null), answer: instance.answer,
    explanation: {
      ruleStatement: "Apply the prescribed two-way operator interchange simultaneously at every occurrence, rebuild the whole expression and then evaluate the transformed expression normally.",
      steps: [
        { label: "Write both replacement directions", expression: `${pair[0]} → ${pair[1]}; ${pair[1]} → ${pair[0]}`, result: "Both directions apply throughout the expression." },
        { label: "Transform the complete expression", expression: instance.expression, result: instance.transformed },
        { label: "Evaluate the transformed expression", expression: instance.transformed, result: instance.answer },
      ],
      conclusion: `Therefore, the transformed value is ${instance.answer}.`,
    },
    proof: { unique: true, solverRoute: "GENERATED_PRESCRIBED_OPERATOR_SWAP_EVALUATION", eligibleCandidateCount: 4, survivingCandidateCount: 1, semanticFingerprint: `OPS-CAND-014:${pairText(pair)}:${instance.transformed}:${instance.answer}` },
    metadata: generatedMetadata(seed, instance.sourceSeed, { swapPair: pairText(pair), scope: "GLOBAL_TOKEN" }),
  };
}

function generate015(seed: number): ApprovedOpsQuestion {
  for (let attempt = 0; attempt < 4000; attempt += 1) {
    const sourceSeed = (seed * 1019 + attempt * 6211 + 310) >>> 0;
    const pairing = DOUBLE_PAIRINGS[int(sourceSeed, 311, 0, DOUBLE_PAIRINGS.length - 1)]!;
    const a = int(sourceSeed, 312, 5, 30);
    const b = int(sourceSeed, 313, 2, 9);
    const c = int(sourceSeed, 314, 5, 25);
    const d = int(sourceSeed, 315, 2, 9);
    const e = int(sourceSeed, 316, 2, 15);
    const expression = `${a} + ${b} × ${c} − ${d} ÷ ${e}`;
    const transformed = swapOperatorPairs(expression, pairing);
    const firstOnly = swapOperatorPairs(expression, [pairing[0]]);
    const secondOnly = swapOperatorPairs(expression, [pairing[1]]);
    const answer = integerAnswer(transformed);
    const firstOnlyAnswer = integerAnswer(firstOnly);
    const secondOnlyAnswer = integerAnswer(secondOnly);
    const originalAnswer = integerAnswer(expression);
    if (!answer || !firstOnlyAnswer || !secondOnlyAnswer || !originalAnswer) continue;
    const options = distinctOptions(answer, [
      { value: firstOnlyAnswer, errorLabel: "APPLIED_ONLY_FIRST_SWAP_PAIR" },
      { value: secondOnlyAnswer, errorLabel: "APPLIED_ONLY_SECOND_SWAP_PAIR" },
      { value: originalAnswer, errorLabel: "APPLIED_NEITHER_SWAP_PAIR" },
    ], seed);
    if (!options) continue;
    return {
      candidateId: "OPS-CAND-015", checkpointId: "OPS-CP-005", seed, locale: "en-IN",
      taskKind: "EVALUATE_AFTER_GIVEN_INTERCHANGE", solveMode: "evaluateAfterSpecifiedDoubleOperatorPairSwap", renderer: "STRUCTURED_TEXT",
      stem: `Interchange ${pairing[0][0]} with ${pairing[0][1]} and ${pairing[1][0]} with ${pairing[1][1]} simultaneously in ${expression}, then evaluate it.`,
      options, correctIndex: options.findIndex((option) => option.errorLabel === null), answer,
      explanation: {
        ruleStatement: "Apply both disjoint operator-pair interchanges to the original expression at the same time; using only one pair creates a different and incorrect transformed expression.",
        steps: [
          { label: "Write all four replacement directions", expression: `${pairing[0][0]} → ${pairing[0][1]}; ${pairing[0][1]} → ${pairing[0][0]}; ${pairing[1][0]} → ${pairing[1][1]}; ${pairing[1][1]} → ${pairing[1][0]}`, result: "Both pairs are applied simultaneously." },
          { label: "Transform the original expression", expression, result: transformed },
          { label: "Evaluate the transformed expression", expression: transformed, result: answer },
        ],
        conclusion: `Therefore, the transformed value is ${answer}.`,
      },
      proof: { unique: true, solverRoute: "GENERATED_PRESCRIBED_DOUBLE_OPERATOR_SWAP", eligibleCandidateCount: 4, survivingCandidateCount: 1, semanticFingerprint: `OPS-CAND-015:${expression}:${transformed}:${answer}` },
      metadata: generatedMetadata(seed, sourceSeed, { doublePairInterchange: true }),
    };
  }
  throw new Error(`OPS-CAND-015 could not build seed ${seed}.`);
}

function doublePairLabel(pairing: readonly [OperatorPair, OperatorPair]): string {
  return `${pairText(pairing[0])}; ${pairText(pairing[1])}`;
}

function generate017(seed: number): ApprovedOpsQuestion {
  for (let attempt = 0; attempt < 8000; attempt += 1) {
    const sourceSeed = (seed * 1021 + attempt * 6221 + 330) >>> 0;
    const intended = DOUBLE_PAIRINGS[int(sourceSeed, 331, 0, DOUBLE_PAIRINGS.length - 1)]!;
    const a = int(sourceSeed, 332, 8, 35);
    const b = int(sourceSeed, 333, 2, 9);
    const c = int(sourceSeed, 334, 5, 24);
    const d = int(sourceSeed, 335, 2, 9);
    const e = int(sourceSeed, 336, 2, 12);
    const trueExpression = `${a} + ${b} × ${c} − ${d} ÷ ${e}`;
    const result = integerAnswer(trueExpression);
    if (!result) continue;
    const trueEquation = `${trueExpression} = ${result}`;
    const printedEquation = swapOperatorPairs(trueEquation, intended);
    const doubleSurvivors = DOUBLE_PAIRINGS.filter((pairing) => relationIsTrue(swapOperatorPairs(printedEquation, pairing)));
    const singleSurvivors = OPERATOR_PAIRS.filter((pair) => relationIsTrue(swapOperatorPairs(printedEquation, [pair])));
    if (doubleSurvivors.length !== 1 || doublePairLabel(doubleSurvivors[0]!) !== doublePairLabel(intended) || singleSurvivors.length !== 0) continue;
    const answer = doublePairLabel(intended);
    const optionValues = rotate([...DOUBLE_PAIRINGS.map(doublePairLabel), "Only one pair is required"], seed);
    const options: OpsPilotOption[] = optionValues.map((value) => ({ value, errorLabel: value === answer ? null : value === "Only one pair is required" ? "INCORRECTLY_ASSUMED_SINGLE_PAIR_REPAIR" : "WRONG_DOUBLE_PAIRING" }));
    return {
      candidateId: "OPS-CAND-017", checkpointId: "OPS-CP-005", seed, locale: "en-IN",
      taskKind: "IDENTIFY_TWO_OPERATOR_PAIRS_TO_SWAP", solveMode: "identifyTwoOperatorPairSwapsForEquation", renderer: "TABLE_OR_GRID",
      stem: `Which two operator pairs must be interchanged simultaneously to make ${printedEquation} correct?`,
      options, correctIndex: options.findIndex((option) => option.errorLabel === null), answer,
      explanation: {
        ruleStatement: "Test the three complete disjoint double-pair interchanges against the original equation and also exclude every simpler single-pair repair before accepting a two-pair answer.",
        steps: [
          { label: "Write both interchange pairs", expression: answer.replaceAll("↔", "→"), result: "All four operator identities change simultaneously." },
          { label: "Transform and rebuild the equation", expression: printedEquation, result: trueEquation },
          { label: "Establish uniqueness", expression: "Three double pairings and all six single pairs were tested.", result: `Only ${answer} repairs the equation and no single pair does.` },
        ],
        conclusion: `Therefore, ${answer} is the required double interchange.`,
      },
      proof: { unique: true, solverRoute: "GENERATED_ENUMERATE_DOUBLE_AND_SINGLE_OPERATOR_REPAIRS", eligibleCandidateCount: 9, survivingCandidateCount: 1, semanticFingerprint: `OPS-CAND-017:${printedEquation}:${answer}` },
      metadata: generatedMetadata(seed, sourceSeed, { noSinglePairRepair: true, completeDoublePairPoolVerified: true }),
    };
  }
  throw new Error(`OPS-CAND-017 could not build a unique double-pair repair for seed ${seed}.`);
}

function generate019(seed: number): ApprovedOpsQuestion {
  const pair = OPERATOR_PAIRS[int(seed, 350, 0, OPERATOR_PAIRS.length - 1)]!;
  const instance = buildPrescribedSwapInstance(seed, 360, pair);
  const rightValues = [instance.answer, instance.originalAnswer, instance.wrongPairAnswer, String(Number(instance.answer) + 1)];
  if (new Set(rightValues).size !== 4) return generate019(seed + 100003);
  const answer = `${instance.expression} = ${instance.answer}`;
  const options: OpsPilotOption[] = rotate(rightValues.map((value) => ({ value: `${instance.expression} = ${value}`, errorLabel: value === instance.answer ? null : "FALSE_AFTER_PRESCRIBED_OPERATOR_SWAP" })), seed);
  return {
    candidateId: "OPS-CAND-019", checkpointId: "OPS-CP-005", seed, locale: "en-IN",
    taskKind: "IDENTIFY_CORRECT_EQUATION_AFTER_INTERCHANGE", solveMode: "selectEquationByTruthAfterSpecifiedOperatorSwap", renderer: "TABLE_OR_GRID",
    stem: `After interchanging ${pair[0]} and ${pair[1]} in every option, select the true equation.`,
    options, correctIndex: options.findIndex((option) => option.errorLabel === null), answer,
    explanation: {
      ruleStatement: "Apply the same two-way operator interchange to the complete left-hand expression in every option, calculate the transformed value once and select its matching equation.",
      steps: [
        { label: "Write both replacement directions", expression: `${pair[0]} → ${pair[1]}; ${pair[1]} → ${pair[0]}`, result: "Use the same interchange in every option." },
        { label: "Transform the common expression", expression: instance.expression, result: instance.transformed },
        { label: "Select the matching equation", expression: `${instance.transformed} = ${instance.answer}`, result: answer },
      ],
      conclusion: `Hence, ${answer} is the only true equation.`,
    },
    proof: { unique: true, solverRoute: "GENERATED_PRESCRIBED_OPERATOR_SWAP_OPTION_TRUTH", eligibleCandidateCount: 4, survivingCandidateCount: 1, semanticFingerprint: `OPS-CAND-019:${pairText(pair)}:${instance.expression}:${instance.answer}` },
    metadata: generatedMetadata(seed, instance.sourceSeed, { optionTopology: "EQUATION_OPTIONS" }),
  };
}

function buildWholeNumberSwapInstance(seed: number, salt: number) {
  for (let attempt = 0; attempt < 3000; attempt += 1) {
    const sourceSeed = (seed * 1031 + attempt * 6247 + salt) >>> 0;
    const a = int(sourceSeed, salt + 1, 12, 48);
    const b = int(sourceSeed, salt + 2, 2, 11);
    const c = int(sourceSeed, salt + 3, 2, 15);
    if (new Set([a, b, c]).size !== 3) continue;
    const expression = `${a} + ${b} × ${c}`;
    const pair = [String(a), String(b)] as const;
    const transformed = swapWholeNumbers(expression, pair[0], pair[1]);
    const answer = integerAnswer(transformed);
    const originalAnswer = integerAnswer(expression);
    const alternate = integerAnswer(swapWholeNumbers(expression, String(a), String(c)));
    if (!answer || !originalAnswer || !alternate || new Set([answer, originalAnswer, alternate]).size !== 3) continue;
    return { expression, pair, transformed, answer, originalAnswer, alternate, sourceSeed };
  }
  throw new Error(`OPS whole-number swap could not build seed ${seed}.`);
}

function generate021(seed: number): ApprovedOpsQuestion {
  const instance = buildWholeNumberSwapInstance(seed, 380);
  const options = distinctOptions(instance.answer, [
    { value: instance.originalAnswer, errorLabel: "WHOLE_NUMBER_SWAP_NOT_APPLIED" },
    { value: instance.alternate, errorLabel: "WRONG_WHOLE_NUMBER_PAIR" },
    { value: String(Number(instance.answer) + 1), errorLabel: "ARITHMETIC_AFTER_SWAP_ERROR" },
  ], seed)!;
  return {
    candidateId: "OPS-CAND-021", checkpointId: "OPS-CP-006", seed, locale: "en-IN",
    taskKind: "EVALUATE_AFTER_GIVEN_INTERCHANGE", solveMode: "evaluateAfterSpecifiedWholeNumberSwap", renderer: "STRUCTURED_TEXT",
    stem: `Interchange the complete numbers ${instance.pair[0]} and ${instance.pair[1]} in ${instance.expression}, then evaluate it.`,
    options, correctIndex: options.findIndex((option) => option.errorLabel === null), answer: instance.answer,
    explanation: {
      ruleStatement: "Interchange the two complete number tokens everywhere they occur, without changing individual digits inside any other number, and then evaluate the transformed expression.",
      steps: [
        { label: "Write both complete-number replacements", expression: `${instance.pair[0]} → ${instance.pair[1]}; ${instance.pair[1]} → ${instance.pair[0]}`, result: "Only the complete matching numbers change." },
        { label: "Transform the expression", expression: instance.expression, result: instance.transformed },
        { label: "Evaluate the transformed expression", expression: instance.transformed, result: instance.answer },
      ],
      conclusion: `Therefore, the transformed value is ${instance.answer}.`,
    },
    proof: { unique: true, solverRoute: "GENERATED_PRESCRIBED_WHOLE_NUMBER_SWAP", eligibleCandidateCount: 4, survivingCandidateCount: 1, semanticFingerprint: `OPS-CAND-021:${instance.expression}:${instance.pair.join("<->")}:${instance.answer}` },
    metadata: generatedMetadata(seed, instance.sourceSeed, { numberIdentity: "COMPLETE_TOKEN" }),
  };
}

function generate022(seed: number): ApprovedOpsQuestion {
  const instance = buildWholeNumberSwapInstance(seed, 400);
  const rightValues = [instance.answer, instance.originalAnswer, instance.alternate, String(Number(instance.answer) + 1)];
  if (new Set(rightValues).size !== 4) return generate022(seed + 100019);
  const answer = `${instance.expression} = ${instance.answer}`;
  const options: OpsPilotOption[] = rotate(rightValues.map((value) => ({ value: `${instance.expression} = ${value}`, errorLabel: value === instance.answer ? null : "FALSE_AFTER_WHOLE_NUMBER_SWAP" })), seed);
  return {
    candidateId: "OPS-CAND-022", checkpointId: "OPS-CP-006", seed, locale: "en-IN",
    taskKind: "IDENTIFY_CORRECT_EQUATION_AFTER_INTERCHANGE", solveMode: "selectEquationByTruthAfterSpecifiedWholeNumberSwap", renderer: "TABLE_OR_GRID",
    stem: `After interchanging the complete numbers ${instance.pair[0]} and ${instance.pair[1]} in every option, select the true equation.`,
    options, correctIndex: options.findIndex((option) => option.errorLabel === null), answer,
    explanation: {
      ruleStatement: "Apply the prescribed complete-number interchange to the common expression in every option, preserving digits inside other numbers, then select the equation with the matching value.",
      steps: [
        { label: "Write the complete-number interchange", expression: `${instance.pair[0]} → ${instance.pair[1]}; ${instance.pair[1]} → ${instance.pair[0]}`, result: "Use this two-way change in every option." },
        { label: "Transform the common expression", expression: instance.expression, result: instance.transformed },
        { label: "Select the matching equation", expression: `${instance.transformed} = ${instance.answer}`, result: answer },
      ],
      conclusion: `Hence, ${answer} is the only true equation.`,
    },
    proof: { unique: true, solverRoute: "GENERATED_PRESCRIBED_WHOLE_NUMBER_SWAP_OPTION_TRUTH", eligibleCandidateCount: 4, survivingCandidateCount: 1, semanticFingerprint: `OPS-CAND-022:${instance.expression}:${instance.pair.join("<->")}:${instance.answer}` },
    metadata: generatedMetadata(seed, instance.sourceSeed, { optionTopology: "EQUATION_OPTIONS", numberIdentity: "COMPLETE_TOKEN" }),
  };
}

function digitPairs(statement: string): readonly (readonly [string, string])[] {
  const digits = [...new Set(statement.match(/\d/gu) ?? [])].filter((digit) => digit !== "0").sort();
  const pairs: Array<readonly [string, string]> = [];
  for (let left = 0; left < digits.length; left += 1) {
    for (let right = left + 1; right < digits.length; right += 1) pairs.push([digits[left]!, digits[right]!] as const);
  }
  return pairs;
}

function generate023(seed: number): ApprovedOpsQuestion {
  for (let attempt = 0; attempt < 10000; attempt += 1) {
    const sourceSeed = (seed * 1033 + attempt * 6263 + 420) >>> 0;
    const tens = int(sourceSeed, 421, 2, 8);
    const units = int(sourceSeed, 422, 1, 9);
    const addend = int(sourceSeed, 423, 1, 9);
    if (new Set([String(tens), String(units), String(addend)]).size < 3) continue;
    const left = tens * 10 + units;
    const result = left + addend;
    const trueEquation = `${left} + ${addend} = ${result}`;
    const pair = [String(units), String(addend)] as const;
    const printed = swapDigits(trueEquation, pair[0], pair[1]);
    if (printed === trueEquation) continue;
    const candidates = digitPairs(printed);
    const survivors = candidates.filter((candidate) => relationIsTrue(swapDigits(printed, candidate[0], candidate[1])));
    if (survivors.length !== 1 || survivors[0]![0] !== pair[0] || survivors[0]![1] !== pair[1]) continue;
    const wrong = candidates.filter((candidate) => candidate[0] !== pair[0] || candidate[1] !== pair[1]).slice(0, 3);
    if (wrong.length < 3) continue;
    const answer = `${pair[0]} ↔ ${pair[1]}`;
    const options: OpsPilotOption[] = rotate([{ value: answer, errorLabel: null }, ...wrong.map((candidate) => ({ value: `${candidate[0]} ↔ ${candidate[1]}`, errorLabel: "WRONG_DIGIT_IDENTITY_PAIR" }))], seed);
    return {
      candidateId: "OPS-CAND-023", checkpointId: "OPS-CP-007", seed, locale: "en-IN",
      taskKind: "IDENTIFY_DIGIT_PAIR_TO_SWAP", solveMode: "identifyGlobalDigitPairSwapForEquation", renderer: "TABLE_OR_GRID",
      stem: `Which two digits must be interchanged globally to make ${printed} correct?`,
      options, correctIndex: options.findIndex((option) => option.errorLabel === null), answer,
      explanation: {
        ruleStatement: "Interchange the two digit identities globally, rebuild every affected numeral and accept a pair only when the complete transformed equation becomes uniquely true.",
        steps: [
          { label: "Write both digit replacements", expression: `${pair[0]} → ${pair[1]}; ${pair[1]} → ${pair[0]}`, result: "Every occurrence of both digits changes." },
          { label: "Rebuild the complete equation", expression: printed, result: trueEquation },
          { label: "Establish uniqueness", expression: `${candidates.length} visible digit pairs were tested.`, result: `Only ${answer} makes the equation true.` },
        ],
        conclusion: `Therefore, digits ${pair[0]} and ${pair[1]} must be interchanged.`,
      },
      proof: { unique: true, solverRoute: "GENERATED_ENUMERATE_GLOBAL_DIGIT_IDENTITY_PAIRS", eligibleCandidateCount: candidates.length, survivingCandidateCount: 1, semanticFingerprint: `OPS-CAND-023:${printed}:${answer}` },
      metadata: generatedMetadata(seed, sourceSeed, { digitScope: "GLOBAL_IDENTITY", leadingZeroPolicy: "REJECT" }),
    };
  }
  throw new Error(`OPS-CAND-023 could not build a unique digit-repair question for seed ${seed}.`);
}

function buildDigitSwapInstance(seed: number, salt: number) {
  for (let attempt = 0; attempt < 5000; attempt += 1) {
    const sourceSeed = (seed * 1039 + attempt * 6271 + salt) >>> 0;
    const tens = int(sourceSeed, salt + 1, 2, 8);
    const units = int(sourceSeed, salt + 2, 1, 9);
    const other = int(sourceSeed, salt + 3, 1, 9);
    if (new Set([String(tens), String(units), String(other)]).size < 3) continue;
    const expression = `${tens}${units} + ${other} × ${int(sourceSeed, salt + 4, 2, 7)}`;
    const pair = [String(units), String(other)] as const;
    const transformed = swapDigits(expression, pair[0], pair[1]);
    const answer = integerAnswer(transformed);
    const originalAnswer = integerAnswer(expression);
    const alternatePair = [String(tens), String(other)] as const;
    const alternate = integerAnswer(swapDigits(expression, alternatePair[0], alternatePair[1]));
    if (!answer || !originalAnswer || !alternate || new Set([answer, originalAnswer, alternate]).size !== 3) continue;
    return { expression, pair, transformed, answer, originalAnswer, alternate, sourceSeed };
  }
  throw new Error(`OPS digit-swap runtime could not build seed ${seed}.`);
}

function generate024(seed: number): ApprovedOpsQuestion {
  const instance = buildDigitSwapInstance(seed, 450);
  const options = distinctOptions(instance.answer, [
    { value: instance.originalAnswer, errorLabel: "DIGIT_INTERCHANGE_NOT_APPLIED" },
    { value: instance.alternate, errorLabel: "WRONG_DIGIT_PAIR_INTERCHANGED" },
    { value: String(Number(instance.answer) + 1), errorLabel: "ARITHMETIC_AFTER_DIGIT_SWAP_ERROR" },
  ], seed)!;
  return {
    candidateId: "OPS-CAND-024", checkpointId: "OPS-CP-007", seed, locale: "en-IN",
    taskKind: "EVALUATE_AFTER_GIVEN_INTERCHANGE", solveMode: "evaluateAfterSpecifiedGlobalDigitSwap", renderer: "STRUCTURED_TEXT",
    stem: `Interchange digits ${instance.pair[0]} and ${instance.pair[1]} globally in ${instance.expression}, then evaluate it.`,
    options, correctIndex: options.findIndex((option) => option.errorLabel === null), answer: instance.answer,
    explanation: {
      ruleStatement: "Interchange every occurrence of the two digit identities, rebuild all affected multi-digit numbers and then evaluate the resulting expression normally.",
      steps: [
        { label: "Write both digit replacements", expression: `${instance.pair[0]} → ${instance.pair[1]}; ${instance.pair[1]} → ${instance.pair[0]}`, result: "The digit change is global." },
        { label: "Transform and rebuild all numerals", expression: instance.expression, result: instance.transformed },
        { label: "Evaluate the transformed expression", expression: instance.transformed, result: instance.answer },
      ],
      conclusion: `Therefore, the transformed value is ${instance.answer}.`,
    },
    proof: { unique: true, solverRoute: "GENERATED_PRESCRIBED_GLOBAL_DIGIT_SWAP", eligibleCandidateCount: 4, survivingCandidateCount: 1, semanticFingerprint: `OPS-CAND-024:${instance.expression}:${instance.pair.join("<->")}:${instance.answer}` },
    metadata: generatedMetadata(seed, instance.sourceSeed, { digitScope: "GLOBAL_IDENTITY", leadingZeroPolicy: "REJECT" }),
  };
}

function generate025(seed: number): ApprovedOpsQuestion {
  const instance = buildDigitSwapInstance(seed, 470);
  const rightValues = [instance.answer, instance.originalAnswer, instance.alternate, String(Number(instance.answer) + 1)];
  if (new Set(rightValues).size !== 4) return generate025(seed + 100043);
  const answer = `${instance.expression} = ${instance.answer}`;
  const options: OpsPilotOption[] = rotate(rightValues.map((value) => ({ value: `${instance.expression} = ${value}`, errorLabel: value === instance.answer ? null : "FALSE_AFTER_GLOBAL_DIGIT_SWAP" })), seed);
  return {
    candidateId: "OPS-CAND-025", checkpointId: "OPS-CP-007", seed, locale: "en-IN",
    taskKind: "IDENTIFY_CORRECT_EQUATION_AFTER_INTERCHANGE", solveMode: "selectEquationByTruthAfterSpecifiedGlobalDigitSwap", renderer: "TABLE_OR_GRID",
    stem: `After interchanging digits ${instance.pair[0]} and ${instance.pair[1]} globally in every option, select the true equation.`,
    options, correctIndex: options.findIndex((option) => option.errorLabel === null), answer,
    explanation: {
      ruleStatement: "Apply the same global digit-identity interchange to every numeral in the common option expression, rebuild the numerals and select the one matching result.",
      steps: [
        { label: "Write both digit replacements", expression: `${instance.pair[0]} → ${instance.pair[1]}; ${instance.pair[1]} → ${instance.pair[0]}`, result: "Use these replacements in every option." },
        { label: "Transform the common option expression", expression: instance.expression, result: instance.transformed },
        { label: "Select the matching equation", expression: `${instance.transformed} = ${instance.answer}`, result: answer },
      ],
      conclusion: `Hence, ${answer} is the only true equation.`,
    },
    proof: { unique: true, solverRoute: "GENERATED_PRESCRIBED_DIGIT_SWAP_OPTION_TRUTH", eligibleCandidateCount: 4, survivingCandidateCount: 1, semanticFingerprint: `OPS-CAND-025:${instance.expression}:${instance.pair.join("<->")}:${instance.answer}` },
    metadata: generatedMetadata(seed, instance.sourceSeed, { optionTopology: "EQUATION_OPTIONS", digitScope: "GLOBAL_IDENTITY" }),
  };
}

function hiddenMappingInstance(seed: number, salt: number) {
  for (let attempt = 0; attempt < 2000; attempt += 1) {
    const sourceSeed = (seed * 1049 + attempt * 6287 + salt) >>> 0;
    const x = int(sourceSeed, salt + 1, 8, 80);
    const y = int(sourceSeed, salt + 2, 2, Math.min(25, x - 2));
    const p = int(sourceSeed, salt + 3, 6, 60);
    const q = int(sourceSeed, salt + 4, 2, Math.min(20, p - 1));
    const mResult = x + y;
    const nResult = p - q;
    const targetA = int(sourceSeed, salt + 5, 5, 45);
    const targetB = int(sourceSeed, salt + 6, 2, 20);
    const targetC = int(sourceSeed, salt + 7, 1, 15);
    const target = `${targetA} M ${targetB} N ${targetC}`;
    const transformed = `${targetA} + ${targetB} − ${targetC}`;
    const answer = integerAnswer(transformed);
    if (!answer) continue;
    return { x, y, p, q, mResult, nResult, target, transformed, answer, sourceSeed };
  }
  throw new Error(`OPS hidden mapping runtime could not build seed ${seed}.`);
}

function generate030(seed: number): ApprovedOpsQuestion {
  const instance = hiddenMappingInstance(seed, 500);
  const answerN = Number(instance.answer);
  const wrongValues = [String(answerN + 1), String(answerN - 1), String(-answerN)];
  const options: OpsPilotOption[] = rotate([{ value: instance.answer, errorLabel: null },
    { value: wrongValues[0]!, errorLabel: "ARITHMETIC_AFTER_INFERENCE_ERROR" },
    { value: wrongValues[1]!, errorLabel: "MISREAD_ONE_HIDDEN_OPERATOR" },
    { value: wrongValues[2]!, errorLabel: "SIGN_ERROR_AFTER_INFERENCE" }], seed);
  return {
    candidateId: "OPS-CAND-030", checkpointId: "OPS-CP-009", seed, locale: "en-IN",
    taskKind: "INFER_MAPPING_AND_EVALUATE_TARGET", solveMode: "inferArithmeticOperatorMappingThenEvaluateTarget", renderer: "STRUCTURED_TEXT",
    stem: `M and N each represent one of +, −, × and ÷. Given ${instance.x} M ${instance.y} = ${instance.mResult} and ${instance.p} N ${instance.q} = ${instance.nResult}, evaluate ${instance.target}.`,
    options, correctIndex: options.findIndex((option) => option.errorLabel === null), answer: instance.answer,
    explanation: {
      ruleStatement: "Infer one unique arithmetic meaning for M and N from the complete evidence, substitute those meanings into the target and only then evaluate the transformed expression.",
      steps: [
        { label: "Find the meaning of M", expression: `${instance.x} M ${instance.y} = ${instance.mResult}`, result: `${instance.x} + ${instance.y} = ${instance.mResult}, so M means +.` },
        { label: "Find the meaning of N", expression: `${instance.p} N ${instance.q} = ${instance.nResult}`, result: `${instance.p} − ${instance.q} = ${instance.nResult}, so N means −.` },
        { label: "Transform and evaluate the target", expression: instance.target, result: `${instance.transformed} = ${instance.answer}` },
      ],
      conclusion: `Therefore, the target value is ${instance.answer}.`,
    },
    proof: { unique: true, solverRoute: "GENERATED_INFER_BIJECTIVE_ARITHMETIC_MAPPING", eligibleCandidateCount: 2, survivingCandidateCount: 1, semanticFingerprint: `OPS-CAND-030:${instance.x}:${instance.y}:${instance.p}:${instance.q}:${instance.target}:${instance.answer}` },
    metadata: generatedMetadata(seed, instance.sourceSeed, { evidenceCount: 2, inferredMappingCount: 1 }),
  };
}

function generate032(seed: number): ApprovedOpsQuestion {
  const instance = hiddenMappingInstance(seed, 530);
  const answer = `${instance.target} = ${instance.answer}`;
  const answerN = Number(instance.answer);
  const values = [instance.answer, String(answerN + 1), String(answerN - 1), String(-answerN)];
  const options: OpsPilotOption[] = rotate(values.map((value) => ({ value: `${instance.target} = ${value}`, errorLabel: value === instance.answer ? null : "FALSE_AFTER_INFERRED_MAPPING" })), seed);
  return {
    candidateId: "OPS-CAND-032", checkpointId: "OPS-CP-009", seed, locale: "en-IN",
    taskKind: "INFER_MAPPING_AND_IDENTIFY_TRUE_STATEMENT", solveMode: "inferOperatorMappingThenSelectEquationByTruth", renderer: "TABLE_OR_GRID",
    stem: `M and N each represent one of +, −, × and ÷. Given ${instance.x} M ${instance.y} = ${instance.mResult} and ${instance.p} N ${instance.q} = ${instance.nResult}, infer M and N, then select the true target equation.`,
    options, correctIndex: options.findIndex((option) => option.errorLabel === null), answer,
    explanation: {
      ruleStatement: "Infer the two hidden operator meanings from all evidence, transform the common target expression once and select the equation whose right-hand side matches its value.",
      steps: [
        { label: "Infer M", expression: `${instance.x} M ${instance.y} = ${instance.mResult}`, result: `M means + because ${instance.x} + ${instance.y} = ${instance.mResult}.` },
        { label: "Infer N", expression: `${instance.p} N ${instance.q} = ${instance.nResult}`, result: `N means − because ${instance.p} − ${instance.q} = ${instance.nResult}.` },
        { label: "Select the matching target equation", expression: `${instance.transformed} = ${instance.answer}`, result: answer },
      ],
      conclusion: `Hence, ${answer} is the correct target equation.`,
    },
    proof: { unique: true, solverRoute: "GENERATED_HIDDEN_MAPPING_OPTION_TRUTH", eligibleCandidateCount: 4, survivingCandidateCount: 1, semanticFingerprint: `OPS-CAND-032:${instance.x}:${instance.y}:${instance.p}:${instance.q}:${instance.target}:${instance.answer}` },
    metadata: generatedMetadata(seed, instance.sourceSeed, { optionTopology: "EQUATION_OPTIONS", evidenceCount: 2 }),
  };
}

function buildCompoundInstance(seed: number): CompoundInstance {
  for (let attempt = 0; attempt < 4000; attempt += 1) {
    const sourceSeed = (seed * 1009 + attempt * 9176 + 37) >>> 0;
    const a = int(sourceSeed, 1, 6, 28);
    const b = int(sourceSeed, 2, 2, 12);
    const c = int(sourceSeed, 3, 6, 28);
    const d = int(sourceSeed, 4, 2, 12);
    const e = int(sourceSeed, 5, 2, 20);
    if (new Set([a, b, c, d, e]).size !== 5) continue;

    const operatorPair = OPERATOR_PAIRS[int(sourceSeed, 6, 0, OPERATOR_PAIRS.length - 1)]!;
    const numberPair = [String(a), String(c)] as const;
    const expression = `${a} × ${b} + ${c} ÷ ${d} − ${e}`;
    const operatorOnlyExpression = swapOperatorPairs(expression, [operatorPair]);
    const numberOnlyExpression = swapWholeNumbers(expression, numberPair[0], numberPair[1]);
    const transformedExpression = swapWholeNumbers(operatorOnlyExpression, numberPair[0], numberPair[1]);

    const originalAnswer = integerAnswer(expression);
    const operatorOnlyAnswer = integerAnswer(operatorOnlyExpression);
    const numberOnlyAnswer = integerAnswer(numberOnlyExpression);
    const answer = integerAnswer(transformedExpression);
    if (!originalAnswer || !operatorOnlyAnswer || !numberOnlyAnswer || !answer) continue;
    if (new Set([answer, operatorOnlyAnswer, numberOnlyAnswer, originalAnswer]).size !== 4) continue;
    return { expression, operatorPair, numberPair, operatorOnlyExpression, numberOnlyExpression, transformedExpression, originalAnswer, operatorOnlyAnswer, numberOnlyAnswer, answer, sourceSeed };
  }
  throw new Error(`OPS compound runtime could not build a safe misconception-separated instance for seed ${seed}.`);
}

function commonSteps(instance: CompoundInstance): readonly TeachingStep[] {
  return [
    { label: "Write both operator replacements", expression: `${instance.operatorPair[0]} → ${instance.operatorPair[1]}; ${instance.operatorPair[1]} → ${instance.operatorPair[0]}`, result: "Both operators occur in the original expression and are interchanged simultaneously." },
    { label: "Write both complete-number replacements", expression: `${instance.numberPair[0]} → ${instance.numberPair[1]}; ${instance.numberPair[1]} → ${instance.numberPair[0]}`, result: "Only complete number tokens are exchanged; digits inside other numbers are unchanged." },
    { label: "Apply both changes to the original expression", expression: instance.expression, result: instance.transformedExpression },
    ...arithmeticTrace(instance.transformedExpression).steps,
  ];
}

function numericOptions(instance: CompoundInstance, seed: number): readonly OpsPilotOption[] {
  return rotate([
    { value: instance.answer, errorLabel: null },
    { value: instance.operatorOnlyAnswer, errorLabel: "APPLIED_OPERATOR_SWAP_ONLY" },
    { value: instance.numberOnlyAnswer, errorLabel: "APPLIED_NUMBER_SWAP_ONLY" },
    { value: instance.originalAnswer, errorLabel: "IGNORED_BOTH_INTERCHANGES" },
  ], seed);
}

function generate028(seed: number): ApprovedOpsQuestion {
  const instance = buildCompoundInstance(seed);
  const options = numericOptions(instance, seed);
  return {
    candidateId: "OPS-CAND-028", checkpointId: "OPS-CP-008", seed, locale: "en-IN",
    taskKind: "EVALUATE_AFTER_GIVEN_INTERCHANGE", solveMode: "evaluateAfterSpecifiedCompoundSwap", renderer: "STRUCTURED_TEXT",
    stem: `Interchange ${instance.operatorPair[0]} and ${instance.operatorPair[1]}, and interchange the complete numbers ${instance.numberPair[0]} and ${instance.numberPair[1]}, throughout ${instance.expression}. What is the resulting value?`,
    options, correctIndex: options.findIndex((option) => option.errorLabel === null), answer: instance.answer,
    explanation: { ruleStatement: "Apply the prescribed two-way operator interchange and complete-number interchange to the same original expression, then complete multiplication and division before addition and subtraction.", steps: commonSteps(instance), conclusion: `Therefore, the resulting value is ${instance.answer}.` },
    proof: { unique: true, solverRoute: "GENERATED_PRESCRIBED_OPERATOR_AND_WHOLE_NUMBER_TRANSFORMATION", eligibleCandidateCount: 4, survivingCandidateCount: 1, semanticFingerprint: `OPS-CAND-028:${instance.operatorPair.join("<->")}:${instance.numberPair.join("<->")}:${instance.transformedExpression}:${instance.answer}` },
    metadata: generatedMetadata(seed, instance.sourceSeed, { compoundSubtype: "OPERATOR_AND_WHOLE_NUMBER", bothOperatorsVisible: true, bothWholeNumbersVisible: true, misconceptionDistractorsGrounded: true, distractorModelCount: 3, generatedCompoundState: true }),
  };
}

function generate029(seed: number): ApprovedOpsQuestion {
  const instance = buildCompoundInstance(seed);
  const printedAnswer = `${instance.expression} = ${instance.answer}`;
  const rightSides: readonly { value: string; errorLabel: string | null }[] = [
    { value: instance.answer, errorLabel: null },
    { value: instance.operatorOnlyAnswer, errorLabel: "APPLIED_OPERATOR_SWAP_ONLY" },
    { value: instance.numberOnlyAnswer, errorLabel: "APPLIED_NUMBER_SWAP_ONLY" },
    { value: instance.originalAnswer, errorLabel: "IGNORED_BOTH_INTERCHANGES" },
  ];
  const options: OpsPilotOption[] = rotate(rightSides, seed).map((entry) => ({ value: `${instance.expression} = ${entry.value}`, errorLabel: entry.errorLabel }));
  const transformedEquation = `${instance.transformedExpression} = ${instance.answer}`;
  const relation = relationTrace(transformedEquation);
  return {
    candidateId: "OPS-CAND-029", checkpointId: "OPS-CP-008", seed, locale: "en-IN",
    taskKind: "IDENTIFY_CORRECT_EQUATION_AFTER_INTERCHANGE", solveMode: "selectEquationByTruthAfterSpecifiedCompoundSwap", renderer: "TABLE_OR_GRID",
    stem: `After interchanging ${instance.operatorPair[0]} with ${instance.operatorPair[1]} and the complete numbers ${instance.numberPair[0]} with ${instance.numberPair[1]} in every option, select the true equation.`,
    options, correctIndex: options.findIndex((option) => option.errorLabel === null), answer: printedAnswer,
    explanation: { ruleStatement: "Apply the full prescribed operator-and-complete-number transformation independently to every printed equation, calculate the transformed left side and select the unique matching right-hand side.", steps: [...commonSteps(instance), { label: "Compare the transformed value with the option right-hand sides", expression: transformedEquation, result: `The transformed equation is ${relation.truth ? "true" : "false"}; only the option ending in ${instance.answer} matches.` }], conclusion: `Hence, ${printedAnswer} is the correct printed option.` },
    proof: { unique: true, solverRoute: "GENERATED_PRESCRIBED_COMPOUND_OPTION_TRUTH", eligibleCandidateCount: 4, survivingCandidateCount: 1, semanticFingerprint: `OPS-CAND-029:${instance.operatorPair.join("<->")}:${instance.numberPair.join("<->")}:${transformedEquation}` },
    metadata: generatedMetadata(seed, instance.sourceSeed, { compoundSubtype: "OPERATOR_AND_WHOLE_NUMBER", optionTopology: "EQUATION_OPTIONS", bothOperatorsVisible: true, bothWholeNumbersVisible: true, misconceptionDistractorsGrounded: true, distractorModelCount: 3, generatedCompoundState: true }),
  };
}

export function generateApprovedOpsQuestion(candidateId: OpsApprovedCandidateId, seed: number): ApprovedOpsQuestion {
  if (!Number.isInteger(seed) || seed < 0) throw new Error(`Approved runtime seed must be a non-negative integer; received ${seed}.`);
  switch (candidateId) {
    case "OPS-CAND-001": return generate001(seed);
    case "OPS-CAND-003": return generate003(seed);
    case "OPS-CAND-004": return generate004(seed);
    case "OPS-CAND-005": return generate005(seed);
    case "OPS-CAND-007": return generate007(seed);
    case "OPS-CAND-008": return generate008(seed);
    case "OPS-CAND-009": return generate009(seed);
    case "OPS-CAND-011": return generate011(seed);
    case "OPS-CAND-014": return generate014(seed);
    case "OPS-CAND-015": return generate015(seed);
    case "OPS-CAND-017": return generate017(seed);
    case "OPS-CAND-019": return generate019(seed);
    case "OPS-CAND-021": return generate021(seed);
    case "OPS-CAND-022": return generate022(seed);
    case "OPS-CAND-023": return generate023(seed);
    case "OPS-CAND-024": return generate024(seed);
    case "OPS-CAND-025": return generate025(seed);
    case "OPS-CAND-028": return generate028(seed);
    case "OPS-CAND-029": return generate029(seed);
    case "OPS-CAND-030": return generate030(seed);
    case "OPS-CAND-032": return generate032(seed);
    default: return generateEntryQuestion(candidateId, seed);
  }
}

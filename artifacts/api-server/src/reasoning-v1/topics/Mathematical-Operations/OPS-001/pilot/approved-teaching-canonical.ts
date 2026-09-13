import {
  OPS_APPROVED_CANDIDATE_IDS,
  generateApprovedOpsQuestion as generateEntryQuestion,
  type ApprovedOpsQuestion,
  type OpsApprovedCandidateId,
} from "./approved-teaching-entry";
import {
  arithmeticTrace,
  relationTrace,
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
    if (!Number.isSafeInteger(numeric) || Math.abs(numeric) > 5000) return null;
    return value;
  } catch {
    return null;
  }
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
  readonly reversedAnswer: string;
  readonly mapping: readonly (readonly [string, string])[];
  readonly sourceSeed: number;
} {
  for (let attempt = 0; attempt < 3000; attempt += 1) {
    const sourceSeed = (seed * 1009 + attempt * 7919 + salt) >>> 0;
    const a = int(sourceSeed, salt + 1, 4, 28);
    const b = int(sourceSeed, salt + 2, 2, 11);
    const c = int(sourceSeed, salt + 3, 2, 14);
    const mapping = [
      [displayTokens[0], semanticTokens[0]],
      [displayTokens[1], semanticTokens[1]],
    ] as const;
    const expression = `${a} ${displayTokens[0]} ${b} ${displayTokens[1]} ${c}`;
    const transformed = replaceTokens(expression, mapping);
    const firstOnly = replaceTokens(expression, [mapping[0]]);
    const reversed = replaceTokens(expression, [
      [displayTokens[0], semanticTokens[1]],
      [displayTokens[1], semanticTokens[0]],
    ]);
    const answer = integerAnswer(transformed);
    const ordinaryAnswer = integerAnswer(
      replaceTokens(expression, [
        [displayTokens[0], displayTokens[0] === "+" || displayTokens[0] === "−" || displayTokens[0] === "×" || displayTokens[0] === "÷" ? displayTokens[0] : "+"],
        [displayTokens[1], displayTokens[1] === "+" || displayTokens[1] === "−" || displayTokens[1] === "×" || displayTokens[1] === "÷" ? displayTokens[1] : "×"],
      ]),
    );
    const firstOnlyAnswer = integerAnswer(firstOnly);
    const reversedAnswer = integerAnswer(reversed);
    if (!answer || !ordinaryAnswer || !firstOnlyAnswer || !reversedAnswer) continue;
    if (new Set([answer, ordinaryAnswer, firstOnlyAnswer, reversedAnswer]).size !== 4) continue;
    return {
      expression,
      transformed,
      answer,
      ordinaryAnswer,
      firstOnlyAnswer,
      reversedAnswer,
      mapping,
      sourceSeed,
    };
  }
  throw new Error(`OPS mapped runtime could not build a misconception-separated instance for seed ${seed}.`);
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
    { value: instance.reversedAnswer, errorLabel: "REVERSED_MAPPING_MEANINGS" },
  ], seed)!;
  return {
    candidateId: "OPS-CAND-001",
    checkpointId: "OPS-CP-001",
    seed,
    locale: "en-IN",
    taskKind: "EVALUATE_AFTER_GIVEN_MAPPING",
    solveMode: "evaluateAfterGivenArithmeticSignMapping",
    renderer: "STRUCTURED_TEXT",
    stem: `If ${mappingKey(instance.mapping)}, evaluate ${instance.expression}.`,
    options,
    correctIndex: options.findIndex((option) => option.errorLabel === null),
    answer: instance.answer,
    explanation: {
      ruleStatement: "Replace every displayed sign by its supplied arithmetic meaning before calculating; do not use the printed sign meanings until the complete mapping has been applied.",
      steps: [
        { label: "Read the replacement key", expression: mappingKey(instance.mapping), result: "Use the stated meanings for every occurrence." },
        { label: "Apply the complete replacement", expression: instance.expression, result: instance.transformed },
        { label: "Evaluate the transformed expression", expression: instance.transformed, result: instance.answer },
      ],
      conclusion: `Therefore, the required value is ${instance.answer}.`,
    },
    proof: { unique: true, solverRoute: "GENERATED_SUPPLIED_MAPPING_EXACT_EVALUATOR", eligibleCandidateCount: 4, survivingCandidateCount: 1, semanticFingerprint: `OPS-CAND-001:${mappingKey(instance.mapping)}:${instance.transformed}:${instance.answer}` },
    metadata: { teachingExplanationVersion: "V3_APPROVED", teachingTraceVerified: true, requestedSeed: seed, sourceSeed: instance.sourceSeed, generatedMappedState: true, misconceptionDistractorsGrounded: true },
  };
}

function generate003(seed: number): ApprovedOpsQuestion {
  const instance = makeMappedNumericInstance(seed, 130, ["+", "×"], ["×", "+"]);
  const equation = (value: string) => `${instance.expression} = ${value}`;
  const optionsBase = distinctOptions(instance.answer, [
    { value: instance.ordinaryAnswer, errorLabel: "IGNORED_SUPPLIED_MAPPING" },
    { value: instance.firstOnlyAnswer, errorLabel: "APPLIED_ONLY_FIRST_MAPPING" },
    { value: instance.reversedAnswer, errorLabel: "REVERSED_MAPPING_MEANINGS" },
  ], seed)!;
  const options = optionsBase.map((option) => ({ ...option, value: equation(option.value) }));
  const answer = equation(instance.answer);
  return {
    candidateId: "OPS-CAND-003",
    checkpointId: "OPS-CP-001",
    seed,
    locale: "en-IN",
    taskKind: "IDENTIFY_EQUATION_AFTER_MAPPING",
    solveMode: "selectEquationByTruthAfterGivenArithmeticMapping",
    renderer: "TABLE_OR_GRID",
    stem: `If ${mappingKey(instance.mapping)}, select the equation that is true.`,
    options,
    correctIndex: options.findIndex((option) => option.errorLabel === null),
    answer,
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
    metadata: { teachingExplanationVersion: "V3_APPROVED", teachingTraceVerified: true, requestedSeed: seed, sourceSeed: instance.sourceSeed, optionTopology: "EQUATION_OPTIONS", generatedMappedState: true },
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
    { value: instance.reversedAnswer, errorLabel: "SWAPPED_TOKEN_MEANINGS" },
  ], seed)!;
  return {
    candidateId: "OPS-CAND-004",
    checkpointId: "OPS-CP-002",
    seed,
    locale: "en-IN",
    taskKind: "EVALUATE_AFTER_GIVEN_MAPPING",
    solveMode: "evaluateAfterGivenArbitraryTokenMapping",
    renderer: "STRUCTURED_TEXT",
    stem: `If ${mappingKey(instance.mapping)}, evaluate ${instance.expression}.`,
    options,
    correctIndex: options.findIndex((option) => option.errorLabel === null),
    answer: instance.answer,
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
    metadata: { teachingExplanationVersion: "V3_APPROVED", teachingTraceVerified: true, requestedSeed: seed, sourceSeed: instance.sourceSeed, tokenFamily: family.tokenFamily, generatedMappedState: true },
  };
}

function generate005(seed: number): ApprovedOpsQuestion {
  const wordFamilies = [
    { display: ["scale", "combine"] as const, semantic: ["×", "+"] as const },
    { display: ["join", "reduce"] as const, semantic: ["+", "−"] as const },
    { display: ["times", "plus"] as const, semantic: ["×", "+"] as const },
  ] as const;
  const family = wordFamilies[int(seed, 171, 0, wordFamilies.length - 1)]!;
  const instance = makeMappedNumericInstance(seed, 180, family.display, family.semantic);
  const options = distinctOptions(instance.answer, [
    { value: instance.ordinaryAnswer, errorLabel: "IGNORED_WORD_OPERATOR_KEY" },
    { value: instance.firstOnlyAnswer, errorLabel: "APPLIED_ONLY_FIRST_WORD_OPERATOR" },
    { value: instance.reversedAnswer, errorLabel: "REVERSED_WORD_OPERATOR_MEANINGS" },
  ], seed)!;
  return {
    candidateId: "OPS-CAND-005",
    checkpointId: "OPS-CP-002",
    seed,
    locale: "en-IN",
    localeMode: "LANGUAGE_ADAPTED",
    taskKind: "EVALUATE_AFTER_GIVEN_MAPPING",
    solveMode: "evaluateAfterGivenWordTokenMapping",
    renderer: "STRUCTURED_TEXT",
    stem: `If ${mappingKey(instance.mapping)}, evaluate ${instance.expression}.`,
    options,
    correctIndex: options.findIndex((option) => option.errorLabel === null),
    answer: instance.answer,
    explanation: {
      ruleStatement: "Read each complete word operator from the supplied key, replace the words by their mathematical operations and only then perform the calculation.",
      steps: [
        { label: "Read the word-operator meaning key", expression: mappingKey(instance.mapping), result: "Each whole word has one arithmetic meaning." },
        { label: "Replace the word operators", expression: instance.expression, result: instance.transformed },
        { label: "Evaluate after replacement", expression: instance.transformed, result: instance.answer },
      ],
      conclusion: `Therefore, the required value is ${instance.answer}.`,
    },
    proof: { unique: true, solverRoute: "GENERATED_LANGUAGE_ADAPTED_WORD_TOKEN_EVALUATOR", eligibleCandidateCount: 4, survivingCandidateCount: 1, semanticFingerprint: `OPS-CAND-005:${instance.transformed}:${instance.answer}` },
    metadata: { teachingExplanationVersion: "V3_APPROVED", teachingTraceVerified: true, requestedSeed: seed, sourceSeed: instance.sourceSeed, tokenFamily: "WORD_TOKEN", localeAdaptationRequired: true, generatedMappedState: true },
  };
}

function generate007(seed: number): ApprovedOpsQuestion {
  const family = arbitraryTokenFamily(seed);
  const instance = makeMappedNumericInstance(seed, 200, family.display, family.semantic);
  const equation = (value: string) => `${instance.expression} = ${value}`;
  const optionValues = distinctOptions(instance.answer, [
    { value: instance.ordinaryAnswer, errorLabel: "USED_DEFAULT_TOKEN_MEANINGS" },
    { value: instance.firstOnlyAnswer, errorLabel: "APPLIED_ONLY_FIRST_TOKEN_MEANING" },
    { value: instance.reversedAnswer, errorLabel: "SWAPPED_TOKEN_MEANINGS" },
  ], seed)!;
  const options = optionValues.map((option) => ({ ...option, value: equation(option.value) }));
  const answer = equation(instance.answer);
  return {
    candidateId: "OPS-CAND-007",
    checkpointId: "OPS-CP-002",
    seed,
    locale: "en-IN",
    taskKind: "IDENTIFY_EQUATION_AFTER_MAPPING",
    solveMode: "selectEquationByTruthAfterArbitraryTokenMapping",
    renderer: "TABLE_OR_GRID",
    stem: `If ${mappingKey(instance.mapping)}, select the true equation.`,
    options,
    correctIndex: options.findIndex((option) => option.errorLabel === null),
    answer,
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
    metadata: { teachingExplanationVersion: "V3_APPROVED", teachingTraceVerified: true, requestedSeed: seed, sourceSeed: instance.sourceSeed, optionTopology: "EQUATION_OPTIONS", tokenFamily: family.tokenFamily, generatedMappedState: true },
  };
}

function generate008(seed: number): ApprovedOpsQuestion {
  const sourceSeed = mixed(seed, 220);
  const a = int(sourceSeed, 221, 2, 25);
  const b = int(sourceSeed, 222, 2, 15);
  const sum = a + b;
  const greaterLeft = int(sourceSeed, 223, 20, 50);
  const greaterRight = int(sourceSeed, 224, 2, greaterLeft - 1);
  const correct = `${a} A ${b} B ${sum}`;
  const statementValues = rotate([
    correct,
    `${a} A ${b} C ${sum + 1}`,
    `${greaterLeft} D ${greaterRight}`,
    `${a} B ${b} A ${sum}`,
  ], seed);
  const isTrue = (statement: string): boolean => {
    try {
      const transformed = replaceTokens(statement, [["A", "+"], ["B", "="], ["C", ">"], ["D", "<"]]);
      return relationTrace(transformed).truth;
    } catch { return false; }
  };
  const options: OpsPilotOption[] = statementValues.map((value) => ({ value, errorLabel: isTrue(value) ? null : "FALSE_AFTER_MIXED_MAPPING" }));
  if (options.filter((option) => option.errorLabel === null).length !== 1) throw new Error(`OPS-CAND-008 lost one-answer truth at seed ${seed}.`);
  return {
    candidateId: "OPS-CAND-008",
    checkpointId: "OPS-CP-003",
    seed,
    locale: "en-IN",
    taskKind: "IDENTIFY_TRUE_STATEMENT_AFTER_MAPPING",
    solveMode: "selectStatementByTruthAfterMixedMapping",
    renderer: "TABLE_OR_GRID",
    stem: "If A means +, B means =, C means >, D means <, select the true statement.",
    options,
    correctIndex: options.findIndex((option) => option.errorLabel === null),
    answer: correct,
    explanation: {
      ruleStatement: "Replace the arithmetic and relation tokens together, then evaluate each completed statement under the same supplied key and retain the single true option.",
      steps: options.map((option, index) => ({
        label: `Check option ${String.fromCharCode(65 + index)}`,
        expression: option.value,
        result: `${replaceTokens(option.value, [["A", "+"], ["B", "="], ["C", ">"], ["D", "<"]])}; ${option.errorLabel === null ? "true" : "false"}.`,
      })),
      conclusion: `Therefore, ${correct} is the only true statement.`,
    },
    proof: { unique: true, solverRoute: "GENERATED_SUPPLIED_MIXED_MAPPING_OPTION_TRUTH", eligibleCandidateCount: 4, survivingCandidateCount: 1, semanticFingerprint: `OPS-CAND-008:${statementValues.join("|")}:${correct}` },
    metadata: { teachingExplanationVersion: "V3_APPROVED", teachingTraceVerified: true, requestedSeed: seed, sourceSeed, mappingIncludesRelationTokens: true, generatedMixedMappingState: true },
  };
}

function generate009(seed: number): ApprovedOpsQuestion {
  const sourceSeed = mixed(seed, 240);
  const a = int(sourceSeed, 241, 2, 35);
  const b = int(sourceSeed, 242, 2, 18);
  const right = a + b;
  const left = `${a} A ${b}`;
  const candidates = ["A", "B", "C", "D"] as const;
  const truth = candidates.map((token) => {
    const statement = `${left} ${token} ${right}`;
    try {
      return relationTrace(replaceTokens(statement, [["A", "+"], ["B", "="], ["C", ">"], ["D", "<"]])).truth;
    } catch { return false; }
  });
  if (truth.filter(Boolean).length !== 1 || !truth[1]) throw new Error(`OPS-CAND-009 relation token is not uniquely B for seed ${seed}.`);
  const options: OpsPilotOption[] = rotate(candidates.map((value, index) => ({ value, errorLabel: truth[index] ? null : "WRONG_RELATION_TOKEN" })), seed);
  return {
    candidateId: "OPS-CAND-009",
    checkpointId: "OPS-CP-003",
    seed,
    locale: "en-IN",
    taskKind: "RECOVER_MISSING_RELATION_AFTER_MAPPING",
    solveMode: "recoverMissingRelationTokenAfterMixedMapping",
    renderer: "STRUCTURED_TEXT",
    stem: `If A means +, B means =, C means >, D means <, which token replaces the blank in ${left} _ ${right}?`,
    options,
    correctIndex: options.findIndex((option) => option.errorLabel === null),
    answer: "B",
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
    metadata: { teachingExplanationVersion: "V3_APPROVED", teachingTraceVerified: true, requestedSeed: seed, sourceSeed, answerSemantic: "DISPLAY_RELATION_TOKEN", mappedMeaning: "EQUAL", generatedMixedMappingState: true },
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
    const transformedExpression = swapWholeNumbers(
      operatorOnlyExpression,
      numberPair[0],
      numberPair[1],
    );

    const originalAnswer = integerAnswer(expression);
    const operatorOnlyAnswer = integerAnswer(operatorOnlyExpression);
    const numberOnlyAnswer = integerAnswer(numberOnlyExpression);
    const answer = integerAnswer(transformedExpression);
    if (!originalAnswer || !operatorOnlyAnswer || !numberOnlyAnswer || !answer) continue;

    const answerStates = [answer, operatorOnlyAnswer, numberOnlyAnswer, originalAnswer];
    if (new Set(answerStates).size !== answerStates.length) continue;

    return {
      expression,
      operatorPair,
      numberPair,
      operatorOnlyExpression,
      numberOnlyExpression,
      transformedExpression,
      originalAnswer,
      operatorOnlyAnswer,
      numberOnlyAnswer,
      answer,
      sourceSeed,
    };
  }
  throw new Error(`OPS compound runtime could not build a safe misconception-separated instance for seed ${seed}.`);
}

function commonSteps(instance: CompoundInstance): readonly TeachingStep[] {
  return [
    {
      label: "Write both operator replacements",
      expression: `${instance.operatorPair[0]} → ${instance.operatorPair[1]}; ${instance.operatorPair[1]} → ${instance.operatorPair[0]}`,
      result: "Both operators occur in the original expression and are interchanged simultaneously.",
    },
    {
      label: "Write both complete-number replacements",
      expression: `${instance.numberPair[0]} → ${instance.numberPair[1]}; ${instance.numberPair[1]} → ${instance.numberPair[0]}`,
      result: "Only complete number tokens are exchanged; digits inside other numbers are unchanged.",
    },
    {
      label: "Apply both changes to the original expression",
      expression: instance.expression,
      result: instance.transformedExpression,
    },
    ...arithmeticTrace(instance.transformedExpression).steps,
  ];
}

function numericOptions(instance: CompoundInstance, seed: number): readonly OpsPilotOption[] {
  const values: readonly OpsPilotOption[] = [
    { value: instance.answer, errorLabel: null },
    { value: instance.operatorOnlyAnswer, errorLabel: "APPLIED_OPERATOR_SWAP_ONLY" },
    { value: instance.numberOnlyAnswer, errorLabel: "APPLIED_NUMBER_SWAP_ONLY" },
    { value: instance.originalAnswer, errorLabel: "IGNORED_BOTH_INTERCHANGES" },
  ];
  return rotate(values, seed);
}

function generate028(seed: number): ApprovedOpsQuestion {
  const instance = buildCompoundInstance(seed);
  const options = numericOptions(instance, seed);
  const correctIndex = options.findIndex((option) => option.errorLabel === null);
  return {
    candidateId: "OPS-CAND-028",
    checkpointId: "OPS-CP-008",
    seed,
    locale: "en-IN",
    taskKind: "EVALUATE_AFTER_GIVEN_INTERCHANGE",
    solveMode: "evaluateAfterSpecifiedCompoundSwap",
    renderer: "STRUCTURED_TEXT",
    stem: `Interchange ${instance.operatorPair[0]} and ${instance.operatorPair[1]}, and interchange the complete numbers ${instance.numberPair[0]} and ${instance.numberPair[1]}, throughout ${instance.expression}. What is the resulting value?`,
    options,
    correctIndex,
    answer: instance.answer,
    explanation: {
      ruleStatement: "Apply the prescribed two-way operator interchange and complete-number interchange to the same original expression, then complete multiplication and division before addition and subtraction.",
      steps: commonSteps(instance),
      conclusion: `Therefore, the resulting value is ${instance.answer}.`,
    },
    proof: {
      unique: true,
      solverRoute: "GENERATED_PRESCRIBED_OPERATOR_AND_WHOLE_NUMBER_TRANSFORMATION",
      eligibleCandidateCount: 4,
      survivingCandidateCount: 1,
      semanticFingerprint: `OPS-CAND-028:${instance.operatorPair.join("<->")}:${instance.numberPair.join("<->")}:${instance.transformedExpression}:${instance.answer}`,
    },
    metadata: {
      teachingExplanationVersion: "V3_APPROVED",
      teachingTraceVerified: true,
      requestedSeed: seed,
      sourceSeed: instance.sourceSeed,
      compoundSubtype: "OPERATOR_AND_WHOLE_NUMBER",
      bothOperatorsVisible: true,
      bothWholeNumbersVisible: true,
      misconceptionDistractorsGrounded: true,
      distractorModelCount: 3,
      generatedCompoundState: true,
    },
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
  const options: OpsPilotOption[] = rotate(rightSides, seed).map((entry) => ({
    value: `${instance.expression} = ${entry.value}`,
    errorLabel: entry.errorLabel,
  }));
  const correctIndex = options.findIndex((option) => option.errorLabel === null);
  const transformedEquation = `${instance.transformedExpression} = ${instance.answer}`;
  const relation = relationTrace(transformedEquation);
  const steps: TeachingStep[] = [
    ...commonSteps(instance),
    {
      label: "Compare the transformed value with the option right-hand sides",
      expression: transformedEquation,
      result: `The transformed equation is ${relation.truth ? "true" : "false"}; only the option ending in ${instance.answer} matches.`,
    },
  ];
  return {
    candidateId: "OPS-CAND-029",
    checkpointId: "OPS-CP-008",
    seed,
    locale: "en-IN",
    taskKind: "IDENTIFY_CORRECT_EQUATION_AFTER_INTERCHANGE",
    solveMode: "selectEquationByTruthAfterSpecifiedCompoundSwap",
    renderer: "TABLE_OR_GRID",
    stem: `After interchanging ${instance.operatorPair[0]} with ${instance.operatorPair[1]} and the complete numbers ${instance.numberPair[0]} with ${instance.numberPair[1]} in every option, select the true equation.`,
    options,
    correctIndex,
    answer: printedAnswer,
    explanation: {
      ruleStatement: "Apply the full prescribed operator-and-complete-number transformation independently to every printed equation, calculate the transformed left side and select the unique matching right-hand side.",
      steps,
      conclusion: `Hence, ${printedAnswer} is the correct printed option.`,
    },
    proof: {
      unique: true,
      solverRoute: "GENERATED_PRESCRIBED_COMPOUND_OPTION_TRUTH",
      eligibleCandidateCount: 4,
      survivingCandidateCount: 1,
      semanticFingerprint: `OPS-CAND-029:${instance.operatorPair.join("<->")}:${instance.numberPair.join("<->")}:${transformedEquation}`,
    },
    metadata: {
      teachingExplanationVersion: "V3_APPROVED",
      teachingTraceVerified: true,
      requestedSeed: seed,
      sourceSeed: instance.sourceSeed,
      compoundSubtype: "OPERATOR_AND_WHOLE_NUMBER",
      optionTopology: "EQUATION_OPTIONS",
      bothOperatorsVisible: true,
      bothWholeNumbersVisible: true,
      misconceptionDistractorsGrounded: true,
      distractorModelCount: 3,
      generatedCompoundState: true,
    },
  };
}

export function generateApprovedOpsQuestion(candidateId: OpsApprovedCandidateId, seed: number): ApprovedOpsQuestion {
  if (!Number.isInteger(seed) || seed < 0) throw new Error(`Approved runtime seed must be a non-negative integer; received ${seed}.`);
  if (candidateId === "OPS-CAND-001") return generate001(seed);
  if (candidateId === "OPS-CAND-003") return generate003(seed);
  if (candidateId === "OPS-CAND-004") return generate004(seed);
  if (candidateId === "OPS-CAND-005") return generate005(seed);
  if (candidateId === "OPS-CAND-007") return generate007(seed);
  if (candidateId === "OPS-CAND-008") return generate008(seed);
  if (candidateId === "OPS-CAND-009") return generate009(seed);
  if (candidateId === "OPS-CAND-028") return generate028(seed);
  if (candidateId === "OPS-CAND-029") return generate029(seed);
  return generateEntryQuestion(candidateId, seed);
}

import type { ApprovedOpsQuestion, OpsApprovedCandidateId } from "./approved-teaching-entry";
import type { OpsPilotOption } from "./representative-pilots";
import {
  auditDistinctOptions,
  auditGeneratedMetadata,
  auditInt,
  auditIntegerAnswer,
  auditMappingKey,
  auditMix,
  auditRelationTrue,
  auditReplaceTokens,
  auditRotate,
} from "./audit-generated-foundation";

type SupportedMappingCandidate =
  | "OPS-CAND-001"
  | "OPS-CAND-003"
  | "OPS-CAND-004"
  | "OPS-CAND-005"
  | "OPS-CAND-007"
  | "OPS-CAND-008"
  | "OPS-CAND-009"
  | "OPS-CAND-011";

type MappingInstance = {
  expression: string;
  transformed: string;
  answer: string;
  ordinaryAnswer: string;
  firstOnlyAnswer: string;
  secondOnlyAnswer: string;
  mapping: readonly (readonly [string, string])[];
  sourceSeed: number;
};

function defaultMeaning(token: string, index: number): string {
  if (["+", "−", "×", "÷"].includes(token)) return token;
  return index === 0 ? "+" : "×";
}

function mappedInstance(
  seed: number,
  salt: number,
  displayTokens: readonly [string, string],
  semanticTokens: readonly [string, string],
): MappingInstance {
  for (let attempt = 0; attempt < 8000; attempt += 1) {
    const sourceSeed = (seed * 1009 + attempt * 7919 + salt) >>> 0;
    const a = auditInt(sourceSeed, salt + 1, 4, 38);
    const b = auditInt(sourceSeed, salt + 2, 2, 13);
    const c = auditInt(sourceSeed, salt + 3, 2, 19);
    const mapping = [
      [displayTokens[0], semanticTokens[0]],
      [displayTokens[1], semanticTokens[1]],
    ] as const;
    const defaults = [
      [displayTokens[0], defaultMeaning(displayTokens[0], 0)],
      [displayTokens[1], defaultMeaning(displayTokens[1], 1)],
    ] as const;
    const expression = `${a} ${displayTokens[0]} ${b} ${displayTokens[1]} ${c}`;
    const transformed = auditReplaceTokens(expression, mapping);
    const ordinary = auditReplaceTokens(expression, defaults);
    const firstOnly = auditReplaceTokens(expression, [mapping[0], defaults[1]]);
    const secondOnly = auditReplaceTokens(expression, [defaults[0], mapping[1]]);
    const answer = auditIntegerAnswer(transformed);
    const ordinaryAnswer = auditIntegerAnswer(ordinary);
    const firstOnlyAnswer = auditIntegerAnswer(firstOnly);
    const secondOnlyAnswer = auditIntegerAnswer(secondOnly);
    if (!answer || !ordinaryAnswer || !firstOnlyAnswer || !secondOnlyAnswer) continue;
    if (new Set([answer, ordinaryAnswer, firstOnlyAnswer, secondOnlyAnswer]).size !== 4) continue;
    return { expression, transformed, answer, ordinaryAnswer, firstOnlyAnswer, secondOnlyAnswer, mapping, sourceSeed };
  }
  throw new Error(`OPS mapped runtime could not build a misconception-separated instance for seed ${seed}.`);
}

function numericMappingOptions(instance: MappingInstance, seed: number): readonly OpsPilotOption[] {
  const options = auditDistinctOptions(instance.answer, [
    { value: instance.ordinaryAnswer, errorLabel: "IGNORED_MAPPING" },
    { value: instance.firstOnlyAnswer, errorLabel: "APPLIED_ONLY_FIRST_MAPPING" },
    { value: instance.secondOnlyAnswer, errorLabel: "APPLIED_ONLY_SECOND_MAPPING" },
  ], seed);
  if (!options) throw new Error("Mapped instance lost three misconception-distinct distractors.");
  return options;
}

function generate001(seed: number): ApprovedOpsQuestion {
  const families = [
    { display: ["+", "×"] as const, semantic: ["×", "+"] as const },
    { display: ["+", "−"] as const, semantic: ["×", "+"] as const },
    { display: ["−", "×"] as const, semantic: ["+", "−"] as const },
  ] as const;
  const family = families[auditInt(seed, 101, 0, families.length - 1)]!;
  const instance = mappedInstance(seed, 110, family.display, family.semantic);
  const options = numericMappingOptions(instance, seed);
  return {
    candidateId: "OPS-CAND-001", checkpointId: "OPS-CP-001", seed, locale: "en-IN",
    taskKind: "EVALUATE_AFTER_GIVEN_MAPPING", solveMode: "evaluateAfterGivenArithmeticSignMapping", renderer: "STRUCTURED_TEXT",
    stem: `If ${auditMappingKey(instance.mapping)}, evaluate ${instance.expression}.`,
    options, correctIndex: options.findIndex((option) => option.errorLabel === null), answer: instance.answer,
    explanation: {
      ruleStatement: "Replace every displayed sign by its supplied arithmetic meaning before calculating; the printed sign itself must not be used until the complete mapping has been applied.",
      steps: [
        { label: "Read the replacement key", expression: auditMappingKey(instance.mapping), result: "Use both stated meanings for every occurrence." },
        { label: "Apply the complete replacement", expression: instance.expression, result: instance.transformed },
        { label: "Evaluate the transformed expression", expression: instance.transformed, result: instance.answer },
      ],
      conclusion: `Therefore, the required value is ${instance.answer}.`,
    },
    proof: { unique: true, solverRoute: "GENERATED_SUPPLIED_MAPPING_EXACT_EVALUATOR", eligibleCandidateCount: 4, survivingCandidateCount: 1, semanticFingerprint: `OPS-CAND-001:${auditMappingKey(instance.mapping)}:${instance.transformed}:${instance.answer}` },
    metadata: auditGeneratedMetadata(seed, instance.sourceSeed, { misconceptionDistractorsGrounded: true }),
  };
}

function generate003(seed: number): ApprovedOpsQuestion {
  const instance = mappedInstance(seed, 130, ["+", "×"], ["×", "+"]);
  const baseOptions = numericMappingOptions(instance, seed);
  const options = baseOptions.map((option) => ({ ...option, value: `${instance.expression} = ${option.value}` }));
  const answer = `${instance.expression} = ${instance.answer}`;
  return {
    candidateId: "OPS-CAND-003", checkpointId: "OPS-CP-001", seed, locale: "en-IN",
    taskKind: "IDENTIFY_EQUATION_AFTER_MAPPING", solveMode: "selectEquationByTruthAfterGivenArithmeticMapping", renderer: "TABLE_OR_GRID",
    stem: `If ${auditMappingKey(instance.mapping)}, select the equation that is true.`,
    options, correctIndex: options.findIndex((option) => option.errorLabel === null), answer,
    explanation: {
      ruleStatement: "Apply the supplied meanings to the common coded expression once, calculate its exact value and select the single equation whose right-hand side matches that value.",
      steps: [
        { label: "Read the replacement key", expression: auditMappingKey(instance.mapping), result: "Apply both meanings to the common expression." },
        { label: "Transform the common left side", expression: instance.expression, result: instance.transformed },
        { label: "Select the matching equation", expression: `${instance.transformed} = ${instance.answer}`, result: answer },
      ],
      conclusion: `Hence, ${answer} is the only true equation.`,
    },
    proof: { unique: true, solverRoute: "GENERATED_MAP_AND_VALIDATE_EQUATION_OPTIONS", eligibleCandidateCount: 4, survivingCandidateCount: 1, semanticFingerprint: `OPS-CAND-003:${instance.transformed}:${instance.answer}` },
    metadata: auditGeneratedMetadata(seed, instance.sourceSeed, { optionTopology: "EQUATION_OPTIONS" }),
  };
}

function arbitraryFamily(seed: number) {
  const families = [
    { display: ["M", "N"] as const, semantic: ["×", "+"] as const, tokenFamily: "LETTER_TOKEN" },
    { display: ["P", "Q"] as const, semantic: ["+", "×"] as const, tokenFamily: "LETTER_TOKEN" },
    { display: ["#", "$" ] as const, semantic: ["×", "+"] as const, tokenFamily: "PUNCTUATION_TOKEN" },
    { display: ["◆", "●"] as const, semantic: ["−", "×"] as const, tokenFamily: "FONT_SAFE_SHAPE_TOKEN" },
  ] as const;
  return families[auditInt(seed, 150, 0, families.length - 1)]!;
}

function generate004(seed: number): ApprovedOpsQuestion {
  const family = arbitraryFamily(seed);
  const instance = mappedInstance(seed, 160, family.display, family.semantic);
  const options = numericMappingOptions(instance, seed);
  return {
    candidateId: "OPS-CAND-004", checkpointId: "OPS-CP-002", seed, locale: "en-IN",
    taskKind: "EVALUATE_AFTER_GIVEN_MAPPING", solveMode: "evaluateAfterGivenArbitraryTokenMapping", renderer: "STRUCTURED_TEXT",
    stem: `If ${auditMappingKey(instance.mapping)}, evaluate ${instance.expression}.`,
    options, correctIndex: options.findIndex((option) => option.errorLabel === null), answer: instance.answer,
    explanation: {
      ruleStatement: "Treat each arbitrary token as the arithmetic operation stated in the key, replace every token first and then evaluate the transformed expression normally.",
      steps: [
        { label: "Read the meaning key", expression: auditMappingKey(instance.mapping), result: "Keep the two token meanings separate." },
        { label: "Replace arbitrary tokens", expression: instance.expression, result: instance.transformed },
        { label: "Evaluate the transformed expression", expression: instance.transformed, result: instance.answer },
      ],
      conclusion: `Therefore, the required value is ${instance.answer}.`,
    },
    proof: { unique: true, solverRoute: "GENERATED_ARBITRARY_TOKEN_MAPPING_EVALUATOR", eligibleCandidateCount: 4, survivingCandidateCount: 1, semanticFingerprint: `OPS-CAND-004:${family.tokenFamily}:${instance.transformed}:${instance.answer}` },
    metadata: auditGeneratedMetadata(seed, instance.sourceSeed, { tokenFamily: family.tokenFamily }),
  };
}

function generate005(seed: number): ApprovedOpsQuestion {
  const instance = mappedInstance(seed, 180, ["scale", "combine"], ["×", "+"]);
  const options = numericMappingOptions(instance, seed);
  return {
    candidateId: "OPS-CAND-005", checkpointId: "OPS-CP-002", seed, locale: "en-IN", localeMode: "LANGUAGE_ADAPTED",
    taskKind: "EVALUATE_AFTER_GIVEN_MAPPING", solveMode: "evaluateAfterGivenWordTokenMapping", renderer: "STRUCTURED_TEXT",
    stem: `If the word operator scale means × and combine means +, evaluate ${instance.expression}.`,
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
    metadata: auditGeneratedMetadata(seed, instance.sourceSeed, { tokenFamily: "WORD_TOKEN", localeAdaptationRequired: true }),
  };
}

function generate007(seed: number): ApprovedOpsQuestion {
  const family = arbitraryFamily(seed);
  const instance = mappedInstance(seed, 200, family.display, family.semantic);
  const baseOptions = numericMappingOptions(instance, seed);
  const options = baseOptions.map((option) => ({ ...option, value: `${instance.expression} = ${option.value}` }));
  const answer = `${instance.expression} = ${instance.answer}`;
  return {
    candidateId: "OPS-CAND-007", checkpointId: "OPS-CP-002", seed, locale: "en-IN",
    taskKind: "IDENTIFY_EQUATION_AFTER_MAPPING", solveMode: "selectEquationByTruthAfterArbitraryTokenMapping", renderer: "TABLE_OR_GRID",
    stem: `If ${auditMappingKey(instance.mapping)}, select the true equation.`,
    options, correctIndex: options.findIndex((option) => option.errorLabel === null), answer,
    explanation: {
      ruleStatement: "Use the same arbitrary-token meaning key for the common expression, evaluate that transformed expression once and select the option with the matching result.",
      steps: [
        { label: "Read the complete meaning key", expression: auditMappingKey(instance.mapping), result: "Use this one key for every option." },
        { label: "Transform the common option expression", expression: instance.expression, result: instance.transformed },
        { label: "Select the matching equation", expression: `${instance.transformed} = ${instance.answer}`, result: answer },
      ],
      conclusion: `Hence, ${answer} is the only true equation.`,
    },
    proof: { unique: true, solverRoute: "GENERATED_ARBITRARY_TOKEN_OPTION_TRUTH", eligibleCandidateCount: 4, survivingCandidateCount: 1, semanticFingerprint: `OPS-CAND-007:${instance.transformed}:${instance.answer}` },
    metadata: auditGeneratedMetadata(seed, instance.sourceSeed, { optionTopology: "EQUATION_OPTIONS", tokenFamily: family.tokenFamily }),
  };
}

const MIXED_MAPPING = [["A", "+"], ["B", "="], ["C", ">"], ["D", "<"]] as const;

function generate008(seed: number): ApprovedOpsQuestion {
  const sourceSeed = auditMix(seed, 220);
  const a = auditInt(sourceSeed, 221, 2, 35);
  const b = auditInt(sourceSeed, 222, 2, 20);
  const sum = a + b;
  const greaterLeft = auditInt(sourceSeed, 223, 20, 60);
  const greaterRight = auditInt(sourceSeed, 224, 2, greaterLeft - 1);
  const correct = `${a} A ${b} B ${sum}`;
  const statementValues = auditRotate([
    correct,
    `${a} A ${b} C ${sum + 1}`,
    `${greaterLeft} D ${greaterRight}`,
    `${a} B ${b} A ${sum}`,
  ], seed);
  const options: OpsPilotOption[] = statementValues.map((value) => {
    const transformed = auditReplaceTokens(value, MIXED_MAPPING);
    return { value, errorLabel: auditRelationTrue(transformed) ? null : "FALSE_AFTER_MIXED_MAPPING" };
  });
  if (options.filter((option) => option.errorLabel === null).length !== 1) throw new Error(`OPS-CAND-008 lost one-answer truth at seed ${seed}.`);
  return {
    candidateId: "OPS-CAND-008", checkpointId: "OPS-CP-003", seed, locale: "en-IN",
    taskKind: "IDENTIFY_TRUE_STATEMENT_AFTER_MAPPING", solveMode: "selectStatementByTruthAfterMixedMapping", renderer: "TABLE_OR_GRID",
    stem: "If A means +, B means =, C means >, D means <, select the true statement.",
    options, correctIndex: options.findIndex((option) => option.errorLabel === null), answer: correct,
    explanation: {
      ruleStatement: "Replace the arithmetic and relation tokens together, then evaluate each completed statement under the same supplied key and retain the single true option.",
      steps: options.map((option, index) => ({ label: `Check option ${String.fromCharCode(65 + index)}`, expression: option.value, result: `${auditReplaceTokens(option.value, MIXED_MAPPING)}; ${option.errorLabel === null ? "true" : "false"}.` })),
      conclusion: `Therefore, ${correct} is the only true statement.`,
    },
    proof: { unique: true, solverRoute: "GENERATED_SUPPLIED_MIXED_MAPPING_OPTION_TRUTH", eligibleCandidateCount: 4, survivingCandidateCount: 1, semanticFingerprint: `OPS-CAND-008:${statementValues.join("|")}:${correct}` },
    metadata: auditGeneratedMetadata(seed, sourceSeed, { mappingIncludesRelationTokens: true }),
  };
}

function generate009(seed: number): ApprovedOpsQuestion {
  const sourceSeed = auditMix(seed, 240);
  const a = auditInt(sourceSeed, 241, 2, 45);
  const b = auditInt(sourceSeed, 242, 2, 24);
  const right = a + b;
  const left = `${a} A ${b}`;
  const candidates = ["A", "B", "C", "D"] as const;
  const truth = candidates.map((token) => auditRelationTrue(auditReplaceTokens(`${left} ${token} ${right}`, MIXED_MAPPING)));
  if (truth.filter(Boolean).length !== 1 || !truth[1]) throw new Error(`OPS-CAND-009 relation token is not uniquely B for seed ${seed}.`);
  const options: OpsPilotOption[] = auditRotate(candidates.map((value, index) => ({ value, errorLabel: truth[index] ? null : "WRONG_RELATION_TOKEN" })), seed);
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
    metadata: auditGeneratedMetadata(seed, sourceSeed, { answerSemantic: "DISPLAY_RELATION_TOKEN", mappedMeaning: "EQUAL" }),
  };
}

function generate011(seed: number): ApprovedOpsQuestion {
  const sourceSeed = auditMix(seed, 260);
  const leftA = auditInt(sourceSeed, 261, 2, 35);
  const leftB = auditInt(sourceSeed, 262, 2, 20);
  const leftValue = leftA + leftB;
  const relation = (["=", "<", ">"] as const)[auditInt(sourceSeed, 263, 0, 2)]!;
  const delta = auditInt(sourceSeed, 264, 1, 12);
  const rightValue = relation === "=" ? leftValue : relation === "<" ? leftValue + delta : Math.max(1, leftValue - delta);
  const divisor = auditInt(sourceSeed, 265, 2, 9);
  const numerator = rightValue * divisor;
  const left = `${leftA} + ${leftB}`;
  const right = `${numerator} ÷ ${divisor}`;
  const options: OpsPilotOption[] = auditRotate(["=", "<", ">", "Cannot be determined"].map((value) => ({ value, errorLabel: value === relation ? null : "WRONG_RELATION_OPERATOR" })), seed);
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
    metadata: auditGeneratedMetadata(seed, sourceSeed, { suppliedMapping: false, relationPositionFixed: true }),
  };
}

const BUILDERS: Partial<Record<OpsApprovedCandidateId, (seed: number) => ApprovedOpsQuestion>> = {
  "OPS-CAND-001": generate001,
  "OPS-CAND-003": generate003,
  "OPS-CAND-004": generate004,
  "OPS-CAND-005": generate005,
  "OPS-CAND-007": generate007,
  "OPS-CAND-008": generate008,
  "OPS-CAND-009": generate009,
  "OPS-CAND-011": generate011,
};

export function supportsAuditGeneratedMappingCandidate(candidateId: OpsApprovedCandidateId): candidateId is SupportedMappingCandidate {
  return Boolean(BUILDERS[candidateId]);
}

export function generateAuditMappingCandidate(candidateId: SupportedMappingCandidate, seed: number): ApprovedOpsQuestion {
  return BUILDERS[candidateId]!(seed);
}

import type { ApprovedOpsQuestion, OpsApprovedCandidateId } from "./approved-teaching-entry";
import { relationTrace, swapDigits, swapOperatorPairs, swapWholeNumbers } from "./approved-teaching-helpers";
import type { OpsPilotOption } from "./representative-pilots";
import {
  AUDIT_DOUBLE_PAIRINGS,
  AUDIT_OPERATOR_PAIRS,
  auditDistinctOptions,
  auditGeneratedMetadata,
  auditInt,
  auditIntegerAnswer,
  auditPairText,
  auditRelationTrue,
  auditRotate,
  type AuditOperatorPair,
} from "./audit-generated-foundation";

type SupportedInterchangeCandidate =
  | "OPS-CAND-014"
  | "OPS-CAND-015"
  | "OPS-CAND-017"
  | "OPS-CAND-019"
  | "OPS-CAND-021"
  | "OPS-CAND-022"
  | "OPS-CAND-023"
  | "OPS-CAND-024"
  | "OPS-CAND-025"
  | "OPS-CAND-030"
  | "OPS-CAND-032";

function buildPrescribedSwapInstance(seed: number, salt: number, pair: AuditOperatorPair) {
  for (let attempt = 0; attempt < 6000; attempt += 1) {
    const sourceSeed = (seed * 1013 + attempt * 6151 + salt) >>> 0;
    const a = auditInt(sourceSeed, salt + 1, 4, 34);
    const b = auditInt(sourceSeed, salt + 2, 2, 12);
    const c = auditInt(sourceSeed, salt + 3, 2, 18);
    const d = auditInt(sourceSeed, salt + 4, 2, 11);
    const expression = `${a} + ${b} × ${c} − ${d}`;
    const transformed = swapOperatorPairs(expression, [pair]);
    const wrongPair = AUDIT_OPERATOR_PAIRS.find((candidate) => auditPairText(candidate) !== auditPairText(pair))!;
    const answer = auditIntegerAnswer(transformed);
    const originalAnswer = auditIntegerAnswer(expression);
    const wrongPairAnswer = auditIntegerAnswer(swapOperatorPairs(expression, [wrongPair]));
    if (!answer || !originalAnswer || !wrongPairAnswer) continue;
    if (new Set([answer, originalAnswer, wrongPairAnswer]).size !== 3) continue;
    return { expression, transformed, answer, originalAnswer, wrongPairAnswer, sourceSeed };
  }
  throw new Error(`OPS prescribed-swap runtime could not build seed ${seed}.`);
}

function generate014(seed: number): ApprovedOpsQuestion {
  const pair = AUDIT_OPERATOR_PAIRS[auditInt(seed, 280, 0, AUDIT_OPERATOR_PAIRS.length - 1)]!;
  const instance = buildPrescribedSwapInstance(seed, 290, pair);
  const options = auditDistinctOptions(instance.answer, [
    { value: instance.originalAnswer, errorLabel: "INTERCHANGE_NOT_APPLIED" },
    { value: instance.wrongPairAnswer, errorLabel: "WRONG_OPERATOR_PAIR_INTERCHANGED" },
    { value: String(Number(instance.answer) + (Number(instance.answer) >= 0 ? 1 : -1)), errorLabel: "ARITHMETIC_AFTER_SWAP_ERROR" },
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
    proof: { unique: true, solverRoute: "GENERATED_PRESCRIBED_OPERATOR_SWAP_EVALUATION", eligibleCandidateCount: 4, survivingCandidateCount: 1, semanticFingerprint: `OPS-CAND-014:${auditPairText(pair)}:${instance.transformed}:${instance.answer}` },
    metadata: auditGeneratedMetadata(seed, instance.sourceSeed, { swapPair: auditPairText(pair), scope: "GLOBAL_TOKEN" }),
  };
}

function generate015(seed: number): ApprovedOpsQuestion {
  for (let attempt = 0; attempt < 6000; attempt += 1) {
    const sourceSeed = (seed * 1019 + attempt * 6211 + 310) >>> 0;
    const pairing = AUDIT_DOUBLE_PAIRINGS[auditInt(sourceSeed, 311, 0, AUDIT_DOUBLE_PAIRINGS.length - 1)]!;
    const a = auditInt(sourceSeed, 312, 5, 34);
    const b = auditInt(sourceSeed, 313, 2, 9);
    const c = auditInt(sourceSeed, 314, 5, 28);
    const d = auditInt(sourceSeed, 315, 2, 9);
    const e = auditInt(sourceSeed, 316, 2, 12);
    const expression = `${a} + ${b} × ${c} − ${d} ÷ ${e}`;
    const transformed = swapOperatorPairs(expression, pairing);
    const answer = auditIntegerAnswer(transformed);
    const firstOnly = auditIntegerAnswer(swapOperatorPairs(expression, [pairing[0]]));
    const secondOnly = auditIntegerAnswer(swapOperatorPairs(expression, [pairing[1]]));
    const original = auditIntegerAnswer(expression);
    if (!answer || !firstOnly || !secondOnly || !original) continue;
    const options = auditDistinctOptions(answer, [
      { value: firstOnly, errorLabel: "APPLIED_ONLY_FIRST_SWAP_PAIR" },
      { value: secondOnly, errorLabel: "APPLIED_ONLY_SECOND_SWAP_PAIR" },
      { value: original, errorLabel: "APPLIED_NEITHER_SWAP_PAIR" },
    ], seed);
    if (!options) continue;
    return {
      candidateId: "OPS-CAND-015", checkpointId: "OPS-CP-005", seed, locale: "en-IN",
      taskKind: "EVALUATE_AFTER_GIVEN_INTERCHANGE", solveMode: "evaluateAfterSpecifiedDoubleOperatorPairSwap", renderer: "STRUCTURED_TEXT",
      stem: `Interchange ${pairing[0][0]} with ${pairing[0][1]} and ${pairing[1][0]} with ${pairing[1][1]} simultaneously in ${expression}, then evaluate it.`,
      options, correctIndex: options.findIndex((option) => option.errorLabel === null), answer,
      explanation: {
        ruleStatement: "Apply both disjoint operator-pair interchanges to the original expression at the same time; applying only one pair creates a different and incorrect transformed expression.",
        steps: [
          { label: "Write all four replacement directions", expression: `${pairing[0][0]} → ${pairing[0][1]}; ${pairing[0][1]} → ${pairing[0][0]}; ${pairing[1][0]} → ${pairing[1][1]}; ${pairing[1][1]} → ${pairing[1][0]}`, result: "Both pairs are applied simultaneously." },
          { label: "Transform the original expression", expression, result: transformed },
          { label: "Evaluate the transformed expression", expression: transformed, result: answer },
        ],
        conclusion: `Therefore, the transformed value is ${answer}.`,
      },
      proof: { unique: true, solverRoute: "GENERATED_PRESCRIBED_DOUBLE_OPERATOR_SWAP", eligibleCandidateCount: 4, survivingCandidateCount: 1, semanticFingerprint: `OPS-CAND-015:${expression}:${transformed}:${answer}` },
      metadata: auditGeneratedMetadata(seed, sourceSeed, { doublePairInterchange: true }),
    };
  }
  throw new Error(`OPS-CAND-015 could not build seed ${seed}.`);
}

function doubleLabel(pairing: readonly [AuditOperatorPair, AuditOperatorPair]): string {
  return `${auditPairText(pairing[0])}; ${auditPairText(pairing[1])}`;
}

function generate017(seed: number): ApprovedOpsQuestion {
  for (let attempt = 0; attempt < 10000; attempt += 1) {
    const sourceSeed = (seed * 1021 + attempt * 6221 + 330) >>> 0;
    const intended = AUDIT_DOUBLE_PAIRINGS[auditInt(sourceSeed, 331, 0, AUDIT_DOUBLE_PAIRINGS.length - 1)]!;
    const a = auditInt(sourceSeed, 332, 8, 38);
    const b = auditInt(sourceSeed, 333, 2, 9);
    const c = auditInt(sourceSeed, 334, 5, 28);
    const d = auditInt(sourceSeed, 335, 2, 9);
    const e = auditInt(sourceSeed, 336, 2, 12);
    const trueExpression = `${a} + ${b} × ${c} − ${d} ÷ ${e}`;
    const result = auditIntegerAnswer(trueExpression);
    if (!result) continue;
    const trueEquation = `${trueExpression} = ${result}`;
    const printedEquation = swapOperatorPairs(trueEquation, intended);
    const doubles = AUDIT_DOUBLE_PAIRINGS.filter((pairing) => auditRelationTrue(swapOperatorPairs(printedEquation, pairing)));
    const singles = AUDIT_OPERATOR_PAIRS.filter((pair) => auditRelationTrue(swapOperatorPairs(printedEquation, [pair])));
    if (doubles.length !== 1 || doubleLabel(doubles[0]!) !== doubleLabel(intended) || singles.length !== 0) continue;
    const answer = doubleLabel(intended);
    const options: OpsPilotOption[] = auditRotate([...AUDIT_DOUBLE_PAIRINGS.map((pairing) => ({ value: doubleLabel(pairing), errorLabel: doubleLabel(pairing) === answer ? null : "WRONG_DOUBLE_PAIRING" })), { value: "Only one pair is required", errorLabel: "INCORRECTLY_ASSUMED_SINGLE_PAIR_REPAIR" }], seed);
    return {
      candidateId: "OPS-CAND-017", checkpointId: "OPS-CP-005", seed, locale: "en-IN",
      taskKind: "IDENTIFY_TWO_OPERATOR_PAIRS_TO_SWAP", solveMode: "identifyTwoOperatorPairSwapsForEquation", renderer: "TABLE_OR_GRID",
      stem: `Which two operator pairs must be interchanged simultaneously to make ${printedEquation} correct?`,
      options, correctIndex: options.findIndex((option) => option.errorLabel === null), answer,
      explanation: {
        ruleStatement: "Test all complete disjoint double-pair interchanges against the original equation and also exclude every simpler single-pair repair before accepting a two-pair answer.",
        steps: [
          { label: "Write both interchange pairs", expression: answer.replaceAll("↔", "→"), result: "All four operator identities change simultaneously." },
          { label: "Transform and rebuild the equation", expression: printedEquation, result: trueEquation },
          { label: "Establish uniqueness", expression: "Three double pairings and all six single pairs were tested.", result: `Only ${answer} repairs the equation and no single pair does.` },
        ],
        conclusion: `Therefore, ${answer} is the required double interchange.`,
      },
      proof: { unique: true, solverRoute: "GENERATED_ENUMERATE_DOUBLE_AND_SINGLE_OPERATOR_REPAIRS", eligibleCandidateCount: 9, survivingCandidateCount: 1, semanticFingerprint: `OPS-CAND-017:${printedEquation}:${answer}` },
      metadata: auditGeneratedMetadata(seed, sourceSeed, { noSinglePairRepair: true, completeDoublePairPoolVerified: true }),
    };
  }
  throw new Error(`OPS-CAND-017 could not build a unique double-pair repair for seed ${seed}.`);
}

function generate019(seed: number): ApprovedOpsQuestion {
  const pair = AUDIT_OPERATOR_PAIRS[auditInt(seed, 350, 0, AUDIT_OPERATOR_PAIRS.length - 1)]!;
  const instance = buildPrescribedSwapInstance(seed, 360, pair);
  const values = [instance.answer, instance.originalAnswer, instance.wrongPairAnswer, String(Number(instance.answer) + 1)];
  if (new Set(values).size !== 4) return generate019(seed + 100003);
  const answer = `${instance.expression} = ${instance.answer}`;
  const options: OpsPilotOption[] = auditRotate(values.map((value) => ({ value: `${instance.expression} = ${value}`, errorLabel: value === instance.answer ? null : "FALSE_AFTER_PRESCRIBED_OPERATOR_SWAP" })), seed);
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
    proof: { unique: true, solverRoute: "GENERATED_PRESCRIBED_OPERATOR_SWAP_OPTION_TRUTH", eligibleCandidateCount: 4, survivingCandidateCount: 1, semanticFingerprint: `OPS-CAND-019:${auditPairText(pair)}:${instance.expression}:${instance.answer}` },
    metadata: auditGeneratedMetadata(seed, instance.sourceSeed, { optionTopology: "EQUATION_OPTIONS" }),
  };
}

function wholeSwap(seed: number, salt: number) {
  for (let attempt = 0; attempt < 4000; attempt += 1) {
    const sourceSeed = (seed * 1031 + attempt * 6247 + salt) >>> 0;
    const a = auditInt(sourceSeed, salt + 1, 12, 58);
    const b = auditInt(sourceSeed, salt + 2, 2, 12);
    const c = auditInt(sourceSeed, salt + 3, 2, 16);
    if (new Set([a, b, c]).size !== 3) continue;
    const expression = `${a} + ${b} × ${c}`;
    const pair = [String(a), String(b)] as const;
    const transformed = swapWholeNumbers(expression, pair[0], pair[1]);
    const answer = auditIntegerAnswer(transformed);
    const original = auditIntegerAnswer(expression);
    const alternate = auditIntegerAnswer(swapWholeNumbers(expression, String(a), String(c)));
    if (!answer || !original || !alternate || new Set([answer, original, alternate]).size !== 3) continue;
    return { expression, pair, transformed, answer, original, alternate, sourceSeed };
  }
  throw new Error(`OPS whole-number runtime could not build seed ${seed}.`);
}

function generate021(seed: number): ApprovedOpsQuestion {
  const instance = wholeSwap(seed, 380);
  const options = auditDistinctOptions(instance.answer, [
    { value: instance.original, errorLabel: "WHOLE_NUMBER_SWAP_NOT_APPLIED" },
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
    metadata: auditGeneratedMetadata(seed, instance.sourceSeed, { numberIdentity: "COMPLETE_TOKEN" }),
  };
}

function generate022(seed: number): ApprovedOpsQuestion {
  const instance = wholeSwap(seed, 400);
  const values = [instance.answer, instance.original, instance.alternate, String(Number(instance.answer) + 1)];
  if (new Set(values).size !== 4) return generate022(seed + 100019);
  const answer = `${instance.expression} = ${instance.answer}`;
  const options: OpsPilotOption[] = auditRotate(values.map((value) => ({ value: `${instance.expression} = ${value}`, errorLabel: value === instance.answer ? null : "FALSE_AFTER_WHOLE_NUMBER_SWAP" })), seed);
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
    metadata: auditGeneratedMetadata(seed, instance.sourceSeed, { optionTopology: "EQUATION_OPTIONS", numberIdentity: "COMPLETE_TOKEN" }),
  };
}

function visibleDigitPairs(statement: string): readonly (readonly [string, string])[] {
  const digits = [...new Set(statement.match(/\d/gu) ?? [])].filter((digit) => digit !== "0").sort();
  const pairs: Array<readonly [string, string]> = [];
  for (let left = 0; left < digits.length; left += 1) {
    for (let right = left + 1; right < digits.length; right += 1) pairs.push([digits[left]!, digits[right]!] as const);
  }
  return pairs;
}

function generate023(seed: number): ApprovedOpsQuestion {
  for (let attempt = 0; attempt < 12000; attempt += 1) {
    const sourceSeed = (seed * 1033 + attempt * 6263 + 420) >>> 0;
    const tens = auditInt(sourceSeed, 421, 2, 8);
    const units = auditInt(sourceSeed, 422, 1, 9);
    const addend = auditInt(sourceSeed, 423, 1, 9);
    if (new Set([String(tens), String(units), String(addend)]).size < 3) continue;
    const left = tens * 10 + units;
    const result = left + addend;
    const trueEquation = `${left} + ${addend} = ${result}`;
    const pair = [String(units), String(addend)] as const;
    const printed = swapDigits(trueEquation, pair[0], pair[1]);
    if (printed === trueEquation) continue;
    const candidates = visibleDigitPairs(printed);
    const survivors = candidates.filter((candidate) => auditRelationTrue(swapDigits(printed, candidate[0], candidate[1])));
    if (survivors.length !== 1 || survivors[0]![0] !== pair[0] || survivors[0]![1] !== pair[1]) continue;
    const wrong = candidates.filter((candidate) => candidate[0] !== pair[0] || candidate[1] !== pair[1]).slice(0, 3);
    if (wrong.length < 3) continue;
    const answer = `${pair[0]} ↔ ${pair[1]}`;
    const options: OpsPilotOption[] = auditRotate([{ value: answer, errorLabel: null }, ...wrong.map((candidate) => ({ value: `${candidate[0]} ↔ ${candidate[1]}`, errorLabel: "WRONG_DIGIT_IDENTITY_PAIR" }))], seed);
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
      metadata: auditGeneratedMetadata(seed, sourceSeed, { digitScope: "GLOBAL_IDENTITY", leadingZeroPolicy: "REJECT" }),
    };
  }
  throw new Error(`OPS-CAND-023 could not build a unique digit-repair question for seed ${seed}.`);
}

function digitSwap(seed: number, salt: number) {
  for (let attempt = 0; attempt < 6000; attempt += 1) {
    const sourceSeed = (seed * 1039 + attempt * 6271 + salt) >>> 0;
    const tens = auditInt(sourceSeed, salt + 1, 2, 8);
    const units = auditInt(sourceSeed, salt + 2, 1, 9);
    const other = auditInt(sourceSeed, salt + 3, 1, 9);
    if (new Set([String(tens), String(units), String(other)]).size < 3) continue;
    const factor = auditInt(sourceSeed, salt + 4, 2, 7);
    const expression = `${tens}${units} + ${other} × ${factor}`;
    const pair = [String(units), String(other)] as const;
    const transformed = swapDigits(expression, pair[0], pair[1]);
    const answer = auditIntegerAnswer(transformed);
    const original = auditIntegerAnswer(expression);
    const alternate = auditIntegerAnswer(swapDigits(expression, String(tens), String(other)));
    if (!answer || !original || !alternate || new Set([answer, original, alternate]).size !== 3) continue;
    return { expression, pair, transformed, answer, original, alternate, sourceSeed };
  }
  throw new Error(`OPS digit-swap runtime could not build seed ${seed}.`);
}

function generate024(seed: number): ApprovedOpsQuestion {
  const instance = digitSwap(seed, 450);
  const options = auditDistinctOptions(instance.answer, [
    { value: instance.original, errorLabel: "DIGIT_INTERCHANGE_NOT_APPLIED" },
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
    metadata: auditGeneratedMetadata(seed, instance.sourceSeed, { digitScope: "GLOBAL_IDENTITY", leadingZeroPolicy: "REJECT" }),
  };
}

function generate025(seed: number): ApprovedOpsQuestion {
  const instance = digitSwap(seed, 470);
  const values = [instance.answer, instance.original, instance.alternate, String(Number(instance.answer) + 1)];
  if (new Set(values).size !== 4) return generate025(seed + 100043);
  const answer = `${instance.expression} = ${instance.answer}`;
  const options: OpsPilotOption[] = auditRotate(values.map((value) => ({ value: `${instance.expression} = ${value}`, errorLabel: value === instance.answer ? null : "FALSE_AFTER_GLOBAL_DIGIT_SWAP" })), seed);
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
    metadata: auditGeneratedMetadata(seed, instance.sourceSeed, { optionTopology: "EQUATION_OPTIONS", digitScope: "GLOBAL_IDENTITY" }),
  };
}

function hiddenMapping(seed: number, salt: number) {
  for (let attempt = 0; attempt < 3000; attempt += 1) {
    const sourceSeed = (seed * 1049 + attempt * 6287 + salt) >>> 0;
    const x = auditInt(sourceSeed, salt + 1, 8, 90);
    const y = auditInt(sourceSeed, salt + 2, 2, Math.min(28, x - 2));
    const p = auditInt(sourceSeed, salt + 3, 8, 75);
    const q = auditInt(sourceSeed, salt + 4, 2, Math.min(24, p - 1));
    const targetA = auditInt(sourceSeed, salt + 5, 5, 55);
    const targetB = auditInt(sourceSeed, salt + 6, 2, 24);
    const targetC = auditInt(sourceSeed, salt + 7, 1, 18);
    const target = `${targetA} M ${targetB} N ${targetC}`;
    const transformed = `${targetA} + ${targetB} − ${targetC}`;
    const answer = auditIntegerAnswer(transformed);
    if (!answer) continue;
    return { x, y, p, q, mResult: x + y, nResult: p - q, target, transformed, answer, sourceSeed };
  }
  throw new Error(`OPS hidden mapping runtime could not build seed ${seed}.`);
}

function generate030(seed: number): ApprovedOpsQuestion {
  const instance = hiddenMapping(seed, 500);
  const numeric = Number(instance.answer);
  const options: OpsPilotOption[] = auditRotate([
    { value: instance.answer, errorLabel: null },
    { value: String(numeric + 1), errorLabel: "ARITHMETIC_AFTER_INFERENCE_ERROR" },
    { value: String(numeric - 1), errorLabel: "MISREAD_ONE_HIDDEN_OPERATOR" },
    { value: String(-numeric), errorLabel: "SIGN_ERROR_AFTER_INFERENCE" },
  ], seed);
  if (new Set(options.map((option) => option.value)).size !== 4) return generate030(seed + 100057);
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
    metadata: auditGeneratedMetadata(seed, instance.sourceSeed, { evidenceCount: 2, inferredMappingCount: 1 }),
  };
}

function generate032(seed: number): ApprovedOpsQuestion {
  const instance = hiddenMapping(seed, 530);
  const numeric = Number(instance.answer);
  const values = [instance.answer, String(numeric + 1), String(numeric - 1), String(-numeric)];
  if (new Set(values).size !== 4) return generate032(seed + 100069);
  const answer = `${instance.target} = ${instance.answer}`;
  const options: OpsPilotOption[] = auditRotate(values.map((value) => ({ value: `${instance.target} = ${value}`, errorLabel: value === instance.answer ? null : "FALSE_AFTER_INFERRED_MAPPING" })), seed);
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
    metadata: auditGeneratedMetadata(seed, instance.sourceSeed, { optionTopology: "EQUATION_OPTIONS", evidenceCount: 2 }),
  };
}

const BUILDERS: Partial<Record<OpsApprovedCandidateId, (seed: number) => ApprovedOpsQuestion>> = {
  "OPS-CAND-014": generate014,
  "OPS-CAND-015": generate015,
  "OPS-CAND-017": generate017,
  "OPS-CAND-019": generate019,
  "OPS-CAND-021": generate021,
  "OPS-CAND-022": generate022,
  "OPS-CAND-023": generate023,
  "OPS-CAND-024": generate024,
  "OPS-CAND-025": generate025,
  "OPS-CAND-030": generate030,
  "OPS-CAND-032": generate032,
};

export function supportsAuditGeneratedInterchangeCandidate(candidateId: OpsApprovedCandidateId): candidateId is SupportedInterchangeCandidate {
  return Boolean(BUILDERS[candidateId]);
}

export function generateAuditInterchangeCandidate(candidateId: SupportedInterchangeCandidate, seed: number): ApprovedOpsQuestion {
  return BUILDERS[candidateId]!(seed);
}

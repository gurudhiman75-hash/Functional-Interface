import type { ApprovedOpsQuestion } from "./approved-teaching-entry";
import { arithmeticTrace, relationTrace, swapOperatorPairs, swapWholeNumbers, type TeachingStep } from "./approved-teaching-helpers";
import type { OpsPilotOption } from "./representative-pilots";
import {
  AUDIT_OPERATOR_PAIRS,
  auditGeneratedMetadata,
  auditInt,
  auditIntegerAnswer,
  auditRotate,
  type AuditOperatorPair,
} from "./audit-generated-foundation";

type CompoundInstance = {
  expression: string;
  operatorPair: AuditOperatorPair;
  numberPair: readonly [string, string];
  transformedExpression: string;
  originalAnswer: string;
  operatorOnlyAnswer: string;
  numberOnlyAnswer: string;
  answer: string;
  sourceSeed: number;
};

function buildCompoundInstance(seed: number): CompoundInstance {
  for (let attempt = 0; attempt < 5000; attempt += 1) {
    const sourceSeed = (seed * 1009 + attempt * 9176 + 37) >>> 0;
    const a = auditInt(sourceSeed, 1, 6, 28);
    const b = auditInt(sourceSeed, 2, 2, 12);
    const c = auditInt(sourceSeed, 3, 6, 28);
    const d = auditInt(sourceSeed, 4, 2, 12);
    const e = auditInt(sourceSeed, 5, 2, 20);
    if (new Set([a, b, c, d, e]).size !== 5) continue;
    const operatorPair = AUDIT_OPERATOR_PAIRS[auditInt(sourceSeed, 6, 0, AUDIT_OPERATOR_PAIRS.length - 1)]!;
    const numberPair = [String(a), String(c)] as const;
    const expression = `${a} × ${b} + ${c} ÷ ${d} − ${e}`;
    const operatorOnly = swapOperatorPairs(expression, [operatorPair]);
    const numberOnly = swapWholeNumbers(expression, numberPair[0], numberPair[1]);
    const transformedExpression = swapWholeNumbers(operatorOnly, numberPair[0], numberPair[1]);
    const originalAnswer = auditIntegerAnswer(expression);
    const operatorOnlyAnswer = auditIntegerAnswer(operatorOnly);
    const numberOnlyAnswer = auditIntegerAnswer(numberOnly);
    const answer = auditIntegerAnswer(transformedExpression);
    if (!originalAnswer || !operatorOnlyAnswer || !numberOnlyAnswer || !answer) continue;
    if (new Set([answer, operatorOnlyAnswer, numberOnlyAnswer, originalAnswer]).size !== 4) continue;
    return { expression, operatorPair, numberPair, transformedExpression, originalAnswer, operatorOnlyAnswer, numberOnlyAnswer, answer, sourceSeed };
  }
  throw new Error(`OPS compound runtime could not build seed ${seed}.`);
}

function commonSteps(instance: CompoundInstance): readonly TeachingStep[] {
  return [
    { label: "Write both operator replacements", expression: `${instance.operatorPair[0]} → ${instance.operatorPair[1]}; ${instance.operatorPair[1]} → ${instance.operatorPair[0]}`, result: "Both operators are interchanged simultaneously." },
    { label: "Write both complete-number replacements", expression: `${instance.numberPair[0]} → ${instance.numberPair[1]}; ${instance.numberPair[1]} → ${instance.numberPair[0]}`, result: "Only complete number tokens are exchanged." },
    { label: "Apply both changes to the original expression", expression: instance.expression, result: instance.transformedExpression },
    ...arithmeticTrace(instance.transformedExpression).steps,
  ];
}

function numericOptions(instance: CompoundInstance, seed: number): readonly OpsPilotOption[] {
  return auditRotate([
    { value: instance.answer, errorLabel: null },
    { value: instance.operatorOnlyAnswer, errorLabel: "APPLIED_OPERATOR_SWAP_ONLY" },
    { value: instance.numberOnlyAnswer, errorLabel: "APPLIED_NUMBER_SWAP_ONLY" },
    { value: instance.originalAnswer, errorLabel: "IGNORED_BOTH_INTERCHANGES" },
  ], seed);
}

export function generateAuditCompoundCandidate(candidateId: "OPS-CAND-028" | "OPS-CAND-029", seed: number): ApprovedOpsQuestion {
  const instance = buildCompoundInstance(seed);
  if (candidateId === "OPS-CAND-028") {
    const options = numericOptions(instance, seed);
    return {
      candidateId, checkpointId: "OPS-CP-008", seed, locale: "en-IN",
      taskKind: "EVALUATE_AFTER_GIVEN_INTERCHANGE", solveMode: "evaluateAfterSpecifiedCompoundSwap", renderer: "STRUCTURED_TEXT",
      stem: `Interchange ${instance.operatorPair[0]} and ${instance.operatorPair[1]}, and interchange the complete numbers ${instance.numberPair[0]} and ${instance.numberPair[1]}, throughout ${instance.expression}. What is the resulting value?`,
      options, correctIndex: options.findIndex((option) => option.errorLabel === null), answer: instance.answer,
      explanation: { ruleStatement: "Apply the prescribed two-way operator interchange and complete-number interchange to the same original expression, then evaluate the fully transformed expression in normal precedence order.", steps: commonSteps(instance), conclusion: `Therefore, the resulting value is ${instance.answer}.` },
      proof: { unique: true, solverRoute: "GENERATED_PRESCRIBED_OPERATOR_AND_WHOLE_NUMBER_TRANSFORMATION", eligibleCandidateCount: 4, survivingCandidateCount: 1, semanticFingerprint: `OPS-CAND-028:${instance.expression}:${instance.transformedExpression}:${instance.answer}` },
      metadata: auditGeneratedMetadata(seed, instance.sourceSeed, { compoundSubtype: "OPERATOR_AND_WHOLE_NUMBER", bothOperatorsVisible: true, bothWholeNumbersVisible: true, misconceptionDistractorsGrounded: true }),
    };
  }

  const answer = `${instance.expression} = ${instance.answer}`;
  const options: OpsPilotOption[] = auditRotate([
    { value: answer, errorLabel: null },
    { value: `${instance.expression} = ${instance.operatorOnlyAnswer}`, errorLabel: "APPLIED_OPERATOR_SWAP_ONLY" },
    { value: `${instance.expression} = ${instance.numberOnlyAnswer}`, errorLabel: "APPLIED_NUMBER_SWAP_ONLY" },
    { value: `${instance.expression} = ${instance.originalAnswer}`, errorLabel: "IGNORED_BOTH_INTERCHANGES" },
  ], seed);
  const transformedEquation = `${instance.transformedExpression} = ${instance.answer}`;
  const relation = relationTrace(transformedEquation);
  return {
    candidateId, checkpointId: "OPS-CP-008", seed, locale: "en-IN",
    taskKind: "IDENTIFY_CORRECT_EQUATION_AFTER_INTERCHANGE", solveMode: "selectEquationByTruthAfterSpecifiedCompoundSwap", renderer: "TABLE_OR_GRID",
    stem: `After interchanging ${instance.operatorPair[0]} with ${instance.operatorPair[1]} and the complete numbers ${instance.numberPair[0]} with ${instance.numberPair[1]} in every option, select the true equation.`,
    options, correctIndex: options.findIndex((option) => option.errorLabel === null), answer,
    explanation: { ruleStatement: "Apply the full prescribed operator-and-complete-number transformation independently to every printed equation, calculate the transformed left side and select the unique matching right-hand side.", steps: [...commonSteps(instance), { label: "Compare the transformed value with the option right-hand sides", expression: transformedEquation, result: `The transformed equation is ${relation.truth ? "true" : "false"}; only the option ending in ${instance.answer} matches.` }], conclusion: `Hence, ${answer} is the correct printed option.` },
    proof: { unique: true, solverRoute: "GENERATED_PRESCRIBED_COMPOUND_OPTION_TRUTH", eligibleCandidateCount: 4, survivingCandidateCount: 1, semanticFingerprint: `OPS-CAND-029:${instance.expression}:${transformedEquation}` },
    metadata: auditGeneratedMetadata(seed, instance.sourceSeed, { compoundSubtype: "OPERATOR_AND_WHOLE_NUMBER", optionTopology: "EQUATION_OPTIONS", misconceptionDistractorsGrounded: true }),
  };
}

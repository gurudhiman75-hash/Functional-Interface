import type { ApprovedOpsQuestion } from "./approved-teaching-entry";
import type { OpsPilotOption } from "./representative-pilots";
import {
  auditGeneratedMetadata,
  auditInt,
  auditIntegerAnswer,
  auditMappingKey,
  auditReplaceTokens,
  auditRotate,
} from "./audit-generated-foundation";

const FAMILIES = [
  { display: ["M", "N"] as const, semantic: ["×", "+"] as const, tokenFamily: "LETTER_TOKEN" },
  { display: ["P", "Q"] as const, semantic: ["−", "+"] as const, tokenFamily: "LETTER_TOKEN" },
  { display: ["#", "$" ] as const, semantic: ["×", "−"] as const, tokenFamily: "PUNCTUATION_TOKEN" },
  { display: ["◆", "●"] as const, semantic: ["−", "+"] as const, tokenFamily: "FONT_SAFE_SHAPE_TOKEN" },
] as const;

type Instance = {
  expression: string;
  transformed: string;
  answer: string;
  ordinary: string;
  firstOnly: string;
  secondOnly: string;
  mapping: readonly (readonly [string, string])[];
  tokenFamily: string;
  sourceSeed: number;
};

function build(seed: number, salt: number): Instance {
  for (let attempt = 0; attempt < 8000; attempt += 1) {
    const sourceSeed = (seed * 1061 + attempt * 6323 + salt) >>> 0;
    const family = FAMILIES[auditInt(sourceSeed, salt + 1, 0, FAMILIES.length - 1)]!;
    const a = auditInt(sourceSeed, salt + 2, 5, 42);
    const b = auditInt(sourceSeed, salt + 3, 2, 14);
    const c = auditInt(sourceSeed, salt + 4, 2, 20);
    const mapping = [[family.display[0], family.semantic[0]], [family.display[1], family.semantic[1]]] as const;
    const defaults = [[family.display[0], "+"], [family.display[1], "×"]] as const;
    const expression = `${a} ${family.display[0]} ${b} ${family.display[1]} ${c}`;
    const transformed = auditReplaceTokens(expression, mapping);
    const ordinaryExpression = auditReplaceTokens(expression, defaults);
    const firstOnlyExpression = auditReplaceTokens(expression, [mapping[0], defaults[1]]);
    const secondOnlyExpression = auditReplaceTokens(expression, [defaults[0], mapping[1]]);
    const answer = auditIntegerAnswer(transformed);
    const ordinary = auditIntegerAnswer(ordinaryExpression);
    const firstOnly = auditIntegerAnswer(firstOnlyExpression);
    const secondOnly = auditIntegerAnswer(secondOnlyExpression);
    if (!answer || !ordinary || !firstOnly || !secondOnly) continue;
    if (new Set([answer, ordinary, firstOnly, secondOnly]).size !== 4) continue;
    return { expression, transformed, answer, ordinary, firstOnly, secondOnly, mapping, tokenFamily: family.tokenFamily, sourceSeed };
  }
  throw new Error(`OPS arbitrary-token runtime could not build seed ${seed}.`);
}

function options(instance: Instance, seed: number, equationMode: boolean): readonly OpsPilotOption[] {
  const values: OpsPilotOption[] = [
    { value: instance.answer, errorLabel: null },
    { value: instance.ordinary, errorLabel: "USED_DEFAULT_TOKEN_MEANINGS" },
    { value: instance.firstOnly, errorLabel: "APPLIED_ONLY_FIRST_TOKEN_MEANING" },
    { value: instance.secondOnly, errorLabel: "APPLIED_ONLY_SECOND_TOKEN_MEANING" },
  ];
  return auditRotate(values, seed).map((entry) => equationMode ? { ...entry, value: `${instance.expression} = ${entry.value}` } : entry);
}

export function generateAuditArbitraryCandidate(candidateId: "OPS-CAND-004" | "OPS-CAND-007", seed: number): ApprovedOpsQuestion {
  const instance = build(seed, candidateId === "OPS-CAND-004" ? 610 : 630);
  const equationMode = candidateId === "OPS-CAND-007";
  const builtOptions = options(instance, seed, equationMode);
  const answer = equationMode ? `${instance.expression} = ${instance.answer}` : instance.answer;
  return {
    candidateId,
    checkpointId: "OPS-CP-002",
    seed,
    locale: "en-IN",
    taskKind: equationMode ? "IDENTIFY_EQUATION_AFTER_MAPPING" : "EVALUATE_AFTER_GIVEN_MAPPING",
    solveMode: equationMode ? "selectEquationByTruthAfterArbitraryTokenMapping" : "evaluateAfterGivenArbitraryTokenMapping",
    renderer: equationMode ? "TABLE_OR_GRID" : "STRUCTURED_TEXT",
    stem: equationMode
      ? `If ${auditMappingKey(instance.mapping)}, select the true equation.`
      : `If ${auditMappingKey(instance.mapping)}, evaluate ${instance.expression}.`,
    options: builtOptions,
    correctIndex: builtOptions.findIndex((option) => option.errorLabel === null),
    answer,
    explanation: equationMode ? {
      ruleStatement: "Use the same arbitrary-token meaning key for the common expression, evaluate the transformed expression once and select the equation whose right-hand side matches that result.",
      steps: [
        { label: "Read the complete meaning key", expression: auditMappingKey(instance.mapping), result: "Use this one key for every option." },
        { label: "Transform the common option expression", expression: instance.expression, result: instance.transformed },
        { label: "Select the matching equation", expression: `${instance.transformed} = ${instance.answer}`, result: answer },
      ],
      conclusion: `Hence, ${answer} is the only true equation.`,
    } : {
      ruleStatement: "Treat each arbitrary token as the arithmetic operation stated in the key, replace every token first and then evaluate the transformed expression normally.",
      steps: [
        { label: "Read the meaning key", expression: auditMappingKey(instance.mapping), result: "Keep the two token meanings separate." },
        { label: "Replace every occurrence", expression: instance.expression, result: instance.transformed },
        { label: "Evaluate the transformed expression", expression: instance.transformed, result: instance.answer },
      ],
      conclusion: `Therefore, the required value is ${instance.answer}.`,
    },
    proof: {
      unique: true,
      solverRoute: equationMode ? "GENERATED_ARBITRARY_TOKEN_OPTION_TRUTH" : "GENERATED_ARBITRARY_TOKEN_MAPPING_EVALUATOR",
      eligibleCandidateCount: 4,
      survivingCandidateCount: 1,
      semanticFingerprint: `${candidateId}:${instance.tokenFamily}:${instance.transformed}:${instance.answer}`,
    },
    metadata: auditGeneratedMetadata(seed, instance.sourceSeed, { tokenFamily: instance.tokenFamily, misconceptionDistractorsGrounded: true }),
  };
}

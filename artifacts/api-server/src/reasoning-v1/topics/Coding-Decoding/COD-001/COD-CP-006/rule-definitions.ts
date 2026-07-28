import { COD_CP005_RULES } from "../COD-CP-005/rule-definitions";
import type { CodCp006RuleContext, CodCp006RuleId } from "./types";

export interface CodCp006RuleDefinition {
  ruleId: CodCp006RuleId;
  priority: 4;
  contextDomain: readonly CodCp006RuleContext[];
  studentDescription: string;
  stageOrderNormalized: boolean;
}

const reverseIndexedContexts: readonly CodCp006RuleContext[] = [1, 2].flatMap((baseShift) => [
  { baseShift: baseShift as 1 | 2, direction: 1 as const },
  { baseShift: baseShift as 1 | 2, direction: -1 as const },
]);

const pairAlternatingContexts: readonly CodCp006RuleContext[] = [1, 2, 3].flatMap((magnitude) => [
  { magnitude: magnitude as 1 | 2 | 3, firstDirection: 1 as const },
  { magnitude: magnitude as 1 | 2 | 3, firstDirection: -1 as const },
]);

const halfOddEvenContexts: readonly CodCp006RuleContext[] = [
  { oddShift: 1, evenShift: 2 },
  { oddShift: -1, evenShift: -2 },
  { oddShift: 2, evenShift: 1 },
  { oddShift: -2, evenShift: -1 },
  { oddShift: 1, evenShift: -2 },
  { oddShift: -1, evenShift: 2 },
  { oddShift: 2, evenShift: -1 },
  { oddShift: -2, evenShift: 1 },
];

const classShiftContexts = [
  { vowelShift: 1, consonantShift: -1 },
  { vowelShift: -1, consonantShift: 1 },
  { vowelShift: 2, consonantShift: -1 },
  { vowelShift: -2, consonantShift: 1 },
  { vowelShift: 1, consonantShift: -2 },
  { vowelShift: -1, consonantShift: 2 },
] as const;

const rotateClassContexts: readonly CodCp006RuleContext[] = ([
  { rotationDirection: "LEFT" as const, rotationAmount: 1 as const },
  { rotationDirection: "RIGHT" as const, rotationAmount: 1 as const },
  { rotationDirection: "LEFT" as const, rotationAmount: 2 as const },
  { rotationDirection: "RIGHT" as const, rotationAmount: 2 as const },
] as const).flatMap((rotation) => classShiftContexts.map((shifts) => ({ ...rotation, ...shifts })));

const oppositePermutationContexts: readonly CodCp006RuleContext[] = COD_CP005_RULES.flatMap((rule) =>
  rule.contextDomain.map((context) => ({
    permutationRuleId: rule.ruleId,
    permutationContext: context,
  })),
);

const transformRankContexts: readonly CodCp006RuleContext[] = [
  { transformCheckpoint: "COD-CP-003", transformRuleId: "UNIFORM_CYCLIC_SHIFT", transformContext: { shift: 2 }, separator: "-" },
  { transformCheckpoint: "COD-CP-003", transformRuleId: "UNIFORM_CYCLIC_SHIFT", transformContext: { shift: -2 }, separator: "-" },
  { transformCheckpoint: "COD-CP-003", transformRuleId: "OPPOSITE_ALPHABET_MAP", transformContext: {}, separator: "-" },
  { transformCheckpoint: "COD-CP-004", transformRuleId: "INCREMENTAL_FORWARD_SHIFT", transformContext: { baseShift: 1 }, separator: "-" },
  { transformCheckpoint: "COD-CP-004", transformRuleId: "INCREMENTAL_FORWARD_SHIFT", transformContext: { baseShift: 2 }, separator: "-" },
  { transformCheckpoint: "COD-CP-004", transformRuleId: "INCREMENTAL_BACKWARD_SHIFT", transformContext: { baseShift: 1 }, separator: "-" },
  { transformCheckpoint: "COD-CP-004", transformRuleId: "INCREMENTAL_BACKWARD_SHIFT", transformContext: { baseShift: 2 }, separator: "-" },
  { transformCheckpoint: "COD-CP-004", transformRuleId: "ALTERNATING_SIGNED_SHIFT", transformContext: { magnitude: 1, firstDirection: 1 }, separator: "-" },
  { transformCheckpoint: "COD-CP-004", transformRuleId: "ALTERNATING_SIGNED_SHIFT", transformContext: { magnitude: 2, firstDirection: -1 }, separator: "-" },
  { transformCheckpoint: "COD-CP-004", transformRuleId: "ODD_EVEN_POSITION_SHIFT", transformContext: { oddShift: 1, evenShift: 2 }, separator: "-" },
  { transformCheckpoint: "COD-CP-004", transformRuleId: "ODD_EVEN_POSITION_SHIFT", transformContext: { oddShift: -1, evenShift: -2 }, separator: "-" },
  { transformCheckpoint: "COD-CP-004", transformRuleId: "VOWEL_CONSONANT_CLASS_SHIFT", transformContext: { vowelShift: 1, consonantShift: -1 }, separator: "-" },
  { transformCheckpoint: "COD-CP-004", transformRuleId: "VOWEL_CONSONANT_CLASS_SHIFT", transformContext: { vowelShift: -2, consonantShift: 1 }, separator: "-" },
  { transformCheckpoint: "COD-CP-004", transformRuleId: "ENDPOINT_INTERIOR_SHIFT", transformContext: { endpointShift: 1, interiorShift: 2 }, separator: "-" },
  { transformCheckpoint: "COD-CP-004", transformRuleId: "ENDPOINT_INTERIOR_SHIFT", transformContext: { endpointShift: -1, interiorShift: -2 }, separator: "-" },
];

export const COD_CP006_RULES: readonly CodCp006RuleDefinition[] = [
  {
    ruleId: "REVERSE_THEN_INDEXED_SHIFT",
    priority: 4,
    contextDomain: reverseIndexedContexts,
    studentDescription: "reverse the word and then shift successive code positions by increasing amounts",
    stageOrderNormalized: false,
  },
  {
    ruleId: "PAIR_SWAP_THEN_ALTERNATING_SHIFT",
    priority: 4,
    contextDomain: pairAlternatingContexts,
    studentDescription: "swap adjacent pairs and then apply alternating signed shifts",
    stageOrderNormalized: true,
  },
  {
    ruleId: "HALF_SWAP_THEN_ODD_EVEN_SHIFT",
    priority: 4,
    contextDomain: halfOddEvenContexts,
    studentDescription: "interchange equal halves and then use separate odd- and even-position shifts",
    stageOrderNormalized: false,
  },
  {
    ruleId: "ROTATE_THEN_CLASS_SHIFT",
    priority: 4,
    contextDomain: rotateClassContexts,
    studentDescription: "rotate the positions and then shift vowels and consonants differently",
    stageOrderNormalized: true,
  },
  {
    ruleId: "OPPOSITE_MAP_WITH_POSITION_PERMUTATION",
    priority: 4,
    contextDomain: oppositePermutationContexts,
    studentDescription: "replace letters by opposite alphabet partners and apply a registered position permutation",
    stageOrderNormalized: true,
  },
  {
    ruleId: "TRANSFORM_THEN_RANK_SEQUENCE",
    priority: 4,
    contextDomain: transformRankContexts,
    studentDescription: "transform each letter and then write the transformed alphabet ranks",
    stageOrderNormalized: false,
  },
];

export function getCodCp006Rule(ruleId: CodCp006RuleId): CodCp006RuleDefinition {
  const found = COD_CP006_RULES.find((entry) => entry.ruleId === ruleId);
  if (!found) throw new Error(`Unknown COD-CP-006 rule '${ruleId}'`);
  return found;
}

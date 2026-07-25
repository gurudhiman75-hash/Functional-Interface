import type { CodCp004RuleContext, CodCp004RuleId } from "./types";

export interface CodCp004RuleDefinition {
  ruleId: CodCp004RuleId;
  priority: number;
  contextDomain: readonly CodCp004RuleContext[];
  studentDescription: string;
}

const incrementalContexts = [1, 2, 3].map((baseShift) => ({ baseShift }));
const alternatingContexts = [1, 2, 3, 4].flatMap((magnitude) => [
  { magnitude, firstDirection: 1 as const },
  { magnitude, firstDirection: -1 as const },
]);
const oddEvenContexts = [1, 2, 3, 4].flatMap((oddMagnitude) =>
  [1, 2, 3, 4]
    .filter((evenMagnitude) => evenMagnitude !== oddMagnitude)
    .flatMap((evenMagnitude) => [
      { oddShift: oddMagnitude, evenShift: evenMagnitude },
      { oddShift: -oddMagnitude, evenShift: -evenMagnitude },
    ]),
);
const vowelConsonantContexts = [1, 2, 3].flatMap((vowelMagnitude) =>
  [1, 2, 3].flatMap((consonantMagnitude) => [
    { vowelShift: vowelMagnitude, consonantShift: -consonantMagnitude },
    { vowelShift: -vowelMagnitude, consonantShift: consonantMagnitude },
  ]),
);
const endpointInteriorContexts = [1, 2, 3, 4].flatMap((endpointMagnitude) =>
  [1, 2, 3, 4]
    .filter((interiorMagnitude) => interiorMagnitude !== endpointMagnitude)
    .flatMap((interiorMagnitude) => [
      { endpointShift: endpointMagnitude, interiorShift: interiorMagnitude },
      { endpointShift: -endpointMagnitude, interiorShift: -interiorMagnitude },
    ]),
);

export const COD_CP004_RULES: readonly CodCp004RuleDefinition[] = [
  {
    ruleId: "INCREMENTAL_FORWARD_SHIFT",
    priority: 2,
    contextDomain: incrementalContexts,
    studentDescription: "move successive letters forward by increasing amounts",
  },
  {
    ruleId: "INCREMENTAL_BACKWARD_SHIFT",
    priority: 2,
    contextDomain: incrementalContexts,
    studentDescription: "move successive letters backward by increasing amounts",
  },
  {
    ruleId: "ALTERNATING_SIGNED_SHIFT",
    priority: 2,
    contextDomain: alternatingContexts,
    studentDescription: "alternate forward and backward movement of one fixed magnitude",
  },
  {
    ruleId: "ODD_EVEN_POSITION_SHIFT",
    priority: 2,
    contextDomain: oddEvenContexts,
    studentDescription: "use one shift at odd positions and a different same-direction shift at even positions",
  },
  {
    ruleId: "VOWEL_CONSONANT_CLASS_SHIFT",
    priority: 2,
    contextDomain: vowelConsonantContexts,
    studentDescription: "apply different shifts to vowels and consonants",
  },
  {
    ruleId: "ENDPOINT_INTERIOR_SHIFT",
    priority: 2,
    contextDomain: endpointInteriorContexts,
    studentDescription: "apply one shift to the first and last letters and another to interior letters",
  },
];

export function getCodCp004Rule(ruleId: CodCp004RuleId): CodCp004RuleDefinition {
  const rule = COD_CP004_RULES.find((entry) => entry.ruleId === ruleId);
  if (!rule) throw new Error(`Unknown COD-CP-004 rule '${ruleId}'`);
  return rule;
}

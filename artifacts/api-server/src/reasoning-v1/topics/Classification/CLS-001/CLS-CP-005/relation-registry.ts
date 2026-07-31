import type {
  ClsCp005PairRuleId,
  ClsCp005PrototypeDefinition,
  ClsCp005PrototypeId,
  ClsCp005RuleId,
  ClsCp005TripleRuleId,
} from "./types";

export const CLS_CP005_PAIR_RULE_IDS: readonly ClsCp005PairRuleId[] = [
  "PAIR_SIGNED_DIFFERENCE",
  "PAIR_REDUCED_RATIO",
  "PAIR_SUM",
  "PAIR_PRODUCT",
  "PAIR_GCD",
  "PAIR_LCM",
  "PAIR_CONSECUTIVE_DIRECTION",
  "PAIR_SQUARE_DIRECTION",
  "PAIR_CUBE_DIRECTION",
  "PAIR_DIGIT_REVERSE_DIRECTION",
];

export const CLS_CP005_TRIPLE_RULE_IDS: readonly ClsCp005TripleRuleId[] = [
  "TRIPLE_SUM_OF_TWO_EQUALS_THIRD",
  "TRIPLE_PRODUCT_OF_TWO_EQUALS_THIRD",
  "TRIPLE_ARITHMETIC_PROGRESSION",
  "TRIPLE_GEOMETRIC_PROGRESSION",
  "TRIPLE_PYTHAGOREAN_DIRECTION",
  "TRIPLE_CONSECUTIVE_DIRECTION",
  "TRIPLE_SUM",
  "TRIPLE_PRODUCT",
];

export const CLS_CP005_RULE_IDS: readonly ClsCp005RuleId[] = [
  ...CLS_CP005_PAIR_RULE_IDS,
  ...CLS_CP005_TRIPLE_RULE_IDS,
];

export const CLS_CP005_PROTOTYPES: readonly ClsCp005PrototypeDefinition[] = [
  { prototypeId: "CLS-CP005-PROT-001", title: "Odd ordered pair by signed difference", task: "FIND_ODD_NUMBER_PAIR", arity: 2, allowedRuleIds: ["PAIR_SIGNED_DIFFERENCE"] },
  { prototypeId: "CLS-CP005-PROT-002", title: "Odd ordered pair by reduced ratio", task: "FIND_ODD_NUMBER_PAIR", arity: 2, allowedRuleIds: ["PAIR_REDUCED_RATIO"] },
  { prototypeId: "CLS-CP005-PROT-003", title: "Odd ordered pair by common sum", task: "FIND_ODD_NUMBER_PAIR", arity: 2, allowedRuleIds: ["PAIR_SUM"] },
  { prototypeId: "CLS-CP005-PROT-004", title: "Odd ordered pair by common product", task: "FIND_ODD_NUMBER_PAIR", arity: 2, allowedRuleIds: ["PAIR_PRODUCT"] },
  { prototypeId: "CLS-CP005-PROT-005", title: "Odd ordered pair by greatest common divisor", task: "FIND_ODD_NUMBER_PAIR", arity: 2, allowedRuleIds: ["PAIR_GCD"] },
  { prototypeId: "CLS-CP005-PROT-006", title: "Odd ordered pair by least common multiple", task: "FIND_ODD_NUMBER_PAIR", arity: 2, allowedRuleIds: ["PAIR_LCM"] },
  { prototypeId: "CLS-CP005-PROT-007", title: "Odd ordered consecutive pair", task: "FIND_ODD_NUMBER_PAIR", arity: 2, allowedRuleIds: ["PAIR_CONSECUTIVE_DIRECTION"] },
  { prototypeId: "CLS-CP005-PROT-008", title: "Odd ordered square pair", task: "FIND_ODD_NUMBER_PAIR", arity: 2, allowedRuleIds: ["PAIR_SQUARE_DIRECTION"] },
  { prototypeId: "CLS-CP005-PROT-009", title: "Odd ordered cube pair", task: "FIND_ODD_NUMBER_PAIR", arity: 2, allowedRuleIds: ["PAIR_CUBE_DIRECTION"] },
  { prototypeId: "CLS-CP005-PROT-010", title: "Odd ordered digit-reversal pair", task: "FIND_ODD_NUMBER_PAIR", arity: 2, allowedRuleIds: ["PAIR_DIGIT_REVERSE_DIRECTION"] },
  { prototypeId: "CLS-CP005-PROT-011", title: "Odd triple where two numbers add to the third", task: "FIND_ODD_NUMBER_TRIPLE", arity: 3, allowedRuleIds: ["TRIPLE_SUM_OF_TWO_EQUALS_THIRD"] },
  { prototypeId: "CLS-CP005-PROT-012", title: "Odd triple where two numbers multiply to the third", task: "FIND_ODD_NUMBER_TRIPLE", arity: 3, allowedRuleIds: ["TRIPLE_PRODUCT_OF_TWO_EQUALS_THIRD"] },
  { prototypeId: "CLS-CP005-PROT-013", title: "Odd arithmetic-progression triple", task: "FIND_ODD_NUMBER_TRIPLE", arity: 3, allowedRuleIds: ["TRIPLE_ARITHMETIC_PROGRESSION"] },
  { prototypeId: "CLS-CP005-PROT-014", title: "Odd geometric-progression triple", task: "FIND_ODD_NUMBER_TRIPLE", arity: 3, allowedRuleIds: ["TRIPLE_GEOMETRIC_PROGRESSION"] },
  { prototypeId: "CLS-CP005-PROT-015", title: "Odd Pythagorean triple", task: "FIND_ODD_NUMBER_TRIPLE", arity: 3, allowedRuleIds: ["TRIPLE_PYTHAGOREAN_DIRECTION"] },
  { prototypeId: "CLS-CP005-PROT-016", title: "Odd ordered consecutive triple", task: "FIND_ODD_NUMBER_TRIPLE", arity: 3, allowedRuleIds: ["TRIPLE_CONSECUTIVE_DIRECTION"] },
  { prototypeId: "CLS-CP005-PROT-017", title: "Odd triple by common total", task: "FIND_ODD_NUMBER_TRIPLE", arity: 3, allowedRuleIds: ["TRIPLE_SUM"] },
  { prototypeId: "CLS-CP005-PROT-018", title: "Odd triple by common product", task: "FIND_ODD_NUMBER_TRIPLE", arity: 3, allowedRuleIds: ["TRIPLE_PRODUCT"] },
  { prototypeId: "CLS-CP005-PROT-019", title: "Select the pair with the same internal rule", task: "SELECT_EQUIVALENT_NUMBER_SET", arity: 2, allowedRuleIds: CLS_CP005_PAIR_RULE_IDS },
  { prototypeId: "CLS-CP005-PROT-020", title: "Select the triple with the same internal rule", task: "SELECT_EQUIVALENT_NUMBER_SET", arity: 3, allowedRuleIds: CLS_CP005_TRIPLE_RULE_IDS },
];

export const CLS_CP005_PROTOTYPE_BY_ID = new Map<ClsCp005PrototypeId, ClsCp005PrototypeDefinition>(
  CLS_CP005_PROTOTYPES.map((prototype) => [prototype.prototypeId, prototype]),
);

export function isClsCp005PairRule(ruleId: ClsCp005RuleId): ruleId is ClsCp005PairRuleId {
  return (CLS_CP005_PAIR_RULE_IDS as readonly string[]).includes(ruleId);
}

export function isClsCp005TripleRule(ruleId: ClsCp005RuleId): ruleId is ClsCp005TripleRuleId {
  return (CLS_CP005_TRIPLE_RULE_IDS as readonly string[]).includes(ruleId);
}
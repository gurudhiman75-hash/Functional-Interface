export const SAP_CP001_DESIGN_SOLVE_MODES = [
  "evaluateFlatMixedOperationExpression",
  "evaluateMultiplicationDivisionLeftToRight",
  "evaluateAdditionSubtractionLeftToRight",
  "evaluateNestedParenthesesExpression",
  "evaluateMixedBracketExpression",
  "evaluateVinculumOrFractionBarGrouping",
  "evaluateExpressionWithUnaryNegative",
  "evaluateExpressionWithNegativeIntermediateValue",
  "evaluateExpressionWithOfMultiplication",
  "evaluateExpressionWithImplicitMultiplicationWhenUnambiguous",
  "evaluateExpressionWithRepeatedGrouping",
  "evaluateExpressionWithPowerBeforeArithmetic",
  "evaluateExpressionWithFactorialBeforeArithmetic",
  "compareResultsUnderTwoDifferentGroupings",
  "selectCorrectlyParenthesisedEquivalentExpression",
  "identifyFirstValidEvaluationStep",
  "identifyIncorrectPrecedenceStep",
  "findValueAfterOneDeclaredSubexpressionIsSimplified",
] as const;

export type SapCp001DesignSolveMode = (typeof SAP_CP001_DESIGN_SOLVE_MODES)[number];

export const SAP_CP001_AUTHORITY_MAP: Readonly<Record<SapCp001DesignSolveMode, string>> = Object.freeze({
  evaluateFlatMixedOperationExpression: "SAP-CP001-PROT-FLAT-MIXED-OPERATIONS",
  evaluateMultiplicationDivisionLeftToRight: "SAP-CP001-PROT-MULTIPLY-DIVIDE-LEFT-TO-RIGHT",
  evaluateAdditionSubtractionLeftToRight: "SAP-CP001-PROT-ADD-SUBTRACT-LEFT-TO-RIGHT",
  evaluateNestedParenthesesExpression: "SAP-CP001-PROT-NESTED-GROUPING",
  evaluateMixedBracketExpression: "SAP-CP001-PROT-NESTED-GROUPING",
  evaluateVinculumOrFractionBarGrouping: "SAP-CP001-PROT-VINCULUM-FRACTION-BAR-SCOPE",
  evaluateExpressionWithUnaryNegative: "SAP-CP001-PROT-SIGNED-ARITHMETIC",
  evaluateExpressionWithNegativeIntermediateValue: "SAP-CP001-PROT-NEGATIVE-INTERMEDIATE",
  evaluateExpressionWithOfMultiplication: "SAP-CP001-PROT-SCOPED-OF-MULTIPLICATION",
  evaluateExpressionWithImplicitMultiplicationWhenUnambiguous: "SAP-CP001-PROT-UNAMBIGUOUS-IMPLICIT-MULTIPLICATION",
  evaluateExpressionWithRepeatedGrouping: "SAP-CP001-PROT-REPEATED-GROUPING",
  evaluateExpressionWithPowerBeforeArithmetic: "SAP-CP001-PROT-POWER-BEFORE-ARITHMETIC",
  evaluateExpressionWithFactorialBeforeArithmetic: "SAP-CP001-PROT-FACTORIAL-BEFORE-ARITHMETIC",
  compareResultsUnderTwoDifferentGroupings: "SAP-CP001-PROT-COMPARE-DIFFERENT-GROUPINGS",
  selectCorrectlyParenthesisedEquivalentExpression: "SAP-CP001-PROT-SELECT-EQUIVALENT-GROUPING",
  identifyFirstValidEvaluationStep: "SAP-CP001-PROT-IDENTIFY-FIRST-VALID-STEP",
  identifyIncorrectPrecedenceStep: "SAP-CP001-PROT-IDENTIFY-INCORRECT-PRECEDENCE-STEP",
  findValueAfterOneDeclaredSubexpressionIsSimplified: "SAP-CP001-PROT-PARTIAL-SUBEXPRESSION-VALUE",
});

export const SAP_CP001_MERGE_SPLIT_DECISIONS = Object.freeze({
  nestedParenthesesAndMixedBrackets: "MERGED_TEMPORARY_AUTHORITY",
  fractionBarScopeVersusFractionArithmetic: "SPLIT_BY_PRIMARY_CHALLENGE",
  unaryNegativeVersusNegativeIntermediate: "RETAIN_SEPARATE_PENDING_EDITORIAL_AUDIT",
  nestedGroupingVersusRepeatedGrouping: "RETAIN_SEPARATE_PENDING_STRESS_AND_EDITORIAL_AUDIT",
  validStepVersusIncorrectStep: "RETAIN_SEPARATE_ANSWER_SEMANTICS",
  permanentQlAllocation: "BLOCKED_UNTIL_MANUAL_FREEZE",
} as const);

export const SAP_CP001_CURRENT_DISCOVERY_STATE = Object.freeze({
  designSolveModeCount: SAP_CP001_DESIGN_SOLVE_MODES.length,
  temporaryPrototypeCount: 17,
  permanentQlCount: 0,
  activePackageCount: 0,
  questionStudioDiscoverableCount: 0,
});

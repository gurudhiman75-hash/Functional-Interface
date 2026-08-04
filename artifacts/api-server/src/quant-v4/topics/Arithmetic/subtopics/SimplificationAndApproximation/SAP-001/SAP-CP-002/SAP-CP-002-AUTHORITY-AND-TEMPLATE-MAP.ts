import {
  SAP_CP002_WAVE01_PROTOTYPE_IDS,
  type SapCp002Wave01PrototypeId,
} from "./wave01/types";
import {
  SAP_CP002_COMPLETION_PROTOTYPE_IDS,
  type SapCp002CompletionPrototypeId,
} from "./completion/types";

export type SapCp002PrototypeId = SapCp002Wave01PrototypeId | SapCp002CompletionPrototypeId;

export const SAP_CP002_ALL_PROTOTYPE_IDS = Object.freeze([
  ...SAP_CP002_WAVE01_PROTOTYPE_IDS,
  ...SAP_CP002_COMPLETION_PROTOTYPE_IDS,
] as const);

export const SAP_CP002_DESIGN_SOLVE_MODES = [
  "evaluateFractionSumOrDifference",
  "evaluateFractionProductWithCancellation",
  "evaluateFractionDivisionByReciprocal",
  "evaluateMixedFractionOperationChain",
  "convertMixedNumbersThenEvaluate",
  "evaluateFractionOfFraction",
  "evaluateNestedComplexFraction",
  "evaluateContinuedFractionBounded",
  "evaluateFractionExpressionWithIntegerPart",
  "evaluateSignedFractionExpression",
  "evaluateFractionExpressionWithBrackets",
  "evaluateFractionExpressionWithDifferentDenominators",
  "evaluateProductOfFractionSumAndFractionDifference",
  "evaluateReciprocalExpression",
  "evaluateFractionComplementExpression",
  "findMissingNumeratorInFixedExpression",
  "findMissingDenominatorInFixedExpression",
  "findMissingFractionOperand",
  "compareTwoEvaluatedFractionExpressions",
  "selectEquivalentReducedFraction",
  "selectIncorrectFractionSimplificationStep",
] as const;

export type SapCp002DesignSolveMode = (typeof SAP_CP002_DESIGN_SOLVE_MODES)[number];

export const SAP_CP002_AUTHORITY_MAP: Readonly<Record<SapCp002DesignSolveMode, SapCp002PrototypeId>> = Object.freeze({
  evaluateFractionSumOrDifference: "SAP-CP002-PROT-FRACTION-SUM-DIFFERENCE",
  evaluateFractionProductWithCancellation: "SAP-CP002-PROT-FRACTION-PRODUCT-CANCELLATION",
  evaluateFractionDivisionByReciprocal: "SAP-CP002-PROT-FRACTION-DIVISION-RECIPROCAL",
  evaluateMixedFractionOperationChain: "SAP-CP002-PROT-MIXED-FRACTION-OPERATION-CHAIN",
  convertMixedNumbersThenEvaluate: "SAP-CP002-PROT-MIXED-NUMBERS-CONVERT-EVALUATE",
  evaluateFractionOfFraction: "SAP-CP002-PROT-FRACTION-OF-FRACTION",
  evaluateNestedComplexFraction: "SAP-CP002-PROT-NESTED-COMPLEX-FRACTION",
  evaluateContinuedFractionBounded: "SAP-CP002-PROT-BOUNDED-CONTINUED-FRACTION",
  evaluateFractionExpressionWithIntegerPart: "SAP-CP002-PROT-FRACTION-EXPRESSION-INTEGER-PART",
  evaluateSignedFractionExpression: "SAP-CP002-PROT-SIGNED-FRACTION-BRACKETS",
  evaluateFractionExpressionWithBrackets: "SAP-CP002-PROT-SIGNED-FRACTION-BRACKETS",
  evaluateFractionExpressionWithDifferentDenominators: "SAP-CP002-PROT-FRACTION-SUM-DIFFERENCE",
  evaluateProductOfFractionSumAndFractionDifference: "SAP-CP002-PROT-PRODUCT-SUM-DIFFERENCE",
  evaluateReciprocalExpression: "SAP-CP002-PROT-RECIPROCAL-EXPRESSION",
  evaluateFractionComplementExpression: "SAP-CP002-PROT-FRACTION-COMPLEMENT",
  findMissingNumeratorInFixedExpression: "SAP-CP002-PROT-MISSING-NUMERATOR",
  findMissingDenominatorInFixedExpression: "SAP-CP002-PROT-MISSING-DENOMINATOR",
  findMissingFractionOperand: "SAP-CP002-PROT-MISSING-FRACTION-OPERAND",
  compareTwoEvaluatedFractionExpressions: "SAP-CP002-PROT-COMPARE-EVALUATED-FRACTIONS",
  selectEquivalentReducedFraction: "SAP-CP002-PROT-SELECT-EQUIVALENT-REDUCED-FRACTION",
  selectIncorrectFractionSimplificationStep: "SAP-CP002-PROT-IDENTIFY-INCORRECT-FRACTION-STEP",
});

export const SAP_CP002_ENGLISH_TEMPLATE_IDS = [
  "SAP-CP002-TPL-FRACTION-SUM-DIFFERENCE",
  "SAP-CP002-TPL-FRACTION-PRODUCT-CANCELLATION",
  "SAP-CP002-TPL-FRACTION-DIVISION-RECIPROCAL",
  "SAP-CP002-TPL-MIXED-FRACTION-CHAIN-WITH-INTEGER-PART",
  "SAP-CP002-TPL-MIXED-NUMBER-CONVERSION",
  "SAP-CP002-TPL-FRACTION-OF-GROUPED-FRACTION",
  "SAP-CP002-TPL-NESTED-COMPLEX-FRACTION",
  "SAP-CP002-TPL-SIGNED-FRACTION-BRACKET-SCOPE",
  "SAP-CP002-TPL-PRODUCT-SUM-DIFFERENCE",
  "SAP-CP002-TPL-RECIPROCAL-EXPRESSION",
  "SAP-CP002-TPL-FRACTION-COMPLEMENT",
  "SAP-CP002-TPL-BOUNDED-CONTINUED-FRACTION",
  "SAP-CP002-TPL-MISSING-FRACTION-COMPONENT",
  "SAP-CP002-TPL-MISSING-FRACTION-OPERAND",
  "SAP-CP002-TPL-COMPARE-EVALUATED-FRACTIONS",
  "SAP-CP002-TPL-SELECT-EQUIVALENT-REDUCED-FRACTION",
  "SAP-CP002-TPL-IDENTIFY-INCORRECT-FRACTION-STEP",
] as const;

export type SapCp002EnglishTemplateId = (typeof SAP_CP002_ENGLISH_TEMPLATE_IDS)[number];

export const SAP_CP002_TEMPLATE_MAP: Readonly<Record<SapCp002PrototypeId, SapCp002EnglishTemplateId>> = Object.freeze({
  "SAP-CP002-PROT-FRACTION-SUM-DIFFERENCE": "SAP-CP002-TPL-FRACTION-SUM-DIFFERENCE",
  "SAP-CP002-PROT-FRACTION-PRODUCT-CANCELLATION": "SAP-CP002-TPL-FRACTION-PRODUCT-CANCELLATION",
  "SAP-CP002-PROT-FRACTION-DIVISION-RECIPROCAL": "SAP-CP002-TPL-FRACTION-DIVISION-RECIPROCAL",
  "SAP-CP002-PROT-MIXED-FRACTION-OPERATION-CHAIN": "SAP-CP002-TPL-MIXED-FRACTION-CHAIN-WITH-INTEGER-PART",
  "SAP-CP002-PROT-MIXED-NUMBERS-CONVERT-EVALUATE": "SAP-CP002-TPL-MIXED-NUMBER-CONVERSION",
  "SAP-CP002-PROT-FRACTION-OF-FRACTION": "SAP-CP002-TPL-FRACTION-OF-GROUPED-FRACTION",
  "SAP-CP002-PROT-NESTED-COMPLEX-FRACTION": "SAP-CP002-TPL-NESTED-COMPLEX-FRACTION",
  "SAP-CP002-PROT-SIGNED-FRACTION-BRACKETS": "SAP-CP002-TPL-SIGNED-FRACTION-BRACKET-SCOPE",
  "SAP-CP002-PROT-FRACTION-EXPRESSION-INTEGER-PART": "SAP-CP002-TPL-MIXED-FRACTION-CHAIN-WITH-INTEGER-PART",
  "SAP-CP002-PROT-PRODUCT-SUM-DIFFERENCE": "SAP-CP002-TPL-PRODUCT-SUM-DIFFERENCE",
  "SAP-CP002-PROT-RECIPROCAL-EXPRESSION": "SAP-CP002-TPL-RECIPROCAL-EXPRESSION",
  "SAP-CP002-PROT-FRACTION-COMPLEMENT": "SAP-CP002-TPL-FRACTION-COMPLEMENT",
  "SAP-CP002-PROT-BOUNDED-CONTINUED-FRACTION": "SAP-CP002-TPL-BOUNDED-CONTINUED-FRACTION",
  "SAP-CP002-PROT-MISSING-NUMERATOR": "SAP-CP002-TPL-MISSING-FRACTION-COMPONENT",
  "SAP-CP002-PROT-MISSING-DENOMINATOR": "SAP-CP002-TPL-MISSING-FRACTION-COMPONENT",
  "SAP-CP002-PROT-MISSING-FRACTION-OPERAND": "SAP-CP002-TPL-MISSING-FRACTION-OPERAND",
  "SAP-CP002-PROT-COMPARE-EVALUATED-FRACTIONS": "SAP-CP002-TPL-COMPARE-EVALUATED-FRACTIONS",
  "SAP-CP002-PROT-SELECT-EQUIVALENT-REDUCED-FRACTION": "SAP-CP002-TPL-SELECT-EQUIVALENT-REDUCED-FRACTION",
  "SAP-CP002-PROT-IDENTIFY-INCORRECT-FRACTION-STEP": "SAP-CP002-TPL-IDENTIFY-INCORRECT-FRACTION-STEP",
});

export interface SapCp002TemplateAuthority {
  readonly templateId: SapCp002EnglishTemplateId;
  readonly title: string;
  readonly solveAuthority: string;
  readonly answerSemantic: string;
  readonly taskDirections: readonly string[];
  readonly representations: readonly string[];
  readonly prototypeAncestry: readonly SapCp002PrototypeId[];
  readonly editorialDecision: "RETAIN" | "MERGE";
}

const META: Readonly<Record<SapCp002EnglishTemplateId, Omit<SapCp002TemplateAuthority, "templateId" | "prototypeAncestry" | "editorialDecision">>> = Object.freeze({
  "SAP-CP002-TPL-FRACTION-SUM-DIFFERENCE": { title: "Add or subtract fractions with unlike denominators", solveAuthority: "Create an exact common denominator, combine scaled numerators, and reduce.", answerSemantic: "SIMPLIFIED_RATIONAL", taskDirections: ["FORWARD"], representations: ["FRACTION_EXPRESSION"] },
  "SAP-CP002-TPL-FRACTION-PRODUCT-CANCELLATION": { title: "Multiply fractions using cross-cancellation", solveAuthority: "Cancel common numerator–denominator factors before multiplication.", answerSemantic: "SIMPLIFIED_RATIONAL", taskDirections: ["FORWARD"], representations: ["FRACTION_PRODUCT"] },
  "SAP-CP002-TPL-FRACTION-DIVISION-RECIPROCAL": { title: "Divide fractions using the reciprocal", solveAuthority: "Keep the dividend and invert only the non-zero divisor.", answerSemantic: "SIMPLIFIED_RATIONAL", taskDirections: ["FORWARD"], representations: ["FRACTION_DIVISION"] },
  "SAP-CP002-TPL-MIXED-FRACTION-CHAIN-WITH-INTEGER-PART": { title: "Evaluate a mixed fraction chain with an optional integer part", solveAuthority: "Respect operation order while combining integers and exact fractions.", answerSemantic: "SIMPLIFIED_RATIONAL", taskDirections: ["FORWARD"], representations: ["FRACTION_CHAIN", "INTEGER_PART"] },
  "SAP-CP002-TPL-MIXED-NUMBER-CONVERSION": { title: "Convert mixed numbers and evaluate", solveAuthority: "Convert every mixed number to an improper fraction before applying operations.", answerSemantic: "SIMPLIFIED_RATIONAL", taskDirections: ["FORWARD"], representations: ["MIXED_NUMBER"] },
  "SAP-CP002-TPL-FRACTION-OF-GROUPED-FRACTION": { title: "Evaluate a fraction of a grouped fraction expression", solveAuthority: "Complete the explicit group and treat scoped ‘of’ as multiplication.", answerSemantic: "SIMPLIFIED_RATIONAL", taskDirections: ["FORWARD"], representations: ["SCOPED_OF"] },
  "SAP-CP002-TPL-NESTED-COMPLEX-FRACTION": { title: "Evaluate a nested complex fraction", solveAuthority: "Finish the complete numerator and denominator blocks before division.", answerSemantic: "SIMPLIFIED_RATIONAL", taskDirections: ["FORWARD"], representations: ["COMPLEX_FRACTION"] },
  "SAP-CP002-TPL-SIGNED-FRACTION-BRACKET-SCOPE": { title: "Evaluate signed fractions with bracket scope", solveAuthority: "Resolve grouped fraction values and preserve every sign through later operations.", answerSemantic: "SIMPLIFIED_RATIONAL", taskDirections: ["FORWARD"], representations: ["SIGNED_FRACTION", "BRACKETS"] },
  "SAP-CP002-TPL-PRODUCT-SUM-DIFFERENCE": { title: "Multiply a fractional sum and difference", solveAuthority: "Simplify both grouped fraction blocks and multiply their exact results.", answerSemantic: "SIMPLIFIED_RATIONAL", taskDirections: ["FORWARD"], representations: ["PAIRED_GROUPS"] },
  "SAP-CP002-TPL-RECIPROCAL-EXPRESSION": { title: "Evaluate the reciprocal of a grouped fraction expression", solveAuthority: "Simplify the complete denominator block before taking one reciprocal.", answerSemantic: "SIMPLIFIED_RATIONAL", taskDirections: ["FORWARD"], representations: ["RECIPROCAL_BLOCK"] },
  "SAP-CP002-TPL-FRACTION-COMPLEMENT": { title: "Find an exact fraction complement", solveAuthority: "Subtract the complete grouped fraction total from one whole.", answerSemantic: "SIMPLIFIED_RATIONAL", taskDirections: ["FORWARD"], representations: ["COMPLEMENT"] },
  "SAP-CP002-TPL-BOUNDED-CONTINUED-FRACTION": { title: "Evaluate a bounded continued fraction", solveAuthority: "Evaluate from the deepest visible layer outward.", answerSemantic: "SIMPLIFIED_RATIONAL", taskDirections: ["FORWARD"], representations: ["CONTINUED_FRACTION"] },
  "SAP-CP002-TPL-MISSING-FRACTION-COMPONENT": { title: "Find a missing numerator or denominator", solveAuthority: "Isolate the unknown fraction and recover its fixed component by exact scaling or cross multiplication.", answerSemantic: "MISSING_INTEGER", taskDirections: ["INVERSE"], representations: ["MISSING_NUMERATOR", "MISSING_DENOMINATOR"] },
  "SAP-CP002-TPL-MISSING-FRACTION-OPERAND": { title: "Find a missing fraction operand", solveAuthority: "Apply the inverse additive operation while preserving subtraction order.", answerSemantic: "MISSING_RATIONAL", taskDirections: ["INVERSE"], representations: ["FIXED_EQUALITY"] },
  "SAP-CP002-TPL-COMPARE-EVALUATED-FRACTIONS": { title: "Compare two evaluated fraction expressions", solveAuthority: "Evaluate both expressions independently and compare exact reduced values.", answerSemantic: "COMPARISON_CLASS", taskDirections: ["COMPARISON"], representations: ["TWO_EXPRESSIONS"] },
  "SAP-CP002-TPL-SELECT-EQUIVALENT-REDUCED-FRACTION": { title: "Select the equivalent reduced fraction", solveAuthority: "Evaluate exactly and require both value equivalence and lowest-term form.", answerSemantic: "EXPRESSION_SELECTION", taskDirections: ["SELECTION"], representations: ["FRACTION_OPTIONS"] },
  "SAP-CP002-TPL-IDENTIFY-INCORRECT-FRACTION-STEP": { title: "Identify the first incorrect fraction step", solveAuthority: "Inspect a worked chain in order and locate the earliest value-changing transition.", answerSemantic: "STEP_SELECTION", taskDirections: ["DIAGNOSIS"], representations: ["WORKED_CHAIN"] },
});

export const SAP_CP002_ENGLISH_TEMPLATE_AUTHORITIES: readonly SapCp002TemplateAuthority[] = Object.freeze(
  SAP_CP002_ENGLISH_TEMPLATE_IDS.map((templateId) => {
    const ancestry = SAP_CP002_ALL_PROTOTYPE_IDS.filter((prototypeId) => SAP_CP002_TEMPLATE_MAP[prototypeId] === templateId);
    const meta = META[templateId];
    return Object.freeze({
      templateId,
      ...meta,
      prototypeAncestry: Object.freeze(ancestry),
      editorialDecision: ancestry.length > 1 ? "MERGE" as const : "RETAIN" as const,
    });
  }),
);

export const SAP_CP002_FREEZE_STATE = Object.freeze({
  designSolveModeCount: SAP_CP002_DESIGN_SOLVE_MODES.length,
  executablePrototypeCount: SAP_CP002_ALL_PROTOTYPE_IDS.length,
  approvedEnglishTemplateCount: SAP_CP002_ENGLISH_TEMPLATE_AUTHORITIES.length,
  permanentQlRange: "SAP-QL-017..SAP-QL-033" as const,
  nextAvailablePermanentQlId: "SAP-QL-034" as const,
  englishManualFreezeStatus: "APPROVED" as const,
  permanentAllocationStatus: "ALLOCATED_INACTIVE" as const,
  activeQlCount: 0,
  questionStudioDiscoverableCount: 0,
  questionBankWritableCount: 0,
  testEligibleCount: 0,
  publiclyPublishableCount: 0,
});

import {
  SAP_CP001_WAVE01_PROTOTYPE_IDS,
  type SapCp001Wave01PrototypeId,
} from "./wave01/types";
import {
  SAP_CP001_WAVE02_PROTOTYPE_IDS,
  type SapCp001Wave02PrototypeId,
} from "./wave02/types";
import {
  SAP_CP001_WAVE03_PROTOTYPE_IDS,
  type SapCp001Wave03PrototypeId,
} from "./wave03/types";

export type SapCp001PrototypeId =
  | SapCp001Wave01PrototypeId
  | SapCp001Wave02PrototypeId
  | SapCp001Wave03PrototypeId;

export const SAP_CP001_ALL_PROTOTYPE_IDS = Object.freeze([
  ...SAP_CP001_WAVE01_PROTOTYPE_IDS,
  ...SAP_CP001_WAVE02_PROTOTYPE_IDS,
  ...SAP_CP001_WAVE03_PROTOTYPE_IDS,
] as const);

export const SAP_CP001_ENGLISH_TEMPLATE_IDS = [
  "SAP-CP001-TPL-MIXED-ORDER-OF-OPERATIONS",
  "SAP-CP001-TPL-MULTIPLY-DIVIDE-LEFT-TO-RIGHT",
  "SAP-CP001-TPL-ADD-SUBTRACT-LEFT-TO-RIGHT",
  "SAP-CP001-TPL-GROUPING-AND-BRACKET-SCOPE",
  "SAP-CP001-TPL-UNARY-SIGNED-OPERAND",
  "SAP-CP001-TPL-NEGATIVE-INTERMEDIATE-PROPAGATION",
  "SAP-CP001-TPL-SCOPED-OF-MULTIPLICATION",
  "SAP-CP001-TPL-IMPLICIT-GROUP-MULTIPLICATION",
  "SAP-CP001-TPL-FRACTION-BAR-SCOPE",
  "SAP-CP001-TPL-POWER-BEFORE-ARITHMETIC",
  "SAP-CP001-TPL-FACTORIAL-BEFORE-ARITHMETIC",
  "SAP-CP001-TPL-COMPARE-DIFFERENT-GROUPINGS",
  "SAP-CP001-TPL-SELECT-EQUIVALENT-GROUPING",
  "SAP-CP001-TPL-IDENTIFY-FIRST-VALID-STEP",
  "SAP-CP001-TPL-IDENTIFY-FIRST-INCORRECT-STEP",
  "SAP-CP001-TPL-PARTIAL-SUBEXPRESSION-EVALUATION",
] as const;

export type SapCp001EnglishTemplateId = (typeof SAP_CP001_ENGLISH_TEMPLATE_IDS)[number];

export interface SapCp001EnglishTemplateProposal {
  readonly temporaryTemplateId: SapCp001EnglishTemplateId;
  readonly permanentQlId: null;
  readonly title: string;
  readonly solveAuthority: string;
  readonly answerSemantic: string;
  readonly taskDirections: readonly string[];
  readonly representations: readonly string[];
  readonly prototypeAncestry: readonly SapCp001PrototypeId[];
  readonly editorialDecision: "RETAIN" | "MERGE";
  readonly allocationStatus: "ID_FREE_COUNT_PROPOSAL";
}

export const SAP_CP001_ENGLISH_TEMPLATE_MAP: Readonly<Record<
  SapCp001PrototypeId,
  SapCp001EnglishTemplateId
>> = Object.freeze({
  "SAP-CP001-PROT-FLAT-MIXED-OPERATIONS": "SAP-CP001-TPL-MIXED-ORDER-OF-OPERATIONS",
  "SAP-CP001-PROT-MULTIPLY-DIVIDE-LEFT-TO-RIGHT": "SAP-CP001-TPL-MULTIPLY-DIVIDE-LEFT-TO-RIGHT",
  "SAP-CP001-PROT-ADD-SUBTRACT-LEFT-TO-RIGHT": "SAP-CP001-TPL-ADD-SUBTRACT-LEFT-TO-RIGHT",
  "SAP-CP001-PROT-NESTED-GROUPING": "SAP-CP001-TPL-GROUPING-AND-BRACKET-SCOPE",
  "SAP-CP001-PROT-SIGNED-ARITHMETIC": "SAP-CP001-TPL-UNARY-SIGNED-OPERAND",
  "SAP-CP001-PROT-SCOPED-OF-MULTIPLICATION": "SAP-CP001-TPL-SCOPED-OF-MULTIPLICATION",
  "SAP-CP001-PROT-POWER-BEFORE-ARITHMETIC": "SAP-CP001-TPL-POWER-BEFORE-ARITHMETIC",
  "SAP-CP001-PROT-FACTORIAL-BEFORE-ARITHMETIC": "SAP-CP001-TPL-FACTORIAL-BEFORE-ARITHMETIC",
  "SAP-CP001-PROT-COMPARE-DIFFERENT-GROUPINGS": "SAP-CP001-TPL-COMPARE-DIFFERENT-GROUPINGS",
  "SAP-CP001-PROT-SELECT-EQUIVALENT-GROUPING": "SAP-CP001-TPL-SELECT-EQUIVALENT-GROUPING",
  "SAP-CP001-PROT-IDENTIFY-FIRST-VALID-STEP": "SAP-CP001-TPL-IDENTIFY-FIRST-VALID-STEP",
  "SAP-CP001-PROT-IDENTIFY-INCORRECT-PRECEDENCE-STEP": "SAP-CP001-TPL-IDENTIFY-FIRST-INCORRECT-STEP",
  "SAP-CP001-PROT-PARTIAL-SUBEXPRESSION-VALUE": "SAP-CP001-TPL-PARTIAL-SUBEXPRESSION-EVALUATION",
  "SAP-CP001-PROT-VINCULUM-FRACTION-BAR-SCOPE": "SAP-CP001-TPL-FRACTION-BAR-SCOPE",
  "SAP-CP001-PROT-UNAMBIGUOUS-IMPLICIT-MULTIPLICATION": "SAP-CP001-TPL-IMPLICIT-GROUP-MULTIPLICATION",
  "SAP-CP001-PROT-REPEATED-GROUPING": "SAP-CP001-TPL-GROUPING-AND-BRACKET-SCOPE",
  "SAP-CP001-PROT-NEGATIVE-INTERMEDIATE": "SAP-CP001-TPL-NEGATIVE-INTERMEDIATE-PROPAGATION",
});

function proposal(
  temporaryTemplateId: SapCp001EnglishTemplateId,
  title: string,
  solveAuthority: string,
  answerSemantic: string,
  taskDirections: readonly string[],
  representations: readonly string[],
  prototypeAncestry: readonly SapCp001PrototypeId[],
  editorialDecision: "RETAIN" | "MERGE" = "RETAIN",
): SapCp001EnglishTemplateProposal {
  return Object.freeze({
    temporaryTemplateId,
    permanentQlId: null,
    title,
    solveAuthority,
    answerSemantic,
    taskDirections: Object.freeze([...taskDirections]),
    representations: Object.freeze([...representations]),
    prototypeAncestry: Object.freeze([...prototypeAncestry]),
    editorialDecision,
    allocationStatus: "ID_FREE_COUNT_PROPOSAL" as const,
  });
}

export const SAP_CP001_ENGLISH_TEMPLATE_PROPOSAL = Object.freeze([
  proposal(
    "SAP-CP001-TPL-MIXED-ORDER-OF-OPERATIONS",
    "Evaluate a mixed-operation expression",
    "Resolve higher-priority multiplication before the surrounding addition and subtraction.",
    "EXACT_VALUE",
    ["FORWARD"],
    ["PLAIN_EXPRESSION"],
    ["SAP-CP001-PROT-FLAT-MIXED-OPERATIONS"],
  ),
  proposal(
    "SAP-CP001-TPL-MULTIPLY-DIVIDE-LEFT-TO-RIGHT",
    "Evaluate multiplication and division from left to right",
    "Apply equal-precedence multiplication and division in visible left-to-right order.",
    "EXACT_VALUE",
    ["FORWARD"],
    ["PLAIN_EXPRESSION"],
    ["SAP-CP001-PROT-MULTIPLY-DIVIDE-LEFT-TO-RIGHT"],
  ),
  proposal(
    "SAP-CP001-TPL-ADD-SUBTRACT-LEFT-TO-RIGHT",
    "Evaluate addition and subtraction from left to right",
    "Apply equal-precedence addition and subtraction in visible left-to-right order while preserving signs.",
    "EXACT_VALUE",
    ["FORWARD"],
    ["PLAIN_EXPRESSION"],
    ["SAP-CP001-PROT-ADD-SUBTRACT-LEFT-TO-RIGHT"],
  ),
  proposal(
    "SAP-CP001-TPL-GROUPING-AND-BRACKET-SCOPE",
    "Evaluate nested and repeated grouping",
    "Use nesting, not bracket glyph shape, to determine scope; redundant outer groups do not change value.",
    "EXACT_VALUE",
    ["FORWARD"],
    ["ROUND_BRACKETS", "SQUARE_BRACKETS", "CURLY_BRACKETS", "REPEATED_GROUPING"],
    ["SAP-CP001-PROT-NESTED-GROUPING", "SAP-CP001-PROT-REPEATED-GROUPING"],
    "MERGE",
  ),
  proposal(
    "SAP-CP001-TPL-UNARY-SIGNED-OPERAND",
    "Evaluate an expression containing a unary negative",
    "Bind a unary sign to its operand before combining it with later operations.",
    "EXACT_VALUE",
    ["FORWARD"],
    ["SIGNED_EXPRESSION"],
    ["SAP-CP001-PROT-SIGNED-ARITHMETIC"],
  ),
  proposal(
    "SAP-CP001-TPL-NEGATIVE-INTERMEDIATE-PROPAGATION",
    "Carry a negative intermediate through later operations",
    "Preserve the sign of a negative grouped result through multiplication and final adjustment.",
    "EXACT_VALUE",
    ["FORWARD"],
    ["GROUPED_SIGNED_EXPRESSION"],
    ["SAP-CP001-PROT-NEGATIVE-INTERMEDIATE"],
  ),
  proposal(
    "SAP-CP001-TPL-SCOPED-OF-MULTIPLICATION",
    "Evaluate a fully scoped ‘of’ expression",
    "Treat the visible ‘of’ construct as multiplication over its complete displayed operands.",
    "EXACT_VALUE",
    ["FORWARD"],
    ["PROSE_OPERATOR_EXPRESSION"],
    ["SAP-CP001-PROT-SCOPED-OF-MULTIPLICATION"],
  ),
  proposal(
    "SAP-CP001-TPL-IMPLICIT-GROUP-MULTIPLICATION",
    "Evaluate a coefficient beside a grouped expression",
    "Interpret adjacency between a coefficient and an explicit group as multiplication of the complete group.",
    "EXACT_VALUE",
    ["FORWARD"],
    ["IMPLICIT_MULTIPLICATION"],
    ["SAP-CP001-PROT-UNAMBIGUOUS-IMPLICIT-MULTIPLICATION"],
  ),
  proposal(
    "SAP-CP001-TPL-FRACTION-BAR-SCOPE",
    "Evaluate an expression whose fraction bar defines scope",
    "Complete the full numerator and denominator before division when bar scope is the primary challenge.",
    "EXACT_VALUE",
    ["FORWARD"],
    ["FRACTION_BAR"],
    ["SAP-CP001-PROT-VINCULUM-FRACTION-BAR-SCOPE"],
  ),
  proposal(
    "SAP-CP001-TPL-POWER-BEFORE-ARITHMETIC",
    "Evaluate a power before surrounding arithmetic",
    "Apply the exponent to its exact base before division, addition or subtraction.",
    "EXACT_VALUE",
    ["FORWARD"],
    ["POWER_EXPRESSION"],
    ["SAP-CP001-PROT-POWER-BEFORE-ARITHMETIC"],
  ),
  proposal(
    "SAP-CP001-TPL-FACTORIAL-BEFORE-ARITHMETIC",
    "Evaluate a factorial before surrounding arithmetic",
    "Apply factorial to its exact operand before division, cancellation or final addition.",
    "EXACT_VALUE",
    ["FORWARD"],
    ["FACTORIAL_EXPRESSION"],
    ["SAP-CP001-PROT-FACTORIAL-BEFORE-ARITHMETIC"],
  ),
  proposal(
    "SAP-CP001-TPL-COMPARE-DIFFERENT-GROUPINGS",
    "Compare expressions with different grouping",
    "Evaluate two exact grouped expressions independently and compare their values.",
    "COMPARISON_CLASS",
    ["COMPARISON"],
    ["TWO_EXPRESSION_COMPARISON"],
    ["SAP-CP001-PROT-COMPARE-DIFFERENT-GROUPINGS"],
  ),
  proposal(
    "SAP-CP001-TPL-SELECT-EQUIVALENT-GROUPING",
    "Select the equivalent grouped expression",
    "Make left association explicit without changing operator signs or the exact value.",
    "EXPRESSION_SELECTION",
    ["SELECTION"],
    ["EXPRESSION_OPTIONS"],
    ["SAP-CP001-PROT-SELECT-EQUIVALENT-GROUPING"],
  ),
  proposal(
    "SAP-CP001-TPL-IDENTIFY-FIRST-VALID-STEP",
    "Identify the first valid simplification step",
    "Choose a value-preserving first transformation that respects scope and precedence.",
    "STEP_SELECTION",
    ["DIAGNOSIS"],
    ["STEP_OPTIONS"],
    ["SAP-CP001-PROT-IDENTIFY-FIRST-VALID-STEP"],
  ),
  proposal(
    "SAP-CP001-TPL-IDENTIFY-FIRST-INCORRECT-STEP",
    "Identify the first incorrect step",
    "Inspect a worked chain in order and locate the earliest value-changing transition.",
    "STEP_SELECTION",
    ["DIAGNOSIS"],
    ["WORKED_SOLUTION_CHAIN"],
    ["SAP-CP001-PROT-IDENTIFY-INCORRECT-PRECEDENCE-STEP"],
  ),
  proposal(
    "SAP-CP001-TPL-PARTIAL-SUBEXPRESSION-EVALUATION",
    "Complete an expression after a declared simplification",
    "Substitute one correct subexpression value without altering the surrounding operation structure.",
    "EXACT_VALUE",
    ["PARTIAL_EVALUATION"],
    ["DECLARED_SUBEXPRESSION"],
    ["SAP-CP001-PROT-PARTIAL-SUBEXPRESSION-VALUE"],
  ),
] satisfies readonly SapCp001EnglishTemplateProposal[]);

export const SAP_CP001_ENGLISH_COUNT_PROPOSAL = Object.freeze({
  checkpointId: "SAP-CP-001" as const,
  designSolveModeCount: 18,
  executablePrototypeCount: SAP_CP001_ALL_PROTOTYPE_IDS.length,
  proposedTemplateCount: SAP_CP001_ENGLISH_TEMPLATE_PROPOSAL.length,
  permanentQlCount: 0,
  allocationStatus: "BLOCKED_PENDING_PRODUCT_APPROVAL" as const,
  questionStudioStatus: "DISABLED" as const,
  questionBankStatus: "NOT_STORED" as const,
  testEligibility: "INELIGIBLE" as const,
  publicStatus: "INACTIVE" as const,
});

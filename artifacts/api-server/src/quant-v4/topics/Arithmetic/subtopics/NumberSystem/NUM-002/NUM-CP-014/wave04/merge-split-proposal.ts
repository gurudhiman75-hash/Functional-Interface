import { NUM_CP014_WAVE01_PROTOTYPE_IDS } from "../wave01/runtime.ts";
import { NUM_CP014_WAVE02_PROTOTYPE_IDS } from "../wave02/runtime.ts";
import { NUM_CP014_WAVE03_V2_PROTOTYPE_IDS } from "../wave03/runtime-v2.ts";

export const NUM_CP014_DISCOVERY_PROTOTYPE_IDS = Object.freeze([
  ...NUM_CP014_WAVE01_PROTOTYPE_IDS,
  ...NUM_CP014_WAVE02_PROTOTYPE_IDS,
  ...NUM_CP014_WAVE03_V2_PROTOTYPE_IDS.filter((id) => !NUM_CP014_WAVE01_PROTOTYPE_IDS.includes(id as any) && !NUM_CP014_WAVE02_PROTOTYPE_IDS.includes(id as any)),
] as const);

export type NumCp014AuthorityId =
  | "NUM-CP014-AUTH-001"
  | "NUM-CP014-AUTH-002"
  | "NUM-CP014-AUTH-003"
  | "NUM-CP014-AUTH-004"
  | "NUM-CP014-AUTH-005"
  | "NUM-CP014-AUTH-006";

export interface NumCp014AuthorityProposal {
  readonly authorityId: NumCp014AuthorityId;
  readonly solveTopology:
    | "UNIQUE_TWO_ENGINE_HIDDEN_SCALAR"
    | "TWO_ENGINE_EXTREMUM"
    | "TWO_ENGINE_COUNT"
    | "TWO_ENGINE_SOLUTION_CLASS"
    | "UNIQUE_THREE_ENGINE_HIDDEN_SCALAR"
    | "TWO_ENGINE_COMPLETE_SET";
  readonly answerSemantics: readonly string[];
  readonly sourcePrototypeIds: readonly string[];
  readonly invariant: string;
  readonly representationInvariant: string;
  readonly ablationRequirement: string;
}

export const NUM_CP014_AUTHORITY_PROPOSAL = Object.freeze([
  Object.freeze({
    authorityId: "NUM-CP014-AUTH-001",
    solveTopology: "UNIQUE_TWO_ENGINE_HIDDEN_SCALAR",
    answerSemantics: Object.freeze(["DIGIT", "HIDDEN_NUMBER", "HIDDEN_BASE", "HIDDEN_EXPONENT", "HIDDEN_DIVISOR"]),
    sourcePrototypeIds: Object.freeze([
      "NUM-CP014-PROT-001",
      "NUM-CP014-PROT-002",
      "NUM-CP014-PROT-003",
      "NUM-CP014-PROT-004",
      "NUM-CP014-PROT-005",
      "NUM-CP014-PROT-006",
      "NUM-CP014-PROT-013",
      "NUM-CP014-PROT-014",
      "NUM-CP014-PROT-015",
      "NUM-CP014-PROT-016",
      "NUM-CP014-PROT-017",
      "NUM-CP014-PROT-018",
      "NUM-CP014-PROT-019",
    ]),
    invariant: "A bounded scalar domain is filtered by exactly two independently essential Number System engines; the full intersection is unique and removing either engine restores ambiguity.",
    representationInvariant: "Constraint tables, elimination grids, caselets and multi-stage graphs are presentation variants over the same two-filter intersection state.",
    ablationRequirement: "full candidate count = 1; removing either component produces more than one candidate and changes the learner-facing answer from a scalar to non-unique.",
  }),
  Object.freeze({
    authorityId: "NUM-CP014-AUTH-002",
    solveTopology: "TWO_ENGINE_EXTREMUM",
    answerSemantics: Object.freeze(["LEAST_VALUE", "GREATEST_VALUE"]),
    sourcePrototypeIds: Object.freeze(["NUM-CP014-PROT-007", "NUM-CP014-PROT-008"]),
    invariant: "Compute the complete two-engine intersection, then project the required minimum or maximum; each engine must change the resulting extremum when ablated.",
    representationInvariant: "Direction (least/greatest) is a projection parameter, not a separate solve authority.",
    ablationRequirement: "removing either component changes the reported extremum, not merely the hidden candidate set.",
  }),
  Object.freeze({
    authorityId: "NUM-CP014-AUTH-003",
    solveTopology: "TWO_ENGINE_COUNT",
    answerSemantics: Object.freeze(["COUNT"]),
    sourcePrototypeIds: Object.freeze(["NUM-CP014-PROT-009", "NUM-CP014-PROT-012"]),
    invariant: "Enumerate the complete intersection of two essential component constraints and return its exact cardinality.",
    representationInvariant: "Scalar-base domains and ordered digit-pair domains share the same count-after-intersection solve topology.",
    ablationRequirement: "removing either component changes the exact count.",
  }),
  Object.freeze({
    authorityId: "NUM-CP014-AUTH-004",
    solveTopology: "TWO_ENGINE_SOLUTION_CLASS",
    answerSemantics: Object.freeze(["NO_SOLUTION", "ONE_SOLUTION"]),
    sourcePrototypeIds: Object.freeze(["NUM-CP014-PROT-010"]),
    invariant: "Classify the two-engine intersection only when every component changes the reported solution class under ablation.",
    representationInvariant: "No-solution and one-solution are modes of one class authority.",
    ablationRequirement: "the learner-facing class must change when either component is removed; ordinary MULTIPLE_SOLUTIONS states that stay multiple under ablation are rejected.",
  }),
  Object.freeze({
    authorityId: "NUM-CP014-AUTH-005",
    solveTopology: "UNIQUE_THREE_ENGINE_HIDDEN_SCALAR",
    answerSemantics: Object.freeze(["HIDDEN_NUMBER"]),
    sourcePrototypeIds: Object.freeze(["NUM-CP014-PROT-011"]),
    invariant: "Three independently essential Number System engines intersect at one bounded scalar; removing any one engine restores ambiguity.",
    representationInvariant: "Three-engine dependency graphs are structurally different from two-engine intersections and remain split.",
    ablationRequirement: "all three one-component ablations independently restore multiple candidates.",
  }),
  Object.freeze({
    authorityId: "NUM-CP014-AUTH-006",
    solveTopology: "TWO_ENGINE_COMPLETE_SET",
    answerSemantics: Object.freeze(["COMPLETE_VALID_SET"]),
    sourcePrototypeIds: Object.freeze(["NUM-CP014-PROT-020"]),
    invariant: "Return the exact complete intersection set of two essential component constraints, preserving all and only valid states.",
    representationInvariant: "Set-valued output cannot be collapsed into scalar/count/class because omission and extraneous-member misconceptions are answer-semantic specific.",
    ablationRequirement: "removing either component changes the complete answer set itself.",
  }),
] as const satisfies readonly NumCp014AuthorityProposal[]);

export const NUM_CP014_OWNERSHIP_CLOSURES = Object.freeze([
  "SINGLE_ENGINE_PRIMARY_TASK_RETURNS_TO_COMPONENT_CP",
  "DATA_SUFFICIENCY_RETURNS_TO_DSF_001",
  "ALGEBRA_PRIMARY_SYMBOLIC_SYSTEM_RETURNS_TO_ALGEBRA",
  "P_AND_C_OR_SET_COUNTING_PRIMARY_TASK_RETURNS_TO_ITS_OWNER",
  "DECORATIVE_OR_IMPLIED_SECOND_COMPONENT_IS_REJECTED",
  "EQUIVALENT_RESTATEMENT_OF_ONE_INVARIANT_IS_REJECTED",
] as const);

export const NUM_CP014_ADVANCED_HOLDS = Object.freeze([
  "UNBOUNDED_OR_LARGE_SYMBOLIC_MULTI_ENGINE_SYSTEMS",
  "FRACTIONAL_RECURRING_BASE_SYNTHESIS",
  "NON_MONOTONE_MULTI_SOLUTION_CLASS_TOPOLOGIES_WITHOUT_ANSWER_IMPACT_PROOF",
] as const);

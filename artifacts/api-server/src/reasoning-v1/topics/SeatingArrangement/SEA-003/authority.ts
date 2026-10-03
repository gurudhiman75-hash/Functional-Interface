export type Sea003QlId =
  | "SEA-QL-043" | "SEA-QL-044"
  | "SEA-QL-045" | "SEA-QL-046"
  | "SEA-QL-047" | "SEA-QL-048"
  | "SEA-QL-049" | "SEA-QL-050"
  | "SEA-QL-051";

export type Sea003CheckpointId =
  | "SEA-CP-011" | "SEA-CP-012" | "SEA-CP-013" | "SEA-CP-014" | "SEA-CP-015";

export const SEA003_QL_AUTHORITIES = Object.freeze([
  {
    qlId: "SEA-QL-043", checkpointId: "SEA-CP-011",
    label: "Linear seating with one-to-one attribute assignment",
    solveContract: "jointly solve a fixed linear seat order and a bijective person-to-attribute layer",
    answerSemantic: "PERSON_ATTRIBUTE_OR_ATTRIBUTE_POSITION",
    sourcePosture: "SOURCE_BACKED_CORE",
  },
  {
    qlId: "SEA-QL-044", checkpointId: "SEA-CP-011",
    label: "Circular seating with one-to-one attribute assignment",
    solveContract: "jointly solve rotationally-normalized circular seating and a bijective attribute layer",
    answerSemantic: "CIRCULAR_PERSON_ATTRIBUTE",
    sourcePosture: "SOURCE_BACKED_CORE",
  },
  {
    qlId: "SEA-QL-045", checkpointId: "SEA-CP-012",
    label: "Parallel rows with one explicit vacant seat",
    solveContract: "solve two parallel rows in which exactly one physical seat is vacant and vacancy participates in relative/opposite clues",
    answerSemantic: "VACANT_SEAT_PARALLEL_ROW_POSITION",
    sourcePosture: "SOURCE_BACKED_CORE",
  },
  {
    qlId: "SEA-QL-046", checkpointId: "SEA-CP-012",
    label: "Linear seating with multiple vacant seats",
    solveContract: "place people among more physical seats than occupants while solving two distinct vacancies as structural positions",
    answerSemantic: "MULTI_VACANCY_LINEAR_POSITION",
    sourcePosture: "PROJECT_APPROVED_DESIGN__CONSERVATIVE_FREQUENCY_CLAIM",
  },
  {
    qlId: "SEA-QL-047", checkpointId: "SEA-CP-013",
    label: "Either-or conditional seating clue",
    solveContract: "solve an arrangement where an explicit either-or seating condition is solution-essential",
    answerSemantic: "CONDITIONAL_EITHER_OR_POSITION",
    sourcePosture: "PROJECT_APPROVED_DESIGN__CONSERVATIVE_FREQUENCY_CLAIM",
  },
  {
    qlId: "SEA-QL-048", checkpointId: "SEA-CP-013",
    label: "Implication conditional seating clue",
    solveContract: "solve an arrangement containing a solution-essential if-then positional implication",
    answerSemantic: "CONDITIONAL_IMPLICATION_POSITION",
    sourcePosture: "PROJECT_APPROVED_DESIGN__CONSERVATIVE_FREQUENCY_CLAIM",
  },
  {
    qlId: "SEA-QL-049", checkpointId: "SEA-CP-014",
    label: "Uncertain-number row with total-count inference",
    solveContract: "infer the total number of seats/persons jointly with named-person positions from end/offset constraints",
    answerSemantic: "UNCERTAIN_ROW_TOTAL_COUNT",
    sourcePosture: "SOURCE_BACKED_CORE",
  },
  {
    qlId: "SEA-QL-050", checkpointId: "SEA-CP-014",
    label: "Uncertain-number row with middle/equal-side inference",
    solveContract: "infer row size using a middle/equal-side constraint combined with relative-position and end constraints",
    answerSemantic: "UNCERTAIN_ROW_POSITION_AND_COUNT",
    sourcePosture: "SOURCE_BACKED_CORE",
  },
  {
    qlId: "SEA-QL-051", checkpointId: "SEA-CP-015",
    label: "Post-arrangement exchange transformation",
    solveContract: "solve the base seating first, apply a stated exchange of two occupants, and answer from the transformed state",
    answerSemantic: "POST_TRANSFORMATION_POSITION",
    sourcePosture: "SOURCE_BACKED_CORE",
  },
] as const satisfies readonly {
  readonly qlId: Sea003QlId;
  readonly checkpointId: Sea003CheckpointId;
  readonly label: string;
  readonly solveContract: string;
  readonly answerSemantic: string;
  readonly sourcePosture: string;
}[]);

export const SEA003_CHECKPOINTS = Object.freeze([
  { id: "SEA-CP-011" as const, label: "Attribute-linked seating" },
  { id: "SEA-CP-012" as const, label: "Vacant-seat seating" },
  { id: "SEA-CP-013" as const, label: "Conditional seating" },
  { id: "SEA-CP-014" as const, label: "Uncertain-number seating" },
  { id: "SEA-CP-015" as const, label: "Post-arrangement transformation" },
]);

export const SEA003_PERMANENT_QL_IDS = Object.freeze(SEA003_QL_AUTHORITIES.map((entry) => entry.qlId));
export const SEA003_NEXT_AVAILABLE_PERMANENT_QL_ID = "SEA-QL-052" as const;

export function sea003Authority(qlId: Sea003QlId) {
  const entry = SEA003_QL_AUTHORITIES.find((candidate) => candidate.qlId === qlId);
  if (!entry) throw new Error("Unknown SEA-003 QL: " + qlId);
  return entry;
}

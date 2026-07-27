import { assertMaterialQlNeed, type QlNeedEvidence } from "../DIR-001-CHAPTER-MANIFEST";
import type { DirectionQuestionLogicContract } from "../foundation/types";

export type DirCp008AnswerDemand =
  | "MISSING_GRAPH_RELATION"
  | "INCONSISTENT_STATEMENT"
  | "MISSING_MOVEMENT_DIRECTION"
  | "MISSING_PATH_TURN"
  | "INITIAL_FACING_FROM_ENDPOINT"
  | "GRAPH_MOVEMENT_DIRECTION_DISTANCE"
  | "CASELET_ENDPOINT_DIRECTION"
  | "CASELET_SHORTEST_DISTANCE"
  | "DIAGRAM_TEXT_RELATION";

export interface DirCp008Ql extends DirectionQuestionLogicContract {
  readonly checkpointId: "DIR-CP-008";
  readonly answerDemand: DirCp008AnswerDemand;
  readonly needEvidence: QlNeedEvidence;
}

export const DIR_CP008_QLS: readonly DirCp008Ql[] = [
  {
    qlId: "DIR-QL-036", checkpointId: "DIR-CP-008", ruleId: "DIR_GRAPH_MISSING_RELATION",
    answerDemand: "MISSING_GRAPH_RELATION", solverCapabilities: ["ENTITY_GRAPH", "CANDIDATE_EDGE_COMPLETION", "CONSISTENCY_PROOF"],
    presentationMode: "RELATION_GRAPH_WITH_MISSING_EDGE", answerType: "DIRECTION", renderer: "STRUCTURED_TEXT",
    localeMode: "TRANSLATABLE", status: "DRAFT",
    needEvidence: { inverseOrReconstructionBurden: "A missing graph edge is recovered by testing candidate directions against a closed spatial cycle.", independentSolverContract: "The solver proves that exactly one candidate edge leaves the graph connected and contradiction-free." },
  },
  {
    qlId: "DIR-QL-037", checkpointId: "DIR-CP-008", ruleId: "DIR_GRAPH_CONTRADICTION_IDENTIFICATION",
    answerDemand: "INCONSISTENT_STATEMENT", solverCapabilities: ["ENTITY_GRAPH", "CONTRADICTION_DETECTION", "STATEMENT_REMOVAL_PROOF"],
    presentationMode: "NUMBERED_RELATION_STATEMENTS", answerType: "STATEMENT", renderer: "STRUCTURED_TEXT",
    localeMode: "TRANSLATABLE", status: "DRAFT",
    needEvidence: { answerDemand: "The answer identifies a faulty premise rather than a derived location.", misconceptionProfile: "Distractors are individually plausible relations that remain consistent with the redundant graph evidence.", inverseOrReconstructionBurden: "Each statement must be removed and the remaining graph re-solved to prove uniqueness." },
  },
  {
    qlId: "DIR-QL-038", checkpointId: "DIR-CP-008", ruleId: "DIR_PATH_MISSING_MOVEMENT_DIRECTION",
    answerDemand: "MISSING_MOVEMENT_DIRECTION", solverCapabilities: ["REPLAY_PARTIAL_PATH", "ENUMERATE_CARDINAL_MOVEMENTS", "VERIFY_TARGET_ENDPOINT"],
    presentationMode: "PATH_WITH_UNKNOWN_MOVEMENT_DIRECTION", answerType: "DIRECTION", renderer: "STRUCTURED_TEXT",
    localeMode: "TRANSLATABLE", status: "DRAFT",
    needEvidence: { answerDemand: "The missing value is a movement direction, whereas CP-003 reconstructs only a movement distance.", inverseOrReconstructionBurden: "Candidate headings are inserted into the ordered path and independently checked against the supplied endpoint." },
  },
  {
    qlId: "DIR-QL-039", checkpointId: "DIR-CP-008", ruleId: "DIR_PATH_MISSING_TURN_FROM_ENDPOINT",
    answerDemand: "MISSING_PATH_TURN", solverCapabilities: ["REPLAY_PARTIAL_PATH", "ENUMERATE_RELATIVE_TURNS", "VERIFY_TARGET_ENDPOINT"],
    presentationMode: "MOVEMENT_PATH_WITH_UNKNOWN_TURN", answerType: "TURN", renderer: "STRUCTURED_TEXT",
    localeMode: "TRANSLATABLE", status: "DRAFT",
    needEvidence: { hiddenStateTopology: "The unknown turn changes later movement coordinates, not only final orientation.", independentSolverContract: "Left, right, about-turn and no-turn candidates are replayed through all later legs." },
  },
  {
    qlId: "DIR-QL-040", checkpointId: "DIR-CP-008", ruleId: "DIR_INITIAL_FACING_FROM_ENDPOINT",
    answerDemand: "INITIAL_FACING_FROM_ENDPOINT", solverCapabilities: ["ENUMERATE_INITIAL_FACINGS", "REPLAY_RELATIVE_PATH", "VERIFY_TARGET_ENDPOINT"],
    presentationMode: "RELATIVE_PATH_WITH_TARGET_ENDPOINT", answerType: "DIRECTION", renderer: "STRUCTURED_TEXT",
    localeMode: "TRANSLATABLE", status: "DRAFT",
    needEvidence: { solveDirection: "Initial facing is reconstructed from the endpoint coordinate rather than from a stated final facing.", inverseOrReconstructionBurden: "Every cardinal initial frame is replayed through a mixed turn-and-move sequence." },
  },
  {
    qlId: "DIR-QL-041", checkpointId: "DIR-CP-008", ruleId: "DIR_GRAPH_AND_MOVEMENT_SYNTHESIS",
    answerDemand: "GRAPH_MOVEMENT_DIRECTION_DISTANCE", solverCapabilities: ["ENTITY_GRAPH", "MOVEMENT_FROM_DERIVED_START", "ARBITRARY_REFERENCE_QUERY", "EXACT_DISTANCE"],
    presentationMode: "STATIC_LAYOUT_FOLLOWED_BY_MOVEMENT", answerType: "DIRECTION_DISTANCE_PAIR", renderer: "GRAPH_AND_PATH_DIAGRAM",
    localeMode: "TRANSLATABLE", status: "DRAFT",
    needEvidence: { hiddenStateTopology: "A mover begins at a coordinate derived from a static relation graph and is then compared with another graph entity.", rendererContract: "The explanation must distinguish fixed layout edges from the later movement path." },
  },
  {
    qlId: "DIR-QL-042", checkpointId: "DIR-CP-008", ruleId: "DIR_SHARED_CASELET_ENDPOINT_DIRECTION",
    answerDemand: "CASELET_ENDPOINT_DIRECTION", solverCapabilities: ["SHARED_PATH_STATE", "CLASSIFY_ENDPOINT_VECTOR"],
    presentationMode: "SHARED_STIMULUS_PATH_CASELET", answerType: "DIRECTION", renderer: "STRUCTURED_TEXT",
    localeMode: "TRANSLATABLE", status: "DRAFT",
    needEvidence: { hiddenStateTopology: "One deterministic path state is shared across separately validated caselet questions.", rendererContract: "The item carries a stable caseletId and a self-contained shared stimulus while retaining its own answer and explanation." },
  },
  {
    qlId: "DIR-QL-043", checkpointId: "DIR-CP-008", ruleId: "DIR_SHARED_CASELET_SHORTEST_DISTANCE",
    answerDemand: "CASELET_SHORTEST_DISTANCE", solverCapabilities: ["SHARED_PATH_STATE", "COMPUTE_EXACT_DISPLACEMENT"],
    presentationMode: "SHARED_STIMULUS_PATH_CASELET", answerType: "DISTANCE", renderer: "STRUCTURED_TEXT",
    localeMode: "TRANSLATABLE", status: "DRAFT",
    needEvidence: { answerDemand: "A second independently usable item asks for the exact displacement of the same deterministic caselet state.", rendererContract: "QL-042 and QL-043 must preserve identical stimulus and caselet metadata for the same seed." },
  },
  {
    qlId: "DIR-QL-044", checkpointId: "DIR-CP-008", ruleId: "DIR_DIAGRAM_TEXT_HYBRID_SYNTHESIS",
    answerDemand: "DIAGRAM_TEXT_RELATION", solverCapabilities: ["ENTITY_GRAPH", "MERGE_DIAGRAM_AND_TEXT_PREMISES", "ARBITRARY_PAIR_QUERY"],
    presentationMode: "DIAGRAM_TEXT_HYBRID", answerType: "DIRECTION", renderer: "QUESTION_DIAGRAM_AND_TEXT",
    localeMode: "TRANSLATABLE", status: "DRAFT",
    needEvidence: { rendererContract: "The complete hidden graph is split across a question diagram and a textual relation; neither source alone is sufficient.", hiddenStateTopology: "The solver merges two modality-specific premise sets before answering." },
  },
];

for (const ql of DIR_CP008_QLS) assertMaterialQlNeed(ql.needEvidence);
const expected = Array.from({ length: 9 }, (_, index) => `DIR-QL-${String(index + 36).padStart(3, "0")}`);
if (DIR_CP008_QLS.some((ql, index) => ql.qlId !== expected[index])) throw new Error("DIR-CP-008 QL IDs must remain continuous from DIR-QL-036 through DIR-QL-044");

export function dirCp008Ql(qlId: string): DirCp008Ql {
  const ql = DIR_CP008_QLS.find((candidate) => candidate.qlId === qlId);
  if (!ql) throw new Error(`Unknown DIR-CP-008 QL: ${qlId}`);
  return ql;
}

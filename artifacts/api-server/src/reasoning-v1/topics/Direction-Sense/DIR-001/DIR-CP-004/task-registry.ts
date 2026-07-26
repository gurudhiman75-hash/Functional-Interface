import { assertMaterialQlNeed, type QlNeedEvidence } from "../DIR-001-CHAPTER-MANIFEST";
import type { DirectionQuestionLogicContract } from "../foundation/types";

export type DirCp004AnswerDemand =
  | "RELATION_DIRECTION"
  | "RELATION_DIRECTION_AND_DISTANCE"
  | "ENTITY_AT_RELATION"
  | "COLLINEAR_ENTITY_GROUP"
  | "COINCIDENT_ENTITY_PAIR";

export interface DirCp004Ql extends DirectionQuestionLogicContract {
  readonly checkpointId: "DIR-CP-004";
  readonly answerDemand: DirCp004AnswerDemand;
  readonly needEvidence: QlNeedEvidence;
}

export const DIR_CP004_QLS: readonly DirCp004Ql[] = [
  {
    qlId: "DIR-QL-011", checkpointId: "DIR-CP-004", ruleId: "DIR_GRAPH_RELATION_DIRECTION",
    answerDemand: "RELATION_DIRECTION", solverCapabilities: ["ENTITY_GRAPH", "ARBITRARY_PAIR_QUERY"],
    presentationMode: "STATIC_RELATION_PARAGRAPH", answerType: "DIRECTION", renderer: "RELATIVE_POSITION_DIAGRAM",
    localeMode: "TRANSLATABLE", status: "DRAFT",
    needEvidence: { hiddenStateTopology: "A branched static entity graph replaces a single mover path.", answerDemand: "Direction of any named entity from any other named entity." },
  },
  {
    qlId: "DIR-QL-012", checkpointId: "DIR-CP-004", ruleId: "DIR_GRAPH_RELATION_DIRECTION_DISTANCE",
    answerDemand: "RELATION_DIRECTION_AND_DISTANCE", solverCapabilities: ["ENTITY_GRAPH", "EXACT_DISTANCE"],
    presentationMode: "STATIC_RELATION_PARAGRAPH", answerType: "DIRECTION_DISTANCE", renderer: "RELATIVE_POSITION_DIAGRAM_WITH_SHORTCUT",
    localeMode: "TRANSLATABLE", status: "DRAFT",
    needEvidence: { answerDemand: "Combined direction and shortest distance between non-adjacent graph entities.", rendererContract: "Requires a direct query line and explicit shortest-distance derivation." },
  },
  {
    qlId: "DIR-QL-013", checkpointId: "DIR-CP-004", ruleId: "DIR_GRAPH_ENTITY_LOOKUP",
    answerDemand: "ENTITY_AT_RELATION", solverCapabilities: ["ENTITY_GRAPH", "INVERSE_ENTITY_LOOKUP"],
    presentationMode: "STATIC_RELATION_PARAGRAPH", answerType: "ENTITY", renderer: "RELATIVE_POSITION_DIAGRAM",
    localeMode: "TRANSLATABLE", status: "DRAFT",
    needEvidence: { solveDirection: "Inverse lookup: the relation is supplied and the entity must be recovered.", answerDemand: "A named entity rather than a compass direction." },
  },
  {
    qlId: "DIR-QL-014", checkpointId: "DIR-CP-004", ruleId: "DIR_GRAPH_COLLINEAR_GROUP",
    answerDemand: "COLLINEAR_ENTITY_GROUP", solverCapabilities: ["ENTITY_GRAPH", "COLLINEARITY"],
    presentationMode: "STATIC_RELATION_PARAGRAPH", answerType: "ENTITY_GROUP", renderer: "RELATIVE_POSITION_DIAGRAM_WITH_ALIGNMENT",
    localeMode: "TRANSLATABLE", status: "DRAFT",
    needEvidence: { answerDemand: "Identify the unique three-entity line rather than a pairwise direction.", misconceptionProfile: "Near-aligned but non-collinear triples are the distractors." },
  },
  {
    qlId: "DIR-QL-015", checkpointId: "DIR-CP-004", ruleId: "DIR_GRAPH_COINCIDENT_PAIR",
    answerDemand: "COINCIDENT_ENTITY_PAIR", solverCapabilities: ["ENTITY_GRAPH", "COINCIDENCE"],
    presentationMode: "STATIC_RELATION_PARAGRAPH", answerType: "ENTITY_PAIR", renderer: "RELATIVE_POSITION_DIAGRAM_WITH_GROUPED_NODE",
    localeMode: "TRANSLATABLE", status: "DRAFT",
    needEvidence: { hiddenStateTopology: "Two independently placed entities resolve to one coordinate.", rendererContract: "Coincident names must share one readable node without overlap." },
  },
];

for (const ql of DIR_CP004_QLS) assertMaterialQlNeed(ql.needEvidence);

export function dirCp004Ql(qlId: string): DirCp004Ql {
  const ql = DIR_CP004_QLS.find((candidate) => candidate.qlId === qlId);
  if (!ql) throw new Error(`Unknown DIR-CP-004 QL: ${qlId}`);
  return ql;
}

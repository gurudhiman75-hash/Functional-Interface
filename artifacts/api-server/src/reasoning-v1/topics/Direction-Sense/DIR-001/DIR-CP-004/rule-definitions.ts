import type { DirCp004AnswerDemand } from "./task-registry";

export interface DirCp004RuleDefinition {
  readonly ruleId: string;
  readonly answerDemand: DirCp004AnswerDemand;
  readonly statement: string;
}

export const DIR_CP004_RULES: readonly DirCp004RuleDefinition[] = [
  { ruleId: "DIR_GRAPH_RELATION_DIRECTION", answerDemand: "RELATION_DIRECTION", statement: "Resolve a branched static relation graph and classify one named entity from another." },
  { ruleId: "DIR_GRAPH_RELATION_DIRECTION_DISTANCE", answerDemand: "RELATION_DIRECTION_AND_DISTANCE", statement: "Resolve a graph query vector and return its direction and exact shortest distance." },
  { ruleId: "DIR_GRAPH_ENTITY_LOOKUP", answerDemand: "ENTITY_AT_RELATION", statement: "Find the unique entity at a supplied direction from a reference entity." },
  { ruleId: "DIR_GRAPH_COLLINEAR_GROUP", answerDemand: "COLLINEAR_ENTITY_GROUP", statement: "Find the unique three-entity set lying on one straight line." },
  { ruleId: "DIR_GRAPH_COINCIDENT_PAIR", answerDemand: "COINCIDENT_ENTITY_PAIR", statement: "Find the unique pair that resolves to the same position." },
];

import type { KnowledgeV1Difficulty } from "../../types";

export type PhysicsExhaustiveAnchorV2 = {
  id: string;
  cpId: `SCI-CP-${string}`;
  topicId: string;
  topic: string;
  difficulty: KnowledgeV1Difficulty;
  stem: string;
  answer: string;
  distractors: readonly [string, string, string];
  trueStatement: string;
  falseStatement: string;
  explanation: string;
  sourceIds: readonly string[];
};

export type PhysicsExhaustiveRawAnchorV2 = readonly [
  string,
  KnowledgeV1Difficulty,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
];

export type PhysicsExhaustiveRawCpV2 = {
  cpId: `SCI-CP-${string}`;
  title: string;
  sourceIds: readonly string[];
  anchors: readonly PhysicsExhaustiveRawAnchorV2[];
};

export type PhysicsExhaustiveCpMetaV2 = {
  cpId: `SCI-CP-${string}`;
  title: string;
  sourceIds: readonly string[];
  anchors: readonly PhysicsExhaustiveAnchorV2[];
};

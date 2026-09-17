import type { KnowledgeV1Difficulty } from "../../types";

export type EnvCp021ReviewQuestion = {
  id: string;
  chapterId: "ENV-001";
  cpId: "ENV-CP-021";
  qlId: string;
  qlName: string;
  difficulty: KnowledgeV1Difficulty;
  stem: string;
  options: readonly [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
  reviewOnly: true;
  runtimeRegistered: false;
};

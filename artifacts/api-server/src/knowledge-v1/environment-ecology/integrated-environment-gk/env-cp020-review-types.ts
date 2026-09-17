import type { KnowledgeV1Difficulty } from "../../types";

export type EnvCp020ReviewQuestion = {
  id: string;
  cpId: "ENV-CP-020";
  qlId: string;
  qlName: string;
  difficulty: KnowledgeV1Difficulty;
  stem: string;
  options: readonly [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
  sourceFactIds: readonly string[];
  sourceCpIds: readonly string[];
  reviewOnly: true;
  runtimeRegistered: false;
};

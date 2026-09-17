export type EcoCp023Difficulty = "Easy" | "Medium" | "Hard";

export interface EcoCp023ReviewQuestion {
  questionId: string;
  chapterId: "ECO-001";
  cpId: "ECO-CP-023";
  qlId: string;
  qlName: string;
  difficulty: EcoCp023Difficulty;
  stem: string;
  options: string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  sourceIds: string[];
  sourceFactIds: string[];
  reviewOnly: true;
  runtimeRegistered: false;
}

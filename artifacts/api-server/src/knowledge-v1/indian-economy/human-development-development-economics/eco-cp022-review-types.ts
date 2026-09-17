export type EcoCp022Difficulty = "Easy" | "Medium" | "Hard";

export interface EcoCp022ReviewQuestion {
  questionId: string;
  chapterId: "ECO-001";
  cpId: "ECO-CP-022";
  qlId: string;
  qlName: string;
  difficulty: EcoCp022Difficulty;
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

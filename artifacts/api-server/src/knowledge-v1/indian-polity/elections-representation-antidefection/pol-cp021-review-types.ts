export type PolCp021Difficulty = "Easy" | "Medium" | "Hard";

export interface PolCp021ReviewQuestion {
  id: string;
  qlId: string;
  difficulty: PolCp021Difficulty;
  stem: string;
  options: readonly [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
  sourceIds: readonly string[];
}

export type TsdCp012ReviewedDifficulty = "EASY" | "MEDIUM";

export function calibrateTsdCp012ReviewedDifficulty(
  difficulty: "EASY" | "MEDIUM" | "HARD",
): TsdCp012ReviewedDifficulty {
  return difficulty === "HARD" ? "MEDIUM" : difficulty;
}

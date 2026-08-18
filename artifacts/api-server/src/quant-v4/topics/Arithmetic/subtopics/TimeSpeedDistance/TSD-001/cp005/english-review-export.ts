import { generateCp005ReviewSet } from "./english-review-runtime";

const rows = generateCp005ReviewSet(6).map((row, index) => Object.freeze({
  questionNo: index + 1,
  permanentQlId: row.permanentQlId,
  authorityKey: row.authorityKey,
  solveMode: row.solveMode,
  difficulty: row.difficulty,
  representation: row.representation,
  stem: row.stem,
  options: row.options,
  correctOption: ["A", "B", "C", "D"][row.correctIndex],
  answer: row.answerText,
  explanation: row.explanation,
}));

process.stdout.write(JSON.stringify(rows, null, 2));

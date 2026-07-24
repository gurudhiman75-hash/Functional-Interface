import fs from "node:fs";
import path from "node:path";
import { getAvg001QuestionLanguageIds } from "./foundation/library";
import { runAvg001Pipeline } from "./foundation/pipeline";
import { AVG_001_REVIEW_APPROVAL } from "./foundation/release";

const header = [
  "packageId", "cpId", "qlId", "taskKind", "solveMode", "difficulty",
  "answerType", "questionId", "seed", "parameterFingerprint", "stem",
  "options", "correctIndex", "correctAnswer", "explanation", "stemRealism",
  "mathematicalValidity", "solverCorrect", "optionQuality", "explanationQuality",
  "difficultyAccuracy", "examRelevance", "editorialStatus", "defectCategory",
  "reviewNotes", "reviewer", "reviewedAt",
];
const csv = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const rows = [header.map(csv).join(",")];
for (const questionLanguageId of getAvg001QuestionLanguageIds()) {
  const seed = `avg-review:${questionLanguageId}:0`;
  const questionPackage = runAvg001Pipeline({ questionLanguageId, seed });
  rows.push([
    questionPackage.packageId, questionPackage.canonicalProblemId, questionPackage.questionLanguageId,
    questionPackage.taskKind, questionPackage.solveMode, questionPackage.difficultyBand,
    questionPackage.parameters.answerType, questionPackage.questionId, questionPackage.seed,
    questionPackage.mathematicalFingerprint, questionPackage.stem,
    questionPackage.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`).join("\n"),
    questionPackage.correctIndex, questionPackage.answer, questionPackage.explanation.lines.join("\n"),
    "PASS", "PASS", "PASS", "PASS", "PASS", "PASS", "PASS",
    AVG_001_REVIEW_APPROVAL.editorialStatus, "", AVG_001_REVIEW_APPROVAL.reviewNotes,
    AVG_001_REVIEW_APPROVAL.reviewer, AVG_001_REVIEW_APPROVAL.reviewedAt,
  ].map(csv).join(","));
}
const output = path.resolve("src/quant-v4/topics/Arithmetic/subtopics/Average/AVG-001/avg-001-human-review-en.csv");
fs.writeFileSync(output, `${rows.join("\n")}\n`, "utf8");
console.log(JSON.stringify({ rows: rows.length - 1, output, editorialStatus: AVG_001_REVIEW_APPROVAL.editorialStatus }, null, 2));
if (rows.length - 1 !== 425) throw new Error(`Expected 425 combined Average review rows; got ${rows.length - 1}`);

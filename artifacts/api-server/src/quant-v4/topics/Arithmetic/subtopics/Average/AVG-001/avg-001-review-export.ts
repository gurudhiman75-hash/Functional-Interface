import fs from "node:fs";
import path from "node:path";
import { getAvg001QuestionLanguageIds } from "./foundation/library";
import { runAvg001Pipeline } from "./foundation/pipeline";

const header = [
  "packageId",
  "cpId",
  "qlId",
  "taskKind",
  "solveMode",
  "difficulty",
  "answerType",
  "questionId",
  "seed",
  "parameterFingerprint",
  "stem",
  "options",
  "correctIndex",
  "correctAnswer",
  "explanation",
  "stemRealism",
  "mathematicalValidity",
  "solverCorrect",
  "optionQuality",
  "explanationQuality",
  "difficultyAccuracy",
  "examRelevance",
  "editorialStatus",
  "defectCategory",
  "reviewNotes",
  "reviewer",
  "reviewedAt",
];

const csv = (value: unknown) =>
  `"${String(value ?? "").replaceAll('"', '""')}"`;
const rows = [header.map(csv).join(",")];

for (const questionLanguageId of getAvg001QuestionLanguageIds()) {
  const seed = `avg-review:${questionLanguageId}:0`;
  const questionPackage = runAvg001Pipeline({
    questionLanguageId,
    seed,
  });
  rows.push(
    [
      questionPackage.packageId,
      questionPackage.canonicalProblemId,
      questionPackage.questionLanguageId,
      questionPackage.taskKind,
      questionPackage.solveMode,
      questionPackage.difficultyBand,
      questionPackage.parameters.answerType,
      questionPackage.questionId,
      questionPackage.seed,
      questionPackage.mathematicalFingerprint,
      questionPackage.stem,
      questionPackage.options
        .map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`)
        .join("\n"),
      questionPackage.correctIndex,
      questionPackage.answer,
      questionPackage.explanation.lines.join("\n"),
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "PENDING",
      "",
      "",
      "",
      "",
    ]
      .map(csv)
      .join(","),
  );
}

const output = path.resolve(
  "src/quant-v4/topics/Arithmetic/subtopics/Average/AVG-001/avg-001-human-review-en.csv",
);
fs.writeFileSync(output, `${rows.join("\n")}\n`, "utf8");
console.log(JSON.stringify({ rows: rows.length - 1, output }, null, 2));

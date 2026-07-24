import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { getPnc001QuestionEntries } from "./foundation/library";
import { runPnc001Pipeline } from "./foundation/pipeline";

function csvCell(value: unknown): string {
  const text = String(value ?? "").replace(/\r?\n/g, "\n");
  return `"${text.replace(/"/g, '""')}"`;
}

const outputDirectory = resolve(process.cwd(), "dist/quant-v4/pnc-001-review-export");
mkdirSync(outputDirectory, { recursive: true });

const entries = getPnc001QuestionEntries();
const records = entries.map((entry) => {
  const generated = runPnc001Pipeline({
    questionLanguageId: entry.qlId,
    seed: `human-review:${entry.qlId}`,
  });

  return {
    qlId: generated.questionLanguageId,
    cpId: generated.canonicalProblemId,
    difficulty: generated.difficultyBand,
    taskKind: generated.taskKind,
    solveMode: generated.solveMode,
    seed: generated.seed,
    question: generated.stem,
    optionA: generated.options[0],
    optionB: generated.options[1],
    optionC: generated.options[2],
    optionD: generated.options[3],
    correctOption: ["A", "B", "C", "D"][generated.correctIndex],
    answer: generated.answer,
    solverEquation: generated.solver.equation,
    explanationId: generated.explanation.explanationId,
    explanation: generated.explanation.lines.join("\n"),
    validation: generated.validation.valid ? "PASS" : "FAIL",
    mathematicalFingerprint: generated.mathematicalFingerprint,
  };
});

const columns = [
  "qlId",
  "cpId",
  "difficulty",
  "taskKind",
  "solveMode",
  "seed",
  "question",
  "optionA",
  "optionB",
  "optionC",
  "optionD",
  "correctOption",
  "answer",
  "solverEquation",
  "explanationId",
  "explanation",
  "validation",
  "mathematicalFingerprint",
] as const;

const csv = [
  columns.map(csvCell).join(","),
  ...records.map((record) => columns.map((column) => csvCell(record[column])).join(",")),
].join("\n");

const json = {
  packageId: "PNC-001",
  language: "en",
  generatedAt: new Date().toISOString(),
  recordCount: records.length,
  seedPolicy: "human-review:<QL_ID>",
  records,
};

const csvPath = resolve(outputDirectory, "pnc-001-question-explanation-review.csv");
const jsonPath = resolve(outputDirectory, "pnc-001-question-explanation-review.json");
writeFileSync(csvPath, `${csv}\n`, "utf8");
writeFileSync(jsonPath, `${JSON.stringify(json, null, 2)}\n`, "utf8");

console.log(JSON.stringify({
  status: "PASS",
  recordCount: records.length,
  csvPath,
  jsonPath,
}, null, 2));

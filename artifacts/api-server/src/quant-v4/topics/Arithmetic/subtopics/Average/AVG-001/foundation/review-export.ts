import fs from "node:fs";
import path from "node:path";

import { getAvg001QuestionEntries } from "./library";
import { runAvg001Pipeline } from "./pipeline";
import { avg001ApprovedReviewColumns, AVG_001_REVIEW_APPROVAL } from "./release";
import type { Avg001QuestionLanguageEntry } from "./types";

const header = [
  "packageId", "cpId", "qlId", "taskKind", "solveMode", "difficulty",
  "answerType", "questionId", "seed", "parameterFingerprint", "stem",
  "options", "correctIndex", "correctAnswer", "explanation", "stemRealism",
  "mathematicalValidity", "solverCorrect", "optionQuality", "explanationQuality",
  "difficultyAccuracy", "examRelevance", "editorialStatus", "defectCategory",
  "reviewNotes", "reviewer", "reviewedAt",
];

const csv = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;

export function writeAvg001ApprovedReviewCsv(input: {
  outputFile: string;
  expectedRows: number;
  seedPrefix: string;
  select?: (entry: Avg001QuestionLanguageEntry) => boolean;
}) {
  const entries = getAvg001QuestionEntries().filter(input.select ?? (() => true));
  const rows = [header.map(csv).join(",")];

  for (const entry of entries) {
    const seed = `${input.seedPrefix}:${entry.qlId}:0`;
    const pkg = runAvg001Pipeline({ questionLanguageId: entry.qlId, seed });
    rows.push([
      pkg.packageId,
      pkg.canonicalProblemId,
      pkg.questionLanguageId,
      pkg.taskKind,
      pkg.solveMode,
      pkg.difficultyBand,
      pkg.parameters.answerType,
      pkg.questionId,
      pkg.seed,
      pkg.mathematicalFingerprint,
      pkg.stem,
      pkg.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`).join("\n"),
      pkg.correctIndex,
      pkg.answer,
      pkg.explanation.lines.join("\n"),
      ...avg001ApprovedReviewColumns(),
    ].map(csv).join(","));
  }

  const output = path.resolve(
    "src/quant-v4/topics/Arithmetic/subtopics/Average/AVG-001",
    input.outputFile,
  );
  fs.writeFileSync(output, `${rows.join("\n")}\n`, "utf8");
  console.log(JSON.stringify({
    rows: rows.length - 1,
    output,
    editorialStatus: AVG_001_REVIEW_APPROVAL.editorialStatus,
  }, null, 2));
  if (rows.length - 1 !== input.expectedRows) {
    throw new Error(`Expected ${input.expectedRows} approved review rows; got ${rows.length - 1}`);
  }
}

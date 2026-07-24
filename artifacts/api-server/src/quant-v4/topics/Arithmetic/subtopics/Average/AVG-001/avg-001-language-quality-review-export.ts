import fs from "node:fs";
import path from "node:path";

import { runAvg001Cp001LocalizationPilot } from "./foundation/cp001-localization-quality-runtime";
import { runAvg001Cp002LocalizationPilot } from "./foundation/cp002-localization-quality-runtime";
import { runAvg001Cp003LocalizationPilot } from "./foundation/cp003-localization-quality-runtime";
import { getAvg001QuestionEntries } from "./foundation/library";
import { runAvg001Pipeline } from "./foundation/pipeline";
import type { Avg001QuestionPackage } from "./foundation/types";

const header = [
  "packageId", "cpId", "qlId", "language", "solveMode", "difficulty", "answerType",
  "questionId", "seed", "stem", "options", "correctIndex", "correctAnswer", "explanation",
  "stemNaturalness", "contextAccuracy", "grammar", "mathematicalParity", "explanationAuthorship",
  "explanationNaturalness", "scriptAccuracy", "editorialStatus", "defectCategory", "reviewNotes",
  "reviewer", "reviewedAt",
];

const csv = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const entries = getAvg001QuestionEntries();

function row(pkg: Avg001QuestionPackage) {
  return [
    pkg.packageId,
    pkg.canonicalProblemId,
    pkg.questionLanguageId,
    pkg.language,
    pkg.solveMode,
    pkg.difficultyBand,
    pkg.parameters.answerType,
    pkg.questionId,
    pkg.seed,
    pkg.stem,
    pkg.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`).join("\n"),
    pkg.correctIndex,
    pkg.answer,
    pkg.explanation.lines.join("\n"),
    "", "", "", "", "", "", "", "PENDING", "", "", "", "",
  ].map(csv).join(",");
}

function localizedRunner(cpId: string) {
  if (cpId === "AVG-CP-001") return runAvg001Cp001LocalizationPilot;
  if (cpId === "AVG-CP-002") return runAvg001Cp002LocalizationPilot;
  if (cpId === "AVG-CP-003") return runAvg001Cp003LocalizationPilot;
  throw new Error(`No localized quality runtime for ${cpId}`);
}

const outputRoot = path.resolve("src/quant-v4/topics/Arithmetic/subtopics/Average/AVG-001");

const englishRows = [header.map(csv).join(",")];
for (const entry of entries) {
  const seed = `avg-language-quality-review:${entry.qlId}`;
  englishRows.push(row(runAvg001Pipeline({ questionLanguageId: entry.qlId, seed, language: "en" })));
}
fs.writeFileSync(path.join(outputRoot, "avg-001-language-quality-review-en.csv"), `${englishRows.join("\n")}\n`, "utf8");

for (const language of ["hi", "pa"] as const) {
  const rows = [header.map(csv).join(",")];
  for (const entry of entries.filter((item) => ["AVG-CP-001", "AVG-CP-002", "AVG-CP-003"].includes(item.cpId))) {
    const seed = `avg-language-quality-review:${entry.qlId}`;
    rows.push(row(localizedRunner(entry.cpId)({ questionLanguageId: entry.qlId, seed, language })));
  }
  fs.writeFileSync(path.join(outputRoot, `avg-001-language-quality-review-${language}.csv`), `${rows.join("\n")}\n`, "utf8");
}

console.log(JSON.stringify({
  englishRows: englishRows.length - 1,
  hindiRows: entries.filter((entry) => ["AVG-CP-001", "AVG-CP-002", "AVG-CP-003"].includes(entry.cpId)).length,
  punjabiRows: entries.filter((entry) => ["AVG-CP-001", "AVG-CP-002", "AVG-CP-003"].includes(entry.cpId)).length,
  outputRoot,
}, null, 2));

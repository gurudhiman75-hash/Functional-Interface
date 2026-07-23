import fs from "node:fs";
import path from "node:path";
import { getAvg001QuestionEntries } from "./foundation/library";
import { runAvg001Pipeline } from "./foundation/pipeline";

const header = ["packageId","cpId","qlId","taskKind","solveMode","difficulty","answerType","questionId","seed","parameterFingerprint","stem","options","correctIndex","correctAnswer","explanation","stemRealism","mathematicalValidity","solverCorrect","optionQuality","explanationQuality","difficultyAccuracy","examRelevance","editorialStatus","defectCategory","reviewNotes","reviewer","reviewedAt"];
const csv = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const rows = [header.map(csv).join(",")];
for (const entry of getAvg001QuestionEntries().filter((item) => Number(item.qlId.slice(-3)) >= 374)) {
  const seed = `avg-gap-review:${entry.qlId}:0`;
  const pkg = runAvg001Pipeline({ questionLanguageId: entry.qlId, seed });
  rows.push([pkg.packageId,pkg.canonicalProblemId,pkg.questionLanguageId,pkg.taskKind,pkg.solveMode,pkg.difficultyBand,pkg.parameters.answerType,pkg.questionId,pkg.seed,pkg.mathematicalFingerprint,pkg.stem,pkg.options.map((option,index)=>`${String.fromCharCode(65+index)}. ${option}`).join("\n"),pkg.correctIndex,pkg.answer,pkg.explanation.lines.join("\n"),"","","","","","","","PENDING","","","",""].map(csv).join(","));
}
const output = path.resolve("src/quant-v4/topics/Arithmetic/subtopics/Average/AVG-001/avg-001-gap-expansion-human-review-en.csv");
fs.writeFileSync(output, `${rows.join("\n")}\n`, "utf8");
console.log(JSON.stringify({ rows: rows.length - 1, output }, null, 2));
if (rows.length - 1 !== 52) throw new Error(`Expected 52 gap-expansion review rows; got ${rows.length - 1}`);

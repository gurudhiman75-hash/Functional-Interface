import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { TSD_CP008_RENDERED_ENGLISH_QUESTIONS } from "./english-rendered-review";

const outputDir = process.env.TSD_CP008_REVIEW_OUTPUT_DIR ?? process.cwd();
mkdirSync(outputDir, { recursive: true });
const outputPath = join(outputDir, "TSD-CP008-ENGLISH-QUESTIONS.md");

const lines: string[] = ["# TSD-CP-008 — English Question Review", ""];
for (const qlId of [...new Set(TSD_CP008_RENDERED_ENGLISH_QUESTIONS.map((question) => question.qlId))]) {
  lines.push(`## ${qlId}`, "");
  const questions = TSD_CP008_RENDERED_ENGLISH_QUESTIONS.filter((question) => question.qlId === qlId);
  questions.forEach((question, index) => lines.push(`${index + 1}. ${question.stem}`, ""));
}

writeFileSync(outputPath, `${lines.join("\n").trim()}\n`, "utf8");
console.log(JSON.stringify({
  status: "PASS",
  checkpoint: "TSD-CP-008",
  renderedQuestions: TSD_CP008_RENDERED_ENGLISH_QUESTIONS.length,
  outputFormat: "MARKDOWN_QUESTIONS_ONLY",
  mdPath: outputPath,
  englishStatus: "REVIEW_CANDIDATE",
  questionStudioEnabled: false,
}, null, 2));

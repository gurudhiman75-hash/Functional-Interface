import fs from "node:fs";
import path from "node:path";
import { TSD_CP008_RENDERED_HINDI_QUESTIONS, TSD_CP008_RENDERED_PUNJABI_QUESTIONS, type TsdCp008RenderedLocalizedQuestion } from "./localized-rendered-review";

function renderSection(title: string, questions: readonly TsdCp008RenderedLocalizedQuestion[]): string {
  const lines: string[] = [`# ${title}`, ""];
  const qlIds = [...new Set(questions.map((question) => question.qlId))];
  for (const qlId of qlIds) {
    lines.push(`## ${qlId}`, "");
    const rows = questions.filter((question) => question.qlId === qlId);
    for (const row of rows) lines.push(`${row.familyId}. ${row.stem}`, "");
  }
  return lines.join("\n").trimEnd();
}

const markdown = `${renderSection("TSD-CP-008 Hindi Questions", TSD_CP008_RENDERED_HINDI_QUESTIONS)}\n\n${renderSection("TSD-CP-008 Punjabi Questions", TSD_CP008_RENDERED_PUNJABI_QUESTIONS)}\n`;
const outputDir = process.env.TSD_CP008_LOCALIZATION_REVIEW_OUTPUT_DIR ?? process.cwd();
fs.mkdirSync(outputDir, { recursive: true });
const output = path.resolve(outputDir, "TSD-CP008-HINDI-PUNJABI-QUESTIONS.md");
fs.writeFileSync(output, markdown, "utf8");
console.log(output);

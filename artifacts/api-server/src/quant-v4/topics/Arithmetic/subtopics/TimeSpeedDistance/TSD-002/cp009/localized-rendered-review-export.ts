import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { TSD_CP009_RENDERED_HINDI_QUESTIONS, TSD_CP009_RENDERED_PUNJABI_QUESTIONS } from "./localized-rendered-review";

const outputDir = process.env.TSD_CP009_LOCALIZED_REVIEW_OUTPUT_DIR ?? process.cwd();
mkdirSync(outputDir, { recursive: true });

const lines: string[] = ["# TSD-CP009 Hindi + Punjabi Question Review", "", "Questions only. Answers and explanations intentionally omitted.", ""];

for (const [heading, questions] of [["Hindi", TSD_CP009_RENDERED_HINDI_QUESTIONS], ["Punjabi", TSD_CP009_RENDERED_PUNJABI_QUESTIONS]] as const) {
  lines.push(`## ${heading}`, "");
  let activeQl = "";
  for (const question of questions) {
    if (question.qlId !== activeQl) {
      activeQl = question.qlId;
      lines.push(`### ${activeQl}`, "");
    }
    lines.push(`- **${question.familyId}** ${question.stem}`, "");
  }
}

const filePath = join(outputDir, "TSD-CP009-HINDI-PUNJABI-QUESTIONS.md");
writeFileSync(filePath, `${lines.join("\n").trim()}\n`, "utf8");
console.log(filePath);

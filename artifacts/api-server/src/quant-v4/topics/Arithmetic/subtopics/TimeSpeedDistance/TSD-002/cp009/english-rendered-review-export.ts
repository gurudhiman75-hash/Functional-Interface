import fs from "node:fs";
import path from "node:path";
import { TSD_CP009_RENDERED_ENGLISH_QUESTIONS } from "./english-rendered-review";

const lines: string[] = ["# TSD-CP-009 English Questions", ""];
const qlIds = [...new Set(TSD_CP009_RENDERED_ENGLISH_QUESTIONS.map((question) => question.qlId))];
for (const qlId of qlIds) {
  lines.push(`## ${qlId}`, "");
  for (const question of TSD_CP009_RENDERED_ENGLISH_QUESTIONS.filter((entry) => entry.qlId === qlId)) {
    lines.push(`${question.familyId}. ${question.stem}`, "");
  }
}

const outputDir = process.env.TSD_CP009_ENGLISH_REVIEW_OUTPUT_DIR ?? process.cwd();
fs.mkdirSync(outputDir, { recursive: true });
const output = path.resolve(outputDir, "TSD-CP009-ENGLISH-QUESTIONS.md");
fs.writeFileSync(output, `${lines.join("\n").trimEnd()}\n`, "utf8");
console.log(output);

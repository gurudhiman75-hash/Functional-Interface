import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { renderCp007LocalizedReviewQuestions } from "./localized-rendered-review";
import { TSD_CP007_PERMANENT_QL_IDS } from "./ql-allocation";

const outputDir = process.env.TSD_CP007_LOCALIZED_REVIEW_OUTPUT_DIR ?? "/tmp/tsd-cp007-localized-review";
mkdirSync(outputDir, { recursive: true });

const rows = renderCp007LocalizedReviewQuestions();
const lines: string[] = [];

for (const locale of ["hi-IN", "pa-IN"] as const) {
  lines.push(locale === "hi-IN" ? "## हिंदी" : "## ਪੰਜਾਬੀ", "");
  for (const qlId of TSD_CP007_PERMANENT_QL_IDS) {
    lines.push(`### ${qlId}`, "");
    const questions = rows.filter((row) => row.locale === locale && row.qlId === qlId);
    questions.forEach((row, index) => lines.push(`${index + 1}. ${row.stem}`, ""));
  }
}

const path = join(outputDir, "TSD-CP007-HINDI-PUNJABI-QUESTIONS.md");
writeFileSync(path, `${lines.join("\n").trim()}\n`, "utf8");

console.log(JSON.stringify({
  status: "PASS",
  checkpoint: "TSD-CP-007",
  hindiQuestions: rows.filter((row) => row.locale === "hi-IN").length,
  punjabiQuestions: rows.filter((row) => row.locale === "pa-IN").length,
  outputFormat: "MARKDOWN_QUESTIONS_ONLY",
  mdPath: path,
  localizationStatus: "REVIEW_CANDIDATE",
  questionStudioEnabled: false,
}, null, 2));

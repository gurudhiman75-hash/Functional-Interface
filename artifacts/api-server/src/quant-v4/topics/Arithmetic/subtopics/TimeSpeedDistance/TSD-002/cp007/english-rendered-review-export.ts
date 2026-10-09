import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { renderCp007EnglishReviewSamples } from "./english-rendered-sample-runtime";

const outputDir = process.env.TSD_CP007_REVIEW_OUTPUT_DIR ?? "/tmp/tsd-cp007-english-review";
mkdirSync(outputDir, { recursive: true });
const samples = renderCp007EnglishReviewSamples();

const markdown: string[] = ["# TSD-CP-007 English Question Review", ""];
let currentQl = "";
let questionNumber = 0;
for (const sample of samples) {
  if (sample.qlId !== currentQl) {
    currentQl = sample.qlId;
    questionNumber = 0;
    markdown.push(`## ${sample.qlId}`, "");
  }
  questionNumber += 1;
  markdown.push(`${questionNumber}. ${sample.stem}`, "");
}

const mdPath = join(outputDir, "TSD-CP007-ENGLISH-QUESTIONS.md");
writeFileSync(mdPath, `${markdown.join("\n")}\n`, "utf8");

console.log(JSON.stringify({
  status: "PASS",
  checkpoint: "TSD-CP-007",
  renderedQuestions: samples.length,
  outputFormat: "MARKDOWN_QUESTIONS_ONLY",
  mdPath,
  englishStatus: "REVIEW_CANDIDATE",
  questionStudioEnabled: false,
}, null, 2));

import { writeFileSync } from "node:fs";

import { buildRnk001QuestionStudioPayload } from "./question-studio-payload";
import { previewRnk001QuestionStudioReview } from "./question-studio-review";
import { RNK_001_EXPLANATION_DECLUTTER_VERSION } from "./rnk-001-explanation-declutter-v1";

const outputPath = process.argv[2] ?? "RNK-001-ENGLISH-EXPLANATION-DECLUTTER-REVIEW-V1.md";
const preview = previewRnk001QuestionStudioReview({
  count: 42,
  seed: "rnk-001-explanation-declutter-review-v1",
});

const payloads = preview.questions.map(buildRnk001QuestionStudioPayload);
if (payloads.length !== 42 || new Set(payloads.map((item) => item.qlId)).size !== 42) {
  throw new Error("RNK-001 declutter export must cover all 42 QLs exactly once.");
}

const lines: string[] = [
  "# RNK-001 English Explanation Declutter Review V1",
  "",
  "> Presentation-only review artifact. Frozen questions, options, answers, QL ownership, mathematical fingerprints and release locks remain unchanged.",
  "",
  `- Declutter version: \`${RNK_001_EXPLANATION_DECLUTTER_VERSION}\``,
  "- Coverage: `RNK-QL-001..042` exactly once",
  "- QL001..035: rule/givens/working only; duplicate shortcut/option-analysis/conclusion removed",
  "- QL036..042: decisive relation chains, bounds and witness orders preserved",
  "- Question Bank/test/public delivery: unchanged and locked",
  "",
];

for (const item of payloads) {
  lines.push(
    `## ${item.qlId}`,
    "",
    item.stem,
    "",
    ...item.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`),
    "",
    `**Answer:** ${item.answer}`,
    "",
    "**Solution**",
    "",
  );

  const explanationLines = String(item.explanation)
    .split(/\n+/u)
    .map((line) => line.trim())
    .filter(Boolean);
  explanationLines.forEach((line, index) => lines.push(`${index + 1}. ${line}`));
  lines.push("", "---", "");
}

writeFileSync(outputPath, `${lines.join("\n").trim()}\n`, "utf8");
console.log(JSON.stringify({
  status: "EXPORTED",
  outputPath,
  qlCount: payloads.length,
  declutterVersion: RNK_001_EXPLANATION_DECLUTTER_VERSION,
  sourceAuthorityChanged: false,
}, null, 2));

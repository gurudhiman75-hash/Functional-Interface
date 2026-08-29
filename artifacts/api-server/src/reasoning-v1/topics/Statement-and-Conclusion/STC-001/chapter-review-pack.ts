import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { generateStcQuestion } from "./chapter-generator.ts";
import { generateStcFiveWayQuestion } from "./five-way-profile.ts";
import { STC_QL_IDS, type StcLocale } from "./types.ts";

const LOCALES: readonly StcLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const outDir = process.env.STC_REVIEW_OUT ?? "stc-001-review-pack";
await mkdir(outDir, { recursive: true });

const rows: Array<Record<string, unknown>> = [];
const markdown: string[] = ["# STC-001 Six-QL Trilingual Human Review Pack", ""];

for (const qlId of STC_QL_IDS) {
  markdown.push(`## ${qlId} — Four-way profile`, "");
  for (const locale of LOCALES) {
    markdown.push(`### ${locale}`, "");
    for (let sample = 0; sample < 6; sample += 1) {
      const seed = 101 + sample * 137 + STC_QL_IDS.indexOf(qlId) * 1009;
      const question = generateStcQuestion({ qlId, locale, seed });
      rows.push({ presentationProfile: "FOUR_WAY", ...question });
      markdown.push(
        `**Sample ${sample + 1} — ${question.scenarioId} — seed ${seed} — ${question.difficulty}**`,
        "",
        question.stem,
        "",
        `I. ${question.conclusions[0]}`,
        `II. ${question.conclusions[1]}`,
        "",
        ...question.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`),
        "",
        `**Answer:** ${String.fromCharCode(65 + question.correctIndex)} — ${question.answerClass}`,
        "",
        `**Explanation:** ${question.explanation}`,
        "",
      );
    }
  }
}

markdown.push("## QL002 — Five-way Either/Or banking profile", "");
for (const locale of LOCALES) {
  markdown.push(`### ${locale}`, "");
  for (let sample = 0; sample < 6; sample += 1) {
    const seed = sample * 4;
    const question = generateStcFiveWayQuestion({ qlId: "STC-QL-002", locale, seed });
    rows.push({ ...question });
    markdown.push(
      `**Five-way sample ${sample + 1} — ${question.scenarioId} — seed ${seed}**`,
      "",
      question.stem,
      "",
      `I. ${question.conclusions[0]}`,
      `II. ${question.conclusions[1]}`,
      "",
      ...question.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`),
      "",
      `**Answer:** ${String.fromCharCode(65 + question.correctIndex)} — ${question.answerClass}`,
      "",
      `**Explanation:** ${question.explanation}`,
      "",
    );
  }
}

await writeFile(join(outDir, "stc-001-six-ql-trilingual-review.json"), `${JSON.stringify(rows, null, 2)}\n`, "utf8");
await writeFile(join(outDir, "stc-001-six-ql-trilingual-review.md"), `${markdown.join("\n")}\n`, "utf8");
console.log(`Exported ${rows.length} STC review surfaces: 108 four-way + 18 five-way either/or.`);

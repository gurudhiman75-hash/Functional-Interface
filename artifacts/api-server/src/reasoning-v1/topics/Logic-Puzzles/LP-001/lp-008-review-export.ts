import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateLp008Batch } from "./lp-008.ts";

const outputDirectory = process.env.LP008_REVIEW_OUTPUT_DIR || resolve(process.cwd(), "dist/reasoning-v1/lp-008-review");
mkdirSync(outputDirectory, { recursive: true });
const caselets = generateLp008Batch("lp-008-generated-review", 12);
const lines: string[] = [
  "# LP-008 Generated Review Pack",
  "",
  "> Review-only English candidate. No permanent QL allocation, localization, Question Bank write or publication is authorized.",
  "",
  "This pack contains 12 month-and-date scheduling caselets and 48 correlated child questions. Each caselet assigns eight named people to the eight dates formed by four months and two dates in each month.",
  "",
];

for (const caselet of caselets) {
  lines.push(`## ${caselet.caseletId} — ${caselet.scenarioProfileId} — ${caselet.difficultyBand}`, "", "**Solved assignment used by the explanations**", "", "| Person | Date and month |", "|---|---|", ...caselet.people.map((person) => `| ${caselet.labels.people[person]} | ${["12th", "27th"][caselet.assignment[person] % 2]} ${caselet.labels.months[Math.floor(caselet.assignment[person] / 2) as 0 | 1 | 2 | 3]} |`), "");
  for (const child of caselet.children) {
    lines.push(`### ${child.questionId} — ${child.qlId} — Standalone question`, "", child.stem, "", ...child.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`), "", `**Answer:** ${child.answer}`, "", "**Explanation**", "", child.explanation.lines.join("\n\n"), "");
  }
}

const reviewText = `${lines.join("\n")}\n`;
writeFileSync(resolve(outputDirectory, "LP-008-generated-review.md"), reviewText, "utf8");
console.log(`Wrote ${caselets.length} caselets and ${caselets.length * 4} questions to ${outputDirectory}/LP-008-generated-review.md`);

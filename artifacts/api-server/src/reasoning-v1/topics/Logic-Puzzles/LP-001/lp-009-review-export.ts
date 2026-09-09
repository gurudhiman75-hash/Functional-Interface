import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateLp009Batch } from "./lp-009.ts";

const outputDirectory = process.env.LP009_REVIEW_OUTPUT_DIR || resolve(process.cwd(), "dist/reasoning-v1/lp-009-review");
mkdirSync(outputDirectory, { recursive: true });
const caselets = generateLp009Batch("lp-009-generated-review", 12);
const lines: string[] = [
  "# LP-009 Generated Review Pack",
  "",
  "> Review-only English candidate. No permanent QL allocation, localization, Question Bank write or publication is authorized.",
  "",
  "This pack contains 12 month-based and year-based scheduling caselets and 48 correlated child questions. Month caselets assign six named entities to six ordered months; year caselets assign six named persons to six ordered birth years.",
  "",
];

for (const caselet of caselets) {
  lines.push(`## ${caselet.caseletId} — ${caselet.scenarioProfileId} — ${caselet.difficultyBand}`, "", "**Solved assignment used by the explanations**", "", `| ${caselet.labels.personNoun[0]!.toUpperCase()}${caselet.labels.personNoun.slice(1)} | ${caselet.labels.valueHeader} |`, "|---|---|", ...caselet.people.map((person) => `| ${caselet.labels.people[person]} | ${caselet.labels.values[caselet.assignment[person]]} |`), "");
  for (const child of caselet.children) {
    lines.push(`### ${child.questionId} — ${child.qlId} — Standalone question`, "", child.stem, "", ...child.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`), "", `**Answer:** ${child.answer}`, "", "**Explanation**", "", child.explanation.lines.join("\n\n"), "");
  }
}

const reviewText = `${lines.join("\n")}\n`;
writeFileSync(resolve(outputDirectory, "LP-009-generated-review.md"), reviewText, "utf8");
console.log(`Wrote ${caselets.length} caselets and ${caselets.length * 4} questions to ${outputDirectory}/LP-009-generated-review.md`);

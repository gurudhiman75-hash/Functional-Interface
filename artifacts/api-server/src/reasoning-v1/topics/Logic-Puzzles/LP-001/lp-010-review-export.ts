import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateLp010Batch } from "./lp-010.ts";

const outputDirectory = process.env.LP010_REVIEW_OUTPUT_DIR || resolve(process.cwd(), "dist/reasoning-v1/lp-010-review");
mkdirSync(outputDirectory, { recursive: true });
const caselets = generateLp010Batch("lp-010-generated-review", 12);
const lines: string[] = [
  "# LP-010 Generated Review Pack",
  "",
  "> Review-only English candidate. No permanent QL allocation, localization, Question Bank write or publication is authorized.",
  "",
  "This pack contains 12 day-and-time scheduling caselets and 48 correlated child questions. The batch deliberately mixes repeated, partly repeated and highly distinct clock-time layouts; some caselets use five or six different times across the six day-time slots.",
  "",
];

for (const caselet of caselets) {
  lines.push(`## ${caselet.caseletId} — ${caselet.scenarioProfileId} — ${caselet.difficultyBand} — ${caselet.labels.times.length} unique times`, "", "**Solved assignment used by the explanations**", "", `| ${caselet.labels.personNoun[0]!.toUpperCase()}${caselet.labels.personNoun.slice(1)} | Day and time |`, "|---|---|", ...caselet.people.map((person) => `| ${caselet.labels.people[person]} | ${caselet.labels.slots[caselet.assignment[person]]} |`), "");
  for (const child of caselet.children) {
    lines.push(`### ${child.questionId} — ${child.qlId} — Standalone question`, "", child.stem, "", ...child.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`), "", `**Answer:** ${child.answer}`, "", "**Explanation**", "", child.explanation.lines.join("\n\n"), "");
  }
}

const reviewText = `${lines.join("\n")}\n`;
writeFileSync(resolve(outputDirectory, "LP-010-generated-review.md"), reviewText, "utf8");
console.log(`Wrote ${caselets.length} caselets and ${caselets.length * 4} questions to ${outputDirectory}/LP-010-generated-review.md`);

import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateLp007Batch } from "./lp-007.ts";

const outputDirectory = process.env.LP007_REVIEW_OUTPUT_DIR || resolve(process.cwd(), "dist/reasoning-v1/lp-007-review");
mkdirSync(outputDirectory, { recursive: true });
const caselets = generateLp007Batch("lp-007-generated-review", 12);
const lines: string[] = [
  "# LP-007 Generated Review Pack",
  "",
  "> Review-only English candidate. No permanent QL allocation, localization, Question Bank write or publication is authorized.",
  "",
  "This pack contains 12 variable/preference caselets and 48 correlated child questions. Each caselet assigns five named people one different choice from a complete five-choice list.",
  "",
];

for (const caselet of caselets) {
  const personHeader = `${caselet.labels.personNoun[0]!.toUpperCase()}${caselet.labels.personNoun.slice(1)}`;
  const valueHeader = `${caselet.labels.valueNoun[0]!.toUpperCase()}${caselet.labels.valueNoun.slice(1)}`;
  lines.push(`## ${caselet.caseletId} — ${caselet.scenarioProfileId} — ${caselet.difficultyBand}`, "", "**Solved assignment used by the explanations**", "", `| ${personHeader} | ${valueHeader} |`, "|---|---|", ...caselet.people.map((person) => `| ${caselet.labels.people[person]} | ${caselet.labels.values[caselet.assignment[person]]} |`), "");
  for (const child of caselet.children) {
    lines.push(`### ${child.questionId} — ${child.qlId} — Standalone question`, "", child.stem, "", ...child.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`), "", `**Answer:** ${child.answer}`, "", "**Explanation**", "", child.explanation.lines.join("\n\n"), "");
  }
}

const reviewText = `${lines.join("\n")}\n`;
writeFileSync(resolve(outputDirectory, "LP-007-generated-review.md"), reviewText, "utf8");
console.log(`Wrote ${caselets.length} caselets and ${caselets.length * 4} questions to ${outputDirectory}/LP-007-generated-review.md`);

import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateLp002Batch } from "./lp-002.ts";

const outputDirectory = process.env.LP002_REVIEW_OUTPUT_DIR || resolve(process.cwd(), "dist/reasoning-v1/lp-002-review");
mkdirSync(outputDirectory, { recursive: true });
const caselets = generateLp002Batch("lp-002-generated-review", 12);
const lines: string[] = [
  "# LP-002 Generated Review Pack",
  "",
  "> Review-only English candidate. No permanent QL allocation, localization, Question Bank write or publication is authorized.",
  "",
  "This pack contains 12 multi-attribute assignment caselets and 48 correlated child questions. Each caselet assigns four named people to one distinct day and one distinct ordered location.",
  "",
];
for (const caselet of caselets) {
  lines.push(`## ${caselet.caseletId} — ${caselet.scenarioProfileId} — ${caselet.difficultyBand}`, "", caselet.scenario, "", "**Clues**", "", ...caselet.clues.map((clue) => `- ${clue.text}`), "", "**Solved schedule used by the explanations**", "", "| Person | Day | Location |", "|---|---|---|", ...caselet.people.map((person) => `| ${person} | ${caselet.assignment.dayByPerson[person]} | ${caselet.locationLabels[caselet.assignment.locationByPerson[person]!]} |`), "");
  for (const child of caselet.children) {
    lines.push(`### ${child.questionId} — ${child.qlId}`, "", child.stem, "", ...child.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`), "", `**Answer:** ${child.answer}`, "", "**Explanation**", "", child.explanation.lines.join("\n\n"), "");
  }
}
writeFileSync(resolve(outputDirectory, "LP-002-generated-review.md"), `${lines.join("\n")}\n`, "utf8");
console.log(`Wrote ${caselets.length} caselets and ${caselets.length * 4} questions to ${outputDirectory}/LP-002-generated-review.md`);

import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateCaseletBatch } from "./index.ts";

const outputDirectory = process.env.LP001_REVIEW_OUTPUT_DIR || resolve(process.cwd(), "dist/reasoning-v1/lp-001-review");
mkdirSync(outputDirectory, { recursive: true });
const caselets = generateCaseletBatch("lp-001-generated-review", 12);
const lines: string[] = [
  "# LP-001 Generated Review Pack",
  "",
  "> Review-only English candidate. No permanent QL allocation, localization, Question Bank write or publication is authorized.",
  "",
  "This pack contains 12 assignment/grouping caselets and 48 correlated child questions. Each caselet has six named people, three two-person groups, a unique solution and a table-based explanation.",
  "",
];
for (const caselet of caselets) {
  lines.push(`## ${caselet.caseletId} — ${caselet.scenarioProfileId} — ${caselet.difficultyBand}`, "", caselet.scenario, "", "**Clues**", "", ...caselet.clues.map((clue) => `- ${clue.text}`), "", "**Solved allocation used by the explanations**", "", "| Unit | Members |", "|---|---|", ...caselet.groups.map((group) => {
    const members = Object.entries(caselet.assignment).filter(([, assigned]) => assigned === group).map(([person]) => person).join(" and ");
    return `| ${caselet.groupLabels[group]} | ${members} |`;
  }), "");
  for (const child of caselet.children) {
    lines.push(`### ${child.questionId} — ${child.qlId}`, "", child.stem, "", ...child.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`), "", `**Answer:** ${child.answer}`, "", "**Explanation**", "", child.explanation.lines.join("\n\n"), "");
  }
}
writeFileSync(resolve(outputDirectory, "LP-001-generated-review.md"), `${lines.join("\n")}\n`, "utf8");
console.log(`Wrote ${caselets.length} caselets and ${caselets.length * 4} questions to ${outputDirectory}/LP-001-generated-review.md`);

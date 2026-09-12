import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateLp003Batch } from "./lp-003.ts";

const outputDirectory = process.env.LP003_REVIEW_OUTPUT_DIR || resolve(process.cwd(), "dist/reasoning-v1/lp-003-review");
mkdirSync(outputDirectory, { recursive: true });
const caselets = generateLp003Batch("lp-003-generated-review", 12);
const lines: string[] = [
  "# LP-003 Generated Review Pack",
  "",
  "> Review-only English candidate. No permanent QL allocation, localization, Question Bank write or publication is authorized.",
  "",
  "This pack contains 12 box-stack caselets and 48 correlated child questions. Each caselet places seven labelled boxes in one vertical stack, with position 1 at the bottom.",
  "",
];
for (const caselet of caselets) {
  lines.push(`## ${caselet.caseletId} — ${caselet.scenarioProfileId} — ${caselet.difficultyBand}`, "", caselet.scenario, "", "**Clues**", "", ...caselet.clues.map((clue) => `- ${clue.text}`), "", "**Solved stack used by the explanations**", "", "| Position from bottom | Box contents |", "|---:|---|", ...caselet.positions.map((position) => `| ${position} | ${caselet.boxLabels[caselet.boxes.find((box) => caselet.assignment[box] === position)!]} |`), "");
  for (const child of caselet.children) {
    lines.push(`### ${child.questionId} — ${child.qlId}`, "", child.stem, "", ...child.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`), "", `**Answer:** ${child.answer}`, "", "**Explanation**", "", child.explanation.lines.join("\n\n"), "");
  }
}
writeFileSync(resolve(outputDirectory, "LP-003-generated-review.md"), `${lines.join("\n")}\n`, "utf8");
console.log(`Wrote ${caselets.length} caselets and ${caselets.length * 4} questions to ${outputDirectory}/LP-003-generated-review.md`);

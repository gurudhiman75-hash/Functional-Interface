import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateLp004Batch } from "./lp-004.ts";

const outputDirectory = process.env.LP004_REVIEW_OUTPUT_DIR || resolve(process.cwd(), "dist/reasoning-v1/lp-004-review");
mkdirSync(outputDirectory, { recursive: true });
const caselets = generateLp004Batch("lp-004-generated-review", 12);
const lines: string[] = [
  "# LP-004 Generated Review Pack",
  "",
  "> Review-only English candidate. No permanent QL allocation, localization, Question Bank write or publication is authorized.",
  "",
  "This pack contains 12 selection caselets and 48 correlated child questions. Each caselet selects exactly four people from seven candidates using conditional and pairwise rules.",
  "",
];
for (const caselet of caselets) {
  lines.push(`## ${caselet.caseletId} — ${caselet.scenarioProfileId} — ${caselet.difficultyBand}`, "", caselet.scenario, "", "**Clues**", "", ...caselet.clues.map((clue) => `- ${clue.text}`), "", "**Solved committee used by the explanations**", "", "| Candidate | Status |", "|---|---|", ...caselet.candidates.map((candidate) => `| ${caselet.candidateLabels[candidate]} | ${caselet.assignment[candidate] ? "Selected" : "Not selected"} |`), "");
  for (const child of caselet.children) {
    lines.push(`### ${child.questionId} — ${child.qlId}`, "", child.stem, "", ...child.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`), "", `**Answer:** ${child.answer}`, "", "**Explanation**", "", child.explanation.lines.join("\n\n"), "");
  }
}
writeFileSync(resolve(outputDirectory, "LP-004-generated-review.md"), `${lines.join("\n")}\n`, "utf8");
console.log(`Wrote ${caselets.length} caselets and ${caselets.length * 4} questions to ${outputDirectory}/LP-004-generated-review.md`);

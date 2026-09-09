import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateLp005Batch } from "./lp-005.ts";

const outputDirectory = process.env.LP005_REVIEW_OUTPUT_DIR || resolve(process.cwd(), "dist/reasoning-v1/lp-005-review");
mkdirSync(outputDirectory, { recursive: true });
const caselets = generateLp005Batch("lp-005-generated-review", 12);
const lines: string[] = ["# LP-005 Generated Review Pack", "", "> Review-only English candidate. No permanent QL allocation, localization, Question Bank write or publication is authorized.", "", "This pack contains 12 matching caselets and 48 correlated child questions. Each caselet assigns five people to five duties and five locations.", ""];
for (const caselet of caselets) {
  lines.push(`## ${caselet.caseletId} — ${caselet.scenarioProfileId} — ${caselet.difficultyBand}`, "", caselet.scenario, "", "**Clues**", "", ...caselet.clues.map((clue) => `- ${clue.text}`), "", "**Solved matching used by the explanations**", "", "| Person | Duty | Location |", "|---|---|---|", ...caselet.people.map((person) => `| ${caselet.labels.people[person]} | ${caselet.labels.duties[caselet.assignment.dutyByPerson[person]]} | ${caselet.labels.places[caselet.assignment.placeByPerson[person]]} |`), "");
  for (const child of caselet.children) lines.push(`### ${child.questionId} — ${child.qlId}`, "", child.stem, "", ...child.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`), "", `**Answer:** ${child.answer}`, "", "**Explanation**", "", child.explanation.lines.join("\n\n"), "");
}
writeFileSync(resolve(outputDirectory, "LP-005-generated-review.md"), `${lines.join("\n")}\n`, "utf8");
console.log(`Wrote ${caselets.length} caselets and ${caselets.length * 4} questions to ${outputDirectory}/LP-005-generated-review.md`);

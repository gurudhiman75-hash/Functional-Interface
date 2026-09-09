import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateLp006Batch } from "./lp-006.ts";

const outputDirectory = process.env.LP006_REVIEW_OUTPUT_DIR || resolve(process.cwd(), "dist/reasoning-v1/lp-006-review");
mkdirSync(outputDirectory, { recursive: true });
const caselets = generateLp006Batch("lp-006-generated-review", 12);
const lines: string[] = ["# LP-006 Generated Review Pack", "", "> Review-only English candidate. No permanent QL allocation, localization, Question Bank write or publication is authorized.", "", "This pack contains 12 advanced synthesis caselets and 48 correlated child questions. Each caselet assigns four people to one day, one study area and one city.", ""];
for (const caselet of caselets) {
  lines.push(`## ${caselet.caseletId} — ${caselet.scenarioProfileId} — ${caselet.difficultyBand}`, "", "**Solved synthesis used by the explanations**", "", "| Person | Day | Study area | City |", "|---|---|---|---|", ...caselet.people.map((person) => `| ${caselet.labels.people[person]} | ${caselet.assignment.dayByPerson[person]} | ${caselet.labels.subjects[caselet.assignment.subjectByPerson[person]]} | ${caselet.labels.cities[caselet.assignment.cityByPerson[person]]} |`), "");
  for (const child of caselet.children) lines.push(`### ${child.questionId} — ${child.qlId} — Standalone question`, "", child.stem, "", ...child.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`), "", `**Answer:** ${child.answer}`, "", "**Explanation**", "", child.explanation.lines.join("\n\n"), "");
}
const reviewText = `${lines.join("\n")}\n`;
writeFileSync(resolve(outputDirectory, "LP-006-generated-review.md"), reviewText, "utf8");
writeFileSync(resolve(outputDirectory, "LP-006-generated-review-v2.md"), reviewText, "utf8");
console.log(`Wrote ${caselets.length} caselets and ${caselets.length * 4} questions to ${outputDirectory}/LP-006-generated-review.md and LP-006-generated-review-v2.md`);

import { writeFileSync } from "node:fs";
import { generateLp010Batch } from "./lp-010.ts";

const caselets = generateLp010Batch("lp-010-human-review", 12);
const lines: string[] = [
  "# LP-010 Generated Review Pack",
  "",
  "Review-only English candidate: family structure combined with profession or height constraints.",
  "",
];
for (const caselet of caselets) {
  lines.push(`## ${caselet.caseletId} — ${caselet.mode} — ${caselet.difficultyBand}`, "");
  for (const child of caselet.children) {
    lines.push(`### ${child.questionId} · ${child.qlId}`, "", child.stem, "");
    child.options.forEach((option, index) => lines.push(`${String.fromCharCode(65 + index)}. ${option}`));
    lines.push("", `**Answer:** ${String.fromCharCode(65 + child.correctIndex)}. ${child.answer}`, "", "**Explanation**", "");
    lines.push(...child.explanation.lines, "", "---", "");
  }
}
writeFileSync("LP-010-GENERATED-REVIEW.md", lines.join("\n"));
console.log(`Wrote ${caselets.length} LP-010 caselets and ${caselets.length * 4} child questions.`);

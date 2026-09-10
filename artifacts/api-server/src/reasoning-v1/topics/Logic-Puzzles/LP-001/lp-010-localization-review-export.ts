import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateLp010LocalizedBatchV2 } from "./lp-010-localization-v2.ts";

const outputDirectory = process.env.LP010_LOCALIZATION_REVIEW_OUTPUT_DIR || resolve(process.cwd(), "dist/reasoning-v1/lp-010-localization-review");
mkdirSync(outputDirectory, { recursive: true });

const lines: string[] = [
  "# LP-010 Hindi/Punjabi Localization Review V2",
  "",
  "> Review candidate only. English V4 remains frozen. Hindi/Punjabi are not frozen or connected to Question Studio yet.",
  "",
  "The same seed is used for both languages so assignment, QL, difficulty, correct option index and 2/4/5/6-time layout semantics remain identical.",
  "",
];

for (const language of ["hi", "pa"] as const) {
  const label = language === "hi" ? "Hindi" : "Punjabi";
  const caselets = generateLp010LocalizedBatchV2(language, "lp-010-hi-pa-human-review-v2", 6);
  lines.push(`# ${label}`, "");
  for (const caselet of caselets) {
    lines.push(`## ${caselet.caseletId} — ${caselet.scenarioProfileId} — ${caselet.difficultyBand} — ${caselet.labels.times.length} unique times`, "", "**Solved assignment used by explanation**", "", `| ${caselet.labels.personNoun} | Day/time |`, "|---|---|", ...caselet.people.map((person) => `| ${caselet.labels.people[person]} | ${caselet.labels.slots[caselet.assignment[person]]} |`), "");
    for (const child of caselet.children) {
      lines.push(`### ${child.questionId} — ${child.qlId}`, "", child.stem, "", ...child.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`), "", `**Answer:** ${child.answer}`, "", "**Explanation**", "", child.explanation.lines.join("\n\n"), "");
    }
  }
}

writeFileSync(resolve(outputDirectory, "LP-010-HI-PA-LOCALIZATION-REVIEW-V2.md"), `${lines.join("\n")}\n`, "utf8");
console.log(`Wrote LP-010 Hindi/Punjabi V2 review pack to ${outputDirectory}/LP-010-HI-PA-LOCALIZATION-REVIEW-V2.md`);

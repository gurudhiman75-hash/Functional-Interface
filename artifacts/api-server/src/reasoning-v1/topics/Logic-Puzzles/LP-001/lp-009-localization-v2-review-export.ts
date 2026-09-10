import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateLp009LocalizedBatchV2 } from "./lp-009-localization-v2.ts";
import type { Lp009LocalizedLanguage } from "./lp-009-localization-v1.ts";

const outputDirectory = process.env.LP009_LOCALIZATION_V2_REVIEW_OUTPUT_DIR || resolve(process.cwd(), "dist/reasoning-v1/lp-009-localization-review-v2");
mkdirSync(outputDirectory, { recursive: true });

function render(language: Lp009LocalizedLanguage): string {
  const label = language === "hi" ? "Hindi" : "Punjabi";
  const caselets = generateLp009LocalizedBatchV2(language, "lp-009-localization-human-review-v2", 8);
  const lines: string[] = [
    `# LP-009 ${label} Localization Review V2`,
    "",
    "Human-review sample for native exam wording. Solver truth, QL ownership, difficulty and answer positions remain frozen.",
    "",
  ];
  for (const caselet of caselets) {
    lines.push(`## ${caselet.caseletId} — ${caselet.scenarioProfileId} — ${caselet.difficultyBand}`, "");
    for (const child of caselet.children) {
      lines.push(`### ${child.questionId} — ${child.qlId}`, "", child.stem, "");
      child.options.forEach((option, index) => lines.push(`${String.fromCharCode(65 + index)}. ${option}${index === child.correctIndex ? "  ← correct" : ""}`));
      lines.push("", `**Answer:** ${child.answer}`, "", `**Explanation summary:** ${child.explanation.summary}`, "");
      child.explanation.lines.forEach((line) => lines.push(line, ""));
    }
  }
  return lines.join("\n");
}

for (const language of ["hi", "pa"] as const) writeFileSync(resolve(outputDirectory, `lp-009-${language}-review-v2.md`), render(language), "utf8");

writeFileSync(resolve(outputDirectory, "README.md"), [
  "# LP-009 Localization Review Pack V2",
  "",
  "- 8 caselets per language covering all 8 scenario profiles.",
  "- 32 Hindi + 32 Punjabi questions.",
  "- V2 removes grammatically awkward V1 constructions and uses profile-specific exam wording.",
  "- Review only; no Question Bank/test/mock/publication activation.",
  "",
].join("\n"), "utf8");

console.log(`LP-009 localization V2 review pack written to ${outputDirectory}`);

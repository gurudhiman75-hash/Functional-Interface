import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Lp009LocalizedLanguage } from "./lp-009-localization-v1.ts";
import { generateLp009LocalizedBatchV3 } from "./lp-009-localization-v3.ts";

const outputDirectory = process.env.LP009_LOCALIZATION_V3_REVIEW_OUTPUT_DIR || resolve(process.cwd(), "dist/reasoning-v1/lp-009-localization-review-v3");
mkdirSync(outputDirectory, { recursive: true });

function render(language: Lp009LocalizedLanguage): string {
  const label = language === "hi" ? "Hindi" : "Punjabi";
  const caselets = generateLp009LocalizedBatchV3(language, "lp-009-localization-human-review-v3", 8);
  const lines: string[] = [
    `# LP-009 ${label} Localization Review V3`,
    "",
    "Current human-review sample. V3 retains V2 native exam wording and closes year-mode grammatical inflection issues.",
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

for (const language of ["hi", "pa"] as const) writeFileSync(resolve(outputDirectory, `lp-009-${language}-review-v3.md`), render(language), "utf8");

writeFileSync(resolve(outputDirectory, "README.md"), [
  "# LP-009 Localization Review Pack V3",
  "",
  "- Current review authority: LP_009_HI_PA_LOCALIZATION_REVIEW_V3.",
  "- 8 caselets per language covering all 8 scenario profiles.",
  "- 32 Hindi + 32 Punjabi questions.",
  "- Review-only; no Question Bank/test/mock/publication activation.",
  "",
].join("\n"), "utf8");

console.log(`LP-009 localization V3 review pack written to ${outputDirectory}`);

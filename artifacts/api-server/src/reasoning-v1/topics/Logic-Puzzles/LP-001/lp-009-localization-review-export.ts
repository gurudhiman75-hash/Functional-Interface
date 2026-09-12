import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateLp009LocalizedBatch, type Lp009LocalizedLanguage } from "./lp-009-localization-v1.ts";

const outputDirectory = process.env.LP009_LOCALIZATION_REVIEW_OUTPUT_DIR || resolve(process.cwd(), "dist/reasoning-v1/lp-009-localization-review");
mkdirSync(outputDirectory, { recursive: true });

function render(language: Lp009LocalizedLanguage): string {
  const label = language === "hi" ? "Hindi" : "Punjabi";
  const caselets = generateLp009LocalizedBatch(language, "lp-009-localization-human-review", 8);
  const lines: string[] = [
    `# LP-009 ${label} Localization Review V1`,
    "",
    "Review-only sample. English authority, QL ownership, solver truth and correct-option positions are frozen; only learner-facing localization is under review.",
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

for (const language of ["hi", "pa"] as const) {
  writeFileSync(resolve(outputDirectory, `lp-009-${language}-review-v1.md`), render(language), "utf8");
}

writeFileSync(resolve(outputDirectory, "README.md"), [
  "# LP-009 Localization Review Pack V1",
  "",
  "- `lp-009-hi-review-v1.md` — Hindi samples across all eight scenario profiles.",
  "- `lp-009-pa-review-v1.md` — Punjabi samples across all eight scenario profiles.",
  "- 32 questions per language / 64 localized review questions total.",
  "- Review only: no Question Bank, tests, mocks or public publication.",
  "",
].join("\n"), "utf8");

console.log(`LP-009 localization review pack written to ${outputDirectory}`);

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateDi009HistogramSet } from "./histogram-set";
import type { Di009ExamProfile } from "./types";

const profiles: readonly Di009ExamProfile[] = ["SSC_CGL_TIER_I", "SSC_CGL_TIER_II"];
const lines: string[] = [
  "# DI-009 — Histogram — English Review Pack P0",
  "",
  "Lifecycle: human review only. No Question Studio registration, Question Bank write, test/mock eligibility, localization or publication is authorized by this artifact.",
  "",
];

let ordinal = 1;
for (const profile of profiles) {
  lines.push(`## ${profile}`, "");
  for (let sample = 1; sample <= 2; sample += 1) {
    const set = generateDi009HistogramSet({ seed: `DI-009-REVIEW-${profile}-${sample}`, examProfile: profile });
    lines.push(`### Histogram set ${sample}`, "", set.stimulus.svg, "");
    lines.push("Fallback data table:", "", "| Class interval | Frequency |", "|---|---:|");
    for (const bin of set.stimulus.bins) lines.push(`| ${bin.lower}–${bin.upper} | ${bin.frequency} |`);
    lines.push("");
    for (const question of set.questions) {
      lines.push(`#### Q${ordinal}. ${question.difficulty} — ${question.kind}`, "", question.stem, "");
      question.options.forEach((option, index) => lines.push(`${String.fromCharCode(65 + index)}. ${option}`));
      lines.push("", `**Answer:** ${String.fromCharCode(65 + question.correctIndex)}. ${question.answer}`, "");
      lines.push(`**Explanation:** ${question.explanation.keyIdea}`, "");
      question.explanation.steps.forEach((step, index) => lines.push(`${index + 1}. ${step}`));
      lines.push("");
      ordinal += 1;
    }
  }
}

const outputPath = resolve(process.argv[2] ?? "DI-009-REVIEW-P0.md");
writeFileSync(outputPath, `${lines.join("\n")}\n`, "utf8");
console.log(JSON.stringify({ status: "EXPORTED_DI_009_REVIEW_P0", outputPath, questions: ordinal - 1 }));

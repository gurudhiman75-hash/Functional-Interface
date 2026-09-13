import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateStat002Question, STAT002_CONTRACTS } from "./standard-deviation";
import type { Stat002ExamProfile } from "./types";

const profiles: readonly Stat002ExamProfile[] = ["SSC_CGL_TIER_II", "SSC_CGL_JSO"];
const lines: string[] = [
  "# STAT-002 — Standard Deviation — English Review Pack P0",
  "",
  "Lifecycle: review only. No permanent QLs, Question Studio registration, Question Bank write, test/mock eligibility or publication is authorized by this artifact.",
  "",
];

let ordinal = 1;
for (const profile of profiles) {
  lines.push(`## ${profile}`, "");
  for (const contractId of STAT002_CONTRACTS) {
    lines.push(`### ${contractId}`, "");
    for (let sample = 1; sample <= 3; sample += 1) {
      const question = generateStat002Question({
        seed: `STAT-002-REVIEW-${profile}-${contractId}-${sample}`,
        examProfile: profile,
        contractId,
      });
      lines.push(`#### Q${ordinal}. ${question.difficulty}`, "");
      lines.push(question.stem, "");
      question.options.forEach((option, index) => lines.push(`${String.fromCharCode(65 + index)}. ${option}`));
      lines.push("", `**Answer:** ${String.fromCharCode(65 + question.correctIndex)}. ${question.answer}`, "");
      lines.push(`**Explanation:** ${question.explanation.keyIdea}`, "");
      question.explanation.steps.forEach((step, index) => lines.push(`${index + 1}. ${step}`));
      lines.push("");
      ordinal += 1;
    }
  }
}

const outputPath = resolve(process.argv[2] ?? "STAT-002-REVIEW-P0.md");
writeFileSync(outputPath, `${lines.join("\n")}\n`, "utf8");
console.log(JSON.stringify({ status: "EXPORTED_STAT_002_REVIEW_P0", outputPath, questions: ordinal - 1 }));

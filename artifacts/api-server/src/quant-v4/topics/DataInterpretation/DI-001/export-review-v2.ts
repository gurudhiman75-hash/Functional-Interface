import { writeFileSync } from "node:fs";
import { buildDi001V2ReviewSets } from "./review-utils-v2";
import { DI001_V2_TASK_KINDS } from "./table-set-v2";

const outputPath = process.argv[2] ?? "DI-001-REVIEW-V2.md";
const sets = buildDi001V2ReviewSets();

const lines: string[] = [
  "# DI-001 — Table Interpretation V2 Review",
  "",
  "> Review-only candidate. This file does not authorize Question Studio discovery, Question Bank writes, test/mock use, public publication, or production release.",
  "",
  `- Review sets: ${sets.length}`,
  `- Review questions: ${sets.reduce((sum, set) => sum + set.questions.length, 0)}`,
  `- Task families covered: ${DI001_V2_TASK_KINDS.length}`,
  "- Set mix: exactly 1 Easy + 2 Medium + 2 Hard",
  "- Profiles: SSC CGL Tier I (4 options), Banking Prelims (5 options)",
  "",
];

for (const [setIndex, set] of sets.entries()) {
  lines.push(`## Set ${setIndex + 1} — ${set.examProfile}`, "", set.stimulus.instruction, "");
  lines.push(`**${set.stimulus.title}**`, "");
  lines.push(`| ${set.stimulus.columns.join(" | ")} |`, `| ${set.stimulus.columns.map(() => "---").join(" | ")} |`);
  for (const row of set.stimulus.rows) {
    lines.push(`| ${row.centre} | ${row.applicants} | ${row.selected} |`);
  }
  lines.push("");

  for (const [questionIndex, question] of set.questions.entries()) {
    lines.push(`### Q${questionIndex + 1} — ${question.difficulty} · ${question.kind}`, "", question.stem, "");
    question.options.forEach((option, optionIndex) => lines.push(`${String.fromCharCode(65 + optionIndex)}. ${option}`));
    lines.push("", `**Answer:** ${String.fromCharCode(65 + question.correctIndex)}. ${question.answer}`, "", `**Explanation:** ${question.explanation.keyIdea}`);
    question.explanation.steps.forEach((step, stepIndex) => lines.push(`${stepIndex + 1}. ${step}`));
    if (question.explanation.workingTable) {
      const table = question.explanation.workingTable;
      lines.push("", `| ${table.headers.join(" | ")} |`, `| ${table.headers.map(() => "---").join(" | ")} |`);
      table.rows.forEach((row) => lines.push(`| ${row.join(" | ")} |`));
    }
    lines.push("");
  }
}

writeFileSync(outputPath, `${lines.join("\n")}\n`, "utf8");
console.log(JSON.stringify({ status: "EXPORTED_DI_001_REVIEW_V2_MD", outputPath, sets: sets.length, questions: sets.length * 5 }));

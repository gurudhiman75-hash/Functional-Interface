import { writeFileSync } from "node:fs";
import { buildDi003V2ReviewSets } from "./review-utils-v2";

function table(headers: readonly string[], rows: readonly (readonly string[])[]) {
  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.join(" | ")} |`),
  ].join("\n");
}

const outputPath = process.argv[2] ?? "DI-003-REVIEW-V2.md";
const sets = buildDi003V2ReviewSets();
const lines: string[] = [
  "# DI-003 Grouped Bar Interpretation — V2 Review Pack",
  "",
  "> REVIEW ONLY — not Question Studio discoverable, not stored in Question Bank, and not eligible for tests, mocks or public delivery.",
  "",
  `Sets: ${sets.length} | Questions: ${sets.reduce((sum, set) => sum + set.questions.length, 0)} | Profiles: SSC CGL Tier I + Banking Prelims`,
  "",
];

sets.forEach((set, setIndex) => {
  lines.push(`## Set ${setIndex + 1} — ${set.examProfile.replaceAll("_", " ")}`);
  lines.push("");
  lines.push(`**${set.stimulus.title}**`);
  lines.push("");
  lines.push(set.stimulus.instruction);
  lines.push("");
  lines.push(table(
    ["Category", set.stimulus.series[0].label, set.stimulus.series[1].label],
    set.stimulus.points.map((point) => [point.category, String(point.seriesA), String(point.seriesB)]),
  ));
  lines.push("");
  lines.push("_The standalone HTML review renders the same data as the actual grouped bar chart._");
  lines.push("");

  set.questions.forEach((question, questionIndex) => {
    lines.push(`### Q${questionIndex + 1} — ${question.difficulty} — ${question.kind}`);
    lines.push("");
    lines.push(question.stem);
    lines.push("");
    question.options.forEach((option, optionIndex) => lines.push(`${String.fromCharCode(65 + optionIndex)}. ${option}`));
    lines.push("");
    lines.push(`**Answer:** ${String.fromCharCode(65 + question.correctIndex)}. ${question.answer}`);
    lines.push("");
    lines.push(`**Explanation:** ${question.explanation.keyIdea}`);
    lines.push("");
    question.explanation.steps.forEach((step, stepIndex) => lines.push(`${stepIndex + 1}. ${step}`));
    if (question.explanation.workingTable) {
      lines.push("");
      lines.push(table(question.explanation.workingTable.headers, question.explanation.workingTable.rows));
    }
    lines.push("");
  });
});

writeFileSync(outputPath, `${lines.join("\n")}\n`, "utf8");
console.log(JSON.stringify({ status: "EXPORTED_DI_003_REVIEW_V2_MD", outputPath, sets: sets.length, questions: sets.reduce((sum, set) => sum + set.questions.length, 0) }));

import { writeFileSync } from "node:fs";
import { markdownTable, selectDi009V2ReviewSets } from "./review-utils";

const outputPath = process.argv[2] || "DI-009-REVIEW-V5.md";
const sets = selectDi009V2ReviewSets();
const lines: string[] = [
  "# DI-009 Histogram — V5 Review Pack",
  "",
  "> Review-only checkpoint. V2 question logic is retained. V5 is the accepted current multicolour clean-axis diagram direction.",
  "",
  `- Sets: ${sets.length}`,
  `- Questions: ${sets.reduce((sum, set) => sum + set.questions.length, 0)}`,
  `- Contract library represented: ${new Set(sets.flatMap((set) => set.questions.map((question) => question.kind))).size} / 13`,
  `- Shapes represented: ${[...new Set(sets.map((set) => set.stimulus.shape))].join(", ")}`,
  `- Class counts represented: ${[...new Set(sets.map((set) => set.stimulus.bins.length))].sort((a, b) => a - b).join(", ")}`,
  "- Visual theme: EXAMTREE_DI_MULTICOLOUR_CLEAN_AXIS_V5",
  "- Palette: EXAMTREE_BALANCED_MULTICOLOUR",
  "- Axis contract: one horizontal baseline; no vertical y-axis spine or downward class-boundary ticks",
  "",
];

sets.forEach((set, setIndex) => {
  lines.push(`## Set ${setIndex + 1} — ${set.examProfile}`, "", `**Shape:** ${set.stimulus.shape}  `, `**Class intervals:** ${set.stimulus.bins.length}  `, `**Context:** ${set.stimulus.title}`, "", set.stimulus.svg, "");
  set.questions.forEach((question, questionIndex) => {
    lines.push(`### Q${questionIndex + 1}. ${question.stem}`, "");
    question.options.forEach((option, index) => lines.push(`${String.fromCharCode(65 + index)}. ${option}`));
    lines.push("", `**Answer:** ${String.fromCharCode(65 + question.correctIndex)}. ${question.answer}`, "", `**Explanation:** ${question.explanation.keyIdea}`, "");
    question.explanation.steps.forEach((step, index) => lines.push(`${index + 1}. ${step}`));
    if (question.explanation.workingTable) lines.push("", markdownTable(question.explanation.workingTable.headers, question.explanation.workingTable.rows));
    lines.push("", `_Family: ${question.kind} · Difficulty: ${question.difficulty}_`, "");
  });
});

writeFileSync(outputPath, lines.join("\n"), "utf8");
console.log(JSON.stringify({ outputPath, visualVersion: "V5", sets: sets.length, questions: sets.reduce((sum, set) => sum + set.questions.length, 0) }));

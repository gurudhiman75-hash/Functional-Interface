import { writeFileSync } from "node:fs";
import { DI010_TASK_KINDS } from "./frequency-polygon-set";
import { buildDi010ReviewSets, formatDi010WorkingTable } from "./review-utils";

const outputPath = process.argv[2] ?? "DI-010-REVIEW-P2.md";
const sets = buildDi010ReviewSets();
const lines: string[] = [
  "# DI-010 Frequency Polygon — P2 Question Review Pack",
  "",
  "> Review-only. Not in Question Studio, Question Bank, tests, mocks or public publication.",
  "",
  "The accepted diagram system is unchanged. P2 rewrites the question layer to match the natural, context-first style of the original ExamTree DI sets.",
  "",
  `This pack contains ${sets.length} deterministic sets and covers all ${DI010_TASK_KINDS.length} DI-010 task families across both SSC CGL Tier-I and Tier-II profiles.`,
  "",
];

sets.forEach((set, setIndex) => {
  lines.push(`## Set ${setIndex + 1} — ${set.examProfile}`, "", `**Seed:** \`${set.seed}\`  `, `**Shape:** ${set.stimulus.shape}  `, `**Classes:** ${set.stimulus.classes.length}  `, `**Class width:** ${set.stimulus.classWidth}`, "", `**Stimulus:** ${set.stimulus.title}`, "", set.stimulus.instruction, "");
  set.questions.forEach((question, questionIndex) => {
    lines.push(`### Q${questionIndex + 1}. ${question.stem}`, "", `**Family:** \`${question.kind}\` · **Difficulty:** ${question.difficulty}`, "");
    question.options.forEach((option, optionIndex) => lines.push(`${String.fromCharCode(65 + optionIndex)}. ${option}`));
    lines.push("", `**Answer:** ${String.fromCharCode(65 + question.correctIndex)}. ${question.answer}`, "", `**Explanation:** ${question.explanation.keyIdea}`, "");
    question.explanation.steps.forEach((step) => lines.push(`- ${step}`));
    if (question.explanation.workingTable) lines.push("", formatDi010WorkingTable(question.explanation.workingTable));
    lines.push("");
  });
  lines.push("---", "");
});

writeFileSync(outputPath, lines.join("\n"), "utf8");
console.log(JSON.stringify({ status: "EXPORTED_DI_010_REVIEW_P2_MD", outputPath, sets: sets.length, questions: sets.reduce((sum, set) => sum + set.questions.length, 0), taskFamilies: DI010_TASK_KINDS.length }));

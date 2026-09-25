import { writeFileSync } from "node:fs";
import { renderDiHistogramSvg, DI_HISTOGRAM_VISUAL_THEME } from "../visuals/histogram-svg";
import { markdownTable, selectDi009V2ReviewSets } from "./review-utils";

const outputPath = process.argv[2] || "DI-009-REVIEW-ARCHITECTURE-V6.md";
const sets = selectDi009V2ReviewSets();
const lines: string[] = [
  "# DI-009 Histogram — Original DI Architecture Alignment",
  "",
  "> Review-only checkpoint. Approved V2 question logic is retained. The question stimulus is now semantic-only and the histogram is rendered by the shared Data Interpretation presentation layer.",
  "",
  `- Sets: ${sets.length}`,
  `- Questions: ${sets.reduce((sum, set) => sum + set.questions.length, 0)}`,
  `- Contract library represented: ${new Set(sets.flatMap((set) => set.questions.map((question) => question.kind))).size} / 13`,
  `- Shapes represented: ${[...new Set(sets.map((set) => set.stimulus.shape))].join(", ")}`,
  `- Class counts represented: ${[...new Set(sets.map((set) => set.stimulus.bins.length))].sort((a, b) => a - b).join(", ")}`,
  "- Question logic: DI-009-QUESTION-LOGIC-V3",
  "- Set contract: DI-009-SET-CONTRACT-V3",
  "- Presentation authority: DATA_INTERPRETATION_SHARED_VISUALS",
  `- Shared visual theme: ${DI_HISTOGRAM_VISUAL_THEME}`,
  "",
];

sets.forEach((set, setIndex) => {
  const svg = renderDiHistogramSvg(set.stimulus);
  lines.push(
    `## Set ${setIndex + 1} — ${set.examProfile}`,
    "",
    `**Shape:** ${set.stimulus.shape}  `,
    `**Class intervals:** ${set.stimulus.bins.length}  `,
    `**Context:** ${set.stimulus.title}`,
    "",
    svg,
    "",
  );
  set.questions.forEach((question, questionIndex) => {
    lines.push(`### Q${questionIndex + 1}. ${question.stem}`, "");
    question.options.forEach((option, index) => lines.push(`${String.fromCharCode(65 + index)}. ${option}`));
    lines.push("", `**Answer:** ${String.fromCharCode(65 + question.correctIndex)}. ${question.answer}`, "", `**Explanation:** ${question.explanation.keyIdea}`, "");
    question.explanation.steps.forEach((step, index) => lines.push(`${index + 1}. ${step}`));
    if (question.explanation.workingTable) {
      lines.push("", markdownTable(question.explanation.workingTable.headers, question.explanation.workingTable.rows));
    }
    lines.push("", `_Family: ${question.kind} · Difficulty: ${question.difficulty}_`, "");
  });
});

writeFileSync(outputPath, lines.join("\n"), "utf8");
console.log(JSON.stringify({
  outputPath,
  architecture: "SEMANTIC_STIMULUS_PLUS_SHARED_DI_RENDERER",
  questionLogicVersion: "DI-009-QUESTION-LOGIC-V3",
  setContractVersion: "DI-009-SET-CONTRACT-V3",
  visualTheme: DI_HISTOGRAM_VISUAL_THEME,
  sets: sets.length,
  questions: sets.reduce((sum, set) => sum + set.questions.length, 0),
}));

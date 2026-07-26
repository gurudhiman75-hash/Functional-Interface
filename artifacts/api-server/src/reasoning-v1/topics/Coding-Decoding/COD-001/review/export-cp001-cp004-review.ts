import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { COD_CP001_QUESTION_LOGICS } from "../COD-CP-001/question-language.en";
import { generateCodCp001Question } from "../COD-CP-001/generator";
import { COD_CP002_QUESTION_LOGICS } from "../COD-CP-002/question-language.en";
import { generateCodCp002Question } from "../COD-CP-002/generator";
import { COD_CP003_QUESTION_LOGICS } from "../COD-CP-003/question-language.en";
import { generateCodCp003Question } from "../COD-CP-003/generator";
import { COD_CP004_QUESTION_LOGICS } from "../COD-CP-004/question-language.en";
import { generateCodCp004Question } from "../COD-CP-004/generator";

interface CheckpointAdapter {
  checkpointId: string;
  qlIds: readonly string[];
  generate: (qlId: string, seed: number) => any;
}

const checkpoints: readonly CheckpointAdapter[] = [
  {
    checkpointId: "COD-CP-001",
    qlIds: COD_CP001_QUESTION_LOGICS.map((entry) => entry.qlId),
    generate: generateCodCp001Question,
  },
  {
    checkpointId: "COD-CP-002",
    qlIds: COD_CP002_QUESTION_LOGICS.map((entry) => entry.qlId),
    generate: generateCodCp002Question,
  },
  {
    checkpointId: "COD-CP-003",
    qlIds: COD_CP003_QUESTION_LOGICS.map((entry) => entry.qlId),
    generate: generateCodCp003Question,
  },
  {
    checkpointId: "COD-CP-004",
    qlIds: COD_CP004_QUESTION_LOGICS.map((entry) => entry.qlId),
    generate: generateCodCp004Question,
  },
];

const outputDirectory = process.argv[2] ?? "cod-review-output";
mkdirSync(outputDirectory, { recursive: true });

const fullRows: string[] = [];
for (const checkpoint of checkpoints) {
  for (const qlId of checkpoint.qlIds) {
    for (let seed = 1; seed <= 5; seed += 1) {
      const question = checkpoint.generate(qlId, seed);
      fullRows.push(JSON.stringify({ checkpointId: checkpoint.checkpointId, ...question }));
    }
  }
}
writeFileSync(join(outputDirectory, "cod-cp001-cp004-review.jsonl"), `${fullRows.join("\n")}\n`, "utf8");

const markdown: string[] = [
  "# COD-001 CP-001 to CP-004 exact English review",
  "",
  "This file renders seed 1 for every implemented QL. The JSONL companion contains seeds 1 through 5 with the complete structured question payload.",
  "",
];

for (const checkpoint of checkpoints) {
  markdown.push(`## ${checkpoint.checkpointId}`, "");
  for (const qlId of checkpoint.qlIds) {
    const question = checkpoint.generate(qlId, 1);
    markdown.push(
      `### ${question.qlId} — ${question.ruleId}`,
      "",
      `- Difficulty: ${question.difficulty}`,
      `- Renderer: ${question.renderer}`,
      `- Task: ${question.structuredPrompt.taskKind}`,
      "",
      `**Stem:** ${question.stem}`,
      "",
      "**Options:**",
      ...question.options.map((option: any, index: number) => `${index + 1}. ${option.value}${index === question.correctIndex ? " ✅" : ""}${option.errorLabel ? ` — ${option.errorLabel}` : ""}`),
      "",
      `**Rule statement:** ${question.explanation.ruleStatement}`,
      ...(question.explanation.referenceAid?.length ? ["", "**Reference aid:**", ...question.explanation.referenceAid.map((line: string) => `- ${line}`)] : []),
      ...(question.explanation.quickMethod ? ["", `**Quick method:** ${question.explanation.quickMethod}`] : []),
      "",
      "**Evidence reasoning:**",
      ...question.explanation.sourceDemonstration.map((line: string) => `- ${line}`),
      "",
      "**Target application:**",
      ...question.explanation.targetApplication.map((line: string) => `- ${line}`),
      "",
      `**Conclusion:** ${question.explanation.conclusion}`,
      ...(question.explanation.commonTrapAlert ? ["", `**Common Trap Alert:** ${question.explanation.commonTrapAlert}`] : []),
      "",
    );
  }
}

writeFileSync(join(outputDirectory, "cod-cp001-cp004-seed1-review.md"), `${markdown.join("\n")}\n`, "utf8");

const summary = {
  checkpoints: checkpoints.map((checkpoint) => ({ checkpointId: checkpoint.checkpointId, qlCount: checkpoint.qlIds.length })),
  totalQls: checkpoints.reduce((total, checkpoint) => total + checkpoint.qlIds.length, 0),
  seeds: [1, 2, 3, 4, 5],
  renderedQuestions: fullRows.length,
};
writeFileSync(join(outputDirectory, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`, "utf8");
console.log(JSON.stringify(summary, null, 2));

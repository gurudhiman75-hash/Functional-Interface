import fs from "node:fs";
import path from "node:path";
import { getMen001QuestionLanguageIds } from "./library";
import { runMen001Pipeline } from "./pipeline";

const outputDir = path.resolve(
  process.cwd(),
  process.env.MEN001_REVIEW_OUTPUT_DIR ?? "artifacts/api-server/dist/quant-v4",
);
fs.mkdirSync(outputDir, { recursive: true });

function csvCell(value: unknown) {
  const text = String(value ?? "").replace(/\r?\n/g, " ");
  return `"${text.replace(/"/g, '""')}"`;
}

const rows: string[][] = [[
  "qlId",
  "difficulty",
  "solveMode",
  "seed",
  "stem",
  "optionA",
  "optionB",
  "optionC",
  "optionD",
  "correctOption",
  "answer",
  "explanation",
  "validation",
]];

const markdown: string[] = [
  "# MEN-001 / MEN-CP-001 Human Review Export",
  "",
  "Three deterministic samples are exported per QL to CSV. The Markdown view shows the first sample for each QL.",
  "",
];

for (const qlId of getMen001QuestionLanguageIds()) {
  for (let index = 0; index < 3; index += 1) {
    const seed = `men-001-human-review:${qlId}:${index}`;
    const question = runMen001Pipeline("MEN-CP-001", {
      language: "en",
      questionLanguageId: qlId,
      seed,
    });
    const correctOption = question.options[question.correctIndex] ?? "";
    rows.push([
      qlId,
      question.difficultyBand,
      question.solveMode,
      seed,
      question.stem,
      ...question.options,
      correctOption,
      question.answer,
      question.explanation.lines.join(" | "),
      question.validation.valid ? "PASS" : question.validation.checks.filter((check) => !check.passed).map((check) => `${check.name}: ${check.message}`).join(" | "),
    ]);

    if (index === 0) {
      markdown.push(
        `## ${qlId} — ${question.solveMode}`,
        "",
        `**Difficulty:** ${question.difficultyBand}`,
        "",
        `**Stem:** ${question.stem}`,
        "",
        "**Options:**",
        "",
        ...question.options.map(
          (option, optionIndex) =>
            `${optionIndex === question.correctIndex ? "- ✅" : "-"} ${String.fromCharCode(65 + optionIndex)}. ${option}`,
        ),
        "",
        `**Answer:** ${question.answer}`,
        "",
        "**Explanation:**",
        "",
        ...question.explanation.lines.map((line) => `- ${line}`),
        "",
        `**Validation:** ${question.validation.valid ? "PASS" : "FAIL"}`,
        "",
      );
    }
  }
}

const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");
fs.writeFileSync(path.join(outputDir, "men-001-human-review.csv"), `${csv}\n`, "utf8");
fs.writeFileSync(path.join(outputDir, "men-001-human-review.md"), `${markdown.join("\n").trimEnd()}\n`, "utf8");

console.log(`MEN-001 human review export created: ${rows.length - 1} CSV samples and ${getMen001QuestionLanguageIds().length} Markdown samples.`);

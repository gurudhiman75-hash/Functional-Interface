import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { generateCod001Question } from "../multilingual-runtime";

const outputDirectory = process.argv[2] ?? "cod-cp008-adapted-review-output";
mkdirSync(outputDirectory, { recursive: true });

for (const locale of ["hi-IN", "pa-IN"] as const) {
  const label = locale === "hi-IN" ? "Hindi" : "Punjabi";
  const questions = ["COD-QL-173", "COD-QL-174"].flatMap((qlId) =>
    Array.from({ length: 30 }, (_, seed) => generateCod001Question(qlId, locale, seed)),
  );
  writeFileSync(
    join(outputDirectory, `COD-CP-008-${label}-review.jsonl`),
    `${questions.map((question) => JSON.stringify(question)).join("\n")}\n`,
    "utf8",
  );

  const markdown: string[] = [
    `# COD-CP-008 — ${label} Review Pack`,
    "",
    "Status: review-only; Question Studio and publication remain disabled.",
    "",
  ];
  questions.forEach((question, index) => {
    const options = question.options as readonly { value: string; isCorrect: boolean }[];
    const explanation = question.explanation as Record<string, unknown>;
    markdown.push(
      `## ${index + 1}. ${question.qlId ?? question.permanentQlId} — Seed ${question.seed}`,
      "",
      String(question.stem),
      "",
      ...options.map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option.value}${option.isCorrect ? " **✓**" : ""}`),
      "",
      `**Explanation:** ${JSON.stringify(explanation, null, 2)}`,
      "",
      "---",
      "",
    );
  });
  writeFileSync(join(outputDirectory, `COD-CP-008-${label}-review.md`), `${markdown.join("\n")}\n`, "utf8");
}

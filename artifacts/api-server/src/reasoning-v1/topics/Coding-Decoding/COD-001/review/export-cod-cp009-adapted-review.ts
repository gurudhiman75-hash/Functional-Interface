import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { generateCod001Question } from "../multilingual-runtime";

const outputDirectory = process.argv[2] ?? "cod-cp009-adapted-review-output";
mkdirSync(outputDirectory, { recursive: true });

const qlIds = Array.from({ length: 24 }, (_, index) => `COD-QL-${String(175 + index).padStart(3, "0")}`);
for (const locale of ["hi-IN", "pa-IN"] as const) {
  const label = locale === "hi-IN" ? "Hindi" : "Punjabi";
  const questions = qlIds.flatMap((qlId) =>
    Array.from({ length: 4 }, (_, index) => generateCod001Question(qlId, locale, index + 1)),
  );
  writeFileSync(
    join(outputDirectory, `COD-CP-009-${label}-review.jsonl`),
    `${questions.map((question) => JSON.stringify(question)).join("\n")}\n`,
    "utf8",
  );

  const markdown: string[] = [
    `# COD-CP-009 — ${label} Review Pack`,
    "",
    "Status: review-only; Question Studio and publication remain disabled.",
    "",
  ];
  questions.forEach((question, index) => {
    const options = question.options as readonly Record<string, unknown>[];
    const optionText = (option: Record<string, unknown>) => String(option.value ?? option.members ?? option);
    markdown.push(
      `## ${index + 1}. ${question.qlId ?? question.permanentQlId} — Seed ${question.seed}`,
      "",
      `- Topology: \`${question.topologyKind}\``,
      `- Difficulty: \`${question.difficulty}\``,
      "",
      String(question.stem),
      "",
      ...options.map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${optionText(option)}${option.isCorrect ? " **✓**" : ""}`),
      "",
      `**Explanation:** ${JSON.stringify(question.explanation, null, 2)}`,
      "",
      "---",
      "",
    );
  });
  writeFileSync(join(outputDirectory, `COD-CP-009-${label}-review.md`), `${markdown.join("\n")}\n`, "utf8");
}

console.log(JSON.stringify({
  qlsPerLocale: qlIds.length,
  seedsPerQl: 4,
  questionsPerLocale: qlIds.length * 4,
  locales: ["hi-IN", "pa-IN"],
  outputDirectory,
}, null, 2));

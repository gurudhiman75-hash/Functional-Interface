import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { generateCod001Question, type Cod001Locale } from "../multilingual-runtime";

const outputDirectory = process.argv[2] ?? "cod-multilingual-review-output";
mkdirSync(outputDirectory, { recursive: true });

const qlIds = Array.from({ length: 199 }, (_, index) => `COD-QL-${String(index + 1).padStart(3, "0")}`);
const locales: readonly Cod001Locale[] = ["en-IN", "hi-IN", "pa-IN"];
const localeLabels: Record<Cod001Locale, string> = {
  "en-IN": "English",
  "hi-IN": "Hindi",
  "pa-IN": "Punjabi",
};

for (const locale of locales) {
  const questions = qlIds.map((qlId) => generateCod001Question(qlId, locale, 17));
  const label = localeLabels[locale];
  writeFileSync(
    join(outputDirectory, `COD-001-${label}-final-review.jsonl`),
    `${questions.map((question) => JSON.stringify(question)).join("\n")}\n`,
    "utf8",
  );

  const markdown: string[] = [
    `# COD-001 — ${label} Final Multilingual Review`,
    "",
    "One deterministic sample is included for every permanent QL.",
    "",
    "Status: review-only; Question Studio, Question Bank and public publication remain disabled.",
    "",
  ];

  questions.forEach((question, index) => {
    const options = question.options as readonly Record<string, unknown>[];
    const optionText = (option: Record<string, unknown>) => {
      const value = option.value ?? option.answer ?? option.text ?? option.label ?? option.members ?? option.tokens ?? option.words;
      return Array.isArray(value) ? value.join(", ") : String(value ?? option);
    };
    markdown.push(
      `## ${index + 1}. ${question.qlId ?? question.permanentQlId}`,
      "",
      `- Checkpoint: \`${question.checkpointId}\``,
      `- Difficulty: \`${question.difficulty}\``,
      `- Renderer: \`${question.renderer}\``,
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

  writeFileSync(
    join(outputDirectory, `COD-001-${label}-final-review.md`),
    `${markdown.join("\n")}\n`,
    "utf8",
  );
}

console.log(JSON.stringify({
  permanentQlsPerLocale: qlIds.length,
  locales,
  questionsPerLocale: qlIds.length,
  totalReviewQuestions: qlIds.length * locales.length,
  seed: 17,
  outputDirectory,
}, null, 2));

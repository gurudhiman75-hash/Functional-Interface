import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { generateCod001Question, type Cod001Locale } from "../multilingual-runtime";

const outputDirectory = process.argv[2] ?? "cod-translational-review-output";
mkdirSync(outputDirectory, { recursive: true });

const qlIds = [
  ...Array.from({ length: 172 }, (_, index) => `COD-QL-${String(index + 1).padStart(3, "0")}`),
  "COD-QL-199",
];
const locales: readonly Exclude<Cod001Locale, "en-IN">[] = ["hi-IN", "pa-IN"];

for (const locale of locales) {
  const questions = qlIds.flatMap((qlId) => [1, 2].map((seed) => generateCod001Question(qlId, locale, seed)));
  const label = locale === "hi-IN" ? "Hindi" : "Punjabi";

  writeFileSync(
    join(outputDirectory, `COD-001-${label}-translational-review.jsonl`),
    `${questions.map((question) => JSON.stringify(question)).join("\n")}\n`,
    "utf8",
  );

  const markdown: string[] = [
    `# COD-001 — ${label} Translational Runtime Review`,
    "",
    "Status: review-only; Question Studio and public publication remain disabled.",
    "",
  ];

  questions.forEach((question, index) => {
    const options = question.options as readonly { value?: string; isCorrect?: boolean }[];
    const explanation = question.explanation as {
      referenceAid?: readonly string[];
      quickMethod?: string;
      ruleStatement?: string;
      sourceDemonstration?: readonly string[];
      targetApplication?: readonly string[];
      conclusion?: string;
      commonTrapAlert?: string;
    };
    const correct = options[question.correctIndex]!;
    markdown.push(
      `## ${index + 1}. ${question.qlId ?? question.permanentQlId} — Seed ${question.seed}`,
      "",
      `- Checkpoint: \`${question.checkpointId}\``,
      `- Difficulty: \`${question.difficulty}\``,
      `- Renderer: \`${question.renderer}\``,
      "",
      "### Question",
      "",
      String(question.stem),
      "",
      ...options.map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${String(option.value ?? option)}${option.isCorrect ? " **✓**" : ""}`),
      "",
      `**Correct answer:** ${String(correct.value ?? correct)}`,
      "",
      "### Explanation",
      "",
      ...(explanation.referenceAid ?? []).map((line) => `- ${line}`),
      "",
      explanation.quickMethod ? `**Quick method:** ${explanation.quickMethod}` : "",
      "",
      explanation.ruleStatement ? `**Rule:** ${explanation.ruleStatement}` : "",
      "",
      ...(explanation.sourceDemonstration ?? []).map((line) => `- ${line}`),
      ...(explanation.targetApplication ?? []).map((line) => `- ${line}`),
      "",
      explanation.conclusion ? `**Conclusion:** ${explanation.conclusion}` : "",
      "",
      explanation.commonTrapAlert ? `**Trap alert:** ${explanation.commonTrapAlert}` : "",
      "",
      "---",
      "",
    );
  });

  writeFileSync(
    join(outputDirectory, `COD-001-${label}-translational-review.md`),
    `${markdown.join("\n")}\n`,
    "utf8",
  );
}

console.log(JSON.stringify({
  outputDirectory,
  qlsPerLocale: qlIds.length,
  seedsPerQl: 2,
  locales,
  questionsPerLocale: qlIds.length * 2,
}, null, 2));

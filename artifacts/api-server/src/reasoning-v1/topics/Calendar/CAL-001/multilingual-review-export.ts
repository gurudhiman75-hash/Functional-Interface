import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { CALENDAR_PROTOTYPES } from "./registry.ts";
import { selectExamReadyReviewQuestions } from "./review-selection.ts";
import type { Locale } from "./types.ts";

const outputDir = process.env.CAL_REVIEW_OUTPUT_DIR ?? join(process.cwd(), "dist", "reasoning-v1");
mkdirSync(outputDir, { recursive: true });

const locales = ["hi-IN", "pa-IN"] as const satisfies readonly Locale[];

for (const locale of locales) {
  const rows = CALENDAR_PROTOTYPES.flatMap((definition) =>
    selectExamReadyReviewQuestions(definition.id, locale).map((pkg) => ({
      checkpoint: pkg.checkpoint,
      prototypeAuthority: pkg.prototypeAuthority,
      seed: pkg.seed,
      locale: pkg.locale,
      difficulty: pkg.difficulty,
      stem: pkg.stem,
      options: pkg.options.map((option) => option.display),
      answerIndex: pkg.answerIndex,
      canonicalAnswer: pkg.canonicalAnswer,
      explanation: pkg.explanation,
      permanentQlId: pkg.permanentQlId,
      lifecycle: pkg.lifecycle,
    })),
  );

  const language = locale === "hi-IN" ? "hindi" : "punjabi";
  const jsonPath = join(outputDir, `cal-001-${language}-curated-review-5q.json`);
  const markdownPath = join(outputDir, `cal-001-${language}-curated-review-5q.md`);

  writeFileSync(jsonPath, `${JSON.stringify({
    generatedAt: new Date().toISOString(),
    locale,
    lifecycle: "MULTILINGUAL_HUMAN_REVIEW_NOT_FROZEN",
    prototypeCount: CALENDAR_PROTOTYPES.length,
    questionsPerPrototype: 5,
    totalQuestions: rows.length,
    rows,
  }, null, 2)}\n`);

  const markdown: string[] = [
    `# CAL-001 ${locale === "hi-IN" ? "Hindi" : "Punjabi"} Curated Review Pack`,
    "",
    `- Locale: ${locale}`,
    `- Provisional authorities: ${CALENDAR_PROTOTYPES.length}`,
    "- Questions per authority: 5",
    `- Total questions: ${rows.length}`,
    "- Human language freeze: not yet approved",
    "- Question Studio, Question Bank, mock-test and publication gates: closed",
    "",
  ];

  for (const definition of CALENDAR_PROTOTYPES) {
    const samples = rows.filter((row) => row.prototypeAuthority === definition.id);
    markdown.push(`## ${definition.checkpoint} · ${definition.id}`, "");
    for (const sample of samples) {
      markdown.push(`### Seed ${sample.seed} · ${sample.difficulty}`, "", sample.stem, "");
      sample.options.forEach((option, index) => {
        markdown.push(`${String.fromCharCode(65 + index)}. ${option}${index === sample.answerIndex ? " **(correct)**" : ""}`);
      });
      markdown.push(
        "",
        `**Observation:** ${sample.explanation.observation}`,
        "",
        `**Rule:** ${sample.explanation.rule}`,
        "",
      );
      sample.explanation.working.forEach((step) => markdown.push(`- ${step}`));
      markdown.push("", `**Conclusion:** ${sample.explanation.conclusion}`, "");
      if (sample.explanation.closestTrap) markdown.push(`**Closest trap:** ${sample.explanation.closestTrap}`, "");
    }
  }
  writeFileSync(markdownPath, `${markdown.join("\n")}\n`);
}

console.log(JSON.stringify({
  status: "PASS_CAL_001_MULTILINGUAL_REVIEW_EXPORT",
  locales,
  prototypeCount: CALENDAR_PROTOTYPES.length,
  questionsPerPrototype: 5,
  totalQuestionsPerLocale: CALENDAR_PROTOTYPES.length * 5,
}, null, 2));

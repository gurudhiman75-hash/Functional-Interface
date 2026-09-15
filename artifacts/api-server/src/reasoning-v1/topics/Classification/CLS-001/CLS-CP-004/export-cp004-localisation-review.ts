import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  generateClsCp004LocalizedQuestion,
  type ClsCp004TranslatedLocale,
} from "./cp004-localized-runtime";
import { CLS_CP004_RULE_IDS } from "./number-domain";

const outputDir = path.resolve(process.cwd(), "dist/reasoning-v1/cls-001/cp004-localisation-review");
mkdirSync(outputDir, { recursive: true });

const locales: readonly ClsCp004TranslatedLocale[] = ["hi-IN", "pa-IN"];
const samplesPerRule = 2;

for (const locale of locales) {
  const selected = new Map<string, ReturnType<typeof generateClsCp004LocalizedQuestion>[]>(
    CLS_CP004_RULE_IDS.map((ruleId) => [ruleId, []]),
  );

  for (let seed = 0; seed < 5000; seed += 1) {
    const question = generateClsCp004LocalizedQuestion(locale, seed);
    const bucket = selected.get(question.intendedRuleId)!;
    if (bucket.length < samplesPerRule) bucket.push(question);
    if ([...selected.values()].every((questions) => questions.length >= samplesPerRule)) break;
  }

  const missing = [...selected.entries()].filter(([, questions]) => questions.length < samplesPerRule);
  if (missing.length > 0) throw new Error(`Missing CP004 ${locale} review coverage: ${missing.map(([rule]) => rule).join(", ")}`);

  const ordered = CLS_CP004_RULE_IDS.flatMap((ruleId) => selected.get(ruleId)!);
  const markdown: string[] = [
    `# CLS-CP-004 Hindi/Punjabi Localisation Review — ${locale}`,
    "",
    `Questions: ${ordered.length} · ${CLS_CP004_RULE_IDS.length} rules × ${samplesPerRule} samples`,
    "Status: LOCALIZED_REVIEW_REQUIRED — not frozen, not Question Studio visible, not Question Bank eligible.",
    "",
  ];

  ordered.forEach((question, index) => {
    markdown.push(
      `## ${index + 1}. ${question.intendedRuleId} · Seed ${question.seed} · ${question.difficulty}`,
      "",
      question.stem,
      "",
    );
    question.options.forEach((option, optionIndex) => {
      markdown.push(`${optionIndex + 1}. ${option}${optionIndex === question.correctIndex ? "  **✓**" : ""}`);
    });
    markdown.push("", "### Explanation", "", ...question.explanation.coreConcept);
    question.explanation.stepByStep.forEach((step, stepIndex) => markdown.push(`${stepIndex + 1}. ${step}`));
    markdown.push("");
  });

  writeFileSync(
    path.join(outputDir, `cls-001-cp004-${locale}-localisation-review.md`),
    `${markdown.join("\n")}\n`,
    "utf8",
  );
  writeFileSync(
    path.join(outputDir, `cls-001-cp004-${locale}-localisation-review.json`),
    `${JSON.stringify(ordered, null, 2)}\n`,
    "utf8",
  );
}

console.log("Wrote CLS-CP-004 Hindi/Punjabi localisation review packs.", {
  locales,
  rules: CLS_CP004_RULE_IDS.length,
  samplesPerRule,
  totalQuestions: locales.length * CLS_CP004_RULE_IDS.length * samplesPerRule,
});

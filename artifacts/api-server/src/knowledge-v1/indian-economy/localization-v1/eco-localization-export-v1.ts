import fs from "node:fs";
import path from "node:path";
import {
  generateEcoCp001LocalizedReviewV1,
  generateEcoCp002LocalizedReviewV1,
  generateEcoCp003LocalizedReviewV1,
  generateEcoCp004LocalizedReviewV1,
} from "./eco-localization-generator-v1";
import type { EcoLocaleV1, EcoLocalizedQuestionV1 } from "./eco-localization-types-v1";

const labels: Record<EcoLocaleV1, string> = { en: "English", hi: "Hindi", pa: "Punjabi" };
const locales: EcoLocaleV1[] = ["en", "hi", "pa"];
const targetDir = path.resolve("dist/economy-review/ECO-MULTILINGUAL-V1");
fs.mkdirSync(targetDir, { recursive: true });

function renderQuestion(question: EcoLocalizedQuestionV1, index: number): string[] {
  const out = [`**${index + 1}. ${question.stem}**`];
  question.options.forEach((option, optionIndex) => out.push(`${String.fromCharCode(65 + optionIndex)}. ${option}`));
  out.push(`**Answer:** ${String.fromCharCode(65 + question.correctIndex)} — ${question.canonicalAnswer}`);
  out.push(`**Explanation:** ${question.explanation}`, "");
  return out;
}

function materialize(
  cps: readonly ("ECO-CP-001" | "ECO-CP-002" | "ECO-CP-003" | "ECO-CP-004")[],
  title: string,
  filename: string,
) {
  const out: string[] = [
    `# Economy Multilingual V1 — ${title} Review`,
    "",
    "Review-only candidate. Frozen English V2 remains semantic authority. Hindi and Punjabi preserve CP, QL, difficulty, source provenance, option order and correct-index parity.",
    "",
  ];

  for (const cp of cps) {
    out.push(`## ${cp}`, "");
    for (const locale of locales) {
      out.push(`### ${labels[locale]}`, "");
      const questions = cp === "ECO-CP-001"
        ? generateEcoCp001LocalizedReviewV1(locale)
        : cp === "ECO-CP-002"
          ? generateEcoCp002LocalizedReviewV1(locale)
          : cp === "ECO-CP-003"
            ? generateEcoCp003LocalizedReviewV1(locale)
            : generateEcoCp004LocalizedReviewV1(locale);
      questions.forEach((question, index) => out.push(...renderQuestion(question, index)));
    }
  }

  const target = path.join(targetDir, filename);
  fs.writeFileSync(target, out.join("\n"));
  console.log(target);
}

materialize(["ECO-CP-001", "ECO-CP-002"], "CP001–CP002", "ECO-MULTILINGUAL-V1-CP001-CP002-REVIEW.md");
materialize(["ECO-CP-003", "ECO-CP-004"], "CP003–CP004", "ECO-MULTILINGUAL-V1-CP003-CP004-REVIEW.md");

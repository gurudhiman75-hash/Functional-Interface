import { writeFileSync } from "node:fs";
import { DI006_PERMANENT_QLS } from "./permanent-ql-registry";
import { generateDi006LocalizedReviewQuestion, type Di006LocalizationLocale } from "./localization-review-v1";

const outputPath = process.argv[2] || "/tmp/DI-006-LOCALIZATION-REVIEW-V1.md";
const locales: readonly Di006LocalizationLocale[] = ["hi-IN", "pa-IN"];

const lines: string[] = [
  "# DI-006 Caselet — Hindi/Punjabi Localization Review V1",
  "",
  "Status: HI_PA_FROZEN · CONTROLLED_QUESTION_STUDIO_REVIEW",
  "",
  "- Permanent English QLs: DI-QL-061 through DI-QL-072",
  "- Hindi candidate: hi-IN",
  "- Punjabi candidate: pa-IN",
  "- Localized Question Studio activation: CONTROLLED_REVIEW",
  "- Question Bank/tests/mocks/publication: locked",
  "",
];

for (const locale of locales) {
  lines.push(locale === "hi-IN" ? "## Hindi Review (hi-IN)" : "## Punjabi Review (pa-IN)", "");

  for (const [index, descriptor] of DI006_PERMANENT_QLS.entries()) {
    const examProfile = index % 2 === 0 ? "SSC_CGL_TIER_I" as const : "BANKING_PRELIMS" as const;
    const seed = `DI006-LOCALIZATION-REVIEW-${locale}-${descriptor.qlId}`;
    const pkg = generateDi006LocalizedReviewQuestion({ seed, examProfile, taskKind: descriptor.taskKind, locale });
    const q = pkg.question;
    const s = pkg.stimulus;

    lines.push(
      `### ${descriptor.qlId} — ${descriptor.taskKind} — ${q.difficulty} — ${examProfile}`,
      "",
      `**Title:** ${s.title}`,
      "",
      `**Instruction:** ${s.instruction}`,
      "",
      `**Caselet:** ${s.learnerText}`,
      "",
      `**Question:** ${q.stem}`,
      "",
    );

    q.options.forEach((option, optionIndex) => lines.push(`${String.fromCharCode(65 + optionIndex)}. ${option}`));

    lines.push(
      "",
      `**Answer:** ${q.answer}`,
      "",
      `**Explanation:** ${q.explanation.keyIdea}`,
      "",
      ...q.explanation.steps.map((step, stepIndex) => `${stepIndex + 1}. ${step}`),
      "",
      "---",
      "",
    );
  }
}

lines.push(
  "## Review Gate",
  "",
  "Hindi/Punjabi are frozen multilingual authorities and are enabled only in Question Studio CONTROLLED_REVIEW. English controlled review remains unchanged; Question Bank, tests, mocks and public/student publication remain locked.",
  "",
);

writeFileSync(outputPath, lines.join("\n"), "utf8");
console.log(JSON.stringify({
  status: "WROTE_DI_006_LOCALIZATION_REVIEW_V1",
  outputPath,
  questions: DI006_PERMANENT_QLS.length * locales.length,
}));

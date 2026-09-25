import { writeFileSync } from "node:fs";
import { DI001_PERMANENT_QLS } from "./permanent-ql-registry";
import { generateDi001LocalizedReviewQuestion, type Di001LocalizationLocale } from "./localization-review-v1";

const outputPath = process.argv[2] || "/tmp/DI-001-LOCALIZATION-REVIEW-V1.md";
const locales: readonly Di001LocalizationLocale[] = ["hi-IN", "pa-IN"];

function cell(value: unknown) {
  return String(value).replaceAll("|", "\\|").replaceAll("\n", " ");
}

const lines: string[] = [
  "# DI-001 Table Interpretation — Hindi/Punjabi Localization Review V1",
  "",
  "Status: HI_PA_REVIEW_CANDIDATE",
  "",
  "- Permanent QLs: DI-QL-027 through DI-QL-036",
  "- Hindi: hi-IN",
  "- Punjabi: pa-IN",
  "- Localized Question Studio activation: NOT AUTHORIZED",
  "- Question Bank/tests/mocks/publication: locked",
  "- Whole-number learner policy: no decimal values",
  "",
];

for (const locale of locales) {
  lines.push(locale === "hi-IN" ? "## Hindi Review (hi-IN)" : "## Punjabi Review (pa-IN)", "");
  for (const [index, descriptor] of DI001_PERMANENT_QLS.entries()) {
    const examProfile = index % 2 === 0 ? "SSC_CGL_TIER_I" as const : "BANKING_PRELIMS" as const;
    const seed = `DI001-LOCALIZATION-REVIEW-${locale}-${descriptor.qlId}`;
    const pkg = generateDi001LocalizedReviewQuestion({ seed, examProfile, taskKind: descriptor.taskKind, locale });
    const q = pkg.question;
    const s = pkg.stimulus;

    lines.push(
      `### ${descriptor.qlId} — ${descriptor.taskKind} — ${q.difficulty} — ${examProfile}`,
      "",
      `**Table title:** ${s.title}`,
      "",
      `**Instruction:** ${s.instruction}`,
      "",
      "|" + s.columns.map((header) => " " + cell(header) + " ").join("|") + "|",
      "|" + s.columns.map(() => "---").join("|") + "|",
      ...s.rows.map((row) => `| ${cell(row.centre)} | ${row.applicants} | ${row.selected} |`),
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
    );
    if (q.explanation.workingTable) {
      const table = q.explanation.workingTable;
      lines.push(
        "|" + table.headers.map((header) => " " + cell(header) + " ").join("|") + "|",
        "|" + table.headers.map(() => "---").join("|") + "|",
        ...table.rows.map((row) => "|" + row.map((value) => " " + cell(value) + " ").join("|") + "|"),
        "",
      );
    }
  }
}
lines.push("## Review Gate", "", "Hindi/Punjabi remain review candidates. Approval is required before controlled Question Studio activation.", "");
writeFileSync(outputPath, lines.join("\n"), "utf8");
console.log(JSON.stringify({ status: "WROTE_DI_001_LOCALIZATION_REVIEW_V1", outputPath, questions: DI001_PERMANENT_QLS.length * locales.length }));

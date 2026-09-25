import { writeFileSync } from "node:fs";
import { DI003_PERMANENT_QLS } from "./permanent-ql-registry";
import { generateDi003LocalizedReviewQuestion, type Di003LocalizationLocale } from "./localization-review-v1";

const outputPath = process.argv[2] || "/tmp/DI-003-LOCALIZATION-REVIEW-V1.md";
const locales: readonly Di003LocalizationLocale[] = ["hi-IN", "pa-IN"];

function cell(value: unknown) {
  return String(value).replaceAll("|", "\\|").replaceAll("\n", " ");
}

const lines: string[] = [
  "# DI-003 Grouped Bar Interpretation — Hindi/Punjabi Localization Review V1",
  "",
  "Status: HI_PA_FROZEN",
  "",
  "- Permanent QLs: DI-QL-037 through DI-QL-048",
  "- Hindi: hi-IN",
  "- Punjabi: pa-IN",
  "- Localized Question Studio activation: CONTROLLED_REVIEW",
  "- Question Bank/tests/mocks/publication: locked",
  "- Whole-number learner policy: no decimal values",
  "",
];

for (const locale of locales) {
  lines.push(locale === "hi-IN" ? "## Hindi Review (hi-IN)" : "## Punjabi Review (pa-IN)", "");
  for (const [index, descriptor] of DI003_PERMANENT_QLS.entries()) {
    const examProfile = index % 2 === 0 ? "SSC_CGL_TIER_I" as const : "BANKING_PRELIMS" as const;
    const seed = `DI003-LOCALIZATION-REVIEW-${locale}-${descriptor.qlId}`;
    const pkg = generateDi003LocalizedReviewQuestion({ seed, examProfile, taskKind: descriptor.taskKind, locale });
    const q = pkg.question, s = pkg.stimulus;

    lines.push(
      `### ${descriptor.qlId} — ${descriptor.taskKind} — ${q.difficulty} — ${examProfile}`,
      "",
      `**Chart title:** ${s.title}`,
      "",
      `**Instruction:** ${s.instruction}`,
      "",
      `**Vertical axis:** ${s.yAxisLabel}`,
      "",
      locale === "hi-IN"
        ? "| श्रेणी | " + cell(s.series[0].label) + " | " + cell(s.series[1].label) + " |"
        : "| ਸ਼੍ਰੇਣੀ | " + cell(s.series[0].label) + " | " + cell(s.series[1].label) + " |",
      "|---|---:|---:|",
      ...s.points.map((point) => `| ${cell(point.category)} | ${point.seriesA} | ${point.seriesB} |`),
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

lines.push("## Review Gate", "", "Hindi/Punjabi are frozen multilingual authorities and are enabled only in controlled Question Studio review. Question Bank, tests, mocks and public/student publication remain locked.", "");
writeFileSync(outputPath, lines.join("\n"), "utf8");
console.log(JSON.stringify({ status: "WROTE_DI_003_LOCALIZATION_REVIEW_V1", outputPath, questions: DI003_PERMANENT_QLS.length * locales.length }));

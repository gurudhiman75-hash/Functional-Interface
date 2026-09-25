import { writeFileSync } from "node:fs";
import { DI010_PERMANENT_QLS } from "./permanent-ql-registry";
import {
  generateDi010LocalizedReviewQuestion,
  type Di010LocalizationLocale,
} from "./localization-review-v1";

const outputPath = process.argv[2] || "/tmp/DI-010-LOCALIZATION-REVIEW-V1.md";
const locales: readonly Di010LocalizationLocale[] = ["hi-IN", "pa-IN"];

function cell(value: unknown) {
  return String(value).replaceAll("|", "\\|").replaceAll("\n", " ");
}

const lines: string[] = [
  "# DI-010 Frequency Polygon Hindi/Punjabi Localization Review V1",
  "",
  "Status: HI_PA_REVIEW_CANDIDATE",
  "",
  "- Permanent QLs: DI-QL-014 through DI-QL-026",
  "- Hindi: hi-IN",
  "- Punjabi: pa-IN",
  "- Localized Question Studio activation: NOT AUTHORIZED",
  "- Question Bank/tests/mocks/publication: locked",
  "- Whole-number learner policy: no decimal values; percentage/mean use explicit nearest-whole wording",
  "",
];

for (const locale of locales) {
  lines.push(locale === "hi-IN" ? "## Hindi Review (hi-IN)" : "## Punjabi Review (pa-IN)", "");

  for (const [index, descriptor] of DI010_PERMANENT_QLS.entries()) {
    const examProfile = index % 2 === 0 ? "SSC_CGL_TIER_I" as const : "SSC_CGL_TIER_II" as const;
    const seed = `DI010-LOCALIZATION-REVIEW-${locale}-${descriptor.qlId}`;
    const pkg = generateDi010LocalizedReviewQuestion({
      seed,
      examProfile,
      taskKind: descriptor.taskKind,
      locale,
    });
    const q = pkg.question;
    const s = pkg.stimulus;

    lines.push(
      `### ${descriptor.qlId} — ${descriptor.taskKind} — ${q.difficulty} — ${examProfile}`,
      "",
      `**Chart title:** ${s.title}`,
      "",
      `**Instruction:** ${s.instruction}`,
      "",
      `**Horizontal axis:** ${s.xAxisLabel}`,
      "",
      `**Vertical axis:** ${s.yAxisLabel}`,
      "",
      locale === "hi-IN"
        ? "| वर्ग अंतराल | वर्ग-मध्य | आवृत्ति |"
        : "| ਵਰਗ ਅੰਤਰਾਲ | ਵਰਗ-ਮੱਧ | ਬਾਰੰਬਾਰਤਾ |",
      "|---|---:|---:|",
      ...s.classes.map((item) => `| ${item.lower}–${item.upper} | ${item.classMark} | ${item.frequency} |`),
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

lines.push(
  "## Review Gate",
  "",
  "Hindi/Punjabi remain review candidates. Approval is required before these localized surfaces can be frozen or enabled in controlled Question Studio review.",
  "",
);

writeFileSync(outputPath, lines.join("\n"), "utf8");
console.log(JSON.stringify({
  status: "WROTE_DI_010_LOCALIZATION_REVIEW_V1",
  outputPath,
  questions: DI010_PERMANENT_QLS.length * locales.length,
  qls: DI010_PERMANENT_QLS.length,
  locales,
}));

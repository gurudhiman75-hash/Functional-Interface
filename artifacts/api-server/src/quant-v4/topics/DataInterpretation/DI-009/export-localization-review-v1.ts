import { writeFileSync } from "node:fs";
import { DI009_PERMANENT_QLS } from "./permanent-ql-registry";
import {
  generateDi009LocalizedReviewQuestion,
  type Di009LocalizationLocale,
} from "./localization-review-v1";

const outputPath = process.argv[2] || "/tmp/DI-009-LOCALIZATION-REVIEW-V1.md";
const locales: readonly Di009LocalizationLocale[] = ["hi-IN", "pa-IN"];

function cell(value: unknown) {
  return String(value).replaceAll("|", "\\|").replaceAll("\n", " ");
}

const lines: string[] = [
  "# DI-009 Histogram Hindi/Punjabi Localization Review V1",
  "",
  "Status: HI_PA_REVIEW_CANDIDATE",
  "",
  "This pack is generated directly from the DI-009 localization candidate. The underlying histogram bins, frequencies, options, correct index and canonical answers are unchanged from the approved English authority.",
  "",
  "- Permanent QLs: DI-QL-001 through DI-QL-013",
  "- Hindi: hi-IN",
  "- Punjabi: pa-IN",
  "- Localized Question Studio activation: NOT AUTHORIZED",
  "- Question Bank/tests/mocks/publication: locked",
  "",
];

for (const locale of locales) {
  lines.push(locale === "hi-IN" ? "## Hindi Review (hi-IN)" : "## Punjabi Review (pa-IN)", "");

  for (const [index, descriptor] of DI009_PERMANENT_QLS.entries()) {
    const examProfile = index % 2 === 0 ? "SSC_CGL_TIER_I" as const : "SSC_CGL_TIER_II" as const;
    const seed = `DI009-LOCALIZATION-REVIEW-${locale}-${descriptor.qlId}`;
    const pkg = generateDi009LocalizedReviewQuestion({
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
      locale === "hi-IN" ? "| वर्ग अंतराल | आवृत्ति |" : "| ਵਰਗ ਅੰਤਰਾਲ | ਬਾਰੰਬਾਰਤਾ |",
      "|---|---:|",
      ...s.bins.map((bin) => `| ${bin.lower}–${bin.upper} | ${bin.frequency} |`),
      "",
      `**Question:** ${q.stem}`,
      "",
    );

    q.options.forEach((option, optionIndex) => {
      lines.push(`${String.fromCharCode(65 + optionIndex)}. ${option}`);
    });

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
  status: "WROTE_DI_009_LOCALIZATION_REVIEW_V1",
  outputPath,
  questions: DI009_PERMANENT_QLS.length * locales.length,
  qls: DI009_PERMANENT_QLS.length,
  locales,
}));

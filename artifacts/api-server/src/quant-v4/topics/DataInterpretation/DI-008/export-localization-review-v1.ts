import { writeFileSync } from "node:fs";
import { DI008_PERMANENT_QLS } from "./permanent-ql-registry";
import {
  generateDi008LocalizedReviewQuestion,
  type Di008LocalizationLocale,
} from "./localization-review-v1";

const outputPath = process.argv[2] || "/tmp/DI-008-LOCALIZATION-REVIEW-V1.md";
const locales: readonly Di008LocalizationLocale[] = ["hi-IN", "pa-IN"];

function escapeCell(value: unknown) {
  return String(value).replaceAll("|", "\\|").replaceAll("\n", " ");
}

const lines: string[] = [
  "# DI-008 Hindi/Punjabi Localization Review V1",
  "",
  "Status: HI_PA_REVIEW_CANDIDATE",
  "",
  "This review pack is generated directly from the DI-008 localization candidate. Numeric table values, options, correct index and canonical answer remain identical to the approved English authority.",
  "",
  "- Permanent QLs: DI-QL-085 through DI-QL-096",
  "- Hindi: hi-IN",
  "- Punjabi: pa-IN",
  "- Localized Question Studio activation: NOT AUTHORIZED",
  "- Question Bank: NOT_STORED",
  "- Tests/mocks/publication: locked",
  "",
];

for (const locale of locales) {
  lines.push(locale === "hi-IN" ? "## Hindi Review (hi-IN)" : "## Punjabi Review (pa-IN)", "");

  for (const [index, descriptor] of DI008_PERMANENT_QLS.entries()) {
    const examProfile = index % 2 === 0 ? "BANKING_PRELIMS" as const : "BANKING_MAINS" as const;
    const seed = "DI008-LOCALIZATION-REVIEW-" + locale + "-" + descriptor.qlId;
    const pkg = generateDi008LocalizedReviewQuestion({
      seed,
      examProfile,
      taskKind: descriptor.taskKind,
      locale,
    });
    const q = pkg.question;
    const s = pkg.stimulus;

    lines.push(
      "### " + descriptor.qlId + " — " + descriptor.taskKind + " — " + q.difficulty + " — " + examProfile,
      "",
      "**Context:** " + s.title,
      "",
      s.instruction,
      "",
      "| " + escapeCell(s.rowLabel) + " | " + escapeCell(s.columnLabels.unitsPrevious) + " | " + escapeCell(s.columnLabels.unitsCurrent) + " | " + escapeCell(s.columnLabels.costPerUnit) + " | " + escapeCell(s.columnLabels.sellingPricePerUnit) + " |",
      "|---|---:|---:|---:|---:|",
    );

    for (const row of s.rows) {
      lines.push("| " + escapeCell(row.label) + " | " + row.unitsPrevious + " | " + row.unitsCurrent + " | ₹" + row.costPerUnit + " | ₹" + row.sellingPricePerUnit + " |");
    }

    lines.push("", "**Question:** " + q.stem, "");
    q.options.forEach((option, optionIndex) => {
      lines.push(String.fromCharCode(65 + optionIndex) + ". " + option);
    });
    lines.push(
      "",
      "**Answer:** " + q.answer,
      "",
      "**Explanation:** " + q.explanation.keyIdea,
      "",
      ...q.explanation.steps.map((step, stepIndex) => String(stepIndex + 1) + ". " + step),
      "",
    );
  }
}

lines.push(
  "## Review Gate",
  "",
  "Hindi/Punjabi remain review candidates. Approval of this file is required before the localized surfaces can be frozen or enabled in controlled Question Studio review.",
  "",
);

writeFileSync(outputPath, lines.join("\n"), "utf8");
console.log(JSON.stringify({
  status: "WROTE_DI_008_LOCALIZATION_REVIEW_V1",
  outputPath,
  questions: DI008_PERMANENT_QLS.length * locales.length,
  qls: DI008_PERMANENT_QLS.length,
  locales,
}));

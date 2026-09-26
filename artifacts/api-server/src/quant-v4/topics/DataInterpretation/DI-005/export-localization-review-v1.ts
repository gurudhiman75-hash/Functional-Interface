import { writeFileSync } from "node:fs";
import { DI005_PERMANENT_QLS } from "./permanent-ql-registry";
import { generateDi005LocalizedReviewQuestion, type Di005LocalizationLocale } from "./localization-review-v1";

const outputPath = process.argv[2] || "/tmp/DI-005-LOCALIZATION-REVIEW-V1.md";
const locales: readonly Di005LocalizationLocale[] = ["hi-IN", "pa-IN"];

function cell(value: unknown) {
  return String(value).replaceAll("|", "\\|").replaceAll("\n", " ");
}

const lines: string[] = [
  "# DI-005 Pie Chart — Hindi/Punjabi Localization Review V1",
  "",
  "Status: HI_PA_REVIEW_CANDIDATE · HUMAN APPROVAL PENDING",
  "",
  "- Permanent English QLs: DI-QL-049 through DI-QL-060",
  "- Hindi candidate: hi-IN",
  "- Punjabi candidate: pa-IN",
  "- Localized Question Studio activation: LOCKED UNTIL HUMAN APPROVAL",
  "- Question Bank/tests/mocks/publication: locked",
  "- Shared pie renderer: localized title, legend, total and accessibility description",
  "",
];

for (const locale of locales) {
  lines.push(locale === "hi-IN" ? "## Hindi Review (hi-IN)" : "## Punjabi Review (pa-IN)", "");
  for (const [index, descriptor] of DI005_PERMANENT_QLS.entries()) {
    const examProfile = index % 2 === 0 ? "SSC_CGL_TIER_I" as const : "BANKING_PRELIMS" as const;
    const seed = `DI005-LOCALIZATION-REVIEW-${locale}-${descriptor.qlId}`;
    const pkg = generateDi005LocalizedReviewQuestion({ seed, examProfile, taskKind: descriptor.taskKind, locale });
    const q = pkg.question;
    const s = pkg.stimulus;

    lines.push(
      `### ${descriptor.qlId} — ${descriptor.taskKind} — ${q.difficulty} — ${examProfile}`,
      "",
      `**Chart title:** ${s.title}`,
      "",
      `**Instruction:** ${s.instruction}`,
      "",
      `**Total:** ${s.totalLabel}: ${s.totalValue} ${s.unit}`,
      "",
      locale === "hi-IN"
        ? "| श्रेणी | पाई चार्ट पर प्रतिशत |"
        : "| ਸ਼੍ਰੇਣੀ | ਪਾਈ ਚਾਰਟ ਉੱਤੇ ਪ੍ਰਤੀਸ਼ਤ |",
      "|---|---:|",
      ...s.slices.map((slice) => `| ${cell(slice.category)} | ${slice.displayPercent === "?" ? "?" : String(slice.displayPercent) + "%"} |`),
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
  "Hindi/Punjabi remain localization review candidates. They are not enabled in Question Studio until human approval. English controlled review remains unchanged; Question Bank, tests, mocks and public/student publication remain locked.",
  "",
);

writeFileSync(outputPath, lines.join("\n"), "utf8");
console.log(JSON.stringify({
  status: "WROTE_DI_005_LOCALIZATION_REVIEW_V1",
  outputPath,
  questions: DI005_PERMANENT_QLS.length * locales.length,
}));

import { writeFileSync } from "node:fs";

import {
  RNK_CP007_PERCENTAGE_PRESENTATION_ADAPTER_VERSION,
  buildRnkCp007PercentagePresentationBank,
  type RnkCp007PercentageAdapterLocale,
} from "./cp007-percentage-presentation-adapter-v1";

const outputPath = process.argv[2] ?? "RNK-CP-007-PERCENTAGE-PRESENTATION-ADAPTER-V1.md";
const locales: readonly RnkCp007PercentageAdapterLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const lines: string[] = [
  "# RNK-CP-007 Percentage Presentation Adapter V1",
  "",
  "> REVIEW / DELIVERY ADAPTER ONLY. These questions keep RNK-QL-042 frozen mathematics and identities while presenting the boys/girls partition as percentages. No new QL or product activation is granted.",
  "",
  `- Version: \`${RNK_CP007_PERCENTAGE_PRESENTATION_ADAPTER_VERSION}\``,
  "- Target authority: `RNK-QL-042 CATEGORY_COMPOSITION_AROUND_RANK`",
  "- Mathematical authority changed: false",
  "- New QL allocated: false",
  "- Question Studio: disabled",
  "",
];

for (const locale of locales) {
  const questions = buildRnkCp007PercentagePresentationBank(locale);
  lines.push(`## ${locale}`, "", `Eligible questions: ${questions.length}`, "");
  questions.slice(0, 8).forEach((question: Record<string, any>, index: number) => {
    lines.push(
      `### ${locale}-${String(index + 1).padStart(2, "0")} · permanent ${question.permanentProfile.permanentOrdinal}`,
      "",
      question.stem,
      "",
    );
    question.options.forEach((option: unknown, optionIndex: number) => {
      const label = typeof option === "object" && option !== null && "label" in option
        ? String((option as Record<string, unknown>).label)
        : String(option);
      lines.push(`${String.fromCharCode(65 + optionIndex)}. ${label}`);
    });
    lines.push(
      "",
      `**Answer:** ${question.answer}`,
      "",
      `**Explanation:** ${question.explanation}`,
      "",
      `**Percent split:** ${question.percentagePresentation.percentageA}% / ${question.percentagePresentation.percentageB}%`,
      "",
      "---",
      "",
    );
  });
}

writeFileSync(outputPath, `${lines.join("\n")}\n`, "utf8");
console.log(JSON.stringify({
  status: "EXPORTED",
  outputPath,
  version: RNK_CP007_PERCENTAGE_PRESENTATION_ADAPTER_VERSION,
  counts: Object.fromEntries(locales.map((locale) => [locale, buildRnkCp007PercentagePresentationBank(locale).length])),
}, null, 2));

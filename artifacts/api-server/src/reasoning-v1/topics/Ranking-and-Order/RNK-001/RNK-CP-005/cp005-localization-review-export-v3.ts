import { writeFileSync } from "node:fs";

import { buildRnkCp005PermanentRuntime } from "./cp005-permanent-runtime-v1";
import type { RnkCp005LocalizedLocale } from "./cp005-localization-review-v1";
import {
  RNK_CP005_LOCALIZATION_REVIEW_V3_AUTHORITY,
  RNK_CP005_LOCALIZATION_REVIEW_V3_ORDINALS_BY_QL,
  RNK_CP005_LOCALIZATION_REVIEW_V3_VERSION,
  localizeRnkCp005PermanentQuestionV3,
} from "./cp005-localization-review-v3";

const outputPath = process.argv[2] ?? "RNK-CP-005-HI-PA-LOCALIZATION-REVIEW-V3-48Q.md";
const canonical = buildRnkCp005PermanentRuntime();
const qlIds = Object.keys(RNK_CP005_LOCALIZATION_REVIEW_V3_ORDINALS_BY_QL) as Array<keyof typeof RNK_CP005_LOCALIZATION_REVIEW_V3_ORDINALS_BY_QL>;

function renderLocale(locale: RnkCp005LocalizedLocale): string[] {
  const lines: string[] = [];
  lines.push(locale === "hi-IN" ? "# हिंदी समीक्षा" : "# ਪੰਜਾਬੀ ਸਮੀਖਿਆ", "");

  for (const qlId of qlIds) {
    lines.push(`## ${qlId}`, "");
    for (const ordinal of RNK_CP005_LOCALIZATION_REVIEW_V3_ORDINALS_BY_QL[qlId]) {
      const canonicalQuestion = canonical.find((question) =>
        question.permanentProfile.permanentQlId === qlId &&
        question.permanentProfile.permanentOrdinalWithinAuthority === ordinal);
      if (!canonicalQuestion) throw new Error(`Missing ${qlId} permanent ordinal ${ordinal}`);
      const question = localizeRnkCp005PermanentQuestionV3(canonicalQuestion, locale);
      const diversity = question.localizationMetadata.diversity;

      lines.push(
        `### ${qlId} · permanent ordinal ${ordinal}`,
        "",
        `- Authority: \`${question.permanentProfile.authorityId}\``,
        `- Mode: \`${question.candidateRuntimeProfile.mode}\``,
        `- Source form: \`${question.candidateRuntimeProfile.sourceForm}\``,
        `- Context: \`${question.context}\``,
        `- Topology: \`${question.v3Topology}\``,
        `- Seed: \`${question.seed}\``,
        `- Correct option: ${question.correctIndex + 1}`,
        `- Intro variant: ${diversity.introVariant}`,
        `- Query variant: ${diversity.queryVariant}`,
        `- Clue variants: ${diversity.clueVariantIds.join(", ")}`,
        `- Clue order shuffled: ${diversity.clueOrderShuffled}`,
        "",
        "**Setup**",
        "",
        question.instruction,
        "",
        "**Clues**",
        "",
      );
      question.clues.forEach((clue) => lines.push(`- ${clue}`));
      lines.push("", "**Question**", "", question.stem, "", "**Options**", "");
      question.options.forEach((option, index) => {
        lines.push(`${index + 1}. ${option.label}`);
        lines.push(`   - ${option.explanation}`);
      });
      lines.push("", `**Answer:** ${question.answer}`, "", "**Explanation**", "");
      question.explanation.forEach((step, index) => lines.push(`${index + 1}. ${step}`));
      lines.push("", "---", "");
    }
  }
  return lines;
}

const questionsPerLocale = qlIds.reduce(
  (total, qlId) => total + RNK_CP005_LOCALIZATION_REVIEW_V3_ORDINALS_BY_QL[qlId].length,
  0,
);
const selected = canonical.filter((question) => {
  const qlId = question.permanentProfile.permanentQlId as keyof typeof RNK_CP005_LOCALIZATION_REVIEW_V3_ORDINALS_BY_QL;
  const ordinals = RNK_CP005_LOCALIZATION_REVIEW_V3_ORDINALS_BY_QL[qlId] as readonly number[] | undefined;
  return ordinals?.includes(question.permanentProfile.permanentOrdinalWithinAuthority) ?? false;
});
const reviewModes = [...new Set(selected.map((question) => question.candidateRuntimeProfile.mode))].sort();
const reviewContexts = [...new Set(selected.map((question) => question.context))].sort();

const lines = [
  "# RNK-CP-005 Hindi/Punjabi Localization Review V3",
  "",
  "> REVIEW CANDIDATE ONLY. V3 supersedes V2 for learner-facing review by refining native rank explanations while preserving V1 structured partial-order semantics and V2 gender-neutral rank-bound wording. Formal language approval and multilingual freeze are not granted.",
  "",
  `- Version: \`${RNK_CP005_LOCALIZATION_REVIEW_V3_VERSION}\``,
  `- Authority: \`${RNK_CP005_LOCALIZATION_REVIEW_V3_AUTHORITY}\``,
  "- Permanent range: `RNK-QL-036..038`",
  "- Frozen English runtime: 576 questions",
  "- Full localized parity bank: 576 Hindi + 576 Punjabi",
  `- Questions per locale: ${questionsPerLocale}`,
  `- Total review questions: ${questionsPerLocale * 2}`,
  `- Review modes: ${reviewModes.join(", ")}`,
  `- Review contexts: ${reviewContexts.join(", ")}`,
  "- Moderate diversity: 2 intro variants / 3 clue variants / 2 query variants / seeded clue shuffle",
  "- Human language review: required",
  "- Multilingual freeze: false",
  "- Question Studio / persistence / Question Bank / test delivery: locked",
  "",
  ...renderLocale("hi-IN"),
  ...renderLocale("pa-IN"),
];

writeFileSync(outputPath, `${lines.join("\n")}\n`, "utf8");
console.log(JSON.stringify({
  status: "EXPORTED",
  outputPath,
  version: RNK_CP005_LOCALIZATION_REVIEW_V3_VERSION,
  questionsPerLocale,
  totalQuestions: questionsPerLocale * 2,
  reviewModes,
  reviewContexts,
  humanLanguageReviewRequired: true,
  multilingualFreezeGranted: false,
}, null, 2));

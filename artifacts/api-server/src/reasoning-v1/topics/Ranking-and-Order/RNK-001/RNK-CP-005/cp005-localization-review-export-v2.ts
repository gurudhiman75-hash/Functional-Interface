import { writeFileSync } from "node:fs";

import { buildRnkCp005PermanentRuntime } from "./cp005-permanent-runtime-v1";
import type { RnkCp005LocalizedLocale } from "./cp005-localization-review-v1";
import {
  RNK_CP005_LOCALIZATION_REVIEW_V2_AUTHORITY,
  RNK_CP005_LOCALIZATION_REVIEW_V2_VERSION,
  localizeRnkCp005PermanentQuestionV2,
} from "./cp005-localization-review-v2";

const REVIEW_ORDINALS = [1, 2, 8, 24, 48, 96, 144, 192] as const;
const QL_IDS = ["RNK-QL-036", "RNK-QL-037", "RNK-QL-038"] as const;
const outputPath = process.argv[2] ?? "RNK-CP-005-HI-PA-LOCALIZATION-REVIEW-V2-48Q.md";
const canonical = buildRnkCp005PermanentRuntime();

function questionsForQl(qlId: string) {
  return canonical.filter((question) => question.permanentProfile.permanentQlId === qlId);
}

function renderLocale(locale: RnkCp005LocalizedLocale): string[] {
  const lines: string[] = [];
  lines.push(locale === "hi-IN" ? "# हिंदी समीक्षा" : "# ਪੰਜਾਬੀ ਸਮੀਖਿਆ", "");

  for (const qlId of QL_IDS) {
    const sourceQuestions = questionsForQl(qlId);
    lines.push(`## ${qlId}`, "");
    for (const ordinal of REVIEW_ORDINALS) {
      const canonicalQuestion = sourceQuestions.find(
        (question) => question.permanentProfile.permanentOrdinalWithinAuthority === ordinal,
      );
      if (!canonicalQuestion) throw new Error(`Missing ${qlId} permanent ordinal ${ordinal}`);
      const question = localizeRnkCp005PermanentQuestionV2(canonicalQuestion, locale);
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

const questionsPerLocale = QL_IDS.length * REVIEW_ORDINALS.length;
const lines = [
  "# RNK-CP-005 Hindi/Punjabi Localization Review V2",
  "",
  "> REVIEW CANDIDATE ONLY. CP005 remains English-frozen and product-locked. V1 rebuilds the learner surface from the frozen partial-order state; V2 only removes name-gender-dependent rank-bound wording. Formal human-language approval and multilingual freeze are not granted.",
  "",
  `- Version: \`${RNK_CP005_LOCALIZATION_REVIEW_V2_VERSION}\``,
  `- Authority: \`${RNK_CP005_LOCALIZATION_REVIEW_V2_AUTHORITY}\``,
  "- Permanent range: `RNK-QL-036..038`",
  "- Frozen English runtime: 576 questions",
  "- Full localized parity bank: 576 Hindi + 576 Punjabi",
  `- Permanent ordinals sampled per QL: ${REVIEW_ORDINALS.join(", ")}`,
  `- Questions per locale: ${questionsPerLocale}`,
  `- Total review questions: ${questionsPerLocale * 2}`,
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
  version: RNK_CP005_LOCALIZATION_REVIEW_V2_VERSION,
  reviewOrdinals: REVIEW_ORDINALS,
  questionsPerLocale,
  totalQuestions: questionsPerLocale * 2,
  humanLanguageReviewRequired: true,
  multilingualFreezeGranted: false,
}, null, 2));

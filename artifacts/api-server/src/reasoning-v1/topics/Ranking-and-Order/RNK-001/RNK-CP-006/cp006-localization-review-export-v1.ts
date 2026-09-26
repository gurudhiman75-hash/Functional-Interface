import { writeFileSync } from "node:fs";

import {
  buildRnkCp006LocalizedReviewBankV1,
  RNK_CP006_LOCALIZATION_REVIEW_V1_AUTHORITY,
  RNK_CP006_LOCALIZATION_REVIEW_V1_VERSION,
  type RnkCp006LocalizedLocale,
  type RnkCp006LocalizedReviewQuestionV1,
} from "./cp006-localization-review-v1";

const outputPath = process.argv[2] ?? "/tmp/RNK-CP-006-HI-PA-LOCALIZATION-REVIEW-V1-48Q.md";
const ordinals = new Set([1, 24, 49, 72, 97, 120, 145, 192]);

function selected(locale: RnkCp006LocalizedLocale): readonly RnkCp006LocalizedReviewQuestionV1[] {
  return buildRnkCp006LocalizedReviewBankV1(locale).filter((question) =>
    ordinals.has(question.permanentProfile.permanentOrdinalWithinAuthority),
  );
}

function renderQuestion(question: RnkCp006LocalizedReviewQuestionV1): string {
  return [
    `### ${question.permanentProfile.permanentQlId} · permanent ordinal ${question.permanentProfile.permanentOrdinalWithinAuthority}`,
    "",
    `- Authority: \`${question.authorityId}\``,
    `- Mode: \`${question.mode}\``,
    `- Context: \`${question.context}\``,
    `- Difficulty: \`${question.difficulty}\``,
    `- Seed: \`${question.seed}\``,
    `- Correct option: ${question.correctIndex + 1}`,
    "",
    "**Clues**",
    "",
    ...question.clues.map((clue) => `- ${clue}`),
    "",
    "**Question**",
    "",
    question.stem,
    "",
    "**Options**",
    "",
    ...question.options.map((option, index) => `${index + 1}. ${option}`),
    "",
    `**Answer:** ${question.answer}`,
    "",
    "**Explanation**",
    "",
    ...question.explanation.map((line, index) => `${index + 1}. ${line}`),
    "",
    "---",
    "",
  ].join("\n");
}

const hindi = selected("hi-IN");
const punjabi = selected("pa-IN");
if (hindi.length !== 24 || punjabi.length !== 24) {
  throw new Error(`Expected 24 questions per locale, got Hindi=${hindi.length}, Punjabi=${punjabi.length}`);
}

const header = [
  "# RNK-CP-006 Hindi/Punjabi Localization Review V1",
  "",
  "> REVIEW CANDIDATE ONLY. Learner-facing Hindi/Punjabi is reconstructed from the frozen CP006 equality-aware structured state. English mathematics and permanent runtime remain authoritative. Formal human-language approval and multilingual freeze are not granted.",
  "",
  `- Version: \`${RNK_CP006_LOCALIZATION_REVIEW_V1_VERSION}\``,
  `- Authority: \`${RNK_CP006_LOCALIZATION_REVIEW_V1_AUTHORITY}\``,
  "- Permanent range: `RNK-QL-039..041`",
  "- Frozen English runtime: 576 questions",
  "- Full localized parity bank: 576 Hindi + 576 Punjabi",
  "- Review questions: 24 Hindi + 24 Punjabi = 48",
  "- Authorities: equality-aware pair relation / equality-aware endpoint / complete weak order",
  "- Contexts: height / scores / speed / seniority / performance",
  "- Human language review: required",
  "- Multilingual freeze: false",
  "- Question Studio / persistence / Question Bank / test delivery: locked",
  "",
].join("\n");

const document = [
  header,
  "# हिंदी समीक्षा\n",
  ...hindi.map(renderQuestion),
  "# ਪੰਜਾਬੀ ਸਮੀਖਿਆ\n",
  ...punjabi.map(renderQuestion),
].join("\n");

writeFileSync(outputPath, document, "utf8");
console.log(JSON.stringify({
  status: "EXPORTED",
  outputPath,
  version: RNK_CP006_LOCALIZATION_REVIEW_V1_VERSION,
  questionsPerLocale: 24,
  totalQuestions: 48,
  humanLanguageReviewRequired: true,
  multilingualFreezeGranted: false,
}, null, 2));

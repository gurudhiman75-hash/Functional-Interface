import { writeFileSync } from "node:fs";

import type { RnkCp007LocalizedLocale } from "./cp007-localization-review-v1";
import {
  buildRnkCp007LocalizedReviewBankV3,
  type RnkCp007LocalizedReviewQuestionV3,
} from "./cp007-localization-review-v3";

const OUTPUT = process.argv[2] ?? "RNK-CP-007-HI-PA-LOCALIZATION-REVIEW-V3-64Q.md";
const LETTERS = ["A", "B", "C", "D"] as const;
const MODES = [
  "TARGET_CATEGORY_AFTER",
  "OTHER_CATEGORY_AFTER",
  "TARGET_CATEGORY_AHEAD_FROM_OTHER_AFTER",
  "OTHER_CATEGORY_AHEAD_FROM_TARGET_AFTER",
] as const;
const STYLES = ["CANONICAL", "RANKED_LIST", "ORDER_OF_MERIT", "COMPACT_RATIO"] as const;

function balancedSample(locale: RnkCp007LocalizedLocale): readonly RnkCp007LocalizedReviewQuestionV3[] {
  const bank = buildRnkCp007LocalizedReviewBankV3(locale);
  const selected: RnkCp007LocalizedReviewQuestionV3[] = [];
  for (const mode of MODES) {
    for (const style of STYLES) {
      const bucket = bank.filter(
        (question) => question.mode === mode && question.reviewMetadata.surfaceProfile.style === style,
      );
      if (bucket.length < 2) throw new Error(`Insufficient CP007 V3 bucket ${locale}/${mode}/${style}`);
      selected.push(bucket[0]!, bucket[1]!);
    }
  }
  if (selected.length !== 32) throw new Error(`Expected 32 ${locale} V3 questions, found ${selected.length}`);
  return selected;
}

function renderLocale(locale: RnkCp007LocalizedLocale, title: string): string[] {
  const questions = balancedSample(locale);
  const lines: string[] = [`## ${title}`, "", `Review items: **${questions.length}** — 2 per mode × surface-style cell.`, "", "### Questions", ""];
  questions.forEach((question, index) => {
    lines.push(`#### ${title.slice(0, 2).toUpperCase()}-${String(index + 1).padStart(2, "0")} — ${question.mode} / ${question.reviewMetadata.surfaceProfile.style}`, "", question.stem, "");
    question.options.forEach((option, optionIndex) => lines.push(`${LETTERS[optionIndex]}. ${option}`));
    lines.push("");
  });
  lines.push("### Answers and explanations", "");
  questions.forEach((question, index) => {
    lines.push(`#### ${title.slice(0, 2).toUpperCase()}-${String(index + 1).padStart(2, "0")}`, "", `**Answer:** ${LETTERS[question.answerIndex]} — ${question.answer}`, "", `**Explanation:** ${question.explanation}`, "", `**Canonical item:** \`${question.localizationProof.canonicalItemId}\``, "");
  });
  return lines;
}

const hindi = balancedSample("hi-IN");
const punjabi = balancedSample("pa-IN");
const lines: string[] = [
  "# RNK-CP-007 — Hindi/Punjabi Native Editorial Human Review Pack V3",
  "",
  "Status: **machine-proved native-editorial review candidate — not multilingual frozen**.",
  "",
  "V3 carries forward V2 oblique/plural and rank-grammar corrections and also fixes feminine interrogative agreement found during direct inspection of the retained V2 review artifact.",
  "",
  "```text",
  "Hindi samples:                 32",
  "Punjabi samples:               32",
  "total manual-review samples:   64",
  "permanent QL:                  RNK-QL-042",
  "new QLs:                       0",
  "human language review:         REQUIRED",
  "multilingual freeze:           NOT GRANTED",
  "Question Studio:               DISABLED",
  "persistence/publication:       DISABLED",
  "```",
  "",
  ...renderLocale("hi-IN", "Hindi"),
  "",
  "---",
  "",
  ...renderLocale("pa-IN", "Punjabi"),
  "",
  "---",
  "",
  "## Review checklist",
  "",
  "- natural native exam-language wording;",
  "- correct oblique/plural forms before postpositions;",
  "- complete Hindi/Punjabi rank phrasing;",
  "- feminine count agreement for the girls-category question;",
  "- correct ahead/behind semantics relative to the named person;",
  "- explanation arithmetic matches the visible evidence;",
  "- no residual English learner-facing prose except one-letter symbolic markers inside localized labels.",
];

writeFileSync(OUTPUT, `${lines.join("\n")}\n`, "utf8");
console.log(JSON.stringify({
  status: "PASS",
  output: OUTPUT,
  hindiSamples: hindi.length,
  punjabiSamples: punjabi.length,
  totalSamples: hindi.length + punjabi.length,
  multilingualFreezeGranted: false,
}, null, 2));

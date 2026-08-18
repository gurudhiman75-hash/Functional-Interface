import { writeFileSync } from "node:fs";

import type { RnkCp007LocalizedLocale } from "./cp007-localization-review-v1";
import {
  buildRnkCp007LocalizedReviewBankV4,
  type RnkCp007LocalizedReviewQuestionV4,
} from "./cp007-localization-review-v4";

const OUTPUT = process.argv[2] ?? "RNK-CP-007-HI-PA-LOCALIZATION-REVIEW-V4-64Q.md";
const LETTERS = ["A", "B", "C", "D"] as const;
const MODES = [
  "TARGET_CATEGORY_AFTER",
  "OTHER_CATEGORY_AFTER",
  "TARGET_CATEGORY_AHEAD_FROM_OTHER_AFTER",
  "OTHER_CATEGORY_AHEAD_FROM_TARGET_AFTER",
] as const;
const STYLES = ["CANONICAL", "RANKED_LIST", "ORDER_OF_MERIT", "COMPACT_RATIO"] as const;

function balancedSample(locale: RnkCp007LocalizedLocale): readonly RnkCp007LocalizedReviewQuestionV4[] {
  const bank = buildRnkCp007LocalizedReviewBankV4(locale);
  const selected: RnkCp007LocalizedReviewQuestionV4[] = [];
  for (const mode of MODES) {
    for (const style of STYLES) {
      const bucket = bank.filter(
        (question) => question.mode === mode && question.reviewMetadata.surfaceProfile.style === style,
      );
      if (bucket.length < 2) throw new Error(`Insufficient CP007 V4 bucket ${locale}/${mode}/${style}`);
      const batch = bucket.find((question) => question.reviewMetadata.partitionId === "morning-evening-batch");
      const firstQuestion = batch ?? bucket[0]!;
      const secondQuestion = bucket.find((question) => question !== firstQuestion) ?? bucket[1]!;
      selected.push(firstQuestion, secondQuestion);
    }
  }
  if (selected.length !== 32) throw new Error(`Expected 32 ${locale} V4 questions, found ${selected.length}`);
  if (new Set(selected.map((question) => question.localizationProof.canonicalItemId)).size !== selected.length) {
    throw new Error(`${locale}: V4 review sample contains duplicate canonical items`);
  }
  return selected;
}

function renderLocale(locale: RnkCp007LocalizedLocale, title: string): string[] {
  const questions = balancedSample(locale);
  const lines: string[] = [`## ${title}`, "", `Review items: **${questions.length}** — 2 distinct items per mode × surface-style cell, preferring the repaired morning/evening-batch partition where available.`, "", "### Questions", ""];
  questions.forEach((question, index) => {
    lines.push(`#### ${title.slice(0, 2).toUpperCase()}-${String(index + 1).padStart(2, "0")} — ${question.mode} / ${question.reviewMetadata.surfaceProfile.style} / ${question.reviewMetadata.partitionId}`, "", question.stem, "");
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
  "# RNK-CP-007 — Hindi/Punjabi Native Editorial Human Review Pack V4",
  "",
  "Status: **machine-proved V4 review candidate — not multilingual frozen**.",
  "",
  "V4 carries forward V3 feminine count agreement and repairs the morning/evening batch compound labels found during direct artifact review: Hindi uses `सुबह के बैच` / `शाम के बैच`; Punjabi uses `ਸਵੇਰ ਦੇ ਬੈਚ` / `ਸ਼ਾਮ ਦੇ ਬੈਚ`. The repair applies to both stems and explanations without changing canonical mathematics.",
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
  "- natural morning/evening batch genitive wording in stem and explanation;",
  "- V3 feminine girls-category count agreement remains correct;",
  "- correct oblique/plural forms before postpositions;",
  "- complete Hindi/Punjabi rank phrasing;",
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
  uniqueHindiCanonicalItems: new Set(hindi.map((question) => question.localizationProof.canonicalItemId)).size,
  uniquePunjabiCanonicalItems: new Set(punjabi.map((question) => question.localizationProof.canonicalItemId)).size,
  multilingualFreezeGranted: false,
}, null, 2));

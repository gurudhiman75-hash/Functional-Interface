import { writeFileSync } from "node:fs";

import {
  buildRnkCp007LocalizedReviewBank,
  type RnkCp007LocalizedLocale,
  type RnkCp007LocalizedReviewQuestion,
} from "./cp007-localization-review-v1";

const OUTPUT = process.argv[2] ?? "RNK-CP-007-HI-PA-LOCALIZATION-REVIEW-V1-64Q.md";
const LETTERS = ["A", "B", "C", "D"] as const;
const MODES = [
  "TARGET_CATEGORY_AFTER",
  "OTHER_CATEGORY_AFTER",
  "TARGET_CATEGORY_AHEAD_FROM_OTHER_AFTER",
  "OTHER_CATEGORY_AHEAD_FROM_TARGET_AFTER",
] as const;
const STYLES = ["CANONICAL", "RANKED_LIST", "ORDER_OF_MERIT", "COMPACT_RATIO"] as const;

function balancedSample(
  locale: RnkCp007LocalizedLocale,
): readonly RnkCp007LocalizedReviewQuestion[] {
  const bank = buildRnkCp007LocalizedReviewBank(locale);
  const selected: RnkCp007LocalizedReviewQuestion[] = [];
  for (const mode of MODES) {
    for (const style of STYLES) {
      const bucket = bank.filter(
        (question) => question.mode === mode
          && question.reviewMetadata.surfaceProfile.style === style,
      );
      if (bucket.length < 2) {
        throw new Error(`Insufficient CP007 localization review bucket ${locale}/${mode}/${style}`);
      }
      selected.push(bucket[0]!, bucket[1]!);
    }
  }
  if (selected.length !== 32) {
    throw new Error(`Expected 32 ${locale} review questions, found ${selected.length}`);
  }
  return selected;
}

function renderLocale(
  locale: RnkCp007LocalizedLocale,
  title: string,
): string[] {
  const questions = balancedSample(locale);
  const lines: string[] = [];
  lines.push(`## ${title}`);
  lines.push("");
  lines.push(`Review items: **${questions.length}** — 2 per mode × surface-style cell.`);
  lines.push("");
  lines.push("### Questions");
  lines.push("");
  questions.forEach((question, index) => {
    lines.push(`#### ${title.slice(0, 2).toUpperCase()}-${String(index + 1).padStart(2, "0")} — ${question.mode} / ${question.reviewMetadata.surfaceProfile.style}`);
    lines.push("");
    lines.push(question.stem);
    lines.push("");
    question.options.forEach((option, optionIndex) => {
      lines.push(`${LETTERS[optionIndex]}. ${option}`);
    });
    lines.push("");
  });
  lines.push("### Answers and explanations");
  lines.push("");
  questions.forEach((question, index) => {
    lines.push(`#### ${title.slice(0, 2).toUpperCase()}-${String(index + 1).padStart(2, "0")}`);
    lines.push("");
    lines.push(`**Answer:** ${LETTERS[question.answerIndex]} — ${question.answer}`);
    lines.push("");
    lines.push(`**Explanation:** ${question.explanation}`);
    lines.push("");
    lines.push(`**Canonical item:** \`${question.localizationProof.canonicalItemId}\``);
    lines.push("");
    lines.push(`**Semantic fingerprint:** \`${question.localizationProof.canonicalSemanticFingerprint}\``);
    lines.push("");
  });
  return lines;
}

const hindi = balancedSample("hi-IN");
const punjabi = balancedSample("pa-IN");
const lines: string[] = [];
lines.push("# RNK-CP-007 — Hindi/Punjabi Localization Human Review Pack V1");
lines.push("");
lines.push("Status: **machine-proved review candidate — not multilingual frozen**.");
lines.push("");
lines.push("This pack samples the frozen `RNK-QL-042 CATEGORY_COMPOSITION_AROUND_RANK` runtime without changing its mathematics, options, answers, QL ownership or English projection.");
lines.push("");
lines.push("```text");
lines.push("Hindi samples:                 32");
lines.push("Punjabi samples:               32");
lines.push("total manual-review samples:   64");
lines.push("permanent QL:                  RNK-QL-042");
lines.push("new QLs:                       0");
lines.push("human language review:         REQUIRED");
lines.push("multilingual freeze:           NOT GRANTED");
lines.push("Question Studio:               DISABLED");
lines.push("persistence/publication:       DISABLED");
lines.push("```");
lines.push("");
lines.push(...renderLocale("hi-IN", "Hindi"));
lines.push("");
lines.push("---");
lines.push("");
lines.push(...renderLocale("pa-IN", "Punjabi"));
lines.push("");
lines.push("---");
lines.push("");
lines.push("## Review checklist");
lines.push("");
lines.push("- natural exam-language wording rather than literal translation;");
lines.push("- correct use of आगे/पीछे and ਅੱਗੇ/ਪਿੱਛੇ relative to the named person;");
lines.push("- natural category and group labels in every context;");
lines.push("- no ambiguity introduced by localized rank phrasing;");
lines.push("- explanation arithmetic matches the visible localized evidence;");
lines.push("- no residual English learner-facing prose except one-letter symbolic category markers embedded in localized labels.");

writeFileSync(OUTPUT, `${lines.join("\n")}\n`, "utf8");
console.log(JSON.stringify({
  status: "PASS",
  output: OUTPUT,
  hindiSamples: hindi.length,
  punjabiSamples: punjabi.length,
  totalSamples: hindi.length + punjabi.length,
  multilingualFreezeGranted: false,
}, null, 2));

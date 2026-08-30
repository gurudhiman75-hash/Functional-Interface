import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateStcV2EditorialQuestion } from "./editorial-v2-generator.ts";
import { generateStcV2FiveWayQuestion } from "./editorial-v2-five-way-profile.ts";
import { STC_QL_IDS, type StcLocale } from "./types.ts";

const LOCALES: readonly StcLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const outDir = resolve(process.env.STC_V2_REVIEW_OUT ?? "stc-001-v2-trilingual-review-pack");
mkdirSync(outDir, { recursive: true });

const fourWay = LOCALES.flatMap((locale) =>
  STC_QL_IDS.flatMap((qlId) =>
    Array.from({ length: 8 }, (_, seed) => generateStcV2EditorialQuestion({ qlId, locale, seed })),
  ),
);

const fiveWayEither = LOCALES.flatMap((locale) =>
  Array.from({ length: 8 }, (_, index) => generateStcV2FiveWayQuestion({
    qlId: "STC-QL-002",
    locale,
    seed: index * 4,
  })),
);

const payload = {
  chapterId: "STC-001",
  version: "V2",
  status: "TRILINGUAL_REVIEW_ONLY",
  locales: LOCALES,
  fourWaySurfaceCount: fourWay.length,
  dedicatedFiveWayEitherSurfaceCount: fiveWayEither.length,
  totalReviewSurfaceCount: fourWay.length + fiveWayEither.length,
  learnerDeliveryLocked: true,
  fourWay,
  fiveWayEither,
} as const;

writeFileSync(resolve(outDir, "stc-001-v2-trilingual-review.json"), `${JSON.stringify(payload, null, 2)}\n`, "utf8");

const lines: string[] = [
  "# STC-001 V2 — Trilingual Question Studio Review Pack",
  "",
  "> Review-only. Question Bank/test/mock/public/automatic publication remain locked.",
  "",
  `- Four-way surfaces: ${fourWay.length}`,
  `- Dedicated Banking either/or surfaces: ${fiveWayEither.length}`,
  `- Total surfaces: ${fourWay.length + fiveWayEither.length}`,
  "",
];

for (const locale of LOCALES) {
  lines.push(`## ${locale} — FOUR_WAY`, "");
  const localeQuestions = fourWay.filter((question) => question.locale === locale);
  for (const [index, question] of localeQuestions.entries()) {
    lines.push(
      `### ${index + 1}. ${question.qlId} · ${question.surfaceArchetype}`,
      "",
      `**Statement:** ${question.stem}`,
      "",
      "**Conclusions:**",
      `I. ${question.conclusions[0]}`,
      `II. ${question.conclusions[1]}`,
      "",
      ...question.options.map((option, optionIndex) => `${optionIndex + 1}. ${option}`),
      "",
      `**Answer:** ${question.options[question.correctIndex]}`,
      "",
      `**Explanation:** ${question.explanation}`,
      "",
      `<!-- ${question.scenarioId}; seed=${question.seed} -->`,
      "",
      "---",
      "",
    );
  }

  lines.push(`## ${locale} — FIVE_WAY_EITHER dedicated authorities`, "");
  const localeEither = fiveWayEither.filter((question) => question.locale === locale);
  for (const [index, question] of localeEither.entries()) {
    lines.push(
      `### Either ${index + 1}. ${question.surfaceArchetype}`,
      "",
      `**Statement:** ${question.stem}`,
      "",
      "**Conclusions:**",
      `I. ${question.conclusions[0]}`,
      `II. ${question.conclusions[1]}`,
      "",
      ...question.options.map((option, optionIndex) => `${optionIndex + 1}. ${option}`),
      "",
      `**Answer:** ${question.options[question.correctIndex]}`,
      "",
      `**Explanation:** ${question.explanation}`,
      "",
      `<!-- ${question.scenarioId}; seed=${question.seed} -->`,
      "",
      "---",
      "",
    );
  }
}

writeFileSync(resolve(outDir, "stc-001-v2-trilingual-review.md"), `${lines.join("\n")}\n`, "utf8");
console.log(`PASS_STC_001_V2_TRILINGUAL_REVIEW_PACK fourWay=${fourWay.length} fiveWayEither=${fiveWayEither.length} total=${fourWay.length + fiveWayEither.length}`);

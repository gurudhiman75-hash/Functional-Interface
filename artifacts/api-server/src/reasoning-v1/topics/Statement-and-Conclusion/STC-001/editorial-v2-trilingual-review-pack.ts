import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { STC_V2_EDITORIAL_AUTHORITIES } from "./editorial-v2-authorities.ts";
import { generateStcV2EditorialQuestion } from "./editorial-v2-generator.ts";
import { canonicalReviewSeedForAuthorityIndex } from "./editorial-v2-scheduler.ts";
import { STC_QL_IDS, type StcLocale } from "./types.ts";

const LOCALES: readonly StcLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const outDir = resolve(process.env.STC_V2_REVIEW_OUT ?? "stc-001-v2-1-trilingual-review-pack");
mkdirSync(outDir, { recursive: true });

const fourWay = LOCALES.flatMap((locale) =>
  STC_QL_IDS.flatMap((qlId) => {
    const pool = STC_V2_EDITORIAL_AUTHORITIES.filter((entry) => entry.qlId === qlId);
    return pool.map((_, authorityIndex) => generateStcV2EditorialQuestion({
      qlId,
      locale,
      seed: canonicalReviewSeedForAuthorityIndex(qlId, authorityIndex),
    }));
  }),
);

const payload = {
  chapterId: "STC-001",
  version: "V2.1",
  status: "TRILINGUAL_REVIEW_ONLY_SATURATION_BLOCKED",
  locales: LOCALES,
  fourWaySurfaceCount: fourWay.length,
  activePresentationProfiles: ["FOUR_WAY"],
  bankingFiveWayEitherStatus: "REMOVED_FROM_ACTIVE_NON_SYLLOGISTIC_STC",
  archivedSolverValidatedFiveWayEitherAuthorityCount: 8,
  antiGamingScheduler: "STC_V2_1_NON_PERIODIC_16_SLOT",
  maximumDistinctCuratedPresentationsPerQlBeforeVariableization: 16,
  minimumDistinctQuestionsPerQlForGenerationReady: 1000,
  generationReady: false,
  learnerDeliveryLocked: true,
  fourWay,
} as const;

writeFileSync(resolve(outDir, "stc-001-v2-1-trilingual-review.json"), `${JSON.stringify(payload, null, 2)}\n`, "utf8");

const lines: string[] = [
  "# STC-001 V2.1 — Trilingual Non-Syllogistic Review Pack",
  "",
  "> Review-only and saturation-blocked. Question Bank/test/mock/public/automatic publication remain locked.",
  "",
  `- Canonical four-way surfaces: ${fourWay.length}`,
  "- Active presentation profile: FOUR_WAY",
  "- Banking FIVE_WAY_EITHER: removed from active STC; solver authorities retained only as historical/audit material because Examtree handles exam-native either/or in Syllogism/Inequality families.",
  "- Anti-gaming scheduler: STC_V2_1_NON_PERIODIC_16_SLOT",
  "- Current curated ceiling: 16 distinct authority/order presentations per QL",
  "- Generation-ready threshold: at least 1000 distinct questions per QL",
  "- Generation ready: NO — variableized surface saturation is the next required checkpoint",
  "",
];

for (const locale of LOCALES) {
  lines.push(`## ${locale} — FOUR_WAY canonical authority review`, "");
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
      `<!-- ${question.scenarioId}; canonical-review-seed=${question.seed}; surface=${question.surfaceArchetype} -->`,
      "",
      "---",
      "",
    );
  }
}

writeFileSync(resolve(outDir, "stc-001-v2-1-trilingual-review.md"), `${lines.join("\n")}\n`, "utf8");
console.log(`PASS_STC_001_V2_1_TRILINGUAL_REVIEW_PACK canonicalFourWay=${fourWay.length} generationReady=false`);

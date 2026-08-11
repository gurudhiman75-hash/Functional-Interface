import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  INT_CP004_LOCALIZED_REVIEW_PACK_VERSION,
  buildIntCp004LocalizedReviewPackV9Safe,
  renderIntCp004LocalizedReviewMarkdown,
  serializeIntCp004LocalizedReviewPack,
  sha256Text,
} from "./cp004-localized-review-pack-v9-safe";
import { INT_CP004_LOCALIZED_LOCALES } from "./cp004-localization-language-pack";
import type { IntCp004LocalizedLocale } from "./cp004-localization-types";

const OUTPUT_DIRECTORY = join(
  process.cwd(),
  "dist",
  "quant-v4",
  "int-cp004-localized-review-pack",
);

const FILES: Readonly<Record<IntCp004LocalizedLocale, Readonly<{
  markdown: string;
  data: string;
}>>> = Object.freeze({
  "hi-IN": Object.freeze({
    markdown: "INT-CP-004-Hindi-Questions-and-Explanations-Review.md",
    data: "INT-CP-004-Hindi-Review-Data.json",
  }),
  "pa-IN": Object.freeze({
    markdown: "INT-CP-004-Punjabi-Questions-and-Explanations-Review.md",
    data: "INT-CP-004-Punjabi-Review-Data.json",
  }),
});

mkdirSync(OUTPUT_DIRECTORY, { recursive: true });

const localeSummaries: Record<string, unknown> = {};

for (const locale of INT_CP004_LOCALIZED_LOCALES) {
  const pack = buildIntCp004LocalizedReviewPackV9Safe(locale);
  const markdown = renderIntCp004LocalizedReviewMarkdown(pack);
  const data = serializeIntCp004LocalizedReviewPack(pack);
  const files = FILES[locale];
  const answerPositions = [0, 0, 0, 0];
  const representationCounts: Record<string, number> = {};
  const stemFamilyCounts: Record<string, number> = {};
  const qlCounts: Record<string, number> = {};
  const uniqueSeeds = new Set<string>();

  for (const question of pack.questions) {
    answerPositions[question.correctIndex] = (answerPositions[question.correctIndex] ?? 0) + 1;
    representationCounts[question.representation] = (representationCounts[question.representation] ?? 0) + 1;
    const frame = question.stemFamilyId.split("-FRAME-").at(-1) ?? "UNKNOWN";
    stemFamilyCounts[`FRAME-${frame}`] = (stemFamilyCounts[`FRAME-${frame}`] ?? 0) + 1;
    qlCounts[question.qlId] = (qlCounts[question.qlId] ?? 0) + 1;
    uniqueSeeds.add(question.seed);
  }

  writeFileSync(join(OUTPUT_DIRECTORY, files.markdown), markdown, "utf8");
  writeFileSync(join(OUTPUT_DIRECTORY, files.data), data, "utf8");

  localeSummaries[locale] = {
    language: pack.language,
    markdownFile: files.markdown,
    dataFile: files.data,
    questionCount: pack.questionCount,
    qlCount: pack.qlCount,
    questionsPerQl: pack.questionsPerQl,
    uniqueSeedCount: uniqueSeeds.size,
    answerPositions,
    representationCounts,
    stemFamilyCounts,
    qlCounts,
    markdownSha256: sha256Text(markdown),
    dataSha256: sha256Text(data),
  };
}

const summary = {
  status: "CP004_LOCALIZED_REVIEW_PACKS_EXPORTED",
  reviewPackVersion: INT_CP004_LOCALIZED_REVIEW_PACK_VERSION,
  canonicalFreezeId: "INT-CP-004-EN-v1-frozen",
  qlRange: "INT-QL-067..INT-QL-085",
  qlCount: 19,
  locales: INT_CP004_LOCALIZED_LOCALES,
  questionCountPerLocale: 76,
  totalReviewQuestions: 152,
  localeSummaries,
  lifecycle: {
    maturity: "MULTILINGUAL_LOCALISATION_REVIEW",
    reviewStatus: "LOCALIZED_REVIEW_REQUIRED",
    enabled: false,
    stagingStatus: "NOT_STAGED",
    registrationStatus: "NOT_REGISTERED",
    questionStudioDiscoverable: false,
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
  },
};

writeFileSync(
  join(OUTPUT_DIRECTORY, "int-cp004-localized-review-pack-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
  "utf8",
);

console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP004_LOCALIZED_REVIEW_PACK_EXPORTER");

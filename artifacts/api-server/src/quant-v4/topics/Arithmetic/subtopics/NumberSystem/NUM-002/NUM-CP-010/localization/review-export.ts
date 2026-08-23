import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import {
  NUM_CP010_PERMANENT_ALLOCATION,
  type NumCp010PermanentQlId,
} from "../permanent-allocation.ts";
import { generateNumCp010LocalizedHumanReview } from "./runtime-human-review.ts";
import type { NumCp010LocalizedLanguage } from "./types.ts";

const outputDir = path.resolve("dist/quant-v4/num-cp010-hi-pa-review");
fs.mkdirSync(outputDir, { recursive: true });

const languages: readonly NumCp010LocalizedLanguage[] = ["hi", "pa"];
const reviewSeeds = [31, 62, 93] as const;
const rows = NUM_CP010_PERMANENT_ALLOCATION.flatMap((allocation) =>
  languages.flatMap((language) =>
    reviewSeeds.map((seed) => {
      const item = generateNumCp010LocalizedHumanReview(allocation.qlId as NumCp010PermanentQlId, seed, language);
      return {
        language,
        locale: item.locale,
        qlId: item.permanentQlId,
        authorityId: item.authorityId,
        authorityLabel: item.authorityLabel,
        prototypeId: item.temporaryPrototypeId,
        seed: item.seed,
        sourceSeed: item.sourceSeed,
        difficulty: item.difficulty,
        representation: item.representation,
        stem: item.stem,
        options: item.options.map((option, index) => ({ index, ...option })),
        correctIndex: item.correctIndex,
        canonicalAnswer: item.canonicalAnswer,
        explanation: item.explanation,
      };
    }),
  ),
);

for (const language of languages) {
  const prototypes = new Set(rows.filter((row) => row.language === language).map((row) => row.prototypeId));
  assert.equal(prototypes.size, 26, `${language}: review must reach all 26 source prototypes`);
}

const sections = rows.map((row) => {
  const options = row.options
    .map((option) => `${String.fromCharCode(65 + option.index)}. ${option.value}${option.isCorrect ? "  ← correct" : ""}`)
    .join("\n");
  const steps = row.explanation.steps.map((step, index) => `${index + 1}. ${step}`).join("\n");
  return [
    `## ${row.qlId} — ${row.authorityLabel} — ${row.language.toUpperCase()}`,
    "",
    `- Prototype: ${row.prototypeId}`,
    `- Seed: ${row.seed} (source seed ${row.sourceSeed})`,
    `- Difficulty: ${row.difficulty}`,
    `- Representation: ${row.representation}`,
    "",
    `**Question:** ${row.stem}`,
    "",
    options,
    "",
    `**Concept:** ${row.explanation.coreConcept}`,
    "",
    `**Approach:** ${row.explanation.strategy}`,
    "",
    steps,
    "",
    `**Final answer:** ${row.explanation.finalAnswer}`,
  ].join("\n");
});

const audit = {
  status: "PASS_NUM_CP010_HI_PA_REVIEW_EXPORT",
  permanentAuthorities: NUM_CP010_PERMANENT_ALLOCATION.length,
  languages,
  samplesPerAuthorityPerLanguage: reviewSeeds.length,
  questionCount: rows.length,
  prototypeReachPerLanguage: 26,
  firstPermanentQl: "NUM-QL-197",
  lastPermanentQl: "NUM-QL-212",
  nextAvailableQl: "NUM-QL-213",
  reviewStatus: "MULTILINGUAL_REVIEW_CANDIDATE",
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
};

const markdown = [
  "# NUM-CP-010 Hindi + Punjabi Review Candidate",
  "",
  "This workbook samples every permanent authority and every approved source prototype in both localized languages. It is review evidence only; no downstream delivery gate is opened.",
  "",
  ...sections,
  "",
].join("\n");

fs.writeFileSync(path.join(outputDir, "review.json"), JSON.stringify(rows, null, 2));
fs.writeFileSync(path.join(outputDir, "review.md"), markdown);
fs.writeFileSync(path.join(outputDir, "audit.json"), JSON.stringify(audit, null, 2));
console.log(JSON.stringify(audit, null, 2));

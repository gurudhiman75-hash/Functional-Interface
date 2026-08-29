import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import { NUM_CP011_PERMANENT_ALLOCATION, type NumCp011PermanentQlId } from "../permanent-allocation.ts";
import { generateNumCp011Localized } from "./runtime.ts";
import type { NumCp011LocalizedLanguage } from "./types.ts";

const outputDir = path.resolve("dist/quant-v4/num-cp011-hi-pa-review");
fs.mkdirSync(outputDir, { recursive: true });

const languages: readonly NumCp011LocalizedLanguage[] = ["hi", "pa"];
const reviewSeeds = [31, 62, 93] as const;
const samples = NUM_CP011_PERMANENT_ALLOCATION.flatMap((allocation) =>
  reviewSeeds.flatMap((seed) => languages.map((language) => {
    const item = generateNumCp011Localized(allocation.qlId as NumCp011PermanentQlId, seed, language);
    assert.equal(item.lifecycle.reviewStatus, "MULTILINGUAL_FROZEN");
    assert.equal(item.lifecycle.questionStudioDiscoverable, false);
    assert.equal(item.lifecycle.questionBankWritable, false);
    assert.equal(item.lifecycle.testEligible, false);
    assert.equal(item.lifecycle.publiclyPublishable, false);
    return {
      qlId: item.permanentQlId,
      authorityId: item.authorityId,
      authorityLabel: item.authorityLabel,
      prototypeId: item.temporaryPrototypeId,
      language,
      locale: item.locale,
      seed: item.seed,
      difficulty: item.difficulty,
      representation: item.representation,
      stem: item.stem,
      options: item.options.map((option, index) => ({ index, value: option.value, isCorrect: option.isCorrect })),
      correctIndex: item.correctIndex,
      canonicalAnswer: item.canonicalAnswer,
      explanation: item.explanation,
    };
  })),
);

assert.equal(samples.length, 13 * 3 * 2, "Expected 78 bilingual review questions");
for (const language of languages) {
  const reached = new Set(samples.filter((sample) => sample.language === language).map((sample) => sample.prototypeId));
  assert.equal(reached.size, 13, `${language}: review does not cover all permanent authorities`);
}

const audit = {
  status: "PASS_NUM_CP011_HI_PA_REVIEW_EXPORT",
  authorities: NUM_CP011_PERMANENT_ALLOCATION.length,
  languages,
  samplesPerAuthorityPerLanguage: reviewSeeds.length,
  questionCount: samples.length,
  firstPermanentQl: "NUM-QL-213",
  lastPermanentQl: "NUM-QL-225",
  nextAvailableQl: "NUM-QL-226",
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
};

const sections = samples.map((sample) => {
  const options = sample.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option.value}${option.isCorrect ? "  ← correct" : ""}`).join("\n");
  const steps = sample.explanation.steps.map((step, index) => `${index + 1}. ${step}`).join("\n");
  return [
    `## ${sample.qlId} — ${sample.language.toUpperCase()} — ${sample.authorityLabel}`,
    "",
    `- Prototype: ${sample.prototypeId}`,
    `- Seed: ${sample.seed}`,
    `- Difficulty: ${sample.difficulty}`,
    `- Representation: ${sample.representation}`,
    "",
    `**Question:** ${sample.stem}`,
    "",
    options,
    "",
    `**Concept:** ${sample.explanation.coreConcept}`,
    "",
    `**Approach:** ${sample.explanation.strategy}`,
    "",
    steps,
    "",
    `**Answer:** ${sample.options[sample.correctIndex]?.value}`,
  ].join("\n");
});

const markdown = [
  "# NUM-CP-011 Hindi/Punjabi Learner Review",
  "",
  "Every permanent authority is sampled three times in both Hindi and Punjabi. Mathematical state and option meaning remain bound to the frozen English source. Downstream delivery gates remain closed.",
  "",
  ...sections,
  "",
].join("\n");

fs.writeFileSync(path.join(outputDir, "review.json"), JSON.stringify(samples, null, 2));
fs.writeFileSync(path.join(outputDir, "review.md"), markdown);
fs.writeFileSync(path.join(outputDir, "audit.json"), JSON.stringify(audit, null, 2));
console.log(JSON.stringify(audit, null, 2));

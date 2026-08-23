import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import {
  NUM_CP010_PERMANENT_ALLOCATION,
  type NumCp010PermanentQlId,
} from "./permanent-allocation.ts";
import { generateNumCp010Permanent } from "./permanent-runtime.ts";

const outputDir = path.resolve("dist/quant-v4/num-cp010-permanent-english-review");
fs.mkdirSync(outputDir, { recursive: true });

// These seeds intentionally hit source indexes 0/1/2 for three-source authorities,
// both indexes for two-source authorities, and still provide three varied samples for singletons.
const reviewSeeds = [31, 62, 93] as const;
const samples = NUM_CP010_PERMANENT_ALLOCATION.flatMap((allocation) => {
  const authoritySamples = reviewSeeds.map((seed) => {
    const item = generateNumCp010Permanent(allocation.qlId as NumCp010PermanentQlId, seed);
    assert.equal(item.lifecycle.reviewStatus, "ENGLISH_FROZEN");
    assert.equal(item.lifecycle.questionStudioDiscoverable, false);
    assert.equal(item.lifecycle.questionBankWritable, false);
    assert.equal(item.lifecycle.testEligible, false);
    assert.equal(item.lifecycle.publiclyPublishable, false);
    return {
      qlId: item.permanentQlId,
      authorityId: item.authorityId,
      authorityLabel: item.authorityLabel,
      prototypeId: item.temporaryPrototypeId,
      seed: item.seed,
      sourceSeed: item.sourceSeed,
      difficulty: item.difficulty,
      answerSemantic: item.answerSemantic,
      sourceAnswerSemantic: item.sourceAnswerSemantic,
      representation: item.representation,
      stem: item.stem,
      options: item.options.map((option, index) => ({
        index,
        value: option.value,
        isCorrect: option.isCorrect,
      })),
      correctIndex: item.correctIndex,
      canonicalAnswer: item.canonicalAnswer,
      explanation: item.explanation,
    };
  });

  assert.deepEqual(
    [...new Set(authoritySamples.map((sample) => sample.prototypeId))].sort(),
    [...allocation.sourcePrototypes].sort(),
    `${allocation.qlId}: permanent review does not cover every approved source prototype`,
  );
  return authoritySamples;
});

const reachedPrototypes = [...new Set(samples.map((sample) => sample.prototypeId))].sort();
assert.equal(reachedPrototypes.length, 26, "Permanent review must reach all 26 approved discovery prototypes");

const audit = {
  status: "PASS_NUM_CP010_PERMANENT_ENGLISH_REVIEW_EXPORT",
  authorities: NUM_CP010_PERMANENT_ALLOCATION.length,
  samplesPerAuthority: reviewSeeds.length,
  questionCount: samples.length,
  prototypeReach: reachedPrototypes.length,
  firstPermanentQl: "NUM-QL-197",
  lastPermanentQl: "NUM-QL-212",
  nextAvailableQl: "NUM-QL-213",
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
};

const sections = samples.map((sample) => {
  const options = sample.options
    .map((option, index) => `${String.fromCharCode(65 + index)}. ${option.value}${option.isCorrect ? "  ← correct" : ""}`)
    .join("\n");
  const steps = sample.explanation.steps.map((step, index) => `${index + 1}. ${step}`).join("\n");
  return [
    `## ${sample.qlId} — ${sample.authorityLabel}`,
    "",
    `- Prototype: ${sample.prototypeId}`,
    `- Seed: ${sample.seed} (source seed ${sample.sourceSeed})`,
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
    `**Answer:** ${sample.explanation.finalAnswer}`,
  ].join("\n");
});

const markdown = [
  "# NUM-CP-010 Permanent English Review",
  "",
  "This artifact samples every approved permanent authority and every approved source prototype after allocation. It is learner-facing review evidence only; Question Studio and all downstream delivery gates remain closed.",
  "",
  ...sections,
  "",
].join("\n");

fs.writeFileSync(path.join(outputDir, "review.json"), JSON.stringify(samples, null, 2));
fs.writeFileSync(path.join(outputDir, "review.md"), markdown);
fs.writeFileSync(path.join(outputDir, "audit.json"), JSON.stringify(audit, null, 2));

console.log(JSON.stringify(audit, null, 2));

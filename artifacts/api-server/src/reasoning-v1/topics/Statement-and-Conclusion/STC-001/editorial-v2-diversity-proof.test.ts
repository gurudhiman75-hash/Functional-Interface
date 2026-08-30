import assert from "node:assert/strict";
import { STC_V2_EDITORIAL_AUTHORITIES } from "./editorial-v2-authorities.ts";
import { generateStcV2EditorialQuestion } from "./editorial-v2-generator.ts";
import { canonicalReviewSeedForAuthorityIndex } from "./editorial-v2-scheduler.ts";
import { STC_QL_IDS } from "./types.ts";
import type { StcV2AnswerClass } from "./editorial-v2-types.ts";

const EXPECTED_ANSWER_COUNTS: Readonly<Record<StcV2AnswerClass, number>> = {
  ONLY_I: 2,
  ONLY_II: 2,
  BOTH: 2,
  NEITHER: 2,
};

function tokens(value: string): Set<string> {
  return new Set(value.toLowerCase().match(/[a-z0-9]+/g) ?? []);
}

function jaccard(left: string, right: string): number {
  const a = tokens(left);
  const b = tokens(right);
  const union = new Set([...a, ...b]);
  if (union.size === 0) return 0;
  let intersection = 0;
  for (const token of a) if (b.has(token)) intersection += 1;
  return intersection / union.size;
}

assert.equal(STC_V2_EDITORIAL_AUTHORITIES.length, 48, "V2 must contain 48 editorial authorities");
assert.equal(new Set(STC_V2_EDITORIAL_AUTHORITIES.map((entry) => entry.id)).size, 48, "scenario ids must be unique");
assert.equal(new Set(STC_V2_EDITORIAL_AUTHORITIES.map((entry) => entry.statement)).size, 48, "stems must be unique");

for (const qlId of STC_QL_IDS) {
  const pool = STC_V2_EDITORIAL_AUTHORITIES.filter((entry) => entry.qlId === qlId);
  assert.equal(pool.length, 8, `${qlId} must have exactly eight V2 authorities`);
  assert.equal(new Set(pool.map((entry) => entry.surfaceArchetype)).size, 8, `${qlId} must expose eight different surface archetypes`);

  const answerCounts: Record<StcV2AnswerClass, number> = { ONLY_I: 0, ONLY_II: 0, BOTH: 0, NEITHER: 0 };
  for (const entry of pool) {
    answerCounts[entry.answerClass] += 1;
    assert.ok(entry.statement.length >= 45, `${entry.id} stem is suspiciously thin`);
    assert.ok(!/^Read the statement/i.test(entry.statement), `${entry.id} embeds the repeated instruction prefix`);
    assert.ok(!/which conclusion\(s\)/i.test(entry.statement), `${entry.id} embeds generator boilerplate`);
  }
  assert.deepEqual(answerCounts, EXPECTED_ANSWER_COUNTS, `${qlId} canonical answer classes must be 2/2/2/2`);

  let maxSimilarity = 0;
  for (let i = 0; i < pool.length; i += 1) {
    for (let j = i + 1; j < pool.length; j += 1) {
      maxSimilarity = Math.max(maxSimilarity, jaccard(pool[i]!.statement, pool[j]!.statement));
    }
  }
  assert.ok(maxSimilarity < 0.45, `${qlId} stems are still lexically repetitive; max Jaccard=${maxSimilarity.toFixed(3)}`);

  const generated = pool.map((_, authorityIndex) => {
    const seed = canonicalReviewSeedForAuthorityIndex(qlId, authorityIndex);
    return generateStcV2EditorialQuestion({ qlId, locale: "en-IN", seed });
  });
  assert.equal(new Set(generated.map((question) => question.scenarioId)).size, 8, `${qlId} canonical review seeds must cover all eight authorities`);
  assert.equal(new Set(generated.map((question) => question.surfaceArchetype)).size, 8, `${qlId} canonical review seeds must cover all eight surfaces`);

  for (let index = 0; index < generated.length; index += 1) {
    const question = generated[index]!;
    assert.equal(question.scenarioId, pool[index]!.id);
    assert.equal(question.stem, pool[index]!.statement);
    assert.equal(question.metadata.conclusionsReversed, false);
    assert.equal(question.metadata.antiGamingScheduler, "STC_V2_1_NON_PERIODIC_16_SLOT");
    assert.equal(question.metadata.saturationReady, false);
    assert.equal(question.metadata.repeatedInstructionEmbeddedInStem, false);
    assert.equal(question.metadata.reviewOnly, true);
    assert.equal(question.metadata.questionBankWritable, false);
    assert.equal(question.metadata.testEligible, false);
    assert.equal(question.metadata.mockEligible, false);
    assert.equal(question.metadata.publicEligible, false);
    assert.equal(question.metadata.automaticPublication, false);
  }
}

console.log("PASS_STC_001_V2_1_EDITORIAL_SURFACE_DIVERSITY");

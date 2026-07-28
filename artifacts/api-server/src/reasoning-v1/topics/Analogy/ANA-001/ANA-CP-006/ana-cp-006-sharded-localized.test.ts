import assert from "node:assert/strict";
import { generateClusterAnalogy } from "./generator";
import {
  generateLocalizedClusterAnalogy,
  type ClusterLocale,
} from "./localized-runtime";
import { ANA_CP006_QLS } from "./question-language.en";
import { ANA_CP006_RULES } from "./rule-definitions";

const requestedLocale = process.env.ANA_CP006_LOCALE ?? "hi-IN";
assert.ok(requestedLocale === "hi-IN" || requestedLocale === "pa-IN");
const locale = requestedLocale as ClusterLocale;
const shardCount = Number.parseInt(process.env.ANA_CP006_SHARD_COUNT ?? "1", 10);
const shardIndex = Number.parseInt(process.env.ANA_CP006_SHARD_INDEX ?? "0", 10);
assert.ok(Number.isInteger(shardCount) && shardCount >= 1);
assert.ok(Number.isInteger(shardIndex) && shardIndex >= 0 && shardIndex < shardCount);

const selectedRules = ANA_CP006_RULES.filter((_, familyIndex) => familyIndex % shardCount === shardIndex);
const selectedRuleIds = new Set(selectedRules.map((rule) => rule.id));
const selectedQls = ANA_CP006_QLS.filter((ql) => selectedRuleIds.has(ql.ruleId));
assert.ok(selectedQls.length > 0, `CP-006 localized shard ${shardIndex}/${shardCount} selected no QLs.`);

const answerPositions = [0, 0, 0, 0];
const layouts = new Set<string>();
const difficulties = new Set<string>();
const ruleCoverage = new Set<string>();
let generatedCount = 0;

for (const ql of selectedQls) {
  for (let seed = 0; seed < 20; seed += 1) {
    const english = generateClusterAnalogy(ql.qlId, seed);
    const localized = generateLocalizedClusterAnalogy(ql.qlId, locale, seed);
    const repeat = generateLocalizedClusterAnalogy(ql.qlId, locale, seed);
    assert.deepEqual(repeat, localized, `${locale} ${ql.qlId} seed ${seed} is not deterministic.`);
    generatedCount += 1;

    assert.equal(localized.locale, locale);
    assert.equal(localized.checkpointId, english.checkpointId);
    assert.equal(localized.qlId, english.qlId);
    assert.equal(localized.ruleId, english.ruleId);
    assert.equal(localized.presentationMode, english.presentationMode);
    assert.deepEqual(localized.context, english.context);
    assert.deepEqual(localized.source, english.source);
    assert.deepEqual(localized.target, english.target);
    assert.deepEqual(localized.options, english.options);
    assert.equal(localized.correctIndex, english.correctIndex);
    assert.equal(localized.difficulty, english.difficulty);
    assert.equal(localized.difficultyScore, english.difficultyScore);
    assert.equal(localized.layout, english.layout);
    assert.deepEqual(localized.metadata, english.metadata);

    assert.ok(localized.stem.length > 4);
    assert.ok(localized.explanation.ruleStatement.length > 15);
    assert.ok(localized.explanation.sourceDemonstration.includes(localized.source.left));
    assert.ok(localized.explanation.sourceDemonstration.includes(localized.source.right));
    assert.ok(localized.explanation.targetApplication.includes(localized.target.left));
    assert.ok(localized.explanation.targetApplication.includes(localized.target.right));
    assert.ok(localized.explanation.closestTrapRejection.length > 20);
    assert.ok(!JSON.stringify(localized.explanation).includes("CLUSTER_"));

    if (locale === "hi-IN") {
      assert.ok(/[\u0900-\u097F]/.test(localized.explanation.ruleStatement));
      assert.ok(/[\u0900-\u097F]/.test(localized.explanation.sourceDemonstration));
      assert.ok(/[\u0900-\u097F]/.test(localized.explanation.targetApplication));
      assert.ok(/[\u0900-\u097F]/.test(localized.explanation.closestTrapRejection));
      assert.ok(!localized.stem.includes("Select the"));
      assert.ok(!localized.stem.includes("Complete the"));
    } else {
      assert.ok(/[\u0A00-\u0A7F]/.test(localized.explanation.ruleStatement));
      assert.ok(/[\u0A00-\u0A7F]/.test(localized.explanation.sourceDemonstration));
      assert.ok(/[\u0A00-\u0A7F]/.test(localized.explanation.targetApplication));
      assert.ok(/[\u0A00-\u0A7F]/.test(localized.explanation.closestTrapRejection));
      assert.ok(!localized.stem.includes("Select the"));
      assert.ok(!localized.stem.includes("Complete the"));
      assert.ok(!localized.stem.includes("ਪਦ"));
      assert.ok(!JSON.stringify(localized.explanation).includes("ਪਦ"));
    }

    layouts.add(localized.layout);
    difficulties.add(localized.difficulty);
    ruleCoverage.add(localized.ruleId);
    answerPositions[localized.correctIndex] += 1;
  }
}

assert.equal(generatedCount, selectedQls.length * 20);
assert.deepEqual([...layouts].sort(), ["ARROW", "BOXED_PAIRS", "INLINE", "TWO_ROW_TABLE"]);
assert.ok(difficulties.has("HARD"));
assert.ok(difficulties.size >= 2);
assert.deepEqual([...ruleCoverage].sort(), [...selectedRuleIds].sort());
assert.deepEqual(answerPositions, Array(4).fill(generatedCount / 4));

console.log("ANA-CP-006 sharded localized runtime audit passed.", {
  locale,
  shardIndex,
  shardCount,
  qlCount: selectedQls.length,
  generatedCount,
  ruleCount: ruleCoverage.size,
  layouts: [...layouts],
  difficulties: [...difficulties],
  answerPositions,
});

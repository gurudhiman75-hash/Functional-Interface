import assert from "node:assert/strict";
import { checkClusterAmbiguity } from "./ambiguity-checker";
import { generateClusterAnalogy } from "./generator";
import {
  independentlyApplyClusterRule,
  matchingClusterRules,
  solveClusterRule,
} from "./independent-solver";
import { ANA_CP006_QLS } from "./question-language.en";
import { ANA_CP006_RULES } from "./rule-definitions";

const shardCount = Number.parseInt(process.env.ANA_CP006_SHARD_COUNT ?? "1", 10);
const shardIndex = Number.parseInt(process.env.ANA_CP006_SHARD_INDEX ?? "0", 10);
assert.ok(Number.isInteger(shardCount) && shardCount >= 1);
assert.ok(Number.isInteger(shardIndex) && shardIndex >= 0 && shardIndex < shardCount);

const selectedRules = ANA_CP006_RULES.filter((_, familyIndex) => familyIndex % shardCount === shardIndex);
const selectedRuleIds = new Set(selectedRules.map((rule) => rule.id));
const selectedQls = ANA_CP006_QLS.filter((ql) => selectedRuleIds.has(ql.ruleId));
assert.ok(selectedQls.length > 0, `CP-006 shard ${shardIndex}/${shardCount} selected no QLs.`);

const answerPositions = [0, 0, 0, 0];
const layouts = new Set<string>();
const difficulties = new Set<string>();
const ruleCoverage = new Set<string>();
const stemsByQl = new Map<string, Set<string>>();
let generatedCount = 0;

for (const ql of selectedQls) {
  const stems = new Set<string>();
  stemsByQl.set(ql.qlId, stems);
  for (let seed = 0; seed < 40; seed += 1) {
    const generated = generateClusterAnalogy(ql.qlId, seed);
    const repeat = generateClusterAnalogy(ql.qlId, seed);
    assert.deepEqual(repeat, generated, `${ql.qlId} seed ${seed} is not deterministic.`);

    generatedCount += 1;
    stems.add(generated.stem);
    layouts.add(generated.layout);
    difficulties.add(generated.difficulty);
    ruleCoverage.add(generated.ruleId);
    answerPositions[generated.correctIndex] += 1;

    assert.equal(generated.checkpointId, "ANA-CP-006");
    assert.equal(generated.qlId, ql.qlId);
    assert.equal(generated.ruleId, ql.ruleId);
    assert.equal(generated.options.length, 4);
    assert.equal(new Set(generated.options.map((option) => JSON.stringify(option.value))).size, 4);
    assert.equal(generated.options.filter((option) => option.errorLabel === null).length, 1);
    assert.ok(generated.correctIndex >= 0 && generated.correctIndex < 4);
    assert.equal(generated.metadata.ambiguityAccepted, true);
    assert.equal(generated.metadata.publiclyPublishable, false);
    assert.equal(generated.metadata.maturity, "RUNTIME_PROOF");

    assert.equal(
      solveClusterRule(generated.ruleId, generated.context, generated.source.left),
      generated.source.right,
    );
    assert.equal(
      solveClusterRule(generated.ruleId, generated.context, generated.target.left),
      generated.target.right,
    );
    assert.equal(
      checkClusterAmbiguity(generated.ruleId, generated.context, [generated.source, generated.target]).accepted,
      true,
    );
    assert.ok(
      matchingClusterRules([generated.source, generated.target]).some((match) => match.ruleId === generated.ruleId),
    );

    if (generated.ruleId === "CLUSTER_FIRST_LAST_SWAP") {
      assert.ok(generated.source.left.length >= 4);
    }
    if (generated.ruleId === "CLUSTER_DELETE_POSITION") {
      assert.equal(generated.source.right.length, generated.source.left.length - 1);
      assert.equal(generated.target.right.length, generated.target.left.length - 1);
    } else if (generated.ruleId === "CLUSTER_INSERT_DERIVED_LETTER") {
      assert.equal(generated.source.right.length, generated.source.left.length + 1);
      assert.equal(generated.target.right.length, generated.target.left.length + 1);
    } else if (generated.ruleId === "CLUSTER_NEIGHBOUR_EXPANSION") {
      assert.equal(generated.source.right.length, generated.source.left.length * 2);
      assert.equal(generated.target.right.length, generated.target.left.length * 2);
    } else {
      assert.equal(generated.source.right.length, generated.source.left.length);
      assert.equal(generated.target.right.length, generated.target.left.length);
    }

    if (generated.presentationMode === "DIRECT_COMPLETION") {
      assert.ok(generated.options.every((option) => typeof option.value === "string"));
      assert.equal(generated.options[generated.correctIndex].value, generated.target.right);
    } else {
      assert.ok(generated.options.every((option) => Array.isArray(option.value)));
      assert.deepEqual(generated.options[generated.correctIndex].value, [generated.target.left, generated.target.right]);
      for (const [index, option] of generated.options.entries()) {
        const [left, right] = option.value as readonly [string, string];
        assert.equal(
          independentlyApplyClusterRule(generated.ruleId, generated.context, left) === right,
          index === generated.correctIndex,
        );
      }
    }

    assert.ok(generated.explanation.ruleStatement.length > 20);
    assert.ok(generated.explanation.sourceDemonstration.includes(generated.source.left));
    assert.ok(generated.explanation.sourceDemonstration.includes(generated.source.right));
    assert.ok(generated.explanation.targetApplication.includes(generated.target.left));
    assert.ok(generated.explanation.targetApplication.includes(generated.target.right));
    assert.ok(generated.explanation.closestTrapRejection.length > 25);
    assert.ok(!JSON.stringify(generated.explanation).includes("CLUSTER_"));
  }
  assert.ok(stems.size >= 20, `${ql.qlId} has insufficient visible stem variety: ${stems.size}`);
}

assert.equal(generatedCount, selectedQls.length * 40);
assert.deepEqual([...layouts].sort(), ["ARROW", "BOXED_PAIRS", "INLINE", "TWO_ROW_TABLE"]);
assert.ok(difficulties.has("HARD"));
assert.ok(difficulties.size >= 2);
assert.deepEqual([...ruleCoverage].sort(), [...selectedRuleIds].sort());
assert.deepEqual(answerPositions, Array(4).fill(generatedCount / 4));

console.log("ANA-CP-006 sharded English runtime audit passed.", {
  shardIndex,
  shardCount,
  qlCount: selectedQls.length,
  generatedCount,
  ruleCount: ruleCoverage.size,
  layouts: [...layouts],
  difficulties: [...difficulties],
  answerPositions,
  minimumStemVariety: Math.min(...[...stemsByQl.values()].map((stems) => stems.size)),
});

import assert from "node:assert/strict";
import { checkClusterAmbiguity } from "./ambiguity-checker";
import { generateClusterAnalogy } from "./generator";
import {
  independentlyApplyClusterRule,
  matchingClusterRules,
  solveClusterRule,
} from "./independent-solver";
import { ANA_CP006_QLS } from "./question-language.en";
import {
  ANA_CP006_RULES,
  type ClusterRuleContext,
} from "./rule-definitions";

const EXPECTED_RULE_IDS = [
  "CLUSTER_UNIFORM_SHIFT_FORWARD",
  "CLUSTER_UNIFORM_SHIFT_BACKWARD",
  "CLUSTER_POSITIONAL_FIXED_SHIFTS",
  "CLUSTER_ALTERNATING_SIGN_SHIFT",
  "CLUSTER_INCREASING_SHIFT",
  "CLUSTER_DECREASING_SHIFT",
  "CLUSTER_REVERSE",
  "CLUSTER_ADJACENT_PAIR_SWAP",
  "CLUSTER_FIRST_LAST_SWAP",
  "CLUSTER_ROTATE_LEFT",
  "CLUSTER_ROTATE_RIGHT",
  "CLUSTER_OPPOSITE_SUBSTITUTION",
  "CLUSTER_ODD_POSITION_TRANSFORM",
  "CLUSTER_EVEN_POSITION_TRANSFORM",
  "CLUSTER_REVERSE_THEN_SHIFT",
  "CLUSTER_SHIFT_THEN_REVERSE",
  "CLUSTER_DELETE_POSITION",
  "CLUSTER_INSERT_DERIVED_LETTER",
  "CLUSTER_NEIGHBOUR_EXPANSION",
  "CLUSTER_TWO_STAGE_MIXED",
  "CLUSTER_HALF_BLOCK_SWAP",
  "CLUSTER_REVERSE_EACH_BLOCK",
  "CLUSTER_PARITY_REGROUP",
  "CLUSTER_ALPHABETICAL_SORT",
] as const;

assert.equal(ANA_CP006_QLS.length, 48);
assert.equal(new Set(ANA_CP006_QLS.map((ql) => ql.qlId)).size, 48);
assert.deepEqual(
  ANA_CP006_QLS.map((ql) => ql.qlId),
  Array.from({ length: 48 }, (_, index) => `ANA-QL-${String(161 + index).padStart(3, "0")}`),
);
assert.deepEqual(ANA_CP006_RULES.map((rule) => rule.id), EXPECTED_RULE_IDS);
assert.equal(ANA_CP006_RULES.length, 24);
assert.ok(ANA_CP006_QLS.every((ql) => ql.taskKind === "letterClusterTransform"));
assert.ok(ANA_CP006_QLS.every((ql) => ql.solveMode === "CLUSTER_RULE"));
assert.ok(ANA_CP006_QLS.every((ql) => ql.renderer === "STRUCTURED_TEXT"));
assert.ok(ANA_CP006_QLS.every((ql) => ql.localeMode === "TRANSLATABLE"));
assert.deepEqual(
  ANA_CP006_QLS.filter((_, index) => index % 2 === 0).map((ql) => ql.presentationMode),
  Array(24).fill("DIRECT_COMPLETION"),
);
assert.deepEqual(
  ANA_CP006_QLS.filter((_, index) => index % 2 === 1).map((ql) => ql.presentationMode),
  Array(24).fill("PAIR_SELECTION"),
);

// Source-backed structural fixtures.
assert.equal(
  independentlyApplyClusterRule("CLUSTER_ADJACENT_PAIR_SWAP", { kind: "FIXED" }, "JAUNDICE"),
  "AJNUIDEC",
);
assert.equal(
  independentlyApplyClusterRule("CLUSTER_ADJACENT_PAIR_SWAP", { kind: "FIXED" }, "TRAMPOLINE"),
  "RTMAOPILEN",
);
assert.equal(
  independentlyApplyClusterRule("CLUSTER_HALF_BLOCK_SWAP", { kind: "FIXED" }, "GLIDERS"),
  "ERSDGLI",
);
assert.equal(
  independentlyApplyClusterRule("CLUSTER_REVERSE_EACH_BLOCK", { kind: "FIXED" }, "ACTION"),
  "TCANOI",
);
assert.equal(
  independentlyApplyClusterRule("CLUSTER_REVERSE_EACH_BLOCK", { kind: "FIXED" }, "THUNDER"),
  "UHTNRED",
);
assert.equal(
  independentlyApplyClusterRule("CLUSTER_REVERSE_EACH_BLOCK", { kind: "FIXED" }, "ABSORPTION"),
  "ROSBANOITP",
);
assert.equal(
  independentlyApplyClusterRule(
    "CLUSTER_PARITY_REGROUP",
    { kind: "PARITY_REGROUP", profile: "EVEN_FORWARD_ODD_REVERSE" },
    "NUMERAL",
  ),
  "UEALRMN",
);
assert.equal(
  independentlyApplyClusterRule(
    "CLUSTER_ALPHABETICAL_SORT",
    { kind: "ALPHABETICAL_SORT", direction: "ASC" },
    "INTEX",
  ),
  "EINTX",
);
assert.equal(
  independentlyApplyClusterRule(
    "CLUSTER_ALPHABETICAL_SORT",
    { kind: "ALPHABETICAL_SORT", direction: "ASC" },
    "FLORA",
  ),
  "AFLOR",
);

const orderedVector: ClusterRuleContext = { kind: "ORDERED_POSITION_VECTOR", shifts: [1, 3, -2, 4] };
assert.notEqual(
  independentlyApplyClusterRule("CLUSTER_REVERSE_THEN_SHIFT", orderedVector, "ABCD"),
  independentlyApplyClusterRule("CLUSTER_SHIFT_THEN_REVERSE", orderedVector, "ABCD"),
  "Reverse-then-shift and shift-then-reverse must remain operationally distinct.",
);

// Registry-level fingerprint audit. It compares different rule families over a
// representative probe corpus and rejects complete shared-domain collisions.
const PROBE_BASES = [
  "QAZWSXED",
  "MNBVCXZL",
  "PLMOKNIJ",
  "HGFDSAQW",
  "ZXCVBNMA",
  "RFVTGBYH",
  "IKOLPMJU",
  "WSXEDCRF",
  "UJMIKOLP",
  "TGBYHNUJ",
  "EDCRFVTG",
  "OKMNIJBU",
] as const;

for (let firstIndex = 0; firstIndex < ANA_CP006_RULES.length; firstIndex += 1) {
  const firstRule = ANA_CP006_RULES[firstIndex];
  for (let secondIndex = firstIndex + 1; secondIndex < ANA_CP006_RULES.length; secondIndex += 1) {
    const secondRule = ANA_CP006_RULES[secondIndex];
    const sharedLengths = firstRule.supportedLengths.filter((length) => secondRule.supportedLengths.includes(length));
    for (const length of sharedLengths.filter((value) => value >= 4)) {
      const probes = PROBE_BASES.map((base) => base.slice(0, length));
      for (const firstContext of firstRule.contextsForLength(length)) {
        for (const secondContext of secondRule.contextsForLength(length)) {
          const sharedOutputs = probes
            .map((probe) => ({
              first: independentlyApplyClusterRule(firstRule.id, firstContext, probe),
              second: independentlyApplyClusterRule(secondRule.id, secondContext, probe),
            }))
            .filter((entry) => entry.first !== null && entry.second !== null);
          if (sharedOutputs.length < 5) continue;
          const identical = sharedOutputs.every((entry) => entry.first === entry.second);
          assert.equal(
            identical,
            false,
            `Complete fingerprint collision: ${firstRule.id} and ${secondRule.id} at length ${length}`,
          );
        }
      }
    }
  }
}

const answerPositions = [0, 0, 0, 0];
const layouts = new Set<string>();
const difficulties = new Set<string>();
const ruleCoverage = new Set<string>();
const stemsByQl = new Map<string, Set<string>>();
const difficultyCounts = { EASY: 0, MEDIUM: 0, HARD: 0 };
let generatedCount = 0;

for (const ql of ANA_CP006_QLS) {
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
    difficultyCounts[generated.difficulty] += 1;
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

    const solvedSource = solveClusterRule(generated.ruleId, generated.context, generated.source.left);
    const solvedTarget = solveClusterRule(generated.ruleId, generated.context, generated.target.left);
    assert.equal(solvedSource, generated.source.right);
    assert.equal(solvedTarget, generated.target.right);
    assert.equal(
      checkClusterAmbiguity(generated.ruleId, generated.context, [generated.source, generated.target]).accepted,
      true,
    );
    assert.ok(matchingClusterRules([generated.source, generated.target]).some((match) => match.ruleId === generated.ruleId));

    if (generated.ruleId === "CLUSTER_FIRST_LAST_SWAP") {
      assert.ok(generated.source.left.length >= 4, "Three-letter first/last swap collapses to whole reversal.");
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

assert.equal(generatedCount, 48 * 40);
assert.deepEqual([...layouts].sort(), ["ARROW", "BOXED_PAIRS", "INLINE", "TWO_ROW_TABLE"]);
assert.deepEqual([...difficulties].sort(), ["EASY", "HARD", "MEDIUM"]);
assert.deepEqual([...ruleCoverage].sort(), [...EXPECTED_RULE_IDS].sort());
assert.deepEqual(answerPositions, [480, 480, 480, 480]);
assert.ok(Object.values(difficultyCounts).every((count) => count > generatedCount * 0.05));

console.log("ANA-CP-006 English runtime audit passed.", {
  generatedCount,
  ruleCount: ruleCoverage.size,
  layouts: [...layouts],
  difficulties: difficultyCounts,
  answerPositions,
  minimumStemVariety: Math.min(...[...stemsByQl.values()].map((stems) => stems.size)),
});

import assert from "node:assert/strict";
import { independentlyApplyClusterRule } from "./independent-solver";
import { ANA_CP006_QLS } from "./question-language.en";
import { ANA_CP006_RULES, type ClusterRuleContext } from "./rule-definitions";

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
          assert.equal(
            sharedOutputs.every((entry) => entry.first === entry.second),
            false,
            `Complete fingerprint collision: ${firstRule.id} and ${secondRule.id} at length ${length}`,
          );
        }
      }
    }
  }
}

console.log("ANA-CP-006 structural and fingerprint audit passed.", {
  qlCount: ANA_CP006_QLS.length,
  ruleCount: ANA_CP006_RULES.length,
});

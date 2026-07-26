import assert from "node:assert/strict";
import {
  ANA_CP008_PROVISIONAL_RULES,
  provisionalMixedContextKey,
  type ProvisionalMixedRuleId,
} from "./provisional-rule-definitions";

interface MisconceptionContract {
  dominantErrors: readonly [string, string, string, ...string[]];
  explanationCheckpoints: readonly [string, string, ...string[]];
  prohibitedShortcuts: readonly [string, ...string[]];
}

const OWNERSHIP: Readonly<Record<ProvisionalMixedRuleId, MisconceptionContract>> = {
  MIXED_LETTER_GROUP_SCALAR_AGGREGATE: {
    dominantErrors: ["wrong aggregate", "A=0 indexing", "omit one letter"],
    explanationCheckpoints: ["show ordinary positions", "apply declared aggregate"],
    prohibitedShortcuts: ["unrelated nearby integer"],
  },
  MIXED_LETTER_GROUP_DERIVED_LETTER: {
    dominantErrors: ["stop at scalar", "unauthorised modulo", "A=0 indexing"],
    explanationCheckpoints: ["sum positions", "map 1..26 back to a letter"],
    prohibitedShortcuts: ["wrapped output"],
  },
  MIXED_SINGLE_LETTER_POSITION_POWER: {
    dominantErrors: ["return position", "double position", "wrong exponent"],
    explanationCheckpoints: ["identify ordinary position", "apply declared power"],
    prohibitedShortcuts: ["unlinked perfect square"],
  },
  MIXED_TOKEN_INDEPENDENT_TRANSFORM: {
    dominantErrors: ["shared delta assumption", "reverse one sign", "change one component only"],
    explanationCheckpoints: ["derive letter shift", "derive numeric operation independently"],
    prohibitedShortcuts: ["shared-delta alternative"],
  },
  MIXED_CLUSTER_NUMBER_SHARED_DELTA: {
    dominantErrors: ["number-only change", "different letter shifts", "reverse one component"],
    explanationCheckpoints: ["state one common signed delta", "apply it to every component"],
    prohibitedShortcuts: ["independent-vector alternative"],
  },
  MIXED_CLUSTER_NUMBER_INDEPENDENT_VECTOR: {
    dominantErrors: ["force common shift", "swap positional shifts", "reverse numeric delta"],
    explanationCheckpoints: ["derive each letter shift", "derive numeric delta"],
    prohibitedShortcuts: ["shared-delta or multiplier alternative"],
  },
  MIXED_CLUSTER_NUMBER_VECTOR_MULTIPLIER: {
    dominantErrors: ["add factor", "invert fraction", "round non-integral result"],
    explanationCheckpoints: ["apply letter vector", "multiply exactly and prove integrality"],
    prohibitedShortcuts: ["rounded rational result"],
  },
  MIXED_CLUSTER_NUMBER_VECTOR_POWER: {
    dominantErrors: ["wrong power", "root instead of power", "skip square recognition"],
    explanationCheckpoints: ["apply letter vector", "perform declared power sequence"],
    prohibitedShortcuts: ["non-domain source"],
  },
  MIXED_CLUSTER_NUMBER_VECTOR_ROOT: {
    dominantErrors: ["root without successor", "approximate root", "apply direct power"],
    explanationCheckpoints: ["add one", "prove exact root before applying vector"],
    prohibitedShortcuts: ["rounded root"],
  },
  MIXED_NUMBER_CLUSTER_VECTOR_MULTIPLIER: {
    dominantErrors: ["reorder token", "add instead of multiply", "round rational output"],
    explanationCheckpoints: ["preserve number-first order", "apply exact multiplier and vector"],
    prohibitedShortcuts: ["cluster-first rendering"],
  },
  MIXED_NUMBER_CLUSTER_VECTOR_ROOT: {
    dominantErrors: ["reorder token", "root without successor", "approximate root"],
    explanationCheckpoints: ["preserve number-first order", "prove exact successor root"],
    prohibitedShortcuts: ["cluster-first or rounded output"],
  },
  MIXED_NUMBER_LETTER_DIGIT_SQUARE_SUCCESSOR: {
    dominantErrors: ["independent letter shift", "square whole number", "reuse input digit sum"],
    explanationCheckpoints: ["verify input invariant", "increment and recompute digit-sum square"],
    prohibitedShortcuts: ["stale input-derived letter"],
  },
};

const ruleIds = ANA_CP008_PROVISIONAL_RULES.map((rule) => rule.id);
assert.equal(new Set(ruleIds).size, ruleIds.length, "Duplicate provisional rule IDs.");
assert.deepEqual(
  [...Object.keys(OWNERSHIP)].sort(),
  [...ruleIds].sort(),
  "Every provisional rule ID must have exactly one misconception contract.",
);

const contextKeys = new Set<string>();
for (const rule of ANA_CP008_PROVISIONAL_RULES) {
  const ownership = OWNERSHIP[rule.id];
  assert.ok(ownership.dominantErrors.length >= 3, `${rule.id} needs at least three dominant errors.`);
  assert.ok(ownership.explanationCheckpoints.length >= 2, `${rule.id} needs at least two explanation checkpoints.`);
  assert.ok(ownership.prohibitedShortcuts.length >= 1, `${rule.id} needs a prohibited shortcut.`);

  for (const context of rule.contexts) {
    const key = `${rule.id}::${provisionalMixedContextKey(context)}`;
    assert.ok(!contextKeys.has(key), `Duplicate rule/context ownership key: ${key}`);
    contextKeys.add(key);
  }
}

assert.equal(contextKeys.size, 81, "Misconception ownership must cover all 81 proven contexts.");

console.log("ANA-CP-008 misconception ownership audit passed.", {
  ruleIds: ruleIds.length,
  contexts: contextKeys.size,
  dominantErrorLabels: Object.values(OWNERSHIP)
    .reduce((sum, contract) => sum + contract.dominantErrors.length, 0),
});

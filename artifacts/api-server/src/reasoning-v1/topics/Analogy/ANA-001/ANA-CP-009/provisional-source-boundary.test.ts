import assert from "node:assert/strict";
import { ANA_CP009_PROVISIONAL_SOURCE_FIXTURES } from "./provisional-source-boundary";

assert.equal(ANA_CP009_PROVISIONAL_SOURCE_FIXTURES.length, 5);
assert.equal(
  new Set(ANA_CP009_PROVISIONAL_SOURCE_FIXTURES.map((fixture) => fixture.fixtureId)).size,
  ANA_CP009_PROVISIONAL_SOURCE_FIXTURES.length,
);
assert.ok(ANA_CP009_PROVISIONAL_SOURCE_FIXTURES.every((fixture) => fixture.qlIds.length === 0));
assert.ok(ANA_CP009_PROVISIONAL_SOURCE_FIXTURES.every((fixture) => fixture.sourcePairs.length >= 2));
assert.ok(ANA_CP009_PROVISIONAL_SOURCE_FIXTURES.every((fixture) => fixture.answer.length > 0));
assert.ok(ANA_CP009_PROVISIONAL_SOURCE_FIXTURES.every((fixture) => fixture.ruleSummary.length >= 60));

const quarantinedOptionDependent = ANA_CP009_PROVISIONAL_SOURCE_FIXTURES.filter(
  (fixture) => fixture.verdict === "QUARANTINE_OPTION_DEPENDENT_META_RULE",
);
const quarantinedAmbiguous = ANA_CP009_PROVISIONAL_SOURCE_FIXTURES.filter(
  (fixture) => fixture.verdict === "QUARANTINE_AMBIGUOUS_FIXTURE",
);
const delegated = ANA_CP009_PROVISIONAL_SOURCE_FIXTURES.filter(
  (fixture) => fixture.verdict === "DELEGATE_CP008",
);
const inversePending = ANA_CP009_PROVISIONAL_SOURCE_FIXTURES.filter(
  (fixture) => fixture.verdict === "PRESENTATION_AUDIT_PENDING",
);

assert.equal(quarantinedOptionDependent.length, 1);
assert.equal(quarantinedAmbiguous.length, 1);
assert.equal(delegated.length, 2);
assert.equal(inversePending.length, 1);
assert.ok(quarantinedOptionDependent.every((fixture) => fixture.crossPairDependency));
assert.ok(quarantinedAmbiguous.every((fixture) => fixture.crossPairDependency));
assert.ok(delegated.every((fixture) => !fixture.crossPairDependency));
assert.ok(inversePending.every((fixture) => !fixture.crossPairDependency));

const ids = ANA_CP009_PROVISIONAL_SOURCE_FIXTURES.map((fixture) =>
  Number(fixture.fixtureId.slice(-3)),
);
assert.deepEqual(ids, [1, 2, 3, 4, 5]);

console.log("ANA-CP-009 provisional source-boundary audit passed.", {
  fixtures: ANA_CP009_PROVISIONAL_SOURCE_FIXTURES.length,
  quarantinedOptionDependentMetaRules: quarantinedOptionDependent.length,
  quarantinedAmbiguousFixtures: quarantinedAmbiguous.length,
  delegatedToCp008: delegated.length,
  inversePresentationPending: inversePending.length,
  permanentQlIdsAssigned: 0,
});

import assert from "node:assert/strict";
import {
  assertMixedTokenRoundTrip,
  clusterNumberToken,
  letterGroupToken,
  letterNumberToken,
  letterToken,
  mixedTokenKey,
  numberToken,
  parseMixedTokenForReview,
  renderMixedToken,
  sameMixedToken,
  type MixedToken,
} from "./mixed-token";

const fixtures: readonly MixedToken[] = [
  letterToken("a"),
  letterGroupToken("ab"),
  letterGroupToken("ZKX"),
  numberToken(27),
  letterNumberToken("p", 21),
  clusterNumberToken("zKx", 102),
];

for (const fixture of fixtures) {
  assertMixedTokenRoundTrip(fixture);
  assert.ok(sameMixedToken(parseMixedTokenForReview(renderMixedToken(fixture)), fixture));
}

assert.deepEqual(parseMixedTokenForReview("A"), { kind: "LETTER", letter: "A" });
assert.deepEqual(parseMixedTokenForReview("AB"), { kind: "LETTER_GROUP", letters: "AB" });
assert.deepEqual(parseMixedTokenForReview("27"), { kind: "NUMBER", number: 27 });
assert.deepEqual(parseMixedTokenForReview("P21"), { kind: "LETTER_NUMBER", letter: "P", number: 21 });
assert.deepEqual(parseMixedTokenForReview("ZKX102"), {
  kind: "CLUSTER_NUMBER",
  letters: "ZKX",
  number: 102,
});

assert.equal(new Set(fixtures.map(mixedTokenKey)).size, fixtures.length);
assert.throws(() => parseMixedTokenForReview("A021"));
assert.throws(() => parseMixedTokenForReview("A0"));
assert.throws(() => parseMixedTokenForReview("12345"));
assert.throws(() => parseMixedTokenForReview("A-21"));
assert.throws(() => letterGroupToken("A"));
assert.throws(() => letterNumberToken("AB", 21));
assert.throws(() => clusterNumberToken("ABCDEFG", 21));
assert.throws(() => numberToken(0));

console.log("ANA-CP-008 mixed-token foundation audit passed.", {
  fixtures: fixtures.length,
  rendered: fixtures.map(renderMixedToken),
});

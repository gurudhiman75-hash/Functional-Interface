import assert from "node:assert/strict";
import {
  independentlyApplyProvisionalMixedRule,
  matchingProvisionalMixedRules,
  type ProvisionalMixedEvidence,
} from "./provisional-independent-solver";
import {
  clusterNumberToken,
  letterGroupToken,
  letterNumberToken,
  letterToken,
  numberLetterToken,
  numberToken,
  sameMixedToken,
} from "./foundation/mixed-token";
import {
  provisionalMixedRuleById,
  type ProvisionalMixedContext,
  type ProvisionalMixedRuleId,
} from "./provisional-rule-definitions";

interface SourceFixture {
  source: string;
  ruleId: ProvisionalMixedRuleId;
  context: ProvisionalMixedContext;
  evidence: readonly ProvisionalMixedEvidence[];
}

const fixtures: readonly SourceFixture[] = [
  {
    source: "Oliveboard railway analogy practice, July 2026: AB : 2 :: CD : ?",
    ruleId: "MIXED_LETTER_GROUP_SCALAR_AGGREGATE",
    context: { kind: "LETTER_GROUP_SCALAR", aggregate: "PRODUCT" },
    evidence: [
      { input: letterGroupToken("AB"), output: numberToken(2) },
      { input: letterGroupToken("CD"), output: numberToken(12) },
    ],
  },
  {
    source: "Oliveboard railway analogy practice, July 2026: ZA : 27 :: YB : ?",
    ruleId: "MIXED_LETTER_GROUP_SCALAR_AGGREGATE",
    context: { kind: "LETTER_GROUP_SCALAR", aggregate: "SUM" },
    evidence: [
      { input: letterGroupToken("ZA"), output: numberToken(27) },
      { input: letterGroupToken("YB"), output: numberToken(27) },
    ],
  },
  {
    source: "Oliveboard railway analogy example: AE : F :: CG : ?",
    ruleId: "MIXED_LETTER_GROUP_DERIVED_LETTER",
    context: { kind: "LETTER_GROUP_TO_LETTER", aggregate: "SUM" },
    evidence: [
      { input: letterGroupToken("AE"), output: letterToken("F") },
      { input: letterGroupToken("CG"), output: letterToken("J") },
    ],
  },
  {
    source: "Testbook mixed analogy: P21 : J28 :: G19 : A26",
    ruleId: "MIXED_TOKEN_INDEPENDENT_TRANSFORM",
    context: {
      kind: "INDEPENDENT_LETTER_NUMBER",
      letterShift: -6,
      numberOperation: "ADD",
      numberAmount: 7,
    },
    evidence: [
      { input: letterNumberToken("P", 21), output: letterNumberToken("J", 28) },
      { input: letterNumberToken("G", 19), output: letterNumberToken("A", 26) },
    ],
  },
  {
    source: "Testbook analogy notes: PL36 : UQ41 :: MI49 : RN54",
    ruleId: "MIXED_CLUSTER_NUMBER_SHARED_DELTA",
    context: { kind: "CLUSTER_NUMBER_SHARED_DELTA", delta: 5 },
    evidence: [
      { input: clusterNumberToken("PL", 36), output: clusterNumberToken("UQ", 41) },
      { input: clusterNumberToken("MI", 49), output: clusterNumberToken("RN", 54) },
    ],
  },
  {
    source: "Testbook analogy notes: 21I : 22P :: 13P : 14Y",
    ruleId: "MIXED_NUMBER_LETTER_DIGIT_SQUARE_SUCCESSOR",
    context: { kind: "NUMBER_LETTER_DIGIT_SQUARE_SUCCESSOR", numberStep: 1 },
    evidence: [
      { input: numberLetterToken(21, "I"), output: numberLetterToken(22, "P") },
      { input: numberLetterToken(13, "P"), output: numberLetterToken(14, "Y") },
    ],
  },
];

for (const fixture of fixtures) {
  const rule = provisionalMixedRuleById(fixture.ruleId);
  for (const evidence of fixture.evidence) {
    assert.ok(rule.accepts(evidence.input, fixture.context), `${fixture.source} is outside generator eligibility.`);
    assert.ok(sameMixedToken(rule.apply(evidence.input, fixture.context), evidence.output));
    assert.ok(sameMixedToken(
      independentlyApplyProvisionalMixedRule(fixture.ruleId, fixture.context, evidence.input),
      evidence.output,
    ));
  }
  const matches = matchingProvisionalMixedRules(fixture.evidence);
  assert.ok(matches.some((match) => match.ruleId === fixture.ruleId));
}

console.log("ANA-CP-008 source fixture audit passed.", {
  fixtureCount: fixtures.length,
  evidencePairs: fixtures.reduce((sum, fixture) => sum + fixture.evidence.length, 0),
});

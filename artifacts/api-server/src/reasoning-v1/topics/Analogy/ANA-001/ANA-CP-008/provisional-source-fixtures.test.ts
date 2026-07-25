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
  provisionalMixedContextKey,
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
    source: "Oliveboard railway analogy: AB : 2 :: CD : 12",
    ruleId: "MIXED_LETTER_GROUP_SCALAR_AGGREGATE",
    context: { kind: "LETTER_GROUP_SCALAR", aggregate: "PRODUCT" },
    evidence: [
      { input: letterGroupToken("AB"), output: numberToken(2) },
      { input: letterGroupToken("CD"), output: numberToken(12) },
    ],
  },
  {
    source: "Oliveboard railway analogy: ZA : 27 :: YB : 27",
    ruleId: "MIXED_LETTER_GROUP_SCALAR_AGGREGATE",
    context: { kind: "LETTER_GROUP_SCALAR", aggregate: "SUM" },
    evidence: [
      { input: letterGroupToken("ZA"), output: numberToken(27) },
      { input: letterGroupToken("YB"), output: numberToken(27) },
    ],
  },
  {
    source: "Oliveboard railway analogy: AE : F :: CG : J",
    ruleId: "MIXED_LETTER_GROUP_DERIVED_LETTER",
    context: { kind: "LETTER_GROUP_TO_LETTER", aggregate: "SUM" },
    evidence: [
      { input: letterGroupToken("AE"), output: letterToken("F") },
      { input: letterGroupToken("CG"), output: letterToken("J") },
    ],
  },
  {
    source: "SSC MTS official analogy: R : 324 :: I : 81",
    ruleId: "MIXED_SINGLE_LETTER_POSITION_POWER",
    context: { kind: "SINGLE_LETTER_POSITION_POWER", exponent: 2 },
    evidence: [
      { input: letterToken("R"), output: numberToken(324) },
      { input: letterToken("I"), output: numberToken(81) },
    ],
  },
  {
    source: "Testbook mixed analogy: P21 : J28 :: G19 : A26",
    ruleId: "MIXED_TOKEN_INDEPENDENT_TRANSFORM",
    context: { kind: "INDEPENDENT_LETTER_NUMBER", letterShift: -6, numberOperation: "ADD", numberAmount: 7 },
    evidence: [
      { input: letterNumberToken("P", 21), output: letterNumberToken("J", 28) },
      { input: letterNumberToken("G", 19), output: letterNumberToken("A", 26) },
    ],
  },
  {
    source: "Testbook notes: PL36 : UQ41 :: MI49 : RN54",
    ruleId: "MIXED_CLUSTER_NUMBER_SHARED_DELTA",
    context: { kind: "CLUSTER_NUMBER_SHARED_DELTA", delta: 5 },
    evidence: [
      { input: clusterNumberToken("PL", 36), output: clusterNumberToken("UQ", 41) },
      { input: clusterNumberToken("MI", 49), output: clusterNumberToken("RN", 54) },
    ],
  },
  {
    source: "Testbook notes: 21I : 22P :: 13P : 14Y",
    ruleId: "MIXED_NUMBER_LETTER_DIGIT_SQUARE_SUCCESSOR",
    context: { kind: "NUMBER_LETTER_DIGIT_SQUARE_SUCCESSOR", numberStep: 1 },
    evidence: [
      { input: numberLetterToken(21, "I"), output: numberLetterToken(22, "P") },
      { input: numberLetterToken(13, "P"), output: numberLetterToken(14, "Y") },
    ],
  },
  {
    source: "PGCIL Diploma Trainee 2025: KH12 : NF-5 :: NU13 : QS-4",
    ruleId: "MIXED_CLUSTER_NUMBER_INDEPENDENT_VECTOR",
    context: { kind: "CLUSTER_NUMBER_INDEPENDENT_VECTOR", letterShifts: [3, -2], numberDelta: -17 },
    evidence: [
      { input: clusterNumberToken("KH", 12), output: clusterNumberToken("NF", -5) },
      { input: clusterNumberToken("NU", 13), output: clusterNumberToken("QS", -4) },
    ],
  },
  {
    source: "Three-pair item: TG13 : RC-2 :: GP19 : EL4",
    ruleId: "MIXED_CLUSTER_NUMBER_INDEPENDENT_VECTOR",
    context: { kind: "CLUSTER_NUMBER_INDEPENDENT_VECTOR", letterShifts: [-2, -4], numberDelta: -15 },
    evidence: [
      { input: clusterNumberToken("TG", 13), output: clusterNumberToken("RC", -2) },
      { input: clusterNumberToken("GP", 19), output: clusterNumberToken("EL", 4) },
    ],
  },
  {
    source: "RRB NTPC 2025: SS14 : WP-4 :: CE10 : GB-8",
    ruleId: "MIXED_CLUSTER_NUMBER_INDEPENDENT_VECTOR",
    context: { kind: "CLUSTER_NUMBER_INDEPENDENT_VECTOR", letterShifts: [4, -3], numberDelta: -18 },
    evidence: [
      { input: clusterNumberToken("SS", 14), output: clusterNumberToken("WP", -4) },
      { input: clusterNumberToken("CE", 10), output: clusterNumberToken("GB", -8) },
    ],
  },
  {
    source: "RRB NTPC 2025: NW-19 : PZ-10 :: RD-12 : TG-3",
    ruleId: "MIXED_CLUSTER_NUMBER_INDEPENDENT_VECTOR",
    context: { kind: "CLUSTER_NUMBER_INDEPENDENT_VECTOR", letterShifts: [2, 3], numberDelta: 9 },
    evidence: [
      { input: clusterNumberToken("NW", -19), output: clusterNumberToken("PZ", -10) },
      { input: clusterNumberToken("RD", -12), output: clusterNumberToken("TG", -3) },
    ],
  },
  {
    source: "SSC GD 2025: VF19 : YB-2 :: TX11 : WT-10",
    ruleId: "MIXED_CLUSTER_NUMBER_INDEPENDENT_VECTOR",
    context: { kind: "CLUSTER_NUMBER_INDEPENDENT_VECTOR", letterShifts: [3, -4], numberDelta: -21 },
    evidence: [
      { input: clusterNumberToken("VF", 19), output: clusterNumberToken("YB", -2) },
      { input: clusterNumberToken("TX", 11), output: clusterNumberToken("WT", -10) },
    ],
  },
  {
    source: "SSC MTS 2024: DA2 : GD10 :: SP7 : VS35",
    ruleId: "MIXED_CLUSTER_NUMBER_VECTOR_MULTIPLIER",
    context: {
      kind: "CLUSTER_NUMBER_VECTOR_MULTIPLIER",
      letterShifts: [3, 3],
      numerator: 5,
      denominator: 1,
    },
    evidence: [
      { input: clusterNumberToken("DA", 2), output: clusterNumberToken("GD", 10) },
      { input: clusterNumberToken("SP", 7), output: clusterNumberToken("VS", 35) },
    ],
  },
  {
    source: "Official mixed analogy: AK40 : EE100 :: DL80 : HF200",
    ruleId: "MIXED_CLUSTER_NUMBER_VECTOR_MULTIPLIER",
    context: {
      kind: "CLUSTER_NUMBER_VECTOR_MULTIPLIER",
      letterShifts: [4, -6],
      numerator: 5,
      denominator: 2,
    },
    evidence: [
      { input: clusterNumberToken("AK", 40), output: clusterNumberToken("EE", 100) },
      { input: clusterNumberToken("DL", 80), output: clusterNumberToken("HF", 200) },
    ],
  },
  {
    source: "UKPSC official analogy: TR4 : XC64 :: AC3 : EN27",
    ruleId: "MIXED_CLUSTER_NUMBER_VECTOR_POWER",
    context: {
      kind: "CLUSTER_NUMBER_VECTOR_POWER",
      letterShifts: [4, 11],
      transform: "CUBE",
    },
    evidence: [
      { input: clusterNumberToken("TR", 4), output: clusterNumberToken("XC", 64) },
      { input: clusterNumberToken("AC", 3), output: clusterNumberToken("EN", 27) },
    ],
  },
  {
    source: "RRB Group D official analogy: FM25 : IJ125 :: NO36 : QL216",
    ruleId: "MIXED_CLUSTER_NUMBER_VECTOR_POWER",
    context: {
      kind: "CLUSTER_NUMBER_VECTOR_POWER",
      letterShifts: [3, -3],
      transform: "PERFECT_SQUARE_TO_CUBE",
    },
    evidence: [
      { input: clusterNumberToken("FM", 25), output: clusterNumberToken("IJ", 125) },
      { input: clusterNumberToken("NO", 36), output: clusterNumberToken("QL", 216) },
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
  const expectedContextKey = provisionalMixedContextKey(fixture.context);
  const matches = matchingProvisionalMixedRules(fixture.evidence);
  assert.ok(matches.some((match) => match.ruleId === fixture.ruleId && match.contextKey === expectedContextKey));
}

console.log("ANA-CP-008 source fixture audit passed.", {
  fixtureCount: fixtures.length,
  evidencePairs: fixtures.reduce((sum, fixture) => sum + fixture.evidence.length, 0),
});

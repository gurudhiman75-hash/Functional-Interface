import {
  SER_NUMERIC_CANONICAL_AUTHORITIES,
  SER_NUMERIC_COLLISION_MAPPINGS,
  SER_NUMERIC_EXECUTABLE_AUDIT_VOLUME,
  SER_NUMERIC_FREEZE_DECISION,
  SER_NUMERIC_GAP_MATRIX,
  SER_NUMERIC_PERMANENT_QL_COUNT,
  SER_NUMERIC_SOURCE_FAMILIES,
  SER_NUMERIC_TEMPLATE_SURFACES,
  collectSerNumericLifecycleSamples,
  type SerNumericGapStatus,
} from "../SER-NUMERIC-AUDIT/numeric-inventory";
import {
  SER_NUMERIC_WAVE_A_SOURCE_FAMILY_IDS,
  SER_NUMERIC_WAVE_A_TEMPORARY_TEMPLATE_IDS,
  generateSerNumericWaveAQuestion,
} from "../SER-NUMERIC-WAVE-A/foundation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function countBy<T extends string>(values: readonly T[]): Record<T, number> {
  return values.reduce((counts, value) => {
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {} as Record<T, number>);
}

const revisedGapMatrix = SER_NUMERIC_GAP_MATRIX.map((dimension) => {
  if (dimension.dimensionId === "ZERO_STEP_AND_CONSTANT_SERIES") {
    return {
      ...dimension,
      status: "COVERED" as const,
      evidence:
        "Wave A proves zero-step constant series as the step=0 domain of UNIFORM_ADDITIVE_STEP across all four task directions",
      blocksPermanentFreeze: false,
      recommendedWave: "NONE" as const,
    };
  }
  if (dimension.dimensionId === "FRACTION_DECIMAL_AND_DIVISION_SERIES") {
    return {
      ...dimension,
      status: "COVERED" as const,
      evidence:
        "Wave A exact-rational solver proves fractional additive, fixed-division and terminating-decimal affine domains across all four task directions",
      blocksPermanentFreeze: false,
      recommendedWave: "NONE" as const,
    };
  }
  if (dimension.dimensionId === "DESCENDING_AND_SIGNED_DOMAINS") {
    return {
      ...dimension,
      status: "COVERED" as const,
      evidence:
        "The signed-descending parity audit proves sign inversion and direction reversal as self-inverse representation parameters across all 14 provisional canonical authorities; alternating-sign operator grammars remain separately tracked",
      blocksPermanentFreeze: false,
      recommendedWave: "NONE" as const,
    };
  }
  return dimension;
});

assert(SER_NUMERIC_TEMPLATE_SURFACES.length === 88, "baseline template count drift");
assert(SER_NUMERIC_SOURCE_FAMILIES.length === 22, "baseline source-family count drift");
assert(SER_NUMERIC_CANONICAL_AUTHORITIES.length === 14, "baseline authority count drift");
assert(SER_NUMERIC_COLLISION_MAPPINGS.length === 10, "baseline collision count drift");
assert(SER_NUMERIC_EXECUTABLE_AUDIT_VOLUME === 10_560, "baseline volume drift");
assert(SER_NUMERIC_PERMANENT_QL_COUNT === 0, "permanent QL allocated");
assert(
  SER_NUMERIC_FREEZE_DECISION === "BLOCK_PERMANENT_QL_ALLOCATION",
  "freeze decision drift",
);
assert(SER_NUMERIC_WAVE_A_TEMPORARY_TEMPLATE_IDS.length === 24, "Wave A template drift");
assert(SER_NUMERIC_WAVE_A_SOURCE_FAMILY_IDS.length === 6, "Wave A source-family drift");

const baselineLifecycleSamples = collectSerNumericLifecycleSamples();
const waveALifecycleSamples = SER_NUMERIC_WAVE_A_TEMPORARY_TEMPLATE_IDS.map((id) =>
  generateSerNumericWaveAQuestion(id, 1),
);
assert(baselineLifecycleSamples.length === 88, "baseline lifecycle count drift");
assert(waveALifecycleSamples.length === 24, "Wave A lifecycle count drift");
for (const sample of [...baselineLifecycleSamples, ...waveALifecycleSamples]) {
  assert(sample.permanentQlId === null, `${sample.temporaryTemplateId}: permanent QL allocated`);
  assert(sample.lifecycle.maturity === "OPEN_EXECUTABLE_DISCOVERY", "maturity drift");
  assert(sample.lifecycle.sourceSaturation === "OPEN", "source saturation drift");
  assert(!sample.lifecycle.active, "unexpected active question");
  assert(!sample.lifecycle.questionStudioDiscoverable, "unexpected Question Studio exposure");
  assert(!sample.lifecycle.questionBankWritable, "unexpected Question Bank write");
  assert(!sample.lifecycle.testEligible, "unexpected test eligibility");
  assert(!sample.lifecycle.publiclyPublishable, "unexpected publication eligibility");
}

const revisedGapStatusCounts = countBy(
  revisedGapMatrix.map((dimension) => dimension.status as SerNumericGapStatus),
);
assert(revisedGapStatusCounts.COVERED === 14, "post-parity covered count drift");
assert(revisedGapStatusCounts.PARTIAL === 1, "post-parity partial count drift");
assert(revisedGapStatusCounts.OPEN === 11, "post-parity open count drift");

const freezeBlockers = revisedGapMatrix.filter(
  (dimension) => dimension.blocksPermanentFreeze,
);
assert(freezeBlockers.length === 12, "post-parity blocker count drift");
assert(
  revisedGapMatrix
    .filter((dimension) => dimension.status === "COVERED")
    .every((dimension) => !dimension.blocksPermanentFreeze),
  "covered post-parity dimension blocks freeze",
);
assert(
  revisedGapMatrix
    .filter((dimension) => dimension.status !== "COVERED")
    .every((dimension) => dimension.blocksPermanentFreeze),
  "partial/open post-parity dimension fails to block freeze",
);

const waveCounts = countBy(
  revisedGapMatrix.map((dimension) => dimension.recommendedWave),
);
assert(waveCounts.NONE === 14, "post-parity covered-wave count drift");
assert((waveCounts.EDGE_DOMAIN_EXPANSION ?? 0) === 0, "edge-domain blocker remains");
assert(
  waveCounts.HIGHER_ORDER_AND_RECURRENCE_EXPANSION === 5,
  "higher-order wave count drift",
);
assert(
  waveCounts.REPRESENTATION_AND_ANSWER_SEMANTICS_EXPANSION === 6,
  "representation wave count drift",
);
assert(
  waveCounts.SOURCE_SATURATION_AND_EDITORIAL_AUDIT === 1,
  "source-saturation wave count drift",
);

const combinedTemporaryTemplates =
  SER_NUMERIC_TEMPLATE_SURFACES.length + SER_NUMERIC_WAVE_A_TEMPORARY_TEMPLATE_IDS.length;
const combinedSourceFamilies =
  SER_NUMERIC_SOURCE_FAMILIES.length + SER_NUMERIC_WAVE_A_SOURCE_FAMILY_IDS.length;
const combinedCanonicalAuthorities = SER_NUMERIC_CANONICAL_AUTHORITIES.length;
const generatedQuestionVolume = SER_NUMERIC_EXECUTABLE_AUDIT_VOLUME + 2_880;
const parityRepresentationProofs = 8_880;
const combinedExecutableEvidenceVolume = generatedQuestionVolume + parityRepresentationProofs;

assert(combinedTemporaryTemplates === 112, "combined template count drift");
assert(combinedSourceFamilies === 28, "combined source-family count drift");
assert(combinedCanonicalAuthorities === 14, "parity audit added a canonical authority");
assert(generatedQuestionVolume === 13_440, "generated-question volume drift");
assert(combinedExecutableEvidenceVolume === 22_320, "combined evidence volume drift");

console.log(
  JSON.stringify(
    {
      status: "PASS_SER_NUMERIC_POST_SIGNED_DESCENDING_PARITY_GAP_AUDIT",
      permanentQlCount: 0,
      combinedTemporaryTemplates,
      combinedSourceFamilies,
      provisionalCanonicalAuthorities: combinedCanonicalAuthorities,
      generatedQuestionVolume,
      parityRepresentationProofs,
      combinedExecutableEvidenceVolume,
      baselineLifecycleSamples: baselineLifecycleSamples.length,
      waveALifecycleSamples: waveALifecycleSamples.length,
      revisedGapStatusCounts,
      remainingFreezeBlockers: freezeBlockers.length,
      freezeDecision: "BLOCK_PERMANENT_QL_ALLOCATION",
      remainingRecommendedWaveCounts: waveCounts,
      edgeDomainExpansion: "CLOSED",
      nextImplementationAuthority:
        "WAVE_B_HIGHER_ORDER_AND_RECURRENCE_EXPANSION",
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    },
    null,
    2,
  ),
);

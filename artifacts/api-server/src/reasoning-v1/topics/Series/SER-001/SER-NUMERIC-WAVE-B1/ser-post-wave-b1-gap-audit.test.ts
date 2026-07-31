import {
  SER_NUMERIC_CANONICAL_AUTHORITIES,
  SER_NUMERIC_EXECUTABLE_AUDIT_VOLUME,
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
import {
  SER_NUMERIC_WAVE_B1_CANONICAL_AUTHORITY_IDS,
  SER_NUMERIC_WAVE_B1_SOURCE_FAMILY_IDS,
  SER_NUMERIC_WAVE_B1_TEMPORARY_TEMPLATE_IDS,
  generateSerNumericWaveB1Question,
} from "./foundation";

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
      evidence: "Wave A proves zero-step ownership under UNIFORM_ADDITIVE_STEP",
      blocksPermanentFreeze: false,
      recommendedWave: "NONE" as const,
    };
  }
  if (dimension.dimensionId === "FRACTION_DECIMAL_AND_DIVISION_SERIES") {
    return {
      ...dimension,
      status: "COVERED" as const,
      evidence: "Wave A proves exact-rational additive, division and decimal-affine domains",
      blocksPermanentFreeze: false,
      recommendedWave: "NONE" as const,
    };
  }
  if (dimension.dimensionId === "DESCENDING_AND_SIGNED_DOMAINS") {
    return {
      ...dimension,
      status: "COVERED" as const,
      evidence: "Signed-descending parity audit covers all 14 pre-Wave-B1 canonical authorities",
      blocksPermanentFreeze: false,
      recommendedWave: "NONE" as const,
    };
  }
  if (dimension.dimensionId === "FOURTH_AND_HIGHER_FINITE_DIFFERENCES") {
    return {
      ...dimension,
      status: "PARTIAL" as const,
      evidence:
        "Wave B1 proves constant non-zero fourth- and fifth-difference series; higher-order source ceiling and cross-source saturation remain open",
      blocksPermanentFreeze: true,
      recommendedWave: "HIGHER_ORDER_AND_RECURRENCE_EXPANSION" as const,
    };
  }
  if (dimension.dimensionId === "RICHER_STATEFUL_RECURRENCES") {
    return {
      ...dimension,
      status: "PARTIAL" as const,
      evidence:
        "Wave B1 proves affine previous-two and linear previous-three recurrences in one complete candidate pool; broader recurrence grammars and source saturation remain open",
      blocksPermanentFreeze: true,
      recommendedWave: "HIGHER_ORDER_AND_RECURRENCE_EXPANSION" as const,
    };
  }
  return dimension;
});

assert(SER_NUMERIC_PERMANENT_QL_COUNT === 0, "permanent QL allocated");
assert(SER_NUMERIC_TEMPLATE_SURFACES.length === 88, "baseline template count drift");
assert(SER_NUMERIC_SOURCE_FAMILIES.length === 22, "baseline source-family count drift");
assert(SER_NUMERIC_CANONICAL_AUTHORITIES.length === 14, "baseline authority count drift");
assert(SER_NUMERIC_EXECUTABLE_AUDIT_VOLUME === 10_560, "baseline volume drift");
assert(SER_NUMERIC_WAVE_A_TEMPORARY_TEMPLATE_IDS.length === 24, "Wave A template drift");
assert(SER_NUMERIC_WAVE_A_SOURCE_FAMILY_IDS.length === 6, "Wave A source drift");
assert(SER_NUMERIC_WAVE_B1_TEMPORARY_TEMPLATE_IDS.length === 32, "Wave B1 template drift");
assert(SER_NUMERIC_WAVE_B1_SOURCE_FAMILY_IDS.length === 8, "Wave B1 source drift");
assert(SER_NUMERIC_WAVE_B1_CANONICAL_AUTHORITY_IDS.length === 2, "Wave B1 authority drift");

const lifecycleSamples = [
  ...collectSerNumericLifecycleSamples(),
  ...SER_NUMERIC_WAVE_A_TEMPORARY_TEMPLATE_IDS.map((id) =>
    generateSerNumericWaveAQuestion(id, 1),
  ),
  ...SER_NUMERIC_WAVE_B1_TEMPORARY_TEMPLATE_IDS.map((id) =>
    generateSerNumericWaveB1Question(id, 1),
  ),
];
assert(lifecycleSamples.length === 144, "combined lifecycle count drift");
for (const sample of lifecycleSamples) {
  assert(sample.permanentQlId === null, `${sample.temporaryTemplateId}: permanent QL allocated`);
  assert(sample.lifecycle.maturity === "OPEN_EXECUTABLE_DISCOVERY", "maturity drift");
  assert(sample.lifecycle.sourceSaturation === "OPEN", "source saturation drift");
  assert(!sample.lifecycle.active, "unexpected active question");
  assert(!sample.lifecycle.questionStudioDiscoverable, "unexpected Question Studio exposure");
  assert(!sample.lifecycle.questionBankWritable, "unexpected Question Bank write");
  assert(!sample.lifecycle.testEligible, "unexpected test eligibility");
  assert(!sample.lifecycle.publiclyPublishable, "unexpected publication eligibility");
}

const gapStatusCounts = countBy(
  revisedGapMatrix.map((dimension) => dimension.status as SerNumericGapStatus),
);
assert(gapStatusCounts.COVERED === 14, "post-Wave-B1 covered count drift");
assert(gapStatusCounts.PARTIAL === 3, "post-Wave-B1 partial count drift");
assert(gapStatusCounts.OPEN === 9, "post-Wave-B1 open count drift");

const freezeBlockers = revisedGapMatrix.filter(
  (dimension) => dimension.blocksPermanentFreeze,
);
assert(freezeBlockers.length === 12, "post-Wave-B1 blocker count drift");
assert(
  revisedGapMatrix
    .filter((dimension) => dimension.status === "COVERED")
    .every((dimension) => !dimension.blocksPermanentFreeze),
  "covered dimension blocks freeze",
);
assert(
  revisedGapMatrix
    .filter((dimension) => dimension.status !== "COVERED")
    .every((dimension) => dimension.blocksPermanentFreeze),
  "partial/open dimension fails to block freeze",
);

const recommendedWaveCounts = countBy(
  revisedGapMatrix.map((dimension) => dimension.recommendedWave),
);
assert(recommendedWaveCounts.NONE === 14, "covered-wave count drift");
assert((recommendedWaveCounts.EDGE_DOMAIN_EXPANSION ?? 0) === 0, "edge domain reopened");
assert(
  recommendedWaveCounts.HIGHER_ORDER_AND_RECURRENCE_EXPANSION === 5,
  "Wave B remaining dimension count drift",
);
assert(
  recommendedWaveCounts.REPRESENTATION_AND_ANSWER_SEMANTICS_EXPANSION === 6,
  "Wave C dimension count drift",
);
assert(
  recommendedWaveCounts.SOURCE_SATURATION_AND_EDITORIAL_AUDIT === 1,
  "Wave D dimension count drift",
);

const combinedTemporaryTemplates = 88 + 24 + 32;
const combinedSourceFamilies = 22 + 6 + 8;
const generatedQuestionVolume = 10_560 + 2_880 + 3_840;
const parityRepresentationProofs = 8_880;
const combinedExecutableEvidenceVolume = generatedQuestionVolume + parityRepresentationProofs;
// ADD_PREVIOUS_TWO_RECURRENCE is provisionally generalised into
// LINEAR_STATEFUL_RECURRENCE, while the higher-order finite-difference umbrella
// is added. Thus the chapter-wide provisional inventory moves from 14 to 15.
const provisionalCanonicalAuthorities = 14 - 1 + 2;

assert(combinedTemporaryTemplates === 144, "combined template count drift");
assert(combinedSourceFamilies === 36, "combined source count drift");
assert(generatedQuestionVolume === 17_280, "generated volume drift");
assert(combinedExecutableEvidenceVolume === 26_160, "evidence volume drift");
assert(provisionalCanonicalAuthorities === 15, "chapter authority count drift");

console.log(
  JSON.stringify(
    {
      status: "PASS_SER_NUMERIC_POST_WAVE_B1_GAP_AUDIT",
      permanentQlCount: 0,
      combinedTemporaryTemplates,
      combinedSourceFamilies,
      provisionalCanonicalAuthorities,
      generatedQuestionVolume,
      parityRepresentationProofs,
      combinedExecutableEvidenceVolume,
      lifecycleSamples: lifecycleSamples.length,
      gapStatusCounts,
      remainingFreezeBlockers: freezeBlockers.length,
      freezeDecision: "BLOCK_PERMANENT_QL_ALLOCATION",
      remainingRecommendedWaveCounts: recommendedWaveCounts,
      waveB1Decision: {
        fourthAndFifthDifferences: "PARTIAL_EXTENSION_CP003",
        priorAddPreviousTwo: "PROVISIONALLY_GENERALISED",
        recurrenceSources: "COMPRESS_TO_LINEAR_STATEFUL_RECURRENCE",
      },
      nextImplementationAuthority:
        "WAVE_B2_SPECIAL_NUMBER_CHANGING_POWER_AND_ALTERNATING_OPERATOR_DISCOVERY",
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    },
    null,
    2,
  ),
);

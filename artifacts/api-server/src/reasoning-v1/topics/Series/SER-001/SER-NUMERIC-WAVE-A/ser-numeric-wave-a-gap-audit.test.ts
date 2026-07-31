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
  SER_NUMERIC_WAVE_A_TEMPORARY_TEMPLATES,
  generateSerNumericWaveAQuestion,
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

const WAVE_A_DOMAIN_MAPPINGS = [
  ["ZERO_STEP_CONSTANT", "SER-CP-001", "UNIFORM_ADDITIVE_STEP"],
  ["DESCENDING_SIGNED_ADDITIVE", "SER-CP-001", "UNIFORM_ADDITIVE_STEP"],
  ["FRACTIONAL_ADDITIVE_STEP", "SER-CP-001", "UNIFORM_ADDITIVE_STEP"],
  ["UNIT_FRACTION_MULTIPLICATIVE", "SER-CP-002", "UNIFORM_MULTIPLICATIVE_RATIO"],
  ["DESCENDING_SIGNED_AFFINE", "SER-CP-002", "AFFINE_MULTIPLY_THEN_ADD"],
  ["TERMINATING_DECIMAL_AFFINE", "SER-CP-002", "AFFINE_MULTIPLY_THEN_ADD"],
] as const;

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
      status: "PARTIAL" as const,
      evidence:
        "Wave A proves signed descending additive and affine domains; parity across higher-order, recurrence and composite authorities remains open",
      blocksPermanentFreeze: true,
      recommendedWave: "EDGE_DOMAIN_EXPANSION" as const,
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

assert(SER_NUMERIC_WAVE_A_TEMPORARY_TEMPLATE_IDS.length === 24, "Wave A template count drift");
assert(SER_NUMERIC_WAVE_A_SOURCE_FAMILY_IDS.length === 6, "Wave A family count drift");
assert(new Set(SER_NUMERIC_WAVE_A_TEMPORARY_TEMPLATE_IDS).size === 24, "duplicate Wave A template");
assert(
  SER_NUMERIC_WAVE_A_TEMPORARY_TEMPLATE_IDS.every(
    (id) => !SER_NUMERIC_TEMPLATE_SURFACES.some((surface) => surface.temporaryTemplateId === id),
  ),
  "Wave A template collides with baseline identity",
);

const taskCounts = countBy(
  SER_NUMERIC_WAVE_A_TEMPORARY_TEMPLATES.map((template) => template.taskKind),
);
for (const taskKind of ["NEXT_TERM", "MISSING_TERM", "PREVIOUS_TERM", "WRONG_TERM"] as const) {
  assert(taskCounts[taskKind] === 6, `${taskKind}: Wave A source coverage drift`);
}

const canonicalKeys = new Set(
  SER_NUMERIC_CANONICAL_AUTHORITIES.map(
    (authority) => `${authority.checkpointId}|${authority.authorityId}`,
  ),
);
for (const [sourceFamilyId, checkpointId, authorityId] of WAVE_A_DOMAIN_MAPPINGS) {
  assert(
    SER_NUMERIC_WAVE_A_SOURCE_FAMILY_IDS.includes(sourceFamilyId),
    `${sourceFamilyId}: Wave A source missing`,
  );
  assert(
    canonicalKeys.has(`${checkpointId}|${authorityId}`),
    `${sourceFamilyId}: target authority missing`,
  );
}

const waveLifecycleSamples = SER_NUMERIC_WAVE_A_TEMPORARY_TEMPLATE_IDS.map((id) =>
  generateSerNumericWaveAQuestion(id, 1),
);
assert(waveLifecycleSamples.length === 24, "Wave A lifecycle count drift");
for (const sample of waveLifecycleSamples) {
  assert(sample.permanentQlId === null, `${sample.temporaryTemplateId}: permanent QL allocated`);
  assert(sample.lifecycle.maturity === "OPEN_EXECUTABLE_DISCOVERY", "Wave A maturity drift");
  assert(sample.lifecycle.sourceSaturation === "OPEN", "Wave A source saturation drift");
  assert(!sample.lifecycle.active, "Wave A question unexpectedly active");
  assert(!sample.lifecycle.questionStudioDiscoverable, "Wave A Question Studio exposure");
  assert(!sample.lifecycle.questionBankWritable, "Wave A Question Bank write");
  assert(!sample.lifecycle.testEligible, "Wave A test eligibility");
  assert(!sample.lifecycle.publiclyPublishable, "Wave A publication eligibility");
}

const baselineLifecycleSamples = collectSerNumericLifecycleSamples();
assert(baselineLifecycleSamples.length === 88, "baseline lifecycle count drift");

const revisedGapStatusCounts = countBy(
  revisedGapMatrix.map((dimension) => dimension.status as SerNumericGapStatus),
);
assert(revisedGapStatusCounts.COVERED === 13, "post-Wave-A covered count drift");
assert(revisedGapStatusCounts.PARTIAL === 2, "post-Wave-A partial count drift");
assert(revisedGapStatusCounts.OPEN === 11, "post-Wave-A open count drift");

const freezeBlockers = revisedGapMatrix.filter(
  (dimension) => dimension.blocksPermanentFreeze,
);
assert(freezeBlockers.length === 13, "post-Wave-A blocker count drift");
assert(
  revisedGapMatrix
    .filter((dimension) => dimension.status === "COVERED")
    .every((dimension) => !dimension.blocksPermanentFreeze),
  "covered post-Wave-A dimension blocks freeze",
);
assert(
  revisedGapMatrix
    .filter((dimension) => dimension.status !== "COVERED")
    .every((dimension) => dimension.blocksPermanentFreeze),
  "partial/open post-Wave-A dimension fails to block freeze",
);

const waveCounts = countBy(
  revisedGapMatrix.map((dimension) => dimension.recommendedWave),
);
assert(waveCounts.NONE === 13, "post-Wave-A covered-wave count drift");
assert(waveCounts.EDGE_DOMAIN_EXPANSION === 1, "remaining edge-domain count drift");
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
const combinedCollisionAndDomainMappings =
  SER_NUMERIC_COLLISION_MAPPINGS.length + WAVE_A_DOMAIN_MAPPINGS.length;
const combinedExecutableAuditVolume = SER_NUMERIC_EXECUTABLE_AUDIT_VOLUME + 2_880;

assert(combinedTemporaryTemplates === 112, "combined template count drift");
assert(combinedSourceFamilies === 28, "combined source-family count drift");
assert(combinedCanonicalAuthorities === 14, "Wave A incorrectly added canonical authority");
assert(combinedCollisionAndDomainMappings === 16, "combined mapping count drift");
assert(combinedExecutableAuditVolume === 13_440, "combined volume drift");

console.log(
  JSON.stringify(
    {
      status: "PASS_SER_NUMERIC_POST_WAVE_A_GAP_AUDIT",
      permanentQlCount: 0,
      baselineTemporaryTemplates: SER_NUMERIC_TEMPLATE_SURFACES.length,
      waveATemporaryTemplates: SER_NUMERIC_WAVE_A_TEMPORARY_TEMPLATE_IDS.length,
      combinedTemporaryTemplates,
      baselineSourceFamilies: SER_NUMERIC_SOURCE_FAMILIES.length,
      waveASourceFamilies: SER_NUMERIC_WAVE_A_SOURCE_FAMILY_IDS.length,
      combinedSourceFamilies,
      provisionalCanonicalAuthorities: combinedCanonicalAuthorities,
      collisionAndDomainMappings: combinedCollisionAndDomainMappings,
      combinedExecutableAuditVolume,
      baselineLifecycleSamples: baselineLifecycleSamples.length,
      waveALifecycleSamples: waveLifecycleSamples.length,
      revisedGapStatusCounts,
      remainingFreezeBlockers: freezeBlockers.length,
      freezeDecision: "BLOCK_PERMANENT_QL_ALLOCATION",
      remainingRecommendedWaveCounts: waveCounts,
      nextImplementationAuthority:
        "WAVE_A_DESCENDING_SIGNED_PARITY_THEN_WAVE_B_HIGHER_ORDER_AND_RECURRENCE_EXPANSION",
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    },
    null,
    2,
  ),
);

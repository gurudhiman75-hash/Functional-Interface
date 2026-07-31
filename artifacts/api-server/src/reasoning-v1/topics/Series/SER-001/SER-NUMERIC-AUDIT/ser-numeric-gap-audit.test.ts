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
  type SerNumericCheckpointId,
  type SerNumericGapStatus,
  type SerNumericTaskKind,
} from "./numeric-inventory";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function countBy<T extends string>(values: readonly T[]): Record<T, number> {
  return values.reduce((counts, value) => {
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {} as Record<T, number>);
}

const checkpointIds: readonly SerNumericCheckpointId[] = [
  "SER-CP-001",
  "SER-CP-002",
  "SER-CP-003",
  "SER-CP-004",
  "SER-CP-005",
];
const taskKinds: readonly SerNumericTaskKind[] = [
  "NEXT_TERM",
  "MISSING_TERM",
  "PREVIOUS_TERM",
  "WRONG_TERM",
];

assert(SER_NUMERIC_TEMPLATE_SURFACES.length === 88, "temporary-template inventory drift");
assert(SER_NUMERIC_SOURCE_FAMILIES.length === 22, "source-family inventory drift");
assert(
  SER_NUMERIC_CANONICAL_AUTHORITIES.length === 14,
  "provisional canonical-authority inventory drift",
);
assert(SER_NUMERIC_COLLISION_MAPPINGS.length === 10, "collision mapping drift");
assert(SER_NUMERIC_PERMANENT_QL_COUNT === 0, "permanent QL allocated before freeze");
assert(
  SER_NUMERIC_FREEZE_DECISION === "BLOCK_PERMANENT_QL_ALLOCATION",
  "numeric freeze decision drift",
);
assert(SER_NUMERIC_EXECUTABLE_AUDIT_VOLUME === 10_560, "executable audit volume drift");

const templateIds = SER_NUMERIC_TEMPLATE_SURFACES.map(
  (surface) => surface.temporaryTemplateId,
);
assert(new Set(templateIds).size === 88, "duplicate temporary template identity");

const sourceKeys = SER_NUMERIC_SOURCE_FAMILIES.map(
  (family) => `${family.checkpointId}|${family.sourceFamilyId}`,
);
assert(new Set(sourceKeys).size === 22, "duplicate source-family identity");

const canonicalKeys = SER_NUMERIC_CANONICAL_AUTHORITIES.map(
  (authority) => `${authority.checkpointId}|${authority.authorityId}`,
);
assert(new Set(canonicalKeys).size === 14, "duplicate canonical-authority identity");

const sourceCounts = countBy(
  SER_NUMERIC_SOURCE_FAMILIES.map((family) => family.checkpointId),
);
const expectedSourceCounts: Readonly<Record<SerNumericCheckpointId, number>> = {
  "SER-CP-001": 1,
  "SER-CP-002": 2,
  "SER-CP-003": 2,
  "SER-CP-004": 7,
  "SER-CP-005": 10,
};
for (const checkpointId of checkpointIds) {
  assert(
    sourceCounts[checkpointId] === expectedSourceCounts[checkpointId],
    `${checkpointId}: source-family count drift`,
  );
}

const canonicalCounts = countBy(
  SER_NUMERIC_CANONICAL_AUTHORITIES.map((authority) => authority.checkpointId),
);
const expectedCanonicalCounts: Readonly<Record<SerNumericCheckpointId, number>> = {
  "SER-CP-001": 1,
  "SER-CP-002": 2,
  "SER-CP-003": 2,
  "SER-CP-004": 3,
  "SER-CP-005": 6,
};
for (const checkpointId of checkpointIds) {
  assert(
    canonicalCounts[checkpointId] === expectedCanonicalCounts[checkpointId],
    `${checkpointId}: canonical-authority count drift`,
  );
}

const netInventoryCompression =
  SER_NUMERIC_SOURCE_FAMILIES.length - SER_NUMERIC_CANONICAL_AUTHORITIES.length;
assert(netInventoryCompression === 8, "net source-to-authority compression drift");

for (const mapping of SER_NUMERIC_COLLISION_MAPPINGS) {
  assert(
    sourceKeys.includes(`${mapping.sourceCheckpointId}|${mapping.sourceFamilyId}`),
    `${mapping.sourceFamilyId}: collision source missing from inventory`,
  );
  assert(
    canonicalKeys.includes(
      `${mapping.canonicalCheckpointId}|${mapping.canonicalAuthorityId}`,
    ),
    `${mapping.sourceFamilyId}: collision target missing from canonical inventory`,
  );
}

const collisionReasonCounts = countBy(
  SER_NUMERIC_COLLISION_MAPPINGS.map((mapping) => mapping.reason),
);
assert(
  collisionReasonCounts.CROSS_CHECKPOINT_MATHEMATICAL_COLLISION === 4,
  "cross-checkpoint collision count drift",
);
assert(
  collisionReasonCounts.EQUIVALENT_INTERLEAVED_REPRESENTATION === 2,
  "interleaved representation collision count drift",
);
assert(collisionReasonCounts.PHASE_VARIANT_MERGE === 4, "phase-variant mapping count drift");

const taskCounts = countBy(
  SER_NUMERIC_TEMPLATE_SURFACES.map((surface) => surface.taskKind),
);
for (const taskKind of taskKinds) {
  assert(taskCounts[taskKind] === 22, `${taskKind}: expected one template per source family`);
}

const answerSemanticCounts = countBy(
  SER_NUMERIC_TEMPLATE_SURFACES.map((surface) => surface.answerSemantic),
);
assert(answerSemanticCounts.TERM_VALUE === 66, "term-value semantic count drift");
assert(
  answerSemanticCounts.WRONG_DISPLAYED_TERM === 22,
  "wrong-displayed-term semantic count drift",
);

const lifecycleSamples = collectSerNumericLifecycleSamples();
assert(lifecycleSamples.length === 88, "lifecycle sample count drift");
for (const sample of lifecycleSamples) {
  assert(sample.permanentQlId === null, `${sample.temporaryTemplateId}: permanent QL allocated`);
  assert(
    sample.lifecycle.maturity === "OPEN_EXECUTABLE_DISCOVERY",
    `${sample.temporaryTemplateId}: maturity drift`,
  );
  assert(
    sample.lifecycle.sourceSaturation === "OPEN",
    `${sample.temporaryTemplateId}: source saturation drift`,
  );
  assert(!sample.lifecycle.active, `${sample.temporaryTemplateId}: unexpectedly active`);
  assert(
    !sample.lifecycle.questionStudioDiscoverable,
    `${sample.temporaryTemplateId}: unexpected Question Studio exposure`,
  );
  assert(
    !sample.lifecycle.questionBankWritable,
    `${sample.temporaryTemplateId}: unexpected Question Bank write`,
  );
  assert(!sample.lifecycle.testEligible, `${sample.temporaryTemplateId}: unexpected test eligibility`);
  assert(
    !sample.lifecycle.publiclyPublishable,
    `${sample.temporaryTemplateId}: unexpected publication eligibility`,
  );
}

const gapStatusCounts = countBy(
  SER_NUMERIC_GAP_MATRIX.map((dimension) => dimension.status),
);
const expectedGapStatusCounts: Readonly<Record<SerNumericGapStatus, number>> = {
  COVERED: 11,
  PARTIAL: 2,
  OPEN: 13,
};
for (const status of ["COVERED", "PARTIAL", "OPEN"] as const) {
  assert(gapStatusCounts[status] === expectedGapStatusCounts[status], `${status}: gap count drift`);
}

const freezeBlockers = SER_NUMERIC_GAP_MATRIX.filter(
  (dimension) => dimension.blocksPermanentFreeze,
);
assert(freezeBlockers.length === 15, "permanent-freeze blocker count drift");
assert(
  SER_NUMERIC_GAP_MATRIX
    .filter((dimension) => dimension.status === "COVERED")
    .every((dimension) => !dimension.blocksPermanentFreeze),
  "covered dimension incorrectly blocks freeze",
);
assert(
  SER_NUMERIC_GAP_MATRIX
    .filter((dimension) => dimension.status !== "COVERED")
    .every((dimension) => dimension.blocksPermanentFreeze),
  "open or partial dimension does not block freeze",
);

const recommendedWaveCounts = countBy(
  SER_NUMERIC_GAP_MATRIX.map((dimension) => dimension.recommendedWave),
);
assert(recommendedWaveCounts.NONE === 11, "covered-wave count drift");
assert(recommendedWaveCounts.EDGE_DOMAIN_EXPANSION === 3, "edge-domain wave count drift");
assert(
  recommendedWaveCounts.HIGHER_ORDER_AND_RECURRENCE_EXPANSION === 5,
  "higher-order wave count drift",
);
assert(
  recommendedWaveCounts.REPRESENTATION_AND_ANSWER_SEMANTICS_EXPANSION === 6,
  "representation wave count drift",
);
assert(
  recommendedWaveCounts.SOURCE_SATURATION_AND_EDITORIAL_AUDIT === 1,
  "source-saturation wave count drift",
);

console.log(
  JSON.stringify(
    {
      status: "PASS_SER_NUMERIC_GAP_AND_COLLISION_AUDIT",
      checkpointRange: "SER-CP-001..SER-CP-005",
      permanentQlCount: SER_NUMERIC_PERMANENT_QL_COUNT,
      temporaryTemplates: SER_NUMERIC_TEMPLATE_SURFACES.length,
      sourceFamilies: SER_NUMERIC_SOURCE_FAMILIES.length,
      provisionalCanonicalAuthorities: SER_NUMERIC_CANONICAL_AUTHORITIES.length,
      collisionMappings: SER_NUMERIC_COLLISION_MAPPINGS.length,
      netInventoryCompression,
      executableAuditVolume: SER_NUMERIC_EXECUTABLE_AUDIT_VOLUME,
      taskCounts,
      answerSemanticCounts,
      lifecycleSamples: lifecycleSamples.length,
      gapStatusCounts,
      freezeBlockers: freezeBlockers.length,
      freezeDecision: SER_NUMERIC_FREEZE_DECISION,
      recommendedWaveCounts,
      nextImplementationOrder: [
        "EDGE_DOMAIN_EXPANSION",
        "HIGHER_ORDER_AND_RECURRENCE_EXPANSION",
        "REPRESENTATION_AND_ANSWER_SEMANTICS_EXPANSION",
        "SOURCE_SATURATION_AND_EDITORIAL_AUDIT",
      ],
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    },
    null,
    2,
  ),
);

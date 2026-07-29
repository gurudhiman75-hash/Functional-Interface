import {
  MAL_CP001_DISCOVERY_PROTOTYPE_IDS,
  MAL_CP001_GAP_PROTOTYPE_REGISTRY,
} from "./foundation/cp001-gap-registry";
import { MAL_CP001_PROTOTYPE_REGISTRY } from "./foundation/cp001-registry";
import {
  MAL_CP001_FREEZE_CANDIDATE_IDS,
  MAL_CP001_FREEZE_CLASSIFICATION,
} from "./foundation/cp001-freeze-candidate-ledger";
import {
  MAL_CP001_SOURCE_FIXTURE_LEDGER,
} from "./foundation/cp001-source-fixture-ledger";

function fail(message: string): never {
  throw new Error(message);
}

const prototypeIds = [...MAL_CP001_DISCOVERY_PROTOTYPE_IDS];
const classifiedPrototypeIds = MAL_CP001_FREEZE_CLASSIFICATION.map(
  (entry) => entry.prototypeId,
);
const candidateIds = [...MAL_CP001_FREEZE_CANDIDATE_IDS];
const sourceCandidateIds = MAL_CP001_SOURCE_FIXTURE_LEDGER.map(
  (entry) => entry.freezeCandidateId,
);

if (prototypeIds.length !== 15) {
  fail(`Expected 15 executable prototype identities, received ${prototypeIds.length}.`);
}
if (new Set(prototypeIds).size !== prototypeIds.length) {
  fail("Executable prototype identity list contains duplicates.");
}
if (classifiedPrototypeIds.length !== prototypeIds.length) {
  fail("Every executable prototype must have exactly one freeze classification.");
}
if (new Set(classifiedPrototypeIds).size !== classifiedPrototypeIds.length) {
  fail("Freeze classification contains a duplicate prototype row.");
}
for (const prototypeId of prototypeIds) {
  if (!classifiedPrototypeIds.includes(prototypeId)) {
    fail(`Missing freeze classification for ${prototypeId}.`);
  }
}

if (candidateIds.length !== 8) {
  fail(`Expected 8 freeze-preparation candidates after consolidation, received ${candidateIds.length}.`);
}
if (new Set(candidateIds).size !== candidateIds.length) {
  fail("Freeze candidate identity list contains duplicates.");
}
if (new Set(sourceCandidateIds).size !== sourceCandidateIds.length) {
  fail("Source fixture ledger contains duplicate candidate rows.");
}
for (const candidateId of candidateIds) {
  if (!sourceCandidateIds.includes(candidateId)) {
    fail(`Missing source fixture ledger row for ${candidateId}.`);
  }
  const classificationCount = MAL_CP001_FREEZE_CLASSIFICATION.filter(
    (entry) => entry.freezeCandidateId === candidateId,
  ).length;
  if (classificationCount === 0) {
    fail(`Freeze candidate ${candidateId} has no executable prototype evidence.`);
  }
}

const anchorCount = MAL_CP001_FREEZE_CLASSIFICATION.filter(
  (entry) => entry.disposition === "ANCHOR",
).length;
const mergeCount = MAL_CP001_FREEZE_CLASSIFICATION.filter(
  (entry) => entry.disposition === "MERGE",
).length;
if (anchorCount !== candidateIds.length) {
  fail(`Expected one anchor per freeze candidate (${candidateIds.length}), received ${anchorCount}.`);
}
if (mergeCount !== prototypeIds.length - candidateIds.length) {
  fail(`Expected ${prototypeIds.length - candidateIds.length} merged prototype identities, received ${mergeCount}.`);
}

const readinessCounts = new Map<string, number>();
const evidenceStrengthCounts = new Map<string, number>();
const representationCoverage = new Set<string>();
let sourceFixtureCount = 0;
let externalFixtureCount = 0;

for (const entry of MAL_CP001_SOURCE_FIXTURE_LEDGER) {
  readinessCounts.set(
    entry.readiness,
    (readinessCounts.get(entry.readiness) ?? 0) + 1,
  );
  if (entry.fixtures.length === 0) {
    fail(`${entry.freezeCandidateId} has no source fixtures.`);
  }
  for (const fixture of entry.fixtures) {
    sourceFixtureCount += 1;
    evidenceStrengthCounts.set(
      fixture.evidenceStrength,
      (evidenceStrengthCounts.get(fixture.evidenceStrength) ?? 0) + 1,
    );
    if (fixture.evidenceStrength !== "LEGACY_EXECUTABLE") {
      externalFixtureCount += 1;
    }
    if (fixture.legacyFamilyIds.length === 0) {
      fail(`${fixture.fixtureId} lacks legacy-family reconciliation.`);
    }
    for (const representation of fixture.representations) {
      representationCoverage.add(representation);
    }
  }
}

const blockedCandidates = MAL_CP001_SOURCE_FIXTURE_LEDGER.filter(
  (entry) => entry.readiness === "BLOCKED_SOURCE_GAP",
).map((entry) => entry.freezeCandidateId);
const variantGapCandidates = MAL_CP001_SOURCE_FIXTURE_LEDGER.filter(
  (entry) => entry.readiness === "SUPPORTED_WITH_VARIANT_GAP",
).map((entry) => entry.freezeCandidateId);

if (blockedCandidates.length !== 1) {
  fail(`Expected exactly one direct-source blocker, received ${blockedCandidates.length}.`);
}
if (
  blockedCandidates[0] !==
  "MAL-CP001-FREEZE-THREE-WAY-RELATION-QUANTITY"
) {
  fail(`Unexpected blocked candidate: ${blockedCandidates[0]}.`);
}
if (variantGapCandidates.length !== 2) {
  fail(`Expected two supported candidates with variant-level gaps, received ${variantGapCandidates.length}.`);
}

const requiredRepresentations = [
  "DIRECT_PROSE",
  "RATIO_INPUT",
  "EXPLICIT_QUANTITIES",
  "MULTI_COMPONENT",
  "PREBLEND_OR_TWO_STAGE",
  "TOTAL_SCALE_CONSTRAINT",
  "DIFFERENCE_SCALE_CONSTRAINT",
  "COUPLED_RELATION_CONSTRAINT",
] as const;
for (const representation of requiredRepresentations) {
  if (!representationCoverage.has(representation)) {
    fail(`Missing source-format coverage for ${representation}.`);
  }
}

const structuralRepresentationDecisions = {
  compactTable: "RENDERER_VARIANT_NOT_A_LEARNER_CONTRACT",
  dataSufficiency: "REASSIGN_TO_DATA_SUFFICIENCY_PRESENTATION_LAYER",
  impossibleOrIndeterminate:
    "DEFER_UNLESS_DIRECT_TARGET_EXAM_EVIDENCE_JUSTIFIES_A_DETERMINACY_CONTRACT",
} as const;

if (
  MAL_CP001_PROTOTYPE_REGISTRY.some((entry) => entry.permanentQlId !== null) ||
  MAL_CP001_GAP_PROTOTYPE_REGISTRY.some((entry) => entry.permanentQlId !== null)
) {
  fail("Permanent QL allocation occurred before the freeze gate closed.");
}

console.log(JSON.stringify({
  status: "PASS_FREEZE_PREPARATION_WITH_ALLOCATION_BLOCKER",
  executablePrototypeCount: prototypeIds.length,
  freezeCandidateCount: candidateIds.length,
  anchorCount,
  mergedPrototypeCount: mergeCount,
  sourceFixtureCount,
  externalFixtureCount,
  readinessCounts: Object.fromEntries([...readinessCounts.entries()].sort()),
  evidenceStrengthCounts: Object.fromEntries(
    [...evidenceStrengthCounts.entries()].sort(),
  ),
  representationCoverage: [...representationCoverage].sort(),
  blockedCandidates,
  variantGapCandidates,
  structuralRepresentationDecisions,
  permanentQlCount: 0,
  allocationBlocked: true,
  allocationBlockReason:
    "The exact three-way coupled quantity-relation pattern still lacks direct recovered source evidence; two additional candidates retain variant-level evidence gaps.",
}, null, 2));

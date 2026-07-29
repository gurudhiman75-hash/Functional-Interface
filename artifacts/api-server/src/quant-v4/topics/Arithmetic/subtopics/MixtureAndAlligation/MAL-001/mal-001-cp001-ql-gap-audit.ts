import {
  MAL_CP001_CP002_REFERRED_PROTOTYPE_IDS,
  MAL_CP001_DEFERRED_PROTOTYPE_IDS,
  MAL_CP001_HELD_PROTOTYPE_IDS,
} from "./foundation/cp001-product-approval";
import {
  MAL_CP001_PROVISIONAL_QL_TEMPLATES,
  MAL_CP001_PROVISIONAL_SOLVE_MODES,
} from "./foundation/cp001-ql-expansion-ledger";
import {
  MAL_CP001_QL_GAP_IDS,
  MAL_CP001_QL_GAP_LEDGER,
} from "./foundation/cp001-ql-gap-ledger";
import {
  MAL_CP001_OWNERSHIP_RESOLUTION_IDS,
  MAL_CP001_OWNERSHIP_RESOLUTIONS,
} from "./foundation/cp001-ownership-resolution-ledger";

function fail(message: string): never {
  throw new Error(message);
}

if (MAL_CP001_QL_GAP_LEDGER.length !== MAL_CP001_QL_GAP_IDS.length) {
  fail(
    `Gap ledger size mismatch: ${MAL_CP001_QL_GAP_LEDGER.length}/${MAL_CP001_QL_GAP_IDS.length}.`,
  );
}
const gapIds = MAL_CP001_QL_GAP_LEDGER.map((entry) => entry.gapId);
if (new Set(gapIds).size !== gapIds.length) {
  fail("QL gap ledger contains duplicate rows.");
}
for (const gapId of MAL_CP001_QL_GAP_IDS) {
  if (!gapIds.includes(gapId)) fail(`Missing QL gap decision for ${gapId}.`);
}

const dispositionCounts = new Map<string, number>();
const sourceStatusCounts = new Map<string, number>();
let rawOpenEvidenceOrOwnershipGapCount = 0;
let directSourceRequiredCount = 0;
let admittedTemplateCount = 0;

for (const entry of MAL_CP001_QL_GAP_LEDGER) {
  dispositionCounts.set(
    entry.disposition,
    (dispositionCounts.get(entry.disposition) ?? 0) + 1,
  );
  sourceStatusCounts.set(
    entry.sourceStatus,
    (sourceStatusCounts.get(entry.sourceStatus) ?? 0) + 1,
  );
  if (entry.openEvidenceGap) rawOpenEvidenceOrOwnershipGapCount += 1;
  if (entry.requiresDirectSourceEvidence) directSourceRequiredCount += 1;
  if (entry.newQlTemplateAdmitted) admittedTemplateCount += 1;

  if (!entry.candidateDirection.trim() || !entry.rationale.trim()) {
    fail(`${entry.gapId} lacks a complete gap decision.`);
  }
  if (entry.openEvidenceGap && entry.representedBy !== null) {
    fail(`${entry.gapId} is open but incorrectly claims an existing representation.`);
  }
  if (
    entry.disposition === "SOURCE_EVIDENCE_REQUIRED" &&
    (!entry.openEvidenceGap || !entry.requiresDirectSourceEvidence)
  ) {
    fail(`${entry.gapId} source-required decision is not marked as an open direct-evidence gap.`);
  }
}

if (admittedTemplateCount !== 0) {
  fail(`The gap audit silently admitted ${admittedTemplateCount} new QL templates.`);
}
if (rawOpenEvidenceOrOwnershipGapCount !== 5) {
  fail(
    `Expected the historical gap pass to contain 5 open evidence/ownership rows, received ${rawOpenEvidenceOrOwnershipGapCount}.`,
  );
}
if (MAL_CP001_PROVISIONAL_SOLVE_MODES.length !== 7) {
  fail("Gap audit changed the provisional solve-mode frontier.");
}
if (MAL_CP001_PROVISIONAL_QL_TEMPLATES.length !== 11) {
  fail("Gap audit changed the provisional QL-template frontier.");
}

const gapById = new Map(MAL_CP001_QL_GAP_LEDGER.map((entry) => [entry.gapId, entry]));

if (MAL_CP001_OWNERSHIP_RESOLUTIONS.length !== 2) {
  fail(
    `Expected 2 ownership resolutions, received ${MAL_CP001_OWNERSHIP_RESOLUTIONS.length}.`,
  );
}
const resolutionIds = MAL_CP001_OWNERSHIP_RESOLUTIONS.map(
  (entry) => entry.resolutionId,
);
if (
  resolutionIds.length !== MAL_CP001_OWNERSHIP_RESOLUTION_IDS.length ||
  new Set(resolutionIds).size !== resolutionIds.length
) {
  fail("Ownership-resolution IDs are incomplete or duplicated.");
}
for (const resolutionId of MAL_CP001_OWNERSHIP_RESOLUTION_IDS) {
  if (!resolutionIds.includes(resolutionId)) {
    fail(`Missing ownership resolution ${resolutionId}.`);
  }
}

const resolvedGapIds = new Set<string>();
for (const resolution of MAL_CP001_OWNERSHIP_RESOLUTIONS) {
  const supersededGap = gapById.get(resolution.supersededGapId);
  if (!supersededGap || !supersededGap.openEvidenceGap) {
    fail(`${resolution.resolutionId} does not supersede an open ownership row.`);
  }
  if (
    resolution.newQlTemplateAdmitted ||
    resolution.openOwnershipGap ||
    !resolution.representedBy.trim() ||
    resolution.sourceBasis.length < 2
  ) {
    fail(`${resolution.resolutionId} is incomplete or escaped the non-admitting boundary.`);
  }
  if (resolvedGapIds.has(resolution.supersededGapId)) {
    fail(`Ownership gap resolved twice: ${resolution.supersededGapId}.`);
  }
  resolvedGapIds.add(resolution.supersededGapId);
}

const effectiveOpenEvidenceGapCount =
  rawOpenEvidenceOrOwnershipGapCount - resolvedGapIds.size;
if (effectiveOpenEvidenceGapCount !== 3) {
  fail(`Expected 3 effective open source gaps, received ${effectiveOpenEvidenceGapCount}.`);
}

const finalTotal = gapById.get("MAL-CP001-GAP-FINAL-TOTAL-QUANTITY");
const differenceOutput = gapById.get("MAL-CP001-GAP-QUANTITY-DIFFERENCE-OUTPUT");
const determinacy = gapById.get("MAL-CP001-GAP-IMPOSSIBLE-OR-INDETERMINATE");
for (const entry of [finalTotal, differenceOutput, determinacy]) {
  if (
    !entry ||
    entry.disposition !== "SOURCE_EVIDENCE_REQUIRED" ||
    entry.sourceStatus !== "NO_DIRECT_FIXTURE_RECOVERED" ||
    entry.newQlTemplateAdmitted ||
    resolvedGapIds.has(entry.gapId)
  ) {
    fail("An unsupported learner-output gap was prematurely admitted, dismissed or ownership-resolved.");
  }
}

const concentration = gapById.get("MAL-CP001-GAP-STATIC-CONCENTRATION-OWNERSHIP");
const concentrationResolution = MAL_CP001_OWNERSHIP_RESOLUTIONS.find(
  (entry) =>
    entry.resolutionId === "MAL-CP001-OWNERSHIP-STATIC-CONCENTRATION",
);
if (
  !concentration ||
  concentration.disposition !== "OWNERSHIP_BOUNDARY_CP004" ||
  !concentration.openEvidenceGap ||
  !concentrationResolution ||
  concentrationResolution.supersededGapId !== concentration.gapId ||
  concentrationResolution.boundaryOwner !== "MAL-CP-004" ||
  concentrationResolution.openOwnershipGap ||
  concentrationResolution.newQlTemplateAdmitted
) {
  fail("Static concentration ownership was not resolved to CP-001 static blend / CP-004 transformation boundary.");
}

const vessel = gapById.get("MAL-CP001-GAP-VESSEL-COMBINATION-OWNERSHIP");
const vesselResolution = MAL_CP001_OWNERSHIP_RESOLUTIONS.find(
  (entry) =>
    entry.resolutionId === "MAL-CP001-OWNERSHIP-DIRECT-VESSEL-COMBINATION",
);
if (
  !vessel ||
  vessel.disposition !== "OWNERSHIP_BOUNDARY_CP006" ||
  !vessel.openEvidenceGap ||
  !vesselResolution ||
  vesselResolution.supersededGapId !== vessel.gapId ||
  vesselResolution.boundaryOwner !== "MAL-CP-006" ||
  vesselResolution.openOwnershipGap ||
  vesselResolution.newQlTemplateAdmitted
) {
  fail("Direct vessel-combination ownership was not resolved to CP-001 static blend / CP-006 transfer-ledger boundary.");
}

const differenceInput = gapById.get("MAL-CP001-GAP-DIFFERENCE-AS-SCALE-INPUT");
if (
  !differenceInput ||
  differenceInput.disposition !== "DEFERRED_BY_APPROVAL" ||
  MAL_CP001_DEFERRED_PROTOTYPE_IDS.length !== 1 ||
  MAL_CP001_DEFERRED_PROTOTYPE_IDS[0] !== "MAL-CP001-PROT-DIFFERENCE-BASED-QUANTITIES"
) {
  fail("Difference-as-scale approval disposition drifted.");
}
const twoStageInverse = gapById.get("MAL-CP001-GAP-TWO-STAGE-INVERSE");
if (
  !twoStageInverse ||
  twoStageInverse.disposition !== "HELD_BY_APPROVAL" ||
  MAL_CP001_HELD_PROTOTYPE_IDS.length !== 1 ||
  MAL_CP001_HELD_PROTOTYPE_IDS[0] !== "MAL-CP001-PROT-TWO-STAGE-UNKNOWN"
) {
  fail("Two-stage inverse approval disposition drifted.");
}
const threeWay = gapById.get("MAL-CP001-GAP-THREE-WAY-COUPLED-RELATION");
if (
  !threeWay ||
  threeWay.disposition !== "REFERRED_TO_CP002_BY_APPROVAL" ||
  MAL_CP001_CP002_REFERRED_PROTOTYPE_IDS.length !== 1 ||
  MAL_CP001_CP002_REFERRED_PROTOTYPE_IDS[0] !==
    "MAL-CP001-PROT-THREE-WAY-TARGET-WITH-RELATION"
) {
  fail("Three-way CP-002 referral drifted.");
}

const rendererOrMergeCount = MAL_CP001_QL_GAP_LEDGER.filter((entry) =>
  [
    "MERGE_PARAMETER_VARIANT",
    "MERGE_INSTANCE_VARIANT",
    "MERGE_SCENARIO_VARIANT",
    "RENDERER_VARIANT",
    "PRESENTATION_LAYER",
  ].includes(entry.disposition),
).length;
if (rendererOrMergeCount !== 9) {
  fail(`Expected 9 non-QL representation/parameter decisions, received ${rendererOrMergeCount}.`);
}

console.log(JSON.stringify({
  status: "PASS_QL_GAP_AUDIT_WITH_THREE_OPEN_SOURCE_GAPS",
  gapDecisionCount: MAL_CP001_QL_GAP_LEDGER.length,
  admittedNewQlTemplateCount: admittedTemplateCount,
  provisionalSolveModeCount: MAL_CP001_PROVISIONAL_SOLVE_MODES.length,
  provisionalQlTemplateCount: MAL_CP001_PROVISIONAL_QL_TEMPLATES.length,
  historicalOpenEvidenceOrOwnershipGapCount: rawOpenEvidenceOrOwnershipGapCount,
  resolvedOwnershipGapCount: resolvedGapIds.size,
  effectiveOpenEvidenceGapCount,
  directSourceRequiredCount,
  rendererOrMergeDecisionCount: rendererOrMergeCount,
  dispositionCounts: Object.fromEntries([...dispositionCounts.entries()].sort()),
  sourceStatusCounts: Object.fromEntries([...sourceStatusCounts.entries()].sort()),
  freezeReady: false,
  permanentQlCount: 0,
  publiclyPublishable: false,
  questionStudioDiscoverable: false,
}, null, 2));

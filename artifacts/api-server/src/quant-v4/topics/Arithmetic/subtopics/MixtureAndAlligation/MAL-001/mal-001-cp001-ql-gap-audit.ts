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
let openEvidenceGapCount = 0;
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
  if (entry.openEvidenceGap) openEvidenceGapCount += 1;
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
if (openEvidenceGapCount !== 5) {
  fail(`Expected 5 open evidence/ownership gaps, received ${openEvidenceGapCount}.`);
}
if (MAL_CP001_PROVISIONAL_SOLVE_MODES.length !== 7) {
  fail("Gap audit changed the provisional solve-mode frontier.");
}
if (MAL_CP001_PROVISIONAL_QL_TEMPLATES.length !== 11) {
  fail("Gap audit changed the provisional QL-template frontier.");
}

const gapById = new Map(MAL_CP001_QL_GAP_LEDGER.map((entry) => [entry.gapId, entry]));
const finalTotal = gapById.get("MAL-CP001-GAP-FINAL-TOTAL-QUANTITY");
const differenceOutput = gapById.get("MAL-CP001-GAP-QUANTITY-DIFFERENCE-OUTPUT");
const determinacy = gapById.get("MAL-CP001-GAP-IMPOSSIBLE-OR-INDETERMINATE");
for (const entry of [finalTotal, differenceOutput, determinacy]) {
  if (
    !entry ||
    entry.disposition !== "SOURCE_EVIDENCE_REQUIRED" ||
    entry.sourceStatus !== "NO_DIRECT_FIXTURE_RECOVERED" ||
    entry.newQlTemplateAdmitted
  ) {
    fail("An unsupported learner-output gap was prematurely admitted or dismissed.");
  }
}

const concentration = gapById.get("MAL-CP001-GAP-STATIC-CONCENTRATION-OWNERSHIP");
if (
  !concentration ||
  concentration.disposition !== "OWNERSHIP_BOUNDARY_CP004" ||
  !concentration.openEvidenceGap
) {
  fail("Static concentration ownership must remain open against CP-004.");
}
const vessel = gapById.get("MAL-CP001-GAP-VESSEL-COMBINATION-OWNERSHIP");
if (
  !vessel ||
  vessel.disposition !== "OWNERSHIP_BOUNDARY_CP006" ||
  !vessel.openEvidenceGap
) {
  fail("Direct vessel-combination ownership must remain open against CP-006.");
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
  status: "PASS_QL_GAP_AUDIT_WITH_OPEN_EVIDENCE_GAPS",
  gapDecisionCount: MAL_CP001_QL_GAP_LEDGER.length,
  admittedNewQlTemplateCount: admittedTemplateCount,
  provisionalSolveModeCount: MAL_CP001_PROVISIONAL_SOLVE_MODES.length,
  provisionalQlTemplateCount: MAL_CP001_PROVISIONAL_QL_TEMPLATES.length,
  openEvidenceGapCount,
  directSourceRequiredCount,
  rendererOrMergeDecisionCount: rendererOrMergeCount,
  dispositionCounts: Object.fromEntries([...dispositionCounts.entries()].sort()),
  sourceStatusCounts: Object.fromEntries([...sourceStatusCounts.entries()].sort()),
  freezeReady: false,
  permanentQlCount: 0,
  publiclyPublishable: false,
  questionStudioDiscoverable: false,
}, null, 2));

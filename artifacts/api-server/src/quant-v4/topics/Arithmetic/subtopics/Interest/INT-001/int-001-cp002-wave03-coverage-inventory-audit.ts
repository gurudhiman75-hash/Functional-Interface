import { listQuantV4Packages } from "../../../../../generation-engine";
import { INT_CP002_WAVE01_PROTOTYPE_IDS } from "./cp002-wave01-types";
import { INT_CP002_WAVE02_PROTOTYPE_IDS } from "./cp002-wave02-types";
import {
  INT_CP002_WAVE03_EXISTING_COVERAGE,
  INT_CP002_WAVE03_INVENTORY,
  INT_CP002_WAVE03_OPEN_GAPS,
} from "./cp002-wave03-coverage-inventory";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value);
}

const registryBeforePackages = listQuantV4Packages();
const registryBefore = stable(registryBeforePackages);
assert(!registryBeforePackages.some((item) => String(item.packageId) === "INT-001"), "INT-001 is centrally registered before Wave 3 inventory audit");

const expectedIds = [...INT_CP002_WAVE01_PROTOTYPE_IDS, ...INT_CP002_WAVE02_PROTOTYPE_IDS];
const coveredIds = INT_CP002_WAVE03_EXISTING_COVERAGE.map((item) => item.prototypeId);
assert(INT_CP002_WAVE03_EXISTING_COVERAGE.length === expectedIds.length, "Wave 3 inventory does not cover every Wave 1/2 prototype");
assert(new Set(coveredIds).size === coveredIds.length, "Wave 3 inventory contains duplicate prototype IDs");
for (const prototypeId of expectedIds) {
  assert(coveredIds.includes(prototypeId), `Wave 3 inventory omitted '${prototypeId}'`);
}
for (const prototypeId of coveredIds) {
  assert(expectedIds.includes(prototypeId as never), `Wave 3 inventory contains unknown prototype '${prototypeId}'`);
}

const ancestryCoverage = new Map<string, number>();
const unknownCoverage = new Map<string, number>();
const dispositionCoverage = new Map<string, number>();
for (const item of INT_CP002_WAVE03_EXISTING_COVERAGE) {
  ancestryCoverage.set(item.ancestry, (ancestryCoverage.get(item.ancestry) ?? 0) + 1);
  unknownCoverage.set(item.unknown, (unknownCoverage.get(item.unknown) ?? 0) + 1);
  dispositionCoverage.set(item.disposition, (dispositionCoverage.get(item.disposition) ?? 0) + 1);
  assert(item.representation === "NARRATIVE", `${item.prototypeId}: pre-Wave-3 representation must remain narrative`);
  assert(item.contributionCount === "ONE" || item.contributionCount === "TWO", `${item.prototypeId}: unsupported contribution count in current inventory`);
}
assert(ancestryCoverage.size === 8, `Expected 8 current ancestries, received ${ancestryCoverage.size}`);
assert(unknownCoverage.has("INTEREST"), "Direct-interest coverage missing");
assert(unknownCoverage.has("PRINCIPAL"), "Principal inverse coverage missing");
assert(unknownCoverage.has("RATE"), "Rate inverse coverage missing");
assert(unknownCoverage.has("TIME"), "Time inverse coverage missing");
assert(unknownCoverage.has("REPAYMENT_AMOUNT"), "Repayment-amount inverse coverage missing");
assert(unknownCoverage.has("REPAYMENT_TIME"), "Repayment-time inverse coverage missing");
assert(unknownCoverage.has("DAYS"), "Day-count inverse coverage missing");

const gapIds = INT_CP002_WAVE03_OPEN_GAPS.map((item) => item.gapId);
assert(gapIds.length > 0, "Wave 3 inventory incorrectly claims no open gaps");
assert(new Set(gapIds).size === gapIds.length, "Wave 3 inventory contains duplicate gap IDs");
const plannedWaveCoverage = new Map<string, number>();
const gapAxisCoverage = new Map<string, number>();
for (const gap of INT_CP002_WAVE03_OPEN_GAPS) {
  plannedWaveCoverage.set(gap.plannedWave, (plannedWaveCoverage.get(gap.plannedWave) ?? 0) + 1);
  gapAxisCoverage.set(gap.axis, (gapAxisCoverage.get(gap.axis) ?? 0) + 1);
  assert(gap.description.trim().length >= 30, `${gap.gapId}: gap description is too thin`);
  assert(gap.disposition !== "RETAIN_PENDING_MERGE_SPLIT" && gap.disposition !== "MERGE_WITH_ANCESTRY", `${gap.gapId}: open gap has a closed-prototype disposition`);
}
assert(plannedWaveCoverage.has("WAVE03A_EDGE_RUNTIME"), "Wave 3A executable edge plan missing");
assert(plannedWaveCoverage.has("WAVE03B_REPRESENTATION"), "Wave 3B representation plan missing");
assert(plannedWaveCoverage.has("WAVE03C_OWNERSHIP_AUDIT"), "Wave 3C ownership plan missing");
assert(gapAxisCoverage.has("UNKNOWN_POSITION"), "Unknown-position gaps missing");
assert(gapAxisCoverage.has("CONTRIBUTION_TOPOLOGY"), "Contribution-topology gaps missing");
assert(gapAxisCoverage.has("EVENT_TOPOLOGY"), "Event-topology gaps missing");
assert(gapAxisCoverage.has("UNIT_EDGE"), "Unit-edge gaps missing");
assert(gapAxisCoverage.has("REPRESENTATION"), "Representation gaps missing");
assert(gapAxisCoverage.has("OWNERSHIP"), "Ownership gaps missing");

assert(INT_CP002_WAVE03_INVENTORY.permanentQlCount === 0, "Permanent QLs allocated before gap closure");
assert(INT_CP002_WAVE03_INVENTORY.frozenSolveContractCount === 0, "Solve contracts frozen before gap closure");
assert(INT_CP002_WAVE03_INVENTORY.status === "GAPS_OPEN_EXECUTABLE_DISCOVERY_CONTINUES", "Wave 3 status does not acknowledge open gaps");
assert(INT_CP002_WAVE03_INVENTORY.enabled === false, "Wave 3 inventory enabled runtime delivery");
assert(INT_CP002_WAVE03_INVENTORY.registrationStatus === "NOT_REGISTERED", "Wave 3 inventory changed registration status");
assert(INT_CP002_WAVE03_INVENTORY.questionStudioDiscoverable === false, "Wave 3 inventory enabled Question Studio discovery");
assert(INT_CP002_WAVE03_INVENTORY.questionBankStatus === "NOT_STORED", "Wave 3 inventory enabled Question Bank storage");
assert(INT_CP002_WAVE03_INVENTORY.testEligibility === "INELIGIBLE", "Wave 3 inventory enabled test eligibility");
assert(INT_CP002_WAVE03_INVENTORY.publiclyPublishable === false, "Wave 3 inventory enabled publication");

const registryAfterPackages = listQuantV4Packages();
const registryAfter = stable(registryAfterPackages);
assert(registryAfter === registryBefore, "Central Quant V4 registry changed during Wave 3 inventory audit");
assert(!registryAfterPackages.some((item) => String(item.packageId) === "INT-001"), "Wave 3 inventory introduced INT-001 into the central registry");

console.log(JSON.stringify({
  packageId: "INT-001",
  canonicalProblemId: "INT-CP-002",
  auditId: "INT-CP-002-WAVE03-COVERAGE-INVENTORY-V1",
  existingPrototypeCount: INT_CP002_WAVE03_EXISTING_COVERAGE.length,
  wave01PrototypeCount: INT_CP002_WAVE01_PROTOTYPE_IDS.length,
  wave02PrototypeCount: INT_CP002_WAVE02_PROTOTYPE_IDS.length,
  ancestryCoverage: Object.fromEntries(ancestryCoverage),
  unknownCoverage: Object.fromEntries(unknownCoverage),
  dispositionCoverage: Object.fromEntries(dispositionCoverage),
  openGapCount: INT_CP002_WAVE03_OPEN_GAPS.length,
  plannedWaveCoverage: Object.fromEntries(plannedWaveCoverage),
  gapAxisCoverage: Object.fromEntries(gapAxisCoverage),
  permanentQlCount: 0,
  frozenSolveContractCount: 0,
  registryChecks: 3,
  enabled: false,
  stagingStatus: "NOT_STAGED",
  registrationStatus: "NOT_REGISTERED",
  questionStudioDiscoverable: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
console.log("PASS_INT_CP002_WAVE03_COVERAGE_INVENTORY_V1");

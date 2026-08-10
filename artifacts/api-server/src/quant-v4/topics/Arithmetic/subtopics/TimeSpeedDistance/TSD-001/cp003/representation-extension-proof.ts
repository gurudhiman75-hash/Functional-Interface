import { TSD_FINAL_LEARNER_AUTHORITIES } from "../final-authority-registry";
import {
  TSD_CP003_NEW_AUTHORITY_CANDIDATES,
  TSD_CP003_PRIOR_REPRESENTATIONS,
} from "./post-overlap-authority-registry";
import { generateCp003PostOverlapReviewRows } from "./post-overlap-review";
import { TSD_CP003_REPRESENTATION_EXTENSION_APPROVALS } from "./representation-extension-approval";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const approvals = TSD_CP003_REPRESENTATION_EXTENSION_APPROVALS;
assert(approvals.length === 9, `Expected 9 representation-extension approvals, received ${approvals.length}`);
assert(new Set(approvals.map((approval) => approval.solveMode)).size === 9, "Duplicate CP-003 representation-extension solve mode");
assert(new Set(approvals.map((approval) => approval.targetAuthority)).size === 8, "Expected 8 distinct prior authority targets");

const approvedByMode = new Map(approvals.map((approval) => [approval.solveMode, approval] as const));
const auditedByMode = new Map(TSD_CP003_PRIOR_REPRESENTATIONS.map((representation) => [representation.solveMode, representation] as const));
assert(auditedByMode.size === 9, `Expected 9 audited prior representations, received ${auditedByMode.size}`);

for (const [solveMode, audited] of auditedByMode) {
  const approval = approvedByMode.get(solveMode as never);
  assert(approval, `${solveMode}: audited prior representation has no explicit approval`);
  assert(approval.targetAuthority === audited.targetAuthority, `${solveMode}: approved target ${approval.targetAuthority} disagrees with overlap audit target ${audited.targetAuthority}`);
  assert(approval.decision === "APPROVED_AS_CP003_REPRESENTATION_EXTENSION", `${solveMode}: representation extension is not approved`);
  assert(approval.priorFrozenEnglishMutationAllowed === false, `${solveMode}: approval permits mutation of frozen CP-001/002 English`);
  assert(approval.newPermanentQlRequired === false, `${solveMode}: representation extension incorrectly requests a new permanent QL`);
  assert(approval.cp003EnglishFreezeStatus === "UNFROZEN", `${solveMode}: CP-003 English was frozen by representation approval`);
  assert(approval.rationale.length >= 120, `${solveMode}: representation-extension rationale is too thin`);
}

const priorAuthorityKeys = new Set(TSD_FINAL_LEARNER_AUTHORITIES.map((authority) => authority.authorityKey));
const newCp003AuthorityKeys = new Set(TSD_CP003_NEW_AUTHORITY_CANDIDATES.map((authority) => authority.authorityKey));
for (const approval of approvals) {
  assert(priorAuthorityKeys.has(approval.targetAuthority), `${approval.solveMode}: approved target is not a finalized prior learner authority`);
  assert(!newCp003AuthorityKeys.has(approval.targetAuthority), `${approval.solveMode}: prior representation target also appears as a new CP-003 authority`);
  assert(approval.authorityOwnerCheckpointId === "TSD-CP-001" || approval.authorityOwnerCheckpointId === "TSD-CP-002", `${approval.solveMode}: invalid prior owner checkpoint`);
}

const rows = generateCp003PostOverlapReviewRows(3);
const extensionRows = rows.filter((row) => row.ownershipDisposition === "PRIOR_CHECKPOINT_REPRESENTATION");
assert(extensionRows.length === 27, `Expected 27 accepted representation-extension rows, received ${extensionRows.length}`);
assert(new Set(extensionRows.map((row) => row.solveMode)).size === 9, "Accepted review does not cover all nine approved representation families");

for (const row of extensionRows) {
  const approval = approvedByMode.get(row.solveMode as never);
  assert(approval, `${row.solveMode}: accepted representation row has no approval`);
  assert(row.authorityKey === approval.targetAuthority, `${row.solveMode}: review row is mapped to the wrong prior authority`);
  assert(row.authorityOwnerCheckpointId === approval.authorityOwnerCheckpointId, `${row.solveMode}: review owner checkpoint disagrees with approval`);
  assert(row.contentCheckpointId === "TSD-CP-003", `${row.solveMode}: representation content is no longer owned by CP-003`);
  assert(row.permanentQlId === null, `${row.solveMode}: representation row allocated a new permanent QL`);
  assert(row.lifecycle.englishFreezeStatus === "UNFROZEN", `${row.solveMode}: CP-003 representation row is prematurely frozen`);
  assert(row.difficulty.status === "EDITORIALLY_CALIBRATED", `${row.solveMode}: accepted representation row lacks calibrated difficulty`);
}

const allocationExtensions = approvals.filter((approval) => approval.targetAuthority === "segmentAllocationFromTotalsAndSpeeds");
assert(allocationExtensions.length === 2, "segmentAllocationFromTotalsAndSpeeds must own both speed-change-point and walking/riding extensions");
assert(new Set(allocationExtensions.map((approval) => approval.solveMode)).has("speedChangePointDistance"), "speedChangePointDistance allocation extension missing");
assert(new Set(allocationExtensions.map((approval) => approval.solveMode)).has("walkingRidingAllocation"), "walkingRidingAllocation extension missing");

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP003_REPRESENTATION_EXTENSION_APPROVAL",
  approvedRepresentationFamilies: approvals.length,
  distinctPriorAuthorityTargets: new Set(approvals.map((approval) => approval.targetAuthority)).size,
  acceptedRepresentationRows: extensionRows.length,
  priorFrozenEnglishMutationsAuthorized: 0,
  newPermanentQlRequirements: 0,
  cp003EnglishFreezeStatus: "UNFROZEN",
  permanentQlCount: 0,
}, null, 2));
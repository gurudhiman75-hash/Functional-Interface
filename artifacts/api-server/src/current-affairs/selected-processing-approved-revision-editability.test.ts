import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const approvalCard = readFileSync(
  "artifacts/admin-app/src/features/current-affairs/CurrentAffairsMasterPackApprovalCard.tsx",
  "utf8",
);
const workspace = readFileSync(
  "artifacts/admin-app/src/features/current-affairs/CurrentAffairsPackEditorialWorkspace.tsx",
  "utf8",
);
const approvalRuntime = readFileSync(
  "artifacts/api-server/src/current-affairs/daily-master-pack-approval-runtime.ts",
  "utf8",
);
const productionClient = readFileSync(
  "artifacts/admin-app/src/features/current-affairs/production-ops-api.ts",
  "utf8",
);
const productionRoute = readFileSync(
  "artifacts/api-server/src/routes/admin-current-affairs-production-ops.ts",
  "utf8",
);

// Approved state must never be a dead end. The approved snapshot remains immutable,
// while the date has an explicit audited revision path back to review.
assert.match(approvalCard, /Modify approved pack/);
assert.match(approvalCard, /This approved version is immutable, but the date is not permanently locked/);
assert.match(approvalCard, /remains in history and EN\/HI\/PA were returned to review for modification/);
assert.match(approvalCard, /next successful approval becomes a new version/);
assert.match(approvalCard, /Modification never rewrites the approved snapshot in place/);
assert.match(approvalCard, /reason\.trim\(\)\.length < 8/);

// The revision action must be surfaced before the disabled event editor / refresh controls,
// rather than requiring an admin to discover a hidden unlock action lower on the page.
const revisionControlIndex = workspace.indexOf("packLocked ? <CurrentAffairsMasterPackApprovalCard");
const editorIndex = workspace.indexOf('Selected pack events');
const refreshIndex = workspace.indexOf('Pack refresh & QA');
assert.ok(revisionControlIndex >= 0, "locked workspace must surface the approval/revision control");
assert.ok(editorIndex > revisionControlIndex, "revision control must appear before the event editor");
assert.ok(refreshIndex > revisionControlIndex, "revision control must appear before refresh + QA controls");
assert.match(workspace, /This approved version is locked, not permanently uneditable/);
assert.match(workspace, /Approve version/);
assert.match(workspace, /Download version/);
assert.match(workspace, /Approval freezes one auditable version; it does not permanently freeze the date/);

assert.match(productionClient, /revokeDailyMasterPackApproval/);
assert.match(productionClient, /master-pack-approval\/revoke/);
assert.match(productionRoute, /\/production\/master-pack-approval\/revoke/);
assert.match(productionRoute, /content\.questions\.update/);

assert.match(approvalRuntime, /SET status='revoked'/);
assert.match(approvalRuntime, /SET status='review'/);
assert.match(approvalRuntime, /status='published'/);
assert.match(approvalRuntime, /Cannot revoke canonical master-pack approval after learner publication/);
assert.match(approvalRuntime, /current_affairs\.master_pack\.approval_revoked/);
assert.match(approvalRuntime, /nextApprovalVersion/);
assert.doesNotMatch(
  approvalRuntime,
  /UPDATE content\.current_affairs_daily_master_pack_approval_packs\s+SET payload_sha256/i,
  "approved payload snapshots must not be rewritten during revision",
);

console.log("CP-075 approved Daily Pack revision/editability contract passed");

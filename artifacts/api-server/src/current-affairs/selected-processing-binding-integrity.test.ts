import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { appointmentIdentity, isOneDayOfficialRescueMatch } from "./one-day-rescue-policy";

const helper = readFileSync(
  "artifacts/api-server/src/current-affairs/selected-binding-integrity-runtime.ts",
  "utf8",
);
const job = readFileSync(
  "artifacts/api-server/src/current-affairs/selected-affairs-processing-job.ts",
  "utf8",
);
const route = readFileSync(
  "artifacts/api-server/src/routes/admin-current-affairs-production-ops.ts",
  "utf8",
);

assert.equal(
  appointmentIdentity("Air Marshal Vivek Hande takes over as DGMS (Air)"),
  "vivek hande",
);
assert.equal(
  appointmentIdentity("Air Marshal Sandeep Thareja takes over as DGAFMS"),
  "sandeep thareja",
);
assert.equal(
  isOneDayOfficialRescueMatch(
    "Air Marshal Vivek Hande takes over as DGMS (Air)",
    "Air Marshal Sandeep Thareja takes over as DGAFMS",
  ).matched,
  false,
  "different named appointees must never be accepted as title-rescue evidence for each other",
);
assert.equal(
  isOneDayOfficialRescueMatch(
    "Air Marshal Vivek Hande takes over as DGMS (Air)",
    "Air Marshal Vivek Hande appointed DGMS (Air)",
  ).matched,
  true,
  "same named appointee should remain eligible when the surrounding action wording changes",
);

assert.match(helper, /ca-cp073-selected-binding-integrity-v1/);
assert.match(helper, /manualEditorialSelectedEventId/);
assert.match(helper, /manualEditorialSelection/);
assert.match(helper, /sourceCandidateId/);
assert.match(helper, /cross_event_target_day_title_match/);
assert.match(helper, /DELETE FROM content\.current_affairs_event_candidates/);
assert.match(helper, /cp054_selected_recovery/);
assert.match(helper, /cp063_selected_blocker_closure/);
assert.match(helper, /captureSelectedPackSnapshot/);
assert.match(helper, /restoreSelectedPackSnapshot/);

const bindingIndex = job.indexOf("repairSelectedCandidateEventBindings");
const primaryRecoveryIndex = job.indexOf("recoverSelectedPrimaryEvidence({ targetDate, actorUserId })");
const blockerRecoveryIndex = job.indexOf("recoverSelectedBlockerFacts({ targetDate, actorUserId })");
const claimCleanupIndex = job.indexOf("pruneSupersededSelectedRecoveryClaims(targetDate)");
const processingIndex = job.indexOf("processSelectedCurrentAffairs({ targetDate, actorUserId })");
assert.ok(bindingIndex >= 0 && primaryRecoveryIndex > bindingIndex, "binding repair must run before primary recovery");
assert.ok(blockerRecoveryIndex > primaryRecoveryIndex, "blocker recovery must follow primary recovery");
assert.ok(claimCleanupIndex > blockerRecoveryIndex, "superseded headline claims must be pruned after blocker recovery");
assert.ok(processingIndex > claimCleanupIndex, "verification reconciliation must run after binding claim cleanup");
assert.match(job, /selectedPackResult\?\.created === true/);
assert.match(job, /restoreSelectedPackSnapshot\(packSnapshot\)/);

assert.match(route, /CURRENT_AFFAIRS_SELECTED_DATE_REPLAY_BLOCKED/);
assert.match(route, /Historical replay is disabled for dates with an admin-selected canonical pack/);
assert.match(route, /selectedHeadlineCount: selectedCount/);

console.log("CP-073 selected binding integrity contract passed");

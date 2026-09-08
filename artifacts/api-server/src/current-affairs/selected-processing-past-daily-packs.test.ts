import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

function read(path: string) {
  return readFileSync(path, "utf8");
}

const onDemand = read("artifacts/api-server/src/current-affairs/on-demand-yesterday-runtime.ts");
const route = read("artifacts/api-server/src/routes/admin-current-affairs-production-ops.ts");
const archiveCard = read("artifacts/admin-app/src/features/current-affairs/CurrentAffairsPastDailyPacksCard.tsx");
const readinessPage = read("artifacts/admin-app/src/pages/content/CurrentAffairsProductionReadinessPage.tsx");

assert.match(onDemand, /materializeSelectedDailyMasterPacks/,
  "historical/on-demand regeneration must know the selected canonical pack boundary");
assert.match(onDemand, /selectedBoundaryActive[\s\S]*?materializeDailyMasterPacks/,
  "broad materialization must be a fallback after selected-boundary evaluation");
assert.match(onDemand, /broad materialization was not allowed to replace the admin-selected boundary/,
  "selected-boundary refusal must be surfaced instead of silently falling back to broad membership");

assert.match(route, /router\.get\("\/production\/master-pack-archive"/,
  "Past Daily Packs must have a read-only archive endpoint");
assert.match(route, /FROM content\.current_affairs_daily_master_packs pack/,
  "archive endpoint must read canonical Daily Master Pack storage");

assert.match(archiveCard, /Open an existing date without replaying it\./,
  "archive UI must state the safe no-replay retrieval path");
assert.match(archiveCard, /getCurrentAffairsDailyMasterPacks\(date\)/,
  "archive UI must fetch stored packs directly by date");
assert.doesNotMatch(archiveCard, /generateHistoricalCurrentAffairs|generateYesterdayCurrentAffairs/,
  "opening Past Daily Packs must never invoke generation/replay APIs");
assert.match(archiveCard, /EN\/HI\/PA event-ID parity is not intact/,
  "archive UI must visibly fail-safe when stored multilingual parity is damaged");

const archivePosition = readinessPage.indexOf("<CurrentAffairsPastDailyPacksCard");
const replayPosition = readinessPage.indexOf("Historical replay · regenerate a date");
assert.ok(archivePosition >= 0 && replayPosition > archivePosition,
  "Past Daily Packs must appear before the destructive/rebuild-style historical replay control");
assert.match(readinessPage, /To view or download an existing pack, use Past Daily Packs above\./,
  "historical replay must direct ordinary retrieval to the archive browser");

console.log("CP-071 Past Daily Packs and selected replay-boundary contract passed");

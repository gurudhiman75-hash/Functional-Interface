import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const route = readFileSync("artifacts/api-server/src/routes/admin-current-affairs-pack-editorial.ts", "utf8");
const app = readFileSync("artifacts/api-server/src/app.ts", "utf8");
const workspace = readFileSync("artifacts/admin-app/src/features/current-affairs/CurrentAffairsPackEditorialWorkspace.tsx", "utf8");
const archive = readFileSync("artifacts/admin-app/src/features/current-affairs/CurrentAffairsPastDailyPacksCard.tsx", "utf8");
const client = readFileSync("artifacts/admin-app/src/features/current-affairs/pack-editorial-api.ts", "utf8");

assert.match(route, /\/production\/master-pack\/editorial-refresh/);
assert.match(route, /materializeSelectedDailyMasterPacks/);
assert.match(route, /content\.questions\.update/);
assert.match(route, /publicationAuthority:\s*false/);
assert.match(route, /questionBankPromotionAuthority:\s*false/);
assert.doesNotMatch(route, /generateYesterdayCurrentAffairsOnDemand|generateHistoricalCurrentAffairs|runOpenNewsDiscovery|runScheduledFeedIngestion/);
assert.doesNotMatch(route, /import\s*\{[^}]*materializeSelectedDailyMasterPacks[^}]*\}\s*from/,
  "pack editorial route must not eagerly import selected pack materialization into the API startup graph");
assert.doesNotMatch(route, /import\s*\{[^}]*loadDailyMasterPackApprovalCandidate[^}]*\}\s*from/,
  "pack editorial route must not eagerly import selected approval runtime into the API startup graph");
assert.match(route, /import\("\.\.\/current-affairs\/selected-daily-master-pack"\)/,
  "selected pack materialization must lazy-load only when editorial refresh runs");
assert.match(route, /import\("\.\.\/current-affairs\/selected-daily-master-pack-approval-runtime"\)/,
  "selected approval runtime must lazy-load only after editorial refresh materializes the pack");
assert.match(app, /adminCurrentAffairsPackEditorialRouter/);
assert.match(client, /master-pack\/editorial-refresh/);

assert.match(workspace, /Daily Pack Editorial Workspace/);
assert.match(workspace, /Edit structured event copy, not generated Markdown\/PDF/);
assert.match(workspace, /saveCurrentAffairsEditorialEnglish/);
assert.match(workspace, /saveCurrentAffairsEditorialLocalization/);
assert.match(workspace, /Verified facts — read only/);
assert.match(workspace, /Refresh pack \+ run QA/);
assert.match(workspace, /does <strong>not<\/strong> run source discovery, replay, verification, publication or Question Bank promotion/);
assert.match(workspace, /getDailyMasterPackApprovalState/);
assert.match(workspace, /packLocked/);

assert.match(archive, /CurrentAffairsPackEditorialWorkspace/);
assert.match(archive, /Preview Markdown/);
assert.match(archive, /Preview PDF/);
assert.match(archive, /final locked artifact/);
assert.match(archive, /payload\?\.sections \?\? payload\?\.categories/);

console.log("CP-072 Daily Pack editorial workspace contract: ok");

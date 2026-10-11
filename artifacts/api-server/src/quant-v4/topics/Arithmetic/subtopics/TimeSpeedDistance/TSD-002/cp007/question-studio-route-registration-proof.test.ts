import { readFileSync } from "node:fs";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-007 Studio route registration proof failed: ${message}`);
}

const routeIndex = readFileSync("artifacts/api-server/src/routes/index.ts", "utf8");
const routeSource = readFileSync("artifacts/api-server/src/routes/admin-question-studio-time-speed-distance.ts", "utf8");

assert(routeIndex.includes('import adminQuestionStudioTimeSpeedDistanceRouter from "./admin-question-studio-time-speed-distance";'), "central route import missing");
assert(routeIndex.includes('router.use("/admin/question-studio", adminQuestionStudioTimeSpeedDistanceRouter);'), "central route mount missing");

for (const endpoint of [
  "/quant/time-speed-distance/cp007/package",
  "/quant/time-speed-distance/cp007/preview",
  "/quant/time-speed-distance/cp007/runs",
  "/quant/time-speed-distance/cp007/status",
]) {
  assert(routeSource.includes(endpoint), `${endpoint}: endpoint missing`);
}

for (const lock of [
  'questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY"',
  'questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED"',
  'questionBankWritable: false',
  'testEligible: false',
  'publiclyPublishable: false',
  'automaticStudentPublication: false',
]) {
  assert(routeSource.includes(lock), `route lifecycle lock missing: ${lock}`);
}

assert(routeSource.includes("content.generation_runs"), "review run persistence missing");
assert(routeSource.includes("content.generation_run_items"), "review item persistence missing");
assert(routeSource.includes("content.generation_item_versions"), "review version persistence missing");
assert(routeSource.includes("question_studio.tsd_cp007_run.created"), "audit event missing");

console.log("TSD-CP-007 QUESTION STUDIO ROUTE REGISTRATION PROOF: PASS");
console.log(JSON.stringify({
  mountedAt: "/admin/question-studio",
  endpoints: 4,
  persistence: "REVIEW_QUEUE_ONLY",
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
}, null, 2));

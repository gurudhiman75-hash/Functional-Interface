import { generateFinalAuthorityReview } from "./final-authority-review";
import { TSD_FINAL_LEARNER_AUTHORITIES } from "./final-authority-registry";
import { TSD_CONTEXT_OBJECT_POOL } from "./learner-context";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const rows = generateFinalAuthorityReview();
assert(rows.length === 153, `Expected 153 records, received ${rows.length}`);
assert(new Set(rows.map((row) => row.finalAuthorityKey)).size === TSD_FINAL_LEARNER_AUTHORITIES.length, "Learner-authority coverage changed");
assert(rows.filter((row) => row.finalCheckpointId === "TSD-CP-001").length === 80, "Final CP-001 count changed");
assert(rows.filter((row) => row.finalCheckpointId === "TSD-CP-002").length === 73, "Final CP-002 count changed");
assert(rows.every((row) => row.permanentQlId === null), "Permanent QL allocation was enabled");
assert(rows.every((row) => row.reviewStatus === "EDITORIAL_REVIEW_REQUIRED"), "Review status changed");
assert(rows.every((row) => row.englishFreezeStatus === "UNFROZEN"), "English freeze changed");
assert(rows.every((row) => row.publiclyPublishable === false), "Public delivery was enabled");
assert(rows.every((row) => row.sourceQuestion.validation.valid), "A remediated source question became structurally invalid");

assert(TSD_CONTEXT_OBJECT_POOL.motor.length >= 18, `Motor-object pool is too small: ${TSD_CONTEXT_OBJECT_POOL.motor.length}`);
assert(TSD_CONTEXT_OBJECT_POOL.running.length >= 8, `Running-object pool is too small: ${TSD_CONTEXT_OBJECT_POOL.running.length}`);
assert(TSD_CONTEXT_OBJECT_POOL.cycling.length >= 6, `Cycling-object pool is too small: ${TSD_CONTEXT_OBJECT_POOL.cycling.length}`);

const bannedPatterns = [
  /\bA field engineer travels\b/i,
  /\bA survey crew reaches\b/i,
  /\bA machine carrier\b/i,
  /\bA logistics carrier\b/i,
  /\brefrigerated delivery, a carrier covers\b/i,
  /\bcontrolled road trial, a test fleet spends\b/i,
  /\bA maintenance team travels\b/i,
  /\bAn inspection team travels\b/i,
] as const;
for (const row of rows) {
  for (const pattern of bannedPatterns) {
    assert(!pattern.test(row.sourceQuestion.stem), `${row.questionLanguageId}: awkward actor remains: ${row.sourceQuestion.stem}`);
    assert(!pattern.test(row.sourceQuestion.stemMathJax), `${row.questionLanguageId}: awkward actor remains in MathJax stem`);
  }
}

const objects = [
  ...TSD_CONTEXT_OBJECT_POOL.motor,
  ...TSD_CONTEXT_OBJECT_POOL.running,
  ...TSD_CONTEXT_OBJECT_POOL.cycling,
].sort((first, second) => second.length - first.length);
const objectCounts = new Map<string, number>();
let actorBearingRows = 0;
for (const row of rows) {
  const object = objects.find((candidate) => new RegExp(`\\b${candidate.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(row.sourceQuestion.stem));
  if (!object) continue;
  actorBearingRows += 1;
  objectCounts.set(object, (objectCounts.get(object) ?? 0) + 1);
  assert(new RegExp(`\\b${object.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(row.sourceQuestion.stemMathJax), `${row.questionLanguageId}: object differs between plain and MathJax stem`);
}

assert(actorBearingRows >= 80, `Too few actor-bearing stems were found: ${actorBearingRows}`);
assert(objectCounts.size >= 16, `Canonical object diversity is too low: ${objectCounts.size}`);
const maximumObjectCount = Math.max(...objectCounts.values());
assert(maximumObjectCount / actorBearingRows <= 0.18, `One object dominates ${(maximumObjectCount / actorBearingRows * 100).toFixed(1)}% of actor-bearing stems`);
const carBusCount = (objectCounts.get("car") ?? 0) + (objectCounts.get("bus") ?? 0);
assert(carBusCount / actorBearingRows <= 0.15, `Car/bus concentration is too high: ${(carBusCount / actorBearingRows * 100).toFixed(1)}%`);

const implausibleHumanSpeedRows = rows.filter((row) => {
  if (!/\b(?:runner|jogger|athlete|cyclist)\b/i.test(row.sourceQuestion.stem)) return false;
  const speeds = [...row.sourceQuestion.stem.matchAll(/(\d+(?:\.\d+)?)\s*km\/h/gi)].map((match) => Number(match[1]));
  return speeds.some((speed) => speed > 80);
});
assert(implausibleHumanSpeedRows.length === 0, `High-speed human contexts remain: ${implausibleHumanSpeedRows.map((row) => row.questionLanguageId).join(", ")}`);

console.log(JSON.stringify({
  status: "PASS",
  records: rows.length,
  learnerAuthorities: TSD_FINAL_LEARNER_AUTHORITIES.length,
  actorBearingRows,
  distinctObjects: objectCounts.size,
  maximumObjectShare: maximumObjectCount / actorBearingRows,
  carBusShare: carBusCount / actorBearingRows,
  motorPool: TSD_CONTEXT_OBJECT_POOL.motor.length,
  runningPool: TSD_CONTEXT_OBJECT_POOL.running.length,
  cyclingPool: TSD_CONTEXT_OBJECT_POOL.cycling.length,
  implausibleHumanSpeedRows: 0,
  permanentQls: 0,
  englishFreezeStatus: "UNFROZEN",
}, null, 2));

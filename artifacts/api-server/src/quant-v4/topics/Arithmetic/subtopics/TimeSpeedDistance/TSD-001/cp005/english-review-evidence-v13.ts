import "./english-review-evidence-v12";
import { generateCp005ReviewSetV12Final } from "./english-review-runtime-v12-final";
import { generateCp005EnglishAuditPoolV13, generateCp005ReviewSetV13 } from "./english-review-runtime-v13";
import { TSD_CP005_V13_OBJECT_CONTEXT_POOL, TSD_CP005_V13_OBJECT_POOLS } from "./english-object-pool-v13";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const rows = generateCp005ReviewSetV13(6);
const v12 = generateCp005ReviewSetV12Final(6);
const audit = generateCp005EnglishAuditPoolV13(30);
const contextById = new Map(TSD_CP005_V13_OBJECT_CONTEXT_POOL.map((entry) => [entry.id, entry]));

assert(rows.length === 78, `CP005 V13 expected 78 selected rows, received ${rows.length}`);
assert(audit.length === 390, `CP005 V13 expected 390 audit rows, received ${audit.length}`);
assert(TSD_CP005_V13_OBJECT_CONTEXT_POOL.length === 50, `CP005 V13 expected 50 registered object contexts, received ${TSD_CP005_V13_OBJECT_CONTEXT_POOL.length}`);
assert(new Set(TSD_CP005_V13_OBJECT_CONTEXT_POOL.map((entry) => entry.id)).size === 50, "CP005 V13 object context IDs are not unique");
assert(new Set(TSD_CP005_V13_OBJECT_CONTEXT_POOL.map((entry) => entry.objectFamily)).size >= 20, "CP005 V13 object-family pool is still too thin");
assert(new Set(TSD_CP005_V13_OBJECT_CONTEXT_POOL.map((entry) => entry.endpointFamily)).size >= 12, "CP005 V13 endpoint-family pool is still too thin");
assert(TSD_CP005_V13_OBJECT_POOLS.OPPOSITE_ONE_WAY.length >= 14, "CP005 V13 opposite one-way pool too small");
assert(TSD_CP005_V13_OBJECT_POOLS.OPPOSITE_REPEAT.length >= 12, "CP005 V13 repeated-motion pool too small");
assert(TSD_CP005_V13_OBJECT_POOLS.SAME_START_RETURN.length >= 12, "CP005 V13 same-start return pool too small");
assert(TSD_CP005_V13_OBJECT_POOLS.OPPOSITE_HALT.length >= 12, "CP005 V13 halt/reversal pool too small");

assert(new Set(rows.map((row) => row.permanentQlId)).size === 13, "CP005 V13 lost permanent QL coverage");
assert(new Set(rows.map((row) => row.solveMode)).size === 20, "CP005 V13 lost learner solve-mode coverage");
assert(new Set(rows.map((row) => row.stem)).size === 78, "CP005 V13 selected stems are not unique");
assert(new Set(rows.map((row) => row.objectContextId)).size >= 40, "CP005 V13 selected review uses too few object contexts");
assert(new Set(rows.map((row) => row.objectFamily)).size >= 20, "CP005 V13 selected review uses too few object families");
assert(new Set(rows.map((row) => row.endpointFamily)).size >= 12, "CP005 V13 selected review uses too few endpoint families");

for (const ql of [...new Set(rows.map((row) => row.permanentQlId))]) {
  const qlRows = rows.filter((row) => row.permanentQlId === ql);
  assert(qlRows.length === 6, `${ql}: V13 expected six selected rows`);
  assert(new Set(qlRows.map((row) => row.objectContextId)).size === 6, `${ql}: V13 must use six distinct object contexts`);
  assert(new Set(qlRows.map((row) => row.objectFamily)).size === 6, `${ql}: V13 must use six distinct object families`);
  assert(new Set(qlRows.map((row) => row.endpointFamily)).size >= 5, `${ql}: V13 endpoint context variety is too weak`);
  assert(new Set(qlRows.map((row) => row.objectTopology)).size === 1, `${ql}: V13 mixed incompatible motion topologies`);
}

const learnerText = rows.map((row) => row.stem).join("\n").toLowerCase();
assert(!/\btravellers?\b/.test(learnerText), "CP005 V13 selected stems fell back to generic traveller wording");
assert(!/\b(runner|runners|cyclist|cyclists|walker|walkers|pedestrian|pedestrians)\b/.test(learnerText), "CP005 V13 uses a human-powered object despite 36–90 km/h selected states");
assert(!/\b(boat|boats|stream|current)\b/.test(learnerText), "CP005 V13 introduced boat/current semantics without a current variable");
assert(!/\b(he|him|his)\b/.test(learnerText), "CP005 V13 vehicle stem retained a human pronoun");
assert(rows.filter((row) => /train/i.test(row.stem)).every((row) => !/\broad\b/i.test(row.stem)), "CP005 V13 rail context leaked road wording");
assert(rows.every((row) => row.stem.includes("P") && row.stem.includes("Q")), "CP005 V13 objectized stem lost endpoint labels");

for (const row of rows) {
  const context = contextById.get(row.objectContextId);
  assert(context, `${row.objectContextId}: V13 selected context missing from registry`);
  const actorLabel = context.actorA.slice(0, -2);
  assert(!row.stem.includes(`${actorLabel} ${actorLabel}`), `${row.objectContextId}: repeated object label leaked into learner stem`);
  assert(!row.stem.includes(`The faster ${context.actorA}`), `${row.objectContextId}: awkward faster-object construction leaked into learner stem`);
}

assert(rows.every((row, index) => row.permanentQlId === v12[index]!.permanentQlId), "CP005 V13 QL identity changed from V12");
assert(rows.every((row, index) => row.solveMode === v12[index]!.solveMode), "CP005 V13 solve mode changed from V12");
assert(rows.every((row, index) => row.answerText === v12[index]!.answerText), "CP005 V13 answer changed from V12");
assert(rows.every((row, index) => row.correctIndex === v12[index]!.correctIndex), "CP005 V13 correct option index changed from V12");
assert(rows.every((row, index) => row.options.join("|") === v12[index]!.options.join("|")), "CP005 V13 options changed from V12");
assert(rows.every((row, index) => row.mathematicalFingerprint === v12[index]!.mathematicalFingerprint), "CP005 V13 mathematical fingerprint changed from V12");
assert(rows.every((row, index) => JSON.stringify(row.explanation) === JSON.stringify(v12[index]!.explanation)), "CP005 V13 explanation changed from V12");
assert(rows.every((row) => row.lifecycle.englishFreezeStatus === "UNFROZEN" && !row.lifecycle.questionStudioEnabled && row.lifecycle.questionBankStatus === "NOT_STORED" && row.lifecycle.testEligibility === "INELIGIBLE" && !row.lifecycle.publiclyPublishable), "CP005 V13 lifecycle lock violated");

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP005_ENGLISH_REVIEW_CANDIDATE_V13_OBJECT_POOL",
  selectedQuestions: rows.length,
  auditQuestions: audit.length,
  registeredObjectContexts: TSD_CP005_V13_OBJECT_CONTEXT_POOL.length,
  registeredObjectFamilies: new Set(TSD_CP005_V13_OBJECT_CONTEXT_POOL.map((entry) => entry.objectFamily)).size,
  registeredEndpointFamilies: new Set(TSD_CP005_V13_OBJECT_CONTEXT_POOL.map((entry) => entry.endpointFamily)).size,
  selectedObjectContexts: new Set(rows.map((row) => row.objectContextId)).size,
  selectedObjectFamilies: new Set(rows.map((row) => row.objectFamily)).size,
  selectedEndpointFamilies: new Set(rows.map((row) => row.endpointFamily)).size,
  objectContextsPerQl: 6,
  objectFamiliesPerQl: 6,
  minEndpointFamiliesPerQl: Math.min(...[...new Set(rows.map((row) => row.permanentQlId))].map((ql) => new Set(rows.filter((row) => row.permanentQlId === ql).map((row) => row.endpointFamily)).size)),
  genericTravellerFallbacks: 0,
  repeatedObjectLabels: 0,
  humanPronounsOnVehicles: 0,
  mathematicsAndOptionsIdenticalToV12: true,
  explanationsIdenticalToV12: true,
  englishFreezeStatus: "UNFROZEN",
  questionStudioEnabled: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));

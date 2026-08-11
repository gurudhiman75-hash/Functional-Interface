import { TSD_CP002_NEXT_PERMANENT_QL_ID } from "../cp002/freeze-registry";
import {
  TSD_CP003_ENGLISH_FREEZE_CANDIDATE_AUTHORITY,
  cp003FreezeCandidateLearnerCorpusIsUnchanged,
  generateCp003EnglishFreezeCandidateRecords,
  priorFrozenEnglishCorpusRemainsIntact,
} from "./english-freeze-candidate";
import {
  TSD_CP003_NEXT_PERMANENT_QL_ID,
  TSD_CP003_PERMANENT_QL_ALLOCATIONS,
  TSD_CP003_PERMANENT_QL_IDS,
  cp003PermanentQlForSolveMode,
} from "./ql-allocation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const expectedNewQls = Array.from({ length: 10 }, (_, index) => `TSD-QL-${String(38 + index).padStart(3, "0")}`);
assert(TSD_CP002_NEXT_PERMANENT_QL_ID === "TSD-QL-038", `CP-002 next QL changed: ${TSD_CP002_NEXT_PERMANENT_QL_ID}`);
assert(TSD_CP003_PERMANENT_QL_ALLOCATIONS.length === 10, `Expected 10 new CP-003 QL allocations, received ${TSD_CP003_PERMANENT_QL_ALLOCATIONS.length}`);
assert(TSD_CP003_PERMANENT_QL_IDS.join(",") === expectedNewQls.join(","), `CP-003 QL sequence changed: ${TSD_CP003_PERMANENT_QL_IDS.join(",")}`);
assert(new Set(TSD_CP003_PERMANENT_QL_IDS).size === 10, "CP-003 permanent QL allocation contains duplicates");
assert(TSD_CP003_NEXT_PERMANENT_QL_ID === "TSD-QL-048", `Expected next QL TSD-QL-048, received ${TSD_CP003_NEXT_PERMANENT_QL_ID}`);

const expectedAuthorityOrder = [
  "timeGainLossFromSpeedChange",
  "distanceFromSpeedTimeDifference",
  "speedFromFixedRouteTimeDifference",
  "usualSpeedFromEarlyLatePair",
  "numberOfStopsFromOverallDelay",
  "delayFromRegularStops",
  "restTimeInRepeatedTravelRestCycle",
  "totalTimeWithRegularStops",
  "lostTimeDurationFromScheduleRecovery",
  "arrivalShiftFromDepartureAndSpeedChanges",
];
assert(TSD_CP003_PERMANENT_QL_ALLOCATIONS.map((entry) => entry.authorityKey).join(",") === expectedAuthorityOrder.join(","), "CP-003 permanent QLs are not allocated in the approved authority order");

for (const allocation of TSD_CP003_PERMANENT_QL_ALLOCATIONS) {
  assert(allocation.checkpointId === "TSD-CP-003", `${allocation.authorityKey}: allocation checkpoint changed`);
  assert(allocation.allocationStatus === "PERMANENT_QL_ALLOCATED", `${allocation.authorityKey}: QL is not permanently allocated`);
  assert(allocation.englishFreezeStatus === "UNFROZEN", `${allocation.authorityKey}: English froze during QL allocation`);
  assert(allocation.questionStudioUnlocked === false, `${allocation.authorityKey}: Question Studio unlocked during QL allocation`);
  assert(allocation.questionBankStatus === "NOT_STORED", `${allocation.authorityKey}: Question Bank storage unlocked during QL allocation`);
  assert(allocation.testEligibility === "INELIGIBLE", `${allocation.authorityKey}: tests unlocked during QL allocation`);
  assert(allocation.publiclyPublishable === false, `${allocation.authorityKey}: public delivery unlocked during QL allocation`);
}

assert(cp003PermanentQlForSolveMode("timeGainLossFromSpeedChange").permanentQlId === "TSD-QL-038", "timeGainLossFromSpeedChange QL changed");
assert(cp003PermanentQlForSolveMode("startTimeShiftForSameArrival").permanentQlId === "TSD-QL-038", "Merged same-arrival shift did not inherit TSD-QL-038");
assert(cp003PermanentQlForSolveMode("distanceFromSpeedTimeDifference").permanentQlId === "TSD-QL-039", "distanceFromSpeedTimeDifference QL changed");
assert(cp003PermanentQlForSolveMode("distanceFromEarlyLatePair").permanentQlId === "TSD-QL-039", "Merged early/late distance did not inherit TSD-QL-039");

const records = generateCp003EnglishFreezeCandidateRecords();
assert(records.length === 63, `Expected 63 CP-003 English-freeze candidate records, received ${records.length}`);
assert(cp003FreezeCandidateLearnerCorpusIsUnchanged(), "CP-003 learner corpus changed while wrapping the English-freeze candidate");
assert(priorFrozenEnglishCorpusRemainsIntact(), "Previously frozen CP-001/002 English corpus changed while preparing CP-003");
assert(new Set(records.map((row) => row.questionLanguageId)).size === records.length, "CP-003 freeze-candidate question-language IDs are not unique");
assert(!records.some((row) => row.solveMode === "scheduleBuffer"), "Rejected scheduleBuffer entered the CP-003 freeze candidate");
assert(records.every((row) => row.validation.valid), "An invalid CP-003 learner row entered the freeze candidate");
assert(records.every((row) => row.permanentQlId === null), "Source runtime permanentQlId was mutated during freeze-candidate wrapping");
assert(records.every((row) => row.lifecycle.englishFreezeStatus === "UNFROZEN"), "Source runtime English status was mutated during freeze-candidate wrapping");
assert(records.every((row) => row.freezeCandidate.authority === TSD_CP003_ENGLISH_FREEZE_CANDIDATE_AUTHORITY), "Freeze-candidate authority marker mismatch");
assert(records.every((row) => row.freezeCandidate.candidateStatus === "READY_FOR_PRODUCT_OWNER_FREEZE_APPROVAL"), "A CP-003 row is not ready for freeze approval");
assert(records.every((row) => row.freezeCandidate.learnerCorpusChanged === false), "Freeze-candidate learner mutation flag changed");
assert(records.every((row) => row.freezeCandidate.localisationUnlocked === false), "Localization unlocked before CP-003 English freeze");
assert(records.every((row) => row.freezeCandidate.questionStudioUnlocked === false), "Question Studio unlocked before CP-003 English freeze");
assert(records.every((row) => row.freezeCandidate.questionBankUnlocked === false), "Question Bank unlocked before CP-003 English freeze");
assert(records.every((row) => row.freezeCandidate.testDeliveryUnlocked === false), "Test delivery unlocked before CP-003 English freeze");
assert(records.every((row) => row.freezeCandidate.publicDeliveryUnlocked === false), "Public delivery unlocked before CP-003 English freeze");

const newQlRows = records.filter((row) => row.authorityQlKind === "NEW_CP003_PERMANENT_QL");
const priorQlRows = records.filter((row) => row.authorityQlKind === "EXISTING_PRIOR_AUTHORITY_QL");
assert(newQlRows.length === 36, `Expected 36 accepted rows owned by new CP-003 authorities, received ${newQlRows.length}`);
assert(priorQlRows.length === 27, `Expected 27 prior-authority representation rows, received ${priorQlRows.length}`);
assert(new Set(newQlRows.map((row) => row.authorityPermanentQlId)).size === 10, "New CP-003 learner rows do not cover all 10 allocated QLs");
assert(newQlRows.every((row) => expectedNewQls.includes(row.authorityPermanentQlId)), "A new CP-003 learner row is mapped outside TSD-QL-038..047");
assert(priorQlRows.every((row) => !expectedNewQls.includes(row.authorityPermanentQlId)), "A prior-authority representation consumed a new CP-003 QL");
assert(new Set(priorQlRows.map((row) => row.authorityPermanentQlId)).size === 8, "Prior representation families should map to eight distinct existing QLs");
assert(new Set(records.map((row) => row.authorityPermanentQlId)).size === 18, "Expected 18 distinct authority QLs across the accepted CP-003 content surface");

const ql038Modes = new Set(records.filter((row) => row.authorityPermanentQlId === "TSD-QL-038").map((row) => row.solveMode));
assert(ql038Modes.has("timeGainLossFromSpeedChange") && ql038Modes.has("startTimeShiftForSameArrival"), "TSD-QL-038 does not own both native and same-arrival representations");
const ql039Modes = new Set(records.filter((row) => row.authorityPermanentQlId === "TSD-QL-039").map((row) => row.solveMode));
assert(ql039Modes.has("distanceFromSpeedTimeDifference") && ql039Modes.has("distanceFromEarlyLatePair"), "TSD-QL-039 does not own both direct and early/late distance representations");

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP003_QL_ALLOCATION_AND_ENGLISH_FREEZE_CANDIDATE",
  permanentQlRange: [TSD_CP003_PERMANENT_QL_IDS[0], TSD_CP003_PERMANENT_QL_IDS.at(-1)],
  newPermanentQls: TSD_CP003_PERMANENT_QL_IDS.length,
  nextPermanentQlId: TSD_CP003_NEXT_PERMANENT_QL_ID,
  candidateRecords: records.length,
  newAuthorityRows: newQlRows.length,
  priorRepresentationRows: priorQlRows.length,
  distinctAuthorityQlsRepresented: new Set(records.map((row) => row.authorityPermanentQlId)).size,
  rejectedScheduleBufferRows: 0,
  learnerCorpusChanged: false,
  priorFrozenCorpusChanged: false,
  sourceEnglishFreezeStatus: "UNFROZEN",
  freezeCandidateStatus: "READY_FOR_PRODUCT_OWNER_FREEZE_APPROVAL",
  localisationUnlocked: false,
  questionStudioUnlocked: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));

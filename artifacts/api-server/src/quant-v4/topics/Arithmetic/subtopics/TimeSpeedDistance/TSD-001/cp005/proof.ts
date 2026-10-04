import { add, rational } from "../foundation/rational";
import {
  TSD_CP004_ENGLISH_APPROVED_SOURCE_HEAD,
  TSD_CP004_ENGLISH_FREEZE_ID,
  TSD_CP004_ENGLISH_FREEZE_STATUS,
} from "../cp004/english-approved-freeze";
import { TSD_CP005_DISCOVERY_BOUNDARY, TSD_CP005_DISCOVERY_CANDIDATES, TSD_CP005_NEXT_AVAILABLE_QL, TSD_CP005_PERMANENT_QL_COUNT } from "./discovery-registry";
import { generateCp005AuditPool } from "./generator";
import type { TsdCp005Solution } from "./types";
import { independentlyVerifyCp005 } from "./verifier";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const audit = generateCp005AuditPool(12);

assert(TSD_CP005_DISCOVERY_CANDIDATES.length === 31, `expected 31 CP005 source candidates, received ${TSD_CP005_DISCOVERY_CANDIDATES.length}`);
assert(new Set(TSD_CP005_DISCOVERY_CANDIDATES).size === 31, "CP005 discovery registry contains duplicate solve modes");
assert(audit.length === 372, `expected 372 CP005 generated cases, received ${audit.length}`);
assert(new Set(audit.map((row) => row.solveMode)).size === 31, "CP005 audit does not execute all 31 discovery candidates");
assert(audit.every((row) => row.verification.valid), `CP005 independent verification failed: ${audit.filter((row) => !row.verification.valid).slice(0, 3).map((row) => `${row.solveMode}:${row.verification.errors.join("|")}`).join(" ; ")}`);

for (const mode of TSD_CP005_DISCOVERY_CANDIDATES) {
  assert(audit.filter((row) => row.solveMode === mode).length === 12, `${mode}: expected 12 generated audit states`);
}

assert(audit.every((row) => row.lifecycle.discoveryStatus === "EXECUTABLE_DISCOVERY"), "CP005 lifecycle escaped executable discovery");
assert(audit.every((row) => !row.lifecycle.permanentQlAllocated), "CP005 permanent QL allocated before merge/split review");
assert(audit.every((row) => row.lifecycle.englishFreezeStatus === "UNFROZEN"), "CP005 English frozen before product-owner review");
assert(audit.every((row) => !row.lifecycle.questionStudioEnabled), "CP005 Question Studio enabled during discovery");
assert(audit.every((row) => row.lifecycle.questionBankStatus === "NOT_STORED"), "CP005 Question Bank write enabled during discovery");
assert(audit.every((row) => row.lifecycle.testEligibility === "INELIGIBLE"), "CP005 test eligibility enabled during discovery");
assert(audit.every((row) => !row.lifecycle.publiclyPublishable), "CP005 public publication enabled during discovery");
assert(TSD_CP005_PERMANENT_QL_COUNT === 0, "CP005 must not allocate permanent QLs during executable discovery");
assert(TSD_CP005_NEXT_AVAILABLE_QL === "TSD-QL-058", "CP005 must preserve TSD-QL-058 as next available QL");

assert(TSD_CP004_ENGLISH_FREEZE_STATUS === "APPROVED_ENGLISH_FROZEN", "CP004 approved English freeze status changed");
assert(TSD_CP004_ENGLISH_FREEZE_ID === "TSD-CP-004-EN-v1-frozen", "CP004 English freeze id changed");
assert(TSD_CP004_ENGLISH_APPROVED_SOURCE_HEAD === "99b65d54c87bfe456182bbcbad5963d30579952c", "CP004 approved source head changed");

function tamper(solution: TsdCp005Solution): TsdCp005Solution {
  if (solution.answerKind === "ITINERARY" && solution.value) return Object.freeze({ ...solution, value: add(solution.value, rational(1)) });
  if (solution.value) return Object.freeze({ ...solution, value: add(solution.value, rational(1)) });
  if (solution.values?.length) return Object.freeze({ ...solution, values: Object.freeze([add(solution.values[0]!, rational(1)), ...solution.values.slice(1)]) });
  if (solution.booleanValue !== undefined) return Object.freeze({ ...solution, booleanValue: !solution.booleanValue });
  if (solution.classification) return Object.freeze({ ...solution, classification: solution.classification === "UNIQUE" ? "MULTIPLE" : "UNIQUE" });
  if (solution.dataSufficiency) return Object.freeze({ ...solution, dataSufficiency: solution.dataSufficiency === "INSUFFICIENT" ? "EITHER_ALONE" : "INSUFFICIENT" });
  throw new Error(`cannot construct tamper for ${solution.solveMode}`);
}

let tamperRejections = 0;
for (const mode of TSD_CP005_DISCOVERY_CANDIDATES) {
  const row = audit.find((candidate) => candidate.solveMode === mode)!;
  const verification = independentlyVerifyCp005(row.input, tamper(row.solution));
  assert(!verification.valid, `${mode}: independent verifier accepted a deliberately tampered solution`);
  tamperRejections += 1;
}

const answerKinds = [...new Set(audit.map((row) => row.solution.answerKind))].sort();
assert(answerKinds.includes("VALUE") && answerKinds.includes("PAIR") && answerKinds.includes("BOOLEAN") && answerKinds.includes("CLASSIFICATION") && answerKinds.includes("DATA_SUFFICIENCY") && answerKinds.includes("ITINERARY"), `CP005 answer-contract coverage incomplete: ${answerKinds.join(",")}`);

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP005_EXECUTABLE_DISCOVERY_FOUNDATION",
  checkpoint: TSD_CP005_DISCOVERY_BOUNDARY.checkpointId,
  sourceCandidates: TSD_CP005_DISCOVERY_CANDIDATES.length,
  executableSolveModes: new Set(audit.map((row) => row.solveMode)).size,
  generatedAuditCases: audit.length,
  casesPerMode: 12,
  independentVerifierChecks: audit.length,
  deliberateTamperRejections: tamperRejections,
  answerKinds,
  permanentQlCount: TSD_CP005_PERMANENT_QL_COUNT,
  nextAvailableQl: TSD_CP005_NEXT_AVAILABLE_QL,
  cp004EnglishFreezeId: TSD_CP004_ENGLISH_FREEZE_ID,
  cp004ApprovedSourceHead: TSD_CP004_ENGLISH_APPROVED_SOURCE_HEAD,
  questionStudioEnabled: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
  nextGate: "CP005_SOURCE_SATURATION_AND_MERGE_SPLIT_AUTHORITY_REVIEW",
}, null, 2));

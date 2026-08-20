import { add, rational } from "../foundation/rational";
import { TSD_CP006_DISCOVERY_AUTHORITY, TSD_CP006_DISCOVERY_CANDIDATES } from "./discovery-registry";
import { generateCp006AuditCases, generateCp006Case } from "./generator";
import type { TsdCp006Solution } from "./types";
import { independentlyVerifyCp006 } from "./verifier";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function tamper(solution: TsdCp006Solution): TsdCp006Solution {
  switch (solution.answerKind) {
    case "VALUE":
      return Object.freeze({ ...solution, value: add(solution.value!, rational(1)) });
    case "COUNT":
      return Object.freeze({ ...solution, count: (solution.count ?? 0) + 1 });
    case "LIST":
    case "PAIR":
      return Object.freeze({ ...solution, values: Object.freeze([add(solution.values![0]!, rational(1)), ...solution.values!.slice(1)]) });
    case "BOOLEAN":
      return Object.freeze({ ...solution, booleanValue: !solution.booleanValue });
    case "CLASSIFICATION":
      return Object.freeze({ ...solution, classification: solution.classification === "UNIQUE" ? "MULTIPLE" : "UNIQUE" });
    case "DATA_SUFFICIENCY":
      return Object.freeze({ ...solution, dataSufficiency: solution.dataSufficiency === "NOT_SUFFICIENT" ? "BOTH_TOGETHER" : "NOT_SUFFICIENT" });
  }
}

const casesPerMode = 12;
const audit = generateCp006AuditCases(casesPerMode);
assert(TSD_CP006_DISCOVERY_CANDIDATES.length === 34, "CP006 discovery must retain all 34 open candidate modes");
assert(audit.length === 34 * casesPerMode, `CP006 audit expected ${34 * casesPerMode} cases, got ${audit.length}`);
assert(new Set(audit.map((row) => row.solveMode)).size === 34, "CP006 audit lost solve-mode coverage");
assert(new Set(audit.map((row) => row.seed)).size === audit.length, "CP006 audit seeds are not unique");

for (const row of audit) {
  assert(row.verification.valid, `${row.solveMode}/${row.seed}: generated solution failed verification`);
  assert(row.lifecycle.discoveryStatus === "EXECUTABLE_DISCOVERY", `${row.solveMode}: discovery lifecycle drift`);
  assert(row.lifecycle.permanentQlAllocated === false, `${row.solveMode}: permanent QL allocated during discovery`);
  assert(row.lifecycle.englishFreezeStatus === "UNFROZEN", `${row.solveMode}: English frozen during discovery`);
  assert(!row.lifecycle.questionStudioEnabled, `${row.solveMode}: Studio enabled during CP006 discovery`);
  assert(row.lifecycle.questionBankStatus === "NOT_STORED", `${row.solveMode}: Bank unlocked during CP006 discovery`);
  assert(row.lifecycle.testEligibility === "INELIGIBLE", `${row.solveMode}: tests unlocked during CP006 discovery`);
  assert(!row.lifecycle.publiclyPublishable, `${row.solveMode}: public publishing unlocked during CP006 discovery`);
}

let deliberateTamperRejections = 0;
for (const mode of TSD_CP006_DISCOVERY_CANDIDATES) {
  const row = generateCp006Case(mode, `cp006:tamper:${mode}`);
  const result = independentlyVerifyCp006(mode, row.input, tamper(row.solution));
  assert(!result.valid, `${mode}: independent verifier accepted a deliberately tampered answer`);
  deliberateTamperRejections += 1;
}

assert(TSD_CP006_DISCOVERY_AUTHORITY.permanentQlCount === 0, "CP006 discovery allocated permanent QLs prematurely");
assert(TSD_CP006_DISCOVERY_AUTHORITY.nextAvailableQl === "TSD-QL-071", "CP006 next QL boundary drifted");

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP006_EXECUTABLE_CIRCULAR_MOTION_DISCOVERY_FOUNDATION",
  checkpoint: "TSD-CP-006",
  sourceCandidates: TSD_CP006_DISCOVERY_CANDIDATES.length,
  executableSolveModes: new Set(audit.map((row) => row.solveMode)).size,
  generatedAuditCases: audit.length,
  casesPerMode,
  independentVerifierChecks: audit.length,
  deliberateTamperRejections,
  answerKinds: [...new Set(audit.map((row) => row.solution.answerKind))].sort(),
  permanentQlCount: TSD_CP006_DISCOVERY_AUTHORITY.permanentQlCount,
  nextAvailableQl: TSD_CP006_DISCOVERY_AUTHORITY.nextAvailableQl,
  questionStudioEnabled: TSD_CP006_DISCOVERY_AUTHORITY.questionStudioEnabled,
  questionBankStatus: TSD_CP006_DISCOVERY_AUTHORITY.questionBankStatus,
  testEligibility: TSD_CP006_DISCOVERY_AUTHORITY.testEligibility,
  publiclyPublishable: TSD_CP006_DISCOVERY_AUTHORITY.publiclyPublishable,
  nextGate: "CP006_SOURCE_SATURATION_AND_CROSS_CHECKPOINT_MERGE_SPLIT_AUTHORITY_REVIEW",
}, null, 2));

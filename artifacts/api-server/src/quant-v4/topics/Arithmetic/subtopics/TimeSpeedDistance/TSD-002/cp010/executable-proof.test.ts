import { add, rational } from "../../TSD-001/foundation/rational";
import { generateTsdCp010ExecutableCases } from "./executable-generator";
import { verifyTsdCp010 } from "./executable-verifier";
import { TSD_CP010_AUTHORITY_KEYS } from "./source-saturation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-010 executable proof failed: ${message}`);
}

const cases = generateTsdCp010ExecutableCases();
assert(cases.length === 120, `expected 120 generated cases, got ${cases.length}`);
assert(new Set(cases.map((x) => x.caseId)).size === 120, "case ids must be unique");

let accepted = 0;
let tamperRejected = 0;
const units = new Set<string>();
for (const authorityKey of TSD_CP010_AUTHORITY_KEYS) {
  assert(cases.filter((x) => x.authorityKey === authorityKey).length === 12, `${authorityKey} must have 12 deterministic cases`);
}

for (const testCase of cases) {
  const verification = verifyTsdCp010(testCase.input, testCase.expected);
  assert(verification.accepted, `${testCase.caseId} rejected expected solution`);
  accepted += 1;
  units.add(testCase.expected.unit);

  const tampered = {
    ...testCase.expected,
    answer: add(testCase.expected.answer, rational(1)),
  };
  const tamperedVerification = verifyTsdCp010(testCase.input, tampered);
  assert(!tamperedVerification.accepted, `${testCase.caseId} accepted +1 tamper`);
  tamperRejected += 1;
}

for (const unit of ["METRE", "SECOND", "METRE_PER_SECOND", "RATIO"]) {
  assert(units.has(unit), `unit coverage missing ${unit}`);
}

console.log("TSD-CP-010 EXECUTABLE FEASIBILITY PROOF: PASS");
console.log(JSON.stringify({
  authorities: TSD_CP010_AUTHORITY_KEYS.length,
  casesPerAuthority: 12,
  generated: cases.length,
  independentlyAccepted: accepted,
  deliberateTamperRejected: tamperRejected,
  units: [...units],
  nextPermanentQl: "TSD-QL-115",
}, null, 2));
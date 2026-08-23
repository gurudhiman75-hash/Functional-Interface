import { add, rational } from "../../TSD-001/foundation/rational";
import { TSD_CP008_EXECUTABLE_AUTHORITIES, generateTsdCp008Case } from "./executable-generator";
import type { TsdCp008ExecutableSolution } from "./executable-types";
import { verifyTsdCp008 } from "./executable-verifier";
import { TSD_CP008_FINAL_NEW_AUTHORITY_CANDIDATES } from "./final-ownership-candidate";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-008 executable proof failed: ${message}`);
}

const finalKeys = TSD_CP008_FINAL_NEW_AUTHORITY_CANDIDATES.map((entry) => entry.authorityKey).sort();
const executableKeys = [...TSD_CP008_EXECUTABLE_AUTHORITIES].sort();
assert(JSON.stringify(finalKeys) === JSON.stringify(executableKeys), "final ownership and executable authority keys differ");

let generatedCases = 0;
let independentVerifierChecks = 0;
let deliberateTamperRejections = 0;

for (const authorityKey of TSD_CP008_EXECUTABLE_AUTHORITIES) {
  for (let caseIndex = 1; caseIndex <= 12; caseIndex += 1) {
    const generated = generateTsdCp008Case(authorityKey, caseIndex);
    generatedCases += 1;
    assert(generated.authorityKey === authorityKey, `${authorityKey}/${caseIndex}: generator authority drift`);
    assert(generated.solution.value.numerator > 0n, `${authorityKey}/${caseIndex}: solution must be positive`);

    const verification = verifyTsdCp008(generated.input, generated.solution);
    independentVerifierChecks += 1;
    assert(verification.valid, `${authorityKey}/${caseIndex}: independent verifier rejected correct solution`);

    const tampered: TsdCp008ExecutableSolution = Object.freeze({
      ...generated.solution,
      value: add(generated.solution.value, rational(1)),
    });
    const tamperedVerification = verifyTsdCp008(generated.input, tampered);
    assert(!tamperedVerification.valid, `${authorityKey}/${caseIndex}: verifier accepted tampered answer`);
    deliberateTamperRejections += 1;
  }
}

assert(generatedCases === 108, `expected 108 generated cases, got ${generatedCases}`);
assert(independentVerifierChecks === 108, `expected 108 independent verifier checks, got ${independentVerifierChecks}`);
assert(deliberateTamperRejections === 108, `expected 108 tamper rejections, got ${deliberateTamperRejections}`);

console.log("TSD-CP-008 EXECUTABLE FEASIBILITY PROOF: PASS");
console.log(JSON.stringify({
  finalLearnerAuthorities: TSD_CP008_EXECUTABLE_AUTHORITIES.length,
  casesPerAuthority: 12,
  generatedCases,
  independentVerifierChecks,
  deliberateTamperRejections,
  permanentQlAllocationStatus: "BLOCKED_UNTIL_FEASIBILITY_GATE_GREEN",
  nextPermanentQl: "TSD-QL-095",
  questionStudioEnabled: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));

import { add, rational } from "../../TSD-001/foundation/rational";
import { generateTsdCp009Case, TSD_CP009_EXECUTABLE_AUTHORITIES } from "./executable-generator";
import type { TsdCp009ExecutableSolution } from "./executable-types";
import { verifyTsdCp009 } from "./executable-verifier";
import { TSD_CP009_LEARNER_AUTHORITIES, TSD_CP009_SOURCE_SATURATION } from "./source-saturation-final";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-009 executable proof failed: ${message}`);
}

assert(TSD_CP009_EXECUTABLE_AUTHORITIES.length === 11, "expected 11 executable authorities");
assert(JSON.stringify(TSD_CP009_EXECUTABLE_AUTHORITIES) === JSON.stringify(TSD_CP009_LEARNER_AUTHORITIES.map((authority) => authority.authorityKey)), "executable authority order differs from source-saturated learner authority order");
assert(TSD_CP009_SOURCE_SATURATION.permanentQlCount === 0, "QLs allocated before executable feasibility gate");

let generatedCount = 0;
let acceptedCount = 0;
let tamperRejectedCount = 0;
const units = new Set<string>();

for (const authorityKey of TSD_CP009_EXECUTABLE_AUTHORITIES) {
  const seenSeeds = new Set<string>();
  for (let caseIndex = 1; caseIndex <= 12; caseIndex += 1) {
    const generated = generateTsdCp009Case(authorityKey, caseIndex);
    generatedCount += 1;
    assert(generated.authorityKey === authorityKey, `${authorityKey}/${caseIndex}: generated authority mismatch`);
    assert(!seenSeeds.has(generated.seed), `${authorityKey}/${caseIndex}: duplicate seed`);
    seenSeeds.add(generated.seed);
    units.add(generated.solution.unit);

    const verified = verifyTsdCp009(generated.input, generated.solution);
    assert(verified.valid, `${authorityKey}/${caseIndex}: independently verified solution rejected (${verified.invariant})`);
    acceptedCount += 1;

    const tampered: TsdCp009ExecutableSolution = Object.freeze({
      ...generated.solution,
      value: add(generated.solution.value, rational(1)),
    });
    const tamperVerification = verifyTsdCp009(generated.input, tampered);
    assert(!tamperVerification.valid, `${authorityKey}/${caseIndex}: deliberate +1 tamper was accepted`);
    tamperRejectedCount += 1;
  }
}

assert(generatedCount === 132, `expected 132 generated cases, got ${generatedCount}`);
assert(acceptedCount === 132, `expected 132 independent accepts, got ${acceptedCount}`);
assert(tamperRejectedCount === 132, `expected 132 tamper rejections, got ${tamperRejectedCount}`);
assert(units.has("SECOND") && units.has("METRE") && units.has("METRE_PER_SECOND"), "executable proof does not cover all CP009 value units");

console.log("TSD-CP-009 EXECUTABLE FEASIBILITY PROOF: PASS");
console.log(JSON.stringify({
  authorities: TSD_CP009_EXECUTABLE_AUTHORITIES.length,
  casesPerAuthority: 12,
  generated: generatedCount,
  independentlyAccepted: acceptedCount,
  deliberateTamperRejected: tamperRejectedCount,
  units: [...units].sort(),
  qlAllocationStillLocked: TSD_CP009_SOURCE_SATURATION.permanentQlCount === 0,
  nextPermanentQl: TSD_CP009_SOURCE_SATURATION.nextPermanentQl,
}, null, 2));

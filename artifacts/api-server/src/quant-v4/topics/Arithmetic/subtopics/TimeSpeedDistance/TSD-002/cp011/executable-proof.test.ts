import { add, rational } from "../../TSD-001/foundation/rational";
import { generateTsdCp011ExecutableCases } from "./executable-generator";
import { verifyTsdCp011 } from "./executable-verifier";
import { TSD_CP011_LEARNER_AUTHORITIES } from "./source-saturation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-011 executable proof failed: ${message}`);
}

const cases = generateTsdCp011ExecutableCases();
assert(cases.length === 168, "expected 168 deterministic executable cases");
assert(new Set(cases.map((x) => x.caseId)).size === 168, "case IDs must be unique");

let accepted = 0;
let tamperRejected = 0;
for (const authorityKey of TSD_CP011_LEARNER_AUTHORITIES) {
  const authorityCases = cases.filter((x) => x.authorityKey === authorityKey);
  assert(authorityCases.length === 24, `${authorityKey}: expected 24 cases`);
  assert(new Set(authorityCases.map((x) => x.input.target)).size >= 2, `${authorityKey}: target diversity is too thin`);
}

for (const testCase of cases) {
  const verification = verifyTsdCp011(testCase.input, testCase.expected);
  assert(verification.accepted, `${testCase.caseId}: independent verifier rejected expected solution (${verification.reason ?? "no reason"})`);
  accepted += 1;

  const tampered = Object.freeze({ ...testCase.expected, answer: add(testCase.expected.answer, rational(1)) });
  const tamperedVerification = verifyTsdCp011(testCase.input, tampered);
  assert(!tamperedVerification.accepted, `${testCase.caseId}: verifier accepted deliberately tampered answer`);
  tamperRejected += 1;
}

const targetCoverage = Object.fromEntries(TSD_CP011_LEARNER_AUTHORITIES.map((authorityKey) => [
  authorityKey,
  [...new Set(cases.filter((x) => x.authorityKey === authorityKey).map((x) => x.input.target))],
]));

assert((targetCoverage.movingSurfaceTravelState as string[]).length === 4, "moving-surface travel must cover time/length/person/surface targets");
assert((targetCoverage.stationaryStepCountState as string[]).length === 4, "stationary-step engine must cover count and inverse-rate targets");
assert((targetCoverage.dualEscalatorObservationState as string[]).length === 2, "dual-observation engine must cover stopped time and rate ratio");
assert((targetCoverage.movingSurfaceStateComparison as string[]).length === 4, "state-comparison engine must cover direct and inverse time targets");
assert((targetCoverage.wheelRollState as string[]).length === 5, "wheel-roll engine must cover distance/revolutions/circumference/diameter/radius");
assert((targetCoverage.wheelRateTranslationState as string[]).length === 4, "wheel-rate engine must cover speed/RPM/distance/time");
assert((targetCoverage.twoWheelComparisonState as string[]).length === 2, "two-wheel engine must cover ratio and count difference");

console.log("TSD-CP-011 EXECUTABLE + INDEPENDENT VERIFIER PROOF: PASS");
console.log(JSON.stringify({
  authorities: TSD_CP011_LEARNER_AUTHORITIES.length,
  casesPerAuthority: 24,
  deterministicCases: cases.length,
  verifierAccepts: accepted,
  deliberateTamperRejects: tamperRejected,
  targetCoverage,
}, null, 2));
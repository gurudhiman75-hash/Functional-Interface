import {
  TSD_CP001_LEARNER_AUTHORITIES,
  TSD_CP001_NON_LEARNER_MODES,
  cp001AuthorityByMode,
  generateCp001Candidate,
} from "./runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(TSD_CP001_LEARNER_AUTHORITIES.length === 23, "Expected 23 learner-facing authorities after source saturation");
assert(TSD_CP001_NON_LEARNER_MODES.size === 2, "Only the two internal QA modes may remain non-learner");

for (const mode of ["distanceByProportion", "timeByProportion", "speedByProportion"] as const) {
  assert(!TSD_CP001_NON_LEARNER_MODES.has(mode), `${mode} was not restored to learner review`);
}

let compoundMinutesSecondsSeen = false;
let compoundHoursMinutesSeen = false;
let fractionalOrDecimalStateSeen = false;
let directKmphCompositionSeen = false;
let decimalKilometreCompositionSeen = false;
let standardMpsToKmphWorkingSeen = false;
const mixedOutputUnits = new Set<string>();

const auditedModes = [
  "distanceFromSpeedAndTime",
  "speedFromDistanceAndTime",
  "timeFromDistanceAndSpeed",
  "speedFromMixedUnits",
] as const;

for (const mode of auditedModes) {
  const authority = cp001AuthorityByMode(mode);
  for (let index = 0; index < 500; index += 1) {
    const candidate = generateCp001Candidate(authority.provisionalId, `source-saturation:${mode}:${index}`);
    assert(candidate.validation.valid, `${mode}: invalid source-saturation candidate at ${index}`);
    const stem = candidate.stem;
    if (/\d+(?:\.\d+)? minutes \d+ seconds/i.test(stem)) compoundMinutesSecondsSeen = true;
    if (/\d+(?:\.\d+)? hours \d+ minutes/i.test(stem)) compoundHoursMinutesSeen = true;
    if (/\b\d+\.\d+\b/.test(stem)) fractionalOrDecimalStateSeen = true;
    if (mode !== "speedFromMixedUnits" && /km\/h/i.test(stem)) directKmphCompositionSeen = true;
    if (/\b0\.\d+ km\b|\b1\.\d+ km\b/i.test(stem)) decimalKilometreCompositionSeen = true;
    if (candidate.input.solveMode === "speedFromMixedUnits") {
      mixedOutputUnits.add(candidate.input.outputUnit);
      if (candidate.input.outputUnit === "KMPH" && candidate.input.distanceUnit === "M" && candidate.input.timeUnit === "SECOND") {
        const working = candidate.explanation.working.join(" ");
        assert(/m\/s/i.test(working) && /18\/5/.test(working), "Metres-and-seconds to km/h must use the standard m/s × 18/5 route");
        assert(!/\d+\/\d+ hours/i.test(working), "Formal fractional-hour route leaked into the mixed-unit solution");
        standardMpsToKmphWorkingSeen = true;
      }
    }
  }
}

assert(compoundMinutesSecondsSeen, "No minutes-and-seconds state was generated");
assert(compoundHoursMinutesSeen, "No hours-and-minutes state was generated");
assert(fractionalOrDecimalStateSeen, "No fractional or decimal source state was generated");
assert(directKmphCompositionSeen, "No direct motion question composed km/h conversion with distance or time");
assert(decimalKilometreCompositionSeen, "No decimal-kilometre direct state was generated");
assert(standardMpsToKmphWorkingSeen, "No standard m/s-to-km/h mixed-unit solution was generated");
assert(mixedOutputUnits.has("KMPH"), "Mixed-unit speed did not cover km/h output");
assert(mixedOutputUnits.has("MPS"), "Mixed-unit speed did not cover m/s output");
assert(mixedOutputUnits.has("M_PER_MINUTE"), "Mixed-unit speed did not cover m/min output");

for (const mode of ["distanceByProportion", "timeByProportion", "speedByProportion"] as const) {
  const authority = cp001AuthorityByMode(mode);
  for (let index = 0; index < 120; index += 1) {
    const candidate = generateCp001Candidate(authority.provisionalId, `proportion-saturation:${mode}:${index}`);
    assert(candidate.validation.valid, `${mode}: invalid restored proportionality candidate at ${index}`);
    if (mode === "distanceByProportion" || mode === "timeByProportion") {
      assert(/same speed/i.test(candidate.stem), `${mode}: same-speed condition is missing`);
      assert(!/ at \d+(?:\.\d+)? km\/h/i.test(candidate.stem), `${mode}: derived speed leaked as a redundant given`);
    } else {
      assert(/same distance/i.test(candidate.stem), "speedByProportion: same-distance condition is missing");
    }
  }
}

console.log(JSON.stringify({
  status: "PASS",
  learnerFacingAuthorityCount: TSD_CP001_LEARNER_AUTHORITIES.length,
  nonLearnerAuthorityCount: TSD_CP001_NON_LEARNER_MODES.size,
  compoundMinutesSecondsSeen,
  compoundHoursMinutesSeen,
  fractionalOrDecimalStateSeen,
  directKmphCompositionSeen,
  decimalKilometreCompositionSeen,
  standardMpsToKmphWorkingSeen,
  mixedOutputUnits: [...mixedOutputUnits].sort(),
  permanentQlCount: 0,
}, null, 2));

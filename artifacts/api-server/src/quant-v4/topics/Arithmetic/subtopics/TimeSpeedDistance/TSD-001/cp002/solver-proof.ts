import { cp002Case } from "./cases";
import {
  TSD_CP002_INTERNAL_AUTHORITIES,
  TSD_CP002_LEARNER_AUTHORITIES,
} from "./discovery-registry";
import { add, f } from "./fraction";
import { solveCp002, solutionEquals } from "./solver";
import type { TsdCp002Input, TsdCp002Solution } from "./types";
import { verifyCp002Solution } from "./verifier";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function tamper(solution: TsdCp002Solution): TsdCp002Solution {
  switch (solution.answerKind) {
    case "SPEED":
    case "PACE":
    case "TIME":
    case "DISTANCE":
    case "PERCENT":
    case "RATIO":
      return Object.freeze({ answerKind: solution.answerKind, value: add(solution.value, f(1)) }) as TsdCp002Solution;
    case "CHOICE":
      return Object.freeze({ answerKind: "CHOICE", value: solution.value === "Plan A" ? "Plan B" : "Plan A" });
    case "CLASSIFICATION":
      return Object.freeze({ answerKind: "CLASSIFICATION", value: solution.value === "UNIQUE" ? "INDETERMINATE" : "UNIQUE" });
    case "BOOLEAN":
      return Object.freeze({ answerKind: "BOOLEAN", value: !solution.value });
  }
}

let learnerCases = 0;
let tamperRejections = 0;
for (const authority of TSD_CP002_LEARNER_AUTHORITIES) {
  for (let index = 0; index < 3; index += 1) {
    const definition = cp002Case(authority.solveMode as never, index);
    const first = solveCp002(definition.input);
    const second = solveCp002(definition.input);
    assert(solutionEquals(first, second), `${authority.solveMode}:${index}: canonical solver is not deterministic`);
    const answerKindMatches = authority.answerKind === "DISTANCE_OR_TIME"
      ? first.answerKind === "DISTANCE" || first.answerKind === "TIME"
      : first.answerKind === authority.answerKind;
    assert(answerKindMatches, `${authority.solveMode}:${index}: answer kind mismatch`);
    const verification = verifyCp002Solution(definition.input, first);
    assert(verification.valid, `${authority.solveMode}:${index}: independent verification failed: ${verification.errors.join("; ")}`);
    const tampered = verifyCp002Solution(definition.input, tamper(first));
    assert(!tampered.valid, `${authority.solveMode}:${index}: verifier accepted a tampered answer`);
    tamperRejections += 1;
    learnerCases += 1;
  }
}

const classificationInputs: readonly Extract<TsdCp002Input, { mode: "classifyAverageSpeedState" }>[] = [
  { mode: "classifyAverageSpeedState", supplied: "AVERAGE_ONLY" },
  { mode: "classifyAverageSpeedState", supplied: "DISTANCE_AND_TIME" },
  { mode: "classifyAverageSpeedState", supplied: "FULL_SEGMENTS" },
  { mode: "classifyAverageSpeedState", supplied: "CONTRADICTORY" },
];
for (const input of classificationInputs) {
  const solution = solveCp002(input);
  assert(verifyCp002Solution(input, solution).valid, `Internal classification failed for ${input.supplied}`);
  assert(!verifyCp002Solution(input, tamper(solution)).valid, `Internal classification tamper was accepted for ${input.supplied}`);
  tamperRejections += 1;
}

const claimInputs: readonly TsdCp002Input[] = [
  {
    mode: "verifyAverageSpeedClaim",
    segments: [
      { distanceKm: f(60), speedKmph: f(30) },
      { distanceKm: f(60), speedKmph: f(60) },
    ],
    claimedAverageKmph: f(40),
  },
  {
    mode: "verifyAverageSpeedClaim",
    segments: [
      { distanceKm: f(60), speedKmph: f(30) },
      { distanceKm: f(60), speedKmph: f(60) },
    ],
    claimedAverageKmph: f(45),
  },
];
for (const input of claimInputs) {
  const solution = solveCp002(input);
  assert(verifyCp002Solution(input, solution).valid, "Internal claim verification failed");
  assert(!verifyCp002Solution(input, tamper(solution)).valid, "Internal claim tamper was accepted");
  tamperRejections += 1;
}

assert(TSD_CP002_INTERNAL_AUTHORITIES.length === 2, "Internal CP-002 authority boundary changed");
assert(learnerCases === 42, "Unexpected learner solver case count");

console.log(JSON.stringify({
  status: "PASS",
  canonicalProblemId: "TSD-CP-002",
  learnerAuthoritiesExercised: TSD_CP002_LEARNER_AUTHORITIES.length,
  learnerCases,
  internalQaAuthoritiesExercised: TSD_CP002_INTERNAL_AUTHORITIES.length,
  tamperRejections,
}, null, 2));

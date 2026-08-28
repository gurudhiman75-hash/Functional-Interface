import { add, rational } from "../../TSD-001/foundation/rational";
import { generateTsdCp012ExecutableCases } from "./executable-cases";
import { verifyTsdCp012 } from "./executable-verifier";
import type { TsdCp012ExecutableSolution } from "./executable-types";
import { TSD_CP012_LEARNER_AUTHORITIES } from "./source-saturation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-012 executable proof failed: ${message}`);
}

function tamper(solution: TsdCp012ExecutableSolution): TsdCp012ExecutableSolution {
  if (solution.kind === "SCALAR") return Object.freeze({ ...solution, answer: add(solution.answer, rational(1)) });
  if (solution.values.length > 0) return Object.freeze({ kind: "SET" as const, values: Object.freeze(solution.values.slice(0, -1)), unit: "PARAMETER_SET" as const });
  return Object.freeze({ kind: "SET" as const, values: Object.freeze([rational(999)]), unit: "PARAMETER_SET" as const });
}

const cases = generateTsdCp012ExecutableCases();
assert(cases.length === 88, `expected 88 deterministic executable cases, found ${cases.length}`);
assert(new Set(cases.map((x) => x.caseId)).size === 88, "case IDs must be unique");

let accepts = 0;
let tamperRejects = 0;
for (const authorityKey of TSD_CP012_LEARNER_AUTHORITIES) {
  const owned = cases.filter((x) => x.authorityKey === authorityKey);
  assert(owned.length === 8, `${authorityKey}: expected eight deterministic cases`);
  assert(new Set(owned.map((x) => x.input.target)).size >= 2, `${authorityKey}: target coverage is too thin`);
}

for (const executableCase of cases) {
  const verification = verifyTsdCp012(executableCase.input, executableCase.expected);
  assert(verification.accepted, `${executableCase.caseId}: independent verifier rejected expected solution (${verification.reason})`);
  accepts += 1;

  const tampered = tamper(executableCase.expected);
  const tamperedVerification = verifyTsdCp012(executableCase.input, tampered);
  assert(!tamperedVerification.accepted, `${executableCase.caseId}: independent verifier accepted deliberate tamper`);
  tamperRejects += 1;
}

const setCases = cases.filter((x) => x.expected.kind === "SET");
assert(setCases.length === 4, `expected four complete-set cases, found ${setCases.length}`);
assert(setCases.every((x) => x.expected.kind === "SET" && x.expected.values.length > 0), "complete-set cases should expose non-empty finite sets in discovery proof");

console.log("TSD-CP-012 EXACT EXECUTABLE + INDEPENDENT VERIFIER PROOF: PASS");
console.log(JSON.stringify({
  authorities: TSD_CP012_LEARNER_AUTHORITIES.length,
  cases: cases.length,
  casesPerAuthority: 8,
  verifierAccepts: accepts,
  deliberateTamperRejects: tamperRejects,
  setValuedCases: setCases.length,
  arithmetic: "EXACT_RATIONAL_ONLY",
}, null, 2));

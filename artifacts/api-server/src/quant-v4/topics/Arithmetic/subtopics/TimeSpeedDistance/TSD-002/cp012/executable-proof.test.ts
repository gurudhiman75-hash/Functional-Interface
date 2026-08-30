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
assert(cases.length === 264, `expected 264 deterministic executable cases, found ${cases.length}`);
assert(new Set(cases.map((x) => x.caseId)).size === 264, "case IDs must be unique");

let accepts = 0;
let tamperRejects = 0;
for (const authorityKey of TSD_CP012_LEARNER_AUTHORITIES) {
  const owned = cases.filter((x) => x.authorityKey === authorityKey);
  assert(owned.length === 24, `${authorityKey}: expected 24 deterministic cases`);
  const bands = [owned.slice(0, 8), owned.slice(8, 16), owned.slice(16, 24)];
  const baseTargets = bands[0]!.map((x) => x.input.target).join("|");
  assert(new Set(bands[0]!.map((x) => x.input.target)).size >= 2, `${authorityKey}: target coverage is too thin`);
  assert(bands[1]!.map((x) => x.input.target).join("|") === baseTargets, `${authorityKey}: x2 scale band changed target structure`);
  assert(bands[2]!.map((x) => x.input.target).join("|") === baseTargets, `${authorityKey}: x3 scale band changed target structure`);
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
assert(setCases.length === 12, `expected 12 complete-set cases across three scale bands, found ${setCases.length}`);
assert(setCases.every((x) => x.expected.kind === "SET" && x.expected.values.length > 0), "complete-set cases should expose non-empty finite sets in discovery proof");

console.log("TSD-CP-012 EXACT EXECUTABLE + INDEPENDENT VERIFIER PROOF: PASS");
console.log(JSON.stringify({
  authorities: TSD_CP012_LEARNER_AUTHORITIES.length,
  cases: cases.length,
  casesPerAuthority: 24,
  semanticScaleBands: [1, 2, 3],
  verifierAccepts: accepts,
  deliberateTamperRejects: tamperRejects,
  setValuedCases: setCases.length,
  arithmetic: "EXACT_RATIONAL_ONLY",
}, null, 2));

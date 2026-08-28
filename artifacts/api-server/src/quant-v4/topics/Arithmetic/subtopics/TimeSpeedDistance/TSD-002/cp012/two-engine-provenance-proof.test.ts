import { compare, rational } from "../../TSD-001/foundation/rational";
import { generateTsdCp012ExecutableCases } from "./executable-cases";
import { TSD_CP012_TWO_ENGINE_PROVENANCE } from "./two-engine-provenance";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-012 two-engine provenance proof failed: ${message}`);
}

const cases = generateTsdCp012ExecutableCases().filter((x) => x.authorityKey === "twoEngineInverseState");
assert(cases.length === 8, `expected eight two-engine executable cases, found ${cases.length}`);
assert(TSD_CP012_TWO_ENGINE_PROVENANCE.length === 8, "every two-engine executable case must have provenance");
assert(new Set(TSD_CP012_TWO_ENGINE_PROVENANCE.map((x) => x.caseId)).size === 8, "provenance case IDs must be unique");

for (const executableCase of cases) {
  const provenance = TSD_CP012_TWO_ENGINE_PROVENANCE.find((x) => x.caseId === executableCase.caseId);
  assert(provenance, `${executableCase.caseId}: cross-authority provenance missing`);
  assert(provenance.engineA !== provenance.engineB, `${executableCase.caseId}: both equations cannot come from the same authority`);
  assert(provenance.variableMeaning === "TWO_SPEEDS_METRES_PER_SECOND", `${executableCase.caseId}: unknowns must remain dimensionally compatible speeds`);
  assert(provenance.note.length >= 100, `${executableCase.caseId}: provenance note is too thin to preserve ownership meaning`);
  assert(executableCase.input.target === "X" || executableCase.input.target === "Y", `${executableCase.caseId}: unsupported inverse target`);
  assert(executableCase.expected.kind === "SCALAR", `${executableCase.caseId}: expected scalar speed state`);
  assert(compare(executableCase.expected.answer, rational(0)) > 0, `${executableCase.caseId}: recovered speed must be positive`);
}

assert(TSD_CP012_TWO_ENGINE_PROVENANCE.every((x) => cases.some((candidate) => candidate.caseId === x.caseId)), "provenance must not invent non-executable case IDs");

const enginePairs = TSD_CP012_TWO_ENGINE_PROVENANCE.map((x) => [x.engineA, x.engineB].sort().join("|"));
assert(new Set(enginePairs).size >= 7, "two-engine evidence pool is too repetitive across earlier authorities");

console.log("TSD-CP-012 TWO-ENGINE CROSS-AUTHORITY PROVENANCE PROOF: PASS");
console.log(JSON.stringify({
  executableCases: cases.length,
  provenanceRows: TSD_CP012_TWO_ENGINE_PROVENANCE.length,
  distinctAuthorityPairs: new Set(enginePairs).size,
  variableMeaning: "TWO_SPEEDS_METRES_PER_SECOND",
  abstractAlgebraOnly: false,
}, null, 2));

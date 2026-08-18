import {
  addRational,
  equalsRational,
  solveLinearSystem2V,
  solveLinearSystem3V,
  subtractRational,
  verifyLinearSystemSolution,
  verifyLinearSystem3VSolution,
  type LinearSystem2V,
  type LinearSystem3V,
} from "../../../../../shared/algebra";
import { ALG_CP007_DISCOVERY_CANDIDATES, generateAlgCp007DiscoveryItem } from "../ALG-002/ALG-CP-007";

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, entry) => typeof entry === "bigint" ? `${entry}n` : entry);
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

for (const candidate of ALG_CP007_DISCOVERY_CANDIDATES) {
  assert(candidate.permanentQlId === null, `${candidate.candidateId} must remain provisional`);
  assert(candidate.sourceStatus === "UNVERIFIED_DRAFT", `${candidate.candidateId} must not claim source audit`);

  for (let seed = 1; seed <= 50; seed += 1) {
    const first = generateAlgCp007DiscoveryItem(candidate.candidateId, seed);
    const replay = generateAlgCp007DiscoveryItem(candidate.candidateId, seed);
    assert(stable(first) === stable(replay), `${candidate.candidateId} seed ${seed} is not deterministic`);
    assert(first.stem.length > 20, `${candidate.candidateId} seed ${seed} has empty stem`);
    assert(first.explanation.length > 50, `${candidate.candidateId} seed ${seed} has incomplete explanation`);

    if (first.answer.kind === "ORDERED_TRIPLE") {
      const system = first.system as LinearSystem3V;
      const solved = solveLinearSystem3V(system);
      assert(solved.kind === "UNIQUE", `${candidate.candidateId} seed ${seed} should have a unique 3x3 solution`);
      if (solved.kind === "UNIQUE") {
        assert(equalsRational(first.answer.x, solved.x) && equalsRational(first.answer.y, solved.y) && equalsRational(first.answer.z, solved.z), `${candidate.candidateId} seed ${seed} ordered-triple mismatch`);
        assert(verifyLinearSystem3VSolution(system, first.answer.x, first.answer.y, first.answer.z), `${candidate.candidateId} seed ${seed} 3x3 substitution failed`);
      }
      continue;
    }

    const system = first.system as LinearSystem2V;
    const solved = solveLinearSystem2V(system);

    if (first.answer.kind === "ORDERED_PAIR") {
      assert(solved.kind === "UNIQUE", `${candidate.candidateId} seed ${seed} should have a unique solution`);
      if (solved.kind === "UNIQUE") {
        assert(equalsRational(first.answer.x, solved.x) && equalsRational(first.answer.y, solved.y), `${candidate.candidateId} seed ${seed} ordered-pair mismatch`);
        assert(verifyLinearSystemSolution(system, first.answer.x, first.answer.y), `${candidate.candidateId} seed ${seed} substitution failed`);
      }
    }

    if (first.answer.kind === "RATIONAL") {
      assert(solved.kind === "UNIQUE", `${candidate.candidateId} seed ${seed} transformed target requires unique system`);
      if (solved.kind === "UNIQUE") {
        const expected = candidate.solveMode === "findXPlusYFromSystem"
          ? addRational(solved.x, solved.y)
          : candidate.solveMode === "findXMinusYFromSystem"
            ? subtractRational(solved.x, solved.y)
            : solved.x;
        assert(equalsRational(first.answer.value, expected), `${candidate.candidateId} seed ${seed} transformed answer mismatch`);
        assert(verifyLinearSystemSolution(system, solved.x, solved.y), `${candidate.candidateId} seed ${seed} solved pair does not verify`);
      }
    }

    if (first.answer.kind === "NO_SOLUTION") {
      assert(solved.kind === "NO_SOLUTION", `${candidate.candidateId} seed ${seed} should be inconsistent`);
    }

    if (first.answer.kind === "INFINITE_SOLUTIONS") {
      assert(solved.kind === "INFINITE_SOLUTIONS", `${candidate.candidateId} seed ${seed} should be dependent`);
    }

    if (first.answer.kind === "PARAMETER_VALUE") {
      assert(first.parameterEvidence?.hiddenSecondXCoefficient === true, `${candidate.candidateId} seed ${seed} lacks parameter evidence`);
      assert(equalsRational(first.answer.value, system.a2), `${candidate.candidateId} seed ${seed} hidden coefficient mismatch`);
      assert(solved.kind === "NO_SOLUTION", `${candidate.candidateId} seed ${seed} parameter must create no solution`);
    }
  }
}

console.log(`ALG-CP-007 executable discovery passed for ${ALG_CP007_DISCOVERY_CANDIDATES.length} provisional candidates × 50 seeds`);
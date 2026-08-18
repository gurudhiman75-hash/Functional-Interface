import {
  compareRational,
  equalsRational,
  rationalRootsFromQuadraticState,
  solveQuadraticEquation,
  type Rational,
  type RootSetRelation,
} from "../../../../../shared/algebra";
import { ALG_CP011_DISCOVERY_CANDIDATES, generateAlgCp011DiscoveryItem } from "../ALG-002/ALG-CP-011";

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, entry) => typeof entry === "bigint" ? `${entry}n` : entry);
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function manualRelation(xRoots: Rational[], yRoots: Rational[]): RootSetRelation {
  const comparisons: number[] = [];
  for (const x of xRoots) for (const y of yRoots) comparisons.push(compareRational(x, y));
  if (comparisons.every((value) => value === 0)) return "X_EQUAL_TO_Y";
  if (comparisons.every((value) => value > 0)) return "X_GREATER_THAN_Y";
  if (comparisons.every((value) => value < 0)) return "X_LESS_THAN_Y";
  if (comparisons.every((value) => value >= 0)) return "X_GREATER_THAN_OR_EQUAL_TO_Y";
  if (comparisons.every((value) => value <= 0)) return "X_LESS_THAN_OR_EQUAL_TO_Y";
  return "RELATION_CANNOT_BE_ESTABLISHED";
}

for (const candidate of ALG_CP011_DISCOVERY_CANDIDATES) {
  assert(candidate.permanentQlId === null, `${candidate.candidateId} must remain provisional`);
  assert(candidate.sourceStatus === "UNVERIFIED_DRAFT", `${candidate.candidateId} must not claim source audit`);

  for (let seed = 1; seed <= 50; seed += 1) {
    const first = generateAlgCp011DiscoveryItem(candidate.candidateId, seed);
    const replay = generateAlgCp011DiscoveryItem(candidate.candidateId, seed);
    assert(stable(first) === stable(replay), `${candidate.candidateId} seed ${seed} is not deterministic`);
    assert(first.stem.length > 30, `${candidate.candidateId} seed ${seed} has empty stem`);
    assert(first.explanation.length > 50, `${candidate.candidateId} seed ${seed} has incomplete explanation`);

    const xRoots = rationalRootsFromQuadraticState(solveQuadraticEquation(first.equationX));
    const yRoots = rationalRootsFromQuadraticState(solveQuadraticEquation(first.equationY));
    assert(xRoots.length === first.rootEvidence.xRoots.length, `${candidate.candidateId} seed ${seed} x-root count mismatch`);
    assert(yRoots.length === first.rootEvidence.yRoots.length, `${candidate.candidateId} seed ${seed} y-root count mismatch`);
    for (const root of xRoots) assert(first.rootEvidence.xRoots.some((value) => equalsRational(value, root)), `${candidate.candidateId} seed ${seed} x-root evidence mismatch`);
    for (const root of yRoots) assert(first.rootEvidence.yRoots.some((value) => equalsRational(value, root)), `${candidate.candidateId} seed ${seed} y-root evidence mismatch`);

    const expected = manualRelation(xRoots, yRoots);
    assert(first.answer === expected, `${candidate.candidateId} seed ${seed} Banking relation mismatch`);
  }
}

console.log(`ALG-CP-011 executable discovery passed for ${ALG_CP011_DISCOVERY_CANDIDATES.length} provisional candidates × 50 seeds`);

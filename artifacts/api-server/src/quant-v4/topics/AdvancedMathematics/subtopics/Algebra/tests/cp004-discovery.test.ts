import { verifyFactorization } from "../../../../../shared/algebra";
import { ALG_CP004_DISCOVERY_CANDIDATES, generateAlgCp004DiscoveryItem } from "../ALG-001/ALG-CP-004";

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, entry) => typeof entry === "bigint" ? `${entry}n` : entry);
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

for (const candidate of ALG_CP004_DISCOVERY_CANDIDATES) {
  assert(candidate.permanentQlId === null, `${candidate.candidateId} must remain provisional`);
  assert(candidate.sourceStatus === "UNVERIFIED_DRAFT", `${candidate.candidateId} must not claim source audit`);
  for (let seed = 1; seed <= 50; seed += 1) {
    const first = generateAlgCp004DiscoveryItem(candidate.candidateId, seed);
    const replay = generateAlgCp004DiscoveryItem(candidate.candidateId, seed);
    assert(stable(first) === stable(replay), `${candidate.candidateId} seed ${seed} is not deterministic`);
    assert(first.stem.length > 10, `${candidate.candidateId} seed ${seed} has empty stem`);
    assert(first.explanation.length > 30, `${candidate.candidateId} seed ${seed} has incomplete explanation`);
    assert(verifyFactorization(first.polynomial, first.answer.value), `${candidate.candidateId} seed ${seed} failed re-expansion verification`);
  }
}

console.log(`ALG-CP-004 executable discovery passed for ${ALG_CP004_DISCOVERY_CANDIDATES.length} provisional candidates × 50 seeds`);

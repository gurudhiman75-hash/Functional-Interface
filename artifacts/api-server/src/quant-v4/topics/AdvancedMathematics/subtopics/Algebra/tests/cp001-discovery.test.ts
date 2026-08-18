import { rationalKey } from "../../../../../shared/algebra";
import { ALG_CP001_DISCOVERY_CANDIDATES, generateAlgCp001DiscoveryItem } from "../ALG-001/ALG-CP-001";

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, entry) => typeof entry === "bigint" ? `${entry}n` : entry);
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

for (const candidate of ALG_CP001_DISCOVERY_CANDIDATES) {
  assert(candidate.permanentQlId === null, `${candidate.candidateId} must remain provisional`);
  assert(candidate.sourceStatus === "UNVERIFIED_DRAFT", `${candidate.candidateId} must not claim source audit`);

  for (let seed = 1; seed <= 50; seed += 1) {
    const first = generateAlgCp001DiscoveryItem(candidate.candidateId, seed);
    const replay = generateAlgCp001DiscoveryItem(candidate.candidateId, seed);
    assert(stable(first) === stable(replay), `${candidate.candidateId} seed ${seed} is not deterministic`);
    assert(first.stem.length > 10, `${candidate.candidateId} seed ${seed} has an empty stem`);
    assert(first.explanation.length > 15, `${candidate.candidateId} seed ${seed} has an empty explanation`);

    if (first.answer.kind === "RATIONAL") {
      const key = rationalKey(first.answer.value);
      assert(!key.includes("/0"), `${candidate.candidateId} seed ${seed} produced an invalid rational`);
    }
  }
}

console.log(`ALG-CP-001 executable discovery passed for ${ALG_CP001_DISCOVERY_CANDIDATES.length} provisional candidates × 50 seeds`);

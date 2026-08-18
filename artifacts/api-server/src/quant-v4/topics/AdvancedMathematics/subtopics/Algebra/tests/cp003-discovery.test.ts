import { rationalKey } from "../../../../../shared/algebra";
import { ALG_CP003_DISCOVERY_CANDIDATES, generateAlgCp003DiscoveryItem } from "../ALG-001/ALG-CP-003";

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, entry) => typeof entry === "bigint" ? `${entry}n` : entry);
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

for (const candidate of ALG_CP003_DISCOVERY_CANDIDATES) {
  assert(candidate.permanentQlId === null, `${candidate.candidateId} must remain provisional`);
  assert(candidate.sourceStatus === "UNVERIFIED_DRAFT", `${candidate.candidateId} must not claim source audit`);

  for (let seed = 1; seed <= 50; seed += 1) {
    const first = generateAlgCp003DiscoveryItem(candidate.candidateId, seed);
    const replay = generateAlgCp003DiscoveryItem(candidate.candidateId, seed);
    assert(stable(first) === stable(replay), `${candidate.candidateId} seed ${seed} is not deterministic`);
    assert(first.stem.length > 15, `${candidate.candidateId} seed ${seed} has an empty stem`);
    assert(first.explanation.length > 35, `${candidate.candidateId} seed ${seed} has an incomplete explanation`);
    assert(!rationalKey(first.answer.value).includes("/0"), `${candidate.candidateId} seed ${seed} produced invalid rational`);
  }
}

console.log(`ALG-CP-003 executable discovery passed for ${ALG_CP003_DISCOVERY_CANDIDATES.length} provisional candidates × 50 seeds`);

import { equalsRational, multiplyRational, powRational, rational, rationalKey, subtractRational } from "../../../../../shared/algebra";
import { ALG_CP002_DISCOVERY_CANDIDATES, generateAlgCp002DiscoveryItem } from "../ALG-001/ALG-CP-002";

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, entry) => typeof entry === "bigint" ? `${entry}n` : entry);
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

for (const candidate of ALG_CP002_DISCOVERY_CANDIDATES) {
  assert(candidate.permanentQlId === null, `${candidate.candidateId} must remain provisional`);
  assert(candidate.sourceStatus === "UNVERIFIED_DRAFT", `${candidate.candidateId} must not claim source audit`);

  for (let seed = 1; seed <= 50; seed += 1) {
    const first = generateAlgCp002DiscoveryItem(candidate.candidateId, seed);
    const replay = generateAlgCp002DiscoveryItem(candidate.candidateId, seed);
    assert(stable(first) === stable(replay), `${candidate.candidateId} seed ${seed} is not deterministic`);
    assert(first.stem.length > 10, `${candidate.candidateId} seed ${seed} has an empty stem`);
    assert(first.explanation.length > 30, `${candidate.candidateId} seed ${seed} has an incomplete explanation`);
    assert(!rationalKey(first.answer.value).includes("/0"), `${candidate.candidateId} seed ${seed} produced invalid rational`);

    if (candidate.solveMode === "findScaledReciprocalSquare") {
      assert(first.scaledReciprocalEvidence !== undefined, `${candidate.candidateId} seed ${seed} lacks scaled evidence`);
      if (first.scaledReciprocalEvidence) {
        const evidence = first.scaledReciprocalEvidence;
        const expected = subtractRational(
          powRational(evidence.given, 2),
          multiplyRational(rational(2n), multiplyRational(evidence.p, evidence.q)),
        );
        assert(equalsRational(first.answer.value, expected), `${candidate.candidateId} seed ${seed} scaled reciprocal identity mismatch`);
      }
    }
  }
}

console.log(`ALG-CP-002 executable discovery passed for ${ALG_CP002_DISCOVERY_CANDIDATES.length} provisional candidates × 50 seeds`);

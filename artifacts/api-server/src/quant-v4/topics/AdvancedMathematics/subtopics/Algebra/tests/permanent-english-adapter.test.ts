import {
  ALG_CP001_DISCOVERY_CANDIDATES,
  ALG_CP002_DISCOVERY_CANDIDATES,
  ALG_CP003_DISCOVERY_CANDIDATES,
  ALG_CP004_DISCOVERY_CANDIDATES,
  ALG_CP005_DISCOVERY_CANDIDATES,
} from "../ALG-001";
import {
  ALG_CP006_DISCOVERY_CANDIDATES,
  ALG_CP007_DISCOVERY_CANDIDATES,
  ALG_CP008_DISCOVERY_CANDIDATES,
  ALG_CP009_DISCOVERY_CANDIDATES,
  ALG_CP010_DISCOVERY_CANDIDATES,
  ALG_CP011_DISCOVERY_CANDIDATES,
  ALG_CP012_DISCOVERY_CANDIDATES,
  ALG_CP013_DISCOVERY_CANDIDATES,
  ALG_CP014_DISCOVERY_CANDIDATES,
  ALG_CP015_DISCOVERY_CANDIDATES,
} from "../ALG-002";
import {
  ALG_ENGINE_ONLY_DISCOVERY_CANDIDATE_IDS,
  ALG_PERMANENT_ALLOCATION,
  ALG_PERMANENT_PROTOTYPE_MAP,
  generateAlgPermanentEnglishCandidate,
  getAlgPermanentPrototypeIds,
} from "../permanent";

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, entry) => typeof entry === "bigint" ? `${entry}n` : entry);
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

const ordinaryRegistries = [
  ALG_CP001_DISCOVERY_CANDIDATES,
  ALG_CP002_DISCOVERY_CANDIDATES,
  ALG_CP003_DISCOVERY_CANDIDATES,
  ALG_CP004_DISCOVERY_CANDIDATES,
  ALG_CP005_DISCOVERY_CANDIDATES,
  ALG_CP006_DISCOVERY_CANDIDATES,
  ALG_CP007_DISCOVERY_CANDIDATES,
  ALG_CP008_DISCOVERY_CANDIDATES,
  ALG_CP009_DISCOVERY_CANDIDATES,
  ALG_CP010_DISCOVERY_CANDIDATES,
  ALG_CP011_DISCOVERY_CANDIDATES,
  ALG_CP012_DISCOVERY_CANDIDATES,
  ALG_CP013_DISCOVERY_CANDIDATES,
  ALG_CP014_DISCOVERY_CANDIDATES,
] as const;

const ordinaryCandidateIds = ordinaryRegistries.flatMap((registry) => registry.map((row) => row.candidateId));
const compositionCandidateIds = ALG_CP015_DISCOVERY_CANDIDATES.map((row) => row.candidateId);
const mappedPrototypeIds = Object.values(ALG_PERMANENT_PROTOTYPE_MAP).flat();
const engineOnlyIds = [...ALG_ENGINE_ONLY_DISCOVERY_CANDIDATE_IDS];
const allCandidateIds = [...ordinaryCandidateIds, ...compositionCandidateIds];
const categorized = [...mappedPrototypeIds, ...engineOnlyIds, ...compositionCandidateIds];

assert(ALG_PERMANENT_ALLOCATION.length === 40, "Permanent English adapter must cover 40 allocated QLs");
assert(allCandidateIds.length === 113, `Current Algebra registries must contain 113 candidates, got ${allCandidateIds.length}`);
assert(mappedPrototypeIds.length === 105, `Expected 105 permanent-mapped prototype variants, got ${mappedPrototypeIds.length}`);
assert(engineOnlyIds.length === 2, "Exactly two CP-006 degenerate candidates must remain engine-only");
assert(compositionCandidateIds.length === 6, "CP-015 must contain six composition-only candidates");
assert(new Set(allCandidateIds).size === allCandidateIds.length, "Discovery candidate IDs must be globally unique");
assert(new Set(mappedPrototypeIds).size === mappedPrototypeIds.length, "A discovery prototype must not map to two permanent QLs");
assert(new Set(categorized).size === categorized.length, "Mapped/engine/composition categories must be disjoint");
assert(new Set(categorized).size === allCandidateIds.length, "Every current discovery candidate must have exactly one lifecycle category");
for (const candidateId of allCandidateIds) {
  assert(categorized.includes(candidateId), `Uncategorized discovery candidate: ${candidateId}`);
}
for (const id of compositionCandidateIds) {
  assert(id.startsWith("ALG-CP015-"), `Composition-only candidate escaped CP-015: ${id}`);
  assert(!mappedPrototypeIds.includes(id), `CP-015 candidate must not receive permanent QL ownership: ${id}`);
}

for (const allocation of ALG_PERMANENT_ALLOCATION) {
  const ids = getAlgPermanentPrototypeIds(allocation.qlId);
  assert(ids.length >= 1, `${allocation.qlId} has no permanent English prototype`);
  for (let variantIndex = 0; variantIndex < ids.length; variantIndex += 1) {
    const first = generateAlgPermanentEnglishCandidate(allocation.qlId, 17, variantIndex);
    const replay = generateAlgPermanentEnglishCandidate(allocation.qlId, 17, variantIndex);
    assert(stable(first) === stable(replay), `${allocation.qlId} variant ${variantIndex} is not deterministic`);
    assert(first.qlId === allocation.qlId, `${allocation.qlId} wrapper identity mismatch`);
    assert(first.freezeKey === allocation.freezeKey, `${allocation.qlId} freeze-key mismatch`);
    assert(first.prototypeId === ids[variantIndex], `${allocation.qlId} prototype selection mismatch`);
    assert(first.rawDiscoveryItem.candidateId === ids[variantIndex], `${allocation.qlId} raw prototype mismatch`);
    assert(first.question.length > 10, `${allocation.qlId} emitted an empty English question`);
    assert(first.explanation.length > 25, `${allocation.qlId} emitted an incomplete English explanation`);
    assert(first.maturity === "PERMANENT_IDENTITY_ENGLISH_CANDIDATE", `${allocation.qlId} leaked maturity`);
    assert(!first.englishImplementationFrozen && !first.active && !first.questionStudioDiscoverable, `${allocation.qlId} leaked downstream lifecycle`);
  }
}

console.log("Algebra permanent English adapter audit passed: 40 QLs, 105 mapped variants, 2 engine-only, 6 composition-only, 113 total candidates");

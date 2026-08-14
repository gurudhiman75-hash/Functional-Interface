import { MEN_CP_010_DISCOVERY_V2_CANDIDATES, auditMenCp010DiscoveryV2, generateMenCp010DiscoveryV2Probe } from "./discovery-v2";
function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
const audit = auditMenCp010DiscoveryV2();
assert(audit.candidateCount === 26, `Expected 26 discovery rows, got ${audit.candidateCount}.`);
assert(audit.executableCandidateCount === 21, `Expected 21 executable candidates, got ${audit.executableCandidateCount}.`);
assert(audit.ledgerOnlyCount === 5, `Expected 5 ledger rows, got ${audit.ledgerOnlyCount}.`);
assert(audit.axisCount === 6, `Expected all six discovery axes, got ${audit.axisCount}.`);
assert(audit.sourceLegacyRows === 2, "Expected both recovered CP-010 legacy motifs to be dispositioned.");
assert(audit.ownershipRows === 3, "Expected CP-011/012/013 ownership boundaries to be explicit.");
assert(audit.permanentQlCount === 0 && audit.productLocked, "Wave 02 must remain pre-QL and product-locked.");
assert(audit.unresolvedRows === 0, "Every Wave 02 row requires an explicit disposition.");

let deterministicPackages = 0;
const globalStems = new Set<string>();
for (const candidate of MEN_CP_010_DISCOVERY_V2_CANDIDATES.filter((row) => row.executable)) {
  const positions = new Set<number>();
  for (let i = 0; i < 64; i += 1) {
    const seed = `proof:${String(i).padStart(3, "0")}`;
    const a = generateMenCp010DiscoveryV2Probe(candidate.id, seed);
    const b = generateMenCp010DiscoveryV2Probe(candidate.id, seed);
    assert(a.verification.valid, `${candidate.id}/${seed}: verification failed.`);
    assert(a.stem === b.stem && a.answer === b.answer && a.correctIndex === b.correctIndex, `${candidate.id}/${seed}: deterministic replay drift.`);
    assert(JSON.stringify(a.options) === JSON.stringify(b.options), `${candidate.id}/${seed}: option replay drift.`);
    assert(a.options.length === 4 && new Set(a.options.map((o) => o.value)).size === 4, `${candidate.id}/${seed}: option uniqueness failed.`);
    assert(a.options.filter((o) => o.isCorrect).length === 1, `${candidate.id}/${seed}: one-correct invariant failed.`);
    assert(a.permanentQlId === null && a.productLocked, `${candidate.id}/${seed}: lifecycle leak.`);
    positions.add(a.correctIndex); globalStems.add(`${candidate.id}::${a.stem}`); deterministicPackages += 1;
  }
  assert(positions.size === 4, `${candidate.id}: did not reach all four answer positions.`);
}
assert(deterministicPackages === 1344, `Expected 1,344 packages, got ${deterministicPackages}.`);

const review = [] as ReturnType<typeof generateMenCp010DiscoveryV2Probe>[];
const usedReviewStems = new Set<string>();
for (const candidate of MEN_CP_010_DISCOVERY_V2_CANDIDATES.filter((row) => row.executable)) {
  for (let position = 0; position < 4; position += 1) {
    let selected: ReturnType<typeof generateMenCp010DiscoveryV2Probe> | null = null;
    for (let n = 0; n < 500; n += 1) {
      const q = generateMenCp010DiscoveryV2Probe(candidate.id, `review:${position}:${String(n).padStart(3, "0")}`);
      const key = `${candidate.id}::${q.stem}`;
      if (q.correctIndex === position && !usedReviewStems.has(key)) { selected = q; usedReviewStems.add(key); break; }
    }
    assert(selected, `${candidate.id}/${position}: could not find a unique balanced review record.`);
    review.push(selected);
  }
}
assert(review.length === 84, `Expected 84 review records, got ${review.length}.`);
assert(usedReviewStems.size === 84, `Expected 84 unique candidate/stem pairs, got ${usedReviewStems.size}.`);
assert(review.every((q) => q.options.every((o) => !o.value.includes("×"))), "Generic multiplicative fallback options are forbidden.");
const reviewPositions = [0,1,2,3].map((position) => review.filter((q) => q.correctIndex === position).length);
assert(reviewPositions.every((count) => count === 21), `Expected A21/B21/C21/D21, got ${reviewPositions.join("/")}.`);
console.log(JSON.stringify({ ...audit, deterministicPackages, uniqueCandidateStems: globalStems.size, reviewRecords: review.length, uniqueReviewStems: usedReviewStems.size, reviewPositions }, null, 2));

import { exactKey } from "../foundation/exact";
import {
  MEN_CP_012_DISCOVERY_V2_AUTHORITY,
  MEN_CP_012_DISCOVERY_V2_DEFINITIONS,
} from "./discovery-v2";
import {
  MEN_CP_012_DISCOVERY_V2_SAFE_RUNTIME_AUTHORITY,
  generateMenCp012DiscoveryV2Safe,
} from "./discovery-v2-runtime-safe";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(MEN_CP_012_DISCOVERY_V2_DEFINITIONS.length === 14, `Expected 14 Wave 02 candidates, got ${MEN_CP_012_DISCOVERY_V2_DEFINITIONS.length}.`);
assert(new Set(MEN_CP_012_DISCOVERY_V2_DEFINITIONS.map((row) => row.id)).size === 14, "Wave 02 candidate IDs must be unique.");
assert(new Set(MEN_CP_012_DISCOVERY_V2_DEFINITIONS.map((row) => row.clusterHint)).size === 6, "Expected six Wave 02 cluster hints.");

const dispositionCounts = Object.fromEntries(
  ["RETAIN_CANDIDATE", "MERGE_AS_REPRESENTATION", "MERGE_AS_DIRECTIONAL_INVERSE"].map((disposition) => [
    disposition,
    MEN_CP_012_DISCOVERY_V2_DEFINITIONS.filter((row) => row.disposition === disposition).length,
  ]),
);
assert(dispositionCounts.RETAIN_CANDIDATE === 6, `Expected 6 RETAIN_CANDIDATE rows, got ${dispositionCounts.RETAIN_CANDIDATE}.`);
assert(dispositionCounts.MERGE_AS_REPRESENTATION === 3, `Expected 3 MERGE_AS_REPRESENTATION rows, got ${dispositionCounts.MERGE_AS_REPRESENTATION}.`);
assert(dispositionCounts.MERGE_AS_DIRECTIONAL_INVERSE === 5, `Expected 5 MERGE_AS_DIRECTIONAL_INVERSE rows, got ${dispositionCounts.MERGE_AS_DIRECTIONAL_INVERSE}.`);

let deterministicPackageCount = 0;
let reroutedConstructionCount = 0;
for (const definition of MEN_CP_012_DISCOVERY_V2_DEFINITIONS) {
  const positions = new Set<number>();
  for (let index = 0; index < 64; index += 1) {
    const seed = `proof-v2:${definition.id}:${String(index).padStart(3, "0")}`;
    const first = generateMenCp012DiscoveryV2Safe(definition.id, seed);
    const second = generateMenCp012DiscoveryV2Safe(definition.id, seed);
    assert(first.authority === MEN_CP_012_DISCOVERY_V2_AUTHORITY, `${definition.id}/${seed}: discovery authority mismatch.`);
    assert(first.safeRuntimeAuthority === MEN_CP_012_DISCOVERY_V2_SAFE_RUNTIME_AUTHORITY, `${definition.id}/${seed}: safe-runtime authority mismatch.`);
    assert(first.requestedSeed === seed && first.seed === seed, `${definition.id}/${seed}: requested seed identity drift.`);
    assert(first.verification.valid, `${definition.id}/${seed}: exact conservation verification failed.`);
    assert(first.stem === second.stem, `${definition.id}/${seed}: stem replay drift.`);
    assert(first.constructionSeed === second.constructionSeed, `${definition.id}/${seed}: construction-seed replay drift.`);
    assert(first.correctIndex === second.correctIndex, `${definition.id}/${seed}: correct-position replay drift.`);
    assert(exactKey(first.exactAnswer) === exactKey(second.exactAnswer), `${definition.id}/${seed}: exact-answer replay drift.`);
    assert(JSON.stringify(first.options.map((option) => option.display)) === JSON.stringify(second.options.map((option) => option.display)), `${definition.id}/${seed}: option replay drift.`);
    assert(first.options.length === 4, `${definition.id}/${seed}: must have four options.`);
    assert(new Set(first.options.map((option) => option.display)).size === 4, `${definition.id}/${seed}: option displays must be unique.`);
    assert(first.options.filter((option) => option.isCorrect).length === 1, `${definition.id}/${seed}: exactly one option must be correct.`);
    assert(first.options[first.correctIndex]?.display === first.answer, `${definition.id}/${seed}: displayed-answer parity failed.`);
    if (first.answer.endsWith(" spheres") || first.answer.endsWith(" cubes") || first.answer.endsWith(" cylinders")) {
      assert(first.options.every((option) => /^\d+\s+(?:spheres|cubes|cylinders)$/.test(option.display)), `${definition.id}/${seed}: count options must remain whole counts.`);
    }
    assert(first.explanation.steps.length === 4, `${definition.id}/${seed}: explanation must have four steps.`);
    assert(first.permanentQlId === null, `${definition.id}/${seed}: permanent QL allocated during discovery.`);
    assert(!first.questionStudioDiscoverable && !first.publiclyPublishable, `${definition.id}/${seed}: product lifecycle leak.`);
    if (first.constructionSeed !== seed) reroutedConstructionCount += 1;
    positions.add(first.correctIndex);
    deterministicPackageCount += 1;
  }
  assert(positions.size === 4, `${definition.id}: A/B/C/D reachability failed.`);
}

console.log(JSON.stringify({
  authority: MEN_CP_012_DISCOVERY_V2_AUTHORITY,
  safeRuntimeAuthority: MEN_CP_012_DISCOVERY_V2_SAFE_RUNTIME_AUTHORITY,
  candidateCount: MEN_CP_012_DISCOVERY_V2_DEFINITIONS.length,
  deterministicPackages: deterministicPackageCount,
  reroutedConstructionCount,
  clusterHintCount: new Set(MEN_CP_012_DISCOVERY_V2_DEFINITIONS.map((row) => row.clusterHint)).size,
  dispositionCounts,
  permanentQlCount: 0,
  productLocked: true,
}, null, 2));

import assert from "node:assert/strict";

import {
  BLR_CP001_PERMANENT_CONTRACTS,
  type BlrCp001QlId,
} from "./cp001-permanent-contracts";
import { generateBlrCp001Question } from "./cp001-runtime";

const expectedQlIds = Array.from(
  { length: 7 },
  (_, index) => `BLR-QL-${String(index + 1).padStart(3, "0")}`,
);
assert.deepEqual(
  BLR_CP001_PERMANENT_CONTRACTS.map((contract) => contract.qlId),
  expectedQlIds,
);
assert.equal(BLR_CP001_PERMANENT_CONTRACTS.length, 7);
assert.equal(
  new Set(
    BLR_CP001_PERMANENT_CONTRACTS.map(
      (contract) => contract.solveAuthority,
    ),
  ).size,
  7,
);
assert.equal(
  new Set(
    BLR_CP001_PERMANENT_CONTRACTS.flatMap(
      (contract) => contract.sourcePrototypeIds,
    ),
  ).size,
  11,
);

const answerPositions = [0, 0, 0, 0];
const difficulties = new Set<string>();
const renderers = new Set<string>();
const answerTypes = new Set<string>();
const observedAuthorities = new Set<string>();
const observedSourcePrototypes = new Set<string>();
const namedRelationOutputs = new Set<string>();
const fingerprintsByQl = new Map<BlrCp001QlId, Set<string>>();
let generatedCount = 0;

for (const contract of BLR_CP001_PERMANENT_CONTRACTS) {
  const fingerprints = new Set<string>();
  fingerprintsByQl.set(contract.qlId, fingerprints);
  const seedCount = contract.qlId === "BLR-QL-001" ? 640 : 64;

  for (let seed = 0; seed < seedCount; seed += 1) {
    const first = generateBlrCp001Question(contract.qlId, seed);
    const repeat = generateBlrCp001Question(contract.qlId, seed);
    assert.deepEqual(
      repeat,
      first,
      `${contract.qlId}/${seed} must remain deterministic.`,
    );

    assert.equal(first.packageId, "BLR-001");
    assert.equal(first.checkpointId, "BLR-CP-001");
    assert.equal(first.qlId, contract.qlId);
    assert.equal(first.permanentQlId, contract.qlId);
    assert.equal(first.prototypeOnly, false);
    assert.equal(first.reviewOnly, true);
    assert.equal(first.publiclyPublishable, false);
    assert.equal(first.questionStudioVisible, false);
    assert.equal(first.mockTestEligible, false);
    assert.equal(first.locale, "en-IN");
    assert.equal(first.answerType, contract.answerType);
    assert.ok(!("prototypeId" in first));

    assert.equal(first.metadata.runtimeVersion, "blr-cp001-runtime-v1");
    assert.equal(first.metadata.qlId, contract.qlId);
    assert.equal(first.metadata.solveAuthority, contract.solveAuthority);
    assert.ok(
      contract.sourcePrototypeIds.includes(
        String(first.metadata.sourcePrototypeId) as never,
      ),
    );
    assert.equal(first.metadata.sourceSeed, seed);
    assert.ok(String(first.metadata.sourceRuntimeVersion).startsWith("blr-cp001-"));
    assert.ok(String(first.metadata.hiddenFingerprint).length >= 8);

    assert.ok(first.stem.trim().length > 40);
    assert.ok(first.stem.endsWith("?"));
    assert.equal(first.options.length, 4);
    assert.equal(new Set(first.options.map((option) => option.value)).size, 4);
    assert.equal(first.options.filter((option) => option.isCorrect).length, 1);
    assert.ok(first.correctIndex >= 0 && first.correctIndex < 4);
    assert.equal(first.options[first.correctIndex]?.isCorrect, true);
    assert.ok(
      first.options
        .filter((option) => !option.isCorrect)
        .every((option) => Boolean(option.errorLabel)),
    );

    assert.ok(first.explanation.coreConcept?.length);
    assert.ok(first.explanation.familyTreeGrid?.includes("Reference:"));
    assert.ok(first.explanation.generationAnalysis);
    assert.ok(first.explanation.examShortcut);
    assert.equal(first.explanation.distractorAnalysis?.length, 3);
    assert.ok(
      first.explanation.conclusion
        .toLocaleLowerCase("en-IN")
        .includes(
          first.options[first.correctIndex]!.value.toLocaleLowerCase("en-IN"),
        ),
    );

    const fingerprint = JSON.stringify({
      stem: first.stem,
      prompt: first.structuredPrompt,
      options: first.options.map((option) => option.value),
    });
    fingerprints.add(fingerprint);
    answerPositions[first.correctIndex] += 1;
    difficulties.add(first.difficulty);
    renderers.add(first.renderer);
    answerTypes.add(first.answerType);
    observedAuthorities.add(String(first.metadata.solveAuthority));
    observedSourcePrototypes.add(String(first.metadata.sourcePrototypeId));
    if (contract.qlId === "BLR-QL-001") {
      namedRelationOutputs.add(String(first.metadata.relationId));
    }
    generatedCount += 1;
  }

  assert.equal(
    fingerprints.size,
    seedCount,
    `${contract.qlId} must produce a distinct reviewed payload for every tested seed.`,
  );
}

assert.equal(generatedCount, 1024);
assert.deepEqual(answerPositions, [256, 256, 256, 256]);
assert.deepEqual([...difficulties].sort(), ["EASY", "HARD", "MEDIUM"]);
assert.deepEqual([...renderers].sort(), [
  "FAMILY_TREE_EXPLANATION",
  "STRUCTURED_TEXT",
]);
assert.deepEqual([...answerTypes].sort(), [
  "EXACT_LINEAGE_RELATION",
  "GENERATION_LABEL",
  "ORDERED_PAIR",
  "PERSON_NAME",
  "RELATION_CLAIM",
  "RELATION_LABEL",
]);
assert.equal(observedAuthorities.size, 7);
assert.equal(observedSourcePrototypes.size, 11);
for (const relationId of [
  "GREAT_GRANDFATHER",
  "GREAT_GRANDMOTHER",
  "GREAT_GRANDSON",
  "GREAT_GRANDDAUGHTER",
]) {
  assert.ok(
    namedRelationOutputs.has(relationId),
    `BLR-QL-001 did not reach ${relationId}.`,
  );
}

console.log("BLR-CP-001 permanent English runtime audit passed.", {
  qlRange: "BLR-QL-001..007",
  qlCount: BLR_CP001_PERMANENT_CONTRACTS.length,
  generatedCount,
  answerPositions,
  sourcePrototypeCount: observedSourcePrototypes.size,
  solveAuthorityCount: observedAuthorities.size,
  namedRelationCount: namedRelationOutputs.size,
  difficulties: [...difficulties].sort(),
  renderers: [...renderers].sort(),
  answerTypes: [...answerTypes].sort(),
});

import assert from "node:assert/strict";

import {
  BLR_CP001_REVIEW_REGISTRY,
  getBlrCp001ReviewEntry,
} from "./cp001-review-registry";

const GREAT_RELATIONS = [
  "GREAT_GRANDFATHER",
  "GREAT_GRANDMOTHER",
  "GREAT_GRANDSON",
  "GREAT_GRANDDAUGHTER",
] as const;

type GreatRelationId = (typeof GREAT_RELATIONS)[number];

const expectedDelta: Readonly<Record<GreatRelationId, string>> = {
  GREAT_GRANDFATHER: "+3",
  GREAT_GRANDMOTHER: "+3",
  GREAT_GRANDSON: "-3",
  GREAT_GRANDDAUGHTER: "-3",
};

assert.equal(BLR_CP001_REVIEW_REGISTRY.length, 11);
assert.equal(
  new Set(BLR_CP001_REVIEW_REGISTRY.map((entry) => entry.authority)).size,
  7,
  "The source gap must extend an existing authority rather than create a new one.",
);

const entry = getBlrCp001ReviewEntry(
  "BLR-CP001-PROT-COMPOSED-THREE-EDGE",
);
assert.equal(entry.authority, "RESOLVE_NAMED_PERSON_RELATION");

const counts = new Map<GreatRelationId, number>(
  GREAT_RELATIONS.map((relationId) => [relationId, 0]),
);
const answerPositions = [0, 0, 0, 0];
let generatedCount = 0;
let reviewedGapCount = 0;

for (let seed = 0; seed < 512; seed += 1) {
  const question = entry.generate(seed);
  const repeat = entry.generate(seed);
  assert.deepEqual(repeat, question, `Second-gap seed ${seed} must be deterministic.`);

  assert.equal(question.permanentQlId, null);
  assert.equal(question.prototypeOnly, true);
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.questionStudioVisible, false);
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options.map((option) => option.value)).size, 4);
  assert.equal(question.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(question.options[question.correctIndex]?.isCorrect, true);
  assert.ok(
    question.options
      .filter((option) => !option.isCorrect)
      .every((option) => Boolean(option.errorLabel)),
  );

  const relationId = String(question.metadata.relationId);
  if (GREAT_RELATIONS.includes(relationId as GreatRelationId)) {
    const typedRelationId = relationId as GreatRelationId;
    counts.set(typedRelationId, (counts.get(typedRelationId) ?? 0) + 1);
    reviewedGapCount += 1;

    assert.equal(question.metadata.pathLength, 3);
    assert.equal(
      question.metadata.sourceGapAuditVersion,
      "blr-cp001-second-gap-v1",
    );
    assert.ok(question.explanation.familyTreeGrid?.includes("Generation  0:"));
    assert.ok(
      question.explanation.familyTreeGrid?.includes(
        `Generation ${expectedDelta[typedRelationId].padStart(2, " ")}:`,
      ),
      `${typedRelationId}/${seed} lacks its generation-three grid row.`,
    );
    assert.ok(
      question.explanation.generationAnalysis?.some((line) =>
        line.includes(`ΔGen = ${expectedDelta[typedRelationId]}`),
      ),
      `${typedRelationId}/${seed} lacks explicit generation arithmetic.`,
    );
    assert.ok(
      question.explanation.coreConcept?.some((line) =>
        line.includes("Great-generation rule"),
      ),
    );
    assert.ok(
      question.explanation.examShortcut?.includes(
        expectedDelta[typedRelationId],
      ),
    );
    assert.ok(
      question.explanation.conclusion
        .toLocaleLowerCase("en-IN")
        .includes(
          question.options[question.correctIndex]!.value.toLocaleLowerCase("en-IN"),
        ),
    );
  }

  answerPositions[question.correctIndex] += 1;
  generatedCount += 1;
}

assert.equal(generatedCount, 512);
assert.deepEqual(answerPositions, [128, 128, 128, 128]);
assert.ok(reviewedGapCount >= 180, `Expected substantial gap coverage, observed ${reviewedGapCount}.`);
for (const relationId of GREAT_RELATIONS) {
  assert.ok(
    (counts.get(relationId) ?? 0) >= 40,
    `${relationId} did not receive enough deterministic coverage.`,
  );
}

console.log("BLR-CP-001 second source-and-gap audit passed.", {
  generatedCount,
  reviewedGapCount,
  answerPositions,
  relationCounts: Object.fromEntries(counts),
  prototypeCount: BLR_CP001_REVIEW_REGISTRY.length,
  authorityCount: new Set(
    BLR_CP001_REVIEW_REGISTRY.map((registryEntry) => registryEntry.authority),
  ).size,
  permanentQlCount: 0,
});

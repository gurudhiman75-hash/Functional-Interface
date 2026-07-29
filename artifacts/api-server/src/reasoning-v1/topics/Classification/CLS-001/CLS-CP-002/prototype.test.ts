import assert from "node:assert/strict";
import {
  CLS_CP002_CLASS_RELATION_IDS,
  CLS_CP002_FACTS,
  CLS_CP002_LEXICAL_RELATION_IDS,
  CLS_CP002_PROTOTYPES,
  CLS_CP002_RELATIONS,
  CLS_CP002_SEMANTIC_RELATION_IDS,
} from "./relation-registry";
import {
  auditClsCp002DisplayedPairs,
  generateClsCp002Prototype,
  getClsCp002PrototypeDefinitions,
  getClsCp002RelationRegistry,
  independentlyVerifyClsCp002Question,
} from "./runtime";
import type { ClsCp002Pair } from "./types";

assert.equal(CLS_CP002_SEMANTIC_RELATION_IDS.length, 15);
assert.equal(CLS_CP002_LEXICAL_RELATION_IDS.length, 12);
assert.equal(CLS_CP002_CLASS_RELATION_IDS.length, 24);
assert.equal(CLS_CP002_FACTS.length, 324);
assert.equal(CLS_CP002_RELATIONS.length, 51);
assert.equal(CLS_CP002_PROTOTYPES.length, 5);
assert.equal(getClsCp002PrototypeDefinitions().length, 5);
assert.equal(getClsCp002RelationRegistry().datasetVersion, "CLS-CP002-RELATION-DISCOVERY-v1");
assert.ok(CLS_CP002_FACTS.every((fact) => ![
  "SEM_COUNTRY_CAPITAL",
  "SEM_STATE_CAPITAL",
  "SEM_COUNTRY_CURRENCY",
].includes(fact.relationId)));

function auditFixture(
  pairs: readonly ClsCp002Pair[],
  eligible: readonly string[],
  expectedRelationId: string,
  expectedIndex: number,
): void {
  const result = auditClsCp002DisplayedPairs(pairs, eligible);
  assert.equal(result.result, "UNIQUE");
  assert.equal(result.winningRelationId, expectedRelationId);
  assert.equal(result.winningOutlierIndex, expectedIndex);
}

auditFixture(
  [
    { left: "Rapid", right: "Swift" },
    { left: "Silent", right: "Quiet" },
    { left: "Brief", right: "Concise" },
    { left: "Expand", right: "Contract" },
  ],
  CLS_CP002_LEXICAL_RELATION_IDS,
  "LEX_SYNONYM",
  3,
);

auditFixture(
  [
    { left: "Force", right: "Newton" },
    { left: "Power", right: "Watt" },
    { left: "Energy", right: "Joule" },
    { left: "Pressure", right: "Barometer" },
  ],
  [...CLS_CP002_SEMANTIC_RELATION_IDS, ...CLS_CP002_LEXICAL_RELATION_IDS],
  "SEM_QUANTITY_UNIT",
  3,
);

auditFixture(
  [
    { left: "Thermometer", right: "Temperature" },
    { left: "Ammeter", right: "Electric current" },
    { left: "Speedometer", right: "Speed" },
    { left: "Humidity", right: "Hygrometer" },
  ],
  [...CLS_CP002_SEMANTIC_RELATION_IDS, ...CLS_CP002_LEXICAL_RELATION_IDS],
  "SEM_INSTRUMENT_MEASUREMENT",
  3,
);

auditFixture(
  [
    { left: "Apple", right: "Grape" },
    { left: "Pear", right: "Peach" },
    { left: "Plum", right: "Fig" },
    { left: "Carrot", right: "Potato" },
  ],
  CLS_CP002_CLASS_RELATION_IDS,
  "PAIR_CLASS_CLS_FRUITS",
  3,
);

const noValid = auditClsCp002DisplayedPairs(
  [
    { left: "Rapid", right: "Swift" },
    { left: "Force", right: "Newton" },
    { left: "Apple", right: "Grape" },
    { left: "Thermometer", right: "Temperature" },
  ],
  [...CLS_CP002_SEMANTIC_RELATION_IDS, ...CLS_CP002_LEXICAL_RELATION_IDS, ...CLS_CP002_CLASS_RELATION_IDS],
);
assert.equal(noValid.result, "NO_VALID_RULE");

const fingerprints = new Set<string>();
const answerPositionsByOptionCount = new Map<4 | 5, number[]>([
  [4, [0, 0, 0, 0, 0]],
  [5, [0, 0, 0, 0, 0]],
]);
const relationCoverage = new Set<string>();
const difficultyCoverage = new Set<string>();
const prototypeCoverage = new Map<string, number>();
let generatedCount = 0;

for (const prototype of CLS_CP002_PROTOTYPES) {
  for (const optionCount of [4, 5] as const) {
    for (let seed = 0; seed < 200; seed += 1) {
      const question = generateClsCp002Prototype(prototype.prototypeId, seed, optionCount);
      const replay = generateClsCp002Prototype(prototype.prototypeId, seed, optionCount);
      assert.deepEqual(question, replay, `${prototype.prototypeId}/${optionCount}/${seed} is not deterministic`);

      assert.equal(question.checkpointId, "CLS-CP-002");
      assert.equal(question.prototypeId, prototype.prototypeId);
      assert.equal(question.task, "FIND_ODD_PAIR");
      assert.equal(question.options.length, optionCount);
      assert.equal(question.pairs.length, optionCount);
      assert.equal(question.metadata.optionCount, optionCount);
      assert.equal(new Set(question.options).size, optionCount);
      assert.equal(question.options[question.correctIndex], question.answer);
      assert.equal(question.evidenceByOption.length, optionCount);
      assert.equal(question.ambiguityAudit.result, "UNIQUE");
      assert.equal(question.ambiguityAudit.winningRelationId, question.intendedRelationId);
      assert.equal(question.ambiguityAudit.winningOutlierIndex, question.correctIndex);
      assert.equal(question.explanation.coreConcept.length, 1);
      assert.equal(question.explanation.stepByStep.length, 3);
      assert.equal(question.explanation.examSpeedShortcut.length, 1);
      assert.equal(question.explanation.commonTrapWarning.length, 1);
      assert.ok(question.explanation.stepByStep.join(" ").includes(question.answer));
      assert.ok(!/SEM_|LEX_|PAIR_CLASS_|quality rank|candidate relation|ontology|cross-cutting/i.test([
        question.stem,
        ...question.explanation.coreConcept,
        ...question.explanation.stepByStep,
        ...question.explanation.examSpeedShortcut,
        ...question.explanation.commonTrapWarning,
      ].join(" ")));
      assert.equal(question.lifecycle.permanentQlId, null);
      assert.equal(question.lifecycle.questionStudioDiscoverable, false);
      assert.equal(question.lifecycle.publiclyPublishable, false);
      assert.equal(question.lifecycle.testEligibility, "INELIGIBLE");

      const independent = independentlyVerifyClsCp002Question(question);
      assert.equal(independent.result, "UNIQUE");
      assert.equal(independent.winningRelationId, question.intendedRelationId);
      assert.equal(independent.winningOutlierIndex, question.correctIndex);

      const fingerprint = JSON.stringify({
        prototypeId: prototype.prototypeId,
        optionCount,
        pairs: question.pairs,
      });
      assert.ok(!fingerprints.has(fingerprint), `${prototype.prototypeId}/${optionCount}/${seed} collided`);
      fingerprints.add(fingerprint);
      answerPositionsByOptionCount.get(optionCount)![question.correctIndex] += 1;
      relationCoverage.add(question.intendedRelationId);
      difficultyCoverage.add(question.difficulty);
      prototypeCoverage.set(prototype.prototypeId, (prototypeCoverage.get(prototype.prototypeId) ?? 0) + 1);
      generatedCount += 1;
    }
  }
}

assert.equal(generatedCount, 2000);
assert.equal(fingerprints.size, 2000);
assert.deepEqual([...prototypeCoverage.values()], [400, 400, 400, 400, 400]);
assert.ok(relationCoverage.size >= 30, `Relation coverage is too narrow: ${relationCoverage.size}`);
assert.deepEqual(difficultyCoverage, new Set(["EASY", "MEDIUM", "HARD"]));
for (const [optionCount, positions] of answerPositionsByOptionCount) {
  const relevant = positions.slice(0, optionCount);
  assert.ok(relevant.every((count) => count > 0), `${optionCount}-option answer position missing: ${positions}`);
  assert.ok(
    Math.max(...relevant) / Math.min(...relevant) < 1.4,
    `${optionCount}-option answer positions are imbalanced: ${positions}`,
  );
}

assert.throws(() => generateClsCp002Prototype("CLS-CP002-PROT-001", -1));
assert.throws(() => generateClsCp002Prototype("CLS-CP002-PROT-001", 0, 3 as never));
assert.throws(() => generateClsCp002Prototype("CLS-CP002-PROT-999" as never, 0));

console.log("CLS-CP-002 semantic relationship-pair discovery audit passed.", {
  generatedCount,
  relations: CLS_CP002_RELATIONS.length,
  curatedFacts: CLS_CP002_FACTS.length,
  relationCoverage: relationCoverage.size,
  difficulties: [...difficultyCoverage].sort(),
  answerPositionsByOptionCount: Object.fromEntries(answerPositionsByOptionCount),
});

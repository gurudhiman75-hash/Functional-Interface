import assert from "node:assert/strict";
import {
  DSF_CP015_NUM_THREE_STATEMENT_PROTOTYPE_IDS,
  buildDsfCp015NumberSystemPrototypeCorpus,
  runDsfCp015NumberSystemPrototype,
} from "./number-system-three-statement-prototypes.ts";

const corpus = buildDsfCp015NumberSystemPrototypeCorpus(10);
assert.equal(corpus.length, 2);
assert.deepEqual(new Set(corpus.map((entry) => entry.prototypeId)), new Set(DSF_CP015_NUM_THREE_STATEMENT_PROTOTYPE_IDS));
assert.deepEqual(new Set(corpus.map((entry) => entry.evaluation.semanticKey)), new Set(["I|II+III", "I+II+III"]));

for (const entry of corpus) {
  assert.equal(entry.candidateQlId, "DSF-QL-CAND-002");
  assert.equal(entry.permanentQlId, null, "permanent DSF-QL-002 must remain unallocated before executable freeze");
  assert.equal(entry.sourceChapterId, "NUM-001");
  assert.equal(entry.sourceCapability, "NUM-001/foundation/divisibility");
  assert.equal(entry.problemTemplate, "42X");
  assert.equal(entry.evaluation.base.worldCount, 10);
  assert.equal(entry.evaluation.base.sufficient, false);
  assert.equal(entry.evaluation.subsetEvaluations.length, 7);
  assert.equal(entry.evaluation.allThree.consistent, true);
  assert.equal(entry.options.length, 5);
  assert.equal(entry.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(entry.options.find((option) => option.isCorrect)?.semanticKey, entry.evaluation.semanticKey);
  assert.equal(entry.lifecycle.questionStudioDiscoverable, false);
  assert.equal(entry.lifecycle.questionBankWritable, false);
  assert.equal(entry.lifecycle.testEligible, false);
  assert.equal(entry.lifecycle.mockTestEligible, false);
  assert.equal(entry.lifecycle.publiclyPublishable, false);
}

const mixed = runDsfCp015NumberSystemPrototype("DSF-CP015-NUM-MIXED-ALTERNATIVE", 21);
assert.equal(mixed.anchorDigit, 3);
assert.equal(mixed.evaluation.semanticKey, "I|II+III");
assert.deepEqual(
  mixed.evaluation.minimalSufficientSets.map((subset) => subset.join("+")),
  ["I", "II+III"],
  "mixed prototype must prove Statement I alone or Statements II+III together",
);

const allThree = runDsfCp015NumberSystemPrototype("DSF-CP015-NUM-ALL-THREE-REQUIRED", 22);
assert.equal(allThree.anchorDigit, 0);
assert.equal(allThree.evaluation.semanticKey, "I+II+III");
assert.deepEqual(
  allThree.evaluation.minimalSufficientSets.map((subset) => subset.join("+")),
  ["I+II+III"],
  "all-three prototype must require the full conjunction",
);
for (const pairKey of ["I+II", "I+III", "II+III"] as const) {
  const pair = allThree.evaluation.subsetEvaluations.find((entry) => entry.statementIds.join("+") === pairKey);
  assert(pair, `missing pair evaluation ${pairKey}`);
  assert.equal(pair.result.sufficient, false, `${pairKey} must remain insufficient in the all-three-required prototype`);
}
assert.equal(allThree.evaluation.allThree.sufficient, true);
assert.deepEqual(allThree.evaluation.allThree.normalizedTargetAnswers, ["0"]);

console.log(JSON.stringify({
  status: "PASS_DSF_CP015_NUM001_THREE_STATEMENT_SOURCE_PROTOTYPES",
  prototypeCount: corpus.length,
  semanticKeys: corpus.map((entry) => entry.evaluation.semanticKey),
  sourceWorldCount: corpus[0]?.evaluation.base.worldCount,
  permanentQlAllocated: false,
}, null, 2));

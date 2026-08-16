import assert from "node:assert/strict";
import { WOR_CP005_PROTOTYPES } from "./WOR-CP-005/registry";
import { independentlySolveBankingTrace } from "./foundation/banking-independent-solver";
import { classifyWorDifficulty } from "./foundation/difficulty";
import type { WorDifficulty } from "./foundation/types";
import { buildWorBankingReviewPack, renderWorBankingReviewMarkdown } from "./banking-review-pack";
import { generateWor001Question } from "./runtime";

assert.equal(WOR_CP005_PROTOTYPES.length, 5);
assert.equal(WOR_CP005_PROTOTYPES.filter((entry) => entry.allocationDecision === "RETAIN").length, 4);
assert.equal(WOR_CP005_PROTOTYPES.filter((entry) => entry.allocationDecision === "MERGE_AS_INSTANCE_VARIANT").length, 1);
assert.ok(WOR_CP005_PROTOTYPES.every((entry) => entry.sourceEvidenceStatus === "PYQ_SUPPORTED"));
assert.ok(WOR_CP005_PROTOTYPES.every((entry) => entry.optionCount === 5));

const optionPositions = [0, 0, 0, 0, 0];
const transformations = new Set<string>();
const taskKinds = new Set<string>();
const difficulties = new Set<string>();
let generated = 0;

for (const prototype of WOR_CP005_PROTOTYPES) {
  const supported = prototype.supportedDifficulties!;
  for (const [difficultyIndex, difficulty] of supported.entries()) {
    for (let seed = 0; seed < 60; seed += 1) {
      const actualSeed = seed + difficultyIndex * 1000;
      const english = generateWor001Question(prototype.prototypeId, actualSeed, "en-IN", difficulty);
      const repeated = generateWor001Question(prototype.prototypeId, actualSeed, "en-IN", difficulty);
      const hindi = generateWor001Question(prototype.prototypeId, actualSeed, "hi-IN", difficulty);
      const punjabi = generateWor001Question(prototype.prototypeId, actualSeed, "pa-IN", difficulty);
      assert.deepEqual(english, repeated, `${prototype.prototypeId}/${difficulty}/${actualSeed} is not deterministic.`);
      generated += 3;
      optionPositions[english.correctIndex] += 1;
      taskKinds.add(english.taskKind);
      difficulties.add(english.difficulty);
      assert.equal(english.checkpointId, "WOR-CP-005");
      assert.equal(english.options.length, 5);
      assert.equal(new Set(english.options.map((option) => option.value)).size, 5);
      assert.equal(english.metadata.optionCount, 5);
      assert.equal(english.metadata.objectMode, "LETTER_CLUSTER");
      assert.equal(english.metadata.sourceEvidenceStatus, "PYQ_SUPPORTED");
      assert.equal(english.difficulty, difficulty);
      assert.equal(english.difficulty, classifyWorDifficulty(english.metadata.difficultyFeatures));
      assert.equal(english.structuredPrompt.words.length, 5);
      assert.equal(new Set(english.structuredPrompt.words).size, 5);
      assert.ok(english.structuredPrompt.words.every((token) => /^[A-Z]{3}$/.test(token)));
      assert.equal(english.options[english.correctIndex]!.value, english.answer);
      assert.ok(english.explanation.includes(english.answer));
      assert.doesNotMatch(`${english.stem} ${english.explanation}`, /undefined|null|\{\{|\}\}|WOR-PROT|WOR-CP/);

      const trace = english.metadata.bankingTrace!;
      transformations.add(trace.transformation);
      const independent = independentlySolveBankingTrace(trace);
      assert.deepEqual(independent.transformedTokens, trace.transformedTokens);
      assert.deepEqual(independent.orderedTokens, trace.orderedTokens);
      assert.equal(independent.answer, english.answer);
      if (trace.transformation !== "NONE") {
        assert.equal(english.structuredPrompt.transformedWords?.length, 5);
        assert.equal(new Set(trace.transformedTokens).size, 5);
      }
      if (prototype.answerType === "LETTER") assert.match(english.answer, /^[A-Z]$/);
      else assert.match(english.answer, /^[A-Z]{3}$/);

      for (const localized of [hindi, punjabi]) {
        assert.deepEqual(localized.structuredPrompt, english.structuredPrompt);
        assert.deepEqual(localized.options, english.options);
        assert.equal(localized.correctIndex, english.correctIndex);
        assert.deepEqual(localized.metadata.bankingTrace, english.metadata.bankingTrace);
      }
      assert.match(hindi.stem, /[\u0900-\u097F]/);
      assert.match(punjabi.stem, /[\u0A00-\u0A7F]/);
    }
  }
  const unsupported: WorDifficulty[] = (["EASY", "MEDIUM", "HARD"] as const).filter((difficulty) => !supported.includes(difficulty));
  for (const difficulty of unsupported) {
    assert.throws(() => generateWor001Question(prototype.prototypeId, 7, "en-IN", difficulty), /does not support/);
  }
}

assert.equal(taskKinds.size, 5);
assert.ok(difficulties.has("MEDIUM") && difficulties.has("HARD"));
for (const position of optionPositions) assert.ok(position > 0, "A Banking answer position has no coverage.");
for (const transformation of ["SWAP_FIRST_SECOND", "SWAP_FIRST_LAST", "SORT_LETTERS_ASC", "SHIFT_FIRST_PREVIOUS", "SHIFT_FIRST_NEXT"]) {
  assert.ok(transformations.has(transformation), `Missing Banking transformation coverage: ${transformation}`);
}

for (const locale of ["en-IN", "hi-IN", "pa-IN"] as const) {
  const pack = buildWorBankingReviewPack(locale);
  assert.ok(pack.length >= 30);
  assert.ok(pack.every((question) => question.options.length === 5));
  const markdown = renderWorBankingReviewMarkdown(locale, pack);
  assert.match(markdown, /BANKING_FIVE_OPTION/);
  assert.doesNotMatch(markdown, /undefined|null|\{\{|\}\}/);
}

console.log("WOR-CP-005 Banking composite audit passed.", {
  prototypes: WOR_CP005_PROTOTYPES.length,
  retainedNewRoots: WOR_CP005_PROTOTYPES.filter((entry) => entry.allocationDecision === "RETAIN").length,
  generated,
  optionPositions,
  transformations: [...transformations].sort(),
  taskKinds: [...taskKinds].sort(),
  difficulties: [...difficulties].sort(),
});

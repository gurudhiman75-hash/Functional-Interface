import assert from "node:assert/strict";
import { APPROVED_SENTENCE_CODE_DISPLAY_TOKENS } from "./datasets/code-tokens";
import { ENGLISH_SENTENCE_CODE_LEXEMES } from "./datasets/lexemes.en";
import { ENGLISH_SENTENCE_CODE_FRAMES } from "./datasets/sentence-frames.en";
import {
  ENGLISH_SENTENCE_CODE_SCENARIOS,
  EnglishScenariosForTopology,
} from "./datasets/scenarios.en";
import { instantiateEnglishSentenceCodeTopology } from "./language-instantiator.en";
import { solveSentenceCodeConstraints } from "./constraint-solver";
import {
  classifyWordsToTokenSetRelation,
  classifyWordTokenRelation,
  possibleMissingTokens,
} from "./solution-space";
import { sentenceCodeTopologyFingerprint } from "./topology";
import { SENTENCE_CODE_TOPOLOGY_KINDS } from "./topology-generator";
import type { AbstractSentenceCodePuzzle } from "./types";

assert.equal(new Set(ENGLISH_SENTENCE_CODE_LEXEMES.map((entry) => entry.id)).size, ENGLISH_SENTENCE_CODE_LEXEMES.length);
assert.equal(new Set(ENGLISH_SENTENCE_CODE_LEXEMES.map((entry) => entry.display)).size, ENGLISH_SENTENCE_CODE_LEXEMES.length);
assert.equal(ENGLISH_SENTENCE_CODE_LEXEMES.every((entry) => entry.status === "REVIEWED"), true);
assert.equal(ENGLISH_SENTENCE_CODE_LEXEMES.every((entry) => /^[a-z]+$/.test(entry.display)), true);
assert.equal(new Set(APPROVED_SENTENCE_CODE_DISPLAY_TOKENS).size, APPROVED_SENTENCE_CODE_DISPLAY_TOKENS.length);
assert.equal(APPROVED_SENTENCE_CODE_DISPLAY_TOKENS.every((token) => /^[a-z]{2}$/.test(token)), true);
assert.equal(APPROVED_SENTENCE_CODE_DISPLAY_TOKENS.includes("no" as never), false);
assert.equal(new Set(ENGLISH_SENTENCE_CODE_FRAMES.map((frame) => frame.topologyKind)).size, SENTENCE_CODE_TOPOLOGY_KINDS.length);
assert.equal(new Set(ENGLISH_SENTENCE_CODE_SCENARIOS.map((scenario) => scenario.id)).size, ENGLISH_SENTENCE_CODE_SCENARIOS.length);

const exactCatalogueSentences = new Set<string>();
const scenarioReachability = new Map<string, number>();
const variantCounts = new Map<string, Set<string>>();
let explicitScenarioInstances = 0;
let generatedInstances = 0;
let displayedRowsAudited = 0;
let displayedMappingsSolved = 0;
let missingPresentationsAudited = 0;

function displayedPuzzle(instance: ReturnType<typeof instantiateEnglishSentenceCodeTopology>): AbstractSentenceCodePuzzle {
  return {
    rows: instance.rows.map((row) => ({
      rowId: row.rowId,
      wordIds: row.words,
      codeTokens: row.displayedCodeTokens,
    })),
  };
}

function auditInstance(instance: ReturnType<typeof instantiateEnglishSentenceCodeTopology>): void {
  assert.equal(instance.prototypeOnly, true);
  assert.equal(instance.permanentQlId, null);
  assert.equal(JSON.stringify(instance).includes("COD-QL-"), false);
  assert.equal(instance.rows.length, instance.reviewer.abstract.puzzle.rows.length);
  assert.equal(new Set(instance.rows.map((row) => row.sentence)).size, instance.rows.length);

  const visibleWords = new Set(Object.values(instance.reviewer.wordDisplayById));
  const visibleTokens = new Set(Object.values(instance.reviewer.internalToDisplayToken));
  assert.equal([...visibleTokens].every((token) => APPROVED_SENTENCE_CODE_DISPLAY_TOKENS.includes(token as never)), true);
  assert.equal([...visibleTokens].some((token) => visibleWords.has(token)), false);

  for (const row of instance.rows) {
    assert.equal(row.sentence.trim(), row.sentence);
    assert.equal(row.sentence.includes("{{"), false);
    assert.equal(row.sentence.includes("undefined"), false);
    assert.equal(/\s{2,}/.test(row.sentence), false);
    const normalizedSentenceWords = row.sentence.replace(/,/g, "").split(/\s+/);
    assert.deepEqual(normalizedSentenceWords, row.words);
    assert.equal(row.words.length, row.displayedCodeTokens.length);
    assert.equal(new Set(row.words).size, row.words.length);
    assert.equal(new Set(row.displayedCodeTokens).size, row.displayedCodeTokens.length);
    assert.equal(row.displayedCode, row.displayedCodeTokens.join(" "));
    displayedRowsAudited += 1;
  }

  const displayPuzzle = displayedPuzzle(instance);
  const displaySpace = solveSentenceCodeConstraints(displayPuzzle);
  assert.equal(displaySpace.solutionCount, instance.reviewer.abstract.expectedSolutionCount);
  assert.equal(
    sentenceCodeTopologyFingerprint(displayPuzzle),
    instance.reviewer.abstract.topologyFingerprint,
  );

  if (instance.topologyKind === "CONTROLLED_PARTIAL_INFORMATION") {
    assert.equal(classifyWordTokenRelation(displaySpace, instance.targetWord, instance.targetDisplayToken), "POSSIBLE");
  } else if (instance.topologyKind === "PHRASE_SET_COMPOSITION") {
    assert.equal(classifyWordsToTokenSetRelation(displaySpace, instance.phraseWords!, instance.phraseDisplayTokens!), "DEFINITE");
  } else {
    assert.equal(classifyWordTokenRelation(displaySpace, instance.targetWord, instance.targetDisplayToken), "DEFINITE");
  }

  if (instance.missingPresentation) {
    assert.equal((instance.missingPresentation.displayedCodeWithBlank.match(/\?/g) ?? []).length, 1);
    assert.equal(instance.missingPresentation.displayedKnownTokens.length + 1, instance.missingPresentation.sentence.replace(/,/g, "").split(/\s+/).length);
    assert.deepEqual(
      possibleMissingTokens(
        displaySpace,
        instance.missingPresentation.sentence.replace(/,/g, "").split(/\s+/),
        instance.missingPresentation.displayedKnownTokens,
      ),
      [instance.missingPresentation.correctDisplayToken],
    );
    missingPresentationsAudited += 1;
  }

  displayedMappingsSolved += 1;
}

for (const kind of SENTENCE_CODE_TOPOLOGY_KINDS) {
  const scenarios = EnglishScenariosForTopology(kind);
  assert.equal(scenarios.length, 5, `${kind} must have five reviewed English scenarios`);
  variantCounts.set(kind, new Set<string>());

  for (const [index, scenario] of scenarios.entries()) {
    const instance = instantiateEnglishSentenceCodeTopology(kind, 10_000 + index, scenario.id);
    assert.equal(instance.scenarioId, scenario.id);
    auditInstance(instance);
    explicitScenarioInstances += 1;

    for (const row of instance.rows) {
      const catalogueKey = `${kind}:${row.sentence}`;
      assert.equal(exactCatalogueSentences.has(catalogueKey), false, `Duplicate sentence inside ${kind}: ${row.sentence}`);
      exactCatalogueSentences.add(catalogueKey);
    }
  }

  for (let seed = 1; seed <= 160; seed += 1) {
    const first = instantiateEnglishSentenceCodeTopology(kind, seed);
    const second = instantiateEnglishSentenceCodeTopology(kind, seed);
    assert.deepEqual(first, second, `${kind}/${seed} must be deterministic`);
    auditInstance(first);
    scenarioReachability.set(first.scenarioId, (scenarioReachability.get(first.scenarioId) ?? 0) + 1);
    variantCounts.get(kind)!.add(JSON.stringify({
      scenarioId: first.scenarioId,
      rows: first.rows.map((row) => ({ sentence: row.sentence, code: row.displayedCode })),
      target: first.targetWord,
      targetCode: first.targetDisplayToken,
    }));
    generatedInstances += 1;
  }

  assert.ok(variantCounts.get(kind)!.size >= 150, `${kind} lacks visible English/token variation`);
  for (const scenario of scenarios) {
    assert.ok((scenarioReachability.get(scenario.id) ?? 0) > 0, `Scenario '${scenario.id}' is unreachable`);
  }
}

assert.equal(explicitScenarioInstances, 40);
assert.equal(generatedInstances, SENTENCE_CODE_TOPOLOGY_KINDS.length * 160);
assert.equal(missingPresentationsAudited, 5 + 160);

console.log(JSON.stringify({
  checkpoint: "COD-CP-009",
  maturity: "ENGLISH_LANGUAGE_DATA_PROTOTYPE",
  permanentQlsCreated: 0,
  lexemes: ENGLISH_SENTENCE_CODE_LEXEMES.length,
  frames: ENGLISH_SENTENCE_CODE_FRAMES.length,
  scenarios: ENGLISH_SENTENCE_CODE_SCENARIOS.length,
  scenariosPerTopology: 5,
  explicitScenarioInstances,
  generatedInstances,
  displayedRowsAudited,
  displayedMappingsSolved,
  missingPresentationsAudited,
  reachableScenarios: scenarioReachability.size,
  variantCounts: Object.fromEntries(
    SENTENCE_CODE_TOPOLOGY_KINDS.map((kind) => [kind, variantCounts.get(kind)!.size]),
  ),
  verdict: "PASS — CURATED ENGLISH SENTENCE-CODE LANGUAGE DATA",
}, null, 2));

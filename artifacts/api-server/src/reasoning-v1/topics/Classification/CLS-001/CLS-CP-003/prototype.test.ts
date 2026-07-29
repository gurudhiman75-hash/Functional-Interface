import assert from "node:assert/strict";
import {
  CLS_CP003_JUMBLE_WORDS,
  CLS_CP003_PROTOTYPES,
  CLS_CP003_WORDS,
} from "./word-dataset.en";
import { generateClsCp003DiscoveryQuestion } from "./discovery-runtime";
import {
  analyzeClsCp003Word,
  auditClsCp003DisplayedJumbles,
  auditClsCp003DisplayedWords,
  getClsCp003DatasetSummary,
  getClsCp003PrototypeDefinitions,
  independentlyVerifyClsCp003Question,
} from "./runtime";

assert.equal(CLS_CP003_PROTOTYPES.length, 7);
assert.equal(getClsCp003PrototypeDefinitions().length, 7);
assert.ok(CLS_CP003_WORDS.length >= 450, `Governed word pool is too small: ${CLS_CP003_WORDS.length}`);
assert.equal(CLS_CP003_JUMBLE_WORDS.length, 35);
assert.equal(new Set(CLS_CP003_WORDS.map((entry) => entry.word)).size, CLS_CP003_WORDS.length);
assert.ok(CLS_CP003_WORDS.every((entry) => /^[a-z]+$/.test(entry.word)));
assert.ok(CLS_CP003_WORDS.every((entry) => entry.sourceStatus === "CURATED"));
assert.ok(CLS_CP003_JUMBLE_WORDS.every((entry) => entry.sourceStatus === "CURATED"));
assert.equal(new Set(CLS_CP003_JUMBLE_WORDS.map((entry) => [...entry.canonicalWord].sort().join(""))).size, CLS_CP003_JUMBLE_WORDS.length);
assert.deepEqual(getClsCp003DatasetSummary(), {
  datasetVersion: "CLS-CP003-WORD-STRUCTURE-EN-v1",
  wordCount: CLS_CP003_WORDS.length,
  jumbleWordCount: 35,
  prototypeCount: 7,
  directRuleIds: [
    "WORD_LENGTH",
    "VOWEL_COUNT",
    "REPEATED_LETTER_TOPOLOGY",
    "PALINDROME_STATUS",
    "BOUNDARY_LETTER_CLASS",
    "PRIMARY_AFFIX",
  ],
  locale: "en-IN",
  permanentQlCount: 0,
});

assert.deepEqual(analyzeClsCp003Word("LEVEL"), {
  normalized: "level",
  length: 5,
  vowelCount: 2,
  consonantCount: 3,
  repeatedTopology: "MULTIPLE_REPEATED_LETTERS",
  palindrome: true,
  boundaryClass: "CONSONANT_CONSONANT",
  primaryAffix: "NONE",
});
assert.equal(analyzeClsCp003Word("BANANA").repeatedTopology, "TRIPLE_OR_MORE");
assert.equal(analyzeClsCp003Word("APPLE").repeatedTopology, "ONE_REPEATED_LETTER");
assert.equal(analyzeClsCp003Word("CRISP").repeatedTopology, "ALL_UNIQUE");

const lengthFixture = auditClsCp003DisplayedWords(
  ["BANK", "CARD", "FILM", "TIGER"],
  "WORD_LENGTH",
);
assert.equal(lengthFixture.result, "UNIQUE");
assert.equal(lengthFixture.outlierIndex, 3);
assert.equal(lengthFixture.intendedRuleSupported, true);

const ambiguousFixture = auditClsCp003DisplayedWords(["BANK", "CARD", "AREA", "TIGER"]);
assert.equal(ambiguousFixture.result, "AMBIGUOUS");

const noValidFixture = auditClsCp003DisplayedWords(["BANK", "CARD", "TIGER", "WHISPER"]);
assert.equal(noValidFixture.result, "NO_VALID_RULE");

const jumbleFixture = auditClsCp003DisplayedJumbles(["RAPEG", "ACHPE", "GOMAN", "GERTI"]);
assert.equal(jumbleFixture.result, "UNIQUE");
assert.equal(jumbleFixture.outlierIndex, 3);
assert.equal(auditClsCp003DisplayedWords(["RAPEG", "ACHPE", "GOMAN", "GERTI"]).result, "NO_VALID_RULE");

const fingerprints = new Set<string>();
const prototypeCoverage = new Map<string, number>();
const ruleCoverage = new Set<string>();
const taskCoverage = new Set<string>();
const difficultyCoverage = new Set<string>();
const optionCountCoverage = new Set<number>();
const answerPositionsByOptionCount = new Map<4 | 5, number[]>([
  [4, [0, 0, 0, 0, 0]],
  [5, [0, 0, 0, 0, 0]],
]);
let generatedCount = 0;

for (const prototype of CLS_CP003_PROTOTYPES) {
  for (const optionCount of [4, 5] as const) {
    for (let seed = 0; seed < 120; seed += 1) {
      const question = generateClsCp003DiscoveryQuestion(prototype.prototypeId, seed, optionCount);
      const replay = generateClsCp003DiscoveryQuestion(prototype.prototypeId, seed, optionCount);
      assert.deepEqual(question, replay, `${prototype.prototypeId}/${optionCount}/${seed} is not deterministic`);

      assert.equal(question.checkpointId, "CLS-CP-003");
      assert.equal(question.prototypeId, prototype.prototypeId);
      assert.equal(question.seed, seed);
      assert.equal(question.options.length, optionCount);
      assert.equal(question.canonicalWords.length, optionCount);
      assert.equal(question.options[question.correctIndex], question.answer);
      assert.equal(new Set(question.options).size, optionCount);
      assert.equal(question.evidenceByOption.length, optionCount);
      assert.equal(question.ambiguityAudit.result, "UNIQUE");
      assert.equal(question.ambiguityAudit.outlierIndex, question.correctIndex);
      assert.equal(question.ambiguityAudit.intendedRuleSupported, true);
      assert.equal(question.metadata.datasetVersion, "CLS-CP003-WORD-STRUCTURE-EN-v1");
      assert.equal(question.metadata.runtimeVersion, "cls-cp003-discovery-v1");
      assert.equal(question.metadata.locale, "en-IN");
      assert.equal(question.metadata.optionCount, optionCount);
      assert.equal(question.metadata.sourceSaturationStatus, "OPEN_FILE_LIBRARY_RETRY_REQUIRED");
      assert.equal(question.lifecycle.permanentQlId, null);
      assert.equal(question.lifecycle.questionBankStatus, "NOT_STORED");
      assert.equal(question.lifecycle.testEligibility, "INELIGIBLE");
      assert.equal(question.lifecycle.publiclyPublishable, false);
      assert.equal(question.lifecycle.questionStudioDiscoverable, false);
      assert.equal(question.explanation.coreConcept.length, 1);
      assert.equal(question.explanation.stepByStep.length, 3);
      assert.equal(question.explanation.examSpeedShortcut.length, 1);
      assert.equal(question.explanation.commonTrapWarning.length, 1);
      assert.ok(question.explanation.stepByStep.join(" ").includes(question.answer));
      assert.ok(!/different structural value/i.test(question.explanation.stepByStep.join(" ")));

      if (question.task === "RESOLVE_JUMBLES_AND_FIND_OUTLIER") {
        assert.ok(question.options.every((option, index) => option !== question.canonicalWords[index]!.toUpperCase()));
        assert.equal(question.intendedRuleId, "RESOLVED_SEMANTIC_CLASS");
        assert.equal(auditClsCp003DisplayedWords(question.options).result, "NO_VALID_RULE");
        assert.equal(question.ambiguityAudit.candidateSupports.length, 0);
        assert.match(question.ambiguityAudit.reason, /no visible structural shortcut/i);
      } else {
        assert.ok(question.options.every((option, index) => option === question.canonicalWords[index]!.toUpperCase()));
      }

      const independent = independentlyVerifyClsCp003Question(question);
      assert.equal(independent.result, "UNIQUE");
      assert.equal(independent.outlierIndex, question.correctIndex);

      const learnerText = [
        question.stem,
        ...question.options,
        question.answer,
        ...question.explanation.coreConcept,
        ...question.explanation.stepByStep,
        ...question.explanation.examSpeedShortcut,
        ...question.explanation.commonTrapWarning,
      ].join("\n");
      assert.ok(!/CLS-|PROT-|WORD_LENGTH|VOWEL_COUNT|PRIMARY_AFFIX|ontology|candidate rule|dataset version/i.test(learnerText));
      const placeholderMatch = learnerText.match(/(?:^|[\s:])(undefined|null|NaN|Infinity)(?=$|[\s.,;:])/);
      assert.equal(
        placeholderMatch,
        null,
        `${prototype.prototypeId}/${optionCount}/${seed} leaked ${placeholderMatch?.[1]}:\n${learnerText}`,
      );

      const fingerprint = JSON.stringify({
        prototypeId: question.prototypeId,
        optionCount,
        stem: question.stem,
        options: question.options,
        answer: question.answer,
      });
      fingerprints.add(fingerprint);
      prototypeCoverage.set(prototype.prototypeId, (prototypeCoverage.get(prototype.prototypeId) ?? 0) + 1);
      ruleCoverage.add(question.intendedRuleId);
      taskCoverage.add(question.task);
      difficultyCoverage.add(question.difficulty);
      optionCountCoverage.add(optionCount);
      answerPositionsByOptionCount.get(optionCount)![question.correctIndex] += 1;
      generatedCount += 1;
    }
  }
}

assert.equal(generatedCount, 1680);
assert.ok(fingerprints.size >= 1500, `Visible discovery diversity is too low: ${fingerprints.size}/1680`);
assert.deepEqual([...prototypeCoverage.values()], [240, 240, 240, 240, 240, 240, 240]);
assert.deepEqual(ruleCoverage, new Set([
  "WORD_LENGTH",
  "VOWEL_COUNT",
  "REPEATED_LETTER_TOPOLOGY",
  "PALINDROME_STATUS",
  "BOUNDARY_LETTER_CLASS",
  "PRIMARY_AFFIX",
  "RESOLVED_SEMANTIC_CLASS",
]));
assert.deepEqual(taskCoverage, new Set(["FIND_WORD_STRUCTURE_OUTLIER", "RESOLVE_JUMBLES_AND_FIND_OUTLIER"]));
assert.deepEqual(difficultyCoverage, new Set(["EASY", "MEDIUM", "HARD"]));
assert.deepEqual(optionCountCoverage, new Set([4, 5]));
for (const [optionCount, positions] of answerPositionsByOptionCount) {
  const relevant = positions.slice(0, optionCount);
  assert.ok(relevant.every((count) => count > 0), `${optionCount}-option answer position missing: ${positions}`);
  assert.ok(Math.max(...relevant) / Math.min(...relevant) < 1.7, `${optionCount}-option answer positions are imbalanced: ${positions}`);
}

assert.throws(() => generateClsCp003DiscoveryQuestion("CLS-CP003-PROT-001", -1));
assert.throws(() => generateClsCp003DiscoveryQuestion("CLS-CP003-PROT-001", 0, 3 as never));
assert.throws(() => generateClsCp003DiscoveryQuestion("CLS-CP003-PROT-999" as never, 0));
assert.throws(() => auditClsCp003DisplayedWords(["ONE", "TWO", "THREE"]));
assert.throws(() => auditClsCp003DisplayedJumbles(["ONE", "TWO", "THREE"]));

console.log("CLS-CP-003 lexical and word-structure discovery audit passed.", {
  generatedCount,
  uniqueVisibleQuestions: fingerprints.size,
  governedWords: CLS_CP003_WORDS.length,
  governedJumbleWords: CLS_CP003_JUMBLE_WORDS.length,
  prototypes: prototypeCoverage.size,
  rules: ruleCoverage.size,
  tasks: [...taskCoverage].sort(),
  difficulties: [...difficultyCoverage].sort(),
  answerPositionsByOptionCount: Object.fromEntries(answerPositionsByOptionCount),
  permanentQlCount: 0,
  jumbledSurfaceShortcutPolicy: "NO_DIRECT_STRUCTURAL_OUTLIER",
  sourceSaturationStatus: "OPEN_FILE_LIBRARY_RETRY_REQUIRED",
});
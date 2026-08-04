import assert from "node:assert/strict";
import type { SylLocale } from "../../foundation/types";
import { SYL_QL_REGISTRY } from "../ql-registry";
import { generateSylQuestionV3 } from "./generator";
import {
  hasPerfectPeriod,
  paritySignature,
  repeatedNgramRatio,
  validateSylQuestionV3,
} from "./validation";

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const seeds = Array.from({ length: 80 }, (_, index) => index);
const questions = SYL_QL_REGISTRY.flatMap((definition) =>
  seeds.flatMap((seed) => locales.map((locale) => generateSylQuestionV3(definition.qlId, seed, locale))),
);

assert.equal(questions.length, 18 * 80 * 3);
const svgTitleIds = new Set<string>();
const svgDescriptionIds = new Set<string>();
const contentDifficulty = new Map<string, { score: number; difficulty: string }>();
const logicalPayloads = new Set<string>();
const localeCounts = new Map<string, number>();

for (const question of questions) {
  const validation = validateSylQuestionV3(question);
  assert.equal(validation.ok, true, `${question.questionLanguageId}: ${validation.errors.join("; ")}`);
  assert.equal(question.versionTuple.contentVersion, "SYL_001_REMODEL_V3");
  assert.equal(question.versionTuple.proofGeneratorVersion, "syl-structured-proof-v3");
  assert.equal(question.versionTuple.diagramGeneratorVersion, "syl-combined-diagram-v3");
  assert.equal(question.explanation.schemaVersion, "syl-structured-proof-v3");
  assert.equal(question.explanation.optionAnalysis.length, question.options.length);
  assert.equal(question.explanation.statementMeanings.length, question.statements.length);
  assert.equal(question.explanation.combinedDiagram.diagramCount, 1);
  assert.equal(question.explanation.combinedDiagram.correctOptionOnly, true);
  assert.equal(question.explanation.combinedDiagram.allRelevantPremisesIncluded, true);
  assert.ok(question.explanation.combinedRelation.length >= 60);
  assert.ok(question.explanation.correctOptionProof.studentProof.length >= 80);
  assert.ok(question.explanation.fastRule.symbolic.length >= 12);
  assert.ok(question.explanation.fastRule.naturalLanguage.length >= 40);
  assert.equal(question.humanReviewStatus, "REVISE");
  assert.equal(question.lifecycle.questionStudioVisible, false);
  assert.equal(question.lifecycle.questionBankWritable, false);
  assert.equal(question.lifecycle.testEligible, false);
  assert.equal(question.lifecycle.publiclyPublishable, false);
  assert.ok(!svgTitleIds.has(question.explanation.combinedDiagram.titleId), `Duplicate SVG title ID ${question.explanation.combinedDiagram.titleId}`);
  assert.ok(!svgDescriptionIds.has(question.explanation.combinedDiagram.descriptionId), `Duplicate SVG description ID ${question.explanation.combinedDiagram.descriptionId}`);
  svgTitleIds.add(question.explanation.combinedDiagram.titleId);
  svgDescriptionIds.add(question.explanation.combinedDiagram.descriptionId);
  logicalPayloads.add(question.contentIdentity);
  localeCounts.set(question.locale, (localeCounts.get(question.locale) ?? 0) + 1);
  const difficulty = contentDifficulty.get(question.contentIdentity);
  if (difficulty) {
    assert.equal(question.difficultyScore, difficulty.score, `${question.contentIdentity} has locale-dependent semantic score.`);
    assert.equal(question.difficulty, difficulty.difficulty, `${question.contentIdentity} has locale-dependent difficulty.`);
  } else {
    contentDifficulty.set(question.contentIdentity, {
      score: question.difficultyScore,
      difficulty: question.difficulty,
    });
  }
}

assert.equal(svgTitleIds.size, questions.length);
assert.equal(svgDescriptionIds.size, questions.length);
const generatedLogicalCases = SYL_QL_REGISTRY.length * seeds.length;
const semanticRepeatCount = generatedLogicalCases - logicalPayloads.size;
assert.ok(logicalPayloads.size >= 1_200, `The V3 sweep exposes only ${logicalPayloads.size} distinct logical payloads.`);
assert.ok(semanticRepeatCount <= 240, `The V3 sweep repeats ${semanticRepeatCount} semantic payloads; the review pool needs broader scenario expansion.`);
assert.equal(localeCounts.get("en-IN"), 18 * 80);
assert.equal(localeCounts.get("hi-IN"), 18 * 80);
assert.equal(localeCounts.get("pa-IN"), 18 * 80);

for (const definition of SYL_QL_REGISTRY) {
  for (const seed of seeds) {
    const group = locales.map((locale) => generateSylQuestionV3(definition.qlId, seed, locale));
    const signatures = group.map((question) => JSON.stringify(paritySignature(question)));
    assert.equal(new Set(signatures).size, 1, `${definition.qlId}/${seed} lost multilingual semantic parity.`);
  }
}

const sequenceEvidence: Record<string, unknown> = {};
for (const definition of SYL_QL_REGISTRY) {
  const english = seeds.map((seed) => generateSylQuestionV3(definition.qlId, seed, "en-IN"));
  const sequence = english.map((question) => question.correctIndex);
  assert.equal(hasPerfectPeriod(sequence, 8), false, `${definition.qlId} has a perfect local answer-key cycle.`);
  for (const n of [3, 4, 5, 6, 7, 8]) {
    assert.ok(repeatedNgramRatio(sequence, n) < 0.5, `${definition.qlId} repeats too many answer-position ${n}-grams.`);
  }
  const counts = Array.from({ length: definition.optionCount }, (_, index) => sequence.filter((value) => value === index).length);
  assert.ok(counts.every((count) => count >= 7), `${definition.qlId} has a starved answer position: ${counts.join(",")}`);
  assert.ok(Math.max(...counts) - Math.min(...counts) <= 22, `${definition.qlId} answer-position balance is too uneven: ${counts.join(",")}`);
  sequenceEvidence[definition.qlId] = { counts, sequence: sequence.slice(0, 24) };
}

const difficultyCounts = Object.fromEntries(
  ["EASY", "MEDIUM", "HARD"].map((difficulty) => [
    difficulty,
    questions.filter((question) => question.locale === "en-IN" && question.difficulty === difficulty).length,
  ]),
);
assert.ok(difficultyCounts.EASY > 0);
assert.ok(difficultyCounts.MEDIUM > 0);
assert.ok(difficultyCounts.HARD > 0);

console.log(JSON.stringify({
  status: "PASS_SYL_001_REMODEL_V3_AUTHORITY",
  localizedQuestions: questions.length,
  generatedLogicalCases,
  uniqueLogicalPayloads: logicalPayloads.size,
  semanticRepeatCount,
  qlCount: SYL_QL_REGISTRY.length,
  locales,
  seedsPerQl: seeds.length,
  difficultyCounts,
  uniqueSvgTitleIds: svgTitleIds.size,
  uniqueSvgDescriptionIds: svgDescriptionIds.size,
  sequenceEvidence,
  lifecycle: {
    humanReviewStatus: "REVISE",
    questionStudioVisible: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
  },
}, null, 2));

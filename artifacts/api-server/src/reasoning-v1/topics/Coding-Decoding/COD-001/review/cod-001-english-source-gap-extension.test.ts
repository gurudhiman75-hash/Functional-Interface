import assert from "node:assert/strict";

import { generateCodCp001Question } from "../COD-CP-001/generator";
import { generateCodCp002Question } from "../COD-CP-002/generator";
import { generateCodCp003Question } from "../COD-CP-003/generator";
import { generateCodCp004Question } from "../COD-CP-004/generator";
import { generateCodCp005Question } from "../COD-CP-005/generator";
import { generateCodCp006Question } from "../COD-CP-006/generator";
import { generateCp007Question } from "../COD-CP-007/cp007-runtime";
import { generateCp008Question } from "../COD-CP-008/cp008-runtime";
import { generateCp009Question } from "../COD-CP-009/cp009-runtime";
import { generateCp010Question } from "../COD-CP-010/cp010-runtime";
import { COD_SOURCE_GAP_PERMANENT_CONTRACTS, type CodSourceGapQlId } from "../source-gap-permanent-contracts";
import { generateCodSourceGapPermanentQuestion } from "../source-gap-permanent-runtime";

interface LegacyQuestionLike {
  qlId?: string;
  permanentQlId?: string | null;
  stem: string;
  structuredPrompt: unknown;
  options: readonly unknown[];
  correctIndex: number;
}

function qlId(number: number): string {
  return `COD-QL-${String(number).padStart(3, "0")}`;
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`).join(",")}}`;
}

function optionSemanticValue(option: unknown): string {
  if (option === null || typeof option !== "object") return stableStringify(option);
  const record = option as Record<string, unknown>;
  for (const key of ["canonicalValue", "value", "answer", "text", "label"] as const) {
    if (key in record) return stableStringify(record[key]);
  }
  return stableStringify(record);
}

function generateLegacy(id: string, seed: number): LegacyQuestionLike {
  const number = Number(id.slice(-3));
  if (number <= 24) return generateCodCp001Question(id, seed) as LegacyQuestionLike;
  if (number <= 52) return generateCodCp002Question(id, seed) as LegacyQuestionLike;
  if (number <= 80) return generateCodCp003Question(id, seed) as LegacyQuestionLike;
  if (number <= 112) return generateCodCp004Question(id, seed) as LegacyQuestionLike;
  if (number <= 136) return generateCodCp005Question(id, seed) as LegacyQuestionLike;
  if (number <= 168) return generateCodCp006Question(id, seed) as LegacyQuestionLike;
  if (number <= 172) return generateCp007Question(id as never, seed) as LegacyQuestionLike;
  if (number <= 174) return generateCp008Question(id as never, seed) as LegacyQuestionLike;
  if (number <= 198) return generateCp009Question(id as never, seed) as LegacyQuestionLike;
  if (number === 199) return generateCp010Question(id as never, seed) as LegacyQuestionLike;
  throw new Error(`No legacy COD-001 checkpoint owns ${id}`);
}

function surfaceFingerprint(question: LegacyQuestionLike): string {
  return stableStringify({
    stem: question.stem,
    structuredPrompt: question.structuredPrompt,
    options: question.options.map(optionSemanticValue),
    correctIndex: question.correctIndex,
  });
}

const legacyFingerprints = new Map<string, string>();
for (let number = 1; number <= 199; number += 1) {
  const id = qlId(number);
  for (let seed = 1; seed <= 8; seed += 1) {
    const question = generateLegacy(id, seed);
    const fingerprint = surfaceFingerprint(question);
    const prior = legacyFingerprints.get(fingerprint);
    assert.equal(prior, undefined, `${id}/${seed} duplicates legacy sample ${prior}`);
    legacyFingerprints.set(fingerprint, `${id}/${seed}`);
  }
}

assert.deepEqual(
  COD_SOURCE_GAP_PERMANENT_CONTRACTS.map((contract) => contract.qlId),
  ["COD-QL-200", "COD-QL-201", "COD-QL-202", "COD-QL-203"],
);

const newFingerprints = new Map<string, string>();
const difficultyByQl = new Map<CodSourceGapQlId, Set<string>>();
const answerPositionsByQl = new Map<CodSourceGapQlId, Set<number>>();
let generatedNewQuestions = 0;

for (const contract of COD_SOURCE_GAP_PERMANENT_CONTRACTS) {
  const difficulties = new Set<string>();
  const answerPositions = new Set<number>();
  difficultyByQl.set(contract.qlId, difficulties);
  answerPositionsByQl.set(contract.qlId, answerPositions);

  for (let seed = 1; seed <= 120; seed += 1) {
    const question = generateCodSourceGapPermanentQuestion(contract.qlId, seed);
    const replay = generateCodSourceGapPermanentQuestion(contract.qlId, seed);
    assert.deepEqual(replay, question, `${contract.qlId}/${seed} is not deterministic`);
    assert.equal(question.qlId, contract.qlId);
    assert.equal(question.permanentQlId, contract.qlId);
    assert.equal(question.checkpointId, contract.checkpointId);
    assert.equal(question.ruleId, contract.ruleId);
    assert.equal(question.solveContractId, contract.solveContractId);
    assert.equal(question.locale, "en-IN");
    assert.equal(question.renderer, "EXAMPLE_TARGET_BLOCK");
    assert.equal(question.prototypeOnly, false);
    assert.equal(question.reviewOnly, true);
    assert.equal(question.questionStudioVisible, false);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.metadata.questionStudioDiscoverable, false);
    assert.equal(question.metadata.questionBankWritable, false);
    assert.equal(question.metadata.mockTestEligible, false);
    assert.equal(question.metadata.arbitraryFallbackUsed, false);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options.map((option) => option.value)).size, 4);
    assert.equal(question.options.filter((option) => option.isCorrect).length, 1);
    assert.equal(question.options[question.correctIndex]!.isCorrect, true);
    assert.ok(question.stem.trim().length >= 18);
    assert.ok(stableStringify(question.explanation).length >= 80);

    const fingerprint = surfaceFingerprint(question);
    assert.equal(legacyFingerprints.get(fingerprint), undefined, `${contract.qlId}/${seed} collides with legacy surface`);
    assert.equal(newFingerprints.get(fingerprint), undefined, `${contract.qlId}/${seed} duplicates ${newFingerprints.get(fingerprint)}`);
    newFingerprints.set(fingerprint, `${contract.qlId}/${seed}`);

    difficulties.add(question.difficulty);
    answerPositions.add(question.correctIndex);
    generatedNewQuestions += 1;
  }

  assert.ok(difficulties.size >= 2, `${contract.qlId} difficulty remains fixed`);
  assert.equal(answerPositions.size, 4, `${contract.qlId} does not reach all answer positions`);
}

assert.equal(generatedNewQuestions, 4 * 120);
assert.equal(newFingerprints.size, generatedNewQuestions);

console.log(JSON.stringify({
  status: "COD-001 ENGLISH SOURCE-GAP EXTENSION CLOSURE PASSED",
  englishPermanentRange: "COD-QL-001..203",
  englishPermanentQls: 203,
  legacyPermanentQls: 199,
  sourceGapPermanentQls: 4,
  localizedPermanentRangeUnchanged: "COD-QL-001..199",
  generatedSourceGapQuestions: generatedNewQuestions,
  sampledLegacyQuestionsForCollisionGate: legacyFingerprints.size,
  sourceGapExactCollisions: 0,
  legacyCrossCollisions: 0,
  questionStudioVisible: false,
  publiclyPublishable: false,
}, null, 2));

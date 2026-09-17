import assert from "node:assert/strict";

import { SCI_CP011_REVIEW_V1, validateSciCp011ReviewV1 } from "./matter-properties/sci-cp011-review-v1";
import { SCI_CP012_REVIEW_V1, validateSciCp012ReviewV1 } from "./atomic-structure/sci-cp012-review-v1";
import { SCI_CP013_REVIEW_V1, validateSciCp013ReviewV1 } from "./elements-periodic-table/sci-cp013-review-v1";
import { SCI_CP014_REVIEW_V1, validateSciCp014ReviewV1 } from "./chemical-reactions/sci-cp014-review-v1";
import { SCI_CP015_REVIEW_V1, validateSciCp015ReviewV1 } from "./acids-bases-salts/sci-cp015-review-v1";
import { SCI_CP016_REVIEW_V1, validateSciCp016ReviewV1 } from "./metals-nonmetals/sci-cp016-review-v1";
import { SCI_CP017_REVIEW_V1, validateSciCp017ReviewV1 } from "./carbon-compounds/sci-cp017-review-v1";
import { SCI_CP018_REVIEW_V1, validateSciCp018ReviewV1 } from "./everyday-chemistry/sci-cp018-review-v1";

type ChemistryQuestion = {
  questionId: string;
  cpId: string;
  qlId: string;
  qlName: string;
  difficulty: string;
  stem: string;
  options: string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  sourceIds: string[];
  sourceFactIds: string[];
  reviewOnly: boolean;
  runtimeRegistered: boolean;
};

type ValidatorResult = {
  valid: boolean;
  errors: string[];
  totalQuestions: number;
  qlCounts: Record<string, number>;
  difficultyCounts: Record<string, number>;
  answerPositionCounts: Record<string, number>;
};

const cps: readonly {
  cpId: string;
  questions: readonly ChemistryQuestion[];
  validate: () => ValidatorResult;
}[] = [
  { cpId: "SCI-CP-011", questions: SCI_CP011_REVIEW_V1, validate: validateSciCp011ReviewV1 },
  { cpId: "SCI-CP-012", questions: SCI_CP012_REVIEW_V1, validate: validateSciCp012ReviewV1 },
  { cpId: "SCI-CP-013", questions: SCI_CP013_REVIEW_V1, validate: validateSciCp013ReviewV1 },
  { cpId: "SCI-CP-014", questions: SCI_CP014_REVIEW_V1, validate: validateSciCp014ReviewV1 },
  { cpId: "SCI-CP-015", questions: SCI_CP015_REVIEW_V1, validate: validateSciCp015ReviewV1 },
  { cpId: "SCI-CP-016", questions: SCI_CP016_REVIEW_V1, validate: validateSciCp016ReviewV1 },
  { cpId: "SCI-CP-017", questions: SCI_CP017_REVIEW_V1, validate: validateSciCp017ReviewV1 },
  { cpId: "SCI-CP-018", questions: SCI_CP018_REVIEW_V1, validate: validateSciCp018ReviewV1 },
];

for (const cp of cps) {
  const result = cp.validate();
  assert.equal(result.valid, true, `${cp.cpId}: ${result.errors.join("; ")}`);
  assert.equal(result.totalQuestions, 60, `${cp.cpId}: expected 60 questions`);
  assert.equal(cp.questions.length, 60, `${cp.cpId}: corpus length mismatch`);
  assert.deepEqual(result.difficultyCounts, { Easy: 18, Medium: 30, Hard: 12 }, `${cp.cpId}: difficulty profile drift`);
  assert.deepEqual(result.answerPositionCounts, { A: 15, B: 15, C: 15, D: 15 }, `${cp.cpId}: answer-position drift`);
  assert.equal(Object.keys(result.qlCounts).length, 10, `${cp.cpId}: expected 10 QLs`);
  assert.ok(Object.values(result.qlCounts).every((count) => count === 6), `${cp.cpId}: every QL must own exactly six review questions`);
  assert.ok(cp.questions.every((q) => q.cpId === cp.cpId), `${cp.cpId}: foreign CP payload found`);
}

const allQuestions = cps.flatMap((cp) => [...cp.questions]);
assert.equal(allQuestions.length, 480, "Chemistry CP011-018 must contain exactly 480 English review questions");

const ids = new Set<string>();
const stems = new Set<string>();
const qlIds = new Map<string, number>();
const difficultyCounts: Record<string, number> = { Easy: 0, Medium: 0, Hard: 0 };
const answerPositionCounts = [0, 0, 0, 0];
const forbiddenInternalLeakage = /\b(review[- ]only|runtimeRegistered|sourceFactIds|candidate v\d+|question line|ql id)\b/i;
const optionAnalysisLeakage = /\b(option\s+[ABCD]|choice\s+[ABCD])\b/i;

for (const q of allQuestions) {
  assert.ok(!ids.has(q.questionId), `Cross-CP duplicate question id: ${q.questionId}`);
  ids.add(q.questionId);

  const normalizedStem = q.stem.trim().replace(/\s+/g, " ").toLowerCase();
  assert.ok(!stems.has(normalizedStem), `Cross-CP duplicate stem: ${q.stem}`);
  stems.add(normalizedStem);

  qlIds.set(q.qlId, (qlIds.get(q.qlId) ?? 0) + 1);
  difficultyCounts[q.difficulty] = (difficultyCounts[q.difficulty] ?? 0) + 1;
  assert.ok(q.correctIndex >= 0 && q.correctIndex <= 3, `${q.questionId}: invalid correct index`);
  answerPositionCounts[q.correctIndex] += 1;

  assert.equal(q.reviewOnly, true, `${q.questionId}: review-only lifecycle lost`);
  assert.equal(q.runtimeRegistered, false, `${q.questionId}: runtime registration opened before localization/freeze`);
  assert.equal(q.options.length, 4, `${q.questionId}: expected four options`);
  assert.equal(new Set(q.options).size, 4, `${q.questionId}: duplicate visible options`);
  assert.equal(q.options[q.correctIndex], q.canonicalAnswer, `${q.questionId}: answer-key mismatch`);
  assert.ok(q.sourceIds.length > 0 && q.sourceFactIds.length > 0, `${q.questionId}: provenance missing`);
  assert.ok(q.stem.trim().length >= 12, `${q.questionId}: stem is too thin to be exam-ready`);
  assert.ok(q.explanation.trim().length >= 20, `${q.questionId}: explanation is too thin`);
  assert.ok(!forbiddenInternalLeakage.test(q.stem), `${q.questionId}: internal metadata leaked into stem`);
  assert.ok(!forbiddenInternalLeakage.test(q.explanation), `${q.questionId}: internal metadata leaked into explanation`);
  assert.ok(!optionAnalysisLeakage.test(q.explanation), `${q.questionId}: option-by-option analysis leaked into explanation`);
  assert.ok(!/statement\s+i\s*\/\s*ii/i.test(q.qlName), `${q.questionId}: forced Statement I/II QL remains`);
}

assert.equal(ids.size, 480, "Question IDs must be unique chapter-wide");
assert.equal(stems.size, 480, "Stems must be unique chapter-wide");
assert.equal(qlIds.size, 80, "Chemistry must expose exactly 80 CP-owned QLs across CP011-018");
assert.ok([...qlIds.values()].every((count) => count === 6), "Every Chemistry QL must contribute exactly six questions");
assert.deepEqual(difficultyCounts, { Easy: 144, Medium: 240, Hard: 96 }, "Chapter-wide difficulty totals drifted");
assert.deepEqual(answerPositionCounts, [120, 120, 120, 120], "Chapter-wide answer positions are not perfectly balanced");
assert.ok(allQuestions.every((q) => !q.cpId.startsWith("SCI-CP-019")), "Biology leaked into Chemistry closure surface");

const report = {
  status: "PASS",
  scope: "SCI-CP-011 through SCI-CP-018 English V2",
  cps: cps.length,
  qls: qlIds.size,
  questions: allQuestions.length,
  difficultyCounts,
  answerPositionCounts: { A: answerPositionCounts[0], B: answerPositionCounts[1], C: answerPositionCounts[2], D: answerPositionCounts[3] },
  uniqueQuestionIds: ids.size,
  uniqueStems: stems.size,
  lifecycle: "review-only / runtime closed",
  nextGate: "Hindi + Punjabi localization",
};

console.log(JSON.stringify(report, null, 2));

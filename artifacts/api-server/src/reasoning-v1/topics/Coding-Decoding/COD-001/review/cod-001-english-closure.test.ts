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

interface QuestionLike {
  qlId?: string;
  permanentQlId?: string | null;
  checkpointId: string;
  locale: string;
  difficulty: string;
  renderer: string;
  stem: string;
  structuredPrompt: unknown;
  options: readonly unknown[];
  correctIndex: number;
  explanation: unknown;
  prototypeOnly?: boolean;
  reviewOnly?: boolean;
  questionStudioVisible?: boolean;
  publiclyPublishable?: boolean;
  metadata?: Readonly<Record<string, unknown>>;
}

function qlId(number: number): string {
  return `COD-QL-${String(number).padStart(3, "0")}`;
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`)
    .join(",")}}`;
}

function optionSemanticValue(option: unknown): string {
  if (option === null || typeof option !== "object") return stableStringify(option);
  const record = option as Record<string, unknown>;
  for (const key of ["canonicalValue", "value", "answer", "text", "label"] as const) {
    if (key in record) return stableStringify(record[key]);
  }
  for (const key of ["members", "tokens", "words"] as const) {
    const value = record[key];
    if (Array.isArray(value)) return stableStringify([...value].sort());
  }
  return stableStringify(record);
}

function optionIsCorrect(option: unknown): boolean {
  return Boolean(option && typeof option === "object" && (option as Record<string, unknown>).isCorrect);
}

function generate(id: string, seed: number): QuestionLike {
  const number = Number(id.slice(-3));
  if (number <= 24) return generateCodCp001Question(id, seed) as QuestionLike;
  if (number <= 52) return generateCodCp002Question(id, seed) as QuestionLike;
  if (number <= 80) return generateCodCp003Question(id, seed) as QuestionLike;
  if (number <= 112) return generateCodCp004Question(id, seed) as QuestionLike;
  if (number <= 136) return generateCodCp005Question(id, seed) as QuestionLike;
  if (number <= 168) return generateCodCp006Question(id, seed) as QuestionLike;
  if (number <= 172) return generateCp007Question(id as never, seed) as QuestionLike;
  if (number <= 174) return generateCp008Question(id as never, seed) as QuestionLike;
  if (number <= 198) return generateCp009Question(id as never, seed) as QuestionLike;
  if (number === 199) return generateCp010Question(id as never, seed) as QuestionLike;
  throw new Error(`No COD-001 checkpoint owns ${id}`);
}

function studentText(question: QuestionLike): string {
  return `${question.stem}\n${stableStringify(question.explanation)}`;
}

const ids = Array.from({ length: 199 }, (_, index) => qlId(index + 1));
assert.equal(ids[0], "COD-QL-001");
assert.equal(ids.at(-1), "COD-QL-199");
assert.equal(new Set(ids).size, 199);

const seedsPerQl = 12;
const answerPositions = [0, 0, 0, 0];
const difficulties = new Set<string>();
const renderers = new Set<string>();
const checkpoints = new Set<string>();
const exactQuestionFingerprints = new Map<string, string>();
const checkpointCounts = new Map<string, number>();
const fixedStemQlIds: string[] = [];
let generatedCount = 0;

for (const id of ids) {
  const stemFingerprints = new Set<string>();
  const promptFingerprints = new Set<string>();
  const explanationFingerprints = new Set<string>();

  for (let seed = 1; seed <= seedsPerQl; seed += 1) {
    const question = generate(id, seed);
    const repeated = generate(id, seed);
    assert.equal(stableStringify(question), stableStringify(repeated), `${id}/${seed} is not deterministic`);

    const resolvedId = question.qlId ?? question.permanentQlId;
    assert.equal(resolvedId, id, `${id}/${seed} returned identity ${resolvedId}`);
    assert.equal(question.locale, "en-IN", `${id}/${seed} is not English`);
    assert.ok(question.stem.trim().length >= 18, `${id}/${seed} has a short stem`);
    assert.equal(question.options.length, 4, `${id}/${seed} must have four options`);
    assert.ok(question.correctIndex >= 0 && question.correctIndex < 4, `${id}/${seed} has invalid correctIndex`);

    const semanticOptions = question.options.map(optionSemanticValue);
    assert.equal(new Set(semanticOptions).size, 4, `${id}/${seed} has duplicate option meanings`);
    const correctness = question.options.map(optionIsCorrect);
    assert.equal(correctness.filter(Boolean).length, 1, `${id}/${seed} must mark one correct option`);
    assert.equal(correctness[question.correctIndex], true, `${id}/${seed} correctIndex disagrees with option truth`);

    const explanationText = stableStringify(question.explanation);
    assert.ok(explanationText.length >= 80, `${id}/${seed} has an incomplete explanation`);
    const text = studentText(question);
    assert.doesNotMatch(text, /\b(?:TODO|TBD|FIXME|undefined|null)\b|\[object Object\]/iu, `${id}/${seed} leaks a placeholder`);
    assert.doesNotMatch(text, /COD-QL-|COD-CP-|RUNTIME_PROOF|ENGLISH_RUNTIME_PROOF|prototypeOnly|questionStudioVisible/u, `${id}/${seed} leaks an internal contract`);

    assert.notEqual(question.prototypeOnly, true, `${id}/${seed} remains prototype-only`);
    assert.notEqual(question.questionStudioVisible, true, `${id}/${seed} is visible in Question Studio`);
    assert.notEqual(question.publiclyPublishable, true, `${id}/${seed} is publicly publishable`);
    assert.notEqual(question.metadata?.publiclyPublishable, true, `${id}/${seed} metadata enables publication`);

    const fullFingerprint = stableStringify({
      stem: question.stem,
      structuredPrompt: question.structuredPrompt,
      options: semanticOptions,
      correct: semanticOptions[question.correctIndex],
    });
    const prior = exactQuestionFingerprints.get(fullFingerprint);
    assert.equal(prior, undefined, `${id}/${seed} exactly collides with ${prior}`);
    exactQuestionFingerprints.set(fullFingerprint, `${id}/${seed}`);

    stemFingerprints.add(question.stem.replace(/[A-Z0-9@#$%&*+=?!]+/gu, "¤").replace(/\s+/gu, " ").trim());
    promptFingerprints.add(stableStringify(question.structuredPrompt));
    explanationFingerprints.add(explanationText.replace(/[A-Z0-9@#$%&*+=?!]+/gu, "¤").replace(/\s+/gu, " ").trim());
    answerPositions[question.correctIndex] += 1;
    difficulties.add(question.difficulty);
    renderers.add(question.renderer);
    checkpoints.add(question.checkpointId);
    checkpointCounts.set(question.checkpointId, (checkpointCounts.get(question.checkpointId) ?? 0) + 1);
    generatedCount += 1;
  }

  assert.equal(promptFingerprints.size, seedsPerQl, `${id} repeats its structured question data across seeds`);
  assert.ok(explanationFingerprints.size >= 2, `${id} does not vary its English explanation across ${seedsPerQl} seeds`);
  if (stemFingerprints.size === 1) fixedStemQlIds.push(id);
}

assert.equal(generatedCount, 199 * seedsPerQl);
assert.deepEqual([...checkpoints].sort(), Array.from({ length: 10 }, (_, index) => `COD-CP-${String(index + 1).padStart(3, "0")}`));
assert.deepEqual([...difficulties].sort(), ["EASY", "HARD", "MEDIUM"]);
assert.ok(renderers.size >= 4, `Expected at least four renderers, found ${[...renderers].join(", ")}`);
assert.ok(answerPositions.every((count) => count > 0), `Not all answer positions were reached: ${answerPositions.join("/")}`);
const positionRatio = Math.max(...answerPositions) / Math.min(...answerPositions);
assert.ok(positionRatio <= 1.25, `Chapter answer-position ratio is too uneven: ${answerPositions.join("/")}`);
assert.ok(fixedStemQlIds.length <= 8, `Too many QLs have one fixed wording form: ${fixedStemQlIds.join(", ")}`);

console.log(JSON.stringify({
  status: "COD-001 ENGLISH RUNTIME CLOSURE PASSED",
  qlRange: "COD-QL-001..199",
  permanentQls: ids.length,
  checkpoints: [...checkpoints].sort(),
  generatedQuestions: generatedCount,
  seedsPerQl,
  answerPositions,
  answerPositionRatio: Number(positionRatio.toFixed(4)),
  difficulties: [...difficulties].sort(),
  renderers: [...renderers].sort(),
  checkpointQuestionCounts: Object.fromEntries([...checkpointCounts.entries()].sort()),
  exactQuestionCollisions: 0,
  fixedStemQlIds,
  questionStudioVisible: false,
  publiclyPublishable: false,
}, null, 2));

import assert from "node:assert/strict";
import { DIR_001_ENGLISH_FREEZE, assertDir001EnglishFreezeRegistry } from "./DIR-001-ENGLISH-FREEZE";
import { DIR_001_QLS, generateDirectionQuestion } from "./chapter-registry";

interface FrozenOption {
  readonly value: unknown;
  readonly label: string;
  readonly errorLabel: string | null;
}

interface FrozenQuestion {
  readonly qlId: string;
  readonly checkpointId: string;
  readonly ruleId: string;
  readonly seed: number;
  readonly difficulty: string;
  readonly stem: string;
  readonly structuredPrompt: unknown;
  readonly options: readonly FrozenOption[];
  readonly correctIndex: number;
  readonly correctAnswer: unknown;
  readonly explanation: unknown;
  readonly metadata: Readonly<Record<string, unknown>>;
  readonly questionDiagram?: unknown;
  readonly explanationDiagram?: unknown;
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function collectStrings(value: unknown, output: string[] = []): string[] {
  if (typeof value === "string") {
    output.push(value);
    return output;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectStrings(item, output);
    return output;
  }
  if (isRecord(value)) {
    for (const nested of Object.values(value)) collectStrings(nested, output);
  }
  return output;
}

function collectSvgs(value: unknown, output: string[] = []): string[] {
  if (Array.isArray(value)) {
    for (const item of value) collectSvgs(item, output);
    return output;
  }
  if (!isRecord(value)) return output;
  for (const [key, nested] of Object.entries(value)) {
    if (key === "svg" && typeof nested === "string") output.push(nested);
    else collectSvgs(nested, output);
  }
  return output;
}

function normalizedText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function learnerText(question: FrozenQuestion): string {
  return normalizedText([
    question.stem,
    ...question.options.map((option) => option.label),
    ...collectStrings(question.explanation),
  ].join(" "));
}

assertDir001EnglishFreezeRegistry();
assert.equal(DIR_001_ENGLISH_FREEZE.freezeStatus, "FROZEN_ENGLISH_BASELINE");
assert.equal(DIR_001_ENGLISH_FREEZE.chapterStatus, "LOCALIZATION_PENDING");
assert.equal(DIR_001_QLS.length, 44);

const generatedSeedsPerQl = 40;
const globalAnswerPositions = [0, 0, 0, 0];
const exactStemOwners = new Map<string, string>();
const stemDiversity = new Map<string, Set<string>>();
const explanationDiversity = new Map<string, Set<string>>();
const answerPositionCoverage = new Map<string, Set<number>>();
let generatedCases = 0;
let diagramCount = 0;

for (const ql of DIR_001_QLS) {
  stemDiversity.set(ql.qlId, new Set());
  explanationDiversity.set(ql.qlId, new Set());
  answerPositionCoverage.set(ql.qlId, new Set());

  for (let seed = 0; seed < generatedSeedsPerQl; seed += 1) {
    const first = generateDirectionQuestion(ql.qlId, seed) as unknown as FrozenQuestion;
    const replay = generateDirectionQuestion(ql.qlId, seed) as unknown as FrozenQuestion;
    assert.deepEqual(first, replay, `${ql.qlId} seed ${seed} is not deterministic`);

    assert.equal(first.qlId, ql.qlId);
    assert.equal(first.checkpointId, ql.checkpointId);
    assert.equal(first.ruleId, ql.ruleId);
    assert.equal(first.seed, seed);
    assert.ok(["EASY", "MEDIUM", "HARD"].includes(first.difficulty), `${ql.qlId} has invalid difficulty ${first.difficulty}`);
    assert.ok(first.structuredPrompt !== undefined, `${ql.qlId} seed ${seed} has no structured prompt`);

    const stem = normalizedText(first.stem);
    assert.ok(stem.length >= 30, `${ql.qlId} seed ${seed} has a short stem: ${stem}`);
    assert.ok(!/[{}]|\bundefined\b|\bnull\b|\[object Object\]/i.test(stem), `${ql.qlId} seed ${seed} has unresolved learner text: ${stem}`);

    assert.equal(first.options.length, 4, `${ql.qlId} seed ${seed} must have four options`);
    assert.ok(Number.isInteger(first.correctIndex) && first.correctIndex >= 0 && first.correctIndex < 4, `${ql.qlId} seed ${seed} has invalid correctIndex`);
    const optionLabels = first.options.map((option) => normalizedText(option.label));
    assert.equal(new Set(optionLabels.map((label) => label.toLocaleLowerCase("en-IN"))).size, 4, `${ql.qlId} seed ${seed} has duplicate options`);
    assert.ok(optionLabels.every((label) => label.length > 0), `${ql.qlId} seed ${seed} has a blank option`);
    assert.equal(first.options.filter((option) => option.errorLabel === null).length, 1, `${ql.qlId} seed ${seed} must have one correct-labelled option`);
    assert.deepEqual(first.options[first.correctIndex].value, first.correctAnswer, `${ql.qlId} seed ${seed} correct option does not match correctAnswer`);
    assert.equal(first.options[first.correctIndex].errorLabel, null, `${ql.qlId} seed ${seed} correct option carries an error label`);
    assert.equal(first.metadata.solverVerified, true, `${ql.qlId} seed ${seed} is not solver-verified`);

    const explanationStrings = collectStrings(first.explanation).map(normalizedText).filter(Boolean);
    const explanationFingerprint = explanationStrings.join(" | ");
    assert.ok(explanationStrings.length >= 2, `${ql.qlId} seed ${seed} has an incomplete explanation`);
    assert.ok(explanationFingerprint.length >= 40, `${ql.qlId} seed ${seed} has an under-developed explanation`);

    const visibleText = learnerText(first);
    assert.ok(!/\bDIR-(?:QL|CP)-\d{3}\b/.test(visibleText), `${ql.qlId} seed ${seed} leaks an internal ID`);
    assert.ok(!/[{}]|\bundefined\b|\bnull\b|\[object Object\]/i.test(visibleText), `${ql.qlId} seed ${seed} contains unresolved learner-facing content`);

    const svgs = [...new Set(collectSvgs(first))];
    for (const svg of svgs) {
      assert.ok(svg.startsWith("<svg") && svg.includes("</svg>"), `${ql.qlId} seed ${seed} contains malformed SVG`);
      assert.ok(/role=["']img["']/.test(svg), `${ql.qlId} seed ${seed} diagram lacks an image role`);
      assert.ok(/aria-label=/.test(svg), `${ql.qlId} seed ${seed} diagram lacks accessible text`);
    }
    diagramCount += svgs.length;

    const owner = exactStemOwners.get(stem);
    if (owner && owner !== ql.qlId) {
      throw new Error(`Exact English stem collision between ${owner} and ${ql.qlId}: ${stem}`);
    }
    exactStemOwners.set(stem, ql.qlId);
    stemDiversity.get(ql.qlId)!.add(stem);
    explanationDiversity.get(ql.qlId)!.add(explanationFingerprint);
    answerPositionCoverage.get(ql.qlId)!.add(first.correctIndex);
    globalAnswerPositions[first.correctIndex] += 1;
    generatedCases += 1;
  }
}

for (const ql of DIR_001_QLS) {
  assert.ok(stemDiversity.get(ql.qlId)!.size >= 20, `${ql.qlId} has weak stem diversity: ${stemDiversity.get(ql.qlId)!.size}`);
  assert.ok(explanationDiversity.get(ql.qlId)!.size >= 8, `${ql.qlId} has weak explanation diversity: ${explanationDiversity.get(ql.qlId)!.size}`);
  assert.ok(answerPositionCoverage.get(ql.qlId)!.size >= 3, `${ql.qlId} uses too few correct-answer positions`);
}

const leastUsedPosition = Math.min(...globalAnswerPositions);
const mostUsedPosition = Math.max(...globalAnswerPositions);
assert.ok(leastUsedPosition > 0 && mostUsedPosition / leastUsedPosition < 1.4, `Chapter-wide answer positions are imbalanced: ${globalAnswerPositions.join(", ")}`);
assert.throws(() => generateDirectionQuestion("DIR-QL-999", 0), /Unknown DIR-001 QL/);

console.log("DIR-001 English freeze proof passed", {
  qls: DIR_001_QLS.length,
  generatedCases,
  generatedSeedsPerQl,
  globalAnswerPositions,
  diagramCount,
  stemDiversity: Object.fromEntries([...stemDiversity].map(([qlId, values]) => [qlId, values.size])),
  explanationDiversity: Object.fromEntries([...explanationDiversity].map(([qlId, values]) => [qlId, values.size])),
});

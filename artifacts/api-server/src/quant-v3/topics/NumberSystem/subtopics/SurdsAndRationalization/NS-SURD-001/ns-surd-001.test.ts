import { strict as assert } from "node:assert";
import { NS_SURD_001 } from "./package";

type Variables = Record<string, number | string>;

const TOTAL_GENERATIONS = 1000;
const DUPLICATE_SAMPLE_SIZE = 1500;
const CP_IDS = [...NS_SURD_001.activeCps];
const STEM_ITEMS = NS_SURD_001.questionLanguageLibrary.items;

function renderQuestion(stem: string, variables: Variables): string {
  return stem.replace(/\{\{\{([^}]+)\}\}\}/g, (_match, variableName: string) => {
    const value = variables[variableName];
    assert.notEqual(value, undefined, `Missing variable for placeholder: ${variableName}`);
    return String(value);
  });
}

function assertNoUndefinedOrNaN(value: unknown, context: string): void {
  assert.notEqual(value, undefined, `${context} is undefined`);
  if (typeof value === "number") {
    assert.equal(Number.isNaN(value), false, `${context} is NaN`);
    assert.equal(Number.isFinite(value), true, `${context} is not finite`);
  }
  if (typeof value === "string") {
    assert.notEqual(value.includes("undefined"), true, `${context} contains undefined`);
    assert.notEqual(value.includes("NaN"), true, `${context} contains NaN`);
    assert.notEqual(value.trim().length, 0, `${context} is empty`);
  }
}

function assertNoBrokenFraction(value: string, context: string): void {
  if (!value.includes("\\frac")) {
    return;
  }
  assert.match(value, /\\frac\{.+\}\{.+\}/, `${context} contains a broken fraction`);
}

function collectQuestionSample(index: number) {
  const cpId = CP_IDS[index % CP_IDS.length]!;
  const stems = STEM_ITEMS.filter((item) => item.cpId === cpId);
  assert.ok(stems.length > 0, `No stems registered for ${cpId}`);
  const stemItem = stems[index % stems.length]!;
  const variables = NS_SURD_001.generator(cpId, stemItem.id);
  const validation = NS_SURD_001.validator(cpId, stemItem.id, variables);
  const solutionA = NS_SURD_001.solver({ cpId, qlId: stemItem.id, variables });
  const solutionB = NS_SURD_001.solver({ cpId, qlId: stemItem.id, variables: { ...variables } });
  const renderedQuestion = renderQuestion(stemItem.stem, variables);

  return {
    cpId,
    stemItem,
    variables,
    validation,
    solutionA,
    solutionB,
    renderedQuestion,
  };
}

for (let index = 0; index < TOTAL_GENERATIONS; index += 1) {
  const sample = collectQuestionSample(index);

  assert.equal(sample.validation.valid, true, sample.validation.reason ?? sample.cpId);
  assertNoUndefinedOrNaN(sample.renderedQuestion, `question:${sample.cpId}:${sample.stemItem.id}`);
  assert.equal(sample.renderedQuestion.includes("{{{"), false, `question placeholders unresolved for ${sample.stemItem.id}`);

  for (const [key, value] of Object.entries(sample.variables)) {
    assertNoUndefinedOrNaN(value, `variable:${sample.cpId}:${sample.stemItem.id}:${key}`);
  }

  assertNoUndefinedOrNaN(sample.solutionA.answer, `answer:${sample.cpId}:${sample.stemItem.id}`);
  assertNoBrokenFraction(sample.solutionA.answer, `answer:${sample.cpId}:${sample.stemItem.id}`);
  assert.equal(sample.solutionA.answer, sample.solutionB.answer, `solver nondeterminism for ${sample.cpId}:${sample.stemItem.id}`);
}

for (const cpId of CP_IDS) {
  const stems = STEM_ITEMS.filter((item) => item.cpId === cpId);
  assert.ok(stems.length > 0, `No stem coverage for ${cpId}`);

  for (const stemItem of stems) {
    const variables = NS_SURD_001.generator(cpId, stemItem.id);
    const validation = NS_SURD_001.validator(cpId, stemItem.id, variables);
    const solution = NS_SURD_001.solver({ cpId, qlId: stemItem.id, variables });
    const renderedQuestion = renderQuestion(stemItem.stem, variables);

    assert.equal(validation.valid, true, validation.reason ?? `${cpId}:${stemItem.id}`);
    assertNoUndefinedOrNaN(renderedQuestion, `cp-coverage-question:${cpId}:${stemItem.id}`);
    assertNoUndefinedOrNaN(solution.answer, `cp-coverage-answer:${cpId}:${stemItem.id}`);
    assertNoBrokenFraction(solution.answer, `cp-coverage-answer:${cpId}:${stemItem.id}`);
  }
}

const duplicateCounts = new Map<string, number>();
for (let index = 0; index < DUPLICATE_SAMPLE_SIZE; index += 1) {
  const sample = collectQuestionSample(index);
  duplicateCounts.set(sample.renderedQuestion, (duplicateCounts.get(sample.renderedQuestion) ?? 0) + 1);
}

const duplicateEntries = [...duplicateCounts.entries()].filter(([, count]) => count > 1);
const duplicateQuestionCount = duplicateEntries.reduce((total, [, count]) => total + count - 1, 0);
const duplicateRate = duplicateQuestionCount / DUPLICATE_SAMPLE_SIZE;

const formatterChecks = [
  NS_SURD_001.formatter.formatSurd(3, 5),
  NS_SURD_001.formatter.formatSurd(-2, 7, 3),
  NS_SURD_001.formatter.formatFraction(6, 5, 3),
  NS_SURD_001.formatter.formatSum(["2", "3\\sqrt{5}", "-\\sqrt{7}"]),
];

for (const [index, output] of formatterChecks.entries()) {
  assertNoUndefinedOrNaN(output, `formatter-output-${index}`);
  assertNoBrokenFraction(output, `formatter-output-${index}`);
}

assert.equal(NS_SURD_001.formatter.formatSurd(3, 5), NS_SURD_001.formatter.formatSurd(3, 5));
assert.equal(NS_SURD_001.formatter.formatFraction(6, 5, 3), NS_SURD_001.formatter.formatFraction(6, 5, 3));
assert.equal(
  NS_SURD_001.formatter.formatSum(["2", "3\\sqrt{5}", "-\\sqrt{7}"]),
  NS_SURD_001.formatter.formatSum(["2", "3\\sqrt{5}", "-\\sqrt{7}"]),
);

if (duplicateRate > 0.35) {
  console.warn(`NS-SURD-001 duplicate rate warning: ${(duplicateRate * 100).toFixed(2)}%`);
}

console.log(
  `NS-SURD-001 tests passed. Generated ${TOTAL_GENERATIONS} cases with duplicate rate ${(duplicateRate * 100).toFixed(2)}%.`,
);

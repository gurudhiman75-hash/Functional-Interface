import assert from "node:assert/strict";
import {
  CLOCK_EFFECTIVE_CANDIDATE_DISPOSITION,
  CLOCK_TASK_CATALOG,
  generateClockQuestion,
} from "../topics/Clocks/CLK-001/runtime";

const GENERIC_FALLBACK_CODES = new Set([
  "RECIPROCAL_OR_DOUBLE_ROUTE",
  "RESULT_HALVED_OR_DOUBLED",
  "RESULT_HALVED",
  "ONE_UNIT_BOUNDARY_ERROR",
  "QUERY_CONDITION_REJECTED",
  "SUFFICIENT_DATA_IGNORED",
  "VALID_EVENT_OMITTED",
  "SINGLE_CORRECT_CONTRACT_IGNORED",
]);

const anchorTaskIds = CLOCK_TASK_CATALOG
  .map(([taskId]) => taskId)
  .filter((taskId) =>
    CLOCK_EFFECTIVE_CANDIDATE_DISPOSITION[taskId].disposition === "PROVISIONAL_AUTHORITY_ANCHOR",
  );

const violations: Array<{
  taskId: string;
  seedIndex: number;
  stem: string;
  reasonCodes: readonly string[];
  displays: readonly string[];
}> = [];
const methodCoverage = new Map<string, Set<string>>();
let generated = 0;

for (const taskId of anchorTaskIds) {
  const methods = new Set<string>();
  for (let seedIndex = 0; seedIndex < 100; seedIndex += 1) {
    const question = generateClockQuestion({
      taskId,
      seed: `CLK-ANCHOR-DISTRACTOR-${taskId}-${seedIndex}`,
      locale: "en-IN",
      correctOptionIndex: (seedIndex % 4) as 0 | 1 | 2 | 3,
    });
    const wrongOptions = question.options.filter((option) => !option.isCorrect);
    assert.equal(wrongOptions.length, 3);
    assert.equal(new Set(wrongOptions.map((option) => option.semanticKey)).size, 3);
    assert.equal(new Set(wrongOptions.map((option) => option.display)).size, 3);

    const genericCodes = wrongOptions
      .map((option) => option.reasonCode)
      .filter((code) => GENERIC_FALLBACK_CODES.has(code) || code.startsWith("METHOD_FALLBACK_"));
    if (genericCodes.length > 0) {
      violations.push({
        taskId,
        seedIndex,
        stem: question.stem,
        reasonCodes: wrongOptions.map((option) => option.reasonCode),
        displays: wrongOptions.map((option) => option.display),
      });
    }
    for (const option of wrongOptions) methods.add(option.reasonCode);
    generated += 1;
  }
  methodCoverage.set(taskId, methods);
}

assert.equal(generated, anchorTaskIds.length * 100);
assert.deepEqual(
  violations,
  [],
  `Generic distractors leaked into learner anchors:\n${JSON.stringify(violations.slice(0, 40), null, 2)}`,
);
for (const taskId of anchorTaskIds) {
  assert(
    (methodCoverage.get(taskId)?.size ?? 0) >= 3,
    `${taskId} has fewer than three proved misconception methods across the anchor corpus.`,
  );
}

console.log(JSON.stringify({
  status: "PASS_CLK_001_ANCHOR_DISTRACTOR_QUALITY",
  anchorTaskCount: anchorTaskIds.length,
  generated,
  genericFallbackViolations: violations.length,
  methodCoverage: Object.fromEntries(
    [...methodCoverage.entries()].map(([taskId, methods]) => [taskId, [...methods].sort()]),
  ),
}, null, 2));

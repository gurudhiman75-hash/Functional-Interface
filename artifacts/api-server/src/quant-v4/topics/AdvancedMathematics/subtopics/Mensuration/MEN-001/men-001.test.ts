import { strict as assert } from "node:assert";
import {
  getMen001QuestionLanguageIds,
  validateMen001Libraries,
} from "./library";
import { generateMen001Parameters } from "./parameter-generator";
import { runMen001Pipeline } from "./pipeline";
import { solveMen001 } from "./solver";

const libraryValidation = validateMen001Libraries();
assert.equal(libraryValidation.valid, true, libraryValidation.failures.join("; "));
assert.deepEqual(getMen001QuestionLanguageIds(), [
  "MEN-001-QL-001",
  "MEN-001-QL-002",
  "MEN-001-QL-003",
  "MEN-001-QL-004",
  "MEN-001-QL-005",
]);

function fixedSolver(
  qlId: string,
  values: ReturnType<typeof generateMen001Parameters>["values"],
) {
  const generated = generateMen001Parameters("MEN-CP-001", {
    language: "en",
    questionLanguageId: qlId,
    seed: `fixed:${qlId}`,
  });
  return solveMen001({ ...generated, values, renderVariables: values as Record<string, number> });
}

assert.equal(
  fixedSolver("MEN-001-QL-001", { base: 12, height: 9 }).answer,
  "54 cm²",
);
assert.equal(
  fixedSolver("MEN-001-QL-002", { area: 60, base: 15 }).answer,
  "8 cm",
);
assert.equal(
  fixedSolver("MEN-001-QL-003", { sideA: 13, sideB: 14, sideC: 15 }).answer,
  "84 cm²",
);
assert.equal(
  fixedSolver("MEN-001-QL-004", { legA: 9, legB: 12 }).answer,
  "54 cm²",
);
const equilateral = fixedSolver("MEN-001-QL-005", { side: 12 });
assert.equal(equilateral.exactAnswer.kind, "SURD");
assert.equal(equilateral.answer, "$$36\\sqrt{3}\\,\\text{cm}^{2}$$");

const seenQlIds = new Set<string>();
for (const qlId of getMen001QuestionLanguageIds()) {
  for (let index = 0; index < 25; index += 1) {
    const seed = `men-001-runtime-proof:${qlId}:${index}`;
    const first = runMen001Pipeline("MEN-CP-001", {
      language: "en",
      questionLanguageId: qlId,
      seed,
    });
    const second = runMen001Pipeline("MEN-CP-001", {
      language: "en",
      questionLanguageId: qlId,
      seed,
    });
    assert.equal(
      first.validation.valid,
      true,
      first.validation.checks
        .filter((item) => !item.passed)
        .map((item) => `${item.name}: ${item.message}`)
        .join("; "),
    );
    assert.equal(first.stem, second.stem);
    assert.equal(first.answer, second.answer);
    assert.deepEqual(first.options, second.options);
    assert.equal(first.correctIndex, second.correctIndex);
    assert.equal(first.reasoningGraph.nodes.length, 3);
    assert.ok(first.explanation.lines.length >= 5);
    assert.equal(first.options.length, 4);
    assert.equal(new Set(first.options).size, 4);
    assert.equal(first.publiclyPublishable, false);
    assert.equal(first.maturity, "RUNTIME_PROOF");
    seenQlIds.add(first.questionLanguageId);
  }
}

assert.deepEqual([...seenQlIds].sort(), getMen001QuestionLanguageIds().sort());
assert.throws(
  () => runMen001Pipeline("MEN-CP-001", { language: "hi", seed: "unsupported-language" }),
  /supports English only/,
);

console.log("MEN-001 CP-001 runtime-proof test passed for 125 generated questions.");

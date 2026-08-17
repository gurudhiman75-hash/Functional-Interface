import { strict as assert } from "node:assert";
import { TMW_CP003_REGISTRY } from "./foundation/cp003-registry";
import { runTmwCp003Pipeline } from "./foundation/cp003-runtime";

assert.equal(TMW_CP003_REGISTRY.length, 23);
assert.equal(new Set(TMW_CP003_REGISTRY.map((entry) => entry.qlId)).size, 23);
assert.deepEqual(
  TMW_CP003_REGISTRY.map((entry) => entry.qlId),
  Array.from({ length: 23 }, (_, index) => `TMW-QL-${String(index + 35).padStart(3, "0")}`),
);

let generated = 0;
const correctPositions = new Set<number>();
const stems = new Set<string>();
for (const entry of TMW_CP003_REGISTRY) {
  for (let index = 0; index < 50; index += 1) {
    const seed = `tmw-cp003-proof:${entry.qlId}:${index}`;
    const first = runTmwCp003Pipeline({ questionLanguageId: entry.qlId, seed });
    const second = runTmwCp003Pipeline({ questionLanguageId: entry.qlId, seed });
    assert.equal(first.validation.valid, true, `${entry.qlId}:${first.validation.errors.join(", ")}`);
    assert.equal(first.stem, second.stem);
    assert.deepEqual(first.parameters, second.parameters);
    assert.deepEqual(first.options, second.options);
    assert.deepEqual(first.solution, second.solution);
    assert.deepEqual(first.explanation, second.explanation);
    assert.equal(first.mathematicalFingerprint, second.mathematicalFingerprint);
    assert.equal(first.options.length, 4);
    assert.equal(new Set(first.options).size, 4);
    assert.ok(first.correctIndex >= 0 && first.correctIndex < 4);
    assert.equal(first.optionAudit.filter((option) => option.misconceptionId === "CORRECT").length, 1);
    assert.equal(first.publiclyPublishable, false);
    assert.ok(first.explanation.formula.startsWith("\\("));
    assert.ok(first.explanation.steps.length >= 3);
    assert.ok(first.explanation.shortcut.title.startsWith("10-Second "));
    assert.ok(first.explanation.shortcut.steps.length >= 1);
    assert.notEqual(first.explanation.commonTrap.misconceptionId, "CORRECT");
    assert.ok(first.optionAudit.some((option) => option.text === first.explanation.commonTrap.optionText && option.misconceptionId === first.explanation.commonTrap.misconceptionId));
    assert.equal(/Do not choose|Don't choose/i.test(first.explanation.commonTrap.explanation), false);
    assert.equal(/[A-Z]{3,}_[A-Z_]{3,}/.test(first.explanation.commonTrap.explanation), false);
    const visibleText = [
      first.stem,
      ...first.options,
      first.solution.answerText,
      first.explanation.opening,
      first.explanation.formula,
      ...first.explanation.steps,
      first.explanation.shortcut.title,
      ...first.explanation.shortcut.steps,
      first.explanation.commonTrap.optionLabel,
      first.explanation.commonTrap.optionText,
      first.explanation.commonTrap.explanation,
      first.explanation.conclusion,
    ].join("\n");
    assert.equal(/undefined|null|NaN|Infinity|\{\{|\$\{/.test(visibleText), false);
    assert.equal((visibleText.match(/\\\(/g) ?? []).length, (visibleText.match(/\\\)/g) ?? []).length);
    assert.equal(/\\frac/.test(visibleText.replace(/\\\([\s\S]*?\\\)/g, "")), false);
    assert.equal(/\b(?:\d+\s+)?\d+\/\d+\s+(?:minutes?|hours?|days?|shifts?)\b/i.test(visibleText), false);
    correctPositions.add(first.correctIndex);
    stems.add(first.stem);
    generated += 1;
  }
}

assert.deepEqual([...correctPositions].sort(), [0, 1, 2, 3]);
assert.ok(stems.size >= 350, `Expected broad rendered-stem diversity, received ${stems.size}`);
const hindi = runTmwCp003Pipeline({ questionLanguageId: "TMW-QL-035", seed: "locale-support", language: "hi" });
assert.equal(hindi.language, "hi");
assert.equal(hindi.locale, "hi-IN");
assert.equal(hindi.publiclyPublishable, false);
assert.throws(() => runTmwCp003Pipeline({ questionLanguageId: "TMW-QL-999", seed: "unknown" }), /Unknown TMW-CP-003/);

console.log(JSON.stringify({ chapter: "TMW-001", checkpoint: "TMW-CP-003", qlCount: 23, seedsPerQl: 50, generated, distinctStems: stems.size, correctPositions: [...correctPositions].sort(), status: "PASS" }, null, 2));

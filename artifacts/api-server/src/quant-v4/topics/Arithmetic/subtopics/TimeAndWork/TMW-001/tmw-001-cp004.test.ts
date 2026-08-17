import { strict as assert } from "node:assert";
import { TMW_CP004_REGISTRY } from "./foundation/cp004-registry";
import { runTmwCp004Pipeline } from "./foundation/cp004-runtime";

assert.equal(TMW_CP004_REGISTRY.length, 24);
assert.equal(new Set(TMW_CP004_REGISTRY.map((entry) => entry.qlId)).size, 24);
assert.deepEqual(
  TMW_CP004_REGISTRY.map((entry) => entry.qlId),
  Array.from({ length: 24 }, (_, index) => `TMW-QL-${String(index + 58).padStart(3, "0")}`),
);

let cases = 0;
const positions = new Set<number>();
const stems = new Set<string>();
for (const entry of TMW_CP004_REGISTRY) {
  const fingerprints = new Set<string>();
  const contexts = new Set<string>();
  for (let index = 0; index < 50; index += 1) {
    const seed = `tmw-cp004-proof:${entry.qlId}:${index}`;
    const first = runTmwCp004Pipeline({ questionLanguageId: entry.qlId, seed });
    const second = runTmwCp004Pipeline({ questionLanguageId: entry.qlId, seed });
    assert.deepEqual(first, second);
    assert.equal(first.validation.valid, true, `${entry.qlId}:${first.validation.errors.join("; ")}`);
    assert.equal(first.options.length, 4);
    assert.equal(new Set(first.options).size, 4);
    assert.equal(first.optionAudit[first.correctIndex]?.misconceptionId, "CORRECT");
    assert.equal(first.options[first.correctIndex], first.solution.answerText);
    assert.equal(first.optionAudit.filter((option) => option.misconceptionId === "CORRECT").length, 1);
    assert.equal(first.publiclyPublishable, false);
    assert.ok(first.explanation.formula.startsWith("\\("));
    assert.ok(first.explanation.steps.length >= 3);
    assert.ok(first.explanation.shortcut.title.startsWith("10-Second "));
    assert.ok(first.explanation.shortcut.steps.length >= 1);
    assert.notEqual(first.explanation.commonTrap.misconceptionId, "CORRECT");
    assert.ok(first.optionAudit.some(
      (option) => option.text === first.explanation.commonTrap.optionText
        && option.misconceptionId === first.explanation.commonTrap.misconceptionId,
    ));
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
    positions.add(first.correctIndex);
    stems.add(first.stem);
    fingerprints.add(first.mathematicalFingerprint);
    contexts.add(first.parameters.context.jobPhrase);
    cases += 1;
  }
  assert.ok(fingerprints.size >= 4, `${entry.qlId} lacks mathematical diversity`);
  assert.ok(contexts.size >= 2, `${entry.qlId} lacks context diversity`);
}
assert.deepEqual([...positions].sort(), [0, 1, 2, 3]);
assert.ok(stems.size >= 250, `Expected at least 250 distinct stems, found ${stems.size}`);

const hindi = runTmwCp004Pipeline({ questionLanguageId: "TMW-QL-058", seed: "localized-smoke", language: "hi" });
const punjabi = runTmwCp004Pipeline({ questionLanguageId: "TMW-QL-058", seed: "localized-smoke", language: "pa" });
assert.equal(hindi.validation.valid, true);
assert.equal(punjabi.validation.valid, true);
assert.equal(hindi.sourceLanguage, "en");
assert.equal(punjabi.sourceLanguage, "en");
assert.equal(hindi.publiclyPublishable, false);
assert.equal(punjabi.publiclyPublishable, false);
assert.throws(
  () => runTmwCp004Pipeline({ questionLanguageId: "TMW-QL-999", seed: "unknown" }),
  /Unknown TMW-CP-004/,
);

console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-004",
  qlCount: TMW_CP004_REGISTRY.length,
  seedsPerQl: 50,
  cases,
  correctPositions: [...positions].sort(),
  distinctStems: stems.size,
  status: "PASS",
}, null, 2));

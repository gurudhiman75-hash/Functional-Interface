import assert from "node:assert/strict";
import { exactKey, isPositive } from "../../foundation/exact";
import {
  auditMenCp008FrozenRegistry,
  getMenCp008FrozenQlIds,
  MEN_CP_008_FROZEN_QLS,
} from "../final-freeze/registry";
import { getMenCp008PublicTrapCode } from "./editorial";
import { generateMenCp008PermanentQuestion } from "./runtime";

const registryAudit = auditMenCp008FrozenRegistry();
const qlIds = getMenCp008FrozenQlIds();

assert.equal(registryAudit.qlCount, 52);
assert.equal(registryAudit.firstQlId, "MEN-002-QL-044");
assert.equal(registryAudit.lastQlId, "MEN-002-QL-095");
assert.equal(registryAudit.uniqueQlIds, 52);
assert.equal(registryAudit.contiguousQlIds, true);
assert.equal(registryAudit.ancestryCount, 66);
assert.equal(registryAudit.uniqueAncestryCount, 66);
assert.equal(registryAudit.permanentIdentityFrozen, true);
assert.equal(registryAudit.lifecycleLocked, true);
assert.equal(qlIds.length, 52);

let generated = 0;
const provenAncestries = new Set<string>();
const seenDifficulties = new Set<string>();
const seenTargets = new Set<string>();

for (const definition of MEN_CP_008_FROZEN_QLS) {
  const answerPositions = new Set<number>();
  const stems = new Set<string>();

  for (const prototypeId of definition.prototypeIds) {
    const ancestrySeed = `men-002-cp008-permanent-ancestry:${definition.qlId}:${prototypeId}`;
    const question = generateMenCp008PermanentQuestion(definition.qlId, ancestrySeed, prototypeId);
    assert.equal(question.prototypeId, prototypeId);
    assert.equal(question.permanentQlId, definition.qlId);
    assert.equal(question.validation.valid, true);
    assert.equal(question.sourceValidation.valid, true);
    assert.equal(question.verification.valid, true);
    provenAncestries.add(prototypeId);
    generated += 1;
  }

  for (let index = 0; index < 80; index += 1) {
    const seed = `men-002-cp008-permanent:${definition.qlId}:${index}`;
    const first = generateMenCp008PermanentQuestion(definition.qlId, seed);
    const second = generateMenCp008PermanentQuestion(definition.qlId, seed);
    assert.deepEqual(first, second, `${definition.qlId} must regenerate deterministically for ${seed}.`);

    const failures = first.validation.checks
      .filter((check) => !check.passed)
      .map((check) => `${check.name}: ${check.message}`)
      .join("; ");
    assert.equal(first.validation.valid, true, `${definition.qlId} ${seed}: ${failures}`);
    assert.equal(first.sourceValidation.valid, true);
    assert.equal(first.verification.valid, true);
    assert.equal(first.permanentQlId, definition.qlId);
    assert.equal(first.templateId, definition.templateId);
    assert.equal(first.candidateId, definition.candidateId);
    assert.equal(first.canonicalKey, definition.canonicalKey);
    assert.ok(definition.prototypeIds.includes(first.prototypeId));
    assert.deepEqual(first.prototypeAncestries, definition.prototypeIds);
    assert.equal(first.permanentIdentityFrozen, true);
    assert.equal(first.maturity, "IMPLEMENTATION_PROOF");
    assert.equal(first.allocationStatus, "ALLOCATED_IMPLEMENTATION_PROOF");
    assert.equal(first.reviewStatus, "ENGLISH_IMPLEMENTATION_FROZEN");
    assert.equal(first.questionBankStatus, "NOT_STORED");
    assert.equal(first.testEligibility, "INELIGIBLE");
    assert.equal(first.publiclyPublishable, false);
    assert.equal(first.questionStudioDiscoverable, false);
    assert.equal(first.state.permanentQlId, definition.qlId);
    assert.equal(first.sourceState.permanentQlId, null);

    assert.equal(first.options.length, 4);
    assert.equal(new Set(first.options.map((option) => exactKey(option.value))).size, 4);
    assert.equal(new Set(first.options.map((option) => option.display)).size, 4);
    assert.equal(first.options.filter((option) => option.isCorrect).length, 1);
    assert.equal(first.options[first.correctIndex]?.isCorrect, true);
    assert.equal(first.answer, first.options[first.correctIndex]?.display);
    assert.ok(first.options.every((option) => isPositive(option.value)));

    assert.match(first.explanation.keyRule, /^(Think|Picture)\b/);
    assert.ok(first.explanation.keyRule.includes("Here,"));
    assert.ok(first.explanation.keyRule.length > 40);
    assert.ok(first.explanation.steps.length >= 2);
    assert.ok(first.explanation.steps.every((step) => step.body.includes("Unit check:")));
    assert.ok(first.explanation.shortcut.startsWith("⚡ Exam speed:"));
    assert.equal(first.explanation.traps.length, 3);

    const wrongOptions = first.options.filter((option) => !option.isCorrect);
    const seenTrapLabels = new Set<string>();
    for (const trap of first.explanation.traps) {
      const match = trap.match(/^Option ([A-D]) \(\$.*\): .+ \[([A-Z0-9_]+)\]$/);
      assert.ok(match, `${definition.qlId} must expose an option-linked trap code: ${trap}`);
      const label = match[1]!;
      const code = match[2]!;
      const option = wrongOptions.find((candidate) => candidate.label === label);
      assert.ok(option, `${definition.qlId} trap ${label} must correspond to a wrong option.`);
      assert.equal(code, getMenCp008PublicTrapCode(option.misconceptionId));
      seenTrapLabels.add(label);
    }
    assert.equal(seenTrapLabels.size, 3);
    assert.deepEqual(
      [...seenTrapLabels].sort(),
      wrongOptions.map((option) => option.label).sort(),
      `${definition.qlId} must diagnose every wrong option exactly once.`,
    );

    const validationNames = new Set(first.validation.checks.map((check) => check.name));
    for (const requiredCheck of [
      "visual shape first",
      "formula variable definitions",
      "unit-preserving calculations",
      "exam-smart shortcut",
      "option trap labels",
      "option trap codes",
      "five-element teaching blueprint",
      "CP-011 ownership boundary",
    ]) {
      assert.ok(validationNames.has(requiredCheck), `${definition.qlId} is missing validation check: ${requiredCheck}`);
    }

    const learnerText = [
      first.stem,
      ...first.options.map((option) => option.display),
      first.answer,
      first.explanation.keyRule,
      ...first.explanation.steps.flatMap((step) => [step.title, step.body, step.equation ?? ""]),
      first.explanation.shortcut,
      ...first.explanation.traps,
    ].join("\n");
    assert.equal(/misconceptionId|MEN-CP008-(?:W\d-)?PROT/.test(learnerText), false);
    assert.equal(/FALLBACK_|UNCLASSIFIED_DISTRACTOR|GENERAL_CALCULATION_ERROR/.test(learnerText), false);
    assert.equal(/[£€¥]/.test(learnerText), false);
    assert.equal(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(learnerText), false);

    answerPositions.add(first.correctIndex);
    stems.add(first.stem);
    provenAncestries.add(first.prototypeId);
    seenDifficulties.add(first.difficulty);
    seenTargets.add(first.target);
    generated += 1;
  }

  assert.deepEqual([...answerPositions].sort(), [0, 1, 2, 3], `${definition.qlId} must reach every answer position.`);
  assert.ok(stems.size >= 4, `${definition.qlId} needs at least four natural stem forms.`);
}

assert.equal(provenAncestries.size, 66);
assert.deepEqual([...seenDifficulties].sort(), ["Easy", "Hard", "Medium"]);
assert.ok(seenTargets.has("LENGTH"));
assert.ok(seenTargets.has("RATIO"));
assert.ok(seenTargets.has("VOLUME"));
assert.ok(seenTargets.has("COST"));
assert.equal(generated, 52 * 80 + 66);

console.log(
  `MEN-CP-008 five-element English blueprint passed for ${generated} deterministic packages across ${registryAudit.qlCount} frozen QLs and ${registryAudit.ancestryCount} prototype ancestries. Product and publication surfaces remain disabled.`,
);

import assert from "node:assert/strict";

import { OPS_QL_ENTRIES } from "../registry";
import { generateAuditedOpsQuestion } from "./audited-generator";

const SEEDS = 100;
const FATIGUE_WINDOWS = [20, 50, 100] as const;
const MIN_VISIBLE_STATE_RATIO = 0.55;
const MIN_FULL_OUTPUT_RATIO = 0.90;
const failures: string[] = [];
const difficultyTotals = { Easy: 0, Medium: 0, Hard: 0 };
const rows: Array<Record<string, unknown>> = [];

/**
 * A QL intentionally keeps one logical contract, so a solver/semantic
 * fingerprint is not expected to be unique for every seed. Fatigue must be
 * measured from the learner-visible generated state with option order removed;
 * otherwise option shuffling can falsely look like content diversity.
 */
function visibleState(question: ReturnType<typeof generateAuditedOpsQuestion>): string {
  return JSON.stringify({
    stem: question.stem,
    optionValues: question.options.map((option) => option.value).sort(),
    answer: question.answer,
  });
}

for (const entry of OPS_QL_ENTRIES) {
  const stems = new Set<string>();
  const fullOutputs = new Set<string>();
  const visibleStates = new Set<string>();
  const semanticFingerprints = new Set<string>();
  const difficulties = new Set<string>();
  const generated: Array<ReturnType<typeof generateAuditedOpsQuestion>> = [];

  for (let seed = 0; seed < SEEDS; seed += 1) {
    const question = generateAuditedOpsQuestion(entry.qlId, seed, "en");
    generated.push(question);
    stems.add(question.stem);
    visibleStates.add(visibleState(question));
    fullOutputs.add(JSON.stringify({
      stem: question.stem,
      options: question.options.map((option) => option.value),
      answer: question.answer,
    }));
    semanticFingerprints.add(question.proof.semanticFingerprint);
    difficulties.add(question.instanceDifficulty.difficulty);
    difficultyTotals[question.instanceDifficulty.difficulty] += 1;

    assert.equal(question.options.length, 4, `${entry.qlId} must keep four current-review options.`);
    assert.equal(new Set(question.options.map((option) => option.value)).size, 4, `${entry.qlId} duplicate options at seed ${seed}.`);
    assert.equal(question.options[question.correctIndex]?.value, question.answer, `${entry.qlId} answer mismatch at seed ${seed}.`);
    assert.equal(question.proof.unique, true, `${entry.qlId} lost uniqueness at seed ${seed}.`);
    assert.equal(question.metadata.difficultyDerivedFromInstance, true, `${entry.qlId} lacks instance-derived difficulty metadata.`);
    assert.equal(question.metadata.seedUsedAsDifficultyInput, false, `${entry.qlId} still uses seed identity for difficulty.`);
  }

  const fullRatio = fullOutputs.size / SEEDS;
  const visibleStateRatio = visibleStates.size / SEEDS;
  rows.push({
    qlId: entry.qlId,
    candidateId: entry.candidateId,
    stemDistinct: stems.size,
    visibleStateDistinct: visibleStates.size,
    visibleStateRatio,
    fullDistinct: fullOutputs.size,
    fullRatio,
    solverFingerprintDistinct: semanticFingerprints.size,
    difficulties: [...difficulties].sort(),
  });

  for (const window of FATIGUE_WINDOWS) {
    const states = new Set(generated.slice(0, window).map(visibleState));
    const ratio = states.size / window;
    if (ratio < MIN_VISIBLE_STATE_RATIO) {
      failures.push(`${entry.qlId}/${entry.candidateId} visible-state diversity ${states.size}/${window} at ${window}-question fatigue window`);
    }
  }

  if (fullRatio < MIN_FULL_OUTPUT_RATIO) {
    failures.push(`${entry.qlId}/${entry.candidateId} full-output diversity ${fullOutputs.size}/${SEEDS}`);
  }
}

for (const band of ["Easy", "Medium", "Hard"] as const) {
  if (difficultyTotals[band] === 0) failures.push(`chapter never produces ${band} from generated-instance scoring`);
}

for (const qlId of ["OPS-QL-025", "OPS-QL-026", "OPS-QL-027"] as const) {
  for (let seed = 0; seed < 100; seed += 1) {
    const question = generateAuditedOpsQuestion(qlId, seed, "en");
    assert.equal(question.metadata.misconceptionDistractorsGrounded, true, `${qlId} seed ${seed} lacks misconception-grounded distractor provenance.`);
    const labels = new Set(question.options.filter((option) => option.errorLabel).map((option) => option.errorLabel));
    if (qlId === "OPS-QL-025") {
      assert.ok(labels.has("APPLIED_OPERATOR_SWAP_ONLY"), `${qlId} seed ${seed} lacks operator-only misconception.`);
      assert.ok(labels.has("APPLIED_DIGIT_SWAP_ONLY"), `${qlId} seed ${seed} lacks digit-only misconception.`);
    } else {
      assert.deepEqual(
        labels,
        new Set(["APPLIED_OPERATOR_SWAP_ONLY", "APPLIED_NUMBER_SWAP_ONLY", "IGNORED_BOTH_INTERCHANGES"]),
        `${qlId} seed ${seed} does not expose the three intended compound misconceptions.`,
      );
    }
  }
}

console.table(rows);
console.log("OPS-001 instance difficulty totals", difficultyTotals);
if (failures.length > 0) {
  throw new Error(`OPS-001 final audit fatigue gate failed:\n${failures.join("\n")}`);
}
console.log("OPS-001 final audit diversity/difficulty gate passed.");

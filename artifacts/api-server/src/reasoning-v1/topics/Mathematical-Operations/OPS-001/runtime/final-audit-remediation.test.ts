import assert from "node:assert/strict";

import {
  OPS_QL_ENTRIES,
  generateFrozenOpsQuestion,
} from "../registry";
import { assessOpsInstanceDifficulty } from "./final-audit-remediation";

const SEEDS = 100;
const failures: string[] = [];
const difficultyTotals = { Easy: 0, Medium: 0, Hard: 0 };
const rows: Array<Record<string, unknown>> = [];

for (const entry of OPS_QL_ENTRIES) {
  const stems = new Set<string>();
  const fullOutputs = new Set<string>();
  const semanticFingerprints = new Set<string>();
  const difficulties = new Set<string>();

  for (let seed = 0; seed < SEEDS; seed += 1) {
    const question = generateFrozenOpsQuestion(entry.qlId, seed);
    stems.add(question.stem);
    fullOutputs.add(JSON.stringify({
      stem: question.stem,
      options: question.options.map((option) => option.value),
      answer: question.answer,
    }));
    semanticFingerprints.add(question.proof.semanticFingerprint);
    const assessment = assessOpsInstanceDifficulty(question);
    difficulties.add(assessment.difficulty);
    difficultyTotals[assessment.difficulty] += 1;

    assert.equal(question.options.length, 4, `${entry.qlId} must keep four current-review options.`);
    assert.equal(new Set(question.options.map((option) => option.value)).size, 4, `${entry.qlId} duplicate options at seed ${seed}.`);
    assert.equal(question.options[question.correctIndex]?.value, question.answer, `${entry.qlId} answer mismatch at seed ${seed}.`);
    assert.equal(question.proof.unique, true, `${entry.qlId} lost uniqueness at seed ${seed}.`);
  }

  const stemRatio = stems.size / SEEDS;
  const fullRatio = fullOutputs.size / SEEDS;
  const fingerprintRatio = semanticFingerprints.size / SEEDS;
  rows.push({
    qlId: entry.qlId,
    candidateId: entry.candidateId,
    stemDistinct: stems.size,
    stemRatio,
    fullDistinct: fullOutputs.size,
    fullRatio,
    semanticDistinct: semanticFingerprints.size,
    fingerprintRatio,
    difficulties: [...difficulties].sort(),
  });

  if (stemRatio < 0.55) failures.push(`${entry.qlId}/${entry.candidateId} stem diversity ${stems.size}/${SEEDS}`);
  if (fullRatio < 0.90) failures.push(`${entry.qlId}/${entry.candidateId} full-output diversity ${fullOutputs.size}/${SEEDS}`);
  if (fingerprintRatio < 0.55) failures.push(`${entry.qlId}/${entry.candidateId} semantic diversity ${semanticFingerprints.size}/${SEEDS}`);
}

for (const band of ["Easy", "Medium", "Hard"] as const) {
  if (difficultyTotals[band] === 0) failures.push(`chapter never produces ${band} from generated-instance scoring`);
}

for (const qlId of ["OPS-QL-026", "OPS-QL-027"] as const) {
  for (let seed = 0; seed < 100; seed += 1) {
    const question = generateFrozenOpsQuestion(qlId, seed);
    assert.equal(question.metadata.misconceptionDistractorsGrounded, true, `${qlId} seed ${seed} lacks misconception-grounded distractor provenance.`);
    const labels = new Set(question.options.filter((option) => option.errorLabel).map((option) => option.errorLabel));
    assert.deepEqual(
      labels,
      new Set(["APPLIED_OPERATOR_SWAP_ONLY", "APPLIED_NUMBER_SWAP_ONLY", "IGNORED_BOTH_INTERCHANGES"]),
      `${qlId} seed ${seed} does not expose the three intended compound misconceptions.`,
    );
  }
}

console.table(rows);
console.log("OPS-001 instance difficulty totals", difficultyTotals);
if (failures.length > 0) {
  throw new Error(`OPS-001 final audit fatigue gate failed:\n${failures.join("\n")}`);
}
console.log("OPS-001 final audit diversity/difficulty gate passed.");

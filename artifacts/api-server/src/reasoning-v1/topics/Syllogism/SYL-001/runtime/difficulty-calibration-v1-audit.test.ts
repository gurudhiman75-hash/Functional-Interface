import assert from "node:assert/strict";
import {
  calibrateSylDifficultyV1,
  SYL_DIFFICULTY_CALIBRATION_V1,
} from "./difficulty-calibration-v1";
import { SYL_QL_REGISTRY } from "./ql-registry";
import { scenariosForGroup } from "./scenarios";

function increment(target: Record<string, number>, key: string): void {
  target[key] = (target[key] ?? 0) + 1;
}

let pairs = 0;
let currentLabelMismatches = 0;
const calibratedBands: Record<string, number> = {};
const currentBands: Record<string, number> = {};
const byGroup: Record<string, Record<string, number>> = {};
const byTask: Record<string, Record<string, number>> = {};
const scoreHistogram: Record<string, number> = {};

for (const definition of SYL_QL_REGISTRY) {
  const scenarios = scenariosForGroup(definition.scenarioGroup);
  assert.ok(scenarios.length > 0, `${definition.qlId}: no scenarios for ${definition.scenarioGroup}`);

  for (const scenario of scenarios) {
    const result = calibrateSylDifficultyV1(definition, scenario);
    pairs += 1;
    assert.ok(Number.isInteger(result.total));
    assert.ok(result.total >= 0);
    assert.ok(result.band === "EASY" || result.band === "MEDIUM" || result.band === "HARD");
    assert.equal(
      result.total,
      result.premiseLoad
        + result.termLoad
        + result.topologyLoad
        + result.specialFormLoad
        + result.taskLoad,
    );

    increment(calibratedBands, result.band);
    increment(currentBands, scenario.baseDifficulty);
    increment(scoreHistogram, String(result.total));
    byGroup[definition.scenarioGroup] ??= {};
    increment(byGroup[definition.scenarioGroup], result.band);
    byTask[definition.taskKind] ??= {};
    increment(byTask[definition.taskKind], result.band);
    if (result.band !== scenario.baseDifficulty) currentLabelMismatches += 1;
  }
}

assert.equal(pairs, 180);
assert.ok((calibratedBands.EASY ?? 0) > 0);
assert.ok((calibratedBands.MEDIUM ?? 0) > 0);
assert.ok((calibratedBands.HARD ?? 0) > 0);
assert.ok(currentLabelMismatches > 0, "the candidate calibration must expose static-label mismatches");
assert.equal(SYL_DIFFICULTY_CALIBRATION_V1.status, "AUDIT_ONLY_NOT_ACTIVE");
assert.equal(SYL_DIFFICULTY_CALIBRATION_V1.activationPermitted, false);

console.log(JSON.stringify({
  status: "PASS_SYL_001_STRUCTURAL_DIFFICULTY_CALIBRATION_AUDIT",
  authority: SYL_DIFFICULTY_CALIBRATION_V1.authorityId,
  compatibleQlScenarioPairs: pairs,
  currentScenarioLabels: currentBands,
  calibratedBands,
  currentLabelMismatches,
  scoreHistogram,
  byGroup,
  byTask,
  activation: {
    status: SYL_DIFFICULTY_CALIBRATION_V1.status,
    permitted: SYL_DIFFICULTY_CALIBRATION_V1.activationPermitted,
    nextEvidence: "Calibrate structural scores against student response accuracy and median solve time after controlled beta delivery.",
  },
}, null, 2));

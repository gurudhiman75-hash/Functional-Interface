import assert from "node:assert/strict";
import { generateDmQuestion } from "./generator.ts";
import { DM_001_QL_REGISTRY, assertContinuousDmQlIds, dmQlIdsForCheckpoint } from "./ql-registry.ts";
import { DM_001_SCENARIO_LIBRARY, dmScenariosForCheckpoint } from "./scenario-library.ts";
import { solveDmSituation } from "./situational-engine.ts";
import { DM_001_CHECKPOINT_IDS, DM_001_QL_IDS } from "./types.ts";

assert.equal(DM_001_CHECKPOINT_IDS.slice(0, 16).length, 16);
assert.equal(DM_001_QL_IDS.slice(0, 48).length, 48);
assert.equal(DM_001_QL_REGISTRY.filter((entry) => Number(entry.checkpointId.slice(-3)) <= 16).length, 48);
assert.equal(DM_001_SCENARIO_LIBRARY.filter((scenario) => Number(scenario.checkpointId.slice(-3)) <= 16).length, 550);
assertContinuousDmQlIds();

const waveThreeCheckpoints = DM_001_CHECKPOINT_IDS.slice(10, 16);
for (const checkpointId of waveThreeCheckpoints) {
  const scenarios = dmScenariosForCheckpoint(checkpointId);
  assert.equal(scenarios.length, 50, checkpointId + " must expose 50 situational seeds");
  assert.equal(dmQlIdsForCheckpoint(checkpointId).length, 3);
  assert.equal(new Set(scenarios.map((scenario) => scenario.scenarioId)).size, 50);
  assert.equal(new Set(scenarios.map((scenario) => scenario.situational!.situation.en)).size, 50);
  const distractorTexts = new Set(scenarios.flatMap((scenario) => scenario.situational!.choices.slice(1).map((choice) => choice.text.en)));
  assert.ok(distractorTexts.size >= 15, checkpointId + " must use varied, scenario-relevant distractors");
  assert.ok(!distractorTexts.has("Take a final adverse action immediately without checking the record."));
  assert.ok(!distractorTexts.has("Ignore the matter and wait without recording any reason."));
  assert.ok(!distractorTexts.has("Bypass the prescribed process and act only on an assumption."));
  for (const banned of [
    "Apply the harshest outcome before authenticating the disputed information.",
    "Take no step until the entire monthly workload has been cleared.",
    "Let the affected person choose the outcome instead of applying the governing rule.",
    "Allocate the resource by a random draw without considering urgency or deadlines.",
    "Split the resource into unusable shares merely to give every request the same amount.",
  ]) assert.ok(!distractorTexts.has(banned), checkpointId + " must not use an obviously absurd distractor");

  for (const scenario of scenarios) {
    assert.ok(scenario.situational);
    const solved = solveDmSituation(scenario.situational!);
    assert.equal(solved.choice.admissible, true);
    assert.equal(solved.choice.errors.length, 0);
    assert.equal(scenario.situational!.choices.length, 4);
    assert.equal(scenario.situational!.choices.filter((choice) => choice.admissible).length, 1);
    assert.ok(scenario.situational!.choices.slice(1).every((choice) => choice.errors.length > 0));
  }

  for (const locale of ["en", "hi", "pa"] as const) {
    const scenario = scenarios[0]!;
    const stems = new Set(Array.from({ length: 18 }, (_, seed) =>
      generateDmQuestion({ scenario, locale, seed, mode: "ALL_PASS" }).stem.split("\n").at(-1),
    ));
    assert.equal(stems.size, 18, checkpointId + " " + locale + " must expose 18 stem forms");
    for (const difficultyCase of [
      ["ALL_PASS", "EASY"], ["SINGLE_FAIL", "MEDIUM"], ["MULTIPLE_FAIL", "HARD"],
    ] as const) {
      const question = generateDmQuestion({ scenario, locale, seed: 47, mode: difficultyCase[0] });
      assert.equal(question.answerMode, "SITUATIONAL_ACTION");
      assert.equal(question.difficulty, difficultyCase[1]);
      assert.equal(question.options.length, 4);
      assert.equal(new Set(question.options).size, 4);
      assert.equal(question.options[question.correctIndex], solveDmSituation(scenario.situational!).choice.text[locale]);
      assert.match(question.explanation, locale === "en" ? /Situation:.*Relevant principle:.*Why this comes first:.*Conclusion:/s : locale === "hi" ? /स्थिति:.*संबंधित सिद्धांत:.*यह पहले क्यों:.*निष्कर्ष:/s : /ਸਥਿਤੀ:.*ਸੰਬੰਧਤ ਸਿਧਾਂਤ:.*ਇਹ ਪਹਿਲਾਂ ਕਿਉਂ:.*ਨਤੀਜਾ:/s);
    }
  }

  const whyFirstLines = new Set(scenarios.map((scenario) =>
    generateDmQuestion({ scenario, locale: "en", seed: 47, mode: "MULTIPLE_FAIL" }).explanation
      .split("\n").find((line) => line.startsWith("Why this comes first:")),
  ));
  assert.ok(whyFirstLines.size >= new Set(scenarios.map((scenario) => scenario.situational!.choices[0]!.principle)).size,
    checkpointId + " explanations must justify the actual governing principle");
}

assert.ok(dmScenariosForCheckpoint("DM-CP-012").every((scenario) => scenario.situational?.focus === "FIRST_ACTION"));
assert.ok(dmScenariosForCheckpoint("DM-CP-016").every((scenario) => scenario.situational?.focus === "RESOURCE_PRIORITY"));
assert.ok(dmScenariosForCheckpoint("DM-CP-016").every((scenario) => scenario.situational?.choices.slice(1).every((choice) => choice.errors.includes("IGNORE_PRIORITY") || choice.errors.includes("UNJUSTIFIED_DELAY"))));

console.log("DM-001 Wave 3 checks passed: DM-011–016, 300 situational seeds, 18 QLs, three locales, deterministic action sequencing and resource priorities.");

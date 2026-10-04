import assert from "node:assert/strict";
import { evaluateDmDecision, rankDmCandidates } from "./decision-engine.ts";
import { buildDmCandidate, generateDm020QuestionSet, generateDmQuestion } from "./generator.ts";
import { DM_001_QL_REGISTRY, assertContinuousDmQlIds, dmQlIdsForCheckpoint } from "./ql-registry.ts";
import { DM_001_SCENARIO_LIBRARY, dmScenariosForCheckpoint } from "./scenario-library.ts";
import { DM_001_CHECKPOINT_IDS, DM_001_QL_IDS } from "./types.ts";

assert.equal(DM_001_CHECKPOINT_IDS.length, 20);
assert.equal(DM_001_QL_IDS.length, 60);
assert.equal(DM_001_QL_REGISTRY.length, 60);
assert.equal(DM_001_SCENARIO_LIBRARY.length, 830);
assertContinuousDmQlIds();

const malformedAdvancedLocalization = [
  "गायब अंक प्रविष्टि वाली पात्रता फाइल",
  "प्रकाशित बराबरी-निर्णय क्रम",
  "ਗੁੰਮ ਅੰਕ ਐਂਟਰੀ ਵਾਲੀ ਯੋਗਤਾ ਫਾਈਲ",
  "ਨਾ ਦੱਸੀ ਤਜਰਬਾ ਮਿਆਦ",
] as const;
const advancedLocalizedCorpus = DM_001_SCENARIO_LIBRARY
  .filter((scenario) => Number(scenario.checkpointId.slice(-3)) >= 17)
  .flatMap((scenario) => [scenario.context.hi, scenario.context.pa])
  .join("\n");
for (const phrase of malformedAdvancedLocalization) {
  assert.ok(!advancedLocalizedCorpus.includes(phrase), "Malformed advanced localization returned: " + phrase);
}

for (const checkpointId of DM_001_CHECKPOINT_IDS.slice(16)) {
  const scenarios = dmScenariosForCheckpoint(checkpointId);
  assert.equal(scenarios.length, 25, checkpointId + " must expose 25 advanced rule structures");
  assert.equal(new Set(scenarios.map((scenario) => scenario.scenarioId)).size, 25);
  assert.equal(dmQlIdsForCheckpoint(checkpointId).length, 3);
}

for (const scenario of dmScenariosForCheckpoint("DM-CP-017")) {
  assert.ok(scenario.ranking);
  assert.equal(scenario.ranking!.priorityOrder.at(-1)?.field, "applicationOrder");
  assert.equal(new Set(scenario.ranking!.priorityOrder.map((criterion) => criterion.field)).size, scenario.ranking!.priorityOrder.length);
  const generated = generateDmQuestion({ scenario, locale: "en", seed: 71, mode: "MULTIPLE_FAIL" });
  const reversed = rankDmCandidates([...generated.candidateGroup!].reverse(), scenario);
  assert.deepEqual(reversed.selected.map((candidate) => candidate.name), generated.selectedCandidates);
}

for (const scenario of dmScenariosForCheckpoint("DM-CP-018")) {
  const unresolved = buildDmCandidate(scenario, "MISSING_REQUIRED", 9, "en");
  assert.equal(evaluateDmDecision(unresolved, scenario).outcome, "INFORMATION_REQUIRED");
  const determined = buildDmCandidate(scenario, "DETERMINED_REJECT_WITH_MISSING", 11, "en");
  const result = evaluateDmDecision(determined, scenario);
  assert.equal(result.outcome, "REJECT", "a mandatory failure remains decisive despite an unrelated missing field");
  assert.ok(result.checks.some((check) => check.status === "FAIL"));
  assert.ok(result.checks.some((check) => check.status === "UNKNOWN"));
}

for (const checkpointId of ["DM-CP-019", "DM-CP-020"] as const) {
  const scenarios = dmScenariosForCheckpoint(checkpointId);
  for (const locale of ["en", "hi", "pa"] as const) {
    for (const difficultyCase of [
      ["ALL_PASS", "EASY"], ["SINGLE_FAIL", "MEDIUM"], ["MULTIPLE_FAIL", "HARD"],
    ] as const) {
      for (let seed = 0; seed < 18; seed += 1) {
        const scenario = scenarios[seed % scenarios.length]!;
        const generated = generateDmQuestion({ scenario, locale, seed, mode: difficultyCase[0] });
        assert.equal(generated.difficulty, difficultyCase[1]);
        assert.equal(generated.answerMode, checkpointId === "DM-CP-019" ? "MULTI_PERSON_DECISION_SET" : "MIXED_DECISION_SET");
        assert.ok(generated.candidateGroup!.length >= 4 && generated.candidateGroup!.length <= 6);
        assert.equal(new Set(generated.candidateGroup!.map((candidate) => candidate.name)).size, generated.candidateGroup!.length);
        assert.equal(generated.options.length, 4);
        assert.equal(new Set(generated.options).size, 4);
        assert.ok(generated.correctIndex >= 0 && generated.correctIndex < 4);
        assert.ok(generated.options[generated.correctIndex]);
        assert.ok(generated.explanationRows.length >= generated.candidateGroup!.length * scenario.baseConditions.length);
        assert.deepEqual(generateDmQuestion({ scenario, locale, seed, mode: difficultyCase[0] }), generated);
      }
    }
    const stemForms = new Set(Array.from({ length: 18 }, (_, seed) =>
      generateDmQuestion({ scenario: scenarios[0]!, locale, seed, mode: "SINGLE_FAIL" }).stem.split("\n").at(-1),
    ));
    assert.equal(stemForms.size, 18, checkpointId + " " + locale + " must expose 18 set stem forms");
  }
}

const mixed = dmScenariosForCheckpoint("DM-CP-020")[0]!;
const mixedKinds = new Set(Array.from({ length: 5 }, (_, seed) => generateDmQuestion({ scenario: mixed, locale: "en", seed, mode: "SINGLE_FAIL" }).setQuestionKind));
assert.deepEqual(mixedKinds, new Set(["COUNT_SELECTED", "IDENTIFY_REJECTED", "IDENTIFY_REFERRED", "SAME_DECISION_PAIR", "INFORMATION_REQUIRED"]));
assert.ok(mixed.decisionRules.some((rule) => rule.ruleId === "BOTH_RELAXATIONS_REFER_COMMITTEE" && rule.priority === 1));

for (const locale of ["en", "hi", "pa"] as const) {
  const set = generateDm020QuestionSet({ scenario: mixed, locale, seed: 83, mode: "MULTIPLE_FAIL" });
  assert.equal(set.questions.length, 5);
  assert.equal(set.candidateGroup.length, 5);
  assert.equal(new Set(set.questions.map((question) => question.setId)).size, 1);
  assert.equal(new Set(set.questions.map((question) => question.scenarioId)).size, 1);
  assert.equal(new Set(set.questions.map((question) => JSON.stringify(question.candidateGroup))).size, 1);
  assert.deepEqual(set.questions.map((question) => question.setQuestionNumber), [1, 2, 3, 4, 5]);
  assert.deepEqual(new Set(set.questions.map((question) => question.setQuestionKind)), new Set(["COUNT_SELECTED", "IDENTIFY_REJECTED", "IDENTIFY_REFERRED", "SAME_DECISION_PAIR", "INFORMATION_REQUIRED"]));
  assert.ok(set.questions.every((question) => question.stem.startsWith(set.sharedStimulus + "\n")));
  assert.ok(set.questions.every((question) => question.options[question.correctIndex]));
  assert.ok(!set.sharedStimulus.includes("For Final recruitment"));
  assert.ok(!set.sharedStimulus.includes("वाला अंतिम भर्ती सेट के लिए"));
  assert.ok(!set.sharedStimulus.includes("ਵਾਲਾ ਅੰਤਿਮ ਭਰਤੀ ਸੈੱਟ ਲਈ"));
  assert.ok(locale !== "en" || set.sharedStimulus.startsWith("The following case concerns"));
  assert.ok(locale !== "hi" || set.sharedStimulus.includes("पात्रता शर्तों और आवेदकों के विवरण का अध्ययन"));
  assert.ok(locale !== "pa" || set.sharedStimulus.includes("ਯੋਗਤਾ ਸ਼ਰਤਾਂ ਅਤੇ ਬਿਨੈਕਾਰਾਂ ਦੇ ਵੇਰਵੇ"));
  assert.deepEqual(generateDm020QuestionSet({ scenario: mixed, locale, seed: 83, mode: "MULTIPLE_FAIL" }), set);
}

console.log("DM-001 Wave 4 checks passed: DM-017–020, 100 advanced structures, 12 QLs, explicit precedence, three-valued information logic and computed multi-person sets.");
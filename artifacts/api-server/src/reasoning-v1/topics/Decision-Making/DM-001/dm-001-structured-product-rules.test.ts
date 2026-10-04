import assert from "node:assert/strict";
import { generateDmQuestion, modesForDmDifficulty } from "./generator.ts";
import { DM_001_SCENARIO_LIBRARY, dmScenariosForCheckpoint } from "./scenario-library.ts";
import type { DmCheckpointId, DmField } from "./types.ts";

const productCheckpoints = [
  "DM-CP-001",
  "DM-CP-002",
  "DM-CP-003",
  "DM-CP-008",
  "DM-CP-009",
  "DM-CP-010",
] as const satisfies readonly DmCheckpointId[];

const productScenarios = DM_001_SCENARIO_LIBRARY.filter((scenario) => scenario.subjectKind === "PRODUCT_LOT");
assert.equal(productScenarios.length, 30, "structured product family must expose 30 genuine product-rule scenarios");

for (const checkpointId of productCheckpoints) {
  const scenarios = dmScenariosForCheckpoint(checkpointId).filter((scenario) => scenario.subjectKind === "PRODUCT_LOT");
  assert.equal(scenarios.length, 5, checkpointId + " must expose five structured product scenarios");
  assert.equal(new Set(scenarios.map((scenario) => scenario.scenarioId)).size, 5);
}

const personOnlyFields = new Set<DmField>([
  "age", "ageAtDate", "graduationMarks", "qualificationRank", "experienceYears", "experienceArea",
  "residenceStatus", "registrationStatus", "certificateStatus", "writtenScore", "sectionalScore",
  "interviewScore", "overallScore", "annualIncome", "familyIncome", "employmentStatus",
  "repaymentStatus", "collateralStatus", "category", "applicationOrder",
]);

const observedProductFields = new Set<DmField>();
for (const scenario of productScenarios) {
  const fields = [
    ...scenario.baseConditions.map((item) => item.field),
    ...scenario.decisionRules.flatMap((rule) => rule.conditions.map((item) => item.field)),
    ...(scenario.ranking?.priorityOrder.map((item) => item.field as DmField) ?? []),
  ];
  for (const field of fields) {
    assert.ok(!personOnlyFields.has(field), scenario.scenarioId + " must not fake product logic with applicant fields");
    observedProductFields.add(field);
  }
  assert.ok(scenario.context.en.trim().length > 0);
  assert.ok(scenario.context.hi.trim().length > 0);
  assert.ok(scenario.context.pa.trim().length > 0);
}

for (const requiredField of [
  "moisturePercent", "defectPercent", "temperatureC", "weightGrams", "sizeMm", "purityPercent",
  "strengthMpa", "sealStatus", "labStatus", "labelStatus", "packagingStatus", "inspectionOrder",
] as const) {
  assert.ok(observedProductFields.has(requiredField), "missing structured product field: " + requiredField);
}

for (const scenario of productScenarios) {
  for (const locale of ["en", "hi", "pa"] as const) {
    for (const difficulty of ["EASY", "MEDIUM", "HARD"] as const) {
      const seed = difficulty === "EASY" ? 12 : difficulty === "MEDIUM" ? 13 : 14;
      const mode = modesForDmDifficulty(scenario, difficulty, seed);
      const question = generateDmQuestion({ scenario, locale, seed, mode });
      assert.equal(question.difficulty, difficulty);
      assert.match(question.candidate.name, locale === "en" ? /^Lot / : locale === "hi" ? /^लॉट / : /^ਲਾਟ /);
      assert.doesNotMatch(question.stem, /Aman|Simran|applicant|candidate/i);
      assert.equal(question.options.length, 4);
      assert.equal(new Set(question.options).size, 4);
      if (scenario.ranking) {
        assert.equal(question.answerMode, "RANKED_CANDIDATE_SET");
        assert.ok(question.candidateGroup?.every((item) => /Lot |लॉट |ਲਾਟ /.test(item.name)));
      } else {
        assert.equal(question.answerMode, "ELIGIBILITY_OUTCOME");
        if (locale === "en") {
          assert.ok(question.options.some((option) => /Accept under the stated quality rules/.test(option)));
          assert.ok(question.options.some((option) => /Reject under the stated quality rules/.test(option)));
        }
      }
      if ((scenario.checkpointId === "DM-CP-003" || scenario.checkpointId === "DM-CP-009") && difficulty === "HARD") {
        assert.equal(mode, "RULE_EXCEPTION");
        assert.equal(question.outcome, "SELECT", scenario.scenarioId + " hard case must exercise the stated product tolerance");
      }
      const repeat = generateDmQuestion({ scenario, locale, seed, mode });
      assert.deepEqual(repeat, question, "structured product generation must remain deterministic");
    }
  }
}

const cp10 = productScenarios.filter((scenario) => scenario.checkpointId === "DM-CP-010");
assert.ok(cp10.every((scenario) => scenario.ranking?.seatCount === 2));
assert.ok(cp10.every((scenario) => scenario.ranking!.priorityOrder.at(-1)?.field === "inspectionOrder"));

console.log(JSON.stringify({
  status: "PASS_DM_001_STRUCTURED_PRODUCT_RULES",
  productScenarioCount: productScenarios.length,
  productCheckpointCount: productCheckpoints.length,
  distinctProductFields: observedProductFields.size,
  languages: ["en", "hi", "pa"],
}, null, 2));

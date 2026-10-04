import assert from "node:assert/strict";
import { evaluateDmDecision } from "./decision-engine.ts";
import { generateDmQuestion, modesForDmDifficulty } from "./generator.ts";
import { DM_001_SCENARIO_LIBRARY, dmScenariosForCheckpoint } from "./scenario-library.ts";
import type { DmCheckpointId, DmField } from "./types.ts";

const organizationCheckpoints = ["DM-CP-004", "DM-CP-006", "DM-CP-007"] as const satisfies readonly DmCheckpointId[];
const organizationScenarios = DM_001_SCENARIO_LIBRARY.filter((scenario) => scenario.subjectKind === "ORGANIZATION");

assert.equal(organizationScenarios.length, 15, "DM-001 must expose 15 structured organization authorities");
for (const checkpointId of organizationCheckpoints) {
  const scenarios = dmScenariosForCheckpoint(checkpointId).filter((scenario) => scenario.subjectKind === "ORGANIZATION");
  assert.equal(scenarios.length, 5, checkpointId + " must expose five organization scenarios");
  assert.equal(new Set(scenarios.map((scenario) => scenario.scenarioId)).size, 5);
}

const forbiddenPersonFields = new Set<DmField>([
  "age", "ageAtDate", "graduationMarks", "qualificationRank", "experienceYears", "experienceArea",
  "residenceStatus", "registrationStatus", "certificateStatus", "writtenScore", "sectionalScore",
  "interviewScore", "overallScore", "annualIncome", "familyIncome", "employmentStatus",
  "repaymentStatus", "collateralStatus", "category", "applicationOrder",
]);

const forbiddenProductFields = new Set<DmField>([
  "moisturePercent", "defectPercent", "temperatureC", "weightGrams", "sizeMm", "purityPercent",
  "strengthMpa", "sealStatus", "labStatus", "labelStatus", "packagingStatus", "inspectionOrder",
]);

const observedFields = new Set<DmField>();
for (const scenario of organizationScenarios) {
  const fields = [
    ...scenario.baseConditions.map((item) => item.field),
    ...scenario.decisionRules.flatMap((rule) => rule.conditions.map((item) => item.field)),
  ];
  for (const field of fields) {
    assert.ok(!forbiddenPersonFields.has(field), scenario.scenarioId + " must not reuse person-only fields");
    assert.ok(!forbiddenProductFields.has(field), scenario.scenarioId + " must not masquerade as product grading");
    observedFields.add(field);
  }
  assert.ok(scenario.context.en.trim());
  assert.ok(scenario.context.hi.trim());
  assert.ok(scenario.context.pa.trim());
}

for (const required of [
  "yearsOperating", "qualifiedStaffCount", "complianceScore", "incidentCount", "annualTurnover",
  "auditStatus", "insuranceStatus", "licenseStatus", "taxStatus", "documentStatus",
  "serviceAreaStatus", "financialRecordStatus", "securityStatus",
] as const) {
  assert.ok(observedFields.has(required), "missing organization field: " + required);
}

for (const scenario of organizationScenarios) {
  for (const locale of ["en", "hi", "pa"] as const) {
    for (const difficulty of ["EASY", "MEDIUM", "HARD"] as const) {
      const seed = difficulty === "EASY" ? 20 : difficulty === "MEDIUM" ? 22 : 23;
      const mode = modesForDmDifficulty(scenario, difficulty, seed);
      const question = generateDmQuestion({ scenario, locale, seed, mode });
      assert.equal(question.difficulty, difficulty);
      assert.match(question.candidate.name, locale === "en" ? /^Organisation / : locale === "hi" ? /^संस्था / : /^ਸੰਸਥਾ /);
      assert.doesNotMatch(question.stem, /\bAman\b|\bSimran\b|graduation marks|age limit|candidate profile/i);
      assert.equal(question.options.length, 4);
      assert.equal(new Set(question.options).size, 4);
      assert.equal(evaluateDmDecision(question.candidate, scenario).outcome, question.outcome);
      assert.deepEqual(generateDmQuestion({ scenario, locale, seed, mode }), question);
      if (scenario.checkpointId !== "DM-CP-004") {
        if (locale === "en") {
          assert.ok(question.options.some((option) => option === "Approve under the stated rules"));
          assert.ok(question.options.some((option) => option === "Do not approve under the stated rules"));
        }
      }
    }
  }
}

for (const scenario of organizationScenarios.filter((item) => item.checkpointId === "DM-CP-004")) {
  for (const [mode, outcome] of [
    ["DOCUMENT_REFERRAL", "REFER_TO_MANAGER"],
    ["DIRECTOR_REFERRAL", "REFER_TO_DIRECTOR"],
    ["COMMITTEE_REFERRAL", "REFER_TO_COMMITTEE"],
  ] as const) {
    const question = generateDmQuestion({ scenario, locale: "en", seed: 31, mode });
    assert.equal(question.outcome, outcome, scenario.scenarioId + " " + mode);
    assert.ok(question.explanationRows.length === scenario.baseConditions.length);
  }
}

const cp006Contexts = organizationScenarios.filter((scenario) => scenario.checkpointId === "DM-CP-006").map((scenario) => scenario.context.en.toLowerCase());
assert.ok(cp006Contexts.some((context) => context.includes("laboratory")));
assert.ok(cp006Contexts.some((context) => context.includes("transport")));
assert.ok(cp006Contexts.some((context) => context.includes("contractor")));
assert.ok(cp006Contexts.some((context) => context.includes("vendor")));

const cp007Contexts = organizationScenarios.filter((scenario) => scenario.checkpointId === "DM-CP-007").map((scenario) => scenario.context.en.toLowerCase());
assert.ok(cp007Contexts.every((context) => context.includes("fictional programme")));

console.log(JSON.stringify({
  status: "PASS_DM_001_STRUCTURED_ORGANIZATION_RULES",
  organizationScenarioCount: organizationScenarios.length,
  organizationCheckpointCount: organizationCheckpoints.length,
  distinctOrganizationFields: observedFields.size,
  languages: ["en", "hi", "pa"],
}, null, 2));

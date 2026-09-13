import assert from "node:assert/strict";

import {
  ARG_CP007_EXAM_PROFILES,
  type ArgCp007Difficulty,
  type ArgCp007ExamProfile,
} from "./cp007-exam-profile-generator-v2.ts";
import { ARG_CP009_ENGLISH_REMEDIATION_AUTHORITY } from "./cp009-english-remediated-templates.ts";
import { ARG_CP009_LOCALIZATION_AUTHORITY_V2 } from "./cp009-localized-remediated-templates-v2.ts";
import {
  ARG_CP010_AUTHORITY,
  ARG_CP010_CHECKPOINT_ID,
  ARG_CP010_CORRELATED_SCENARIOS,
  generateArgCp010RealPaperBatch,
  generateArgCp010RealPaperQuestion,
  resolveArgCp010Scenario,
} from "./cp010-correlated-real-paper-generator.ts";
import { ARG_QL_IDS, type ArgQlId } from "./types.ts";

const LOCALES = ["en-IN", "hi-IN", "pa-IN"] as const;
const PROFILE_DIFFICULTIES: readonly [ArgCp007ExamProfile, ArgCp007Difficulty][] = [
  ["SSC_RECENT_2X4", "Easy"],
  ["SSC_RECENT_2X4", "Medium"],
  ["BANKING_CLASSIC_2X5", "Medium"],
  ["BANKING_CLASSIC_2X5", "Hard"],
  ["BANKING_COMBO_3X5", "Medium"],
  ["BANKING_COMBO_3X5", "Hard"],
  ["BANKING_COMBO_4X5", "Hard"],
];

function pair(first: string, second: string): readonly [string, string] {
  return [first, second] as const;
}

const EXPECTED_ENGLISH_PAIR_TEXT: Readonly<Record<ArgQlId, readonly (readonly [string, string])[]>> = Object.freeze({
  "ARG-QL-001": Object.freeze([
    pair("a recruitment board", "model answer points"),
    pair("a university", "evaluation criteria"),
    pair("a licensing authority", "a grievance contact"),
    pair("a scholarship authority", "a grievance contact"),
  ]),
  "ARG-QL-002": Object.freeze([
    pair("a bank", "the registered mobile number"),
    pair("a payment wallet", "the recovery email"),
    pair("an insurance portal", "the payout account"),
    pair("a brokerage app", "the transaction limit"),
  ]),
  "ARG-QL-003": Object.freeze([
    pair("a passport centre", "routine document services"),
    pair("a district hospital", "registration services"),
    pair("a municipal office", "fee-payment services"),
    pair("a citizen-service centre", "standard certificate services"),
  ]),
  "ARG-QL-004": Object.freeze([
    pair("a market street", "the evening peak"),
    pair("a school-zone road", "school closing time"),
    pair("a station-front road", "the evening peak"),
    pair("a hospital approach road", "the morning rush"),
  ]),
  "ARG-QL-005": Object.freeze([
    pair("office employees", "continuous screen recording"),
    pair("remote employees", "keystroke logging"),
    pair("field staff", "location tracking"),
    pair("contract workers", "webcam activity monitoring"),
  ]),
  "ARG-QL-006": Object.freeze([
    pair("an online marketplace", "one buyer complaint"),
    pair("an examination authority", "one cheating complaint"),
    pair("a bank", "one automated fraud flag"),
    pair("a college", "one misconduct allegation"),
  ]),
});

assert.equal(ARG_CP010_CHECKPOINT_ID, "ARG-CP-010");
assert.equal(ARG_CP010_AUTHORITY, "ARG_CP010_CORRELATED_REAL_PAPER_REMEDIATION_V1");
assert.equal(ARG_CP009_ENGLISH_REMEDIATION_AUTHORITY, "ARG_CP009_ENGLISH_EDITORIAL_REMEDIATION_V1");
assert.equal(ARG_CP009_LOCALIZATION_AUTHORITY_V2, "ARG_CP009_TRILINGUAL_EDITORIAL_REMEDIATION_V2");

for (const qlId of ARG_QL_IDS) {
  const scenarios = ARG_CP010_CORRELATED_SCENARIOS[qlId];
  assert.equal(scenarios.length, 4, `${qlId}: expected four explicit correlated scenarios`);
  assert.equal(new Set(scenarios.map((scenario) => scenario.id)).size, 4, `${qlId}: scenario IDs must be unique`);
  assert.equal(new Set(scenarios.map((scenario) => scenario.sourceSeed % 16)).size, 4, `${qlId}: source pair seeds must be unique`);
  for (let index = 0; index < scenarios.length; index += 1) {
    const resolved = resolveArgCp010Scenario({ qlId, seed: index });
    assert.equal(resolved.scenarioIndex, index);
    assert.equal(resolved.scenario.id, scenarios[index]!.id);
    assert.equal(resolved.sourceSeed, scenarios[index]!.sourceSeed);
    assert.ok(resolved.scenario.rationale.length > 20, `${qlId}/${index}: compatibility rationale is required`);
  }
}

// Every approved pair is exercised in all three locales. English text is checked directly;
// HI/PA must resolve to the same scenario, profile shape, strengths and answer index.
for (const qlId of ARG_QL_IDS) {
  for (let scenarioIndex = 0; scenarioIndex < 4; scenarioIndex += 1) {
    const english = generateArgCp010RealPaperQuestion({
      qlId,
      locale: "en-IN",
      seed: scenarioIndex,
      profile: "SSC_RECENT_2X4",
      difficulty: "Medium",
    });
    const expected = EXPECTED_ENGLISH_PAIR_TEXT[qlId][scenarioIndex]!;
    assert.match(english.statement, new RegExp(expected[0].replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), `${qlId}/${scenarioIndex}: missing approved actor`);
    assert.match(english.statement, new RegExp(expected[1].replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), `${qlId}/${scenarioIndex}: missing approved object/trigger`);
    assert.equal(english.metadata.correlatedScenarioId, ARG_CP010_CORRELATED_SCENARIOS[qlId][scenarioIndex]!.id);

    for (const locale of ["hi-IN", "pa-IN"] as const) {
      const localized = generateArgCp010RealPaperQuestion({
        qlId,
        locale,
        seed: scenarioIndex,
        profile: "SSC_RECENT_2X4",
        difficulty: "Medium",
      });
      assert.equal(localized.metadata.correlatedScenarioId, english.metadata.correlatedScenarioId, `${locale}/${qlId}/${scenarioIndex}: scenario drift`);
      assert.equal(localized.arguments.length, english.arguments.length);
      assert.deepEqual(localized.argumentStrengths, english.argumentStrengths, `${locale}/${qlId}/${scenarioIndex}: strength drift`);
      assert.equal(localized.correctIndex, english.correctIndex, `${locale}/${qlId}/${scenarioIndex}: answer-position drift`);
    }
  }
}

const allEnglishApprovedStatements = ARG_QL_IDS.flatMap((qlId) =>
  Array.from({ length: 4 }, (_, scenarioIndex) => generateArgCp010RealPaperQuestion({
    qlId,
    locale: "en-IN",
    seed: scenarioIndex,
    profile: "SSC_RECENT_2X4",
    difficulty: "Medium",
  }).statement),
).join("\n");
assert.doesNotMatch(allEnglishApprovedStatements, /correction deadline.*after the relevant process is complete/i);
assert.doesNotMatch(allEnglishApprovedStatements, /online marketplace.*cheating complaint/i);
assert.doesNotMatch(allEnglishApprovedStatements, /examination authority.*buyer complaint/i);
assert.doesNotMatch(allEnglishApprovedStatements, /bank.*buyer complaint/i);
assert.doesNotMatch(allEnglishApprovedStatements, /bank.*cheating complaint/i);
assert.doesNotMatch(allEnglishApprovedStatements, /college.*buyer complaint/i);
assert.doesNotMatch(allEnglishApprovedStatements, /college.*automated fraud flag/i);

const expectedCorrectPositions: Readonly<Record<string, readonly number[]>> = Object.freeze({
  "SSC_RECENT_2X4:Easy": Object.freeze([0, 1]),
  "SSC_RECENT_2X4:Medium": Object.freeze([2, 3]),
  "BANKING_CLASSIC_2X5:Medium": Object.freeze([0, 1]),
  "BANKING_CLASSIC_2X5:Hard": Object.freeze([3, 4]),
  "BANKING_COMBO_3X5:Medium": Object.freeze([0, 1, 2, 3, 4]),
  "BANKING_COMBO_3X5:Hard": Object.freeze([0, 1, 2, 3, 4]),
  "BANKING_COMBO_4X5:Hard": Object.freeze([0, 1, 2, 3, 4]),
});

for (const [profile, difficulty] of PROFILE_DIFFICULTIES) {
  const profileMeta = ARG_CP007_EXAM_PROFILES[profile];
  const observedPositions = new Set<number>();
  for (const qlId of ARG_QL_IDS) {
    for (const locale of LOCALES) {
      for (let seed = 0; seed < 20; seed += 1) {
        const question = generateArgCp010RealPaperQuestion({ qlId, locale, seed, profile, difficulty });
        assert.equal(question.checkpointId, ARG_CP010_CHECKPOINT_ID);
        assert.equal(question.authority, ARG_CP010_AUTHORITY);
        assert.equal(question.arguments.length, profileMeta.argumentCount, `${profile}/${difficulty}: argument-count drift`);
        assert.equal(question.options.length, profileMeta.optionCount, `${profile}/${difficulty}: option-count drift`);
        assert.ok(question.correctIndex >= 0 && question.correctIndex < question.options.length);
        assert.equal(question.answer, question.options[question.correctIndex]);
        assert.equal(question.metadata.sourceRealPaperAuthority, "ARG_CP007_REAL_PAPER_PARITY_V2");
        assert.equal(question.metadata.historicalRealPaperFreezeAuthority, "ARG_CP008_REAL_PAPER_CLOSURE_V1");
        assert.equal(question.metadata.englishEditorialAuthority, ARG_CP009_ENGLISH_REMEDIATION_AUTHORITY);
        assert.equal(question.metadata.localizedEditorialAuthority, ARG_CP009_LOCALIZATION_AUTHORITY_V2);
        assert.equal(question.metadata.correlatedScenarioModel, "ARG_CP010_EXPLICIT_COMPATIBILITY_SET_V1");
        assert.equal(question.metadata.realPaperEditorialRemediation, true);
        assert.equal(question.metadata.reviewOnly, true);
        assert.equal(question.metadata.manualApprovalRequired, true);
        assert.equal(question.metadata.persistenceAllowed, false);
        assert.equal(question.metadata.questionBankWritable, false);
        assert.equal(question.metadata.testEligible, false);
        assert.equal(question.metadata.mockEligible, false);
        assert.equal(question.metadata.publicEligible, false);
        assert.equal(question.metadata.automaticStudentPublication, false);
        assert.equal(question.metadata.learnerRelease, "LOCKED");
        if (locale === "en-IN") observedPositions.add(question.correctIndex);
      }
    }
  }
  const key = `${profile}:${difficulty}`;
  assert.deepEqual([...observedPositions].sort((a, b) => a - b), [...expectedCorrectPositions[key]!], `${key}: answer-position coverage drift`);
  if (profile === "BANKING_CLASSIC_2X5") assert.equal(observedPositions.has(2), false, "Either I or II must remain a distractor");
}

for (const qlId of ARG_QL_IDS) {
  for (const locale of LOCALES) {
    for (const [profile, difficulty] of PROFILE_DIFFICULTIES) {
      for (const seed of [0, 1, 2, 3, 4, 19, 127]) {
        const first = generateArgCp010RealPaperQuestion({ qlId, locale, seed, profile, difficulty });
        const second = generateArgCp010RealPaperQuestion({ qlId, locale, seed, profile, difficulty });
        assert.deepEqual(first, second, `${locale}/${qlId}/${profile}/${difficulty}/${seed}: deterministic replay failed`);
      }
    }
  }
}

const batch = generateArgCp010RealPaperBatch({
  profile: "BANKING_COMBO_4X5",
  difficulty: "Hard",
  locale: "en-IN",
  seed: "CP010-BATCH-PROOF",
  count: 12,
});
assert.equal(batch.questions.length, 12);
assert.equal(batch.authority, ARG_CP010_AUTHORITY);
assert.equal(batch.checkpointId, ARG_CP010_CHECKPOINT_ID);
assert.equal(batch.generationContext.reviewOnly, true);
assert.equal(batch.generationContext.questionBankWritable, false);
assert.equal(batch.generationContext.mockTestEligible, false);
assert.equal(batch.generationContext.publiclyPublishable, false);
assert.equal(batch.generationContext.automaticStudentPublication, false);
assert.equal(batch.generationContext.learnerRelease, "LOCKED");

console.log("ARG-001 CP010 correlated real-paper remediation: PASS (6 QLs x 4 explicit compatibility scenarios x 3 locales; all four paper profiles preserved)");

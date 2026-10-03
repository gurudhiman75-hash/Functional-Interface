import assert from "node:assert/strict";
import { calculateDmAgeOnDate, evaluateDmDecision, rankDmCandidates } from "./decision-engine.ts";
import { generateDmQuestion, modesForDmDifficulty } from "./generator.ts";
import { DM_001_QL_REGISTRY, assertContinuousDmQlIds, dmQlIdsForCheckpoint } from "./ql-registry.ts";
import { DM_001_SCENARIO_LIBRARY, dmScenariosForCheckpoint } from "./scenario-library.ts";
import { DM_001_CHECKPOINT_IDS } from "./types.ts";

assertContinuousDmQlIds();
const legacyCheckpoints = DM_001_CHECKPOINT_IDS.slice(0, 10);
const legacyScenarios = DM_001_SCENARIO_LIBRARY.filter((scenario) => Number(scenario.checkpointId.slice(-3)) <= 10);
assert.equal(DM_001_QL_REGISTRY.filter((entry) => Number(entry.checkpointId.slice(-3)) <= 10).length, 30);
assert.equal(legacyScenarios.length, 250);
for (const checkpointId of legacyCheckpoints) {
  const scenarios = dmScenariosForCheckpoint(checkpointId);
  assert.equal(scenarios.length, 25, checkpointId + " scenario coverage");
  assert.equal(new Set(scenarios.map((scenario) => scenario.scenarioId)).size, 25);
  assert.equal(dmQlIdsForCheckpoint(checkpointId).length, 3);
  for (const scenario of scenarios) {
    assert.ok(scenario.baseConditions.length >= (checkpointId === "DM-CP-002" ? 5 : 2));
    if (checkpointId === "DM-CP-002") assert.ok(scenario.baseConditions.length <= 7);
  }
}

assert.equal(calculateDmAgeOnDate("2000-03-02", "2026-03-01"), 25);
assert.equal(calculateDmAgeOnDate("2000-03-01", "2026-03-01"), 26);
assert.equal(calculateDmAgeOnDate("2000-02-29", "2026-02-28"), 25);

const observedOutcomes = new Map<string, Set<string>>(legacyCheckpoints.map((id) => [id, new Set<string>()]));
for (const scenario of legacyScenarios) {
  for (const locale of ["en", "hi", "pa"] as const) {
    for (const difficulty of ["EASY", "MEDIUM", "HARD"] as const) {
      for (let seed = 0; seed < 12; seed += 1) {
        const mode = modesForDmDifficulty(scenario, difficulty, seed);
        const question = generateDmQuestion({ scenario, locale, seed, mode });
        assert.equal(question.difficulty, difficulty);
        observedOutcomes.get(scenario.checkpointId)!.add(question.outcome);
        for (const value of Object.values(question.candidate)) if (typeof value === "number") assert.ok(value >= 0, "candidate numeric values must remain plausible");
        assert.equal(question.options.length, 4);
        assert.equal(new Set(question.options).size, 4);
        if (question.answerMode === "RANKED_CANDIDATE_SET") {
          const ranked = rankDmCandidates(question.candidateGroup!, scenario);
          assert.deepEqual(question.selectedCandidates, ranked.selected.map((candidate) => candidate.name));
          assert.equal(question.options[question.correctIndex], question.selectedCandidates!.join(locale === "en" ? " and " : locale === "hi" ? " और " : " ਅਤੇ "));
          assert.match(question.stem, /Priority order|प्राथमिकता क्रम|ਤਰਜੀਹ ਦਾ ਕ੍ਰਮ/);
        } else assert.equal(question.options[question.correctIndex], {
          en: {
            SELECT: "Eligible under the stated rules", REJECT: "Not eligible under the stated rules", REFER_TO_MANAGER: "Refer the case to the Manager",
            REFER_TO_DIRECTOR: "Refer the case to the Director", REFER_TO_COMMITTEE: "Refer the case to the Review Committee",
            INFORMATION_REQUIRED: "Decision cannot be made; information is required",
          },
          hi: {
            SELECT: "दिए गए नियमों के अनुसार पात्र", REJECT: "दिए गए नियमों के अनुसार अपात्र", REFER_TO_MANAGER: "मामला प्रबंधक को भेजें",
            REFER_TO_DIRECTOR: "मामला निदेशक को भेजें", REFER_TO_COMMITTEE: "मामला समीक्षा समिति को भेजें",
            INFORMATION_REQUIRED: "निर्णय के लिए अतिरिक्त जानकारी आवश्यक है",
          },
          pa: {
            SELECT: "ਦਿੱਤੇ ਨਿਯਮਾਂ ਅਨੁਸਾਰ ਯੋਗ", REJECT: "ਦਿੱਤੇ ਨਿਯਮਾਂ ਅਨੁਸਾਰ ਅਯੋਗ", REFER_TO_MANAGER: "ਮਾਮਲਾ ਪ੍ਰਬੰਧਕ ਕੋਲ ਭੇਜੋ",
            REFER_TO_DIRECTOR: "ਮਾਮਲਾ ਡਾਇਰੈਕਟਰ ਕੋਲ ਭੇਜੋ", REFER_TO_COMMITTEE: "ਮਾਮਲਾ ਸਮੀਖਿਆ ਕਮੇਟੀ ਕੋਲ ਭੇਜੋ",
            INFORMATION_REQUIRED: "ਫੈਸਲੇ ਲਈ ਹੋਰ ਜਾਣਕਾਰੀ ਲੋੜੀਂਦੀ ਹੈ",
          },
        }[locale][question.outcome]);
        assert.equal(evaluateDmDecision(question.candidate, scenario).outcome, question.outcome);
        assert.ok(question.explanationRows.length === scenario.baseConditions.length);
        assert.ok(question.stem.includes(scenario.context[locale]));
        assert.doesNotMatch(question.stem + "\n" + question.explanation, /\.{2,}|।{2,}/, "generated text must not contain duplicated sentence punctuation");
        const repeat = generateDmQuestion({ scenario, locale, seed, mode });
        assert.deepEqual(repeat, question, "same scenario, locale and seed must be deterministic");
      }
    }
  }
}

for (const checkpointId of ["DM-CP-001", "DM-CP-002", "DM-CP-005"] as const) {
  const outcomes = observedOutcomes.get(checkpointId)!;
  for (const expected of ["SELECT", "REJECT", "INFORMATION_REQUIRED"]) assert.ok(outcomes.has(expected), checkpointId + " should cover " + expected);
}
for (const expected of ["SELECT", "REJECT", "INFORMATION_REQUIRED", "REFER_TO_MANAGER", "REFER_TO_COMMITTEE"]) assert.ok(observedOutcomes.get("DM-CP-003")!.has(expected), "DM-CP-003 should cover " + expected);
for (const expected of ["SELECT", "REJECT", "INFORMATION_REQUIRED", "REFER_TO_MANAGER", "REFER_TO_DIRECTOR", "REFER_TO_COMMITTEE"]) assert.ok(observedOutcomes.get("DM-CP-004")!.has(expected), "DM-CP-004 should cover " + expected);
for (const expected of ["SELECT", "REJECT", "INFORMATION_REQUIRED"]) assert.ok(observedOutcomes.get("DM-CP-006")!.has(expected), "DM-CP-006 should cover " + expected);
for (const expected of ["SELECT", "REJECT", "INFORMATION_REQUIRED"]) assert.ok(observedOutcomes.get("DM-CP-007")!.has(expected), "DM-CP-007 should cover " + expected);
for (const expected of ["SELECT", "REJECT", "INFORMATION_REQUIRED"]) assert.ok(observedOutcomes.get("DM-CP-008")!.has(expected), "DM-CP-008 should cover " + expected);
for (const expected of ["SELECT", "REFER_TO_COMMITTEE", "REJECT", "INFORMATION_REQUIRED"]) assert.ok(observedOutcomes.get("DM-CP-009")!.has(expected), "DM-CP-009 should cover " + expected);
assert.ok(DM_001_SCENARIO_LIBRARY.filter((scenario) => scenario.checkpointId === "DM-CP-010").every((scenario) => scenario.ranking?.priorityOrder.at(-1)?.field === "applicationOrder"));

const distinctEnglishContexts = new Set(DM_001_SCENARIO_LIBRARY.map((scenario) => scenario.context.en));
const domainMarkers = ["scholarship", "licence", "hostel", "certification", "admission", "grant", "benefit", "loan", "training", "fellowship", "accreditation", "promotion"];
assert.ok(domainMarkers.filter((marker) => [...distinctEnglishContexts].some((context) => context.toLowerCase().includes(marker))).length >= 10, "scenario library must span at least ten decision domains");
const recruitmentContexts = [...distinctEnglishContexts].filter((context) => /recruitment|appointment|vacanc(?:y|ies)/i.test(context));
assert.ok(recruitmentContexts.length <= Math.ceil(distinctEnglishContexts.size * 0.1), "recruitment contexts must remain a small minority");

const cp3 = dmScenariosForCheckpoint("DM-CP-003");
const cp4 = dmScenariosForCheckpoint("DM-CP-004");
assert.ok(cp3.some((scenario) => scenario.decisionRules.some((rule) => rule.outcome === "REFER_TO_MANAGER")));
assert.ok(cp3.some((scenario) => scenario.decisionRules.some((rule) => rule.outcome === "REFER_TO_COMMITTEE")));
assert.ok(cp4.some((scenario) => scenario.decisionRules.some((rule) => rule.outcome === "REFER_TO_DIRECTOR")));
assert.ok(cp4.some((scenario) => scenario.decisionRules.some((rule) => rule.outcome === "REFER_TO_COMMITTEE")));
console.log("DM-001 Waves 1–2 regression checks passed: 250 scenarios, 30 QLs, three locales, dependent rules and computed candidate rankings.");

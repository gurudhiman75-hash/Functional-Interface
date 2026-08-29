import assert from "node:assert/strict";
import { generateStcQuestion } from "./chapter-generator.ts";
import { generateStcFiveWayQuestion } from "./five-way-profile.ts";
import { STC_QL_IDS, type StcLocale } from "./types.ts";

const LOCALES: readonly StcLocale[] = ["en-IN", "hi-IN", "pa-IN"];

for (const qlId of STC_QL_IDS) {
  const scenarioIds = new Set<string>();
  const answerClasses = new Set<string>();
  const englishExplanations = new Set<string>();

  for (let seed = 0; seed < 4096; seed += 1) {
    const en = generateStcQuestion({ qlId, locale: "en-IN", seed });
    const hi = generateStcQuestion({ qlId, locale: "hi-IN", seed });
    const pa = generateStcQuestion({ qlId, locale: "pa-IN", seed });

    scenarioIds.add(en.scenarioId);
    answerClasses.add(en.answerClass);
    englishExplanations.add(en.explanation);

    for (const localized of [hi, pa]) {
      assert.equal(localized.qlId, en.qlId, `${qlId}/${seed}: QL parity drift`);
      assert.equal(localized.scenarioId, en.scenarioId, `${qlId}/${seed}: scenario parity drift`);
      assert.equal(localized.answerClass, en.answerClass, `${qlId}/${seed}: answer-class parity drift`);
      assert.equal(localized.correctIndex, en.correctIndex, `${qlId}/${seed}: answer-index parity drift`);
      assert.equal(localized.difficulty, en.difficulty, `${qlId}/${seed}: difficulty parity drift`);
    }
  }

  assert.ok(scenarioIds.size >= 8, `${qlId}: expected at least 8 distinct scenario authorities, got ${scenarioIds.size}`);
  assert.ok(answerClasses.has("ONLY_I"), `${qlId}: ONLY_I must be reachable`);
  assert.ok(answerClasses.has("ONLY_II"), `${qlId}: ONLY_II must be reachable`);
  assert.ok(answerClasses.has("NEITHER") || answerClasses.has("BOTH"), `${qlId}: answer-cardinality diversity is too thin`);
  assert.ok(englishExplanations.size >= 16, `${qlId}: explanation surface is too repetitive (${englishExplanations.size})`);
}

const fiveWayScenarioIds = new Set<string>();
const fiveWayExplanations = new Set<string>();
for (let index = 0; index < 9; index += 1) {
  const seed = index * 4;
  const en = generateStcFiveWayQuestion({ qlId: "STC-QL-002", locale: "en-IN", seed });
  assert.equal(en.answerClass, "EITHER", `five-way/${seed}: dedicated either-or authority must resolve to EITHER`);
  fiveWayScenarioIds.add(en.scenarioId);
  fiveWayExplanations.add(en.explanation);

  for (const locale of LOCALES.slice(1)) {
    const localized = generateStcFiveWayQuestion({ qlId: "STC-QL-002", locale, seed });
    assert.equal(localized.scenarioId, en.scenarioId, `five-way/${seed}/${locale}: scenario parity drift`);
    assert.equal(localized.answerClass, en.answerClass, `five-way/${seed}/${locale}: answer parity drift`);
    assert.equal(localized.correctIndex, en.correctIndex, `five-way/${seed}/${locale}: option-index parity drift`);
  }
}
assert.equal(fiveWayScenarioIds.size, 9, `five-way: expected all 9 dedicated authorities, got ${fiveWayScenarioIds.size}`);
assert.equal(fiveWayExplanations.size, 9, `five-way: explanations must be context-specific`);

console.log("STC-001 exam-realness diversity proof passed: >=8 authorities/QL, 9 five-way contexts, EN/HI/PA parity, explanation diversity.");

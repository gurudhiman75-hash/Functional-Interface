import assert from "node:assert/strict";
import { generateLpCp04PermanentBatch } from "./lp-cp04-permanent-freeze-v1.ts";
import { generateLpCp04LocalizedBatchV1, LP_CP04_HI_PA_LOCALIZATION_REVIEW_V1 } from "./lp-cp04-localization-v1.ts";

assert.deepEqual(LP_CP04_HI_PA_LOCALIZATION_REVIEW_V1.permanentQlIds, ["LP-QL-047"]);
assert.deepEqual(LP_CP04_HI_PA_LOCALIZATION_REVIEW_V1.supportedLanguages, ["hi", "pa"]);
assert.equal(LP_CP04_HI_PA_LOCALIZATION_REVIEW_V1.runtimeMode, "REVIEW_ONLY");
assert.equal(LP_CP04_HI_PA_LOCALIZATION_REVIEW_V1.questionBankWritable, false);
assert.equal(LP_CP04_HI_PA_LOCALIZATION_REVIEW_V1.testEligible, false);
assert.equal(LP_CP04_HI_PA_LOCALIZATION_REVIEW_V1.publiclyPublishable, false);

const englishLeakage = /\b(the|which|if|selected|assigned|group|committee|condition|original|remaining|must|true|person|team|panel)\b/iu;

for (const language of ["hi", "pa"] as const) {
  const seed = `lp-cp04-localization-v1-proof:${language}`;
  const english = generateLpCp04PermanentBatch(seed, 18);
  const localized = generateLpCp04LocalizedBatchV1(language, seed, 18);
  assert.equal(localized.length, english.length);
  const difficulties = new Map<string, number>();
  const topologies = new Set<string>();
  const answerSlots = [0, 0, 0, 0];

  for (let index = 0; index < localized.length; index += 1) {
    const source: any = english[index]!;
    const target = localized[index]!;
    const localizedSource: any = target.englishCaselet;
    const child = target.counterfactualChild;

    assert.equal(localizedSource.caseletId, source.caseletId);
    assert.equal(localizedSource.scenarioProfileId, source.scenarioProfileId);
    assert.equal(localizedSource.difficultyBand, source.difficultyBand);
    assert.deepEqual(localizedSource.clues, source.clues);
    assert.deepEqual(localizedSource.validStates, source.validStates);
    assert.equal(localizedSource.counterfactualChild.stem, source.counterfactualChild.stem);
    assert.deepEqual(localizedSource.counterfactualChild.options, source.counterfactualChild.options);
    assert.equal(localizedSource.counterfactualChild.correctIndex, source.counterfactualChild.correctIndex);
    assert.equal(localizedSource.counterfactualChild.answer, source.counterfactualChild.answer);

    assert.equal(target.caseletId, source.caseletId);
    assert.equal(target.difficultyBand, source.difficultyBand);
    assert.equal(child.difficultyBand, source.counterfactualChild.difficultyBand);
    assert.equal(child.qlId, "LP-QL-047");
    assert.equal(child.correctIndex, source.counterfactualChild.correctIndex);
    assert.equal(child.options.length, source.counterfactualChild.options.length);
    assert.equal(new Set(child.options).size, 4);
    assert.equal(child.answer, child.options[child.correctIndex]);
    assert.equal(target.learnerFacingClues.length, source.clues.length);
    assert.ok(child.explanation.lines.length >= 4);
    difficulties.set(target.difficultyBand, (difficulties.get(target.difficultyBand) ?? 0) + 1);
    topologies.add(target.parentTopology);
    answerSlots[child.correctIndex] += 1;

    const learnerText = [target.scenario, ...target.learnerFacingClues, child.stem, ...child.options, child.explanation.summary, ...child.explanation.lines].join("\n");
    assert.equal(englishLeakage.test(learnerText), false, `${language}:${target.caseletId}: English learner-facing leakage`);
    if (language === "hi") assert.match(learnerText, /[\u0900-\u097F]/u, `${target.caseletId}: Hindi script missing`);
    if (language === "pa") assert.match(learnerText, /[\u0A00-\u0A7F]/u, `${target.caseletId}: Punjabi script missing`);

    if (target.difficultyBand === "Hard") {
      assert.equal(target.parentTopology, "LP-004_COMMITTEE_SELECTION");
      assert.ok(source.clues.length >= 3);
      assert.ok(source.validStates.length >= 5);
    } else {
      assert.equal(target.parentTopology, "LP-001_GROUPING");
      assert.ok(source.scenarioProfileId);
    }
  }

  assert.deepEqual(difficulties, new Map([["Easy", 6], ["Medium", 6], ["Hard", 6]]));
  assert.deepEqual(topologies, new Set(["LP-001_GROUPING", "LP-004_COMMITTEE_SELECTION"]));
  assert.ok(answerSlots.every((count) => count >= 4), `${language}: answer slots too concentrated: ${answerSlots.join(",")}`);
}

console.log("LP-QL-047 Hindi/Punjabi localization V1 semantic parity passed across Easy/Medium/Hard; review-only gates remain closed.");

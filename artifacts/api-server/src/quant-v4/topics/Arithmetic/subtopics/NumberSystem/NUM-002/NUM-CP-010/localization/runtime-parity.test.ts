import assert from "node:assert/strict";

import {
  NUM_CP010_PERMANENT_QL_IDS,
  type NumCp010PermanentQlId,
} from "../permanent-allocation.ts";
import { generateNumCp010Permanent } from "../permanent-runtime.ts";
import { generateNumCp010LocalizedHumanReview } from "./runtime-human-review.ts";
import type { NumCp010LocalizedLanguage } from "./types.ts";

const languages: readonly NumCp010LocalizedLanguage[] = ["hi", "pa"];
const scriptByLanguage = {
  hi: /[\u0900-\u097F]/u,
  pa: /[\u0A00-\u0A7F]/u,
} as const;
const englishLeak = /\b(?:number|digit|find|value|possible|valid|check|original|reverse|place|units|tens|hundreds|total|sum|answer|greater|least|greatest)\b/iu;

let packages = 0;
let structuralParityChecks = 0;
let optionParityChecks = 0;
let languageChecks = 0;
let lifecycleChecks = 0;
const prototypeReachByLanguage = new Map<NumCp010LocalizedLanguage, Set<string>>();
for (const language of languages) prototypeReachByLanguage.set(language, new Set());

for (const qlId of NUM_CP010_PERMANENT_QL_IDS) {
  for (let seed = 1; seed <= 120; seed += 1) {
    const source = generateNumCp010Permanent(qlId as NumCp010PermanentQlId, seed);

    for (const language of languages) {
      const localized = generateNumCp010LocalizedHumanReview(qlId as NumCp010PermanentQlId, seed, language);
      const label = `${qlId}/${seed}/${language}`;

      assert.equal(localized.permanentQlId, source.permanentQlId, `${label}: QL drift`);
      assert.equal(localized.authorityId, source.authorityId, `${label}: authority drift`);
      assert.equal(localized.authorityLabel, source.authorityLabel, `${label}: authority label drift`);
      assert.equal(localized.temporaryPrototypeId, source.temporaryPrototypeId, `${label}: prototype drift`);
      assert.equal(localized.seed, source.seed, `${label}: seed drift`);
      assert.equal(localized.sourceSeed, source.sourceSeed, `${label}: source seed drift`);
      assert.equal(localized.difficulty, source.difficulty, `${label}: difficulty drift`);
      assert.equal(localized.answerSemantic, source.answerSemantic, `${label}: answer semantic drift`);
      assert.equal(localized.sourceAnswerSemantic, source.sourceAnswerSemantic, `${label}: source answer semantic drift`);
      assert.equal(localized.representation, source.representation, `${label}: representation drift`);
      assert.deepEqual(localized.hiddenState, source.hiddenState, `${label}: hidden mathematical state drift`);
      assert.equal(localized.mathematicalFingerprint, source.mathematicalFingerprint, `${label}: fingerprint drift`);
      assert.equal(localized.correctIndex, source.correctIndex, `${label}: correct-index drift`);
      structuralParityChecks += 1;

      assert.equal(localized.options.length, source.options.length, `${label}: option count drift`);
      localized.options.forEach((option, index) => {
        const sourceOption = source.options[index]!;
        assert.equal(option.isCorrect, sourceOption.isCorrect, `${label}: option correctness drift at ${index}`);
        assert.equal(option.misconceptionId, sourceOption.misconceptionId, `${label}: misconception mapping drift at ${index}`);
        if (source.temporaryPrototypeId !== "NUM-CP010-PROT-018") {
          assert.equal(option.value, sourceOption.value, `${label}: numeric/set option value drift at ${index}`);
        }
      });
      assert.equal(localized.options[localized.correctIndex]?.value, localized.canonicalAnswer, `${label}: localized correct option binding drift`);
      assert.equal(localized.canonicalAnswer, localized.verifierAnswer, `${label}: localized answer/verifier drift`);
      optionParityChecks += 1;

      const learnerText = [
        localized.stem,
        localized.explanation.coreConcept,
        localized.explanation.strategy,
        ...localized.explanation.steps,
        localized.explanation.finalAnswer,
      ].join(" ");
      assert.match(learnerText, scriptByLanguage[language], `${label}: expected native-script learner text`);
      assert.doesNotMatch(learnerText, englishLeak, `${label}: English learner-language leak`);
      assert.notEqual(localized.stem, source.stem, `${label}: stem was not localized`);
      assert.ok(localized.explanation.steps.length >= 2 && localized.explanation.steps.length <= 4, `${label}: localized explanation needs 2..4 steps`);
      assert.doesNotMatch(learnerText, /prototype|generator|hidden state|fingerprint|source ancestry|lifecycle/iu, `${label}: implementation vocabulary leak`);
      if (source.temporaryPrototypeId === "NUM-CP010-PROT-018") {
        assert.match(localized.canonicalAnswer, scriptByLanguage[language], `${label}: textual answer was not localized`);
        assert.ok(localized.options.every((option) => scriptByLanguage[language].test(option.value)), `${label}: textual options were not fully localized`);
      }
      languageChecks += 1;

      assert.equal(localized.localization.canonicalQuestionId, qlId, `${label}: localization canonical QL drift`);
      assert.equal(localized.localization.mathematicalStatePreserved, true, `${label}: math-preservation flag drift`);
      assert.equal(localized.localization.optionOrderPreserved, true, `${label}: option-order flag drift`);
      assert.equal(localized.localization.correctIndexPreserved, true, `${label}: correct-index flag drift`);
      assert.equal(localized.localization.misconceptionMappingPreserved, true, `${label}: misconception flag drift`);
      assert.equal(localized.localization.answerMeaningPreserved, true, `${label}: answer-meaning flag drift`);
      assert.equal(localized.lifecycle.reviewStatus, "MULTILINGUAL_REVIEW_CANDIDATE", `${label}: review status drift`);
      assert.equal(localized.lifecycle.localizationStatus, "HI_PA_REVIEW_CANDIDATE", `${label}: localization status drift`);
      assert.equal(localized.lifecycle.active, false, `${label}: active gate opened`);
      assert.equal(localized.lifecycle.questionStudioDiscoverable, false, `${label}: Question Studio gate opened`);
      assert.equal(localized.lifecycle.questionBankWritable, false, `${label}: Question Bank write gate opened`);
      assert.equal(localized.lifecycle.testEligible, false, `${label}: test gate opened`);
      assert.equal(localized.lifecycle.publiclyPublishable, false, `${label}: public gate opened`);
      lifecycleChecks += 1;

      prototypeReachByLanguage.get(language)!.add(localized.temporaryPrototypeId);
      packages += 1;
    }
  }
}

assert.equal(packages, 16 * 120 * 2, "Expected 3,840 localized review-candidate packages");
assert.equal(structuralParityChecks, packages);
assert.equal(optionParityChecks, packages);
assert.equal(languageChecks, packages);
assert.equal(lifecycleChecks, packages);
for (const language of languages) {
  assert.equal(prototypeReachByLanguage.get(language)!.size, 26, `${language}: expected all 26 source prototypes`);
}

console.log(JSON.stringify({
  status: "PASS_NUM_CP010_HI_PA_REVIEW_CANDIDATE",
  permanentAuthorities: NUM_CP010_PERMANENT_QL_IDS.length,
  languages,
  packages,
  structuralParityChecks,
  optionParityChecks,
  languageChecks,
  lifecycleChecks,
  prototypeReach: Object.fromEntries(languages.map((language) => [language, prototypeReachByLanguage.get(language)!.size])),
  downstreamActivations: 0,
}, null, 2));

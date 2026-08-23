import assert from "node:assert/strict";

import { NUM_CP010_PERMANENT_QL_IDS, type NumCp010PermanentQlId } from "../permanent-allocation.ts";
import { generateNumCp010Permanent } from "../permanent-runtime.ts";
import { generateNumCp010LocalizedHumanFinal } from "./runtime-human-final.ts";
import type { NumCp010LocalizedLanguage } from "./types.ts";

const languages: readonly NumCp010LocalizedLanguage[] = ["hi", "pa"];
const nativeScript = {
  hi: /[\u0900-\u097F]/u,
  pa: /[\u0A00-\u0A7F]/u,
} as const;

let packages = 0;
let frozenLifecycleChecks = 0;
let structuralParityChecks = 0;
let humanWordingChecks = 0;
const prototypeReach = new Map<NumCp010LocalizedLanguage, Set<string>>();
for (const language of languages) prototypeReach.set(language, new Set());

for (const qlId of NUM_CP010_PERMANENT_QL_IDS) {
  for (let seed = 1; seed <= 120; seed += 1) {
    const source = generateNumCp010Permanent(qlId as NumCp010PermanentQlId, seed);
    for (const language of languages) {
      const q = generateNumCp010LocalizedHumanFinal(qlId as NumCp010PermanentQlId, seed, language);
      const label = `${qlId}/${seed}/${language}`;
      const learnerText = [q.stem, q.explanation.coreConcept, q.explanation.strategy, ...q.explanation.steps, q.explanation.finalAnswer].join(" ");

      assert.equal(q.permanentQlId, source.permanentQlId, `${label}: QL drift`);
      assert.equal(q.authorityId, source.authorityId, `${label}: authority drift`);
      assert.equal(q.temporaryPrototypeId, source.temporaryPrototypeId, `${label}: prototype drift`);
      assert.equal(q.mathematicalFingerprint, source.mathematicalFingerprint, `${label}: fingerprint drift`);
      assert.deepEqual(q.hiddenState, source.hiddenState, `${label}: mathematical state drift`);
      assert.equal(q.correctIndex, source.correctIndex, `${label}: correct index drift`);
      assert.equal(q.options.length, source.options.length, `${label}: option count drift`);
      q.options.forEach((option, index) => {
        assert.equal(option.isCorrect, source.options[index]!.isCorrect, `${label}: correctness drift at option ${index}`);
        assert.equal(option.misconceptionId, source.options[index]!.misconceptionId, `${label}: misconception drift at option ${index}`);
      });
      assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer, `${label}: localized answer-option binding drift`);
      assert.equal(q.canonicalAnswer, q.verifierAnswer, `${label}: localized answer/verifier drift`);
      structuralParityChecks += 1;

      assert.match(learnerText, nativeScript[language], `${label}: native script missing`);
      assert.ok(q.explanation.steps.length >= 2 && q.explanation.steps.length <= 4, `${label}: explanation needs 2..4 steps`);
      assert.doesNotMatch(learnerText, /prototype|generator|hidden state|fingerprint|source ancestry|lifecycle/iu, `${label}: implementation vocabulary leak`);
      assert.doesNotMatch(learnerText, /सैकड़ा स्थान से \d+ बार/u, `${label}: stiff Hindi hundreds-place wording`);
      assert.doesNotMatch(learnerText, /ਸੈਂਕੜੇ ਦੇ ਸਥਾਨ ਤੋਂ \d+ ਵਾਰ/u, `${label}: stiff Punjabi hundreds-place wording`);
      assert.doesNotMatch(learnerText, /100-संख्या खंड/u, `${label}: stiff Hindi hundred-block wording`);
      assert.doesNotMatch(learnerText, /100-ਸੰਖਿਆ ਖੰਡ/u, `${label}: stiff Punjabi hundred-block wording`);
      if (q.temporaryPrototypeId === "NUM-CP010-PROT-018") {
        assert.match(q.stem, language === "hi" ? /^कुल कितनी दो-अंकीय संख्य/u : /^ਕੁੱਲ ਕਿੰਨੀਆਂ ਦੋ-ਅੰਕੀ ਸੰਖਿਆਵਾਂ/u, `${label}: multiplicity stem not human-refined`);
        assert.ok(q.options.every((option) => nativeScript[language].test(option.value)), `${label}: multiplicity options not localized`);
      }
      if (q.temporaryPrototypeId === "NUM-CP010-PROT-012") {
        const state = source.hiddenState as Readonly<Record<string, unknown>>;
        const expectedPattern = `${String(state.hundreds)}x${String(state.units)}`;
        assert.ok(q.stem.includes(expectedPattern), `${label}: chained-subtraction variable placed in wrong column`);
      }
      humanWordingChecks += 1;

      assert.equal(q.lifecycle.reviewStatus, "MULTILINGUAL_FROZEN", `${label}: not frozen`);
      assert.equal(q.lifecycle.localizationStatus, "HI_PA_FROZEN", `${label}: localization not frozen`);
      assert.equal(q.lifecycle.englishAuthorityStatus, "ENGLISH_FROZEN", `${label}: English authority drift`);
      assert.equal(q.lifecycle.questionBankStatus, "NOT_STORED", `${label}: Question Bank status drift`);
      assert.equal(q.lifecycle.testEligibility, "INELIGIBLE", `${label}: test eligibility drift`);
      assert.equal(q.lifecycle.active, false, `${label}: active gate opened`);
      assert.equal(q.lifecycle.questionStudioDiscoverable, false, `${label}: Question Studio gate opened`);
      assert.equal(q.lifecycle.questionBankWritable, false, `${label}: Question Bank write gate opened`);
      assert.equal(q.lifecycle.testEligible, false, `${label}: test gate opened`);
      assert.equal(q.lifecycle.publiclyPublishable, false, `${label}: public gate opened`);
      frozenLifecycleChecks += 1;

      prototypeReach.get(language)!.add(q.temporaryPrototypeId);
      packages += 1;
    }
  }
}

assert.equal(packages, 16 * 120 * 2, "Expected 3,840 frozen localized packages");
assert.equal(structuralParityChecks, packages);
assert.equal(humanWordingChecks, packages);
assert.equal(frozenLifecycleChecks, packages);
for (const language of languages) assert.equal(prototypeReach.get(language)!.size, 26, `${language}: expected all 26 prototypes`);

console.log(JSON.stringify({
  status: "PASS_NUM_CP010_HI_PA_MULTILINGUAL_FROZEN",
  permanentAuthorities: NUM_CP010_PERMANENT_QL_IDS.length,
  languages,
  packages,
  structuralParityChecks,
  humanWordingChecks,
  frozenLifecycleChecks,
  prototypeReach: Object.fromEntries(languages.map((language) => [language, prototypeReach.get(language)!.size])),
  downstreamActivations: 0,
}, null, 2));

import assert from "node:assert/strict";

import { NUM_CP011_PERMANENT_QL_IDS, type NumCp011PermanentQlId } from "../permanent-allocation.ts";
import { generateNumCp011Permanent } from "../permanent-runtime.ts";
import { generateNumCp011Localized } from "./runtime.ts";
import type { NumCp011LocalizedLanguage } from "./types.ts";

const languages: readonly NumCp011LocalizedLanguage[] = ["hi", "pa"];
const scriptByLanguage = {
  hi: /[\u0900-\u097F]/u,
  pa: /[\u0A00-\u0A7F]/u,
} as const;

function localizedTextAnswer(value: string, language: NumCp011LocalizedLanguage): string {
  if (value !== "No positive integer n") return value;
  return language === "hi" ? "कोई धनात्मक पूर्णांक n नहीं" : "ਕੋਈ ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ n ਨਹੀਂ";
}

let packages = 0;
let structuralParityChecks = 0;
let optionParityChecks = 0;
let languageChecks = 0;
let lifecycleChecks = 0;
const prototypeReach = new Map<NumCp011LocalizedLanguage, Set<string>>();
for (const language of languages) prototypeReach.set(language, new Set());

for (const qlId of NUM_CP011_PERMANENT_QL_IDS) {
  for (let seed = 1; seed <= 120; seed += 1) {
    const source = generateNumCp011Permanent(qlId as NumCp011PermanentQlId, seed);

    for (const language of languages) {
      const q = generateNumCp011Localized(qlId as NumCp011PermanentQlId, seed, language);
      const label = `${qlId}/${seed}/${language}`;

      assert.equal(q.packageId, source.packageId, `${label}: package drift`);
      assert.equal(q.checkpointId, source.checkpointId, `${label}: checkpoint drift`);
      assert.equal(q.permanentQlId, source.permanentQlId, `${label}: QL drift`);
      assert.equal(q.authorityId, source.authorityId, `${label}: authority drift`);
      assert.equal(q.authorityLabel, source.authorityLabel, `${label}: authority label drift`);
      assert.equal(q.temporaryPrototypeId, source.temporaryPrototypeId, `${label}: prototype drift`);
      assert.equal(q.seed, source.seed, `${label}: seed drift`);
      assert.equal(q.sourceSeed, source.sourceSeed, `${label}: source seed drift`);
      assert.equal(q.difficulty, source.difficulty, `${label}: difficulty drift`);
      assert.equal(q.answerSemantic, source.answerSemantic, `${label}: answer semantic drift`);
      assert.equal(q.sourceAnswerSemantic, source.sourceAnswerSemantic, `${label}: source answer semantic drift`);
      assert.equal(q.representation, source.representation, `${label}: representation drift`);
      assert.deepEqual(q.hiddenState, source.hiddenState, `${label}: hidden state drift`);
      assert.equal(q.mathematicalFingerprint, source.mathematicalFingerprint, `${label}: fingerprint drift`);
      assert.equal(q.correctIndex, source.correctIndex, `${label}: correct index drift`);
      assert.equal(q.canonicalAnswer, source.canonicalAnswer, `${label}: canonical answer drift`);
      assert.equal(q.verifierAnswer, source.verifierAnswer, `${label}: verifier answer drift`);
      structuralParityChecks += 1;

      assert.equal(q.options.length, source.options.length, `${label}: option count drift`);
      q.options.forEach((option, index) => {
        const original = source.options[index]!;
        assert.equal(option.isCorrect, original.isCorrect, `${label}: correctness drift at option ${index}`);
        assert.equal(option.misconceptionId, original.misconceptionId, `${label}: misconception drift at option ${index}`);
        assert.equal(option.value, localizedTextAnswer(original.value, language), `${label}: option meaning drift at ${index}`);
      });
      assert.equal(q.options[q.correctIndex]?.value, localizedTextAnswer(source.canonicalAnswer, language), `${label}: localized correct option binding drift`);
      optionParityChecks += 1;

      assert.equal(q.locale, language === "hi" ? "hi-IN" : "pa-IN", `${label}: locale drift`);
      const learnerText = [q.stem, q.explanation.coreConcept, q.explanation.strategy, ...q.explanation.steps].join(" ");
      assert.match(learnerText, scriptByLanguage[language], `${label}: native script missing`);
      assert.notEqual(q.stem, source.stem, `${label}: stem was not localized`);
      assert.ok(q.explanation.steps.length >= 2 && q.explanation.steps.length <= 4, `${label}: explanation step count outside 2..4`);
      assert.doesNotMatch(learnerText, /prototype|generator|hidden state|fingerprint|source ancestry|lifecycle/iu, `${label}: implementation vocabulary leak`);
      languageChecks += 1;

      assert.equal(q.lifecycle.maturity, "PERMANENT_AUTHORITY", `${label}: maturity drift`);
      assert.equal(q.lifecycle.reviewStatus, "MULTILINGUAL_FROZEN", `${label}: multilingual status drift`);
      assert.equal(q.lifecycle.questionBankStatus, "NOT_STORED", `${label}: bank status drift`);
      assert.equal(q.lifecycle.testEligibility, "INELIGIBLE", `${label}: eligibility status drift`);
      assert.equal(q.lifecycle.active, false, `${label}: active gate opened`);
      assert.equal(q.lifecycle.questionStudioDiscoverable, false, `${label}: Question Studio gate opened`);
      assert.equal(q.lifecycle.questionBankWritable, false, `${label}: bank write gate opened`);
      assert.equal(q.lifecycle.testEligible, false, `${label}: test gate opened`);
      assert.equal(q.lifecycle.publiclyPublishable, false, `${label}: public gate opened`);
      lifecycleChecks += 1;

      prototypeReach.get(language)!.add(q.temporaryPrototypeId);
      packages += 1;
    }
  }
}

assert.equal(packages, 13 * 120 * 2, "Expected 3,120 localized packages");
assert.equal(structuralParityChecks, packages);
assert.equal(optionParityChecks, packages);
assert.equal(languageChecks, packages);
assert.equal(lifecycleChecks, packages);
for (const language of languages) assert.equal(prototypeReach.get(language)!.size, 13, `${language}: prototype reach drift`);

console.log(JSON.stringify({
  status: "PASS_NUM_CP011_HI_PA_PARITY",
  permanentAuthorities: NUM_CP011_PERMANENT_QL_IDS.length,
  languages,
  packages,
  structuralParityChecks,
  optionParityChecks,
  languageChecks,
  lifecycleChecks,
  prototypeReach: Object.fromEntries(languages.map((language) => [language, prototypeReach.get(language)!.size])),
  downstreamActivations: 0,
}, null, 2));

import assert from "node:assert/strict";
import type { SylLocale } from "../foundation/types";
import { generateBankingPossibilityEditorialCandidate } from "./banking-possibility-editorial-candidate";
import { generateBankingPossibilityEditorialFinalCandidate } from "./banking-possibility-editorial-final-candidate";

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
let records = 0;
let changedLines = 0;
let naturalThreeStatementReferences = 0;

for (let seed = 0; seed < 80; seed += 1) {
  for (const locale of locales) {
    const base = generateBankingPossibilityEditorialCandidate(seed, locale);
    const final = generateBankingPossibilityEditorialFinalCandidate(seed, locale);
    records += 1;

    assert.deepEqual(final.statements, base.statements);
    assert.deepEqual(final.conclusions, base.conclusions);
    assert.deepEqual(final.options, base.options);
    assert.equal(final.correctIndex, base.correctIndex);
    assert.equal(final.semanticAnswer, base.semanticAnswer);
    assert.deepEqual(final.diagram, base.diagram);
    assert.deepEqual(final.metadata, base.metadata);

    final.explanation.forEach((line, index) => {
      if (line !== base.explanation[index]) changedLines += 1;
      assert.ok(line.startsWith(index === 0 ? "I:" : "II:"));
      if (locale === "en-IN") {
        assert.doesNotMatch(line, /Therefore[^.]*\. Therefore/u);
        assert.doesNotMatch(line, /an ×/u);
        assert.doesNotMatch(line, /\.\s+[a-z]/u);
        assert.doesNotMatch(line, /Statements 1 and 2 and 3/u);
        if (line.includes("Statements 1, 2 and 3")) naturalThreeStatementReferences += 1;
      } else if (locale === "hi-IN") {
        assert.doesNotMatch(line, /containment/u);
        assert.doesNotMatch(line, /इसलिए[^।]*। इसलिए निष्कर्ष/u);
        assert.doesNotMatch(line, /कथन 1 और 2 और 3/u);
        if (line.includes("कथन 1, 2 और 3")) naturalThreeStatementReferences += 1;
      } else {
        assert.doesNotMatch(line, /containment/u);
        assert.doesNotMatch(line, /ਇਸ ਲਈ[^।]*। ਇਸ ਲਈ ਨਤੀਜਾ/u);
        assert.doesNotMatch(line, /ਕਥਨ 1 ਅਤੇ 2 ਅਤੇ 3/u);
        if (line.includes("ਕਥਨ 1, 2 ਅਤੇ 3")) naturalThreeStatementReferences += 1;
      }
    });
  }
}

assert.equal(records, 240);
assert.ok(changedLines > 0);
assert.ok(naturalThreeStatementReferences > 0);
console.log(JSON.stringify({
  status: "PASS_SYL_001_BANKING_POSSIBILITY_EDITORIAL_FINAL_CANDIDATE",
  records,
  changedLines,
  naturalThreeStatementReferences,
  contract: {
    semanticsUnchanged: true,
    diagramsUnchanged: true,
    repeatedThereforeRemoved: true,
    awkwardAnWitnessRemoved: true,
    localizedContainmentEnglishRemoved: true,
    naturalThreeStatementEnumeration: true,
    registrationChanged: false,
    deliveryActivationChanged: false,
  },
}, null, 2));